import MainCard from 'ui-component/cards/MainCard';
import { DataGrid, GridToolbar, GridCellModes } from '@mui/x-data-grid';
import React, { useState, useEffect } from 'react';
import { Grid, Button, Snackbar, Alert, CircularProgress, Backdrop, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import axiosInstance from 'hooks/useAuthTokenUrl';
import { GRID_CHECKBOX_SELECTION_COL_DEF } from '@mui/x-data-grid';
import { useNavigate } from 'react-router-dom';

function ApproveRemoveUidData() {
  const [getAllDistrict, setAllDistrict] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [snackbar, setSnackbar] = React.useState(null);
  const handleCloseSnackbar = () => setSnackbar(null);
  const [loading, setLoading] = useState(false);
  const [submitFinalValue, setSubmitFinalValue] = React.useState(false);
  const navigate = useNavigate();

  function setSubmitValue() {
    setSubmitFinalValue('true');
  }

  function cancelValue() {
    navigate('/nsap/dashboard/default');
  }

  async function handleInput(event) {
    try {
      const getResult = '/remove-uid-data/getDataBasedOnPendingDay/' + event.target.value;
      setLoading(true);
      const response = await axiosInstance.get(getResult);
      setAllDistrict(response.data);
    } catch (error) {
      console.error('Error fetching data :', error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    handleClickOpen();
  }, [submitFinalValue]);

  const columns = [
    {
      field: 'serialNumber',
      headerName: 'Sr No',
      width: '55',
      editable: false,
      disableColumnMenu: true
    },
    {
      field: 'districtCode',
      headerName: 'District Name',
      width: '150',
      editable: false,
      disableColumnMenu: true
    },
    {
      field: 'subDistrictMunicipalAreaCode',
      headerName: 'Sub-District Name',
      width: '150',
      editable: false,
      disableColumnMenu: true
    },
    {
      field: 'gramPanchayatWardCode',
      headerName: 'GP',
      width: '150',
      editable: false,
      disableColumnMenu: true
    },
    {
      field: 'sanctionOrderNo',
      headerName: 'Sanction Order No',
      width: '150',
      editable: false,
      disableColumnMenu: true
    },
    {
      field: 'schemeCode',
      headerName: 'Scheme Code',
      width: '110',
      editable: false,
      disableColumnMenu: true
    },
    {
      field: 'applicantName',
      headerName: 'Applicant Name',
      width: '150',
      editable: false,
      disableColumnMenu: true
    },
    {
      field: 'fatherHusbandName',
      headerName: 'Father/Husband Name',
      width: '170',
      editable: false,
      disableColumnMenu: true
    },
    {
      field: 'aadharNumber',
      headerName: 'Aadhar/Uid No.',
      width: '150',
      editable: false,
      disableColumnMenu: true
    },
    {
      field: 'aadharNameAsPerUid',
      headerName: 'Name as Per Aadhar',
      width: '170',
      editable: false,
      disableColumnMenu: true
    },
    {
      field: 'pendingDays',
      headerName: 'Pending Days',
      //flex:1,
      width: '110',
      editable: false,
      disableColumnMenu: true,
      sortable: false
    }
  ];

  const columnsWithCheckbox = React.useMemo(
    () => [
      ...columns,
      {
        ...GRID_CHECKBOX_SELECTION_COL_DEF
      }
    ],
    [columns]
  );

  const handleClickOpen = () => {
    fetchData()
      .then((res) => {
        if (res) {
          // Data is not null
          const districtData = res || [];
          setAllDistrict(districtData);
          //console.log(res);
        } else {
          // Data is null
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
            if (updatedRow.sanctionOrderNo?.trim() === '') {
              reject(new Error('Error:'));
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
    try {
      const getUrl = `/remove-uid-data/approveRemoveUidDataList`;
      setLoading(true);
      const response = await axiosInstance.get(getUrl);
      if (response.status >= 200 && response.status < 300) {
        return response.data;
      } else {
        return false;
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
    //}
  };

  const handleSelectionChange = (newSelection) => {
    setSelectedRows(newSelection);
  };

  const rows = getAllDistrict.map((item, index) => ({
    id: item.sanctionOrderNo,
    serialNumber: index + 1,
    sanctionOrderNo: item.sanctionOrderNo,
    applicantName: item.applicantName,
    fatherHusbandName: item.fatherHusbandName,
    schemeCode: item.scheme,
    stateCode: item.stateCode,
    districtCode: item.districtName,
    subDistrictMunicipalAreaCode: item.subDistrictName,
    gramPanchayatWardCode: item.gramPanchayatName,
    aadharNumber: item.aadharNumber,
    aadharNameAsPerUid: item.aadharName,
    pendingDays: item.pendingDays
  }));
  const processRowUpdate = React.useCallback(
    async (updatedRow) => {
      try {
        const updatedRowData = await mutateRow(updatedRow);
        setAllDistrict((prevRows) => {
          const rowIndex = prevRows.findIndex((row) => row.sanctionOrderNo === updatedRowData.sanctionOrderNo);
          const updatedRows = [...prevRows];
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
      setSnackbar({ children: 'Please select at least one row for uid removal!', severity: 'error' });
      return;
    }
    const selectedData = getAllDistrict.filter((row) => selectedRows.indexOf(row.sanctionOrderNo) !== -1);

    const updatedData1 = await processRowUpdate(selectedData);
    console.log('updated Row status : ', JSON.stringify(selectedData));

    try {
      var finalValue = confirm('Are you sure want to remove uid ?');
      if (finalValue == true) {
        const body = { updatedData1 };
        const apiUrl = '/remove-uid-data/saveApproveRemoveUidData';
        setLoading(true);
        const response = await axiosInstance.post(apiUrl, JSON.stringify(body));

        console.log('API Response:', response.data);
        if (response.status >= 200 && response.status < 300) {
          setSnackbar({ children: 'Record successfully updated', severity: 'success' });
          await new Promise((resolve) => setTimeout(resolve, 1250));
          handleClickOpen(e);
        } else {
          setSnackbar({ children: 'Error in updating data', severity: 'success' });
          await new Promise((resolve) => setTimeout(resolve, 1250));
        }
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
      <MainCard title="Approve Detach Uid">
        {!!snackbar && (
          <Snackbar open anchorOrigin={{ vertical: 'top', horizontal: 'center' }} onClose={handleCloseSnackbar} autoHideDuration={6000}>
            <Alert {...snackbar} onClose={handleCloseSnackbar} />
          </Snackbar>
        )}
        <Backdrop open={loading} style={{ zIndex: 999, color: '#fff' }}>
          <CircularProgress color="inherit" />
        </Backdrop>
        <FormControl style={{ width: '10%' }}>
          <InputLabel id="op1-label">-- Pending Days --</InputLabel>
          <Select name="daysData" label={'-- Pending Days --'} onChange={(event) => handleInput(event, this)}>
            <MenuItem value="all">ALL</MenuItem>
            <MenuItem value="1">1 days</MenuItem>
            <MenuItem value="2">2 days</MenuItem>
            <MenuItem value="3">3 days</MenuItem>
            <MenuItem value="4">4 days</MenuItem>
            <MenuItem value="5">5 days</MenuItem>
            <MenuItem value="6">6 days</MenuItem>
          </Select>
        </FormControl>
      </MainCard>

      {getAllDistrict.length > 0 ? (
        <>
          <form onSubmit={handleFormSubmit}>
            <MainCard>
              <DataGrid
                checkboxSelection
                disableRowSelectionOnClick
                getRowId={(row) => row.sanctionOrderNo}
                slots={{ toolbar: GridToolbar }}
                slotProps={{
                  toolbar: {
                    showQuickFilter: true,
                    printOptions: { disableToolbarButton: true }
                  }
                }}
                columns={columnsWithCheckbox}
                rows={rows}
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
              <Grid item xs={12} alignItems="center">
                <Button
                  type="submit"
                  variant="contained"
                  color="secondary"
                  onClick={() => {
                    setSubmitValue();
                  }}
                  style={{ marginTop: '5px' }}
                  title="APPROVE REMOVAL"
                >
                  APPROVE REMOVAL
                </Button>
                &nbsp;&nbsp;
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  onClick={() => {
                    cancelValue();
                  }}
                  style={{ marginTop: '5px' }}
                  title="CANCEL"
                >
                  CANCEL
                </Button>
              </Grid>
            </MainCard>
          </form>
        </>
      ) : (
        <div>
          <span style={{ display: 'block', textAlign: 'center', color: 'red' }}>No Data Available.</span>
        </div>
      )}
    </div>
  );
}
export default ApproveRemoveUidData;
