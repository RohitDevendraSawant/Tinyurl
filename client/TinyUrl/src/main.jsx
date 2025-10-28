import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { createBrowserRouter, RouterProvider } from 'react-router';
import Login from './pages/Login.jsx';
import ProtectedRoutes from './components/ProtectedRoutes.jsx';
import Home from './pages/Home.jsx';
import Register from './pages/Register.jsx';
import AuthContextProvider from './context/authContextProvider.jsx';
import BackendCheck from './components/BackendCheck.jsx';

const appRouter = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '/login',
        element: <Login />
      },
      {
        path: '/register',
        element: <Register />
      },
      {
        path: '/',
        element: <ProtectedRoutes />,
        children: [
          {
            path: '/',
            element: <Home />
          }
        ]
      }
    ]
  }
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthContextProvider>
      <BackendCheck> 
        <RouterProvider router={appRouter} />
      </BackendCheck>
    </AuthContextProvider>
  </StrictMode>,
)
