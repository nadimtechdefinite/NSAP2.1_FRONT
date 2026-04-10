import React, { useState, useEffect } from 'react';
import { useReducer } from 'react';
import axiosInstance from 'hooks/useAuthTokenUrl';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import MainCard from 'ui-component/cards/MainCard';
import {
  Grid,
  FormControl,
  Alert,
  Divider,
  Button,
  Backdrop,
  CircularProgress,
  Snackbar,
  Modal,
  Paper,
  IconButton,
  Select,
  MenuItem,
  Input,
  TextareaAutosize,
  InputLabel,
  Chip
} from '@mui/material';
import StateList from 'components/form_components/StateList';
import { Box } from '@mui/system';
import SearchComponent from 'components/common/SearchTypeCommon';
import './complainManagement.css';
import VisibilityIcon from '@mui/icons-material/Visibility';
import MessageIcon from '@mui/icons-material/Message';
import MandatoryFields from 'components/common/MandatoryFields';

function ComplainAttend() {
  const [formInput, setFormInput] = useReducer((state, newState) => ({ ...state, ...newState }), {
    stateId: '',
    districtId: '',
    subDistrictMunicipalAreaId: '',
    ruralUrbanArea: '',
    gramPanchayatWardId: '',
    status: ''
  });

  const [warningAlert, setShowwarningAlert] = useState('');
  const [viewData, setViewData] = useState('');
  const [optionValues, setOptionValues] = useState({});
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = React.useState(null);
  const handleCloseSnackbar = () => setSnackbar(null);
  const [getAllComplians, setAllComplians] = useState([]);
  const [showValidationPopup, setShowValidationPopup] = useState(false);

  const [openModal, setOpenModal] = useState(false);
  const [status, setStatus] = useState('ALL');
  const [statusForward, setStatusForward] = useState('');
  const [filePdf, setFilePdf] = useState(null);
  const [comment, setcomment] = useState(null);
  const [unvalidField, setunvalidField] = useState([]);

  // Function to handle opening and closing modal

  const handleCloseModal = () => setOpenModal(false);

  const options = {
    complainNo: 'Complaint No.'
  };

  const handleSelectState = (state) => {
    const name = 'stateId';
    setFormInput({ [name]: state });
  };

  const handleSelectStatus = (sta) => {
    const status = sta;
    const name = 'status';
    setFormInput({ [name]: status });
  };

  const handleClose = () => {
    setShowwarningAlert('');
  };

  const handleOptionValuesChange = (newOptionValues) => {
    setOptionValues(newOptionValues);
  };

  const handleFetchData = async (e) => {
    e.preventDefault();
    try {
      var requestData = { ...optionValues };
      setAllComplians([]);
      setLoading(true);

      if (requestData.complainNo) {
        if (/^\d*$/.test(requestData.complainNo)) {
          setShowwarningAlert('');
          const response = await axiosInstance.get(`complain-management/findAllComplainStatusByNo/${requestData.complainNo}`);
          if (response.data.length < 1) {
            setSnackbar({ children: 'No  Data Found', severity: 'error' });
            return false;
          }
          if (response.data && typeof response.data === 'object') {
            const newData = response.data.map((item, index) => ({
              ...item,
              Count: index + 1
            }));
            setAllComplians(newData);
          }
        } else {
          setShowwarningAlert('Please enter numbers only');
        }
      } else {
        const response = await axiosInstance.post('complain-management/findAllComplainStatus', JSON.stringify(formInput));
        if (response.data.length < 1) {
          setAllComplians([]);
          setSnackbar({ children: 'No  Data Found', severity: 'error' });
          return false;
        }
        if (response.data && typeof response.data === 'object') {
          console.log(response.data);
          const newData = response.data.map((item, index) => ({
            ...item,
            Count: index + 1
          }));
          setAllComplians(newData);
        }
      }
    } catch (error) {
      console.log(error);
      setSnackbar({ children: 'Some Internal Error Occured', severity: 'error' });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleInput = (evt) => {
    setcomment(evt.target.value);
  };

  

  const columns = [
    {
      field: 'Count',
      headerName: 'S. No.',
      flex: 0.5
    },
    {
      field: 'id',
      headerName: 'Complian No.',
      flex: 1.5
    },
    {
      field: 'moduleName',
      headerName: 'Module Name',
      flex: 1
    },
    {
      field: 'subModuleName',
      headerName: 'Sub Module Name',
      flex: 1
    },
    {
      field: 'menuName',
      headerName: 'Menu Name',
      flex: 1
    },
    {
      field: 'complaintBy',
      headerName: 'Complain By',
      flex: 1
    },
    {
      field: 'complaintStatus',
      headerName: 'Status',
      flex: 1
    },
    {
      field: 'complaintDate',
      headerName: 'Raised On',
      flex: 1
    },
    {
      field: 'complaintResolveBy',
      headerName: 'Assigned To',
      flex: 1
    },
    {
      field: 'complaintResolveDate',
      headerName: 'Resolved On',
      flex: 1
    },
    {
      field: 'View',
      headerName: 'View',
      flex: 1,
      renderCell: (params) => (
        <>
          <IconButton color="info" style={{ cursor: 'pointer', fontSize: '12px', marginRight: '8px' }} onClick={() => handleView(params)}>
            <VisibilityIcon />
          </IconButton>
        </>
      )
    }
  ];

  // const handleEdit = (rowData) => {
  //   // setShowEdit(true);
  //   console.log('Editing:', rowData.row);
  //   // setallRowEdit(rowData.row);

  //   // // }
  // };

  const handleView = (rowData) => {
    setOpenModal(true);
    setViewData(rowData.row);
  };

  const rows = getAllComplians.map((item) => {
    // Format the complaintDate
    const formattedComplaintDate = item.complaintDate ? new Date(item.complaintDate).toLocaleString() : '';
    const complaintResolveDate = item.complaintResolveDate ? new Date(item.complaintResolveDate).toLocaleString() : '';
    const forwardDateByStNodal = item.forwardDateByStNodal ? new Date(item.forwardDateByStNodal).toLocaleString() : '';
    const forwardDateByAdmin = item.forwardDateByAdmin ? new Date(item.forwardDateByAdmin).toLocaleString() : '';

    return {
      id: item.complaintId,
      Count: item.Count,
      moduleName: item.moduleName,
      subModuleName: item.subModuleName,
      menuName: item.menuName,
      complaintBy: item.complaintBy,
      complaintStatus: item.complaintStatus,
      complaintDate: formattedComplaintDate,
      complaintResolveBy: item.complaintResolveBy,
      complaintTitle: item.complaintTitle,
      complaintDetail: item.complaintDetail,
      stateName: item.stateName,
      districtName: item.districtName,
      subDistrictName: item.subDistrictName,
      gramPanchayatWardName: item.gramPanchayatWardName,
      userNameCom: item.userNameCom,
      emailIdCom: item.emailIdCom,
      mobileNoCom: item.mobileNoCom,
      userCodeNodel: item.userCodeNodel,
      userNameNodel: item.userNameNodel,
      userContactNodel: item.userContactNodel,
      userEmailNodel: item.userEmailNodel,
      complaintResolveDate: complaintResolveDate,
      complainLogList: item ? item.complainLogList : '',
      forwardDateByStNodal: forwardDateByStNodal,
      forwardDateByAdmin: forwardDateByAdmin
    };
  });

  useEffect(() => {
    setStatus(status);
    setStatusForward(statusForward);
    handleSelectStatus(status);
  }, [status, statusForward]);

  const customStyle = {
    backgroundColor: 'black',
    color: 'white', // changed color to black
    padding: '0.5rem',
    textAlign: 'center',
    margin: '1rem 0'
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];

    if (file) {
      if (file.type !== 'application/pdf' && file.type.indexOf('image/') !== 0) {
        setSnackbar({ children: 'Only PDF files and images are allowed.', severity: 'error' });
        event.target.value = '';
      } else {
        setFilePdf(file);
      }
    } else {
      console.log('No file selected');
    }
  };

  const handleUpdate = async () => {
    const mandatoryFields = ['comment', 'statusForward'].filter((field) => field !== '');
    const validationResults = mandatoryFields.map((field) => ({
      field: field,
      isValid: Boolean(field)
    }));

    const isFormValid = validationResults.every((result) => result.isValid);

    if (!isFormValid) {
      const unvalidFields = validationResults.filter((result) => !result.isValid).map((result) => result.field + ',  ');
      setunvalidField(unvalidFields);

      setShowValidationPopup(true);
      setTimeout(() => {
        setShowValidationPopup(false);
      }, 3000);
      return;
    }
    try {
      const formData = new FormData();
      formData.append('statusForward', statusForward);
      formData.append('filePdf', filePdf);
      formData.append('comment', comment);

      const config = {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      };

      const postUrl = '/complain-management/complainAttendByNSAPUSER';
      const res = await axiosInstance.post(postUrl, formData, config);
      setSucess(res.status);
      // Reset form fields using dispatch
      setFormInput({
        finyr: '',
        fileUploadType: ''
      });

      if (res.status === 200) {
        setShowAlert(true);
        // Automatically hide the alert after 5 seconds
        const timeoutId = setTimeout(() => {
          setShowAlert(false);
        }, 5000);

        // Clear the timeout when the component is unmounted or when showAlert changes
        return () => clearTimeout(timeoutId);
      }
    } catch (e) {
      console.error(e);
      if (e.response) {
        setSnackbar({ children: e.response.data, severity: 'error' });
        // setShowwarningAlert(showalertwhenObjectretrnvalidation(e));
      } else {
        setSnackbar({ children: 'Some error Occured.', severity: 'error' });
      }
    }
  };

  return (
    <div>
      {/* <div style={{ backgroundColor: '#333', color: 'white', padding: '10px' }}>
        <div style={{ borderBottom: '3px solid white', paddingBottom: '2px', textAlign: 'center' }}>
          <h3>Complain Attend</h3>
        </div>
      </div> */}
      {showValidationPopup && <MandatoryFields fieldName={unvalidField} />}
        {!!snackbar && (
          <Snackbar open anchorOrigin={{ vertical: 'top', horizontal: 'center' }} onClose={handleCloseSnackbar} autoHideDuration={6000}>
            <Alert {...snackbar} onClose={handleCloseSnackbar} />
          </Snackbar>
        )}

        {warningAlert && (
          <Alert variant="filled" severity="warning" onClose={handleClose}>
            {warningAlert}
          </Alert>
        )}
      <MainCard title="Attend Complaint">
        
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <StateList onSelectState={handleSelectState} />
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <Select defaultValue="ALL" value={status} onChange={(e) => setStatus(e.target.value)}>
                <MenuItem key={'ALL'} value="ALL">
                  ALL
                </MenuItem>
                <MenuItem key={'In Process'} value="In Process">
                  In Process
                </MenuItem>
                <MenuItem key={'Resolve'} value="Resolve">
                  Resolve
                </MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
        {/* <div style={{ backgroundColor: 'black', color: 'white', textAlign: 'center', marginBlock: '20px' }}>
          <span className="badge badge-primary" style={{ fontSize: '1rem' }}>
            Or Search By
          </span>
        </div> */}
        <Divider  style={{marginTop:10}}>
            <Chip label="OR SEARCH BY" /> 
          </Divider>

        <Box justifyContent="space-between" marginBottom={2}>
          <div>
            <SearchComponent options={options} onOptionValuesChange={handleOptionValuesChange} />
          </div>

          <Divider style={{ marginTop: '10px' }} />

          <Box marginTop={2} style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
            <Button variant="contained" color="primary" onClick={handleFetchData}>
              Search
            </Button>
          </Box>
        </Box>

        {rows.length !== 0 && (
          <Box sx={{ height: 700, width: '100%' }}>
            <DataGrid
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
                    pageSize: 10
                  }
                }
              }}
              pageSizeOptions={[10]}
              // checkboxSelection
              disableRowSelectionOnClick
            />
          </Box>
        )}

        <Modal
          open={openModal}
          onClose={handleCloseModal}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Paper
            style={{
              width: '70%',
              maxHeight: '80%',
              overflowY: 'auto',
              boxShadow: '#fff',
              padding: '20px',
              position: 'relative',
              backgroundColor: '#fff',
              borderRadius: '8px'
            }}
          >
            <h4 style={customStyle}>
              <span>Complain Detail</span>
            </h4>
            {showValidationPopup && <MandatoryFields fieldName={unvalidField} />}
            {!!snackbar && (
              <Snackbar open anchorOrigin={{ vertical: 'top', horizontal: 'center' }} onClose={handleCloseSnackbar} autoHideDuration={6000}>
                <Alert {...snackbar} onClose={handleCloseSnackbar} />
              </Snackbar>
            )}

            {warningAlert && (
              <Alert variant="filled" severity="warning" onClose={handleClose}>
                {warningAlert}
              </Alert>
            )}

            <Grid container spacing={2} style={{ marginBlock: '20px' }}>
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth>
                  <InputLabel style={{ color: 'black' }}>Complaint No.</InputLabel>
                  {viewData.id}
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={4}>
                <FormControl fullWidth>
                  <InputLabel style={{ color: 'black' }}>Complaint Status</InputLabel>
                  {viewData.complaintStatus}
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={4}>
                <FormControl fullWidth>
                  <InputLabel style={{ color: 'black' }}>Raised On</InputLabel>
                  {viewData.complaintDate}
                </FormControl>
              </Grid>
            </Grid>

            <hr style={{ borderTop: '1px black', width: '100%' }} />

            <Grid container spacing={2} style={{ marginBlock: '20px' }}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel style={{ color: 'black' }}>Forward Date By State Nodal</InputLabel>
                  {viewData.forwardDateByStNodal}
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel style={{ color: 'black' }}>Forward Date By Admin</InputLabel>
                  {viewData.forwardDateByAdmin}
                </FormControl>
              </Grid>
            </Grid>

            <hr style={{ borderTop: '1px black', width: '100%' }} />

            <Grid container spacing={2} style={{ marginBlock: '20px' }}>
              <Grid item xs={12} sm={12}>
                <FormControl fullWidth>
                  <InputLabel style={{ color: 'black' }}>Complaint Title</InputLabel>
                  {viewData.complaintTitle}
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={12}>
                <FormControl fullWidth>
                  <InputLabel style={{ color: 'black' }}>Complaint Detail </InputLabel>
                  {viewData.complaintDetail}
                </FormControl>
              </Grid>
            </Grid>

            <h4 style={customStyle}>
              <span>Complaint By</span>
            </h4>

            <Grid container spacing={2} style={{ marginBlock: '20px' }}>
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth>
                  <InputLabel style={{ color: 'black' }}>State</InputLabel>
                  {viewData.stateName}
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={4}>
                <FormControl fullWidth>
                  <InputLabel style={{ color: 'black' }}>District</InputLabel>
                  {viewData.districtName}
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={4}>
                <FormControl fullWidth>
                  <InputLabel style={{ color: 'black' }}>Sub District</InputLabel>
                  {viewData.subDistrictName}
                </FormControl>
              </Grid>
            </Grid>

            <hr style={{ borderTop: '1px black', width: '100%' }} />

            <Grid container spacing={2} style={{ marginBlock: '20px' }}>
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth>
                  <InputLabel style={{ color: 'black' }}>Gram Panchayat</InputLabel>
                  {viewData.gramPanchayatWardName}
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={4}>
                <FormControl fullWidth>
                  <InputLabel style={{ color: 'black' }}>User Code</InputLabel>
                  {viewData.complaintBy}
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={4}>
                <FormControl fullWidth>
                  <InputLabel style={{ color: 'black' }}>User Name</InputLabel>
                  {viewData.userNameCom}
                </FormControl>
              </Grid>
            </Grid>

            <hr style={{ borderTop: '1px black', width: '100%' }} />

            <Grid container spacing={2} style={{ marginBlock: '20px' }}>
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth>
                  <InputLabel style={{ color: 'black' }}>Contact No.</InputLabel>
                  {viewData.mobileNoCom}
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={4}>
                <FormControl fullWidth>
                  <InputLabel style={{ color: 'black' }}>Email Id</InputLabel>
                  {viewData.emailIdCom}
                </FormControl>
              </Grid>
            </Grid>

            <h4 style={customStyle}>
              <span> State Nodal Detail </span>
            </h4>

            <Grid container spacing={2} style={{ marginBlock: '20px' }}>
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth>
                  <InputLabel style={{ color: 'black' }}>User Code</InputLabel>
                  {viewData.userCodeNodel}
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={4}>
                <FormControl fullWidth>
                  <InputLabel style={{ color: 'black' }}>User Name</InputLabel>
                  {viewData.userNameNodel}
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth>
                  <InputLabel style={{ color: 'black' }}>Contact No.</InputLabel>
                  {viewData.userContactNodel}
                </FormControl>
              </Grid>
            </Grid>
            <hr style={{ borderTop: '1px black', width: '100%' }} />
            <Grid container spacing={2} style={{ marginBlock: '20px' }}>
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth>
                  <InputLabel style={{ color: 'black' }}>Email Id</InputLabel>
                  {viewData.userEmailNodel}
                </FormControl>
              </Grid>
            </Grid>

            <h4 style={customStyle}>
              <span> Complaint History </span>
            </h4>

            <Grid container spacing={2} style={{ marginBlock: '20px' }}>
              {viewData.complainLogList &&
                viewData.complainLogList.map((complainLog, index) => (
                  <Grid item xs={12} sm={12} key={index}>
                    <FormControl fullWidth>
                      <MessageIcon />
                      <InputLabel key={index} style={{ color: 'black' }}>
                        {viewData.id}
                      </InputLabel>

                      <div key={index}>{complainLog.compMessage}</div>
                    </FormControl>
                  </Grid>
                ))}
            </Grid>

            <h4 style={customStyle}>
              <span>Forward / Resolve </span>
            </h4>
            <Grid container spacing={2} style={{ marginBlock: '20px' }}>
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth>
                  <InputLabel style={{ color: 'black' }}>Forward / Resolve</InputLabel>
                  <Select value={statusForward} name="statusForward" onChange={(e) => setStatusForward(e.target.value)}>
                    {/* <MenuItem value="ALL">ALL</MenuItem> */}
                    <MenuItem key={'Resolved'} value="Resolved">
                      Resolved
                    </MenuItem>
                    <MenuItem key={'In Process'} value="In Process">
                      Forward to Admin
                    </MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth style={{ marginTop: '10px' }}>
                  <b>Upload doc 1 (Only .pdf ,image Format Allowed)</b>
                  <Input
                    type="file"
                    name="filePdf"
                    onChange={handleFileChange}
                    inputProps={{
                      accept: 'application/pdf, image/*'
                    }}
                  />
                </FormControl>
              </Grid>
            </Grid>
            <hr style={{ borderTop: '1px black', width: '100%' }} />
            <Grid container spacing={2} style={{ marginBlock: '20px' }}>
              <Grid item xs={12} sm={12}>
                <FormControl fullWidth>
                  <InputLabel style={{ color: 'black' }}>Comment</InputLabel>
                  <TextareaAutosize
                    value={comment}
                    name="comment"
                    onChange={handleInput}
                    rowsMin={5} // Set the minimum number of rows
                    style={{ width: '80%' }} // Adjust width as needed
                  />
                </FormControl>
              </Grid>
            </Grid>
            <hr style={{ borderTop: '1px black', width: '100%' }} />
            <Box marginTop={2} style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
              <Button variant="contained" color="primary" onClick={handleUpdate}>
                Submit
              </Button>
            </Box>
          </Paper>
        </Modal>

        <Backdrop open={loading} style={{ zIndex: 999, color: '#fff' }}>
          <CircularProgress color="inherit" />
        </Backdrop>
      </MainCard>
    </div>
  );
}

export default ComplainAttend;
