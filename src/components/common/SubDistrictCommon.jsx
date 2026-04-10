import React, { useState, useEffect, useReducer, forwardRef, useImperativeHandle } from 'react';
import MainCard from 'ui-component/cards/MainCard';
import { Grid, FormControl, Typography } from '@mui/material';
import StateList from 'components/form_components/StateList';
import DistrictList from 'components/form_components/DistrictList';
import AreaList from 'components/form_components/AreaList';
import SubDistrictList from 'components/form_components/SubDistrictList';

const SubDistrictCommon = forwardRef(({ validationLevel, onFormInputValuesChange }, ref) => {
  const [selectedState, setSelectedState] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedArea, setSelectedArea] = useState('');
  const [selectedSubDistrict, setSelectedSubDistrict] = useState('');
  const [validateLevel, setValidateLevel] = useState('');
  const [valError, setValError] = useState('RJ');
  const [isRequired, setIsRequired] = useState(2);

  const [formInput, setFormInput] = useReducer((state, newState) => ({ ...state, ...newState }), {
    stateCode: selectedState,
    districtCode: selectedDistrict,
    ruralUrbanArea: selectedArea,
    subDistrictMunicipalAreaCode: selectedSubDistrict
  });

  const handleSelectState = (selectedStatetId) => {
    setFormInput({ stateCode: selectedStatetId });
    setValError('RJ');
    // setSelectedDistrict('');
  };

  const handleSelectDistrict = (selectedDistrictId) => {
    setSelectedArea('');
    setSelectedDistrict(selectedDistrictId);
    setValError('RJ');
    // setFormInput({ districtCode: selectedDistrictId });
  };
  const handleSelectArea = (selectedAreaId) => {
    setSelectedSubDistrict('');
    setSelectedArea(selectedAreaId);
    setValError('RJ');
    // setFormInput({ ruralUrbanArea: selectedAreaId });
  };
  const handleSelectSubDistrict = (selectedSubDistrictId) => {
    setSelectedSubDistrict(selectedSubDistrictId);
    setValError('RJ');
    // setFormInput({ subDistrictMunicipalAreaCode: selectedSubDistrictId });
  };

  useEffect(() => {
    setSelectedDistrict('');
    setSelectedArea('');
    setSelectedSubDistrict('');
    setFormInput({ districtCode: selectedDistrict == '' ? null : selectedDistrict });
    setFormInput({ ruralUrbanArea: selectedArea == '' ? null : selectedArea });
    setFormInput({ subDistrictMunicipalAreaCode: selectedSubDistrict == '' ? null : selectedSubDistrict });
  }, [selectedState]);

  useEffect(() => {
    //setSelectedSubDistrict('');
    setFormInput({ districtCode: selectedDistrict == '' ? null : selectedDistrict });
    setFormInput({ ruralUrbanArea: selectedArea == '' ? null : selectedArea });
    setFormInput({ subDistrictMunicipalAreaCode: selectedSubDistrict == '' ? null : selectedSubDistrict });
  }, [selectedDistrict]);

  useEffect(() => {
    // setSelectedSubDistrict('');
    setFormInput({ ruralUrbanArea: selectedArea == '' ? null : selectedArea });
  }, [selectedArea]);

  useEffect(() => {
    setFormInput({ subDistrictMunicipalAreaCode: selectedSubDistrict == '' ? null : selectedSubDistrict });
  }, [selectedSubDistrict]);

  useEffect(() => {}, [formInput]);

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
    console.log(validationLevel);
  };

  useEffect(() => {
    updateValidateLevel();
  }, []);

  useEffect(() => {
    setIsRequired(validationLevel == 'SD' ? 5 : validateLevel == 'A' ? 4 : validateLevel == 'D' ? 3 : validateLevel == 'S' ? 2 : 1);
  }, [validationLevel, isRequired]);

  const validateSelectedDropDown = () => {
    if ((validateLevel == 'S' || validateLevel == 'D' || validateLevel == 'A' || validateLevel == 'SD') && formInput.stateCode == null) {
      setValError('S');
      return false;
    }

    if ((validateLevel == 'D' || validateLevel == 'A' || validateLevel == 'SD') && formInput.districtCode == null) {
      setValError('D');
      return false;
    }

    if ((validateLevel == 'A' || validateLevel == 'SD') && formInput.ruralUrbanArea == null) {
      setValError('A');
      return false;
    }

    if (validateLevel == 'SD' && formInput.subDistrictMunicipalAreaCode == null) {
      setValError('SD');
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
              {(validateLevel == 'S' || validationLevel == 'D' || validateLevel == 'A' || validationLevel == 'SD') && valError == 'S' && (
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
              {(validationLevel == 'D' || validateLevel == 'A' || validationLevel == 'SD') && valError == 'D' && (
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
              {(validateLevel == 'D' || validateLevel == 'A' || validateLevel == 'SD') && valError == 'A' && (
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
              {validationLevel == 'SD' && valError == 'SD' && (
                <Typography id="verdate-error-text" color="error" variant="caption">
                  Sub District is required
                </Typography>
              )}
            </FormControl>
          </Grid>
        </Grid>
      </MainCard>
    </div>
  );
});
export default SubDistrictCommon;

//Awesome Feature

// import SubDistrictCommon from 'components/common/SubDistrictCommon'

// const [locationOptionValues,setLocationOptionValues]= useState({});

// const subDistrictCommonRef = React.createRef();

// const handleLocationValuesChange = (newLocOptionValues) => {
//   setLocationOptionValues(newLocOptionValues);
// };

// if You want to use validation function with search option validation
// if (subDistrictCommonRef.current && !(Object.values(optionValues).some(value => value !== null))) {
//   if(subDistrictCommonRef.current.validateSelectedDropDown()!='RJ'){
//     return false;
//   }
// }

// <div>
//              <SubDistrictCommon   ref={subDistrictCommonRef}  validationLevel={'D'}  onFormInputValuesChange={handleLocationValuesChange} />

// </div>
