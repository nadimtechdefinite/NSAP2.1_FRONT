import React, { useState } from 'react';
import {
  Grid,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Snackbar,
  Alert,
  CircularProgress,
  Backdrop,
  TextField
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import axiosInstance from 'hooks/useAuthTokenUrl';
import StateList from 'components/form_components/StateList';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

function BeneficiaryRegistrationFile() {
  const [selectedStateId, setSelectedState] = useState('');
  const [fileType, setFileType] = useState('');
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState(null);
  const [tableData, setTableData] = useState([]);
  const [pendingDays, setPendingDays] = useState(7);

  const handleCloseSnackbar = () => setSnackbar(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const actualStateCode = selectedStateId === 'ALL' ? '' : selectedStateId;

    if (!actualStateCode && fileType === '') {
      setSnackbar({ children: 'Please select both State and File Type.', severity: 'error' });
      return;
    }
    try {
      setLoading(true);
      const response = await axiosInstance.post('/BeneficiaryRegistrationFile/getRegistrationFileData', {
        stateCode: actualStateCode,
        fileType,
        pendingDays: Number(pendingDays)
      });

      setTableData(response.data || []);
    } catch (error) {
      setSnackbar({ children: 'Error fetching data.', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };
  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(tableData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Beneficiaries');

    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: 'application/octet-stream' });

    saveAs(data, `beneficiary_data_${fileType.replace(/\s/g, '_')}_${selectedStateId}.xlsx`);
  };

  const columns = [
    { field: 'stateCode', headerName: 'State Code', flex: 1 },
    { field: 'stateName', headerName: 'State Name', flex: 1 },
    { field: 'file_type', headerName: 'File Type', flex: 1 },
    { field: 'request_date', headerName: 'Request Date', flex: 1 },
    { field: 'response_date', headerName: 'Response Date', flex: 1 },
    { field: 'status', headerName: 'Status', flex: 1 },
    { field: 'file_name', headerName: 'File Name', flex: 1 },
    { field: 'scheme_code', headerName: 'Scheme Code', flex: 1 },
    { field: 'no_of_rec_sent', headerName: 'Records Sent', flex: 1 },
    { field: 'no_of_succ_rec', headerName: 'Successful Records', flex: 1 },
    { field: 'no_of_unsuc_rec', headerName: 'Unsuccessful Records', flex: 1 },
    { field: 'pending_since', headerName: 'Pending Since (Days)', flex: 1 },
    { field: 'pending_record', headerName: 'Pending Records', flex: 1 },
    { field: 'file_sent_status', headerName: 'File Sent Status', flex: 1 },
    { field: 'deemed_status', headerName: 'Deemed Status', flex: 1 },
    { field: 'regFileDone', headerName: 'Registration File Done', flex: 1 },
    { field: 'payFileDone', headerName: 'Payment File Done', flex: 1 }
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
        {/* State Dropdown */}
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <StateList onSelectState={(stateId) => setSelectedState(stateId)} showAllIndex={true} isMandatory={true} />
          </FormControl>
        </Grid>

        {/* File Type Dropdown */}
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel id="file-type-label">File Type</InputLabel>
            <Select labelId="file-type-label" id="fileType" value={fileType} onChange={(e) => setFileType(e.target.value)}>
              <MenuItem value="CPSMS Id Request">Registration File</MenuItem>
              <MenuItem value="CPSMS Payment Request">Payment File</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        {/* Pending Days Input */}
        <Grid item xs={12} sm={6}>
          <TextField
            id="pendingDays"
            label="Pending Days"
            type="number"
            value={pendingDays}
            onChange={(e) => setPendingDays(Number(e.target.value))}
            inputProps={{ min: 0 }}
            fullWidth
            variant="outlined"
          />
        </Grid>

        {/* Submit Button */}
        <Grid item xs={12}>
          <Button type="submit" variant="contained" color="primary">
            Show Data
          </Button>
        </Grid>
      </Grid>

      {/* DataGrid display and Export button */}
      {tableData.length > 0 && (
        <div style={{ marginTop: 20 }}>
          {/* Download Button on Top-Right */}
          <Grid container justifyContent="flex-end" style={{ marginBottom: '10px' }}>
            <Grid item>
              <Button variant="contained" color="primary" onClick={exportToExcel}>
                Download as Excel
              </Button>
            </Grid>
          </Grid>

          <DataGrid rows={rows} columns={columns} autoHeight pageSize={10} rowsPerPageOptions={[10, 20, 50]} disableSelectionOnClick />
        </div>
      )}
    </form>
  );
  
}

export default BeneficiaryRegistrationFile;
