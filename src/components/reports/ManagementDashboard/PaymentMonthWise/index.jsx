import React from 'react';
import MainCard from 'ui-component/cards/MainCard';
import Chart from 'react-apexcharts';
import { Typography, Grid, Button } from '@mui/material';

const PaymentMonthWiseReport = ({ cardStyle }) => {
  const state = {
    series: [
      {
        name: 'DBT',
        data: [10884342, 15297211, 16926764, 20222566, 25514320, 23957599, 15301685, 16677214, 33363547, 15339597, 10580678, 20146603]
      },
      {
        name: 'MO',
        data: [0, 17020, 3, 0, 15011, 4899, 580003, 907818, 686328, 682413, 530355, 530355]
      },

      {
        name: 'CASH',
        data: [933395, 945099, 826573, 845463, 843944, 838012, 862624, 873725, 859884, 1375817, 1361678, 1353481]
      }
    ],
    options: {
      chart: {
        type: 'area',
        zoom: {
          enabled: false
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: 'smooth'
      },
      title: {
        text: 'DBT/MO/Cash',
        align: 'center',
        style: {
          fontSize: '14px',
          color: '#333'
        }
      },
      xaxis: {
        categories: [
          'Apr-2022',
          'May-2022',
          'Jun-2022',
          'Jul-2022',
          'Aug-2022',
          'Sept-2022',
          'Oct-2022',
          'Nov-2022',
          'Dec-2022',
          'Jan-2023',
          'Feb-2023',
          'Mar-2023'
        ]
      },
      scales: {
        x: {
          ticks: {
            autoSkip: false,
            maxRotation: 90,
            minRotation: 90
          }
        }
      },
      yaxis: {
        title: {
          text: 'Count in Numbers',
          style: {
            fontSize: '14px'
          }
        },
        labels: {
          formatter: function (value) {
            return value / 10000000 + ' Cr';
          }
        }
      }
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
                  <Typography variant="h4">PAYMENT MONTH WISE</Typography>
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
          <Chart options={state.options} series={state.series} type="area" />
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

export default PaymentMonthWiseReport;
