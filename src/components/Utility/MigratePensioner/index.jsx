import React, { useState, useEffect } from 'react';
import MainCard from 'ui-component/cards/MainCard';
import {
  Grid,
  FormControl,
  FormHelperText,
  Typography,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Select,
  MenuItem,
  Checkbox
} from '@mui/material';
import StateList from 'components/form_components/StateList';
import DistrictList from 'components/form_components/DistrictList';
import AreaList from 'components/form_components/AreaList';
import SubDistrictList from 'components/form_components/SubDistrictList';
import messages_en from 'components/common/messages_en.json';
import axiosInstance from 'hooks/useAuthTokenUrl';
import ArrowBack from '@mui/icons-material/ArrowBack';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CircularProgress from '@mui/material/CircularProgress';

const MigratePensioner = () => {
  const [formErrors, setFormErrors] = useState({});
  const [formData, setFormData] = useState({
    stateCode: '',
    districtCode: '',
    areaCode: '',
    subDistrictMunicipalCode: ''
  });
  const [tableData, setTableData] = useState([]);
  const [isSubDistrictWiseData, setIsSubDistrictWiseData] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;
  const [initialFormData, setInitialFormData] = useState({}); // Store initial form data
  const [initialTableData, setInitialTableData] = useState([]); // Store initial table data
  const [isBackButton, setIsBackButton] = useState(false); // Back button state
  const [ageHeader, setAgeHeader] = useState('Age (0-0)');
  const [isRowClicked, setIsRowClicked] = useState(false);
  const [fetchedData, setFetchedData] = useState(null);
  const [schemeList, setSchemeList] = useState(null);
  const [selectedSchemes, setSelectedSchemes] = useState({}); // State to store selected schemes
  const [snackbar, setSnackbar] = React.useState(null);
  const handleCloseSnackbar = () => setSnackbar(null);
  const [selectedSanctionOrderNo, setSelectedSanctionOrderNo] = useState('');
  const [showTableOne, setShowTableOne] = useState(false);
  const [loading, setLoading] = useState(false);

  // Handle changes in page number
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  // Calculate the range of rows to display for the current page
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;

  // Slice the tableData array to get the rows for the current page
  const currentRows = tableData.slice(startIndex, endIndex);

  const CustomToolbar = (props) => {
    return (
      <div>
        <GridToolbar {...props} />
        <div style={{ borderBottom: '1px solid #ccc', marginTop: '8px' }}></div>
      </div>
    );
  };

  const handleStateChange = (stateId) => {
    setFormData({ ...formData, stateCode: stateId });
    setFormErrors((prevErrors) => {
      const updatedErrors = { ...prevErrors };
      delete updatedErrors.stateCode;
      return updatedErrors;
    });
  };
  const handleDistrictChange = (districtId) => {
    setFormData({ ...formData, districtCode: districtId });
    setFormErrors((prevErrors) => {
      const updatedErrors = { ...prevErrors };
      delete updatedErrors.districtCode;
      return updatedErrors;
    });
  };
  const handleAreaChange = (areaCode) => {
    setFormData({ ...formData, areaCode: areaCode });
    setFormErrors((prevErrors) => {
      const updatedErrors = { ...prevErrors };
      delete updatedErrors.areaCode;
      return updatedErrors;
    });
  };

  const handleSubDistrictChange = (subDistrictCode) => {
    setFormData({ ...formData, subDistrictMunicipalCode: subDistrictCode });
    setFormErrors((prevErrors) => {
      const updatedErrors = { ...prevErrors };
      delete updatedErrors.subDistrictMunicipalCode;
      return updatedErrors;
    });
  };

  const handleFromAgeChange = (fromAge) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      fromAge: fromAge
    }));
    setFormErrors((prevErrors) => {
      const updatedErrors = { ...prevErrors };
      delete updatedErrors.fromAge;
      return updatedErrors;
    });
  };

  const handleToAgeChange = (toAge) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      toAge: toAge
    }));
    setFormErrors((prevErrors) => {
      const updatedErrors = { ...prevErrors };
      delete updatedErrors.toAge;
      return updatedErrors;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const isFormValid = validateForm();
    if (isFormValid) {
      setLoading(true);
      try {
        setIsSubDistrictWiseData(false);
        setIsRowClicked(false);
        const requestBody = {
          districtCode: formData.districtCode,
          area: formData.areaCode || null,
          subDistrictMunicipalCode: formData.subDistrictMunicipalCode || null,
          fromAge: formData.fromAge,
          toAge: formData.toAge
        };
        const response = await axiosInstance.post('utility/showMaxAgePensionerData', JSON.stringify(requestBody));
        setTableData(response.data);
        if (formData.subDistrictMunicipalCode) {
          setIsSubDistrictWiseData(true);
        }

        if (formData.fromAge !== undefined && formData.toAge !== undefined && formData.fromAge !== '' && formData.toAge !== '') {
          setAgeHeader(`Age (${parseInt(formData.fromAge) + 1}-${parseInt(formData.toAge) - 1})`);
        } else {
          setAgeHeader('Age (0-0)'); // Default value when fromAge and toAge are both 0
        }
        setInitialFormData({ ...formData });
        setInitialTableData(response.data);
        setShowTableOne(true);
      } catch (error) {
        console.error('Error fetching center list:', error);
      } finally {
        setLoading(false);
      }
    } else {
      console.log('Form not valid!');
    }
  };
  console.log(tableData);
  // Back button handler
  const handleBackButton = () => {
    setFormData({ ...initialFormData }); // Restore initial form data
    setTableData([...initialTableData]); // Restore initial table data
    setIsSubDistrictWiseData(false);
    setIsBackButton(false); // Disable back button
  };
  const cancelButton = () => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      districtCode: '',
      areaCode: '',
      subDistrictMunicipalCode: '',
      fromAge: null,
      toAge: null
    }));
    setShowTableOne(false);
    setIsRowClicked(false);
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.stateCode) {
      errors.stateCode = messages_en.stateRequired;
    }
    if (!formData.districtCode) {
      errors.districtCode = messages_en.districtRequired;
    }

    if (formData.areaCode && !formData.subDistrictMunicipalCode) {
      errors.subDistrictMunicipalCode = messages_en.subDistrictRequired;
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0; // Return true if no errors
  };

  const handleSubDistrictClick = async (subDistrictMunicipalAreaCode) => {
    setLoading(true);
    try {
      const requestBody = {
        districtCode: formData.districtCode,
        area: formData.areaCode || null,
        subDistrictMunicipalCode: subDistrictMunicipalAreaCode || null,
        fromAge: formData.fromAge,
        toAge: formData.toAge
      };
      const response = await axiosInstance.post('utility/showMaxAgePensionerData', JSON.stringify(requestBody));
      console.log(response.data);
      setTableData(response.data);
      setIsSubDistrictWiseData(true);
      setIsBackButton(true);
    } catch (error) {
      console.error('Error fetching center list:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePensionerDataClick = async (area, code, flag, ageLimit) => {
    console.log('Pensioner data click:', { area, code, flag, ageLimit });
    setLoading(true);
    try {
      let requestBody = {
        area,
        flag,
        ageLimit,
        fromAge: formData.fromAge,
        toAge: formData.toAge
      };

      // Conditionally include the code based on the flag value
      if (flag === 'grampanchayat') {
        requestBody.gramPanchayatWardCode = code;
      } else if (flag === 'subdistrict') {
        requestBody.subDistrictMunicipalCode = code;
      }
      const response = await axiosInstance.post('utility/getPensionersData', JSON.stringify(requestBody));
      console.log('Pensioner Data', response.data);
      const dataWithCheckbox = response.data.map((item, index) => ({
        ...item,
        id: index + 1,
        isChecked: false, // Initialize isChecked to false
        schemeCode: '' // Initialize schemeCode to an empty string
      }));

      setFetchedData(dataWithCheckbox);
      setIsRowClicked(true);
    } catch (error) {
      console.error('Error fetching center list:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handlePensionerDataClick();
  }, []);

  const getSchemeInAction = async () => {
    try {
      const response = await axiosInstance.get('utility/getSchemeInAction');
      console.log(response.data);
      setSchemeList(response.data);
    } catch (error) {
      console.error('Error fetching center list:', error);
    }
  };

  useEffect(() => {
    getSchemeInAction();
  }, []);

  const checkPenCompatibleForSchemes = async (schemeCode, sanctionOrderNo) => {
    try {
      const requestBody = {
        schemeCode: schemeCode,
        sanctionOrderNo: sanctionOrderNo
      };
      const response = await axiosInstance.post('utility/checkPenCompatibleForSchemes', requestBody);
      console.log('response.data', response.data);
      if (response.data === 'gender' || response.data === 'age') {
        setSnackbar({
          children: `Pensioner Is Not Eligible to Migrate due to ${response.data} is not compatible`,
          severity: 'error'
        });
        return false; // Return false indicating the check failed
      }
      return true; // Return true indicating the check passed
    } catch (error) {
      console.error('Error fetching center list:', error);
      return false; // Return false in case of an error
    }
  };

  useEffect(() => {
    checkPenCompatibleForSchemes();
  }, []);

  const handleSchemeChange = async (event, params) => {
    const selectedScheme = event.target.value;
    const sanctionOrderNo = params.row.sanctionOrderNo;
    const rowId = params.row.id;

    // Update selected schemes state
    setSelectedSchemes((prevState) => ({
      ...prevState,
      [sanctionOrderNo]: selectedScheme
    }));
    setSelectedSanctionOrderNo(sanctionOrderNo);

    // Call the API with the selected scheme and sanction order number
    const isCompatible = await checkPenCompatibleForSchemes(selectedScheme, sanctionOrderNo);

    if (isCompatible) {
      setFetchedData((prevData) => prevData.map((row) => (row.id === rowId ? { ...row, schemeCode: selectedScheme } : row)));
    } else {
      // Reset the dropdown to its default value if the check fails
      setFetchedData((prevData) => prevData.map((row) => (row.id === rowId ? { ...row, schemeCode: '' } : row)));
      setSelectedSchemes((prevState) => ({
        ...prevState,
        [sanctionOrderNo]: '' // Reset the selected scheme to its default value
      }));
    }
  };

  const handleCheckboxChange = (event, rowId) => {
    const isChecked = event.target.checked;
    console.log(isChecked);
    console.log(rowId);

    // Update the isChecked state for the row with the given ID
    setFetchedData((prevData) => prevData.map((row) => (row.id === rowId ? { ...row, isChecked: isChecked } : row)));
  };

  const handleConvertedSchemeSubmit = async () => {
    setLoading(true);
    try {
      console.log('selectedSchemes', selectedSchemes);
      console.log('selectedSanctionOrderNo', selectedSanctionOrderNo);

      // Check if at least one checkbox is checked
      const pensionerList = fetchedData
        .filter((row) => row.isChecked) // Filter rows where isChecked is true
        .map((row) => ({
          sanctionOrderNo: row.sanctionOrderNo,
          schemeCode: row.schemeCode,
          applicantName: row.applicantName,
          applicationNo: row.applicationNo,
          stateCode: row.stateCode,
          districtCode: row.districtCode,
          area: row.area,
          subDistrictMunicipalCode: row.subDistrictMunicipalCode,
          gender: row.gender,
          age: row.age,
          cpsms_beneficiary_id: row.cpsms_beneficiary_id,
          pfms_bank_po_account_no: row.pfms_bank_po_account_no,
          pfms_ifsc_code: row.pfms_ifsc_code,
          pfms_uid_no: row.pfms_uid_no,
          pfms_payment_flag: row.pfms_payment_flag,
          pfms_bank_name: row.pfms_bank_name,
          disabilityStatus: row.disabilityStatus,
          gramPanchayatWardCode: row.gramPanchayatWardCode,
          beneficiaryNo: row.beneficiaryNo,
          selectedSchemes
        })); // Map to required fields as key-value pairs
      console.log('pensionerList', pensionerList);

      // Check if at least one checkbox is checked and at least one scheme is selected
      const isAtLeastOneChecked = pensionerList.length > 0;
      const isAtLeastOneSchemeSelected = Object.keys(selectedSchemes).length > 0; // Check if selectedSchemes is not empty

      if (!isAtLeastOneChecked || !isAtLeastOneSchemeSelected) {
        setSnackbar({ children: 'Please select at least one scheme', severity: 'error' });
        return;
      }

      const updateResponse = await updateMaxAgePensioners(pensionerList);
      const responseList = updateResponse.data;

      console.log('responseList', responseList);
    } catch (error) {
      console.error('Error handling submission:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateMaxAgePensioners = async (pensionerList) => {
    try {
      let requestBody = {
        pensionerList: pensionerList
      };
      const response = await axiosInstance.post('utility/updateMaxAgePensioners', requestBody);
      console.log(response.data);

      setIsRowClicked(false);
      setShowTableOne(false);

      setSelectedSchemes({});
      setSelectedSanctionOrderNo('');

      let snackbarMessage = response.data.map((item) => item.value).join('\n');

      setSnackbar({
        children: snackbarMessage,
        severity: 'info'
      });

      return response.data;
    } catch (error) {
      console.error('Error fetching center list:', error);
    }
  };

  useEffect(() => {
    getSchemeInAction();
  }, []);

  const handleBackButtonClick = () => {
    setIsRowClicked(false); // Set isRowClicked to false to go back to the first page
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
      <MainCard>
        <h3 style={{ fontSize: '2rem', color: 'black', fontWeight: 'normal' }}>Migrate Pensioner</h3>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <StateList onSelectState={handleStateChange} isMendatory={true} />
              {formErrors.stateCode && (
                <FormHelperText>
                  <Typography style={{ color: 'red', fontSize: '0.8rem' }}>{formErrors.stateCode}</Typography>
                </FormHelperText>
              )}
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <DistrictList
                onSelectDistrict={handleDistrictChange}
                isMendatory={true}
                selectedStateId={formData.stateCode}
                defaultSelectedDistrict={formData.districtCode}
              />
              {formErrors.districtCode && (
                <FormHelperText>
                  <Typography style={{ color: 'red', fontSize: '0.8rem' }}>{formErrors.districtCode}</Typography>
                </FormHelperText>
              )}
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <AreaList onSelectArea={handleAreaChange} selectedArea={formData.areaCode} isMendatory={false} />
              {formErrors.areaCode && (
                <FormHelperText>
                  <Typography style={{ color: 'red', fontSize: '0.8rem' }}>{formErrors.areaCode}</Typography>
                </FormHelperText>
              )}
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <SubDistrictList
                onSelectSubDistrict={handleSubDistrictChange}
                selectedDistrictId={formData.districtCode}
                selectedAreaId={formData.areaCode}
                isMendatory={false}
              />
              {formErrors.subDistrictMunicipalCode && (
                <FormHelperText>
                  <Typography style={{ color: 'red', fontSize: '0.8rem' }}>{formErrors.subDistrictMunicipalCode}</Typography>
                </FormHelperText>
              )}
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <TextField
                label="From Age"
                name="fromAge"
                placeholder="Enter From Age"
                variant="outlined"
                fullWidth
                value={formData.fromAge}
                inputProps={{ maxLength: 100 }}
                onChange={(e) => handleFromAgeChange(e.target.value)}
              />
              {formErrors.fromAge && (
                <FormHelperText>
                  <Typography style={{ color: 'red', fontSize: '0.8rem' }}>{formErrors.fromAge}</Typography>
                </FormHelperText>
              )}
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <TextField
                label="To Age"
                name="toAge"
                placeholder="Enter To Age"
                variant="outlined"
                fullWidth
                value={formData.toAge}
                inputProps={{ maxLength: 100 }}
                onChange={(e) => handleToAgeChange(e.target.value)}
              />
              {formErrors.toAge && (
                <FormHelperText>
                  <Typography style={{ color: 'red', fontSize: '0.8rem' }}>{formErrors.toAge}</Typography>
                </FormHelperText>
              )}
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <Typography sx={{ color: 'red', fontSize: '1rem' }}>
              * Only sanctioned pensioners can migrate from one scheme to another scheme
            </Typography>
          </Grid>
          <Grid item xs={12} alignItems="center">
            <Button type="submit" variant="contained" color="primary" onClick={handleSubmit}>
              SUBMIT
            </Button>
            &nbsp; &nbsp; &nbsp;
            <Button type="button" variant="contained" color="error" onClick={cancelButton}>
              CANCEL
            </Button>
          </Grid>
        </Grid>
      </MainCard>

      {!isRowClicked && tableData.length > 0 && showTableOne && (
        <div style={{ marginTop: '20px' }}>
          <MainCard>
            <TableContainer component={Paper} style={{ marginTop: '20px' }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>{isSubDistrictWiseData ? 'Grampanchayat/Ward' : 'Subdistrict/Municipality'}</TableCell>
                    <TableCell
                      colSpan={tableData[0].schemeCode === 'IGNWPS' || tableData[0].schemeCode === 'IGNDPS' ? 4 : 3}
                      style={{ borderRight: '1px solid #ccc' }}
                    >
                      Rural
                    </TableCell>
                    <TableCell colSpan={tableData[0].schemeCode === 'IGNWPS' || tableData[0].schemeCode === 'IGNDPS' ? 4 : 3}>
                      Urban
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>--</TableCell>
                    {tableData[0].schemeCode === 'IGNWPS' && <TableCell>Age (40-59)</TableCell>}
                    {tableData[0].schemeCode === 'IGNDPS' && <TableCell>Age (18-59)</TableCell>}
                    <TableCell>Age (60-79)</TableCell>
                    <TableCell>Age (80 above)</TableCell>
                    <TableCell>{ageHeader}</TableCell>
                    {tableData[0].schemeCode === 'IGNWPS' && <TableCell>Age (40-59)</TableCell>}
                    {tableData[0].schemeCode === 'IGNDPS' && <TableCell>Age (18-59)</TableCell>}
                    <TableCell>Age (60-79)</TableCell>
                    <TableCell>Age (80 above)</TableCell>
                    <TableCell>{ageHeader}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {currentRows.map((row, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <Button
                          style={{
                            textTransform: 'none',
                            textAlign: 'left',
                            wordWrap: 'break-word',
                            cursor: isSubDistrictWiseData ? 'auto' : 'pointer',
                            color: isSubDistrictWiseData ? 'inherit' : 'blue',
                            textDecoration: isSubDistrictWiseData ? 'none' : 'underline',
                            background: 'none',
                            paddingLeft: '10px',
                            border: 'none',
                            display: 'inline',
                            font: 'inherit'
                          }}
                          onClick={() => handleSubDistrictClick(row.subDistrictMunicipalCode)}
                        >
                          {isSubDistrictWiseData ? row.gramPanchayatName : row.subDistrictMunicipalName}
                        </Button>
                      </TableCell>
                      {tableData[0].schemeCode === 'IGNDPS' && (
                        <TableCell>
                          {row.totalRural18 !== '0' ? (
                            <Button
                              style={{
                                textTransform: 'none',
                                textAlign: 'left',
                                wordWrap: 'break-word',
                                cursor: row.totalRural18 !== 0 ? 'pointer' : 'auto',
                                color: row.totalRural18 !== 0 ? 'blue' : 'inherit',
                                background: 'none',
                                paddingLeft: '10px',
                                border: 'none',
                                display: 'inline',
                                font: 'inherit'
                              }}
                              onClick={() => {
                                console.log('Clicked row data:', row);
                                handlePensionerDataClick(
                                  row.area !== null ? row.area : 'R',
                                  isSubDistrictWiseData ? row.gramPanchayatWardCode : row.subDistrictMunicipalCode,
                                  isSubDistrictWiseData ? 'grampanchayat' : 'subdistrict',
                                  'above18'
                                );
                              }}
                            >
                              {row.totalRural18}
                            </Button>
                          ) : (
                            <span
                              style={{
                                color: 'inherit',
                                paddingLeft: '10px',
                                display: 'inline',
                                font: 'inherit'
                              }}
                            >
                              {row.totalRural18}
                            </span>
                          )}
                        </TableCell>
                      )}
                      {tableData[0].schemeCode === 'IGNWPS' && (
                        <TableCell>
                          {row.totalRural40 !== '0' ? (
                            <Button
                              style={{
                                textTransform: 'none',
                                textAlign: 'left',
                                wordWrap: 'break-word',
                                cursor: row.totalRural40 !== 0 ? 'pointer' : 'auto',
                                color: row.totalRural40 !== 0 ? 'blue' : 'inherit',
                                background: 'none',
                                paddingLeft: '10px',
                                border: 'none',
                                display: 'inline',
                                font: 'inherit'
                              }}
                              onClick={() => {
                                console.log('Clicked row data:', row);
                                handlePensionerDataClick(
                                  row.area !== null ? row.area : 'R',
                                  isSubDistrictWiseData ? row.gramPanchayatWardCode : row.subDistrictMunicipalCode,
                                  isSubDistrictWiseData ? 'grampanchayat' : 'subdistrict',
                                  'above40'
                                );
                              }}
                            >
                              {row.totalRural40}
                            </Button>
                          ) : (
                            <span
                              style={{
                                color: 'inherit',
                                paddingLeft: '10px',
                                display: 'inline',
                                font: 'inherit'
                              }}
                            >
                              {row.totalRural40}
                            </span>
                          )}
                        </TableCell>
                      )}
                      <TableCell>
                        {row.totalRural60 !== '0' ? (
                          <Button
                            style={{
                              textTransform: 'none',
                              textAlign: 'left',
                              wordWrap: 'break-word',
                              cursor: row.totalRural60 !== 0 ? 'pointer' : 'auto',
                              color: row.totalRural60 !== 0 ? 'blue' : 'inherit',
                              background: 'none',
                              paddingLeft: '10px',
                              border: 'none',
                              display: 'inline',
                              font: 'inherit'
                            }}
                            onClick={() => {
                              console.log('Clicked row data:', row);
                              handlePensionerDataClick(
                                row.area !== null ? row.area : 'R',
                                isSubDistrictWiseData ? row.gramPanchayatWardCode : row.subDistrictMunicipalCode,
                                isSubDistrictWiseData ? 'grampanchayat' : 'subdistrict',
                                'above60'
                              );
                            }}
                          >
                            {row.totalRural60}
                          </Button>
                        ) : (
                          <span
                            style={{
                              color: 'inherit',
                              paddingLeft: '10px',
                              display: 'inline',
                              font: 'inherit'
                            }}
                          >
                            {row.totalRural60}
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        {row.totalRural80 !== '0' ? (
                          <Button
                            style={{
                              textTransform: 'none',
                              textAlign: 'left',
                              wordWrap: 'break-word',
                              cursor: row.totalRural80 !== 0 ? 'pointer' : 'auto',
                              color: row.totalRural80 !== 0 ? 'blue' : 'inherit',
                              background: 'none',
                              paddingLeft: '10px',
                              border: 'none',
                              display: 'inline',
                              font: 'inherit'
                            }}
                            onClick={() => {
                              console.log('Clicked row data:', row);
                              handlePensionerDataClick(
                                row.area !== null ? row.area : 'R',
                                isSubDistrictWiseData ? row.gramPanchayatWardCode : row.subDistrictMunicipalCode,
                                isSubDistrictWiseData ? 'grampanchayat' : 'subdistrict',
                                'above80'
                              );
                            }}
                          >
                            {row.totalRural80}
                          </Button>
                        ) : (
                          <span
                            style={{
                              color: 'inherit',
                              paddingLeft: '10px',
                              display: 'inline',
                              font: 'inherit'
                            }}
                          >
                            {row.totalRural80}
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        {row.ageCount !== '0' ? (
                          <Button
                            style={{
                              textTransform: 'none',
                              textAlign: 'left',
                              wordWrap: 'break-word',
                              cursor: row.ageCount !== 0 ? 'pointer' : 'auto',
                              color: row.ageCount !== 0 ? 'blue' : 'inherit',
                              background: 'none',
                              paddingLeft: '10px',
                              border: 'none',
                              display: 'inline',
                              font: 'inherit'
                            }}
                            onClick={() => {
                              console.log('Clicked row data:', row);
                              handlePensionerDataClick(
                                row.area !== null ? row.area : 'R',
                                isSubDistrictWiseData ? row.gramPanchayatWardCode : row.subDistrictMunicipalCode,
                                isSubDistrictWiseData ? 'grampanchayat' : 'subdistrict',
                                'ageRange'
                              );
                            }}
                          >
                            {row.ageCount}
                          </Button>
                        ) : (
                          <span
                            style={{
                              color: 'inherit',
                              paddingLeft: '10px',
                              display: 'inline',
                              font: 'inherit'
                            }}
                          >
                            {row.ageCount}
                          </span>
                        )}
                      </TableCell>
                      {tableData[0].schemeCode === 'IGNDPS' && (
                        <TableCell>
                          {row.totalUrban18 !== '0' ? (
                            <Button
                              style={{
                                textTransform: 'none',
                                textAlign: 'left',
                                wordWrap: 'break-word',
                                cursor: row.totalUrban18 !== 0 ? 'pointer' : 'auto',
                                color: row.totalUrban18 !== 0 ? 'blue' : 'inherit',
                                background: 'none',
                                paddingLeft: '10px',
                                border: 'none',
                                display: 'inline',
                                font: 'inherit'
                              }}
                              onClick={() => {
                                console.log('Clicked row data:', row);
                                handlePensionerDataClick(
                                  row.area !== null ? row.area : 'U',
                                  isSubDistrictWiseData ? row.gramPanchayatWardCode : row.subDistrictMunicipalCode,
                                  isSubDistrictWiseData ? 'grampanchayat' : 'subdistrict',
                                  'above18'
                                );
                              }}
                            >
                              {row.totalUrban18}
                            </Button>
                          ) : (
                            <span
                              style={{
                                color: 'inherit',
                                paddingLeft: '10px',
                                display: 'inline',
                                font: 'inherit'
                              }}
                            >
                              {row.totalUrban18}
                            </span>
                          )}
                        </TableCell>
                      )}
                      {tableData[0].schemeCode === 'IGNWPS' && (
                        <TableCell>
                          {row.totalUrban40 !== '0' ? (
                            <Button
                              style={{
                                textTransform: 'none',
                                textAlign: 'left',
                                wordWrap: 'break-word',
                                cursor: row.totalRural40 !== 0 ? 'pointer' : 'auto',
                                color: row.totalRural40 !== 0 ? 'blue' : 'inherit',
                                background: 'none',
                                paddingLeft: '10px',
                                border: 'none',
                                display: 'inline',
                                font: 'inherit'
                              }}
                              onClick={() => {
                                console.log('Clicked row data:', row);
                                handlePensionerDataClick(
                                  row.area !== null ? row.area : 'U',
                                  isSubDistrictWiseData ? row.gramPanchayatWardCode : row.subDistrictMunicipalCode,
                                  isSubDistrictWiseData ? 'grampanchayat' : 'subdistrict',
                                  'above40'
                                );
                              }}
                            >
                              {row.totalUrban40}
                            </Button>
                          ) : (
                            <span
                              style={{
                                color: 'inherit',
                                paddingLeft: '10px',
                                display: 'inline',
                                font: 'inherit'
                              }}
                            >
                              {row.totalUrban40}
                            </span>
                          )}
                        </TableCell>
                      )}
                      <TableCell>
                        {row.totalUrban60 !== '0' ? (
                          <Button
                            style={{
                              textTransform: 'none',
                              textAlign: 'left',
                              wordWrap: 'break-word',
                              cursor: row.totalUrban60 !== 0 ? 'pointer' : 'auto',
                              color: row.totalUrban60 !== 0 ? 'blue' : 'inherit',
                              background: 'none',
                              paddingLeft: '10px',
                              border: 'none',
                              display: 'inline',
                              font: 'inherit'
                            }}
                            onClick={() => {
                              console.log('Clicked row data:', row);
                              handlePensionerDataClick(
                                row.area !== null ? row.area : 'U',
                                isSubDistrictWiseData ? row.gramPanchayatWardCode : row.subDistrictMunicipalCode,
                                isSubDistrictWiseData ? 'grampanchayat' : 'subdistrict',
                                'above60'
                              );
                            }}
                          >
                            {row.totalUrban60}
                          </Button>
                        ) : (
                          <span
                            style={{
                              color: 'inherit',
                              paddingLeft: '10px',
                              display: 'inline',
                              font: 'inherit'
                            }}
                          >
                            {row.totalUrban60}
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        {row.totalUrban80 !== '0' ? (
                          <Button
                            style={{
                              textTransform: 'none',
                              textAlign: 'left',
                              wordWrap: 'break-word',
                              cursor: row.totalUrban80 !== 0 ? 'pointer' : 'auto',
                              color: row.totalUrban80 !== 0 ? 'blue' : 'inherit',
                              background: 'none',
                              paddingLeft: '10px',
                              border: 'none',
                              display: 'inline',
                              font: 'inherit'
                            }}
                            onClick={() => {
                              console.log('Clicked row data:', row);
                              handlePensionerDataClick(
                                row.area !== null ? row.area : 'U',
                                isSubDistrictWiseData ? row.gramPanchayatWardCode : row.subDistrictMunicipalCode,
                                isSubDistrictWiseData ? 'grampanchayat' : 'subdistrict',
                                'above80'
                              );
                            }}
                          >
                            {row.totalUrban80}
                          </Button>
                        ) : (
                          <span
                            style={{
                              color: 'inherit',
                              paddingLeft: '10px',
                              display: 'inline',
                              font: 'inherit'
                            }}
                          >
                            {row.totalUrban80}
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        {row.ageCountU !== '0' ? (
                          <Button
                            style={{
                              textTransform: 'none',
                              textAlign: 'left',
                              wordWrap: 'break-word',
                              cursor: row.ageCountU !== 0 ? 'pointer' : 'auto',
                              color: row.ageCountU !== 0 ? 'blue' : 'inherit',
                              background: 'none',
                              paddingLeft: '10px',
                              border: 'none',
                              display: 'inline',
                              font: 'inherit'
                            }}
                            onClick={() => {
                              console.log('Clicked row data:', row);
                              handlePensionerDataClick(
                                row.area !== null ? row.area : 'U',
                                isSubDistrictWiseData ? row.gramPanchayatWardCode : row.subDistrictMunicipalCode,
                                isSubDistrictWiseData ? 'grampanchayat' : 'subdistrict',
                                'ageRange'
                              );
                            }}
                          >
                            {row.ageCountU}
                          </Button>
                        ) : (
                          <span
                            style={{
                              color: 'inherit',
                              paddingLeft: '10px',
                              display: 'inline',
                              font: 'inherit'
                            }}
                          >
                            {row.ageCountU}
                          </span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            <div style={{ margin: '20px 0' }}>
              {/* Add margin here */}
              <Grid container justifyContent="space-between" alignItems="center">
                <FormControl>
                  {isBackButton && (
                    <Button variant="contained" color="secondary" startIcon={<ArrowBack />} onClick={handleBackButton}>
                      Back
                    </Button>
                  )}
                </FormControl>
                <Grid item style={{ display: 'flex', alignItems: 'center' }}>
                  <Typography variant="body1" style={{ marginRight: '10px' }}>
                    Page {currentPage} - {Math.min(currentPage * rowsPerPage, tableData.length)} of {tableData.length}
                  </Typography>
                  {/* Pagination controls */}
                  <Button
                    disabled={currentPage === 1}
                    onClick={() => handlePageChange(currentPage - 1)}
                    variant="contained"
                    color="primary"
                    style={{ marginRight: '10px' }}
                  >
                    {'Previous'}
                  </Button>
                  <Button
                    disabled={endIndex >= tableData.length}
                    onClick={() => handlePageChange(currentPage + 1)}
                    variant="contained"
                    color="primary"
                  >
                    {'Next'}
                  </Button>
                </Grid>
              </Grid>
            </div>
          </MainCard>
        </div>
      )}

      {isRowClicked && fetchedData && (
        <div style={{ marginTop: '20px' }}>
          <MainCard style={{ textAlign: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span>{fetchedData[0].stateName}</span>
              <ArrowForwardIcon style={{ margin: '0 10px' }} />
              <span>{fetchedData[0].districtName}</span>
              <ArrowForwardIcon style={{ margin: '0 10px' }} />
              <span>{fetchedData[0].subDistrictMunicipalName}</span>
            </div>
            <div>MIGRATE BENEFICIARIES FROM IGNOAPS TO ANOTHER SCHEME</div>
            <div>AGE GROUP : {fetchedData[0].ageGroup}</div>
          </MainCard>
        </div>
      )}

      {/* Conditionally render the detailed data */}
      {isRowClicked && fetchedData && (
        <div style={{ marginTop: '20px' }}>
          <TableContainer component={Paper} style={{ marginTop: '20px' }}>
            <DataGrid
              rows={fetchedData.map((row, index) => ({ ...row, id: index + 1 }))}
              columns={[
                {
                  field: 'id',
                  headerName: 'Sr.No',
                  width: 100,
                  renderHeader: (params) => <div style={{ paddingLeft: '30px', fontWeight: 'bold' }}>{params.colDef.headerName}</div>,
                  renderCell: (params) => <div style={{ paddingLeft: '30px' }}>{params.value}</div>
                },
                { field: 'beneficiaryNo', headerName: 'Beneficiary No', width: 170 },
                { field: 'sanctionOrderNo', headerName: 'Sanction No', width: 170 },
                { field: 'applicantName', headerName: 'Applicant Name', width: 170 },
                { field: 'father_husband_name', headerName: 'Father/Husband Name', width: 250 },
                {
                  field: 'age',
                  headerName: 'Sex/Age',
                  width: 150,
                  valueGetter: (params) => `${params.row.gender}/ ${params.row.age}` // Combine gender and age
                },
                { field: 'dateofbirth', headerName: 'Date Of Birth', width: 170 },
                {
                  field: 'selectScheme',
                  headerName: 'Select Scheme To Convert',
                  width: 200,
                  renderCell: (params) => (
                    <Select
                      value={selectedSchemes[params.row.sanctionOrderNo] || ''} // Use selectedSchemes state
                      onChange={(event) => handleSchemeChange(event, params)}
                      style={{ width: '100%' }}
                    >
                      {schemeList.map((scheme) => (
                        <MenuItem key={scheme.schemeCode} value={scheme.schemeName}>
                          {scheme.schemeName}
                        </MenuItem>
                      ))}
                    </Select>
                  )
                },

                {
                  field: 'checkbox',
                  headerName: 'Checkbox',
                  width: 100,
                  renderCell: (params) => (
                    <Checkbox
                      checked={params.row.isChecked || false}
                      onChange={(event) => handleCheckboxChange(event, params.row.id)}
                      color="primary"
                    />
                  )
                }
              ]}
              autoHeight
              pageSize={25}
              rowsPerPageOptions={[25, 50, 100]}
              slots={{ toolbar: CustomToolbar }}
              slotProps={{
                toolbar: {
                  showQuickFilter: true,
                  printOptions: { disableToolbarButton: true }
                }
              }}
              initialState={{
                pagination: {
                  paginationModel: { pageSize: 25 }
                }
              }}
              getRowId={(row) => row.id}
            />
          </TableContainer>
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
            <Button onClick={handleConvertedSchemeSubmit} variant="contained" color="primary">
              Submit
            </Button>
            <Button onClick={handleBackButtonClick} variant="contained" color="secondary" style={{ marginLeft: '10px' }}>
              Back
            </Button>
          </div>
        </div>
      )}
      {!!snackbar && (
        <Snackbar open anchorOrigin={{ vertical: 'top', horizontal: 'center' }} onClose={handleCloseSnackbar} autoHideDuration={60000}>
          <Alert {...snackbar} onClose={handleCloseSnackbar}>
            {snackbar.children.split('\n').map((line, index) => (
              <React.Fragment key={index}>
                {line}
                <br />
              </React.Fragment>
            ))}
          </Alert>
        </Snackbar>
      )}
    </>
  );
};
export default MigratePensioner;
