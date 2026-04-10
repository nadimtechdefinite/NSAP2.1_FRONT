import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Grid, Paper } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import axiosInstance from 'hooks/useAuthTokenUrl';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { GridToolbarQuickFilter } from '@mui/x-data-grid';

const CustomToolbarWithExportButton = ({ handleExportPdf }) => {
  return (
    <Box display="flex" justifyContent="space-between" alignItems="center" p={1}>
      <GridToolbarQuickFilter />
      <Button variant="contained" onClick={handleExportPdf}>
        Export PDF
      </Button>
    </Box>
  );
};

const UserLogReport = () => {
  const [userCode, setUserCode] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showTable, setShowTable] = useState(false);
  console.log(setLoading);
  const columnsUserLog = [
    {
      field: 'sno',
      headerName: 'S.No.',
      flex: 0.3,
      sortable: false,
      valueGetter: (params) => {
        return `${params.api.getAllRowIds().indexOf(params.id) + 1}`;
      }
    },
    {
      field: 'username',
      headerName: 'User Code',
      flex: 1,
      align: 'center',
      headerAlign: 'center'
    },
    {
      field: 'timestamp',
      headerName: 'Login Timestamp',
      flex: 1,
      align: 'center',
      headerAlign: 'center'
    },
    {
      field: 'ip',
      headerName: 'IP Address',
      flex: 1,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => (params.value && params.value.trim() !== '' ? params.value : 'Not Available')
    },
    {
      field: 'loginStatus',
      headerName: 'Login Status',
      flex: 1,
      align: 'center',
      headerAlign: 'center'
    }
  ];

  const handleExportPdf = () => {
    const doc = new jsPDF({ orientation: 'landscape' });

    doc.text('User Log Report', 14, 15);

    const headers = columnsUserLog.filter((col) => col.field && col.headerName).map((col) => col.headerName);

    const tableData = results.map((row) =>
      columnsUserLog
        .filter((col) => col.field && col.headerName)
        .map((col) => {
          if (col.valueGetter) {
            // Special handling for computed columns like S.No.
            return col.valueGetter({ api: { getAllRowIds: () => results.map((r) => r.userLoginLogId) }, id: row.userLoginLogId });
          }
          const value = row[col.field];
          return value && typeof value === 'string' ? value.trim() : value ?? '';
        })
    );

    const generatedDate = new Date().toLocaleDateString('en-IN');

    autoTable(doc, {
      startY: 20,
      head: [headers],
      body: tableData,
      styles: {
        fontSize: 8,
        cellPadding: 2
      },
      headStyles: {
        fillColor: [33, 150, 243],
        textColor: 255
      },
      didDrawPage: function () {
        const pageHeight = doc.internal.pageSize.height;
        doc.setFontSize(8);
        doc.setTextColor(100);
        doc.text(
          `Powered By NSAP-PPS - Delivering Reliable Pension Processing - https://nsap.nic.in/ on - ${generatedDate}`,
          14,
          pageHeight - 10
        );
      }
    });

    doc.save(`User_Log_Report_${new Date().toISOString().slice(0, 10)}.pdf`);
  };
  const handleSearch = async () => {
    //setLoading(true);

    try {
      const params = {};
      if (userCode) params.userCode = userCode;
      if (fromDate) params.fromDate = fromDate;
      if (toDate) params.toDate = toDate;

      const response = await axiosInstance.get('logs/userLog', { params });

      setResults(response.data);
      setShowTable(true); // show table after successful search
    } catch (error) {
      console.error('Error fetching user logs:', error);
      setResults([]);
      setShowTable(false); // hide table if search fails
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        User Log Report
      </Typography>

      <Grid container spacing={2} alignItems="center" mb={2}>
        <Grid item xs={12} sm={3}>
          <TextField
            label="User Code"
            variant="outlined"
            fullWidth
            value={userCode}
            onChange={(e) => setUserCode(e.target.value.toUpperCase().trimStart())}
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <TextField
            type="date"
            label="From Date"
            InputLabelProps={{ shrink: true }}
            fullWidth
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            inputProps={{
              max: new Date().toISOString().split('T')[0]
            }}
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <TextField
            type="date"
            label="To Date"
            InputLabelProps={{ shrink: true }}
            fullWidth
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            inputProps={{
              max: new Date().toISOString().split('T')[0]
            }}
          />
        </Grid>
        <Grid item xs={12} sm={1}>
          <Button variant="contained" color="primary" onClick={handleSearch} fullWidth>
            Search
          </Button>
        </Grid>
      </Grid>

      {showTable && (
        <Box mt={2}>
          <DataGrid
            autoHeight
            slots={{
              toolbar: (props) => <CustomToolbarWithExportButton {...props} handleExportPdf={handleExportPdf} />
            }}
            slotProps={{
              toolbar: {
                showQuickFilter: true,
                printOptions: {
                  disableToolbarButton: true
                }
              }
            }}
            rows={results}
            columns={columnsUserLog}
            pageSize={10}
            rowsPerPageOptions={[10, 25, 50]}
            getRowId={(row) => row.userLoginLogId}
            loading={loading}
            sx={{
              border: '1px solid #ccc', // Outer border
              '& .MuiDataGrid-columnHeaders': {
                backgroundColor: '#1976d2',
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
        </Box>
      )}
    </Paper>
  );
};

export default UserLogReport;
