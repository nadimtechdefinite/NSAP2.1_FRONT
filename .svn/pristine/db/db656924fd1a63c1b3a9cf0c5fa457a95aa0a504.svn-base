import React, { useState } from 'react';
import MainCard from 'ui-component/cards/MainCard';
import Chart from 'react-apexcharts';
import { Typography, Grid, Button } from '@mui/material';
import SchemeListManagementDashboard from '../Common/SchemList';

const PaymentModeReport = ({ cardStyle }) => {
  const [selectedSchme, setSelectedScheme] = useState('0');
  const state = {
    series: [44, 55, 13, 77],
    options: {
      chart: {
        width: 385,
        type: 'pie'
      },
      labels: ['Bank A/C', 'PO', 'MO', 'Cash'],
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200
            },
            legend: {
              position: 'bottom'
            }
          }
        }
      ]
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
                  <Typography variant="h4">PAYMENT MODE</Typography>
                </Grid>
              </Grid>
            </Grid>
            <Grid item>
              <SchemeListManagementDashboard onSelectScheme={handleSelectScheme} defaultSelectedSchemeCode={selectedSchme} />
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Chart options={state.options} series={state.series} type="pie" width={385} />
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

export default PaymentModeReport;
