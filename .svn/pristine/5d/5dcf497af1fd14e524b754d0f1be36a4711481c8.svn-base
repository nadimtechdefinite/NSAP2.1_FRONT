import React from 'react';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { styled } from '@mui/system';

const ArrowButton = styled('div')({
  fontSize: '30px',
  borderRadius: '50%',
  width: '50px',
  height: '50px',
  lineHeight: '50px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: '#fff',
  background: '#e7e7e7',
  fontWeight: 'normal',
  textAlign: 'center',
  transition: 'all 0.5s ease-out',
  '&:hover': {
    background: '#007bff', // Blue background on hover
    color: '#fff' // White color on hover
  },
  '& svg': {
    fontSize: '24px' // Icon size
  }
});

const PrevArrow = (props) => {
  const { className, style, onClick } = props;
  return (
    <ArrowButton className={className} style={{ ...style, left: '10px' }} onClick={onClick}>
      <ArrowBackIosIcon />
    </ArrowButton>
  );
};

const NextArrow = (props) => {
  const { className, style, onClick } = props;
  return (
    <ArrowButton className={className} style={{ ...style, right: '10px' }} onClick={onClick}>
      <ArrowForwardIosIcon />
    </ArrowButton>
  );
};

export { PrevArrow, NextArrow };
