import React, { useState } from 'react';
import { DataGrid, GridCellModes } from '@mui/x-data-grid';
import { Button, Box, Divider, Chip } from '@mui/material';
import axiosInstance from 'hooks/useAuthTokenUrl';
import MainCard from 'ui-component/cards/MainCard';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import Backdrop from '@mui/material/Backdrop';
import SearchComponent from 'components/common/SearchTypeCommon';
import SubDistrictCommon from 'components/common/SubDistrictCommon';
import '../aadharConsentUpdation/aadharConsent.css';
import reportcss from 'components/common/reportsCSS';

const PFMSRegistrationVerification = () => {
  const [verificationData, setVerificationData] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [snackbar, setSnackbar] = React.useState(null);
  const handleCloseSnackbar = () => setSnackbar(null);
  const [loading, setLoading] = useState(false);
  const [cellModesModel, setCellModesModel] = React.useState({});

  const classes = reportcss();

  //Awesome feature option
  const options = {
    sanctionOrderNo: 'Sanction Order No',
    applicantName: 'Applicant Name'
  };

  const [optionValues, setOptionValues] = useState({});
  const [locationOptionValues, setLocationOptionValues] = useState({});

  // verified-cell
  // failed-cell

  const columns = [
    { field: 'sanctionOrderNo', headerName: 'Sanction Order No', width: 125 },
    {
      field: 'applicantName',
      headerName: 'Applicant Name',
      width: 150,
      cellClassName: (params) =>
        params.row.applicantName.trim().toLowerCase() === params.row.nameAsPerBank.trim().toLowerCase() ? '' : 'failed-cell'
    },
    {
      field: 'nameAsPerBank',
      headerName: 'Name As Per Acc.',
      width: 150,
      cellClassName: (params) =>
        params.row.applicantName.trim().toLowerCase() === params.row.nameAsPerBank.trim().toLowerCase() ? '' : 'failed-cell'
    },
    { field: 'fatherHusbandName', headerName: 'Father/Husband Name', width: 180 },
    {
      field: 'nsapAccountNo',
      headerName: 'NSAP Account No.',
      width: 150,
      cellClassName: (params) =>
        params.row.nsapAccountNo.trim().toLowerCase() === params.row.pfmsRegAccountNo.trim().toLowerCase() ? '' : 'failed-cell'
    },
    {
      field: 'pfmsRegAccountNo',
      headerName: 'PFMS Reg. Account No.',
      width: 180,
      cellClassName: (params) =>
        params.row.nsapAccountNo.trim().toLowerCase() === params.row.pfmsRegAccountNo.trim().toLowerCase() ? '' : 'failed-cell'
    },
    {
      field: 'nsapIfscCode',
      headerName: 'NSAP IFSC Code',
      width: 150,
      cellClassName: (params) =>
        params.row.nsapIfscCode.trim().toLowerCase() === params.row.pfmsIfscCode.trim().toLowerCase() ? '' : 'failed-cell'
    },
    {
      field: 'pfmsIfscCode',
      headerName: 'PFMS IFSC Code',
      width: 150,
      cellClassName: (params) =>
        params.row.nsapIfscCode.trim().toLowerCase() === params.row.pfmsIfscCode.trim().toLowerCase() ? '' : 'failed-cell'
    },
    {
      field: 'nsapBankName',
      headerName: 'NSAP Bank Name',
      width: 180,
      cellClassName: (params) =>
        params.row.nsapBankName.trim().toLowerCase() === params.row.pfmsBankName.trim().toLowerCase() ? '' : 'failed-cell'
    },
    {
      field: 'pfmsBankName',
      headerName: 'PFMS BANK Name',
      width: 180,
      cellClassName: (params) =>
        params.row.nsapBankName.trim().toLowerCase() === params.row.pfmsBankName.trim().toLowerCase() ? '' : 'failed-cell'
    },
    {
      field: 'nsapUid',
      headerName: 'NSAP Aadhaar',
      width: 180,
      cellClassName: (params) => (params.row.nsapUid.trim().toLowerCase() === params.row.pfmsUid.trim().toLowerCase() ? '' : 'failed-cell')
    },
    {
      field: 'pfmsUid',
      headerName: 'PFMS Aadhaar',
      width: 180,
      cellClassName: (params) => (params.row.nsapUid.trim().toLowerCase() === params.row.pfmsUid.trim().toLowerCase() ? '' : 'failed-cell')
    },
    { field: 'pfmsPaymentFlag', headerName: 'Payment Flag', width: 150 },
    //   { field: 'verificationStatus', headerName: 'Verification Status', flex:1 },
    {
      field: 'verificationStatus',
      headerName: 'Verification Status',
      width: 150,
      renderCell: (params) => (
        <select
          value={params.value}
          onChange={(e) => handleDropdownChange(params.id, 'verificationStatus', e.target.value)}
          style={{ background: 'white', border: '0' }}
        >
          <option value=""> Select </option>
          <option value="VERIFIED">VERIFIED</option>
          <option value="NOT VERIFIED">NOT VERIFIED</option>
        </select>
      )
    }

    // Add other columns based on your requirements
  ];

  const handleDropdownChange = (id, field, selectedValue) => {
    setVerificationData((prevRows) => prevRows.map((row) => (row.sanctionOrderNo === id ? { ...row, [field]: selectedValue } : row)));
  };

  const handleSelectionModelChange = (newSelection) => {
    setSelectedRows(newSelection);
  };

  const handleFetchData = async (e) => {
    e.preventDefault();
    try {
      // console.log(Object.values(optionValues).some(value => value !== null));

      if (subDistrictCommonRef.current && !Object.values(optionValues).some((value) => value !== null)) {
        if (subDistrictCommonRef.current.validateSelectedDropDown() != 'RJ') {
          return false;
        }
      }

      var requestData = { ...optionValues, ...locationOptionValues };
      console.log('final:' + JSON.stringify(requestData));

      setLoading(true);
      // setSnackbar({ children: 'Successfully Appealed For Reinstate', severity: 'success' });
      // setSnackbar({ children: error.message, severity: 'error' });
      const response = await axiosInstance.post(
        'pfmsRegistrationVerification/getPfmsRegisteredVerificationData',
        JSON.stringify(requestData)
      );

      if (response.data.length < 1) {
        setVerificationData([]);
        setSnackbar({ children: 'No Pensioner Found For Verification', severity: 'error' });
        return false;
      }
      const newData = response.data.map((row) => ({ ...row, id: row.sanctionOrderNo }));
      setVerificationData(newData);
    } catch (error) {
      console.log(error);
      setSnackbar({ children: 'Some Internal Error Occured', severity: 'error' });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const selectedData = verificationData.filter((row) => selectedRows.indexOf(row.sanctionOrderNo) !== -1);

    if (selectedData.length < 1) {
      setSnackbar({ children: 'Please select atleast one row ', severity: 'error' });
      return false;
    }

    const isVerficationSelected = selectedRows.every((rowId) => {
      const selectedRow = verificationData.find((row) => row.sanctionOrderNo === rowId);
      return selectedRow && selectedRow.verificationStatus != null && selectedRow.verificationStatus.trim() !== '';
    });

    if (!isVerficationSelected) {
      setSnackbar({ children: 'Please Select Verification Status for all selected rows.', severity: 'error' });
      return false;
    }

    const updatedData = await processRowUpdate(selectedData);
    const bodyData = JSON.stringify(Object.values(updatedData).filter((value) => value !== null && value !== undefined));

    try {
      setLoading(true);
      const response = await axiosInstance.post('pfmsRegistrationVerification/savePfmsRegisteredVerification', bodyData);

      if (response.data.length > 0) {
        setSnackbar({ children: 'Updated SuccessFully', severity: 'success' });
        await new Promise((resolve) => setTimeout(resolve, 1000));
        handleFetchData(e);
      } else {
        setSnackbar({ children: 'Some Internal Error Occured', severity: 'error' });
        return false;
      }
    } catch (error) {
      console.log(error);
      setSnackbar({ children: 'Some Internal Error Occured', severity: 'error' });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const useFakeMutation = () => {
    return React.useCallback(
      (updatedRow) =>
        new Promise((resolve, reject) => {
          setTimeout(() => {
            // Simulate saving data to the backend
            if (updatedRow.verificationStatus?.trim() === '') {
              reject(new Error('Error:Please Select Verification Status'));
            } else {
              resolve({ ...updatedRow });
            }
          }, 200);
        }),
      []
    );
  };

  const mutateRow = useFakeMutation();

  const processRowUpdate = React.useCallback(
    async (updatedRow) => {
      try {
        // Make the HTTP request to save in the backend
        const updatedRowData = await mutateRow(updatedRow);

        setVerificationData((prevRows) => {
          // Find the index of the updated row
          const rowIndex = prevRows.findIndex((row) => row.sanctionOrderNo === updatedRowData.sanctionOrderNo);

          // Create a new array with the updated row
          const updatedRows = [...prevRows];
          updatedRows[rowIndex] = {
            ...updatedRows[rowIndex], // Keep the existing fields
            //  status: updatedRowData.status,
            verificationStatus: updatedRowData.verificationStatus // Update only the 'status' field (replace with your field names)
          };

          // Return the new array
          return updatedRows;
        });
        return updatedRowData;
      } catch (error) {
        console.error('Error updating row:', error);
        throw error;
      }
    },
    [mutateRow, setVerificationData]
  );

  const handleCellClick = React.useCallback((params, event) => {
    if (!params.isEditable) {
      return;
    }

    // Ignore portal
    if (event.target.nodeType === 1 && !event.currentTarget.contains(event.target)) {
      return;
    }

    setCellModesModel((prevModel) => {
      return {
        // Revert the mode of the other cells from other rows
        ...Object.keys(prevModel).reduce(
          (acc, id) => ({
            ...acc,
            [id]: Object.keys(prevModel[id]).reduce(
              (acc2, field) => ({
                ...acc2,
                [field]: { mode: GridCellModes.View }
              }),
              {}
            )
          }),
          {}
        ),
        [params.id]: {
          // Revert the mode of other cells in the same row
          ...Object.keys(prevModel[params.id] || {}).reduce((acc, field) => ({ ...acc, [field]: { mode: GridCellModes.View } }), {}),
          [params.field]: { mode: GridCellModes.Edit }
        }
      };
    });
  }, []);

  const handleCellModesModelChange = React.useCallback((newModel) => {
    setCellModesModel(newModel);
  }, []);

  const handleOptionValuesChange = (newOptionValues) => {
    setOptionValues(newOptionValues);
  };

  const handleLocationValuesChange = (newLocOptionValues) => {
    setLocationOptionValues(newLocOptionValues);
  };

  const subDistrictCommonRef = React.createRef();

  return (
    <>
      <MainCard title="PFMS Registration Verification">
        <Box justifyContent="space-between" marginBottom={2}>
          <div>
            <SubDistrictCommon ref={subDistrictCommonRef} validationLevel={'SD'} onFormInputValuesChange={handleLocationValuesChange} />
          </div>
          <Divider style={{ marginTop: 5 }}>
            {/* <Typography variant="body1" component="div" sx={{ padding: '4px' }}> */}
            <Chip label="OR SEARCH BY" />
            {/* </Typography> */}
          </Divider>
          <div>
            <SearchComponent options={options} onOptionValuesChange={handleOptionValuesChange} />
          </div>

          <Divider style={{ marginTop: '10px' }} />

          <Box marginTop={2} style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
            <Button variant="contained" color="primary" onClick={handleFetchData}>
              Search
            </Button>
          </Box>
        </Box>

        {verificationData.length > 0 && (
          <form onSubmit={handleFormSubmit}>
            <div style={{ height: 400, width: '100%' }}>
              <DataGrid
                density="compact"
                rows={verificationData}
                columns={columns}
                processRowUpdate={processRowUpdate}
                checkboxSelection
                disableRowSelectionOnClick
                onRowSelectionModelChange={handleSelectionModelChange}
                //   slots={{ toolbar: GridToolbar }}
                slotProps={{
                  toolbar: {
                    showQuickFilter: true
                  }
                }}
                cellModesModel={cellModesModel}
                onCellModesModelChange={handleCellModesModelChange}
                onCellClick={handleCellClick}
                classes={{
                  root: classes.root
                }}
              />
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
              <Button type="submit" variant="contained" color="primary">
                Submit
              </Button>
            </div>
          </form>
        )}

        {!!snackbar && (
          <Snackbar open anchorOrigin={{ vertical: 'top', horizontal: 'center' }} onClose={handleCloseSnackbar} autoHideDuration={6000}>
            <Alert {...snackbar} onClose={handleCloseSnackbar} />
          </Snackbar>
        )}

        <Backdrop open={loading} style={{ zIndex: 999, color: '#fff' }}>
          <CircularProgress color="inherit" />
        </Backdrop>
      </MainCard>
    </>
  );
};

export default PFMSRegistrationVerification;
