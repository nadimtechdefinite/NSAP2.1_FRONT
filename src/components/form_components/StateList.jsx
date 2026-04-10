import React, { useState, useEffect } from 'react';
import { FormControl, InputLabel, Select, MenuItem, FormHelperText } from '@mui/material';
import axiosInstance from 'hooks/useAuthTokenUrl';

const StateList = ({ onSelectState, defaultSelectedState, isMandatory, showAllIndex }) => {
  const [states, setStates] = useState([]);
  const [selectedState, setSelectedState] = useState('');
  const [error, setError] = useState(false);

  // useEffect(() => {
  //   const fetchStates = async () => {
  //     try {
  //       const getUrl = '/common/findAllState';
  //       const response = await axiosInstance.get(getUrl);
  //       setStates(response.data);

  //       if (response.data.length === 1) {
  //         setSelectedState(response.data[0].stateId);
  //         onSelectState(response.data[0].stateId);
  //       } else if (defaultSelectedState && selectedState !== defaultSelectedState) {
  //         setSelectedState(selectedState);
  //         onSelectState(selectedState);
  //       }
  //     } catch (error) {
  //       console.error('Error fetching states:', error);
  //     }
  //   };

  //   if (states.length === 0 || (defaultSelectedState && selectedState !== defaultSelectedState)) {
  //     fetchStates();
  //   }
  // }, [defaultSelectedState, onSelectState, selectedState, states]);

  useEffect(() => {
  const fetchStates = async () => {
    try {
      const getUrl = '/common/findAllState';
      const response = await axiosInstance.get(getUrl);
      setStates(response.data);

      if (response.data.length === 1) {
        const stateId = response.data[0].stateId;
        setSelectedState(stateId);
        onSelectState(stateId);
      } else if (defaultSelectedState) {
        setSelectedState(defaultSelectedState);
        onSelectState(defaultSelectedState);
      }
    } catch (error) {
      console.error('Error fetching states:', error);
    }
  };

  fetchStates();
}, [defaultSelectedState]);

  // useEffect(() => {
  //   if (defaultSelectedState === '') {
  //     setSelectedState(defaultSelectedState);
  //   }
  // }, [defaultSelectedState]);

    useEffect(() => {
    if (defaultSelectedState === '') {
      setSelectedState('');
    }
  }, [defaultSelectedState]);

  const handleStateChange = (event) => {
    const stateId = event.target.value;
    setSelectedState(stateId);
    onSelectState(stateId);
    setError(false);
  };

  const validateState = () => {
    if (isMandatory && !selectedState && selectedState !== 'ALL') {
      setError(true);
      return false;
    }
    setError(false);
    return true;
  };

  return (
    <FormControl error={error} fullWidth>
      <InputLabel id="State-label">State {isMandatory && <span style={{ color: 'red' }}>*</span>}</InputLabel>
      <Select
        labelId="State-label"
        id="stateId"
        name="stateId"
        value={selectedState}
        onChange={handleStateChange}
        onBlur={validateState} // Validate on blur to show error immediately after leaving the field
        label="State"
        required={isMandatory}
        readOnly={states.length === 1 ? true : false}
      >
        <MenuItem value="">
          <em>Select State</em>
        </MenuItem>
        {showAllIndex && (
          <MenuItem key={'0'} value={'ALL'}>
            ALL
          </MenuItem>
        )}
        {states.map((item) => (
          <MenuItem key={item.stateId} value={item.stateId}>
            {item.stateName}
          </MenuItem>
        ))}
      </Select>
      {error && <FormHelperText>This field is required.</FormHelperText>}
    </FormControl>
  );
};

export default StateList;
