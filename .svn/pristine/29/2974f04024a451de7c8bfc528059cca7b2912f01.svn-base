import React, { useEffect, useState } from 'react';
import MainCard from 'ui-component/cards/MainCard';
import Chart from 'react-apexcharts';
import axios from 'axios';
import config from 'config';
import { CircularProgress, Box } from '@mui/material';
const NsapPensioners = () => {
  const [loading, setLoading] = useState(true);
  const [countData, setCountData] = useState([]);
  const apiBaseUrl = config.API_BASE_URL;
  const findReportSummary = async () => {
    try {
      const getUrl = `${apiBaseUrl}/home/findCountNSAPPensionersSchemeWise`;
      const response = await axios.get(getUrl);
      setCountData(response.data[0]);
    } catch (error) {
      console.error('Error fetching find Count NSAP Pensioners Scheme Wise Summary', error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    findReportSummary();
  }, []);

  const state = {
    series: countData,
    options: {
      chart: {
        type: 'pie',
        toolbar: {
          show: true
        }
      },
      labels: ['IGNOAPS', 'IGNWPS', 'IGNDPS'],
      responsive: [
        {
          breakpoint: 0,
          options: {
            chart: {
              width: '100%',
              height: '300px' // Adjust height as needed
            },
            legend: {
              position: 'bottom',
              horizontalAlign: 'center',
              offsetY: 0,
              offsetX: 0
            },
            plotOptions: {
              pie: {
                offsetY: 0,
                offsetX: 0
              }
            }
          }
        },
        {
          breakpoint: 576,
          options: {
            chart: {
              width: '100%',
              height: '300px' // Adjust height as needed
            },
            legend: {
              position: 'right',
              offsetY: 0,
              offsetX: -10
            }
          }
        },
        {
          breakpoint: 992,
          options: {
            chart: {
              width: '380px',
              height: '300px' // Adjust height as needed
            },
            legend: {
              position: 'right',
              offsetY: 0,
              offsetX: -10
            }
          }
        },
        {
          breakpoint: 1200,
          options: {
            chart: {
              width: '500px',
              height: '300px' // Adjust height as needed
            },
            legend: {
              position: 'right',
              offsetY: 0,
              offsetX: -10
            }
          }
        }
      ]
    }
  };

  return (
    <MainCard title="NSAP Pensioners/Beneficiaries">
      {loading ? (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%'
          }}
        >
          <CircularProgress />
        </Box>
      ) : (
        <Chart options={state.options} series={state.series} type="pie" />
      )}
    </MainCard>
  );
};

export default NsapPensioners;
