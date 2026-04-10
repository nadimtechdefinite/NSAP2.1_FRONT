import React, { useState, useEffect } from 'react';
import axiosInstance from 'hooks/useAuthTokenUrl';
import './PreviewPage.css';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { getAuthToken, getUserInfo } from 'utils/storageUtils';
import GetAppIcon from '@mui/icons-material/GetApp';
import { Grid, Button , DialogActions,DialogContent,Tooltip,Typography,Dialog,CircularProgress,IconButton,DialogTitle} from '@mui/material';
import config from 'config';
import CloseIcon from '@mui/icons-material/Close';

function View() {
  const [getAllBpl, setAllBpl] = useState([]);
  const [profilePhoto, setProfilePhoto] = useState('');
  const [getAllNfbsData, setAllNfbsData] = useState([]);
  const storedData = localStorage.getItem('applicationNo');
  const parsedData = JSON.parse(storedData);
  const userinfoHeader = getUserInfo();
  const apiBaseUrl = config.API_BASE_URL;
  const [showAadhaar, setShowAadhaar] = useState(false);
  const storedData1 = localStorage.getItem('statusOfBeneficiary');
const [aadhaarData, setAadhaarData] = useState(null);
const [loading, setLoading] = useState(false);
const handleClickOpen = async (rtoken) => {
    const storedData = localStorage.getItem("applicationNo");

    try {
      setLoading(true);
      const applicationNo = JSON.parse(storedData);

      const response = await axiosInstance.post(
        "/beneficiaryRegistration/showUidDetailsByRtoken",
        { rtoken, applicationNo }
      );

      setAadhaarData(response.data);
      setShowAadhaar(true);
    } catch (error) {
      alert("Failed to fetch Aadhaar data");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setShowAadhaar(false);
    setAadhaarData(null);
  };

  let statusOfBeneficiary;
  if (storedData1) {
    statusOfBeneficiary = JSON.parse(storedData1);
  }

  let schemeCode;
  schemeCode = localStorage.getItem('schemeCode');
  const getGithubData = async () => {
    try {
      const registrationDetailsResponse = await axiosInstance.get(`/beneficiaryRegistration/getAllRegistrationDetails/${parsedData}`);
      const allBpl = registrationDetailsResponse.data;

      if (schemeCode === 'NFBS') {
        const nfbsMasterDetailsResponse = await axiosInstance.get(
          `/beneficiaryRegistration/findNfbsMasterDetailsByApplicationNo/${parsedData}`
        );
        const nfbsData = nfbsMasterDetailsResponse.data;

        setAllNfbsData(nfbsData);
      }

      setAllBpl(allBpl);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    getGithubData();
  }, []);

  const reverseDateFormatYYYYMMDDTODDMMYYYY = (dateString) => {
    if (!dateString) return '';
    const [year, month, day] = dateString.split('-');
    return `${day}-${month}-${year}`;
  };
  const sanctionDate = reverseDateFormatYYYYMMDDTODDMMYYYY(getAllBpl.sanctionDate);
  const applicationDate = reverseDateFormatYYYYMMDDTODDMMYYYY(getAllBpl.applicationDate);
  const dateOfBirth = reverseDateFormatYYYYMMDDTODDMMYYYY(getAllBpl.dateOfBirth);
  const consentDate = reverseDateFormatYYYYMMDDTODDMMYYYY(getAllBpl.consentDate);
  const ageCertIssueDate = reverseDateFormatYYYYMMDDTODDMMYYYY(getAllBpl.ageCertIssueDate);
  const incCertIssueDate = reverseDateFormatYYYYMMDDTODDMMYYYY(getAllBpl.incCertIssueDate);
  const resCertIssueDate = reverseDateFormatYYYYMMDDTODDMMYYYY(getAllBpl.resCertIssueDate);
  const disCertIssueDate = reverseDateFormatYYYYMMDDTODDMMYYYY(getAllBpl.disCertIssueDate);
  const deathCertIssueDate = reverseDateFormatYYYYMMDDTODDMMYYYY(getAllBpl.deathCertIssueDate);
  const bankCertIssueDate = reverseDateFormatYYYYMMDDTODDMMYYYY(getAllBpl.bankCertIssueDate);

  const theme = createTheme({
    palette: {
      primary: {
        main: '#1976D2'
      },
      secondary: {
        main: '#FF4081'
      }
    }
  });

  const handleDownload = (filename) => {
    const token = getAuthToken();
    fetch(`${apiBaseUrl}/beneficiaryRegistration/downloadFile/${filename}/${parsedData}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        userInfo: JSON.stringify(userinfoHeader)
      }
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.arrayBuffer();
      })
      .then((data) => {
        const blob = new Blob([data]);
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      })
      .catch((error) => {
        console.error('There was a problem with the fetch operation:', error);
      });
  };

  const handleNfbsDownload = (filename) => {
    const token = getAuthToken();
    fetch(`${apiBaseUrl}/beneficiaryRegistration/downloadNfbsFile/${filename}/${parsedData}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        userInfo: JSON.stringify(userinfoHeader)
      }
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.arrayBuffer();
      })
      .then((data) => {
        const blob = new Blob([data]);
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      })
      .catch((error) => {
        console.error('There was a problem with the fetch operation:', error);
      });
  };

  const handlePrint = () => {
    window.print(); // Call window.print() to trigger the browser's print dialog
  };

  useEffect(() => {
    const fetchProfilePhoto = async (filename) => {
      try {
        const token = getAuthToken(); // Assuming getAuthToken() retrieves the authentication token
        const response = await fetch(`${apiBaseUrl}/beneficiaryRegistration/downloadFile/${filename}/${parsedData}`, {
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

        setProfilePhoto(imageUrl);
      } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
        //setError(error.message);
      }
    };

    if (getAllBpl.beneficiaryPhoto) {
      fetchProfilePhoto(getAllBpl.beneficiaryPhoto);
    }
  }, [getAllBpl.beneficiaryPhoto]);
  return (
      <>
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
            </div>
    <ThemeProvider theme={theme}>
      <div className="myText">
        {/* <h1>Application Form</h1> */}
        <div className="preview-content">
          <h1 style={{ marginLeft: '15px' }}>Application Form</h1>

          <div className="preview-section">
            <h2>Beneficiary Personal Details</h2>
            <Grid container spacing={0}>
              <Grid item xs={12} sm={3}>
                <p>
                  <strong>Application No: {parsedData}</strong>
                </p>
              </Grid>
              <Grid item xs={12} sm={3}>
                <p>
                  <b>Beneficiary Name: </b> {getAllBpl.beneficiaryName}
                </p>
              </Grid>
              <Grid item xs={12} sm={3}>
                <p>
                  <b>Husband/Father Name: </b> {getAllBpl.fatherHusbandName}
                </p>
              </Grid>
              <Grid item xs={12} sm={3}>
                <b>Gender:</b> {getAllBpl.gender === 'M' ? 'MALE' : getAllBpl.gender === 'F' ? 'FEMALE' : 'TRANSGENDER'}
              </Grid>
              <Grid item xs={12} sm={3}>
                {getAllBpl.dateOfBirth ? (
                  <p>
                    <b>Date of Birth: </b> {dateOfBirth}
                  </p>
                ) : (
                  <p>
                    <b>
                      <span>Date of Birth: </span>
                    </b>
                    NA
                  </p>
                )}
              </Grid>
              <Grid item xs={12} sm={3}>
                <p>
                  <b>Age: </b> {getAllBpl.age}
                </p>
              </Grid>
              <Grid item xs={12} sm={3}>
                <p>
                  <b>Mobile No: </b> {getAllBpl.contactPersonMobile}
                </p>
              </Grid>
              <Grid item xs={12} sm={3}>
                <p>
                  <b>State Name: </b> {getAllBpl.stateName}
                </p>
              </Grid>
              <Grid item xs={12} sm={3}>
                <p>
                  <b>District Name: </b> {getAllBpl.districtName}
                </p>
              </Grid>
              <Grid item xs={12} sm={3}>
                <p>
                  <b>Sub District Municipal Area Name: </b> {getAllBpl.subDistrictMunicipalAreaName}
                </p>
              </Grid>
              <Grid item xs={12} sm={3}>
                <p>
                  <b>Gram Panchayat Ward Name: </b> {getAllBpl.gramPanchayatWardName}
                </p>
              </Grid>
              <Grid item xs={12} sm={3}>
                <p>
                  <b>Village Name: </b> {getAllBpl.villageName}
                </p>
              </Grid>
              <Grid item xs={12} sm={3}>
                <p>
                  <b>Habitation Name: </b> {getAllBpl.habitationName}
                </p>
              </Grid>
              <Grid item xs={12} sm={3}>
                <p>
                  <b>Beneficiary No: </b> {getAllBpl.beneficiaryNo}
                </p>
              </Grid>
              <Grid item xs={12} sm={3}>
                <p>
                  <b>Category Name: </b> {getAllBpl.categoryName}
                </p>
              </Grid>
              <Grid item xs={12} sm={3}>
                {getAllBpl.planName ? (
                  <p>
                    <b>Plan Name: </b> {getAllBpl.planName}
                  </p>
                ) : (
                  <p>
                    <b>Plan Name: </b> NA
                  </p>
                )}
              </Grid>
            </Grid>
          </div>
          <div className="preview-section">
            <h2>Beneficiary Bank Details</h2>
            <Grid container spacing={0}>
              <Grid item xs={12} sm={3}>
                {getAllBpl.disbursementCode ? (
                  <p>
                    <b>Disbursement:</b> {getAllBpl.disbursementCode}
                  </p>
                ) : (
                  <p>
                    <b>
                      <span>Disbursement:</span>
                    </b>
                    NA
                  </p>
                )}
              </Grid>
              <Grid item xs={12} sm={3}>
                {getAllBpl.bankPoAccountNo ? (
                  <p>
                    <b>Bank/PO Account No:</b> {getAllBpl.bankPoAccountNo}
                  </p>
                ) : (
                  <p>
                    <b>
                      <span>Bank/PO Account No:</span>
                    </b>
                    NA
                  </p>
                )}
              </Grid>
              <Grid item xs={12} sm={3}>
                {getAllBpl.ifscCode ? (
                  <p>
                    <b>IFSC Code:</b> {getAllBpl.ifscCode}
                  </p>
                ) : (
                  <p>
                    <b>
                      <span>IFSC Code:</span>
                    </b>
                    NA
                  </p>
                )}
              </Grid>
              <Grid item xs={12} sm={3}>
                {getAllBpl.bankTypeName ? (
                  <p>
                    <b>Bank Type:</b> {getAllBpl.bankTypeName}
                  </p>
                ) : (
                  <p>
                    <b>
                      <span>Bank Type:</span>
                    </b>
                    NA
                  </p>
                )}
              </Grid>
              <Grid item xs={12} sm={3}>
                {getAllBpl.bankTypeName ? (
                  <p>
                    <b>Branch Name:</b> {getAllBpl.bankBranchName}
                  </p>
                ) : (
                  <p>
                    <b>
                      <span>Branch Name:</span>
                    </b>
                    NA
                  </p>
                )}
              </Grid>
            </Grid>
          </div>
          <div className="preview-section">
            <h2>Beneficiary Aadhar Details</h2>
            <Grid container spacing={0}>
              <Grid item xs={12} sm={4}>
                {getAllBpl.consentDate ? (
                  <p>
                    <b>Consent Date: </b> {consentDate}
                  </p>
                ) : (
                  <p>
                    <b>
                      <span>Consent Date: </span>
                    </b>
                    NA
                  </p>
                )}
              </Grid>
              <Grid item xs={12} sm={4}>
                <p>
                  <b>Name As Per Aadhaar: </b> {getAllBpl.nameAsPerUid}
                </p>
              </Grid>
              <Grid item xs={12} sm={4}>
               <Button
        variant="contained"
        onClick={() => handleClickOpen(getAllBpl?.rtoken)}
         disabled={loading}
                startIcon={loading && <CircularProgress size={20} color="inherit" />}
      >
        {loading ? "Loading..." : "View Aadhaar"}
      </Button>

      {/* Aadhaar Dialog */}
      <Dialog open={showAadhaar} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle
          sx={{
            m: 0,
            p: 2,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h6">Aadhaar Details</Typography>
          <IconButton onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers>
          {!aadhaarData ? (
            <Typography variant="body2">
              Loading Aadhaar data...
            </Typography>
          ) : (
            <Tooltip title={aadhaarData.ret_data}>
              <Typography
                variant="body1"
                sx={{
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                Aadhaar No.: {aadhaarData.ret_data}
              </Typography>
            </Tooltip>
          )}
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose} color="primary" variant="outlined">
            Close
          </Button>
        </DialogActions>
      </Dialog>
              </Grid>
            </Grid>
          </div>
          <div className="preview-section">
            <h2>Beneficiary BPL Details</h2>
            <Grid container spacing={0}>
              <Grid item xs={12} sm={3}>
                <p>
                  <b>BPL Year: </b> {getAllBpl.bplYear}
                </p>
              </Grid>
              <Grid item xs={12} sm={3}>
                <p>
                  <b>Location: </b> {getAllBpl.bplLocation}
                </p>
              </Grid>
              <Grid item xs={12} sm={3}>
                <p>
                  <b>Family Id No: </b> {getAllBpl.bplFamilyId}
                </p>
              </Grid>
              <Grid item xs={12} sm={3}>
                <p>
                  <b>Member Id: </b> {getAllBpl.bplMemberId}
                </p>
              </Grid>
            </Grid>
          </div>
          {/* Conditional rendering for Sanction Details */}
          {statusOfBeneficiary === 'LEGACY_SO_SAVED' && (
            <div className="preview-section">
              <h2>Beneficiary Sanction Details</h2>
              <Grid container spacing={0}>
                <Grid item xs={12} sm={3}>
                  <p>
                    <b>Sanctioning Authority: </b> {getAllBpl.sanctionAuth}
                  </p>
                </Grid>
                <Grid item xs={12} sm={3}>
                  {getAllBpl.sanctionDate ? (
                    <p>
                      <b>Sanction Date: </b> {sanctionDate}
                    </p>
                  ) : (
                    <p>
                      <b>
                        <span>Sanction Date: </span>
                      </b>
                      NA
                    </p>
                  )}
                </Grid>
              </Grid>
            </div>
          )}
          <div className="preview-section">
            <h2>Beneficiary Other Details</h2>
            <Grid container spacing={0}>
              <Grid item xs={12} sm={3}>
                <p>
                  <b>Address1: </b> {getAllBpl.address1}
                </p>
              </Grid>
              <Grid item xs={12} sm={3}>
                <p>
                  <b>Address2: </b> {getAllBpl.address2}
                </p>
              </Grid>
              <Grid item xs={12} sm={3}>
                <p>
                  <b>Address3: </b> {getAllBpl.address3}
                </p>
              </Grid>
              <Grid item xs={12} sm={3}>
                <p>
                  <b>Pincode: </b> {getAllBpl.pincode}
                </p>
              </Grid>
              <Grid item xs={12} sm={3}>
                <p>
                  <b>Category: </b> {getAllBpl.categoryName}
                </p>
              </Grid>
              <Grid item xs={12} sm={3}>
                <p>
                  <b>Annual Income: </b> {getAllBpl.annualIncome}
                </p>
              </Grid>
              <Grid item xs={12} sm={3}>
                <p>
                  <b>Epic No: </b> {getAllBpl.epicNo}
                </p>
              </Grid>
              <Grid item xs={12} sm={3}>
                <p>
                  <b>Ration Card No: </b> {getAllBpl.rationcardNo}
                </p>
              </Grid>
              {/* <Grid item xs={12} sm={3}>
                {getAllBpl.minorityStatus ? (
                  <p>
                    <b>Minority Status: </b> {String(getAllBpl.minorityStatus === 'Y' ? 'YES' : 'NO')}
                  </p>
                ) : (
                  <p>
                    <b>
                      <span>Minority Status: </span>
                    </b>
                    NA
                  </p>
                )}
              </Grid> */}
              <Grid item xs={12} sm={3}>
                {getAllBpl.widows ? (
                  <p>
                    <b>Widow Status: </b> {String(getAllBpl.widows === 'Y' ? 'YES' : 'NO')}
                  </p>
                ) : (
                  <p>
                    <b>
                      <span>Widow Status: </span>
                    </b>
                    NA
                  </p>
                )}
              </Grid>
              <Grid item xs={12} sm={3}>
                {getAllBpl.applicationDate ? (
                  <p>
                    <b>Application Date: </b> {applicationDate}
                  </p>
                ) : (
                  <p>
                    <b>
                      <span>Application Date: </span>
                    </b>
                    NA
                  </p>
                )}
              </Grid>
            </Grid>
          </div>
          <div className="preview-section">
            <h2>Beneficiary Disability Details</h2>
            {getAllBpl.disabilityStatus === 'Y' && (
              <Grid container spacing={0}>
                <Grid item xs={12} sm={3}>
                  <p>
                    <b>Disability Status: </b> {getAllBpl.disabilityStatus === 'Y' ? 'YES' : 'NO'}
                  </p>
                </Grid>
                <Grid item xs={12} sm={3}>
                  {getAllBpl.disabilityCode ? (
                    <p>
                      <b>Disability 1: </b> {getAllBpl.disabilityCode}
                    </p>
                  ) : (
                    <p>
                      <b>
                        <span>Disability 1: </span>
                      </b>
                      NA
                    </p>
                  )}
                </Grid>
                <Grid item xs={12} sm={3}>
                  {getAllBpl.disabilityPercent ? (
                    <p>
                      <b>Disability Percent 1: </b> {getAllBpl.disabilityPercent}
                    </p>
                  ) : (
                    <p>
                      <b>
                        <span>Disability Percent 1: </span>
                      </b>
                      NA
                    </p>
                  )}
                </Grid>
                <Grid item xs={12} sm={3}>
                  {getAllBpl.disabilityCode1 ? (
                    <p>
                      <b>Disability 2: </b> {getAllBpl.disabilityCode1}
                    </p>
                  ) : (
                    <p>
                      <b>
                        <span>Disability 2: </span>
                      </b>
                      NA
                    </p>
                  )}
                </Grid>
                <Grid item xs={12} sm={3}>
                  {getAllBpl.disabilityPercent1 ? (
                    <p>
                      <b>Disability Percent 2: </b> {getAllBpl.disabilityPercent1}
                    </p>
                  ) : (
                    <p>
                      <b>
                        <span>Disability Percent 2: </span>
                      </b>
                      NA
                    </p>
                  )}
                </Grid>
              </Grid>
            )}

            {getAllBpl.disabilityStatus !== 'Y' && (
              <Grid container spacing={0}>
                <p>
                  <b>Disability Status: </b> {getAllBpl.disabilityStatus === 'Y' ? 'YES' : 'NO'}
                </p>
              </Grid>
            )}
          </div>
          <div className="preview-section">
            <h2>Cerificate Details</h2>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                {getAllBpl.ageCertIssueAuth ? (
                  <p>
                    <b>Age Certificate Authority: </b> {getAllBpl.ageCertIssueAuth}
                  </p>
                ) : (
                  <p>
                    <b>
                      <span>Age Certificate Authority: </span>
                    </b>
                    NA
                  </p>
                )}
              </Grid>
              <Grid item xs={12} sm={4}>
                {getAllBpl.ageCertIssueDate ? (
                  <p>
                    <b>Age Certificate Date: </b> {ageCertIssueDate}
                  </p>
                ) : (
                  <p>
                    <b>
                      <span>Age Certificate Date: </span>
                    </b>
                    NA
                  </p>
                )}
              </Grid>
              <Grid item xs={12} sm={4}>
                {getAllBpl.ageCertificatePhoto ? (
                  <p>
                    <b>
                      <span>Age Certificate: </span>
                    </b>
                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        handleDownload(getAllBpl.ageCertificatePhoto);
                      }}
                      style={{ textDecoration: 'none', color: 'blue' }}
                    >
                      <GetAppIcon style={{ verticalAlign: 'middle' }} />
                    </a>
                  </p>
                ) : (
                  <p>
                    <b>
                      <span>Age Certificate: </span>
                    </b>
                    No Document
                  </p>
                )}
              </Grid>
              <Grid item xs={12} sm={4}>
                {getAllBpl.incCertIssueAuth ? (
                  <p>
                    <b>Income Certificate Authority: </b> {getAllBpl.incCertIssueAuth}
                  </p>
                ) : (
                  <p>
                    <b>
                      <span>Income Certificate Authority: </span>
                    </b>
                    NA
                  </p>
                )}
              </Grid>
              <Grid item xs={12} sm={4}>
                {getAllBpl.incCertIssueDate ? (
                  <p>
                    <b>Income Certificate Date: </b> {incCertIssueDate}
                  </p>
                ) : (
                  <p>
                    <b>
                      <span>Income Certificate Date: </span>
                    </b>
                    NA
                  </p>
                )}
              </Grid>
              <Grid item xs={12} sm={4}>
                {getAllBpl.incomeCertificatePhoto ? (
                  <p>
                    <b>
                      <span>Income Certificate</span>
                    </b>
                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        handleDownload(getAllBpl.incomeCertificatePhoto);
                      }}
                      style={{ textDecoration: 'none', color: 'blue' }}
                    >
                      <GetAppIcon style={{ verticalAlign: 'middle' }} />
                    </a>
                  </p>
                ) : (
                  <p>
                    <b>
                      <span>Income Certificate</span>
                    </b>
                    : No Document
                  </p>
                )}
              </Grid>
              <Grid item xs={12} sm={4}>
                {getAllBpl.resCertIssueAuth ? (
                  <p>
                    <b>Residence Certificate Authority: </b> {getAllBpl.resCertIssueAuth}
                  </p>
                ) : (
                  <p>
                    <b>
                      <span>Residence Certificate Authority: </span>
                    </b>
                    NA
                  </p>
                )}
              </Grid>
              <Grid item xs={12} sm={4}>
                {getAllBpl.resCertIssueDate ? (
                  <p>
                    <b>Residence Certificate Date: </b> {resCertIssueDate}
                  </p>
                ) : (
                  <p>
                    <b>
                      <span>Residence Certificate Date: </span>
                    </b>
                    NA
                  </p>
                )}
              </Grid>
              <Grid item xs={12} sm={4}>
                {getAllBpl.resCertificatePhoto ? (
                  <p>
                    <b>
                      <span>Residence Certificate</span>
                    </b>
                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        handleDownload(getAllBpl.resCertificatePhoto);
                      }}
                      style={{ textDecoration: 'none', color: 'blue' }}
                    >
                      <GetAppIcon style={{ verticalAlign: 'middle' }} />
                    </a>
                  </p>
                ) : (
                  <p>
                    <b>
                      <span>Residence Certificate</span>
                    </b>
                    : No Document
                  </p>
                )}
              </Grid>
              <Grid item xs={12} sm={4}>
                {getAllBpl.disCertIssueAuth ? (
                  <p>
                    <b>Disability Certificate Authority: </b> {getAllBpl.disCertIssueAuth}
                  </p>
                ) : (
                  <p>
                    <b>
                      <span>Disability Certificate Authority: </span>
                    </b>
                    NA
                  </p>
                )}
              </Grid>
              <Grid item xs={12} sm={4}>
                {getAllBpl.disCertIssueDate ? (
                  <p>
                    <b>Disability Certificate Date: </b> {disCertIssueDate}
                  </p>
                ) : (
                  <p>
                    <b>
                      <span>Disability Certificate Date: </span>
                    </b>
                    NA
                  </p>
                )}
              </Grid>
              <Grid item xs={12} sm={4}>
                {getAllBpl.disabilityCertificatePhoto ? (
                  <p>
                    <b>
                      <span>Disability Certificate</span>
                    </b>
                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        handleDownload(getAllBpl.disabilityCertificatePhoto);
                      }}
                      style={{ textDecoration: 'none', color: 'blue' }}
                    >
                      <GetAppIcon style={{ verticalAlign: 'middle' }} />
                    </a>
                  </p>
                ) : (
                  <p>
                    <b>
                      <span>Disability Certificate: </span>
                    </b>
                    No Document
                  </p>
                )}
              </Grid>
              <Grid item xs={12} sm={4}>
                {getAllBpl.deathCertIssueAuth ? (
                  <p>
                    <b>Death Certificate Authority: </b> {getAllBpl.deathCertIssueAuth}
                  </p>
                ) : (
                  <p>
                    <b>
                      <span>Death Certificate Authority: </span>
                    </b>
                    NA
                  </p>
                )}
              </Grid>
              <Grid item xs={12} sm={4}>
                {getAllBpl.deathCertIssueDate ? (
                  <p>
                    <b>Death Certificate Date: </b> {deathCertIssueDate}
                  </p>
                ) : (
                  <p>
                    <b>
                      <span>Death Certificate Date: </span>
                    </b>
                    NA
                  </p>
                )}
              </Grid>
              <Grid item xs={12} sm={4}>
                {getAllBpl.deatCertificatePhoto ? (
                  <p>
                    <b>
                      <span>Husband Death Certificate</span>
                    </b>
                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        handleDownload(getAllBpl.deatCertificatePhoto);
                      }}
                      style={{ textDecoration: 'none', color: 'blue' }}
                    >
                      <GetAppIcon style={{ verticalAlign: 'middle' }} />
                    </a>
                  </p>
                ) : (
                  <p>
                    <b>
                      <span>Husband Death Certificate:</span>
                    </b>
                    No Document
                  </p>
                )}
              </Grid>
              <Grid item xs={12} sm={4}>
                {getAllBpl.bankCertIssueAuth ? (
                  <p>
                    <b>Bank Passbook Authority: </b> {getAllBpl.bankCertIssueAuth}
                  </p>
                ) : (
                  <p>
                    <b>
                      <span>Bank Passbook Authority: </span>
                    </b>
                    NA
                  </p>
                )}
              </Grid>
              <Grid item xs={12} sm={4}>
                {getAllBpl.bankCertIssueDate ? (
                  <p>
                    <b>Bank Passbook Date: </b> {bankCertIssueDate}
                  </p>
                ) : (
                  <p>
                    <b>
                      <span>Bank Passbook Date: </span>
                    </b>
                    NA
                  </p>
                )}
              </Grid>
              <Grid item xs={12} sm={4}>
                {getAllBpl.bankCertificatePhoto ? (
                  <p>
                    <b>
                      <span>Bank Passbook</span>
                    </b>
                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        handleDownload(getAllBpl.bankCertificatePhoto);
                      }}
                      style={{ textDecoration: 'none', color: 'blue' }}
                    >
                      <GetAppIcon style={{ verticalAlign: 'middle' }} />
                    </a>
                  </p>
                ) : (
                  <p>
                    <b>
                      <span>Bank Passbook: </span>
                    </b>
                    No Document
                  </p>
                )}
              </Grid>
              <Grid item xs={12} sm={4}>
                {getAllBpl.beneficiaryPhoto ? (
                  <div>
                    <p>
                      <b>
                        <span>Beneficiary Photo</span>
                      </b>
                    </p>
                    <img src={profilePhoto} alt="Profile" style={{ width: '120px', height: '120px' }} />
                  </div>
                ) : (
                  <p>
                    <b>
                      <span>Beneficiary Photo: </span>
                    </b>
                    No Document
                  </p>
                )}
              </Grid>
            </Grid>
          </div>
          {schemeCode === 'NFBS' && (
            <div className="preview-section">
              <h2>Details of Decesaed</h2>
              <Grid container spacing={0}>
                <Grid item xs={12} sm={3}>
                  {getAllNfbsData.stateName ? (
                    <p>
                      <b>State Name: </b> {getAllNfbsData.stateName}
                    </p>
                  ) : (
                    <p>
                      <b>
                        <span>State Name: </span>
                      </b>
                      NA
                    </p>
                  )}
                </Grid>
                <Grid item xs={12} sm={3}>
                  {getAllNfbsData.districtName ? (
                    <p>
                      <b>District Name: </b> {getAllNfbsData.districtName}
                    </p>
                  ) : (
                    <p>
                      <b>
                        <span>District Name: </span>
                      </b>
                      NA
                    </p>
                  )}
                </Grid>
                <Grid item xs={12} sm={3}>
                  {getAllNfbsData.subDistrictMunicipalAreaName ? (
                    <p>
                      <b>Sub District Municipal Area Name: </b> {getAllNfbsData.subDistrictMunicipalAreaName}
                    </p>
                  ) : (
                    <p>
                      <b>
                        <span>Sub District Municipal Area Name: </span>
                      </b>
                      NA
                    </p>
                  )}
                </Grid>
                <Grid item xs={12} sm={3}>
                  {getAllNfbsData.gramPanchayatWardName ? (
                    <p>
                      <b>Gram Panchayat Ward Name: </b> {getAllNfbsData.gramPanchayatWardName}
                    </p>
                  ) : (
                    <p>
                      <b>
                        <span>Gram Panchayat Ward Name: </span>
                      </b>
                      NA
                    </p>
                  )}
                </Grid>
                <Grid item xs={12} sm={3}>
                  {getAllNfbsData.villageName ? (
                    <p>
                      <b>Village Name: </b> {getAllNfbsData.villageName}
                    </p>
                  ) : (
                    <p>
                      <b>
                        <span>Village Name: </span>
                      </b>
                      NA
                    </p>
                  )}
                </Grid>
                <Grid item xs={12} sm={3}>
                  {getAllNfbsData.habitationName ? (
                    <p>
                      <b>Habitation Name: </b> {getAllNfbsData.habitationName}
                    </p>
                  ) : (
                    <p>
                      <b>
                        <span>Habitation Name: </span>
                      </b>
                      NA
                    </p>
                  )}
                </Grid>
                <Grid item xs={12} sm={3}>
                  {getAllNfbsData.firstName1 ? (
                    <p>
                      <b>First Name: </b> {getAllNfbsData.firstName1}
                    </p>
                  ) : (
                    <p>
                      <b>
                        <span>First Name: </span>
                      </b>
                      NA
                    </p>
                  )}
                </Grid>
                <Grid item xs={12} sm={3}>
                  {getAllNfbsData.middleName1 ? (
                    <p>
                      <b>Middle Name: </b> {getAllNfbsData.middleName1}
                    </p>
                  ) : (
                    <p>
                      <b>
                        <span>Middle Name: </span>
                      </b>
                      NA
                    </p>
                  )}
                </Grid>
                <Grid item xs={12} sm={3}>
                  {getAllNfbsData.lastName1 ? (
                    <p>
                      <b>Last Name: </b> {getAllNfbsData.lastName1}
                    </p>
                  ) : (
                    <p>
                      <b>
                        <span>Last Name: </span>
                      </b>
                      NA
                    </p>
                  )}
                </Grid>
                <Grid item xs={12} sm={3}>
                  <p>
                    <b>Father Husband Name: </b> {getAllNfbsData.fatherHusbandName1}
                  </p>
                </Grid>
                <Grid item xs={12} sm={3}>
                  <p>
                    <b>Gender: </b> {getAllNfbsData.gender1 === 'M' ? 'MALE' : getAllNfbsData.gender1 === 'F' ? 'FEMALE' : 'TRANSGENDER'}
                  </p>
                </Grid>
                <Grid item xs={12} sm={3}>
                  <p>
                    <b>Date of Death: </b> {reverseDateFormatYYYYMMDDTODDMMYYYY(getAllNfbsData.dateOfDeath)}
                  </p>
                </Grid>
              </Grid>
              <h2>BPL Details of Decesaed</h2>

              <Grid container spacing={0}>
                <Grid item xs={12} sm={3}>
                  <p>
                    <b>BPL Year:</b> {getAllNfbsData.bplYearNfbs}
                  </p>
                </Grid>
                <Grid item xs={12} sm={3}>
                  <p>
                    <b>Location:</b> {getAllNfbsData.bplLocationNfbs}
                  </p>
                </Grid>
                <Grid item xs={12} sm={3}>
                  <p>
                    <b>Family Id No:</b> {getAllNfbsData.bplFamilyIdNfbs}
                  </p>
                </Grid>
                <Grid item xs={12} sm={3}>
                  <p>
                    <b>Member Id:</b> {getAllNfbsData.bplMemberIdNfbs}
                  </p>
                </Grid>

                {getAllNfbsData.isAuthorizeCert === 'Y' && (
                  <Grid container spacing={0}>
                    <Grid item xs={12} sm={3}>
                      <p>
                        <b>Authorization Certificate Status: </b> {getAllNfbsData.isAuthorizeCert === 'Y' ? 'YES' : 'NO'}
                      </p>
                    </Grid>
                    <Grid item xs={12} sm={3}>
                      {getAllNfbsData.authorizeCertIssueDate ? (
                        <p>
                          <b>Date of Issue: </b> {reverseDateFormatYYYYMMDDTODDMMYYYY(getAllNfbsData.authorizeCertIssueDate)}
                        </p>
                      ) : (
                        <p>
                          <b>
                            <span>Date of Issue: </span>
                          </b>
                          NA
                        </p>
                      )}
                    </Grid>
                    <Grid item xs={12} sm={3}>
                      {getAllNfbsData.authorizeCertIssueAuth ? (
                        <p>
                          <b>Issuing Authority: </b> {getAllNfbsData.authorizeCertIssueAuth}
                        </p>
                      ) : (
                        <p>
                          <b>
                            <span>Issuing Authority: </span>
                          </b>
                          NA
                        </p>
                      )}
                    </Grid>

                    <Grid item xs={12} sm={4}>
                      {getAllNfbsData.authorizeCertPhoto ? (
                        <p>
                          <b>
                            <span>Authorization Certificate</span>
                          </b>
                          <a
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              handleNfbsDownload(getAllNfbsData.authorizeCertPhoto);
                            }}
                            style={{ textDecoration: 'none', color: 'blue' }}
                          >
                            <GetAppIcon style={{ verticalAlign: 'middle' }} />
                          </a>
                        </p>
                      ) : (
                        <p>
                          <b>
                            <span>Authorization Certificate: </span>
                          </b>
                          No Document
                        </p>
                      )}
                    </Grid>
                  </Grid>
                )}

                {getAllNfbsData.isAuthorizeCert !== 'Y' && (
                  <Grid container spacing={0}>
                    <p>
                      <b>Authorization Certificate Status: </b> {getAllNfbsData.isAuthorizeCert === 'Y' ? 'YES' : 'NO'}
                    </p>
                  </Grid>
                )}
              </Grid>
              <h2>Address Details of Decesaed</h2>
              <Grid container spacing={0}>
                <Grid item xs={12} sm={3}>
                  {getAllNfbsData.addressNfbs1 ? (
                    <p>
                      <b>Address1: </b> {getAllNfbsData.addressNfbs1}
                    </p>
                  ) : (
                    <p>
                      <b>
                        <span>Address1: </span>
                      </b>
                      NA
                    </p>
                  )}
                </Grid>
                <Grid item xs={12} sm={3}>
                  {getAllNfbsData.addressNfbs2 ? (
                    <p>
                      <b>Address2: </b> {getAllNfbsData.addressNfbs2}
                    </p>
                  ) : (
                    <p>
                      <b>
                        <span>Address2: </span>
                      </b>
                      NA
                    </p>
                  )}
                </Grid>
                <Grid item xs={12} sm={3}>
                  {getAllNfbsData.addressNfbs3 ? (
                    <p>
                      <b>Address3: </b> {getAllNfbsData.addressNfbs3}
                    </p>
                  ) : (
                    <p>
                      <b>
                        <span>Address3: </span>
                      </b>
                      NA
                    </p>
                  )}
                </Grid>
                <Grid item xs={12} sm={3}>
                  {getAllNfbsData.pincodeNfbs ? (
                    <p>
                      <b>Pincode: </b> {getAllNfbsData.pincodeNfbs}
                    </p>
                  ) : (
                    <p>
                      <b>
                        <span>Pincode: </span>
                      </b>
                      NA
                    </p>
                  )}
                </Grid>
              </Grid>
            </div>
          )}
        </div>
      </div>
      <div className="myText">
        {/* Add a print button */}
        <Button variant="contained" color="primary" onClick={handlePrint}>
          Print
        </Button>
      </div>
    </ThemeProvider>
    </>
  );
}

export default View;
