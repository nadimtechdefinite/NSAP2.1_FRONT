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
const calculateTotals = (data) => {
  let totalBeneficiary = 0;
  let totalAmount = 0;

  data.forEach((row) => {
    totalBeneficiary += parseInt(row.totalBeneficiary);
    totalAmount += parseInt(row.totalAmount);
  });

  return { totalBeneficiary, totalAmount };
};

export default function Demand() {
  const [selectedStateId, setSelectedState] = useState('');
  const [selectedDistrictId, setSelectedDistrict] = useState('');
  const [selectedAreaId, setSelectedArea] = useState('');
  const [selectedSubDistrictId, setSelectedSubDistrict] = useState('');
  const [year, setYear] = useState('');
  const [computedMonth, setComputedMonth] = useState([]);
  const [generatedDemandData, setGeneratedDemandData] = useState([]);
  const [computationalLevel, setComputationalLevel] = useState(null);
  const [open, setOpen] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    finYear: '',
    selectedComputedMonth: ''
  });

  const getCurrentYear = () => {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const nextYear = currentYear + 1;
    return `${currentYear}-${nextYear}`;
  };

  const getPreviousYear = () => {
    const currentYear = getCurrentYear().split('-')[0];
    const previousYear = parseInt(currentYear) - 1;
    const nextYear = parseInt(currentYear);
    return `${previousYear}-${nextYear}`;
  };

  const getPrecedentYear = () => {
    const currentYear = getCurrentYear().split('-')[0];
    const previousYear = parseInt(currentYear) - 1;
    const precedentYear = parseInt(currentYear) - 2;
    return `${previousYear}-${precedentYear}`;
  };

  const financialYears = [
    { value: getCurrentYear(), label: getCurrentYear() },
    { value: getPreviousYear(), label: getPreviousYear() },
    { value: getPrecedentYear(), label: getPrecedentYear() }
  ];

  const handleSelectState = (state) => {
    setSelectedState(state);
  };

  const handleSelectDistrict = (selectedDistrictId) => {
    setSelectedDistrict(selectedDistrictId);
    setYear([]);
    setComputedMonth([]);
    setFormErrors((prevErrors) => {
      const updatedErrors = { ...prevErrors };
      delete updatedErrors.selectedDistrictId;
      return updatedErrors;
    });
  };

  const handleSelectArea = (selectedAreaId) => {
    setSelectedArea(selectedAreaId);
    setYear([]);
    setComputedMonth([]);
    setFormErrors((prevErrors) => {
      const updatedErrors = { ...prevErrors };
      delete updatedErrors.selectedAreaId;
      return updatedErrors;
    });
  };

  const handleSelectSubDistrict = (selectedSubDistrictId) => {
    setSelectedSubDistrict(selectedSubDistrictId);
    setYear([]);
    setComputedMonth([]);
    setFormErrors((prevErrors) => {
      const updatedErrors = { ...prevErrors };
      delete updatedErrors.selectedSubDistrictId;
      return updatedErrors;
    });
  };

  const handleFinYearChange = async (e) => {
    const selectedYear = e.target.value;
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    setYear(selectedYear); // Update the state
    setFormErrors((prevErrors) => {
      const updatedErrors = { ...prevErrors };
      delete updatedErrors.finYear;
      return updatedErrors;
    });
    await fetchListMonth(selectedYear);
  };

  const handleComputedMonthChange = async (e) => {
    const { value } = e.target;
    setFormData({
      ...formData,
      selectedComputedMonth: value
    });

    setFormErrors((prevErrors) => {
      const updatedErrors = { ...prevErrors };
      delete updatedErrors.selectedComputedMonth;
      return updatedErrors;
    });
  };

  useEffect(() => {
    const getComputationLevel = async () => {
      try {
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
  }, [selectedStateId]);

  async function fetchData() {
    try {
      const postUrl = `/demand/downloadpdf`;
      var location = {
        stateID: document.getElementById('hiddenstateCode').value,
        districtID: document.getElementById('hiddenDistrictCode').value,
        area: document.getElementById('hiddenRuralUrbanArea').value,
        subDistID: document.getElementById('hiddenSubdistrict').value,
        finYear: document.getElementById('hiddenFinYear').value,
        computedMonth: document.getElementById('hiddenComputedMonth').value
      };
      const response = await axiosInstance.post(postUrl, JSON.stringify(location), { responseType: 'blob' });
      // Create a Blob from the PDF data
      // alert("response.data"+response.data);
      if (response.data) {
        const pdfBlob = new Blob([response.data], { type: 'application/pdf' });

        // Create a link element and trigger a download
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(pdfBlob);
        link.download = 'DemandGeneration.pdf';
        link.click();
      }
    } catch (e) {
      console.log('error: ', e);
    }
  }

  async function handleDownload(rowData) {
    try {
      const postUrl = `/demand/downloadBeneficiaryDetails`;
      var location = {
        districtId: document.getElementById('hiddenDistrictCode').value,
        subDistrictId: document.getElementById('hiddenSubdistrict').value,
        ageFrom: rowData.ageFromCenter,
        ageTo: rowData.ageToCenter,
        amountState: rowData.stateAmount,
        amountCenter: rowData.centerAmount,
        finYear: document.getElementById('hiddenFinYear').value,
        computedMonth: document.getElementById('hiddenComputedMonth').value
      };
      const response = await axiosInstance.post(postUrl, JSON.stringify(location), { responseType: 'blob' });
      // Create a Blob from the XLSX data
      if (response.data) {
        const xlsxBlob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        // Create a link element and trigger a download
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(xlsxBlob);
        link.download = 'BeneficiaryDetailsDemand.xlsx';
        link.click();
      }
    } catch (e) {
      console.log('error: ', e);
    }
  }

  async function generateDemand() {
    try {
      setLoading(true);
      const postUrl = `/demand/generateDemand`;
      var location = {
        stateID: selectedStateId,
        districtID: selectedDistrictId,
        area: selectedAreaId,
        subDistID: selectedSubDistrictId,
        finYear: formData.finYear,
        computedMonth: formData.selectedComputedMonth
      };
      const response = await axiosInstance.post(postUrl, JSON.stringify(location));
      if (response.data) {
        setGeneratedDemandData(response.data);
        document.getElementById('hiddenstateCode').value = selectedStateId;
        document.getElementById('hiddenDistrictCode').value = selectedDistrictId;
        document.getElementById('hiddenRuralUrbanArea').value = selectedAreaId;
        document.getElementById('hiddenSubdistrict').value = selectedSubDistrictId;
        document.getElementById('hiddenFinYear').value = formData.finYear;
        document.getElementById('hiddenComputedMonth').value = formData.selectedComputedMonth;
        setLoading(false);
      } else {
        setGeneratedDemandData([]);
        setLoading(false);
      }
    } catch (e) {
      console.log('error: ', e);
      setLoading(false);
    }
  }

  async function fetchListMonth(selectedYear) {
    try {
      console.log('computedMonth', computedMonth);
      const getUrl = `/demand/getComputedMonth`;
      //alert(getUrl);
      const response = await axiosInstance.get(getUrl, {
        params: {
          stateID: selectedStateId,
          districtID: selectedDistrictId,
          subDistID: selectedSubDistrictId,
          financialYear: selectedYear
        }
      });

      if (response.data) {
        setComputedMonth(response.data);
      }
    } catch (e) {
      console.log('error: ', e);
    }
  }

  const generatedDemandColumns = [
    { field: 'schemaCode', headerName: 'Scheme Code' },
    { field: 'planCode', headerName: 'Plane Code' },
    { field: 'ageFromCenter', headerName: 'Age From', align: 'right', headerAlign: 'right' },
    { field: 'ageToCenter', headerName: 'Age To', align: 'right', headerAlign: 'right' },
    {
      field: 'totalBeneficiary',
      headerName: 'Total Beneficiary',
      align: 'right',
      width: 120,
      headerAlign: 'right',
      renderCell: (params) => (
        <a href={`#`} download onClick={() => handleDownload(params.row)}>
          {params.value}
        </a>
      )
    },
    { field: 'stateAmount', headerName: 'State', align: 'right', headerAlign: 'right' },
    { field: 'centerAmount', headerName: 'center', align: 'right', headerAlign: 'right' },
    { field: 'amount', headerName: 'Total', align: 'right', headerAlign: 'right' },
    { field: 'totalAmount', headerName: 'Total Amount', align: 'right', headerAlign: 'right' }
  ];

  const updatedData = generatedDemandData.map((item, index) => ({
    ...item,
    id: index + 1 // Generate unique IDs based on the index (you might need a more robust method)
  }));

  const { totalBeneficiary, totalAmount } = calculateTotals(generatedDemandData);

  const handleSubmit = (event) => {
    event.preventDefault();
    generateDemand();
    console.log(selectedSubDistrictId);
  };

  const handleSubmitDemandDownLoad = (e) => {
    e.preventDefault();
    fetchData();
  };

  useEffect(() => {
    setFormData({
      ...formData,
      selectedComputedMonth: ''
    });
  }, [year]);

  useEffect(() => {
    setFormData({
      ...formData,
      finYear: '',
      selectedComputedMonth: ''
    });
  }, [selectedDistrictId, selectedAreaId, selectedSubDistrictId]);

  useEffect(() => {
    handleSelectArea('');

    setSelectedSubDistrict('');
  }, [selectedDistrictId]);

  useEffect(() => {
    setSelectedSubDistrict('');
  }, [selectedAreaId]);

  const handleClickOpen = (e) => {
    e.preventDefault();
    const isFormValid = validateForm();
    if (isFormValid) {
      setOpen(true);
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleConfirm = (e) => {
    // Handle form submission logic here
    e.preventDefault();
    handleSubmit(e);
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

    if (!formData.finYear) {
      errors.finYear = messages_en.finYearRequired;
    }

    if (!formData.selectedComputedMonth) {
      errors.selectedComputedMonth = messages_en.computedMonthRequired;
    }

    // Add more validation logic for other fields...

    setFormErrors(errors);

    return Object.keys(errors).length === 0; // Return true if no errors
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
      <MainCard title="Demand Generation">
        <form onSubmit={(e) => handleClickOpen(e)}>
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
              <FormControl fullWidth>
                <InputLabel id="financial-year-label">Financial Year</InputLabel>
                <Select
                  labelId="financial-year-label"
                  id="financial-year"
                  value={year}
                  label="Financial Year"
                  name="finYear"
                  onChange={handleFinYearChange}
                >
                  {financialYears.map((fy) => (
                    <MenuItem key={fy.value} value={fy.value}>
                      {fy.label}
                    </MenuItem>
                  ))}
                </Select>
                {formErrors.finYear && (
                  <FormHelperText>
                    <Typography variant="caption" color="error">
                      {formErrors.finYear}
                    </Typography>
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <InputLabel id="computed-month-label">Computed Month</InputLabel>
                <Select
                  labelId="computed-month-label"
                  id="computed-month"
                  value={formData.selectedComputedMonth}
                  label="Computed Month"
                  name="selectedComputedMonth"
                  onChange={handleComputedMonthChange}
                >
                  {computedMonth.map((month) => (
                    <MenuItem key={month} value={month}>
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
                GENERATE DEMAND
              </Button>
            </Grid>

            {updatedData.length > 0 && (
              <Grid item xs={12}>
                <div style={{ height: 400, width: '100%' }}>
                  <DataGrid
                    getRowId={(row) => row.id}
                    rows={updatedData}
                    columns={generatedDemandColumns}
                    disableSelectionOnClick
                    components={{
                      footer: () => (
                        <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', height: 50, paddingRight: 16 }}>
                          <div style={{ fontWeight: 'bold' }}>Total Beneficiaries: {totalBeneficiary}</div>
                          <div style={{ marginLeft: 16, fontWeight: 'bold' }}>Total Amount: {totalAmount}</div>
                        </div>
                      )
                    }}
                  />
                </div>
              </Grid>
            )}
          </Grid>
        </form>

        <br></br>
        <form onSubmit={handleSubmitDemandDownLoad}>
          <Grid container spacing={2}>
            <input id="hiddenstateCode" type="hidden" />
            <input id="hiddenDistrictCode" type="hidden" />
            <input id="hiddenRuralUrbanArea" type="hidden" />
            <input id="hiddenSubdistrict" type="hidden" />
            <inpu id="hiddenFinYear" type="hidden" />
            <input id="hiddenComputedMonth" type="hidden" />

            {updatedData.length > 0 && (
              <Grid item xs={12} alignItems="center">
                <Button type="submit" variant="contained" color="primary">
                  DOWNLOAD DEMAND
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
    </>
  );
}
