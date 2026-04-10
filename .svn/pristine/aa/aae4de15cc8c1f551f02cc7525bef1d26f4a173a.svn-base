import React, { useState, useEffect } from 'react';
import MainCard from 'ui-component/cards/MainCard';
import StateList from 'components/form_components/StateList';
import messages_en from 'components/common/messages_en.json';
import axiosInstance from 'hooks/useAuthTokenUrl';
import { Alert, Snackbar, CircularProgress } from '@mui/material';
import {
  Grid,
  FormControl,
  FormHelperText,
  Typography,
  Button,
  Checkbox,
  FormControlLabel,
  InputLabel,
  Select,
  MenuItem,
  Divider,
  Link
} from '@mui/material';
import DistrictList from 'components/form_components/DistrictList';
import { DataGrid } from '@mui/x-data-grid';
import reportcss from 'components/PFMSRegistrationSummary/reportsCSS';
import DownloadIcon from '@mui/icons-material/Download';

const DownloadBeneficiaryData = () => {
  const [formErrors, setFormErrors] = useState({});
  const [snackbar, setSnackbar] = useState(null);
  const [loading, setLoading] = useState(false);
  // const [selectedDistrictId, setSelectedDistrict] = useState(null);
  const [benCount, setBenCount] = useState([]);
  const classes = reportcss();

  const [formData, setFormData] = useState({
    stateCode: '',
    districtCode: '',
    schemeCode: '',
    monthCode: '',
    yearCode: '',
    applicantName: false,
    address: false,
    dateOfBirth: false,
    gender: false,
    aadhaarNo: false,
    fatherName: false,
    categoryCode: [],
    bankPostOfficeAccountNo: false,
    ifscCode: false,
    pfmsRegistrationId: false,
    disbursementMode: false,
    mobile: false,
    amount: false
  });
  useEffect(() => {
    // getFinYear();
  }, [formData]);
  const checkboxes = [
    'applicantName',
    'address',
    'dateOfBirth',
    'gender',
    'fatherName',
    'aadhaarNo',
    'bankPostOfficeAccountNo',
    'ifscCode',
    'pfmsRegistrationId',
    'disbursementMode',
    'mobile',
    'amount'
  ];
  const columns = [
    {
      field: 'sNo',
      headerName: 'S. No.',
      flex: 1,
      editable: false,
      disableColumnMenu: true,
      sortable: false
    },
    {
      field: 'fileName',
      headerName: 'File Name',
      flex: 5,
      editable: false,
      disableColumnMenu: true,
      sortable: false
    },
    {
      field: '',
      // headerName: 'Action',
      headerName: (
        <div>
          Action <DownloadIcon fontSize="small" style={{ marginBottom: '-4px', color: 'blue' }} />
        </div>
      ),
      flex: 5,
      editable: false,
      disableColumnMenu: true,
      sortable: false,
      renderCell: (params) =>
        params.row.fileType === 'excel' ? (
          <Link
            color="#1e88e5"
            style={{ cursor: 'pointer', textDecoration: 'none' }}
            title="Download"
            onClick={(e) => downloadData(e, params, 'excel')}
          >
            DownLoad Excel File
          </Link>
        ) : (
          <Link
            color="#1e88e5"
            style={{ cursor: 'pointer', textDecoration: 'none' }}
            title="Download"
            onClick={(e) => downloadData(e, params, 'csv')}
          >
            DownLoad CSV File
          </Link>
        )
    }
  ].filter(Boolean);
  const rows = benCount.map((item, index) => ({
    sNo: index + 1,
    id: item.fileName,
    fileName: item.fileName,
    fileType: item.fileType,
    stateCode: item.stateCode,
    districtCode: item.districtCode,
    schemeCode: item.schemeCode,
    applicantName: item.applicantName,
    address: item.address,
    dateOfBirth: item.dateOfBirth,
    gender: item.gender,
    aadhaarNo: item.aadhaarNo,
    fatherName: item.fatherName,
    categoryCode: item.categoryCode,
    bankPostOfficeAccountNo: item.bankPostOfficeAccountNo,
    ifscCode: item.ifscCode,
    pfmsRegistrationId: item.pfmsRegistrationId,
    disbursementMode: item.disbursementMode,
    mobile: item.mobile,
    amount: item.amount
  }));
  const downloadData = async (e, params, type) => {
    const filteredCategoryCodes = formData.categoryCode.filter((code) => code !== 'All');
    e.preventDefault();
    const body = {
      stateCode: params.row.stateCode,
      districtCode: params.row.districtCode,
      schemeCode: params.row.schemeCode,
      applicantName: params.row.applicantName,
      address: params.row.address,
      dateOfBirth: params.row.dateOfBirth,
      gender: params.row.gender,
      aadhaarNo: params.row.aadhaarNo,
      fatherName: params.row.fatherName,
      categoryCode: filteredCategoryCodes,
      bankPostOfficeAccountNo: params.row.bankPostOfficeAccountNo,
      ifscCode: params.row.ifscCode,
      pfmsRegistrationId: params.row.pfmsRegistrationId,
      disbursementMode: params.row.disbursementMode,
      mobile: params.row.mobile,
      amount: params.row.amount,
      fileType: params.row.fileType,
      fileName: params.row.fileName
    };
    try {
      setLoading(true);
      const postUrl = `/reports/downloadFileData/${type}`;
      const response = await axiosInstance.post(postUrl, body, {
        responseType: 'blob' // specify responseType as 'blob' for binary data
      });

      if (response.status == 204) {
        // alert("No Data Available");
        setSnackbar({ children: 'No Data Available', severity: 'error' });
        return false;
      }

      const blob = new Blob([response.data], { type: 'application/octet-stream' });
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      if (type === 'excel') {
        link.download = `${params.row.fileName}.xlsx`;
      } else {
        link.download = `${params.row.fileName}.csv`;
      }

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(link.href);
    } catch (error) {
      setSnackbar({ children: 'Some Internal Error Occured While fetching data', severity: 'error' });
      console.error('Error fetching data:', error.message);
    } finally {
      setLoading(false);
    }
  };
  const handleCheckboxChange = (event) => {
    console.log('event.target.name', event.target.name);
    setFormData({ ...formData, [event.target.name]: event.target.checked });
  };
  // const handleSelectDistrict = (selectedDistrictId) => {
  //   setSelectedDistrict(selectedDistrictId);
  //   setFormData({ ...formData, districtCode: selectedDistrictId });

  //   setFormErrors((prevErrors) => {
  //     const updatedErrors = { ...prevErrors };
  //     delete updatedErrors.districtCode;
  //     return updatedErrors;
  //   });
  // };
  const handleDistrictChange = (districtId) => {
    setFormData({ ...formData, districtCode: districtId });
    setFormErrors((prevErrors) => {
      const updatedErrors = { ...prevErrors };
      delete updatedErrors.districtCode;
      return updatedErrors;
    });
  };
  const handleCloseSnackbar = () => setSnackbar(null);
  const handleStateChange = (stateId) => {
    setFormData({ ...formData, stateCode: stateId });
    setFormErrors((prevErrors) => {
      const updatedErrors = { ...prevErrors };
      delete updatedErrors.stateCode;
      return updatedErrors;
    });
  };
  const handleSchemeChange = (event) => {
    setFormData({ ...formData, schemeCode: event.target.value });
    setFormErrors((prevErrors) => {
      const updatedErrors = { ...prevErrors };
      delete updatedErrors.schemeCode;
      return updatedErrors;
    });
  };
  const cancelButton = () => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      // stateCode: '',
      // districtCode:'',
      // schemeCode: '',
      // monthCode: '',
      // yearCode: '',
      applicantName: false,
      address: false,
      dateOfBirth: false,
      gender: false,
      aadhaarNo: false,
      fatherName: false,
      categoryCode: [],
      bankPostOfficeAccountNo: false,
      ifscCode: false,
      pfmsRegistrationId: false,
      disbursementMode: false,
      mobile: false,
      amount: false
    }));
    // setSavingData([]);
  };
  const validateForm = () => {
    const errors = {};
    // Add validation logic for each field
    if (!formData.stateCode) {
      errors.stateCode = messages_en.stateRequired;
    }

    if (!formData.schemeCode) {
      errors.schemeCode = messages_en.schemCodeRequired;
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0; // Return true if no errors
  };

  const fetchData = async (param, e) => {
    e.preventDefault();
    console.log('type----' + param);
    // console.log(selectedDistrictId);
    const isFormValid = validateForm();
    console.log(formData);
    if (isFormValid) {
      setLoading(true);
      try {
        const postUrl = `/reports/getFileCountStatus/${param}`;
        const response = await axiosInstance.post(postUrl, formData);
        if (response.status >= 200 && response.status < 300) {
          if (response.data.length > 0) {
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
  const handleSubmit = (param, e) => {
    e.preventDefault();

    fetchData(param, e)
      .then((res) => {
        if (res) {
          const data = res || [];
          //   setAllDistrict(districtData);
          setBenCount(data);

          console.log(res);
        } else {
          setBenCount([]);
          return false;
        }
      })
      .catch((e) => {
        console.log(e.message);
      });
  };
  const handleCategoryChange = (e) => {
    const value = e.target.value;
    let updatedList = [...formData.categoryCode];

    if (value === 'All') {
      // If 'All' is selected, toggle all category codes
      if (updatedList.includes('All')) {
        updatedList = []; // Deselect all
      } else {
        updatedList = ['All', 'SC', 'ST', 'OBC', 'GEN', 'Other']; // Select all
      }
    } else {
      // Toggle individual category selection
      if (updatedList.includes(value)) {
        updatedList = updatedList.filter((item) => item !== value); // Deselect the category
      } else {
        updatedList.push(value); // Select the category
      }

      // If an individual category is selected, remove 'All' from the list
      updatedList = updatedList.filter((item) => item !== 'All');
    }

    setFormData({
      ...formData,
      categoryCode: updatedList
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
            alignItems: 'center',
             paddingTop: '0',
             paddingLeft: '10px'
          }}
        >
          <CircularProgress />
        </div>
      )}
      <MainCard title="Savings Detail Summary Of States">
        <Grid container spacing={2}>
          <Grid item xs={12} sm={3}>
            <FormControl fullWidth>
              <StateList onSelectState={handleStateChange} isMendatory={true} />
              {formErrors.stateCode && (
                <FormHelperText>
                  <Typography style={{ color: 'red', fontSize: '0.8rem' }}>{formErrors.stateCode}</Typography>
                </FormHelperText>
              )}
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={3}>
            <FormControl fullWidth>
              <DistrictList
                onSelectDistrict={handleDistrictChange}
                selectedStateId={formData.stateCode}
                isMendatory={true}
                defaultSelectedDistrict={formData.districtCode}
              />
              {formErrors.districtCode && (
                <FormHelperText>
                  <Typography style={{ color: 'red', fontSize: '0.8rem' }}>{formErrors.districtCode}</Typography>
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
                <MenuItem value="All">ALL</MenuItem>
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
          <Grid item xs={12} sm={12}>
            <Divider style={{ marginTop: 5 }}>{/* <Chip label=" " />  */}</Divider>
          </Grid>
          <Grid container spacing={1}>
            {checkboxes.map((checkbox) => (
              <Grid item xs={12} sm={2} key={checkbox}>
                <FormControlLabel
                  control={<Checkbox checked={formData[checkbox]} onChange={handleCheckboxChange} name={checkbox} color="primary" />}
                  label={<Typography>{checkbox.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())}</Typography>}
                />
              </Grid>
            ))}
          </Grid>
          <Grid
            item
            xs="auto"
            sx={{
              display: 'flex',
              alignItems: 'center',
              padding: '.2rem .6rem',
              fontSize: '87.5%',
              color: '#fff',
              backgroundColor: '#212529',
              borderRadius: '.3rem'
            }}
          >
            Caste
          </Grid>

          {['All', 'SC', 'ST', 'OBC', 'GEN', 'Other'].map((code) => (
            <Grid item xs="auto" key={code}>
              <FormControlLabel
                control={
                  <Checkbox
                    name="categoryCode"
                    value={code}
                    checked={
                      code === 'All'
                        ? ['SC', 'ST', 'OBC', 'GEN', 'Other'].every((cat) => formData.categoryCode.includes(cat))
                        : formData.categoryCode.includes(code)
                    }
                    onChange={handleCategoryChange}
                  />
                }
                label={code}
              />
            </Grid>
          ))}
          <Grid item xs={12} sm={12}>
            <Divider style={{ marginTop: 5 }}>{/* <Chip label=" " />  */}</Divider>
          </Grid>
          <Grid item xs={12} alignItems="center">
            <Button type="submit" variant="contained" color="primary" onClick={(e) => handleSubmit('excel', e)}>
              DOWNLOAD IN EXCEL
            </Button>
            &nbsp; &nbsp; &nbsp;
            <Button type="submit" variant="contained" color="primary" onClick={(e) => handleSubmit('csv', e)}>
              DOWNLOAD IN CSV
            </Button>
            &nbsp; &nbsp; &nbsp;
            <Button type="button" variant="contained" color="error" onClick={cancelButton}>
              RESET
            </Button>
          </Grid>
        </Grid>
      </MainCard>
      {!!snackbar && (
        <Snackbar open anchorOrigin={{ vertical: 'top', horizontal: 'center' }} onClose={handleCloseSnackbar} autoHideDuration={8000}>
          <Alert {...snackbar} onClose={handleCloseSnackbar} />
        </Snackbar>
      )}
      {benCount.length > 0 && (
        <MainCard title="Download Files">
          {/* <Stack sx={{ width: '100%' }} spacing={2}>
                    <Alert1 variant="filled" severity="warning" style={{ color: 'red' }}>Note: This report includes <b style={{ color: 'blue' }}>SO_SAVED and DONE</b> beneficiary data only.</Alert1>
                </Stack> */}

          <div style={{ height: 600, width: '100%', marginTop: '20px' }} className={classes.root}>
            <DataGrid rows={rows} columns={columns} stickyFooter hideFooterPagination disableRowSelectionOnClick density="compact" />
          </div>
        </MainCard>
      )}
    </div>
  );
};
export default DownloadBeneficiaryData;
