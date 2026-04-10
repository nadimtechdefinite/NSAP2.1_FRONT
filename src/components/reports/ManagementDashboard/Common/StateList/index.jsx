import React, { useState, useEffect } from 'react';
import { MenuItem, TextField, Typography } from '@mui/material';
import axios from 'axios';
import config from 'config';

const StateListManagementDashboard = ({ onSelectState, defaultStateCode }) => {
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
    if (defaultStateCode === '0') {
      setSelectedState(defaultStateCode);
    }
  }, [onSelectState]);

  const handleStateChange = (event) => {
    const stateId = event.target.value;
    setSelectedState(stateId);
    onSelectState(stateId);
  };

  return (
    <div>
      <Typography variant="h6" style={{ display: 'flex', alignItems: 'center' }}>
        State &nbsp;
        <TextField id="standard-select-currency" select value={selectedState} onChange={handleStateChange}>
          <MenuItem key={0} value={0}>
            All State
          </MenuItem>
          {states.map((item) => (
            <MenuItem key={item.stateId} value={item.stateId}>
              {item.stateName}
            </MenuItem>
          ))}
        </TextField>
      </Typography>
    </div>
  );
};

export default StateListManagementDashboard;
