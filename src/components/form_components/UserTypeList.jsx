import React, { useState, useEffect } from 'react';
import { FormControl, InputLabel, Select, MenuItem, FormHelperText } from '@mui/material';
import axiosInstance from 'hooks/useAuthTokenUrl';

const UserTypeList = (props) => {
    const [getUserTypes, setUserTypes] = useState([]);
    const [error, setError] = useState(false);

    useEffect(() => {
        // Fetch User Type from your API
        const fetchUserType = async () => {
            try {
                const getUrl='/common/findAllUserType';
                const response = await axiosInstance.get(getUrl);
                const data = response.data;
                setUserTypes(data);
            } catch (error) {
                console.error('Error fetching User Type :', error);
            }
        };

        fetchUserType();
    }, []);

    const handleUserTypeChange = (event) => {
        const userTypeId = event.target.value;
        props.onSelectUserType(userTypeId);
    };

    const validateState = () => {
        if (props.isMandatory && !props.selectedGramPanchayat) {
          setError(true);
          return false;
        }
        setError(false);
        return true;
      };
    
    return (
        <FormControl>
            <InputLabel id="UserType-label">User Type&nbsp;{props.isMandatory && <span style={{ color: 'red' }}>*</span>}</InputLabel>
            <Select
                 labelId="Scheme-label"
                 id="userTypeId"
                 label="UserType-label"
                 name="userTypeId"
                value={props.selectedUserType}
                onChange={handleUserTypeChange}
                onBlur={validateState}
                required={props.isMandatory}
            >
                {getUserTypes.map((item) => (
                    <MenuItem key={item.userTypeId} value={item.userTypeId}>
                        {item.userTypeName}
                    </MenuItem>
                ))}
            </Select>
            {error && <FormHelperText>This field is required.</FormHelperText>}
        </FormControl>
    );
};

export default UserTypeList;
