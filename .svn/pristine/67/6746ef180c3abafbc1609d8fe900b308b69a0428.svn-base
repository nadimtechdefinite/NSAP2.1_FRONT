import React, { useState, useEffect } from 'react';
import MainCard from 'ui-component/cards/MainCard';
import StateList from 'components/form_components/StateList';

import messages_en from 'components/common/messages_en.json';
import axiosInstance from 'hooks/useAuthTokenUrl';
import { Grid, FormControl, Button, FormHelperText, Typography, InputLabel, Select, MenuItem } from '@mui/material';
import { GlobalStyles } from '@mui/material';
import { Alert, Snackbar, CircularProgress } from '@mui/material';
import {
  GridToolbarContainer,
  DataGrid,
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
  GridToolbarDensitySelector,
  GridToolbarQuickFilter
} from '@mui/x-data-grid';
import reportcss from 'components/PFMSRegistrationSummary/reportsCSS';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import DownloadIcon from '@mui/icons-material/Download';

const SavingDetailsReport = () => {
  const [formErrors, setFormErrors] = useState({});
  const [snackbar, setSnackbar] = useState(null);
  const [loading, setLoading] = useState(false);
  const [finYear, setFinYear] = useState([]);
  const [savingData, setSavingData] = useState([]);
  const classes = reportcss();
  const [formData, setFormData] = useState({
    stateCode: '',
    schemeCode: '',
    yearCode: ''
  });
  const handleCloseSnackbar = () => setSnackbar(null);
  const handleStateChange = (stateId) => {
    setFormData({ ...formData, stateCode: stateId });
    setFormErrors((prevErrors) => {
      const updatedErrors = { ...prevErrors };
      delete updatedErrors.stateCode;
      return updatedErrors;
    });
  };
  const exportToExcel = () => {
    const headerMap = {
      srno: 'S.No',
      stateName: 'State Name',
      schemeCode: 'Scheme Code',
      finYear: 'Financial Year',
      deadCount: 'Dead Count',
      deadAmount: 'Dead Amount',
      eligibleCount: 'Eligible Count',
      eligibleAmount: 'Eligible Amount',
      ineligibleCount: 'Ineligible Count',
      ineligibleAmount: 'Ineligible Amount',
      migratedCount: 'Migrated Count',
      migratedAmount: 'Migrated Amount',
      migratedTemporaryCount: 'Temp Migrated Count',
      migratedTemporaryAmount: 'Temp Migrated Amount',
      ineligibleDuplicateCount: 'Duplicate Ineligible Count',
      ineligibleDuplicateAmount: 'Duplicate Ineligible Amount',
      ineligibleOtherCount: 'Other Ineligible Count',
      ineligibleOtherAmount: 'Other Ineligible Amount',
      stopCount: 'Stopped Count',
      stopAmount: 'Stopped Amount'
    };

    // Format the data using the readable headers
    const formattedData = savingData.map((row) => {
      const newRow = {};
      Object.entries(headerMap).forEach(([key, header]) => {
        newRow[header] = row?.[key] ?? '';
      });
      return newRow;
    });

    if (formattedData.length === 0) {
      console.warn('No data to export.');
      return;
    }

    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'SavingDetails');

    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(blob, 'saving-details-report.xlsx');
  };

  const CustomToolbar = () => (
    <GridToolbarContainer>
      <GridToolbarColumnsButton />
      <GridToolbarFilterButton />
      <GridToolbarDensitySelector />
      <Button color="primary" variant="text" startIcon={<DownloadIcon />} onClick={exportToExcel}>
        Export Excel
      </Button>
      <GridToolbarQuickFilter />
    </GridToolbarContainer>
  );

  const handleSchemeChange = (event) => {
    setFormData({ ...formData, schemeCode: event.target.value });
    setFormErrors((prevErrors) => {
      const updatedErrors = { ...prevErrors };
      delete updatedErrors.schemeCode;
      return updatedErrors;
    });
  };
  const handleFinYearChange = (event) => {
    setFormData({ ...formData, yearCode: event.target.value });
    setFormErrors((prevErrors) => {
      const updatedErrors = { ...prevErrors };
      delete updatedErrors.yearCode;
      return updatedErrors;
    });
  };

  const cancelButton = () => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      stateCode: 'ALL',
      schemeCode: 'ALL',
      yearCode: ''
    }));
    setSavingData([]);
  };
  const renderWrappedHeader = (title, subtext) => (
    <div
      style={{
        textAlign: 'center',
        whiteSpace: 'normal',
        lineHeight: 1.3,
        fontSize: '0.875rem',
        fontWeight: 500
      }}
    >
      {title}
      <br />
      <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>{subtext}</span>
    </div>
  );

  const columns = [
    {
      field: 'srno',
      headerName: 'Sr. No.',
      minWidth: 70,
      flex: 0.5,
      align: 'center', // ✅ aligns cell content
      headerAlign: 'center',
      disableColumnMenu: true,
      sortable: false
    },
    {
      field: 'stateName',
      headerName: 'State/UT',
      minWidth: 160,
      flex: 1.2,
      align: 'center', // ✅ aligns cell content
      headerAlign: 'center',
      disableColumnMenu: true,
      sortable: false
    },
    {
      field: 'deadCount',
      headerName: 'Dead',
      minWidth: 80,
      flex: 0.7,
      align: 'center',
      headerAlign: 'center',
      disableColumnMenu: true,
      sortable: false
    },
    {
      field: 'deadAmount',
      minWidth: 200,
      flex: 1,
      align: 'center',
      headerAlign: 'center',
      disableColumnMenu: true,
      sortable: false,
      renderHeader: () => renderWrappedHeader('Dead Amount', '(Rs. Monthly)')
    },
    {
      field: 'ineligibleCount',
      minWidth: 200,
      flex: 1,
      align: 'center',
      headerAlign: 'center',
      disableColumnMenu: true,
      sortable: false,
      renderHeader: () => renderWrappedHeader('Ineligible in', '(verification)')
    },
    {
      field: 'ineligibleAmount',
      minWidth: 200,
      flex: 1,
      align: 'center',
      headerAlign: 'center',
      disableColumnMenu: true,
      sortable: false,
      renderHeader: () => renderWrappedHeader('Ineligible Amount', '(Rs. Monthly)')
    },
    {
      field: 'migratedCount',
      headerName: 'Migrated',
      minWidth: 80,
      flex: 0.8,
      align: 'center',
      headerAlign: 'center',
      disableColumnMenu: true,
      sortable: false
    },
    {
      field: 'migratedAmount',
      minWidth: 200,
      flex: 1,
      align: 'center',
      headerAlign: 'center',
      disableColumnMenu: true,
      sortable: false,
      renderHeader: () => renderWrappedHeader('Migrated Amount', '(Rs. Monthly)')
    },
    {
      field: 'migratedTemporaryCount',
      headerName: 'Migrated Temporary',
      minWidth: 160,
      flex: 1,
      align: 'center',
      headerAlign: 'center',
      disableColumnMenu: true,
      sortable: false
    },
    {
      field: 'migratedTemporaryAmount',
      minWidth: 220,
      flex: 1.2,
      align: 'center',
      headerAlign: 'center',
      disableColumnMenu: true,
      sortable: false,
      renderHeader: () => renderWrappedHeader('Migrated Temporary ', ' Amount (Rs. Monthly)')
    },
    {
      field: 'ineligibleDuplicateCount',
      headerName: 'Ineligible Duplicate',
      minWidth: 160,
      flex: 1,
      align: 'center',
      headerAlign: 'center',
      disableColumnMenu: true,
      sortable: false
    },
    {
      field: 'ineligibleDuplicateAmount',
      minWidth: 220,
      flex: 1.2,
      align: 'center',
      headerAlign: 'center',
      disableColumnMenu: true,
      sortable: false,
      renderHeader: () => renderWrappedHeader('Ineligible Duplicate ', 'Amount (Rs. Monthly)')
    },
    {
      field: 'ineligibleOtherCount',
      headerName: 'APS Through PFMS',
      minWidth: 160,
      flex: 1,
      align: 'center',
      headerAlign: 'center',
      disableColumnMenu: true,
      sortable: false
    },
    {
      field: 'ineligibleOtherAmount',
      minWidth: 220,
      flex: 1.2,
      align: 'center',
      headerAlign: 'center',
      disableColumnMenu: true,
      sortable: false,
      renderHeader: () => renderWrappedHeader('APS Through PFMS ', 'Amount (Rs. Monthly)')
    },
    {
      field: 'stopCount',
      headerName: 'Stop Due To Invalid Account',
      minWidth: 200,
      flex: 1.2,
      align: 'center',
      headerAlign: 'center',
      disableColumnMenu: true,
      sortable: false
    },
    {
      field: 'stopAmount',
      minWidth: 200,
      flex: 1,
      align: 'center',
      headerAlign: 'center',
      disableColumnMenu: true,
      sortable: false,
      renderHeader: () => renderWrappedHeader('Stop Amount', '(Rs. Monthly)')
    }
  ];
  const isSingleState = formData.stateCode && formData.stateCode !== 'ALL';

  const validateForm = () => {
    const errors = {};
    // Add validation logic for each field
    if (!formData.stateCode) {
      errors.stateCode = messages_en.stateRequired;
    }

    if (!formData.schemeCode) {
      errors.schemeCode = messages_en.schemCodeRequired;
    }

    if (!formData.yearCode) {
      errors.yearCode = messages_en.yearFeildRequired;
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0; // Return true if no errors
  };

  const getFinYear = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/migrationLog/findAllFinYearData');
      // console.log(JSON.stringify(response.data));
      const newData = response.data.map((row) => ({ ...row, id: row.finYearCode }));
      setFinYear(newData);
      // console.log(JSON.stringify(response.data));
    } catch (error) {
      setSnackbar({ children: 'Some Internal Error Occured While Getting Finance Years', severity: 'error' });
      console.error('Error fetching Finance Years', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getFinYear();
  }, []);

  const fetchData = async (e) => {
    e.preventDefault();

    const isFormValid = validateForm();
    if (isFormValid) {
      setLoading(true);
      try {
        const postUrl = '/reports/savingDetails';
        const response = await axiosInstance.post(postUrl, formData);
        console.log('column names', response.Object);
        if (response.status >= 200 && response.status < 300) {
          if (response.data.length > 1) {
            return response.data;
          } else {
            setSnackbar({ children: 'No Data Found', severity: 'error' });
            return false;
          }
        } else {
          return false;
        }
      } catch (error) {
        if (error.response.data && error.response.data.message) {
          setSnackbar({ children: 'No records are found.', severity: 'error' });
        } else {
          console.log('Error  : ', error);
        }
      } finally {
        setLoading(false);
      }
    } else {
      console.log('Form not valid!');
      // Handle form not valid case, maybe show an error message
    }
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    fetchData(e)
      .then((res) => {
        if (res) {
          const data = res || [];
          //   setAllDistrict(districtData);
          const newData = data.map((row) => ({ ...row, id: row.srno }));

          setSavingData(newData);

          console.log(res);
        } else {
          setSavingData([]);
          return false;
        }
      })
      .catch((e) => {
        console.log(e.message);
      });
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
      <MainCard title="Savings Detail Summary Of States">
        <Grid container spacing={2}>
          <Grid item xs={12} sm={3}>
            <FormControl fullWidth>
              <StateList onSelectState={handleStateChange} isMandatory={true} showAllIndex={true} />

              {formErrors.stateCode && (
                <FormHelperText>
                  <Typography style={{ color: 'red', fontSize: '0.8rem' }}>{formErrors.stateCode}</Typography>
                </FormHelperText>
              )}
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={3}>
            <FormControl fullWidth>
              <InputLabel id="scheme-name">
                Scheme <span style={{ color: 'red' }}>*</span>
              </InputLabel>
              <Select
                labelId="scheme-name"
                id="schemeCode"
                //label="Scheme Name"
                name="schemeCode"
                onChange={handleSchemeChange}
              >
                <MenuItem value="ALL">ALL</MenuItem>
                <MenuItem value="IGNOAPS">IGNOAPS</MenuItem>
                <MenuItem value="IGNWPS">IGNWPS</MenuItem>
                <MenuItem value="IGNDPS">IGNDPS</MenuItem>
                <MenuItem value="NFBS">NFBS</MenuItem>
              </Select>
              {formErrors.schemeCode && (
                <FormHelperText>
                  <Typography style={{ color: 'red', fontSize: '0.8rem' }}>{formErrors.schemeCode}</Typography>
                </FormHelperText>
              )}
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={3}>
            <FormControl fullWidth>
              <InputLabel id="finYear-label" style={{ display: 'flex', alignItems: 'center' }}>
                Financial Year <span style={{ color: 'red' }}> *</span>
              </InputLabel>
              <Select
                name="finYear"
                id="finYear"
                labelId="finYear-label"
                label="Financial Year"
                onChange={handleFinYearChange}
                MenuProps={{ PaperProps: { style: { maxHeight: 200 } } }}
              >
                {/* <MenuItem value="0">--Select Financial Year--</MenuItem> */}
                {finYear.map((item) => (
                  <MenuItem key={item.finyearcode} value={item.finyear}>
                    {item.finyear}
                  </MenuItem>
                ))}
              </Select>
              {formErrors.yearCode && (
                <FormHelperText>
                  <Typography style={{ color: 'red', fontSize: '0.8rem' }}>{formErrors.yearCode}</Typography>
                </FormHelperText>
              )}
            </FormControl>
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
      {savingData.length > 0 && (
        <MainCard title="Saving Details Report">
          {/* <Stack sx={{ width: '100%' }} spacing={2}>
                    <Alert1 variant="filled" severity="warning" style={{ color: 'red' }}>Note: This report includes <b style={{ color: 'blue' }}>SO_SAVED and DONE</b> beneficiary data only.</Alert1>
                </Stack> */}

          <div style={{ width: '100%', marginTop: '20px' }} className={classes.root}>
            <GlobalStyles
              styles={{
                '.MuiDataGrid-virtualScroller::-webkit-scrollbar': {
                  width: '8px',
                  height: '8px'
                },
                '.MuiDataGrid-virtualScroller::-webkit-scrollbar-thumb': {
                  backgroundColor: '#1976d2',
                  borderRadius: '4px'
                },
                '.MuiDataGrid-virtualScroller::-webkit-scrollbar-track': {
                  backgroundColor: '#f0f0f0'
                },
                '.MuiDataGrid-virtualScroller': {
                  scrollbarColor: '#1976d2 #f0f0f0',
                  scrollbarWidth: 'thin'
                }
              }}
            />
            <DataGrid
              rows={savingData}
              columns={columns}
              slots={{ toolbar: CustomToolbar }}
              slotProps={{ toolbar: { showQuickFilter: true } }}
              stickyFooter
              hideFooterPagination
              disableRowSelectionOnClick
              density="compact"
              sx={{
                maxHeight: 600,
                minHeight: 'auto',
                ...(isSingleState && {
                  '& .MuiDataGrid-virtualScroller': {
                    paddingBottom: '50px' // ✅ extra space only for single state
                  }
                })
              }}
            />
          </div>
        </MainCard>
      )}
      {!!snackbar && (
        <Snackbar open anchorOrigin={{ vertical: 'top', horizontal: 'center' }} onClose={handleCloseSnackbar} autoHideDuration={8000}>
          <Alert {...snackbar} onClose={handleCloseSnackbar} />
        </Snackbar>
      )}
    </div>
  );
};
export default SavingDetailsReport;
