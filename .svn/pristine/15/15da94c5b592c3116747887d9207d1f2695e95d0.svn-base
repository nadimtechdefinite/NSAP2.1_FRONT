import React, { useEffect, useState, useRef } from 'react';
import MainCard from 'ui-component/cards/MainCard';

import {
  Button,
  Grid,
  TextField,
  Backdrop,
  Snackbar,
  CircularProgress,
  InputLabel,
  Select,
  MenuItem,
  FormControl,
  Alert
} from '@mui/material';
import SubDistrictCommon from 'components/common/SubDistrictCommon';
import axiosInstance from 'hooks/useAuthTokenUrl';
import BankTypeList from 'components/form_components/BankTypeList';
import BankNameList from 'components/form_components/BankNameList';
import { List } from '@mui/material';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import ListItemText from '@material-ui/core/ListItemText';
import { DataGrid } from '@mui/x-data-grid';
import { getSignedXMLFile } from 'components/digitalSignature/getSignedXMLFile';
// import { black } from 'material-ui/styles/colors';
export default function DigitalSignatureRegistration() {
  const [snackbar, setSnackbar] = React.useState(null);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [issuer, setIssuer] = useState('');
  const [signer, setSigner] = useState('');
  const handleCloseSnackbar = () => setSnackbar(null);
  const [locationOptionValues, setLocationOptionValues] = useState({});
  const subDistrictCommonRef = React.createRef();
  // const [formInput, setFormInput] = useState({});
  const [bankType, setBankType] = useState();
  const popperRef = useRef(null);
  // const [inputText, setInputText] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [ifscCode, setIfscCodeData] = useState();
  const [bankCode, setBankCode] = useState([]);
  const [maxAmountValue, setMaxAmountValue] = useState('');
  const [minAmountValue, setMinAmountValue] = useState('0');
  const [accountValue, setAccountValue] = useState('');
  const [accountNameValue, setAccountNameValue] = useState('');
  const [designationValue, setDesignationValue] = useState('');
  const [departmentValue, setDepartmentValue] = useState('');
  const [subDepartmentValue, setSubDepartmentValue] = useState('');
  const [accountType, setAccountType] = useState('');
  const [mobileValue, setMobileValue] = useState('');
  const [emailValue, setEmailValue] = useState('');
  const [digitalSignatureData, setDigitalSignatureData] = useState([]);
  const [xmlData, setXMLData] = useState({});
  const [fettchData, setFettchData] = useState(true);
  const [error, setError] = useState(false);
  const [deviceId, setDeviceId] = useState('');

  const pendingRecordColumn = [
    { field: 'id', headerName: 'Registration Id', flex: 1, editable: false },
    { field: 'certName', headerName: 'Name', flex: 1, editable: false },
    { field: 'certSerialNo', headerName: 'Serial No', flex: 1, editable: false },
    { field: 'validFrom', headerName: 'Valid From', flex: 1, editable: false },
    { field: 'validTo', headerName: 'Valid Upto', flex: 1, editable: false },
    { field: 'msgId', headerName: 'File Name', flex: 1, editable: false },
    { field: 'status', headerName: 'Approved Status', flex: 1, editable: false },
    // {
    //   field: '',headerName: 'Action',width: 230,headerAlign: 'center',
    //   renderCell: (params) => (
    //     <>
    //     {!params.row.signedStatus &&  {
    //       Object.keys(xmlData).length > 0?
    // (<Button variant="outlined" color="primary" style={{ cursor: 'pointer', fontSize: '12px',  marginRight: '8px' }}
    //           onClick={(e) => signXMLFile(e, params.row.id,params.row.msgId)} >
    //           {/* VIEW */}
    //   confirm
    // </Button>
    // ):
    // (<Button variant="outlined" color="primary" style={{ cursor: 'pointer', fontSize: '12px',  marginRight: '8px' }}
    //           onClick={(e) => getXMLFile(e, params.row.id,params.row.msgId)} >
    //           {/* VIEW */}
    //   Sign File
    // </Button>)

    // }}
    // <Button variant="outlined" color="primary" style={{ cursor: 'pointer', fontSize: '12px',  marginRight: '8px' }}
    //           onClick={(e) => updateSignature(e, params.row.id,params.row.msgId)} >
    //           {/* VIEW */}
    //   Update
    // </Button>
    // </>
    //   ),
    // }
    {
      field: '',
      headerName: 'Action',
      width: 230,
      headerAlign: 'center',
      renderCell: (params) => (
        <>
          {params.row.signedStatus ? (
            <Button
              variant="outlined"
              color="primary"
              style={{ cursor: 'pointer', fontSize: '12px', marginRight: '8px' }}
              // onClick={(e) => signXMLFile(e, params.row.id, params.row.msgId)}
            >
              Signed
            </Button>
          ) : Object.keys(xmlData).length > 0 ? (
            <Button
              variant="outlined"
              color="primary"
              style={{ cursor: 'pointer', fontSize: '12px', marginRight: '8px' }}
              onClick={(e) => signXMLFile(e, params.row.id, params.row.msgId)}
            >
              Confirm
            </Button>
          ) : (
            <Button
              variant="outlined"
              color="primary"
              style={{ cursor: 'pointer', fontSize: '12px', marginRight: '8px' }}
              onClick={(e) => getXMLFile(e, params.row.id, params.row.msgId)}
            >
              Sign File
            </Button>
          )}

          <Button
            variant="outlined"
            color="primary"
            style={{ cursor: 'pointer', fontSize: '12px', marginRight: '8px' }}
            onClick={(e) => updateSignature(e, params.row.id, params.row.msgId)}
          >
            Update
          </Button>
        </>
      )
    }
  ].filter(Boolean);
  const handleLocationValuesChange = (newLocOptionValues) => {
    setLocationOptionValues(newLocOptionValues);
  };

  useEffect(() => {
    if (fettchData) {
      userPendingRequest();
    }

    // Fetch data when component mounts
  }, []);
  useEffect(() => {}, [digitalSignatureData]);
  useEffect(() => {}, [bankType]);
  useEffect(() => {
    // console.log(Object.keys(xmlData).length );
  }, [xmlData]);

  const fetchData = async () => {
    try {
      setLoading(true);
      // connst response = await fetch('https://localhost:8019/signer/initialize');
      const response = await fetch('http://localhost:8019/signer/initialize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json, text/javascript, */*; q=0.01', // Add any other required headers here
          'Accept-Language': 'en-US,en;q=0.5',
          'Accept-Encoding': 'gzip, deflate, br',
          Origin: null,
          'Sec-Fetch-Dest': 'empty',
          'Sec-Fetch-Mode': 'cors',
          'Sec-Fetch-Site': 'cross-site'
        }
      });
      const jsonData = await response.json();
      // console.log(jsonData);
      if (jsonData.status === 'error') {
        setSnackbar({ children: '' + JSON.stringify(jsonData.errorMessage), severity: 'error' });
        await new Promise((resolve) => setTimeout(resolve, 1250));
        // alert(jsonData.errorMessage);
      }
      if (jsonData.initialized) {
        // const response = await fetch('https://localhost:8019/signer/getCertificate');
        const response1 = await fetch('http://localhost:8019/signer/getCertificate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json, text/javascript, */*; q=0.01', // Add any other required headers here
            'Accept-Language': 'en-US,en;q=0.5',
            'Accept-Encoding': 'gzip, deflate, br',
            Origin: null,
            'Sec-Fetch-Dest': 'empty',
            'Sec-Fetch-Mode': 'cors',
            'Sec-Fetch-Site': 'cross-site'
          }
        });
        const jsonData1 = await response1.json();
        // console.log("data1-----"+JSON.stringify(jsonData1));
        setData(jsonData1.certificates[0]);
      }
    } catch (error) {
      setSnackbar({
        children:
          'NICDSign client is not installed or running.If NICDSign client is already installed, remove and reconnect the token before trying again',
        severity: 'error'
      });
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
      logout();
    }
  };

  const logout = async () => {
    try {
      const response1 = await fetch('http://localhost:8019/signer/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json, text/javascript, */*; q=0.01', // Add any other required headers here
          'Accept-Language': 'en-US,en;q=0.5',
          'Accept-Encoding': 'gzip, deflate, br',
          Origin: null,
          'Sec-Fetch-Dest': 'empty',
          'Sec-Fetch-Mode': 'cors',
          'Sec-Fetch-Site': 'cross-site'
        }
      });
      const jsonData1 = await response1.json();
      // alert(JSON.stringify(jsonData1.status));
      setSnackbar({ children: 'DSC logout :' + JSON.stringify(jsonData1.status), severity: 'success' });
    } catch (error) {
      setSnackbar({
        children:
          'NICDSign client is not installed or running.If NICDSign client is already installed, remove and reconnect the token before trying again',
        severity: 'error'
      });
    }
  };
  const handleSelectbank = (state) => {
    setBankType(state);
  };
  const handleSelectbankName = (bankName) => {
    setBankCode(bankName);
  };
  const handleUpdate = async (e) => {
    try {
      e.preventDefault();
      const selectedStateId = locationOptionValues.stateCode;
      const selectedDistrictId = locationOptionValues.districtCode;
      const selectedAreaId = locationOptionValues.ruralUrbanArea;
      const selectedSubDistrictId = locationOptionValues.subDistrictMunicipalAreaCode;
      var certData = {
        certname: data.subject,
        serialNumber: data.serialNumber,
        validFrom: data.notBefore,
        validTo: data.notAfter,
        certificate: data.certificate,
        issue: issuer,
        certIssuer: data.issuer
      };
      var location = { stateID: selectedStateId, districtID: selectedDistrictId, area: selectedAreaId, subDistID: selectedSubDistrictId };
      var othrData = {
        account: accountValue,
        accountName: accountNameValue,
        accountType: accountType,
        bankType: bankType,
        bankCode: bankCode,
        ifscCode: ifscCode,
        designation: designationValue,
        department: departmentValue,
        subDepartment: subDepartmentValue,
        mobileNo: mobileValue,
        emailId: emailValue,
        noOfSign: signer,
        minAmount: minAmountValue,
        maxAmount: maxAmountValue,
        status: data ? 'ACTIVE' : ''
      };
      var deviceid = { deviceId: deviceId };
      const body = { ...location, ...certData, ...othrData, ...deviceid };
      // console.log("form data-------"+JSON.stringify(body));
      const getUrl = `/digitalSignature/update`;
      // console.log("aab");

      setLoading(true);
      const response = await axiosInstance.post(getUrl, JSON.stringify(body));
      if (response.status >= 200 && response.status < 300) {
        setDigitalSignatureData(response.data);
        return response.data;
      } else {
        return false;
      }
    } catch (error) {
      console.error('An error occurred while submitting the form:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };
  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      // if (subDistrictCommonRef.current && !(Object.values(optionValues).some(value => value !== null))) {
      // if(subDistrictCommonRef.current.validateSelectedDropDown()!='RJ'){
      //   return false;
      // }
      // }
      if (data) {
        const selectedStateId = locationOptionValues.stateCode;
        const selectedDistrictId = locationOptionValues.districtCode;
        const selectedAreaId = locationOptionValues.ruralUrbanArea;
        const selectedSubDistrictId = locationOptionValues.subDistrictMunicipalAreaCode;
        var certData = {
          certname: data.subject,
          serialNumber: data.serialNumber,
          validFrom: data.notBefore,
          validTo: data.notAfter,
          certificate: data.certificate,
          issue: issuer,
          certIssuer: data.issuer
        };
        var location = { stateID: selectedStateId, districtID: selectedDistrictId, area: selectedAreaId, subDistID: selectedSubDistrictId };
        var othrData = {
          account: accountValue,
          accountName: accountNameValue,
          accountType: accountType,
          bankType: bankType,
          bankCode: bankCode,
          ifscCode: ifscCode,
          designation: designationValue,
          department: departmentValue,
          subDepartment: subDepartmentValue,
          mobileNo: mobileValue,
          emailId: emailValue,
          noOfSign: signer,
          minAmount: minAmountValue,
          maxAmount: maxAmountValue,
          status: data ? 'ACTIVE' : ''
        };

        const body = { ...location, ...certData, ...othrData };
        // console.log("form data-------"+JSON.stringify(body));
        const getUrl = `/digitalSignature/registration`;
        // console.log("aab");

        setLoading(true);
        const response = await axiosInstance.post(getUrl, JSON.stringify(body));
        if (response.status >= 200 && response.status < 300) {
          setDigitalSignatureData(response.data);
          return response.data;
        } else {
          return false;
        }
      } else {
        setSnackbar({ children: 'Digital Signature Data is Required', severity: 'error' });
      }
    } catch (error) {
      console.error('An error occurred while submitting the form:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };
  const signXMLFile = async (e, id, msgId) => {
    e.preventDefault();
    try {
      const xml = await getSignedXMLFile(xmlData);
      // console.log("final Data----"+xml);
      const body = { id: id, msgId: msgId, xmlData: xml };
      const getUrl = `/digitalSignature/saveSignedFile`;
      setLoading(true);
      const response = await axiosInstance.post(getUrl, JSON.stringify(body));
      if (response.status >= 200 && response.status < 300) {
        // setXMLData(response.data);
        setDigitalSignatureData(response.data);
        setSnackbar({ children: 'File Signed Successfully, Please Contact to State Nodel Officer For Approval ', severity: 'success' });
        return response.data;
      } else {
        return false;
      }
    } catch (error) {
      console.error('An error occurred while XML Data:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };
  const getXMLFile = async (e, id, msgId) => {
    e.preventDefault();
    try {
      const body = { id: id, msgId: msgId };
      const getUrl = `/digitalSignature/getXMLData`;
      setLoading(true);
      const response = await axiosInstance.post(getUrl, JSON.stringify(body));
      if (response.status >= 200 && response.status < 300) {
        setXMLData(response.data);
        return response.data;
      } else {
        return false;
      }
    } catch (error) {
      setSnackbar({ children: 'XML file Not Found', severity: 'error' });
      // console.error("An error occurred while XML Data:", error);
      return false;
    } finally {
      setLoading(false);
    }
  };
  const updateSignature = async (e, id, msgId) => {
    e.preventDefault();
    try {
      setFettchData(false);
      setDigitalSignatureData([]);
      fetchData();
      setDeviceId(id);
      console.log('----' + id + msgId);
      //     const xml=await getSignedXMLFile(xmlData);
      // console.log("final Data----"+xml);
      //      const body={id:id,msgId:msgId,xmlData:xml};
      //      const getUrl=`/digitalSignature/saveSignedFile`;
      //     setLoading(true);
      //     const response = await axiosInstance.post(getUrl,JSON.stringify(body));
      //     if (response.status >= 200 && response.status < 300) {
      //       setXMLData(response.data);
      //       return response.data
      //     } else {

      //       return false;
      //     }
    } catch (error) {
      console.error('An error occurred while XML Data:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };
  const userPendingRequest = async () => {
    // e.preventDefault();
    try {
      const getUrl = `/digitalSignature/getUserRegPendingReq`;
      setLoading(true);
      const response = await axiosInstance.get(getUrl);
      if (response.status >= 200 && response.status < 300) {
        if (response.data) {
          setDigitalSignatureData(response.data);
          // console.log("123456----"+response.data);
          setLoading(false);
          return response.data;
        } else {
          fetchData();
          return response.data;
        }

        // fetchData();
        // return response.data
      } else {
        return false;
      }
    } catch (error) {
      console.error('An error occurred while XML Data:', error);
      return false;
    } finally {
      // setLoading(false);
      // console.log("length---"+digitalSignatureData.length)
      // if(digitalSignatureData==0){
      //   fetchData();
      // }
    }
  };

  const handleIssuerChange = (event) => {
    setIssuer(event.target.value);
  };
  const handleSignaturiesChange = (event) => {
    setSigner(event.target.value);
  };
  const handleAccountTypeChange = (event) => {
    setAccountType(event.target.value);
  };
  const [allIfscCodeData, setAllIfscCodeData] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);

  const fetchIfscCodeData = async (inputValue) => {
    try {
      if (bankCode.length == 0 || bankType == '') {
        setSnackbar({ children: 'Please select Bank Type & Bank Name', severity: 'error' });
        return;
      }
      if (inputValue.length >= 3) {
        const findIfscCodeUrl = `/common/findAllIfscCodeByDetails/${inputValue}/${bankCode}/${bankType}/${locationOptionValues.stateCode}`;
        const response = await axiosInstance.get(findIfscCodeUrl);
        // console.log("++++ :: "+response.data.length)
        if (response.data.length != 0) {
          // setError(false);
          setAllIfscCodeData(Array.isArray(response.data) ? response.data : [response.data]);

          // setAllIfscCodeData(Array.isArray(response.data) ? response.data : []);
        } else {
          //alert("Not valid Ifsc Code !");
          setError(true);
          setAllIfscCodeData([]);
          setSnackbar({ children: 'Not valid Ifsc Code', severity: 'error' });
        }
      } else if (inputValue.length < 3) {
        //alert(allIfscCodeData.length);
        setError(true);
        setAllIfscCodeData([]);
      }
    } catch (error) {
      setError(true);
      setAllIfscCodeData([]);
      console.error('Error fetching ifsc data:', error);
    }
  };

  const handleInputChange = (value, e) => {
    //console.log("san order is: "+id+" --- ifsc code is: "+value);
    e.preventDefault();
    setAnchorEl(e.currentTarget);
    setSearchResults(value);
    fetchIfscCodeData(value);
    validateIFSC(value);
  };

  const handleListItemClick = (selectedData) => {
    setSearchResults(selectedData.ifscCode); // or any other property you want to use as the selected value
    setAnchorEl(null); // Close the dropdown menu
    setError(false); // Reset validation error
    setIfscCodeData(selectedData.ifscCode);
    validateIFSC(selectedData.ifscCode);
  };
  const handleClickOutside = (event) => {
    if (popperRef.current && !popperRef.current.contains(event.target)) {
      setAnchorEl(null);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [searchResults, anchorEl]);
  const open = Boolean(anchorEl);

  const validateIFSC = (ifscCode) => {
    if (ifscCode.length !== 11) {
      setError(true); // Set error state if validation fails
    } else {
      setError(false); // Clear error state if validation passes
    }
  };
  const handleMaxAmountChange = (event) => {
    const input = event.target.value;
    const numericInput = input.replace(/\D/g, '');
    setMaxAmountValue(numericInput);
  };
  const handleMinAmountChange = () => {
    setMinAmountValue('0');
  };
  const handleAccountChange = (event) => {
    const input = event.target.value;
    const numericInput = input.replace(/\D/g, '');
    setAccountValue(numericInput);
  };
  const handleAccountNameChange = (event) => {
    setAccountNameValue(event.target.value);
  };
  const handleDesignationChange = (event) => {
    setDesignationValue(event.target.value);
  };
  const handleDepartmentChange = (event) => {
    setDepartmentValue(event.target.value);
  };
  const handleSubDepartmentChange = (event) => {
    setSubDepartmentValue(event.target.value);
  };
  const handleMobileChange = (event) => {
    setMobileValue(event.target.value);
  };
  const handleEmailChange = (event) => {
    setEmailValue(event.target.value);
  };
  const pendingxmlRecord = digitalSignatureData.map((item) => ({
    id: item.registerId,
    certName: item.certUserName,
    certSerialNo: item.certSerialNo,
    validFrom: item.certificateValidFrom,
    validTo: item.certificateValidUpto,
    msgId: item.msgId,
    status: item.approveStatus,
    signedStatus: item.signStatus
  }));
  return (
    <div>
      {!!snackbar && (
        <Snackbar open anchorOrigin={{ vertical: 'top', horizontal: 'center' }} onClose={handleCloseSnackbar} autoHideDuration={6000}>
          <Alert {...snackbar} onClose={handleCloseSnackbar} />
        </Snackbar>
      )}

      <MainCard title="Digital Signature Registration">
        <Backdrop open={loading} style={{ zIndex: 999, color: '#fff' }}>
          <CircularProgress color="inherit" />
        </Backdrop>

        <div>
          {digitalSignatureData.length > 0 ? (
            <>
              <DataGrid
                disableRowSelectionOnClick
                // slots={{ toolbar: GridToolbar }}
                //   slotProps={{
                //    toolbar: {
                //      showQuickFilter: true,
                //    },
                //  }}
                rows={pendingxmlRecord}
                columns={pendingRecordColumn}
                initialState={{
                  pagination: {
                    paginationModel: {
                      pageSize: 15
                    }
                  }
                }}
                pageSizeOptions={[15]}
              />
            </>
          ) : (
            <form
              onSubmit={(e) => {
                fettchData ? handleSubmit(e) : handleUpdate(e);
              }}
            >
              <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                  <TextField
                    label="Name"
                    name="certName"
                    value={data ? data.subject : ''}
                    placeholder="Enter Name"
                    variant="outlined"
                    fullWidth
                    disabled
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    label="Serial No"
                    value={data ? data.serialNumber : ''}
                    name="serial"
                    placeholder="Serial No"
                    variant="outlined"
                    fullWidth
                    disabled
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    label="Valid From"
                    value={data ? data.notBefore : ''}
                    name="validFrom"
                    placeholder="Valid From"
                    variant="outlined"
                    fullWidth
                    disabled
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    label="Valid To"
                    name="validTo"
                    value={data ? data.notAfter : ''}
                    placeholder="Valid To"
                    variant="outlined"
                    fullWidth
                    disabled
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    label="Certificate"
                    multiline
                    rows={3}
                    value={data ? data.certificate : ''}
                    fullWidth
                    variant="outlined"
                    disabled
                  />
                </Grid>

                <Grid item xs={12} sm={4}>
                  <FormControl fullWidth>
                    <InputLabel id="issuer-name">
                      Certificate Issuer <span style={{ color: 'red' }}>*</span>
                    </InputLabel>
                    <Select
                      labelId="issuer-name"
                      id="issuerCode"
                      label="issuer Name"
                      name="issuerCode"
                      value={issuer}
                      onChange={handleIssuerChange}
                      required
                    >
                      <MenuItem value="">
                        <em>Select Type</em>
                      </MenuItem>
                      <MenuItem value="Personal">Personal</MenuItem>
                      <MenuItem value="Enterprise">Enterprise</MenuItem>
                      <MenuItem value="Department">Department</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
              <div>
                <SubDistrictCommon ref={subDistrictCommonRef} validationLevel={'D'} onFormInputValuesChange={handleLocationValuesChange} />
              </div>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                  <TextField
                    label="Account No"
                    name="accountNo"
                    placeholder="Account No"
                    value={accountValue}
                    onChange={handleAccountChange}
                    inputProps={{ minLength: 8, maxLength: 20 }}
                    variant="outlined"
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    label="Account Holder Name"
                    name="accountHolderName"
                    placeholder="Account Holder Name"
                    variant="outlined"
                    fullWidth
                    value={accountNameValue}
                    onChange={handleAccountNameChange}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <FormControl fullWidth>
                    <InputLabel id="account-type">
                      Type Of Account <span style={{ color: 'red' }}>*</span>
                    </InputLabel>
                    <Select
                      labelId="account-type"
                      id="accounttype"
                      label="account-type"
                      name="accounttype"
                      value={accountType}
                      onChange={handleAccountTypeChange}
                    >
                      <MenuItem value="">
                        <em>Select Type</em>
                      </MenuItem>
                      <MenuItem value="GOVT">Government</MenuItem>
                      <MenuItem value="SVGS">Savings</MenuItem>
                      <MenuItem value="CACC">Current</MenuItem>
                      <MenuItem value="LOAN">Loan</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <FormControl fullWidth>
                    <BankTypeList onSelectbankType={handleSelectbank} />
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={4}>
                  <FormControl fullWidth>
                    <BankNameList
                      bankType={bankType}
                      selectedStateId={locationOptionValues.stateCode}
                      selectedDistrictId={locationOptionValues.districtCode}
                      onSelectbankName={handleSelectbankName}
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    style={{
                      borderBottomStyle: 'hidden',
                      borderTopStyle: 'hidden',
                      borderLeftStyle: 'hidden',
                      borderRightStyle: 'hidden',
                      height: '39px',
                      borderColor: error ? 'red' : 'initial'
                    }}
                    label="IFSC Code"
                    name="ifscCode"
                    placeholder="Enter IFSC Code"
                    onChange={(e) => handleInputChange(e.target.value, e)}
                    fullWidth
                    value={searchResults}
                    inputProps={{ maxLength: 11 }}
                    error={error} // Apply error style if validation fails
                    helperText={error ? 'Invalid IFSC code' : ''}
                  />

                  {allIfscCodeData.length > 0 && (
                    <Popper open={open} anchorEl={anchorEl} placement="bottom-start" ref={popperRef} style={{ backgroundColor: 'gray' }}>
                      <div color="black">
                        <Paper
                          style={{
                            width: 'auto',
                            maxHeight: '300px',
                            overflowY: 'auto',
                            backgroundColor: 'lightsteelblue',
                            color: 'black'
                          }}
                        >
                          <List style={{ backgroundColor: 'lightsteelblue' }}>
                            {allIfscCodeData.map((data, index) => (
                              <MenuItem key={index} onClick={() => handleListItemClick(data, 'ifscCode')}>
                                <ListItemText
                                  primary={
                                    <span
                                      style={{ fontSize: 'small' }}
                                    >{`${data.ifscCode} - ${data.bankCode} - ${data.bankBranchName} - ${data.bankName}`}</span>
                                  }
                                />
                              </MenuItem>
                            ))}
                          </List>
                        </Paper>
                      </div>
                    </Popper>
                  )}
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    label="Designation"
                    name="designation"
                    value={designationValue}
                    onChange={handleDesignationChange}
                    placeholder="Enter Designation"
                    variant="outlined"
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    label="Department"
                    name="department"
                    value={departmentValue}
                    onChange={handleDepartmentChange}
                    placeholder="Enter Department"
                    variant="outlined"
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    label="Sub - Department"
                    name="sub-department"
                    value={subDepartmentValue}
                    onChange={handleSubDepartmentChange}
                    placeholder="Enter Sub - Department"
                    variant="outlined"
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    label="Mobile No"
                    inputProps={{ maxLength: 10 }}
                    name="mobileNo"
                    value={mobileValue}
                    onChange={handleMobileChange}
                    placeholder="Enter Mobile No"
                    variant="outlined"
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    label="Email Id"
                    name="emailId"
                    value={emailValue}
                    onChange={handleEmailChange}
                    placeholder="Enter Email Id"
                    variant="outlined"
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <FormControl fullWidth>
                    <InputLabel id="noOfSign">
                      No. Of Signatories <span style={{ color: 'red' }}>*</span>
                    </InputLabel>
                    <Select
                      labelId="noOfSign"
                      id="noOfSign"
                      label="no Of Signaturies"
                      name="noOfSign"
                      value={signer}
                      onChange={handleSignaturiesChange}
                    >
                      <MenuItem value="">
                        <em>Select Type</em>
                      </MenuItem>
                      <MenuItem value="1">1</MenuItem>
                      <MenuItem value="2">2</MenuItem>
                      <MenuItem value="3">3</MenuItem>
                      <MenuItem value="4">4</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    label="Minimum Amount of Debit Transaction"
                    value={minAmountValue}
                    onChange={handleMinAmountChange}
                    name="minAmount"
                    placeholder="Minimum Amount of Debit Transaction"
                    variant="outlined"
                    fullWidth
                    disabled
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    label="Maximum Amount of Debit Transaction"
                    value={maxAmountValue}
                    onChange={handleMaxAmountChange}
                    inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                    required
                    name="maxAmount"
                    placeholder="Maximum Amount of Debit Transaction"
                    variant="outlined"
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    label="status"
                    name="sts"
                    value={data ? 'ACTIVE' : ''}
                    placeholder="status"
                    variant="outlined"
                    fullWidth
                    disabled
                  />
                </Grid>
                {fettchData ? (
                  <>
                    <Grid item xs={12} alignItems="center">
                      <Button type="submit" variant="contained" color="secondary">
                        Register
                      </Button>
                    </Grid>
                  </>
                ) : (
                  <>
                    {' '}
                    <Grid item xs={12} alignItems="center">
                      <Button type="submit" variant="contained" color="secondary">
                        Update
                      </Button>
                    </Grid>
                  </>
                )}
              </Grid>
            </form>
          )}
        </div>
      </MainCard>
    </div>
  );
}

// Dsc NICD Signer application need to run on java 1.8 version, it will support 1.8 version only
// need to import --> import {getSignedXMLFile} from 'components/digitalSignature/getSignedXMLFile'
// then call the method --> const xml=await getSignedXMLFile(xmlData);
