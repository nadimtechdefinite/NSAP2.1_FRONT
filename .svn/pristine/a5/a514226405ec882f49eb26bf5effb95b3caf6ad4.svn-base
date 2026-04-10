import React, { useState, useEffect } from 'react';
import { FormControl, InputLabel, Select, MenuItem, FormHelperText } from '@mui/material';
import axiosInstance from 'hooks/useAuthTokenUrl';

const DistrictList = ({ selectedStateId, onSelectDistrict, defaultSelectedDistrict, isMandatory }) => {
  const [districts, setDistricts] = useState([]);
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [error, setError] = useState(false);

  const fetchDistrictsByStateId = async () => {
    try {
      const getUrl = `/common/findAllDistrictByStateCode/${selectedStateId}`;
      const response = await axiosInstance.get(getUrl);
      setDistricts(response.data);
      if (response.data.length === 1) {
        setSelectedDistrict(response.data[0].districtId);
        onSelectDistrict(response.data[0].districtId);
      }
    } catch (error) {
      console.error('Error fetching Districts by state ID:', error);
    }
  };
  useEffect(() => {
    if (selectedStateId) {
      fetchDistrictsByStateId();
    }
  }, [selectedStateId]);

  useEffect(() => {
    if (defaultSelectedDistrict) {
      setSelectedDistrict(defaultSelectedDistrict);
    } else if (defaultSelectedDistrict !== undefined && defaultSelectedDistrict !== null && defaultSelectedDistrict === '') {
      setSelectedDistrict(defaultSelectedDistrict);
    }
  }, [defaultSelectedDistrict]);

  const handleDistrictChange = (event) => {
    const districtId = event.target.value;
    setSelectedDistrict(districtId);
    onSelectDistrict(districtId);
  };
  const validateState = () => {
    if (isMandatory && !selectedDistrict) {
      setError(true);
      return false;
    }
    setError(false);
    return true;
  };
  return (
    <FormControl>
      <InputLabel id="district-label">District&nbsp;{isMandatory && <span style={{ color: 'red' }}>*</span>}</InputLabel>
      <Select
        labelId="district-label"
        id="districtId"
        label="District"
        name="districtId"
        value={selectedDistrict}
        onChange={handleDistrictChange}
        onBlur={validateState}
        required={isMandatory}
        readOnly={districts.length === 1}
      >
        <MenuItem value="">
          <em>Select District</em>
        </MenuItem>
        {districts.map((item) => (
          <MenuItem key={item.districtId} value={item.districtId}>
            {item.districtName}
          </MenuItem>
        ))}
      </Select>
      {error && <FormHelperText>This field is required.</FormHelperText>}
    </FormControl>
  );
};

export default DistrictList;
