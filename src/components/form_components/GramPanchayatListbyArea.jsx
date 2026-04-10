import React, { useState, useEffect } from 'react';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import axiosInstance from 'hooks/useAuthTokenUrl';
const GramPanchayatListbyArea = ({ selectedSubDistrictId, selectedDistrictId, selectedArea, onSelectGramPanchayat }) => {
  const [gramPanchayats, setGramPanchayats] = useState([]);
  const [selectedGramPanchayat, setSelectedGramPanchayat] = useState('');

  useEffect(() => {
    // Fetch districts based on the selected state
    const fetchGramPanchayat = async () => {
      try {
        console.log(selectedSubDistrictId);
        const getUrl = `/common/findAllGramPanchayatBySubDistrictandArea/${selectedSubDistrictId}/${selectedDistrictId}/${selectedArea}`;
        const response = await axiosInstance.get(getUrl);
        const data = await response.data;
        setGramPanchayats(data);
        console.log(data);
      } catch (error) {
        console.error('Error fetching find All Gram Panchayat By Sub District : ', error);
      }
    };

    if (selectedSubDistrictId) {
      setSelectedGramPanchayat('');
      fetchGramPanchayat();
    } else {
      setGramPanchayats('');
      setGramPanchayats([]); // Reset districts if no state is selected
    }
  }, [selectedSubDistrictId]);

  const handleGramPanchayatChange = (event) => {
    setSelectedGramPanchayat(event.target.value);
    onSelectGramPanchayat(event.target.value);
  };

  return (
    <FormControl>
      <InputLabel id="gram-panchayat-label">Gram Panchayat</InputLabel>
      <Select
        labelId="gram-panchayat-label"
        id="gramPanchayatWardId"
        label="gram-panchayat-label"
        name="gramPanchayatId"
        value={selectedGramPanchayat}
        onChange={handleGramPanchayatChange}
      >
        <MenuItem value="" disabled>
          Select Gram Panchayat
        </MenuItem>
        {gramPanchayats.map((gramPanchayat) => (
          <MenuItem
            key={gramPanchayat.gramPanchayatWardId}
            value={gramPanchayat.gramPanchayatWardId}
            onClick={() => onSelectGramPanchayat(gramPanchayat)}
          >
            {gramPanchayat.gramPanchayatWardName}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default GramPanchayatListbyArea;
