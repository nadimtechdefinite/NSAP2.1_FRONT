import MainCard from 'ui-component/cards/MainCard';
import { DataGrid, GridToolbar, GridCellModes } from '@mui/x-data-grid';
import React, { useState, useEffect } from 'react';
import { Grid, Button, FormControl, Snackbar, Alert, CircularProgress, Backdrop, FormHelperText, Typography } from '@mui/material';
import axiosInstance from 'hooks/useAuthTokenUrl';
import StateList from 'components/form_components/StateList';
import DistrictList from 'components/form_components/DistrictList';
import SubDistrictList from 'components/form_components/SubDistrictList';
import AreaList from 'components/form_components/AreaList';
import { useNavigate } from 'react-router-dom';
import '../../../components/verification/mark-nsap-beneficiary/approveMarkBeneficiary.css';
import DownloadIcon from '@mui/icons-material/Download';
import NearMeIcon from '@mui/icons-material/NearMe';
import messages_en from '../../../components/common/messages_en.json';

function InvalidPensionerDetails() {
  const [getAllDistrict, setAllDistrict] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectedStateId, setSelectedState] = useState('');
  const [snackbar, setSnackbar] = React.useState(null);
  const handleCloseSnackbar = () => setSnackbar(null);
  const [loading, setLoading] = useState(false);
  const [selectedDistrictId, setSelectedDistrict] = useState(null);
  const [selectedAreaId, setSelectedArea] = useState(null);
  const [selectedSubDistrictId, setSelectedSubDistrict] = useState(null);
  const [districtName, setDistrictName] = useState(null);
  const [schemeName, setSchemeName] = useState(null);
  const [subDisName, setSubDisName] = useState(null);
  const [formErrors, setFormErrors] = useState({});

  const navigate = useNavigate();

  function cancelValue() {
    navigate('/nsap/dashboard/default');
  }

  const getLabelData = async (dis, subDis) => {
    try {
      const getStateData = '/invalid-pensioner-detail/getLabelData/' + dis + '/' + subDis;
      setLoading(true);
      const response = await axiosInstance.get(getStateData);
      setDistrictName(response.data[0]);
      setSchemeName(response.data[1]);
      setSubDisName(response.data[2]);
    } catch (error) {
      console.error('Error fetching data :', error);
    } finally {
      setLoading(true);
    }
  };

  const downloadDataInExcel = async (districtCode, selectedAreaId, selectedSubDistrictId, type, res) => {
    event.preventDefault();
    const body = {
      districtCode: districtCode,
      area: selectedAreaId,
      subDistrictMunicipalCode: selectedSubDistrictId,
      type: type,
      reasonType: res
    };
    try {
      setLoading(true);
      var urlData = '/invalid-pensioner-detail/getInvalidPensionerDetailDownlaod';
      const response = await axiosInstance.post(urlData, body, {
        responseType: 'blob'
      });

      if (response.status == 204) {
        setSnackbar({ children: 'No Data Available', severity: 'error' });
        return false;
      }
      const blob = new Blob([response.data], { type: 'application/octet-stream' });
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      var title = 'Invalid_Pensioner_Detail';
      const currentDate =
        new Date().toISOString().slice(8, 10) + '-' + new Date().toISOString().slice(5, 7) + '-' + new Date().toISOString().slice(0, 4);
      link.download = `${title}_${currentDate}.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(link.href);
    } catch (error) {
      setSnackbar({ children: 'Some Internal Error Occured While fetching data', severity: 'error' });
      console.error('Error fetching data:', error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {}, []);

  const columns = [
    {
      field: 'id',
      headerName: 'SNo.',
      width: '260',
      editable: false,
      headerClassName: 'bkColr',
      disableColumnMenu: true
    },
    {
      field: 'reason',
      headerName: 'Reason',
      flex: 1,
      editable: false,
      headerClassName: 'bkColr',
      disableColumnMenu: true
    },

    {
      field: 'dbt',
      headerName: 'DBT',
      flex: 1,
      editable: false,
      disableColumnMenu: true,
      headerClassName: 'bkColr',
      renderCell: (params) => {
        if (params.value > 0) {
          return (
            <a
              title="Click Here To Download Data In Excel"
              href={`#`}
              style={{ color: 'blue', textDecoration: 'none', cursor: 'pointer' }}
              onClick={(e) => {
                e.preventDefault();
                downloadDataInExcel(selectedDistrictId, selectedAreaId, selectedSubDistrictId, 'dbt', params.row.reason);
              }}
            >
              <b>
                {params.value} <DownloadIcon style={{ marginLeft: '-6px', verticalAlign: 'middle', fontSize: '19px' }} />
              </b>
            </a>
          );
        } else {
          return params.value;
        }
      }
    },
    {
      field: 'nondbt',
      headerName: 'NON-DBT',
      flex: 1,
      editable: false,
      disableColumnMenu: true,
      headerClassName: 'bkColr',
      renderCell: (params) => {
        if (params.value > 0) {
          return (
            <a
              title="Click Here To Download Data In Excel"
              href={`#`}
              style={{ color: 'blue', textDecoration: 'none', cursor: 'pointer' }}
              onClick={(e) => {
                e.preventDefault();
                downloadDataInExcel(selectedDistrictId, selectedAreaId, selectedSubDistrictId, 'nondbt', params.row.reason);
              }}
            >
              <b>
                {params.value} <DownloadIcon style={{ marginLeft: '-6px', verticalAlign: 'middle', fontSize: '19px' }} />
              </b>
            </a>
          );
        } else {
          return params.value;
        }
      }
    }
  ];

  const validateForm = () => {
    const errors = {};
    if (!selectedDistrictId) {
      errors.selectedDistrictId = messages_en.districtRequired;
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
    setFormErrors((prevErrors) => {
      const updatedErrors = { ...prevErrors };
      delete updatedErrors.selectedDistrictId;
      return updatedErrors;
    });
  };

  const handleSelectArea = (selectedAreaId) => {
    setSelectedArea(selectedAreaId);
    setSelectedSubDistrict(null);
  };

  const handleSelectSubDistrict = (selectedSubDistrictId) => {
    setSelectedSubDistrict(selectedSubDistrictId);
  };

  const handleClickOpen = (e) => {
    e.preventDefault();
    fetchData()
      .then((res) => {
        if (res) {
          // Data is not
          const districtData = res || [];
          setAllDistrict(districtData);
          console.log(res);
        } else {
          setAllDistrict([]);

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
            if (updatedRow.id?.trim() === '') {
              reject(new Error("Error: District Name can't be empty."));
            } else {
              resolve({ ...updatedRow, id: updatedRow.id?.toUpperCase() });
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
    if (selectedDistrictId !== null) {
      getLabelData(selectedDistrictId, selectedSubDistrictId);
    }
    const isFormValid = validateForm();
    if (isFormValid) {
      if (selectedDistrictId === null) {
        // alert("District is mandatory.");
      } else if (selectedAreaId != null) {
        if (selectedSubDistrictId === null) {
          alert('Please select Sub District');
        } else {
          try {
            var location1 = {
              stateID: selectedStateId,
              districtID: selectedDistrictId,
              area: selectedAreaId,
              subDistID: selectedSubDistrictId
            };
            var body1 = { ...location1 };
            const getUrl = `/invalid-pensioner-detail/getInvalidPensionerDetail`;
            setLoading(true);
            const response = await axiosInstance.post(getUrl, JSON.stringify(body1));
            if (response.status >= 200 && response.status < 300) {
              return response.data;
            } else {
              return false;
            }
          } catch (error) {
            console.error('Error fetching data:', error);
          } finally {
            setLoading(false);
          }
        }
      } else {
        try {
          var location = {
            stateID: selectedStateId,
            districtID: selectedDistrictId,
            area: selectedAreaId,
            subDistID: selectedSubDistrictId
          };
          var body = { ...location };
          const getUrl = `/invalid-pensioner-detail/getInvalidPensionerDetail`;
          setLoading(true);
          const response = await axiosInstance.post(getUrl, JSON.stringify(body));
          if (response.status >= 200 && response.status < 300) {
            return response.data;
          } else {
            return false;
          }
        } catch (error) {
          console.error('Error fetching data:', error);
        } finally {
          setLoading(false);
        }
      }
    }
  };

  const handleSelectionChange = (newSelection) => {
    setSelectedRows(newSelection);
  };

  const rows = getAllDistrict.map((item) => ({
    id: item.counter,
    reason: item.heading,
    dbt: item.dbtCount,
    nondbt: item.nonDbtCount
  }));
  const processRowUpdate = React.useCallback(
    async (updatedRow) => {
      try {
        const updatedRowData = await mutateRow(updatedRow);
        setAllDistrict((prevRows) => {
          const rowIndex = prevRows.findIndex((row) => row.id === updatedRowData.id);
          const updatedRows = [...prevRows];
          //handleChangeVer(true,updatedRowData.sanctionData);
          updatedRows[rowIndex] = {
            ...updatedRows[rowIndex]
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
    [mutateRow, getAllDistrict, setSnackbar, selectedRows]
  );

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (selectedRows.length === 0) {
      setSnackbar({ children: 'Please select at least one row.', severity: 'error' });
      return;
    }
    const selectedData = getAllDistrict.filter((row) => selectedRows.indexOf(row.id) !== -1);

    const updatedData1 = await processRowUpdate(selectedData);
    console.log('updated Row status : ', JSON.stringify(selectedData));

    try {
      const body = { updatedData1 };
      const apiUrl = '/update-mobile-number/saveUpdateMobileNumber';
      setLoading(true);
      const response = await axiosInstance.post(apiUrl, JSON.stringify(body));

      console.log('API Response:', response.data);
      if (response.status >= 200 && response.status < 300) {
        setSnackbar({ children: 'Record successfully updated', severity: 'success' });
        await new Promise((resolve) => setTimeout(resolve, 1250));
        setAllDistrict([]);
        handleClickOpen(e);
      } else {
        setSnackbar({ children: 'Error in updating data', severity: 'success' });
        await new Promise((resolve) => setTimeout(resolve, 1250));
      }
    } catch (error) {
      console.error('Error sending data:', error);
      setSnackbar({ children: error.message, severity: 'error' });
    } finally {
      setLoading(false);
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
      <MainCard title="Verification - Invalid Pensioner's Details">
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
            <Grid item xs={12} sm={3}>
              <FormControl fullWidth>
                <StateList onSelectState={handleSelectState} />
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={3}>
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
            <Grid item xs={12} sm={3}>
              <FormControl fullWidth>
                <AreaList selectedDistrictId={selectedDistrictId} selectedArea={selectedAreaId} onSelectArea={handleSelectArea} />
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={3}>
              <FormControl fullWidth>
                <SubDistrictList
                  selectedAreaId={selectedAreaId}
                  selectedDistrictId={selectedDistrictId}
                  setSelectedSubDistrict={setSelectedSubDistrict}
                  onSelectSubDistrict={handleSelectSubDistrict}
                />
              </FormControl>
            </Grid>

            <Grid item xs={12} alignItems="center">
              <Button type="submit" variant="contained" color="secondary" title="Submit">
                Submit <NearMeIcon />
              </Button>
              &nbsp;&nbsp;
              <Button
                type="submit"
                variant="contained"
                color="primary"
                onClick={() => {
                  cancelValue();
                }}
                style={{ marginTop: '' }}
                title="Cancel"
              >
                Cancel
              </Button>
            </Grid>
          </Grid>
        </form>
      </MainCard>

      {getAllDistrict.length > 0 ? (
        <>
          <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap' }}>
            <kbd className="responsive-kbd">
              {districtName} {subDisName != null ? ': ' + subDisName : ''}
            </kbd>
            <kbd className="responsive-kbd">Scheme : {schemeName}</kbd>
          </div>
          <form onSubmit={handleFormSubmit}>
            <MainCard>
              <DataGrid
                disableRowSelectionOnClick
                getRowId={(row) => row.id}
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
                onRowSelectionModelChange={handleSelectionChange}
                initialState={{
                  pagination: {
                    paginationModel: {
                      pageSize: 15
                    }
                  }
                }}
                pageSizeOptions={[15]}
              />
            </MainCard>
          </form>
        </>
      ) : (
        <div></div>
      )}
    </div>
  );
}
export default InvalidPensionerDetails;
