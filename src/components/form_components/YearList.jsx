import React, { useState, useEffect } from 'react';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';

const YearList = ({ onSelectYear, isMandatory, defaultSelectedYear }) => {
  const [years, setYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState('');
  useEffect(() => {
    const currentYear = new Date().getFullYear();
    const yearList = [currentYear, currentYear - 1, currentYear - 2];
    setYears(yearList);
    if (defaultSelectedYear !== undefined && defaultSelectedYear !== null) {
      setSelectedYear(defaultSelectedYear);
    }
  }, [defaultSelectedYear]);
  const handleYearChange = (event) => {
    const yearValue = event.target.value;
    setSelectedYear(yearValue);
    onSelectYear(yearValue);
  };
  return (
    <FormControl>
      <InputLabel id="year-label">Year&nbsp;{isMandatory && <span style={{ color: 'red' }}>*</span>}</InputLabel>
      <Select labelId="year-label" id="year" label="Year" name="year" value={selectedYear} onChange={handleYearChange}>
        {years.map((year) => (
          <MenuItem key={year} value={year}>
            {year}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default YearList;
