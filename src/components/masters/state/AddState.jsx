import React from 'react';
import { useReducer, useState } from 'react';
import axiosInstance from 'hooks/useAuthTokenUrl';
import {
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Typography,
  TextField,
  InputAdornment,
  Alert,
  Backdrop,
  CircularProgress,
  Snackbar
} from '@mui/material';
import MainCard from 'ui-component/cards/MainCard';
import AlertSucess from 'components/common/alertSucess';
import MandatoryFields from 'components/common/MandatoryFields';
import Duplicate from 'components/common/Duplicate';
// import { showalertwhenObjectretrnvalidation } from 'components/common/fieldValidationFunctionByjava';

function AddState() {
  const [formInput, setFormInput] = useReducer((state, newState) => ({ ...state, ...newState }), {
    stateId: '',
    stateName: '',
    stateShortName: '',
    stateNodalAgencyName: '',
    stateAgencyAddress: '',
    levelOfApplication: '',
    unionTerritory: ''
  });

  const handleReset = () => {
    setFormInput({
      stateId: '',
      stateName: '',
      stateShortName: '',
      stateNodalAgencyName: '',
      stateAgencyAddress: '',
      levelOfApplication: '',
      unionTerritory: ''
    });
  };

  const [showAlert, setShowAlert] = useState(false);
  const [showAlertDup, setShowAlertDup] = useState(false);
  const [showValidationPopup, setShowValidationPopup] = useState(false);
  const [warningAlert, setShowwarningAlert] = useState('');
  const [loading, setLoading] = useState(false);
  const [buttonClicked, setButtonClicked] = useState(false);
  const [snackbar, setSnackbar] = React.useState(null);
  const handleCloseSnackbar = () => setSnackbar(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    event.target.reset();
    setLoading(true);
    setButtonClicked(true);
    const mandatoryFields = ['stateName', 'stateShortName'];

    const isFormValid = mandatoryFields.every((field) => formInput[field]);

    if (!isFormValid) {
      setShowValidationPopup(true);
      // Hide the popup after 3 seconds (adjust the timing as needed)
      setTimeout(() => {
        setShowValidationPopup(false);
      }, 3000);
      return;
    }
    const postFormDate = JSON.stringify(formInput);
    try {
      const postUrl = '/master-management/saveState';
      const res = await axiosInstance.post(postUrl, postFormDate);
      console.log('State Master Data Save : Status Code : ', res.status);
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
        setFormInput({
          stateId: '',
          stateName: '',
          stateShortName: '',
          stateNodalAgencyName: '',
          stateAgencyAddress: '',
          levelOfApplication: '',
          unionTerritory: ''
        });
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
    } catch (e) {
      setLoading(false);
      setButtonClicked(false);
      setSnackbar({ children: 'Some Network / Data Base error Occured.', severity: 'error' });
      console.log('State Master Data Not Save : Some error has occured : ', e);
    }
  };

  // const [levelOfApp, setlevelOfApp] = React.useState('');
  const [unionTertry, setunionTertry] = React.useState('');

  const handleInput = (evt) => {
    const name = evt.target.name;
    const newValue = evt.target.value;
    setFormInput({ [name]: newValue });
  };

  // const handleChange1 = (event) => {
  //   handleInput(event);
  //   setlevelOfApp(event.target.value);
  // };

  const handleChange2 = (event) => {
    handleInput(event);
    setunionTertry(event.target.value);
  };
  const handleClose = () => {
    setShowwarningAlert('');
  };
  return (
    <div>
      <MainCard title="Add State">
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
        {showValidationPopup && <MandatoryFields />}
        {showAlertDup && <Duplicate />}
        {showAlert && <AlertSucess msg={'State'} />}
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            {/* <Grid item xs={12} sm={4}>
              <TextField
                label="State Code"
                name="stateId"
                placeholder="Enter State Code"
                variant="outlined"
                fullWidth
                onChange={handleInput}
              />
            </Grid> */}
            <Grid item xs={12} sm={4}>
              <TextField
                label="State Name"
                name="stateName"
                placeholder="Enter State Name"
                variant="outlined"
                fullWidth
                value={formInput.stateName.toUpperCase()}
                onChange={handleInput}
                required
                InputProps={{
                  inputProps: {
                    pattern: '^[A-Za-z\\s]*$',
                    title: 'Only characters are allowed',
                    maxLength: 50
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
                label="State Short Name"
                name="stateShortName"
                placeholder="Enter State Short Name"
                variant="outlined"
                fullWidth
                value={formInput.stateShortName.toUpperCase()}
                onChange={handleInput}
                required
                InputProps={{
                  inputProps: {
                    pattern: '^[A-Za-z\\s]*$',
                    title: 'Only characters are allowed',
                    maxLength: 2
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
              <TextField
                label="State Nodal Agency"
                name="stateNodalAgencyName"
                placeholder="Enter state Nodal Agency"
                variant="outlined"
                fullWidth
                value={formInput.stateNodalAgencyName.toUpperCase()}
                onChange={handleInput}
                InputProps={{
                  inputProps: {
                    pattern: '^[A-Za-z\\s]*$',
                    title: 'Only characters are allowed',
                    maxLength: 50
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
                label="State Nodal Agency Address"
                name="stateAgencyAddress"
                placeholder="Enter State Nodal Agency Address"
                variant="outlined"
                fullWidth
                value={formInput.stateAgencyAddress.toUpperCase()}
                onChange={handleInput}
                InputProps={{
                  inputProps: {
                    // pattern: '^[A-Za-z\\s]*$',
                    // title: 'Only characters are allowed',
                    maxLength: 50
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
            </Grid> */}

            {/* <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Level Of Application</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  label="Level Of Application"
                  name="levelOfApplication"
                  value={levelOfApp}
                  onChange={handleChange1}
                >
                  <MenuItem value="1">1</MenuItem>
                  <MenuItem value="2">2</MenuItem>
                  <MenuItem value="3">3</MenuItem>
                </Select>
              </FormControl>
            </Grid> */}
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Union Territory</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  label="Union Territory"
                  name="unionTerritory"
                  value={unionTertry}
                  onChange={handleChange2}
                  required
                >
                  <MenuItem value="Yes">Yes</MenuItem>
                  <MenuItem value="No">No</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
          <Grid container spacing={2} style={{ marginTop: '20px', marginLeft: '10px' }}>
            <Grid item xs={12} sm={4}>
              <Button
                type="submit"
                variant="contained"
                style={{ marginTop: '20px', marginLeft: '10px' }}
                color="secondary"
                disabled={buttonClicked}
              >
                ADD
              </Button>
            </Grid>
            <Grid item xs={12} sm={4}>
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
export default AddState;
