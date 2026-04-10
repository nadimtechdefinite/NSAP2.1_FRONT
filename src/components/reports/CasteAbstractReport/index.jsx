import React, { useState, useEffect } from 'react';
import MainCard from 'ui-component/cards/MainCard';
import axiosInstance from 'hooks/useAuthTokenUrl';
import messages_en from 'components/common/messages_en.json';
import CasteAbstractReport from './CasteAbstractReport';
import AgeAbstractReport from './AgeAbstractReport';
import MobileNoAbstractReport from './MobileNoAbstractReport';
import { Grid, FormControl, FormHelperText, InputLabel, MenuItem, Select, Button } from '@mui/material';

const AbstractReport = () => {
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    reportType: ''
  });
  const [castReport, setCastReport] = useState(false);
  const [ageReport, setAgeReport] = useState(false);
  const [mobileNoReport, setMobileNoReport] = useState(false);
  const getCasteAbstractReportDetails = async () => {
    try {
      const response = await axiosInstance.get(`/report/findAllCastReportDetails`);
      console.log('response.data', response.data);
    } catch (error) {
      console.error('Error fetching IFSC codes:', error);
    }
  };

  useEffect(() => {
    getCasteAbstractReportDetails();
  }, []);

  const handleChangeReportType = (event) => {
    setFormData({ ...formData, reportType: event.target.value });
    setErrors((prevErrors) => {
      const updatedErrors = { ...prevErrors };
      delete updatedErrors.schemeCode;
      return updatedErrors;
    });
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.reportType) {
      errors.reportType = messages_en.abstractReportType;
    }

    setErrors(errors);
    return Object.keys(errors).length === 0; // Return true if no errors
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const isFormValid = validateForm();
    if (isFormValid) {
      try {
        if (formData.reportType === 'casteAbstractReport') {
          setCastReport(true);
          setAgeReport(false);
          setMobileNoReport(false);
        } else if (formData.reportType === 'ageAbstractReport') {
          setAgeReport(true);
          setCastReport(false);
          setMobileNoReport(false);
        } else if (formData.reportType === 'mobileAbstractReport') {
          setMobileNoReport(true);
          setAgeReport(false);
          setCastReport(false);
        }
      } catch (error) {
        console.error('Error fetching center list:', error);
      }
    } else {
      console.log('Form not valid!');
    }
  };

  const cancelButton = () => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      reportType: ''
    }));
    setCastReport(false);
    setAgeReport(false);
    setMobileNoReport(false);
  };
  return (
    <>
      <MainCard>
        <h3 style={{ fontSize: '2rem', color: 'black', fontWeight: 'normal' }}>Abstract Report</h3>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">
                Abstract Report Type &nbsp;<span style={{ color: 'red' }}>*</span>
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={formData.reportType}
                label="Abstract Report Type"
                name="reportType"
                onChange={handleChangeReportType}
              >
                <MenuItem value={'casteAbstractReport'}>Caste Abstract Report</MenuItem>
                <MenuItem value={'ageAbstractReport'}>Age Abstract Report</MenuItem>
                <MenuItem value={'aadhaarAbstractReport'}>Aadhaar Abstract Report</MenuItem>
                <MenuItem value={'mobileAbstractReport'}>Mobile No Abstract Report</MenuItem>
              </Select>
              {/* Display error message for from amount */}
              {errors.reportType && (
                <FormHelperText error id="reportType-error">
                  {errors.reportType}
                </FormHelperText>
              )}
            </FormControl>
          </Grid>
          <Grid item xs={12} alignItems="center">
            <Button type="submit" variant="contained" color="primary" onClick={handleSubmit}>
              SUBMIT
            </Button>
            &nbsp; &nbsp; &nbsp;
            <Button type="button" variant="contained" color="error" onClick={cancelButton}>
              CANCEL
            </Button>
          </Grid>
        </Grid>
      </MainCard>

      {castReport && <CasteAbstractReport />}
      {ageReport && <AgeAbstractReport />}
      {mobileNoReport && <MobileNoAbstractReport />}
    </>
  );
};
export default AbstractReport;
