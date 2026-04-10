import React, { useState, useEffect, useReducer, forwardRef, useImperativeHandle } from 'react';
import MainCard from 'ui-component/cards/MainCard';
import { Grid, FormControl, Typography } from '@mui/material';
import StateList from 'components/form_components/StateList';
import DistrictList from 'components/form_components/DistrictList';
import AreaList from 'components/form_components/AreaList';
import SubDistrictList from 'components/form_components/SubDistrictList';
import GramPanchayatList from 'components/form_components/GramPanchayatList';
import VillageList from 'components/form_components/VillageList';
import HabitationList from 'components/form_components/HabitationList';

const HabitateCommon = forwardRef(({ validationLevel, onFormInputValuesChange }, ref) => {
  const [selectedState, setSelectedState] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedArea, setSelectedArea] = useState('');
  const [selectedSubDistrict, setSelectedSubDistrict] = useState('');
  const [selectedGramPanchayat, setSelectedGramPanchayat] = useState('');
  const [selectedVillage, setSelectedVillage] = useState('');
  const [selectedHabitation, setSelectedHabitation] = useState('');
  const [validateLevel, setValidateLevel] = useState('');
  const [valError, setValError] = useState('RJ');
  const [isRequired, setIsRequired] = useState(2);

  const [formInput, setFormInput] = useReducer((state, newState) => ({ ...state, ...newState }), {
    stateCode: selectedState,
    districtCode: selectedDistrict,
    ruralUrbanArea: selectedArea,
    subDistrictMunicipalAreaCode: selectedSubDistrict,
    gramPanchyatWardCode: selectedGramPanchayat,
    villageCode: selectedVillage,
    habitationCode: selectedHabitation
  });

  const handleSelectState = (selectedStatetId) => {
    setFormInput({ stateCode: selectedStatetId });
    setValError('RJ');
  };

  const handleSelectDistrict = (selectedDistrictId) => {
    setSelectedArea('');
    setSelectedDistrict(selectedDistrictId);
    setValError('RJ');
  };

  const handleSelectArea = (selectedAreaId) => {
    setSelectedSubDistrict('');
    setSelectedArea(selectedAreaId);
    setValError('RJ');
  };

  const handleSelectSubDistrict = (selectedSubDistrictId) => {
    setSelectedSubDistrict(selectedSubDistrictId);
    setValError('RJ');
  };

  const handleSelectGramPanchayat = (selectedGramPanchayatId) => {
    setSelectedGramPanchayat(selectedGramPanchayatId);
    setValError('RJ');
  };

  const handleSelectVillage = (selectedVillageId) => {
    setSelectedVillage(selectedVillageId);
    setValError('RJ');
  };

  const handleSelectedHabitation = (selectedHabitation) => {
    setSelectedHabitation(selectedHabitation);
    setValError('RJ');
  };

  useEffect(() => {
    setSelectedDistrict('');
    setSelectedArea('');
    setSelectedSubDistrict('');
    setSelectedGramPanchayat('');
    setSelectedVillage('');
    setSelectedHabitation('');
    setFormInput({ districtCode: selectedDistrict === '' ? null : selectedDistrict });
    setFormInput({ ruralUrbanArea: selectedArea === '' ? null : selectedArea });
    setFormInput({ subDistrictMunicipalAreaCode: selectedSubDistrict === '' ? null : selectedSubDistrict });
    setFormInput({ gramPanchyatWardCode: selectedGramPanchayat === '' ? null : selectedGramPanchayat });
    setFormInput({ villageCode: selectedVillage === '' ? null : selectedVillage });
    setFormInput({ habitationCode: selectedHabitation === '' ? null : selectedHabitation });
  }, [selectedState]);

  useEffect(() => {
    // setSelectedArea('');
    // setSelectedSubDistrict('');
    setSelectedGramPanchayat('');
    setSelectedVillage('');
    setSelectedHabitation('');
    setFormInput({ districtCode: selectedDistrict === '' ? null : selectedDistrict });
    setFormInput({ ruralUrbanArea: selectedArea === '' ? null : selectedArea });
    setFormInput({ subDistrictMunicipalAreaCode: selectedSubDistrict === '' ? null : selectedSubDistrict });
    setFormInput({ gramPanchyatWardCode: selectedGramPanchayat === '' ? null : selectedGramPanchayat });
    setFormInput({ villageCode: selectedVillage === '' ? null : selectedVillage });
    setFormInput({ habitationCode: selectedHabitation === '' ? null : selectedHabitation });
  }, [selectedDistrict]);

  useEffect(() => {
    // setSelectedSubDistrict('');
    setSelectedGramPanchayat('');
    setSelectedVillage('');
    setSelectedHabitation('');
    setFormInput({ ruralUrbanArea: selectedArea === '' ? null : selectedArea });
    setFormInput({ subDistrictMunicipalAreaCode: selectedSubDistrict === '' ? null : selectedSubDistrict });
    setFormInput({ gramPanchyatWardCode: selectedGramPanchayat === '' ? null : selectedGramPanchayat });
    setFormInput({ villageCode: selectedVillage === '' ? null : selectedVillage });
    setFormInput({ habitationCode: selectedHabitation === '' ? null : selectedHabitation });
  }, [selectedArea]);

  useEffect(() => {
    setSelectedGramPanchayat('');
    setSelectedVillage('');
    setSelectedHabitation('');
    setFormInput({ subDistrictMunicipalAreaCode: selectedSubDistrict === '' ? null : selectedSubDistrict });
    setFormInput({ gramPanchyatWardCode: selectedGramPanchayat === '' ? null : selectedGramPanchayat });
    setFormInput({ villageCode: selectedVillage === '' ? null : selectedVillage });
    setFormInput({ habitationCode: selectedHabitation === '' ? null : selectedHabitation });
  }, [selectedSubDistrict]);

  useEffect(() => {
    setSelectedVillage('');
    setSelectedHabitation('');
    setFormInput({ gramPanchyatWardCode: selectedGramPanchayat === '' ? null : selectedGramPanchayat });
    setFormInput({ villageCode: selectedVillage === '' ? null : selectedVillage });
    setFormInput({ habitationCode: selectedHabitation === '' ? null : selectedHabitation });
  }, [selectedGramPanchayat]);

  useEffect(() => {
    setSelectedHabitation('');
    setFormInput({ villageCode: selectedVillage === '' ? null : selectedVillage });
    setFormInput({ habitationCode: selectedHabitation === '' ? null : selectedHabitation });
  }, [selectedVillage]);

  useEffect(() => {
    setFormInput({ habitationCode: selectedHabitation === '' ? null : selectedHabitation });
  }, [selectedHabitation]);

  useEffect(() => {
    onFormInputValuesChange(formInput);
  }, [formInput, onFormInputValuesChange]);

  useEffect(() => {
    validateSelectedDropDown();
  }, []);

  useEffect(() => {
    validateSelectedDropDown;
  }, [valError]);

  useImperativeHandle(ref, () => ({
    validateSelectedDropDown: () => validateSelectedDropDown(validationLevel)
  }));

  const updateValidateLevel = () => {
    setValidateLevel(validationLevel);
  };

  useEffect(() => {
    updateValidateLevel();
  }, []);

  useEffect(() => {
    setIsRequired(
      validateLevel == 'H'
        ? 8
        : validateLevel == 'V'
        ? 7
        : validateLevel == 'GP'
        ? 6
        : validationLevel == 'SD'
        ? 5
        : validateLevel == 'A'
        ? 4
        : validateLevel == 'D'
        ? 3
        : validateLevel == 'S'
        ? 2
        : 1
    );
  }, [validationLevel, isRequired]);

  const validateSelectedDropDown = () => {
    if (
      (validateLevel == 'S' ||
        validateLevel == 'D' ||
        validateLevel == 'A' ||
        validateLevel == 'SD' ||
        validateLevel == 'GP' ||
        validateLevel == 'V' ||
        validateLevel == 'H') &&
      formInput.stateCode == null
    ) {
      setValError('S');
      return false;
    }

    if (
      (validateLevel == 'D' ||
        validateLevel == 'A' ||
        validateLevel == 'SD' ||
        validateLevel == 'GP' ||
        validateLevel == 'V' ||
        validateLevel == 'H') &&
      formInput.districtCode == null
    ) {
      setValError('D');
      return false;
    }

    if (
      (validateLevel == 'A' || validateLevel == 'SD' || validateLevel == 'GP' || validateLevel == 'V' || validateLevel == 'H') &&
      formInput.ruralUrbanArea == null
    ) {
      setValError('A');
      return false;
    }

    if (
      (validateLevel == 'SD' || validateLevel == 'GP' || validateLevel == 'V' || validateLevel == 'H') &&
      formInput.subDistrictMunicipalAreaCode == null
    ) {
      setValError('SD');
      return false;
    }

    if ((validateLevel == 'GP' || validateLevel == 'V' || validateLevel == 'H') && formInput.gramPanchyatWardCode == null) {
      setValError('GP');
      return false;
    }

    if ((validateLevel == 'V' || validateLevel == 'H') && formInput.villageCode == null) {
      setValError('V');
      return false;
    }

    if (validateLevel == 'H' && formInput.habitationCode == null) {
      setValError('H');
      return false;
    }

    setValError('RJ');
    return 'RJ';
  };

  return (
    <div>
      <MainCard>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <StateList setSelectedState={setSelectedState} onSelectState={handleSelectState} isMendatory={1 < isRequired} />
              {(validateLevel == 'S' ||
                validateLevel == 'D' ||
                validateLevel == 'A' ||
                validateLevel == 'SD' ||
                validateLevel == 'GP' ||
                validateLevel == 'V' ||
                validateLevel == 'H') &&
                valError == 'S' && (
                  <Typography id="verdate-error-text" color="error" variant="caption">
                    State is required
                  </Typography>
                )}
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <DistrictList
                selectedStateId={formInput.stateCode}
                setSelectedDistrict={setSelectedDistrict}
                onSelectDistrict={handleSelectDistrict}
                isMendatory={2 < isRequired}
              />
              {(validateLevel == 'D' ||
                validateLevel == 'A' ||
                validateLevel == 'SD' ||
                validateLevel == 'GP' ||
                validateLevel == 'V' ||
                validateLevel == 'H') &&
                valError == 'D' && (
                  <Typography id="verdate-error-text" color="error" variant="caption">
                    District is required
                  </Typography>
                )}
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <AreaList
                selectedDistrict={selectedDistrict}
                selectedArea={selectedArea}
                onSelectArea={handleSelectArea}
                isMendatory={3 < isRequired}
              />
              {(validateLevel == 'A' || validateLevel == 'SD' || validateLevel == 'GP' || validateLevel == 'V' || validateLevel == 'H') &&
                valError == 'A' && (
                  <Typography id="verdate-error-text" color="error" variant="caption">
                    Area is required
                  </Typography>
                )}
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <SubDistrictList
                defaultSelectedSubDistrict={selectedSubDistrict}
                selectedAreaId={selectedArea}
                selectedDistrictId={selectedDistrict}
                setSelectedSubDistrict={setSelectedSubDistrict}
                onSelectSubDistrict={handleSelectSubDistrict}
                isMendatory={4 < isRequired}
              />
              {(validateLevel == 'SD' || validateLevel == 'GP' || validateLevel == 'V' || validateLevel == 'H') && valError == 'SD' && (
                <Typography id="verdate-error-text" color="error" variant="caption">
                  Sub District is required
                </Typography>
              )}
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <GramPanchayatList
                selectedSubDistrictMunicipalAreaId={selectedSubDistrict}
                setSelectedGramPanchayat={setSelectedGramPanchayat}
                onSelectGramPanchayat={handleSelectGramPanchayat}
                isMendatory={5 < isRequired}
              />
              {(validateLevel == 'GP' || validateLevel == 'V' || validateLevel == 'H') && valError == 'GP' && (
                <Typography id="verdate-error-text" color="error" variant="caption">
                  GramPanchayat is required
                </Typography>
              )}
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <VillageList
                selectedGramPanchayatId={selectedGramPanchayat}
                setSelectedVillage={setSelectedVillage}
                onSelectVillage={handleSelectVillage}
                isMendatory={6 < isRequired}
              />
              {(validateLevel == 'V' || validateLevel == 'H') && valError == 'V' && (
                <Typography id="verdate-error-text" color="error" variant="caption">
                  Village is required
                </Typography>
              )}
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <HabitationList
                selectedVillageId={selectedVillage}
                selectedHabitation={selectedHabitation}
                onSelectHabitation={handleSelectedHabitation}
                isMendatory={7 < isRequired}
              />
              {validateLevel == 'H' && valError == 'H' && (
                <Typography id="verdate-error-text" color="error" variant="caption">
                  Habitation is required
                </Typography>
              )}
            </FormControl>
          </Grid>
        </Grid>
      </MainCard>
    </div>
  );
});

export default HabitateCommon;

//Awesome Feature

// import HabitateCommon from 'components/common/HabitateCommon'

// const [locationOptionValues,setLocationOptionValues]= useState({});

// const handleLocationValuesChange = (newLocOptionValues) => {
//   setLocationOptionValues(newLocOptionValues);
// };

// <div>
//    <HabitateCommon onFormInputValuesChange={handleLocationValuesChange} />
// </div>
