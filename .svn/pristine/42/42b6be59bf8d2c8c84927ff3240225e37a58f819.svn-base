import React, { useState, useEffect } from 'react';
import { FormControl, InputLabel, Select, MenuItem, FormHelperText } from '@mui/material';
import axiosInstance from 'hooks/useAuthTokenUrl';
import { getUserInfo } from 'utils/storageUtils';
const SubDistrictList = (props) => {
  const [subdistricts, setSubDistricts] = useState([]);
  const [selectedSubDistrict, setSelectedSubDistrict] = useState('');
  const [error, setError] = useState(false);
  const [subDistUser, setSubDistUser] = useState(false);

  useEffect(() => {
    const userInfo = getUserInfo();
    if (userInfo.userLevel === 4) {
      setSubDistUser(true);
    }
  }, []);
  const fetchSubDistrictsByDistrictIdAndAreaId = async () => {
    try {
      const getUrl = `/common/findAllSubDistrictByDistrictCodeAndAreaCode/${props.selectedDistrictId}/${props.selectedAreaId}`;
      const response = await axiosInstance.get(getUrl);
      setSubDistricts(response.data);
      if (response.data.length === 1 && subDistUser === true) {
        setSelectedSubDistrict(response.data[0].subDistrictMunicipalAreaId);
        props.onSelectSubDistrict(response.data[0].subDistrictMunicipalAreaId);
      }
    } catch (error) {
      console.error('Error fetching Sub District:', error);
    }
  };
  useEffect(() => {
    if (props.selectedDistrictId && props.selectedAreaId) {
      setSelectedSubDistrict('');
      fetchSubDistrictsByDistrictIdAndAreaId();
    }
    if (props.selectedDistrictId && props.selectedAreaId === '') {
      setSelectedSubDistrict('');
      setSubDistricts([]);
      props.onSelectSubDistrict('');
    }
  }, [props.selectedDistrictId, props.selectedAreaId]);

  useEffect(() => {
    if (props.defaultSelectedSubDistrict) {
      setSelectedSubDistrict(props.defaultSelectedSubDistrict);
      props.onSelectSubDistrict(props.defaultSelectedSubDistrict);
    }
    if (props.defaultSelectedSubDistrict === '') {
      setSelectedSubDistrict(props.defaultSelectedSubDistrict);
      props.onSelectSubDistrict(props.defaultSelectedSubDistrict);
    }
  }, [props.defaultSelectedSubDistrict]);

  const handleSubDistrictChange = (event) => {
    setSelectedSubDistrict(event.target.value);
    props.onSelectSubDistrict(event.target.value);
  };

  const validateState = () => {
    if (props.isMandatory && !selectedSubDistrict) {
      setError(true);
      return false;
    }
    setError(false);
    return true;
  };

  return (
    <FormControl>
      <InputLabel id="sub-district-label">Sub District&nbsp;{props.isMandatory && <span style={{ color: 'red' }}>*</span>}</InputLabel>
      <Select
        labelId="sub-district-label"
        id="subDistrictMunicipalAreaId"
        label="Sub District"
        name="subDistrictMunicipalAreaId"
        value={selectedSubDistrict}
        onChange={handleSubDistrictChange}
        onBlur={validateState}
        required={props.isMandatory}
        readOnly={subDistUser}
      >
        <MenuItem value="">
          <em>Select Sub District</em>
        </MenuItem>
        {subdistricts.map((item) => (
          <MenuItem
            key={item.subDistrictMunicipalAreaId}
            value={item.subDistrictMunicipalAreaId}
            onClick={() => props.onSelectSubDistrict(item.subDistrictMunicipalAreaId)}
          >
            {item.subDistrictMunicipalAreaName}
          </MenuItem>
        ))}
      </Select>
      {error && <FormHelperText>This field is required.</FormHelperText>}
    </FormControl>
  );
};

export default SubDistrictList;
