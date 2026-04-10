// Custom hook for handling authentication and redirection
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { checkValidToken } from 'utils/storageUtils';
const useJwtAuthentication = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const isAuthenticated = checkValidToken();
    if (!isAuthenticated) {
      navigate('/home');
    }
  }, [navigate]);
  return {};
};

export default useJwtAuthentication;
