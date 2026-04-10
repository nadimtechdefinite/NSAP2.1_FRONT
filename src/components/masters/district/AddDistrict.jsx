import React, { useState, useEffect } from 'react';
import { useReducer } from 'react';
import MainCard from 'ui-component/cards/MainCard';
import { Button, FormControl, Grid, Typography, TextField, InputAdornment, Alert, Backdrop, CircularProgress } from '@mui/material';
import AlertSucess from 'components/common/alertSucess';
import axiosInstance from 'hooks/useAuthTokenUrl';
import StateList from 'components/form_components/StateList';
import Duplicate from 'components/common/Duplicate';
import { showalertwhenObjectretrnvalidation } from 'components/common/fieldValidationFunctionByjava';

function AddDistrict() {
  const [formInput, setFormInput] = useReducer((state, newState) => ({ ...state, ...newState }), {
    stateId: '',
    districtName: '',
    districtShortName: '',
    lgtDistrictCode: '',
    districtAgency: '',
    districtAgencyAddress: ''
  });

  const handleReset = () => {
    setFormInput({
      stateId: '',
      districtName: '',
      districtShortName: '',
      lgtDistrictCode: '',
      districtAgency: '',
      districtAgencyAddress: ''
    });
  };

  const [showAlert, setShowAlert] = useState(false);
  const [showAlertDup, setShowAlertDup] = useState(false);
  const [warningAlert, setShowwarningAlert] = useState('');
  const [loading, setLoading] = useState(false);
  const [buttonClicked, setButtonClicked] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    event.target.reset();
    setLoading(true);
    setButtonClicked(true);

    const postFormDate = JSON.stringify(formInput);
    try {
      const postUrl = '/master-management/saveDistrict';
      const res = await axiosInstance.post(postUrl, postFormDate);
      console.log('District Master Data Save : Status Code : ', res.status);
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
          districtName: '',
          districtShortName: '',
          lgtDistrictCode: '',
          districtAgency: '',
          districtAgencyAddress: ''
        });

        // Automatically hide the alert after 5 seconds
        const timeoutId = setTimeout(() => {
          setShowAlert(false);
          setShowAlertDup(false);
        }, 5000);

        // Clear the timeout when the component is unmounted or when showAlert changes
        return () => clearTimeout(timeoutId);
      }
    } catch (e) {
      setShowwarningAlert(showalertwhenObjectretrnvalidation(e));
      console.log('District Master Data Not Save : Some error has occured : ', e);
    } finally {
      setLoading(false);
      setButtonClicked(false);
    }
  };

  const handleInput = (evt) => {
    const name = evt.target.name;
    const newValue = evt.target.value;
    setFormInput({ [name]: newValue });
  };
  const [getAllState, setAllState] = useState([]);
  const getGithubData = () => {
    const findAllStatesUrl = '/master-management/findAllStates';
    let endpoints = [findAllStatesUrl];
    Promise.all(endpoints.map((endpoint) => axiosInstance.get(endpoint))).then(([{ data: allState }]) => {
      setAllState(allState);
    });
  };
  console.log(getAllState[0]);
  useEffect(() => {
    getGithubData();
  }, []);

  const handleSelectState = (state) => {
    const name = 'stateId';
    setFormInput({ [name]: state });
  };
  const handleInputChangeData = (event) => {
    if (event.target.value != null && event.target.value != '') {
      event.target.value = event.target.value.replace(/[^0-9]/g, '');
    }
  };

  const handleClose = () => {
    setShowwarningAlert('');
  };
  return (
    <div>
      <MainCard title="Add District">
        {warningAlert && (
          <Alert variant="filled" severity="warning" onClose={handleClose}>
            {warningAlert}
          </Alert>
        )}

        {showAlertDup && <Duplicate />}
        {showAlert && <AlertSucess msg={'Discrict'} />}
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <StateList onSelectState={handleSelectState} isMandatory={true} />
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                label="District"
                name="districtName"
                placeholder="Enter District Name"
                variant="outlined"
                fullWidth
                value={formInput.districtName.toUpperCase()}
                onChange={handleInput}
                required
                InputProps={{
                  inputProps: {
                    pattern: '^[A-Za-z\\d\\s]*$',
                    title: 'Only characters and numbers are allowed',
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
                label="District Short Name"
                name="districtShortName"
                placeholder="Enter District Short Name"
                variant="outlined"
                fullWidth
                value={formInput.districtShortName.toUpperCase()}
                onChange={handleInput}
                required
                InputProps={{
                  inputProps: {
                    pattern: '^[A-Za-z\\d\\s]*$',
                    title: 'Only characters and numbers are allowed',
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
            <Grid item xs={12} sm={4}>
              <TextField
                label="Lgt District Code"
                name="lgtDistrictCode"
                placeholder="Enter Lgt District Code"
                variant="outlined"
                fullWidth
                onChange={handleInput}
                onInput={handleInputChangeData}
                InputProps={{
                  inputProps: {
                    pattern: '^[0-9]*$', // Allow only numbers
                    title: 'Only numbers are allowed',
                    maxLength: 10
                  }
                }}
              />
            </Grid>
            {/* <Grid item xs={12} sm={4}>
              <TextField
                label="District Agency Name"
                name="districtAgency"
                placeholder="Enter District Agency Name"
                variant="outlined"
                fullWidth
                onChange={handleInput}
                value={formInput.districtAgency.toUpperCase()}
                inputProps={{
                  maxLength: 25
                }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                label="District Agency Address"
                name="districtAgencyAddress"
                placeholder="Enter District Agency Address"
                variant="outlined"
                fullWidth
                onChange={handleInput}
                value={formInput.districtAgencyAddress.toUpperCase()}
                inputProps={{
                  maxLength: 35
                }}
              />
            </Grid> */}
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

export default AddDistrict;
