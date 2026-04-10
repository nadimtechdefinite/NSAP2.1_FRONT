import React from 'react';
import { Typography, Grid, Box, List, ListItem, ListItemText } from '@mui/material';
import MainCard from 'ui-component/cards/MainCard';
import { NavLink } from 'react-router-dom';

const ReportsPage = () => {
  const reportsLinks = [
    { label: 'National Dashboard', path: '/nationalDashboardReport' },
    { label: 'Dashboard', path: '/dashboardReport' },
    { label: 'State Dashboard', path: '/StateDashboardReport' },
    { label: 'Management Dashboard', path: '/managementDashboard' },
    { label: 'Pilot Social Audit Report by NIRDPR', path: '/reports' },
    { label: 'Social Audit Report conducted by states and ATN', path: '/socialAuditReportForStatesAndAtn' },
    { label: 'LGD Seeding Status', path: '/lGDSeedingStatusReport' },
    { label: 'Social Audit', path: '/socialAuditNewReport' }
  ];

  const abstractsLinks = [
    { label: 'State Abstract (Payment mode and Aadhaar)', path: '/StateAbstractPaymentModeAndAadhaarReport' },
    { label: 'Beneficiary Abstract(Gender specific)', path: '/BeneficiaryAbstractReport' },
    { label: 'Sanction Abstract', path: '/SanctionAbstractReport' },
    { label: 'Disbursement Abstract', path: '/DisbursementAbstractReport' },
    { label: 'State Wise Gender Based Abstract', path: '/AgeAbstractReport' }
  ];

  const trackLinks = [
    { label: 'Application Tracker', path: '/outerReport/ApplicationTrackerReport' },
    { label: 'Pension Payment Details', path: '/BeneficiaryAbstractReport' },
    { label: 'SECC & Aadhaar Seeding Progress Report', path: '/outerReport/SeccAadhaarReport' }
  ];

  const aadhaarBaseLinks = [
    { label: 'Aadhaar detail', path: '/outerReport/ApplicationTrackerReport' },
    { label: 'Data on Aadhaar based payments for DBT districts', path: '/BeneficiaryAbstractReport' },
    { label: 'Service for Aadhaar Verification-UIDAI', path: '/outerReport/SeccAadhaarReport' },
    { label: 'Monthly Progress Reports', path: '/monthlyProgressReport' },
    { label: 'Sanction Order Release', path: '/sanctionOrderReleaseReport' },
    { label: 'Aspirational District', path: '/aspirationalDistrictReport' },
    { label: 'STC Report', path: '/stcReport' },
    { label: 'Pilot Social Audit Report by NIRDPR', path: '/socialAuditReport' },
    { label: 'Pensioners Registration Modes', path: '/beneficiaryCountReport' }
  ];

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Typography sx={{ mt: 2, mb: 2 }} variant="h1">
        Reports
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={3}>
          <MainCard
            title="List of Reports"
            sx={{
              '& .css-17pmaar-MuiCardContent-root': { paddingTop: 0 },
              '& .css-1nvdc5e-MuiCardHeader-root': { backgroundColor: '#2196f3', padding: '16px' },
              '& .css-1nvdc5e-MuiCardHeader-root .MuiCardHeader-title': { color: 'white' }
            }}
          >
            <List>
              {reportsLinks.map((link, index) => (
                <ListItem component={NavLink} to={link.path} key={index}>
                  <ListItemText primaryTypographyProps={{ variant: 'body1', fontWeight: 'bold' }} primary={`${index + 1}. ${link.label}`} />
                </ListItem>
              ))}
            </List>
          </MainCard>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <MainCard
            title="Abstracts"
            sx={{
              '& .css-17pmaar-MuiCardContent-root': { paddingTop: 0 },
              '& .css-1nvdc5e-MuiCardHeader-root': { backgroundColor: '#2196f3', padding: '16px' },
              '& .css-1nvdc5e-MuiCardHeader-root .MuiCardHeader-title': { color: 'white' }
            }}
          >
            <List>
              {abstractsLinks.map((link, index) => (
                <ListItem component={NavLink} to={link.path} key={index}>
                  <ListItemText primaryTypographyProps={{ variant: 'body1', fontWeight: 'bold' }} primary={`${index + 1}. ${link.label}`} />
                </ListItem>
              ))}
            </List>
          </MainCard>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <MainCard
            title="Beneficiary Search, Track and Payment Details"
            sx={{
              '& .css-17pmaar-MuiCardContent-root': { paddingTop: 0 },
              '& .css-1nvdc5e-MuiCardHeader-root': { backgroundColor: '#2196f3', padding: '16px' },
              '& .css-1nvdc5e-MuiCardHeader-root .MuiCardHeader-title': { color: 'white' }
            }}
          >
            <List>
              {trackLinks.map((link, index) => (
                <ListItem component={NavLink} to={link.path} key={index}>
                  <ListItemText primaryTypographyProps={{ variant: 'body1', fontWeight: 'bold' }} primary={`${index + 1}. ${link.label}`} />
                </ListItem>
              ))}
            </List>
          </MainCard>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <MainCard
            title="Aadhaar Based Reports"
            sx={{
              '& .css-17pmaar-MuiCardContent-root': { paddingTop: 0 },
              '& .css-1nvdc5e-MuiCardHeader-root': { backgroundColor: '#2196f3', padding: '16px' },
              '& .css-1nvdc5e-MuiCardHeader-root .MuiCardHeader-title': { color: 'white' }
            }}
          >
            <List>
              {aadhaarBaseLinks.map((link, index) => (
                <ListItem component={NavLink} to={link.path} key={index}>
                  <ListItemText primaryTypographyProps={{ variant: 'body1', fontWeight: 'bold' }} primary={`${index + 1}. ${link.label}`} />
                </ListItem>
              ))}
            </List>
          </MainCard>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ReportsPage;
