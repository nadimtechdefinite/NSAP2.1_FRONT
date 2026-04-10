import React from 'react';
import { useReducer, useState, useEffect } from 'react';
import axiosInstance from 'hooks/useAuthTokenUrl';
import {
  Button,
  Grid,
  Typography,
  TextField,
  FormControl,
  Alert,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
  Backdrop,
  CircularProgress
} from '@mui/material';
import MainCard from 'ui-component/cards/MainCard';
import AlertSucess from 'components/common/alertSucess';
import MandatoryFields from 'components/common/MandatoryFields';
import Duplicate from 'components/common/Duplicate';
import BankTypeList from 'components/form_components/BankTypeList';
import { showalertwhenObjectretrnvalidation } from 'components/common/fieldValidationFunctionByjava';
import StateList from 'components/form_components/StateList';
import DistrictList from 'components/form_components/DistrictList';

function BranchAdd() {
  const [formInput, setFormInput] = useReducer((state, newState) => ({ ...state, ...newState }), {
    bankType: '',
    bankCode: '',
    stateId: '',
    districtId: '',
    ifscCode: '',
    branchCode: '',
    bankBranchName: '',
    bankBranchAddress: ''
  });


  const handleReset = () => {
    setFormInput({
      bankType: '',
    bankCode: '',
    stateId: '',
    districtId: '',
    ifscCode: '',
    branchCode: '',
    bankBranchName: '',
    bankBranchAddress: ''
    });
  };

  const [showAlert, setShowAlert] = useState(false);
  const [showAlertDup, setShowAlertDup] = useState(false);
  const [showValidationPopup, setShowValidationPopup] = useState(false);
  const [warningAlert, setShowwarningAlert] = useState('');
  const [bankNames, setBankNames] = useState([]);
  const [loading, setLoading] = useState(false);
  const [buttonClicked, setButtonClicked] = useState(false);
  const fetchBanks = async () => {
    try {
      const getUrl = `/common/findAllBanksByBankType/${formInput.bankType}`;
      const response = await axiosInstance.get(getUrl);
      setBankNames(response.data);
    } catch (error) {
      console.error('Error fetching banktypes:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    event.target.reset();
    setLoading(true);
    setButtonClicked(true);
    const mandatoryFields = ['bankType', 'bankCode', 'stateId', 'districtId', 'ifscCode', 'bankBranchName', 'bankBranchAddress'];

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
      const postUrl = '/master-management/saveBranchMaster';
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
          stateId: '',
          districtId: '',
          ifscCode: '',
          branchCode: '',
          bankBranchName: '',
          bankBranchAddress: ''
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

  const handleInputBank = (evt) => {
    const name = evt.target.name;
    const newValue = evt.target.value;
    setFormInput({ [name]: newValue });
  };

  const handleSelectbank = (state) => {
    const name = 'bankType';
    setFormInput({ [name]: state });
  };
  const handleClose = () => {
    setShowwarningAlert('');
  };

  const handleSelectState = (state) => {
    const name = 'stateId';
    setFormInput({ [name]: state });
  };
  const handleDist = (dist) => {
    const name = 'districtId';
    setFormInput({ [name]: dist });
  };
  useEffect(() => {
    if (formInput.bankType) {
      fetchBanks();
    }
  }, [formInput.bankType]);

  const handleInputChangeData = (event) => {
   
    if (event.target.value != null && event.target.value != '') {
      event.target.value = event.target.value.replace(/[^a-zA-Z0-9\s()\-.,]/g, '');
    }
  };

  return (
    <div>
      
      <MainCard title="Add Branch">
        {warningAlert && (
          <Alert variant="filled" severity="warning" onClose={handleClose}>
            {warningAlert}
          </Alert>
        )}

        {showValidationPopup && <MandatoryFields />}
        {showAlertDup && <Duplicate />}
        {showAlert && <AlertSucess msg={'Branch'} setShowAlert={setShowAlert} />}
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <BankTypeList onSelectbankType={handleSelectbank} />
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <InputLabel id="Bank Name-label">
                  Bank Name
                  <Typography variant="body1" color="error" style={{ marginLeft: 5 }}>
                    *
                  </Typography>
                </InputLabel>
                <Select
                  labelId="Bank Name-label"
                  id="bankCode"
                  label="Bank Name-label"
                  name="bankCode"
                  value={formInput.bankCode}
                  onChange={handleInputBank}
                  required
                >
                  {bankNames.map((item) => (
                    <MenuItem key={item.bankCode} value={item.bankCode}>
                      {item.bankName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <StateList onSelectState={handleSelectState} />
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <DistrictList onSelectState={handleSelectState} onSelectDistrict={handleDist} />
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                label="IFSC Code"
                name="ifscCode"
                placeholder="Enter IFSC Code"
                variant="outlined"
                fullWidth
                value={formInput.ifscCode.toUpperCase()}
                onChange={handleInput}
                required
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
                label="Branch Code"
                name="branchCode"
                placeholder="Enter Branch Code"
                variant="outlined"
                fullWidth
                value={formInput.ifscCode}
                onChange={handleInput}
                aria-readonly
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                label="Branch Name"
                name="bankBranchName"
                placeholder="Enter Branch Name"
                variant="outlined"
                fullWidth
                value={formInput.bankBranchName.toUpperCase()}
                onChange={handleInput}
                required
                onInput={handleInputChangeData}
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
                label="Branch Address"
                name="bankBranchAddress"
                placeholder="Enter Branch Address"
                variant="outlined"
                fullWidth
                value={formInput.bankBranchAddress.toUpperCase()}
                onChange={handleInput}
                onInput={handleInputChangeData}
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
export default BranchAdd;
