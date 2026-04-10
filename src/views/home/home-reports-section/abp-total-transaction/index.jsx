import React, { useEffect, useState } from 'react';
import MainCard from 'ui-component/cards/MainCard';
import Chart from 'react-apexcharts';
import axios from 'axios';
import config from 'config';
import { CircularProgress, Box } from '@mui/material';

const ABPTotalTransaction = () => {
  const [loading, setLoading] = useState(true);
  const [countData, setCountData] = useState([]);
  const [scheme, setScheme] = useState([]);
  const apiBaseUrl = config.API_BASE_URL;
  const findReportSummary = async () => {
    try {
      const getUrl = `${apiBaseUrl}/home/findTotalApbTransaction`;
      const response = await axios.get(getUrl);
      console.log('APB');
      //console.log(response.data);
      //console.log(response.data.apiResponse);
      //console.log(response.data.formattedSchemeName);
      setCountData(response.data.apiResponse);
      setScheme(response.data.formattedSchemeName);
    } catch (error) {
      console.error('Error fetching find Count Gender Wise Pensioners Summary', error);
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
        type: 'bar'
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '55%'
        }
      },

      yaxis: [
        {
          title: {
            text: 'in Crores',
            style: {
              fontSize: '14px'
            }
          },
          labels: {
            formatter: function (value) {
              return value / 10000000 + ' Cr'; // Format labels for left y-axis
            }
          }
        }
      ],
      xaxis: {
        categories: scheme,
        labels: {
          style: {
            fontSize: '12px'
          }
        }
      },
      dataLabels: {
        enabled: false
      }
      // Other configurations...
    }
  };
  return (
    <>
      <MainCard title="ABP Total Transaction">
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
          <Chart options={state.options} series={state.series} type="bar" />
        )}
      </MainCard>
    </>
  );
};
export default ABPTotalTransaction;
