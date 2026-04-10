import React from 'react';
import { Container, Grid, Typography, Box, Link } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import PublicIcon from '@mui/icons-material/Public';
import './ContactUs.css';
const HomePageSectionContactUs = () => {
  return (
    <Container style={{ backgroundColor: 'white' }}>
      <Box textAlign="center" mt={4}>
        <Typography
          variant="h1"
          gutterBottom
          sx={{
            position: 'relative',
            display: 'inline-block',
            '&::after': {
              content: '""',
              display: 'block',
              width: '50%',
              margin: '0 auto',
              borderBottom: '2px solid #4ac4f3',
              position: 'absolute',
              bottom: '-8px',
              left: '25%'
            }
          }}
        >
          Contact Us
        </Typography>
      </Box>
      <Grid container spacing={4} justifyContent="center">
        <Grid item xs={12} md={6}>
          <Box display="flex" alignItems="center" justifyContent="center" mb={2}>
            <LocationOnIcon fontSize="large" color="primary" />
            <Typography variant="h2" ml={1}>
              Address
            </Typography>
          </Box>
          <Box textAlign="center">
            <Typography variant="h4" component="div" mb={1}>
              Department of Rural Development
            </Typography>
            <Typography variant="h4" component="div" mb={1}>
              National Social Assistance Programme Division
            </Typography>
            <Typography variant="h5">
              Krishi Bhawan, Dr. Rajendra Prasad Marg,
              <br />
              New Delhi - 110114
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12} md={6}>
          <Box textAlign="center">
            <Box display="flex" alignItems="center" justifyContent="center" mb={1}>
              <PhoneIcon fontSize="large" color="primary" />
              <Typography variant="h3" ml={1}>
                Phone
              </Typography>
            </Box>
            <Typography variant="body1" mb={2}>
              1800-111-555
            </Typography>
            <Box display="flex" alignItems="center" justifyContent="center" mb={1}>
              <EmailIcon fontSize="large" color="primary" />
              <Typography variant="h3" ml={1}>
                Mail
              </Typography>
            </Box>
            <Typography variant="body1" mb={2}>
              mis-nsap[at]nic[dot]in
            </Typography>
            <Box display="flex" alignItems="center" justifyContent="center" mb={1}>
              <PublicIcon fontSize="large" color="primary" />
              <Typography variant="h3" ml={1}>
                Site
              </Typography>
            </Box>
            <Typography variant="body1" style={{ marginBottom: '20px' }}>
              <Link href="https://servicedesk.nic.in" target="_blank" rel="noopener">
                https://servicedesk.nic.in
              </Link>
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default HomePageSectionContactUs;
