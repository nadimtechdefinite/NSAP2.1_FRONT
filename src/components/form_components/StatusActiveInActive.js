import * as React from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

export default function StatusActiveInactive(props) {
  const handleStatusChange = (event) => {
    const selectedStatusTarget = event.target.value;
    props.onSelectStatus(selectedStatusTarget);
  };

  return (
    <Box sx={{ minWidth: 120 }}>
      <FormControl fullWidth>
        <InputLabel id="isActive-label">Status</InputLabel>
        <Select
          labelId="isActive-label"
          id="status"
          name="status"
          value={props.selectedStatus}
          label="Status"
          onChange={handleStatusChange}
        >
          <MenuItem value={true}>Active</MenuItem>
          <MenuItem value={false}>Inactive</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
}
