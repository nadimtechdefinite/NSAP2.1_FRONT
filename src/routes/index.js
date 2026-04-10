import { useRoutes } from 'react-router-dom';
import MainRoutes from './MainRoutes';
import LoginRoutes from './LoginRoutes';
import { checkValidToken } from 'utils/storageUtils';
import HomeRoutes from './HomeRoutes';
import { Navigate } from 'react-router-dom';
export default function ThemeRoutes() {
  const isAuthenticated = checkValidToken();
  const routes = [
    isAuthenticated ? MainRoutes : LoginRoutes,
    HomeRoutes,
    // Route to redirect to login page if not authenticated and accessing /login
    isAuthenticated ? { path: '*', element: <Navigate to="/dashboard/default" /> } : <Navigate to="/home" />,
    { path: '*', element: <Navigate to="/home" /> }
  ];
  return useRoutes(routes);
}
