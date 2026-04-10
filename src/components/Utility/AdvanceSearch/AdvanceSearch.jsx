import React, { useState } from 'react';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { Button, Box, Divider, Alert, Modal, Icon, Grid, FormControl } from '@mui/material';
import MainCard from 'ui-component/cards/MainCard';
import CircularProgress from '@mui/material/CircularProgress';
import Backdrop from '@mui/material/Backdrop';
import SearchComponent from 'components/common/SearchTypeCommon';
import axiosInstance from 'hooks/useAuthTokenUrl';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { showalertwhenObjectretrnvalidation } from 'components/common/fieldValidationFunctionByjava';
import Snackbar from '@mui/material/Snackbar';
import { Cancel } from '@material-ui/icons';
import VerifiedIcon from '@mui/icons-material/Verified';
import AadharEncrypter from '../../common/AadharEncrypter ';
import StateList from 'components/form_components/StateList';
import { getUserInfo } from 'utils/storageUtils';

function AdvanceSearch() {
  const [snackbar, setSnackbar] = React.useState(null);

  
  const datauser = getUserInfo();
  const userName = datauser.userCode;


  const handleCloseSnackbar = () => setSnackbar(null);

  const options = {
    sanctionOrderNo: 'Sanction Order No',
    applicatName: 'Applicant Name',
    beneficiaryNo: 'Beneficiary No',
    aadhaar: 'Aadhaar No',
    mobile: 'Mobile No',
    bankAcc: 'Bank Account No',
    pfmsId: 'PFMS ID'
  };

  const columns = [
    { field: 'sanctionOrderNo', headerName: 'Sanction Order No', flex: 1 },
    { field: 'applicantName', headerName: 'Applicant Name', flex: 1 },
    {
      field: 'actions',
      headerName: 'Actions',
      sortable: false,
      renderCell: (params) => (
        <Button variant="contained" color="primary" size="small" onClick={() => handleViewData(params)}>
          View Details
        </Button>
      ),
      flex: 0.5
    }
  ];

  const [optionValues, setOptionValues] = useState({});
  const [UtilitydData, setUtilitydData] = useState([]);
  const [UtilitydDataDetail, setUtilitydDataDetail] = useState([]);
  const [discontinueDetails, setdiscontinueDetails] = useState([]);
  const [paymentDetails, setpaymentDetails] = useState([]);
  const [registrationDetails, setregistrationDetails] = useState([]);
  const [migretionDetails, setmigretionDetails] = useState([]);
  const [loading, setLoading] = useState(false);
  const [warningAlert, setShowwarningAlert] = useState('');
  const [showhideDiscontinue, setshowhideDiscontinue] = useState(false);
  const [showhideMig, setshowhideMig] = useState(false);
  const [showhidePay, setshowhidePay] = useState(false);
  const [showhideReg, setshowhideReg] = useState(false);
  const [stateId, setStateId] = useState('0');
  const handleViewData = async (rowData) => {
    setUtilitydDataDetail([]);
    setpaymentDetails([]);
    setdiscontinueDetails([]);
    setregistrationDetails([]);
    setmigretionDetails([]);
    setshowhideDiscontinue(false);
    setshowhideMig(false);
    setshowhidePay(false);
    setshowhideReg(false);
    const requestData = {
      // Extract only the necessary properties from rowData.row
      sanctionOrderNo: rowData.row.sanctionOrderNo,
      stateId: stateId
      // Add other properties as needed
    };

    try {
      setLoading(true);
      const response = await axiosInstance.post('advance-search/findAllAdvanceSearchDetails', JSON.stringify(requestData));
      const newData = response.data.map((row) => ({ ...row, id: row.sanctionOrderNo }));
      setUtilitydDataDetail(newData);
    } catch (error) {
      console.error(error);
      setSnackbar({ children: 'Some Internal Error Occurred', severity: 'error' });
      return false;
    } finally {
      setLoading(false);
      setOpenModal(true);
    }
  };

  const handleOptionValuesChange = (newOptionValues) => {
    setOptionValues(newOptionValues);
  };

  const handleFetchData = async (e) => {
    e.preventDefault();
    try {
      var requestData = { ...optionValues, stateId: stateId };

      // Check if either sanctionOrderNo or applicatName is not null
      if (
        requestData.sanctionOrderNo !== null ||
        requestData.applicatName !== null ||
        requestData.beneficiaryNo !== null ||
        requestData.aadhaar !== null ||
        requestData.mobile !== null ||
        requestData.bankAcc !== null ||
        requestData.pfmsId !== null
      ) {
        setLoading(true);

        const patternsanctionOrderNo = /^[A-Z]{2}-(S|A)-\d{8}$/;
        const patternapplicatName = /^[A-Za-z\s]+$/;
        const patternaadhaar = /^(?!0|1)\d{12}$/;
        const patternmobile = /^\d{10}$/;
        const patternbankAcc = /^[0-9]{1,20}$/;
        const patternpfmsId = /^[a-zA-Z0-9]{13,14}$/;

        if (requestData.sanctionOrderNo && !patternsanctionOrderNo.test(requestData.sanctionOrderNo)) {
          setSnackbar({ children: 'Sanction number is not correct', severity: 'error' });
          setLoading(false);

          return;
        }

        if (requestData.applicatName && !patternapplicatName.test(requestData.applicatName)) {
          setSnackbar({ children: 'Applicat Name is not correct', severity: 'error' });
          setLoading(false);

          return;
        }

        if (requestData.aadhaar && !patternaadhaar.test(requestData.aadhaar)) {
          setSnackbar({ children: 'Aadhar is not correct', severity: 'error' });
          setLoading(false);

          return;
        }

        if (requestData.mobile && !patternmobile.test(requestData.mobile)) {
          setSnackbar({ children: 'mobile Number is Wrong', severity: 'error' });
          setLoading(false);

          return;
        }

        if (requestData.bankAcc && !patternbankAcc.test(requestData.bankAcc)) {
          setSnackbar({ children: 'bank A/c Number is Wrong', severity: 'error' });
          setLoading(false);

          return;
        }

        if (requestData.pfmsId && !patternpfmsId.test(requestData.pfmsId)) {
          setSnackbar({ children: 'pfms Id is Wrong', severity: 'error' });
          setLoading(false);

          return;
        }

        if (requestData.aadhaar) {
          const encryptedUidData = AadharEncrypter({ uidNumber: requestData.aadhaar });
          requestData.aadhaar = encryptedUidData;
        }

        if (
          requestData.sanctionOrderNo ||
          requestData.beneficiaryNo ||
          requestData.aadhaar ||
          requestData.mobile ||
          requestData.bankAcc ||
          requestData.pfmsId
        ) {
          // Reset state variables
          setUtilitydData([]);
          setpaymentDetails([]);
          setdiscontinueDetails([]);
          setregistrationDetails([]);
          setmigretionDetails([]);
          setshowhideDiscontinue(false);
          setshowhideMig(false);
          setshowhidePay(false);
          setshowhideReg(false);

          // Perform API call based on requestData
          const response = await axiosInstance.post('advance-search/findAllAdvanceSearchDetails', JSON.stringify(requestData));

          if (response.data.length < 1) {
            setUtilitydDataDetail([]);
            setSnackbar({ children: 'No Pensioner Found', severity: 'error' });
            return false;
          }

          const newData = response.data.map((row) => ({ ...row, id: row.sanctionOrderNo }));
          setUtilitydDataDetail(newData);
          setOpenModal(true);
        } else {
          // Reset state variables
          setUtilitydDataDetail([]);
          setshowhideDiscontinue(false);
          setshowhideMig(false);
          setshowhidePay(false);
          setshowhideReg(false);

          // Perform another API call based on different endpoint or requestData
          const response = await axiosInstance.post('advance-search/findAllAdvanceSearchlist', JSON.stringify(requestData));

          if (response.data.length < 1) {
            setUtilitydData([]);
            setSnackbar({ children: 'No Pensioner Found', severity: 'error' });
            return false;
          }

          const newData = response.data.map((row) => ({ ...row, id: row.sanctionOrderNo }));
          setUtilitydData(newData);
        }
      } else {
        setSnackbar({ children: 'Choose any Option.Input is Blank.Provide any Input.', severity: 'warning' });
        return false;
      }
    } catch (error) {
      // Handle errors
      setShowwarningAlert(showalertwhenObjectretrnvalidation(error));
      // setSnackbar({ children: 'Some Internal Error Occured', severity: 'error' });
      return false;
    } finally {
      // Ensure loading state is set to false regardless of success or failure
      setLoading(false);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
  };

  const handleClose = () => {
    setShowwarningAlert('');
  };

  const DiscontinueDetailsData = async (e, sanctionOrderNo) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axiosInstance.get(`advance-search/findAdvanceSearchDisbursment/${sanctionOrderNo}/${stateId}`);
      if (response.status >= 200 && response.status < 300) {
        const dataWithSerialNumber = response.data.map((item, index) => ({
          ...item,
          Count: index + 1 // Using index as the default row identifier
        }));
        setshowhideDiscontinue(true);
        return setdiscontinueDetails(dataWithSerialNumber);
      } else {
        throw new Error('Data coud not be fetched!', response.status);
      }
    } catch (error) {
      console.log(error);
      setSnackbar({ children: 'Some Internal Error Occured', severity: 'error' });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const PaymentDetailsData = async (e, sanctionOrderNo) => {
    e.preventDefault();
    setLoading(true);
    setpaymentDetails([]);
    try {
      const response = await axiosInstance.get(`advance-search/findAdvanceSearchPayment/${sanctionOrderNo}/${stateId}`);
      if (response.status >= 200 && response.status < 300) {
        const dataWithSerialNumber = response.data.map((item, index) => ({
          ...item,
          Count: index + 1, // Using index as the default row identifier
          maskvalueofpo: maskAccountNumber(item.bankPoAccountNo)
        }));
        setshowhidePay(true);
        return setpaymentDetails(dataWithSerialNumber);
      } else {
        throw new Error('Data coud not be fetched!', response.status);
      }
    } catch (error) {
      console.log(error);
      setSnackbar({ children: 'Some Internal Error Occured', severity: 'error' });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const RegistrationDetailsData = async (e, sanctionOrderNo) => {
    e.preventDefault();
    setLoading(true);
    setregistrationDetails([]);
    try {
      const response = await axiosInstance.get(`advance-search/findAdvanceSearchRegistration/${sanctionOrderNo}/${stateId}`);
      if (response.status >= 200 && response.status < 300) {
        const dataWithSerialNumber = response.data.map((item, index) => ({
          ...item,
          Count: index + 1 // Using index as the default row identifier
        }));
        setshowhideReg(true);
        return setregistrationDetails(dataWithSerialNumber);
      } else {
        throw new Error('Data coud not be fetched!', response.status);
      }
    } catch (error) {
      console.log(error);
      setSnackbar({ children: 'Some Internal Error Occured', severity: 'error' });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const MigrationDetailsData = async (e, sanctionOrderNo) => {
    e.preventDefault();
    setLoading(true);
    setmigretionDetails([]);
    try {
      const response = await axiosInstance.get(`advance-search/findAdvanceSearchMigration/${sanctionOrderNo}/${stateId}`);
      if (response.status >= 200 && response.status < 300) {
        const dataWithSerialNumber = response.data.map((item, index) => ({
          ...item,
          Count: index + 1 // Using index as the default row identifier
        }));

        setshowhideMig(true);
        return setmigretionDetails(dataWithSerialNumber);
      } else {
        throw new Error('Data coud not be fetched!', response.status);
      }
    } catch (error) {
      console.log(error);
      setSnackbar({ children: 'Some Internal Error Occured', severity: 'error' });
      return false;
    } finally {
      setLoading(false);
    }
  };

  function maskAccountNumber(accountNumber) {
    if (accountNumber) {
      const lastFourDigits = accountNumber.slice(-4);
      const maskedDigits = lastFourDigits.padStart(accountNumber.length, '*');
      return maskedDigits;
    }
  }

  const rowsDetails = UtilitydDataDetail.map((item) => ({
    status: item.status,
    sanctionOrderNo: item.sanctionOrderNo,
    beneficiaryNo: item.beneficiaryNo,
    applicationNo: item.applicationNo,
    fatherHusbandName: item.fatherHusbandName,
    gender: item.gender,
    dateOfBirth: item.dateOfBirth,
    age: item.age,
    schemeCode: item ? item.schemeCode : '',
    applicantName: item ? item.applicantName : '',
    address1: item.address1 ? item.address1 : '',
    address2: item.address2 ? item.address2 : '',
    address3: item.address3 ? item.address3 : '',
    pensionEffectiveFromDate: item.pensionEffectiveFromDate,
    disbursementUptoCenter: item.disbursementUptoCenter,
    cpsmsStatus: item.cpsmsStatus,
    pfmsPaymentFlag: item.pfmsPaymentFlag,
    pfmsBankPoAccountNo: item.pfmsBankPoAccountNo,
    disbursementCode: item.disbursementCode,
    bankPoAccountNo: item.bankPoAccountNo,
    ifscCode: item.ifscCode,
    sanctionDate: item.sanctionDate,
    branchName: item.branchName,
    mobile: item.mobile,
    nameAsPerUid: item.nameAsPerUid,
    pfmsUidNo: item.pfmsUidNo,
    pfmsUidNoMASK: item.pfmsUidNoMASK,
    npciStatus: item.npciStatus,
    verificationStatus: item.verificationStatus,
    nameAsPerAccount: item.nameAsPerAccount,
    freezAc: item.freezAc,
    aadhaarMask: item.aadhaarMask,
    aadhaar: item.aadhaar,
    cpsmsBeneficiaryId: item.cpsmsBeneficiaryId,
    bankPoAccountNoMask: maskAccountNumber(item.bankPoAccountNo),
    pfmsBankPoAccountNoMask: maskAccountNumber(item.pfmsBankPoAccountNo)
  }));

  const [openModal, setOpenModal] = useState(false);

  // Function to handle opening and closing modal

  const handleCloseModal = () => setOpenModal(false);

  const handleSelectStateid = (state) => {
    setStateId(state);
  };
  return (
    <>
      <MainCard title="Advance Search">
        {!!snackbar && (
          <Snackbar open anchorOrigin={{ vertical: 'top', horizontal: 'center' }} onClose={handleCloseSnackbar} autoHideDuration={6000}>
            <Alert {...snackbar} onClose={handleCloseSnackbar} />
          </Snackbar>
        )}

        {warningAlert && (
          <Alert variant="filled" severity="warning" onClose={handleClose}>
            {warningAlert}
          </Alert>
        )}
        {userName === 'ADMIN' && (
          <Grid container spacing={2} style={{ paddingBottom: '20px' }}>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <StateList onSelectState={handleSelectStateid} isMandatory={true} />
              </FormControl>
            </Grid>
          </Grid>
        )}

        <Box justifyContent="space-between" marginBottom={2}>
          <div>
            <SearchComponent options={options} onOptionValuesChange={handleOptionValuesChange} />
          </div>

          <Divider style={{ marginTop: '10px' }} />

          <Box marginTop={2} style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
            <Button variant="contained" color="primary" onClick={handleFetchData}>
              Search
            </Button>
          </Box>
        </Box>

        {UtilitydData.length > 0 && (
          <form onSubmit={handleFormSubmit}>
            <div style={{ height: 500, width: '100%' }}>
              <DataGrid
                rows={UtilitydData.map((row, index) => ({
                  ...row,
                  id: index,
                  actions: (
                    <Button variant="contained" color="primary" onClick={() => handleViewData(row)}>
                      View Data
                    </Button>
                  )
                }))}
                columns={columns}
                disableRowSelectionOnClick
                slots={{ toolbar: GridToolbar }}
                slotProps={{
                  toolbar: {
                    showQuickFilter: true
                  }
                }}
              />
            </div>
          </form>
        )}

        <Modal
          open={openModal}
          onClose={handleCloseModal}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Paper
            style={{
              width: '90%',
              maxHeight: '90%',
              overflowY: 'auto',
              boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
              padding: '20px',
              position: 'relative',
              backgroundColor: '#fff',
              borderRadius: '8px'
            }}
          >
            <>
              {UtilitydDataDetail.length > 0 && (
                <TableContainer component={Paper} sx={{ height: '50%', width: '100%' }}>
                  <Table size="small" aria-label="simple table" striped>
                    <TableHead>
                      <TableRow>
                        <TableCell colSpan={2} align="center">
                          Beneficiary Details
                        </TableCell>
                        <TableCell colSpan={2} align="center">
                          Payment Details
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        <TableCell>Status</TableCell>
                        <TableCell style={{ color: 'Red', fontWeight: 'bold' }}>{rowsDetails[0].status}</TableCell>
                        <TableCell>Payment Category</TableCell>
                        <TableCell style={{ color: 'Red', fontWeight: 'bold' }}>{rowsDetails[0].pfmsPaymentFlag}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Beneficiary Name</TableCell>
                        <TableCell>{rowsDetails[0].applicantName}</TableCell>
                        <TableCell>CPSMS ID</TableCell>
                        <TableCell>{rowsDetails[0].cpsmsBeneficiaryId}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Sanction Order No.</TableCell>
                        <TableCell>{rowsDetails[0].sanctionOrderNo}</TableCell>
                        <TableCell>PFMS Register Mode</TableCell>
                        <TableCell>NA</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Beneficiary No.</TableCell>
                        <TableCell>{rowsDetails[0].beneficiaryNo}</TableCell>
                        <TableCell>PFMS UID No.</TableCell>
                        <TableCell>
                          {rowsDetails[0].pfmsUidNoMASK}
                          <a href="javascript:void(0)" onClick={() => alert(`${rowsDetails[0].pfmsUidNo}`)}>
                            view
                          </a>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Father/Husband Name</TableCell>
                        <TableCell>{rowsDetails[0].fatherHusbandName}</TableCell>
                        <TableCell>Disbursement Mode(NSAP)</TableCell>
                        <TableCell>{rowsDetails[0].disbursementCode}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Address</TableCell>
                        <TableCell colSpan={3}>
                          {rowsDetails[0].address1} {rowsDetails[0].address2} {rowsDetails[0].address3}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Name as per Bank</TableCell>
                        <TableCell>{rowsDetails[0].nameAsPerAccount}</TableCell>
                        <TableCell>Bank Account No./PFMS Bank Account No.</TableCell>
                        <TableCell>
                          {rowsDetails[0].bankPoAccountNoMask}/{rowsDetails[0].pfmsBankPoAccountNoMask}
                          <a
                            href="javascript:void(0)"
                            onClick={() => alert(`${rowsDetails[0].bankPoAccountNo}/${rowsDetails[0].pfmsBankPoAccountNo}`)}
                          >
                            view
                          </a>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Gender</TableCell>
                        <TableCell>{rowsDetails[0].gender}</TableCell>
                        <TableCell>Branch Name</TableCell>
                        <TableCell>{rowsDetails[0].branchName}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Age/DOB</TableCell>
                        <TableCell>
                          {rowsDetails[0].age}/{rowsDetails[0].dateOfBirth}
                        </TableCell>
                        <TableCell>IFSC/PDA Code</TableCell>
                        <TableCell>{rowsDetails[0].ifscCode}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Scheme</TableCell>
                        <TableCell>{rowsDetails[0].schemeCode}</TableCell>
                        <TableCell>Aadhaar</TableCell>
                        <TableCell>
                          {rowsDetails[0].aadhaarMask}
                          <a href="javascript:void(0)" onClick={() => alert(`${rowsDetails[0].aadhaar}`)}>
                            view
                          </a>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Name as per Aadhaar</TableCell>
                        <TableCell>{rowsDetails[0].nameAsPerUid}</TableCell>
                        <TableCell>Verified</TableCell>
                        <TableCell>
                          {rowsDetails[0].freezAc === 'Y' ? (
                            <Icon style={{ color: 'green' }}>
                              <VerifiedIcon />
                            </Icon>
                          ) : (
                            <Icon style={{ color: 'red' }}>
                              <Cancel />
                            </Icon>
                          )}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Sanction Date</TableCell>
                        <TableCell>{rowsDetails[0].sanctionDate}</TableCell>
                        <TableCell>Pension Effective Date</TableCell>
                        <TableCell>{rowsDetails[0].pensionEffectiveFromDate}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Mobile No.</TableCell>
                        <TableCell>{rowsDetails[0].mobile}</TableCell>
                        <TableCell>Last Pension Month</TableCell>
                        <TableCell>{rowsDetails[0].disbursementUptoCenter}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Name As Per Bank A/C</TableCell>
                        <TableCell>{rowsDetails[0].nameAsPerAccount}</TableCell>
                        <TableCell>Verification Status</TableCell>
                        <TableCell>{rowsDetails[0].verificationStatus}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Aadhaar Seeded with Bank(NPCI status)</TableCell>
                        <TableCell>{rowsDetails[0].npciStatus}</TableCell>
                        <TableCell>Application No</TableCell>
                        <TableCell>{rowsDetails[0].applicationNo}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>
                          <Button
                            variant="contained"
                            onClick={(e) => DiscontinueDetailsData(e, rowsDetails[0].sanctionOrderNo)}
                            color="primary"
                          >
                            Discontinue Details
                          </Button>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="contained"
                            onClick={(e) => PaymentDetailsData(e, rowsDetails[0].sanctionOrderNo)}
                            color="primary"
                          >
                            Payment History
                          </Button>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="contained"
                            onClick={(e) => RegistrationDetailsData(e, rowsDetails[0].sanctionOrderNo)}
                            color="primary"
                          >
                            Registration History
                          </Button>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="contained"
                            onClick={(e) => MigrationDetailsData(e, rowsDetails[0].sanctionOrderNo)}
                            color="primary"
                          >
                            Migration History
                          </Button>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              )}

              {showhideDiscontinue && (
                <TableContainer component={Paper}>
                  {discontinueDetails.length > 0 ? (
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell colSpan={12} style={{ textAlign: 'center' }}>
                            <b style={{ color: '#3281db' }}>Discontinue Details</b>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>S.No</TableCell>
                          <TableCell>Bank A/c No</TableCell>
                          <TableCell>Scheme Code</TableCell>
                          <TableCell>SANCTION ORDER NO</TableCell>
                          <TableCell>Beneficiary No</TableCell>
                          <TableCell>Status</TableCell>
                          <TableCell>Discontinuation Date</TableCell>
                          <TableCell>Verification Date</TableCell>
                          <TableCell>Appeal No</TableCell>
                          <TableCell>Reinstate Date</TableCell>
                          <TableCell>Approval No</TableCell>
                        </TableRow>
                      </TableHead>

                      <TableBody>
                        {discontinueDetails.map((row) => (
                          <TableRow key={row.sno}>
                            <TableCell>{row.Count}</TableCell>
                            <TableCell>{row.bankPoAccountNo}</TableCell>
                            <TableCell>{row.schemeCode}</TableCell>
                            <TableCell>{row.sanctionOrderNo}</TableCell>
                            <TableCell>{row.beneficiaryNo}</TableCell>
                            <TableCell>{row.status}</TableCell>
                            <TableCell>{row.discontinueDate}</TableCell>
                            <TableCell>{row.verifyingDate}</TableCell>
                            <TableCell>{row.appealNo}</TableCell>
                            <TableCell>{row.reinstateDate}</TableCell>
                            <TableCell>{row.approvalNo}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell colSpan={12} style={{ textAlign: 'center' }}>
                            <b style={{ color: '#3281db' }}>Discontinue Details</b>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>S.No</TableCell>
                          <TableCell>Bank A/c No</TableCell>
                          <TableCell>Scheme Code</TableCell>
                          <TableCell>SANCTION ORDER NO</TableCell>
                          <TableCell>Beneficiary No</TableCell>
                          <TableCell>Status</TableCell>
                          <TableCell>Discontinuation Date</TableCell>
                          <TableCell>Verification Date</TableCell>
                          <TableCell>Appeal No</TableCell>
                          <TableCell>Reinstate Date</TableCell>
                          <TableCell>Approval No</TableCell>
                        </TableRow>
                      </TableHead>

                      <TableBody>
                        <TableRow>
                          <TableCell colSpan={13} align="center">
                            no data found
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  )}
                </TableContainer>
              )}

              {showhideMig && (
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell colSpan={12} style={{ textAlign: 'center' }}>
                          <b style={{ color: '#3281db' }}>Migration History</b>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>S.No</TableCell>
                        <TableCell>Sanction Order No</TableCell>
                        <TableCell>From Scheme</TableCell>
                        <TableCell>To Scheme</TableCell>
                        <TableCell>User Id</TableCell>
                        <TableCell>Date Of Migration</TableCell>
                      </TableRow>
                    </TableHead>

                    {migretionDetails.length > 0 ? (
                      <TableBody>
                        {migretionDetails.map((row) => (
                          <TableRow key={row.sno}>
                            <TableCell>{row.Count}</TableCell>
                            <TableCell>{row.sanctionOrderNo}</TableCell>
                            <TableCell>{row.fromScheme}</TableCell>
                            <TableCell>{row.toScheme}</TableCell>
                            <TableCell>{row.userId}</TableCell>
                            <TableCell>{row.dateOfMigrate}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    ) : (
                      <TableBody>
                        <TableRow>
                          <TableCell colSpan={13} align="center">
                            no data found
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    )}
                  </Table>
                </TableContainer>
              )}
              {showhidePay && (
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell colSpan={12} style={{ textAlign: 'center' }}>
                          <b style={{ color: '#3281db' }}>Payment History</b>
                        </TableCell>
                      </TableRow>

                      <TableRow>
                        <TableCell>S.No</TableCell>
                        <TableCell>Sanction No</TableCell>
                        <TableCell>Disbursement Date</TableCell>
                        <TableCell>Account No</TableCell>
                        <TableCell>From</TableCell>
                        <TableCell>To</TableCell>
                        <TableCell>Center Amount(Rs.)</TableCell>
                        <TableCell>State Amount(Rs.)</TableCell>
                        <TableCell>Total(Rs.)</TableCell>
                        <TableCell>Payment Mode</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Reject Reason</TableCell>
                      </TableRow>
                    </TableHead>
                    {paymentDetails.length > 0 ? (
                      <TableBody>
                        {paymentDetails.map((row) => (
                          <TableRow key={row.sno}>
                            <TableCell>{row.Count}</TableCell>
                            <TableCell>{row.sanctionOrderNo}</TableCell>
                            <TableCell>{row.disbursementDate}</TableCell>
                            <TableCell>
                              {' '}
                              <a href="javascript:void(0)" onClick={() => alert(`${row.bankPoAccountNo}`)}>
                                {' '}
                                {row.maskvalueofpo}
                              </a>
                            </TableCell>
                            <TableCell>{row.fromDate}</TableCell>
                            <TableCell>{row.toDate}</TableCell>
                            <TableCell>{row.centerAmountPaid}</TableCell>
                            <TableCell>{row.stateAmountPaid}</TableCell>
                            <TableCell>{row.totalAmount}</TableCell>
                            <TableCell>{row.paymentMode}</TableCell>
                            <TableCell>{row.status}</TableCell>
                            <TableCell>{row.rejectionReason}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    ) : (
                      <TableBody>
                        <TableRow>
                          <TableCell colSpan={13} align="center">
                            no data found
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    )}
                  </Table>
                </TableContainer>
              )}
              {showhideReg && (
                <TableContainer component={Paper}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell colSpan={13} style={{ textAlign: 'center' }}>
                          <b style={{ color: '#3281db' }}>Registration History</b>
                        </TableCell>
                      </TableRow>
                      {/* {registrationDetails.length > 0 && ( */}
                      <TableRow>
                        <TableCell>S.No</TableCell>
                        <TableCell>PFMS ID</TableCell>
                        <TableCell>SCHEME CODE</TableCell>
                        <TableCell>Sanction Order No</TableCell>
                        <TableCell>Uid No</TableCell>
                        <TableCell>Bank Name</TableCell>
                        <TableCell>Account No.</TableCell>
                        <TableCell>IFSC Code</TableCell>
                        <TableCell>File Name</TableCell>
                        <TableCell>Rec Statuc</TableCell>
                        <TableCell>Request Date</TableCell>
                        <TableCell>Error Msg</TableCell>
                      </TableRow>
                    </TableHead>
                    {registrationDetails.length > 0 ? (
                      <TableBody>
                        {registrationDetails.map((row) => (
                          <TableRow key={row.sno}>
                            <TableCell>{row.Count}</TableCell>
                            <TableCell>{row.pfmsId}</TableCell>
                            <TableCell>{row.schemeCode}</TableCell>
                            <TableCell>{row.sanctionOrderNo}</TableCell>
                            <TableCell>
                              {row.aadhaarMask}
                              <a href="javascript:void(0)" onClick={() => alert(`${row.uidNo}`)}>
                                view
                              </a>
                            </TableCell>
                            <TableCell>{row.bankName}</TableCell>
                            <TableCell>{row.bankPoAccountNo}</TableCell>
                            <TableCell>{row.ifscCode}</TableCell>
                            <TableCell>{row.fileName}</TableCell>
                            <TableCell>{row.statusOfRecord}</TableCell>
                            <TableCell>{row.requestDate}</TableCell>
                            <TableCell>{row.cpsmsErrWarStatus}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    ) : (
                      <TableBody>
                        <TableRow>
                          <TableCell colSpan={13} align="center">
                            no data found
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    )}
                  </Table>
                </TableContainer>
              )}
            </>
          </Paper>
        </Modal>

        <Backdrop open={loading} style={{ zIndex: 999, color: '#fff' }}>
          <CircularProgress color="inherit" />
        </Backdrop>
      </MainCard>
    </>
  );
}

export default AdvanceSearch;
