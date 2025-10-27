const { default: mongoose, mongo, Mongoose } = require("mongoose");
const Url = require("../db/mongoDb/models/Url.model");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const { getShortUrl } = require("../utils/helper");
const UrlAnalytics = require("../db/mongoDb/models/UrlAnalytics.model");

const createShortUrl = async (req, res, next) => {
    try {
        const { originalUrl } = req.body;

        if (!originalUrl?.trim()) {
            throw new ApiError(400, 'Original URL is required');
        }

        const userUrl = await Url.findOne({ originalUrl, created_by: req.user._id }, { key: 1, _id: 0 }).lean();

        if (userUrl) {
            const shortUrl = getShortUrl(userUrl.key);

            return res
                .status(200)
                .json(new ApiResponse(200, 'Short URL already exists', { shortUrl }));
        }

        await Url.create({
            originalUrl,
            created_by: req.user._id
        });

        const urlKey = await Url.findOne({ originalUrl, created_by: req.user._id }).select({ key: 1, _id: 0 }).lean();

        const shortUrl = getShortUrl(urlKey.key);

        return res
            .status(201)
            .json(new ApiResponse(201, 'Short URL created successfully', { shortUrl }));
    } catch (error) {
        next(error);
    }
}

const redirectToUrl = async (req, res, next) => {
    try {
        const { key } = req.params;
        const user_ip = req.ip;
        const user_agent = req.headers?.['user-agent'];

        const urlDetails = await Url.findOne({ key });

        if (!urlDetails) {
            throw new ApiError(404, "Url details not found");
        }

        await UrlAnalytics.create({
            urlRef: urlDetails._id,
            key,
            originalUrl: urlDetails.originalUrl,
            user_ip,
            user_agent
        })

        res.redirect(urlDetails.originalUrl);
    } catch (error) {
        next(error)
    }
}

const getUserUrls = async (req, res, next) => {
    try {
        const userId = req.user?._id;
        const { limit = 10, skip = 0, search = '' } = req.body;

        if (!userId) {
            throw new ApiError(400, "No valid userId found");
        }

        const findQuery = {
            created_by: new mongoose.Types.ObjectId(userId)
        }

        if (search.trim()?.length) {
            findQuery.originalUrl = { $regex: search, $options: "i" }
        }

        const [urls, totalCount] = await Promise.all([
            Url.aggregate([
                {
                    $match: findQuery
                },
                {
                    $lookup: {
                        from: "urlanalytics",
                        localField: "_id",
                        foreignField: "urlRef",
                        as: "analytics"
                    }
                },
                {
                    $addFields: {
                        uniqueClicks: {
                            $size: {
                                $setUnion: ["$analytics.user_ip", []] 
                            }
                        }
                    }
                },
                {
                    $project: {
                        _id: 1,
                        key: 1,
                        originalUrl: 1,
                        uniqueClicks: 1,
                        totalClicks: { $size: "$analytics" },
                        createdAt: 1
                    }
                },
                { $sort: { createdAt: -1 } },
                { $skip: skip },
                { $limit: limit },
            ]),

            Url.countDocuments({ created_by: userId }),
        ]);

        urls.map((url) => url.shortUrl = getShortUrl(url.key));
        return res.status(200).json(new ApiResponse(200, "Urls fetching success", { urls, totalCount }));

    } catch (error) {
        next(error)
    }
}

const deleteUrl = async (req, res, next) => {
    try {
        const created_by = req.user?._id;
        const { urlId } = req.params;

        const url = await Url.findOne({created_by, _id: mongoose.Types.ObjectId(urlId)});

        if(!url){
            throw new ApiError(404, "Url not found");
        }

        await Url.deleteOne({_id: mongoose.Types.ObjectId(urlId)});

        return res.status(201).json(new ApiResponse(201, "Url deleted"));
    } catch (error) {
        next(error);
    }
}

module.exports = {
    createShortUrl,
    redirectToUrl,
    getUserUrls,
    deleteUrl,
};