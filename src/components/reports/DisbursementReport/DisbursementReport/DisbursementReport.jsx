import React, { useState, useEffect } from 'react';
import { Button, Grid, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import MainCard from 'ui-component/cards/MainCard';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import axiosInstance from 'hooks/useAuthTokenUrl';

import StateDropdown from 'components/form_components/StateList';

const DisbursementReportFilter = () => {
  const [stateCode, setStateCode] = useState('');
  const [schemeCode, setSchemeCode] = useState('');
  const [dataSource, setDataSource] = useState('');
  const [finYearList, setFinYearList] = useState([]);

  const [finYear, setFinYear] = useState('');
  const [monthYear, setMonthYear] = useState('ALL');
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState('ALL');

  const monthMap = {
    JAN: '01',
    FEB: '02',
    MAR: '03',
    APR: '04',
    MAY: '05',
    JUN: '06',
    JUL: '07',
    AUG: '08',
    SEP: '09',
    OCT: '10',
    NOV: '11',
    DEC: '12'
  };
  useEffect(() => {
    axiosInstance
      .get('/disbursementReport/financialYears')
      .then((response) => {
        const years = response.data.map((y) => ({
          label: y,
          value: y
        }));

        setFinYearList(years);

        if (years.length > 0) {
          setFinYear(years[0].value);
        }
      })
      .catch((error) => {
        console.error('Error fetching financial years', error);
      });
  }, []);

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await axiosInstance.get('/disbursementReport/disbursementReport', {
        params: {
          stateCode: stateCode?.toLowerCase() === 'all' ? 'all' : stateCode,
          schemeCode: schemeCode?.toLowerCase() === 'all' ? 'all' : schemeCode,
          dataSource,
          finYear,
          monthYear: monthYear?.toLowerCase() === 'all' ? 'all' : monthYear,
          creationDate: null
        }
      });

      const list = res.data.reportList || [];

      const withIds = list.map((row, index) => ({
        id: index + 1,
        ...row
      }));

      setReportData(withIds);
    } catch (err) {
      setError(err.response?.data?.message || 'Error fetching report');
    } finally {
      setLoading(false);
    }
  };

  {
    loading && <p>Loading...</p>;
  }
  {
    error && <p style={{ color: 'red' }}>{error}</p>;
  }

  const columns = [
    //  { field: 'id', headerName: 'Sr. No', width: 90 },
    { field: 'stateName', headerName: 'State Name', flex: 2 },
    { field: 'scheme_code', headerName: 'Scheme Code', flex: 1 },
    { field: 'apbCount', headerName: 'APB Count', flex: 1 },
    { field: 'apbAmt', headerName: 'APB Amount', flex: 1 },
    { field: 'neftCount', headerName: 'NEFT Count', flex: 1 },
    { field: 'neftAmt', headerName: 'NEFT Amount', flex: 1 },
    { field: 'poCount', headerName: 'PO Count', flex: 1 },
    { field: 'poAmt', headerName: 'PO Amount', flex: 1 },
    { field: 'moCount', headerName: 'MO Count', flex: 1 },
    { field: 'moAmt', headerName: 'MO Amount', flex: 1 },
    { field: 'cashCount', headerName: 'Cash Count', flex: 1 },
    { field: 'cashAmt', headerName: 'Cash Amount', flex: 1 },
    { field: 'totalCount', headerName: 'Total Count', flex: 1 },
    { field: 'totalAmt', headerName: 'Total Amount', flex: 1 }
  ];

  const columnGroupingModel = [
    {
      groupId: 'info',
      headerName: 'Info',
      children: [{ field: 'stateName' }, { field: 'scheme_code' }]
    },
    {
      groupId: 'dbt',
      headerName: 'DBT',
      children: [
        {
          groupId: 'aadhaarBased',
          headerName: 'Aadhaar Based Payment',
          children: [
            { field: 'apbCount', headerName: 'Total Transactions' },
            { field: 'apbAmt', headerName: 'Amount (Rs.)' }
          ]
        },
        {
          groupId: 'accountBased',
          headerName: 'Account Based Payment',
          children: [
            { field: 'neftCount', headerName: 'Total Transactions' },
            { field: 'neftAmt', headerName: 'Amount (Rs.)' }
          ]
        }
      ]
    },
    {
      groupId: 'nonDbt',
      headerName: 'NON-DBT',
      children: [
        {
          groupId: 'postOffice',
          headerName: 'Post Office',
          children: [
            { field: 'poCount', headerName: 'Total Transactions' },
            { field: 'poAmt', headerName: 'Amount (Rs.)' }
          ]
        },
        {
          groupId: 'moneyOrder',
          headerName: 'Money Order',
          children: [
            { field: 'moCount', headerName: 'Total Transactions' },
            { field: 'moAmt', headerName: 'Amount (Rs.)' }
          ]
        },
        {
          groupId: 'cash',
          headerName: 'Cash',
          children: [
            { field: 'cashCount', headerName: 'Total Transactions' },
            { field: 'cashAmt', headerName: 'Amount (Rs.)' }
          ]
        }
      ]
    },
    {
      groupId: 'totals',
      headerName: 'Totals',
      children: [
        { field: 'totalCount', headerName: 'Total Transactions' },
        { field: 'totalAmt', headerName: 'Total Amount (Rs.)' }
      ]
    }
  ];

  return (
    <MainCard title="Disbursement Report">
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={4}>
          <StateDropdown value={stateCode} onSelectState={(selected) => setStateCode(selected)} showAllIndex={true} />
        </Grid>
        <Grid
          item
          xs={12}
          sm={6}
          md={4}
          sx={{
            '& .MuiFormControl-root, & .MuiInputBase-root': { width: '100%' },
            '& .MuiFormControl-root': { minWidth: 320 }
          }}
        >
          <FormControl fullWidth>
            <InputLabel id="scheme-name">Scheme</InputLabel>
            <Select
              labelId="scheme-name"
              id="schemeCode"
              name="schemeCode"
              value={schemeCode}
              onChange={(e) => setSchemeCode(e.target.value)}
            >
              <MenuItem value="all">ALL</MenuItem>
              <MenuItem value="IGNOAPS">IGNOAPS</MenuItem>
              <MenuItem value="IGNWPS">IGNWPS</MenuItem>
              <MenuItem value="IGNDPS">IGNDPS</MenuItem>
              <MenuItem value="NFBS">NFBS</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <FormControl fullWidth>
            <InputLabel>Data Source</InputLabel>
            <Select value={dataSource} onChange={(e) => setDataSource(e.target.value)}>
              <MenuItem value="bharat">Bharat Portal</MenuItem>
              <MenuItem value="nsap">Pushed Bharat Data</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid
          item
          xs={12}
          sm={6}
          md={4}
          sx={{
            '& .MuiFormControl-root, & .MuiInputBase-root': { width: '100%' },
            '& .MuiFormControl-root': { minWidth: 320 }
          }}
        >
          <FormControl fullWidth>
            <InputLabel>Financial Year</InputLabel>
            <Select value={finYear} onChange={(e) => setFinYear(e.target.value)}>
              {finYearList.map((year, index) => (
                <MenuItem key={index} value={year.value || year}>
                  {year.label || year}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid
          item
          xs={12}
          sm={6}
          md={4}
          sx={{
            '& .MuiFormControl-root, & .MuiInputBase-root': { width: '100%' },
            '& .MuiFormControl-root': { minWidth: 320 }
          }}
        >
          <FormControl fullWidth>
            <InputLabel id="month-label">Payable Upto</InputLabel>
            <Select
              labelId="month-label"
              value={selectedMonth}
              onChange={(e) => {
                const selected = e.target.value;
                setSelectedMonth(selected);

                if (selected === 'ALL') {
                  setMonthYear('all');
                } else {
                  const monthNumber = monthMap[selected];
                  setMonthYear(monthNumber);
                }
              }}
            >
              <MenuItem value="ALL">ALL</MenuItem>
              {Object.keys(monthMap).map((name) => (
                <MenuItem key={name} value={name}>
                  {name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6} md={4} display="flex" alignItems="center">
          <Button
            variant="contained"
            color="secondary"
            onClick={handleSubmit}
            disabled={!stateCode || !schemeCode || !finYear || !monthYear}
          >
            Submit
          </Button>
        </Grid>
      </Grid>
      {reportData.length > 0 && (
        <div style={{ height: 600, width: '100%', marginTop: 16 }}>
          <DataGrid
            rows={reportData}
            columns={columns}
            getRowId={(row, index) => row.id || `${row.stateName || 'TOTAL'}-${row.scheme_code || 'SCHEME'}-${index}`} // adjust to your unique field
            experimentalFeatures={{ columnGrouping: true }}
            columnGroupingModel={columnGroupingModel}
            slots={{
              toolbar: GridToolbar
            }}
            sx={{
              '& .MuiDataGrid-columnHeaders': {
                backgroundColor: '#1976d2',
                color: 'white',
                borderBottom: '2px solid #ddd'
              },
              '& .MuiDataGrid-columnHeader, & .MuiDataGrid-cell': {
                borderRight: '1px solid #ddd'
              },
              '& .MuiDataGrid-columnHeader:last-child, & .MuiDataGrid-cell:last-child': {
                borderRight: 'none'
              },
              '& .MuiDataGrid-columnHeaderTitleContainer': {
                justifyContent: 'center'
              }
            }}
          />
        </div>
      )}
    </MainCard>
  );
};

export default DisbursementReportFilter;
