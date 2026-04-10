import React, { useState } from 'react';
import MainCard from 'ui-component/cards/MainCard';
import Chart from 'react-apexcharts';
import { Typography, MenuItem, TextField, Grid, Button } from '@mui/material';

const status = [
  {
    value: 'IGNOAPS',
    label: 'IGNOAPS'
  },
  {
    value: 'IGNDPS',
    label: 'IGNDPS'
  },
  {
    value: 'IGNWPS',
    label: 'IGNWPS'
  },
  {
    value: 'NFBS',
    label: 'NFBS'
  }
];
const MisImplementationReport = ({ cardStyle }) => {
  const [value, setValue] = useState('IGNOAPS');
  const state = {
    series: [
      {
        name: 'No MIS',
        data: [0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
      },
      {
        name: 'Own Mis',
        data: [0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
      },

      {
        name: 'NSAP-PPS',
        data: [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
      },
      {
        name: 'On Boarding',
        data: [0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
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
          text: 'Status'
        },
        labels: {
          show: false
        }
      },
      fill: {
        opacity: 1
      },
      tooltip: {
        y: {
          formatter: function (val) {
            return Math.round(val); // Round the value to remove decimals
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
                  <Typography variant="h4">MIS IMPLEMENTATION</Typography>
                </Grid>
              </Grid>
            </Grid>
            <Grid item>
              <Typography variant="h6" style={{ display: 'flex', alignItems: 'center' }}>
                Scheme &nbsp;
                <TextField id="standard-select-currency" select value={value} onChange={(e) => setValue(e.target.value)}>
                  {status.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
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

export default MisImplementationReport;
