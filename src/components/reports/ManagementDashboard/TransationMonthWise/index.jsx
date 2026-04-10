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
    value: 'IGNWPS',
    label: 'IGNWPS'
  },
  {
    value: 'IGNDPS',
    label: 'IGNDPS'
  }
];
const TransationMonthWiseReport = ({ cardStyle }) => {
  const [value, setValue] = useState('IGNOAPS');

  const state = {
    series: [
      {
        name: 'January',
        data: [7.59, 0.36, 4.52, 1.14, 19.42, 0.15, 19.67, 8.65, 1.36, 7.64, 1.41]
      },
      {
        name: 'February',
        data: [7.59, 0.36, 4.52, 1.14, 19.42, 0.15, 19.67, 8.65, 1.36, 7.64, 1.41]
      },
      {
        name: 'March',
        data: [7.59, 0.36, 4.52, 1.14, 19.42, 0.15, 19.67, 8.65, 1.36, 7.64, 1.41]
      },
      {
        name: 'Aprl',
        data: [7.59, 0.36, 4.52, 1.14, 19.42, 0.15, 19.67, 8.65, 1.36, 7.64, 1.41]
      },
      {
        name: 'May',
        data: [7.59, 0.36, 4.52, 1.14, 19.42, 0.15, 19.67, 8.65, 1.36, 7.64, 1.41]
      },
      {
        name: 'June',
        data: [7.59, 0.36, 4.52, 1.14, 19.42, 0.15, 19.67, 8.65, 1.36, 7.64, 1.41]
      },
      {
        name: 'July',
        data: [7.59, 0.36, 4.52, 1.14, 19.42, 0.15, 19.67, 8.65, 1.36, 7.64, 1.41]
      },
      {
        name: 'August',
        data: [7.59, 0.36, 4.52, 1.14, 19.42, 0.15, 19.67, 8.65, 1.36, 7.64, 1.41]
      },
      {
        name: 'September',
        data: [7.59, 0.36, 4.52, 1.14, 19.42, 0.15, 19.67, 8.65, 1.36, 7.64, 1.41]
      },
      {
        name: 'October',
        data: [7.59, 0.36, 4.52, 1.14, 19.42, 0.15, 19.67, 8.65, 1.36, 7.64, 1.41]
      },
      {
        name: 'November',
        data: [7.59, 0.36, 4.52, 1.14, 19.42, 0.15, 19.67, 8.65, 1.36, 7.64, 1.41]
      },
      {
        name: 'December',
        data: [7.59, 0.36, 4.52, 1.14, 19.42, 0.15, 19.67, 8.65, 1.36, 7.64, 1.41]
      }
    ],
    options: {
      chart: {
        type: 'heatmap'
      },
      dataLabels: {
        enabled: false
      },
      colors: ['#008FFB'],
      title: {
        text: 'TRANSACTION MONTH WISE',
        align: 'center'
      },
      xaxis: {
        categories: [
          'ARUNACHAL PRADESH',
          'BIHAR',
          'DADRA & NAGAR HAVELI DAMAN & DIU',
          'DELHI',
          'GUJARAT',
          'HIMACHAL PRADESH',
          'KARNATAKA',
          'MADHYA PRADESH',
          'LAKSHADWEEP',
          'MEGHALAYA',
          'NAGALAND',
          'PUDUCHERRY',
          'RAJASTHAN',
          'TAMIL NADU',
          'UTTAR PRADESH',
          'CHHATTISGARH',
          'UTTARAKHAND'
        ],
        labels: {
          style: {
            fontSize: '12px'
          }
        }
      },
      tooltip: {
        y: {
          formatter: function (value) {
            return (value * 100000).toLocaleString('en-IN', { maximumFractionDigits: 2 }) + ' Lakh';
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
                  <Typography variant="h4">TRANSACTION MONTH WISE</Typography>
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
                &nbsp;&nbsp; FY : 2023-24
              </Typography>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Chart options={state.options} series={state.series} type="heatmap" />
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

export default TransationMonthWiseReport;
