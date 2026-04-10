import React, { useState } from 'react';
import { Button, Typography, Box, Divider, CircularProgress } from '@mui/material';
import MainCard from 'ui-component/cards/MainCard';
import LinearStepper from './LinearStepper';
import axiosInstance from 'hooks/useAuthTokenUrl';
import SearchComponent from 'components/common/SearchTypeCommon';
import HabitationCommon from 'components/common/habitationCommon';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import View from './View';
import messages_en from 'components/common/messages_en.json';
import { DataGrid } from '@mui/x-data-grid';

const ModifyDetails = () => {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [optionValues, setOptionValues] = useState({});
  const [locationOptionValues, setLocationOptionValues] = useState({});
  const [snackbar, setSnackbar] = React.useState(null);
  const handleCloseSnackbar = () => setSnackbar(null);
  const [beneficiaryData, setBeneficiaryData] = useState([]);
  const [tempApplicationType, setTempApplicationType] = useState('');
  const [loading, setLoading] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  const options = {
    applicationNo: 'Application Number',
    applicantName: 'Applicant Name',
    uidNo: 'Aadhaar',
    contactPersonMobile: 'Mobile No'
  };

  const [viewPageOpened, setViewPageOpened] = useState(false);

  const handleClick = (row, actionType) => {
    if (actionType === 'modify') {
      localStorage.removeItem('applicationNo');
      localStorage.setItem('applicationNo', JSON.stringify(row.applicationNo));
      setFormSubmitted(true);
    } else if (actionType === 'view') {
      localStorage.removeItem('applicationNo');
      localStorage.setItem('applicationNo', JSON.stringify(row.applicationNo));

      setViewPageOpened(true);
    }
  };

  const handleOptionValuesChange = (newOptionValues) => {
    setOptionValues(newOptionValues);
  };

  const handleLocationValuesChange = (newLocOptionValues) => {
    setLocationOptionValues(newLocOptionValues);
  };

  const handleFetchData = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (!Object.values(optionValues).some((value) => value !== null)) {
        const newErrors = {};
        if (!locationOptionValues.districtCode) {
          newErrors.districtId = messages_en.districtRequired;
        }
        if (!locationOptionValues.ruralUrbanArea) {
          newErrors.ruralUrbanArea = messages_en.areaRequired;
        }
        if (!locationOptionValues.subDistrictMunicipalAreaCode) {
          newErrors.subDistrictMunicipalAreaId = messages_en.subDistrictRequired;
        }

        setFormErrors((prevErrors) => ({
          ...prevErrors,
          ...newErrors
        }));

        if (Object.keys(newErrors).length > 0) {
          setLoading(false);
          return;
        }
      } else {
        setFormErrors({});
      }
      let tempApplicationType1;
      let tempApplicationType2;

      if (tempApplicationType === 'TEMP_NEW') {
        tempApplicationType1 = 'TEMP_NEW';
        tempApplicationType2 = 'TEMP_SO_SAVED';
      } else if (tempApplicationType === 'SO_SAVED') {
        tempApplicationType1 = 'SO_SAVED';
      } else if (tempApplicationType === 'NEW') {
        tempApplicationType1 = 'NEW';
        tempApplicationType2 = 'RETURNED';
      }

      var requestData = { ...optionValues, ...locationOptionValues, tempApplicationType1, tempApplicationType2 };

      const response = await axiosInstance.post('beneficiaryRegistration/modificationStatus/new', JSON.stringify(requestData));

      if (response.data.length < 1) {
        setBeneficiaryData([]);
        setSnackbar({ children: 'No Data Found', severity: 'error' });
        return false;
      }

      if (response.data.length < 1) {
        setBeneficiaryData([]);
        return false;
      }

      const newData = response.data.map((row, index) => ({
        ...row,
        id: row.applicationNo,
        serialNo: index + 1
      }));
      setBeneficiaryData(newData);
    } catch (error) {
      console.error('Error fetching data:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };
  const handleTempApplicationTypeChange = (newTempApplicationType) => {
    setTempApplicationType(newTempApplicationType);
  };

  const columns = [
    {
      field: 'serialNo',
      headerName: 'Serial No',
      width: 100,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => <span style={{ display: 'flex', justifyContent: 'center' }}>{params.value}</span>
    },
    {
      field: 'applicationNo',
      headerName: 'Application No',
      width: 140
    },
    {
      field: 'beneficiaryNo',
      headerName: 'Beneficiary No',
      width: 120,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => <span style={{ display: 'flex', justifyContent: 'center' }}>{params.value}</span>
    },
    {
      field: 'applicantName',
      headerName: 'Applicant Name',
      width: 150,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => <span style={{ display: 'flex', justifyContent: 'center' }}>{params.value}</span>
    },
    {
      field: 'nameAsPerUid',
      headerName: 'Name As Per Aadhaar',
      width: 150,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => <span style={{ display: 'flex', justifyContent: 'center' }}>{params.value}</span>
    },
    {
      field: 'fatherHusbandName',
      headerName: 'Father/Husband Name',
      width: 130,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => <span style={{ display: 'flex', justifyContent: 'center' }}>{params.value}</span>
    },
    {
      field: 'gender',
      headerName: 'AGE/SEX',
      width: 100,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => (
        <span style={{ display: 'flex', justifyContent: 'center' }}>
          {params.row.age} / {params.value}
        </span>
      )
    },
    {
      field: 'freezAc',
      headerName: 'Aadhaar',
      width: 120,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => (
        <span style={{ display: 'flex', justifyContent: 'center' }}>
          {params.value === 'Y' ? 'Verified' : params.value === null || params.value === '' ? 'Non Verified' : ''}
        </span>
      )
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 120,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => <span style={{ display: 'flex', justifyContent: 'center' }}>{params.value}</span>
    },
    {
      field: 'bankPoAccountNo',
      headerName: 'A/C No',
      width: 150,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => <span style={{ display: 'flex', justifyContent: 'center' }}>{params.value}</span>
    },
    {
      field: 'ifscCode',
      headerName: 'IFSC Code',
      width: 120,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => <span style={{ display: 'flex', justifyContent: 'center' }}>{params.value}</span>
    },

    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <span
            style={{
              cursor: 'pointer',
              marginRight: '8px',
              textDecoration: 'underline',
              color: 'blue'
            }}
            onClick={() => handleClick(params.row, 'modify')}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleClick(params.row, 'modify');
              }
            }}
            role="button"
            tabIndex={0}
          >
            Modify
          </span>
          <span
            style={{
              cursor: 'pointer',
              textDecoration: 'underline',
              color: 'blue'
            }}
            onClick={() => handleClick(params.row, 'view')}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleClick(params.row, 'view');
              }
            }}
            role="button"
            tabIndex={0}
          >
            View
          </span>
        </div>
      )
    }
  ];

  return (
    <>
      <div>
        {loading && (
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              zIndex: 9999,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <CircularProgress />
          </div>
        )}
        {!formSubmitted && !viewPageOpened && (
          <MainCard title="Update Registration Details">
            <Box justifyContent="space-between" marginBottom={2}>
              <HabitationCommon
                formErrors={formErrors}
                setFormErrors={setFormErrors}
                onFormInputValuesChange={handleLocationValuesChange}
                tempApplicationType={tempApplicationType}
                onTempApplicationTypeChange={handleTempApplicationTypeChange}
              />
              <Divider>
                <Typography variant="body1" component="div" sx={{ padding: '4px' }}>
                  OR SEARCH BY
                </Typography>
              </Divider>
              <div>
                <SearchComponent options={options} onOptionValuesChange={handleOptionValuesChange} />
              </div>

              <Divider />

              <Box marginTop={2}>
                <Button variant="contained" color="secondary" onClick={handleFetchData} disabled={loading}>
                  Search
                </Button>
              </Box>
            </Box>

            {beneficiaryData.length > 0 && <DataGrid getRowId={(row) => row.applicationNo} rows={beneficiaryData} columns={columns} />}
            <br></br>
          </MainCard>
        )}
        {formSubmitted && <LinearStepper />}
        {viewPageOpened && <View />}
        {!!snackbar && (
          <Snackbar open anchorOrigin={{ vertical: 'top', horizontal: 'center' }} onClose={handleCloseSnackbar} autoHideDuration={6000}>
            <Alert {...snackbar} onClose={handleCloseSnackbar} />
          </Snackbar>
        )}
      </div>
    </>
  );
};

export default ModifyDetails;
