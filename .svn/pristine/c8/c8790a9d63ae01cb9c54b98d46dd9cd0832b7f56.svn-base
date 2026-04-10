import React from 'react';
import { Box, Typography, Link } from '@mui/material';
import { keyframes } from '@emotion/react';

// Define the scrolling animation
const scroll = keyframes`
  0% { transform: translateX(50%); }
  100% { transform: translateX(-70%); }
`;

const Marquee = () => {
  return (
    <Box
      sx={{
        color: 'primary.main',
        overflow: 'hidden',
        fontSize: 'initial',
        whiteSpace: 'nowrap',
        py: 0
      }}
    >
      <Typography
        component="div"
        sx={{
          display: 'inline-block',
          animation: `${scroll} 10s linear infinite`,
          lineHeight: 1,
          '&:hover': {
            animationPlayState: 'paused'
          },
          fontSize: '1rem'
        }}
      >
        <strong>Note:</strong> For Technical support contact us at NSAP-PPS Toll Free Helpline No. <strong>1800-111-555</strong>{' '}
        <Link href="https://servicedesk.nic.in" target="_blank" sx={{ color: 'black' }}>
          https://servicedesk.nic.in
        </Link>
      </Typography>
    </Box>
  );
};

export default Marquee;
