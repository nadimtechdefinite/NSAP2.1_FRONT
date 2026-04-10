import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import MainCard from 'ui-component/cards/MainCard';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import axiosInstance from 'hooks/useAuthTokenUrl';
import EditIcon from '@mui/icons-material/Edit';
import {
  Paper,
  Button,
  FormControl,
  Grid,
  Typography,
  TextField,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  ListItemText,
  Checkbox,
  OutlinedInput,
  Alert,
  Backdrop,
  CircularProgress,
  Snackbar
} from '@mui/material';
import AlertSucess from 'components/common/alertSucess';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AreaList from 'components/form_components/AreaList';
import DistrictList from 'components/form_components/DistrictList';
import SubDistrictList from 'components/form_components/SubDistrictList';
import StateList from 'components/form_components/StateList';
import UserTypeList from 'components/form_components/UserTypeList';
import UserLevelList from 'components/form_components/UserLevelList';
import { showalertwhenObjectretrnvalidation } from 'components/common/fieldValidationFunctionByjava';

function UpdateUser() {
  const [showedit, setShowEdit] = useState(false);
  const [buttonClicked, setButtonClicked] = useState(false);

  const columns = [
    {
      field: 'Count',
      headerName: 'S. No.',
      flex: 0.5
    },
    {
      field: 'userCode',
      headerName: 'User Id',
      flex: 1.5
    },
    {
      field: 'officerName',
      headerName: 'Officer Name',
      flex: 1.5
    },
    {
      field: 'userTypeName',
      headerName: 'User Type',
      flex: 1
    },
    {
      field: 'userLevelName',
      headerName: 'User Level',
      flex: 1
    },
    {
      field: 'schemeCode',
      headerName: 'Schemes List',
      flex: 2
    },
    {
      field: 'designation',
      headerName: 'Designation',
      flex: 1
    },
    {
      field: 'emailId',
      headerName: 'Email Id',
      flex: 1
    },
    {
      field: 'mobileNo',
      headerName: 'Mobile',
      flex: 1
    },
    {
      field: 'action',
      headerName: 'Action',
      flex: 1,
      // headerAlign: 'center',
      renderCell: (params) => (
        <>
          <Button
            //   variant="outlined"
            color="info"
            style={{ cursor: 'pointer', fontSize: '12px', marginRight: '8px' }}
            onClick={() => handleEdit(params)}
          >
            <EditIcon />
          </Button>
        </>
      )
    }
  ];

  const [showAlert, setShowAlert] = useState(false);

  const [getAllState, setAllState] = useState([]);
  const [stateId, setStateId] = useState('');
  const [getUserType, setUserType] = React.useState([]);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState(null);
  const handleCloseSnackbar = () => setSnackbar(null);

  const fetchData = async () => {
    setLoading(true);
    setAllState([]);
    const getUrl = `/userManagement/findAllUserDetails/${stateId}`;
  
    try {
      const response = await axiosInstance.get(getUrl);
    
  
      if (response.status >= 200 && response.status < 300) {
        const dataWithSerialNumber = response.data.map((item, index) => ({
          ...item,
          Count: index + 1
        }));
        setLoading(false);
        return dataWithSerialNumber;
      } else {
       
        setSnackbar({ children: 'No Data Found', severity: 'error' });
        throw new Error('Data could not be fetched!', response.status);
      }
    } catch (error) {
      setLoading(false);
      setSnackbar({ children: 'Error fetching data', severity: 'error' });
      console.error('Error fetching data:', error);

      throw error; 
    } finally {
     
      setLoading(false);
    }
  };
  

  // --------------------------------------------------------------------
  const [getallRowEdit, setallRowEdit] = useState({});
  const [userTypeId, setuserTypeId] = useState('');

  // const [getSelectedSchemes, setSelectedSchemes] = React.useState([]);

  const [getAllScheme, setAllScheme] = useState([]);
  const [warningAlert, setShowwarningAlert] = useState('');

  const getGithubData = () => {
    getallRowEdit.schemesList = [];
    let endpoints = ['/master-management/findAllScheme'];
    Promise.all(endpoints.map((endpoint) => axiosInstance.get(endpoint))).then((responses) => {
      const allScheme = responses.map(({ data }) => data);
      const flattenedScheme = allScheme.flat();

      let filteredScheme = [];

      if (userTypeId == 1) {
        filteredScheme = flattenedScheme.filter((scheme) => scheme.schemeType === 'CENTER');
      } else {
        filteredScheme = flattenedScheme.filter((scheme) => scheme.schemeType === 'STATE');
      }
      setAllScheme(filteredScheme);
    });
  };

  const handleEdit = (rowData) => {
    setShowEdit(true);
    setSnackbar(false);
    console.log('Editing:', rowData.row);
    setallRowEdit(rowData.row);
    setUserType(rowData.row.userLevelId);
    // }
  };
  const handleSelectUserType = (userTypeId) => {
    setuserTypeId(userTypeId);
    setallRowEdit((prevRowEdit) => ({
      ...prevRowEdit,
      ['userTypeId']: userTypeId
    }));
  };
  const handleSelectUserLevel = (userLevelId) => {
    setUserType(userLevelId);

    if (userLevelId === 3) {
      setallRowEdit((prevRowEdit) => ({
        ...prevRowEdit,
        userLevelId,
        areaId: null,
        subDistrictMunicipalAreaId: null
      }));
    } else if (userLevelId === 2) {
      setallRowEdit((prevRowEdit) => ({
        ...prevRowEdit,
        userLevelId,
        districtId: null,
        areaId: null,
        subDistrictMunicipalAreaId: null
      }));
    } else {
      setallRowEdit((prevRowEdit) => ({
        ...prevRowEdit,
        userLevelId
      }));
    }
    setallRowEdit((prevRowEdit) => ({
      ...prevRowEdit,
      ['userLevelId']: userLevelId
    }));
  };
  const handleSelectState = (state) => {
    setallRowEdit((prevRowEdit) => ({
      ...prevRowEdit,
      ['stateId']: state
    }));
  };

  const handleInputUpperUName = (state) => {
      setallRowEdit((prevRowEdit) => ({
        ...prevRowEdit,
        ['officerName']: state.target.value.toUpperCase()
      }));
 
  };
  // const [acStatus, setacStatus] = React.useState('');

  const [emailError, setEmailError] = useState('');
  const [mobileNoError, setMobileNoError] = useState('');

  const handleInput = (evt) => {
    const name = evt.target.name;
    const newValue = evt.target.value;

    if (name === 'emailId') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const isValidEmail = emailRegex.test(newValue) && newValue.split('@').length === 2;

      if (!isValidEmail) {
        setEmailError('Invalid email format');
      } else {
        setEmailError('');
      }
    }

    // Add mobile number validation
    if (name === 'mobileNo') {
      const mobileRegex = /^(?!.*(\d)\1{9})[6789]\d{9}$/; // Adjust the regular expression as per your mobile number format
      const isValidMobile = mobileRegex.test(newValue);

      if (!isValidMobile) {
        setMobileNoError('Invalid mobile number format');
      } else {
        setMobileNoError('');
      }
    }

    setallRowEdit((prevRowEdit) => ({
      ...prevRowEdit,
      [name]: evt.target.value
    }));
  };
  const handleArea = (area) => {
    setallRowEdit((prevRowEdit) => ({
      ...prevRowEdit,
      areaId: area
    }));
  };
  const handleDist = (dist) => {
    setallRowEdit((prevRowEdit) => ({
      ...prevRowEdit,
      districtId: dist
    }));
  };
  async function postData(e) {
    e.preventDefault();
    event.target.reset();
    setLoading(true);
    setButtonClicked(true);
    const postFormDate = JSON.stringify(getallRowEdit);
    if (emailError || mobileNoError) {
      return; // Do not submit the form if there are errors in email or mobile number
    }
    var result = window.confirm('Are you sure want to Update the record? ');
    if (result) {
      try {
        const postUrl = '/userManagement/updateUserDetails';
        const res = await axiosInstance.put(postUrl, postFormDate);
        console.log('User Master Data update : Status Code : ', res.status);
        if (res.status === 201) {
          setShowAlert(true);

          const updatedData = await fetchData();
          // Update the state with the new data
          setAllState(updatedData);
          setLoading(false);
          setButtonClicked(false);
          // Automatically hide the alert after 5 seconds
          const timeoutId = setTimeout(() => {
            setShowAlert(false);
          }, 5000);

          // Clear the timeout when the component is unmounted or when showAlert changes
          return () => clearTimeout(timeoutId);
        }

        //navigate("/masters/criteria/update");
      } catch (error) {
        setLoading(false);
        setButtonClicked(false);
        setShowwarningAlert(showalertwhenObjectretrnvalidation(error));
        console.error('Error updating data:', error);
        // setSnackbar({ children: 'Record failed in update!', severity: 'error' });
      }
    } else {
      // ...do nothing
    }
  }

  const rows = getAllState.map((item) => {
    // console.log('xxxx', item.userDataManagementTO?.userSchemeTO?.map((scheme) => scheme.schemeCode) || []);
    const schemeCodes = item.userDataManagementTO?.userSchemeTO?.map((scheme) => scheme.schemeCode) || [];
    const userTypeName = item.userDataManagementTO?.userSchemeTO?.[0].userTypeName || '';
    
    return {
      userDetailsId: item.userDetailsId,
      Count: item.Count,
      emailId: item.emailId,
      mobileNo: item.mobileNo,
      designation: item.designation,
      userLevelId: item.userLevelId,
      userLevelName: item.userLevelName,
      schemeCode: schemeCodes.join(', '),
      userTypeName: userTypeName,
      userTypeId: item.userTypeId,
      officerName: item.officerName,
      areaId: item.areaId,
      userCode: item.userDataManagementTO?.userCode,
      subDistrictMunicipalAreaId: item.subDistrictMunicipalAreaId,
      districtName: item ? item.districtName : '',
      stateName: item ? item.stateName : '',
      subDistrictMunicipalAreaName: item ? item.subDistrictName : '',
      stateId: item.stateId,
      gramPanchayatWardName: item.gramPanchayatWardName,
      gramPanchayatWardId: item.gramPanchayatWardId,
      districtId: item.districtId,
      schemesList: item.userDataManagementTO?.userSchemeTO?.map((scheme) => scheme.schemeCode) || []
    };
  });

  // Update the handleChangeMulti function
  const handleChangeMulti = (event) => {
    const {
      target: { value }
    } = event;
    // setSelectedschemesList(
    //   // On autofill we get a stringified value.
    //   typeof value === 'string' ? value.split(',') : value
    // );

    // Update schemesList in your state
    setallRowEdit((prevRowEdit) => ({
      ...prevRowEdit,
      schemesList: value
    }));
  };
  const handleBackButtonClick = () => {
    setShowEdit(false);
  };

  const handleSubDist = (subdist) => {
    setallRowEdit((prevRowEdit) => ({
      ...prevRowEdit,
      subDistrictMunicipalAreaId: subdist
    }));
  };

  const handleSelectStateid = (state) => {
    setStateId(state);
  };

  useEffect(() => {
    if (stateId) {
      fetchData()
        .then((res) => {
          setAllState(res);
        })
        .catch((e) => {
          console.log(e.message);
        });
    }

    getGithubData();
  }, [stateId, userTypeId]);

  const handleClose = () => {
    setShowwarningAlert('');
  };
  return (
    <div>
      {/* ------------------------------------------------------------------- */}
      {!!snackbar && (
        <Snackbar open anchorOrigin={{ vertical: 'top', horizontal: 'center' }} onClose={handleCloseSnackbar} autoHideDuration={6000}>
          <Alert {...snackbar} onClose={handleCloseSnackbar} />
        </Snackbar>
      )}
      {!showedit && (
        <MainCard title="Update User Master">
          <Grid container spacing={2} style={{ paddingBottom: '20px' }}>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <StateList onSelectState={handleSelectStateid} />
              </FormControl>
            </Grid>
          </Grid>

          {rows.length !== 0 && (
            <Paper
              elevation={1} // Set the elevation to give it a shadow
              style={{ backgroundColor: 'lightblue', padding: '16px' }} // Set your desired background color
            ></Paper>
          )}

          {rows.length !== 0 && (
            <Box sx={{ height: 700, width: '100%' }}>
              <DataGrid
                getRowId={(row) => row.userDetailsId}
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
        </MainCard>
      )}
      {/* ------------------------Edit-------------------------------------------------------- */}

      {showAlert && <AlertSucess msg={'User'} setShowAlert={setShowAlert} />}

      {showedit && (
        <MainCard title="Edit User Master">
          {warningAlert && (
            <Alert variant="filled" severity="warning" onClose={handleClose}>
              {warningAlert}
            </Alert>
          )}
          <Box sx={{ height: 400, width: '100%' }}>
            <form method="post" onSubmit={postData}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                  <FormControl fullWidth>
                    <TextField fullWidth label="User Id" value={getallRowEdit.userCode} aria-readonly />
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <FormControl fullWidth>
                    <UserLevelList onSelectUserLevel={handleSelectUserLevel} selectedUserLevel={getallRowEdit.userLevelId} />
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <FormControl fullWidth>
                    <StateList defaultSelectedState={getallRowEdit.stateId} onSelectState={handleSelectState} isMandatory={true}/>
                  </FormControl>
                </Grid>
                {(getUserType === 3 || getUserType === 4) && (
                  <Grid item xs={12} sm={4}>
                    <FormControl fullWidth>
                      <DistrictList
                        selectedStateId={getallRowEdit.stateId}
                        onSelectDistrict={handleDist}
                        defaultSelectedDistrict={getallRowEdit.districtId} isMandatory={true}
                      />
                    </FormControl>
                  </Grid>
                )}
                {getUserType === 4 && (
                  <Grid item xs={12} sm={4}>
                    <FormControl fullWidth>
                      <AreaList selectedArea={getallRowEdit.areaId} onSelectArea={handleArea} isMandatory={true}/>
                    </FormControl>
                  </Grid>
                )}
                {getUserType === 4 && (
                  <Grid item xs={12} sm={4}>
                    <FormControl fullWidth>
                      <SubDistrictList
                        selectedDistrictId={getallRowEdit.districtId}
                        selectedAreaId={getallRowEdit.areaId}
                        onSelectSubDistrict={handleSubDist}
                        defaultSelectedSubDistrict={getallRowEdit.subDistrictMunicipalAreaId} isMandatory={true}
                      />
                    </FormControl>
                  </Grid>
                )}

                <Grid item xs={12} sm={4}>
                  <FormControl fullWidth>
                    <UserTypeList onSelectUserType={handleSelectUserType} selectedUserType={getallRowEdit.userTypeId} isMandatory={true}/>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={4}>
                  <FormControl fullWidth>
                    <InputLabel id="demo-multiple-checkbox-label">
                      Schemes
                      <Typography variant="body1" color="error" style={{ marginLeft: 5 }}>
                        *
                      </Typography>
                    </InputLabel>
                    <Select
                      labelId="demo-multiple-checkbox-label"
                      id="demo-multiple-checkbox"
                      multiple
                      value={getallRowEdit.schemesList}
                      onChange={handleChangeMulti}
                      input={<OutlinedInput label="Schemes" />}
                      renderValue={(selected) => selected.join(', ')}
                      /* MenuProps={MenuProps} */
                      name="schemesList"
                      required
                    >
                      {getAllScheme.map((item) => (
                        <MenuItem key={item.schemeCode} value={item.schemeCode}>
                          <Checkbox checked={getallRowEdit.schemesList.indexOf(item.schemeCode) > -1} />
                          <ListItemText primary={item.schemeName} />
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={4}>
              <TextField
                label="Officer Name"
                name="officerName"
                value={getallRowEdit.officerName}
                placeholder="Enter Program  Officer Name"
                variant="outlined"
                fullWidth
                onChange={handleInputUpperUName}
                required
                InputProps={{
                  inputProps: {
                    pattern: '^[A-Za-z\\s]*$',
                    title: 'Only characters and spaces are allowed',
                    maxLength: 30,
                  },                  
                  endAdornment: (
                    <InputAdornment position="end">
                      <Typography variant="h3" color="error">
                        *
                      </Typography>
                    </InputAdornment>
                  )
                }}
              />
            </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    label="Designation"
                    name="designation"
                    value={getallRowEdit.designation}
                    placeholder="Enter your designation"
                    variant="outlined"
                    fullWidth
                    onChange={handleInput}
                    required
                    InputProps={{
                      inputProps: {
                        pattern: '^[A-Za-z\\s]*$',
                        title: 'Only characters are allowed',
                        maxLength: 30
                      },
                      endAdornment: (
                        <InputAdornment position="end">
                          <Typography variant="h3" color="error">
                            *
                          </Typography>
                        </InputAdornment>
                      )
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    label="Program Officer Email Id"
                    name="emailId"
                    placeholder="Program Officer Email Id"
                    variant="outlined"
                    fullWidth
                    value={getallRowEdit.emailId}
                    onChange={handleInput}
                    error={!!emailError}
                    helperText={emailError}
                    required
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <Typography variant="h3" color="error">
                            *
                          </Typography>
                        </InputAdornment>
                      )
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    label="Program Officer Mobile No"
                    name="mobileNo"
                    placeholder="Program Officer Mobile No"
                    variant="outlined"
                    fullWidth
                    onChange={handleInput}
                    value={getallRowEdit.mobileNo}
                    error={!!mobileNoError}
                    helperText={mobileNoError}
                    required
                    InputProps={{
                      inputProps: {
                        pattern: '^[0-9]*$',
                        title: 'Only Number are allowed',
                        maxLength: 10
                      },
                      endAdornment: (
                        <InputAdornment position="end">
                          <Typography variant="h3" color="error">
                            *
                          </Typography>
                        </InputAdornment>
                      )
                    }}
                  />
                </Grid>
              </Grid>
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '20px' }}>
                <Button type="submit" variant="contained" color="primary" style={{ marginRight: '10px' }} title="Update">
                  Update
                </Button>
                <Button
                  type="button"
                  variant="contained"
                  color="error" // Note: "danger" is not a valid color, you might want to use "error"
                  style={{ marginLeft: '10px' }}
                  title="Back"
                  onClick={() => handleBackButtonClick()} // Add an onClick handler if needed
                  disabled={buttonClicked}
                >
                  <ArrowBackIcon /> Back
                </Button>
              </div>
            </form>
          </Box>
        </MainCard>
      )}

      <Backdrop open={loading} style={{ zIndex: 999, color: '#fff' }}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </div>
  );
}

export default UpdateUser;
