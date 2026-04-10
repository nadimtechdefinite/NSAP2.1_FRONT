import React from 'react';
import MainCard from 'ui-component/cards/MainCard';
import Chart from 'react-apexcharts';
import { Typography, Grid, Button } from '@mui/material';

const APBPercentageReport = ({ cardStyle }) => {
  const state = {
    series: [
      {
        data: [
          {
            x: 'New Delhi',
            y: 218
          },
          {
            x: 'Kolkata',
            y: 149
          },
          {
            x: 'Mumbai',
            y: 184
          },
          {
            x: 'Ahmedabad',
            y: 55
          },
          {
            x: 'Bangaluru',
            y: 84
          },
          {
            x: 'Pune',
            y: 31
          },
          {
            x: 'Chennai',
            y: 70
          },
          {
            x: 'Jaipur',
            y: 30
          },
          {
            x: 'Surat',
            y: 44
          },
          {
            x: 'Hyderabad',
            y: 68
          },
          {
            x: 'Lucknow',
            y: 28
          },
          {
            x: 'Indore',
            y: 19
          },
          {
            x: 'Kanpur',
            y: 29
          }
        ]
      }
    ],
    options: {
      legend: {
        show: false
      },
      chart: {
        type: 'treemap'
      },
      title: {
        text: 'APB',
        align: 'center'
      },
      colors: [
        '#3B93A5',
        '#F7B844',
        '#ADD8C7',
        '#EC3C65',
        '#CDD7B6',
        '#C1F666',
        '#D43F97',
        '#1E5D8C',
        '#421243',
        '#7F94B0',
        '#EF6537',
        '#C0ADDB'
      ],
      plotOptions: {
        treemap: {
          distributed: true,
          enableShades: false
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
                  <Typography variant="h4">APB PERCENTAGE</Typography>
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
          <Chart options={state.options} series={state.series} type="treemap" />
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

export default APBPercentageReport;
