import React, { useState, useEffect } from 'react';
import MainCard from 'ui-component/cards/MainCard';
import {
  Grid,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Button,
  CircularProgress,
  Typography,
  FormHelperText,
  Alert,
  Snackbar,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Divider,
  IconButton,
  TextField
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import FinancialYearList from '../common-component/FinancialYearList';
import StateList from '../common-component/StateList';
import YearList from '../common-component/YearList';
import MonthList from '../common-component/MonthList';
import axios from 'axios';
import config from 'config';
import { makeStyles } from '@material-ui/core/styles';
import MonthlyProgressDataReport from './DataReport';
const useStyles = makeStyles({
  tableContainer: {
    borderRadius: '1px', // Adjust the border-radius value as needed
    overflow: 'hidden' // Ensure overflow is hidden to prevent content from overflowing the rounded corners
  },

  table: {
    minWidth: 650,
    borderCollapse: 'collapse'
  },
  tableHeaderCell: {
    border: '1px solid black',
    padding: '8px'
  },
  tableRow: {
    '& > *': {
      border: '1px solid black',
      padding: '8px'
    }
  },
  oddRow: {
    backgroundColor: 'rgba(0, 0, 0, 0.04)'
  },
  evenRow: {
    backgroundColor: 'white'
  }
});
const MonthlyProgressReport = () => {
  const classes = useStyles();
  const apiBaseUrl = config.API_BASE_URL;
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState(null);
  const [errors, setErrors] = useState({});
  const [tableData, setTableData] = useState([]);
  const [dataReport, setDataReport] = useState([]);
  const [monthClicked, setMonthClicked] = useState(false);
  const [getErrorApi, setErrorApi] = useState(null);
  const [captchaImage, setCaptchaImage] = useState('');
  const [captchaToken, setCaptchaToken] = useState('');
  const handleCloseSnackbar = () => setSnackbar(null);
  const [formData, setFormData] = useState({
    reportTypeCode: '',
    finYearCode: '',
    mprTypeCode: '',
    stateCode: '',
    yearCode: '',
    monthCode: '',
    captcha: ''
  });

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

  const handleChangeReportType = (event) => {
    setTableData([]);
    setMonthClicked(false);
    const { value } = event.target;
    setFormData({
      reportTypeCode: value,
      finYearCode: '',
      mprTypeCode: '',
      stateCode: '',
      yearCode: '',
      monthCode: ''
    });
    setErrors((prevErrors) => {
      const updatedErrors = { ...prevErrors };
      delete updatedErrors.reportTypeCode;
      return updatedErrors;
    });
  };

  const handleSelectFinYear = (finyearcode) => {
    setFormData({ ...formData, finYearCode: finyearcode });
    setErrors((prevErrors) => {
      const updatedErrors = { ...prevErrors };
      delete updatedErrors.finYearCode;
      return updatedErrors;
    });
  };

  const handleChangeMprType = (event) => {
    setFormData({ ...formData, mprTypeCode: event.target.value });
    setErrors((prevErrors) => {
      const updatedErrors = { ...prevErrors };
      delete updatedErrors.mprTypeCode;
      return updatedErrors;
    });
  };
  const handleSelectState = (state) => {
    setFormData({ ...formData, stateCode: state });
    setErrors((prevErrors) => {
      const updatedErrors = { ...prevErrors };
      delete updatedErrors.stateCode;
      return updatedErrors;
    });
  };

  const handleSelectYear = (yearCode) => {
    setFormData({ ...formData, yearCode: yearCode });
    setErrors((prevErrors) => {
      const updatedErrors = { ...prevErrors };
      delete updatedErrors.yearCode;
      return updatedErrors;
    });
  };

  const handleSelectMonth = (monthCode) => {
    setFormData({ ...formData, monthCode: monthCode });
    setErrors((prevErrors) => {
      const updatedErrors = { ...prevErrors };
      delete updatedErrors.monthCode;
      return updatedErrors;
    });
  };

  const submitFormAndGetData = async () => {
    setLoading(true);
    let formErrors = {};

    // Validate based on reportTypeCode
    if (formData.reportTypeCode === 1) {
      // National Level validation
      if (!formData.finYearCode) {
        formErrors.finYearCode = 'Financial Year is required.';
      }
    } else if (formData.reportTypeCode === 2) {
      // State Level validation
      if (!formData.stateCode) {
        formErrors.stateCode = 'State is required.';
      }
      if (!formData.yearCode) {
        formErrors.yearCode = 'Year is required.';
      }
      if (!formData.monthCode) {
        formErrors.monthCode = 'Month is required.';
      }
    } else {
      if (!formData.reportTypeCode) {
        formErrors.reportTypeCode = 'Select MPR Level.';
      }
      if (!formData.finYearCode) {
        formErrors.finYearCode = 'Financial Year is required.';
      }
    }
    if (!formData.mprTypeCode) {
      formErrors.mprTypeCode = 'Select MPR Type.';
    }
    if (!formData.captcha) {
      formErrors.captcha = 'Captcha code is required';
    }
    // Set errors if any
    setErrors(formErrors);

    // If there are errors, stop submission
    if (Object.keys(formErrors).length > 0) {
      setLoading(false);
      return;
    }

    // Proceed with form submission

    try {
      setMonthClicked(false);
      const formDataRequest = { ...formData, captchaToken: captchaToken };
      if (formDataRequest.reportTypeCode === 2) {
        const postUrl = `${apiBaseUrl}/monthlyProgressDataReport`;
        const response = await axios.post(postUrl, formDataRequest);
        setDataReport(response.data);
        setMonthClicked(true);
      } else {
        const postUrl = `${apiBaseUrl}/monthlyProgressReportList`;
        const response = await axios.post(postUrl, formDataRequest);
        setTableData(response.data);
      }
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
  };

  function callOtherAPI(stateCodeParam, monthNameParam) {
    setLoading(true);
    const stateCodeNew = stateCodeParam.toString().padStart(2, '0');
    const finYearCode = formData.finYearCode;
    const startYear = parseInt(finYearCode.split('-')[0]);
    const requestData = {
      stateCode: stateCodeNew,
      monthCode: monthNameParam,
      mprTypeCode: formData.mprTypeCode,
      yearCode: startYear,
      reportTypeCode: formData.reportTypeCode
    };
    try {
      const postUrl = `${apiBaseUrl}/monthlyProgressDataReport`;
      axios
        .post(postUrl, requestData)
        .then((response) => {
          setDataReport(response.data);
          setMonthClicked(true);
        })
        .catch((error) => {
          // Handle errors that occur during the API request
          console.error('There was a problem with the API request:', error);
        });
    } catch (error) {
      console.error('There was a problem with the API request:', error);
    } finally {
      setLoading(false);
    }
  }
  const cancelButton = () => {
    setTableData([]);
    setMonthClicked(false);
    setFormData({
      reportTypeCode: '',
      finYearCode: '',
      mprTypeCode: '',
      stateCode: '',
      yearCode: '',
      monthCode: ''
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
    setFormData({ ...formData, [field]: value });
    if (field === 'captcha') {
      setErrors((prevErrors) => {
        const updatedErrors = { ...prevErrors };
        delete updatedErrors.captcha;
        return updatedErrors;
      });
    }
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
      <MainCard title="MONTHLY PROGRESS REPORTS">
        <Grid container spacing={2}>
          <Grid item xs={12} sm={2}>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">
                Please Select Type Of MPR&nbsp;<span style={{ color: 'red' }}>*</span>
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={formData.reportTypeCode}
                label="Please Select Type Of MPR"
                name="reportTypeCode"
                onChange={handleChangeReportType}
              >
                <MenuItem value={1}>National Level</MenuItem>
                <MenuItem value={2}>State Level</MenuItem>
              </Select>
              {errors.reportTypeCode && (
                <FormHelperText error id="reportTypeCode-error">
                  {errors.reportTypeCode}
                </FormHelperText>
              )}
            </FormControl>
          </Grid>
          {formData.reportTypeCode !== 2 ? (
            <Grid item xs={12} sm={2}>
              <FormControl fullWidth>
                <FinancialYearList onSelectFinYear={handleSelectFinYear} isMendatory={true} defaultValueFinYear={formData.finYearCode} />
                {errors.finYearCode && (
                  <FormHelperText error id="finYearCode-error">
                    {errors.finYearCode}
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>
          ) : (
            <>
              <Grid item xs={12} sm={2}>
                <FormControl fullWidth>
                  <StateList onSelectState={handleSelectState} isMendatory={true} defaultStateCode={formData.stateCode} />
                  {errors.stateCode && (
                    <FormHelperText error id="stateCode-error">
                      {errors.stateCode}
                    </FormHelperText>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={2}>
                <FormControl fullWidth>
                  <YearList onSelectYear={handleSelectYear} isMendatory={true} defaultValueYear={formData.yearCode} />
                  {errors.yearCode && (
                    <FormHelperText error id="yearCode-error">
                      {errors.yearCode}
                    </FormHelperText>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={2}>
                <FormControl fullWidth>
                  <MonthList onSelectMonth={handleSelectMonth} isMendatory={true} defaultValueMonth={formData.monthCode} />
                  {errors.monthCode && (
                    <FormHelperText error id="monthCode-error">
                      {errors.monthCode}
                    </FormHelperText>
                  )}
                </FormControl>
              </Grid>
            </>
          )}

          <Grid item xs={12} sm={2}>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">
                Type Of MPR&nbsp;<span style={{ color: 'red' }}>*</span>
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={formData.mprTypeCode}
                label="Type Of MPR"
                name="mprTypeCode"
                onChange={handleChangeMprType}
              >
                <MenuItem value={1}>MPR 1</MenuItem>
              </Select>
              {errors.mprTypeCode && (
                <FormHelperText error id="mprTypeCode-error">
                  {errors.mprTypeCode}
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
              color="primary"
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
      {tableData.length > 0 && !monthClicked ? (
        <div style={{ marginTop: '20px' }}>
          <MainCard>
            <Typography variant="h4">
              MONTHLY PROGRESS REPORT ({formData.reportTypeCode === 1 ? 'National Level' : 'State Level'})
            </Typography>
            <Divider style={{ marginTop: '30px' }} />
            <TableContainer component={Paper} className={classes.tableContainer}>
              <Table className={classes.table} aria-label="simple table">
                <TableHead className={classes.tableHeaderCell}>
                  <TableRow className={classes.tableHeaderCell}>
                    <TableCell className={classes.tableHeaderCell}>State</TableCell>
                    <TableCell className={classes.tableHeaderCell}>April</TableCell>
                    <TableCell className={classes.tableHeaderCell}>May</TableCell>
                    <TableCell className={classes.tableHeaderCell}>June</TableCell>
                    <TableCell className={classes.tableHeaderCell}>July</TableCell>
                    <TableCell className={classes.tableHeaderCell}>August</TableCell>
                    <TableCell className={classes.tableHeaderCell}>September</TableCell>

                    <TableCell className={classes.tableHeaderCell}>October</TableCell>
                    <TableCell className={classes.tableHeaderCell}>November</TableCell>
                    <TableCell className={classes.tableHeaderCell}>December</TableCell>
                    <TableCell className={classes.tableHeaderCell}>January</TableCell>
                    <TableCell className={classes.tableHeaderCell}>February</TableCell>
                    <TableCell className={classes.tableHeaderCell}>March</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody className={classes.tableHeaderCell}>
                  {tableData.map((row, rowIndex) => (
                    <TableRow key={rowIndex} className={rowIndex % 2 === 0 ? classes.evenRow : classes.oddRow}>
                      {row.map((cell, cellIndex) => (
                        <TableCell key={cellIndex} className={classes.tableHeaderCell}>
                          {cell && cell.startsWith('Yes') ? (
                            <a href="#" style={{ cursor: 'pointer' }} onClick={() => callOtherAPI(rowIndex + 1, cell.substring(4))}>
                              Yes
                            </a>
                          ) : (
                            cell
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </MainCard>
        </div>
      ) : monthClicked ? (
        // Render MonthlyProgressDataReport if monthClicked is true
        <MonthlyProgressDataReport formData={formData} dataReport={dataReport} setMonthClicked={setMonthClicked} />
      ) : null}
      {!!snackbar && (
        <Snackbar open anchorOrigin={{ vertical: 'top', horizontal: 'center' }} onClose={handleCloseSnackbar} autoHideDuration={8000}>
          <Alert {...snackbar} onClose={handleCloseSnackbar} />
        </Snackbar>
      )}
    </>
  );
};
export default MonthlyProgressReport;
