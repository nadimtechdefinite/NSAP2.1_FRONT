import React from 'react';
import MainCard from 'ui-component/cards/MainCard';
import Chart from 'react-apexcharts';
import { Typography, Grid, Button } from '@mui/material';

const PensionDisbursementInStatesReport = ({ cardStyle }) => {
  const state = {
    series: [
      {
        name: 'Frequency',
        data: [23, 3, 1, 9]
      }
    ],
    options: {
      chart: {
        type: 'bar'
      },
      plotOptions: {
        bar: {
          columnWidth: '45%',
          distributed: false,
          dataLabels: {
            position: 'top', // Display data labels at the top of bars
            enabled: true,
            style: {
              colors: ['#000000'] // Set data label color to black
            }
          }
        }
      },
      dataLabels: {
        enabled: true,
        style: {
          colors: ['#000000']
        }
      },
      legend: {
        show: true,
        showForSingleSeries: true,
        position: 'top',
        horizontalAlign: 'center',
        customLegendItems: ['Frequency']
      },
      xaxis: {
        categories: [['Monthly'], ['Quarterly'], ['Six Monthly'], ['Not Reporting']],
        labels: {
          style: {
            fontSize: '12px'
          }
        }
      },
      yaxis: {
        title: {
          text: 'State Count',
          style: {
            fontSize: '14px'
          }
        },
        min: 0,
        max: 30,
        tickAmount: 4
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
                  <Typography variant="h4">PENSION DISBURSEMENT IN STATES</Typography>
                </Grid>
              </Grid>
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

export default PensionDisbursementInStatesReport;
