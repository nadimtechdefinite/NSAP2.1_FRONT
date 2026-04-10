import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import StateList from 'components/form_components/StateList';
import DistrictList from 'components/form_components/DistrictList';
import SubDistrictList from 'components/form_components/SubDistrictList';
import AreaList from 'components/form_components/AreaList';
import MainCard from 'ui-component/cards/MainCard';
import {
  Grid,
  FormControl,
  Button,
  MenuItem,
  InputLabel,
  Select,
  Tabs,
  Tab,
  FormHelperText,
  Typography,
  CircularProgress
} from '@mui/material';
import { Table, TableBody, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { DataGrid } from '@mui/x-data-grid';
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';
import { StyledTableCell } from './StyledTableCell';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import messages_en from 'components/common/messages_en.json';
import axiosInstance from 'hooks/useAuthTokenUrl';

function ComputePension() {
  const [selectedStateId, setSelectedState] = useState('');
  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleSelectState = (state) => {
    setSelectedState(state);
  };
  const [selectedDistrictId, setSelectedDistrict] = useState('');
  const handleSelectDistrict = (selectedDistrictId) => {
    setSelectedDistrict(selectedDistrictId);
    setSelectedArea('');
    setFormErrors((prevErrors) => {
      const updatedErrors = { ...prevErrors };
      delete updatedErrors.selectedDistrictId;
      return updatedErrors;
    });
  };
  const [selectedArea, setSelectedArea] = useState('');
  const handleSelectArea = (selectedAreaId) => {
    setSelectedArea(selectedAreaId);
    setSelectedSubDistrict('');
    setFormErrors((prevErrors) => {
      const updatedErrors = { ...prevErrors };
      delete updatedErrors.selectedArea;
      return updatedErrors;
    });
    // setFormInput({ ruralUrbanArea: selectedAreaId });
  };

  const [selectedSubDistrictId, setSelectedSubDistrict] = useState('');
  const handleSelectSubDistrict = (selectedSubDistrictId) => {
    setSelectedSubDistrict(selectedSubDistrictId);
    setFormErrors((prevErrors) => {
      const updatedErrors = { ...prevErrors };
      delete updatedErrors.selectedSubDistrictId;
      return updatedErrors;
    });
  };

  /* useEffect(() => {
    handleSelectArea('');
    setSelectedSubDistrict('');
  }, [selectedDistrictId]); */

  //const [data, setData] = useState([]);
  const [open, setOpen] = useState(false);

  const [dataPreviousComputationHistory, setDataPreviousComputationHistory] = useState([]);
  const [dataDataGap, setDataGap] = useState([]);
  const [dataAmountSummary, setDataAmountSummary] = useState([]);
  const [currentTab, setCurrentTab] = useState(0);
  const [message, setMessage] = useState(0);
  const [computationalLevel, setComputationalLevel] = useState(null);
  const [flag, setFlag] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const getUrl = `/computePension/getComputationalLevel/${selectedStateId}`;
        const response = await axiosInstance.get(getUrl);
        console.log(response.data);

        if (response.data && response.data.trim() !== '') {
          setComputationalLevel(response.data);
          setFlag(1);
        } else {
          setFlag(0);
          setComputationalLevel('Computational Level not defined yet, Please define computational level first from State Master');
        }
      } catch (error) {
        console.error('Error fetching computational level:', error);
        setComputationalLevel('An error occurred while fetching the computational level.');
      }
    };

    if (selectedStateId) {
      fetchData();
    }
  }, [selectedStateId]);

  /* const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  }; */

  const handleNextTab = () => {
    setCurrentTab(currentTab + 1);
  };

  const handlePrevTab = () => {
    setCurrentTab(currentTab - 1);
  };

  const [formData, setFormData] = useState({
    month: '',
    year: '',
    contributionMode: 'B'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));

    if (name === 'month') {
      setFormErrors((prevErrors) => {
        const updatedErrors = { ...prevErrors };
        delete updatedErrors.month;
        return updatedErrors;
      });
    }

    if (name === 'year') {
      setFormErrors((prevErrors) => {
        const updatedErrors = { ...prevErrors };
        delete updatedErrors.year;
        return updatedErrors;
      });
    }
  };

  const selectFormData = {
    selectedStateId: selectedStateId,
    selectedDistrictId: selectedDistrictId,
    selectedArea: selectedArea,
    selectedSubDistrictId: selectedSubDistrictId,
    month: formData.month,
    year: formData.year
  };

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
    handleSubmitComputation(e);
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

    if (!selectedArea && computationalLevel === 'SD') {
      errors.selectedArea = messages_en.areaRequired;
    }

    if (!selectedSubDistrictId && computationalLevel === 'SD') {
      errors.selectedSubDistrictId = messages_en.subDistrictRequired;
    }

    if (!formData.month) {
      errors.month = messages_en.payableUptoMonthRequired;
    }

    if (!formData.year) {
      errors.year = messages_en.payableUptoYearRequired;
    }

    // Add more validation logic for other fields...

    setFormErrors(errors);

    return Object.keys(errors).length === 0; // Return true if no errors
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Perform the form submission to the Spring Boot backend
    const isFormValid = validateForm();
    if (flag === 1) {
      if (isFormValid) {
        try {
          const postUrl = `/computePension/isComputed`;
          const res = await axiosInstance.post(postUrl, selectFormData);
          const data = await res.data;
          setLoading(true);
          if (res.status === 200 && data.length === 0) {
            const previousCompuationUrl = `/computePension/previousComputationSummary`;
            const response1 = await axiosInstance.post(previousCompuationUrl, selectFormData);

            const gapSummaryUrl = `/computePension/computationDataGapSummary`;
            const response2 = await axiosInstance.post(gapSummaryUrl, selectFormData);

            const computationAmountSummaryUrl = `/computePension/computationAmountSummary`;
            const response3 = await axiosInstance.post(computationAmountSummaryUrl, selectFormData);

            const data1 = await response1.data;
            const data2 = await response2.data;
            const data3 = await response3.data;
            setDataPreviousComputationHistory(data1);
            setDataGap(data2);
            setDataAmountSummary(data3);
            setLoading(false);
          } else {
            setLoading(false);
            setMessage(data);
            setOpenSnackBar(true);
          }
        } catch (error) {
          setLoading(false);
          console.error('Error submitting form:', error);
        }
      }
    } else {
      setMessage('Computational Level not defined yet, Please define computational level first from State Master');
      setOpenSnackBar(true);
    }
  };

  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 3 }, (_, index) => currentYear - index);
  const renderIcon = (value) => {
    return value === 'Y' ? <CheckIcon style={{ color: 'green' }} /> : <ClearIcon style={{ color: 'red' }} />;
  };
  const previousComputationColumns = [
    { field: 'subDistrictName', headerName: 'Sub District Name', width: 200 },
    { field: 'argApril', headerName: 'April', width: 80, renderCell: (params) => renderIcon(params.value) },
    { field: 'argMay', headerName: 'May', width: 80, renderCell: (params) => renderIcon(params.value) },
    { field: 'argJune', headerName: 'June', width: 80, renderCell: (params) => renderIcon(params.value) },
    { field: 'argJuly', headerName: 'July', width: 80, renderCell: (params) => renderIcon(params.value) },
    { field: 'argAugust', headerName: 'August', width: 80, renderCell: (params) => renderIcon(params.value) },
    { field: 'argSeptember', headerName: 'September', width: 80, renderCell: (params) => renderIcon(params.value) },
    { field: 'argOctober', headerName: 'October', width: 80, renderCell: (params) => renderIcon(params.value) },
    { field: 'argNovember', headerName: 'November', width: 80, renderCell: (params) => renderIcon(params.value) },
    { field: 'argDecember', headerName: 'December', width: 80, renderCell: (params) => renderIcon(params.value) },
    { field: 'argJanuary', headerName: 'January', width: 80, renderCell: (params) => renderIcon(params.value) },
    { field: 'argFebruary', headerName: 'February', width: 80, renderCell: (params) => renderIcon(params.value) },
    { field: 'argMarch', headerName: 'March', width: 80, renderCell: (params) => renderIcon(params.value) }
    // Add more columns as needed
  ];

  const amountColumns = [
    {
      field: 'subDistrictMunicipalAreaName',
      headerName: 'Sub District (Area)',
      width: 150
    },
    {
      field: 'paymentMode',
      headerName: 'Payment Mode',
      width: 110,
      renderCell: (params) => (
        <a href={`javascript:void(0)`} onClick={() => handleDownloadSubdistrictWise(params.row)}>
          {params.value}
        </a>
      )
    },
    { field: 'beneficieries', headerName: 'Total Beneficiary', width: 120, align: 'right', headerAlign: 'right' },
    { field: 'amountState', headerName: 'State Amount in (Rs.)', width: 190, align: 'right', headerAlign: 'right' },
    { field: 'amountCentral', headerName: 'Center Amount in (Rs.)', width: 190, align: 'right', headerAlign: 'right' },
    { field: 'amount', headerName: 'Total Amount in (Rs.)', width: 150, align: 'right', headerAlign: 'right' },
    { field: 'subDistrictMunicipalAreaCode', headerName: 'subDistrictMunicipalAreaCode', hide: true },
    { field: 'ruralUrbanArea', headerName: 'ruralUrbanArea', hide: true },
    {
      field: 'subDistrictName',
      headerName: 'subDistrictName',
      hide: true
    }
    // Add more columns as needed
  ];
  const visibleColumns = amountColumns.filter((column) => !column.hide);

  const rows = [];

  let currentGroup = null;
  dataAmountSummary.forEach((row, index) => {
    if (row.subDistrictMunicipalAreaName !== currentGroup) {
      currentGroup = row.subDistrictMunicipalAreaName;
      // Add group header
      rows.push({
        id: currentGroup,
        subDistrictMunicipalAreaName: currentGroup,
        isGroup: true
      });
    }
    // Add the current row
    rows.push({
      id: `${row.subDistrictMunicipalAreaName}-${index}`,
      ...row,
      // Set subDistrictMunicipalAreaName to null for all non-group header rows
      subDistrictMunicipalAreaName: null
    });
  });

  const currentDate = new Date();
  // Format the date as 'YYYY-MM-DD'
  const formattedDate = currentDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });

  const stateIdCompatation = useRef();
  const districtIdComputation = useRef();
  const ruralUrbanArea = useRef();
  const subDistrictId = useRef();
  const schemeCode = useRef();
  const payableDate = useRef();
  const finYear = useRef();

  const formDataComputation = {
    stateId: stateIdCompatation?.current?.value,
    districtId: districtIdComputation?.current?.value,
    ruralUrbanArea: ruralUrbanArea?.current?.value,
    subDistrictId: subDistrictId?.current?.value,
    schemeCode: schemeCode?.current?.value,
    payableDate: payableDate?.current?.value,
    finYear: finYear?.current?.value,
    contributionMode: formData.contributionMode
  };

  const handleDownloadSubdistrictWise = (rowData) => {
    const subDistrictMunicipalAreaName = rowData.subDistrictName;
    const subDistrictMunicipalAreaCode = rowData.subDistrictMunicipalAreaCode;
    const ruralUrbanArea = rowData.ruralUrbanArea;
    const paymentMode = rowData.paymentMode;
    const stateId = stateIdCompatation?.current?.value;
    const districtId = districtIdComputation?.current?.value;
    const scheme = schemeCode?.current?.value;
    const payable = payableDate?.current?.value;
    const requestData = {
      subDistrictMunicipalAreaName,
      subDistrictMunicipalAreaCode,
      ruralUrbanArea,
      paymentMode,
      stateId,
      districtId,
      scheme,
      payable
    };

    const postUrl = `/computePension/amountExcelDownloadSubdistrict`;
    axiosInstance
      .post(postUrl, requestData, {
        responseType: 'blob'
      })
      .then((response) => {
        const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const url = window.URL.createObjectURL(blob);

        const link = document.createElement('a');
        const fileName = 'Pensioner_' + scheme + '_' + new Date().toISOString().slice(0, 10) + '_record.xlsx';
        link.href = url;
        link.setAttribute('download', fileName);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      })
      .catch((error) => {
        console.error('There was a problem with the fetch operation:', error);
      });
  };

  const handleDownloadDistrictWise = () => {
    const stateId = stateIdCompatation?.current?.value;
    const districtId = districtIdComputation?.current?.value;
    const ruralUrbanAreaValue = ruralUrbanArea?.current?.value;
    const subDistrictIdValue = subDistrictId?.current?.value;
    const scheme = schemeCode?.current?.value;
    const payable = payableDate?.current?.value;

    const requestData = {
      stateId,
      districtId,
      subDistrictMunicipalAreaCode: subDistrictIdValue,
      ruralUrbanArea: ruralUrbanAreaValue,
      scheme,
      payable
    };

    axiosInstance
      .post('/computePension/amountExcelDownloadDistrict', requestData, {
        responseType: 'blob'
      })
      .then((response) => {
        // Handle the response from the server
        const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const url = window.URL.createObjectURL(blob);
        // Create a link element and trigger a click to initiate the download
        const link = document.createElement('a');
        link.href = url;
        const fileName = 'Pensioner_' + scheme + '_' + formattedDate + '_record.xlsx';
        link.setAttribute('download', fileName);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      })
      .catch((error) => {
        console.error('There was a problem with the fetch operation:', error);
      });
  };

  const handleDownloadLederUpdate = () => {
    const stateId = stateIdCompatation?.current?.value;
    const districtId = districtIdComputation?.current?.value;
    const ruralUrbanAreaValue = ruralUrbanArea?.current?.value;
    //alert(ruralUrbanAreaValue);
    const subDistrictIdValue = subDistrictId?.current?.value;
    const scheme = schemeCode?.current?.value;
    const payable = payableDate?.current?.value;
    const requestData = {
      stateId,
      districtId,
      ruralUrbanArea: ruralUrbanAreaValue,
      subDistrictMunicipalAreaCode: subDistrictIdValue,
      scheme,
      payable
    };

    axiosInstance
      .post('/computePension/amountExcelDownloadLedgerUpdate', requestData, {
        responseType: 'blob'
      })
      .then((response) => {
        // Handle the response from the server
        const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const url = window.URL.createObjectURL(blob);
        // Create a link element and trigger a click to initiate the download
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'Pending_Ledger_beneficiary_Record.xlsx');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      })
      .catch((error) => {
        console.error('There was a problem with the fetch operation:', error);
      });
  };

  const handleDownloadPendingFile = () => {
    const stateId = stateIdCompatation?.current?.value;
    const districtId = districtIdComputation?.current?.value;
    const ruralUrbanAreaValue = ruralUrbanArea?.current?.value;
    //alert(ruralUrbanAreaValue);
    const subDistrictIdValue = subDistrictId?.current?.value;
    const scheme = schemeCode?.current?.value;
    const payable = payableDate?.current?.value;
    const requestData = {
      stateId,
      districtId,
      ruralUrbanArea: ruralUrbanAreaValue,
      subDistrictMunicipalAreaCode: subDistrictIdValue,
      scheme,
      payable
    };

    axiosInstance
      .post('/computePension/amountExcelDownloadPendingFile', requestData, {
        responseType: 'blob'
      })
      .then((response) => {
        // Handle the response from the server
        const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const url = window.URL.createObjectURL(blob);
        // Create a link element and trigger a click to initiate the download
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'Pending_File_beneficiary_Record.xlsx');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      })
      .catch((error) => {
        console.error('There was a problem with the fetch operation:', error);
      });
  };

  const navigate = useNavigate();
  const handleSubmitComputation = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axiosInstance.post('/computePension/compute', formDataComputation);
      const data = await response.data;
      if (response.status === 200) {
        navigate('/computation/computationDetailsAfterCompuation', { state: { data } });
        setLoading(false);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setLoading(false);
    }
  };

  const [openSnackBar, setOpenSnackBar] = useState(false);
  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackBar(false);
  };

  return (
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

      {flag == 0 && (
        <Alert severity="error">
          <b>{computationalLevel}</b>
        </Alert>
      )}
      <MainCard title="Compute Pension">
        <form onSubmit={(e) => handleSubmit(e)}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <StateList onSelectState={handleSelectState} isMandatory={true} />
                {formErrors.selectedStateId && (
                  <FormHelperText>
                    <Typography style={{ color: 'red', fontSize: '0.8rem' }}>{formErrors.selectedStateId}</Typography>
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <DistrictList
                  selectedStateId={selectedStateId}
                  defaultSelectedDistrict={selectedDistrictId}
                  onSelectDistrict={handleSelectDistrict}
                  isMandatory={true}
                />
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
                  <AreaList
                    selectedDistrict={selectedDistrictId}
                    selectedArea={selectedArea}
                    onSelectArea={handleSelectArea}
                    isMandatory={true}
                  />
                  {formErrors.selectedArea && (
                    <FormHelperText>
                      <Typography style={{ color: 'red', fontSize: '0.8rem' }}>{formErrors.selectedArea}</Typography>
                    </FormHelperText>
                  )}
                </FormControl>
              </Grid>
            )}
            {computationalLevel === 'SD' && (
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth>
                  <SubDistrictList
                    defaultSelectedSubDistrict={selectedSubDistrictId}
                    selectedDistrictId={selectedDistrictId}
                    selectedAreaId={selectedArea}
                    onSelectSubDistrict={handleSelectSubDistrict}
                    isMandatory={true}
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
                <InputLabel id="month-select-label">Pension Amount Payable Up To Month</InputLabel>
                <Select
                  labelId="month-select-label"
                  id="month-select"
                  label="Pension Amount Payable Up To Month"
                  value={formData.month}
                  name="month"
                  onChange={handleChange}
                >
                  {months.map((month, index) => (
                    <MenuItem key={index} value={index + 1}>
                      {month}
                    </MenuItem>
                  ))}
                </Select>

                {formErrors.month && (
                  <FormHelperText>
                    <Typography variant="caption" color="error">
                      {formErrors.month}
                    </Typography>
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
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
                <InputLabel id="mode-select-label">Contribution Mode</InputLabel>
                <Select
                  labelId="mode-select-label"
                  id="contributionMode"
                  name="contributionMode"
                  value={formData.contributionMode}
                  onChange={handleChange}
                >
                  <MenuItem value="B">Both</MenuItem>
                  <MenuItem value="S">State Only</MenuItem>
                  <MenuItem value="C">Central Only</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} alignItems="center">
              <Button type="submit" variant="contained" color="primary">
                SUBMIT
              </Button>
            </Grid>
          </Grid>
        </form>
        <br></br>

        {dataPreviousComputationHistory.length > 0 && (
          <div>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Tabs value={currentTab} /* onChange={handleTabChange} */ left>
                  <Tab label="PREVIOUS COMPUTATION SUMMARY" />
                  <Tab label="COMPUTATION DATA SUMMARY" />
                  <Tab label="COMPUTATION AMOUNT SUMMARY" />
                </Tabs>
                <Paper style={{ height: 400, width: '100%' }}>
                  {currentTab === 0 && (
                    <DataGrid
                      getRowId={(dataPreviousComputationHistory) => dataPreviousComputationHistory.subDistrictName}
                      rows={dataPreviousComputationHistory}
                      columns={previousComputationColumns}
                      disableSelectionOnClick
                      footer={null}
                      hideFooter
                    />
                  )}

                  {currentTab === 1 && (
                    <TableContainer component={Paper}>
                      <Table>
                        <TableHead></TableHead>
                        <TableBody>
                          <TableRow>
                            <StyledTableCell>PAYMENT MODE DBT COUNT</StyledTableCell>
                            <StyledTableCell style={{ textAlign: 'right' }}>{dataDataGap.paymentModeCountDBT}</StyledTableCell>
                            <StyledTableCell>PAYMENT MODE DBT NON COUNT</StyledTableCell>
                            <StyledTableCell style={{ textAlign: 'right' }}>{dataDataGap.paymentModeCountNONDBT}</StyledTableCell>
                          </TableRow>

                          <TableRow>
                            <StyledTableCell>TOTAL ELIGIBLE PENSIONER </StyledTableCell>
                            <StyledTableCell style={{ textAlign: 'right' }}>{dataDataGap.totalEligiblePensioners}</StyledTableCell>
                            <StyledTableCell>IFSC CODE NOT FOUND - NOT INCLUDED</StyledTableCell>
                            <StyledTableCell style={{ textAlign: 'right' }}>{dataDataGap.nullIFSCCodeCount}</StyledTableCell>
                          </TableRow>

                          <TableRow>
                            <StyledTableCell> IFSC CODE LENGTH NOT CORRECT - NOT INCLUDED</StyledTableCell>
                            <StyledTableCell style={{ textAlign: 'right' }}>{dataDataGap.ifscLengthNotCorrectCount}</StyledTableCell>

                            <StyledTableCell>IFSC CODE NOT IN BANK-BRANCH MASTER - NOT INCLUDED</StyledTableCell>
                            <StyledTableCell style={{ textAlign: 'right' }}>{dataDataGap.nullIFSCCodeCount}</StyledTableCell>
                          </TableRow>

                          <TableRow>
                            {/* <StyledTableCell>PDA CODE NOT FOUND - NOT INCLUDED</StyledTableCell>
                          <StyledTableCell style={{ textAlign: 'right' }}>{dataDataGap.poPDACodeNotGivenCount}</StyledTableCell>
 */}
                            <StyledTableCell>ACCOUNT NO NOT GIVEN - NOT INCLUDED</StyledTableCell>
                            <StyledTableCell style={{ textAlign: 'right' }}>{dataDataGap.bankPOAccountNotGivenCount}</StyledTableCell>

                            <StyledTableCell>UNDER AGE PENSIONER - NOT INCLUDED</StyledTableCell>
                            <StyledTableCell style={{ textAlign: 'right' }}>{dataDataGap.undearAgeCount}</StyledTableCell>
                          </TableRow>

                          <TableRow>
                            <StyledTableCell>OVER AGE PENSIONER - NOT INCLUDED</StyledTableCell>
                            <StyledTableCell style={{ textAlign: 'right' }}>{dataDataGap.overAgeCount}</StyledTableCell>
                            <StyledTableCell>COMPUTABLE PENSIONERS</StyledTableCell>
                            <StyledTableCell style={{ textAlign: 'right' }}>{dataDataGap.computablePensioners}</StyledTableCell>
                          </TableRow>

                          <TableRow>
                            <StyledTableCell>
                              PENSIONER PENDING IN THE PREVIOUS PAYMENT FILE<br></br> AND NOT INCLUDED IN THE CURRENT PAYMENT FILE
                            </StyledTableCell>
                            {dataDataGap.paymentPendingFile > 0 ? (
                              <StyledTableCell style={{ textAlign: 'right' }}>
                                <a href="javascript:void(0)" onClick={handleDownloadPendingFile}>
                                  {dataDataGap.paymentPendingFile}{' '}
                                </a>
                              </StyledTableCell>
                            ) : (
                              <StyledTableCell style={{ textAlign: 'right' }}>{dataDataGap.paymentPendingFile}</StyledTableCell>
                            )}

                            <StyledTableCell>PENSIONERS PENDING FOR LEDGER UPDATE</StyledTableCell>
                            {dataDataGap.pendingForLedgerUpdate > 0 ? (
                              <StyledTableCell style={{ textAlign: 'right' }}>
                                <a href="javascript:void(0)" onClick={handleDownloadLederUpdate}>
                                  {dataDataGap.pendingForLedgerUpdate}
                                </a>
                              </StyledTableCell>
                            ) : (
                              <StyledTableCell style={{ textAlign: 'right' }}>{dataDataGap.pendingForLedgerUpdate}</StyledTableCell>
                            )}
                          </TableRow>
                        </TableBody>
                      </Table>
                    </TableContainer>
                  )}

                  {currentTab === 2 && (
                    <div style={{ height: 400, width: '100%' }}>
                      <DataGrid
                        rows={rows}
                        columns={visibleColumns}
                        disableSelectionOnClick
                        footer={null}
                        hideFooter
                        isRowExpandable={(params) => params.row.isGroup}
                        getRowId={(row) => row.id}
                        getRowClassName={(params) => (params.row.isGroup ? 'group-row' : 'detail-row')}
                      />
                    </div>
                  )}
                </Paper>
                <br></br>
                <form onSubmit={(e) => handleClickOpen(e)}>
                  <Grid item xs={12}>
                    <input ref={stateIdCompatation} name="stateIdCompatation" type="hidden" value={dataDataGap.stateId} />
                    <input ref={districtIdComputation} name="districtIdComputation" type="hidden" value={dataDataGap.districtId} />
                    <input ref={ruralUrbanArea} name="ruralUrbanArea" type="hidden" value={dataDataGap.ruralUrbanId} />
                    <input ref={subDistrictId} name="subDistrictIdComputation" type="hidden" value={dataDataGap.subDistrictId} />
                    <input ref={schemeCode} name="schemeCode" type="hidden" value={dataDataGap.schemeCode} />
                    <input ref={payableDate} name="payableDate" type="hidden" value={dataDataGap.argDate} />
                    <input ref={finYear} name="finYear" type="hidden" value={dataDataGap.finYear} />
                    {currentTab > 0 && (
                      <Button variant="contained" color="primary" onClick={handlePrevTab}>
                        PREVIOUS
                      </Button>
                    )}
                    &nbsp;
                    {currentTab < 2 && (
                      <Button variant="contained" color="primary" onClick={handleNextTab}>
                        NEXT
                      </Button>
                    )}
                    &nbsp;
                    {currentTab === 2 && dataDataGap.computablePensioners > 0 && (
                      <Button type="submit" variant="contained" color="primary">
                        FREEZE PENSION
                      </Button>
                    )}
                    &nbsp;
                    {currentTab === 2 && rows.length > 0 && (
                      <Button type="button" variant="contained" color="secondary" onClick={handleDownloadDistrictWise}>
                        DOWNLOAD TO EXCEL
                      </Button>
                    )}
                  </Grid>
                </form>
              </Grid>
            </Grid>
          </div>
        )}
      </MainCard>
      {/* confim box to confirm before form submit */}
      <div>
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>Confirm Submission</DialogTitle>
          <DialogContent>
            <DialogContentText>Are you sure to Start Computation?Please see all the summary report before computation</DialogContentText>
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

      <Snackbar
        open={openSnackBar}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity="error" sx={{ width: '100%' }}>
          {message}
        </Alert>
      </Snackbar>
    </div>
  );
}
export default ComputePension;
