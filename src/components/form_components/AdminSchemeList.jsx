import React, { useState, useEffect } from 'react';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import axiosInstance from 'hooks/useAuthTokenUrl';
const AdminSchemeList = ({ onSelectScheme, isMendatory, defaultSchemeCode }) => {
  const [schemes, setSchemes] = useState([]);
  const [selectedScheme, setSelectedScheme] = useState('');

  useEffect(() => {
    // Fetch Scheme from your API
    const fetchSchemes = async () => {
      try {
        const getUrl = '/common/findAllSchemeListForAdminUser';
        const response = await axiosInstance.get(getUrl);
        const data = await response.data;
        const allCentreSchemes = {
          key: 'ALL',
          value: 'ALL'
        };
        data.unshift(allCentreSchemes);
        setSchemes(data);
      } catch (error) {
        console.error('Error fetching Scheme:', error);
      }
    };

    fetchSchemes();
  }, []);

  useEffect(() => {
    if (defaultSchemeCode === '') {
      setSelectedScheme(defaultSchemeCode);
    }
  }, [defaultSchemeCode]);

  const handleSchemeChange = (event) => {
    const schemeId = event.target.value;
    setSelectedScheme(schemeId);
    onSelectScheme(schemeId);
  };

  return (
    <FormControl>
      <InputLabel id="Scheme-label">Scheme Name&nbsp;{isMendatory && <span style={{ color: 'red' }}>*</span>}</InputLabel>
      <Select
        labelId="Scheme-label"
        id="schemeCode"
        label="Scheme-label"
        name="schemeCode"
        value={selectedScheme}
        onChange={handleSchemeChange}
      >
        {schemes.map((item) => (
          <MenuItem key={item.key} value={item.key}>
            {item.key}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default AdminSchemeList;
