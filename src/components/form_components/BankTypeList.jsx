import React, { useState, useEffect } from 'react';
import { FormControl, InputLabel, Select, MenuItem ,Typography} from '@mui/material';
import axiosInstance from 'hooks/useAuthTokenUrl';
	const BankTypeList = ({onSelectbankType , defaultSelectedBankType }) => {
    const [banktypes, setStates] = useState([]);
    const [selectedBankType, setSelectedBankType] = useState('');

    useEffect(() => {
      const fetchStates = async () => {
        try {
          const getUrl = '/common/findAllBankTypes';
          const response = await axiosInstance.get(getUrl);
          setStates(response.data);
          
          if (response.data.length === 1) {
            setSelectedBankType(response.data[0].bankTypeId);
            onSelectbankType(response.data[0].bankTypeId);
          } else if (defaultSelectedBankType && selectedBankType !== defaultSelectedBankType) {
            // Only update the Bank Type and trigger the callback if it's different from the defaultSelectedBankType
            setSelectedBankType(defaultSelectedBankType);
            onSelectbankType(defaultSelectedBankType);
          }
        } catch (error) {
          console.error('Error fetching banktypes:', error);
        }
      };
    
      // Call fetchStates only if there is no data or if defaultSelectedBankType has changed
      if (banktypes.length === 0 || (defaultSelectedBankType && selectedBankType !== defaultSelectedBankType)) {
        fetchStates();
      }
    }, [defaultSelectedBankType, onSelectbankType, selectedBankType, banktypes]);



    const handleStateChange = (event) => {
        const bankTypeId = event.target.value;
        setSelectedBankType(bankTypeId);
        onSelectbankType(bankTypeId);
    };

    return (
        <FormControl>
            <InputLabel id="Bank Type-label">Bank Type<Typography variant="body1" color="error" style={{ marginLeft: 5 }}>
          *
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
                    <MenuItem key={item.bankTypeId} value={item.bankTypeId} onClick={() => onSelectbankType(item.bankTypeId)}>
                        {item.bankTypeName}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
};

export default BankTypeList;
