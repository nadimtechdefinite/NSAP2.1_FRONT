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
import { showalertwhenObjectretrnvalidation } from 'components/common/fieldValidationFunctionByjava';
import StateList from 'components/form_components/StateList';
import SchemeList from 'components/form_components/SchemeList';

function PensionAmountMasterAdd() {
  const [formInput, setFormInput] = useReducer((state, newState) => ({ ...state, ...newState }), {
    schemeCode: '',
    stateCode: '',
    centralContribution: '',
    centralAgeRange: '',
    stateContribution: '',
    stateAgeRange: '',
    fromYear: '',
    toYear: '',
    fromMonth: '',
    toMonth: ''
  });
  const handleReset = () => {
    setFormInput({
      schemeCode: '',
      stateCode: '',
      centralContribution: '',
      centralAgeRange: '',
      stateContribution: '',
      stateAgeRange: '',
      fromYear: '',
      toYear: '',
      fromMonth: '',
      toMonth: ''
    });
  };
  const [showAlert, setShowAlert] = useState(false);
  const [showAlertDup, setShowAlertDup] = useState(false);
  const [showValidationPopup, setShowValidationPopup] = useState(false);
  const [warningAlert, setShowwarningAlert] = useState('');
  const [centralAge, setcentralAge] = useState([]);
  const [stateAge, setstateAge] = useState([]);
  const [years, setYears] = useState([]);
  const [months, setmonths] = useState([]);
  const [loading, setLoading] = useState(false);
  const [buttonClicked, setButtonClicked] = useState(false);

  const findAllAgrRange = async () => {
    try {
      const getUrl = `/common/findAllAgrRange/${formInput.stateCode}/${formInput.schemeCode}`;
      const response = await axiosInstance.get(getUrl);
      const dataAll = response.data;
      console.log('data dekhna hai', response.data);
      const stateAge = dataAll.filter((scheme) => scheme.shareType === 'S');
      setstateAge(stateAge);
      const centerAge = dataAll.filter((scheme) => scheme.shareType === 'C');
      setcentralAge(centerAge);
    } catch (error) {
      console.error('Error fetching banktypes:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    event.target.reset();
    setLoading(true);
    setButtonClicked(true);
    const mandatoryFields = ['stateCode', 'schemeCode', 'centralContribution', 'stateContribution', 'stateAgeRange', 'fromYear', 'toYear'];

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
      const postUrl = '/master-management/saveamountMaster';
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
          schemeCode: '',
          stateCode: '',
          centralContribution: '',
          centralAgeRange: '',
          stateContribution: '',
          stateAgeRange: '',
          fromYear: '',
          toYear: '',
          fromMonth: '',
          toMonth: ''
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

  const handleSelectScheme = (state) => {
    const name = 'schemeCode';
    setFormInput({ [name]: state });
  };
  const handleClose = () => {
    setShowwarningAlert('');
  };

  const handleSelectState = (state) => {
    const name = 'stateCode';
    setFormInput({ [name]: state });
  };
  const handleInputChangeData = (event) => {
    if (event.target.value != null && event.target.value != '') {
      event.target.value = event.target.value.replace(/[^0-9]/g, '');
    }
  };

  useEffect(() => {
    const currentYear = new Date().getFullYear();
    const previousYears = Array.from({ length: 5 }, (_, index) => currentYear - index - 1).reverse();
    const nextYears = Array.from({ length: 5 }, (_, index) => currentYear + index + 1);

    const allYears = [...previousYears, currentYear, ...nextYears];

    setYears(allYears);

    const abbreviatedMonths = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
    setmonths(abbreviatedMonths);

    if (formInput.schemeCode) {
      findAllAgrRange();
    }
  }, [formInput.schemeCode]);
  return (
    <div>
      <MainCard title="Add Pension Amount Master">
        {warningAlert && (
          <Alert variant="filled" severity="warning" onClose={handleClose}>
            {warningAlert}
          </Alert>
        )}

        {showValidationPopup && <MandatoryFields />}
        {showAlertDup && <Duplicate />}
        {showAlert && <AlertSucess msg={'Pension Amount Master'} setShowAlert={setShowAlert} />}
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <StateList onSelectState={handleSelectState} />
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <SchemeList onSelectScheme={handleSelectScheme} isMandatory={true} />
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={4}>
              <TextField
                labelId="Central Contribution"
                id="centralContribution"
                label="Central Contribution"
                name="centralContribution"
                value={formInput.centralContribution}
                variant="outlined"
                fullWidth
                onChange={handleInput}
                onInput={handleInputChangeData}
                required
                InputProps={{
                  inputProps: {
                    pattern: '^[0-9]*$',
                    title: 'Only Number are allowed',
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
              <FormControl fullWidth>
                <InputLabel id="Central Age range">
                  Central Age range
                  <Typography variant="h6" color="error">
                    *
                  </Typography>
                </InputLabel>
                <Select
                  labelId="Central Age range"
                  id="centralAgeRange"
                  label="Central Age range"
                  name="centralAgeRange"
                  value={formInput.centralAgeRange}
                  onChange={handleInputBank}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <Typography variant="h3" color="error">
                          *
                        </Typography>
                      </InputAdornment>
                    )
                  }}
                >
                  {centralAge.map((item) => (
                    <MenuItem key={item.ageRangeId} value={item.ageRangeId}>
                      {item.ageFrom}-{item.ageTo}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                labelId="State Contribution"
                id="stateContribution"
                label="State Contribution"
                name="stateContribution"
                value={formInput.stateContribution}
                variant="outlined"
                fullWidth
                onChange={handleInput}
                onInput={handleInputChangeData}
                required
                InputProps={{
                  inputProps: {
                    pattern: '^[0-9]*$',
                    title: 'Only Number are allowed',
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
              <FormControl fullWidth>
                <InputLabel id="Bank Name-label">
                  State Age range
                  <Typography variant="h6" color="error">
                    *
                  </Typography>
                </InputLabel>
                <Select
                  labelId="State Age range"
                  id="stateAgeRange"
                  label="State Age range"
                  name="stateAgeRange"
                  value={formInput.stateAgeRange}
                  onChange={handleInputBank}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <Typography variant="h3" color="error">
                          *
                        </Typography>
                      </InputAdornment>
                    )
                  }}
                >
                  {stateAge.map((item) => (
                    <MenuItem key={item.ageRangeId} value={item.ageRangeId}>
                      {item.ageFrom}-{item.ageTo}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <InputLabel id="From Year-label">
                  From Year
                  <Typography variant="h6" color="error">
                    *
                  </Typography>
                </InputLabel>
                <Select
                  labelId="From Year"
                  id="fromYear"
                  label="From Year"
                  name="fromYear"
                  value={formInput.fromYear}
                  onChange={handleInputBank}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <Typography variant="h3" color="error">
                          *
                        </Typography>
                      </InputAdornment>
                    )
                  }}
                >
                  {years.map((item) => (
                    <MenuItem key={item} value={item}>
                      {item}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <InputLabel id="To Year-label">
                  To Year
                  <Typography variant="h6" color="error">
                    *
                  </Typography>
                </InputLabel>
                <Select
                  labelId="To Year"
                  id="toYear"
                  label="To Year"
                  name="toYear"
                  value={formInput.toYear}
                  onChange={handleInputBank}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <Typography variant="h3" color="error">
                          *
                        </Typography>
                      </InputAdornment>
                    )
                  }}
                >
                  {years.map((item) => (
                    <MenuItem key={item} value={item}>
                      {item}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <InputLabel id="From Month-label">
                  From Month
                  <Typography variant="h6" color="error">
                    *
                  </Typography>
                </InputLabel>
                <Select
                  labelId="From Month"
                  id="fromMonth"
                  label="From Month"
                  name="fromMonth"
                  value={formInput.fromMonth}
                  onChange={handleInputBank}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <Typography variant="h3" color="error">
                          *
                        </Typography>
                      </InputAdornment>
                    )
                  }}
                >
                  {months.map((item) => (
                    <MenuItem key={item} value={item}>
                      {item}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <InputLabel id="To Month-label">
                  To Month
                  <Typography variant="h6" color="error">
                    *
                  </Typography>
                </InputLabel>
                <Select
                  labelId="From Month"
                  id="toMonth"
                  label="To Month"
                  name="toMonth"
                  value={formInput.toMonth}
                  onChange={handleInputBank}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <Typography variant="h3" color="error">
                          *
                        </Typography>
                      </InputAdornment>
                    )
                  }}
                >
                  {months.map((item) => (
                    <MenuItem key={item} value={item}>
                      {item}
                    </MenuItem>
                  ))}
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
export default PensionAmountMasterAdd;
