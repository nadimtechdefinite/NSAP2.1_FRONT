import React, { useState, useEffect } from 'react';
import MainCard from 'ui-component/cards/MainCard';
import StateList from 'components/form_components/StateList';
import axiosInstance from 'hooks/useAuthTokenUrl';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import DownloadIcon from '@mui/icons-material/Download';
import {
  Grid,
  FormControl,
  Button,
  Paper,
  FormHelperText,
  Typography,
  InputLabel,
  Select,
  MenuItem,
  Snackbar,
  Alert,
  CircularProgress
} from '@mui/material';
import { DataGrid, GridToolbarContainer, GridToolbarQuickFilter } from '@mui/x-data-grid';
import reportcss from 'components/PFMSRegistrationSummary/reportsCSS';

const PensionerDLCReport = () => {
  const [formData, setFormData] = useState({
    stateCode: '',
    finyear: '',
    area: ''
  });
  const [userLevel, setUserLevel] = useState('');
  const [formErrors] = useState({});
  const [selectedStateFromDropdown, setSelectedStateFromDropdown] = useState(false);

  const [finYear, setFinYear] = useState([]);
  const [reportData, setReportData] = useState([]);
  const [summaryData, setSummaryData] = useState(null);
  const [dropdownResetKey, setDropdownResetKey] = useState(0);
  const [showSummary, setShowSummary] = useState(true);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState(null);
  const [userRole] = useState('admin');
  const [drillLevel, setDrillLevel] = useState('state');
  const [selectedScheme, setSelectedScheme] = useState(null);

  const [filters, setFilters] = useState({
    stateCode: '' || null,
    districtCode: '' || null,
    subDistrictCode: '' || null,
    finyear: '',
    schemeCode: null
  });
  console.log('Go Back button clicked', drillLevel);

  const classes = reportcss();

  const handleCloseSnackbar = () => setSnackbar(null);
  useEffect(() => {
    const user = JSON.parse(sessionStorage.getItem('userinfo'));
    console.log('Fetched user from session:', user);

    if (user) {
      const level = String(user.userLevel); // Always treat it as a string
      setUserLevel(level);

      if (level === '2') {
        setFormData((prev) => ({
          ...prev,
          stateCode: user.stateCode || ''
        }));
      }
    }
  }, []);

  useEffect(() => {
    fetchStatewiseSummary();
  }, [userLevel]);

  useEffect(() => {
    (async () => {
      try {
        const res = await axiosInstance.get('/migrationLog/findAllFinYearData');
        setFinYear(res.data);
      } catch (error) {
        console.error(error);
      }
    })();
  }, []);

  const fetchStatewiseSummary = async (filters = {}) => {
    try {
      const res = await axiosInstance.get('/reports/pensionerDlcReport/pensionerDlcSummary', {
        params: {
          stateCode: filters.stateCode || null,
          financialYear: filters.finyear || null,
          area: filters.area || null
        }
      });
      setSummaryData(res.data);
      setReportData(false);
    } catch (error) {
      console.error('Error fetching summary', error);
    }
  };

  const fetchReportData = async (schemeCode = null) => {
    const user = JSON.parse(sessionStorage.getItem('userinfo'));

    if (userLevel !== '1' && (!formData.finyear || !formData.area || !formData.stateCode)) {
      setSnackbar({
        children: 'Please select State, Financial Year, and Area before viewing details.',
        severity: 'warning'
      });
      return;
    }

    console.log('userlevel', user.userLevel);
    setLoading(true);
    try {
      const normalizedPayload = {
        stateCode: formData.stateCode || null,
        finyear: formData.finyear || null,
        area: formData.area || null,
        schemeCode: schemeCode || null
      };

      setFilters({
        ...normalizedPayload,
        districtCode: null,
        subDistrictCode: null
      });

      const res = await axiosInstance.post('/reports/pensionerDlcReport/pensionerDlcDetails', normalizedPayload);
      setSelectedScheme(schemeCode);
      if (res.data && res.data.length > 0) {
        setReportData(res.data.map((item, index) => ({ ...item, id: index + 1 })));
        setShowSummary(false);
      } else {
        setSnackbar({ children: 'No Data Found', severity: 'info' });
        setReportData([]);
      }
    } catch (error) {
      setSnackbar({ children: 'Error fetching data', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const fetchDrilldownData = async (overrideFilters = filters) => {
    const { stateCode, districtCode, subDistrictCode, finyear, area, schemeCode } = overrideFilters;

    const formattedYear = finyear?.match(/\d{4}-\d{2}/) ? `${finyear.substring(0, 4)}-20${finyear.substring(5)}` : finyear;

    try {
      const res = await axiosInstance.post('/reports/pensionerDlcReport/pensionerDlcDrilldown', {
        stateCode,
        districtCode,
        subDistrictCode,
        finyear: formattedYear,
        area,
        schemeCode
      });

      setReportData(res.data.map((row, i) => ({ ...row, id: i + 1 })));
    } catch (error) {
      console.error('Drilldown fetch failed', error);
    }
  };

  const handleSubmit = () => {
    fetchStatewiseSummary(formData);
  };

  const handleCancel = () => {
    setFormData({
      stateCode: '',
      finyear: '',
      area: ''
    });
    setDropdownResetKey((prev) => prev + 1);
    setShowSummary(true);
    setReportData([]);
    setDrillLevel('state');
    setSelectedScheme(null);

    fetchStatewiseSummary();
  };

  const handleRowClick = ({ row }) => {
    //  console.log('handleRowClick called', drillLevel, row);

    if (drillLevel === 'state') {
      if (!row.stateCode) return;

      const updatedFilters = {
        ...filters,
        finyear: formData.finyear || null,
        area: formData.area || null,
        stateCode: row.stateCode
      };

      setFilters(updatedFilters);
      setDrillLevel('district');
      setShowSummary(false);
      fetchDrilldownData(updatedFilters);
    } else if (drillLevel === 'district') {
      if (!row.districtCode) return;
      setFilters((prev) => ({ ...prev, districtCode: row.districtCode }));
      setDrillLevel('Subdistrict');
    } else if (drillLevel === 'Subdistrict') {
      if (!row.subDistrictCode) return;

      const updatedFilters = {
        ...filters,
        subDistrictCode: row.subDistrictCode
      };

      setFilters(updatedFilters);
      setDrillLevel('gp');
      setShowSummary(false);
      fetchDrilldownData(updatedFilters);
    }
  };

  useEffect(() => {
    if (drillLevel === 'district' && filters.stateCode) {
      fetchDrilldownData(filters);
    } else if (drillLevel === 'Subdistrict' && filters.districtCode) {
      fetchDrilldownData(filters);
    } else if (drillLevel === 'gp' && filters.subDistrictCode) {
      fetchDrilldownData(filters);
    }
  }, [drillLevel, filters]);

  const handleGoBack = async () => {
    //const { finyear, area } = filters;

    if (drillLevel === 'gp') {
      const updatedFilters = {
        ...filters,
        subDistrictCode: null
      };

      setFilters(updatedFilters);
      setDrillLevel('Subdistrict');
      fetchDrilldownData(updatedFilters);
      return;
    }

    if (drillLevel === 'Subdistrict') {
      const updatedFilters = {
        ...filters,
        districtCode: null,
        subDistrictCode: null
      };

      setFilters(updatedFilters);
      setDrillLevel('district');
      fetchDrilldownData(updatedFilters);
      return;
    }

    // Go from Block or District → State
    if (drillLevel === 'district') {
      const isStateUser = userRole === 'state';

      const { finyear, area } = filters;

      const formattedYear = finyear?.match(/\d{4}-\d{2}/) ? `${finyear.substring(0, 4)}-20${finyear.substring(5)}` : finyear;

      let finalStateCode;

      if (isStateUser) {
        finalStateCode = loggedInStateCode;
      } else if (selectedStateFromDropdown) {
        finalStateCode = filters.stateCode;
      } else {
        finalStateCode = null;
      }

      try {
        const res = await axiosInstance.post('/reports/pensionerDlcReport/pensionerDlcDetails', {
          stateCode: finalStateCode,
          finyear: formattedYear || null,
          area: area || null,
          schemeCode: null
        });

        setReportData(res.data.map((row, i) => ({ ...row, id: i + 1 })));
        setDrillLevel('state');

        setFilters((prev) => ({
          ...prev,
          stateCode: finalStateCode ?? '',
          districtCode: '',
          subDistrictCode: ''
        }));

        if (!finalStateCode) {
          setSelectedStateFromDropdown(false);
        }
      } catch (err) {
        console.error('Go back fetch failed', err);
      }
    }
  };

  const exportToExcel = () => {
    if (reportData.length === 0) {
      setSnackbar({ children: 'No data to export', severity: 'warning' });
      return;
    }
    const worksheet = XLSX.utils.json_to_sheet(reportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'PensionerDLCReport');
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(blob, 'Pensioner-DLC-Report.xlsx');
  };

  const handleDownloadBeneficiaryCSV = async (statusKey, row) => {
    try {
      const payload = {
        stateCode: filters.stateCode || row?.stateCode || null,
        districtCode: filters.districtCode || row?.districtCode || null,
        subDistrictCode: filters.subDistrictCode || null,
        gpCode: filters.gpCode || null,
        area: filters.area || formData.area || null,
        schemeCode: filters.schemeCode || null,
        finyear: filters.finyear || formData.finyear || null,
        type: statusKey.toLowerCase() // very important!
      };

      const res = await axiosInstance.post('/reports/pensionerDlcReport/beneficiaryListDownload', payload, {
        responseType: 'blob'
      });

      const blob = new Blob([res.data], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${statusKey}_Beneficiaries.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    } catch (error) {
      setSnackbar({ children: 'Failed to download CSV', severity: 'error' });
      console.error('CSV download error:', error);
    }
  };

  const getColumnsByLevel = () => {
    if (drillLevel === 'state') {
      return [
        { field: 'sno', headerName: 'S.No', width: 80 },
        {
          field: 'stateName',
          headerName: 'State Name',
          flex: 1,
          renderCell: (params) => (
            <button
              style={{
                color: '#1976d2',
                background: 'none',
                border: 'none',
                padding: 0,
                margin: 0,
                textDecoration: 'underline',
                cursor: 'pointer',
                font: 'inherit'
              }}
              onClick={() => handleRowClick({ row: params.row })}
            >
              {params.value}
            </button>
          )
        },

        { field: 'totalActive', headerName: 'Total Pensioners', flex: 1 },
        {
          field: 'totalRegistered',
          headerName: 'Total Registered',
          flex: 1,
          renderCell: (params) =>
            params.value > 0 ? (
              <button
                style={{
                  color: '#1976d2',
                  background: 'none',
                  border: 'none',
                  padding: 0,
                  margin: 0,
                  textDecoration: 'underline',
                  cursor: 'pointer',
                  font: 'inherit'
                }}
                onClick={() => handleDownloadBeneficiaryCSV('registered', params.row)}
              >
                {params.value}
              </button>
            ) : (
              <Typography>{params.value || '0'}</Typography>
            )
        },
        {
          field: 'totalRegisteredYesterday',
          headerName: 'Registered Yesterday',
          flex: 1,
          renderCell: (params) =>
            params.value > 0 ? (
              <button
                style={{
                  color: '#1976d2',
                  background: 'none',
                  border: 'none',
                  padding: 0,
                  margin: 0,
                  textDecoration: 'underline',
                  cursor: 'pointer',
                  font: 'inherit'
                }}
                onClick={() => handleDownloadBeneficiaryCSV('yesterday', params.row)}
              >
                {params.value}
              </button>
            ) : (
              <Typography>{params.value || '0'}</Typography>
            )
        },
        {
          field: 'expireddlc',
          headerName: 'Expired DLC',
          flex: 1,
          renderCell: (params) =>
            params.value > 0 ? (
              <button
                style={{
                  color: '#1976d2',
                  background: 'none',
                  border: 'none',
                  padding: 0,
                  margin: 0,
                  textDecoration: 'underline',
                  cursor: 'pointer',
                  font: 'inherit'
                }}
                onClick={() => handleDownloadBeneficiaryCSV('expired', params.row)}
              >
                {params.value}
              </button>
            ) : (
              <Typography>{params.value || '0'}</Typography>
            )
        },
        {
          field: 'notregister',
          headerName: 'Not Registered',
          flex: 1,
          renderCell: (params) =>
            params.value > 0 ? (
              <button
                style={{
                  color: '#1976d2',
                  background: 'none',
                  border: 'none',
                  padding: 0,
                  margin: 0,
                  textDecoration: 'underline',
                  cursor: 'pointer',
                  font: 'inherit'
                }}
                onClick={() => handleDownloadBeneficiaryCSV('notregistered', params.row)}
              >
                {params.value}
              </button>
            ) : (
              <Typography>{params.value || '0'}</Typography>
            )
        }
      ];
    } else if (drillLevel === 'district') {
      return [
        { field: 'sno', headerName: 'S.No', width: 80 },
        {
          field: 'districtName',
          headerName: 'District Name',
          flex: 1,
          renderCell: (params) => (
            <button
              style={{
                color: '#1976d2',
                background: 'none',
                border: 'none',
                padding: 0,
                margin: 0,
                textDecoration: 'underline',
                cursor: 'pointer',
                font: 'inherit'
              }}
              onClick={() => handleRowClick({ row: params.row })}
            >
              {params.value}
            </button>
          )
        },
        { field: 'totalActive', headerName: 'Total Pensioners', flex: 1 },
        {
          field: 'totalRegistered',
          headerName: 'Total Registered',
          flex: 1,
          renderCell: (params) =>
            params.value > 0 ? (
              <button
                style={{
                  color: '#1976d2',
                  background: 'none',
                  border: 'none',
                  padding: 0,
                  margin: 0,
                  textDecoration: 'underline',
                  cursor: 'pointer',
                  font: 'inherit'
                }}
                onClick={() => handleDownloadBeneficiaryCSV('registered', params.row)}
              >
                {params.value}
              </button>
            ) : (
              <Typography>{params.value || '0'}</Typography>
            )
        },
        {
          field: 'totalRegisteredYesterday',
          headerName: 'Registered Yesterday',
          flex: 1,
          renderCell: (params) =>
            params.value > 0 ? (
              <button
                style={{
                  color: '#1976d2',
                  background: 'none',
                  border: 'none',
                  padding: 0,
                  margin: 0,
                  textDecoration: 'underline',
                  cursor: 'pointer',
                  font: 'inherit'
                }}
                onClick={() => handleDownloadBeneficiaryCSV('yesterday', params.row)}
              >
                {params.value}
              </button>
            ) : (
              <Typography>{params.value || '0'}</Typography>
            )
        },
        {
          field: 'expireddlc',
          headerName: 'Expired DLC',
          flex: 1,
          renderCell: (params) =>
            params.value > 0 ? (
              <button
                style={{
                  color: '#1976d2',
                  background: 'none',
                  border: 'none',
                  padding: 0,
                  margin: 0,
                  textDecoration: 'underline',
                  cursor: 'pointer',
                  font: 'inherit'
                }}
                onClick={() => handleDownloadBeneficiaryCSV('expired', params.row)}
              >
                {params.value}
              </button>
            ) : (
              <Typography>{params.value || '0'}</Typography>
            )
        },
        {
          field: 'notregister',
          headerName: 'Not Registered',
          flex: 1,
          renderCell: (params) =>
            params.value > 0 ? (
              <button
                style={{
                  color: '#1976d2',
                  background: 'none',
                  border: 'none',
                  padding: 0,
                  margin: 0,
                  textDecoration: 'underline',
                  cursor: 'pointer',
                  font: 'inherit'
                }}
                onClick={() => handleDownloadBeneficiaryCSV('notregistered', params.row)}
              >
                {params.value}
              </button>
            ) : (
              <Typography>{params.value || '0'}</Typography>
            )
        }
      ];
    } else if (drillLevel === 'Subdistrict') {
      return [
        { field: 'sno', headerName: 'S.No', width: 80 },
        {
          field: 'subDistrictName',
          headerName: 'Sub District',
          flex: 1,
          renderCell: (params) => (
            <button
              style={{
                color: '#1976d2',
                background: 'none',
                border: 'none',
                padding: 0,
                margin: 0,
                textDecoration: 'underline',
                cursor: 'pointer',
                font: 'inherit'
              }}
              onClick={() => handleRowClick({ row: params.row })}
            >
              {params.value}
            </button>
          )
        },
        { field: 'totalActive', headerName: 'Total Pensioners', flex: 1 },
        {
          field: 'totalRegistered',
          headerName: 'Total Registered',
          flex: 1,
          renderCell: (params) =>
            params.value > 0 ? (
              <button
                style={{
                  color: '#1976d2',
                  background: 'none',
                  border: 'none',
                  padding: 0,
                  margin: 0,
                  textDecoration: 'underline',
                  cursor: 'pointer',
                  font: 'inherit'
                }}
                onClick={() => handleDownloadBeneficiaryCSV('registered', params.row)}
              >
                {params.value}
              </button>
            ) : (
              <Typography>{params.value || '0'}</Typography>
            )
        },
        {
          field: 'totalRegisteredYesterday',
          headerName: 'Registered Yesterday',
          flex: 1,
          renderCell: (params) =>
            params.value > 0 ? (
              <button
                style={{
                  color: '#1976d2',
                  background: 'none',
                  border: 'none',
                  padding: 0,
                  margin: 0,
                  textDecoration: 'underline',
                  cursor: 'pointer',
                  font: 'inherit'
                }}
                onClick={() => handleDownloadBeneficiaryCSV('yesterday', params.row)}
              >
                {params.value}
              </button>
            ) : (
              <Typography>{params.value || '0'}</Typography>
            )
        },
        {
          field: 'expireddlc',
          headerName: 'Expired DLC',
          flex: 1,
          renderCell: (params) =>
            params.value > 0 ? (
              <button
                style={{
                  color: '#1976d2',
                  background: 'none',
                  border: 'none',
                  padding: 0,
                  margin: 0,
                  textDecoration: 'underline',
                  cursor: 'pointer',
                  font: 'inherit'
                }}
                onClick={() => handleDownloadBeneficiaryCSV('expired', params.row)}
              >
                {params.value}
              </button>
            ) : (
              <Typography>{params.value || '0'}</Typography>
            )
        },
        {
          field: 'notregister',
          headerName: 'Not Registered',
          flex: 1,
          renderCell: (params) =>
            params.value > 0 ? (
              <button
                style={{
                  color: '#1976d2',
                  background: 'none',
                  border: 'none',
                  padding: 0,
                  margin: 0,
                  textDecoration: 'underline',
                  cursor: 'pointer',
                  font: 'inherit'
                }}
                onClick={() => handleDownloadBeneficiaryCSV('notregistered', params.row)}
              >
                {params.value}
              </button>
            ) : (
              <Typography>{params.value || '0'}</Typography>
            )
        }
      ];
    } else {
      return [
        { field: 'sno', headerName: 'S.No', width: 80 },
        {
          field: 'gramPanchayatName',
          headerName: 'GP Name',
          flex: 1,
          renderCell: (params) => (
            <button
              style={{
                color: '#1976d2',
                background: 'none',
                border: 'none',
                padding: 0,
                margin: 0,
                textDecoration: 'underline',
                cursor: 'pointer',
                font: 'inherit'
              }}
              onClick={() => handleRowClick({ row: params.row })}
            >
              {params.value}
            </button>
          )
        },
        { field: 'totalActive', headerName: 'Total Pensioners', flex: 1 },
        {
          field: 'totalRegistered',
          headerName: 'Total Registered',
          flex: 1,
          renderCell: (params) =>
            params.value > 0 ? (
              <button
                style={{
                  color: '#1976d2',
                  background: 'none',
                  border: 'none',
                  padding: 0,
                  margin: 0,
                  textDecoration: 'underline',
                  cursor: 'pointer',
                  font: 'inherit'
                }}
                onClick={() => handleDownloadBeneficiaryCSV('registered', params.row)}
              >
                {params.value}
              </button>
            ) : (
              <Typography>{params.value || '0'}</Typography>
            )
        },
        {
          field: 'totalRegisteredYesterday',
          headerName: 'Registered Yesterday',
          flex: 1,
          renderCell: (params) =>
            params.value > 0 ? (
              <button
                style={{
                  color: '#1976d2',
                  background: 'none',
                  border: 'none',
                  padding: 0,
                  margin: 0,
                  textDecoration: 'underline',
                  cursor: 'pointer',
                  font: 'inherit'
                }}
                onClick={() => handleDownloadBeneficiaryCSV('yesterday', params.row)}
              >
                {params.value}
              </button>
            ) : (
              <Typography>{params.value || '0'}</Typography>
            )
        },
        {
          field: 'expireddlc',
          headerName: 'Expired DLC',
          flex: 1,
          renderCell: (params) =>
            params.value > 0 ? (
              <button
                style={{
                  color: '#1976d2',
                  background: 'none',
                  border: 'none',
                  padding: 0,
                  margin: 0,
                  textDecoration: 'underline',
                  cursor: 'pointer',
                  font: 'inherit'
                }}
                onClick={() => handleDownloadBeneficiaryCSV('expired', params.row)}
              >
                {params.value}
              </button>
            ) : (
              <Typography>{params.value || '0'}</Typography>
            )
        },
        {
          field: 'notregister',
          headerName: 'Not Registered',
          flex: 1,
          renderCell: (params) =>
            params.value > 0 ? (
              <button
                style={{
                  color: '#1976d2',
                  background: 'none',
                  border: 'none',
                  padding: 0,
                  margin: 0,
                  textDecoration: 'underline',
                  cursor: 'pointer',
                  font: 'inherit'
                }}
                onClick={() => handleDownloadBeneficiaryCSV('notregistered', params.row)}
              >
                {params.value}
              </button>
            ) : (
              <Typography>{params.value || '0'}</Typography>
            )
        }
      ];
    }
  };

  const CustomToolbar = () => (
    <GridToolbarContainer>
      <Button startIcon={<DownloadIcon />} onClick={exportToExcel} color="primary" variant="outlined">
        Export Excel
      </Button>
      <GridToolbarQuickFilter />
    </GridToolbarContainer>
  );

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
            backgroundColor: 'rgba(0,0,0,0.5)',
            zIndex: 9999,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <CircularProgress />
        </div>
      )}

      <MainCard title="Pensioner DLC Report">
        <Grid container spacing={2}>
          <Grid item xs={12} sm={3}>
            <FormControl fullWidth>
              <StateList
                key={dropdownResetKey}
                value={formData.stateCode}
                onSelectState={(stateCode) => {
                  setFormData({ ...formData, stateCode });
                  setSelectedStateFromDropdown(true);
                }}
                isMandatory
                //  showAllIndex
              />
              {formErrors.stateCode && (
                <FormHelperText>
                  <Typography color="error" fontSize="0.8rem">
                    {formErrors.stateCode}
                  </Typography>
                </FormHelperText>
              )}
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={3}>
            <FormControl fullWidth>
              <InputLabel>Financial Year *</InputLabel>
              <Select value={formData.finyear} onChange={(e) => setFormData({ ...formData, finyear: e.target.value })}>
                {finYear.map((item) => (
                  <MenuItem key={item.finyear} value={item.finyear}>
                    {item.finyear}
                  </MenuItem>
                ))}
              </Select>
              {formErrors.finyear && (
                <FormHelperText>
                  <Typography color="error" fontSize="0.8rem">
                    {formErrors.finyear}
                  </Typography>
                </FormHelperText>
              )}
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={3}>
            <FormControl fullWidth>
              <InputLabel>Area *</InputLabel>
              <Select value={formData.area} onChange={(e) => setFormData({ ...formData, area: e.target.value })}>
                {/* <MenuItem value="null">Both</MenuItem> */}
                <MenuItem value="R">RURAL</MenuItem>
                <MenuItem value="U">URBAN</MenuItem>
              </Select>
              {formErrors.area && (
                <FormHelperText>
                  <Typography color="error" fontSize="0.8rem">
                    {formErrors.area}
                  </Typography>
                </FormHelperText>
              )}
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <Button variant="contained" color="primary" onClick={handleSubmit}>
              Submit
            </Button>{' '}
            <Button variant="outlined" color="error" onClick={handleCancel}>
              Cancel
            </Button>
          </Grid>
        </Grid>
      </MainCard>

      {summaryData && showSummary && (
        <Grid container spacing={2} sx={{ mt: 2 }}>
          {/* Row 1: Two cards (50% width each) */}
          <Grid item xs={12} sm={6} md={6}>
            <Paper
              elevation={3}
              sx={{
                height: '150px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                bgcolor: '#5193DB',
                textAlign: 'center'
              }}
            >
              <Typography variant="subtitle1">Total Registered</Typography>
              <Typography variant="h5">{summaryData.totalRegistered?.toLocaleString() ?? 0}</Typography>
              <Button
                variant="contained"
                size="small"
                color="primary"
                onClick={() => fetchReportData(null)}
                sx={{
                  width: '100px',
                  fontSize: '0.8rem',
                  alignSelf: 'center',
                  mt: 1
                }}
              >
                View Details
              </Button>
            </Paper>
          </Grid>

          <Grid item xs={12} sm={6} md={6}>
            <Paper
              elevation={3}
              sx={{
                height: '150px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                bgcolor: '#5193DB',
                textAlign: 'center'
              }}
            >
              <Typography variant="subtitle1">Registered Yesterday</Typography>
              <Typography variant="h5">{summaryData.totalRegisteredYesterday?.toLocaleString() ?? 0}</Typography>
              <Button
                variant="contained"
                size="small"
                color="primary"
                onClick={() => fetchReportData(null)}
                sx={{
                  width: '100px',
                  fontSize: '0.8rem',
                  alignSelf: 'center', // to center within Paper
                  mt: 1 // small margin-top spacing
                }}
              >
                View Details
              </Button>
            </Paper>
          </Grid>

          {/* Row 2: Three cards (33.33% width each) */}
          <Grid item xs={12} sm={4} md={4}>
            <Paper
              elevation={3}
              sx={{
                height: '150px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                bgcolor: '#74A8E3',
                textAlign: 'center'
              }}
            >
              <Typography variant="subtitle1">IGNOAPS</Typography>
              <Typography variant="h5">{summaryData.totalRegisteredIGNOAPS?.toLocaleString() ?? 0}</Typography>
              <Button
                variant="contained"
                size="small"
                color="primary"
                onClick={() => fetchReportData('IGNOAPS')}
                sx={{
                  width: '100px',
                  fontSize: '0.8rem',
                  alignSelf: 'center', // to center within Paper
                  mt: 1 // small margin-top spacing
                }}
              >
                View Details
              </Button>
            </Paper>
          </Grid>

          <Grid item xs={12} sm={4} md={4}>
            <Paper
              elevation={3}
              sx={{
                height: '150px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                bgcolor: '#97B7DE',
                textAlign: 'center'
              }}
            >
              <Typography variant="subtitle1">IGNWPS</Typography>
              <Typography variant="h5">{summaryData.totalRegisteredIGNWPS?.toLocaleString() ?? 0}</Typography>
              <Button
                variant="contained"
                size="small"
                color="primary"
                onClick={() => fetchReportData('IGNWPS')}
                sx={{
                  width: '100px',
                  fontSize: '0.8rem',
                  alignSelf: 'center', // to center within Paper
                  mt: 1 // small margin-top spacing
                }}
              >
                View Details
              </Button>
            </Paper>
          </Grid>

          <Grid item xs={12} sm={4} md={4}>
            <Paper
              elevation={3}
              sx={{
                height: '150px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                bgcolor: '#AFC6E3',
                textAlign: 'center'
              }}
            >
              <Typography variant="subtitle1">IGNDPS</Typography>
              <Typography variant="h5">{summaryData.totalRegisteredIGNDPS?.toLocaleString() ?? 0}</Typography>
              <Button
                variant="contained"
                size="small"
                color="primary"
                onClick={() => fetchReportData('IGNDPS')}
                sx={{
                  width: '100px',
                  fontSize: '0.8rem',
                  alignSelf: 'center',
                  mt: 1
                }}
              >
                View Details
              </Button>
            </Paper>
          </Grid>
        </Grid>
      )}
      {drillLevel !== 'state' && (
        <Button variant="outlined" color="secondary" onClick={handleGoBack} sx={{ mb: 2 }}>
          Go Back
        </Button>
      )}

      {reportData.length > 0 && (
        <MainCard title="DLC Report Result">
          {selectedScheme && (
            <Typography variant="h4" sx={{ mt: 2 }}>
              Scheme: <strong>{selectedScheme}</strong>
            </Typography>
          )}
          <div className={classes.root} style={{ marginTop: 16 }}>
            <DataGrid
              rows={reportData}
              columns={getColumnsByLevel()}
              slots={{ toolbar: CustomToolbar }}
              autoHeight
              disableRowSelectionOnClick
              density="compact"
            />
          </div>
        </MainCard>
      )}

      {!!snackbar && (
        <Snackbar open anchorOrigin={{ vertical: 'top', horizontal: 'center' }} autoHideDuration={6000} onClose={handleCloseSnackbar}>
          <Alert {...snackbar} onClose={handleCloseSnackbar} />
        </Snackbar>
      )}
    </div>
  );
};

export default PensionerDLCReport;
