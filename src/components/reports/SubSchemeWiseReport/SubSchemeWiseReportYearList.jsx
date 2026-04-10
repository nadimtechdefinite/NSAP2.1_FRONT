import React, { useState, useEffect } from 'react';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import axiosInstance from 'hooks/useAuthTokenUrl';
const SubSchemeWiseReportYearList = ({ selectedStateCode, onSelectYear, isMendatory, defaultValueYear }) => {
  const [data, setData] = useState([]);
  const [selectedYearCode, setSelectedYearCode] = useState('');
  useEffect(() => {
    const fetchData = async () => {
      try {
        const getUrl = `/report/getYearListFromDisbursementTransactionDateAuditTable/${selectedStateCode}`;
        const response = await axiosInstance.get(getUrl);
        setData(response.data);
      } catch (error) {
        console.error('Error fetching states:', error);
      }
    };
    if (selectedStateCode) {
      fetchData();
    }
    if (defaultValueYear !== undefined && defaultValueYear !== null) {
      setSelectedYearCode(defaultValueYear);
    }
  }, [selectedStateCode, defaultValueYear]);

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
          <MenuItem key={item.key} value={item.key}>
            {item.value}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default SubSchemeWiseReportYearList;
