import React, { useState, useEffect } from 'react';
import config from 'config';
import axiosInstance from 'hooks/useAuthTokenUrl';
import axios from 'axios';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { DataGrid } from '@mui/x-data-grid';

import {
  Button,
  Grid,
  FormControl,
  TextField,
  InputLabel,
  Select,
  Box,
  MenuItem,
  Backdrop,
  CircularProgress,
  FormHelperText,
  IconButton,
  Typography
} from '@mui/material';

import MainCard from 'ui-component/cards/MainCard';
import RefreshIcon from '@mui/icons-material/Refresh';

const StateDashboardReport = () => {
  const apiBaseUrl = config.API_BASE_URL;
  const [stateCode, setStateCode] = useState('');
  const [tabData, setTabData] = useState(null);
  const [states, setStates] = useState([]);
  const [captchaImage, setCapchaImage] = useState('');
  const [captchaToken, setCaptchaToken] = useState('');
  const [loading] = useState(false);
  const [schemeCode, setSchemeCode] = useState('');
  const [area, setArea] = useState('');
  const [errors] = useState({});
  const [tableData, setTableData] = useState([]);
  const [filters, setFilters] = useState({
    stateCode: null,
    schemeCode: null,
    area: null,
    districtCode: null,
    subDistrictCode: null
  });
  const [drillLevel, setDrillLevel] = useState('district');
  const [formData, setFormData] = useState({
    stateCode: '',
    schemeCode: '',
    area: '',
    captcha: ''
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'error'
  });

  useEffect(() => {
    const fetchStates = async () => {
      try {
        const response = await axiosInstance.get(`/nationalDashboard/getDashboardFormData`);
        setStates(response.data.listStates || []);
      } catch (err) {
        console.error('Error fetching states:', err);
      }
    };
    fetchStates();
  }, []);

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  useEffect(() => {
    fetchCaptcha();
  }, []);

  const fetchCaptcha = async () => {
    try {
      const captchaUrl = `${apiBaseUrl}/login/captcha`;
      const response = await axios.post(captchaUrl, { captchaToken });
      setCapchaImage(response.data.captchaImage);
      setCaptchaToken(response.data.captchaToken);
    } catch (error) {
      console.error('Error fetching CAPTCHA:', error);
    }
  };
  const handleRefreshCaptcha = () => {
    fetchCaptcha();
  };

  const handleSubmit = async () => {
    try {
      const payload = {
        stateCode: stateCode,
        schemeCode: schemeCode,
        area: area,
        captcha: formData.captcha,
        captchaToken: captchaToken
      };
      setFilters(payload);
      console.log('Submitting payload:', payload);

      const response = await axiosInstance.post('/stateDashboard/summaryData', payload);
      if (!response.data || Object.keys(response.data).length === 0) {
        setSnackbar({
          open: true,
          message: 'No data found for the selected filters',
          severity: 'warning'
        });
        setTabData(null);
        return;
      }
      setTabData(response.data);
      try {
        const drillResponse = await axiosInstance.post('/stateDashboard/drilldown', payload);
        setTableData(drillResponse.data || []);
      } catch (drillErr) {
        console.error('Error fetching drilldown data:', drillErr);
        setTableData([]);
        setSnackbar({
          open: true,
          message: 'Failed to load drilldown data',
          severity: 'warning'
        });
      }
    } catch (error) {
      console.error('Error fetching tabs summary:', error);

      if (error.response && error.response.data && error.response.data.message?.includes('Invalid CAPTCHA')) {
        setSnackbar({
          open: true,
          message: 'Invalid captcha, please try again',
          severity: 'error'
        });
      } else {
        setSnackbar({
          open: true,
          message: 'Failed to load summary. Please try again later.',
          severity: 'error'
        });
      }
    } finally {
      fetchCaptcha();
      setFormData((prev) => ({
        ...prev,
        captcha: ''
      }));
    }
  };

  const fetchDrilldownData = async (filters) => {
    try {
      const response = await axiosInstance.post('/stateDashboard/drilldown', filters);
      setTableData(response.data || []);
    } catch (err) {
      console.error('Error fetching drilldown data:', err);
      setSnackbar({
        open: true,
        message: 'Failed to load drilldown data',
        severity: 'error'
      });
    }
  };

  //
  const handleRowClick = async (params) => {
    if (params.row.isTotalRow) {
      return;
    }
    let updatedFilters = { ...filters };

    if (drillLevel === 'district') {
      updatedFilters.districtCode = params.row.districtCode;
      updatedFilters.subDistrictCode = null;
      setDrillLevel('subdistrict');
    } else if (drillLevel === 'subdistrict') {
      updatedFilters.subDistrictCode = params.row.subDistrictCode;
      setDrillLevel('gp');
    }

    setFilters(updatedFilters);
    fetchDrilldownData(updatedFilters);
  };

  const handleGoBack = async () => {
    if (drillLevel === 'gp') {
      const updatedFilters = { ...filters, subDistrictCode: null };
      setFilters(updatedFilters);
      setDrillLevel('subdistrict');
      fetchDrilldownData(updatedFilters);
      return;
    }

    if (drillLevel === 'subdistrict') {
      const updatedFilters = { ...filters, districtCode: null, subDistrictCode: null };
      setFilters(updatedFilters);
      setDrillLevel('district');
      fetchDrilldownData(updatedFilters);
      return;
    }

    if (drillLevel === 'district') {
      const updatedFilters = { ...filters, districtCode: null, subDistrictCode: null };
      setFilters(updatedFilters);
      setDrillLevel('state');
      fetchDrilldownData(updatedFilters);
    }
  };

  const drilldownColumns = [
    {
      field: 'id',
      headerName: 'Sr. No.',
      width: 100,
      sortable: false,
      filterable: false,
      valueGetter: (params) => (params.row.isTotalRow ? '' : params.row.id)
    },
    {
      field: drillLevel === 'district' ? 'districtName' : drillLevel === 'subdistrict' ? 'subDistrictName' : 'gramPanchayatName',
      headerName: drillLevel === 'district' ? 'District Name' : drillLevel === 'subdistrict' ? 'Subdistrict Name' : 'GP Name',
      flex: 1,
      renderCell: (params) => {
        const isTotal = params.row.isTotalRow;

        return (
          <span
            style={{
              color: isTotal || drillLevel === 'gp' ? 'inherit' : '#1976d2',
              cursor: isTotal || drillLevel === 'gp' ? 'default' : 'pointer',
              textDecoration: isTotal || drillLevel === 'gp' ? 'none' : 'underline',
              fontWeight: isTotal ? 'bold' : 'normal'
            }}
          >
            {params.value}
          </span>
        );
      }
    },
    { field: 'totalBeneficiary', headerName: 'Total Beneficiaries', type: 'number', flex: 1.2 },
    { field: 'totalBank', headerName: 'Total Bank Account', type: 'number', flex: 1 },
    { field: 'totalPo', headerName: 'Total PO Account', type: 'number', flex: 1 },
    { field: 'totalMo', headerName: 'TOtal MO Account', type: 'number', flex: 1 },
    { field: 'totalCash', headerName: 'Total Cash Account', type: 'number', flex: 1 },
    { field: 'totalDbt', headerName: 'DBT', type: 'number', flex: 1 },
    { field: 'totalAadhar', headerName: 'Total Aadhar', type: 'number', flex: 1 },
    { field: 'totalPfms', headerName: 'PFMS Registered', type: 'number', flex: 1.2 }
  ];

  return (
    <MainCard title="State Dashboard">
      <Backdrop open={loading} style={{ zIndex: 999, color: '#fff' }}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={4}>
          <FormControl fullWidth>
            <InputLabel id="state-label">State</InputLabel>
            <Select
              labelId="state-label"
              id="stateCode"
              value={stateCode}
              label="State"
              onChange={(e) => {
                console.log('State selected:', e.target.value);
                setStateCode(e.target.value);
              }}
              MenuProps={{ disablePortal: true }}
            >
              {(states || []).length === 0 ? (
                <MenuItem value="">
                  <em>No states found</em>
                </MenuItem>
              ) : (
                (states || []).map((st) => (
                  <MenuItem key={st.stateId} value={st.stateId}>
                    {st.stateName}
                  </MenuItem>
                ))
              )}
            </Select>
          </FormControl>
        </Grid>

        <Grid
          item
          xs={12}
          sm={6}
          md={4}
          sx={{
            '& .MuiFormControl-root, & .MuiInputBase-root': { width: '100%' },
            '& .MuiFormControl-root': { minWidth: 320 }
          }}
        >
          <FormControl fullWidth>
            <InputLabel id="scheme-name">Scheme</InputLabel>
            <Select
              labelId="scheme-name"
              id="schemeCode"
              name="schemeCode"
              value={schemeCode}
              onChange={(e) => setSchemeCode(e.target.value)}
            >
              <MenuItem value="all">ALL CENTRE SCHEME</MenuItem>
              <MenuItem value="IGNOAPS">IGNOAPS</MenuItem>
              <MenuItem value="IGNWPS">IGNWPS</MenuItem>
              <MenuItem value="IGNDPS">IGNDPS</MenuItem>
              <MenuItem value="NFBS">NFBS</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid
          item
          xs={12}
          sm={6}
          md={4}
          sx={{
            '& .MuiFormControl-root, & .MuiInputBase-root': { width: '100%' },
            '& .MuiFormControl-root': { minWidth: 320 }
          }}
        >
          <FormControl fullWidth>
            <InputLabel id="area-name">Area</InputLabel>
            <Select labelId="area-name" id="area" name="area" value={area} onChange={(e) => setArea(e.target.value)}>
              <MenuItem value="all">Both</MenuItem>
              <MenuItem value="R">Rural</MenuItem>
              <MenuItem value="U">Urban</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={2}>
          <FormControl fullWidth>
            <TextField
              id="outlined-basic"
              label={
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <span style={{ marginRight: '4px' }}>Captcha Code</span>
                  <Typography style={{ color: 'red' }}>*</Typography>
                </div>
              }
              variant="outlined"
              value={formData.captcha}
              name="captcha"
              inputProps={{ maxLength: 6 }}
              onChange={(e) => handleChange('captcha', e.target.value)}
            />
            {errors.captcha && (
              <FormHelperText error id="captcha-error">
                {errors.captcha}
              </FormHelperText>
            )}
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={2}>
          <Box display="flex" alignItems="center" mt={1}>
            <img
              src={`data:image/png;base64,${captchaImage}`}
              alt="captcha"
              style={{ marginRight: '10px', overflow: 'hidden', borderRadius: '10px' }}
            />
            <IconButton onClick={handleRefreshCaptcha} aria-label="refresh captcha">
              <RefreshIcon />
            </IconButton>
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Button variant="contained" onClick={handleSubmit} disabled={loading} sx={{ mr: 2 }}>
            Submit
          </Button>
          <Button variant="outlined" color="error" onClick={() => window.location.reload()}>
            Cancel
          </Button>
        </Grid>
      </Grid>
      {tabData && (
        <Box mt={3}>
          <Grid container spacing={2}>
            {[
              { title: 'Total Beneficiaries', value: tabData.totalBeneficiary, color: '#8DC0F0', text: 'white' },
              { title: 'Bank', value: tabData.totalBank, color: '#8DC0F0', text: 'white' },
              { title: 'Post Office', value: tabData.totalPo, color: '#8DC0F0', text: 'white' },
              { title: 'Mobile', value: tabData.totalMo, color: '#8DC0F0', text: 'white' },
              { title: 'Cash', value: tabData.totalCash, color: '#8DC0F0', text: 'white' },
              { title: 'Aadhar', value: tabData.totalAadhar, color: '#8DC0F0', text: 'white' },
              { title: 'DBT', value: tabData.totalDbt, color: '#8DC0F0', text: 'white' },
              { title: 'Female', value: tabData.totalGenderFemale, color: '#8DC0F0', text: 'white' },
              { title: 'Male', value: tabData.totalGenderMale, color: '#8DC0F0', text: 'white' },
              { title: 'Transgender', value: tabData.totalGenderTrans, color: '#8DC0F0', text: 'white' }
            ].map((item, idx) => (
              <Grid item xs={12} sm={6} md={2.4} key={idx} sx={{ flex: '1 0 20%', maxWidth: '20%' }}>
                <MainCard
                  sx={{
                    backgroundColor: item.color,
                    color: item.text,
                    textAlign: 'center',
                    fontWeight: 'bold'
                  }}
                >
                  <div style={{ fontSize: '1rem', marginBottom: '8px' }}>{item.title}</div>
                  <div style={{ fontSize: '1.5rem' }}>{item.value}</div>
                </MainCard>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {tableData && tableData.length > 0 && (
        <Box mt={4} sx={{ height: 500, width: '100%' }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h3" gutterBottom>
              {drillLevel === 'district'
                ? 'Level : District '
                : drillLevel === 'subdistrict'
                ? 'Level : Subdistrict'
                : 'Level : Grampanchayat'}
            </Typography>
            {schemeCode && (
              <Typography variant="h3" gutterBottom>
                Scheme: {schemeCode || schemeCode}
              </Typography>
            )}
            <Box display="flex" alignItems="center" gap={2}>
              {drillLevel !== 'district' && (
                <Button variant="outlined" onClick={handleGoBack}>
                  Back
                </Button>
              )}
            </Box>
          </Box>
          <DataGrid
            // rows={tableData.map((row, idx) => ({ id: idx + 1, ...row }))}
            rows={tableData.map((row, idx) => (row.isTotalRow ? { ...row, id: 'total' } : { id: idx + 1, ...row }))}
            columns={drilldownColumns}
            pageSize={10}
            rowsPerPageOptions={[10, 25, 50]}
            onCellClick={(params) => {
              if (
                (params.field === 'districtName' || params.field === 'subDistrictName' || params.field === 'gramPanchayatName') &&
                drillLevel !== 'gp'
              ) {
                handleRowClick(params);
              }
            }}
          />
        </Box>
      )}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </MainCard>
  );
};
export default StateDashboardReport;
