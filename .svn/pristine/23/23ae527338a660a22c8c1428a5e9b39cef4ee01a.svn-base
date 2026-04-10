import React, { useEffect, useState } from 'react';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

import {
  TextField,
  Grid,
  IconButton,
  InputAdornment,
  FormControl,
  FormHelperText,
  Typography,
  CircularProgress,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tooltip
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import axiosInstance from 'hooks/useAuthTokenUrl';
import CloseIcon from '@mui/icons-material/Close';

const BeneficiaryAadharDetails = ({
  formData,
  setFormData,
  formErrors,
  validateForm,
  aadharVerifyStatus,
  setAadharVerifyStatus,
  updateApplicantName,
  setUpdateApplicantName,
  setAadharFormCompleted
}) => {
 
    const [aadhaarData, setAadhaarData] = useState(null);
const handleClickOpen = async (rtoken) => {
  const storedData = localStorage.getItem('applicationNo');
  console.log(rtoken)
  try {
    setLoading(true);
   const applicationNo = JSON.parse(storedData);
    const response = await axiosInstance.post('/beneficiaryRegistration/showUidDetailsByRtoken', { rtoken ,applicationNo});

    setAadhaarData(response.data);
    setShowAadhaar(true);
        if (response.data.ret_data) {
        setFormData(prevData => ({ ...prevData, uidNo: response.data.ret_data }));
      }
  } catch (error) {
    console.error(error);
    alert('Failed to fetch Aadhaar data');
  }
  finally {
      setLoading(false);
    }
};

  const handleClose = () => {
    setShowAadhaar(false);   
    setAadhaarData(null);   
  };
  String.prototype.verhoeffCheck = (function () {
    var d = [
      [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
      [1, 2, 3, 4, 0, 6, 7, 8, 9, 5],
      [2, 3, 4, 0, 1, 7, 8, 9, 5, 6],
      [3, 4, 0, 1, 2, 8, 9, 5, 6, 7],
      [4, 0, 1, 2, 3, 9, 5, 6, 7, 8],
      [5, 9, 8, 7, 6, 0, 4, 3, 2, 1],
      [6, 5, 9, 8, 7, 1, 0, 4, 3, 2],
      [7, 6, 5, 9, 8, 2, 1, 0, 4, 3],
      [8, 7, 6, 5, 9, 3, 2, 1, 0, 4],
      [9, 8, 7, 6, 5, 4, 3, 2, 1, 0]
    ];
    var p = [
      [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
      [1, 5, 7, 6, 2, 8, 3, 0, 9, 4],
      [5, 8, 0, 3, 7, 9, 6, 1, 4, 2],
      [8, 9, 1, 6, 0, 4, 3, 5, 2, 7],
      [9, 4, 5, 3, 1, 2, 6, 8, 7, 0],
      [4, 2, 8, 6, 5, 7, 3, 9, 0, 1],
      [2, 7, 9, 3, 8, 0, 6, 4, 1, 5],
      [7, 0, 4, 6, 9, 1, 3, 2, 5, 8]
    ];

    return function () {
      var c = 0;
      this.replace(/\D+/g, '')
        .split('')
        .reverse()
        .join('')
        .replace(/[\d]/g, function (u, i) {
          c = d[c][p[i & 7][parseInt(u, 10)]];
        });
      return c === 0;
    };
  })();

  const [aadharAvailability] = useState(null);
  const [loading, setLoading] = useState(true);
  const handleChange = (field, value) => {
    const changesMade = formData.nameAsPerUid !== undefined && formData[field] !== value;

    if (field === 'applicationNo' && formData.nameAsPerUid === undefined) {
      setFormData((prevFormData) => ({ ...prevFormData, [field]: value, changesMade }));
      return;
    }

    setFormData((prevFormData) => ({ ...prevFormData, applicationNo: applicationNoFromLocalStorage, [field]: value, changesMade }));
    validateForm(field, value, 1, 2);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedData = localStorage.getItem('applicationNo');
        if (storedData) {
          const parsedData = JSON.parse(storedData);

          const response = await axiosInstance.get(`/beneficiaryRegistration/findPensionerUidDetailsByApplicationNo/${parsedData}`);
          const beneficiaryData = response.data;
          setAadharFormCompleted(true);
          if (beneficiaryData.consentDate) {
            const dateAdapter = new AdapterDayjs();
            const dateComponents = beneficiaryData.consentDate.split('-');
            const rearrangedDate = `${dateComponents[1]}-${dateComponents[0]}-${dateComponents[2]}`;
            beneficiaryData.consentDate = dateAdapter.date(rearrangedDate);
          }

          if (beneficiaryData.nameAsPerUid && beneficiaryData.uidNo && beneficiaryData.consentDate) {
            setAadharVerifyStatus(true);
          }

          setFormData((prevData) => ({
            ...prevData,
            ...beneficiaryData
          }));
        }
        setLoading(false);
      } catch (error) {
        if (error.response && error.response.data.message) {
          console.log(error.response.data.message);
        } else {
          console.error('Error fetching data:', error);
        }
        setAadharFormCompleted(false);
        setLoading(false);
      }
    };

    let isMounted = true;

    if (isMounted) {
      fetchData();
    }

    return () => {
      isMounted = false;
    };
  }, []);

  const [showAadhaar, setShowAadhaar] = useState(false);

  
  const storedData = localStorage.getItem('applicationNo');
  let applicationNoFromLocalStorage;
  if (storedData) {
    applicationNoFromLocalStorage = JSON.parse(storedData);
  }

  useEffect(() => {
    let applicantNameFromLocalStorage = localStorage.getItem('applicantName');

    let responseApplicantNameFromLocalStorage = localStorage.getItem('responseApplicantName');
    localStorage.removeItem('responseApplicantName');

    if (responseApplicantNameFromLocalStorage) {
      setFormData((prevData) => ({
        ...prevData,
        nameAsPerUid: responseApplicantNameFromLocalStorage
      }));
      handleChange('nameAsPerUid', responseApplicantNameFromLocalStorage);
    } else if (applicantNameFromLocalStorage) {
      setFormData((prevData) => ({
        ...prevData,
        nameAsPerUid: applicantNameFromLocalStorage
      }));
      handleChange('nameAsPerUid', applicantNameFromLocalStorage);
    }
  }, []);

  const handleNameAsPerUidCheck = async () => {
    try {
      setLoading(true);
      setUpdateApplicantName('');

      let applicantNameFromLocalStorage;
      applicantNameFromLocalStorage = localStorage.getItem('applicantName');
      let responseApplicantNameFromLocalStorage = localStorage.getItem('responseApplicantName');
      if (
        formData.nameAsPerUid &&
        formData.nameAsPerUid.length > 0 &&
        formData.nameAsPerUid !== 'undefined' &&
        ((responseApplicantNameFromLocalStorage && responseApplicantNameFromLocalStorage !== formData.nameAsPerUid) ||
          (!responseApplicantNameFromLocalStorage && applicantNameFromLocalStorage !== formData.nameAsPerUid))
      ) {
        const confirmation = window.confirm(
          `Applicant name (${
            responseApplicantNameFromLocalStorage ? responseApplicantNameFromLocalStorage : applicantNameFromLocalStorage
          }) mismatched with Name As Per Uid (${formData.nameAsPerUid}).\n Do you want to update applicant name?`
        );
        if (confirmation) {
          setUpdateApplicantName(true);
          console.log(updateApplicantName);
        } else {
          handleChange('nameAsPerUid', '');
        }
      }
    } catch (error) {
      console.error('Error checking name As Per Uid:', error);
    } finally {
      setLoading(false);
    }

    localStorage.removeItem('responseApplicantName');
  };

 

  return (
    <>
      <div>
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
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <TextField
              label={
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <span style={{ marginRight: '4px' }}>Application No</span>
                  <Typography style={{ color: 'red' }}>*</Typography>
                </div>
              }
              name="applicationNo"
              placeholder="Enter Application No"
              variant="outlined"
              fullWidth
              value={applicationNoFromLocalStorage}
              InputProps={{ readOnly: true }}
              onChange={(e) => handleChange('applicationNo', e.target.value)}
            />
          </Grid>

          <Grid item xs={12} sm={4}>
            <FormControl fullWidth className={formErrors.consentDate ? 'error' : ''}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label={
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <span style={{ marginRight: '4px' }}>Consent Date</span>
                      <Typography style={{ color: 'red' }}>*</Typography>
                    </div>
                  }
                  format="DD-MM-YYYY"
                  disableFuture
                  name="consentDate"
                  slotProps={{ textField: { fullWidth: true } }}
                  variant="outlined"
                  value={formData.consentDate}
                  onChange={(selectedDate) => handleChange('consentDate', selectedDate)}
                  error={formErrors.consentDate ? true : false}
                  readOnly={aadharVerifyStatus}
                ></DatePicker>
              </LocalizationProvider>
              {formErrors.consentDate && (
                <FormHelperText>
                  <Typography style={{ color: 'red', fontSize: '0.8rem' }}>{formErrors.consentDate}</Typography>
                </FormHelperText>
              )}
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={4}>
            <FormControl fullWidth className={formErrors.nameAsPerUid ? 'error' : ''}>
              <TextField
                label={
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <span style={{ marginRight: '4px' }}>Name as per Aadhaar</span>
                    <Typography style={{ color: 'red' }}>*</Typography>
                  </div>
                }
                name="nameAsPerUid"
                placeholder="Enter Name as per Aadhaar"
                variant="outlined"
                fullWidth
                value={formData.nameAsPerUid}
                InputProps={{
                  maxLength: 100,
                  readOnly: aadharVerifyStatus,
                  endAdornment: (
                    <InputAdornment position="end">{aadharVerifyStatus && <CheckCircleIcon style={{ color: 'green' }} />}</InputAdornment>
                  )
                }}
                InputLabelProps={{
                  shrink: true,
                  style: { color: aadharVerifyStatus ? 'green' : '' }
                }}
                style={{ borderColor: aadharVerifyStatus ? 'green' : '' }}
                onChange={(e) => handleChange('nameAsPerUid', e.target.value.toUpperCase())}
                onBlur={aadharVerifyStatus ? null : handleNameAsPerUidCheck}
                error={formErrors.nameAsPerUid ? true : false}
              />
              {formErrors.nameAsPerUid && (
                <FormHelperText>
                  <Typography style={{ color: 'red', fontSize: '0.8rem' }}>{formErrors.nameAsPerUid}</Typography>
                </FormHelperText>
              )}
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={4}>
            <FormControl fullWidth className={formErrors.nameAsPerUid ? 'error' : ''}>
              {aadharVerifyStatus ? (
                <FormHelperText>
                  <Typography style={{ color: 'green', fontSize: '0.8rem' }}>{aadharAvailability}</Typography>
                </FormHelperText>
              ) : (
                <FormHelperText>
                  <Typography style={{ color: 'red', fontSize: '0.8rem' }}>{aadharAvailability}</Typography>
                </FormHelperText>
              )}
            </FormControl>
  <Button
        variant="contained"
        onClick={() => handleClickOpen(formData.rtoken)}
        disabled={loading}
        startIcon={loading && <CircularProgress size={20} color="inherit" />}
      >
        {loading ? 'Loading...' : 'View Aadhaar'}
      </Button>

       <Dialog open={showAadhaar} onClose={handleClose} fullWidth maxWidth="sm">
             <DialogTitle
               sx={{
                 m: 0,
                 p: 2,
                 display: "flex",
                 justifyContent: "space-between",
                 alignItems: "center",
               }}
             >
               <Typography variant="h6">Aadhaar Details</Typography>
               <IconButton onClick={handleClose}>
                 <CloseIcon />
               </IconButton>
             </DialogTitle>
     
             <DialogContent dividers>
               {!aadhaarData ? (
                 <Typography variant="body2">
                   Loading Aadhaar data...
                 </Typography>
               ) : (
                 <Tooltip title={aadhaarData.ret_data}>
                   <Typography
                     variant="body1"
                     sx={{
                       whiteSpace: "nowrap",
                       overflow: "hidden",
                       textOverflow: "ellipsis",
                     }}
                   >
                     Aadhaar No.: {aadhaarData.ret_data}
                   </Typography>
                 </Tooltip>
               )}
             </DialogContent>
     
             <DialogActions>
               <Button onClick={handleClose} color="primary" variant="outlined">
                 Close
               </Button>
             </DialogActions>
           </Dialog>
          </Grid>
        </Grid>
      </div>
    </>
  );
};
export default BeneficiaryAadharDetails;
