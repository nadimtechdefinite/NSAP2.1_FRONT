import React, { useState } from 'react';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { Button, Box, Divider, Chip } from '@mui/material';
import axiosInstance from 'hooks/useAuthTokenUrl';
import MainCard from 'ui-component/cards/MainCard';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import Backdrop from '@mui/material/Backdrop';
import SearchComponent from 'components/common/SearchTypeCommon';
import SubDistrictCommon from 'components/common/SubDistrictCommon';

const ReInstatePensionReport = () => {
  const [discontinuedData, setDiscontinuedData] = useState([]);
  const [snackbar, setSnackbar] = React.useState(null);
  const handleCloseSnackbar = () => setSnackbar(null);
  const [loading, setLoading] = useState(false);

  //Awesome feature option
  const options = {
    sanctionOrderNo: 'Sanction Order No',
    beneficiaryNo: 'Beneficiary No'
  };

  const [optionValues, setOptionValues] = useState({});
  const [locationOptionValues, setLocationOptionValues] = useState({});

  const columns = [
    { field: 'sanctionOrderNo', headerName: 'Sanction Order No', width: 125 },
    { field: 'beneficiaryNo', headerName: 'Beneficiary No', width: 125 },
    { field: 'applicantName', headerName: 'Applicant Name', width: 125 },
    { field: 'fatherHusbandName', headerName: 'Father/Husband Name', width: 170 },
    { field: 'statusDesc', headerName: 'Discontinue Reason', width: 150 },
    { field: 'creationRemarks', headerName: 'Discontinue Remarks', width: 150 },
    { field: 'discontinuationDate', headerName: 'Discontinued Date', width: 125 },
    { field: 'appealRemarks', headerName: 'Appeal Remarks', width: 150 },
    { field: 'creationDate', headerName: 'Appeal Date', width: 150 },
    { field: 'verifyRemarks', headerName: 'Verify Remarks', width: 125 },
    { field: 'verifyDate', headerName: 'Verify Date', width: 120 },
    { field: 'pensionEffectiveFromDate', headerName: 'Pension Effective From', width: 170 },
    { field: 'appealVerifyStatus', headerName: 'Approved / Rejected', width: 150 }
  ];

  const handleFetchData = async (e) => {
    e.preventDefault();
    try {
      if (subDistrictCommonRef.current && !Object.values(optionValues).some((value) => value !== null)) {
        if (subDistrictCommonRef.current.validateSelectedDropDown() != 'RJ') {
          return false;
        }
      }

      var requestData = { ...optionValues, ...locationOptionValues };
      console.log('final:' + JSON.stringify(requestData));

      setLoading(true);
      const response = await axiosInstance.post('appeals/getReInstateAppealsReport', JSON.stringify(requestData));

      if (response.data.length < 1) {
        setDiscontinuedData([]);
        setSnackbar({ children: 'No Data Found', severity: 'error' });
        return false;
      }
      const newData = response.data.map((row) => ({ ...row, id: row.appealsId }));
      setDiscontinuedData(newData);
    } catch (error) {
      if (error.response.data.sanctionOrderNo) {
        setSnackbar({ children: error.response.data.sanctionOrderNo, severity: 'error' });
      } else if (error.response.data.beneficiaryNo) {
        setSnackbar({ children: error.response.data.beneficiaryNo, severity: 'error' });
      } else {
        setSnackbar({ children: 'Some Internal Error Occured', severity: 'error' });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleOptionValuesChange = (newOptionValues) => {
    setOptionValues(newOptionValues);
  };

  const handleLocationValuesChange = (newLocOptionValues) => {
    setLocationOptionValues(newLocOptionValues);
  };

  const subDistrictCommonRef = React.createRef();

  return (
    <>
      <MainCard title="Pensioner Reinstate Appeal Status">
        <Box justifyContent="space-between" marginBottom={2}>
          <div>
            <SubDistrictCommon ref={subDistrictCommonRef} validationLevel={'D'} onFormInputValuesChange={handleLocationValuesChange} />
          </div>
          <Divider>
            <Divider style={{ marginTop: 5 }}>
              <Chip label="OR SEARCH BY" />
            </Divider>
          </Divider>
          <div>
            <SearchComponent options={options} onOptionValuesChange={handleOptionValuesChange} />
          </div>

          <Divider />

          <Box marginTop={2} style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
            <Button variant="contained" color="primary" onClick={handleFetchData}>
              Search
            </Button>
          </Box>
        </Box>

        {!!snackbar && (
          <Snackbar open anchorOrigin={{ vertical: 'top', horizontal: 'center' }} onClose={handleCloseSnackbar} autoHideDuration={6000}>
            <Alert {...snackbar} onClose={handleCloseSnackbar} />
          </Snackbar>
        )}

        <Backdrop open={loading} style={{ zIndex: 999, color: '#fff' }}>
          <CircularProgress color="inherit" />
        </Backdrop>
      </MainCard>
      <MainCard>
        {discontinuedData.length > 0 && (
          <DataGrid
            density="compact"
            rows={discontinuedData}
            columns={columns}
            slots={{ toolbar: GridToolbar }}
            slotProps={{
              toolbar: {
                showQuickFilter: true
              }
            }}
          />
        )}
      </MainCard>
    </>
  );
};

export default ReInstatePensionReport;
