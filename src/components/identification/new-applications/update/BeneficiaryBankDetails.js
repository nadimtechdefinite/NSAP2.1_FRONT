import React, { useState, useEffect } from 'react';
import axiosInstance from 'hooks/useAuthTokenUrl';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

import { TextField, Grid, FormControl, FormHelperText, Typography, CircularProgress, InputLabel, MenuItem, Select } from '@mui/material';

const BeneficiaryBankDetails = ({
  formData,
  setFormData,
  formErrors,
  setFormErrors,
  validateForm,
  setIsValid,
  isValid,
  accountNumberAvailability,
  setAccountNumberAvailability,
  setBankFormCompleted
}) => {
  const [loading, setLoading] = useState(true);
  const [filteredIfscCodes, setFilteredIfscCodes] = useState([]);
  const [bankAccountValid, setBankAccountValid] = useState(false);
  const [disbursementCodeValid, setDisbursementCodeValid] = useState(false);
  const [ifscCodeValid, setIfscCodeValid] = useState(false);
  const [getAllDisbursement, setAllDisbursement] = useState([]);
  const [selectedLabel, setSelectedLabel] = useState('');

  const getGithubData = () => {
    let endpoints = ['/master-management/findAllDisbursement'];

    Promise.all(endpoints.map((endpoint) => axiosInstance.get(endpoint)))
      .then((responses) => {
        const allDisbursement = responses[0].data;
        setAllDisbursement(allDisbursement);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  };

  useEffect(() => {
    getGithubData();
  }, []);

  console.log('getAllDisbursement', getAllDisbursement);

  const handleAccountNumberCheck = async () => {
    try {
      setLoading(true);
      setAccountNumberAvailability('');
      if (!formData.applicationNo || !formData.bankPoAccountNo) {
        throw new Error('Application Number and Bank Account Number are required.');
      }
      const requestData = {
        bankPoAccountNo: formData.bankPoAccountNo,
        applicationNo: formData.applicationNo
      };
      const postURL = '/beneficiaryRegistration/checkDuplicateAccountNumber';
      const response = await axiosInstance.post(postURL, requestData);

      if (response.data !== '') {
        setAccountNumberAvailability(response.data);
      } else {
        setAccountNumberAvailability('');
      }
      return response.data;
    } catch (error) {
      console.error('Error checking Account Number availability:', error);
    } finally {
      setLoading(false);
    }
  };

  const isValidIFSC = async (code) => {
    try {
      const disbursementCode = formData.disbursementCode;
      console.log('disbursementCode1', disbursementCode);
      const response = await axiosInstance.get(
        `/beneficiaryRegistration/findByIfscCode?ifscCode=${code}&disbursementCode=${disbursementCode}`
      );
      return response.data.length > 0;
    } catch (error) {
      console.error('Error fetching IFSC codes:', error);
      return false;
    }
  };

  const handleChange = async (field, value) => {
    let changesMade = false;

    if (formData[field] !== value) {
      changesMade = true;

      if (field === 'applicationNo') {
        setFormData({ ...formData, [field]: value, changesMade });
        return;
      }

      if (field === 'ifscCode') {
        filterIfscCodes(value);
        const isValid = await isValidIFSC(value);
        setIsValid(isValid);
        setFormErrors({ ...formErrors, [field]: isValid ? '' : 'Invalid IFSC Code' });
      } else {
        validateForm(field, value, 1, 1);
      }
    }

    setFormData((prevFormData) => ({ ...prevFormData, applicationNo: applicationNoFromLocalStorage, [field]: value, changesMade }));

    if (field === 'disbursementCode' && value === '4') {
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        bankPoAccountNo: '',
        ifscCode: ''
      }));
    }
  };

  const filterIfscCodes = async (enteredValue) => {
    try {
      const disbursementCode = formData.disbursementCode;
      console.log('disbursementCode', disbursementCode);
      const response = await axiosInstance.get(
        `/beneficiaryRegistration/findByIfscCode?ifscCode=${enteredValue}&disbursementCode=${disbursementCode}`
      );
      const enhancedCodes = response.data.map((code) => ({
        ...code,
        displayLabel: `${code.ifscCode} - ${code.bankType} - ${code.bankBranchName}- ${code.bankName} - ${code.bankCode}`
      }));
      setFilteredIfscCodes(enhancedCodes);
    } catch (error) {
      console.error('Error fetching IFSC codes:', error);
    }
  };

  const handleIfscCodeClick = (selectedIfscCode) => {
    setFormData({
      ...formData,
      ifscCode: selectedIfscCode.ifscCode,
      branchCode: selectedIfscCode.branchCode,
      bankType: selectedIfscCode.bankType
    });

    setFilteredIfscCodes([]);
    setSelectedLabel(selectedIfscCode.displayLabel);
  };

  const handleClearIfscCode = () => {
    setFormData({ ...formData, ifscCode: '' });
    setFilteredIfscCodes([]);
    setSelectedLabel('');
  };

  const inputClass = isValid ? 'valid-input' : 'invalid-input';

  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedData = localStorage.getItem('applicationNo');
        if (storedData) {
          const parsedData = JSON.parse(storedData);

          const response = await axiosInstance.get(`/beneficiaryRegistration/findPensionerBankDetailsByApplicationNo/${parsedData}`);
          const beneficiaryData = response.data;
          console.log('beneficiaryData.disbursementCode', beneficiaryData.disbursementCode);
          setBankFormCompleted(true);
          if (beneficiaryData.bankPoAccountNo) {
            setBankAccountValid(true);
          }
          if (beneficiaryData.disbursementCode) {
            setDisbursementCodeValid(true);
          }
          if (beneficiaryData.ifscCode) {
            setIfscCodeValid(true);
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
        setBankFormCompleted(false);
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

  if (loading) {
    return <p>Loading...</p>;
  }

  const storedData = localStorage.getItem('applicationNo');
  let applicationNoFromLocalStorage;
  if (storedData) {
    applicationNoFromLocalStorage = JSON.parse(storedData);
  }

  console.log('formData.disbursementCode', formData.disbursementCode);

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
            <FormControl fullWidth className={formErrors.disbursementCode ? 'error' : ''}>
              <InputLabel id="demo-simple-select-label">
                Disbursement&nbsp;<span style={{ color: 'red' }}>*</span>
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                label="Disbursement"
                name="categoryId"
                value={formData.disbursementCode || ''}
                onChange={(e) => handleChange('disbursementCode', e.target.value)}
                readOnly={disbursementCodeValid} // Use readOnly prop based on disbursementCodeValid state
                inputProps={{ tabIndex: -1 }}
              >
                {getAllDisbursement.map((item) => (
                  <MenuItem key={item.disbursementCode} value={item.disbursementCode}>
                    {item.disbursementName}
                  </MenuItem>
                ))}
              </Select>
              {formErrors.disbursementCode && (
                <FormHelperText>
                  <Typography style={{ color: 'red', fontSize: '0.8rem' }}>{formErrors.disbursementCode}</Typography>
                </FormHelperText>
              )}
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              label={
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <span style={{ marginRight: '4px' }}>IFSC Code</span>
                  {formData.disbursementCode !== '4' && <Typography style={{ color: 'red' }}>*</Typography>}
                </div>
              }
              name="ifscCode"
              variant="outlined"
              fullWidth
              value={formData.ifscCode}
              onChange={(e) => handleChange('ifscCode', e.target.value.toUpperCase())}
              error={formErrors.ifscCode && true}
              helperText={formErrors.ifscCode}
              className={inputClass}
              InputProps={{
                readOnly: ifscCodeValid,
                endAdornment: (
                  <>
                    {formData.ifscCode && (
                      <IconButton onClick={handleClearIfscCode} size="small">
                        <CloseIcon />
                      </IconButton>
                    )}
                  </>
                )
              }}
            />
            {selectedLabel && (
              <Typography
                style={{
                  marginTop: '8px',
                  backgroundColor: '#f0f0f0',
                  padding: '4px',
                  borderRadius: '4px',
                  display: 'inline-block',
                  color: 'black' // Set the text color to black
                }}
              >
                {selectedLabel}
              </Typography>
            )}
            <ul
              style={{
                position: 'absolute',
                zIndex: 1,
                listStyle: 'none',
                padding: 0,
                borderRadius: '8px',
                overflowY: 'auto',
                maxHeight: '200px',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                width: '400px'
              }}
            >
              {Array.isArray(filteredIfscCodes) &&
                filteredIfscCodes.map((code) => (
                  <li
                    key={code.id}
                    style={{
                      display: 'block',
                      padding: '8px',
                      borderBottom: '1px solid #eee',
                      borderRadius: '8px',
                      marginBottom: '8px'
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => handleIfscCodeClick(code)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleIfscCodeClick(code);
                        }
                      }}
                      tabIndex={0}
                      style={{
                        border: 'none',
                        background: 'none',
                        padding: 0,
                        font: 'inherit',
                        cursor: 'pointer',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {code.displayLabel}
                    </button>
                  </li>
                ))}
            </ul>
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth className={formErrors.bankPoAccountNo ? 'error' : ''}>
              <TextField
                label={
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <span style={{ marginRight: '4px' }}>Bank/PO Account No</span>
                    {formData.disbursementCode !== '4' && <Typography style={{ color: 'red' }}>*</Typography>}
                  </div>
                }
                name="bankPoAccountNo"
                placeholder="Enter Bank/PO Account No"
                variant="outlined"
                fullWidth
                value={formData.bankPoAccountNo}
                inputProps={{ maxLength: 20 }}
                onChange={(e) => handleChange('bankPoAccountNo', e.target.value.toUpperCase())}
                error={formErrors.bankPoAccountNo && true}
                onBlur={handleAccountNumberCheck}
                InputProps={{
                  readOnly: bankAccountValid
                }}
              />
              {formErrors.bankPoAccountNo && (
                <FormHelperText>
                  <Typography style={{ color: 'red', fontSize: '0.8rem' }}>{formErrors.bankPoAccountNo}</Typography>
                </FormHelperText>
              )}
              {accountNumberAvailability ? (
                <FormHelperText>
                  <Typography style={{ color: 'red', fontSize: '0.8rem' }}>{accountNumberAvailability}</Typography>
                </FormHelperText>
              ) : null}
            </FormControl>
          </Grid>
        </Grid>
      </div>
    </>
  );
};

export default BeneficiaryBankDetails;
