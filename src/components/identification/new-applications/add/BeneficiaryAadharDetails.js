import React, { useState, useEffect } from 'react';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import AadharEncrypter from 'components/common/AadharEncrypter ';
import axiosInstance from 'hooks/useAuthTokenUrl';
import {
  TextField,
  Grid,
  IconButton,
  InputAdornment,
  FormControl,
  FormHelperText,
  Typography,
  CircularProgress,
  Box,
  Paper,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
const BeneficiaryAadharDetails = ({
  formData,
  setFormData,
  formErrors,
 // setFormErrors,
  validateForm,
  aadharVerifyStatus,
  setAadharVerifyStatus
  // updateApplicantName,
  // setUpdateApplicantName
}) => {
  function vhCheck(strVal) {
    if (strVal.verhoeffCheck()) {
      return true;
    } else {
      return false;
    }
  }
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

  const [aadharAvailability, setAadharAvailability] = useState(null);
  const [registrationDetails, setRegistrationDetails] = useState(null);
  const [getAllGender, setAllGender] = useState([]);
   const [maskedUid, setMaskedUid] = useState('');

  const [loading, setLoading] = useState(false);
  useEffect(() => {
    axiosInstance.get('/master-management/findAllGender').then((res) => {
      setAllGender(res.data);
    });
  }, []);
const validateFormData = () => {
  if (!formData.gender) {
    setAadharAvailability('Please select gender before verifying Aadhaar');
    setAadharVerifyStatus(false);
    return false;
  }

  if (!formData.uidNo || formData.uidNo.length !== 12) {
    setAadharAvailability('Aadhaar number must be 12 digits');
    setAadharVerifyStatus(false);
    return false;
  }

  const valid = vhCheck(formData.uidNo);
  if (!valid) {
    setAadharAvailability('Invalid Aadhaar number');
    setAadharVerifyStatus(false);
    return false;
  }

  return true;
};

const encryptAadhaar = () => {
  return AadharEncrypter({ uidNumber: formData.uidNo });
};

const handleDuplicateResponse = async (msg) => {
 try {
    // Works for alphanumeric and hyphenated application numbers like JK-A-00010547
    const match = msg.match(/Application no\s*-\s*([A-Za-z0-9-]+)/);

    if (match && match[1]) {
      const appNo = match[1].trim();
      console.log('Duplicate Aadhaar found. Application No:', appNo);
      const secondResponse = await axiosInstance.get(
        `/beneficiaryRegistration/getAllRegistrationDetails/${appNo}`
      );
      setRegistrationDetails(secondResponse.data);
    } else {
      console.log('No valid Application No found in message:', msg);
    }
  } catch (error) {
    console.error('Error fetching duplicate Aadhaar details:', error);
  }
};

const handleVerificationResponse = (data) => {
  setAadharAvailability(data.AadharErrorDescription);
  if (data.AadharErrorCode === '200') {
     localStorage.setItem('aadhaarVerification', JSON.stringify({ rtoken: data.rtoken, consentDate: data.consentDate }));

      setFormData(prev => ({
        ...prev,
        rtoken: data.Rtoken,
        consentDate: data.ConsentDate
      }));
         setAadharVerifyStatus(true);
  } else {
    setAadharVerifyStatus(false);
  }
};

const handleAadharCheck = async () => {
  try {
    setLoading(true);
    setAadharAvailability(null);

    if (!validateFormData()) {
      setLoading(false);
      return;
    }

    const encryptedUidData = encryptAadhaar();

    const requestData = {
      nameAsPerUid: formData.nameAsPerUid,
      uidNo: encryptedUidData,
      applicationNo: formData.applicationNo,
      gender: formData.gender,
      consentDate: formData.consentDate
    };

    const response = await axiosInstance.post('/beneficiaryRegistration/aadharDetailsVerifyingStatus', requestData);
    const data = response.data;
    handleVerificationResponse(data);

    const msg = data?.aadharErrorDescription || 'Verification failed';
    setAadharAvailability(msg);

      if (msg === 'Aadhaar verified successfully' && data.rtoken) {
        const masked = formData.uidNo.replace(/^(\d{0,8})(\d{4})$/, 'XXXXXXXX$2');
        setMaskedUid(masked); // Store masked value for display

        setFormData(prev => ({
          ...prev,
          consentDate: data.consentDate,
          rtoken: data.rtoken // Do NOT overwrite uidNo
        }));
        setAadharVerifyStatus(true);
      }
   else {
      setAadharVerifyStatus(false);
    }

    if (
      msg &&
      msg.includes('Duplicate! Aadhaar already exists in Application with Application no')
    ) {
      await handleDuplicateResponse(msg);
    }
  } catch (error) {
    console.error('Error checking Aadhaar availability:', error);
    setAadharAvailability('Aadhaar verification failed');
    setAadharVerifyStatus(false);
  } finally {
    setLoading(false);
  }
};


  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });

    validateForm(field, value, 1, 2);
  };

  const [showPassword, setShowPassword] = useState(false);

  const handleTogglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };
  const resetPage = () => {
    setFormData({
      applicationNo: '',
      uidNo: '',
      nameAsPerUid: '',
      consentDate: '',
      gender: '',
      rtoken: ''
    });
    setAadharAvailability(null);
    setAadharVerifyStatus(false);
    setRegistrationDetails(null);
      setMaskedUid('');
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
        <form autoComplete="off">
          <Grid container spacing={2}>
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
                  id="nameAsPerUid"
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
                  // onBlur={aadharVerifyStatus ? null : handleNameAsPerUidCheck}
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
              <FormControl fullWidth className={formErrors.gender ? 'error' : ''}>
                <InputLabel id="gender-select-label">Gender</InputLabel>
                <Select
                  labelId="gender-select-label"
                  id="gender-select"
                   value={formData.gender || ''}
                  label="Gender"
                  onChange={(e) => handleChange('gender', e.target.value)}
                >
                  {getAllGender.map((item) => (
                    <MenuItem key={item.genderId} value={item.genderName.substring(0, 1)}>
                      {item.genderName}
                    </MenuItem>
                  ))}
                </Select>
                {formErrors.gender && <FormHelperText style={{ color: 'red' }}>{formErrors.gender}</FormHelperText>}
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth className={formErrors.uidNo ? 'error' : ''}>
                <TextField
                  label={
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <span style={{ marginRight: '4px' }}>Aadhar Number</span>
                      <Typography style={{ color: 'red' }}>*</Typography>
                    </div>
                  }
                  name="uidNo"
                  placeholder="Enter Aadhar Number"
                  variant="outlined"
                  fullWidth
                  autoComplete="new-password"
                  type={showPassword ? 'text' : 'Password'}
                  value={aadharVerifyStatus ? maskedUid : formData.uidNo}
                  inputProps={{ maxLength: 12 }}
                  onChange={(e) => handleChange('uidNo', e.target.value)}
                  onBlur={aadharVerifyStatus ? null : handleAadharCheck}
                  error={formErrors.uidNo && true}
                  InputProps={{
                    readOnly: aadharVerifyStatus,
                    endAdornment: (
                      <InputAdornment position="end">
                        {aadharVerifyStatus ? (
                          <CheckCircleIcon style={{ color: 'green' }} />
                        ) : (
                          <IconButton onClick={handleTogglePasswordVisibility} edge="end">
                            {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                          </IconButton>
                        )}
                      </InputAdornment>
                    )
                  }}
                  InputLabelProps={{
                    shrink: true,
                    style: { color: aadharVerifyStatus ? 'green' : '' }
                  }}
                  style={{ borderColor: aadharVerifyStatus ? 'green' : '' }}
                />
                {formErrors.uidNo && (
                  <FormHelperText>
                    <Typography style={{ color: 'red', fontSize: '0.8rem' }}>{formErrors.uidNo}</Typography>
                  </FormHelperText>
                )}
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
            </Grid>
          </Grid>
          <Grid container spacing={2} justifyContent="flex-end" sx={{ mt: 2 }}>
            <Grid item>
              {registrationDetails && (
                <button
                  type="button"
                  onClick={resetPage}
                  style={{
                    backgroundColor: '#f44336',
                    color: '#fff',
                    padding: '6px 16px',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  Close
                </button>
              )}
            </Grid>
          </Grid>
          {registrationDetails && (
            <Box mt={3}>
              <Paper elevation={3} style={{ padding: '16px', backgroundColor: '#f9f9f9' }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', fontSize: '1.4rem' }}>
                  <strong>Duplicate Aadhaar Details</strong>
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Typography>
                      <strong>Application No:</strong> {registrationDetails.applicationNo || 'N/A'}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography>
                      <strong>Name:</strong> {registrationDetails.beneficiaryName || 'N/A'}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography>
                      <strong>Aadhar No:</strong> {'************'}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography>
                      <strong>Father/Husband Name:</strong> {registrationDetails.fatherHusbandName || 'N/A'}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography>
                      <strong>Date of Birth:</strong>{' '}
                      {registrationDetails.dateOfBirth && new Date(registrationDetails.dateOfBirth).toLocaleDateString('en-GB')}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography>
                      <strong>Age:</strong> {registrationDetails.age || 'N/A'}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography>
                      <strong>Status:</strong> {registrationDetails.status || 'N/A'}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography>
                      <strong>Scheme:</strong> {registrationDetails.schemeCode || 'N/A'}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography>
                      <strong>District Name:</strong>
                      {registrationDetails.districtName || 'N/A'}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography>
                      <strong>Grampanchyat/Ward Name:</strong>
                      {registrationDetails.gramPanchayatWardName || 'N/A'}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography>
                      <strong>Village Name:</strong>
                      {registrationDetails.villageName || 'N/A'}
                    </Typography>
                  </Grid>
                </Grid>
              </Paper>
            </Box>
          )}
        </form>
      </div>
    </>
  );
};
export default BeneficiaryAadharDetails;
