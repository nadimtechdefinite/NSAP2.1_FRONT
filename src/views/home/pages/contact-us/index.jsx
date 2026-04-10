import React from 'react';
import { Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, List, ListItem, Link } from '@mui/material';
import MainCard from 'ui-component/cards/MainCard';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import LanguageIcon from '@mui/icons-material/Language';
import Marquee from './Marquee';
const data = {
  nsap: [
    { name: 'Shri Kuntal Sensarma, Chief Economic Adviser', phone: '011-23073776', email: 'sensarma[dot]kuntal[at]gov[dot]in' },
    { name: 'Mrs. Kalayani Mishra, Economic Adviser', phone: '011-24650535', email: 'eansap-mord[at]nic[dot]in' },
    { name: 'Shri Umesh Kumar Ram, Joint Director', phone: '011-24654425', email: 'umeshkr[dot]ram[at]gov[dot]in' },
    { name: 'Moti Ram, Assistant Commissioner', phone: '011-24368626', email: 'motiram[at]nic[dot]in' },
    { name: 'Arvind Kumar Soni, Under Secretary', phone: '011-24368626', email: 'arvind[dot]soni[at]nic[dot]in' }
  ],
  nic: [
    { name: 'Shri Sanjay Kumar Pandey, DDG & HoD', email: 'mis-nsap[at]nic[dot]in' },
    { name: 'Shri. Brijesh Srivastava, Director(IT)', email: 'mis-nsap[at]nic[dot]in' }
  ]
};

const InfoCard = ({ title, rows, columns }) => (
  <MainCard
    title={title}
    sx={{
      '& .css-1nvdc5e-MuiCardHeader-root': { backgroundColor: '#2196f3', padding: '16px' },
      '& .css-1nvdc5e-MuiCardHeader-root .MuiCardHeader-title': { color: 'white' }
    }}
  >
    <TableContainer>
      <Table size="small">
        <TableHead>
          <TableRow>
            {columns.map((column) => (
              <TableCell key={column}>{column}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, index) => (
            <TableRow key={index}>
              <TableCell>{row.name}</TableCell>
              {row.phone && <TableCell>{row.phone}</TableCell>}
              <TableCell style={{ color: 'blue' }}>{row.email}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  </MainCard>
);

const ContactUsPage = () => {
  return (
    <Grid container spacing={1}>
      <Grid item xs={12} sm={12} md={12}>
        <Typography sx={{ mt: 2, mb: 2 }} variant="h1">
          Contact Us
        </Typography>
        <Typography variant="h4">
          <Marquee />
        </Typography>
      </Grid>
      <Grid item xs={12} sm={6} md={6}>
        <InfoCard title="NSAP Division" columns={['Name & Designation', 'Office Phone', 'Email']} rows={data.nsap} />
      </Grid>
      <Grid item xs={12} sm={6} md={6}>
        <InfoCard title="NIC" columns={['Name & Designation', 'Email']} rows={data.nic} />
      </Grid>

      <Grid item xs={12} sm={6} md={6}>
        <MainCard>
          <List sx={{ textAlign: 'left' }}>
            <ListItem>
              <Grid container alignItems="center">
                <Grid item sx={{ pr: 2 }}>
                  <LocationOnIcon color="primary" />
                </Grid>
                <Grid item>
                  <Typography variant="h4">Department of Rural Development</Typography>
                  <Typography variant="body1">
                    <strong>National Social Assistance Programme Division</strong>
                  </Typography>
                  <Typography variant="body1">
                    <strong>Krishi Bhawan, Dr. Rajendra Prasad Marg, New Delhi - 110114</strong>
                  </Typography>
                </Grid>
              </Grid>
            </ListItem>
            <ListItem>
              <Grid container alignItems="center">
                <Grid item sx={{ pr: 2 }}>
                  <PhoneIcon color="primary" />
                </Grid>
                <Grid item>
                  <Typography variant="body1">1800-111-555</Typography>
                </Grid>
              </Grid>
            </ListItem>
            <ListItem>
              <Grid container alignItems="center">
                <Grid item sx={{ pr: 2 }}>
                  <EmailIcon color="primary" />
                </Grid>
                <Grid item>
                  <Typography variant="body1">mis-nsap@nic.in</Typography>
                </Grid>
              </Grid>
            </ListItem>
            <ListItem>
              <Grid container alignItems="center">
                <Grid item sx={{ pr: 2 }}>
                  <LanguageIcon color="primary" />
                </Grid>
                <Grid item>
                  <Typography variant="body1">
                    <Link href="https://servicedesk.nic.in" target="_blank" sx={{ color: 'primary.main' }}>
                      https://servicedesk.nic.in
                    </Link>
                  </Typography>
                </Grid>
              </Grid>
            </ListItem>
          </List>
        </MainCard>
      </Grid>
    </Grid>
  );
};

export default ContactUsPage;
