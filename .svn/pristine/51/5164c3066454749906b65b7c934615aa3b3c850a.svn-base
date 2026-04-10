import React, { useState, useEffect } from 'react';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import axiosInstance from 'hooks/useAuthTokenUrl';
const FinancialYearList = ({ onSelectFinYear, isMendatory, defaultFinYear }) => {
  const [finYearList, setFinYearList] = useState([]);
  const [selectedFinYear, setSelectedFinYear] = useState('');

  useEffect(() => {
    // Fetch Scheme from your API
    const fetchFinancialYearList = async () => {
      try {
        const getUrl = '/common/findAllFinYearListForAdmin';
        const response = await axiosInstance.get(getUrl);
        const data = await response.data;
        setFinYearList(data);
      } catch (error) {
        console.error('Error fetching Scheme:', error);
      }
    };

    fetchFinancialYearList();
  }, []);

  useEffect(() => {
    if (defaultFinYear === '') {
      setSelectedFinYear(defaultFinYear);
    }
  }, [defaultFinYear]);

  const handleFinYearChange = (event) => {
    const finYearCode = event.target.value;
    setSelectedFinYear(finYearCode);
    onSelectFinYear(finYearCode);
  };

  return (
    <FormControl>
      <InputLabel id="Financial-label">Financial Year&nbsp;{isMendatory && <span style={{ color: 'red' }}>*</span>}</InputLabel>
      <Select
        labelId="Financial-label"
        id="finYearCode"
        label="Financial-label"
        name="finYearCode"
        value={selectedFinYear}
        onChange={handleFinYearChange}
      >
        {finYearList.map((item) => (
          <MenuItem key={item.key} value={item.key}>
            {item.key}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default FinancialYearList;
