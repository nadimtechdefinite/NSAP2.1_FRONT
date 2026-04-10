import React, { useState, useEffect } from 'react';
import { Grid, FormControl, FormHelperText, Typography, CircularProgress, Backdrop, Snackbar, Button } from '@mui/material';
import Alert from '@mui/material/Alert';
import MainCard from 'ui-component/cards/MainCard';
import axiosInstance from 'hooks/useAuthTokenUrl';
import StateList from 'components/form_components/StateList';
import DistrictList from 'components/form_components/DistrictList';
import AreaList from 'components/form_components/AreaList';
import SubDistrictList from 'components/form_components/SubDistrictList';
import GramPanchayatList from 'components/form_components/GramPanchayatList';
import VillageList from 'components/form_components/VillageList';
import messages_en from 'components/common/messages_en.json';
import { saveAs } from 'file-saver';

const VerificationForm = () => {
  const [formErrors, setFormErrors] = useState({});
  const [snackbar, setSnackbar] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedStateId, setSelectedState] = useState(null);
  const [selectedDistrictId, setSelectedDistrict] = useState(null);
  const [selectedAreaId, setSelectedArea] = useState(null);
  const [selectedSubDistrictId, setSelectedSubDistrict] = useState(null);
  const [selectedGP, setSelectedGP] = useState(null);
  const [selectedVillage, setSelectedVillage] = useState(null); // now used
  const [formKey, setFormKey] = useState(0);
  const [schemeCode, setSchemeCode] = useState('');

  useEffect(() => {
    const fetchSchemeCode = async () => {
      try {
        const response = await axiosInstance.get('/verificationForm/selectedSchemeCode');
        setSchemeCode(response.data);
      } catch (error) {
        console.error('Failed to fetch scheme code:', error);
        setSnackbar({ severity: 'error', children: 'Failed to load scheme code.' });
      }
    };

    fetchSchemeCode();
  }, []);
  const handleCloseSnackbar = () => setSnackbar(null);
  const handleSelectState = (stateId) => {
    setSelectedState(stateId);
  };

  const handleSelectDistrict = (selectedDistrictId) => {
    setSelectedDistrict(selectedDistrictId);
    setSelectedArea(null);
    setSelectedSubDistrict(null);
    setSelectedGP(null);
    setSelectedVillage(null);
    setFormErrors((prevErrors) => {
      const updatedErrors = { ...prevErrors };
      delete updatedErrors.selectedDistrictId;
      return updatedErrors;
    });
  };

  const handleSelectArea = (selectedAreaId) => {
    setSelectedArea(selectedAreaId);
    setSelectedSubDistrict(null);
    setSelectedGP(null);
    setSelectedVillage(null);
    setFormErrors((prevErrors) => {
      const updatedErrors = { ...prevErrors };
      delete updatedErrors.selectedAreaId;
      return updatedErrors;
    });
  };
  const handleSelectSubDistrict = (selectedSubDistrictId) => {
    setSelectedSubDistrict(selectedSubDistrictId);
    setSelectedGP(null);
    setSelectedVillage(null);
    setFormErrors((prevErrors) => {
      const updatedErrors = { ...prevErrors };
      delete updatedErrors.selectedSubDistrictId;
      return updatedErrors;
    });
  };
  const handleSelectGP = (selectedGP) => {
    setSelectedGP(selectedGP);
    setSelectedVillage(null);
  };

  const handleSelectVillage = (villageId) => {
    setSelectedVillage(villageId);
  };

  const validateForm = () => {
    const errors = {};

    if (!selectedDistrictId) {
      errors.selectedDistrictId = messages_en.districtRequired || 'District is required';
    }
    if (!selectedAreaId) {
      errors.selectedAreaId = messages_en.areaRequired || 'Area is required';
    }
    if (!selectedSubDistrictId) {
      errors.selectedSubDistrictId = messages_en.subDistrictRequired || 'Sub-District is required';
    }
    if (!selectedGP) {
      errors.selectedGP = 'Gram Panchayat is required';
    }
    if (!selectedVillage) {
      errors.selectedVillage = 'Village is required';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);

    const payload = {
      stateCode: selectedStateId,
      districtCode: selectedDistrictId,
      areaCode: selectedAreaId,
      subDistrictCode: selectedSubDistrictId,
      gpCode: selectedGP,
      villageCode: selectedVillage,
      scheme: schemeCode
    };

    try {
      const response = await axiosInstance.post('/verificationForm/verificationFormPdf', payload, {
        responseType: 'blob',
        validateStatus: (status) => status >= 200 && status < 500 // 👈 allows handling 204 manually
      });

      if (response.status === 204) {
        setSnackbar({ severity: 'info', children: 'No beneficiary data found for the selected location.' });
        return;
      }

      const blob = new Blob([response.data], { type: 'application/pdf' });
      const now = new Date();
      const day = now.getDate();
      const month = now.toLocaleString('default', { month: 'long' }).toUpperCase();
      const year = now.getFullYear();
      const fileName = `verification_form_${day}_${month}_${year}.pdf`;

      saveAs(blob, fileName);
      setSnackbar({ severity: 'success', children: 'Verification form downloaded!' });
    } catch (error) {
      console.error('Download error:', error);
      setSnackbar({ severity: 'error', children: 'PDF download failed.' });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setSelectedArea(null);
    setSelectedSubDistrict(null);
    setSelectedGP(null);
    setSelectedVillage(null);
    setFormErrors({});
    setFormKey((prev) => prev + 1);
  };
  return (
    <div>
      <MainCard title="Verification Form PDF Download">
        {!!snackbar && (
          <Snackbar open anchorOrigin={{ vertical: 'top', horizontal: 'center' }} onClose={handleCloseSnackbar} autoHideDuration={6000}>
            <Alert {...snackbar} onClose={handleCloseSnackbar} />
          </Snackbar>
        )}

        <Backdrop open={loading} style={{ zIndex: 999, color: '#fff' }}>
          <CircularProgress color="inherit" />
        </Backdrop>

        <form key={formKey} onSubmit={handleSubmit}>
          <input type="hidden" value={schemeCode} name="schemeCode" />

          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <StateList onSelectState={handleSelectState} />
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <DistrictList
                  selectedStateId={selectedStateId}
                  setSelectedDistrict={setSelectedDistrict}
                  onSelectDistrict={handleSelectDistrict}
                />
                {formErrors.selectedDistrictId && (
                  <FormHelperText>
                    <Typography style={{ color: 'red', fontSize: '0.8rem' }}>{formErrors.selectedDistrictId}</Typography>
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <AreaList selectedDistrictId={selectedDistrictId} selectedArea={selectedAreaId} onSelectArea={handleSelectArea} />
                {formErrors.selectedAreaId && (
                  <FormHelperText>
                    <Typography style={{ color: 'red', fontSize: '0.8rem' }}>{formErrors.selectedAreaId}</Typography>
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <SubDistrictList
                  selectedAreaId={selectedAreaId}
                  selectedDistrictId={selectedDistrictId}
                  setSelectedSubDistrict={setSelectedSubDistrict}
                  onSelectSubDistrict={handleSelectSubDistrict}
                />
                {formErrors.selectedSubDistrictId && (
                  <FormHelperText>
                    <Typography style={{ color: 'red', fontSize: '0.8rem' }}>{formErrors.selectedSubDistrictId}</Typography>
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={4}>
              <FormControl fullWidth error={!!formErrors.selectedGP}>
                <GramPanchayatList
                  selectedSubDistrictMunicipalAreaId={selectedSubDistrictId}
                  setSelectedGramPanchayat={setSelectedGP}
                  onSelectGramPanchayat={handleSelectGP}
                />
                {formErrors.selectedGP && (
                  <FormHelperText>
                    <Typography style={{ color: 'red', fontSize: '0.8rem' }}>{formErrors.selectedGP}</Typography>
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={4}>
              <FormControl fullWidth error={!!formErrors.selectedVillage}>
                <VillageList
                  selectedGramPanchayatId={selectedGP}
                  setSelectedVillage={setSelectedVillage}
                  onSelectVillage={handleSelectVillage}
                />
                {formErrors.selectedVillage && (
                  <FormHelperText>
                    <Typography style={{ color: 'red', fontSize: '0.8rem' }}>{formErrors.selectedVillage}</Typography>
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <Button type="submit" variant="contained" color="primary" disabled={loading} style={{ marginTop: '20px' }}>
                {loading ? <CircularProgress size={24} /> : 'Download PDF'}
              </Button>
              &nbsp;&nbsp;&nbsp;
              <Button variant="outlined" color="secondary" style={{ marginTop: '20px' }} onClick={handleCancel}>
                Cancel
              </Button>
            </Grid>
          </Grid>
        </form>
      </MainCard>
    </div>
  );
};

export default VerificationForm;
