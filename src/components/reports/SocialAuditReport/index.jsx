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
import RefreshIcon from '@mui/icons-material/Refresh';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { getAuthToken, getUserInfo } from 'utils/storageUtils';
import config from 'config';
import { useTheme } from '@mui/material/styles';
import messages_en from 'components/common/messages_en.json';
import reportcss from 'components/reports/STCReport/reportCSS';

const SocialAuditReport = () => {
  const [loading, setLoading] = useState(false);
  const [dataSummary, setDataSummary] = useState([]);
  const [snackbar, setSnackbar] = useState(null);
  const [isSearchClicked, setIsSearchClicked] = useState(false);
  const [formData, setFormData] = useState({ stateCode: '', finYear: '' });
  const handleCloseSnackbar = () => setSnackbar(null);
  const userinfoHeader = getUserInfo();
  const apiBaseUrl = config.API_BASE_URL;
  const theme = useTheme();
  const [errors, setErrors] = useState({});

  const [captchaImage, setCaptchaImage] = useState('');
  const [captchaToken, setCaptchaToken] = useState('');

  const [getAllState, setAllState] = useState([]);
  const [getAllFinYear, setAllFinYear] = useState([]);

  const classes = reportcss();

  const getGithubData = () => {
    let endpoints = ['/common/findAllReportSchemaState', '/report/findFinancialYearList'];

    Promise.all(endpoints.map((endpoint) => axiosInstance.get(endpoint)))
      .then((responses) => {
        const allState = responses[0].data;
        const allFinYear = responses[1].data;
        setAllState(allState);
        setAllFinYear(allFinYear);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  };

  useEffect(() => {
    getGithubData();
  }, []);

  const handleChangeFinYear = (event) => {
    setFormData({ ...formData, finYear: event.target.value });
    setErrors((prevErrors) => {
      const updatedErrors = { ...prevErrors };
      delete updatedErrors.finYear;
      return updatedErrors;
    });
  };

  const handleChangeState = (event) => {
    setFormData({ ...formData, stateCode: event.target.value });
    setErrors((prevErrors) => {
      const updatedErrors = { ...prevErrors };
      delete updatedErrors.stateCode;
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

  const columnsReport = [
    { field: 'id', headerName: 'SNo.', align: 'left', headerAlign: 'left', width: 155 },
    { field: 'stname', headerName: 'State', align: 'left', headerAlign: 'left', width: 324 },
    {
      field: 'socialFile',
      headerName: 'Social Audit Report File',
      align: 'left',
      headerAlign: 'left',
      width: 320,
      renderCell: (params) => {
        if (params.value) {
          return (
            <div style={{ textAlign: 'center' }}>
              <a href="#" onClick={() => handleDownload(params.value)} style={{ color: theme.palette.primary.main }}>
                Social Audit Report
              </a>
            </div>
          );
        } else {
          return null;
        }
      }
    },
    { field: 'finyear', headerName: 'Financial Year', align: 'left', headerAlign: 'left', width: 330 },
    {
      field: 'atrFile',
      headerName: 'ATR File',
      align: 'left',
      headerAlign: 'left',
      width: 320,
      renderCell: (params) => {
        if (params.value) {
          return (
            <div style={{ textAlign: 'center' }}>
              <a href="#" onClick={() => handleDownload(params.value)} style={{ color: theme.palette.primary.main }}>
                Action Taken Report
              </a>
            </div>
          );
        } else {
          return null;
        }
      }
    },
    {
      field: 'atrUploaddate',
      headerName: 'ATR Date',
      align: 'left',
      headerAlign: 'left',
      width: 320,
      renderCell: (params) => {
        if (params.value) {
          const dateParts = params.value.split('-');
          const formattedDate = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
          return <div>{formattedDate}</div>;
        }
      }
    }
  ].filter(Boolean);

  const getSocialAuditReportSummary = async () => {
    try {
      setLoading(true);
      const { stateCode, finYear, captcha } = formData;
      const response = await axiosInstance.post(`report/showSocialAuditReport/${stateCode}/${finYear}/${captcha}/${captchaToken}`);
      if (response.data.length === 0) {
        setSnackbar({ children: 'No record found', severity: 'info' });
      }
      const newData = response.data.map((row, index) => ({ ...row, id: index + 1 }));
      setDataSummary(newData);
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
      getSocialAuditReportSummary();
      setIsSearchClicked(true);
    }
  };
  const handleCancelClick = () => {
    setFormData({ ...formData, finYear: '', stateCode: '', captcha: '' });
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

  const handleDownload = (filename) => {
    const token = getAuthToken();
    fetch(`${apiBaseUrl}/report/downloadSocialAuditReportFile/${filename}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        userInfo: JSON.stringify(userinfoHeader)
      }
    })
      .then((response) => {
        if (response.status === 404) {
          throw new Error('File not found');
        }
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.arrayBuffer();
      })
      .then((data) => {
        const blob = new Blob([data]);
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      })
      .catch((error) => {
        console.error('There was a problem with the fetch operation:', error);
        setSnackbar({ children: 'File not found', severity: 'info' });
      });
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.finYear) {
      errors.finYear = messages_en.finYearRequired;
    }

    if (!formData.stateCode) {
      errors.stateCode = messages_en.stateCodeRequired;
    }

    if (!formData.captcha) {
      errors.captcha = messages_en.captchaRequired;
    }

    setErrors(errors);

    return Object.keys(errors).length === 0;
  };

  const CustomToolbar = (props) => {
    return (
      <div>
        <GridToolbar {...props} />
        <div style={{ borderBottom: '1px solid #ccc', marginTop: '8px' }}></div>
      </div>
    );
  };

  return (
    <>
      <MainCard>
        <h3 style={{ fontSize: '2rem', color: 'black', fontWeight: 'normal' }}>Audit Report</h3>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={3}>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">
                Financial Year&nbsp;<span style={{ color: 'red' }}>*</span>
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                name="finYear"
                label="Financial Year"
                value={formData.finYear}
                onChange={handleChangeFinYear}
              >
                {getAllFinYear.map((item) => (
                  <MenuItem key={item.finCode} value={item.finYear}>
                    {item.finYear}
                  </MenuItem>
                ))}
              </Select>
              {errors.finYear && (
                <FormHelperText error id="finYear-error">
                  {errors.finYear}
                </FormHelperText>
              )}
            </FormControl>
          </Grid>
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
            <Typography gutterBottom style={{ fontSize: '1.5rem', color: 'black', fontWeight: 'normal' }}>
              Audit Report Details
            </Typography>
            <div className={classes.root}>
              <DataGrid
                slots={{ toolbar: CustomToolbar }}
                slotProps={{
                  toolbar: {
                    showQuickFilter: true,
                    printOptions: { disableToolbarButton: true },
                    csvOptions: { fileName: 'SOCIAL_AUDIT_REPORT' }
                  }
                }}
                rows={dataSummary}
                columns={columnsReport}
                stickyFooter
                hideFooterPagination
                disableRowSelectionOnClick
                density="compact"
                headerClassName="custom-header"
                style={{
                  textAlign: 'center',
                  rowHeight: 50,
                  headerHeight: 70,
                  letterSpacing: '1px'
                }}
                getRowClassName={(params) => (params.index % 2 === 0 ? 'white-row' : 'grey-row')}
              />
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
export default SocialAuditReport;
