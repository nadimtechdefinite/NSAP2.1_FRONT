import React, { useState, useEffect } from 'react';

import StateList from 'components/form_components/StateList';
import DistrictList from 'components/form_components/DistrictList';
import SubDistrictList from 'components/form_components/SubDistrictList';
import AreaList from 'components/form_components/AreaList';
import { Grid, Button, FormControl, InputLabel, Select, MenuItem, Typography, FormHelperText, CircularProgress } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import axiosInstance from 'hooks/useAuthTokenUrl';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import messages_en from 'components/common/messages_en.json';
import MainCard from 'ui-component/cards/MainCard';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';



export default function UpdateLedger() {
  const [selectedStateId, setSelectedState] = useState('');
  const [selectedDistrictId, setSelectedDistrict] = useState('');
  const [selectedAreaId, setSelectedArea] = useState('');
  const [selectedSubDistrictId, setSelectedSubDistrict] = useState('');
  //const [year, setYear] = useState('');
  //const [computedMonth, setComputedMonth] = useState([]);
  const [ledgerUpdateList, setLedgerUpdateList] = useState([]);
  const [computationalLevel, setComputationalLevel] = useState(null);
  const [open, setOpen] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [selectedRows, setSelectedRows] = useState([]);
  const [openSnackBar, setOpenSnackBar] = useState(false);
  const [message, setMessage] = useState('');
  const [alertServity, setAlertServity] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackBar(false);
  };
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 3 }, (_, index) => currentYear - index);
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];

  const [formData, setFormData] = useState({
    year: '',
    selectedComputedMonth: ''
  });


  const handleSelectState = (state) => {
    setSelectedState(state);
  };

  const handleSelectDistrict = (selectedDistrictId) => {
    setSelectedDistrict(selectedDistrictId);
    setFormErrors((prevErrors) => {
      const updatedErrors = { ...prevErrors };
      delete updatedErrors.selectedDistrictId;
      return updatedErrors;
    });
  };

  const handleSelectArea = (selectedAreaId) => {
    setSelectedArea(selectedAreaId);
    //setYear([]);
    //setComputedMonth([]);
    setFormErrors((prevErrors) => {
      const updatedErrors = { ...prevErrors };
      delete updatedErrors.selectedAreaId;
      return updatedErrors;
    });
  };

  const handleSelectSubDistrict = (selectedSubDistrictId) => {
    setSelectedSubDistrict(selectedSubDistrictId);
    //setYear([]);
    // setComputedMonth([]);
    setFormErrors((prevErrors) => {
      const updatedErrors = { ...prevErrors };
      delete updatedErrors.selectedSubDistrictId;
      return updatedErrors;
    });
  };


  useEffect(() => {
    if(selectedStateId){
      const getComputationLevel = async () => {
        try {
          console.log("selected state id : "+selectedStateId);
          const getUrl = `/computePension/getComputationalLevel/` + selectedStateId;
          const response = await axiosInstance.get(getUrl);
          if (response.data) {
            setComputationalLevel(response.data);
          }
        } catch (error) {
          console.log(error);
        }
      };
      getComputationLevel();
    }
   
    
  }, [selectedStateId]);




  async function getListForUpdateLedger() {
    const isFormValid = validateForm();
    if (isFormValid) {
      setLoading(true);
      try {
        const postUrl = `/ledgerUpdate/getListForLedgerUpdate`;
        var location = {
          stateCode: selectedStateId,
          districtCode: selectedDistrictId,
          areaCode: selectedAreaId,
          subDistrictCode: selectedSubDistrictId,
          computedYear: formData.year,
          computedMonth: formData.selectedComputedMonth
        };
        const response = await axiosInstance.post(postUrl, JSON.stringify(location));
        if (response.data) {
          setLedgerUpdateList(response.data);
          setLoading(false);
          if (response.data.length === 0) {
            setMessage("Data not found");
            setOpenSnackBar(true);
            setAlertServity('error');
          }
        } else {
          setLedgerUpdateList([]);
          setLoading(false);

        }
      } catch (e) {
        setLoading(false);
        console.log('error: ', e);
      }
    }
  }

  async function updateLedger() {
    try {
      setLoading(true);
      const postUrl = `/ledgerUpdate/updateLedger`;
      var location = selectedRows;
      const response = await axiosInstance.post(postUrl, JSON.stringify(location));
      if (response.data) {
        setSelectedRows([]);
        // Optionally, you can also clear the ledger update list if needed
        setLedgerUpdateList([]);
        setMessage("Ledger has been updated for selected Sanction No");
        setOpenSnackBar(true);
        setAlertServity('success');
        setLoading(false);
      } else {
        setSelectedRows([]);
        // Optionally, you can also clear the ledger update list if needed
        setLedgerUpdateList([]);
        setLoading(false);
      }
    } catch (e) {
      console.log('error: ', e);
      setLoading(false);
    }
  }

  const columns = [
    { field: 'sanctionOrderNo', headerName: 'Sanction Order No', width: 180 },
    { field: 'beneficiaryName', headerName: 'Beneficiary Name', width: 200 },
    { field: 'pensionPayablePeriod', headerName: 'Pension Payable Period', align: 'left', headerAlign: 'left', width: 180 },
    { field: 'amountDue', headerName: 'Amount Due', align: 'right', headerAlign: 'right', width: 110 },
    { field: 'amountPaid', headerName: 'Amount Paid', align: 'right', headerAlign: 'right', width: 110 },
    { field: 'paidUptoMonth', headerName: 'Paid Up to Month', align: 'left', headerAlign: 'left', width: 150 },
    { field: 'bankPOName', headerName: 'Bank/ PO Name', align: 'left', headerAlign: 'left', width: 250 },
    { field: 'payableDate', hide: true }
  ];

  const visibleColumns = columns.filter((column) => !column.hide);

  /*  // const updatedData = ledgerUpdateList.map((item, index) => ({
     // ...item,
      id: index + 1 
    })); */



  const handleSubmit = (event) => {
    event.preventDefault();
    getListForUpdateLedger();
    console.log(selectedSubDistrictId);
  };

  const handleUpdateLedger = (e) => {
    e.preventDefault();
    if (selectedRows.length === 0) {
      setMessage("Please select at least one checkbox.");
      setOpenSnackBar(true);
      setAlertServity('error');
    } else {
      updateLedger();
    }
  };

  console.log('selectedRows', selectedRows);
  /*  useEffect(() => {
    setFormData({
      ...formData,
      year: '',
      selectedComputedMonth: ''
    });
  }, [selectedDistrictId, selectedAreaId, selectedSubDistrictId]); */

  useEffect(() => {
    handleSelectArea('');

    setSelectedSubDistrict('');
  }, [selectedDistrictId]);

  useEffect(() => {
    setSelectedSubDistrict('');
  }, [selectedAreaId]);

  const handleClickOpen = (e) => {
    e.preventDefault();
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleConfirm = (e) => {
    // Handle form submission logic here
    e.preventDefault();
    handleUpdateLedger(e);
    setOpen(false); // Close the dialog after confirmation
  };

  const validateForm = () => {
    const errors = {};
    // Add validation logic for each field
    if (!selectedStateId) {
      errors.selectedStateId = messages_en.stateRequired;
    }

    if (!selectedDistrictId) {
      errors.selectedDistrictId = messages_en.districtRequired;
    }

    if (!selectedAreaId && `${computationalLevel}` === 'SD') {
      errors.selectedAreaId = messages_en.areaRequired;
    }

    if (!selectedSubDistrictId && `${computationalLevel}` === 'SD') {
      errors.selectedSubDistrictId = messages_en.subDistrictRequired;
    }

    if (!formData.year) {
      errors.year = messages_en.payableUptoYearRequired;
    }

    if (!formData.selectedComputedMonth) {
      errors.selectedComputedMonth = messages_en.payableUptoMonthRequired;
    }

    // Add more validation logic for other fields...

    setFormErrors(errors);

    return Object.keys(errors).length === 0; // Return true if no errors
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    if (name === 'selectedComputedMonth') {
      setFormErrors(prevErrors => {
        const updatedErrors = { ...prevErrors };
        delete updatedErrors.selectedComputedMonth;
        return updatedErrors;
      });
    }

    if (name === 'year') {
      setFormErrors(prevErrors => {
        const updatedErrors = { ...prevErrors };
        delete updatedErrors.year;
        return updatedErrors;
      });
    }
  };

  const handleSelectionChange = (newSelection) => {
    // Assuming ledgerUpdateList is an array of objects
    const selectedRowsData = newSelection.map(id =>
      ledgerUpdateList.find(row => row.sanctionOrderNo === id)
    );
    setSelectedRows(selectedRowsData);
  };


  return (
    <>
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

      <MainCard title="Update Ledger">
        <form onSubmit={(e) => handleSubmit(e)}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <StateList onSelectState={handleSelectState} />
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <DistrictList selectedStateId={selectedStateId} onSelectDistrict={handleSelectDistrict} />
                {formErrors.selectedDistrictId && (
                  <FormHelperText>
                    <Typography style={{ color: 'red', fontSize: '0.8rem' }}>{formErrors.selectedDistrictId}</Typography>
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>
            {computationalLevel === 'SD' && (
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth>
                  <AreaList selectedDistrict={selectedDistrictId} selectedArea={selectedAreaId} onSelectArea={handleSelectArea} />
                  {formErrors.selectedArea && (
                    <FormHelperText>
                      <Typography style={{ color: 'red', fontSize: '0.8rem' }}>{formErrors.selectedAreaId}</Typography>
                    </FormHelperText>
                  )}
                </FormControl>
              </Grid>
            )}
            {computationalLevel === 'SD' && (
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth>
                  <SubDistrictList
                    selectedDistrictId={selectedDistrictId}
                    selectedAreaId={selectedAreaId}
                    onSelectSubDistrict={handleSelectSubDistrict}
                  />
                  {formErrors.selectedSubDistrictId && (
                    <FormHelperText>
                      <Typography style={{ color: 'red', fontSize: '0.8rem' }}>{formErrors.selectedSubDistrictId}</Typography>
                    </FormHelperText>
                  )}
                </FormControl>
              </Grid>
            )}

            <Grid item xs={12} sm={4}>
              <FormControl fullWidth >
                <InputLabel id="year-select-label">Pension Amount Payable Up To Year</InputLabel>
                <Select
                  labelId="year-select-label"
                  id="year-select"
                  label="Pension Amount Payable Up To Year"
                  value={formData.year}
                  name="year"
                  onChange={handleChange}
                >
                  {years.map((year) => (
                    <MenuItem key={year} value={year}>
                      {year}
                    </MenuItem>
                  ))}
                </Select>

                {formErrors.year && (
                  <FormHelperText>
                    <Typography variant="caption" color="error">
                      {formErrors.year}
                    </Typography>
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <InputLabel id="month-select-label">Pension Amount Payable Up To Month</InputLabel>
                <Select
                  labelId="month-select-label"
                  id="month-select"
                  label="Pension Amount Payable Up To Month"
                  value={formData.selectedComputedMonth} // Ensure this value is correctly set
                  name="selectedComputedMonth"
                  onChange={handleChange}
                >
                  {months.map((month, index) => (
                    <MenuItem key={index} value={index + 1}>
                      {month}
                    </MenuItem>
                  ))}
                </Select>

                {formErrors.selectedComputedMonth && (
                  <FormHelperText>
                    <Typography variant="caption" color="error">
                      {formErrors.selectedComputedMonth}
                    </Typography>
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={12} alignItems="center">
              <Button type="submit" variant="contained" color="secondary">
                Submit
              </Button>
            </Grid>

            {ledgerUpdateList.length > 0 && (
              <Grid item xs={12}>
                <div style={{ height: 600, width: '100%' }}>
                  <DataGrid
                    getRowId={(ledgerUpdateList) => ledgerUpdateList.sanctionOrderNo}
                    rows={ledgerUpdateList}
                    columns={visibleColumns}
                    checkboxSelection
                    onRowSelectionModelChange={handleSelectionChange}
                  />
                </div>
              </Grid>
            )}
          </Grid>
        </form>

        <br></br>
        <form onSubmit={(e) => handleClickOpen(e)}>
          <Grid container spacing={2}>

            {ledgerUpdateList.length > 0 && (
              <Grid item xs={12} alignItems="center">
                <Button type="submit" variant="contained" color="primary">
                  Update Ledger
                </Button>
              </Grid>
            )}
          </Grid>
        </form>
      </MainCard>
      {/* confim box to confirm before form submit */}
      <div>
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>Confirm Submission</DialogTitle>
          <DialogContent>
            <DialogContentText>Are you sure?</DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              Cancel
            </Button>
            <Button onClick={handleConfirm} color="primary" autoFocus>
              Confirm
            </Button>
          </DialogActions>
        </Dialog>
      </div>

      <Snackbar open={openSnackBar}
        autoHideDuration={7000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
        <Alert severity={alertServity} sx={{ width: '100%' }}>
          {message}
        </Alert>
      </Snackbar>
    </>
  );
}
