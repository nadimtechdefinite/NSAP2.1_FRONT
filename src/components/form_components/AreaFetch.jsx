import React, { useState, useEffect } from 'react';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import axiosInstance from 'hooks/useAuthTokenUrl';

const AreaFetch = ({ onSelectArea, selectedDistrictId }) => {
  const [getArea, setArea] = useState([]);
  const [getSelectedArea, setSelectedArea] = useState('');

  useEffect(() => {
    // Fetch User Type from your API
    const fetchArea = async () => {
      try {
        const getUrl = '/common/findAllArea';
        const response = await axiosInstance.get(getUrl);
        const data = response.data;
        setArea(data);
        if (response.data.length === 1) {
          setSelectedArea(response.data[0].area);
        }
      } catch (error) {
        console.error('Error fetching Gender List :', error);
      }
    };
    if (selectedDistrictId) {
      setSelectedArea('');
      fetchArea();
    } else {
      // If the district is not selected, reset the area
      setArea([]);
      setSelectedArea('');
    }
    // fetchArea();
  }, [selectedDistrictId]);

  const handleAreaChange = (event) => {
    const ruralUrbanAreaId = event.target.value;
    setSelectedArea(ruralUrbanAreaId);
    onSelectArea(ruralUrbanAreaId);
  };

  return (
    <FormControl>
      <InputLabel id="Area-label">Area</InputLabel>
      <Select
        labelId="Area-label"
        id="ruralUrbanAreaId"
        label="Area-label"
        name="ruralUrbanAreaId"
        value={getSelectedArea}
        onChange={handleAreaChange}
        readOnly={getArea.length === 1 ? true : false}
      >
        <MenuItem value="" disabled>
          Select an Area
        </MenuItem>
        {getArea.map((area) => (
          <MenuItem key={area.ruralUrbanAreaId} value={area.ruralUrbanAreaId} onClick={() => onSelectArea(area)}>
            {area.ruralUrbanAreaName}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default AreaFetch;
