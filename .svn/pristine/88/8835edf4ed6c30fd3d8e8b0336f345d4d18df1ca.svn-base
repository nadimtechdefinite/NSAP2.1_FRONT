import React from 'react';
import Button from '@mui/material/Button';
import ArrowBack from '@mui/icons-material/ArrowBack';
import { Box } from '@mui/material';
import AnimateButton from 'ui-component/extended/AnimateButton';
import { useNavigate } from 'react-router-dom';
const BackButton = ({ navigateTo, buttonValue }) => {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate(navigateTo);
  };
  return (
    <Box sx={{ mt: 1 }}>
      <AnimateButton>
        <Button
          onClick={handleClick}
          variant="contained"
          fullWidth
          size="small"
          color="primary"
          style={{ float: 'right' }}
          startIcon={<ArrowBack />}
        >
          {buttonValue}
        </Button>
      </AnimateButton>
    </Box>
  );
};

export default BackButton;
