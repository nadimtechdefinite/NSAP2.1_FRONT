import React from 'react';
import { Typography, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Link } from '@mui/material';

const GuidelinesPage = () => {
  const data = [
    {
      id: 1,
      name: 'NSAP- Social Audit Guidelines 2023',
      guideline: 'Guidelines',
      year: 2023,
      language: 'HINDI'
    },
    {
      id: 2,
      name: 'NSAP- Social Audit Guidelines 2023',
      guideline: 'Guidelines',
      year: 2023,
      language: 'ENGLISH'
    },
    {
      id: 3,
      name: 'NSAP- Social Audit Guidelines 2019',
      guideline: 'Guidelines',
      year: 2019,
      language: 'ENGLISH'
    },
    { id: 4, name: 'NSAP GUIDELINES (R.)', guideline: 'Guidelines', year: '31/10/2014', language: 'ENGLISH' },
    {
      id: 5,
      name: 'DRAFT REVISED GUIDELINES (NSAP)',
      guideline: 'Guidelines',
      year: '13/03/2014',
      language: 'ENGLISH'
    },
    {
      id: 6,
      name: 'NATIONAL FAMILY BENEFIT SCHEME (NFBS)',
      guideline: 'Guidelines',
      year: '08/11/2012',
      language: 'ENGLISH'
    },
    {
      id: 7,
      name: 'INDIRA GANDHI NATIONAL DISABILITY PENSION SCHEME (IGNDPS)',
      guideline: 'Guidelines',
      year: '08/11/2012',
      language: 'ENGLISH'
    },
    {
      id: 8,
      name: 'INDIRA GANDHI NATIONAL WIDOW PENSION SCHEME (IGNWPS)',
      guideline: 'Guidelines',
      year: '08/11/2012',
      language: 'ENGLISH'
    },
    {
      id: 9,
      name: 'INDIRA GANDHI NATIONAL OLD AGE PENSION SCHEME (IGNOAPS)',
      guideline: 'Guidelines',
      year: '08/11/2012',
      language: 'ENGLISH'
    },
    {
      id: 10,
      name: 'INDIRA GANDHI NATIONAL DISABILITY PENSION SCHEME (IGNDPS)',
      guideline: 'Guidelines',
      year: '30/06/2011',
      language: 'ENGLISH'
    },
    {
      id: 11,
      name: 'INDIRA GANDHI NATIONAL WIDOW PENSION SCHEME (IGNWPS)',
      guideline: 'Guidelines',
      year: '30/06/2011',
      language: 'ENGLISH'
    },
    {
      id: 12,
      name: 'INDIRA GANDHI NATIONAL OLD AGE PENSION SCHEME (IGNOAPS)',
      guideline: 'Guidelines',
      year: '30/06/2011',
      language: 'ENGLISH'
    },
    {
      id: 13,
      name: 'INDIRA GANDHI NATIONAL DISABILITY PENSION SCHEME (IGNDPS)',
      guideline: 'Guidelines',
      year: '30/09/2009',
      language: 'ENGLISH'
    },
    {
      id: 14,
      name: 'INDIRA GANDHI NATIONAL WIDOW PENSION SCHEME (IGNWPS)',
      guideline: 'Guidelines',
      year: '30/09/2009',
      language: 'ENGLISH'
    },
    {
      id: 15,
      name: 'EXPANSION OF NSAP WITH WIDOWS AND DISABLED',
      guideline: 'Guidelines',
      year: '17/02/2009',
      language: 'ENGLISH'
    },
    {
      id: 16,
      name: 'INDIRA GANDHI NATIONAL OLD AGE PENSION SCHEME (IGNOAPS)',
      guideline: 'Guidelines',
      year: '24/09/2007',
      language: 'ENGLISH'
    },
    {
      id: 17,
      name: 'REVISION AND EXPANSION OF NOAPS',
      guideline: 'Guidelines',
      year: '23/09/2007',
      language: 'ENGLISH'
    },
    {
      id: 18,
      name: 'AMENDMENT TO GUIDELINES 2002 OF NSAP',
      guideline: 'Guidelines',
      year: '05',
      language: 'ENGLISH'
    },
    {
      id: 19,
      name: 'REGARDING TRANSFERRED SCHEMES UNDER NSAP',
      guideline: 'Guidelines',
      year: '2002',
      language: 'ENGLISH'
    },
    { id: 20, name: 'Annapurna', guideline: 'Guidelines', year: '2000', language: 'ENGLISH' },
    { id: 21, name: 'NSAP (NOAPS/NFBS/NBMS)', guideline: 'Guidelines', year: '1998', language: 'ENGLISH' },
    { id: 22, name: 'NSAP (NOAPS/NFBS/NBMS)', guideline: 'Guidelines', year: '1995', language: 'ENGLISH' },
    {
      id: 23,
      name: 'Notification under Aadhaar Act 2016',
      guideline: 'Notification',
      year: '2016',
      language: 'ENGLISH',
      onClick: () => go_there_98()
    },
    { id: 24, name: 'Corrigendum', guideline: 'Corrigendum', year: '2016', language: 'ENGLISH' }
  ];
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Typography sx={{ mt: 2, mb: 2 }} variant="h1">
        Guidelines on the various schemes of NSAP
      </Typography>
      <TableContainer component={Paper}>
        <Table aria-label="guidelines table">
          <TableHead>
            <TableRow>
              <TableCell>SL. NO.</TableCell>
              <TableCell>NAME OF THE SCHEME/SUBJECT</TableCell>
              <TableCell>GUIDELINES</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row) => (
              <TableRow key={row.id}>
                <TableCell>{row.id}</TableCell>
                <TableCell>{row.name}</TableCell>
                <TableCell>
                  <Link href="#" onClick={row.onClick} color="primary" underline="hover">
                    <Typography variant="body2" component="i">
                      {row.guideline}
                    </Typography>
                  </Link>{' '}
                  ({row.year}) {row.language}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};
export default GuidelinesPage;
