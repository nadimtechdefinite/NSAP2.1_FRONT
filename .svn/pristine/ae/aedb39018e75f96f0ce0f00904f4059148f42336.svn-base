// material-ui
import React, { useState, useEffect } from 'react';
import { useReducer } from 'react';
import axiosInstance from 'hooks/useAuthTokenUrl';
//import { useNavigate } from "react-router-dom";

//import Box from '@mui/material/Box';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import {
  Grid,
  FormControl,
  TextField,
  Button,
  InputLabel,
  MenuItem,
  Select,
  ListItemText,
  Checkbox,
  OutlinedInput,
  InputAdornment,
  Typography,
  Alert,
  Backdrop,
  CircularProgress,
  Snackbar
} from '@mui/material';
import StateList from 'components/form_components/StateList';
import DistrictList from 'components/form_components/DistrictList';
import AreaList from 'components/form_components/AreaList';
import SubDistrictList from 'components/form_components/SubDistrictList';
import GramPanchayatList from 'components/form_components/GramPanchayatList';
import UserLevelList from 'components/form_components/UserLevelList';
import UserTypeList from 'components/form_components/UserTypeList';
import AlertSucess from 'components/common/alertSucess';
import Duplicate from 'components/common/Duplicate';
import { showalertwhenObjectretrnvalidation } from 'components/common/fieldValidationFunctionByjava';

// ==============================|| SAMPLE PAGE ||============================== //

function AddUser() {
  //const navigate=useNavigate();
  const [formInput, setFormInput] = useReducer((state, newState) => ({ ...state, ...newState }), {
    userName: '',
    officerName: '',
    stateId: '',
    districtId: null,
    areaId: null,
    subDistrictMunicipalAreaId: null,
    grampanchayatWardId: null,
    emailId: '',
    mobileNo: '',
    designation: '',
    userLevelId: '',
    userPrefix: '',
    userTypeId: ''
  });

  const handleReset = () => {
    setFormInput({
      userName: '',
      officerName: '',
      emailId: '',
      mobileNo: '',
      designation: '',
      userLevelId: '',
      userTypeId: ''
    });
    setSelectedSchemes([]);
  };

  const [showAlert, setShowAlert] = useState(false);
  const [showAlertDup, setShowAlertDup] = useState(false);
  const [warningAlert, setShowwarningAlert] = useState('');
  const [userTypeId, setuserTypeId] = useState('');
  const [loading, setLoading] = useState(false);
  const [buttonClicked, setButtonClicked] = useState(false);
  const [snackbar, setSnackbar] = React.useState(null);
  const handleCloseSnackbar = () => setSnackbar(null);

  // Define action types
  const RESET_FORM = 'RESET_FORM';
  const handleSubmit = async (e) => {
    e.preventDefault();
    event.target.reset();
    setLoading(true);
    setButtonClicked(true);

    const postFormDate = JSON.stringify(formInput);
    if (emailError || mobileNoError) {
      return; // Do not submit the form if there are errors in email or mobile number
    }
    try {
      const postUrl = '/userManagement/saveUserDetails';
      const res = await axiosInstance.post(postUrl, postFormDate);
      console.log('User Master Data Save : Status Code : ', res.status);
      // Reset form fields using dispatch
      const msg = res.data.msg;
      if (res.status === 201) {
        if (msg === 'duplicate') {
          setShowAlertDup(true);
        } else {
          setShowAlert(true);
        }
        setLoading(false);
        setButtonClicked(false);
        // Automatically hide the alert after 5 seconds
        const timeoutId = setTimeout(() => {
          setShowAlert(false);
          setShowAlertDup(false);
        }, 5000);

        // Clear the timeout when the component is unmounted or when showAlert changes
        return () => clearTimeout(timeoutId);
      }
      setLoading(false);
      setButtonClicked(false);
      dispatch({ type: RESET_FORM, initialState: newState });
    } catch (e) {
      // setShowwarningAlert(showalertwhenObjectretrnvalidation(e));
      setShowwarningAlert(showalertwhenObjectretrnvalidation(e));

      console.log('User Master Data Not Save : Some error has occured : ', e);
    } finally {
      setFormInput({
        userName: '',
        officerName: '',
        emailId: '',
        mobileNo: '',
        designation: ''
        // userLevelId: '',
        // userTypeId: ''
      });
      setSelectedSchemes([]);
      setLoading(false);
      setButtonClicked(false);
    }
  };
  const [emailError, setEmailError] = useState('');
  const [mobileNoError, setMobileNoError] = useState('');
  const [stateId, setstateId] = useState();
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

    setFormInput({ [name]: newValue });
  };

  const handleInputUpper = (evt) => {
    const name = evt.target.name;
    const newValue = evt.target.value;
    const uppercaseValue = newValue.toUpperCase();
    if(name === 'officerName'){
      formInput.officerName = uppercaseValue;
    }else{
      formInput.userCode = uppercaseValue;
    }
   
    setFormInput({ [name]: uppercaseValue });
  };

  const handleSelectState = (state) => {
    setstateId(state);
    const name = 'stateId';
    setFormInput({ [name]: state });
  };

  const handleDist = (dist) => {
    const name = 'districtId';
    setFormInput({ [name]: dist });
  };

  const handleArea = (area) => {
    const name = 'areaId';
    setFormInput({ [name]: area });
  };
  const handleSubDist = (area) => {
    const name = 'subDistrictMunicipalAreaId';
    setFormInput({ [name]: area });
  };

  const handleGrampanchayat = (gp) => {
    const name = 'grampanchayatWardId';
    setFormInput({ [name]: gp });
  };

  const [getAllScheme, setAllScheme] = useState([]);
  const [getShortName, setShortName] = useState([]);

  const getGithubData = () => {
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

  const getShortNameApi = () => {
    let endpoints = [`/common/findStateShortName/${stateId}`];
    Promise.all(endpoints.map((endpoint) => axiosInstance.get(endpoint))).then(([{ data: allScheme }]) => {
      setShortName(allScheme.stateShortName + '-');
      setFormInput({ userPrefix: allScheme.stateShortName + '-' });
    });
  };

  useEffect(() => {
    if (stateId) {
      getShortNameApi();
    }
    if (userTypeId) {
      getGithubData();
    }
  }, [stateId, userTypeId]);

  const [getSelectedSchemes, setSelectedSchemes] = React.useState([]);
  const [getUserType, setUserType] = React.useState([]);

  const handleChangeMulti = (event) => {
    const {
      target: { value }
    } = event;
    setSelectedSchemes(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value
    );
    handleInput(event);
  };

  const handleSelectUserLevel = (userLevelId) => {
    setUserType(userLevelId);
    setFormInput({ userLevelId: userLevelId });
  };
  const handleSelectUserType = (userTypeId) => {
    setSelectedSchemes([]);
    setuserTypeId(userTypeId);
    setFormInput({ userTypeId: userTypeId });
  };
  const handleClose = () => {
    setShowwarningAlert('');
  };
  return (
    <div>
      {warningAlert && (
        <Alert variant="filled" severity="warning" onClose={handleClose}>
          {warningAlert}
        </Alert>
      )}
      {!!snackbar && (
        <Snackbar open anchorOrigin={{ vertical: 'top', horizontal: 'center' }} onClose={handleCloseSnackbar} autoHideDuration={6000}>
          <Alert {...snackbar} onClose={handleCloseSnackbar} />
        </Snackbar>
      )}

      {showAlertDup && <Duplicate />}
      {showAlert && <AlertSucess msg={'User'} setShowAlert={setShowAlert} />}
      <MainCard title="Add User">
        <form onSubmit={handleSubmit} style={{ marginTop: '5' }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <StateList onSelectState={handleSelectState} isMandatory={true}/>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <UserLevelList onSelectUserLevel={handleSelectUserLevel} isMandatory={true} />
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                value={formInput.userName}
                label="User Id"
                name="userName"
                placeholder="Enter User Id"
                variant="outlined"
                fullWidth
                onChange={handleInputUpper}
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Typography>
                        <b>{getShortName}</b>
                      </Typography>
                    </InputAdornment>
                  )
                }}
              />
            </Grid>

            {(getUserType === 3 || getUserType === 4) && (
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth>
                  <DistrictList selectedStateId={formInput.stateId} onSelectDistrict={handleDist} isMandatory={true} />
                </FormControl>
              </Grid>
            )}
            {getUserType === 4 && (
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth>
                  <AreaList onSelectArea={handleArea} isMandatory={true} />
                </FormControl>
              </Grid>
            )}
            {getUserType === 4 && (
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth>
                  <SubDistrictList
                    selectedDistrictId={formInput.districtId}
                    selectedAreaId={formInput.areaId}
                    onSelectSubDistrict={handleSubDist}
                    isMandatory={true}
                  />
                </FormControl>
              </Grid>
            )}
            {getUserType === 5 && (
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth>
                  <GramPanchayatList
                    selectedSubDistrictMunicipalAreaId={formInput.subDistrictMunicipalAreaId}
                    onSelectGramPanchayat={handleGrampanchayat}
                    defaultSelectGramPanchayatWardId={handleGrampanchayat}
                    isMandatory={true}
                  />
                </FormControl>
              </Grid>
            )}
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <UserTypeList onSelectUserType={handleSelectUserType} isMandatory={true} />
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
                  value={getSelectedSchemes}
                  onChange={handleChangeMulti}
                  input={<OutlinedInput label="Schemes" />}
                  renderValue={(selected) => selected.join(', ')}
                  name="schemesList"
                  required
                >
                  {getAllScheme.map((item) => (
                    <MenuItem key={item.schemeCode} value={item.schemeCode}>
                      <Checkbox checked={getSelectedSchemes.indexOf(item.schemeCode) > -1} />
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
                value={formInput.officerName}
                placeholder="Enter Program  Officer Name"
                variant="outlined"
                fullWidth
                onChange={handleInputUpper}
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
                value={formInput.designation}
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
                value={formInput.emailId}
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
                value={formInput.mobileNo}
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

            {/* <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">
                  Account Status
                  <Typography variant="body1" color="error" style={{ marginLeft: 5 }}>
                    *
                  </Typography>
                </InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  label="Account Status"
                  name="accountStatus"
                  value={isActive}
                  onChange={handleChange1}
                  required
                >
                  <MenuItem value="true">Open</MenuItem>
                  <MenuItem value="false">Locked</MenuItem>
                </Select>
              </FormControl>
            </Grid> */}
          </Grid>
          <Grid container spacing={2} style={{ alignContent: 'center' }}>
            <Grid item xs={12} sm={4}>
              <Button
                type="submit"
                variant="contained"
                style={{ marginTop: '20px', marginLeft: '10px' }}
                color="primary"
                disabled={buttonClicked}
              >
                ADD
              </Button>
              {/* </Grid>
            <Grid item xs={12} sm={4}> */}
              <Button
                onClick={handleReset}
                type="reset"
                variant="contained"
                color="error"
                style={{ marginTop: '20px', marginLeft: '10px' }}
                title="Reset"
              >
                Reset
              </Button>
            </Grid>
          </Grid>
        </form>

        <Backdrop open={loading} style={{ zIndex: 999, color: '#fff' }}>
          <CircularProgress color="inherit" />
        </Backdrop>
      </MainCard>
    </div>
  );
}

export default AddUser;
