import React, { useState, useEffect } from 'react';
import MainCard from 'ui-component/cards/MainCard';
import {
  Button,
  Box,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import axiosInstance from 'hooks/useAuthTokenUrl';
import SubDistrictCommon from 'components/common/SubDistrictCommon';
import CircularProgress from '@mui/material/CircularProgress';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import Backdrop from '@mui/material/Backdrop';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { styled } from '@mui/material/styles';
import { getSignedXMLFile } from 'components/digitalSignature/getSignedXMLFile';

const PushPaymentFile = () => {
  const [locationOptionValues, setLocationOptionValues] = useState({});
  const [pendingPaymentFileList, setPendingPaymentFileList] = useState([]);
  const [computedPayableUpto, setComputedPayableUpto] = useState([]);
  const [mode, setMode] = useState('nondbt');
  const [selectedMonth, setSelectedMonth] = useState('0');
  const [selectedYear, setSelectedYear] = useState('0');
  const [computationLevel, setComputationLevel] = useState('D');
  const [loading, setLoading] = useState(false);
  const [disbursementData, setDisbursementData] = useState([]);
  const [modalState, setModalState] = useState(false);
  const [rejectState, setRejectState] = useState(false);
  const [viewState, setViewState] = useState(false);
  const [snackbar, setSnackbar] = React.useState(null);
  const handleCloseSnackbar = () => setSnackbar(null);
  const [xmlData, setXMLData] = useState({});

  const handleClose = () => {
    setModalState(false);
  };

  const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
      padding: theme.spacing(2)
    },
    '& .MuiDialogActions-root': {
      padding: theme.spacing(1)
    }
  }));

  const columnForRejectModal = [
    { field: 'sanctionOrderNo', headerName: 'Sanction Order No', width: 125 },
    { field: 'cpsmsBeneficiaryId', headerName: 'PFMS Id No.', width: 125 },
    { field: 'applicantName', headerName: 'Applicant Name', width: 125 },
    { field: 'pfmsBankPoAccount', headerName: 'Bank Po Account No', flex: 1 },
    { field: 'pfmsIfscCode', headerName: 'IFSC Code', flex: 1 },
    { field: 'pfmsBankName', headerName: 'Bank Name', flex: 1 },
    { field: 'pfmsUidNo', headerName: 'Aadhaar No.', flex: 1 },
    { field: 'addtlInf', headerName: 'Rejection Reason', width: 150 }
  ];

  const columnForViewModal = [
    { field: 'sanctionOrderNo', headerName: 'Sanction Order No', width: 125 },
    { field: 'cpsmsBeneficiaryId', headerName: 'PFMS Id No.', width: 125 },
    { field: 'applicantName', headerName: 'Applicant Name', width: 125 },
    { field: 'fatherHusbandName', headerName: 'Father Husband Name', flex: 1 },
    { field: 'pfmsPaymentFlag', headerName: 'Payment Flag', flex: 1 },
    { field: 'pfmsBankPoAccount', headerName: 'Bank Po Account No', flex: 1 },
    { field: 'pfmsIfscCode', headerName: 'IFSC Code', flex: 1 },
    { field: 'pfmsBankName', headerName: 'Bank Name', flex: 1 },
    { field: 'centerAmountDue', headerName: 'Center Amount', flex: 1 },
    { field: 'stateAmountDue', headerName: 'State Amount', flex: 1 },
    { field: 'totAmount', headerName: 'Total Amount', flex: 1 },
    { field: 'fromDate', headerName: 'From Date', width: 125 },
    { field: 'toDate', headerName: 'To Date', width: 125 }
  ];

  const columns = [
    { field: 'districtName', headerName: 'District Name', width: 125 },
    { field: 'payableUpto', headerName: 'Payable Upto', width: 125 },
    { field: 'fileName', headerName: 'File Name', width: 250 },
    { field: 'noOfRecSent', headerName: 'Total Record', width: 125 },
    { field: 'totalAmount', headerName: 'Total Amount (in Lakh)', width: 170 },
    { field: 'processed', headerName: 'Processed', width: 125 },
    { field: 'pendingRecord', headerName: 'Pending', width: 125 },
    { field: 'noOfSuccRec', headerName: 'Success', width: 125 },
    { field: 'noOfUnsucRec', headerName: 'Rejected', width: 125 },
    { field: 'deemedStatus', headerName: 'Deemed Status', width: 125 },
    { field: 'status', headerName: 'Status', width: 80 },
    {
      field: 'fileSentStatus',
      headerName: ' File Action',
      headerAlign: 'center',
      width: 180,
      renderCell: (params) => (
        <div>
          {
            <Button
              variant="outlined"
              color="primary"
              style={{ cursor: 'pointer', fontSize: '12px', marginRight: '8px' }}
              onClick={(e) => getViewRejectedPensionerDetails(e, params.row.fileName, 'VIEW')}
            >
              View
            </Button>
          }
          {params.row.signing ? (
            params.row.signedStatus != 'signed' ? (
              Object.keys(xmlData).length > 0 ? (
                <Button
                  variant="outlined"
                  color="primary"
                  style={{ cursor: 'pointer', fontSize: '12px', marginRight: '8px' }}
                  onClick={(e) => signXMLFile(e, params.row.fileName)}
                >
                  Confirm
                </Button>
              ) : (
                <Button
                  variant="outlined"
                  color="primary"
                  style={{ cursor: 'pointer', fontSize: '12px', marginRight: '8px' }}
                  onClick={(e) => getXMLFile(e, params.row.fileName)}
                >
                  Sign File
                </Button>
              )
            ) : (
              params.row.fileSentStatus == 'NotSent' && (
                <Button
                  variant="outlined"
                  color="primary"
                  style={{ cursor: 'pointer', fontSize: '12px', marginRight: '8px' }}
                  onClick={(e) => sentXmlToPFMS(e, params.row.fileName)}
                >
                  Sent File
                </Button>
              )
            )
          ) : (
            params.row.fileSentStatus == 'NotSent' && (
              <Button
                variant="outlined"
                color="primary"
                style={{ cursor: 'pointer', fontSize: '12px', marginRight: '8px' }}
                onClick={(e) => sentXmlToPFMS(e, params.row.fileName)}
              >
                Sent File
              </Button>
            )
          )}
          {/* {  
      params.row.fileSentStatus=="NotSent" &&
      (<Button variant="outlined" color="primary" style={{ cursor: 'pointer', fontSize: '12px',  marginRight: '8px' }} 
                onClick={(e) => sentXmlToPFMS(e,params.row.fileName)} >
        Sent File
      </Button>)
      } */}
          {params.row.fileSentStatus != 'NotSent' && params.row.fileStatus == 'RJCT' && (
            <Button
              variant="outlined"
              color="error"
              style={{ cursor: 'pointer', fontSize: '12px', marginRight: '8px' }}
              onClick={(e) => getViewRejectedPensionerDetails(e, params.row.fileName, 'RJCT')}
            >
              Rejected
            </Button>
          )}
        </div>
      )
    }
  ];

  const getComputationLevel = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('genAndPushPayment/getComputationLevel');
      setComputationLevel(response.data);
    } catch (error) {
      setSnackbar({ children: 'Some Internal Error Occured While Getting Computation Level', severity: 'error' });
      console.error('Error Occured While Computation Level:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getComputationLevel();
  }, []);

  const handlePayableChange = (event) => {
    console.log('ssss' + event.target.value);

    if (event.target.value == 0) {
      setSelectedMonth('0');
      setSelectedYear('0');
      return false;
    }

    const selected = computedPayableUpto.find((item) => item.id === event.target.value);
    setSelectedMonth(selected.monthCode);
    setSelectedYear(selected.year);
  };

  const getPendingPaymentFileStatus = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('genAndPushPayment/getPendingPaymentFileStatus');
      const newData = response.data.map((row) => ({ ...row, id: row.fileId }));
      setPendingPaymentFileList(newData);
    } catch (error) {
      setSnackbar({ children: 'Some Internal Error Occured While Getting Pending Files', severity: 'error' });
      console.error('Error fetching generated file data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPayableUpto = async () => {
    setComputedPayableUpto([]);
    if (computationLevel == 'SD' && locationOptionValues.subDistrictMunicipalAreaCode == null) {
      return false;
    } else if (
      computationLevel == 'D' &&
      (locationOptionValues.subDistrictMunicipalAreaCode != null || locationOptionValues.ruralUrbanArea != null)
    ) {
      return false;
    }
    try {
      const body = { ...locationOptionValues };
      setLoading(true);
      const response = await axiosInstance.post('genAndPushPayment/computedPayableUpto', body);
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
    getPendingPaymentFileStatus();
  }, []);

  useEffect(() => {
    setSelectedMonth('0');
    setSelectedYear('0');
    // console.log(JSON.stringify(computedPayableUpto)+"");
    getPayableUpto();
  }, [locationOptionValues.subDistrictMunicipalAreaCode, locationOptionValues.districtCode]);

  const downloadDataInExcel = async (e) => {
    e.preventDefault();

    // console.log(computationLevel+"ll=v"+locationOptionValues.districtCode+"ar"+locationOptionValues.ruralUrbanArea+"sbd"+locationOptionValues.subDistrictMunicipalAreaCode);

    if (selectedMonth == '0') {
      setSnackbar({ children: 'Please Select Pension Amount Payable Upto', severity: 'error' });
      return false;
    }
    if (mode == '') {
      setSnackbar({ children: 'Please Select Disburse Mode', severity: 'error' });
      return false;
    }
    if (computationLevel == 'SD' && locationOptionValues.subDistrictMunicipalAreaCode == null) {
      setSnackbar({ children: 'Please Select Upto SubDistrict only', severity: 'error' });
      return false;
    } else if (
      computationLevel == 'D' &&
      (locationOptionValues.subDistrictMunicipalAreaCode != null || locationOptionValues.ruralUrbanArea != null)
    ) {
      setSnackbar({ children: 'Please Select Upto District only', severity: 'error' });
      return false;
    }

    const body = { year: selectedYear, mode, monthCode: selectedMonth, ...locationOptionValues };
    try {
      setLoading(true);
      const response = await axiosInstance.post('genAndPushPayment/computedData/' + mode, body, {
        responseType: 'blob' // specify responseType as 'blob' for binary data
      });

      if (response.status == 204) {
        setSnackbar({ children: 'No Data Available', severity: 'error' });
        return false;
      }

      const blob = new Blob([response.data], { type: 'application/octet-stream' });

      const link = document.createElement('a');

      link.href = window.URL.createObjectURL(blob);

      link.download = `${selectedMonth + '_' + selectedYear + '_' + mode}_data.xlsx`;

      document.body.appendChild(link);

      link.click();

      document.body.removeChild(link);

      window.URL.revokeObjectURL(link.href);
    } catch (error) {
      if (error.response.data.type) {
        setSnackbar({ children: error.response.data.type, severity: 'error' });
      } else {
        setSnackbar({ children: 'Some Internal Error Occured While fetching data', severity: 'error' });
      }
    } finally {
      setLoading(false);
    }
  };

  const checkPaymentFileGenerated = async (e) => {
    e.preventDefault();

    if (selectedMonth == '0') {
      setSnackbar({ children: 'Please Select Pension Amount Payable Upto', severity: 'error' });
      return false;
    }

    if (computationLevel == 'SD' && locationOptionValues.subDistrictMunicipalAreaCode == null) {
      setSnackbar({ children: 'Please Select Upto SubDistrict only', severity: 'error' });
      return false;
    } else if (
      computationLevel == 'D' &&
      (locationOptionValues.subDistrictMunicipalAreaCode != null || locationOptionValues.ruralUrbanArea != null)
    ) {
      setSnackbar({ children: 'Please Select Upto District only', severity: 'error' });
      return false;
    }

    const body = { year: selectedYear, mode, monthCode: selectedMonth, ...locationOptionValues };
    try {
      setLoading(true);
      const response = await axiosInstance.post('genAndPushPayment/checkPaymentFileGenerated/' + mode, body);
      if (response.data == 'FileNotGenerated') {
        var result = window.confirm('Please Confirm Payment File will be generated ?');
        if (result) {
          setLoading(true);
          const response = await axiosInstance.post('genAndPushPayment/generatePaymentXML/' + mode, body);
          alert(response.data);
        } else {
          return false;
        }
      } else {
        setSnackbar({ children: response.data, severity: 'error' });
      }

      getPendingPaymentFileStatus();
      // console.log(response.data);

      if (response.status !== 200) {
        console.error('Some Error Occurred:', response.statusText);
        return;
      }
    } catch (error) {
      if (error.response.data.type) {
        setSnackbar({ children: error.response.data.type, severity: 'error' });
      } else if (error.response.data.monthCode) {
        setSnackbar({ children: error.response.data.monthCode, severity: 'error' });
      } else if (error.response.data.year) {
        setSnackbar({ children: error.response.data.year, severity: 'error' });
      } else {
        setSnackbar({ children: 'Some Internal Error Occured ', severity: 'error' });
      }
      // console.error('Error fetching payable data:', error);
    } finally {
      setLoading(false);
    }
  };

  const sentXmlToPFMS = async (e, fileName) => {
    e.preventDefault();

    const body = { year: selectedYear, mode, monthCode: selectedMonth, ...locationOptionValues, fileName: fileName };
    try {
      var result = window.confirm('Please Confirm File Will be Sent To PFMS ?');
      if (result) {
        setLoading(true);
        const response = await axiosInstance.post('genAndPushPayment/sentPaymentFileToPFMS', body);
        alert(response.data);
      } else {
        return false;
      }

      getPendingPaymentFileStatus();

      if (response.status !== 200) {
        console.error('Some Error Occurred:', response.data);
        return;
      }
    } catch (error) {
      if (error.response.data.fileName) {
        setSnackbar({ children: error.response.data.fileName, severity: 'error' });
      } else {
        setSnackbar({ children: 'Some Internal Error Occured ', severity: 'error' });
      }
      // setSnackbar({ children: 'Some Internal Error Occured ', severity: 'error' });
      // console.error('Error fetching payable data:', error);
    } finally {
      setLoading(false);
    }
  };

  const signXMLFile = async (e, fileName) => {
    e.preventDefault();
    try {
      console.log(xmlData);
      // alert(xmlData);
      const xml = await getSignedXMLFile(xmlData);
      console.log(fileName + 'final Data----' + xml);
      const body = { fileName: fileName, xmlData: xml };
      const getUrl = `/genAndPushPayment/saveSignedFile`;
      setLoading(true);
      const response = await axiosInstance.post(getUrl, JSON.stringify(body));
      if (response.status >= 200 && response.status < 300) {
        // setXMLData(response.data);
        const newData = response.data.map((row) => ({ ...row, id: row.fileId }));
        setPendingPaymentFileList(newData);
        setSnackbar({ children: 'File Signed Successfully, Please Push the File to PFMS ', severity: 'success' });
        return response.data;
      } else {
        return false;
      }
    } catch (error) {
      if (error.response.data.fileName) {
        setSnackbar({ children: error.response.data.fileName, severity: 'error' });
      } else if (error.response.data.xmlData) {
        setSnackbar({ children: error.response.data.xmlData, severity: 'error' });
      } else {
        setSnackbar({ children: 'Some Internal Error Occured ', severity: 'error' });
      }
      // console.error("An error occurred while XML Data:", error);
      // return false;
    } finally {
      setLoading(false);
    }
  };

  const getXMLFile = async (e, fileName) => {
    e.preventDefault();

    const body = { fileName: fileName };
    try {
      setLoading(true);
      const response = await axiosInstance.post('genAndPushPayment/getXMLPaymentData', body);
      setXMLData(response.data);

      if (response.status !== 200) {
        console.error('Some Error Occurred:', response.data);
        return;
      }
    } catch (error) {
      if (error.response.data.fileName) {
        setSnackbar({ children: error.response.data.fileName, severity: 'error' });
      } else {
        setSnackbar({ children: 'Some Internal Error Occured ', severity: 'error' });
      }
    } finally {
      setLoading(false);
    }
  };

  const updateAndRegenerate = async (e) => {
    e.preventDefault();
    const [firstItem] = disbursementData;

    const body = { year: selectedYear, mode, monthCode: selectedMonth, ...locationOptionValues, fileName: firstItem.fileName };
    try {
      setLoading(true);
      const response = await axiosInstance.post('genAndPushPayment/updateAndRegeneratePaymentFile', body);
      alert(response.data); // to be changed later
      getPendingPaymentFileStatus();
      setLoading(false);
      setModalState(false);
    } catch (error) {
      if (error.response.data.fileName) {
        setSnackbar({ children: error.response.data.fileName, severity: 'error' });
      } else {
        setSnackbar({ children: 'Some Internal Error Occured ', severity: 'error' });
      }
    } finally {
      setLoading(false);
    }
  };

  const getViewRejectedPensionerDetails = async (e, fileName, flag) => {
    e.preventDefault();

    const body = { year: selectedYear, mode, monthCode: selectedMonth, ...locationOptionValues, fileName: fileName };
    try {
      setLoading(true);
      const response = await axiosInstance.post(
        flag == 'RJCT' ? 'genAndPushPayment/getRejectedRecordsDetails' : 'genAndPushPayment/getFileInformationForView',
        body
      );
      if (response.data.length < 1) {
        setDiscontinuedData([]);
        setSnackbar({ children: 'No Data Found', severity: 'error' });
        return false;
      }

      const newData = response.data.map((row) => ({ ...row, id: row.sanctionOrderNo }));
      setDisbursementData(newData);
      setLoading(false);
      if (flag == 'RJCT') {
        setRejectState(true);
        setModalState(true);
      } else if (flag == 'VIEW') {
        setViewState(true);
        setModalState(true);
      }

      if (response.status !== 200) {
        console.error('Some Error Occurred:', response.data);
        return;
      }
    } catch (error) {
      if (error.response.data.fileName) {
        setSnackbar({ children: error.response.data.fileName, severity: 'error' });
      } else {
        setSnackbar({ children: 'Some Internal Error Occured ', severity: 'error' });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLocationValuesChange = (newLocOptionValues) => {
    setLocationOptionValues(newLocOptionValues);
  };

  const handleModeSelect = (e) => {
    setMode(e.target.value);
  };

  useEffect(() => {}, [computedPayableUpto]);

  return (
    <div>
      <MainCard title="Generate And Push Payment File">
        <Box justifyContent="space-between" marginBottom={2}>
          <div>
            <SubDistrictCommon onFormInputValuesChange={handleLocationValuesChange} />
          </div>
        </Box>
        <Box justifyContent="space-between" marginLeft={3}>
          <div>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth>
                  <InputLabel id="payable-label">Pension Amount Payable UpTo</InputLabel>
                  <Select name="payable" label="Pension Amount Payable UpTo" labelId="payable-label" onChange={handlePayableChange}>
                    <MenuItem value="0">--Select Month And Year--</MenuItem>
                    {computedPayableUpto.map((item) => (
                      <MenuItem key={item.id} value={item.id}>
                        {item.monthName} {item.year}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth>
                  <InputLabel id="mode-label" style={{ display: 'flex', alignItems: 'center' }}>
                    Mode
                  </InputLabel>
                  <Select name="mode" onChange={handleModeSelect} label="mode-label" value={mode}>
                    {/* <MenuItem value="0">--Select--</MenuItem> */}
                    <MenuItem value="dbt">DBT / CPSMS</MenuItem>
                    <MenuItem value="nondbt">NON DBT </MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </div>
        </Box>
        <Divider style={{ marginTop: '10px' }} />

        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
          <Button variant="contained" color="primary" onClick={downloadDataInExcel}>
            DOWNLOAD EXCEL
          </Button>
          {mode == 'dbt' && (
            <Button variant="contained" color="primary" onClick={checkPaymentFileGenerated} style={{ marginLeft: '20px' }}>
              Generate DBT Payment File
            </Button>
          )}
        </div>

        <Backdrop open={loading} style={{ zIndex: 999, color: '#fff' }}>
          <CircularProgress color="inherit" />
        </Backdrop>

        <BootstrapDialog onClose={handleClose} aria-labelledby="customized-dialog-title" open={modalState} maxWidth="xl" fullWidth>
          <DialogTitle
            sx={{ m: 0, p: 2 }}
            id="customized-dialog-title"
            style={{ textAlign: 'center', backgroundColor: 'cadetblue', color: 'white', fontSize: '15px' }}
          >
            <u>DBT Pensioners</u>
          </DialogTitle>
          <IconButton
            title="Close"
            style={{ backgroundColor: 'white' }}
            aria-label="close"
            onClick={handleClose}
            sx={{ position: 'absolute', right: 8, top: 8, color: (theme) => theme.palette.grey[500] }}
          >
            <CloseIcon />
          </IconButton>
          <DialogContent dividers>
            {rejectState == true && (
              <>
                <DataGrid
                  rows={disbursementData}
                  columns={columnForRejectModal}
                  slots={{ toolbar: GridToolbar }}
                  slotProps={{
                    toolbar: {
                      showQuickFilter: true
                    }
                  }}
                />
                <Button variant="contained" color="primary" onClick={updateAndRegenerate}>
                  Update And Regenerate
                </Button>
              </>
            )}

            {viewState == true && (
              <DataGrid
                rows={disbursementData}
                columns={columnForViewModal}
                slots={{ toolbar: GridToolbar }}
                slotProps={{
                  toolbar: {
                    showQuickFilter: true
                  }
                }}
              />
            )}
          </DialogContent>
          <DialogActions>
            <Button style={{ pointerEvents: 'none' }}></Button>
          </DialogActions>
        </BootstrapDialog>

        {!!snackbar && (
          <Snackbar open anchorOrigin={{ vertical: 'top', horizontal: 'center' }} onClose={handleCloseSnackbar} autoHideDuration={6000}>
            <Alert {...snackbar} onClose={handleCloseSnackbar} />
          </Snackbar>
        )}
      </MainCard>

      <MainCard title="Generated Pending Files">
        <DataGrid
          slots={{ toolbar: GridToolbar }}
          slotProps={{
            toolbar: {
              showQuickFilter: true
            }
          }}
          rows={pendingPaymentFileList}
          columns={columns}
        />
      </MainCard>
      {/* <div>
      <h2>XML Data</h2>
      <pre>{xmlData.xmlFile}</pre>
    </div>          */}
    </div>
  );
};

export default PushPaymentFile;
