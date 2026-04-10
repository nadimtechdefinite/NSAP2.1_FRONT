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
  Chip,
  MenuItem,
  Select,
  InputLabel,
  TextField
} from '@mui/material';
import StateList from 'components/form_components/StateList';
import DistrictList from 'components/form_components/DistrictList';
import AreaList from 'components/form_components/AreaList';
import SubDistrictList from 'components/form_components/SubDistrictList';
// import GramPanchayatList from 'components/form_components/GramPanchayatList';
import { Box } from '@mui/system';
import SearchComponent from 'components/common/SearchTypeCommon';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import './complainManagement.css';
import VisibilityIcon from '@mui/icons-material/Visibility';
import MessageIcon from '@mui/icons-material/Message';
import AlertSucess from 'components/common/alertSucess';
function ComplainStatus() {
  const [formInput, setFormInput] = useReducer((state, newState) => ({ ...state, ...newState }), {
    stateId: '',
    districtId: '',
    subDistrictMunicipalAreaId: '',
    ruralUrbanArea: '',
    gramPanchayatWardId: '',
    comment: '',
    nsapUser: '',
    complaintId: '',
    status: ''
  });

  const [warningAlert, setShowwarningAlert] = useState('');
  const [viewData, setViewData] = useState('');
  const [optionValues, setOptionValues] = useState({});
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = React.useState(null);
  const handleCloseSnackbar = () => setSnackbar(null);
  const [getAllComplians, setAllComplians] = useState([]);
  const [user, setUser] = useState([]);
  const [status, setStatus] = useState('ALL');
  const [openModal, setOpenModal] = useState(false);
  const [buttonClicked, setButtonClicked] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  const fetchUsers = async () => {
    try {
      const getUrl = '/userManagement/findAllNsapUser';
      const response = await axiosInstance.get(getUrl);

      setUser(response.data);
    } catch (error) {
      console.error('Error fetching states:', error);
    }
  };

  // Function to handle opening and closing modal

  const handleCloseModal = () => setOpenModal(false);

  const options = {
    complainNo: 'Complaint No.'
  };

  const handleSelectState = (state) => {
    const name = 'stateId';
    setFormInput({ [name]: state });
  };

  const handleDist = (dist) => {
    const name = 'districtId';
    setFormInput({ [name]: dist });
  };

  const handleArea = (area) => {
    const name = 'ruralUrbanArea';
    setFormInput({ [name]: area });
  };
  const handleSubDist = (area) => {
    const name = 'subDistrictMunicipalAreaId';
    setFormInput({ [name]: area });
  };

  // const handleGrampanchayat = (gp) => {
  //   const name = 'gramPanchayatWardId';
  //   setFormInput({ [name]: gp });
  // };
  // const handlevillage = (village) => {
  //   const name = 'villageId';
  //   setFormInput({ [name]: village });
  // };

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

      setLoading(true);

      if (requestData.complainNo) {
        if (/^\d*$/.test(requestData.complainNo)) {
          setShowwarningAlert('');
          const response = await axiosInstance.get(`complain-management/findAllComplainStatusByNo/${requestData.complainNo}`);
          if (response.data.length < 1) {
            setAllComplians([]);
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

  const handleView = (rowData) => {
    console.log(rowData.row.id);
    setFormInput({ ['complaintId']: rowData.row.id });
    setButtonClicked(false);
    setOpenModal(true);
    setViewData(rowData.row);
  };

  const rows = getAllComplians.map((item) => {
    // Format the complaintDate
    const formattedComplaintDate = item.complaintDate ? new Date(item.complaintDate).toLocaleString() : '';
    const complaintResolveDate = item.complaintResolveDate ? new Date(item.complaintResolveDate).toLocaleString() : '';

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
      complaintResolveDate: complaintResolveDate,
      complainLogList: item ? item.complainLogList : ''
    };
  });

  const handleInput = (evt) => {
    const name = evt.target.name;
    setFormInput({ [name]: evt.target.value });
  };





  const upadteStatus = async () => {
    try {

      const postFormDate = JSON.stringify({
        ...formInput,
        status: status
      });
      console.log(postFormDate);
      // const postFormDate = JSON.stringify(formInput);

      const postUrl = '/complain-management/updateStatus';
      const res = await axiosInstance.post(postUrl, postFormDate);
      setSucess(res.status);
      console.log('upadteStatus : Status Code : ', res.status);
      // Reset form fields using dispatch


      if (res.status === 200) {
        setShowAlert(true);
        setLoading(false);
        setButtonClicked(false);
        setFormInput({
          comment: '',
          userNsap: ''
        });
        // Automatically hide the alert after 5 seconds
        const timeoutId = setTimeout(() => {
          setShowAlert(false);
        }, 5000);

        // Clear the timeout when the component is unmounted or when showAlert changes
        return () => clearTimeout(timeoutId);
      }
      setLoading(false);
      setButtonClicked(false);
    } catch (e) {
      setLoading(false);
      setButtonClicked(false);
      console.log('upadteStatus : Status Code : ', e);
    }
  };

  useEffect(() => {
    setStatus(status);
    setFormInput({ ['status']: status });
    if (status === '3') {
      fetchUsers();
    }
  }, [status]);

  return (
    <div>
      {!!snackbar && (
        <Snackbar open anchorOrigin={{ vertical: 'top', horizontal: 'center' }} onClose={handleCloseSnackbar} autoHideDuration={6000}>
          <Alert {...snackbar} onClose={handleCloseSnackbar} />
        </Snackbar>
      )}
      {showAlert && <AlertSucess msg={'Complain'} />}
      {warningAlert && (
        <Alert variant="filled" severity="warning" onClose={handleClose}>
          {warningAlert}
        </Alert>
      )}
      <MainCard title="Complaint Status">
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <StateList onSelectState={handleSelectState} isMandatory={true} />
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
            <DistrictList selectedStateId={formInput.stateId} onSelectDistrict={handleDist} />
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <AreaList onSelectArea={handleArea} />
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <SubDistrictList
                selectedDistrictId={formInput.districtId}
                selectedAreaId={formInput.ruralUrbanArea}
                onSelectSubDistrict={handleSubDist}
              />
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <Select
                value={status} // Ensure the value matches one of the MenuItem values
                onChange={(e) => setStatus(e.target.value)}
              >
                <MenuItem value="ALL">ALL</MenuItem>
                <MenuItem value="In Process">In Process</MenuItem>
                <MenuItem value="Resolve">Resolve</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        <Divider style={{ marginTop: 10 }}>
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
              width: '60%',
              maxHeight: '70%',
              overflowY: 'auto',
              boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
              padding: '30px',
              position: 'relative',
              backgroundColor: '#fff',
              borderRadius: '8px'
            }}
          >
            <MainCard style={{ padding: '5px', marginTop: '5px' }}>
              <table className="details-table">
                <tbody>
                  <tr>
                    <td className="details-heading" style={{ width: '33.33%' }}>
                      Complaint No.:
                    </td>
                    <td className="details-info" style={{ width: '66.66%' }}>
                      <span className="complaint-number">{viewData.id}</span>
                    </td>
                  </tr>
                  <tr>
                    <td className="details-heading" style={{ width: '33.33%' }}>
                      Title:
                    </td>
                    <td className="details-info" style={{ width: '66.66%' }}>
                      {viewData.complaintTitle}
                    </td>
                  </tr>
                  <tr>
                    <td className="details-heading" style={{ width: '33.33%' }}>
                      Detail:
                    </td>
                    <td className="details-info" style={{ width: '66.66%' }}>
                      {viewData.complaintDetail}
                    </td>
                  </tr>
                </tbody>
              </table>
            </MainCard>
            {viewData.complaintResolveBy && (
              <MainCard style={{ padding: '5px', marginTop: '5px' }}>
                <ol className="message-list">
                  {viewData.complainLogList &&
                    viewData.complainLogList.map((complainLog, index) => (
                      <li className="message-item" key={index}>
                        <span className="message-header">{complainLog.fromUserId}</span>&nbsp;
                        <br />

                        <div key={index}>
                          <span className="message-time">{complainLog.compMessageDate}</span>&nbsp;
                          <br />
                          <div style={{ display: 'flex' }}>
                            <MessageIcon /> <span className="message-content">{complainLog.compMessage}</span>
                          </div>
                        </div>

                      </li>
                    ))}
                </ol>
              </MainCard>
            )}
            <MainCard style={{ padding: '5px', marginTop: '5px' }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                  <FormControl fullWidth>
                    <InputLabel>Forward/Resolved</InputLabel>
                    <Select defaultValue="0" value={status} onChange={(e) => setStatus(e.target.value)}>
                      <MenuItem key={'1'} value="1">
                        Forward To State
                      </MenuItem>
                      <MenuItem key={'2'} value="2">
                        Resolve
                      </MenuItem>
                      <MenuItem key={'3'} value="3">
                        Forward To Tech Team
                      </MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                {status === '3' && (
                  <Grid item xs={12} sm={4}>
                    <FormControl fullWidth>
                      <InputLabel id="demo-simple-select-label">User</InputLabel>
                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        label="User Code"
                        name="nsapUser"
                        required
                        value={formInput.nsapUser}
                        onChange={handleInput}
                      >
                        {user.map((scheme) => (
                          <MenuItem key={scheme.userCode} value={scheme.userCode}>
                            {scheme.userCode}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                )}

                <Grid item xs={12} sm={4} style={{}}>
                  <FormControl fullWidth>
                    <TextField
                      label="Comment"
                      multiline
                      rows={2}
                      variant="outlined"
                      fullWidth
                      name="comment"
                      value={formInput.comment}
                      onChange={handleInput}
                      inputProps={{
                        maxLength: 100
                      }}
                    />
                  </FormControl>
                </Grid>
              </Grid>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={4} style={{ display: 'flex', justifyContent: 'center' }}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    style={{ marginRight: '10px' }}
                    title="Update"
                    disabled={buttonClicked}
                    onClick={() => upadteStatus()}
                  >
                    Submit
                  </Button>
                  <Button
                    type="button"
                    variant="contained"
                    color="error"
                    style={{ marginLeft: '10px' }}
                    title="Back"
                    onClick={() => handleCloseModal()}
                  >
                    <ArrowBackIcon /> Back
                  </Button>
                </Grid>
              </Grid>
            </MainCard>
          </Paper>
        </Modal>

        <Backdrop open={loading} style={{ zIndex: 999, color: '#fff' }}>
          <CircularProgress color="inherit" />
        </Backdrop>
      </MainCard>
    </div>
  );
}

export default ComplainStatus;
