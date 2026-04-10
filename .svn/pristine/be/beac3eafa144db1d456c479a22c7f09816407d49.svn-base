import React, { useState } from 'react';
import MainCard from 'ui-component/cards/MainCard';
import Chart from 'react-apexcharts';
import { Typography, Grid, Button } from '@mui/material';
import SchemeListManagementDashboard from '../Common/SchemList';

const DBTFundDisbursementReport = ({ cardStyle }) => {
  const [selectedSchme, setSelectedScheme] = useState('0');
  const state = {
    series: [
      {
        name: 'Transaction',
        data: [23000000, 3000000, 1000000, 9000000, 100000]
      },
      {
        name: 'Fund',
        data: [15000000, 2000000, 800000, 7000000, 50000]
      }
    ],
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
            text: 'Transaction (Cr)',
            style: {
              fontSize: '14px'
            }
          },
          labels: {
            formatter: function (value) {
              return value / 10000000 + ' Cr'; // Format labels for left y-axis
            }
          }
        },
        {
          opposite: true, // Position this axis on the right side
          title: {
            text: 'Fund (Cr)',
            style: {
              fontSize: '14px'
            }
          },
          labels: {
            formatter: function (value) {
              return value / 10000000 + ' Cr'; // Format labels for right y-axis
            }
          }
        }
      ],
      xaxis: {
        categories: [['2019-2020'], ['2020-2021'], ['2021-2022'], ['2023-2024'], ['2024-2025']],
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
  const handleSelectScheme = (schemeCode) => {
    setSelectedScheme(schemeCode);
  };
  return (
    <MainCard style={cardStyle}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Grid container alignItems="center" justifyContent="space-between">
            <Grid item>
              <Grid container direction="column" spacing={1}>
                <Grid item>
                  <Typography variant="h4">DBT (FUND DISBURSEMENT)</Typography>
                </Grid>
              </Grid>
            </Grid>
            <Grid item>
              <SchemeListManagementDashboard onSelectScheme={handleSelectScheme} defaultSelectedSchemeCode={selectedSchme} />
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Chart options={state.options} series={state.series} type="bar" />
        </Grid>
        <Grid item xs={12}>
          <Button variant="outlined" style={{ float: 'right' }}>
            VIEW DATA
          </Button>
        </Grid>
      </Grid>
    </MainCard>
  );
};

export default DBTFundDisbursementReport;
