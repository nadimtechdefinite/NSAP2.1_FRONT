import React, { useState } from 'react';
import { DataGrid, GridToolbar, GridCellModes } from '@mui/x-data-grid';
import { Button, Box, Divider, Chip } from '@mui/material';
import axiosInstance from 'hooks/useAuthTokenUrl';
import MainCard from 'ui-component/cards/MainCard';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import Backdrop from '@mui/material/Backdrop';
import EditIcon from '@mui/icons-material/Edit';
import SearchComponent from 'components/common/SearchTypeCommon';
import SubDistrictCommon from 'components/common/SubDistrictCommon';

const ReInstatePension = () => {
  const [discontinuedData, setDiscontinuedData] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [snackbar, setSnackbar] = React.useState(null);
  const handleCloseSnackbar = () => setSnackbar(null);
  const [loading, setLoading] = useState(false);
  const [cellModesModel, setCellModesModel] = React.useState({});

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
    { field: 'fatherHusbandName', headerName: 'Father/Husband Name', flex: 1 },
    { field: 'disbursementUptoCenter', headerName: 'Last Paid Upto Date', flex: 1 },
    { field: 'statusDesc', headerName: 'Discontinue Reason', width: 150 },
    { field: 'creationRemarks', headerName: 'Discontinue Remarks', width: 150 },
    { field: 'discontinuationDate', headerName: 'Discontinued Date', flex: 1 },
    {
      field: 'appealRemarks',
      headerName: (
        <div>
          <EditIcon color="primary" fontSize="small" style={{ marginBottom: '-4px' }} /> Appeal Remarks
        </div>
      ),
      editable: true,
      cellEditor: 'agTextCellEditor',
      cellEditorParams: { required: true, placeholder: 'Enter remarks' },
      width: 150
    }

    // Add other columns based on your requirements
  ];

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
      const response = await axiosInstance.post('appeals/findAllDiscontinuedDetails', JSON.stringify(requestData));

      if (response.data.length < 1) {
        setDiscontinuedData([]);
        setSnackbar({ children: 'No Discontinued Pensioner Found', severity: 'error' });
        return false;
      }
      const newData = response.data.map((row) => ({ ...row, id: row.sanctionOrderNo }));
      setDiscontinuedData(newData);
    } catch (error) {
      if (error.response.data.sanctionOrderNo) {
        setSnackbar({ children: error.response.data.sanctionOrderNo, severity: 'error' });
      } else if (error.response.data.beneficiaryNo) {
        setSnackbar({ children: error.response.data.beneficiaryNo, severity: 'error' });
      } else {
        setSnackbar({ children: 'Some Internal Error Occured', severity: 'error' });
      }
      // console.log(error);
      // setSnackbar({ children: error.response.data , severity: 'error' });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const selectedData = discontinuedData.filter((row) => selectedRows.indexOf(row.sanctionOrderNo) !== -1);

    if (selectedData.length < 1) {
      setSnackbar({ children: 'Please select atleast one row ', severity: 'error' });
      return false;
    }

    const isRemarksValid = selectedRows.every((rowId) => {
      const selectedRow = discontinuedData.find((row) => row.sanctionOrderNo === rowId);
      return selectedRow && selectedRow.appealRemarks != null && selectedRow.appealRemarks.trim() !== '';
    });

    if (!isRemarksValid) {
      setSnackbar({ children: 'Please fill in remarks for all selected rows.', severity: 'error' });
      return false;
    }

    const updatedData = await processRowUpdate(selectedData);
    const bodyData = JSON.stringify(Object.values(updatedData).filter((value) => value !== null && value !== undefined));

    try {
      setLoading(true);
      const response = await axiosInstance.post('appeals/saveReInstateAppealsDetails', bodyData);

      if (response.data.length > 0) {
        setSnackbar({ children: 'Reinstate Appeal Raised SuccessFully', severity: 'success' });
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
            if (updatedRow.appealRemarks?.trim() === '') {
              reject(new Error("Error:Appeals Remark can't be empty."));
            } else {
              resolve({ ...updatedRow, appealRemarks: updatedRow.appealRemarks?.toUpperCase() });
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

        setDiscontinuedData((prevRows) => {
          // Find the index of the updated row
          const rowIndex = prevRows.findIndex((row) => row.sanctionOrderNo === updatedRowData.sanctionOrderNo);

          // Create a new array with the updated row
          const updatedRows = [...prevRows];
          updatedRows[rowIndex] = {
            ...updatedRows[rowIndex], // Keep the existing fields
            //  status: updatedRowData.status,
            appealRemarks: updatedRowData.appealRemarks // Update only the 'status' field (replace with your field names)
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
    [mutateRow, setDiscontinuedData]
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
      <MainCard title="Pensioner Reinstate Appeal">
        <Box justifyContent="space-between" marginBottom={2}>
          <div>
            <SubDistrictCommon ref={subDistrictCommonRef} validationLevel={'D'} onFormInputValuesChange={handleLocationValuesChange} />
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

        {discontinuedData.length > 0 && (
          <form onSubmit={handleFormSubmit}>
            <div style={{ height: 400, width: '100%' }}>
              <DataGrid
                rows={discontinuedData}
                columns={columns}
                processRowUpdate={processRowUpdate}
                checkboxSelection
                disableRowSelectionOnClick
                onRowSelectionModelChange={handleSelectionModelChange}
                slots={{ toolbar: GridToolbar }}
                slotProps={{
                  toolbar: {
                    showQuickFilter: true
                  }
                }}
                cellModesModel={cellModesModel}
                onCellModesModelChange={handleCellModesModelChange}
                onCellClick={handleCellClick}
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

export default ReInstatePension;
