import React, { useState, useEffect } from 'react';
import Snackbar from '@mui/material/Snackbar';
import MainCard from 'ui-component/cards/MainCard';
import SearchComponent from 'components/common/SearchTypeCommon';
import SubDistrictCommon from 'components/common/SubDistrictCommon';
import { getAuthToken, getUserInfo } from 'utils/storageUtils';
import IconButton from '@mui/material/IconButton';
import GetAppIcon from '@mui/icons-material/GetApp';
import config from 'config';
import {
  Button,
  Box,
  Divider,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  Table,
  TableCell,
  TableContainer,
  TextareaAutosize,
  TableRow,
  Paper,
  Grid
} from '@mui/material';
import Alert from '@mui/material/Alert';

import { DataGrid } from '@mui/x-data-grid';

import axiosInstance from 'hooks/useAuthTokenUrl';

const recalculateSerialNumbers = (data) => {
  // Iterate through the data and update the serial numbers
  const updatedData = data.map((row, index) => ({
    ...row,
    serialNo: index + 1
  }));
  return updatedData;
};
const userinfoHeader = getUserInfo();
const apiBaseUrl = config.API_BASE_URL;
const DetailDialog = ({ open, onClose, rowData, onDialogClose, onSubmission }) => {
  const [remarks, setRemarks] = useState('');
  const [remarksError, setRemarksError] = useState('');
  const [profilePhoto, setProfilePhoto] = useState(null);

  useEffect(() => {
    const fetchProfilePhoto = async (filename) => {
      try {
        const token = getAuthToken(); // Assuming getAuthToken() retrieves the authentication token
        const response = await fetch(`${apiBaseUrl}/beneficiaryRegistration/downloadFile/${filename}/${rowData.applicationNo}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
            userInfo: JSON.stringify(userinfoHeader) // Make sure userinfoHeader is defined
          }
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const blob = await response.blob(); // Retrieve response as Blob
        const imageUrl = URL.createObjectURL(blob); // Create URL for the Blob
        console.log('imageUrl', imageUrl);
        setProfilePhoto(imageUrl);
      } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
      }
    };

    if (rowData) {
      fetchProfilePhoto(rowData.beneficiaryPhoto);
    }
  }, [rowData]);

  const handleRemarksChange = (event) => {
    setRemarks(event.target.value);
    setRemarksError('');
  };

  const handleSubmission = (status) => {
    if (!remarks.trim()) {
      setRemarksError('Remarks are required.'); // Set error message if remarks are empty
      return;
    }

    // Call the onSubmission prop only if remarks are not empty
    onSubmission(rowData, remarks, status);

    // Close the dialog after submission
    onClose();
    onDialogClose(rowData.applicationNo.trim());
    setRemarks('');
  };

  if (!rowData) {
    // If rowData is null, you can choose to handle it accordingly.
    return null;
  }
  const formatDate = (dateString) => {
    if (!dateString) {
      return ''; // Return an empty string if dateString is null or undefined
    }

    const date = new Date(dateString);

    const day = date.getDate();
    const month = date.getMonth() + 1; // Month is zero-based, so add 1
    const year = date.getFullYear();

    // Return date in DD/MM/YYYY format
    return day + '/' + month + '/' + year;
  };

  const personalDetails1 = [
    { label: 'Applicant Name', value: rowData.applicantName },
    { label: 'Father/Husband Name', value: rowData.fatherHusbandName },
    { label: 'Gender', value: rowData.gender },
    { label: 'Age', value: rowData.age },
    { label: 'Date of Birth', value: formatDate(rowData.dateOfBirth) || '' },
    { label: 'Category', value: rowData.categoryName },
    { label: 'Widow', value: rowData.widows || '' },
    { label: 'Disability Type 1', value: rowData.disabilityCode || '' },
    { label: 'Disability Type 1 Percentage', value: rowData.disabilityPercent || '' },
    { label: 'Disability Type 2', value: rowData.disabilityCode1 || '' },
    { label: 'Disability Type 2 Percentage', value: rowData.disabilityPercent1 || '' },
    { label: 'Application Date', value: rowData.applicationDate ? formatDate(rowData.applicationDate) : '' }
  ];

  const personalDetails2 = [
    { label: 'District', value: rowData.districtName },
    { label: 'Subdistrict', value: rowData.subDistrictMunicipalAreaName },
    { label: 'Grampanchayat/Ward', value: rowData.gramPanchayatName },
    { label: 'Aadhaar No', value: rowData.uidNo || '' },
    {
      label: 'Mobile No',
      value: rowData.contactPersonMobile ? 'XXXXXX' + rowData.contactPersonMobile.slice(-4) : ''
    },
    { label: 'Annual Income', value: rowData.annualIncome }
  ];

  const disbursementDetails = [
    { label: 'Bank/PO Account No', value: rowData.bankPoAccountNo || '' },
    { label: 'IFSC Code', value: rowData.ifscCode || '' },
    { label: 'Bank Name', value: rowData.bankName || '' }
  ];

  const certificateDetails = [
    { label: 'Beneficiary Photo', value: rowData.beneficiaryPhoto || 'No Document' },
    { label: 'Age Certificate', value: rowData.ageCertificatePhoto || 'No Document' },
    { label: 'Income Certificate', value: rowData.incomeCertificatePhoto || 'No Document' }
  ];

  const handleDownload = (filename) => {
    const token = getAuthToken();
    fetch(`${apiBaseUrl}/beneficiaryRegistration/downloadFile/${filename}/${rowData.applicationNo}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        userInfo: JSON.stringify(userinfoHeader)
        // Add any other headers if needed
      }
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.arrayBuffer();
      })
      .then((data) => {
        // Handle the response from the server
        const blob = new Blob([data]);
        const url = window.URL.createObjectURL(blob);
        // Create a link element and trigger a click to initiate the download
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        console.log('Server response:', data);
      })
      .catch((error) => {
        console.error('There was a problem with the fetch operation:', error);
      });
  };

  const renderDetails = (details, handleDownload) => {
    const rows = [];
    for (let i = 0; i < details.length; i += 3) {
      rows.push(
        <TableRow key={i}>
          {details.slice(i, i + 3).map((detail, index) => (
            <TableCell key={index} style={{ width: '33%', textAlign: 'left', border: '1px solid black' }}>
              <strong>{detail.label}:</strong>
              {detail.label === 'Age Certificate' && detail.value === 'No Document' && <span>&nbsp;{detail.value}</span>}
              {detail.label === 'Income Certificate' && detail.value === 'No Document' && <span>&nbsp;{detail.value}</span>}

              {detail.label === 'Beneficiary Photo' && detail.value === 'No Document' && <span>&nbsp;{detail.value}</span>}

              {detail.label !== 'Age Certificate' &&
                detail.label !== 'Beneficiary Photo' &&
                detail.label !== 'Income Certificate' &&
                detail.label !== 'Gender' &&
                detail.label !== 'Widow' && <span>&nbsp;{detail.value}</span>}
              {/* Render download icon only for certificate details */}
              {detail.label === 'Age Certificate' && detail.value !== 'No Document' && (
                <IconButton onClick={() => handleDownload(detail.value)} color="primary">
                  <GetAppIcon />
                </IconButton>
              )}
              {detail.label === 'Income Certificate' && detail.value !== 'No Document' && (
                <IconButton onClick={() => handleDownload(detail.value)} color="primary">
                  <GetAppIcon />
                </IconButton>
              )}
              {detail.label === 'Beneficiary Photo' && detail.value !== 'No Document' && (
                <img src={profilePhoto} alt="Beneficiary" style={{ width: '120px', height: '120px' }} />
              )}
              {detail.label === 'Widow' && detail.value !== '' && <span>&nbsp;{detail.value === 'Y' ? 'YES' : 'NO'}</span>}
              {detail.label === 'Gender' && detail.value !== '' && (
                <span>&nbsp;{detail.value === 'M' ? 'MALE' : detail.value === 'F' ? 'FEMALE' : 'TRANSGENDER'}</span>
              )}
            </TableCell>
          ))}
        </TableRow>
      );
    }
    return rows;
  };
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <h1>Complete Data</h1>
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TableContainer component={Paper}>
              <Grid item xs={12} style={{ textAlign: 'center', backgroundColor: '#e0e0e0', padding: '10px' }}>
                <Typography variant="h2" sx={{ fontSize: '18px' }}>
                  Personal Details{' '}
                </Typography>
              </Grid>
              <Table>{renderDetails(personalDetails1)}</Table>
            </TableContainer>

            <TableContainer component={Paper}>
              <Grid item xs={12} style={{ textAlign: 'center', backgroundColor: '#e0e0e0', padding: '10px' }}>
                <Typography variant="h2" sx={{ fontSize: '18px' }}>
                  Address
                </Typography>
              </Grid>
              <Table>{renderDetails(personalDetails2)}</Table>
            </TableContainer>

            <TableContainer component={Paper}>
              <Grid item xs={12} style={{ textAlign: 'center', backgroundColor: '#e0e0e0', padding: '10px' }}>
                <Typography variant="h2" sx={{ fontSize: '18px' }}>
                  Bank Details
                </Typography>
              </Grid>
              <Table>{renderDetails(disbursementDetails)}</Table>
            </TableContainer>

            <TableContainer component={Paper}>
              <Grid item xs={12} style={{ textAlign: 'center', backgroundColor: '#e0e0e0', padding: '10px' }}>
                <Typography variant="h2" sx={{ fontSize: '18px' }}>
                  Documents Uploaded
                </Typography>
              </Grid>
              <Table>{renderDetails(certificateDetails, handleDownload)}</Table>
              <Grid item xs={12} style={{ textAlign: 'center', padding: '10px' }}>
                <Typography variant="h2" sx={{ fontSize: '18px' }}>
                  Remarks
                </Typography>
                <TextareaAutosize
                  rowsMin={4}
                  placeholder="Enter your remarks here"
                  value={remarks}
                  onChange={handleRemarksChange}
                  style={{ width: '100%', marginBottom: '10px' }}
                />
                {remarksError && <p style={{ color: 'red', marginLeft: '3px', marginTop: '-5px', textAlign: 'left' }}>{remarksError}</p>}

                <Button variant="contained" color="primary" onClick={() => handleSubmission('approved')} style={{ marginRight: '10px' }}>
                  Approve
                </Button>
                <Button variant="contained" color="primary" onClick={() => handleSubmission('rejected')} style={{ marginRight: '10px' }}>
                  Returned
                </Button>
                <Button variant="contained" color="primary" onClick={onClose}>
                  Close
                </Button>
              </Grid>
            </TableContainer>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
};

export default function FullFeaturedCrudGrid() {
  const [beneficiaryData, setBeneficiaryData] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedRowData, setSelectedRowData] = useState(null);
  const [snackbar, setSnackbar] = React.useState(null);
  const handleCloseSnackbar = () => setSnackbar(null);

  const options = {
    applicationNo: 'Application Number',
    applicantName: 'Applicant Name',
    uidNo: 'Aadhaar',
    contactPersonMobile: 'Mobile No'
  };

  const [optionValues, setOptionValues] = useState({});
  const [locationOptionValues, setLocationOptionValues] = useState({});

  const handleSubmission = async (rowData, remarks, status) => {
    const postFormData = {
      applicationNumber: rowData.applicationNo.trim(),
      remarks: remarks,
      status: status
    };
    try {
      const postUrl = '/beneficiaryRegistration/verifyApplication';
      const res = await axiosInstance.post(postUrl, postFormData);
      console.log('Data Save: Status Code: ', res.status);
      setSnackbar({ children: 'Data has been verified', severity: 'success' });
      await handleFetchData(false);
    } catch (error) {
      console.log('Data Not Saved: Some error has occurred: ', error);
      setSnackbar({ children: 'Failed to verify data', severity: 'error' });
    }
  };

  const handleFetchData = async (showSnackbar = true) => {
    try {
      if (subDistrictCommonRef.current && !Object.values(optionValues).some((value) => value !== null)) {
        if (subDistrictCommonRef.current.validateSelectedDropDown() != 'RJ') {
          return false;
        }
      }

      var requestData = { ...optionValues, ...locationOptionValues };

      const response = await axiosInstance.post('beneficiaryRegistration/status/new', JSON.stringify(requestData));
      if (response.data.length < 1) {
        setBeneficiaryData([]);
        if (showSnackbar) {
          setSnackbar({ children: 'No Data Found', severity: 'error' });
        }
        return false;
      }
      //const newData = response.data.map((row) => ({ ...row, id: row.applicationNo }));
      const newData = response.data.map((row, index) => ({
        ...row,
        id: row.applicationNo,
        serialNo: index + 1
      }));
      setBeneficiaryData(newData);
    } catch (error) {
      return false;
    }
  };

  const handleOptionValuesChange = (newOptionValues) => {
    setOptionValues(newOptionValues);
  };

  const handleLocationValuesChange = (newLocOptionValues) => {
    setLocationOptionValues(newLocOptionValues);
  };

  const useFakeMutation = () => {
    return React.useCallback(
      (updatedRow) =>
        new Promise((resolve, reject) => {
          setTimeout(() => {
            // Simulate saving data to the backend
            if (updatedRow.appealRemarks?.trim() === '') {
              reject(new Error("Error:Appeals Remark can't be empty."));
            } else {
              resolve({ ...updatedRow, appealRemarks: updatedRow.appealRemarks?.toUpperCase() });
            }
          }, 180);
        }),
      []
    );
  };
  const mutateRow = useFakeMutation();
  const processRowUpdate = React.useCallback(
    async (updatedRow) => {
      try {
        const updatedRowData = await mutateRow(updatedRow);

        setBeneficiaryData((prevRows) => {
          const rowIndex = prevRows.findIndex((row) => row.applicationNo === updatedRowData.applicationNo);

          const updatedRows = [...prevRows];
          updatedRows[rowIndex] = {
            ...updatedRows[rowIndex],
            appealRemarks: updatedRowData.appealRemarks
          };

          return updatedRows;
        });
        return updatedRowData;
      } catch (error) {
        console.error('Error updating row:', error);
        throw error;
      }
    },
    [mutateRow, setBeneficiaryData]
  );

  const handleApplicationNoClick = (rowData) => {
    setSelectedRowData(rowData);
    setDialogOpen(true);
  };

  const columns = [
    {
      field: 'serialNo',
      headerName: 'Serial No',
      width: 120,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => <span style={{ display: 'flex', justifyContent: 'center' }}>{params.value}</span>
    },
    {
      field: 'applicationNo',
      headerName: 'Application No',
      width: 180,
      renderCell: (params) => (
        <span
          style={{ cursor: 'pointer', textDecoration: 'underline' }}
          onClick={() => handleApplicationNoClick(params.row)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleApplicationNoClick(params.row);
            }
          }}
          role="button"
          tabIndex={0}
        >
          {params.value}
        </span>
      )
    },
    {
      field: 'applicantName',
      headerName: 'Applicant Name',
      width: 180,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => <span style={{ display: 'flex', justifyContent: 'center' }}>{params.value}</span>
    },
    {
      field: 'fatherHusbandName',
      headerName: 'Father/Husband Name',
      width: 180,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => <span style={{ display: 'flex', justifyContent: 'center' }}>{params.value}</span>
    },
    {
      field: 'gender',
      headerName: 'Gender',
      width: 150,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => (
        <span style={{ display: 'flex', justifyContent: 'center' }}>
          {params.value === 'M' ? 'MALE' : params.value === 'F' ? 'FEMALE' : 'TRANSGENDER'}
        </span>
      )
    },
    {
      field: 'subDistrictMunicipalAreaName',
      headerName: 'Sub District',
      width: 180,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => <span style={{ display: 'flex', justifyContent: 'center' }}>{params.value}</span>
    },
    {
      field: 'gramPanchayatName',
      headerName: 'GP/Ward',
      width: 180,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => <span style={{ display: 'flex', justifyContent: 'center' }}>{params.value}</span>
    },
    {
      field: 'contactPersonMobile',
      headerName: 'Mobile No',
      width: 180,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => <span style={{ display: 'flex', justifyContent: 'center' }}>{params.value}</span>
    },
    {
      field: 'creationDate',
      headerName: 'Pending Days',
      width: 160,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => {
        const currentDate = new Date();
        const creationDate = new Date(params.value);
        const diffInMilliseconds = currentDate - creationDate;
        const diffInDays = Math.floor(diffInMilliseconds / (1000 * 60 * 60 * 24));
        return <span style={{ display: 'flex', justifyContent: 'center' }}>{diffInDays}</span>;
      }
    }
  ];

  /* const handleDialogClose = async (applicationNo) => {
   console.log('Closing dialog for applicationNo:', applicationNo);
 
   setBeneficiaryData((prevData) =>
     prevData.filter((row) => row.applicationNo.trim() !== applicationNo.trim())
   );
   console.log('Updated beneficiaryData:', beneficiaryData);
 
   
   setDialogOpen(false);
 }; */

  const handleDialogClose = async (applicationNo) => {
    console.log('Closing dialog for applicationNo:', applicationNo);

    // Recalculate serial numbers before updating the state
    const updatedData = recalculateSerialNumbers(beneficiaryData);

    setBeneficiaryData(updatedData.filter((row) => row.applicationNo.trim() !== applicationNo.trim()));

    setDialogOpen(false);

    setSelectedRowData(null);
  };

  useEffect(() => {
    console.log('Updated beneficiaryData:', beneficiaryData);
  }, [beneficiaryData]);

  const subDistrictCommonRef = React.createRef();

  return (
    <MainCard title="Application Pending for Verification">
      {/*  <Box
      sx={{
        //height: 300,
        width: '100%',
        '& .actions': {
          color: 'text.secondary',
        },
        '& .textPrimary': {
          color: 'text.primary',
        },
      }}
    > */}

      <Box justifyContent="space-between" marginBottom={2}>
        <div>
          <SubDistrictCommon onFormInputValuesChange={handleLocationValuesChange} ref={subDistrictCommonRef} validationLevel={'D'} />
        </div>
        <Divider>
          <Typography variant="body1" component="div" sx={{ padding: '4px' }}>
            OR SEARCH BY
          </Typography>
        </Divider>
        <div>
          <SearchComponent options={options} onOptionValuesChange={handleOptionValuesChange} />
        </div>

        <Divider />

        <Box marginTop={2}>
          <Button variant="contained" color="secondary" onClick={handleFetchData}>
            Search
          </Button>
        </Box>
      </Box>
      {beneficiaryData.length > 0 && (
        <DataGrid
          getRowId={(row) => row.applicationNo}
          rows={beneficiaryData}
          columns={columns}
          editMode="row"
          processRowUpdate={processRowUpdate}

          //rowHeight={40} // Adjust as needed
          //headerHeight={40} // Adjust as needed
        />
      )}

      {!!snackbar && (
        <Snackbar open anchorOrigin={{ vertical: 'top', horizontal: 'center' }} onClose={handleCloseSnackbar} autoHideDuration={6000}>
          <Alert {...snackbar} onClose={handleCloseSnackbar} />
        </Snackbar>
      )}

      <DetailDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        rowData={selectedRowData}
        onDialogClose={handleDialogClose}
        onSubmission={handleSubmission}
      />
    </MainCard>
  );
}
