import React, { useState, useEffect } from 'react';
import { Grid, Button, CircularProgress, Snackbar, Alert, Backdrop, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import MonthList from 'components/form_components/MonthListForAdmin';
import axiosInstance from 'hooks/useAuthTokenUrl';

function SchemeWiseFundReport() {
  const [financialYears, setFinancialYears] = useState([]);
  const [selectedFinancialYear, setSelectedFinancialYear] = useState('');
  const [month, setMonth] = useState('');
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState(null);
  const [tableData, setTableData] = useState([]);

  const handleCloseSnackbar = () => setSnackbar(null);

  useEffect(() => {
    fetchFinancialYears();
  }, []);

  const fetchFinancialYears = async () => {
    try {
      const response = await axiosInstance.get('annualVerificationSummary/getFinanceYears');
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

    const fullMonthName = monthMap[month]; // ✅ use latest selected month

    console.log('monthhhhh', fullMonthName);

    if (!selectedFinancialYear || !month) {
      setSnackbar({ children: 'Please select both Financial Year and Month.', severity: 'error' });
      return;
    }

    try {
      setLoading(true);
      const response = await axiosInstance.post('/reports/getFundReleaseData', {
        finYear: selectedFinancialYear,
        fundMonth: fullMonthName
      });

      setTableData(response.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      setSnackbar({ children: 'Error fetching data.', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const exportToExcel = () => {
    const headers = ['State Code', 'State Name', 'Total Funds Released (Rs in Lakh)', 'IGNOAPS', 'IGNWPS', 'IGNDPS', 'NFBS', 'Annapurna'];

    const exportData = tableData.map((row) => ({
      'State Code': row.stateCode,
      'State Name': row.stateName,
      'Total Funds Released (Rs in Lakh)': Number(row.totalFundReleased).toLocaleString('en-IN'),
      IGNOAPS: Number(row.schemeIGNOAPS).toLocaleString('en-IN'),
      IGNWPS: Number(row.schemeIGNWPS).toLocaleString('en-IN'),
      IGNDPS: Number(row.schemeIGNDPS).toLocaleString('en-IN'),
      NFBS: Number(row.schemeNFBS).toLocaleString('en-IN'),
      Annapurna: Number(row.schemeAnnapurna).toLocaleString('en-IN')
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData, { header: headers });
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'SchemewiseFund');

    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });

    saveAs(blob, `schemewise_fund_${selectedFinancialYear}_${month}.xlsx`);
  };

  const columns = [
    { field: 'stateCode', headerName: 'State Code', flex: 0.8 },
    { field: 'stateName', headerName: 'State Name', flex: 1.5 },
    {
      field: 'totalFundReleased',
      headerName: 'Total Funds Released (Rs in Lakh)',
      type: 'number',
      flex: 1.5,
      valueFormatter: ({ value }) => Number(value).toLocaleString('en-IN')
    },
    {
      field: 'schemeIGNOAPS',
      headerName: 'IGNOAPS',
      type: 'number',
      flex: 1,
      valueFormatter: ({ value }) => Number(value).toLocaleString('en-IN')
    },
    {
      field: 'schemeIGNWPS',
      headerName: 'IGNWPS',
      type: 'number',
      flex: 1,
      valueFormatter: ({ value }) => Number(value).toLocaleString('en-IN')
    },
    {
      field: 'schemeIGNDPS',
      headerName: 'IGNDPS',
      type: 'number',
      flex: 1,
      valueFormatter: ({ value }) => Number(value).toLocaleString('en-IN')
    },
    {
      field: 'schemeNFBS',
      headerName: 'NFBS',
      type: 'number',
      flex: 1,
      valueFormatter: ({ value }) => Number(value).toLocaleString('en-IN')
    },
    {
      field: 'schemeAnnapurna',
      headerName: 'Annapurna',
      type: 'number',
      flex: 1,
      valueFormatter: ({ value }) => Number(value).toLocaleString('en-IN')
    }
  ];

  const rows = tableData.map((row, index) => ({ id: index + 1, ...row }));

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
        {/* Financial Year Dropdown */}
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

        {/* Month Dropdown */}
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <MonthList onSelectMonth={(val) => setMonth(val)} isMendatory={true} />
          </FormControl>
        </Grid>

        {/* Submit Button */}
        <Grid item xs={12}>
          <Button type="submit" variant="contained" color="primary">
            Show Data
          </Button>
        </Grid>

        {/* Excel Download */}
        {tableData.length > 0 && (
          <Grid item xs={12} style={{ textAlign: 'right' }}>
            <Button variant="contained" color="primary" onClick={exportToExcel}>
              Download as Excel
            </Button>
          </Grid>
        )}
      </Grid>

      {/* DataGrid Display */}
      {tableData.length > 0 && (
        <div style={{ marginTop: 20 }}>
          <DataGrid
            rows={rows}
            columns={columns}
            autoHeight
            pageSize={10}
            rowsPerPageOptions={[10, 20, 50]}
            disableSelectionOnClick
            sx={{
              border: '1px solid #ccc', // Outer border
              '& .MuiDataGrid-columnHeaders': {
                backgroundColor: '#2989d8',
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

export default SchemeWiseFundReport;
