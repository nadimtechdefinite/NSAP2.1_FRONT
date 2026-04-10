import React, { useState, useEffect } from 'react';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import axios from 'axios';
import config from 'config';
const MonthList = ({ onSelectMonth, isMendatory, defaultValueMonth }) => {
  const apiBaseUrl = config.API_BASE_URL;
  const [data, setData] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState('');
  useEffect(() => {
    const fetchData = async () => {
      try {
        const getUrl = `${apiBaseUrl}/findAllMonthList`;
        const response = await axios.get(getUrl);
        setData(response.data);
      } catch (error) {
        console.error('Error fetching states:', error);
      }
    };
    fetchData();
    if (defaultValueMonth === '') {
      setSelectedMonth(defaultValueMonth);
    }
  }, [onSelectMonth]);

  const handleChange = (event) => {
    const monthValue = event.target.value;
    setSelectedMonth(monthValue);
    onSelectMonth(monthValue);
  };

  return (
    <FormControl>
      <InputLabel id="monthCode-label">Select Month&nbsp;{isMendatory && <span style={{ color: 'red' }}>*</span>}</InputLabel>
      <Select labelId="monthCode-label" id="monthCode" label="Select Month" name="monthCode" value={selectedMonth} onChange={handleChange}>
        {data.map((item) => (
          <MenuItem key={item.monthName} value={item.monthName} onClick={() => onSelectMonth(item.monthName)}>
            {item.monthName}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default MonthList;
