import Box from '@mui/material/Box';
import MainCard from 'ui-component/cards/MainCard';
import { DataGrid, GridToolbar, GridCellModes } from '@mui/x-data-grid';
import React, { useState } from 'react';
import { Grid, Button, FormControl, Breadcrumbs, Link, Typography } from '@mui/material';
import axiosInstance from 'hooks/useAuthTokenUrl';
import StateList from 'components/form_components/StateList';
import DistrictList from 'components/form_components/DistrictList';
import SubDistrictList from 'components/form_components/SubDistrictList';
import SchemeList from 'components/form_components/SchemeList';
import AreaList from 'components/form_components/AreaList';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import EditIcon from '@mui/icons-material/Edit';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

export default function GenerateSanctionOrder() {
  const [getAllDisData, setAllDisConData] = useState([]);
  const [selectedStateId, setSelectedState] = useState('');
  const [snackbar, setSnackbar] = React.useState(null);
  const handleCloseSnackbar = () => setSnackbar(null);
  const [pensionEffectiveDate, setPensionEffectiveDate] = useState('');
  const [selectedRowId, setSelectedRowId] = useState(null);
  //const [sanctionDateValue, setSanctionDateValue] = useState('');

  {
    /*const handleChange = (field, value,rowId) => {
    //alert("here");
    if (field === 'sanctionDate') {
   //alert("--- "+value);
   //var dateObj=value.format('DD-MM-YYYY');
   var dateObjNew=value.format('DD-MM-YYYY').split('-');
   //alert("=== "+dateObjNew[0]+' @'+dateObjNew[1]+' @ '+dateObjNew[2]);
   //alert('- ' +dateObj );
   var dateObjNewForSet='01-'+dateObjNew[1]+'-'+dateObjNew[2];
   alert(`Pension Calculation Will be Taken As The Data ${dateObjNew[0]}-${dateObjNew[1]}-${dateObjNew[2]} Please Confirm`);
   setPensionEffectiveDate(dateObjNewForSet);
   
   //setSanctionDateValue(value.format('DD-MM-YYYY'));
   //alert('**** '+sanctionDateValue);
    setSelectedRowId(rowId); // Set the selected row ID
  }
  } */
  }

  const handleChange = (field, value, rowId) => {
    var dateObjNew = value.format('DD-MM-YYYY').split('-');
    var dateObjNewForSet = '01-' + dateObjNew[1] + '-' + dateObjNew[2];
    setPensionEffectiveDate(dateObjNewForSet);
    alert(`Pension Calculation Will be Taken As The Data 30-${dateObjNew[1] - 1}-${dateObjNew[2]} Please Confirm`);
    setSelectedRowId(rowId);
    setAllDisConData((prevRows) =>
      prevRows.map((row) => (row.applicationNo === rowId ? { ...row, ['sanctionDate']: value.format('DD-MM-YYYY') } : row))
    );
    setAllDisConData((prevRows) =>
      prevRows.map((row) => (row.applicationNo === rowId ? { ...row, ['pensionEffectiveDate']: dateObjNewForSet } : row))
    );
  };

  const columns = [
    {
      field: 'applicationNo',
      headerName: 'Application No',
      //flex:1,
      editable: false,
      width: 130
    },
    {
      field: 'applicantName',
      headerName: 'Applicant Name',
      //flex:1,
      editable: false,
      width: 130
    },
    {
      field: 'dateOfApplication',
      headerName: 'Date of Application',
      //flex:1,
      editable: false,
      width: 120
    },
    {
      field: 'dateOfVerification',
      headerName: 'Date of Verification',
      //flex:1,
      editable: false,
      width: 120
    },
    {
      field: 'dateOfBirth',
      headerName: 'DOB',
      //flex:1,
      editable: false
    },
    {
      field: 'sanctionDate',
      headerName: (
        <div style={{ cursor: 'pointer' }}>
          <EditIcon fontSize="small" style={{ marginBottom: '-4px', color: 'blue' }} /> Date of Sanctioned
        </div>
      ),
      //flex: 1,
      width: 160,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label="Date of Sanctioned"
            format="DD-MM-YYYY"
            disableFuture
            name="sanctionDate"
            slotProps={{ textField: { fullWidth: true } }}
            variant="outlined"
            onChange={(selectedDate) => handleChange('sanctionDate', selectedDate, params.row.id)}
          ></DatePicker>
        </LocalizationProvider>
      )
    },
    {
      field: 'pensionEffectiveDate',
      headerName: (
        <div>
          <EditIcon fontSize="small" style={{ marginBottom: '-4px', color: 'blue' }} /> Pension Effective Date
        </div>
      ),
      //flex:1,
      width: 130,
      valueGetter: (params) => (params.row.id === selectedRowId ? pensionEffectiveDate : ''),
      editable: false
    },
    {
      field: 'pendingDays',
      headerName: 'Pending Days',
      //flex:1,
      editable: false
    },
    {
      field: 'sanctionRemarks',

      headerName: (
        <div>
          <EditIcon fontSize="small" style={{ marginBottom: '-4px', color: 'blue' }} /> Remarks
        </div>
      ),
      //flex:1,
      editable: true
    },
    {
      field: 'action',
      headerName: 'Action',
      width: 180,
      headerAlign: 'center',
      renderCell: (params) => (
        <>
          <Button
            variant="outlined"
            color="success"
            style={{ cursor: 'pointer', fontSize: '12px', marginRight: '8px' }}
            onClick={(e) => handleButtonClick1(e, params.row.id, 'true', 'Sanction')}
          >
            Sanction
          </Button>
          <Button
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
  const handleSelectState = (state) => {
    setSelectedState(state);
  };
  const [selectedDistrictId, setSelectedDistrict] = useState('');
  const handleSelectDistrict = (selectedDistrictId) => {
    setSelectedDistrict(selectedDistrictId);
  };
  const [selectedAreaId, setSelectedArea] = useState('');
  const handleSelectArea = (selectedAreaId) => {
    setSelectedArea(selectedAreaId);
  };
  const [selectedSubDistrictId, setSelectedSubDistrict] = useState('');
  const handleSelectSubDistrict = (selectedSubDistrictId) => {
    setSelectedSubDistrict(selectedSubDistrictId);
  };
  const [selectedSchemeCode, setSelectedScheme] = useState('');
  const handleSelectScheme = (schemeCode) => {
    setSelectedScheme(schemeCode);
  };
  const handleClickOpen = (e) => {
    e.preventDefault();
    fetchData()
      .then((res) => {
        if (res) {
          const districtData = res || [];
          setAllDisConData(districtData);
          console.log(res);
        } else {
          setAllDisConData([]);
          setSnackbar({ children: 'No Data Found', severity: 'error' });
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
            if (updatedRow.applicationNo?.trim() === '') {
              reject(new Error("Error: District Name can't be empty."));
            } else {
              resolve({ ...updatedRow, applicationNo: updatedRow.applicationNo?.toUpperCase() });
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
      const getUrl = `/sanction-order-master/getPendingSanctionOrderNoRecord`;
      const body = JSON.stringify({
        stateID: selectedStateId,
        districtID: selectedDistrictId,
        area: selectedAreaId,
        subDistID: selectedSubDistrictId,
        schemeCode: selectedSchemeCode
      });
      const response = await axiosInstance.post(getUrl, body);
      // console.log("---------------------"+response[0].status);
      if (response.status >= 200 && response.status < 300) {
        return response.data;
      } else {
        return false;
        //  throw new Error('Data coud not be fetched!', response.data)
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const rows = getAllDisData.map((item) => ({
    id: item.applicationNo,
    applicantName: item.applicantName,
    applicationNo: item.applicationNo,
    applicationDate: item.applicationDate,
    sanctionDate: item.sanctionDate,
    dateOfBirth: item.dateOfBirth,
    mobileNumber: item.mobileNumber,
    beneficiaryNo: item.beneficiaryNo,
    pensionEffectiveDate: item.pensionEffectiveDate,
    rejectRemarks: item.rejectRemarks,
    sanctionRemarks: item.sanctionRemarks,
    pendingDays: item.pendingDays,
    dateOfApplication: item.dateOfApplication,
    dateOfVerification: item.dateOfVerification
  }));
  const processRowUpdate = React.useCallback(
    async (updatedRow) => {
      try {
        const updatedRowData = await mutateRow(updatedRow);
        console.log('updatedRow check status : ', updatedRowData);

        setAllDisConData((prevRows) => {
          // Find the index of the updated row
          const rowIndex = prevRows.findIndex((row) => row.applicationNo === updatedRowData.applicationNo);

          const updatedRows = [...prevRows];
          updatedRows[rowIndex] = {
            ...updatedRows[rowIndex], // Keep the existing fields

            sanctionRemarks: updatedRowData.sanctionRemarks, // Update only the 'status' field (replace with your field names)
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

  const handleButtonClick1 = async (e, rowId, action, status) => {
    try {
      e.preventDefault();
      // Find the row corresponding to the clicked button
      const selectedRow = getAllDisData.find((row) => row.applicationNo === rowId);

      // Validate that approved remarks are filled
      //if (!selectedRow.sanctionDate || selectedRow.sanctionDate.trim() === '') {
      // setSnackbar({ children: 'Please enter Date Of Sanctioned', severity: 'error' });
      // return;
      //}
      if (!selectedRow.sanctionRemarks || selectedRow.sanctionRemarks.trim() === '') {
        setSnackbar({ children: 'Please enter remarks', severity: 'error' });
        return;
      }
      const updatedRowData = { ...getAllDisData.find((row) => row.applicationNo === rowId), approvedStatus: action };
      console.log('update row 1' + JSON.stringify(updatedRowData));
      setAllDisConData((prevRows) => {
        const rowIndex = prevRows.findIndex((row) => row.applicationNo === rowId);
        const updatedRows = [...prevRows];
        updatedRows[rowIndex] = {
          ...updatedRows[rowIndex],
          approvedStatus: updatedRowData.approvedStatus,
          sanctionRemarks: updatedRowData.sanctionRemarks,
          sanctionDate: updatedRowData.sanctionDate,
          pensionEffectiveDate: updatedRowData.pensionEffectiveDate
        };
        console.log('update row 2' + JSON.stringify(updatedRowData));
        return updatedRows;
      });
      const updatedData1 = await processRowUpdate(updatedRowData);

      console.log(JSON.stringify(updatedData1));
      try {
        var apiUrl = null;
        if (action === 'true') {
          apiUrl = '/sanction-order-master/approveSanctionOrderNo';
        } else {
          apiUrl = '/sanction-order-master/rjctSanctionOrderNo';
        }
        // Replace with your actual API endpoint
        // const response = await axiosInstance.post(apiUrl,JSON.stringify(updatedRowData));
        const response = await axiosInstance.post(apiUrl, {
          [updatedRowData.applicationNo]: updatedRowData
          // other key-value pairs...
        });
        if (response.status >= 200 && response.status < 300) {
          console.log('API Response:', response.data);
          setSnackbar({ children: 'Successfully updated', severity: 'success' });
          await new Promise((resolve) => setTimeout(resolve, 1250));

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
      <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb" style={{ marginBottom: '20px' }}>
        <Link color="inherit" href="#" style={{ color: 'blue' }} title="Home">
          Home
        </Link>
        <Link color="inherit" href="#" style={{ color: 'blue' }} title="Sanction">
          Sanction
        </Link>
        <Typography color="textInfo" title="Generate Sanction Order No">
          Generate Sanction Order No
        </Typography>
      </Breadcrumbs>

      <MainCard title="Generate Sanction Order No">
        {!!snackbar && (
          <Snackbar open anchorOrigin={{ vertical: 'top', horizontal: 'center' }} onClose={handleCloseSnackbar} autoHideDuration={6000}>
            <Alert {...snackbar} onClose={handleCloseSnackbar} />
          </Snackbar>
        )}

        <form onSubmit={(e) => handleClickOpen(e)}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <StateList onSelectState={handleSelectState} />
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <DistrictList onSelectDistrict={handleSelectDistrict} />
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <AreaList onSelectArea={handleSelectArea} />
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <SubDistrictList districtId={selectedDistrictId} onSelectSubDistrict={handleSelectSubDistrict} />
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <SchemeList onSelectScheme={handleSelectScheme} />
              </FormControl>
            </Grid>

            <Grid item xs={12} alignItems="center">
              <Button type="submit" variant="contained" color="secondary">
                Submit
              </Button>
            </Grid>
          </Grid>
        </form>
      </MainCard>

      {getAllDisData.length > 0 ? (
        <MainCard title="Pensioners for Generate Sanction Order">
          <Box sx={{ height: 400, width: '100%' }}>
            <DataGrid
              disableRowSelectionOnClick
              getRowId={(row) => row.applicationNo}
              slots={{ toolbar: GridToolbar }}
              slotProps={{
                toolbar: {
                  showQuickFilter: true
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
