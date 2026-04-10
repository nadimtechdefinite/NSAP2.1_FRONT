import React, { useState } from 'react';
import { Box, Button, TextField, Typography, CircularProgress } from '@mui/material';
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

const OtpReport = () => {
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [tableVisible, setTableVisible] = useState(false);

  const columns = [
    { field: 'id', headerName: 'S.No', flex: 1, headerAlign: 'left', align: 'left' },
    { field: 'monthName', headerName: 'Month', flex: 1, headerAlign: 'center', align: 'center' },
    { field: 'year', headerName: 'Year', flex: 1, headerAlign: 'center', align: 'center' },
    { field: 'otpLog', headerName: 'OTP Log', flex: 1, headerAlign: 'center', align: 'center' },
    { field: 'messageOtp', headerName: 'Message OTP', flex: 1, headerAlign: 'center', align: 'center' },
    { field: 'mobileOtpLog', headerName: 'Mobile OTP', flex: 1, headerAlign: 'center', align: 'center' }
  ];

  const handleExportPdf = () => {
    const doc = new jsPDF({ orientation: 'landscape' });

    doc.text('Mobile OTP Summary Report', 14, 15);

    const headers = columns.filter((col) => col.field && col.headerName).map((col) => col.headerName);

    const tableData = data.map((row) =>
      columns
        .filter((col) => col.field && col.headerName)
        .map((col) => {
          if (col.field === 'numberOfWidowBeneficiaryGettingMarried') {
            return 0;
          }
          return row[col.field] ?? '';
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

    doc.save(`Mobile_OTP_Report_${new Date().toISOString().slice(0, 10)}.pdf`);
  };

  const handleSearch = async () => {
    if (!fromDate || !toDate) {
      alert('Please select both From Date and To Date');
      return;
    }

    try {
      setLoading(true);
      setTableVisible(false);
      const response = await axiosInstance.get('logs/messageMobileOTP', {
        params: {
          fromDate: fromDate.trim(),
          toDate: toDate.trim()
        }
      });
      console.log(response);
      const withIds = response.data.map((row, index) => ({ ...row, id: index + 1 }));

      setData(withIds);
      setTableVisible(true);
    } catch (error) {
      console.error('Error fetching OTP report:', error);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box p={3}>
      <Typography variant="h6" gutterBottom>
        OTP Summary Report
      </Typography>

      <Box display="flex" gap={2} alignItems="center" mb={2}>
        <TextField
          label="From Date"
          type="date"
          InputLabelProps={{ shrink: true }}
          value={fromDate}
          onChange={(e) => setFromDate(e.target.value)}
          inputProps={{
            max: new Date().toISOString().split('T')[0]
          }}
        />
        <TextField
          label="To Date"
          type="date"
          InputLabelProps={{ shrink: true }}
          value={toDate}
          onChange={(e) => setToDate(e.target.value)}
          inputProps={{
            max: new Date().toISOString().split('T')[0]
          }}
        />
        <Button variant="contained" color="primary" onClick={handleSearch}>
          Search
        </Button>
      </Box>

      {loading && (
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress />
        </Box>
      )}

      {tableVisible && (
        <Box mt={2}>
          <DataGrid
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
            rows={data}
            columns={columns}
            pageSize={10}
            rowsPerPageOptions={[10, 25, 50]}
            autoHeight
            disableSelectionOnClick
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
    </Box>
  );
};

export default OtpReport;
