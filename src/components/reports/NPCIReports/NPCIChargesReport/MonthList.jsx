import React, { useState, useEffect } from 'react';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import axiosInstance from 'hooks/useAuthTokenUrl';
const MonthList = ({ onSelectMonth, labelId, monthFeildName, labelName, isMendatory, selectedFinYear, defaultMonthCode }) => {
  const [monthList, setMonthList] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState('');
  useEffect(() => {
    const fetchMonthList = async () => {
      try {
        const getUrl = '/common/findAllMonthForAdmin';
        const response = await axiosInstance.get(getUrl);
        const data = await response.data;
        const [startYear, endYear] = selectedFinYear.split('-').map((year) => year.trim());
        const modifiedData = data.map((item) => {
          const month = parseInt(item.monthValue); // Convert monthValue to integer for comparison
          if (month >= 4 && month <= 12) {
            return { ...item, monthCode: item.monthCode + '-' + startYear, monthValue: item.monthValue + '-' + startYear };
          }
          if (month >= 1 && month <= 3) {
            return { ...item, monthCode: item.monthCode + '-' + endYear, monthValue: item.monthValue + '-' + endYear };
          }
          return item; // Return unchanged for months outside the specified range
        });
        setMonthList(modifiedData);
      } catch (error) {
        console.error('Error fetching Scheme:', error);
      }
    };
    if (selectedFinYear) {
      fetchMonthList();
    }
  }, [selectedFinYear]);

  useEffect(() => {
    if (defaultMonthCode === '') {
      setSelectedMonth(defaultMonthCode);
    }
  }, [defaultMonthCode]);

  const handleMonthChange = (event) => {
    const monthCode = event.target.value;
    setSelectedMonth(monthCode);
    onSelectMonth(monthCode);
  };

  return (
    <FormControl>
      <InputLabel id={labelId}>
        {labelName}&nbsp;{isMendatory && <span style={{ color: 'red' }}>*</span>}
      </InputLabel>
      <Select
        labelId={labelId}
        id={monthFeildName}
        label={labelId}
        name={monthFeildName}
        value={selectedMonth}
        onChange={handleMonthChange}
      >
        {monthList.map((item) => (
          <MenuItem key={item.monthValue} value={item.monthValue}>
            {item.monthCode}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default MonthList;
