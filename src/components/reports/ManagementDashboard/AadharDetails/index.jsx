import React, { useState } from 'react';
import MainCard from 'ui-component/cards/MainCard';
import Chart from 'react-apexcharts';
import { Typography, Grid, Button } from '@mui/material';
import SchemeListManagementDashboard from '../Common/SchemList';

const AadharDetailsReport = ({ cardStyle }) => {
  const [selectedSchme, setSelectedScheme] = useState('0');
  const state = {
    series: [
      {
        name: 'AADHAR DETAILS',
        data: [28857144, 22253093, 6604051]
      }
    ],
    options: {
      chart: {
        type: 'bar'
      },
      plotOptions: {
        bar: {
          borderRadius: 0,
          horizontal: true,
          barHeight: '80%',
          isFunnel: true
        }
      },
      dataLabels: {
        enabled: false,
        formatter: function (val, opt) {
          return opt.w.globals.labels[opt.dataPointIndex] + ':  ' + val;
        },
        dropShadow: {
          enabled: true
        }
      },
      xaxis: {
        categories: ['NSAP Beneficiaries', 'Aadhar Authenticated', 'Aadhar Not Authenticated']
      },
      legend: {
        show: false
      }
    }
  };
  const handleSelectScheme = (schemeCode) => {
    setSelectedScheme(schemeCode);
  };
  return (
    <MainCard style={cardStyle}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Grid container alignItems="center" justifyContent="space-between">
            <Grid item>
              <Grid container direction="column" spacing={1}>
                <Grid item>
                  <Typography variant="h4">AADHAR DETAILS</Typography>
                </Grid>
              </Grid>
            </Grid>
            <Grid item>
              <SchemeListManagementDashboard onSelectScheme={handleSelectScheme} defaultSelectedSchemeCode={selectedSchme} />
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

export default AadharDetailsReport;
