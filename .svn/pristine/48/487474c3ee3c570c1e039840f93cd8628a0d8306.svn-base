import React, { useState, useEffect } from 'react';
import DistrictList from 'components/form_components/DistrictList';
import StateList from 'components/form_components/StateList';
import {
  FormControl,
  Grid,
  Select,
  MenuItem,
  InputLabel,
  FormControlLabel,
  RadioGroup,
  Radio,
  TextField,
  Typography,
  Button
} from '@mui/material';
import MainCard from 'ui-component/cards/MainCard';
import axiosInstance from 'hooks/useAuthTokenUrl';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, FormHelperText } from '@mui/material';
import messages_en from 'components/common/messages_en.json';

const SchemeUniverseUpdation = () => {
  const [stateId, setStateId] = useState('');
  const [districtId, setDistrictId] = useState('');
  const [getAllFinYear, setAllFinYear] = useState([]);
  const [finYear, setFinYear] = useState('');
  const [scheme, setScheme] = useState('');
  const [selectedOption, setSelectedOption] = useState('');
  const [response, setResponse] = useState(null);
  const [formData, setFormData] = useState({
    ignoapsValue: '',
    ignwpsValue: '',
    igndpsValue: ''
  });
  const [snackbar, setSnackbar] = React.useState(null);
  const handleCloseSnackbar = () => setSnackbar(null);
  const [updatedUniverses, setUpdatedUniverses] = useState({});
  const [centerList, setCenterList] = useState([]);
  const [stateData, setStateData] = useState([]);
  const [errors, setErrors] = useState({});

  const handleSelectStateid = (state) => {
    setStateId(state);
    console.log(stateId);
    setErrors((prevErrors) => {
      const updatedErrors = { ...prevErrors };
      delete updatedErrors.stateId;
      return updatedErrors;
    });
  };

  const handleDistid = (dist) => {
    setDistrictId(dist);
    console.log(districtId);
    setErrors((prevErrors) => {
      const updatedErrors = { ...prevErrors };
      delete updatedErrors.districtId;
      return updatedErrors;
    });
  };

  const handleChangeFinYear = (finYear) => {
    setFinYear(finYear);
    setErrors((prevErrors) => {
      const updatedErrors = { ...prevErrors };
      delete updatedErrors.finYear;
      return updatedErrors;
    });
  };

  const handleSchemeChange = (event) => {
    setScheme(event.target.value);
    console.log('scheme:', scheme);
    setErrors((prevErrors) => {
      const updatedErrors = { ...prevErrors };
      delete updatedErrors.scheme;
      return updatedErrors;
    });
  };

  const handleOptionChange = (event) => {
    const isFormValid = validateForm();
    if (isFormValid) {
      setSelectedOption(event.target.value);
      if ((event.target.value === 'update' && response.length === 0) || (event.target.value === 'show' && response.length === 0)) {
        setSnackbar({ children: 'No data available to display.', severity: 'info' });
      }
    }
  };

  const getFinancialYearList = () => {
    axiosInstance
      .get('/common/getFinancialYearList')
      .then((response) => {
        setAllFinYear(response.data);
      })
      .catch((error) => {
        console.error('Error fetching financial year list:', error);
      });
  };

  useEffect(() => {
    getFinancialYearList();
  }, []);

  const getCentralAndStateScheme = async () => {
    try {
      console.log('API Call Params:', stateId, districtId, finYear, scheme);
      const response = await axiosInstance.post(`utility/getCentralAndStateScheme/${stateId}/${districtId}/${finYear}/${scheme}`);
      const data = response.data;
      setResponse(data);
      console.log('API Response:', data);
      // Initialize form data based on response
      if (response.data.length > 0) {
        const { ignoaps, ignwps, igndps } = response.data[0];
        setFormData({
          ignoapsValue: ignoaps || '',
          ignwpsValue: ignwps || '',
          igndpsValue: igndps || ''
        });
      }
      // Handle data as needed
    } catch (error) {
      console.error('Error fetching generated Summary', error);
    }
  };

  useEffect(() => {
    if (stateId && districtId && finYear && scheme) {
      getCentralAndStateScheme();
    }
  }, [stateId, districtId, finYear, scheme]);

  const handleUpdateCenterValues = async () => {
    // Prepare data to be sent in the API request
    try {
      const requestBody = {
        stateId,
        districtId,
        ignoaps: formData.ignoapsValue,
        ignwps: formData.ignwpsValue,
        igndps: formData.igndpsValue
      };

      // Make API call using fetch or axios (replace 'YOUR_API_ENDPOINT' with your actual endpoint)
      const response = await axiosInstance.post('utility/updateCentralScheme', JSON.stringify(requestBody));
      console.log(response);
      if (response.data === 'Data updated successfully') {
        setSnackbar({ children: 'Data updated successfully', severity: 'success' });
      } else {
        setSnackbar({ children: 'Record not updated', severity: 'error' });
      }
    } catch (error) {
      console.error('Error updating values:', error);
      setSnackbar('Record not updated');
    }
  };

  const handleUpdateStateValues = async () => {
    try {
      const updateData = response.map((schemeItem) => ({
        stateId: stateId,
        districtId: districtId,
        finYear: finYear,
        schemeName: schemeItem.schemeName,
        schemeCode: schemeItem.schemeCode,
        universe: schemeItem.universe
      }));

      const updateResponse = await axiosInstance.post('utility/updateStateScheme', updateData);
      console.log(updateResponse);

      if (updateResponse.data === 'Data updated successfully') {
        setSnackbar({ children: 'Data updated successfully', severity: 'success' });
      } else {
        setSnackbar('Record not updated');
      }
    } catch (error) {
      console.error('Error updating values:', error);
      setSnackbar({ children: 'Record not updated', severity: 'error' });
    }
  };

  const handleUpdateValue = (schemeCode, newValue) => {
    // Update the response array with the new universe value for the corresponding schemeCode
    const updatedResponse = response.map((schemeItem) => {
      if (schemeItem.schemeCode === schemeCode) {
        return {
          ...schemeItem,
          universe: newValue
        };
      }
      return schemeItem; // Return unchanged item if schemeCode doesn't match
    });

    // Update the state with the modified response array
    setResponse(updatedResponse);

    // Update the updatedUniverses state (if needed)
    setUpdatedUniverses((prevUniverses) => ({
      ...prevUniverses,
      [schemeCode]: newValue
    }));
  };

  const fetchCenterList = async () => {
    try {
      const requestBody = {
        stateId: stateId,
        districtId: districtId
      };
      const response = await axiosInstance.post('utility/showCenterList', JSON.stringify(requestBody));
      const data = response.data;
      setCenterList(data);
    } catch (error) {
      console.error('Error fetching center list:', error);
    }
  };

  useEffect(() => {
    if (stateId && districtId) {
      fetchCenterList();
    }
  }, [stateId, districtId]);

  const fetchStateList = async () => {
    try {
      const requestBody = {
        stateId: stateId,
        districtId: districtId,
        finYear: finYear
      };
      const response = await axiosInstance.post('utility/showStateList', JSON.stringify(requestBody));
      setStateData(response.data);
    } catch (error) {
      console.error('Error fetching center list:', error);
    }
  };

  useEffect(() => {
    if (stateId && districtId && finYear) {
      fetchStateList();
    }
  }, [stateId, districtId, finYear]);

  const renderTableHeaders = () => {
    if (Object.keys(stateData).length === 0) return null; // Check if stateData is empty

    // Extract unique scheme codes from all ArrayLists in stateData
    const allSchemeCodes = Object.values(stateData)
      .flatMap((schemeList) => schemeList.map((item) => item.schemeCode))
      .filter(Boolean);

    const uniqueSchemeCodes = [...new Set(allSchemeCodes)]; // Get unique scheme codes

    return (
      <TableRow>
        <TableCell>
          <b>District Name</b>
        </TableCell>
        {uniqueSchemeCodes.map((schemeCode, index) => (
          <TableCell key={index}>
            <b>{schemeCode}</b>
          </TableCell>
        ))}
      </TableRow>
    );
  };

  const renderTableRows = () => {
    return (
      <>
        {Object.entries(stateData).map(([districtName, schemeList]) => (
          <TableRow key={districtName}>
            <TableCell>{districtName}</TableCell>
            {schemeList.map((item, index) => (
              <TableCell key={index}>{item.universe}</TableCell>
            ))}
          </TableRow>
        ))}
      </>
    );
  };

  const validateForm = () => {
    const errors = {};
    if (!scheme) {
      errors.scheme = messages_en.schemeRequired;
    }

    if (!finYear) {
      errors.finYear = messages_en.finYearRequired;
    }

    if (!districtId) {
      errors.districtId = messages_en.districtRequired;
    }

    if (!stateId) {
      errors.stateId = messages_en.stateRequired;
    }

    setErrors(errors);

    return Object.keys(errors).length === 0;
  };

  const renderSchemeFields = () => {
    if (response && response.length > 0 && stateId && districtId && finYear && scheme && scheme === 'C' && selectedOption === 'update') {
      return (
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1">Scheme Name</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1">Enter Value</Typography>
          </Grid>

          <Grid item xs={12}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  variant="outlined"
                  fullWidth
                  value="IGNOAPS"
                  InputProps={{
                    readOnly: true
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  variant="outlined"
                  fullWidth
                  value={formData.ignoapsValue}
                  onChange={(e) => setFormData({ ...formData, ignoapsValue: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  variant="outlined"
                  fullWidth
                  value="IGNWPS"
                  InputProps={{
                    readOnly: true
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  variant="outlined"
                  fullWidth
                  value={formData.ignwpsValue}
                  onChange={(e) => setFormData({ ...formData, ignwpsValue: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  variant="outlined"
                  fullWidth
                  value="IGNDPS"
                  InputProps={{
                    readOnly: true
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  variant="outlined"
                  fullWidth
                  value={formData.igndpsValue}
                  onChange={(e) => setFormData({ ...formData, igndpsValue: e.target.value })}
                />
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12}>
            <Button variant="contained" onClick={handleUpdateCenterValues}>
              Update Values
            </Button>
          </Grid>
        </Grid>
      );
    } else if (
      response &&
      response.length > 0 &&
      stateId &&
      districtId &&
      finYear &&
      scheme &&
      scheme === 'S' &&
      selectedOption === 'update'
    ) {
      return (
        <Grid container spacing={2}>
          {response.map((schemeItem, index) => (
            <Grid item xs={12} key={index}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    variant="outlined"
                    fullWidth
                    value={`${schemeItem.schemeName} (${schemeItem.schemeCode})`}
                    InputProps={{
                      readOnly: true
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    variant="outlined"
                    fullWidth
                    value={
                      updatedUniverses[schemeItem.schemeCode] !== undefined ? updatedUniverses[schemeItem.schemeCode] : schemeItem.universe
                    }
                    onChange={(e) => handleUpdateValue(schemeItem.schemeCode, e.target.value)}
                  />
                </Grid>
              </Grid>
            </Grid>
          ))}
          <Grid item xs={12}>
            <Button variant="contained" onClick={handleUpdateStateValues}>
              Update Values
            </Button>
          </Grid>
        </Grid>
      );
    } else if (
      response &&
      response.length > 0 &&
      stateId &&
      districtId &&
      finYear &&
      scheme &&
      scheme === 'C' &&
      selectedOption === 'show'
    ) {
      return (
        <div>
          <Typography gutterBottom style={{ fontSize: '1.4rem', color: 'black', fontWeight: 'normal' }}>
            Total Universe District Wise Summary <b style={{ backgroundColor: 'skyblue', padding: '4px' }}>Center Schemes</b>
          </Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <b>District Name</b>
                  </TableCell>
                  <TableCell>
                    <b>IGNOAPS</b>
                  </TableCell>
                  <TableCell>
                    <b>IGNWPS</b>
                  </TableCell>
                  <TableCell>
                    <b>IGNDPS</b>
                  </TableCell>
                  <TableCell>
                    <b>Total Target</b>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {centerList.map((center, index) => (
                  <TableRow key={index}>
                    <TableCell>{center.districtName}</TableCell>
                    <TableCell>{center.ignoaps}</TableCell>
                    <TableCell>{center.ignwps}</TableCell>
                    <TableCell>{center.igndps}</TableCell>
                    <TableCell>{center.totalScheme}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      );
    } else if (
      response &&
      response.length > 0 &&
      stateId &&
      districtId &&
      finYear &&
      scheme &&
      scheme === 'S' &&
      selectedOption === 'show'
    ) {
      return (
        <div>
          <Typography gutterBottom style={{ fontSize: '1.4rem', color: 'black', fontWeight: 'normal' }}>
            Total Universe District Wise Summary <b style={{ backgroundColor: 'skyblue', padding: '4px' }}>State Schemes</b> {finYear}
          </Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>{renderTableHeaders()}</TableHead>
              <TableBody>{renderTableRows()}</TableBody>
            </Table>
          </TableContainer>
        </div>
      );
    } else {
      return null;
    }
  };
  return (
    <>
      <MainCard>
        <h3 style={{ fontSize: '2rem', color: 'black', fontWeight: 'normal' }}>Updation Scheme Wise Old Records to New Records</h3>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={3}>
            <FormControl fullWidth>
              <StateList onSelectState={handleSelectStateid} isMendatory={true} />
            </FormControl>
            {errors.stateId && (
              <FormHelperText error id="stateId-error">
                {errors.stateId}
              </FormHelperText>
            )}
          </Grid>
          <Grid item xs={12} sm={3}>
            <FormControl fullWidth>
              <DistrictList onSelectState={handleSelectStateid} onSelectDistrict={handleDistid} isMendatory={true} />
            </FormControl>
            {errors.districtId && (
              <FormHelperText error id="districtId-error">
                {errors.districtId}
              </FormHelperText>
            )}
          </Grid>
          <Grid item xs={12} sm={3}>
            <FormControl fullWidth>
              <InputLabel id="scheme-select-label">
                Scheme&nbsp;<span style={{ color: 'red' }}>*</span>
              </InputLabel>
              <Select labelId="scheme-select-label" id="scheme-select" value={scheme} onChange={handleSchemeChange} label="Scheme">
                <MenuItem value="C">Central Scheme</MenuItem>
                <MenuItem value="S">State Scheme</MenuItem>
              </Select>
              {errors.scheme && (
                <FormHelperText error id="scheme-error">
                  {errors.scheme}
                </FormHelperText>
              )}
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={3}>
            <FormControl fullWidth>
              <InputLabel id="finYear-select-label">
                Financial Year&nbsp;<span style={{ color: 'red' }}>*</span>
              </InputLabel>
              <Select
                labelId="finYear-select-label"
                id="finYear-select"
                value={finYear}
                onChange={(event) => handleChangeFinYear(event.target.value)}
                label="Financial Year"
              >
                {getAllFinYear.map((finYearOption) => (
                  <MenuItem key={finYearOption} value={finYearOption}>
                    {finYearOption}
                  </MenuItem>
                ))}
              </Select>
              {errors.finYear && (
                <FormHelperText error id="finYear-error">
                  {errors.finYear}
                </FormHelperText>
              )}
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={2}>
            <FormControl component="fieldset">
              <RadioGroup aria-label="schemeOption" name="schemeOption" value={selectedOption} onChange={handleOptionChange}>
                <FormControlLabel value="update" control={<Radio />} label="Update Scheme" />
              </RadioGroup>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={2}>
            <FormControl component="fieldset">
              <RadioGroup aria-label="schemeOption" name="schemeOption" value={selectedOption} onChange={handleOptionChange}>
                <FormControlLabel value="show" control={<Radio />} label="Show Scheme" />
              </RadioGroup>
            </FormControl>
          </Grid>
        </Grid>
      </MainCard>
      {/* Snackbar to display update status */}
      {!!snackbar && (
        <Snackbar open anchorOrigin={{ vertical: 'top', horizontal: 'center' }} onClose={handleCloseSnackbar} autoHideDuration={6000}>
          <Alert {...snackbar} onClose={handleCloseSnackbar} />
        </Snackbar>
      )}
      {renderSchemeFields() && (
        <div style={{ marginTop: '20px' }}>
          <MainCard>
            {/* Render additional fields based on selected scheme and option */}
            {renderSchemeFields()}
          </MainCard>
        </div>
      )}
    </>
  );
};

export default SchemeUniverseUpdation;
