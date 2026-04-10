import React, { useState, useEffect } from 'react';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import axiosInstance from 'hooks/useAuthTokenUrl';

const MonthList = ({ onSelectMonth, isMendatory, defaultSelectedMonth }) => {
  const [months, setMonths] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState('');
  const fetchMonth = async () => {
    try {
      const getUrl = '/common/findAllMonth';
      const response = await axiosInstance.get(getUrl);
      const data = response.data;
      setMonths(data);
    } catch (error) {
      console.error('Error fetching Month List :', error);
    }
  };
  useEffect(() => {
    fetchMonth();
    if (defaultSelectedMonth !== undefined && defaultSelectedMonth !== null) {
      setSelectedMonth(defaultSelectedMonth);
    }
  }, [defaultSelectedMonth]);

  const handleMonthChange = (event) => {
    const monthValue = event.target.value;
    setSelectedMonth(monthValue);
    onSelectMonth(monthValue);
  };

  return (
    <FormControl>
      <InputLabel id="Month-label">Month&nbsp;{isMendatory && <span style={{ color: 'red' }}>*</span>}</InputLabel>
      <Select labelId="Month-label" id="monthCode" label="Month" name="monthCode" value={selectedMonth} onChange={handleMonthChange}>
        {months.map((item) => (
          <MenuItem key={item.monthCode} value={item.monthCode}>
            {item.monthName}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default MonthList;
