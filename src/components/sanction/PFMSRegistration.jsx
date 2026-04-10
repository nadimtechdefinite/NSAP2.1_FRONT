import React, { useState, useEffect } from 'react';
import MainCard from 'ui-component/cards/MainCard';
import axiosInstance from 'hooks/useAuthTokenUrl';

import {
  Grid,
  Button,
  FormControl,
  Snackbar,
  Alert,
  Box,
  FormControlLabel,
  Radio,
  RadioGroup,
  Backdrop,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton
} from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';

import CloseIcon from '@mui/icons-material/Close';
import { styled } from '@mui/material/styles';
import SubDistrictCommon from 'components/common/SubDistrictCommon';

export default function PFMSRegistration() {
  const [snackbar, setSnackbar] = React.useState(null);
  const handleCloseSnackbar = () => setSnackbar(null);

  const [allDataforRegistration, setAllDataforRegistration] = useState([]);
  const [selectedOption, setSelectedOption] = useState('ac');
  const [loading, setLoading] = useState(false);
  const [selectedData, setSelectedData] = useState([]);
  const [pendingFileData, setPendingFileData] = useState([]);
  const [dataForView, setDataForView] = useState([]);
  const [modalState, setModalState] = useState(false);
  const [viewState, setViewState] = useState(false);
  // const [isverError, setIsverError] = useState(false);
  // const submitformRef = useRef(null);
  const [locationOptionValues, setLocationOptionValues] = useState({});
  const subDistrictCommonRef = React.createRef();

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
  const handleLocationValuesChange = (newLocOptionValues) => {
    setLocationOptionValues(newLocOptionValues);
  };

  const pendingFile = [
    { field: 'districtName', headerName: 'District Name', flex: 1, editable: false },
    { field: 'fileName', headerName: 'File Name', width: 260, editable: false },
    { field: 'noOfRecSent', headerName: 'Total Record', flex: 1, editable: false },
    { field: 'processed', headerName: 'Processed', flex: 1, editable: false },
    { field: 'pendingRecord', headerName: 'Pending', flex: 1, editable: false },
    { field: 'noOfSuccRec', headerName: 'Success', flex: 1, editable: false },
    { field: 'noOfUnsucRec', headerName: 'Rejected', flex: 1, editable: false },
    { field: 'pendingSince', headerName: 'Pending Since (In Days)', flex: 1, editable: false },
    { field: 'status', headerName: 'Status', flex: 1, editable: false },
    // pendingFileData.fileType === 'Send File'
    // ?
    {
      field: '',
      headerName: 'Action',
      width: 230,
      headerAlign: 'center',
      renderCell: (params) => (
        <>
          {
            <Button
              variant="outlined"
              color="primary"
              style={{ cursor: 'pointer', fontSize: '12px', marginRight: '8px' }}
              onClick={(e) => getViewRejectedPensionerDetails(e, params.row.fileName)}
            >
              {/* VIEW */}
              View
            </Button>
          }
          {params.row.status == 'File Not Yet Sent' && (
            <Button
              variant="outlined"
              color="primary"
              style={{ cursor: 'pointer', fontSize: '12px', marginRight: '8px' }}
              onClick={(e) => handleButtonClick1(e, 'true', params.row.fileName)}
            >
              Send File
            </Button>
          )}
          {params.row.status == 'Response Available' && (
            <Button
              variant="outlined"
              color="primary"
              style={{ cursor: 'pointer', fontSize: '12px', marginRight: '8px' }}
              onClick={(e) => handleButtonClick1(e, 'false', params.row.fileName)}
            >
              Response Available
            </Button>
          )}
          {params.row.status == 'Response Awaited' && <div>{params.row.fileType}</div>}
        </>
      )
    }
  ];
  const columns = [
    { field: 'sanctionOrderNo', headerName: 'Sanction Order No', editable: false, flex: 1 },
    { field: 'applicantName', headerName: 'Applicant Name', editable: false, flex: 1 },
    { field: 'fatherHusbandName', headerName: 'Father/Husband Name', editable: false, flex: 1 },
    { field: 'dateOfBirth', headerName: 'DOB/Gender', flex: 1, editable: false },
    { field: 'munciplityName', headerName: 'Sub District', editable: false, flex: 1 },
    { field: 'cpsmsId', headerName: 'CPSMS Id', flex: 1, editable: false },
    selectedData.type === 'ac' ? { field: 'accountNo', headerName: 'Account No', width: 130, editable: false } : null,
    selectedData.type === 'both' ? { field: 'accountNo', headerName: 'Account No', width: 130, editable: false } : null,
    selectedData.type === 'uid' ? { field: 'aadhaarNo', headerName: 'Aadhaar No', width: 130, editable: false } : null,
    selectedData.type === 'both' ? { field: 'aadhaarNo', headerName: 'Aadhaar No', width: 130, editable: false } : null,
    selectedData.type === 'ac' ? { field: 'ifscCode', headerName: 'IFSC Code', editable: false, width: 130 } : null,
    selectedData.type === 'both' ? { field: 'ifscCode', headerName: 'IFSC Code', editable: false, width: 130 } : null,
    { field: 'status', headerName: 'CPSMS Status', editable: true }
  ].filter(Boolean);
  const columnForViewModal = [
    { field: 'sanctionOrderNo', headerName: 'Sanction Order No', flex: 1 },
    { field: 'cpsmsId', headerName: 'PFMS Id No.', flex: 1 },
    { field: 'applicantName', headerName: 'Applicant Name', flex: 1 },
    { field: 'fatherHusbandName', headerName: 'Father Husband Name', flex: 1 },
    { field: 'dateOfBirth', headerName: 'Date Of Birth', flex: 1 },
    { field: 'accountNo', headerName: 'Bank Po Account No', flex: 1 },
    { field: 'ifscCode', headerName: 'IFSC Code', flex: 1 },
    { field: 'bankName', headerName: 'Bank Name', flex: 1 },
    { field: 'aadhaarNo', headerName: 'UID No' },
    { field: 'status', headerName: 'Status' }
    // { field: 'fromDate', headerName: 'From Date'},
    // { field: 'toDate', headerName: 'To Date'},
  ];
  const handleClickOpen = (e) => {
    e.preventDefault();
    setLoading(false);
    if (subDistrictCommonRef.current) {
      if (subDistrictCommonRef.current.validateSelectedDropDown() != 'RJ') {
        return false;
      }
    }
    // if (!isverError && selectedDistrictId) {
    //   console.log('selectedDistrictId successfully!', selectedDistrictId);
    // } else {
    //   setIsverError(!selectedDistrictId);
    //   if (submitformRef.current) {
    //     submitformRef.current.scrollIntoView({ behavior: 'auto', block: 'start' });
    //   }
    //   return;
    // }
    fetchData()
      .then((res) => {
        if (res) {
          const pfmsRegData = res || [];
          setAllDataforRegistration(pfmsRegData.pfmsRegistrationDTO);
          setSelectedData(pfmsRegData);
          console.log(allDataforRegistration);
        } else {
          setAllDataforRegistration([]);
          setSnackbar({ children: 'No Data Found', severity: 'error' });
          return false;
        }
      })
      .catch((e) => {
        console.log(e.message);
      });
  };
  const pendingFiles = async () => {
    try {
      // e.preventDefault();
      const getUrl = `pfmsRegistration/getRegistrationPendingfile`;
      // const body= JSON.stringify({ stateID:selectedStateId, districtID:selectedDistrictId, area:selectedAreaId, subDistID:selectedSubDistrictId });
      setLoading(true);
      const response = await axiosInstance.get(getUrl);
      // console.log("---------------------"+response[0].status);
      if (response.status >= 200 && response.status < 300) {
        return response.data;
      } else {
        return false;
        //  throw new Error('Data coud not be fetched!', response.data)
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    pendingFiles()
      .then((res) => {
        if (res) {
          const penData = res || [];
          setPendingFileData(penData);
          // console.log(allDataforRegistration);
        } else {
          setPendingFileData([]);
          setSnackbar({ children: 'No Data Found', severity: 'error' });
          return false;
        }
      })
      .catch((e) => {
        console.log(e.message);
      });
  }, []);

  const handleButtonClick1 = async (e, action, fileName) => {
    try {
      var apiUrl = null;
      var body = { fileName: fileName };
      if (action === 'true') {
        apiUrl = '/pfmsRegistration/sendPendingfiletoPFMS';
        // fileName=fileName;
      } else {
        apiUrl = '/pfmsRegistration/readResponsePendingFile';
      }
      setLoading(true);
      const response = await axiosInstance.post(apiUrl, body);
      if (response.status >= 200 && response.status < 300) {
        console.log('API Response:', response.data);
        setSnackbar({ children: response.data, severity: 'success' });
        await new Promise((resolve) => setTimeout(resolve, 1250));

        // handleClickOpen(e);
      } else {
        setSnackbar({ children: 'Error in updating data', severity: 'success' });
        await new Promise((resolve) => setTimeout(resolve, 1250));
      }
    } catch (error) {
      console.error('Error calling API:', error);
      setSnackbar({ children: error.message, severity: 'error' });
    } finally {
      setLoading(false);
      pendingFiles()
        .then((res) => {
          if (res) {
            const penData = res || [];
            setPendingFileData(penData);
            // console.log(allDataforRegistration);
          } else {
            setPendingFileData([]);
            setSnackbar({ children: 'No Data Found', severity: 'error' });
            return false;
          }
        })
        .catch((e) => {
          console.log(e.message);
        });
    }
  };

  const fetchData = async () => {
    try {
      const selectedStateId = locationOptionValues.stateCode;
      const selectedDistrictId = locationOptionValues.districtCode;
      const selectedAreaId = locationOptionValues.ruralUrbanArea;
      const selectedSubDistrictId = locationOptionValues.subDistrictMunicipalAreaCode;
      // var location = { stateID: selectedStateId, districtID: selectedDistrictId, area: selectedAreaId, subDistID: selectedSubDistrictId };
      // var body = { ...optionValues, ...location };
      const getUrl = `/pfmsRegistration/getRegistrationData/` + selectedOption;
      const body = JSON.stringify({
        stateID: selectedStateId,
        districtID: selectedDistrictId,
        area: selectedAreaId,
        subDistID: selectedSubDistrictId
      });
      setLoading(true);
      const response = await axiosInstance.post(getUrl, body);
      // console.log("---------------------"+response[0].status);
      if (response.status >= 200 && response.status < 300) {
        return response.data;
      } else {
        return false;
        //  throw new Error('Data coud not be fetched!', response.data)
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };
  const pendingFileRows = pendingFileData.map((item) => ({
    id: item.fileName,
    fileName: item.fileName,
    districtName: item.districtName,

    noOfRecSent: item.noOfRecSent,
    noOfSuccRec: item.noOfSuccRec,
    noOfUnsucRec: item.noOfUnsucRec,
    pendingRecord: item.pendingRecord,
    pendingSince: item.pendingSince,
    processed: item.processed,
    status: item.status,
    fileType: item.fileType

    // abc: item.pfmsRegistrationDTO.firstName
  }));
  const rows = allDataforRegistration.map((item) => ({
    id: item.sanctionOrderNo,
    applicantName: item.applicantName,
    //   firstName:item.firstName,
    // middleName: item.middleName,
    // lastName: item.lastName,
    sanctionOrderNo: item.sanctionOrderNo,
    status: item.status,
    fatherHusbandName: item.fatherHusbandName,
    dateOfBirth: item.dateOfBirth + '/' + item.gender,
    munciplityName: item.munciplityName,
    cpsmsId: item.cpsmsId || 'NA',
    ifscCode: item.ifscCode,
    accountNo: item.accountNo,
    aadhaarNo: item.aadhaarNo
    // aadhaarNo1:item.aadhaarNo.slice(0, -4).replace(/\d/g, '*')+ item.aadhaarNo.slice(-4)||'NA',

    // abc: item.pfmsRegistrationDTO.firstName
  }));
  const viewData = dataForView.map((item) => ({
    id: item.sanctionOrderNo,
    sanctionOrderNo: item.sanctionOrderNo,
    cpsmsId: item.cpsmsId || 'NA',
    applicantName: item.applicantName,
    fatherHusbandName: item.fatherHusbandName,
    dateOfBirth: item.dateOfBirth,
    accountNo: item.accountNo || 'NA',
    ifscCode: item.ifscCode || 'NA',
    bankName: item.bankName || 'NA',
    aadhaarNo: item.aadhaarNo || 'NA',
    // aadhaarNo1:item.aadhaarNo.slice(0, -4).replace(/\d/g, '*')+ item.aadhaarNo.slice(-4)||'NA',
    status: item.status
  }));

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!window.confirm('Are you sure, you want to Generate Registration File')) {
      return false;
    }
    try {
      setLoading(true);
      const stateID = selectedData.stateID;
      const districtID = selectedData.districtID;
      const area = selectedData.area;
      const subDistID = selectedData.subDistID;
      const schemeCode = selectedData.schemeCode;
      const type = selectedData.type;
      const dataSize = allDataforRegistration.length;
      // alert(allDataforRegistration.status);
      const body = JSON.stringify({ stateID, districtID, area, subDistID, schemeCode, type, dataSize });
      const apiUrl = '/pfmsRegistration/generateXML';
      const response = await axiosInstance.post(apiUrl, body);
      console.log('check 2', JSON.stringify(response.data));
      setLoading(true);
      if (response.status >= 200 && response.status < 300) {
        setSnackbar({ children: 'Successfully updated', severity: 'success' });
        await new Promise((resolve) => setTimeout(resolve, 1250));
        setLoading(false);
        handleClickOpen(e);
      } else {
        setSnackbar({ children: 'Error in updating data', severity: 'success' });
        await new Promise((resolve) => setTimeout(resolve, 1250));
      }
    } catch (error) {
      // alert(error.response.data.detail);
      if (error.response.data.detail) {
        setSnackbar({ children: error.response.data.detail, severity: 'error' });
      } else {
        setSnackbar({ children: error.response.data.message, severity: 'error' });
      }
    } finally {
      pendingFiles()
        .then((res) => {
          if (res) {
            const penData = res || [];
            setPendingFileData(penData);
            setLoading(false);
            // console.log(allDataforRegistration);
          } else {
            setPendingFileData([]);
            setSnackbar({ children: 'No Data Found', severity: 'error' });
            setLoading(false);
            return false;
          }
        })
        .catch((e) => {
          setLoading(false);
          console.log(e.message);
        });
    }
  };
  const getViewRejectedPensionerDetails = async (e, fileName) => {
    e.preventDefault();

    const body = { fileName: fileName };
    try {
      setLoading(true);
      const response = await axiosInstance.post('pfmsRegistration/viewFileData', body);
      if (response.data.length < 1) {
        setDiscontinuedData([]);
        setSnackbar({ children: 'No Data Found', severity: 'error' });
        return false;
      }

      const newData = response.data.map((row) => ({ ...row, id: row.sanctionOrderNo }));
      setDataForView(newData);
      setLoading(false);

      setViewState(true);
      setModalState(true);
    } catch (error) {
      setSnackbar({ children: 'Some Internal Error Occured ', severity: 'error' });
      console.error('Error fetching payable data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRadioChange = (event) => {
    setSelectedOption(event.target.value);
  };

  return (
    <div>
      <MainCard title="GET CPSMS ID">
        <BootstrapDialog onClose={handleClose} aria-labelledby="customized-dialog-title" open={modalState} maxWidth="xl" fullWidth>
          <DialogTitle
            sx={{ m: 0, p: 2 }}
            id="customized-dialog-title"
            style={{ textAlign: 'center', backgroundColor: 'cadetblue', color: 'white', fontSize: '15px' }}
          >
            <u>PFMS Pensioners Registration</u>
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
            {viewState == true && (
              <DataGrid
                rows={viewData}
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
        <Backdrop open={loading} style={{ zIndex: 999, color: '#fff' }}>
          <CircularProgress color="inherit" />
        </Backdrop>
        <form onSubmit={(e) => handleClickOpen(e)}>
          <div>
            <SubDistrictCommon ref={subDistrictCommonRef} validationLevel={'D'} onFormInputValuesChange={handleLocationValuesChange} />
          </div>
          <Grid container spacing={2}>
            <Grid>
              <div>
                <Grid>
                  <FormControl component="fieldset" style={{ marginLeft: '50px', marginTop: '20px' }}>
                    <RadioGroup
                      aria-label="options"
                      name="options"
                      value={selectedOption}
                      onChange={handleRadioChange} // Handle the change here
                      required
                      row
                    >
                      <FormControlLabel value="ac" control={<Radio />} label="A/c Based" />
                      <FormControlLabel value="uid" control={<Radio />} label="UID Based" />
                      <FormControlLabel value="both" control={<Radio />} label="Both" />
                    </RadioGroup>
                  </FormControl>
                </Grid>
              </div>
            </Grid>
            <Grid item xs={12} alignItems="center">
              <div style={{ display: 'flex', justifyContent: 'left', marginTop: '20px' }}>
                <Button type="submit" variant="contained" color="primary">
                  Submit
                </Button>
              </div>
            </Grid>
          </Grid>
        </form>
      </MainCard>

      {allDataforRegistration.length > 0 ? (
        <form onSubmit={handleFormSubmit}>
          <MainCard title="Pensioners Data for PFMS Registration">
            <Box sx={{ height: 400, width: '100%' }}>
              <DataGrid
                disableRowSelectionOnClick
                getRowId={(row) => row.id}
                slots={{ toolbar: GridToolbar }}
                slotProps={{
                  toolbar: {
                    showQuickFilter: true
                  }
                }}
                rows={rows}
                columns={columns}
                initialState={{
                  pagination: {
                    paginationModel: {
                      pageSize: 15
                    }
                  }
                }}
                pageSizeOptions={[15]}
              />
            </Box>
            <Grid item xs={12} sm={4} alignItems="center">
              <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                <Button type="submit" variant="contained" color="primary">
                  Generate File
                </Button>
              </div>
            </Grid>
          </MainCard>
        </form>
      ) : (
        <div></div>
      )}
      {pendingFileData.length > 0 ? (
        <MainCard title="Generated Pending Files">
          <Box sx={{ height: 400, width: '100%' }}>
            <DataGrid
              disableRowSelectionOnClick
              slots={{ toolbar: GridToolbar }}
              slotProps={{
                toolbar: {
                  showQuickFilter: true
                }
              }}
              rows={pendingFileRows}
              columns={pendingFile}
              initialState={{
                pagination: {
                  paginationModel: {
                    pageSize: 15
                  }
                }
              }}
              pageSizeOptions={[15]}
            />
          </Box>
        </MainCard>
      ) : (
        <div></div>
      )}
    </div>
  );
}
