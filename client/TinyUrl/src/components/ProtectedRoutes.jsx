import { Navigate, Outlet } from "react-router";

const ProtectedRoutes = () => {
  const accessToken = localStorage.getItem('accessToken');
  if (!accessToken) return <Navigate to="/login" replace />;

  return <Outlet />;
};

export default ProtectedRoutes;
