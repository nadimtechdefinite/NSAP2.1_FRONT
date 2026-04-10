import React from 'react';
import MainCard from 'ui-component/cards/MainCard';
import Chart from 'react-apexcharts';
import { Typography, Grid, Button } from '@mui/material';

const BeneficiaryCoverageReport = ({ cardStyle }) => {
  const state = {
    series: [
      {
        name: 'MORD State Cap',
        data: [44, 55, 57, 56, 61, 58, 63, 60, 66, 44, 55, 57, 56, 61, 58, 63, 60, 66]
      },
      {
        name: 'NSAP Beneficiaries',
        data: [76, 85, 101, 98, 87, 105, 91, 114, 94, 76, 85, 101, 98, 87, 105, 91, 114, 94]
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
      dataLabels: {
        enabled: false
      },
      stroke: {
        show: true,
        width: 2,
        colors: ['transparent']
      },
      xaxis: {
        categories: ['UP', 'MP', 'WB', 'TN', 'RJ', 'JH', 'CG', 'TG', 'HR', 'DL', 'PJ', 'JK', 'MN', 'AR', 'MZ', 'SK', 'LK', 'AN']
      },
      yaxis: {
        title: {
          text: 'Pensioners'
        }
      },
      fill: {
        opacity: 1
      },
      tooltip: {
        y: {
          formatter: function (val) {
            return 'Rs ' + val + ' thousands';
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
                  <Typography variant="h4">BENEFICIARY COVERAGE</Typography>
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

export default BeneficiaryCoverageReport;
