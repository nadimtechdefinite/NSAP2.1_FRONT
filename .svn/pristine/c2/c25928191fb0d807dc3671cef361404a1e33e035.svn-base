import React, { useEffect, useState } from 'react';
import { Grid, Paper, Typography, Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { styled } from '@mui/system';
import PersonIcon from '@mui/icons-material/Person';
import AadhaarIcon from 'assets/images/icon-aadhaar.png'; // Ensure the icon is placed in the correct path
import BGImage2 from 'assets/images/bg/02.jpg';
import axios from 'axios';
import config from 'config';
const CounterBox = styled(Box)(({ theme }) => ({
  background: 'none',
  zIndex: 0,
  padding: theme.spacing(5, 0),
  color: theme.palette.common.white,
  backgroundImage: `url(${BGImage2})`, // Adjust the image path as needed
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(74, 196, 243, 0.9)', // Blue overlay
    zIndex: -1
  }
}));

const CounterCard = ({ icon, count, label }) => {
  const theme = useTheme();
  return (
    <Paper
      elevation={3}
      sx={{
        display: 'flex',
        alignItems: 'center',
        padding: theme.spacing(2),
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.common.white
      }}
    >
      <Box component="span" sx={{ marginRight: theme.spacing(2) }}>
        {icon}
      </Box>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          borderLeft: `2px solid ${theme.palette.common.white}`,
          paddingLeft: theme.spacing(2)
        }}
      >
        <Typography variant="h4" component="span" style={{ color: 'white' }}>
          {count}
        </Typography>
        <Typography variant="body2" component="p" style={{ color: 'ghostwhite' }}>
          {label}
        </Typography>
      </Box>
    </Paper>
  );
};

const HomePageSectionCounter = () => {
  const [countData, setCountData] = useState([]);
  const apiBaseUrl = config.API_BASE_URL;
  const findReportSummary = async () => {
    try {
      const getUrl = `${apiBaseUrl}/home/findCountBeneficiariesDetails`;
      const response = await axios.get(getUrl);
      setCountData(response.data[0]);
    } catch (error) {
      console.error('Error fetching find Count Beneficiaries Details Summary', error);
    }
  };
  useEffect(() => {
    findReportSummary();
  }, []);

  return (
    <CounterBox>
      <Grid container spacing={3} sx={{ paddingLeft: 2, paddingRight: 2 }}>
        <Grid item xs={12} md={6} xl={3}>
          <CounterCard icon={<PersonIcon fontSize="large" />} count={countData[0]} label="NSAP Beneficiaries" />
        </Grid>
        <Grid item xs={12} md={6} xl={3}>
          <CounterCard icon={<PersonIcon fontSize="large" />} count={countData[1]} label="State Funded Scheme Beneficiaries" />
        </Grid>
        <Grid item xs={12} md={6} xl={3}>
          <CounterCard icon={<PersonIcon fontSize="large" />} count={countData[2]} label="NSAP & State Scheme Beneficiaries" />
        </Grid>
        <Grid item xs={12} md={6} xl={3}>
          <CounterCard
            icon={<img src={AadhaarIcon} alt="aadhaar" width={32} height={32} />}
            count={countData[3]}
            label="Total Aadhaar in NSAP"
          />
        </Grid>
      </Grid>
    </CounterBox>
  );
};

export default HomePageSectionCounter;
