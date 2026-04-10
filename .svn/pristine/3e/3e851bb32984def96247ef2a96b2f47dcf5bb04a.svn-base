import Box from '@mui/material/Box';
import MainCard from 'ui-component/cards/MainCard';
import { DataGrid, GridToolbar, GridCellModes } from '@mui/x-data-grid';
import React, { useState } from 'react';
import { Grid, Button, FormControl, Typography, Backdrop, CircularProgress, Divider, Chip, FormHelperText } from '@mui/material';
import axiosInstance from 'hooks/useAuthTokenUrl';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import EditIcon from '@mui/icons-material/Edit';
import SearchComponent from 'components/common/SearchTypeCommon';
import StateList from 'components/form_components/StateList';
import DistrictList from 'components/form_components/DistrictList';
import SubDistrictList from 'components/form_components/SubDistrictList';
import GramPanchayatList from 'components/form_components/GramPanchayatList';
import VillageList from 'components/form_components/VillageList';
import AreaList from 'components/form_components/AreaList';
import messages_en from '../../../components/common/messages_en.json';

export default function ApproveAadharConsentUpdation() {
  const [getAllDisData, setAllDisConData] = useState([]);
  const [selectedStateId, setSelectedState] = useState('');
  const [snackbar, setSnackbar] = React.useState(null);
  const handleCloseSnackbar = () => setSnackbar(null);
  const [selectedDistrictId, setSelectedDistrict] = useState(null);
  const [selectedAreaId, setSelectedArea] = useState(null);
  const [selectedSubDistrictId, setSelectedSubDistrict] = useState(null);
  const [selectedGramPanchyat, setSelectedGramPanchyat] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  //const [isverError, setIsverError] = useState(false);
  //const submitformRef = useRef(null);

  const options = {
    sanctionOrderNo: 'Sanction Order No'
  };
  const [optionValues, setOptionValues] = useState(null);
  const handleSearchOptionValuesChange = (newOptionValues) => {
    setOptionValues(newOptionValues);
  };

  const columns = [
    {
      field: 'serialNumber',
      headerName: 'Sr No',
      width: '100',
      editable: false,
      disableColumnMenu: true
    },
    {
      field: 'sanctionOrderNo',
      headerName: 'Sanction Order No',
      flex: 1,
      editable: false,
      disableColumnMenu: true
    },
    {
      field: 'schemeCode',
      headerName: 'Scheme Name',
      flex: 1,
      editable: false,
      disableColumnMenu: true
    },

    {
      field: 'uidNo',
      headerName: 'Uid No Old',
      flex: 1,
      editable: false,
      disableColumnMenu: true
    },
    {
      field: 'nameAsPerUid',
      headerName: 'Name As Per Uid Old',
      flex: 1,
      editable: false,
      disableColumnMenu: true
    },
    {
      field: 'uidNoNew',
      headerName: 'Uid No New',
      flex: 1,
      editable: false,
      disableColumnMenu: true
    },
    {
      field: 'nameAsPerUidNew',
      headerName: 'Name As Per Uid New',
      //flex:1,
      width: '170',
      editable: false,
      disableColumnMenu: true
    },
    {
      field: 'dys',
      headerName: 'Pending Days',
      flex: 1,
      editable: false,
      disableColumnMenu: true
    },

    {
      field: 'actionRemarks',
      sortable: false,
      disableColumnMenu: true,
      headerName: (
        <div>
          <EditIcon fontSize="small" style={{ marginBottom: '-4px', color: 'blue' }} /> Remarks
        </div>
      ),
      flex: 1,
      editable: true
    },
    {
      field: 'action',
      sortable: false,
      disableColumnMenu: true,
      headerName: 'Action',
      width: 180,
      headerAlign: 'center',
      renderCell: (params) => (
        <>
          <Button
            title="Verify"
            variant="outlined"
            color="success"
            style={{ cursor: 'pointer', fontSize: '12px', marginRight: '8px' }}
            onClick={(e) => handleButtonClick1(e, params.row.id, 'true', 'Verify')}
          >
            Verify
          </Button>
          <Button
            title="Reject"
            variant="outlined"
            color="error"
            style={{ cursor: 'pointer', fontSize: '12px' }}
            onClick={(e) => handleButtonClick1(e, params.row.id, 'false', 'Reject')}
          >
            Reject
          </Button>
        </>
      )
    }
  ];

  const validateForm = () => {
    const errors = {};
    if (optionValues.sanctionOrderNo === null && !selectedDistrictId) {
      errors.selectedDistrictId = messages_en.districtRequired;
    }
    if (optionValues.sanctionOrderNo === null && !selectedAreaId) {
      errors.selectedAreaId = messages_en.areaRequired;
    }
    if (optionValues.sanctionOrderNo === null && !selectedSubDistrictId) {
      errors.selectedSubDistrictId = messages_en.subDistrictRequired;
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSelectState = (state) => {
    setSelectedState(state);
  };

  const handleSelectDistrict = (selectedDistrictId) => {
    setSelectedDistrict(selectedDistrictId);
    setSelectedArea(null);
    setSelectedSubDistrict(null);
    setSelectedGramPanchyat(null);
    setSelectedVillage(null);
    setFormErrors((prevErrors) => {
      const updatedErrors = { ...prevErrors };
      delete updatedErrors.selectedDistrictId;
      return updatedErrors;
    });
  };

  const handleSelectArea = (selectedAreaId) => {
    setSelectedArea(selectedAreaId);
    setSelectedSubDistrict(null);
    setSelectedGramPanchyat(null);
    setSelectedVillage(null);
    setFormErrors((prevErrors) => {
      const updatedErrors = { ...prevErrors };
      delete updatedErrors.selectedAreaId;
      return updatedErrors;
    });
  };

  const handleSelectSubDistrict = (selectedSubDistrictId) => {
    setSelectedSubDistrict(selectedSubDistrictId);
    setSelectedGramPanchyat(null);
    setSelectedVillage(null);
    setFormErrors((prevErrors) => {
      const updatedErrors = { ...prevErrors };
      delete updatedErrors.selectedSubDistrictId;
      return updatedErrors;
    });
  };

  const handleGramPanchyat = (selectedGramPanchyat) => {
    setSelectedGramPanchyat(selectedGramPanchyat);
    setSelectedVillage(null);
  };
  const [selectedVillage, setSelectedVillage] = useState(null);
  const handleSelectVillgae = (selectedVillage) => {
    setSelectedVillage(selectedVillage);
  };

  const handleClickOpen = (e) => {
    e.preventDefault();
    // if (!isverError && selectedDistrictId) {
    //   console.log('selectedDistrictId successfully!', selectedDistrictId);
    // } else {
    //   setIsverError(!selectedDistrictId);
    //   if (submitformRef.current) {
    //     submitformRef.current.scrollIntoView({ behavior: 'auto', block: 'start' });
    //   }
    //   return;
    // }

    fetchData()
      .then((res) => {
        if (res) {
          const districtData = res || [];
          setAllDisConData(districtData);
          console.log(res);
        } else {
          setAllDisConData([]);
          //setSnackbar({ children: 'No Data Found', severity: 'error' });
          return false;
        }
      })
      .catch((e) => {
        console.log(e.message);
      });
  };

  const useFakeMutation = () => {
    return React.useCallback(
      (updatedRow) =>
        new Promise((resolve, reject) => {
          setTimeout(() => {
            if (updatedRow.sanctionOrderNo?.trim() === '') {
              reject(new Error("Error: District Name can't be empty."));
            } else {
              resolve({ ...updatedRow, sanctionOrderNo: updatedRow.sanctionOrderNo?.toUpperCase() });
            }
          }, 200);
        }),
      []
    );
  };
  const handleProcessRowUpdateError = React.useCallback((error) => {
    setSnackbar({ children: error.message, severity: 'error' });
  }, []);
  const mutateRow = useFakeMutation();
  const fetchData = async () => {
    const isFormValid = validateForm();
    if (isFormValid) {
      try {
        var location = {
          stateID: selectedStateId,
          districtID: selectedDistrictId,
          area: selectedAreaId,
          subDistID: selectedSubDistrictId,
          gpID: selectedGramPanchyat,
          villageID: selectedVillage
        };
        var body = { ...optionValues, ...location };
        const getUrl = `/approve-aadhar-consent-updation/getApproveAadharConsentUpdation`;
        setLoading(true);
        const response = await axiosInstance.post(getUrl, JSON.stringify(body));
        // console.log("---------------------"+response[0].status);
        if (response.status >= 200 && response.status < 300) {
          if (response.data.length > 0) {
            return response.data;
          } else {
            setSnackbar({ children: 'No Data Found!', severity: 'error' });
          }
        } else {
          return false;
          //  throw new Error('Data coud not be fetched!', response.data)
        }
      } catch (error) {
        if (error.response.data.sanctionOrderNo) {
          setSnackbar({ children: error.response.data.sanctionOrderNo, severity: 'error' });
        } else {
          setSnackbar({ children: 'No Data Found', severity: 'error' });
        }
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const rows = getAllDisData.map((item, index) => ({
    id: item.sanctionOrderNo,
    serialNumber: index + 1,
    sanctionOrderNo: item.sanctionOrderNo,
    schemeCode: item.schemeCode,
    rejectRemarks: item.rejectRemarks,
    actionRemarks: item.actionRemarks,
    uidNo: item.uidNo,
    nameAsPerUid: item.nameAsPerUid,
    uidNoNew: item.uidNoNew,
    nameAsPerUidNew: item.nameAsPerUidNew,
    dys: item.dys + ' Days'
  }));
  const processRowUpdate = React.useCallback(
    async (updatedRow) => {
      try {
        const updatedRowData = await mutateRow(updatedRow);
        console.log('updatedRow check status : ', updatedRowData);

        setAllDisConData((prevRows) => {
          // Find the index of the updated row
          const rowIndex = prevRows.findIndex((row) => row.sanctionOrderNo === updatedRowData.sanctionOrderNo);

          const updatedRows = [...prevRows];
          updatedRows[rowIndex] = {
            ...updatedRows[rowIndex], // Keep the existing fields

            actionRemarks: updatedRowData.actionRemarks, // Update only the 'status' field (replace with your field names)
            sanctionDate: updatedRowData.sanctionDate,
            pensionEffectiveDate: updatedRowData.pensionEffectiveDate
          };

          return updatedRows;
        });

        return updatedRowData;
      } catch (error) {
        console.error('Error updating row:', error);
        setSnackbar({ children: error.message, severity: 'error' });
        throw error;
      }
    },
    [mutateRow, setAllDisConData, setSnackbar]
  );

  function isOnlyTextRemarkd(inputString) {
    return /^[a-zA-Z\s.]+$/.test(inputString);
  }

  const handleButtonClick1 = async (e, rowId, action, status) => {
    try {
      e.preventDefault();
      // Find the row corresponding to the clicked button
      const selectedRow = getAllDisData.find((row) => row.sanctionOrderNo === rowId);

      // Validate that approved remarks are filled
      //if (!selectedRow.sanctionDate || selectedRow.sanctionDate.trim() === '') {
      // setSnackbar({ children: 'Please enter Date Of Sanctioned', severity: 'error' });
      // return;
      //}
      if (!selectedRow.actionRemarks || selectedRow.actionRemarks.trim() === '') {
        var remarksSts = status === 'Verify' ? 'verify' : 'reject';
        setSnackbar({ children: `Please enter remarks for ${remarksSts}`, severity: 'error' });
        return;
      }
      const updatedRowData = { ...getAllDisData.find((row) => row.sanctionOrderNo === rowId), approvedStatus: action };

      if (isOnlyTextRemarkd(updatedRowData.actionRemarks)) {
        //alert("Only text allow in remarks");
      } else {
        alert('Not allow numeric and special characters in remarks');
        return;
      }
      console.log('update row 1' + JSON.stringify(updatedRowData));
      setAllDisConData((prevRows) => {
        const rowIndex = prevRows.findIndex((row) => row.sanctionOrderNo === rowId);
        const updatedRows = [...prevRows];
        updatedRows[rowIndex] = {
          ...updatedRows[rowIndex],
          approvedStatus: updatedRowData.approvedStatus,
          actionRemarks: updatedRowData.actionRemarks
        };
        console.log('update row 2' + JSON.stringify(updatedRowData));
        return updatedRows;
      });
      const updatedData1 = await processRowUpdate(updatedRowData);

      console.log(JSON.stringify(updatedData1));
      try {
        var apiUrl = null;
        if (action === 'true') {
          apiUrl = '/approve-aadhar-consent-updation/approveAadharConsentUpdationData';
          setLoading(true);
        } else {
          apiUrl = '/approve-aadhar-consent-updation/rjctAadharConsentUpdationData';
          setLoading(true);
        }
        // Replace with your actual API endpoint
        // const response = await axiosInstance.post(apiUrl,JSON.stringify(updatedRowData));
        const response = await axiosInstance.post(apiUrl, {
          [updatedRowData.sanctionOrderNo]: updatedRowData
          // other key-value pairs...
        });
        if (response.status >= 200 && response.status < 300) {
          console.log('API Response:', response.data);
          setSnackbar({ children: 'Successfully updated', severity: 'success' });
          await new Promise((resolve) => setTimeout(resolve, 3550));

          handleClickOpen(e);
        }
        // setSnackbar({ children: 'Successfully updated', severity: 'success' });
        else {
          setSnackbar({ children: 'Error in updating data', severity: 'success' });
          await new Promise((resolve) => setTimeout(resolve, 1250));
        }
      } catch (error) {
        console.error('Error sending data:', error);
        setSnackbar({ children: error.message, severity: 'error' });
      } finally {
        setLoading(false);
      }

      // setSnackbar({ children: `${status} successfully`, severity: 'success' });
      setSnackbar({ children: `${status} successfully`, severity: 'success' });
      await new Promise((resolve) => setTimeout(resolve, 1250));
      handleClickOpen(e);
    } catch (error) {
      console.error('Error calling API:', error);
      setSnackbar({ children: error.message, severity: 'error' });
    }
  };
  const [cellModesModel, setCellModesModel] = React.useState({});

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
  return (
    <div>
      <MainCard title="Approve Change Aadhaar Consent Updation">
        {!!snackbar && (
          <Snackbar open anchorOrigin={{ vertical: 'top', horizontal: 'center' }} onClose={handleCloseSnackbar} autoHideDuration={6000}>
            <Alert {...snackbar} onClose={handleCloseSnackbar} />
          </Snackbar>
        )}

        <Backdrop open={loading} style={{ zIndex: 999, color: '#fff' }}>
          <CircularProgress color="inherit" />
        </Backdrop>
        <form onSubmit={(e) => handleClickOpen(e)}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <StateList setSelectedState={setSelectedState} onSelectState={handleSelectState} />
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <DistrictList
                  selectedStateId={selectedStateId}
                  setSelectedDistrict={setSelectedDistrict}
                  onSelectDistrict={handleSelectDistrict}
                />
                {formErrors.selectedDistrictId && (
                  <FormHelperText>
                    <Typography style={{ color: 'red', fontSize: '0.8rem' }}>{formErrors.selectedDistrictId}</Typography>
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <AreaList selectedDistrictId={selectedDistrictId} selectedArea={selectedAreaId} onSelectArea={handleSelectArea} />
                {formErrors.selectedAreaId && (
                  <FormHelperText>
                    <Typography style={{ color: 'red', fontSize: '0.8rem' }}>{formErrors.selectedAreaId}</Typography>
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <SubDistrictList
                  selectedAreaId={selectedAreaId}
                  selectedDistrictId={selectedDistrictId}
                  setSelectedSubDistrict={setSelectedSubDistrict}
                  onSelectSubDistrict={handleSelectSubDistrict}
                />
                {formErrors.selectedSubDistrictId && (
                  <FormHelperText>
                    <Typography style={{ color: 'red', fontSize: '0.8rem' }}>{formErrors.selectedSubDistrictId}</Typography>
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <GramPanchayatList
                  selectedSubDistrictMunicipalAreaId={selectedSubDistrictId}
                  setSelectedGramPanchayat={selectedGramPanchyat}
                  onSelectGramPanchayat={handleGramPanchyat}
                />
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <VillageList
                  selectedGramPanchayatId={selectedGramPanchyat}
                  setSelectedVillage={setSelectedVillage}
                  onSelectVillage={handleSelectVillgae}
                />
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={12}>
              <Divider>
                {' '}
                <Chip label="OR SEARCH BY" />{' '}
              </Divider>
              <br />
            </Grid>
            <Grid>
              <SearchComponent options={options} onOptionValuesChange={handleSearchOptionValuesChange} />
            </Grid>

            <Grid item xs={12} alignItems="center">
              <Button type="submit" variant="contained" color="secondary" title="Submit">
                Submit
              </Button>
              &nbsp;
              <Button
                variant="contained"
                color="primary"
                onClick={() => {
                  cancelValue();
                }}
                title="Cancel"
              >
                Cancel
              </Button>
            </Grid>
          </Grid>
        </form>
      </MainCard>

      {getAllDisData.length > 0 ? (
        <MainCard title="Approve Aadhaar Consent Updation">
          <Box sx={{ height: 400, width: '100%' }}>
            <DataGrid
              disableRowSelectionOnClick
              getRowId={(row) => row.sanctionOrderNo}
              slots={{ toolbar: GridToolbar }}
              slotProps={{
                toolbar: {
                  showQuickFilter: true,
                  printOptions: { disableToolbarButton: true }
                }
              }}
              rows={rows}
              columns={columns}
              cellModesModel={cellModesModel}
              onCellModesModelChange={handleCellModesModelChange}
              onCellClick={handleCellClick}
              processRowUpdate={processRowUpdate}
              onProcessRowUpdateError={handleProcessRowUpdateError}
              initialState={{
                pagination: {
                  paginationModel: {
                    pageSize: 15
                  }
                }
              }}
              pageSizeOptions={[15]}
            />
          </Box>
        </MainCard>
      ) : (
        <div></div>
      )}
    </div>
  );
}
