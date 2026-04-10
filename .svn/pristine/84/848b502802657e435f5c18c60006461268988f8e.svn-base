import React, { useEffect, useState } from 'react';
import MainCard from 'ui-component/cards/MainCard';
import Chart from 'react-apexcharts';
import axios from 'axios';
import config from 'config';
import { Box } from '@mui/material';

const AadhaarAbstract = () => {
  const [loading, setLoading] = useState(true);
  const [countData, setCountData] = useState([]);
  const [finYear, setFinYear] = useState([]);
  const apiBaseUrl = config.API_BASE_URL;
  const findReportSummary = async () => {
    try {
      const getUrl = `${apiBaseUrl}/home/findAadharAbstractFinYearWise`;
      const response = await axios.get(getUrl);
      setCountData(response.data.apiResponse);
      setFinYear(response.data.formattedFinYears);
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
            text: 'Aadhaar Abstract in Crores',
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
        categories: finYear,
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
      <MainCard title="Aadhaar Abstract">
        {loading ? (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '100%'
            }}
          ></Box>
        ) : (
          <Chart options={state.options} series={state.series} type="bar" />
        )}
      </MainCard>
    </>
  );
};
export default AadhaarAbstract;
