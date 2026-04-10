import React, { useState, useEffect } from 'react';
import { FormControl, InputLabel, Select, MenuItem, FormHelperText } from '@mui/material';
import axiosInstance from 'hooks/useAuthTokenUrl';

const UserLevelList = (props) => {
    const [getUserLevel, setUserLevels] = useState([]);
    const [error, setError] = useState(false);

    useEffect(() => {
        // Fetch User Level from your API
        const fetchUserLevel = async () => {
            try {
                const getUrl = '/common/findAllUserLevel';
                const response = await axiosInstance.get(getUrl);
                const data = response.data;
                console.log(data)
                setUserLevels(data);
            } catch (error) {
                console.error('Error fetching User Level:', error);
            }
        };

        fetchUserLevel();
    }, []);

    const handleUserLevelChange = (event) => {
        const userLevelId = event.target.value;
        // setSelectedUserLevel(userLevelId);
        props.onSelectUserLevel(userLevelId);
    };
    const validateState = () => {
        if (props.isMandatory && !props.selectedUserLevel) {
          setError(true);
          return false;
        }
        setError(false);
        return true;
      };
    return (
        <FormControl>
            <InputLabel id="UserLevel-label">User Level {props.isMandatory && <span style={{ color: 'red' }}>*</span>}</InputLabel>
            <Select
                labelId="UserLevel-label"
                id="userLevelId"
                label="UserLevel-label"
                name="userLevelId"
                value={props.selectedUserLevel}
                onChange={handleUserLevelChange}
                onBlur={validateState}
                required={props.isMandatory}
            >
                {getUserLevel.map((item) => (
                    <MenuItem key={item.userLevelId} value={item.userLevelId}>
                        {item.userLevelName}
                    </MenuItem>
                ))}
            </Select>
            {error && <FormHelperText>This field is required.</FormHelperText>}
        </FormControl>
    );
};

export default UserLevelList;
