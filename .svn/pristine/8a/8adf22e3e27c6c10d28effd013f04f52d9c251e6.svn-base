import React, { useState, useEffect } from 'react';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import axiosInstance from 'hooks/useAuthTokenUrl';

const SubDistrictbyArea = ({ selectedDistrictId, selectedArea, onSelectSubDistrict }) => {
  const [subdistricts, setSubDistricts] = useState([]);
  const [selectedSubDistrict, setSelectedSubDistrict] = useState('');

  useEffect(() => {
    const fetchSubDistrictsByDistrictId = async () => {
      try {
        const getUrl = `/common/findAllSubDistrictByDistrictIdandArea/${selectedDistrictId}/${selectedArea}`;
        const response = await axiosInstance.get(getUrl);
        setSubDistricts(response.data);
      } catch (error) {
        console.error('Error fetching Sub District:', error);
      }
    };

    if (selectedArea) {
      setSelectedSubDistrict('');
      console.log('select sub district1234' + selectedDistrictId);
      fetchSubDistrictsByDistrictId();
    } else {
      setSubDistricts([]);
      setSelectedSubDistrict('');
    }
  }, [selectedArea]);

  const handleSubDistrictChange = (event) => {
    setSelectedSubDistrict(event.target.value);
    onSelectSubDistrict(event.target.value);
  };

  return (
    <FormControl>
      <InputLabel id="sub-district-label">Sub District</InputLabel>
      <Select
        labelId="sub-district-label"
        id="subDistrictMunicipalAreaId"
        label="sub-district-label"
        name="subDistrictMunicipalAreaId"
        value={selectedSubDistrict || ''}
        onChange={handleSubDistrictChange}
      >
        <MenuItem value="" disabled>
          Select Sub District
        </MenuItem>
        {subdistricts.map((subdistrict) => (
          <MenuItem
            key={subdistrict.subDistrictMunicipalAreaId}
            value={subdistrict.subDistrictMunicipalAreaId}
            onClick={() => onSelectSubDistrict(subdistrict)}
          >
            {subdistrict.subDistrictMunicipalAreaName}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default SubDistrictbyArea;
