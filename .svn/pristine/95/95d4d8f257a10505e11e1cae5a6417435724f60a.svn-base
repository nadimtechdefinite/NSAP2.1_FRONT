import React, { useState, useEffect } from 'react';
import { Grid, Button, CircularProgress, Snackbar, Alert, Backdrop, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import MonthList from 'components/form_components/MonthListForAdmin';
import axiosInstance from 'hooks/useAuthTokenUrl';

function AadharDigitizationPage() {
  // const [records, setRecords] = useState([]);
  const [financialYears, setFinancialYears] = useState([]);
  const [selectedFinancialYear, setSelectedFinancialYear] = useState('');
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState(null);
  const [month, setMonth] = useState('');
  const [tableData, setTableData] = useState([]);

  const handleCloseSnackbar = () => setSnackbar(null);

  useEffect(() => {
    fetchFinancialYears();
  }, []);

  const fetchFinancialYears = async () => {
    try {
      const response = await axiosInstance.get('aadharReports/getFinanceYears');
      setFinancialYears(response.data);
      setSelectedFinancialYear(response.data[0]?.finYear || '');
    } catch (error) {
      console.error('Error fetching financial years:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const monthMap = {
      JAN: 'JANUARY',
      FEB: 'FEBRUARY',
      MAR: 'MARCH',
      APR: 'APRIL',
      MAY: 'MAY',
      JUN: 'JUNE',
      JUL: 'JULY',
      AUG: 'AUGUST',
      SEP: 'SEPTEMBER',
      OCT: 'OCTOBER',
      NOV: 'NOVEMBER',
      DEC: 'DECEMBER'
    };

    const formattedMonth = monthMap[month];

    if (!selectedFinancialYear || !formattedMonth) {
      setSnackbar({ children: 'Please select both Financial Year and Month.', severity: 'error' });
      return;
    }

    try {
      setLoading(true);
      const response = await axiosInstance.get(
        `/aadharReports/aadharDigitizationReport?year=${selectedFinancialYear}&month=${formattedMonth}`
      );

      const formattedData = response.data.map((row, index) => ({
        ...row,
        id: row?.id?.stateCode || `${row?.stateName}-${index}` || index
      }));

      setTableData(formattedData || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      setSnackbar({ children: 'Error fetching data.', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { field: 'stateName', headerName: 'State Name', width: 220, flex: 1 },
    { field: 'schemeIGNOAPS', headerName: 'IGNOAPS', width: 120, flex: 1 },
    { field: 'schemeIGNWPS', headerName: 'IGNWPS', width: 120, flex: 1 },
    { field: 'schemeIGNDPS', headerName: 'IGNDPS', width: 120, flex: 1 },
    { field: 'schemeNFBS', headerName: 'NFBS', width: 120, flex: 1 },
    { field: 'totalBenCovered', headerName: 'Total No. of Beneficiary', width: 130, flex: 1 },
    { field: 'totalAvailableNsapMis', headerName: 'Data Digitization On NSAP-Mis', width: 120, flex: 1 },
    { field: 'totalAadharSeeding', headerName: 'Total No. of Aadhaar Seeding', width: 120, flex: 1 },
    { field: 'percentAadharEnrolled', headerName: '% of Aadhar Enrolment of Beneficiary', width: 120, flex: 1 }
  ];

  return (
    <form onSubmit={handleSubmit}>
      <Backdrop open={loading} style={{ zIndex: 999, color: '#fff' }}>
        <CircularProgress color="inherit" />
      </Backdrop>

      {snackbar && (
        <Snackbar open onClose={handleCloseSnackbar} autoHideDuration={4000}>
          <Alert {...snackbar} onClose={handleCloseSnackbar} />
        </Snackbar>
      )}

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel id="fin-year-label">Financial Year</InputLabel>
            <Select
              labelId="fin-year-label"
              id="finYear"
              value={selectedFinancialYear}
              onChange={(e) => setSelectedFinancialYear(e.target.value)}
              label="Financial Year"
              required
            >
              {financialYears.map((item) => (
                <MenuItem key={item.finYear} value={item.finYear}>
                  {item.finYear}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <MonthList onSelectMonth={(val) => setMonth(val)} isMendatory={true} />
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <Button type="submit" variant="contained" color="primary">
            Show Data
          </Button>
        </Grid>
      </Grid>

      {tableData.length > 0 && (
        <div style={{ marginTop: 20 }}>
          <DataGrid
            rows={tableData}
            columns={columns}
            autoHeight
            pageSize={10}
            rowsPerPageOptions={[10, 20, 50]}
            disableSelectionOnClick
            sx={{
              border: '1px solid #ccc',
              '& .MuiDataGrid-columnHeaders': {
                backgroundColor: '#f5f5f5',
                fontWeight: 'bold',
                whiteSpace: 'nowrap',
                borderBottom: '1px solid #ccc'
              },
              '& .MuiDataGrid-cell': {
                borderRight: '1px solid #ccc'
              },
              '& .MuiDataGrid-row': {
                borderBottom: '1px solid #ccc'
              }
            }}
          />
        </div>
      )}
    </form>
  );
}

export default AadharDigitizationPage;
