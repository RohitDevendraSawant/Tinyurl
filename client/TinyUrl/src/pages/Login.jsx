import React, { useContext, useState } from 'react';
import Button from '../components/Button';
import { useNavigate } from 'react-router';
import { useAuth } from '../context/authContextProvider';

const Login = () => {
  const navigate = useNavigate();

  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError('Please fill in all fields.')
      return;
    }

    setError('')
    setLoading(true)

    try {
      const res = await login({email, password});
      
      if(res.success){
        const accessToken = res?.data?.accessToken;
        localStorage.setItem('accessToken', accessToken);        
        navigate("/");
      }
      else if(res.statusCode === 429){
        setError(res.message);
      }
      else{
        setError('Invalid Credentials');
        setEmail('');
        setPassword('');
        setTimeout(() => {
          setError(false);
        }, 1000);
      }


    } catch (err) {
      console.log(err);
      
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='flex items-center justify-center min-h-[calc(100vh-8rem)] bg-gray-900'>
      <div className='w-11/12 sm:w-8/12 md:w-4/12 lg:w-3/12 bg-gray-800 p-8 rounded-xl shadow-md'>
        <p className='text-3xl font-bold text-center mb-8 text-white'>Login</p>

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

          {error && <p className='text-red-500 text-sm text-center -mt-3'>{error}</p>}

          <Button
            btnText={loading ? 'Logging in...' : 'Login'}
            disabled={!email || !password || loading}
            className={`${
              (!email || !password || loading) ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          />
        </form>
      </div>
    </div>
  )
}

export default Login
