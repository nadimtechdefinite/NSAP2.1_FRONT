// DatePickerComponent.js
import React from 'react';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
//import dayjs from 'dayjs';
const DatePickerComponent = ({onDateChange, defaultValue} ) => {
  const handleDateChange = (date) => {
    onDateChange(date);
  };
    return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker 
      //defaultValue={dayjs(new Date())}
      defaultValue={defaultValue}  
      format="DD-MM-YYYY" 
      disableFuture 
      name="creationDate" 
      slotProps={{ textField: { fullWidth: true } }} 
      variant='outlined' 
      onChange={handleDateChange}
      />
    </LocalizationProvider>
    );
};

export default DatePickerComponent;
