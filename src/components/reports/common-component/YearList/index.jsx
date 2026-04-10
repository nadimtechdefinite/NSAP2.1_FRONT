import React, { useState, useEffect } from 'react';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import axios from 'axios';
import config from 'config';
const YearList = ({ onSelectYear, isMendatory, defaultValueYear }) => {
  const apiBaseUrl = config.API_BASE_URL;
  const [data, setData] = useState([]);
  const [selectedYearCode, setSelectedYearCode] = useState('');
  useEffect(() => {
    const fetchData = async () => {
      try {
        const getUrl = `${apiBaseUrl}/findAllYearList`;
        const response = await axios.get(getUrl);
        setData(response.data);
      } catch (error) {
        console.error('Error fetching states:', error);
      }
    };
    fetchData();
    if (defaultValueYear === '') {
      setSelectedYearCode(defaultValueYear);
    }
  }, [onSelectYear]);

  const handleChange = (event) => {
    const yearCode = event.target.value;
    setSelectedYearCode(yearCode);
    onSelectYear(yearCode);
  };

  return (
    <FormControl>
      <InputLabel id="YearCode-label">Select Year&nbsp;{isMendatory && <span style={{ color: 'red' }}>*</span>}</InputLabel>
      <Select labelId="YearCode-label" id="yearCode" label="Select Year" name="yearCode" value={selectedYearCode} onChange={handleChange}>
        {data.map((item) => (
          <MenuItem key={item.year} value={item.year} onClick={() => onSelectYear(item.year)}>
            {item.year}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default YearList;
