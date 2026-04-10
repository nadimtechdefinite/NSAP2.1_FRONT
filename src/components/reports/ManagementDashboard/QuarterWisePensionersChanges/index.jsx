import React from 'react';
import MainCard from 'ui-component/cards/MainCard';
import Chart from 'react-apexcharts';
import { Typography, Grid, Button } from '@mui/material';

const QuarterWisePensionersChangesReport = ({ cardStyle }) => {
  const state = {
    series: [
      {
        name: 'Pensioners Count',
        data: [2488125, 2474648, 2469195, 2461529, 2464137, 2815316, 2817774, 2916709]
      }
    ],
    options: {
      chart: {
        type: 'line',
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
        text: 'Quarterly Count',
        align: 'center',
        style: {
          fontSize: '14px',
          color: '#333'
        }
      },
      xaxis: {
        categories: ['2022 Q1', '2022 Q2', '2022 Q3', '2022 Q4', '2023 Q1', '2023 Q2', '2023 Q3', '2023 Q4']
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
          text: 'Pensioner changes from 60-80 to 80+',
          style: {
            fontSize: '10px'
          }
        },
        labels: {
          formatter: function (value) {
            return value / 100000 + '';
          }
        }
      },
      tooltip: {
        y: {
          formatter: function (value) {
            return value;
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
                  <Typography variant="h4">QUARTER WISE PENSIONERS CHANGES</Typography>
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
          <Chart options={state.options} series={state.series} type="line" />
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

export default QuarterWisePensionersChangesReport;
