import React, { useState, useEffect } from 'react';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import axiosInstance from 'hooks/useAuthTokenUrl';
const AllCenterSchemebyState = ({ selectedStateCode, onSelectScheme, isMendatory, defaultSelectedScheme }) => {
  const [schemes, setSchemes] = useState([]);
  const [selectedScheme, setSelectedScheme] = useState('');

  useEffect(() => {
    // Fetch Scheme from your API
    const fetchSchemes = async () => {
      try {
        const getUrl = `/common/findAllSchemeByStateCodeAndType/${selectedStateCode}`;
        const response = await axiosInstance.get(getUrl);
        const data = await response.data;
       
        setSchemes(data);
      } catch (error) {
        console.error('Error fetching Scheme:', error);
      }
    };

    fetchSchemes();
    if (defaultSelectedScheme !== undefined && defaultSelectedScheme !== null) {
      setSelectedScheme(defaultSelectedScheme);
    }
  }, [selectedStateCode, defaultSelectedScheme]);

  const handleSchemeChange = (event) => {
    const schemeId = event.target.value;
    setSelectedScheme(schemeId);
    onSelectScheme(schemeId);
  };

  return (
    <FormControl>
      <InputLabel id="Scheme-label">Scheme Code&nbsp;{isMendatory && <span style={{ color: 'red' }}>*</span>}</InputLabel>
      <Select
        labelId="Scheme-label"
        id="schemeCode"
        label="Scheme-label"
        name="schemeCode"
        value={selectedScheme}
        onChange={handleSchemeChange}
      >
        {schemes.map((item) => (
          <MenuItem key={item.schemeCode} value={item.schemeCode}>
            {item.schemeShortName}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default AllCenterSchemebyState;
