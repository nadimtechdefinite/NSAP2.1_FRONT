import React, { useState, useEffect } from 'react';
import { FormControl, InputLabel, Select, MenuItem ,Typography} from '@mui/material';
import axiosInstance from 'hooks/useAuthTokenUrl';
	const BankNameList = ({bankType,selectedStateId,selectedDistrictId,onSelectbankName , defaultSelectedBankName }) => {
    const [banktypes, setStates] = useState([]);
    const [selectedBankType, setSelectedBankType] = useState('');

    useEffect(() => {
      const fetchStates = async () => {
        try {
          const getUrl = `/common/findAllBanksNameByBankType/${bankType}/${selectedStateId}/${selectedDistrictId}`;
          const response = await axiosInstance.get(getUrl);
          setStates(response.data);
          
          if (response.data.length === 1) {
            setSelectedBankType(response.data[0].bankTypeId);
            onSelectbankName(response.data[0].bankTypeId);
          } else if (defaultSelectedBankName && selectedBankType !== defaultSelectedBankName) {
            // Only update the Bank Type and trigger the callback if it's different from the defaultSelectedBankType
            setSelectedBankType(defaultSelectedBankName);
            onSelectbankName(defaultSelectedBankName);
          }
        } catch (error) {
          console.error('Error fetching banktypes:', error);
        }
      };
    
      // Call fetchStates only if there is no data or if defaultSelectedBankType has changed
      if (bankType!=='') {
        fetchStates();
      }
    }, [bankType]);



    const handleStateChange = (event) => {
        const bankTypeId = event.target.value;
        setSelectedBankType(bankTypeId);
        onSelectbankName(bankTypeId);
    };

    return (
        <FormControl>
            <InputLabel id="Bank Type-label">Bank Name<Typography variant="body1" color="error" style={{ marginLeft: 5 }}>*
        </Typography></InputLabel>
            <Select
                 labelId="Bank Type-label"
                 id="bankTypeId"
                 label="Bank Type-label"
                 name="bankTypeId"
                value={selectedBankType}
                required
                onChange={handleStateChange}
            >
                {banktypes.map((item) => (
                    <MenuItem key={item.bankCode} value={item.bankCode} onClick={() => onSelectbankName(item.bankCode)}>
                        {item.bankName}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
};

export default BankNameList;
