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
const AgeAnalysisReport = ({ cardStyle }) => {
  const [value, setValue] = useState('IGNOAPS');
  const state = {
    series: [
      {
        name: 'Pensioners',
        data: [21012874, 5380488, 400064, 122274, 52021]
      }
    ],
    options: {
      chart: {
        type: 'bar'
      },

      dataLabels: {
        enabled: false
      },
      legend: {
        show: true,
        showForSingleSeries: true,
        position: 'top',
        horizontalAlign: 'center',
        customLegendItems: ['Pensioners']
      },
      xaxis: {
        categories: [['60-79'], ['80-90'], ['91-95'], ['96-100'], ['100 (+)']],
        labels: {
          style: {
            fontSize: '12px'
          }
        }
      },
      yaxis: {
        title: {
          text: 'Old age Pensioners',
          style: {
            fontSize: '14px'
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
                  <Typography variant="h4">AGE ANALYSIS</Typography>
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

export default AgeAnalysisReport;
