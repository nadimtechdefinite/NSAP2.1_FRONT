import React, { useState, useEffect, useReducer } from 'react';
import MainCard from 'ui-component/cards/MainCard';
import { Grid, FormControl, InputLabel, Select, MenuItem, Typography, FormHelperText } from '@mui/material';
import StateList from 'components/form_components/StateList';
import DistrictList from 'components/form_components/DistrictList';
import AreaList from 'components/form_components/AreaList';
import SubDistrictList from 'components/form_components/SubDistrictList';
import GramPanchayatList from 'components/form_components/GramPanchayatList';
import VillageList from 'components/form_components/VillageList';

const HabitationCommon = ({ onFormInputValuesChange, onTempApplicationTypeChange, formErrors, setFormErrors }) => {
  const [selectedState, setSelectedState] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedArea, setSelectedArea] = useState('');
  const [selectedSubDistrict, setSelectedSubDistrict] = useState('');
  const [selectedGramPanchayat, setSelectedGramPanchayat] = useState('');
  const [selectedVillage, setSelectedVillage] = useState('');
  const [selectedTempApplicationType, setSelectedTempApplicationType] = useState('All');
  //const [formErrors, setFormErrors] = useState({});

  const [formInput, setFormInput] = useReducer((state, newState) => ({ ...state, ...newState }), {
    stateCode: selectedState,
    districtCode: selectedDistrict,
    ruralUrbanArea: selectedArea,
    subDistrictMunicipalAreaCode: selectedSubDistrict,
    gramPanchayatWardCode: selectedGramPanchayat,
    villageCode: selectedVillage,
    tempApplicationType: selectedTempApplicationType
  });

  const handleSelectState = (selectedStatetId) => {
    setSelectedState(selectedStatetId);
    setFormInput({ stateCode: selectedStatetId });
  };

  const handleSelectDistrict = (selectedDistrictId) => {
    setSelectedDistrict(selectedDistrictId);
    setSelectedArea('');
    setFormErrors((prevErrors) => {
      const updatedErrors = { ...prevErrors };
      delete updatedErrors.districtId;
      return updatedErrors;
    });
  };

  const handleSelectArea = (selectedAreaId) => {
    setSelectedArea(selectedAreaId);
    setSelectedSubDistrict('');
    setFormErrors((prevErrors) => {
      const updatedErrors = { ...prevErrors };
      delete updatedErrors.ruralUrbanArea;
      return updatedErrors;
    });
  };

  const handleSelectSubDistrict = (selectedSubDistrictId) => {
    setSelectedSubDistrict(selectedSubDistrictId);
    setSelectedGramPanchayat('');
    setFormErrors((prevErrors) => {
      const updatedErrors = { ...prevErrors };
      delete updatedErrors.subDistrictMunicipalAreaId;
      return updatedErrors;
    });
  };

  const handleSelectGramPanchayat = (selectedGramPanchayatId) => {
    setSelectedGramPanchayat(selectedGramPanchayatId);
    setSelectedVillage('');
    setFormErrors((prevErrors) => {
      const updatedErrors = { ...prevErrors };
      delete updatedErrors.gramPanchayatWardId;
      return updatedErrors;
    });
  };

  const handleSelectVillage = (selectedVillageId) => {
    setSelectedVillage(selectedVillageId);
  };
  useEffect(() => {
    setSelectedDistrict('');
    setSelectedArea('');
    setSelectedSubDistrict('');
    setSelectedGramPanchayat('');
    setSelectedVillage('');
    setFormInput({ districtCode: selectedDistrict === '' ? null : selectedDistrict });
    setFormInput({ ruralUrbanArea: selectedArea === '' ? null : selectedArea });
    setFormInput({ subDistrictMunicipalAreaCode: selectedSubDistrict === '' ? null : selectedSubDistrict });
    setFormInput({ gramPanchayatWardCode: selectedGramPanchayat === '' ? null : selectedGramPanchayat });
    setFormInput({ villageCode: selectedVillage === '' ? null : selectedVillage });
  }, [selectedState]);

  useEffect(() => {
    //setSelectedArea('');
    //setSelectedSubDistrict('');
    //setSelectedGramPanchayat('');
    //setSelectedVillage('');
    setFormInput({ districtCode: selectedDistrict === '' ? null : selectedDistrict });
    setFormInput({ ruralUrbanArea: selectedArea === '' ? null : selectedArea });
    setFormInput({ subDistrictMunicipalAreaCode: selectedSubDistrict === '' ? null : selectedSubDistrict });
    setFormInput({ gramPanchayatWardCode: selectedGramPanchayat === '' ? null : selectedGramPanchayat });
    setFormInput({ villageCode: selectedVillage === '' ? null : selectedVillage });
  }, [selectedDistrict]);

  useEffect(() => {
    //setSelectedSubDistrict('');
    //setSelectedGramPanchayat('');
    //setSelectedVillage('');
    setFormInput({ ruralUrbanArea: selectedArea === '' ? null : selectedArea });
    setFormInput({ subDistrictMunicipalAreaCode: selectedSubDistrict === '' ? null : selectedSubDistrict });
    setFormInput({ gramPanchayatWardCode: selectedGramPanchayat === '' ? null : selectedGramPanchayat });
    setFormInput({ villageCode: selectedVillage === '' ? null : selectedVillage });
  }, [selectedArea]);

  useEffect(() => {
    setSelectedGramPanchayat('');
    setSelectedVillage('');
    setFormInput({ subDistrictMunicipalAreaCode: selectedSubDistrict === '' ? null : selectedSubDistrict });
    setFormInput({ gramPanchayatWardCode: selectedGramPanchayat === '' ? null : selectedGramPanchayat });
    setFormInput({ villageCode: selectedVillage === '' ? null : selectedVillage });
  }, [selectedSubDistrict]);

  useEffect(() => {
    setSelectedVillage('');
    setFormInput({ gramPanchayatWardCode: selectedGramPanchayat === '' ? null : selectedGramPanchayat });
    setFormInput({ villageCode: selectedVillage === '' ? null : selectedVillage });
  }, [selectedGramPanchayat]);

  useEffect(() => {
    setFormInput({ villageCode: selectedVillage === '' ? null : selectedVillage });
  }, [selectedVillage]);

  useEffect(() => {
    onFormInputValuesChange(formInput);
  }, [formInput, onFormInputValuesChange]);

  useEffect(() => {
    onTempApplicationTypeChange(selectedTempApplicationType);
  }, [selectedTempApplicationType, onTempApplicationTypeChange]);

  return (
    <div>
      <MainCard>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <StateList setSelectedState={setSelectedState} onSelectState={handleSelectState} isMandatory={true} />
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth className={formErrors.districtId ? 'error' : ''}>
              <DistrictList
                selectedStateId={selectedState}
                setSelectedDistrict={setSelectedDistrict}
                onSelectDistrict={handleSelectDistrict}
                isMandatory={true}
              />
              {formErrors.districtId && (
                <FormHelperText>
                  <Typography style={{ color: 'red', fontSize: '0.8rem' }}>{formErrors.districtId}</Typography>
                </FormHelperText>
              )}
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth className={formErrors.ruralUrbanArea ? 'error' : ''}>
              <AreaList
                selectedDistrict={selectedDistrict}
                selectedArea={selectedArea}
                onSelectArea={handleSelectArea}
                isMandatory={true}
              />
              {formErrors.ruralUrbanArea && (
                <FormHelperText>
                  <Typography style={{ color: 'red', fontSize: '0.8rem' }}>{formErrors.ruralUrbanArea}</Typography>
                </FormHelperText>
              )}
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth className={formErrors.subDistrictMunicipalAreaId ? 'error' : ''}>
              <SubDistrictList
                selectedAreaId={selectedArea}
                selectedDistrictId={selectedDistrict}
                setSelectedSubDistrict={setSelectedSubDistrict}
                onSelectSubDistrict={handleSelectSubDistrict}
                isMandatory={true}
              />
              {formErrors.subDistrictMunicipalAreaId && (
                <FormHelperText>
                  <Typography style={{ color: 'red', fontSize: '0.8rem' }}>{formErrors.subDistrictMunicipalAreaId}</Typography>
                </FormHelperText>
              )}
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth className={formErrors.gramPanchayatWardId ? 'error' : ''}>
              <GramPanchayatList
                selectedSubDistrictMunicipalAreaId={selectedSubDistrict}
                defaultSelectGramPanchayatWardId={selectedGramPanchayat}
                onSelectGramPanchayat={handleSelectGramPanchayat}
              />
              {formErrors.gramPanchayatWardId && (
                <FormHelperText>
                  <Typography style={{ color: 'red', fontSize: '0.8rem' }}>{formErrors.gramPanchayatWardId}</Typography>
                </FormHelperText>
              )}
            </FormControl>
          </Grid>

          {/* Village Code */}
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <VillageList
                selectedGramPanchayatId={selectedGramPanchayat}
                defaultSelectVillageId={selectedVillage}
                onSelectVillage={handleSelectVillage}
              />
            </FormControl>
          </Grid>

          {/* Temp Application Type */}
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              {/* Assuming tempApplicationType is a dropdown */}
              <InputLabel id="temp-application-type-label">Application Type</InputLabel>
              <Select
                labelId="temp-application-type-label"
                id="temp-application-type-select"
                value={selectedTempApplicationType}
                label="Temp Application Type"
                onChange={(e) => setSelectedTempApplicationType(e.target.value)}
              >
                <MenuItem value="">Select Type</MenuItem>
                <MenuItem value="TEMP_NEW">New Temp Application</MenuItem>
                {/* <MenuItem value="TEMP_SO_SAVED">Existing Temp Application</MenuItem> */}
                <MenuItem value="SO_SAVED">Sanctioned Beneficiary</MenuItem>
                <MenuItem value="NEW">New Application</MenuItem>
                {/* <MenuItem value="RETURNED">Rejected Application</MenuItem> */}
                {/* Add more options as needed */}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </MainCard>
    </div>
  );
};

export default HabitationCommon;
