import React from 'react';
import { Grid, Typography, List, ListItem, Paper, ListItemText } from '@mui/material';
import MainCard from 'ui-component/cards/MainCard';
import { Link as RouterLink } from 'react-router-dom';
const SitemapPage = () => {
  return (
    <MainCard title="Chronological Sitemap">
      <Grid container spacing={2}>
        <Grid item md={6} xl={3}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Typography variant="h4">Main Links</Typography>
            <List>
              <ListItem>
                <ListItemText primary={<RouterLink to="/home">Home</RouterLink>} />
              </ListItem>
              <ListItem>
                <ListItemText primary={<RouterLink to="/about">About Us</RouterLink>} />
              </ListItem>
              <ListItem>
                <ListItemText primary={<RouterLink to="/guidelines">Guidelines</RouterLink>} />
              </ListItem>
              <ListItem>
                <ListItemText primary={<RouterLink to="/reports">Reports</RouterLink>} />
              </ListItem>
              <ListItem>
                <ListItemText primary={<RouterLink to="/faq">FAQ</RouterLink>} />
              </ListItem>
              <ListItem>
                <ListItemText primary={<RouterLink to="/circulars">Circulars</RouterLink>} />
              </ListItem>
              <ListItem>
                <ListItemText primary={<RouterLink to="/contact">Contact Us</RouterLink>} />
                <List>
                  <ListItem>
                    <ListItemText primary={<RouterLink to="/contact/nsap-state-coordinators">NSAP State Co-ordinators List</RouterLink>} />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary={<RouterLink to="/contact/nsap-nic-coordinators">NSAP NIC Co-ordinators List</RouterLink>} />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary={<RouterLink to="/contact/jharkhand-coordinators">Jharkhand District Co-ordinators(DOSS) List</RouterLink>}
                    />
                  </ListItem>
                </List>
              </ListItem>
              <ListItem>
                <ListItemText primary={<RouterLink to="/gallery">Gallery</RouterLink>} />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary={
                    <a href="https://pgportal.gov.in/" target="_blank" rel="noopener noreferrer">
                      Grievance Redressal
                    </a>
                  }
                />
              </ListItem>
              <ListItem>
                <ListItemText primary={<RouterLink to="/screen-reader-access">Screen Reader Access</RouterLink>} />
              </ListItem>
              <ListItem>
                <ListItemText primary={<RouterLink to="/login">Login</RouterLink>} />
              </ListItem>
            </List>
          </Paper>
        </Grid>
        <Grid item md={6} xl={3}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Typography variant="h4">Reports</Typography>
            <List>
              <ListItem>
                <Typography variant="h6">Report Dashboard</Typography>
                <List>
                  <ListItem>
                    <ListItemText primary={<RouterLink to="/nationalDashboardReport">National Dashboard</RouterLink>} />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary={<RouterLink to="/dashboardReport">Dashboard</RouterLink>} />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary={<RouterLink to="/reports/state-dashboard">State Dashboard</RouterLink>} />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary={<RouterLink to="/managementDashboard">Data Dashboard</RouterLink>} />
                  </ListItem>
                </List>
              </ListItem>
              <ListItem>
                <Typography variant="h6">Abstracts</Typography>
                <List>
                  <ListItem>
                    <ListItemText
                      primary={<RouterLink to="/reports/state-abstract">State Abstract (Payment mode and Aadhaar)</RouterLink>}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary={<RouterLink to="/BeneficiaryAbstractReport">Beneficiary Abstract (Gender specific)</RouterLink>}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary={<RouterLink to="/SanctionAbstractReport">Sanction Abstract</RouterLink>} />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary={<RouterLink to="/DisbursementAbstractReport">Disbursement Abstract</RouterLink>} />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary={<RouterLink to="/reports/state-gender-abstract">State Wise Gender Based Abstract</RouterLink>} />
                  </ListItem>
                </List>
              </ListItem>
              <ListItem>
                <Typography variant="h6">Beneficiary Search, Track And Payment Details</Typography>
                <List>
                  <ListItem>
                    <ListItemText primary={<RouterLink to="/reports/beneficiary-search">Beneficiary Search</RouterLink>} />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary={<RouterLink to="/outerReport/ApplicationTrackerReport">Application Tracker</RouterLink>} />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary={<RouterLink to="/BeneficiaryAbstractReport">Pension Payment Details</RouterLink>} />
                  </ListItem>
                </List>
              </ListItem>
              <ListItem>
                <Typography variant="h6">Aadhaar Based Reports</Typography>
                <List>
                  <ListItem>
                    <ListItemText primary={<RouterLink to="/reports/aadhaar-detail">Aadhaar detail</RouterLink>} />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary={<RouterLink to="/reports/dbt-districts">Data on Aadhaar based payments for DBT districts</RouterLink>}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary={<RouterLink to="/reports/uidai-verification">Service for Aadhaar Verification-UIDAI</RouterLink>}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary={
                        <RouterLink to="/reports/uidai-enrollment">
                          Service to get Aadhaar/Enrollment ID based on Name and Mobile No-UIDAI
                        </RouterLink>
                      }
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary={<RouterLink to="/reports/pda-beneficiaries">Beneficiaries Linked To PDA</RouterLink>} />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary={<RouterLink to="/monthlyProgressReport">Monthly Progress Reports</RouterLink>} />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary={<RouterLink to="/reports/data-gap">Data Gap Report</RouterLink>} />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary={<RouterLink to="/sanctionOrderReleaseReport">Sanction Order Release</RouterLink>} />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary={<RouterLink to="/aspirationalDistrictReport">Aspirational District </RouterLink>} />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary={<RouterLink to="/stcReport">STC Report</RouterLink>} />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary={<RouterLink to="/reports/pmgky-abstract">PMGKY Abstract</RouterLink>} />
                  </ListItem>
                </List>
              </ListItem>
            </List>
          </Paper>
        </Grid>
        <Grid item md={6} xl={3}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Typography variant="h4">Website Policy</Typography>
            <List>
              <ListItem>
                <ListItemText primary={<RouterLink to="/terms">Terms & Conditions</RouterLink>} />
              </ListItem>
              <ListItem>
                <ListItemText primary={<RouterLink to="/privacy">Privacy Policy</RouterLink>} />
              </ListItem>
              <ListItem>
                <ListItemText primary={<RouterLink to="/hyperlink">Hyperlink Policy</RouterLink>} />
              </ListItem>
              <ListItem>
                <ListItemText primary={<RouterLink to="/copyright">Copyright Policy</RouterLink>} />
              </ListItem>
              <ListItem>
                <ListItemText primary={<RouterLink to="/accessibility">Accessibility Statement</RouterLink>} />
              </ListItem>
              <ListItem>
                <ListItemText primary={<RouterLink to="/disclaimer">Disclaimer</RouterLink>} />
              </ListItem>
              <ListItem>
                <ListItemText primary={<RouterLink to="/user-manual">User Manual</RouterLink>} />
              </ListItem>
            </List>

            <Typography variant="h4">Social Media</Typography>
            <List>
              <ListItem>
                <ListItemText
                  primary={
                    <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
                      Facebook
                    </a>
                  }
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary={
                    <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer">
                      Twitter
                    </a>
                  }
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary={
                    <a href="https://www.youtube.com" target="_blank" rel="noopener noreferrer">
                      YouTube
                    </a>
                  }
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary={
                    <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">
                      Instagram
                    </a>
                  }
                />
              </ListItem>
            </List>
          </Paper>
        </Grid>
        <Grid item md={6} xl={3}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Typography variant="h4">Link to National Portal</Typography>
            <List>
              <ListItem>
                <ListItemText
                  primary={
                    <a href="https://ngodarpan.gov.in" target="_blank" rel="noopener noreferrer">
                      NGO Darpan
                    </a>
                  }
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary={
                    <a href="https://pgportal.gov.in" target="_blank" rel="noopener noreferrer">
                      Portal for Public Grievances
                    </a>
                  }
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary={
                    <a href="https://india.gov.in" target="_blank" rel="noopener noreferrer">
                      National Portal of India
                    </a>
                  }
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary={
                    <a href="https://data.gov.in" target="_blank" rel="noopener noreferrer">
                      Data Gov
                    </a>
                  }
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary={
                    <a href="https://mygov.in" target="_blank" rel="noopener noreferrer">
                      MyGov
                    </a>
                  }
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary={
                    <a href="https://egazette.nic.in" target="_blank" rel="noopener noreferrer">
                      egazette
                    </a>
                  }
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary={
                    <a href="https://www.makeinindia.com" target="_blank" rel="noopener noreferrer">
                      Make In India
                    </a>
                  }
                />
              </ListItem>
            </List>
          </Paper>
        </Grid>
      </Grid>
    </MainCard>
  );
};

export default SitemapPage;
