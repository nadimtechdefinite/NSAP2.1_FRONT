import React, { useState, useEffect } from 'react';
import { Grid, FormControl, Button, FormHelperText, Typography } from '@mui/material';
import MainCard from 'ui-component/cards/MainCard';
import StateList from 'components/form_components/StateList';
import DistrictList from 'components/form_components/DistrictList';
import AreaList from 'components/form_components/AreaList';
import SubDistrictList from 'components/form_components/SubDistrictList';
import GramPanchayatList from 'components/form_components/GramPanchayatList';
import messages_en from 'components/common/messages_en.json';
import axiosInstance from 'hooks/useAuthTokenUrl';
import { DataGrid } from '@mui/x-data-grid';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

//import { Table, TableHead, TableRow, TableCell, TableBody, TableFooter, Alert, Snackbar, CircularProgress } from '@mui/material';
const DisabilityReport = () => {
  const [formErrors, setFormErrors] = useState({});
  const [data, setData] = useState([]);
  const [message, setMessage] = useState('');
  const [alertServity, setAlertServity] = useState('');
  const [openSnackBar, setOpenSnackBar] = useState(false);
  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackBar(false);
  };
  const [formData, setFormData] = useState({
    stateCode: '',
    districtCode: '',
    areaCode: '',
    subDistrictMunicipalCode: '',
    gramPanchayatWardCode: ''
  });

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
  const handleGramPanchayatChange = (gramPanchayatCode) => {
    setFormData({ ...formData, gramPanchayatWardCode: gramPanchayatCode });
    setFormErrors((prevErrors) => {
      const updatedErrors = { ...prevErrors };
      delete updatedErrors.gramPanchayatWardCode;
      return updatedErrors;
    });
  };
  useEffect(() => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      areaCode: '',
      subDistrictMunicipalCode: '',
      gramPanchayatWardCode: ''
    }));
  }, [formData.districtCode]);

  const cancelButton = () => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      districtCode: '',
      areaCode: '',
      subDistrictMunicipalCode: '',
      gramPanchayatWardCode: ''
    }));
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.districtCode) {
      errors.districtCode = messages_en.districtRequired;
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0; // Return true if no errors
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const isFormValid = validateForm();
    if (isFormValid) {
      console.log('Form  valid!');
      console.log('Form Data : ', formData);
      try {
        const postUrl = '/disabiltyReport/getDisability';
        const response = await axiosInstance.post(postUrl, formData);
        console.log('response  : ', response.data);
        setData(response.data);

        if (response.data.length === 0) {
          setMessage('Data not found');
          setOpenSnackBar(true);
          setAlertServity('error');
        }
      } catch (error) {
        console.log('Error  : ', error);
      }
    } else {
      console.log('Form not valid!');
    }
  };
  const updatedData = data.map((item, index) => ({
    ...item,
    id: index + 1, // Generate unique IDs based on the index (you might need a more robust method)
    serialNo: index + 1 // Add a serial number field
  }));

  const columns = [
    { field: 'serialNo', headerName: 'Serial No', width: 110 }, // Add a column for serial numbers
    { field: 'area', headerName: 'Area', width: 100 },
    { field: 'subDistrictName', headerName: 'Sub District Name', width: 180 },
    { field: 'gramPanchayatName', headerName: 'Garam Panchayat Name', width: 180 },
    { field: 'village', headerName: 'Village', width: 180 },
    { field: 'sanctionOrderNo', headerName: 'Sanction Order No', width: 180 },
    { field: 'applicantName', headerName: 'Applicant Name', width: 180 },
    { field: 'disabilityType1', headerName: 'Disability Type1', width: 180 },
    { field: 'type1Percentage', headerName: 'percentage', width: 100 },
    { field: 'disabilityType2', headerName: 'Disability Type2', width: 180 },
    { field: 'type2Percentage', headerName: 'percentage', width: 100 }
  ];

  return (
    <div>
      <MainCard title="Disability Report">
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <StateList onSelectState={handleStateChange} isMendatory={true} />
              {formErrors.stateCode && (
                <FormHelperText>
                  <Typography style={{ color: 'red', fontSize: '0.8rem' }}>{formErrors.stateCode}</Typography>
                </FormHelperText>
              )}
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <DistrictList
                onSelectDistrict={handleDistrictChange}
                selectedStateId={formData.stateCode}
                isMendatory={false}
                defaultSelectedDistrict={formData.districtCode}
              />
              {formErrors.districtCode && (
                <FormHelperText>
                  <Typography style={{ color: 'red', fontSize: '0.8rem' }}>{formErrors.districtCode}</Typography>
                </FormHelperText>
              )}
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <AreaList onSelectArea={handleAreaChange} selectedArea={formData.areaCode} />
              {formErrors.areaCode && (
                <FormHelperText>
                  <Typography style={{ color: 'red', fontSize: '0.8rem' }}>{formErrors.areaCode}</Typography>
                </FormHelperText>
              )}
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4}>
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
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <GramPanchayatList
                onSelectGramPanchayat={handleGramPanchayatChange}
                selectedSubDistrictMunicipalAreaId={formData.subDistrictMunicipalCode}
              />
              {formErrors.gramPanchayatWardCode && (
                <FormHelperText>
                  <Typography style={{ color: 'red', fontSize: '0.8rem' }}>{formErrors.gramPanchayatWardCode}</Typography>
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

          {updatedData.length > 0 && (
            <Grid item xs={12}>
              <div style={{ height: 600, width: '100%' }}>
                <DataGrid getRowId={(row) => row.id} rows={updatedData} columns={columns} />
              </div>
            </Grid>
          )}
        </Grid>
      </MainCard>
      <Snackbar
        open={openSnackBar}
        autoHideDuration={7000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity={alertServity} sx={{ width: '100%' }}>
          {message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default DisabilityReport;
