import React from 'react';
import { useReducer, useState } from 'react';
import axiosInstance from 'hooks/useAuthTokenUrl';
import { Button, Grid, Typography, TextField, FormControl, Alert, InputAdornment, Backdrop, CircularProgress } from '@mui/material';
import MainCard from 'ui-component/cards/MainCard';
import AlertSucess from 'components/common/alertSucess';
import MandatoryFields from 'components/common/MandatoryFields';
import Duplicate from 'components/common/Duplicate';
import BankTypeList from 'components/form_components/BankTypeList';
import { showalertwhenObjectretrnvalidation } from 'components/common/fieldValidationFunctionByjava';

function BankAdd() {
  const [formInput, setFormInput] = useReducer((state, newState) => ({ ...state, ...newState }), {
    bankType: '',
    bankCode: '',
    bankName: '',
    bankShortName: ''
  });


  const handleReset = () => {
    setFormInput({
      bankType: '',
      bankCode: '',
      bankName: '',
      bankShortName: ''
    });
  };
  const [showAlert, setShowAlert] = useState(false);
  const [showAlertDup, setShowAlertDup] = useState(false);
  const [showValidationPopup, setShowValidationPopup] = useState(false);
  const [warningAlert, setShowwarningAlert] = useState('');
  const [loading, setLoading] = useState(false);
  const [buttonClicked, setButtonClicked] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    event.target.reset();
    setLoading(true);
    setButtonClicked(true);
    const mandatoryFields = ['bankType', 'bankCode', 'bankName', 'bankShortName'];

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
    // if (/^\d*$/.test(formInput.bankCode)) {
    //   return setFormInput({ ['bankCode']: '' });
    // }
    try {
      const postUrl = '/master-management/saveBankMaster';
      const res = await axiosInstance.post(postUrl, postFormDate);
      console.log('Bank Master Data Save : Status Code : ', res.status);
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
          bankType: '',
          bankCode: '',
          bankName: '',
          bankShortName: ''
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
      setShowwarningAlert(showalertwhenObjectretrnvalidation(e));

      console.log('Bank Master Data Not Save : Some error has occured : ', JSON.stringify(e.response.data));
    }
  };

  const handleInput = (evt) => {
    const name = evt.target.name;
    const newValue = evt.target.value.toUpperCase();
    setFormInput({ [name]: newValue });
  };

  const handleSelectbank = (state) => {
    const name = 'bankType';
    setFormInput({ [name]: state });
  };
  const handleClose = () => {
    setShowwarningAlert('');
  };
  return (
    <div>
      <MainCard title="Add Bank">
        {warningAlert && (
          <Alert variant="filled" severity="warning" onClose={handleClose}>
            {warningAlert}
          </Alert>
        )}

        {showValidationPopup && <MandatoryFields />}
        {showAlertDup && <Duplicate />}
        {showAlert && <AlertSucess msg={'Bank'} setShowAlert={setShowAlert} />}
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <BankTypeList onSelectbankType={handleSelectbank} />
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                label="Bank Code"
                name="bankCode"
                placeholder="Enter Bank Code"
                variant="outlined"
                fullWidth
                value={formInput.bankCode}
                onChange={handleInput}
                InputProps={{
                  inputProps: {
                    pattern: '^[A-Za-z0-9]*$',
                    title: 'Only characters and Numbers are allowed.Space are not Allowed',
                    maxLength: 20
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
                label="Bank Name"
                name="bankName"
                placeholder="Enter Bank Name"
                variant="outlined"
                fullWidth
                value={formInput.bankName.toUpperCase()}
                onChange={handleInput}
                InputProps={{
                  inputProps: {
                    pattern: '^[A-Za-z\\s()\\.\\-]*$',
                    title: 'Only characters are allowed',
                    maxLength: 70
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
                label="Bank Short Name"
                name="bankShortName"
                placeholder="Enter Bank Short Name"
                variant="outlined"
                fullWidth
                value={formInput.bankShortName.toUpperCase()}
                onChange={handleInput}
                InputProps={{
                  inputProps: {
                    pattern: '^[A-Za-z\\s()\\.\\-]*$',
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

            
          </Grid>
          <Grid container spacing={2} style={{ marginTop: '20px', marginLeft: '10px' }}>
            <Grid item xs={12} sm={4}>
              <Button type="submit" variant="contained" style={{ marginTop: '20px', marginLeft: '10px' }} color="secondary" disabled={buttonClicked}>
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
export default BankAdd;
