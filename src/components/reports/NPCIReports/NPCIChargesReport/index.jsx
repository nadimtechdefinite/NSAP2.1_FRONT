import React, { useState } from 'react';
import { Grid, FormControl, Button, FormHelperText, Typography, CircularProgress } from '@mui/material';
import MainCard from 'ui-component/cards/MainCard';
import StateList from 'components/form_components/StateList';
import AdminSchemeList from 'components/form_components/AdminSchemeList';
import FinancialYearList from './FinYearList';
import MonthList from './MonthList';
import messages_en from 'components/common/messages_en.json';
import NPCIChargesReportDetails from './ReportDetails';
import axiosInstance from 'hooks/useAuthTokenUrl';
const NPCIChargesReport = () => {
  const [loading, setLoading] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [formData, setFormData] = useState({
    stateCode: '',
    schemeCode: '',
    finYearCode: '',
    fromMonthCode: '',
    toMonthCode: ''
  });
  const [reportDetails, setReportDetails] = useState([]);
  const [stateName, setStateName] = useState('');
  const [schemeName, setSchemeName] = useState('');
  const [finYearCode, setFinYearCode] = useState('');
  const [monthDuration, setMonthDuration] = useState('');
  const handleStateChange = (stateId) => {
    setFormData({ ...formData, stateCode: stateId });
    setFormErrors((prevErrors) => {
      const updatedErrors = { ...prevErrors };
      delete updatedErrors.stateCode;
      return updatedErrors;
    });
  };

  const handleSchemeChange = (schemeCode) => {
    setFormData({ ...formData, schemeCode: schemeCode });
    setFormErrors((prevErrors) => {
      const updatedErrors = { ...prevErrors };
      delete updatedErrors.schemeCode;
      return updatedErrors;
    });
  };

  const handleFinYearChange = (finYearCode) => {
    setFormData({ ...formData, finYearCode: finYearCode });
    setFormErrors((prevErrors) => {
      const updatedErrors = { ...prevErrors };
      delete updatedErrors.finYearCode;
      return updatedErrors;
    });
  };

  const handleFromMonthChange = (fromMonthCode) => {
    setFormData({ ...formData, fromMonthCode: fromMonthCode });
    setFormErrors((prevErrors) => {
      const updatedErrors = { ...prevErrors };
      delete updatedErrors.fromMonthCode;
      return updatedErrors;
    });
  };

  const handleToMonthChange = (toMonthCode) => {
    setFormData({ ...formData, toMonthCode: toMonthCode });
    setFormErrors((prevErrors) => {
      const updatedErrors = { ...prevErrors };
      delete updatedErrors.toMonthCode;
      return updatedErrors;
    });
  };

  const validateForm = () => {
    const errors = {};
    // Add validation logic for each field
    if (!formData.stateCode) {
      errors.stateCode = messages_en.stateRequired;
    }

    if (!formData.schemeCode) {
      errors.schemeCode = messages_en.schemeRequired;
    }
    if (!formData.finYearCode) {
      errors.finYearCode = messages_en.finYearRequired;
    }
    if (!formData.fromMonthCode) {
      errors.fromMonthCode = messages_en.monthFeildRequired;
    }
    if (!formData.toMonthCode) {
      errors.toMonthCode = messages_en.monthFeildRequired;
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0; // Return true if no errors
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const isFormValid = validateForm();
    if (isFormValid) {
      console.log('VALID FORM DATA : ');
      try {
        setLoading(true);
        const getUrl = '/login/report/findNPCIChargesReportDetails';
        const response = await axiosInstance.post(getUrl, formData);
        const result = await response.data;
        setStateName(result.stateName);
        setSchemeName(result.schemeCode);
        setFinYearCode(result.finYearCode);
        setMonthDuration(result.monthDuration);
        const newData = result.chargesReportResponseList.map((row, index) => ({
          ...row,
          serialNo: index + 1 // Serial number starts from 1
        }));
        setReportDetails(newData);
      } catch (error) {
        console.log('Error fetching NPCI Reports : ', error);
      } finally {
        setLoading(false);
      }
    } else {
      console.log('Form not valid!');
    }
  };
  const cancelButton = () => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      stateCode: '',
      schemeCode: '',
      finYearCode: '',
      fromMonthCode: '',
      toMonthCode: ''
    }));
    setReportDetails([]);
  };
  return (
    <>
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
      <MainCard title="Transaction Detail Summary Of States">
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <StateList
                onSelectState={handleStateChange}
                isMendatory={true}
                showAllIndex={true}
                defaultSelectedState={formData.stateCode}
              />
              {formErrors.stateCode && (
                <FormHelperText>
                  <Typography style={{ color: 'red', fontSize: '0.8rem' }}>{formErrors.stateCode}</Typography>
                </FormHelperText>
              )}
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <AdminSchemeList onSelectScheme={handleSchemeChange} isMendatory={true} defaultSchemeCode={formData.schemeCode} />
              {formErrors.schemeCode && (
                <FormHelperText>
                  <Typography style={{ color: 'red', fontSize: '0.8rem' }}>{formErrors.schemeCode}</Typography>
                </FormHelperText>
              )}
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <FinancialYearList onSelectFinYear={handleFinYearChange} isMendatory={true} defaultFinYear={formData.finYearCode} />
              {formErrors.finYearCode && (
                <FormHelperText>
                  <Typography style={{ color: 'red', fontSize: '0.8rem' }}>{formErrors.finYearCode}</Typography>
                </FormHelperText>
              )}
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <MonthList
                onSelectMonth={handleFromMonthChange}
                labelId={'From-label'}
                labelName={'From Month'}
                monthFeildName={'fromMonth'}
                isMendatory={true}
                selectedFinYear={formData.finYearCode}
                defaultMonthCode={formData.fromMonthCode}
              />
              {formErrors.fromMonthCode && (
                <FormHelperText>
                  <Typography style={{ color: 'red', fontSize: '0.8rem' }}>{formErrors.fromMonthCode}</Typography>
                </FormHelperText>
              )}
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <MonthList
                onSelectMonth={handleToMonthChange}
                labelId={'To-label'}
                labelName={'To Month'}
                monthFeildName={'toMonth'}
                isMendatory={true}
                selectedFinYear={formData.finYearCode}
                defaultMonthCode={formData.toMonthCode}
              />
              {formErrors.toMonthCode && (
                <FormHelperText>
                  <Typography style={{ color: 'red', fontSize: '0.8rem' }}>{formErrors.toMonthCode}</Typography>
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
      {!reportDetails.length == 0 && (
        <NPCIChargesReportDetails
          stateName={stateName}
          schemeName={schemeName}
          finYearCode={finYearCode}
          monthDuration={monthDuration}
          setReportDetails={reportDetails}
        />
      )}
    </>
  );
};
export default NPCIChargesReport;
