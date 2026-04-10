import React from 'react';
import { useReducer, useState } from 'react';
import axiosInstance from 'hooks/useAuthTokenUrl';
import { Button, Grid, Typography, TextField, InputAdornment, Alert } from '@mui/material';
import MainCard from 'ui-component/cards/MainCard';
import AlertSucess from 'components/common/alertSucess';
import MandatoryFields from 'components/common/MandatoryFields';
import Duplicate from 'components/common/Duplicate';
import { showalertwhenObjectretrnvalidation } from 'components/common/fieldValidationFunctionByjava';

function DisbursementAdd() {
  const [formInput, setFormInput] = useReducer((state, newState) => ({ ...state, ...newState }), {
    // disbursementCode: '',
    disbursementName: '',
    disbursementShortName: ''
  });

  const [showAlert, setShowAlert] = useState(false);
  const [showAlertDup, setShowAlertDup] = useState(false);
  const [showValidationPopup, setShowValidationPopup] = useState(false);
  const [warningAlert, setShowwarningAlert] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    event.target.reset();
    const mandatoryFields = ['disbursementName', 'disbursementShortName'];

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
      const postUrl = '/master-management/saveDisbursement';
      const res = await axiosInstance.post(postUrl, postFormDate);
      console.log('Disbursement Master Data Save : Status Code : ', res.status);
      // Reset form fields using dispatch

      const msg = res.data.msg;
      if (res.status === 201) {
        if (msg === 'duplicate') {
          setShowAlertDup(true);
        } else {
          setShowAlert(true);
        }
        setFormInput({
          // disbursementCode: '',
          disbursementName: '',
          disbursementShortName: ''
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
      console.log('Disbursement Master Data Not Save : Some error has occured : ', e);
    }
  };

  const handleInput = (evt) => {
    const name = evt.target.name;
    const newValue = evt.target.value.toUpperCase();
    setFormInput({ [name]: newValue });
  };
  const handleClose = () => {
    setShowwarningAlert('');
  };
  return (
    <div>
      <MainCard title="Add Disbursement">
        {warningAlert && (
          <Alert variant="filled" severity="warning" onClose={handleClose}>
            {warningAlert}
          </Alert>
        )}
        {showValidationPopup && <MandatoryFields />}
        {showAlertDup && <Duplicate />}
        {showAlert && <AlertSucess msg={'Disbursement'} setShowAlert={setShowAlert} />}
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <TextField
                label="Disbursement Name"
                name="disbursementName"
                placeholder="Enter Disbursement Name"
                variant="outlined"
                fullWidth
                value={formInput.disbursementName.toUpperCase()}
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
                label="Disbursement Short Name"
                name="disbursementShortName"
                placeholder="Enter Disbursement Short Name"
                variant="outlined"
                fullWidth
                value={formInput.disbursementShortName.toUpperCase()}
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

            <Grid item xs={12} alignItems="center">
              <Button type="submit" variant="contained" color="secondary">
                ADD
              </Button>
            </Grid>
          </Grid>
        </form>
      </MainCard>
    </div>
  );
}
export default DisbursementAdd;
