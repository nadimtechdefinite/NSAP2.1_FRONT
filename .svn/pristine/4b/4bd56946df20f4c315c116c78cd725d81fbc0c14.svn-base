import React, { useState } from 'react';
import MainCard from 'ui-component/cards/MainCard';
import Chart from 'react-apexcharts';
import { Typography, MenuItem, TextField, Grid, Button } from '@mui/material';

const status = [
  {
    value: '0',
    label: 'All Pension Scheme'
  },
  {
    value: 'IGNOAPS',
    label: 'IGNOAPS'
  },
  {
    value: 'IGNWPS',
    label: 'IGNWPS'
  },
  {
    value: 'IGNDPS',
    label: 'IGNDPS'
  }
];
const MixedModePaymentReport = ({ cardStyle }) => {
  const [value, setValue] = useState('0');
  const state = {
    series: [99, 0, 0],
    options: {
      chart: {
        type: 'pie'
      },
      labels: ['DBT', 'MO', 'Cash'],
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200
            }
          }
        }
      ]
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
                  <Typography variant="h4">MIXED MODE PAYMENT</Typography>
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
          <Chart options={state.options} series={state.series} type="pie" width={465} />
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

export default MixedModePaymentReport;
