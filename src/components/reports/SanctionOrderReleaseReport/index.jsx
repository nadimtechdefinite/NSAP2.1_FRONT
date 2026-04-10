import React, { useState, useEffect } from 'react';
import MainCard from 'ui-component/cards/MainCard';
import StateList from '../common-component/StateList';
import {
  Grid,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Button,
  CircularProgress,
  Box,
  IconButton,
  Typography,
  FormHelperText,
  Alert,
  Snackbar
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import axios from 'axios';
import config from 'config';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import messages_en from 'components/common/messages_en.json';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { GetApp as GetAppIcon } from '@mui/icons-material';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
const SanctionOrderReleaseReport = () => {
  const apiBaseUrl = config.API_BASE_URL;
  const [captchaImage, setCaptchaImage] = useState('');
  const [captchaToken, setCaptchaToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState(null);
  const [data, setData] = useState([]);
  const handleCloseSnackbar = () => setSnackbar(null);
  const [formData, setFormData] = useState({
    fundType: '',
    schemeCode: '',
    fromDate: null,
    toDate: null,
    fromAmount: '',
    toAmount: '',
    captcha: '',
    stateCode: ''
  });
  const [errors, setErrors] = useState({});
  const [getErrorApi, setErrorApi] = useState(null);

  const fetchCaptcha = async () => {
    setLoading(true);
    const captchaUrl = `${apiBaseUrl}/login/captcha`;
    try {
      const response = await axios.post(captchaUrl, { captchaToken });
      setCaptchaImage(response.data.captchaImage);
      setCaptchaToken(response.data.captchaToken);
    } catch (error) {
      console.error('Error fetching CAPTCHA:', error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchCaptcha();
  }, []);

  const handleSelectState = (state) => {
    setFormData({ ...formData, stateCode: state });
    setErrors((prevErrors) => {
      const updatedErrors = { ...prevErrors };
      delete updatedErrors.stateCode;
      return updatedErrors;
    });
  };

  const handleChangeFundType = (event) => {
    setFormData({ ...formData, fundType: event.target.value });
    setErrors((prevErrors) => {
      const updatedErrors = { ...prevErrors };
      delete updatedErrors.fundType;
      return updatedErrors;
    });
  };

  const handleChangeScheme = (event) => {
    setFormData({ ...formData, schemeCode: event.target.value });
    setErrors((prevErrors) => {
      const updatedErrors = { ...prevErrors };
      delete updatedErrors.schemeCode;
      return updatedErrors;
    });
  };
  const handleRefreshCaptcha = () => {
    fetchCaptcha();
    setFormData((prevFormData) => ({
      ...prevFormData,
      captcha: ''
    }));
  };

  const handleChange = (field, value) => {
    const numberPattern = /^[0-9]*$/;
    if (field === 'fromAmount' || field === 'toAmount') {
      if (numberPattern.test(value)) {
        setFormData({ ...formData, [field]: value });
      }
    } else {
      setFormData({ ...formData, [field]: value });
    }

    if (field === 'captcha') {
      setErrors((prevErrors) => {
        const updatedErrors = { ...prevErrors };
        delete updatedErrors.captcha;
        return updatedErrors;
      });
    }
  };

  const validateForm = () => {
    const errors = {};
    // Add validation logic for each field
    if (!formData.stateCode) {
      errors.stateCode = messages_en.stateCodeRequired;
    }

    if (!formData.fundType) {
      errors.fundType = messages_en.fundTypeRequired;
    }

    if (!formData.schemeCode) {
      errors.schemeCode = messages_en.schemCodeRequired;
    }
    if (!formData.captcha) {
      errors.captcha = messages_en.captchaRequired;
    }

    setErrors(errors);

    return Object.keys(errors).length === 0; // Return true if no errors
  };

  const submitFormAndGetData = async () => {
    const isFormValid = validateForm();
    if (isFormValid) {
      setLoading(true);
      const postUrl = `${apiBaseUrl}/sanctionOrderReleaseReport`;
      const formDataRequest = { ...formData, captchaToken: captchaToken };
      try {
        const response = await axios.post(postUrl, formDataRequest);
        if (response.data.length === 0) {
          setData([]);
          setSnackbar({ children: 'No records are found.', severity: 'error' });
        } else {
          const newData = response.data.map((row, index) => ({ ...row, id: index + 1 }));
          setData(newData);
        }
        console.log('RESPONSE: ', response.data);
        handleRefreshCaptcha();
      } catch (error) {
        console.error('Error fetching Submit:', error);
        if (error.response && error.response.data && error.response.data.message) {
          const errorMssg = error.response.data.message;
          setSnackbar({ children: errorMssg, severity: 'error' });
        } else {
          setErrorApi('An unexpected error occurred.');
        }
      } finally {
        setLoading(false);
      }
    }
  };
  const columnsReport = [
    { field: 'id', headerName: 'SNo.', width: 100 },
    { field: 'fundType', headerName: 'Fund Type', align: 'center', headerAlign: 'center', width: 200 },
    { field: 'schemeCode', headerName: 'Scheme Code', align: 'center', headerAlign: 'center', width: 200 },
    { field: 'financialYear', headerName: 'Financial Year', align: 'center', headerAlign: 'center', width: 200 },
    { field: 'amountReleased', headerName: 'Amount Released', align: 'center', headerAlign: 'center', width: 200 },
    { field: 'sanctionNumber', headerName: 'Sanction Number', align: 'center', headerAlign: 'center', width: 200 },
    { field: 'installmentNumber', headerName: 'Installment Number', align: 'center', headerAlign: 'center', width: 200 },
    { field: 'releasedDate', headerName: 'Released Date', align: 'center', headerAlign: 'center', width: 150 },
    {
      field: 'sanctionOrderFile',
      headerName: 'Sanction Order(PDF)',
      align: 'center',
      headerAlign: 'center',
      width: 300,
      renderCell: (params) => (
        <IconButton
          onClick={() => {
            // Implement your download logic here
            console.log(`Downloading PDF for row ${params.row.id}`);
          }}
          size="small"
          style={{ color: '#16457d' }}
        >
          <PictureAsPdfIcon />
          <GetAppIcon />
        </IconButton>
      )
    }
  ].filter(Boolean);

  const cancelButton = () => {
    setData([]);
    setFormData({
      fundType: '',
      schemeCode: '',
      fromDate: null,
      toDate: null,
      fromAmount: '',
      toAmount: '',
      captcha: '',
      stateCode: ''
    });
  };
  return (
    <>
      {getErrorApi && (
        <Box sx={{ mt: 2 }}>
          <Alert severity="error">{getErrorApi}</Alert>
        </Box>
      )}
      {loading && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 9999,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <CircularProgress />
        </div>
      )}
      <MainCard title="SANCTION ORDER RELEASE">
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <StateList onSelectState={handleSelectState} isMendatory={true} defaultStateCode={formData.stateCode} />
              {/* Display error message for state code */}
              {errors.stateCode && (
                <FormHelperText error id="stateCode-error">
                  {errors.stateCode}
                </FormHelperText>
              )}
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">
                Fund Type&nbsp;<span style={{ color: 'red' }}>*</span>
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={formData.fundType}
                label="Fund Type"
                name="fundType"
                onChange={handleChangeFundType}
              >
                <MenuItem value={3}>ALL TYPES</MenuItem>
                <MenuItem value={1}>PROGRAMME FUND</MenuItem>
                <MenuItem value={2}>ADMINISTRATIVE FUND</MenuItem>
              </Select>
              {/* Display error message for fund type */}
              {errors.fundType && (
                <FormHelperText error id="fundType-error">
                  {errors.fundType}
                </FormHelperText>
              )}
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">
                Scheme Code&nbsp;<span style={{ color: 'red' }}>*</span>
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={formData.schemeCode}
                label="Scheme Code"
                name="schemeCode"
                onChange={handleChangeScheme}
              >
                <MenuItem value={'IGNOAPS'}>IGNOAPS</MenuItem>
                <MenuItem value={'IGNDPS'}>IGNDPS</MenuItem>
                <MenuItem value={'IGNWPS'}>IGNWPS</MenuItem>

                <MenuItem value={'NFBS'}>NFBS</MenuItem>
                <MenuItem value={'ANNAPURNA'}>ANNAPURNA</MenuItem>
                <MenuItem value={'NSAP'}>NSAP</MenuItem>
              </Select>
              {/* Display error message for from amount */}
              {errors.schemeCode && (
                <FormHelperText error id="schemeCode-error">
                  {errors.schemeCode}
                </FormHelperText>
              )}
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={2}>
            <FormControl fullWidth>
              <TextField
                id="fromAmount"
                label="From Amount"
                variant="outlined"
                name="fromAmount"
                value={formData.fromAmount}
                onChange={(e) => handleChange('fromAmount', e.target.value)}
                inputProps={{
                  maxLength: 10, // Limit input length to 2 characters
                  inputMode: 'numeric', // Ensure numeric keyboard on mobile
                  pattern: '[0-9]*', // Allow only digits
                  max: 10 // Set maximum value
                }}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={2}>
            <FormControl fullWidth>
              <TextField
                id="toAmount"
                label="To Amount"
                variant="outlined"
                name="toAmount"
                value={formData.toAmount}
                onChange={(e) => handleChange('toAmount', e.target.value)}
                inputProps={{
                  maxLength: 10, // Limit input length to 2 characters
                  inputMode: 'numeric', // Ensure numeric keyboard on mobile
                  pattern: '[0-9]*', // Allow only digits
                  max: 10 // Set maximum value
                }}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={2}>
            <FormControl fullWidth>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="From Date"
                  format="DD-MM-YYYY"
                  name="fromDate"
                  slotProps={{ textField: { fullWidth: true } }}
                  variant="outlined"
                  value={formData.fromDate}
                  onChange={(selectedDate) => handleChange('fromDate', selectedDate)}
                  disableFuture
                />
              </LocalizationProvider>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={2}>
            <FormControl fullWidth>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="To Date"
                  format="DD-MM-YYYY"
                  name="toDate"
                  slotProps={{ textField: { fullWidth: true } }}
                  variant="outlined"
                  value={formData.toDate}
                  onChange={(selectedDate) => handleChange('toDate', selectedDate)}
                  disableFuture
                />
              </LocalizationProvider>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={2}>
            <FormControl fullWidth>
              <TextField
                id="outlined-basic"
                label={
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <span style={{ marginRight: '4px' }}>Captcha Code</span>
                    <Typography style={{ color: 'red' }}>*</Typography>
                  </div>
                }
                variant="outlined"
                value={formData.captcha}
                name="captcha"
                inputProps={{ maxLength: 6 }}
                onChange={(e) => handleChange('captcha', e.target.value)}
              />
              {/* Display error message for from amount */}
              {errors.captcha && (
                <FormHelperText error id="captcha-error">
                  {errors.captcha}
                </FormHelperText>
              )}
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={2}>
            <Box display="flex" alignItems="center">
              <img
                src={`data:image/png;base64,${captchaImage}`}
                alt="captcha"
                style={{ marginRight: '10px', overflow: 'hidden', borderRadius: '10px' }}
              />
              <IconButton onClick={handleRefreshCaptcha} aria-label="refresh captcha" variant="primary">
                <RefreshIcon />
              </IconButton>
            </Box>
          </Grid>
          <Grid item xs={12} alignItems="center">
            <Button
              type="submit"
              variant="contained"
              color="secondary"
              onClick={submitFormAndGetData}
              disabled={loading} // Disable button when loading
            >
              {loading ? 'Submitting...' : 'Submit'}
            </Button>
            &nbsp; &nbsp; &nbsp;
            <Button type="submit" variant="contained" color="error" onClick={cancelButton}>
              Cancel
            </Button>
          </Grid>
        </Grid>
      </MainCard>

      {data.length > 0 && (
        <div style={{ marginTop: '20px' }}>
          <MainCard>
            <Typography variant="h4">SANCTION ORDER RELEASE REPORT</Typography>
            <div style={{ marginTop: '20px' }}>
              <DataGrid
                slots={{ toolbar: GridToolbar }}
                slotProps={{
                  toolbar: {
                    showQuickFilter: true,
                    printOptions: { disableToolbarButton: true },
                    csvOptions: { fileName: 'SANCTION_ORDER_RELEASE_REPORT' }
                  }
                }}
                rows={data}
                columns={columnsReport}
                initialState={{
                  pagination: {
                    paginationModel: {
                      pageSize: 10
                    }
                  }
                }}
                pageSizeOptions={[10]}
                disableRowSelectionOnClick
              />
            </div>
          </MainCard>
        </div>
      )}

      {!!snackbar && (
        <Snackbar open anchorOrigin={{ vertical: 'top', horizontal: 'center' }} onClose={handleCloseSnackbar} autoHideDuration={8000}>
          <Alert {...snackbar} onClose={handleCloseSnackbar} />
        </Snackbar>
      )}
    </>
  );
};
export default SanctionOrderReleaseReport;
