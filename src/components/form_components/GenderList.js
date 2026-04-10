import React, { useState, useEffect } from 'react';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import axiosInstance from 'hooks/useAuthTokenUrl';

	const GenderList = ({onSelectGender}) => {
    const [getGender, setGender] = useState([]);
    const [getSelectedGender, setSelectedGender] = useState('');

    useEffect(() => {
        // Fetch User Type from your API
        const fetchGender = async () => {
            try {
                const getUrl='/common/findAllGender';
                const response = await axiosInstance.get(getUrl);
                const data = response.data;
                setGender(data);
            } catch (error) {
                console.error('Error fetching Gender List :', error);
            }
        };

        fetchGender();
    }, []);

    const handleGenderChange = (event) => {
        const genderId = event.target.value;
        setSelectedGender(genderId);
        onSelectGender(genderId);
    };

    return (
        <FormControl>
            <InputLabel id="Gender-label">Gender</InputLabel>
            <Select
                 labelId="Gender-label"
                 id="genderId"
                 label="Gender-label"
                 name="genderId"
                value={getSelectedGender}
                onChange={handleGenderChange}
            >
                {getGender.map((item) => (
                    <MenuItem key={item.genderId} value={item.genderId} onClick={() => onSelectGender(item.genderId)}>
                        {item.genderName}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
};

export default GenderList;
