import React, { useContext } from 'react'
import Button from '../components/Button'
import { useState } from 'react'
import { useNavigate } from 'react-router'
import { useAuth } from '../context/authContextProvider'

const Register = () => {
    const navigate = useNavigate();

    const { register } = useAuth();

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email?.trim()?.length || !password?.trim()?.length || !confirmPassword?.trim()?.length) {
            setError("Please fill correct data.");
            setTimeout(() => {
                setError(false);
            }, 1000);
            return;
        }

        if (password != confirmPassword) {
            setError("Passwords not matching");
            setTimeout(() => {
                setError(false);
            }, 1000);
            return;
        }

        setError(false);
        setLoading(true);

        try {
            const res = await register({ email, password, confirmPassword });
            
            if (res.success) {
                navigate('/login');
            }
            else if (res.statusCode === 409) {
                setError(res.message);
            }
            else {
                setError("Something went wronng");
            }
        } catch (error) {
            setError(error);
        }
        finally {
            setLoading(false);
            setTimeout(() => {
                setError(false);
            }, 1000);
        }
    }
    return (
        <div className='flex grow items-center justify-center bg-gray-900'>
            <div className='w-11/12 sm:w-8/12 md:w-4/12 lg:w-3/12 bg-gray-800 p-8 rounded-xl shadow-md'>
                <p className='text-3xl font-bold text-center mb-8 text-white'>Register</p>

                <form className='flex flex-col gap-6' onSubmit={handleSubmit}>
                    <input
                        className='border-2 p-3 rounded-lg outline-none bg-gray-900 text-white placeholder-gray-400 transition-colors duration-200 border-gray-600 focus:border-purple-600'
                        type='email'
                        placeholder='abc@test.com'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <input
                        className='border-2 p-3 rounded-lg outline-none bg-gray-900 text-white placeholder-gray-400 transition-colors duration-200 border-gray-600 focus:border-purple-600'
                        type='password'
                        placeholder='••••••••'
                        minLength={8}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <input
                        className='border-2 p-3 rounded-lg outline-none bg-gray-900 text-white placeholder-gray-400 transition-colors duration-200 border-gray-600 focus:border-purple-600'
                        type='password'
                        placeholder='••••••••'
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />

                    {error && <p className='text-red-500 text-sm text-center -mt-3'>{error}</p>}

                    <Button
                        className={!email || !password || !confirmPassword ?
                            'opacity-50 cursor-not-allowed' : ''
                        }
                        btnText='Register'
                    />
                </form>
            </div>
        </div>
    )
}

export default Register
