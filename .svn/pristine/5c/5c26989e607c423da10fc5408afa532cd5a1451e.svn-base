import React, { useState } from 'react';
import PropTypes from 'prop-types';
import MainCard from 'ui-component/cards/MainCard';
import { Card, CardContent, Grid } from '@material-ui/core';
import { Typography, Button } from '@mui/material';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import axiosInstance from 'hooks/useAuthTokenUrl';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

const DashboardDetails = ({ data }) => {
  const [snackbar, setSnackbar] = React.useState(null);
  const handleCloseSnackbar = () => setSnackbar(null);
  const [isLoading, setIsLoading] = useState(false);
  const handleClick = async (title, flagValue) => {
    setIsLoading(true);
    const requestData = {
      key: title,
      value: flagValue
    };
    try {
      const response = await axiosInstance.post('/dashboard', requestData, {
        responseType: 'blob'
      });
      const blob = new Blob([response.data], { type: 'application/octet-stream' });
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      const currentDate =
        new Date().toISOString().slice(8, 10) + '-' + new Date().toISOString().slice(5, 7) + '-' + new Date().toISOString().slice(0, 4);
      link.download = `${title}_${currentDate}_data.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(link.href);
    } catch (error) {
      setSnackbar({ children: 'Some Internal Error Occured While Downloading Data', severity: 'error' });
      console.error('Error fetching data:', error.message);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <MainCard title="Dashboard">
      {!!snackbar && (
        <Snackbar open anchorOrigin={{ vertical: 'top', horizontal: 'center' }} onClose={handleCloseSnackbar} autoHideDuration={6000}>
          <Alert severity="error" {...snackbar} onClose={handleCloseSnackbar} />
        </Snackbar>
      )}

      <Backdrop open={isLoading} style={{ zIndex: 999, color: '#fff' }}>
        <CircularProgress color="inherit" />
      </Backdrop>

      <Grid container spacing={2}>
        {data.map((item, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card style={{ borderRadius: '1rem' }}>
              <CardContent
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  borderLeft: '5px solid #1e3a8a',
                  borderRadius: '1rem'
                }}
              >
                <Typography variant="h5" gutterBottom>
                  {item.title}
                </Typography>
                {item.link === 'true' && item.value !== '0' ? (
                  <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    style={{ minWidth: 'unset', padding: '4px 8px', fontSize: '0.7rem', cursor: 'pointer' }}
                    onClick={() => handleClick(item.title, item.key)}
                    endIcon={<CloudDownloadIcon />}
                  >
                    {item.value}
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    style={{ minWidth: 'unset', padding: '4px 8px', fontSize: '0.7rem', cursor: 'auto' }}
                  >
                    {item.value}
                  </Button>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </MainCard>
  );
};
DashboardDetails.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string,
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    })
  )
};
export default DashboardDetails;
