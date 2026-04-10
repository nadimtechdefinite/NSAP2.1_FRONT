import React from 'react';
import { styled } from '@mui/system';
import HomePageLogo from 'assets/images/logo-nsap.svg';

// Define the styles with media queries
const Img = styled('img')({
  '@media (max-width: 768px)': {
    maxWidth: '85%',
    marginBottom: '10px'
  }
});

// ==============================|| LOGO SVG ||============================== //

const Logo = () => {
  return <Img src={HomePageLogo} alt="Logo" />;
};

export default Logo;
