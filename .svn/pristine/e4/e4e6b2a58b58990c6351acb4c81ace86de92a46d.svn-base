import React, { useState, useEffect } from 'react';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import axios from 'axios';
import config from 'config';
const StateList = ({ onSelectState, isMendatory, defaultStateCode }) => {
  const apiBaseUrl = config.API_BASE_URL;
  const [states, setStates] = useState([]);
  const [selectedState, setSelectedState] = useState('');

  useEffect(() => {
    const fetchStates = async () => {
      try {
        const getUrl = `${apiBaseUrl}/findAllStateList`;
        const response = await axios.get(getUrl);
        setStates(response.data);
      } catch (error) {
        console.error('Error fetching states:', error);
      }
    };
    fetchStates();
    if (defaultStateCode === '') {
      setSelectedState(defaultStateCode);
    }
  }, [onSelectState]);

  const handleStateChange = (event) => {
    const stateId = event.target.value;
    setSelectedState(stateId);
    onSelectState(stateId);
  };

  return (
    <FormControl>
      <InputLabel id="State-label">State&nbsp;{isMendatory && <span style={{ color: 'red' }}>*</span>}</InputLabel>
      <Select labelId="State-label" id="stateId" label="State" name="stateId" value={selectedState} onChange={handleStateChange}>
        {states.map((item) => (
          <MenuItem key={item.stateId} value={item.stateId} onClick={() => onSelectState(item.stateId)}>
            {item.stateName}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default StateList;
