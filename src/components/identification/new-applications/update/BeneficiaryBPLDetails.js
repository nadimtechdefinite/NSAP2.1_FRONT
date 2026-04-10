import React, { useEffect, useState } from 'react';
import axiosInstance from 'hooks/useAuthTokenUrl';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';
import InputAdornment from '@mui/material/InputAdornment';
import ClearIcon from '@mui/icons-material/Clear';
import { getAuthToken, getUserInfo } from 'utils/storageUtils';
import GetAppIcon from '@mui/icons-material/GetApp';
import config from 'config';

import { TextField, Grid, Select, FormControl, InputLabel, MenuItem, Button, FormHelperText, Typography } from '@mui/material';

const BeneficiaryBPLDetails = ({
  formData,
  setFormData,
  nfbsFormData,
  setNfbsFormData,
  formErrors,
  validateForm,
  setFormErrors,
  setBplFormCompleted
}) => {
  const [loading, setLoading] = useState(true);
  const [parsedData, setParsedData] = useState(null);
  const [fileDownload, setFileDownload] = useState(true);
  const userinfoHeader = getUserInfo();
  const apiBaseUrl = config.API_BASE_URL;
  const [currentDate] = useState(dayjs());

  const getDisabilityType = (code) => {
    const selectedDisability = getAllDisability.find((item) => item.disabilityCode === code);
    return selectedDisability ? selectedDisability.disabilityType : '';
  };

  const handleChange = (field, value) => {
    const changesMade = formData[field] !== value;

    if (field === 'applicationNo') {
      setFormData({ ...formData, [field]: value });
      return;
    }

    if (field === 'sanctionDate') {
      const updatedSanctionDate = value;
      const updatedPensionEffectiveDate = calculatePensionEffective(updatedSanctionDate);

      setFormData((prevState) => ({
        ...prevState,
        sanctionDate: updatedSanctionDate,
        disbursementUptoCenter: calculateDisbursementUpto(updatedSanctionDate),
        pensionEffectiveFromDate: updatedPensionEffectiveDate
      }));

      const sanctionDateDate = dayjs(updatedSanctionDate).startOf('day').toDate();
      const pensionEffectiveFromDateDate = dayjs(updatedPensionEffectiveDate).startOf('day').toDate();
      const applicationDateDate = dayjs(formData.applicationDate).startOf('day').toDate();

      // Validate sanctionDate against applicationDate
      setTimeout(() => {
        if (sanctionDateDate < applicationDateDate) {
          setFormErrors((prevErrors) => ({
            ...prevErrors,
            sanctionDate: 'Sanction Date must be greater than or equal to Application Date'
          }));
        } else {
          setFormErrors((prevErrors) => ({
            ...prevErrors,
            sanctionDate: ''
          }));
        }
      }, 0);

      // Validate pensionEffectiveFromDate against applicationDate
      setTimeout(() => {
        if (pensionEffectiveFromDateDate < applicationDateDate) {
          setFormErrors((prevErrors) => ({
            ...prevErrors,
            pensionEffectiveFromDate: `Pension Effective Date must be greater than or equal to Application Date `
          }));
        } else {
          setFormErrors((prevErrors) => ({
            ...prevErrors,
            pensionEffectiveFromDate: ''
          }));
        }
      }, 0);
    }

    if (field === 'applicationDate') {
      setFormData((prevState) => ({
        ...prevState,
        applicationDate: value
        // Add any other specific updates for applicationDate if needed
      }));

      const sanctionDateDate = dayjs(formData.sanctionDate).startOf('day').toDate();
      const pensionEffectiveFromDateDate = dayjs(formData.pensionEffectiveFromDate).startOf('day').toDate();
      const applicationDateDate = dayjs(value).startOf('day').toDate();

      // Validate sanctionDate again after applicationDate change
      setTimeout(() => {
        if (sanctionDateDate && sanctionDateDate < applicationDateDate) {
          setFormErrors((prevErrors) => ({
            ...prevErrors,
            sanctionDate: 'Sanction Date must be greater than or equal to Application Date'
          }));
        } else {
          setFormErrors((prevErrors) => ({
            ...prevErrors,
            sanctionDate: ''
          }));
        }
      }, 0);

      setTimeout(() => {
        if (pensionEffectiveFromDateDate && pensionEffectiveFromDateDate < applicationDateDate) {
          setFormErrors((prevErrors) => ({
            ...prevErrors,
            pensionEffectiveFromDate: 'Pension Effective Date must be greater than or equal to Application Date'
          }));
        } else {
          setFormErrors((prevErrors) => ({
            ...prevErrors,
            pensionEffectiveFromDate: ''
          }));
        }
      }, 0);
    }

    if (field === 'pensionEffectiveFromDate') {
      setFormData((prevState) => ({
        ...prevState,
        pensionEffectiveFromDate: value,
        disbursementUptoCenter: calculateDisbursementUpto(value)
      }));

      const pensionEffectiveFromDateDate = dayjs(value).startOf('day').toDate();
      const applicationDateDate = dayjs(formData.applicationDate).startOf('day').toDate();

      setTimeout(() => {
        if (pensionEffectiveFromDateDate < applicationDateDate) {
          setFormErrors((prevErrors) => ({
            ...prevErrors,
            pensionEffectiveFromDate: 'Pension Effective Date must be greater than or equal to Application Date'
          }));
        } else {
          setFormErrors((prevErrors) => ({
            ...prevErrors,
            pensionEffectiveFromDate: ''
          }));
        }
      }, 0);
    }

    setFormData((prevFormData) => ({ ...prevFormData, applicationNo: applicationNoFromLocalStorage, [field]: value, changesMade }));

    validateForm(field, value, 1, 3);
  };

  const calculateDisbursementUpto = (selectedDate) => {
    const dateAdapter = new AdapterDayjs();
    const lastDayOfPreviousMonth = selectedDate.subtract(1, 'month').endOf('month'); // Last day of previous month
    lastDayOfPreviousMonth.toDate(); // Convert Day.js object back to Date object
    return (selectedDate = dateAdapter.date(lastDayOfPreviousMonth));
  };

  const calculatePensionEffective = (selectedDate) => {
    const dateAdapter = new AdapterDayjs();
    const firstDayOfSameMonth = selectedDate.startOf('month'); // First day of the selected month
    firstDayOfSameMonth.toDate();
    return (selectedDate = dateAdapter.date(firstDayOfSameMonth));
  };

  const handleChangeNfbs = (field, value) => {
    const changesMade = formData[field] !== value;

    if (field === 'authorizeCertIssueDate') {
      const dateOnly = dayjs(value);
      const formattedDate = dateOnly.format('YYYY-MM-DD');
      setNfbsFormData((prevData) => ({
        ...prevData,
        [field]: formattedDate,
        changesMade
      }));
    } else {
      setNfbsFormData((prevData) => ({
        ...prevData,
        [field]: value,
        changesMade
      }));
    }

    validateForm(field, value, 1, 3);
  };

  const currentYear = new Date().getFullYear();
  const startYear = 1980;

  const years = Array.from({ length: currentYear - startYear + 1 }, (_, index) => currentYear - index);

  const [getAllDisability, setAllDisability] = useState([]);

  const getGithubData = async () => {
    try {
      const response = await axiosInstance.get('/master-management/findAllDisabilityDetail');
      return response.data;
    } catch (error) {
      console.error('Error fetching data:', error);
      throw error;
    }
  };

  useEffect(() => {
    if (formData.disabilityCode) {
      const initialDisabilityPercent = getDisabilityType(formData.disabilityCode);
      setFormData((prevFormData) => ({
        ...prevFormData,
        disabilityPercent: initialDisabilityPercent
      }));

      setFormErrors((prevErrors) => ({
        ...prevErrors,
        disabilityPercent: ''
      }));
    }

    if (formData.disabilityCode1) {
      const initialDisabilityPercent1 = getDisabilityType(formData.disabilityCode1);
      setFormData((prevFormData) => ({
        ...prevFormData,
        disabilityPercent1: initialDisabilityPercent1
      }));
    }
  }, [formData.disabilityCode, formData.disabilityCode1]);

  useEffect(() => {
    if (formData.disabilityStatus === 'N') {
      setFormData((prevFormData) => ({
        ...prevFormData,
        disabilityCode: null,
        disabilityCode1: null,
        disabilityPercent: null,
        disabilityPercent1: null
      }));
    }
  }, [formData.disabilityStatus]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const allDisabilityData = await getGithubData();
        setAllDisability(allDisabilityData);

        const storedData = localStorage.getItem('applicationNo');
        if (storedData) {
          const parsedData = JSON.parse(storedData);
          setParsedData(parsedData);

          const response = await axiosInstance.get(`/beneficiaryRegistration/findPensionerOtherDetailsByApplicationNo/${parsedData}`);
          const beneficiaryData = response.data;

          try {
            if (beneficiaryData.schemeCode === 'NFBS') {
              const nfbsResponse = await axiosInstance.get(`/beneficiaryRegistration/findNfbsMasterDetailsByApplicationNo/${parsedData}`);

              const nfbsData = nfbsResponse.data;

              if (nfbsData.authorizeCertIssueDate) {
                const dateAdapter = new AdapterDayjs();
                const parsedDate = dayjs(nfbsData.authorizeCertIssueDate);
                nfbsData.authorizeCertIssueDate = dateAdapter.date(parsedDate);
              }

              setNfbsFormData((prevData) => ({
                ...prevData,
                ...nfbsData,
                authCertFile: nfbsData.authorizeCertPhoto !== null ? nfbsData.authorizeCertPhoto : null
              }));

              console.log('nfbsData', nfbsData);
            }
          } catch (error) {
            console.error('Error fetching data:', error);
          }
          setBplFormCompleted(true);

          if (beneficiaryData.sanctionDate) {
            const dateAdapter = new AdapterDayjs();
            const dateComponents = beneficiaryData.sanctionDate.split('-');
            const rearrangedDate = `${dateComponents[1]}-${dateComponents[0]}-${dateComponents[2]}`;
            beneficiaryData.sanctionDate = dateAdapter.date(rearrangedDate);
          }

          if (beneficiaryData.applicationDate) {
            const dateAdapter = new AdapterDayjs();
            const dateComponents = beneficiaryData.applicationDate.split('-');
            const rearrangedDate = `${dateComponents[1]}-${dateComponents[0]}-${dateComponents[2]}`;
            beneficiaryData.applicationDate = dateAdapter.date(rearrangedDate);
          }

          if (beneficiaryData.ageCertIssueDate) {
            const dateAdapter = new AdapterDayjs();
            const dateComponents = beneficiaryData.ageCertIssueDate.split('-');
            const rearrangedDate = `${dateComponents[1]}-${dateComponents[0]}-${dateComponents[2]}`;
            beneficiaryData.ageCertIssueDate = dateAdapter.date(rearrangedDate);
          }

          if (beneficiaryData.incCertIssueDate) {
            const dateAdapter = new AdapterDayjs();
            const dateComponents = beneficiaryData.incCertIssueDate.split('-');
            const rearrangedDate = `${dateComponents[1]}-${dateComponents[0]}-${dateComponents[2]}`;
            beneficiaryData.incCertIssueDate = dateAdapter.date(rearrangedDate);
          }

          if (beneficiaryData.resCertIssueDate) {
            const dateAdapter = new AdapterDayjs();
            const dateComponents = beneficiaryData.resCertIssueDate.split('-');
            const rearrangedDate = `${dateComponents[1]}-${dateComponents[0]}-${dateComponents[2]}`;
            beneficiaryData.resCertIssueDate = dateAdapter.date(rearrangedDate);
          }

          if (beneficiaryData.disCertIssueDate) {
            const dateAdapter = new AdapterDayjs();
            const dateComponents = beneficiaryData.disCertIssueDate.split('-');
            const rearrangedDate = `${dateComponents[1]}-${dateComponents[0]}-${dateComponents[2]}`;
            beneficiaryData.disCertIssueDate = dateAdapter.date(rearrangedDate);
          }

          if (beneficiaryData.deathCertIssueDate) {
            const dateAdapter = new AdapterDayjs();
            const dateComponents = beneficiaryData.deathCertIssueDate.split('-');
            const rearrangedDate = `${dateComponents[1]}-${dateComponents[0]}-${dateComponents[2]}`;
            beneficiaryData.deathCertIssueDate = dateAdapter.date(rearrangedDate);
          }

          if (beneficiaryData.bankCertIssueDate) {
            const dateAdapter = new AdapterDayjs();
            const dateComponents = beneficiaryData.bankCertIssueDate.split('-');
            const rearrangedDate = `${dateComponents[1]}-${dateComponents[0]}-${dateComponents[2]}`;
            beneficiaryData.bankCertIssueDate = dateAdapter.date(rearrangedDate);
          }

          if (beneficiaryData.disbursementUptoCenter) {
            const dateAdapter = new AdapterDayjs();
            const dateComponents = beneficiaryData.disbursementUptoCenter.split('-');
            const rearrangedDate = `${dateComponents[1]}-${dateComponents[0]}-${dateComponents[2]}`;
            beneficiaryData.disbursementUptoCenter = dateAdapter.date(rearrangedDate);
          }

          if (beneficiaryData.pensionEffectiveFromDate) {
            const dateAdapter = new AdapterDayjs();
            const dateComponents = beneficiaryData.pensionEffectiveFromDate.split('-');
            const rearrangedDate = `${dateComponents[1]}-${dateComponents[0]}-${dateComponents[2]}`;
            beneficiaryData.pensionEffectiveFromDate = dateAdapter.date(rearrangedDate);
          }

          setFormData((prevData) => ({
            ...prevData,
            ...beneficiaryData,
            ageFile: beneficiaryData.ageCertificatePhoto !== null ? beneficiaryData.ageCertificatePhoto : null,
            incomeFile: beneficiaryData.incomeCertificatePhoto !== null ? beneficiaryData.incomeCertificatePhoto : null,
            residenceFile: beneficiaryData.resCertificatePhoto !== null ? beneficiaryData.resCertificatePhoto : null,
            disabilityFile: beneficiaryData.disabilityCertificatePhoto !== null ? beneficiaryData.disabilityCertificatePhoto : null,
            deathFile: beneficiaryData.deatCertificatePhoto !== null ? beneficiaryData.deatCertificatePhoto : null,
            bankFile: beneficiaryData.bankCertificatePhoto !== null ? beneficiaryData.bankCertificatePhoto : null,
            beneficiaryPhotoFile: beneficiaryData.beneficiaryPhoto !== null ? beneficiaryData.beneficiaryPhoto : null
          }));
        }

        setLoading(false);
      } catch (error) {
        if (error.response && error.response.data.message) {
          console.log(error.response.data.message);
        } else {
          console.error('Error fetching data:', error);
        }
        setBplFormCompleted(false);
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

  if (!formData.applicationDate) {
    setFormData((prevData) => ({
      ...prevData,
      applicationDate: currentDate
    }));
  }

  const storedData = localStorage.getItem('applicationNo');
  let applicationNoFromLocalStorage;
  if (storedData) {
    applicationNoFromLocalStorage = JSON.parse(storedData);
  }

  const storedData1 = localStorage.getItem('statusOfBeneficiary');
  let statusOfBeneficiary;
  if (storedData1) {
    statusOfBeneficiary = JSON.parse(storedData1);
  }

  const handleFileChange = (e, fileType) => {
    const file = e.target.files[0];
    if (file) {
      const newFormData = { ...formData };
      const newFormErrors = { ...formErrors };
      const changesMade = newFormData[fileType] !== file;
      if (fileType === 'ageFile') {
        newFormData.ageFile = file;
        setFileDownload(false);
      } else if (fileType === 'incomeFile') {
        newFormData.incomeFile = file;
        setFileDownload(false);
      } else if (fileType === 'residenceFile') {
        newFormData.residenceFile = file;
        setFileDownload(false);
      } else if (fileType === 'disabilityFile') {
        newFormData.disabilityFile = file;
        setFileDownload(false);
      } else if (fileType === 'deathFile') {
        newFormData.deathFile = file;
        setFileDownload(false);
      } else if (fileType === 'bankFile') {
        newFormData.bankFile = file;
        setFileDownload(false);
      } else if (fileType === 'beneficiaryPhotoFile') {
        newFormData.beneficiaryPhotoFile = file;
        setFileDownload(false);
      }

      delete newFormErrors[fileType];
      newFormData[fileType] = file;
      setFormData((prevData) => ({
        ...prevData,
        ...newFormData,
        changesMade
      }));
      setFormErrors(newFormErrors);
    }
  };

  const handleFileChangeNfbs = (e, fileType) => {
    const file = e.target.files[0];
    if (file) {
      const newFormData = { ...nfbsFormData };
      const newFormErrors = { ...formErrors };

      const changesMade = newFormData[fileType] !== file;
      if (fileType === 'authCertFile') {
        newFormData.authCertFile = file;
        setFileDownload(false);
      }

      delete newFormErrors[fileType];
      newFormData[fileType] = file;
      setNfbsFormData((prevData) => ({
        ...prevData,
        ...newFormData,
        changesMade
      }));
      setFormErrors(newFormErrors);
    }
  };

  const handleClearDate = (field) => {
    if (field === 'ageCertIssueDate') {
      setFormData({ ...formData, ageCertIssueDate: null });
    } else if (field === 'incCertIssueDate') {
      setFormData({ ...formData, incCertIssueDate: null });
    } else if (field === 'resCertIssueDate') {
      setFormData({ ...formData, resCertIssueDate: null });
    } else if (field === 'disCertIssueDate') {
      setFormData({ ...formData, disCertIssueDate: null });
    } else if (field === 'deathCertIssueDate') {
      setFormData({ ...formData, deathCertIssueDate: null });
    } else if (field === 'bankCertIssueDate') {
      setFormData({ ...formData, bankCertIssueDate: null });
    }
  };

  const handleClearNfbsDate = (field) => {
    if (field === 'authorizeCertIssueDate') {
      setNfbsFormData({ ...nfbsFormData, authorizeCertIssueDate: null });
    }
  };

  const handleClearFile = (field) => {
    if (field === 'ageFile') {
      setFormData({ ...formData, ageFile: null });
    } else if (field === 'incomeFile') {
      setFormData({ ...formData, incomeFile: null });
    } else if (field === 'residenceFile') {
      setFormData({ ...formData, residenceFile: null });
    } else if (field === 'disabilityFile') {
      setFormData({ ...formData, disabilityFile: null });
    } else if (field === 'deathFile') {
      setFormData({ ...formData, deathFile: null });
    } else if (field === 'bankFile') {
      setFormData({ ...formData, bankFile: null });
    } else if (field === 'beneficiaryPhotoFile') {
      setFormData({ ...formData, beneficiaryPhotoFile: null });
    }
  };

  const handleClearNfbsFile = (field) => {
    if (field === 'authCertFile') {
      setNfbsFormData({ ...nfbsFormData, authCertFile: null });
    }
  };

  const handleDownload = (filename) => {
    const token = getAuthToken();
    fetch(`${apiBaseUrl}/beneficiaryRegistration/downloadFile/${filename}/${parsedData}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        userInfo: JSON.stringify(userinfoHeader)
      }
    })
      .then((response) => {
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
      });
  };

  const handleNfbsDownload = (filename) => {
    const token = getAuthToken();
    fetch(`${apiBaseUrl}/beneficiaryRegistration/downloadNfbsFile/${filename}/${parsedData}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        userInfo: JSON.stringify(userinfoHeader)
      }
    })
      .then((response) => {
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
      });
  };

  let schemeCode;
  schemeCode = localStorage.getItem('schemeCode');

  return (
    <>
      <div>
        <h2>BPL Details</h2>
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
            <FormControl fullWidth className={formErrors.bplYear ? 'error' : ''}>
              <InputLabel id="demo-simple-select-label">
                Year&nbsp;<span style={{ color: 'red' }}>*</span>
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                label="Year"
                name="bplYear"
                value={formData.bplYear || ''}
                onChange={(e) => handleChange('bplYear', e.target.value)}
                error={formErrors.bplYear && true}
              >
                {years.map((year) => (
                  <MenuItem key={year} value={year}>
                    {year}
                  </MenuItem>
                ))}
              </Select>
              {formErrors.bplYear && (
                <FormHelperText>
                  <Typography style={{ color: 'red', fontSize: '0.8rem' }}>{formErrors.bplYear}</Typography>
                </FormHelperText>
              )}
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth className={formErrors.bplLocation ? 'error' : ''}>
              <TextField
                label={
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <span style={{ marginRight: '4px' }}>Location</span>
                    <Typography style={{ color: 'red' }}>*</Typography>
                  </div>
                }
                name="bplLocation"
                placeholder="Enter Location"
                variant="outlined"
                fullWidth
                value={formData.bplLocation}
                inputProps={{ maxLength: 20 }}
                onChange={(e) => handleChange('bplLocation', e.target.value.toUpperCase())}
                error={formErrors.bplLocation && true}
              />
              {formErrors.bplLocation && (
                <FormHelperText>
                  <Typography style={{ color: 'red', fontSize: '0.8rem' }}>{formErrors.bplLocation}</Typography>
                </FormHelperText>
              )}
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth className={formErrors.bplFamilyId ? 'error' : ''}>
              <TextField
                label={
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <span style={{ marginRight: '4px' }}>Family Id No</span>
                    <Typography style={{ color: 'red' }}>*</Typography>
                  </div>
                }
                name="bplFamilyId"
                placeholder="Enter Family Id No"
                variant="outlined"
                fullWidth
                value={formData.bplFamilyId}
                inputProps={{ maxLength: 20 }}
                onChange={(e) => handleChange('bplFamilyId', e.target.value)}
                error={formErrors.bplFamilyId && true}
              />
              {formErrors.bplFamilyId && (
                <FormHelperText>
                  <Typography style={{ color: 'red', fontSize: '0.8rem' }}>{formErrors.bplFamilyId}</Typography>
                </FormHelperText>
              )}
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth className={formErrors.bplMemberId ? 'error' : ''}>
              <TextField
                label={
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <span style={{ marginRight: '4px' }}>Member Id</span>
                    <Typography style={{ color: 'red' }}>*</Typography>
                  </div>
                }
                name="bplMemberId"
                placeholder="Enter Member Id"
                variant="outlined"
                fullWidth
                value={formData.bplMemberId}
                inputProps={{ maxLength: 10 }}
                onChange={(e) => handleChange('bplMemberId', e.target.value)}
                error={formErrors.bplMemberId && true}
              />
              {formErrors.bplMemberId && (
                <FormHelperText>
                  <Typography style={{ color: 'red', fontSize: '0.8rem' }}>{formErrors.bplMemberId}</Typography>
                </FormHelperText>
              )}
            </FormControl>
          </Grid>
        </Grid>
        {schemeCode === 'NFBS' && (
          <>
            <h2>BPL Details (Deceased)</h2>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth className={formErrors.bplYearNfbs ? 'error' : ''}>
                  <InputLabel id="demo-simple-select-label">
                    Year&nbsp;<span style={{ color: 'red' }}>*</span>
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    label="Year"
                    name="bplYearNfbs"
                    value={nfbsFormData.bplYearNfbs || ''}
                    onChange={(e) => handleChangeNfbs('bplYearNfbs', e.target.value)}
                    error={formErrors.bplYearNfbs && true}
                  >
                    {years.map((year) => (
                      <MenuItem key={year} value={year}>
                        {year}
                      </MenuItem>
                    ))}
                  </Select>
                  {formErrors.bplYearNfbs && (
                    <FormHelperText>
                      <Typography style={{ color: 'red', fontSize: '0.8rem' }}>{formErrors.bplYearNfbs}</Typography>
                    </FormHelperText>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth className={formErrors.bplLocationNfbs ? 'error' : ''}>
                  <TextField
                    label={
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <span style={{ marginRight: '4px' }}>Location</span>
                        <Typography style={{ color: 'red' }}>*</Typography>
                      </div>
                    }
                    name="bplLocationNfbs"
                    placeholder="Enter Location"
                    variant="outlined"
                    fullWidth
                    value={nfbsFormData.bplLocationNfbs}
                    inputProps={{ maxLength: 20 }}
                    onChange={(e) => handleChangeNfbs('bplLocationNfbs', e.target.value.toUpperCase())}
                    error={formErrors.bplLocationNfbs && true}
                  />
                  {formErrors.bplLocationNfbs && (
                    <FormHelperText>
                      <Typography style={{ color: 'red', fontSize: '0.8rem' }}>{formErrors.bplLocationNfbs}</Typography>
                    </FormHelperText>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth className={formErrors.bplFamilyIdNfbs ? 'error' : ''}>
                  <TextField
                    label={
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <span style={{ marginRight: '4px' }}>Family Id No</span>
                        <Typography style={{ color: 'red' }}>*</Typography>
                      </div>
                    }
                    name="bplFamilyIdNfbs"
                    placeholder="Enter Family Id No"
                    variant="outlined"
                    fullWidth
                    value={nfbsFormData.bplFamilyIdNfbs}
                    inputProps={{ maxLength: 20 }}
                    onChange={(e) => handleChangeNfbs('bplFamilyIdNfbs', e.target.value)}
                    error={formErrors.bplFamilyIdNfbs && true}
                  />
                  {formErrors.bplFamilyIdNfbs && (
                    <FormHelperText>
                      <Typography style={{ color: 'red', fontSize: '0.8rem' }}>{formErrors.bplFamilyIdNfbs}</Typography>
                    </FormHelperText>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth className={formErrors.bplMemberIdNfbs ? 'error' : ''}>
                  <TextField
                    label={
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <span style={{ marginRight: '4px' }}>Member Id</span>
                        <Typography style={{ color: 'red' }}>*</Typography>
                      </div>
                    }
                    name="bplMemberIdNfbs"
                    placeholder="Enter Member Id"
                    variant="outlined"
                    fullWidth
                    value={nfbsFormData.bplMemberIdNfbs}
                    inputProps={{ maxLength: 10 }}
                    onChange={(e) => handleChangeNfbs('bplMemberIdNfbs', e.target.value)}
                    error={formErrors.bplMemberIdNfbs && true}
                  />
                  {formErrors.bplMemberIdNfbs && (
                    <FormHelperText>
                      <Typography style={{ color: 'red', fontSize: '0.8rem' }}>{formErrors.bplMemberIdNfbs}</Typography>
                    </FormHelperText>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth className={formErrors.isAuthorizeCert ? 'error' : ''}>
                  <InputLabel id="demo-simple-select-label">
                    Authorization Certificate Status&nbsp;<span style={{ color: 'red' }}>*</span>
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    label="Authorization Certificate Status"
                    name="isAuthorizeCert"
                    value={nfbsFormData.isAuthorizeCert || ''}
                    onChange={(e) => handleChangeNfbs('isAuthorizeCert', e.target.value)}
                    error={formErrors.isAuthorizeCert && true}
                  >
                    <MenuItem value="Y">Yes</MenuItem>
                    <MenuItem value="N">No</MenuItem>
                  </Select>
                  {formErrors.isAuthorizeCert && (
                    <FormHelperText>
                      <Typography style={{ color: 'red', fontSize: '0.8rem' }}>{formErrors.isAuthorizeCert}</Typography>
                    </FormHelperText>
                  )}
                </FormControl>
              </Grid>

              {nfbsFormData.isAuthorizeCert === 'Y' && (
                <>
                  <Grid item xs={12} sm={4}>
                    <FormControl fullWidth className={formErrors.authorizeCertIssueDate ? 'error' : ''}>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                          label="Date of Issue"
                          format="DD-MM-YYYY"
                          disableFuture
                          name="authorizeCertIssueDate"
                          slotProps={{ textField: { fullWidth: true } }}
                          variant="outlined"
                          value={nfbsFormData.authorizeCertIssueDate}
                          onChange={(selectedDate) => handleChangeNfbs('authorizeCertIssueDate', selectedDate)}
                          error={formErrors.authorizeCertIssueDate && true}
                        ></DatePicker>
                      </LocalizationProvider>
                      {nfbsFormData.authorizeCertIssueDate && (
                        <ClearIcon
                          onClick={() => handleClearNfbsDate('authorizeCertIssueDate')}
                          style={{
                            cursor: 'pointer',
                            position: 'absolute',
                            right: '28px',
                            top: '50%',
                            transform: 'translateY(-50%)'
                          }}
                        />
                      )}
                      {formErrors.authorizeCertIssueDate && (
                        <FormHelperText>
                          <Typography style={{ color: 'red', fontSize: '0.8rem' }}>{formErrors.authorizeCertIssueDate}</Typography>
                        </FormHelperText>
                      )}
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} sm={4}>
                    <FormControl fullWidth className={formErrors.authorizeCertIssueAuth ? 'error' : ''}>
                      <TextField
                        label="Issuing Authority"
                        name="authorizeCertIssueAuth"
                        placeholder="Enter Issuing Authority"
                        variant="outlined"
                        fullWidth
                        value={nfbsFormData.authorizeCertIssueAuth}
                        onChange={(e) => handleChangeNfbs('authorizeCertIssueAuth', e.target.value.toUpperCase())}
                        error={formErrors.authorizeCertIssueAuth && true}
                      />
                      {formErrors.authorizeCertIssueAuth && (
                        <FormHelperText>
                          <Typography style={{ color: 'red', fontSize: '0.8rem' }}>{formErrors.authorizeCertIssueAuth}</Typography>
                        </FormHelperText>
                      )}
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} sm={4}>
                    <FormControl fullWidth className={formErrors.authCertFile ? 'error' : ''}>
                      <TextField
                        label="Upload Authorization Certificate"
                        name="authCertFile"
                        variant="outlined"
                        fullWidth
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <label htmlFor="authCertFileInput">
                                <Button variant="contained" component="span">
                                  Upload
                                </Button>
                              </label>
                              <input
                                type="file"
                                accept=".pdf, .doc, .docx"
                                style={{ display: 'none' }}
                                id="authCertFileInput"
                                name="authCertFile"
                                onChange={(e) => handleFileChangeNfbs(e, 'authCertFile')}
                              />

                              {nfbsFormData.authCertFile && (
                                <ClearIcon
                                  onClick={() => handleClearNfbsFile('authCertFile')}
                                  style={{ cursor: 'pointer', marginLeft: '8px' }}
                                />
                              )}
                              {nfbsFormData.authCertFile && fileDownload && (
                                <p>
                                  <a
                                    href="#"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      handleNfbsDownload(nfbsFormData.authCertFile);
                                    }}
                                    style={{ textDecoration: 'none', color: 'blue' }}
                                  >
                                    <GetAppIcon style={{ verticalAlign: 'middle' }} />
                                  </a>
                                </p>
                              )}
                            </InputAdornment>
                          )
                        }}
                        value={
                          nfbsFormData.authCertFile && nfbsFormData.authCertFile.name
                            ? nfbsFormData.authCertFile.name
                            : nfbsFormData.authCertFile
                            ? nfbsFormData.authCertFile
                            : ''
                        }
                        error={formErrors.authCertFile && true}
                      />
                      {formErrors.authCertFile && (
                        <FormHelperText>
                          <Typography style={{ color: 'red', fontSize: '0.8rem' }}>{formErrors.authCertFile}</Typography>
                        </FormHelperText>
                      )}
                    </FormControl>
                  </Grid>
                </>
              )}
            </Grid>
          </>
        )}
        {schemeCode === 'NFBS' && (
          <>
            <h2>Address (Deceased)</h2>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth className={formErrors.addressNfbs1 ? 'error' : ''}>
                  <TextField
                    label={
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <span style={{ marginRight: '4px' }}>Address1</span>
                        <Typography style={{ color: 'red' }}>*</Typography>
                      </div>
                    }
                    name="addressNfbs1"
                    placeholder="Enter Address1"
                    variant="outlined"
                    fullWidth
                    value={nfbsFormData.addressNfbs1}
                    onChange={(e) => handleChangeNfbs('addressNfbs1', e.target.value)}
                    error={formErrors.addressNfbs1 && true}
                  />
                  {formErrors.addressNfbs1 && (
                    <FormHelperText>
                      <Typography style={{ color: 'red', fontSize: '0.8rem' }}>{formErrors.addressNfbs1}</Typography>
                    </FormHelperText>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth className={formErrors.addressNfbs2 ? 'error' : ''}>
                  <TextField
                    label={
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <span style={{ marginRight: '4px' }}>Address2</span>
                        <Typography style={{ color: 'red' }}>*</Typography>
                      </div>
                    }
                    name="addressNfbs2"
                    placeholder="Enter Address2"
                    variant="outlined"
                    fullWidth
                    value={nfbsFormData.addressNfbs2}
                    onChange={(e) => handleChangeNfbs('addressNfbs2', e.target.value)}
                    error={formErrors.addressNfbs2 && true}
                  />
                  {formErrors.addressNfbs2 && (
                    <FormHelperText>
                      <Typography style={{ color: 'red', fontSize: '0.8rem' }}>{formErrors.addressNfbs2}</Typography>
                    </FormHelperText>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth className={formErrors.addressNfbs3 ? 'error' : ''}>
                  <TextField
                    label="Address3"
                    name="addressNfbs3"
                    placeholder="Enter Address3"
                    variant="outlined"
                    fullWidth
                    value={nfbsFormData.addressNfbs3}
                    onChange={(e) => handleChangeNfbs('addressNfbs3', e.target.value)}
                    error={formErrors.addressNfbs3 && true}
                  />
                  {formErrors.addressNfbs3 && (
                    <FormHelperText>
                      <Typography style={{ color: 'red', fontSize: '0.8rem' }}>{formErrors.addressNfbs3}</Typography>
                    </FormHelperText>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth className={formErrors.pincodeNfbs ? 'error' : ''}>
                  <TextField
                    label={
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <span style={{ marginRight: '4px' }}>Pincode</span>
                        <Typography style={{ color: 'red' }}>*</Typography>
                      </div>
                    }
                    name="pincodeNfbs"
                    placeholder="Enter Pincode"
                    variant="outlined"
                    fullWidth
                    value={nfbsFormData.pincodeNfbs}
                    inputProps={{ maxLength: 6 }}
                    onChange={(e) => handleChangeNfbs('pincodeNfbs', e.target.value)}
                    error={formErrors.pincodeNfbs && true}
                  />
                  {formErrors.pincodeNfbs && (
                    <FormHelperText>
                      <Typography style={{ color: 'red', fontSize: '0.8rem' }}>{formErrors.pincodeNfbs}</Typography>
                    </FormHelperText>
                  )}
                </FormControl>
              </Grid>
            </Grid>
          </>
        )}
        <h2>Disability Details</h2>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth className={formErrors.disabilityStatus ? 'error' : ''}>
              <InputLabel id="demo-simple-select-label">
                Disability Status&nbsp;<span style={{ color: 'red' }}>*</span>
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                label="Disability Status"
                name="disabilityStatus"
                value={formData.disabilityStatus || ''}
                onChange={(e) => handleChange('disabilityStatus', e.target.value)}
                error={formErrors.disabilityStatus && true}
              >
                <MenuItem value="Y">Yes</MenuItem>
                {schemeCode !== 'IGNDPS' && <MenuItem value="N">No</MenuItem>}
              </Select>
              {formErrors.disabilityStatus && (
                <FormHelperText>
                  <Typography style={{ color: 'red', fontSize: '0.8rem' }}>{formErrors.disabilityStatus}</Typography>
                </FormHelperText>
              )}
            </FormControl>
          </Grid>

          {formData.disabilityStatus === 'Y' && (
            <>
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth className={formErrors.disabilityCode ? 'error' : ''}>
                  <InputLabel id="demo-simple-select-label">Disability1</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    label="Disability1"
                    name="disabilityCode"
                    value={formData.disabilityCode}
                    onChange={(e) => handleChange('disabilityCode', e.target.value)}
                    error={formErrors.disabilityCode && true}
                  >
                    {getAllDisability.map((item) => (
                      <MenuItem key={item.disabilityCode} value={item.disabilityCode}>
                        {item.disabilityDesc}{' '}
                      </MenuItem>
                    ))}
                  </Select>

                  {formErrors.disabilityCode && (
                    <FormHelperText>
                      <Typography style={{ color: 'red', fontSize: '0.8rem' }}>{formErrors.disabilityCode}</Typography>
                    </FormHelperText>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth className={formErrors.disabilityPercent ? 'error' : ''}>
                  <TextField
                    label="Disability 1 Percent"
                    name="disabilityPercent"
                    placeholder="Enter Disability 1 Percent"
                    variant="outlined"
                    fullWidth
                    value={getDisabilityType(formData.disabilityCode)}
                    inputProps={{ maxLength: 3 }}
                    onChange={(e) => handleChange('disabilityPercent', e.target.value)}
                    error={formErrors.disabilityPercent && true}
                  />
                  {formErrors.disabilityPercent && (
                    <FormHelperText>
                      <Typography style={{ color: 'red', fontSize: '0.8rem' }}>{formErrors.disabilityPercent}</Typography>
                    </FormHelperText>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">Disability2</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    label="Disability2"
                    name="disabilityCode1"
                    value={formData.disabilityCode1}
                    onChange={(e) => handleChange('disabilityCode1', e.target.value)}
                  >
                    {getAllDisability
                      .filter((item) => item.disabilityCode !== formData.disabilityCode)
                      .map((item) => (
                        <MenuItem key={item.disabilityCode} value={item.disabilityCode}>
                          {item.disabilityDesc}
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth>
                  <TextField
                    label="Disability 2 Percent"
                    name="disabilityPercent1"
                    placeholder="Enter Disability 2 Percent"
                    variant="outlined"
                    fullWidth
                    value={getDisabilityType(formData.disabilityCode1)}
                    inputProps={{ maxLength: 3 }}
                    onChange={(e) => handleChange('disabilityPercent1', e.target.value)}
                  />
                </FormControl>
              </Grid>
            </>
          )}
        </Grid>
        {statusOfBeneficiary === 'LEGACY_SO_SAVED' ? (
          <>
            <h2>Sanction Details</h2>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth className={formErrors.sanctionAuth ? 'error' : ''}>
                  <TextField
                    label="Sanctioning Authority"
                    name="sanctionAuth"
                    placeholder="Enter Sanctioning Authority"
                    variant="outlined"
                    fullWidth
                    value={formData.sanctionAuth}
                    onChange={(e) => handleChange('sanctionAuth', e.target.value)}
                    error={formErrors.sanctionAuth && true}
                  />
                  {formErrors.sanctionAuth && (
                    <FormHelperText>
                      <Typography style={{ color: 'red', fontSize: '0.8rem' }}>{formErrors.sanctionAuth}</Typography>
                    </FormHelperText>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth className={formErrors.sanctionDate ? 'error' : ''}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      label="Sanction Date"
                      format="DD-MM-YYYY"
                      disableFuture
                      name="sanctionDate"
                      slotProps={{ textField: { fullWidth: true } }}
                      variant="outlined"
                      value={formData.sanctionDate}
                      onChange={(selectedDate) => handleChange('sanctionDate', selectedDate)}
                      error={formErrors.sanctionDate ? true : false}
                    />
                  </LocalizationProvider>
                  {formErrors.sanctionDate && (
                    <FormHelperText>
                      <Typography style={{ color: 'red', fontSize: '0.8rem' }}>{formErrors.sanctionDate}</Typography>
                    </FormHelperText>
                  )}
                </FormControl>
              </Grid>
              {formData.sanctionDate && (
                <>
                  <Grid item xs={12} sm={4}>
                    <FormControl fullWidth>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                          label="Disbursement Upto"
                          format="DD-MM-YYYY"
                          disableFuture
                          name="disbursementUptoCenter"
                          slotProps={{ textField: { fullWidth: true } }}
                          variant="outlined"
                          value={formData.disbursementUptoCenter}
                          onChange={(selectedDate) => handleChange('disbursementUptoCenter', selectedDate)}
                          readOnly
                        />
                      </LocalizationProvider>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <FormControl fullWidth className={formErrors.pensionEffectiveFromDate ? 'error' : ''}>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                          label="Pension Effective"
                          format="DD-MM-YYYY"
                          disableFuture
                          name="pensionEffectiveFromDate"
                          slotProps={{ textField: { fullWidth: true } }}
                          variant="outlined"
                          value={formData.pensionEffectiveFromDate}
                          onChange={(selectedDate) => handleChange('pensionEffectiveFromDate', selectedDate)}
                          error={formErrors.pensionEffectiveFromDate ? true : false}
                        />
                      </LocalizationProvider>
                      {formErrors.pensionEffectiveFromDate && (
                        <FormHelperText>
                          <Typography style={{ color: 'red', fontSize: '0.8rem' }}>{formErrors.pensionEffectiveFromDate}</Typography>
                        </FormHelperText>
                      )}
                    </FormControl>
                  </Grid>
                </>
              )}
            </Grid>
          </>
        ) : null}
        <h2>Other Details</h2>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth className={formErrors.address1 ? 'error' : ''}>
              <TextField
                label={
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <span style={{ marginRight: '4px' }}>Address1</span>
                    <Typography style={{ color: 'red' }}>*</Typography>
                  </div>
                }
                name="address1"
                placeholder="Enter Address1"
                variant="outlined"
                fullWidth
                value={formData.address1}
                onChange={(e) => handleChange('address1', e.target.value)}
                error={formErrors.address1 && true}
              />
              {formErrors.address1 && (
                <FormHelperText>
                  <Typography style={{ color: 'red', fontSize: '0.8rem' }}>{formErrors.address1}</Typography>
                </FormHelperText>
              )}
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth className={formErrors.address2 ? 'error' : ''}>
              <TextField
                label={
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <span style={{ marginRight: '4px' }}>Address2</span>
                    <Typography style={{ color: 'red' }}>*</Typography>
                  </div>
                }
                name="address2"
                placeholder="Enter Address2"
                variant="outlined"
                fullWidth
                value={formData.address2}
                onChange={(e) => handleChange('address2', e.target.value)}
                error={formErrors.address2 && true}
              />
              {formErrors.address2 && (
                <FormHelperText>
                  <Typography style={{ color: 'red', fontSize: '0.8rem' }}>{formErrors.address2}</Typography>
                </FormHelperText>
              )}
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth className={formErrors.address3 ? 'error' : ''}>
              <TextField
                label="Address3"
                name="address3"
                placeholder="Enter Address3"
                variant="outlined"
                fullWidth
                value={formData.address3}
                onChange={(e) => handleChange('address3', e.target.value)}
                error={formErrors.address3 && true}
              />
              {formErrors.address3 && (
                <FormHelperText>
                  <Typography style={{ color: 'red', fontSize: '0.8rem' }}>{formErrors.address3}</Typography>
                </FormHelperText>
              )}
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth className={formErrors.pincode ? 'error' : ''}>
              <TextField
                label={
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <span style={{ marginRight: '4px' }}>Pincode</span>
                    <Typography style={{ color: 'red' }}>*</Typography>
                  </div>
                }
                name="pincode"
                placeholder="Enter Pincode"
                variant="outlined"
                fullWidth
                value={formData.pincode}
                inputProps={{ maxLength: 6 }}
                onChange={(e) => handleChange('pincode', e.target.value)}
                error={formErrors.pincode && true}
              />
              {formErrors.pincode && (
                <FormHelperText>
                  <Typography style={{ color: 'red', fontSize: '0.8rem' }}>{formErrors.pincode}</Typography>
                </FormHelperText>
              )}
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth className={formErrors.annualIncome ? 'error' : ''}>
              <TextField
                label={
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <span style={{ marginRight: '4px' }}>Annual Income</span>
                    <Typography style={{ color: 'red' }}>*</Typography>
                  </div>
                }
                name="annualIncome"
                placeholder="Enter Annual Income "
                variant="outlined"
                fullWidth
                value={formData.annualIncome}
                onChange={(e) => handleChange('annualIncome', e.target.value)}
                error={formErrors.annualIncome && true}
              />
              {formErrors.annualIncome && (
                <FormHelperText>
                  <Typography style={{ color: 'red', fontSize: '0.8rem' }}>{formErrors.annualIncome}</Typography>
                </FormHelperText>
              )}
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth className={formErrors.epicNo ? 'error' : ''}>
              <TextField
                label="EPIC No"
                name="epicNo"
                placeholder="Enter EPIC No "
                variant="outlined"
                fullWidth
                value={formData.epicNo}
                onChange={(e) => handleChange('epicNo', e.target.value)}
                error={formErrors.epicNo && true}
              />
              {formErrors.epicNo && (
                <FormHelperText>
                  <Typography style={{ color: 'red', fontSize: '0.8rem' }}>{formErrors.epicNo}</Typography>
                </FormHelperText>
              )}
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth className={formErrors.rationcardNo ? 'error' : ''}>
              <TextField
                label="Ration Card No"
                name="rationcardNo"
                placeholder="Enter Ration Card No"
                variant="outlined"
                fullWidth
                value={formData.rationcardNo}
                onChange={(e) => handleChange('rationcardNo', e.target.value)}
                error={formErrors.rationcardNo && true}
              />
              {formErrors.rationcardNo && (
                <FormHelperText>
                  <Typography style={{ color: 'red', fontSize: '0.8rem' }}>{formErrors.rationcardNo}</Typography>
                </FormHelperText>
              )}
            </FormControl>
          </Grid>
          {/* <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Minority Status</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                label="Minority Status"
                name="minorityStatus"
                value={formData.minorityStatus || ''}
                onChange={(e) => handleChange('minorityStatus', e.target.value)}
              >
                <MenuItem value="Y">Yes</MenuItem>
                <MenuItem value="N">No</MenuItem>
              </Select>
            </FormControl>
          </Grid> */}
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth className={formErrors.widows ? 'error' : ''}>
              <InputLabel id="demo-simple-select-label">
                Widow {schemeCode === 'IGNWPS' && <span style={{ color: 'red' }}>*</span>}
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                label="Widow"
                name="widows"
                value={formData.widows || ''}
                onChange={(e) => handleChange('widows', e.target.value)}
              >
                <MenuItem value="Y">Yes</MenuItem>
                {schemeCode !== 'IGNWPS' && <MenuItem value="N">No</MenuItem>}
              </Select>
              {formErrors.widows && (
                <FormHelperText>
                  <Typography style={{ color: 'red', fontSize: '0.8rem' }}>{formErrors.widows}</Typography>
                </FormHelperText>
              )}
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Application Date"
                  format="DD-MM-YYYY"
                  disableFuture
                  name="applicationDate"
                  slotProps={{ textField: { fullWidth: true } }}
                  variant="outlined"
                  value={formData.applicationDate}
                  onChange={(selectedDate) => handleChange('applicationDate', selectedDate)}
                />
              </LocalizationProvider>
            </FormControl>
          </Grid>
        </Grid>

        <h2>Certificate Details</h2>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth className={formErrors.ageCertIssueDate ? 'error' : ''}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Age Certificate Issue Date"
                  format="DD-MM-YYYY"
                  disableFuture
                  name="ageCertIssueDate"
                  slotProps={{ textField: { fullWidth: true } }}
                  variant="outlined"
                  value={formData.ageCertIssueDate}
                  onChange={(selectedDate) => handleChange('ageCertIssueDate', selectedDate)}
                  error={formErrors.ageCertIssueDate && true}
                ></DatePicker>
              </LocalizationProvider>
              {formData.ageCertIssueDate && (
                <ClearIcon
                  onClick={() => handleClearDate('ageCertIssueDate')}
                  style={{
                    cursor: 'pointer',
                    position: 'absolute',
                    right: '28px',
                    top: '50%',
                    transform: 'translateY(-50%)'
                  }}
                />
              )}
              {formErrors.ageCertIssueDate && (
                <FormHelperText>
                  <Typography style={{ color: 'red', fontSize: '0.8rem' }}>{formErrors.ageCertIssueDate}</Typography>
                </FormHelperText>
              )}
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={4}>
            <FormControl fullWidth className={formErrors.ageCertIssueAuth ? 'error' : ''}>
              <TextField
                label="Age Certificate Issue Authority"
                name="ageCertIssueAuth"
                placeholder="Enter Sanctioning Authority"
                variant="outlined"
                fullWidth
                value={formData.ageCertIssueAuth}
                onChange={(e) => handleChange('ageCertIssueAuth', e.target.value.toUpperCase())}
                error={formErrors.ageCertIssueAuth && true}
              />
              {formErrors.ageCertIssueAuth && (
                <FormHelperText>
                  <Typography style={{ color: 'red', fontSize: '0.8rem' }}>{formErrors.ageCertIssueAuth}</Typography>
                </FormHelperText>
              )}
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={4}>
            <FormControl fullWidth className={formErrors.ageFile ? 'error' : ''}>
              <TextField
                label="Upload Age Certificate"
                name="ageFile"
                variant="outlined"
                fullWidth
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <label htmlFor="ageFileInput">
                        <Button variant="contained" component="span">
                          Upload
                        </Button>
                      </label>
                      <input
                        type="file"
                        accept=".pdf, .doc, .docx"
                        style={{ display: 'none' }}
                        id="ageFileInput"
                        name="ageFile"
                        onChange={(e) => handleFileChange(e, 'ageFile')}
                      />

                      {formData.ageFile && (
                        <ClearIcon onClick={() => handleClearFile('ageFile')} style={{ cursor: 'pointer', marginLeft: '8px' }} />
                      )}
                      {formData.ageFile && fileDownload && (
                        <p>
                          <a
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              handleDownload(formData.ageFile);
                            }}
                            style={{ textDecoration: 'none', color: 'blue' }}
                          >
                            <GetAppIcon style={{ verticalAlign: 'middle' }} />
                          </a>
                        </p>
                      )}
                    </InputAdornment>
                  )
                }}
                value={formData.ageFile && formData.ageFile.name ? formData.ageFile.name : formData.ageFile ? formData.ageFile : ''}
                error={formErrors.ageFile && true}
              />
              {formErrors.ageFile && (
                <FormHelperText>
                  <Typography style={{ color: 'red', fontSize: '0.8rem' }}>{formErrors.ageFile}</Typography>
                </FormHelperText>
              )}
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={4}>
            <FormControl fullWidth className={formErrors.incCertIssueDate ? 'error' : ''}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Income Certificate Issue Date"
                  format="DD-MM-YYYY"
                  disableFuture
                  name="incCertIssueDate"
                  slotProps={{ textField: { fullWidth: true } }}
                  variant="outlined"
                  value={formData.incCertIssueDate}
                  onChange={(selectedDate) => handleChange('incCertIssueDate', selectedDate)}
                  error={formErrors.incCertIssueDate && true}
                ></DatePicker>
              </LocalizationProvider>
              {formData.incCertIssueDate && (
                <ClearIcon
                  onClick={() => handleClearDate('incCertIssueDate')}
                  style={{
                    cursor: 'pointer',
                    position: 'absolute',
                    right: '28px',
                    top: '50%',
                    transform: 'translateY(-50%)'
                  }}
                />
              )}

              {formErrors.incCertIssueDate && (
                <FormHelperText>
                  <Typography style={{ color: 'red', fontSize: '0.8rem' }}>{formErrors.incCertIssueDate}</Typography>
                </FormHelperText>
              )}
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth className={formErrors.incCertIssueAuth ? 'error' : ''}>
              <TextField
                label="Income Certificate Issue Authority"
                name="incCertIssueAuth"
                placeholder="Enter Sanctioning Authority"
                variant="outlined"
                fullWidth
                value={formData.incCertIssueAuth}
                onChange={(e) => handleChange('incCertIssueAuth', e.target.value.toUpperCase())}
                error={formErrors.incCertIssueAuth && true}
              />
              {formErrors.incCertIssueAuth && (
                <FormHelperText>
                  <Typography style={{ color: 'red', fontSize: '0.8rem' }}>{formErrors.incCertIssueAuth}</Typography>
                </FormHelperText>
              )}
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth className={formErrors.incomeFile ? 'error' : ''}>
              <TextField
                label="Upload Income Certificate"
                name="incomeFile"
                variant="outlined"
                fullWidth
                InputProps={{
                  readOnly: true,
                  endAdornment: (
                    <InputAdornment position="end">
                      <label htmlFor="incomeFileInput">
                        <Button variant="contained" component="span">
                          Upload
                        </Button>
                      </label>
                      <input
                        type="file"
                        accept=".pdf, .doc, .docx"
                        style={{ display: 'none' }}
                        id="incomeFileInput"
                        name="incomeFile"
                        onChange={(e) => handleFileChange(e, 'incomeFile')}
                      />
                      {formData.incomeFile && (
                        <ClearIcon onClick={() => handleClearFile('incomeFile')} style={{ cursor: 'pointer', marginLeft: '8px' }} />
                      )}

                      {formData.incomeFile && fileDownload && (
                        <p>
                          <a
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              handleDownload(formData.incomeFile);
                            }}
                            style={{ textDecoration: 'none', color: 'blue' }}
                          >
                            <GetAppIcon style={{ verticalAlign: 'middle' }} />
                          </a>
                        </p>
                      )}
                    </InputAdornment>
                  )
                }}
                value={
                  formData.incomeFile && formData.incomeFile.name
                    ? formData.incomeFile.name
                    : formData.incomeFile
                    ? formData.incomeFile
                    : ''
                }
                error={formErrors.incomeFile && true}
              />
              {formErrors.incomeFile && (
                <FormHelperText>
                  <Typography style={{ color: 'red', fontSize: '0.8rem' }}>{formErrors.incomeFile}</Typography>
                </FormHelperText>
              )}
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={4}>
            <FormControl fullWidth className={formErrors.resCertIssueDate ? 'error' : ''}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Residence Certificate Issue Date"
                  format="DD-MM-YYYY"
                  disableFuture
                  name="resCertIssueDate"
                  slotProps={{ textField: { fullWidth: true } }}
                  variant="outlined"
                  value={formData.resCertIssueDate}
                  onChange={(selectedDate) => handleChange('resCertIssueDate', selectedDate)}
                  error={formErrors.resCertIssueDate && true}
                ></DatePicker>
              </LocalizationProvider>
              {formData.resCertIssueDate && (
                <ClearIcon
                  onClick={() => handleClearDate('resCertIssueDate')}
                  style={{
                    cursor: 'pointer',
                    position: 'absolute',
                    right: '28px',
                    top: '50%',
                    transform: 'translateY(-50%)'
                  }}
                />
              )}
              {formErrors.resCertIssueDate && (
                <FormHelperText>
                  <Typography style={{ color: 'red', fontSize: '0.8rem' }}>{formErrors.resCertIssueDate}</Typography>
                </FormHelperText>
              )}
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth className={formErrors.resCertIssueAuth ? 'error' : ''}>
              <TextField
                label="Residence Certificate Issue Authority"
                name="resCertIssueAuth"
                placeholder="Enter Sanctioning Authority"
                variant="outlined"
                fullWidth
                value={formData.resCertIssueAuth}
                onChange={(e) => handleChange('resCertIssueAuth', e.target.value.toUpperCase())}
                error={formErrors.resCertIssueAuth && true}
              />
              {formErrors.resCertIssueAuth && (
                <FormHelperText>
                  <Typography style={{ color: 'red', fontSize: '0.8rem' }}>{formErrors.resCertIssueAuth}</Typography>
                </FormHelperText>
              )}
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth className={formErrors.residenceFile ? 'error' : ''}>
              <TextField
                label="Upload Residence Certificate"
                name="residenceFile"
                variant="outlined"
                fullWidth
                InputProps={{
                  readOnly: true,
                  endAdornment: (
                    <InputAdornment position="end">
                      <label htmlFor="residenceFileInput">
                        <Button variant="contained" component="span">
                          Upload
                        </Button>
                      </label>
                      <input
                        type="file"
                        accept=".pdf, .doc, .docx"
                        style={{ display: 'none' }}
                        id="residenceFileInput"
                        name="residenceFile"
                        onChange={(e) => handleFileChange(e, 'residenceFile')}
                      />
                      {formData.residenceFile && (
                        <ClearIcon onClick={() => handleClearFile('residenceFile')} style={{ cursor: 'pointer', marginLeft: '8px' }} />
                      )}
                      {formData.residenceFile && fileDownload && (
                        <p>
                          <a
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              handleDownload(formData.residenceFile);
                            }}
                            style={{ textDecoration: 'none', color: 'blue' }}
                          >
                            <GetAppIcon style={{ verticalAlign: 'middle' }} />
                          </a>
                        </p>
                      )}
                    </InputAdornment>
                  )
                }}
                value={
                  formData.residenceFile && formData.residenceFile.name
                    ? formData.residenceFile.name
                    : formData.residenceFile
                    ? formData.residenceFile
                    : ''
                }
                error={formErrors.residenceFile && true}
              />
              {formErrors.residenceFile && (
                <FormHelperText>
                  <Typography style={{ color: 'red', fontSize: '0.8rem' }}>{formErrors.residenceFile}</Typography>
                </FormHelperText>
              )}
            </FormControl>
          </Grid>
          {schemeCode === 'IGNDPS' && (
            <>
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth className={formErrors.disCertIssueDate ? 'error' : ''}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      label="Disability Certificate Issue Date"
                      format="DD-MM-YYYY"
                      disableFuture
                      name="disCertIssueDate"
                      slotProps={{ textField: { fullWidth: true } }}
                      variant="outlined"
                      value={formData.disCertIssueDate}
                      onChange={(selectedDate) => handleChange('disCertIssueDate', selectedDate)}
                      error={formErrors.disCertIssueDate && true}
                    ></DatePicker>
                  </LocalizationProvider>
                  {formData.disCertIssueDate && (
                    <ClearIcon
                      onClick={() => handleClearDate('disCertIssueDate')}
                      style={{
                        cursor: 'pointer',
                        position: 'absolute',
                        right: '28px',
                        top: '50%',
                        transform: 'translateY(-50%)'
                      }}
                    />
                  )}
                  {formErrors.disCertIssueDate && (
                    <FormHelperText>
                      <Typography style={{ color: 'red', fontSize: '0.8rem' }}>{formErrors.disCertIssueDate}</Typography>
                    </FormHelperText>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth className={formErrors.disCertIssueAuth ? 'error' : ''}>
                  <TextField
                    label="Disability Certificate Issue Authority"
                    name="disCertIssueAuth"
                    placeholder="Enter Sanctioning Authority"
                    variant="outlined"
                    fullWidth
                    value={formData.disCertIssueAuth}
                    onChange={(e) => handleChange('disCertIssueAuth', e.target.value.toUpperCase())}
                    error={formErrors.disCertIssueAuth && true}
                  />
                  {formErrors.disCertIssueAuth && (
                    <FormHelperText>
                      <Typography style={{ color: 'red', fontSize: '0.8rem' }}>{formErrors.disCertIssueAuth}</Typography>
                    </FormHelperText>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth className={formErrors.disabilityFile ? 'error' : ''}>
                  <TextField
                    label="Upload Disability Certificate"
                    name="disabilityFile"
                    variant="outlined"
                    fullWidth
                    InputProps={{
                      readOnly: true,
                      endAdornment: (
                        <InputAdornment position="end">
                          <label htmlFor="disabilityFileInput">
                            <Button variant="contained" component="span">
                              Upload
                            </Button>
                          </label>
                          <input
                            type="file"
                            accept=".pdf, .doc, .docx"
                            style={{ display: 'none' }}
                            id="disabilityFileInput"
                            name="disabilityFile"
                            onChange={(e) => handleFileChange(e, 'disabilityFile')}
                          />
                          {formData.disabilityFile && (
                            <ClearIcon onClick={() => handleClearFile('disabilityFile')} style={{ cursor: 'pointer', marginLeft: '8px' }} />
                          )}{' '}
                          {formData.disabilityFile && fileDownload && (
                            <p>
                              <a
                                href="#"
                                onClick={(e) => {
                                  e.preventDefault();
                                  handleDownload(formData.disabilityFile);
                                }}
                                style={{ textDecoration: 'none', color: 'blue' }}
                              >
                                <GetAppIcon style={{ verticalAlign: 'middle' }} />
                              </a>
                            </p>
                          )}
                        </InputAdornment>
                      )
                    }}
                    value={
                      formData.disabilityFile && formData.disabilityFile.name
                        ? formData.disabilityFile.name
                        : formData.disabilityFile
                        ? formData.disabilityFile
                        : ''
                    }
                    error={formErrors.disabilityFile && true}
                  />
                  {formErrors.disabilityFile && (
                    <FormHelperText>
                      <Typography style={{ color: 'red', fontSize: '0.8rem' }}>{formErrors.disabilityFile}</Typography>
                    </FormHelperText>
                  )}
                </FormControl>
              </Grid>
            </>
          )}
          {/* ------------IGNWPS--------------- */}
          {schemeCode === 'IGNWPS' && (
            <>
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth className={formErrors.deathCertIssueDate ? 'error' : ''}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      label="Husband's Death  Certificate Issue Date"
                      format="DD-MM-YYYY"
                      disableFuture
                      name="deathCertIssueDate"
                      slotProps={{ textField: { fullWidth: true } }}
                      variant="outlined"
                      value={formData.deathCertIssueDate}
                      onChange={(selectedDate) => handleChange('deathCertIssueDate', selectedDate)}
                      error={formErrors.deathCertIssueDate && true}
                    ></DatePicker>
                  </LocalizationProvider>
                  {formData.deathCertIssueDate && (
                    <ClearIcon
                      onClick={() => handleClearDate('deathCertIssueDate')}
                      style={{
                        cursor: 'pointer',
                        position: 'absolute',
                        right: '28px',
                        top: '50%',
                        transform: 'translateY(-50%)'
                      }}
                    />
                  )}
                  {formErrors.deathCertIssueDate && (
                    <FormHelperText>
                      <Typography style={{ color: 'red', fontSize: '0.8rem' }}>{formErrors.deathCertIssueDate}</Typography>
                    </FormHelperText>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth className={formErrors.deathCertIssueAuth ? 'error' : ''}>
                  <TextField
                    label="Husband's Death Certificate Issue Authority"
                    name="deathCertIssueAuth"
                    placeholder="Enter Sanctioning Authority"
                    variant="outlined"
                    fullWidth
                    value={formData.deathCertIssueAuth}
                    onChange={(e) => handleChange('deathCertIssueAuth', e.target.value.toUpperCase())}
                    error={formErrors.deathCertIssueAuth && true}
                  />
                  {formErrors.deathCertIssueAuth && (
                    <FormHelperText>
                      <Typography style={{ color: 'red', fontSize: '0.8rem' }}>{formErrors.deathCertIssueAuth}</Typography>
                    </FormHelperText>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth className={formErrors.deathFile ? 'error' : ''}>
                  <TextField
                    label="Upload Husband's Death Certificate"
                    name="deathFile"
                    variant="outlined"
                    fullWidth
                    InputProps={{
                      readOnly: true,
                      endAdornment: (
                        <InputAdornment position="end">
                          <label htmlFor="deathFileInput">
                            <Button variant="contained" component="span">
                              Upload
                            </Button>
                          </label>
                          <input
                            type="file"
                            accept=".pdf, .doc, .docx"
                            style={{ display: 'none' }}
                            id="deathFileInput"
                            name="deathFile"
                            onChange={(e) => handleFileChange(e, 'deathFile')}
                          />
                          {formData.deathFile && (
                            <ClearIcon onClick={() => handleClearFile('deathFile')} style={{ cursor: 'pointer', marginLeft: '8px' }} />
                          )}
                          {formData.deathFile && fileDownload && (
                            <p>
                              <a
                                href="#"
                                onClick={(e) => {
                                  e.preventDefault();
                                  handleDownload(formData.deathFile);
                                }}
                                style={{ textDecoration: 'none', color: 'blue' }}
                              >
                                <GetAppIcon style={{ verticalAlign: 'middle' }} />
                              </a>
                            </p>
                          )}
                        </InputAdornment>
                      )
                    }}
                    value={
                      formData.deathFile && formData.deathFile.name ? formData.deathFile.name : formData.deathFile ? formData.deathFile : ''
                    }
                    error={formErrors.deathFile && true}
                  />
                  {formErrors.deathFile && (
                    <FormHelperText>
                      <Typography style={{ color: 'red', fontSize: '0.8rem' }}>{formErrors.deathFile}</Typography>
                    </FormHelperText>
                  )}
                </FormControl>
              </Grid>
            </>
          )}
          {/* ---------NFBS---------------- */}
          {schemeCode === 'NFBS' && (
            <>
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth className={formErrors.deathCertIssueDate ? 'error' : ''}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      label="Deceased's Death  Certificate Issue Date"
                      format="DD-MM-YYYY"
                      disableFuture
                      name="deathCertIssueDate"
                      slotProps={{ textField: { fullWidth: true } }}
                      variant="outlined"
                      value={formData.deathCertIssueDate}
                      onChange={(selectedDate) => handleChange('deathCertIssueDate', selectedDate)}
                      error={formErrors.deathCertIssueDate && true}
                    ></DatePicker>
                  </LocalizationProvider>
                  {formData.deathCertIssueDate && (
                    <ClearIcon
                      onClick={() => handleClearDate('deathCertIssueDate')}
                      style={{
                        cursor: 'pointer',
                        position: 'absolute',
                        right: '28px',
                        top: '50%',
                        transform: 'translateY(-50%)'
                      }}
                    />
                  )}
                  {formErrors.deathCertIssueDate && (
                    <FormHelperText>
                      <Typography style={{ color: 'red', fontSize: '0.8rem' }}>{formErrors.deathCertIssueDate}</Typography>
                    </FormHelperText>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth className={formErrors.deathCertIssueAuth ? 'error' : ''}>
                  <TextField
                    label="Deceased's Death Certificate Issue Authority"
                    name="deathCertIssueAuth"
                    placeholder="Enter Sanctioning Authority"
                    variant="outlined"
                    fullWidth
                    value={formData.deathCertIssueAuth}
                    onChange={(e) => handleChange('deathCertIssueAuth', e.target.value.toUpperCase())}
                    error={formErrors.deathCertIssueAuth && true}
                  />
                  {formErrors.deathCertIssueAuth && (
                    <FormHelperText>
                      <Typography style={{ color: 'red', fontSize: '0.8rem' }}>{formErrors.deathCertIssueAuth}</Typography>
                    </FormHelperText>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth className={formErrors.deathFile ? 'error' : ''}>
                  <TextField
                    label="Upload Deceased's Death Certificate"
                    name="deathFile"
                    variant="outlined"
                    fullWidth
                    InputProps={{
                      readOnly: true,
                      endAdornment: (
                        <InputAdornment position="end">
                          <label htmlFor="deathFileInput">
                            <Button variant="contained" component="span">
                              Upload
                            </Button>
                          </label>
                          <input
                            type="file"
                            accept=".pdf, .doc, .docx"
                            style={{ display: 'none' }}
                            id="deathFileInput"
                            name="deathFile"
                            onChange={(e) => handleFileChange(e, 'deathFile')}
                          />
                          {formData.deathFile && (
                            <ClearIcon onClick={() => handleClearFile('deathFile')} style={{ cursor: 'pointer', marginLeft: '8px' }} />
                          )}
                          {formData.deathFile && fileDownload && (
                            <p>
                              <a
                                href="#"
                                onClick={(e) => {
                                  e.preventDefault();
                                  handleDownload(formData.deathFile);
                                }}
                                style={{ textDecoration: 'none', color: 'blue' }}
                              >
                                <GetAppIcon style={{ verticalAlign: 'middle' }} />
                              </a>
                            </p>
                          )}
                        </InputAdornment>
                      )
                    }}
                    value={
                      formData.deathFile && formData.deathFile.name ? formData.deathFile.name : formData.deathFile ? formData.deathFile : ''
                    }
                    error={formErrors.deathFile && true}
                  />
                  {formErrors.deathFile && (
                    <FormHelperText>
                      <Typography style={{ color: 'red', fontSize: '0.8rem' }}>{formErrors.deathFile}</Typography>
                    </FormHelperText>
                  )}
                </FormControl>
              </Grid>
            </>
          )}
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth className={formErrors.bankCertIssueDate ? 'error' : ''}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Bank Passbook  Issue Date"
                  format="DD-MM-YYYY"
                  disableFuture
                  name="bankCertIssueDate"
                  slotProps={{ textField: { fullWidth: true } }}
                  variant="outlined"
                  value={formData.bankCertIssueDate}
                  onChange={(selectedDate) => handleChange('bankCertIssueDate', selectedDate)}
                  error={formErrors.bankCertIssueDate && true}
                ></DatePicker>
              </LocalizationProvider>
              {formData.bankCertIssueDate && (
                <ClearIcon
                  onClick={() => handleClearDate('bankCertIssueDate')}
                  style={{
                    cursor: 'pointer',
                    position: 'absolute',
                    right: '28px',
                    top: '50%',
                    transform: 'translateY(-50%)'
                  }}
                />
              )}
              {formErrors.bankCertIssueDate && (
                <FormHelperText>
                  <Typography style={{ color: 'red', fontSize: '0.8rem' }}>{formErrors.bankCertIssueDate}</Typography>
                </FormHelperText>
              )}
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={4}>
            <FormControl fullWidth className={formErrors.bankCertIssueAuth ? 'error' : ''}>
              <TextField
                label="Bank Passbook  Issue Authority"
                name="bankCertIssueAuth"
                placeholder="Enter Sanctioning Authority"
                variant="outlined"
                fullWidth
                value={formData.bankCertIssueAuth}
                onChange={(e) => handleChange('bankCertIssueAuth', e.target.value.toUpperCase())}
                error={formErrors.bankCertIssueAuth && true}
              />
              {formErrors.bankCertIssueAuth && (
                <FormHelperText>
                  <Typography style={{ color: 'red', fontSize: '0.8rem' }}>{formErrors.bankCertIssueAuth}</Typography>
                </FormHelperText>
              )}
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth className={formErrors.bankFile ? 'error' : ''}>
              <TextField
                label="Upload Bank Passbook"
                name="bankFile"
                variant="outlined"
                fullWidth
                InputProps={{
                  readOnly: true,
                  endAdornment: (
                    <InputAdornment position="end">
                      <label htmlFor="bankFileInput">
                        <Button variant="contained" component="span">
                          Upload
                        </Button>
                      </label>
                      <input
                        type="file"
                        accept=".pdf, .doc, .docx"
                        style={{ display: 'none' }}
                        id="bankFileInput"
                        name="bankFile"
                        onChange={(e) => handleFileChange(e, 'bankFile')}
                      />
                      {formData.bankFile && (
                        <ClearIcon onClick={() => handleClearFile('bankFile')} style={{ cursor: 'pointer', marginLeft: '8px' }} />
                      )}

                      {formData.bankFile && fileDownload && (
                        <p>
                          <a
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              handleDownload(formData.bankFile);
                            }}
                            style={{ textDecoration: 'none', color: 'blue' }}
                          >
                            <GetAppIcon style={{ verticalAlign: 'middle' }} />
                          </a>
                        </p>
                      )}
                    </InputAdornment>
                  )
                }}
                value={formData.bankFile && formData.bankFile.name ? formData.bankFile.name : formData.bankFile ? formData.bankFile : ''}
                error={formErrors.bankFile && true}
              />
              {formErrors.bankFile && (
                <FormHelperText>
                  <Typography style={{ color: 'red', fontSize: '0.8rem' }}>{formErrors.bankFile}</Typography>
                </FormHelperText>
              )}
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4} />

          <Grid container spacing={2} alignItems="center" justifyContent="center">
            <Grid item xs={12} sm={3}>
              <TextField
                label="Upload Photo"
                name="beneficiaryPhotoFile"
                variant="outlined"
                fullWidth
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <label htmlFor="beneficiaryFileInput">
                        <Button variant="contained" component="span">
                          Upload
                        </Button>
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        style={{ display: 'none' }}
                        id="beneficiaryFileInput"
                        name="beneficiaryPhotoFile"
                        onChange={(e) => handleFileChange(e, 'beneficiaryPhotoFile')}
                      />
                      {formData.beneficiaryPhotoFile && (
                        <ClearIcon
                          onClick={() => handleClearFile('beneficiaryPhotoFile')}
                          style={{ cursor: 'pointer', marginLeft: '8px' }}
                        />
                      )}
                      {formData.beneficiaryPhotoFile && fileDownload && (
                        <p>
                          <a
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              handleDownload(formData.beneficiaryPhotoFile);
                            }}
                            style={{ textDecoration: 'none', color: 'blue' }}
                          >
                            <GetAppIcon style={{ verticalAlign: 'middle' }} />
                          </a>
                        </p>
                      )}
                    </InputAdornment>
                  )
                }}
                value={
                  formData.beneficiaryPhotoFile && formData.beneficiaryPhotoFile.name
                    ? formData.beneficiaryPhotoFile.name
                    : formData.beneficiaryPhotoFile
                    ? formData.beneficiaryPhotoFile
                    : ''
                }
              />
            </Grid>
          </Grid>
        </Grid>
      </div>
    </>
  );
};
export default BeneficiaryBPLDetails;
