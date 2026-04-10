import React, { useState, useEffect } from 'react';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import axiosInstance from 'hooks/useAuthTokenUrl';
const HabitationList = ({ selectedVillageId, onSelectHabitation, isMandatory, isDisabled, defaultSelectedHabitation }) => {
  const [habitations, setHabitations] = useState([]);
  const [selectedHabitation, setSelectedHabitation] = useState('');
  // Fetch districts based on the selected state
  const fetchHabitation = async () => {
    try {
      const getUrl = `/common/findAllHabitationByVillageId/${selectedVillageId}`;
      const response = await axiosInstance.get(getUrl);
      const data = response.data;
      setHabitations(data);
    } catch (error) {
      console.error('Error fetching Habitation:', error);
    }
  };
  useEffect(() => {
    if (selectedVillageId) {
      fetchHabitation();
    } else {
      setSelectedHabitation('');
      setHabitations([]);
    }
  }, [selectedVillageId]);

  useEffect(() => {
    if (defaultSelectedHabitation) {
      setSelectedHabitation(defaultSelectedHabitation);
      onSelectHabitation(defaultSelectedHabitation);
    }

    if (defaultSelectedHabitation === '') {
      setSelectedHabitation(defaultSelectedHabitation);
      onSelectHabitation(defaultSelectedHabitation);
    }
  }, [defaultSelectedHabitation]);

  const handleHabitationChange = (event) => {
    setSelectedHabitation(event.target.value);
    onSelectHabitation(event.target.value);
  };

  return (
    <FormControl>
      <InputLabel id="habitation-label">Habitation&nbsp;{isMandatory && <span style={{ color: 'red' }}>*</span>}</InputLabel>
      <Select
        labelId="habitation-label"
        id="habitationId"
        label="Habitation"
        name="habitationId"
        value={selectedHabitation}
        onChange={handleHabitationChange}
        disabled={isDisabled}
      >
        <MenuItem value="">
          <em>Select Habitation</em>
        </MenuItem>
        {habitations.map((item) => (
          <MenuItem key={item.habitationId} value={item.habitationId}>
            {item.habitationName}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default HabitationList;
