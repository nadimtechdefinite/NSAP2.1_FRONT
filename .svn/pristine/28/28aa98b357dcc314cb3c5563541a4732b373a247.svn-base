import React, { useState, useEffect } from 'react';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import axios from 'axios';
import config from 'config';
const FinancialYearList = ({ onSelectFinYear, isMendatory, defaultValueFinYear }) => {
  const apiBaseUrl = config.API_BASE_URL;
  const [data, setData] = useState([]);
  const [selectedFinYearCode, setSelectedFinYearCode] = useState('');
  useEffect(() => {
    const fetchData = async () => {
      try {
        const getUrl = `${apiBaseUrl}/findAllFinYearList`;
        const response = await axios.get(getUrl);
        setData(response.data);
      } catch (error) {
        console.error('Error fetching states:', error);
      }
    };
    fetchData();
    if (defaultValueFinYear === '') {
      setSelectedFinYearCode(defaultValueFinYear);
    }
  }, [onSelectFinYear]);

  const handleChange = (event) => {
    const finyearcode = event.target.value;
    setSelectedFinYearCode(finyearcode);
    onSelectFinYear(finyearcode);
  };

  return (
    <FormControl>
      <InputLabel id="State-label">Select Year&nbsp;{isMendatory && <span style={{ color: 'red' }}>*</span>}</InputLabel>
      <Select
        labelId="Finyearcode-label"
        id="finyearcode"
        label="Select Year"
        name="finyearcode"
        value={selectedFinYearCode}
        onChange={handleChange}
      >
        {data.map((item) => (
          <MenuItem key={item.finyear} value={item.finyear} onClick={() => onSelectFinYear(item.finyear)}>
            {item.finyear}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default FinancialYearList;
