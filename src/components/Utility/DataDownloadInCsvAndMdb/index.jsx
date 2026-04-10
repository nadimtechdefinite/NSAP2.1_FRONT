import React, { useState, useEffect } from 'react';
import MainCard from 'ui-component/cards/MainCard';
import { Grid, FormControl, FormHelperText, Typography, Button, Checkbox, FormControlLabel } from '@mui/material';
import StateList from 'components/form_components/StateList';
import DistrictList from 'components/form_components/DistrictList';
import AreaList from 'components/form_components/AreaList';
import SubDistrictList from 'components/form_components/SubDistrictList';
import messages_en from 'components/common/messages_en.json';
import SchemeMasterListByStateCode from 'components/form_components/SchemeMasterListByStateCode';
import axiosInstance from 'hooks/useAuthTokenUrl';
import config from 'config';
import { getAuthToken, getUserInfo } from 'utils/storageUtils';
import CircularProgress from '@mui/material/CircularProgress';

const DataDownloadInCsvAndMdb = () => {
  const [formErrors, setFormErrors] = useState({});
  const [formData, setFormData] = useState({
    stateCode: '',
    districtCode: '',
    areaCode: '',
    schemeCode: '',
    applicantName: false,
    address: false,
    scheme: false,
    age: false,
    gender: false,
    pinCode: false,
    aadhaarNo: false,
    fatherName: false,
    categoryCode: false,
    bplId: false,
    bplMemberId: false,
    sectnOrdrNo: false,
    bankPostOfficeNo: false,
    ifscCode: false,
    disbursementMode: false,
    aadarVerified: false,
    beneficiaryNo: false,
    rationCardNo: false,
    epicNo: false,
    mobile: false,
    sanctionDate: false,
    disbursementUptoCenter: false,
    with_pensioner_data: false,
    with_transaction_data: false
  });
  const [showCheckboxes, setShowCheckboxes] = useState(false);
  const [showLink, setShowLink] = useState(false);
  const [downloadMdbFile, setDownloadMdbFile] = useState('');
  const userinfoHeader = getUserInfo();
  const apiBaseUrl = config.API_BASE_URL;
  const [loading, setLoading] = useState(false);

  const handleStateChange = (stateId) => {
    setFormData({ ...formData, stateCode: stateId });
    setFormErrors((prevErrors) => {
      const updatedErrors = { ...prevErrors };
      delete updatedErrors.stateCode;
      return updatedErrors;
    });
  };
  const handleDistrictChange = (districtId) => {
    setFormData({ ...formData, districtCode: districtId });
    setFormErrors((prevErrors) => {
      const updatedErrors = { ...prevErrors };
      delete updatedErrors.districtCode;
      return updatedErrors;
    });
  };
  const handleAreaChange = (areaCode) => {
    setFormData({ ...formData, areaCode: areaCode });
    setFormErrors((prevErrors) => {
      const updatedErrors = { ...prevErrors };
      delete updatedErrors.areaCode;
      return updatedErrors;
    });
  };

  const handleSubDistrictChange = (subDistrictCode) => {
    setFormData({ ...formData, subDistrictMunicipalCode: subDistrictCode });
    setFormErrors((prevErrors) => {
      const updatedErrors = { ...prevErrors };
      delete updatedErrors.subDistrictMunicipalCode;
      return updatedErrors;
    });
  };

  const handleSchemeChange = (schemeCodeId) => {
    setFormData({ ...formData, schemeCode: schemeCodeId });
    setFormErrors((prevErrors) => {
      const updatedErrors = { ...prevErrors };
      delete updatedErrors.schemeCode;
      return updatedErrors;
    });
  };

  const handlePensionerCheckboxChange = (event) => {
    const { checked } = event.target;
    setFormData({
      ...formData,
      with_pensioner_data: checked // Correct field to update
    });
  };

  const handleTransactionCheckboxChange = (event) => {
    const { checked } = event.target;
    console.log('Transaction Checkbox:', checked);
    setFormData({
      ...formData,
      with_transaction_data: checked // Correct field to update
    });
  };

  useEffect(() => {
    console.log('with_pensioner_data', formData.with_pensioner_data);
  }, [formData.with_pensioner_data]);

  useEffect(() => {
    console.log('with_transaction_data', formData.with_transaction_data);
  }, [formData.with_transaction_data]);

  const validateForm = () => {
    const errors = {};
    if (!formData.stateCode) {
      errors.stateCode = messages_en.stateRequired;
    }
    if (!formData.districtCode) {
      errors.districtCode = messages_en.districtRequired;
    }

    if (!formData.schemeCode) {
      errors.schemeCode = messages_en.schemeRequired;
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0; // Return true if no errors
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const isFormValid = validateForm();
    if (isFormValid) {
      console.log('formData.schemeCode', formData.schemeCode);
      if (formData.schemeCode === 'ALL CENTRE SCHEMES') {
        setFormErrors((prevErrors) => ({
          ...prevErrors,
          schemeCode: 'Please Select Particular Scheme'
        }));
      } else {
        setShowLink(true);
        setShowCheckboxes(false);
        fetchMdbData();
      }
    } else {
      console.log('Form not valid!');
    }
  };
  const cancelButton = () => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      districtCode: '',
      areaCode: '',
      subDistrictMunicipalCode: '',
      schemeCode: '',
      with_pensioner_data: '',
      with_transaction_data: ''
    }));
    setShowCheckboxes(false);
    setShowLink(false);
  };

  const handleCsv = () => {
    const isFormValid = validateForm();
    if (isFormValid) {
      setShowCheckboxes(true);
      setShowLink(false);
    } else {
      console.log('Form not valid!');
    }
  };

  const checkboxes = [
    'applicantName',
    'address',
    'scheme',
    'age',
    'gender',
    'pinCode',
    'beneficiaryNo',
    'fatherName',
    'aadhaarNo',
    'categoryCode',
    'bplId',
    'bplMemberId',
    'sanctionOrderNo',
    'bankPostOfficeAccountNo',
    'ifscCode',
    'disbursementMode',
    'aadhaarVerified',
    'rationCardNo',
    'epicNo',
    'mobile',
    'sanctionDate',
    'disbursementUptoCenter'
  ];

  const handleReset = () => {
    const resetFormData = { ...formData };
    Object.keys(resetFormData).forEach((key) => {
      if (typeof resetFormData[key] === 'boolean' && key.trim() !== 'with_pensioner_data' && key.trim() !== 'with_transaction_data') {
        resetFormData[key] = false;
      }
    });

    setFormData(resetFormData);
  };
  const handleCheckboxChange = (event) => {
    console.log('event.target.name', event.target.name);
    setFormData({ ...formData, [event.target.name]: event.target.checked });
  };

  const handleDownloadCsv = async () => {
    await fetchCsvData();
  };

  async function fetchCsvData() {
    try {
      const postUrl = `/utility/downloadCsvData`;
      const { stateCode, districtCode, areaCode, subDistrictMunicipalCode, schemeCode, ...checkboxes } = formData;

      // Create the payload for the API call
      const payload = {
        stateCode,
        districtCode,
        areaCode,
        subDistrictMunicipalCode,
        schemeCode,
        ...checkboxes
      };

      const response = await axiosInstance.post(postUrl, JSON.stringify(payload), { responseType: 'blob' });
      console.log(response.data);
      if (response.data) {
        const csvBlob = new Blob([response.data], { type: 'text/csv' });
        // Create a link element and trigger a download
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(csvBlob);
        link.download = 'BeneficiaryDetails.csv';
        link.click();
      }
    } catch (error) {
      console.log('error: ', error);
    }
  }

  async function fetchMdbData() {
    try {
      const postUrl = `/utility/downloadData`;
      const { stateCode, districtCode, areaCode, subDistrictMunicipalCode, schemeCode, with_pensioner_data, with_transaction_data } =
        formData;

      // Create the payload for the API call
      const payload = {
        stateCode,
        districtCode,
        areaCode,
        subDistrictMunicipalCode,
        schemeCode,
        with_pensioner_data,
        with_transaction_data
      };
      setLoading(true);
      const response = await axiosInstance.post(postUrl, JSON.stringify(payload));
      console.log('fetchMdbData', response.data);
      setDownloadMdbFile(response.data);
      setLoading(false);
    } catch (error) {
      console.log('error: ', error);
    }
  }

  const handleDownload = () => {
    const token = getAuthToken();

    fetch(`${apiBaseUrl}/utility/downloadData/${downloadMdbFile}`, {
      method: 'GET',
      headers: {
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
        const blob = new Blob([data], { type: 'application/octet-stream' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', downloadMdbFile);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      })
      .catch((error) => {
        console.error('There was a problem with the fetch operation:', error);
      });
  };

  return (
    <>
      <MainCard>
        <h3 style={{ fontSize: '2rem', color: 'black', fontWeight: 'normal' }}>Download Master Data</h3>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={3}>
            <FormControl fullWidth>
              <StateList onSelectState={handleStateChange} isMendatory={true} />
              {formErrors.stateCode && (
                <FormHelperText>
                  <Typography style={{ color: 'red', fontSize: '0.8rem' }}>{formErrors.stateCode}</Typography>
                </FormHelperText>
              )}
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={3}>
            <FormControl fullWidth>
              <DistrictList
                onSelectDistrict={handleDistrictChange}
                selectedStateId={formData.stateCode}
                isMendatory={true}
                defaultSelectedDistrict={formData.districtCode}
              />
              {formErrors.districtCode && (
                <FormHelperText>
                  <Typography style={{ color: 'red', fontSize: '0.8rem' }}>{formErrors.districtCode}</Typography>
                </FormHelperText>
              )}
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={3}>
            <FormControl fullWidth>
              <AreaList onSelectArea={handleAreaChange} selectedArea={formData.areaCode} />
              {formErrors.areaCode && (
                <FormHelperText>
                  <Typography style={{ color: 'red', fontSize: '0.8rem' }}>{formErrors.areaCode}</Typography>
                </FormHelperText>
              )}
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={3}>
            <FormControl fullWidth>
              <SubDistrictList
                onSelectSubDistrict={handleSubDistrictChange}
                selectedDistrictId={formData.districtCode}
                selectedAreaId={formData.areaCode}
              />
              {formErrors.subDistrictMunicipalCode && (
                <FormHelperText>
                  <Typography style={{ color: 'red', fontSize: '0.8rem' }}>{formErrors.subDistrictMunicipalCode}</Typography>
                </FormHelperText>
              )}
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={3}>
            <FormControl fullWidth>
              <SchemeMasterListByStateCode
                selectedStateCode={formData.stateCode}
                onSelectScheme={handleSchemeChange}
                isMendatory={true}
                defaultSelectedScheme={formData.schemeCode}
              />
              {formErrors.schemeCode && (
                <FormHelperText>
                  <Typography style={{ color: 'red', fontSize: '0.8rem' }}>{formErrors.schemeCode}</Typography>
                </FormHelperText>
              )}
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={3}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.with_pensioner_data}
                  onChange={handlePensionerCheckboxChange}
                  name="with_pensioner_data"
                  color="primary"
                />
              }
              label={<Typography sx={{ fontSize: '1.1rem' }}>Pensioner Master Data</Typography>}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.with_transaction_data}
                  onChange={handleTransactionCheckboxChange}
                  name="with_transaction_data"
                  color="primary"
                />
              }
              label={<Typography sx={{ fontSize: '1.1rem' }}>Transaction Master Data(Current Financial Year)</Typography>}
            />
          </Grid>
          <Grid item xs={12}>
            <Typography sx={{ color: 'blue', fontSize: '1rem' }}>
              Note: Please select Pensioner and Transaction Data checkboxes if required. For downloading only Master Data, do not select any
              checkbox.
            </Typography>
          </Grid>

          <Grid item xs={12} alignItems="center">
            <Button type="button" variant="contained" color="primary" onClick={handleSubmit}>
              DOWNLOAD IN MDB
            </Button>
            &nbsp; &nbsp; &nbsp;
            <Button type="button" variant="contained" color="primary" onClick={handleCsv}>
              DOWNLOAD IN CSV
            </Button>
            &nbsp; &nbsp; &nbsp;
            <Button type="button" variant="contained" color="error" onClick={cancelButton}>
              CANCEL
            </Button>
          </Grid>
        </Grid>
      </MainCard>
      {showCheckboxes && (
        <div style={{ marginTop: '20px' }}>
          <MainCard>
            <Typography gutterBottom style={{ fontSize: '1.5rem', color: 'black', fontWeight: 'normal' }}>
              Download Data in CSV
            </Typography>
            <Grid container spacing={2}>
              {checkboxes.map((checkbox) => (
                <Grid item xs={12} sm={2} key={checkbox}>
                  <FormControlLabel
                    control={<Checkbox checked={formData[checkbox]} onChange={handleCheckboxChange} name={checkbox} color="primary" />}
                    label={<Typography>{checkbox.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())}</Typography>}
                  />
                </Grid>
              ))}
            </Grid>
          </MainCard>
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
            <Button type="button" variant="contained" color="primary" onClick={handleDownloadCsv}>
              DOWNLOAD
            </Button>
            <Button type="button" variant="contained" color="secondary" onClick={handleReset} style={{ marginLeft: '10px' }}>
              RESET
            </Button>
          </div>
        </div>
      )}
      {showLink && (
        <div style={{ marginTop: '20px' }}>
          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100px' }}>
              <CircularProgress />
            </div>
          ) : (
            downloadMdbFile && (
              <MainCard>
                <Typography gutterBottom style={{ marginBottom: '20px', fontSize: '1.5rem', color: 'black', fontWeight: 'normal' }}>
                  Data Porting Page
                </Typography>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    handleDownload();
                  }}
                  style={{ textDecoration: 'none', color: 'blue', fontSize: '1rem' }}
                >
                  DOWNLOAD RECORDS
                </a>
                <Typography gutterBottom style={{ marginTop: '20px', fontSize: '1rem' }}>
                  Password: This file is password protected. The password is your USERID+Current date in YYYYMMDD format. For example,
                  TEST-ITNO20201231.
                </Typography>
              </MainCard>
            )
          )}
        </div>
      )}
    </>
  );
};
export default DataDownloadInCsvAndMdb;
