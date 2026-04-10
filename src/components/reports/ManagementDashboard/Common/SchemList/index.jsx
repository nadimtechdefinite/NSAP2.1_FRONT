import React, { useState } from 'react';
import { MenuItem, TextField, Typography } from '@mui/material';

const SchemeListManagementDashboard = ({ onSelectScheme, defaultSelectedSchemeCode }) => {
  const [selectedSchme, setSelectedScheme] = useState(defaultSelectedSchemeCode);

  const status = [
    {
      value: '0',
      label: 'All Pension Scheme'
    },
    {
      value: 'IGNOAPS',
      label: 'IGNOAPS'
    },
    {
      value: 'IGNWPS',
      label: 'IGNWPS'
    },
    {
      value: 'IGNDPS',
      label: 'IGNDPS'
    },
    {
      value: 'NFBS',
      label: 'NFBS'
    }
  ];

  const handleSchemeChange = (event) => {
    const schemeCode = event.target.value;
    setSelectedScheme(schemeCode);
    onSelectScheme(schemeCode);
  };

  return (
    <div>
      <Typography variant="h6" style={{ display: 'flex', alignItems: 'center' }}>
        Scheme &nbsp;
        <TextField id="standard-select-currency" select value={selectedSchme} onChange={handleSchemeChange}>
          {status.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
      </Typography>
    </div>
  );
};

export default SchemeListManagementDashboard;
