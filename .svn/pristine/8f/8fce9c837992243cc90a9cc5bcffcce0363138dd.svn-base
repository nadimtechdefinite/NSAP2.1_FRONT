import React from 'react';
import Button from '@mui/material/Button';
import ArrowBack from '@mui/icons-material/ArrowBack';
import { Box } from '@mui/material';
import AnimateButton from 'ui-component/extended/AnimateButton';
import { useNavigate } from 'react-router-dom';
const RedirectToHomeButton = () => {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate('/home');
  };
  return (
    <Box sx={{ mt: 1 }}>
      <AnimateButton>
        <Button onClick={handleClick} variant="contained" fullWidth size="large" color="primary" startIcon={<ArrowBack />}>
          Back to Home
        </Button>
      </AnimateButton>
    </Box>
  );
};

export default RedirectToHomeButton;
