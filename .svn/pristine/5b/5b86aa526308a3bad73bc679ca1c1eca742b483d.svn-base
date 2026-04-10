import {
  Alert,
  Backdrop,
  CircularProgress,
  Snackbar,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  IconButton,
  TextField,
  Typography,
  FormHelperText
} from '@mui/material';
import axiosInstance from 'hooks/useAuthTokenUrl';
import React, { useState } from 'react';
import MainCard from 'ui-component/cards/MainCard';
import { useEffect } from 'react';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import RefreshIcon from '@mui/icons-material/Refresh';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import DownloadIcon from '@mui/icons-material/Download';

import messages_en from 'components/common/messages_en.json';
import ArrowBack from '@mui/icons-material/ArrowBack';

const BeneficiaryCountReport = () => {
  const [loading, setLoading] = useState(false);
  const [dataSummary, setDataSummary] = useState([]);
  const [snackbar, setSnackbar] = useState(null);
  const [isSearchClicked, setIsSearchClicked] = useState(false);
  const [formData, setFormData] = useState({ stateCode: '' });
  const handleCloseSnackbar = () => setSnackbar(null);
  const [formModified, setFormModified] = useState(false);
  const [isStateWiseData, setIsStateWiseData] = useState(false);
  const [errors, setErrors] = useState({});
  const [captchaImage, setCaptchaImage] = useState('');
  const [captchaToken, setCaptchaToken] = useState('');
  const [getAllState, setAllState] = useState([]);
  const [initialData, setInitialData] = useState([]);
  const [initialFormData, setInitialFormData] = useState([]);
  const [isBackButton, setIsBackButton] = useState(false);

  const getGithubData = () => {
    let endpoints = ['/common/findAllReportSchemaState'];

    Promise.all(endpoints.map((endpoint) => axiosInstance.get(endpoint)))
      .then((responses) => {
        const allState = responses[0].data;
        setAllState(allState);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  };

  useEffect(() => {
    getGithubData();
  }, []);

  const handleChangeState = (event) => {
    setFormData({ ...formData, stateCode: event.target.value });
    setErrors((prevErrors) => {
      const updatedErrors = { ...prevErrors };
      delete updatedErrors.stateCode;
      return updatedErrors;
    });
  };

  const handleChangeFromDate = (fieldName, selectedDate) => {
    setFormData({ ...formData, [fieldName]: selectedDate });
    setErrors((prevErrors) => {
      const updatedErrors = { ...prevErrors };
      delete updatedErrors.fromDate;
      return updatedErrors;
    });
  };

  const handleChangeToDate = (fieldName, selectedDate) => {
    setFormData({ ...formData, [fieldName]: selectedDate });
    setErrors((prevErrors) => {
      const updatedErrors = { ...prevErrors };
      delete updatedErrors.toDate;
      return updatedErrors;
    });
  };

  const handleChangeCaptcha = (event) => {
    setFormData({ ...formData, captcha: event.target.value });
    setErrors((prevErrors) => {
      const updatedErrors = { ...prevErrors };
      delete updatedErrors.captcha;
      return updatedErrors;
    });
  };

  useEffect(() => {
    if (formModified) {
      setIsStateWiseData(false);
      getDistWiseReportSummary();
      setFormModified(false);
    }
  }, [formModified]);

  const getDistWiseReportSummary = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.post(
        `report/showReportBenCountDistWise/${formData.stateCode}/${formData.fromDate}/${formData.toDate}`
      );
      const newData = response.data.map((row, index) => ({ ...row, id: index + 1 }));
      setDataSummary(newData);
    } catch (error) {
      setSnackbar({ children: 'Some Internal Error Occurred While Getting Summary', severity: 'error' });
      console.error('Error fetching generated Summary', error);
    } finally {
      setLoading(false);
    }
  };
  const handleStateClick = async (stateCode) => {
    setIsBackButton(true);
    const selectedState = getAllState.find((state) => state.stateCode === stateCode);
    if (selectedState) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        stateCode: selectedState.stateCode
      }));
      setFormModified(true);
    }
  };

  const getReportSummary = async () => {
    try {
      setLoading(true);
      const { stateCode, fromDate, toDate, captcha } = formData;
      setInitialFormData(formData);
      const response = await axiosInstance.post(
        `report/showReportBenCountStateWise/${stateCode}/${fromDate}/${toDate}/${captcha}/${captchaToken}`
      );
      const newData = response.data.map((row, index) => ({ ...row, id: index + 1 }));
      setDataSummary(newData);
      setInitialData(newData);
      handleRefreshCaptcha();
    } catch (error) {
      setDataSummary([]);
      if (error.response.data.message) {
        setSnackbar({ children: error.response.data.message, severity: 'error' });
      } else {
        handleRefreshCaptcha();
        setSnackbar({ children: 'Some Internal Error Occurred While Getting Summary', severity: 'error' });
      }
      console.error('Error fetching generated Summary', error);
    } finally {
      setLoading(false);
    }
  };
  const handleSearchClick = () => {
    const isFormValid = validateForm();
    if (isFormValid) {
      getReportSummary();
      setIsSearchClicked(true);
      setIsStateWiseData(true);
      setIsBackButton(false);
      setInitialData(dataSummary);
    }
  };
  const handleBackButton = () => {
    setIsBackButton(false);
    setDataSummary(initialData);
    setIsStateWiseData(true);

    if (initialData.length > 0) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        stateCode: initialFormData.stateCode
      }));
    }
  };

  const handleCancelClick = () => {
    setFormData({ stateCode: '', fromDate: null, toDate: null, captcha: '' });
    setIsSearchClicked(false);
  };

  const fetchCaptcha = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.post('/login/captcha', { captchaToken });
      setCaptchaImage(response.data.captchaImage);
      setCaptchaToken(response.data.captchaToken);
    } catch (error) {
      console.error('Error fetching CAPTCHA:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefreshCaptcha = () => {
    fetchCaptcha();
    setFormData((prevFormData) => ({
      ...prevFormData,
      captcha: ''
    }));
  };

  useEffect(() => {
    fetchCaptcha();
  }, []);

  const exportToExcel = () => {
    const wb = XLSX.utils.book_new();
    const wsTemp = XLSX.utils.table_to_sheet(document.getElementById('exportDataTableforexcel'));
    XLSX.utils.book_append_sheet(wb, wsTemp);
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    saveAs(new Blob([excelBuffer], { type: 'application/octet-stream' }), 'PensionerRegistrationModeReport.xlsx');
  };
  const validateForm = () => {
    const errors = {};
    if (!formData.stateCode) {
      errors.stateCode = messages_en.stateCodeRequired;
    }
    if (!formData.fromDate) {
      errors.fromDate = messages_en.fromDateRequired;
    }
    if (!formData.toDate) {
      errors.toDate = messages_en.toDateRequired;
    }
    if (!formData.captcha) {
      errors.captcha = messages_en.captchaRequired;
    }

    setErrors(errors);

    return Object.keys(errors).length === 0;
  };

  return (
    <>
      <MainCard>
        <h3 style={{ fontSize: '1.7rem', color: 'black', fontWeight: 'normal' }}>Pensioner&#39;s Registration Modes</h3>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={3}>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">
                State&nbsp;<span style={{ color: 'red' }}>*</span>
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                name="stateCode"
                label="State"
                value={formData.stateCode}
                onChange={handleChangeState}
              >
                <MenuItem value="ALL">All States</MenuItem>
                {getAllState.map((item) => (
                  <MenuItem key={item.stateCode} value={item.stateCode}>
                    {item.stateName}
                  </MenuItem>
                ))}
              </Select>
              {errors.stateCode && (
                <FormHelperText error id="stateCode-error">
                  {errors.stateCode}
                </FormHelperText>
              )}
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={2}>
            <FormControl fullWidth>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label={
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <span style={{ marginRight: '4px' }}>From Date</span>
                      <Typography style={{ color: 'red' }}>*</Typography>
                    </div>
                  }
                  format="DD-MM-YYYY"
                  name="fromDate"
                  slotProps={{ textField: { fullWidth: true } }}
                  variant="outlined"
                  value={formData.fromDate}
                  onChange={(selectedDate) => handleChangeFromDate('fromDate', selectedDate)}
                  renderInput={(params) => <TextField {...params} />}
                  disableFuture
                />
              </LocalizationProvider>
              {errors.fromDate && (
                <FormHelperText error id="fromDate-error">
                  {errors.fromDate}
                </FormHelperText>
              )}
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={2}>
            <FormControl fullWidth>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label={
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <span style={{ marginRight: '4px' }}>To Date</span>
                      <Typography style={{ color: 'red' }}>*</Typography>
                    </div>
                  }
                  format="DD-MM-YYYY"
                  name="toDate"
                  slotProps={{ textField: { fullWidth: true } }}
                  variant="outlined"
                  value={formData.toDate}
                  onChange={(selectedDate) => handleChangeToDate('toDate', selectedDate)}
                  renderInput={(params) => <TextField {...params} />}
                  disableFuture
                />
              </LocalizationProvider>
              {errors.toDate && (
                <FormHelperText error id="toDate-error">
                  {errors.toDate}
                </FormHelperText>
              )}
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={3}>
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
                onChange={handleChangeCaptcha}
              />
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
              <IconButton onClick={handleRefreshCaptcha} aria-label="refresh captcha">
                <RefreshIcon />
              </IconButton>
            </Box>
          </Grid>
          <Grid item xs={12} style={{ display: 'flex' }}>
            <FormControl>
              <Button variant="contained" color="secondary" onClick={handleSearchClick}>
                Search
              </Button>
            </FormControl>
            <FormControl style={{ marginLeft: '8px' }}>
              <Button variant="contained" color="error" onClick={handleCancelClick}>
                Cancel
              </Button>
            </FormControl>
          </Grid>
        </Grid>
      </MainCard>
      {isSearchClicked && dataSummary.length > 0 && (
        <div style={{ marginTop: '20px' }}>
          <MainCard>
            <div style={{ marginTop: 20 }}>
              <Typography gutterBottom style={{ fontSize: '1.4rem', color: 'black', fontWeight: 'normal' }}>
                New Application Registration Through Various Modes
              </Typography>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <div>
                  <FormControl>
                    <Button variant="contained" color="secondary" onClick={exportToExcel}>
                      <DownloadIcon/>
                      Excel
                    </Button>
                  </FormControl>
                </div>
                {isBackButton && (
                  <FormControl>
                    <Button size="small" variant="contained" color="secondary" startIcon={<ArrowBack />} onClick={handleBackButton}>
                      Back
                    </Button>
                  </FormControl>
                )}
              </div>

              <table
                id="exportDataTableforexcel"
                className="table table-bordered table-striped order-column"
                style={{ width: '100%', borderCollapse: 'collapse' }}
              >
                <thead className="font-smaller">
                  <tr style={{ border: '1px solid #ddd' }}>
                    <th style={{ textAlign: 'center', color: '#33b5e5', border: '1px solid #ddd' }} rowSpan="2">
                      Sr. No.
                    </th>
                    <th
                      style={{
                        textAlign: 'center',
                        color: '#33b5e5',
                        border: '1px solid #ddd'
                      }}
                      rowSpan="2"
                    >
                      {isStateWiseData ? 'State' : 'District'}
                    </th>
                    <th style={{ textAlign: 'center', color: '#33b5e5', border: '1px solid #ddd' }} colSpan="8">
                      UMANG
                    </th>
                    <th style={{ textAlign: 'center', color: '#33b5e5', border: '1px solid #ddd' }} colSpan="8">
                      SAMBAL
                    </th>
                    <th style={{ textAlign: 'center', color: '#33b5e5', border: '1px solid #ddd' }} colSpan="8">
                      Website
                    </th>
                    <th style={{ textAlign: 'center', color: '#33b5e5', border: '1px solid #ddd' }} colSpan="2" rowSpan="2">
                      Grand Total
                    </th>
                  </tr>
                  <tr>
                    <th style={{ textAlign: 'center', color: '#33b5e5', border: '1px solid #ddd' }} colSpan="2">
                      IGNOAPS
                    </th>
                    <th style={{ textAlign: 'center', color: '#33b5e5', border: '1px solid #ddd' }} colSpan="2">
                      IGNDPS
                    </th>
                    <th style={{ textAlign: 'center', color: '#33b5e5', border: '1px solid #ddd' }} colSpan="2">
                      IGNWPS
                    </th>
                    <th style={{ textAlign: 'center', color: '#33b5e5', border: '1px solid #ddd' }} colSpan="2">
                      UMANG Total
                    </th>
                    <th style={{ textAlign: 'center', color: '#33b5e5', border: '1px solid #ddd' }} colSpan="2">
                      IGNOAPS
                    </th>
                    <th style={{ textAlign: 'center', color: '#33b5e5', border: '1px solid #ddd' }} colSpan="2">
                      IGNDPS
                    </th>
                    <th style={{ textAlign: 'center', color: '#33b5e5', border: '1px solid #ddd' }} colSpan="2">
                      IGNWPS
                    </th>
                    <th style={{ textAlign: 'center', color: '#33b5e5', border: '1px solid #ddd' }} colSpan="2">
                      SAMBAL TOTAL
                    </th>
                    <th style={{ textAlign: 'center', color: '#33b5e5', border: '1px solid #ddd' }} colSpan="2">
                      IGNOAPS
                    </th>
                    <th style={{ textAlign: 'center', color: '#33b5e5', border: '1px solid #ddd' }} colSpan="2">
                      IGNDPS
                    </th>
                    <th style={{ textAlign: 'center', color: '#33b5e5', border: '1px solid #ddd' }} colSpan="2">
                      IGNWPS
                    </th>
                    <th style={{ textAlign: 'center', color: '#33b5e5', border: '1px solid #ddd' }} colSpan="2">
                      WEBSITE Total
                    </th>
                  </tr>
                  <tr>
                    <th style={{ textAlign: 'center', color: '#33b5e5', border: '1px solid #ddd' }}>Total</th>
                    <th style={{ textAlign: 'center', color: '#33b5e5', border: '1px solid #ddd' }}>Pending</th>
                    <th style={{ textAlign: 'center', color: '#33b5e5', border: '1px solid #ddd' }}>Total</th>
                    <th style={{ textAlign: 'center', color: '#33b5e5', border: '1px solid #ddd' }}>Pending</th>
                    <th style={{ textAlign: 'center', color: '#33b5e5', border: '1px solid #ddd' }}>Total</th>
                    <th style={{ textAlign: 'center', color: '#33b5e5', border: '1px solid #ddd' }}>Pending</th>
                    <th style={{ textAlign: 'center', color: '#33b5e5', border: '1px solid #ddd' }}>Total</th>
                    <th style={{ textAlign: 'center', color: '#33b5e5', border: '1px solid #ddd' }}>Pending</th>
                    <th style={{ textAlign: 'center', color: '#33b5e5', border: '1px solid #ddd' }}>Total</th>
                    <th style={{ textAlign: 'center', color: '#33b5e5', border: '1px solid #ddd' }}>Pending</th>
                    <th style={{ textAlign: 'center', color: '#33b5e5', border: '1px solid #ddd' }}>Total</th>
                    <th style={{ textAlign: 'center', color: '#33b5e5', border: '1px solid #ddd' }}>Pending</th>
                    <th style={{ textAlign: 'center', color: '#33b5e5', border: '1px solid #ddd' }}>Total</th>
                    <th style={{ textAlign: 'center', color: '#33b5e5', border: '1px solid #ddd' }}>Pending</th>
                    <th style={{ textAlign: 'center', color: '#33b5e5', border: '1px solid #ddd' }}>Total</th>
                    <th style={{ textAlign: 'center', color: '#33b5e5', border: '1px solid #ddd' }}>Pending</th>
                    <th style={{ textAlign: 'center', color: '#33b5e5', border: '1px solid #ddd' }}>Total</th>
                    <th style={{ textAlign: 'center', color: '#33b5e5', border: '1px solid #ddd' }}>Pending</th>
                    <th style={{ textAlign: 'center', color: '#33b5e5', border: '1px solid #ddd' }}>Total</th>
                    <th style={{ textAlign: 'center', color: '#33b5e5', border: '1px solid #ddd' }}>Pending</th>
                    <th style={{ textAlign: 'center', color: '#33b5e5', border: '1px solid #ddd' }}>Total</th>
                    <th style={{ textAlign: 'center', color: '#33b5e5', border: '1px solid #ddd' }}>Pending</th>
                    <th style={{ textAlign: 'center', color: '#33b5e5', border: '1px solid #ddd' }}>Total</th>
                    <th style={{ textAlign: 'center', color: '#33b5e5', border: '1px solid #ddd' }}>Pending</th>
                    <th style={{ textAlign: 'center', color: '#33b5e5', border: '1px solid #ddd' }}>Total</th>
                    <th style={{ textAlign: 'center', color: '#33b5e5', border: '1px solid #ddd' }}>Pending</th>
                    <th style={{ textAlign: 'center', color: '#33b5e5', border: '1px solid #ddd' }}>Total</th>
                    <th style={{ textAlign: 'center', color: '#33b5e5', border: '1px solid #ddd' }}>Pending</th>
                  </tr>
                </thead>

                <tbody className="font-smaller" style={{ border: '1px solid #ddd' }}>
                  {dataSummary.map((row, index) => (
                    <tr key={index} style={{ backgroundColor: index % 2 === 0 ? '#f2f2f2' : '#ffffff' }}>
                      <td style={{ textAlign: 'center', border: '1px solid #ddd' }}>{index + 1}</td>
                      <td style={{ textAlign: 'left', border: '1px solid #ddd' }}>
                        <button
                          style={{
                            textAlign: 'left',
                            wordWrap: 'break-word',
                            cursor: isStateWiseData ? 'pointer' : 'auto',
                            color: isStateWiseData ? 'blue' : 'inherit',
                            textDecoration: isStateWiseData ? 'underline' : 'none',
                            background: 'none',
                            paddingLeft: '10px',
                            border: 'none',
                            display: 'inline',
                            font: 'inherit'
                          }}
                          onClick={() => isStateWiseData && handleStateClick(row.stateCode)}
                        >
                          {isStateWiseData ? row.stateName : row.districtName}
                        </button>
                      </td>

                      <td style={{ textAlign: 'right', border: '1px solid #ddd', paddingRight: '10px' }}>{row.umangoapscount}</td>
                      <td style={{ textAlign: 'right', border: '1px solid #ddd', paddingRight: '10px' }}>{row.umangoapscountpendg}</td>
                      <td style={{ textAlign: 'right', border: '1px solid #ddd', paddingRight: '10px' }}>{row.umangdpscount}</td>
                      <td style={{ textAlign: 'right', border: '1px solid #ddd', paddingRight: '10px' }}>{row.umangdpscountpendg}</td>
                      <td style={{ textAlign: 'right', border: '1px solid #ddd', paddingRight: '10px' }}>{row.umangwpscount}</td>
                      <td style={{ textAlign: 'right', border: '1px solid #ddd', paddingRight: '10px' }}>{row.umangwpscountpendg}</td>
                      <td style={{ textAlign: 'right', border: '1px solid #ddd', paddingRight: '10px' }}>{row.umangttlcount}</td>
                      <td style={{ textAlign: 'right', border: '1px solid #ddd', paddingRight: '10px' }}>{row.umangttlcountpendg}</td>
                      <td style={{ textAlign: 'right', border: '1px solid #ddd', paddingRight: '10px' }}>{row.sambaloapscount}</td>
                      <td style={{ textAlign: 'right', border: '1px solid #ddd', paddingRight: '10px' }}>{row.sambaloapscountpendg}</td>
                      <td style={{ textAlign: 'right', border: '1px solid #ddd', paddingRight: '10px' }}>{row.sambaldpscount}</td>
                      <td style={{ textAlign: 'right', border: '1px solid #ddd', paddingRight: '10px' }}>{row.sambaldpscountpendg}</td>
                      <td style={{ textAlign: 'right', border: '1px solid #ddd', paddingRight: '10px' }}>{row.sambalwpscount}</td>
                      <td style={{ textAlign: 'right', border: '1px solid #ddd', paddingRight: '10px' }}>{row.sambalwpscountpendg}</td>
                      <td style={{ textAlign: 'right', border: '1px solid #ddd', paddingRight: '10px' }}>{row.sambalttlcount}</td>
                      <td style={{ textAlign: 'right', border: '1px solid #ddd', paddingRight: '10px' }}>{row.sambalttlcountpendg}</td>
                      <td style={{ textAlign: 'right', border: '1px solid #ddd', paddingRight: '10px' }}>{row.weboapscount}</td>
                      <td style={{ textAlign: 'right', border: '1px solid #ddd', paddingRight: '10px' }}>{row.weboapscountpendg}</td>
                      <td style={{ textAlign: 'right', border: '1px solid #ddd', paddingRight: '10px' }}>{row.webdpscount}</td>
                      <td style={{ textAlign: 'right', border: '1px solid #ddd', paddingRight: '10px' }}>{row.webdpscountpendg}</td>
                      <td style={{ textAlign: 'right', border: '1px solid #ddd', paddingRight: '10px' }}>{row.webwpscount}</td>
                      <td style={{ textAlign: 'right', border: '1px solid #ddd', paddingRight: '10px' }}>{row.webwpscountpendg}</td>
                      <td style={{ textAlign: 'right', border: '1px solid #ddd', paddingRight: '10px' }}>{row.webttlcount}</td>
                      <td style={{ textAlign: 'right', border: '1px solid #ddd', paddingRight: '10px' }}>{row.webttlcountpendg}</td>
                      <td style={{ textAlign: 'right', border: '1px solid #ddd', paddingRight: '10px' }}>{row.ttlcount}</td>
                      <td style={{ textAlign: 'right', border: '1px solid #ddd', paddingRight: '10px' }}>{row.ttlcountpendg}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </MainCard>
        </div>
      )}

      <Backdrop open={loading} style={{ zIndex: 999, color: '#fff' }}>
        <CircularProgress color="inherit" />
      </Backdrop>

      {!!snackbar && (
        <Snackbar open anchorOrigin={{ vertical: 'top', horizontal: 'center' }} onClose={handleCloseSnackbar} autoHideDuration={6000}>
          <Alert {...snackbar} onClose={handleCloseSnackbar} />
        </Snackbar>
      )}
    </>
  );
};
export default BeneficiaryCountReport;
