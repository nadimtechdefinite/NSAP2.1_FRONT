import React, { useState, useEffect } from 'react';
import MainCard from 'ui-component/cards/MainCard';
import axiosInstance from 'hooks/useAuthTokenUrl';
import {
  Grid,
  FormControl,
  TextField,
  Select,
  InputLabel,
  Typography,
  FormHelperText,
  MenuItem,
  Button,
  Box,
  IconButton,
  Snackbar,
  Alert,
  Backdrop,
  CircularProgress
} from '@mui/material';
import { TableContainer, Table, TableHead, TableBody, TableRow, TableCell, TableFooter, Paper } from '@mui/material';
import config from 'config';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import DownloadIcon from '@mui/icons-material/Download';

import RefreshIcon from '@mui/icons-material/Refresh';
import axios from 'axios';
import messages_en from 'components/common/messages_en.json';

export default function BeneficiaryAbstract() {
  const apiBaseUrl = config.API_BASE_URL;
  const [snackbar, setSnackbar] = useState(null);
  const [stateList, setStateList] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [captchaImage, setCapchaImage] = useState('');
  const [captchaToken, setCaptchaToken] = useState('');
  const handleCloseSnackbar = () => setSnackbar(null);
  const [benAbstarctReportData, setBenAbstarctReportData] = useState([]);
  const [formData, setFormData] = useState({
    stateCode: 'All',
    schemeCode: '',
    area: '',
    captcha: ''
  });
  const handleSelectState = (event) => {
    setFormData({ ...formData, stateCode: event.target.value });
    setErrors((prevErrors) => {
      const updatedErrors = { ...prevErrors };
      delete updatedErrors.stateCode;
      return updatedErrors;
    });
  };
  const handleChangeSchemeCode = (event) => {
    setFormData({ ...formData, schemeCode: event.target.value });
    setErrors((prevErrors) => {
      const updatedErrors = { ...prevErrors };
      delete updatedErrors.fundType;
      return updatedErrors;
    });
  };
  const handleChangeArea = (event) => {
    setFormData({ ...formData, area: event.target.value });
    setErrors((prevErrors) => {
      const updatedErrors = { ...prevErrors };
      delete updatedErrors.fundType;
      return updatedErrors;
    });
  };
  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleRefreshCaptcha = () => {
    fetchCaptcha();
  };
  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(`/nationalDashboard/getDashboardFormData`);
      const data = response.data;
      setStateList(data.listStates);
      // setFinYearList(data.financialYear);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  const fetchCaptcha = async () => {
    setLoading(true);
    const captchaUrl = `${apiBaseUrl}/login/captcha`;
    try {
      const response = await axios.post(captchaUrl, { captchaToken });
      setCapchaImage(response.data.captchaImage);
      setCaptchaToken(response.data.captchaToken);
    } catch (error) {
      console.error('Error fetching CAPTCHA:', error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    Promise.all([fetchCaptcha(), fetchData()]);
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    getAbstractReportData();
    event.target.reset();
    setFormData((prevState) => ({
      ...prevState,
      captcha: '' // Reset captcha value
    }));
  };
  async function getAbstractReportData() {
    const isFormValid = validateForm();
    if (isFormValid) {
      try {
        setLoading(true);
        const postUrl = `/report/beneficieryAbstract`;
        var location = {
          stateCode: formData.stateCode,
          schemeCode: formData.schemeCode,
          area: formData.area,
          captcha: formData.captcha,
          captchaToken: captchaToken
        };
        const response = await axiosInstance.post(postUrl, JSON.stringify(location));
        if (response.data && response.data.length > 0) {
          setBenAbstarctReportData(response.data);
          console.log(response.data);
        } else {
          setSnackbar({ children: 'No records are found.', severity: 'error' });
          setBenAbstarctReportData([]);
        }
        handleRefreshCaptcha();
      } catch (error) {
        console.error('Error fetching Submit:', error);
        if (error.response && error.response.data && error.response.data.message) {
          const errorMssg = error.response.data.message;
          setSnackbar({ children: errorMssg, severity: 'error' });
        } else {
          setSnackbar({ children: 'An unexpected error occurred.', severity: 'error' });
        }
      } finally {
        setLoading(false);
      }
    }
  }

  const exportToExcel = (id) => {
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.table_to_sheet(document.getElementById(id));
    XLSX.utils.book_append_sheet(wb, ws, id);
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    saveAs(new Blob([excelBuffer], { type: 'application/octet-stream' }), id + '.xlsx');
  };
  const validateForm = () => {
    const errors = {};
    // Add validation logic for each field
    if (!formData.stateCode) {
      errors.stateCode = messages_en.stateRequired;
    }

    if (!formData.schemeCode) {
      errors.schemeCode = messages_en.schemCodeRequired;
    }

    if (!formData.area) {
      errors.area = messages_en.areaRequired;
    }

    if (!formData.captcha) {
      errors.captcha = messages_en.captchaRequired;
    }

    // Add more validation logic for other fields...

    setErrors(errors);

    return Object.keys(errors).length === 0; // Return true if no errors
  };
  const lastRecord = benAbstarctReportData[benAbstarctReportData.length - 1];
  const dataWithoutFooter = benAbstarctReportData.slice(0, -1);
  return (
    <div>
      <MainCard title="Beneficiary Abstract">
        <Backdrop open={loading} style={{ zIndex: 999, color: '#fff' }}>
          <CircularProgress color="inherit" />
        </Backdrop>
        <form onSubmit={(e) => handleSubmit(e)}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <InputLabel id="stateId">
                  State&nbsp;<span style={{ color: 'red' }}>*</span>
                </InputLabel>
                <Select
                  labelId="stateId"
                  id="stateId"
                  label="State"
                  name="stateCode"
                  value={formData.stateCode}
                  onChange={handleSelectState}
                >
                  <MenuItem key="All" value="All">
                    All State
                  </MenuItem>
                  {stateList.map((state) => (
                    <MenuItem key={state.stateId} value={state.stateId}>
                      {state.stateName}
                    </MenuItem>
                  ))}
                </Select>
                {errors.stateCode && (
                  <FormHelperText>
                    <Typography variant="caption" color="error">
                      {errors.stateCode}
                    </Typography>
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <InputLabel id="schemeCode">
                  Scheme Code&nbsp;<span style={{ color: 'red' }}>*</span>
                </InputLabel>
                <Select
                  labelId="schemeCode"
                  id="schemeCode"
                  label="Scheme Code"
                  name="schemeCode"
                  value={formData.schemeCode}
                  onChange={handleChangeSchemeCode}
                >
                  <MenuItem key="ALLSCH" value="ALLSCH">
                    All Scheme
                  </MenuItem>
                  <MenuItem key="ALLCENTERSCH" value="ALLCENTERSCH">
                    All Center Scheme
                  </MenuItem>
                  <MenuItem key="ALLSTATESCH" value="ALLSTATESCH">
                    All State Scheme
                  </MenuItem>
                  <MenuItem key="IGONAPS" value="IGNOAPS">
                    IGNOAPS
                  </MenuItem>
                  <MenuItem key="IGNDPS" value="IGNDPS">
                    IGNDPS
                  </MenuItem>
                  <MenuItem key="IGNWPS" value="IGNWPS">
                    IGNWPS
                  </MenuItem>
                  <MenuItem key="NFBS" value="NFBS">
                    NFBS
                  </MenuItem>
                </Select>
                {errors.schemeCode && (
                  <FormHelperText>
                    <Typography variant="caption" color="error">
                      {errors.schemeCode}
                    </Typography>
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <InputLabel id="area">
                  Area&nbsp;<span style={{ color: 'red' }}>*</span>
                </InputLabel>
                <Select labelId="area" id="area" label="Area" name="area" value={formData.area} onChange={handleChangeArea}>
                  <MenuItem key="both" value="both">
                    Both
                  </MenuItem>
                  <MenuItem key="rural" value="rural">
                    Rural
                  </MenuItem>
                  <MenuItem key="urban" value="urban">
                    Urban
                  </MenuItem>
                </Select>
                {errors.area && (
                  <FormHelperText>
                    <Typography variant="caption" color="error">
                      {errors.area}
                    </Typography>
                  </FormHelperText>
                )}
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
                disabled={loading} // Disable button when loading
              >
                {loading ? 'Submitting...' : 'Submit'}
              </Button>
            </Grid>
          </Grid>
        </form>
        {!!snackbar && (
          <Snackbar open anchorOrigin={{ vertical: 'top', horizontal: 'center' }} onClose={handleCloseSnackbar} autoHideDuration={6000}>
            <Alert {...snackbar} onClose={handleCloseSnackbar} />
          </Snackbar>
        )}
      </MainCard>
      {benAbstarctReportData.length > 0 && (
        <MainCard title="Beneficiary Abstract">
          <div style={{ textAlign: 'left', paddingTop: '10px' }}>
            <Button variant="contained" style={{ backgroundColor: '#8555a3' }} onClick={() => exportToExcel('beneficiry_Abstract')}>
              <DownloadIcon /> Excel
            </Button>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <TableContainer component={Paper} style={{ maxHeight: 400, border: '1px solid #f0f0f0' }}>
              <Table sx={{ minWidth: 650 }} id="beneficiry_Abstract" borderRadius={1} size="small" aria-label="a dense table">
                <TableHead>
                  <TableRow style={{ position: 'sticky', top: 0, zIndex: 999, backgroundColor: 'white' }}>
                    <TableCell></TableCell>
                    <TableCell style={{ color: 'rgb(128, 0, 128)' }} align="center" colSpan={6}>
                      Sanctioned Pensioners
                    </TableCell>
                    <TableCell style={{ color: 'rgb(128, 0, 128)', borderLeft: '1px solid gray' }} align="center" colSpan={6}>
                      New Applicants
                    </TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                  <TableRow style={{ position: 'sticky', top: 35, zIndex: 998, backgroundColor: 'white' }}>
                    <TableCell style={{ color: 'rgb(128, 0, 128)' }}>State</TableCell>
                    <TableCell style={{ color: 'rgb(128, 0, 128)' }} align="right">
                      Sanctioned
                    </TableCell>
                    <TableCell style={{ color: 'rgb(128, 0, 128)' }} align="right">
                      Female
                    </TableCell>
                    <TableCell style={{ color: 'rgb(128, 0, 128)' }} align="right">
                      Male
                    </TableCell>
                    <TableCell style={{ color: 'rgb(128, 0, 128)' }} align="right">
                      Trans Gender
                    </TableCell>
                    <TableCell style={{ color: 'rgb(128, 0, 128)' }} align="right">
                      Below 80
                    </TableCell>
                    <TableCell style={{ color: 'rgb(128, 0, 128)' }} align="right">
                      80 and Above
                    </TableCell>
                    <TableCell style={{ color: 'rgb(128, 0, 128)', borderLeft: '1px solid gray' }} align="right">
                      New Applicant
                    </TableCell>
                    <TableCell style={{ color: 'rgb(128, 0, 128)' }} align="right">
                      Female
                    </TableCell>
                    <TableCell style={{ color: 'rgb(128, 0, 128)' }} align="right">
                      Male
                    </TableCell>
                    <TableCell style={{ color: 'rgb(128, 0, 128)' }} align="right">
                      Trans Gender
                    </TableCell>
                    <TableCell style={{ color: 'rgb(128, 0, 128)' }} align="right">
                      Below 80
                    </TableCell>
                    <TableCell style={{ color: 'rgb(128, 0, 128)' }} align="right">
                      80 and Above
                    </TableCell>
                    <TableCell style={{ color: 'rgb(128, 0, 128)' }}>Total</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {dataWithoutFooter.map((item, index) => (
                    <TableRow key={item.stateName} style={{ backgroundColor: index % 2 === 0 ? 'white' : '#f0f0f0' }}>
                      <TableCell>{item.stateName}</TableCell>
                      <TableCell>{item.noSanctioned}</TableCell>
                      <TableCell>{item.noFemaleSanc}</TableCell>
                      <TableCell>{item.noMaleSanc}</TableCell>
                      <TableCell>{item.noTransgenderSanc}</TableCell>
                      <TableCell>{item.noLess80Sanc}</TableCell>
                      <TableCell>{item.noMore80Sanc}</TableCell>

                      <TableCell style={{ borderLeft: '1px solid gray' }}>{item.noNew}</TableCell>
                      <TableCell>{item.noFemaleNew}</TableCell>
                      <TableCell>{item.noMaleNew}</TableCell>
                      <TableCell>{item.noTransgenderNew}</TableCell>
                      <TableCell>{item.noLess80New}</TableCell>
                      <TableCell>{item.noMore80New}</TableCell>
                      <TableCell>{item.total}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
                <TableFooter
                  style={{ backgroundColor: 'rgba(71, 140, 255, 1)', color: 'white', position: 'sticky', bottom: 0, zIndex: 1000 }}
                >
                  <TableRow>
                    <TableCell style={{ color: 'white' }}>Total</TableCell>
                    <TableCell style={{ color: 'white' }}>{lastRecord.noSanctioned}</TableCell>
                    <TableCell style={{ color: 'white' }}>{lastRecord.noFemaleSanc}</TableCell>
                    <TableCell style={{ color: 'white' }}>{lastRecord.noMaleSanc}</TableCell>
                    <TableCell style={{ color: 'white' }}>{lastRecord.noTransgenderSanc}</TableCell>
                    <TableCell style={{ color: 'white' }}>{lastRecord.noLess80Sanc}</TableCell>
                    <TableCell style={{ color: 'white' }}>{lastRecord.noMore80Sanc}</TableCell>

                    <TableCell style={{ borderLeft: '1px solid gray', color: 'white' }}>{lastRecord.noNew}</TableCell>
                    <TableCell style={{ color: 'white' }}>{lastRecord.noFemaleNew}</TableCell>
                    <TableCell style={{ color: 'white' }}>{lastRecord.noMaleNew}</TableCell>
                    <TableCell style={{ color: 'white' }}>{lastRecord.noTransgenderNew}</TableCell>
                    <TableCell style={{ color: 'white' }}>{lastRecord.noLess80New}</TableCell>
                    <TableCell style={{ color: 'white' }}>{lastRecord.noMore80New}</TableCell>
                    <TableCell style={{ color: 'white' }}>{lastRecord.total}</TableCell>
                  </TableRow>
                </TableFooter>
              </Table>
            </TableContainer>
          </div>
        </MainCard>
      )}
    </div>
  );
}
