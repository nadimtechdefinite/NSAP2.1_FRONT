import React, { useState, useEffect } from 'react';
import { FormControl, InputLabel, Select, MenuItem, FormHelperText } from '@mui/material';
import axiosInstance from 'hooks/useAuthTokenUrl';
const VillageList = (props) => {
  // const VillageList = ({ selectedGramPanchayatId,selectedVillage,setSelectedVillage, onSelectVillage}) => {
  const [villages, setvillages] = useState([]);
  const [selectedVillage, setSelectedVillage] = useState('');
  const [error, setError] = useState(false);

  // Fetch districts based on the selected state
  const fetchVillage = async () => {
    try {
      const getUrl = `/common/findAllVillageByGramPanchayat/${props.selectedGramPanchayatId}`;
      const response = await axiosInstance.get(getUrl);
      const data = await response.data;
      setvillages(data);
    } catch (error) {
      console.error('Error fetching districts:', error);
    }
  };
  useEffect(() => {
    if (props.selectedGramPanchayatId) {
      fetchVillage();
    }
    if (props.selectedGramPanchayatId === '') {
      setSelectedVillage('');
      setvillages([]);
      props.onSelectVillage('');
    }
  }, [props.selectedGramPanchayatId]);

  useEffect(() => {
    if (props.defaultSelectVillageId) {
      setSelectedVillage(props.defaultSelectVillageId);
      props.onSelectVillage(props.defaultSelectVillageId);
    }
    if (props.defaultSelectVillageId === '') {
      setSelectedVillage(props.defaultSelectVillageId);
      props.onSelectVillage(props.defaultSelectVillageId);
    }
  }, [props.defaultSelectVillageId]);

  const handleVillageChange = (event) => {
    setSelectedVillage(event.target.value);
    props.onSelectVillage(event.target.value);
  };

  const validateState = () => {
    if (props.isMandatory && !selectedVillage) {
      setError(true);
      return false;
    }
    setError(false);
    return true;
  };

  return (
    <FormControl>
      <InputLabel id="village-label">Village&nbsp;{props.isMandatory && <span style={{ color: 'red' }}>*</span>}</InputLabel>
      <Select
        labelId="village-label"
        id="villageId"
        label="Village"
        name="villageId"
        value={selectedVillage}
        onChange={handleVillageChange}
        onBlur={validateState}
        required={props.isMandatory}
        disabled={props.isDisabled}
      >
        <MenuItem value="">
          <em>Select Village</em>
        </MenuItem>
        {villages.map((item) => (
          <MenuItem key={item.villageId} value={item.villageId}>
            {item.villageName}
          </MenuItem>
        ))}
      </Select>
      {error && <FormHelperText>This field is required.</FormHelperText>}
    </FormControl>
  );
};

export default VillageList;
