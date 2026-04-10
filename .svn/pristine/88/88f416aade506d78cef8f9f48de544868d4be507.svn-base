import React from 'react';
import { useReducer } from 'react';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import axios from 'axios';
import { TextField, Button, Grid } from '@mui/material';

function BeneficiaryAadharDetails() {
  const [formInput, setFormInput] = useReducer((state, newState) => ({ ...state, ...newState }), {
    applicationNo: '',
    consentDate: '',
    uidNo: ''
  });
  const RESET_FORM = 'RESET_FORM';
  const handleSubmit1 = async (e) => {
    e.preventDefault();
    event.target.reset();
    const postFormDate = JSON.stringify(formInput);
    const headers = {
      'Content-Type': 'application/json'
    };
    try {
      const res = await axios.post('http://localhost:9000/api/v1/beneficiaryRegistration/saveBeneficiaryAadharDetails', postFormDate, {
        headers
      });
      console.log(res);
      // Reset form fields using dispatch
      dispatch({ type: RESET_FORM, initialState: newState });
    } catch (e) {
      console.log(e);
    }
  };

  const handleInput = (evt) => {
    const name = evt.target.name;
    const newValue = evt.target.value;
    setFormInput({ [name]: newValue });
  };

  return (
    <>
      <div>
        <form onSubmit={handleSubmit1}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <TextField
                label="Application No"
                name="applicationNo"
                placeholder="Enter Application No"
                variant="outlined"
                fullWidth
                onChange={handleInput}
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Consent Date"
                  format="DD-MM-YYYY"
                  disableFuture
                  name="consentDate"
                  slotProps={{ textField: { fullWidth: true } }}
                  variant="outlined"
                ></DatePicker>
              </LocalizationProvider>
            </Grid>

            <Grid item xs={12} sm={4}>
              <TextField
                label="Aadhar Number"
                name="uidNo"
                placeholder="Enter Aadhar Number"
                variant="outlined"
                fullWidth
                onChange={handleInput}
              />
            </Grid>

            <Grid item xs={12} alignItems="center">
              <Button type="submit" variant="contained" color="secondary">
                ADD
              </Button>
            </Grid>
          </Grid>
        </form>
      </div>
    </>
  );
}
export default BeneficiaryAadharDetails;
