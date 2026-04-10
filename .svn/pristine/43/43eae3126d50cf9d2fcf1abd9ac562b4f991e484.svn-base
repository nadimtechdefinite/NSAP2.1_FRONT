import React, { useState } from 'react';
import MainCard from 'ui-component/cards/MainCard';
import Chart from 'react-apexcharts';
import { Typography, Grid, Button, FormControl } from '@mui/material';
import StateListManagementDashboard from '../Common/StateList';

const NFBSSummaryReport = ({ cardStyle }) => {
  const [defaultStateValue, setDefaultStateValue] = useState('0');
  const state = {
    series: [
      {
        name: 'Application',
        data: [117, 1990, 3995, 588]
      },
      {
        name: 'Verification',
        data: [178, 296, 251, 16]
      },

      {
        name: 'Sanction',
        data: [114, 83, 269, 18]
      },
      {
        name: 'Discontinue',
        data: [1348, 1715, 594, 2]
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
        categories: ['2021-2022', '2022-2023', '2023-2024', '2024-2025']
      },
      yaxis: {
        title: {
          text: 'Total Cases'
        },
        labels: {
          formatter: function (value) {
            return value / 1000 + ' K'; // Format labels for left y-axis
          }
        }
      },
      fill: {
        opacity: 1
      },
      tooltip: {
        y: {
          formatter: function (val) {
            return ' ' + val + 'K';
          }
        }
      }
    }
  };
  const handleSelectState = (state) => {
    setDefaultStateValue(state);
  };
  return (
    <MainCard style={cardStyle}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Grid container alignItems="center" justifyContent="space-between">
            <Grid item>
              <Grid container direction="column" spacing={1}>
                <Grid item>
                  <Typography variant="h4">NFBS SUMMARY</Typography>
                </Grid>
              </Grid>
            </Grid>
            <Grid item>
              <FormControl fullWidth>
                <StateListManagementDashboard onSelectState={handleSelectState} defaultStateCode={defaultStateValue} />
              </FormControl>
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

export default NFBSSummaryReport;
