import React, { useState, useEffect, useCallback } from 'react';
import FormControl from '@mui/material/FormControl';
import { MenuItem, Select } from '@mui/material';
import { getUserInfo } from 'utils/storageUtils';
import config from 'config';
import { setUserInfo } from 'utils/storageUtils';
import PropTypes from 'prop-types';

export default function DynamicSchemeSelection({ onChangeScheme }) {
  const [selectedValue, setSelectedValue] = useState('');
  const [updatHeaderInfo, setUpdatHeaderInfo] = useState(null);
  const [schemeUserinfo, setSchemeUserinfo] = useState([]);
  const userCode = getUserInfo().userCode;
  const fetchData = useCallback(async () => {
    try {
      const apiBaseUrl = config.API_BASE_URL;
      const getUrl = `${apiBaseUrl}/userManagement/findUserSchemeByUserCode/${userCode}`;
      const userInfo = getUserInfo();
      // Ensure userInfo is correctly retrieved
      if (!userInfo) {
        console.error('User information not found.');
        return;
      }
      const headers = {
        userInfo: JSON.stringify(userInfo),
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userInfo.token}`
      };

      const options = {
        method: 'GET',
        headers: headers
      };

      const response = await fetch(getUrl, options);
      const data = await response.json();

      setSchemeUserinfo(data);

      const userInfoFromStorage = getUserInfo();
      setUpdatHeaderInfo(userInfoFromStorage);

      const defaultSelectedScheme = userInfoFromStorage.selectedSchemeCode || data[0].schemeCode;
      setSelectedValue(defaultSelectedScheme);

      // Update the userinfo in local storage
      if (userInfoFromStorage) {
        const updatedUserInfo = {
          ...userInfoFromStorage,
          selectedSchemeCode: defaultSelectedScheme
        };
        setUserInfo(updatedUserInfo);
        setUpdatHeaderInfo(updatedUserInfo);
        // Call the onChangeScheme callback with the default selected scheme
        onChangeScheme(defaultSelectedScheme);
      }
    } catch (error) {
      console.error('Error Fetching Find All Scheme List By UserCode:', error);
    }
  }, [onChangeScheme]);

  useEffect(() => {
    if (userCode) {
      fetchData();
    }
  }, [userCode]);

  const handleSchemeChange = (value) => {
    setSelectedValue(value);

    // Update the userinfo in local storage
    if (updatHeaderInfo) {
      const updatedSchemeUserInfo = {
        ...updatHeaderInfo,
        selectedSchemeCode: value
      };
      setUserInfo(updatedSchemeUserInfo);
      setUpdatHeaderInfo(updatedSchemeUserInfo);
      // Call the onChangeScheme callback with the selected scheme
      onChangeScheme(value);
    }
  };

  return (
    <FormControl style={{ width: 200, marginLeft: 16, paddingLeft: 16, paddingRight: 16 }}>
      <Select labelId="select-label" id="select" value={selectedValue} onChange={(event) => handleSchemeChange(event.target.value)}>
        {Array.isArray(schemeUserinfo) &&
          schemeUserinfo.map((item) => (
            <MenuItem key={item.schemeCode} value={item.schemeCode}>
              {item.schemeCode}
            </MenuItem>
          ))}
      </Select>
    </FormControl>
  );
}

DynamicSchemeSelection.propTypes = {
  onChangeScheme: PropTypes.func.isRequired
};
