import React, { useState, useEffect } from 'react';
import { FormControl, InputLabel, Select, MenuItem, InputAdornment, Typography, FormHelperText } from '@mui/material';
import axiosInstance from 'hooks/useAuthTokenUrl';
const SchemeList = ({ onSelectScheme, defaultSelectedScheme ,isMandatory }) => {
  const [schemes, setSchemes] = useState([]);
  const [selectedScheme, setSelectedScheme] = useState('ALL');
  const [error, setError] = useState(false);

  useEffect(() => {
    // Fetch Scheme from your API
    const fetchSchemes = async () => {
      try {
        const getUrl = '/common/findAllScheme';
        const response = await axiosInstance.get(getUrl);
        const data = await response.data;
           const schemesWithAll = [{ schemeCode: 'ALL', schemeShortName: 'ALL' }, ...data];
        setSchemes(schemesWithAll);

        if (schemesWithAll.length === 1) {
          setSelectedScheme(schemesWithAll[0].schemeCode);
          onSelectScheme(schemesWithAll[0].schemeCode);
        } else if (defaultSelectedScheme && selectedScheme !== defaultSelectedScheme) {
          setSelectedScheme(defaultSelectedScheme);
          onSelectScheme(defaultSelectedScheme);
        }
      } catch (error) {
        console.error('Error fetching Scheme:', error);
      }
    };

    fetchSchemes();
  }, [defaultSelectedScheme]);

  const handleSchemeChange = (event) => {
    const schemeId = event.target.value;
    setSelectedScheme(schemeId);
    onSelectScheme(schemeId);
  };


  const validateState = () => {
    if (isMandatory && !selectedScheme) {
      setError(true);
      return false;
    }
    setError(false);
    return true;
  };


  return (
    <FormControl>
      <InputLabel id="Scheme-label">Scheme Code</InputLabel>
      <Select
        labelId="Scheme-label"
        id="schemeCode"
        label="Scheme-label"
        name="schemeCode"
        value={selectedScheme}
        onChange={handleSchemeChange}
        onBlur={validateState}
        required={isMandatory}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <Typography variant="h3" color="error">
                *
              </Typography>
            </InputAdornment>
          )
        }}
      >
        {schemes.map((item) => (
          <MenuItem key={item.schemeCode} value={item.schemeCode} onClick={() => onSelectScheme(item.schemeCode)}>
            {item.schemeShortName}
          </MenuItem>
        ))}
      </Select>
      {error && <FormHelperText>This field is required.</FormHelperText>}
    </FormControl>
  );
};

export default SchemeList;
