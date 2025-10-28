import Button from './Button';
import { useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContextProvider';

const Header = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  }

  return (
    <div className='bg-gray-900 p-2'>
      <div className='flex items-center justify-around h-18'>
        <p className='font-extrabold text-3xl text-white'>TinyUrl</p>
        {
          !user ? (
            <div className='flex gap-2 items-center'>
              <Button onClick={() => navigate('/login')} btnText='Login' />
              <Button onClick={() => navigate('/register')} btnText='Register' />
            </div>
          ) : 
          <Button onClick={handleLogout} btnText='Logout'/>
        }
      </div>
    </div>
  )
}

export default Header;
