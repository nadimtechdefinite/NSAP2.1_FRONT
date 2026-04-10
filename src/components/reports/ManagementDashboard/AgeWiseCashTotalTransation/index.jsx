import React from 'react';
import MainCard from 'ui-component/cards/MainCard';
import Chart from 'react-apexcharts';
import { Typography, Grid, Button } from '@mui/material';

const AgeWiseCashTotalTransationReport = ({ cardStyle }) => {
  const state = {
    series: [
      {
        name: 'Cash Transaction',
        data: [2495151, 5348846, 287378],
        color: '#50b432'
      },
      {
        name: 'Total Transaction',
        data: [27406034, 143463717, 24706301],
        color: '#058dc7'
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
            text: 'No. of Transaction',
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
        categories: ['Below 60', '60-80', 'Above 80'],
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
    <MainCard style={cardStyle}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Grid container alignItems="center" justifyContent="space-between">
            <Grid item>
              <Grid container direction="column" spacing={1}>
                <Grid item>
                  <Typography variant="h4">AGE WISE CASH/TOTAL TRANSACTION</Typography>
                </Grid>
              </Grid>
            </Grid>
            <Grid item>
              <Typography variant="h4" style={{ display: 'flex', alignItems: 'center' }}>
                FY : 2022-23
              </Typography>
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

export default AgeWiseCashTotalTransationReport;
