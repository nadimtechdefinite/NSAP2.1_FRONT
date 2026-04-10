import React, { useState, useEffect } from 'react';
import MainCard from 'ui-component/cards/MainCard';
import { FormControl, InputLabel, MenuItem, Select, Grid, Link } from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import axiosInstance from 'hooks/useAuthTokenUrl';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import Backdrop from '@mui/material/Backdrop';

const PFMSPaymentSummary = () => {
  const [computedPayableUpto, setComputedPayableUpto] = useState([]);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = React.useState(null);
  const handleCloseSnackbar = () => setSnackbar(null);
  const [selectedMonth, setSelectedMonth] = useState('0');
  const [selectedYear, setSelectedYear] = useState('0');
  const [schemeWiseFileCount, setSchemeWiseFileCount] = useState([]);
  const [fileWiseSummary, setFileWiseSummary] = useState([]);

  const columnSchemeWiseCount = [
    { field: 'schemeCode', headerName: 'Scheme Name', flex: 1 },
    {
      field: 'fileCount',
      headerName: 'Count',
      flex: 1,
      renderCell: (params) => (
        <div>
          {
            <Link color="#1e88e5" href="#" onClick={(e) => fileWiseSummaryForScheme(e, params.row.schemeCode)}>
              {params.row.fileCount}
            </Link>
          }
        </div>
      )
    }
  ];

  const columnFileWiseForScheme = [
    { field: 'districtName', headerName: 'District', width: 100 },
    { field: 'subDistrictName', headerName: 'Sub District', width: 100 },
    { field: 'area', headerName: 'Area', width: 50 },
    {
      field: 'fileName',
      headerName: 'File Name',
      width: 230,
      renderCell: (params) => (
        <div>
          {
            <Link color="#1e88e5" href="#" onClick={(e) => getFileDetailSummary(e, params.row.fileName)}>
              {params.row.fileName}
            </Link>
          }
        </div>
      )
    },
    { field: 'pendingSince', headerName: 'Pending Days', align: 'right', width: 125 },
    { field: 'status', headerName: 'Status', width: 125 },
    { field: 'noOfRecSent', headerName: 'Total No of Record Sent', align: 'right', width: 180 },
    { field: 'totAmt', headerName: 'Total Amount (in Lakh.)', align: 'right', width: 180 },
    { field: 'success', headerName: 'No of rec. Successfull', align: 'right', width: 180 },
    { field: 'sucAmt', headerName: 'Credit Amount (in Lakh.)', align: 'right', width: 180 },
    { field: 'failed', headerName: 'No. of rec. Unsuccessfull', align: 'right', width: 180 },
    { field: 'failAmt', headerName: 'Failed Amount(in Lakh.)', align: 'right', width: 180 },
    { field: 'balanceAmt', headerName: 'Balance Amount (in Lakh.)', align: 'right', width: 180 },
    { field: 'pending', headerName: 'No. of rec. Pending', align: 'right', width: 150 },
    { field: 'centerAmt', headerName: 'Total Center Amount(in Lakh.)', align: 'right', width: 200 },
    { field: 'responseDate', headerName: 'Last Reponse Date', width: 150 }
  ];

  const getPayableUpto = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('pfmsPaymentSummary/allComputedPayableUpto');
      console.log(JSON.stringify(response.data));
      setComputedPayableUpto(response.data);
    } catch (error) {
      setSnackbar({ children: 'Some Internal Error Occured While fetching computed Dates', severity: 'error' });
      console.error('Error fetching payable data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getPayableUpto();
  }, []);

  const handlePayableChange = async (event) => {
    setFileWiseSummary([]);
    setSchemeWiseFileCount([]);
    if (event.target.value == 0) {
      setSelectedMonth('0');
      setSelectedYear('0');
      return false;
    }
    const selected = computedPayableUpto.find((item) => item.id === event.target.value);
    setSelectedMonth(selected.monthCode);
    setSelectedYear(selected.year);
  };

  useEffect(() => {
    schemeWiseCountForPayable();
  }, [selectedMonth]);

  const schemeWiseCountForPayable = async () => {
    if (selectedMonth == '0') {
      return false;
    }
    const body = { year: selectedYear, monthCode: selectedMonth };
    try {
      setLoading(true);
      const response = await axiosInstance.post('pfmsPaymentSummary/schemeWiseCountForPayable', body);
      if (response.data.length > 0) {
        const newData = response.data.map((row) => ({ ...row, id: row.schemeCode }));
        setSchemeWiseFileCount(newData);
      } else {
        setSnackbar({ children: 'No File Has Been Generated Yet', severity: 'error' });
      }
    } catch (error) {
      if (error.response.data.monthCode) {
        setSnackbar({ children: error.response.data.monthCode, severity: 'error' });
      } else if (error.response.data.year) {
        setSnackbar({ children: error.response.data.year, severity: 'error' });
      } else {
        setSnackbar({ children: 'Some Internal Error Occured While Getting Files Summary', severity: 'error' });
      }
    } finally {
      setLoading(false);
    }
  };

  const fileWiseSummaryForScheme = async (e, schemeCode) => {
    e.preventDefault();

    const body = { year: selectedYear, monthCode: selectedMonth, schemeCode: schemeCode };
    try {
      setLoading(true);
      const response = await axiosInstance.post('pfmsPaymentSummary/selectedSchemeSummary', body);
      if (response.data.length > 0) {
        const newData = response.data.map((row) => ({ ...row, id: row.fileName }));
        setFileWiseSummary(newData);
      } else {
        setSnackbar({ children: 'No File Summary Found', severity: 'error' });
      }
    } catch (error) {
      if (error.response.data.monthCode) {
        setSnackbar({ children: error.response.data.monthCode, severity: 'error' });
      } else if (error.response.data.year) {
        setSnackbar({ children: error.response.data.year, severity: 'error' });
      } else if (error.response.data.schemeCode) {
        setSnackbar({ children: error.response.data.schemeCode, severity: 'error' });
      } else {
        setSnackbar({ children: 'Some Internal Error Occured While Getting Files Wise Summary', severity: 'error' });
      }

      // setSnackbar({ children: 'Some Internal Error Occured While Getting Files Wise Summary', severity: 'error' });
      // console.error('Error fetching generated file data:', error)
    } finally {
      setLoading(false);
    }
  };

  const getFileDetailSummary = async (e, fileName) => {
    e.preventDefault();

    // var result = window.confirm("If you want to download file with account number,Then press ok..!! It will be password protected file..!!and press cancel for normal download with mask account..!! Your password will be REQ and 8 remaing letters after REQ in your file name.");
    // var password=false;
    // if(result){
    // password=true;
    // }

    const body = { fileName: fileName };
    try {
      setLoading(true);
      const response = await axiosInstance.post('pfmsPaymentSummary/getFileDetailInExcel/' + false, body, {
        responseType: 'blob' // specify responseType as 'blob' for binary data
      });

      if (response.status == 204) {
        alert('No Data Available');
        return false;
      }

      const blob = new Blob([response.data], { type: 'application/octet-stream' });

      const link = document.createElement('a');

      link.href = window.URL.createObjectURL(blob);

      link.download = `${fileName}_data.xlsx`;

      document.body.appendChild(link);

      link.click();

      document.body.removeChild(link);

      window.URL.revokeObjectURL(link.href);
    } catch (error) {
      if (error.response.data.fileName) {
        setSnackbar({ children: error.response.data.fileName, severity: 'error' });
      } else {
        setSnackbar({ children: 'Some Internal Error Occured While fetching data', severity: 'error' });
      }

      // setSnackbar({ children: 'Some Internal Error Occured While fetching data', severity: 'error' });
      // console.error('Error fetching data:', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <MainCard title="PFMS Payment File Summary after August 2016">
        <Backdrop open={loading} style={{ zIndex: 999, color: '#fff' }}>
          <CircularProgress color="inherit" />
        </Backdrop>

        {!!snackbar && (
          <Snackbar open anchorOrigin={{ vertical: 'top', horizontal: 'center' }} onClose={handleCloseSnackbar} autoHideDuration={6000}>
            <Alert {...snackbar} onClose={handleCloseSnackbar} />
          </Snackbar>
        )}

        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <InputLabel id="payable-label" style={{ display: 'flex', alignItems: 'center' }}>
                Pension Amount Payable UpTo
              </InputLabel>
              <Select
                name="payable"
                id="payable"
                labelId="payable-label"
                label="Pension Amount Payable UpTo"
                onChange={(e) => {
                  handlePayableChange(e);
                }}
              >
                <MenuItem value="0">--Select Month And Year--</MenuItem>
                {computedPayableUpto.map((item) => (
                  <MenuItem key={item.id} value={item.id}>
                    {item.monthName} {item.year}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </MainCard>

      {schemeWiseFileCount.length > 0 && (
        <MainCard title="PFMS File Summary Scheme Wise">
          <DataGrid
            slots={{ toolbar: GridToolbar }}
            slotProps={{
              toolbar: {
                showQuickFilter: true
              }
            }}
            rows={schemeWiseFileCount}
            columns={columnSchemeWiseCount}
            disableRowSelectionOnClick
          />
        </MainCard>
      )}
      {fileWiseSummary.length > 0 && (
        <MainCard title="PFMS Files Summary">
          <DataGrid
            slots={{ toolbar: GridToolbar }}
            slotProps={{
              toolbar: {
                showQuickFilter: true
              }
            }}
            rows={fileWiseSummary}
            columns={columnFileWiseForScheme}
            disableRowSelectionOnClick
          />
        </MainCard>
      )}
    </>
  );
};

export default PFMSPaymentSummary;
