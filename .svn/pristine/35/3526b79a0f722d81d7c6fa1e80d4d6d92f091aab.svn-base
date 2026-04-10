import React, { useState } from 'react';
import { useReducer } from 'react';
import axiosInstance from 'hooks/useAuthTokenUrl';
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableContainer,
  Paper,
  TableBody,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Button,
  Alert,
  CircularProgress,
  Backdrop,
  Snackbar
} from '@mui/material';
import StateList from 'components/form_components/StateList';
import DistrictList from 'components/form_components/DistrictList';
import AreaList from 'components/form_components/AreaList';
import SubDistrictList from 'components/form_components/SubDistrictList';
import GramPanchayatList from 'components/form_components/GramPanchayatList';
import VillageList from 'components/form_components/VillageList';
import { showalertwhenObjectretrnvalidation } from 'components/common/fieldValidationFunctionByjava';
import AlertSucess from 'components/common/alertSucess';
import MandatoryFields from 'components/common/MandatoryFields';

function MappingLocation() {
  const [formInput, setFormInput] = useReducer((state, newState) => ({ ...state, ...newState }), {
    stateId: '',
    districtId: '',
    districtIdTO: '',
    subDistrictMunicipalAreaId: '',
    subDistrictMunicipalAreaIdTO: '',
    ruralUrbanArea: '',
    gramPanchayatWardId: '',
    gramPanchayatWardIdTO: '',
    villageId: '',
    villageIdTO: '',
    selectedValue: ''
  });

  const [snackbar, setSnackbar] = React.useState(null);
  const handleCloseSnackbar = () => setSnackbar(null);
  const [selectedValue, setSelectedValue] = useState('');
  const [stateId, setStateId] = useState('');
  const [districtId, setdistrictId] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [warningAlert, setShowwarningAlert] = useState('');
  const [loading, setLoading] = useState(false);
  const [showValidationPopup, setShowValidationPopup] = useState(false);
  const [unvalidField, setunvalidField] = useState([]);

  const handleSelectState = (state) => {
    setStateId(state);
    const name = 'stateId';
    setFormInput({ [name]: state });
  };

  const handleDist = (dist) => {
    setdistrictId(dist);
    const name = 'districtId';
    setFormInput({ [name]: dist });
  };
  const handleDistTO = (dist) => {
    const name = 'districtIdTO';
    setFormInput({ [name]: dist });
  };
  const handleArea = (area) => {
    const name = 'ruralUrbanArea';
    setFormInput({ [name]: area });
  };
  const handleAreaTO = (area) => {
    const name = 'ruralUrbanArea';
    setFormInput({ [name]: area });
  };
  const handleSubDist = (area) => {
    const name = 'subDistrictMunicipalAreaId';
    setFormInput({ [name]: area });
  };
  const handleSubDistTO = (area) => {
    const name = 'subDistrictMunicipalAreaIdTO';
    setFormInput({ [name]: area });
  };

  const handleGrampanchayat = (gp) => {
    const name = 'gramPanchayatWardId';
    setFormInput({ [name]: gp });
  };

  const handleGrampanchayatTO = (gp) => {
    const name = 'gramPanchayatWardIdTO';
    setFormInput({ [name]: gp });
  };
  const handlevillage = (village) => {
    const name = 'villageId';
    setFormInput({ [name]: village });
  };

  const handleRadioChange = (event) => {
    setSelectedValue(event.target.value);
    const name = 'selectedValue';
    setFormInput({ [name]: event.target.value });
  };

  async function postData(e) {
    e.preventDefault();
    event.target.reset();

    if (selectedValue === '') {
      setSnackbar({
        children: 'Choose any Level of Mapping Location.',
        severity: 'warning'
      });
      return;
    }

    const mandatoryFields = [
      'stateId',
      'districtId',
      'districtIdTO',
      'subDistrictMunicipalAreaId',
      'ruralUrbanArea',
      'selectedValue',
      selectedValue === 'GP' ? 'subDistrictMunicipalAreaIdTO' : '',
      selectedValue === 'GP' ? 'gramPanchayatWardId' : '',
      selectedValue === 'V' ? 'gramPanchayatWardIdTO' : '',
      selectedValue === 'V' ? 'villageId' : ''
    ].filter((field) => field !== '');

    const validationResults = mandatoryFields.map((field) => ({
      field: field,
      isValid: Boolean(formInput[field])
    }));

    const isFormValid = validationResults.every((result) => result.isValid);

    if (!isFormValid) {
      const unvalidFields = validationResults.filter((result) => !result.isValid).map((result) => result.field + ',  ');
      setunvalidField(unvalidFields);
      console.log(unvalidFields);
      setShowValidationPopup(true);
      setTimeout(() => {
        setShowValidationPopup(false);
      }, 3000);
      return;
    }

    const postFormDate = JSON.stringify(formInput);
    var result = window.confirm('Are you sure want to Update the record? ');
    if (result) {
      setLoading(true);
      try {
        const postUrl = '/advance-search/updateMappingLocation';
        const res = await axiosInstance.post(postUrl, postFormDate);
        if (res.status === 200) {
          setShowAlert(true);
          const timeoutId = setTimeout(() => {
            setShowAlert(false);
          }, 5000);

          return () => clearTimeout(timeoutId);
        }
      } catch (error) {
        setShowwarningAlert(showalertwhenObjectretrnvalidation(error));
        console.error('Error updating data:', error);
      } finally {
        setLoading(false);
      }
    }
  }

  const handleClose = () => {
    setShowwarningAlert('');
  };

  return (
    <div>
      {showValidationPopup && <MandatoryFields fieldName={unvalidField} />}

      {!!snackbar && (
        <Snackbar open anchorOrigin={{ vertical: 'top', horizontal: 'center' }} onClose={handleCloseSnackbar} autoHideDuration={6000}>
          <Alert {...snackbar} onClose={handleCloseSnackbar} />
        </Snackbar>
      )}
      {showAlert && <AlertSucess msg={'HaMapping Locationbitation'} setShowAlert={setShowAlert} />}
      {warningAlert && (
        <Alert variant="filled" severity="warning" onClose={handleClose}>
          {warningAlert}
        </Alert>
      )}

      <div style={{ backgroundColor: '#333', color: 'white', padding: '10px' }}>
        <div style={{ borderBottom: '3px solid white', paddingBottom: '10px', textAlign: 'center' }}>
          <h2> Mapping Location</h2>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <RadioGroup value={selectedValue} onChange={handleRadioChange} row>
          <FormControlLabel value="SD" control={<Radio />} label="SubDistrict" />
          <FormControlLabel value="GP" control={<Radio />} label="GramPanchayat" />
          <FormControlLabel value="V" control={<Radio />} label="Village" />
        </RadioGroup>
      </div>
      <form method="post" onSubmit={postData}>
        <TableContainer component={Paper} sx={{ height: '50%', width: '100%', marginTop: '15px' }}>
          <Table size="small" aria-label="simple table" striped>
            <TableHead>
              <TableRow style={{ backgroundColor: '#bfbfbf' }}>
                <TableCell align="center" style={{ fontSize: '25px', border: 'solid' }}>
                  From Location
                </TableCell>
                <TableCell align="center" style={{ fontSize: '25px', border: 'solid' }}>
                  To Location
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell style={{ border: '1px solid #000' }}>
                  <FormControl fullWidth style={{ marginTop: '20px' }}>
                    <StateList onSelectState={handleSelectState} isMandatory={true} />
                  </FormControl>
                  <FormControl fullWidth style={{ marginTop: '20px' }}>
                    <DistrictList selectedStateId={stateId} onSelectDistrict={handleDist} isMandatory={true} />
                  </FormControl>

                  <FormControl fullWidth style={{ marginTop: '20px' }}>
                    <AreaList onSelectArea={handleArea} isMandatory={true} />
                  </FormControl>
                  {(selectedValue === 'SD' || selectedValue === 'GP' || selectedValue === 'V') && (
                    <FormControl fullWidth style={{ marginTop: '20px' }}>
                      <SubDistrictList
                        selectedDistrictId={formInput.districtId}
                        selectedAreaId={formInput.ruralUrbanArea}
                        onSelectSubDistrict={handleSubDist}
                        isMandatory={true}
                      />
                    </FormControl>
                  )}
                  {(selectedValue === 'GP' || selectedValue === 'V') && (
                    <FormControl fullWidth style={{ marginTop: '20px' }}>
                      <GramPanchayatList
                        selectedSubDistrictMunicipalAreaId={formInput.subDistrictMunicipalAreaId}
                        onSelectGramPanchayat={handleGrampanchayat}
                        defaultSelectGramPanchayatWardId={handleGrampanchayat}
                        isMandatory={true}
                      />
                    </FormControl>
                  )}
                  {selectedValue === 'V' && (
                    <FormControl fullWidth style={{ marginTop: '20px' }}>
                      <VillageList
                        selectedGramPanchayatId={formInput.gramPanchayatWardId}
                        onSelectVillage={handlevillage}
                        isMandatory={true}
                      />
                    </FormControl>
                  )}
                </TableCell>

                <TableCell style={{ border: '1px solid #000' }}>
                  <FormControl fullWidth style={{ marginTop: '20px' }}>
                    <StateList onSelectState={handleSelectState} isMandatory={true} />
                  </FormControl>
                  <FormControl fullWidth style={{ marginTop: '20px' }}>
                    <DistrictList
                      selectedStateId={stateId}
                      onSelectDistrict={handleDistTO}
                      defaultSelectedDistrict={districtId}
                      isMandatory={true}
                    />
                  </FormControl>

                  <FormControl fullWidth style={{ marginTop: '20px' }}>
                    <AreaList onSelectArea={handleAreaTO} selectedArea={formInput.ruralUrbanArea} isMandatory={true} />
                  </FormControl>

                  {(selectedValue === 'GP' || selectedValue === 'V') && (
                    <FormControl fullWidth style={{ marginTop: '20px' }}>
                      <SubDistrictList
                        selectedDistrictId={formInput.districtId}
                        selectedAreaId={formInput.ruralUrbanArea}
                        onSelectSubDistrict={handleSubDistTO}
                        isMandatory={true}
                      />
                    </FormControl>
                  )}
                  {selectedValue === 'V' && (
                    <FormControl fullWidth style={{ marginTop: '20px' }}>
                      <GramPanchayatList
                        selectedSubDistrictMunicipalAreaId={formInput.subDistrictMunicipalAreaId}
                        onSelectGramPanchayat={handleGrampanchayatTO}
                        defaultSelectGramPanchayatWardId={handleGrampanchayatTO}
                        isMandatory={true}
                      />
                    </FormControl>
                  )}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>

          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
            <Button type="submit" variant="contained" color="primary">
              Submit
            </Button>
          </div>
        </TableContainer>
      </form>

      <Backdrop open={loading} style={{ zIndex: 999, color: '#fff' }}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </div>
  );
}

export default MappingLocation;
