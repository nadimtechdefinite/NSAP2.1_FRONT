import React, { useState, useEffect } from 'react';
import { FormControl, InputLabel, Select, MenuItem, FormHelperText } from '@mui/material';
import { getUserInfo } from 'utils/storageUtils';
const AreaList = (props) => {
  const [selectedArea, setSelectedArea] = useState(props.selectedArea || ''); // Initialize with props.selectedArea or ''
  const [subDistUser, setSubDistUser] = useState(false);

  // Update selectedArea state if props.selectedArea changes
  useEffect(() => {
    const userInfo = getUserInfo();
    const userLevel = userInfo.userLevel;
    const areaCode = userInfo.areaCode;
    if (userLevel === 4) {
      setSelectedArea(areaCode);
      props.onSelectArea(areaCode);
      setSubDistUser(true);
    } else {
      setSelectedArea(props.selectedArea || '');
      props.onSelectArea(props.selectedArea || '');
    }
  }, [props.selectedDistrict, props.selectedArea]);

  const handleAreaChange = (event) => {
    const value = event.target.value;
    setSelectedArea(value);
    props.onSelectArea(value);
  };

  const [error, setError] = useState(false);

  const validateState = () => {
    if (props.isMandatory && !selectedArea) {
      setError(true);
      return false;
    }
    setError(false);
    return true;
  };

  return (
    <FormControl>
      <InputLabel id="Area-label">Area&nbsp;{props.isMandatory && <span style={{ color: 'red' }}>*</span>}</InputLabel>
      <Select
        labelId="Area-label"
        id="ruralUrbanAreaId"
        label="Area"
        name="ruralUrbanAreaId"
        value={selectedArea}
        onChange={handleAreaChange}
        onBlur={validateState}
        required={props.isMandatory}
        error={error} // Add error state to highlight when validation fails
        readOnly={subDistUser}
      >
        <MenuItem value="">
          <em>Select Area</em>
        </MenuItem>
        <MenuItem value="R">Rural</MenuItem>
        <MenuItem value="U">Urban</MenuItem>
      </Select>
      {error && <FormHelperText>This field is required.</FormHelperText>}
    </FormControl>
  );
};

export default AreaList;
