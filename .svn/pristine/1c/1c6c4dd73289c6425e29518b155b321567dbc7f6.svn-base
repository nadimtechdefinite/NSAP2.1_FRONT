import React, { useState, useEffect } from 'react';
import { FormControl, InputLabel, Select, MenuItem, FormHelperText } from '@mui/material';
import axiosInstance from 'hooks/useAuthTokenUrl';
const GramPanchayatList = (props) => {
  const [gramPanchayats, setGramPanchayats] = useState([]);
  const [selectedGramPanchayat, setSelectedGramPanchayat] = useState('');
  const [error, setError] = useState(false);
  // Fetch districts based on the selected state
  const fetchGramPanchayat = async () => {
    try {
      const getUrl = `/common/findAllGramPanchayatBySubDistrict/${props.selectedSubDistrictMunicipalAreaId}`;
      const response = await axiosInstance.get(getUrl);
      const data = await response.data;
      setGramPanchayats(data);
    } catch (error) {
      console.error('Error fetching find All Gram Panchayat By Sub District : ', error);
    }
  };
  useEffect(() => {
    if (props.selectedSubDistrictMunicipalAreaId) {
      fetchGramPanchayat();
    }
    if (props.selectedSubDistrictMunicipalAreaId === '') {
      setSelectedGramPanchayat('');
      setGramPanchayats([]);
      props.onSelectGramPanchayat('');
    }
  }, [props.selectedSubDistrictMunicipalAreaId]);

  useEffect(() => {
    if (props.defaultSelectGramPanchayatWardId) {
      setSelectedGramPanchayat(props.defaultSelectGramPanchayatWardId);
      props.onSelectGramPanchayat(props.defaultSelectGramPanchayatWardId);
    }
    if (props.defaultSelectGramPanchayatWardId === '') {
      setSelectedGramPanchayat(props.defaultSelectGramPanchayatWardId);
      props.onSelectGramPanchayat(props.defaultSelectGramPanchayatWardId);
    }
  }, [props.defaultSelectGramPanchayatWardId]);

  const handleGramPanchayatChange = (event) => {
    setSelectedGramPanchayat(event.target.value);
    props.onSelectGramPanchayat(event.target.value);
  };

  const validateState = () => {
    if (props.isMandatory && !props.selectedGramPanchayat) {
      setError(true);
      return false;
    }
    setError(false);
    return true;
  };

  return (
    <FormControl>
      <InputLabel id="gram-panchayat-label">Gram Panchayat&nbsp;{props.isMandatory && <span style={{ color: 'red' }}>*</span>}</InputLabel>
      <Select
        labelId="gram-panchayat-label"
        id="gramPanchayatWardId"
        label="Gram Panchayat"
        name="gramPanchayatWardId"
        value={selectedGramPanchayat}
        onBlur={validateState}
        required={props.isMandatory}
        onChange={handleGramPanchayatChange}
      >
        <MenuItem value="">
          <em>Select Gram Panchayat</em>
        </MenuItem>
        {gramPanchayats.map((item) => (
          <MenuItem
            key={item.gramPanchayatWardId}
            value={item.gramPanchayatWardId}
            onClick={() => props.onSelectGramPanchayat(item.gramPanchayatWardId)}
          >
            {item.gramPanchayatWardName}
          </MenuItem>
        ))}
      </Select>
      {error && <FormHelperText>This field is required.</FormHelperText>}
    </FormControl>
  );
};

export default GramPanchayatList;
