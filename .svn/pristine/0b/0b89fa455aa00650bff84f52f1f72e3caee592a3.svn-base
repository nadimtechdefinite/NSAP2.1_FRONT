import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { Typography } from '@mui/material';
import axios from 'axios';
import config from 'config';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import DownloadIcon from '@mui/icons-material/Download';

import { Button, TextField } from '@mui/material';
import MainCard from 'ui-component/cards/MainCard';
import { Divider, Alert, Snackbar, CircularProgress } from '@mui/material';
const useStyles = makeStyles({
  table: {
    minWidth: 650
  }
});

const AspirationalDistrictReport = () => {
  const apiBaseUrl = config.API_BASE_URL;
  const classes = useStyles();
  const [responseData, setResponseData] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [snackbar, setSnackbar] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dataAvilable, setDataAvilable] = useState(false);

  const handleCloseSnackbar = () => setSnackbar(null);
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const getUrl = `${apiBaseUrl}/aspirationalDistrictReport`;
        const response = await axios.get(getUrl);
        const jsonData = response.data;
        console.log('jsonData', jsonData);
        if (Object.keys(jsonData).length === 0 && jsonData.constructor === Object) {
          setSnackbar({ children: 'No records are found.', severity: 'error' });
          setDataAvilable(false);
        } else {
          setDataAvilable(true);
          setResponseData(jsonData);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const exportToExcel = () => {
    // Create a new workbook
    const wb = XLSX.utils.book_new();
    // Create a new worksheet
    //const ws = XLSX.utils.book_new();
    // Iterate through each table
    Object.keys(responseData).forEach((key, index) => {
      // Convert the table to a worksheet
      const wsTemp = XLSX.utils.table_to_sheet(document.getElementById(`table_${index}`));
      // Add the worksheet to the main worksheet
      XLSX.utils.book_append_sheet(wb, wsTemp, key);
    });
    // Save the workbook as an Excel file
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    saveAs(new Blob([excelBuffer], { type: 'application/octet-stream' }), 'AspirationalDistrictReport.xlsx');
  };
  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };
  const filterData = (data) => {
    return data.filter((district) => {
      const districtName = district.district_name.toLowerCase();
      return districtName.includes(searchTerm.toLowerCase());
    });
  };

  return (
    <div>
      {loading && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 9999,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <CircularProgress />
        </div>
      )}

      {dataAvilable && (
        <MainCard>
          <Typography variant="h2">
            Aspirational District Report
            <Button variant="contained" style={{ backgroundColor: '#8555a3', float: 'right' }} onClick={exportToExcel}>
              <DownloadIcon/>
              Excel
            </Button>
            <TextField
              label="Search By District Name"
              variant="standard"
              value={searchTerm}
              onChange={handleSearch}
              style={{ textAlign: 'center', width: '300px', float: 'right', marginRight: '20px' }}
            />
          </Typography>

          <Divider style={{ marginTop: '30px' }} />
          {Object.keys(responseData).map((key, index) => (
            <div key={key}>
              <Typography variant="h4" style={{ textAlign: 'center', marginTop: '20px', marginBottom: '20px', color: '#1672b9' }}>
                {key === 'mha_lwedistrict' && (
                  <Typography variant="h4" style={{ textAlign: 'center', marginTop: '20px', marginBottom: '10px', color: '#1672b9' }}>
                    MHA LWE District
                  </Typography>
                )}
                {key === 'nitiaayog' && (
                  <Typography variant="h4" style={{ textAlign: 'center', marginTop: '20px', marginBottom: '20px', color: '#1672b9' }}>
                    Niti Aayog District
                  </Typography>
                )}
                {key === 'min_backward' && (
                  <Typography variant="h4" style={{ textAlign: 'center', marginTop: '20px', marginBottom: '20px', color: '#1672b9' }}>
                    MIN Backward District
                  </Typography>
                )}
              </Typography>
              <TableContainer component={Paper}>
                <Table className={classes.table} aria-label="simple table" id={`table_${index}`}>
                  <TableHead>
                    <TableRow>
                      <TableCell>S.No</TableCell>
                      <TableCell>State</TableCell>
                      <TableCell>District Name</TableCell>
                      <TableCell>IGNOAPS</TableCell>
                      <TableCell>IGNWPS</TableCell>
                      <TableCell>IGNDPS</TableCell>
                      <TableCell>NFBS</TableCell>

                      <TableCell>Total</TableCell>
                      <TableCell>Total Aadhar</TableCell>
                      <TableCell>Bank A/C</TableCell>
                      <TableCell>Postal A/C</TableCell>
                      <TableCell>Bank / PO A/C</TableCell>
                      <TableCell>DBT</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filterData(Object.values(responseData[key])).map((district, index) => (
                      <TableRow key={district.district_name}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>{district.state_name}</TableCell>
                        <TableCell>{district.district_name}</TableCell>
                        <TableCell>{district.ignoaps}</TableCell>
                        <TableCell>{district.ignwps}</TableCell>
                        <TableCell>{district.igndps}</TableCell>
                        <TableCell>{district.nfbs}</TableCell>
                        <TableCell>{district.sum}</TableCell>
                        <TableCell>{district.totalAadhar}</TableCell>
                        <TableCell>{district.totalBankAc}</TableCell>
                        <TableCell>{district.totalPostAc}</TableCell>
                        <TableCell>{district.totalBankPostAcc}</TableCell>
                        <TableCell>{district.totalDbt}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </div>
          ))}
        </MainCard>
      )}
      {!!snackbar && (
        <Snackbar open anchorOrigin={{ vertical: 'top', horizontal: 'center' }} onClose={handleCloseSnackbar} autoHideDuration={8000}>
          <Alert {...snackbar} onClose={handleCloseSnackbar} />
        </Snackbar>
      )}
    </div>
  );
};

export default AspirationalDistrictReport;
