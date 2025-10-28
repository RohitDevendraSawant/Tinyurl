const { cookieOptions } = require("../constants");
const User = require("../db/mongoDb/models/User.model");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const { generateAccessToken, generateRefreshToken } = require("../utils/helper");
const jwt = require('jsonwebtoken');

const register = async (req, res, next) => {
    try {
        console.log("Registering user with data:", req.body);
        const { email, password } = req.body;

        if(!email?.trim() || !password?.trim()) {
            throw new ApiError(400, 'All fields are required');
        }

        const userExist = await User.findOne({ email }).select({ email: 1, _id: 0}).lean();

        if(userExist) {
            throw new ApiError(409, 'User already exists');
        }

        if(password.length < 8) {
            throw new ApiError(400, 'Password must be at least 8 characters long');
        }

        await User.create({ email, password });

       return res.status(201).json(new ApiResponse(201, 'User registered successfully'));
    } catch (error) {
        next(error);
    }
}

const login = async (req, res,next) => {
    try {
        const { email, password } = req.body;

        if(!email?.trim() || !password?.trim()) {
            throw new ApiError(400, 'All fields are required');
        }

        const user = await User.findOne({ email });

        if(!user) {
            throw new ApiError(404, 'User not found');
        }

        const isPasswordValid = await user.isPasswordMatch(password);

        if(!isPasswordValid) {
            throw new ApiError(401, 'Invalid password');
        }

        const accessToken = generateAccessToken({ userId: user._id, email: user.email });
        const refreshToken = generateRefreshToken({ userId: user._id });

        return res.status(200)
        .cookie('accessToken', accessToken, cookieOptions)
        .cookie('refreshToken', refreshToken, cookieOptions)
        .json(new ApiResponse(201, 'User login successfully', { accessToken, refreshToken }));
    } catch (error) {
        return next(error);
    }
}


const verifyUser = async (req, res, next) => {
    try {
        const accessToken = req.cookies.accessToken || req.headers.authorization?.split(' ')[1];
        if (!accessToken) return res.status(200).json(new ApiResponse(200, "User authentication status", { authenticated: false }));

        const decoded = await jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);

        return res.status(200).json(new ApiResponse(200, 'User Authentication status', { authenticated: true, user: decoded }));
    } catch (error) {
        next(error);
    }
}

const logout = async (req, res, next) => {
    try {
        const userId = req.user?.id;

        await User.findByIdAndUpdate(userId, { $unset: { refreshToken: 1 } });

        return res
            .status(200)
            .clearCookie("accessToken", cookieOptions)
            .clearCookie("refreshToken", cookieOptions)
            .json(new ApiResponse(200, {}, "User logged Out"))
    } catch (error) {
        next(error);
    }
}


module.exports = {
    register,
    login,
    verifyUser,
    logout
}