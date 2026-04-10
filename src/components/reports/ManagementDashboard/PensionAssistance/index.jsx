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
const PensionAssistanceReport = ({ cardStyle }) => {
  const [value, setValue] = useState('IGNOAPS');
  const state = {
    series: [
      {
        name: 'State (60-79)',
        data: [44, 55, 57, 56, 61, 58, 63, 60, 66, 44, 55, 57, 56, 61, 58, 63, 60, 66]
      },
      {
        name: 'Center (60-79)',
        data: [76, 85, 101, 98, 87, 105, 91, 114, 94, 76, 85, 101, 98, 87, 105, 91, 114, 94]
      },

      {
        name: 'State 80+',
        data: [44, 55, 57, 56, 61, 58, 63, 60, 66, 44, 55, 57, 56, 61, 58, 63, 60, 66]
      },
      {
        name: 'Center 80+',
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
          text: 'Pension Amount (in Rs)'
        }
      },
      fill: {
        opacity: 1
      },
      tooltip: {
        y: {
          formatter: function (val) {
            return 'Rs ' + val + ' ';
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
                  <Typography variant="h4">PENSION ASSISTANCE</Typography>
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

export default PensionAssistanceReport;
