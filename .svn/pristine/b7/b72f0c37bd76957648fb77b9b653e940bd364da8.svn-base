import MainCard from 'ui-component/cards/MainCard';
import { DataGrid, GridToolbar, GridCellModes } from '@mui/x-data-grid';
import React, { useState, useEffect } from 'react';
import {
  Grid,
  Button,
  FormControl,
  Chip,
  Snackbar,
  Alert,
  CircularProgress,
  Backdrop,
  Divider,
  FormHelperText,
  Typography
} from '@mui/material';
import axiosInstance from 'hooks/useAuthTokenUrl';
import StateList from 'components/form_components/StateList';
import DistrictList from 'components/form_components/DistrictList';
import SubDistrictList from 'components/form_components/SubDistrictList';
import GramPanchayatList from 'components/form_components/GramPanchayatList';
import VillageList from 'components/form_components/VillageList';
import AreaList from 'components/form_components/AreaList';
import EditIcon from '@mui/icons-material/Edit';
import SearchComponent from 'components/common/SearchTypeCommon';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import './aadharConsent.css';
import { validateAadharConsentForm } from 'components/verification/aadharConsentUpdation/ValidateAadharConsentForm';
import { validateAadharConsentFormVerified } from './validateAadharConsentFormVerified';
import AadharEncrypter from '../../common/AadharEncrypter ';
import { useNavigate } from 'react-router-dom';
import messages_en from '../../../components/common/messages_en.json';

function AadharConsentUpdation() {
  const [getAllDistrict, setAllDistrict] = useState([]);
  const [getAllDistrictTemp, setAllDistrictTemp] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectedStateId, setSelectedState] = useState('');
  const [snackbar, setSnackbar] = React.useState(null);
  const handleCloseSnackbar = () => setSnackbar(null);
  const [loading, setLoading] = useState(false);
  const [selectedDistrictId, setSelectedDistrict] = useState(null);
  const [selectedAreaId, setSelectedArea] = useState(null);
  const [selectedSubDistrictId, setSelectedSubDistrict] = useState(null);
  const [selectedGramPanchyat, setSelectedGramPanchyat] = useState(null);
  const [uidStatus, setUidStatus] = React.useState('notverified');
  const [uidcheckStatus, setUidcheckStatus] = React.useState('');
  const [testRowId, setTestRowId] = React.useState(null);
  const [checkData, setCheckData] = React.useState('');
  const [submitFinalValue, setSubmitFinalValue] = React.useState(false);
  const navigate = useNavigate();
  const [formErrors, setFormErrors] = useState({});
  //const [isverError, setIsverError] = useState(false);
  //const submitformRef = useRef(null);

  function cancelValue() {
    navigate('/nsap/dashboard/default');
  }

  function vhCheck(strVal) {
    if (strVal.verhoeffCheck()) {
      return true;
    } else {
      return false;
    }
  }

  String.prototype.verhoeffCheck = (function () {
    var d = [
      [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
      [1, 2, 3, 4, 0, 6, 7, 8, 9, 5],
      [2, 3, 4, 0, 1, 7, 8, 9, 5, 6],
      [3, 4, 0, 1, 2, 8, 9, 5, 6, 7],
      [4, 0, 1, 2, 3, 9, 5, 6, 7, 8],
      [5, 9, 8, 7, 6, 0, 4, 3, 2, 1],
      [6, 5, 9, 8, 7, 1, 0, 4, 3, 2],
      [7, 6, 5, 9, 8, 2, 1, 0, 4, 3],
      [8, 7, 6, 5, 9, 3, 2, 1, 0, 4],
      [9, 8, 7, 6, 5, 4, 3, 2, 1, 0]
    ];
    var p = [
      [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
      [1, 5, 7, 6, 2, 8, 3, 0, 9, 4],
      [5, 8, 0, 3, 7, 9, 6, 1, 4, 2],
      [8, 9, 1, 6, 0, 4, 3, 5, 2, 7],
      [9, 4, 5, 3, 1, 2, 6, 8, 7, 0],
      [4, 2, 8, 6, 5, 7, 3, 9, 0, 1],
      [2, 7, 9, 3, 8, 0, 6, 4, 1, 5],
      [7, 0, 4, 6, 9, 1, 3, 2, 5, 8]
    ];

    return function () {
      var c = 0;
      this.replace(/\D+/g, '')
        .split('')
        .reverse()
        .join('')
        .replace(/[\d]/g, function (u, i) {
          c = d[c][p[i & 7][parseInt(u, 10)]];
        });
      return c === 0;
    };
  })();

  //console.log("---- "+vhCheck);

  const handleUidStatusChange = (event) => {
    setUidStatus(event.target.value);
  };

  function setSubmitValue() {
    setSubmitFinalValue('true');
  }

  const handleChangeVer = (value, rowId) => {
    //alert(value+'  - '+rowId);
    setAllDistrict((prevRows) => prevRows.map((row) => (row.sanctionOrderNo === rowId ? { ...row, ['aadharVerify']: value } : row)));
  };

  const checkCommonValidationForUidName = (uidName, uidNo, rowId, sanctionOrderNumber) => {
    if (uidName !== null && (uidNo !== '' || uidNo !== null)) {
      if (/\d/.test(uidName)) {
        alert('Only text allow in Name as Per Aadhaar ');
        return false;
      } else {
        //return true;
        if (uidNo !== '' && uidNo !== null) {
          if (/^\d+$/.test(uidNo)) {
            var len = uidNo.length;
            if (len === 12) {
              if (uidName === '' || uidName === null) {
                alert('Name as per aadhaar can not be blank ');
                return false;
              } else {
                var aadharFormatCheck = vhCheck(uidNo);
                if (aadharFormatCheck == false) {
                  alert('Please enter correct Aadhaar ');
                  return false;
                } else {
                  console.log(sanctionOrderNumber);
                  // const getAadharUrl = `/aadhar-consent-updation/getAadharDetailsSameOrNot/${uidName}/${uidNo}/${sanctionOrderNumber}`;
                  //const response = await axiosInstance.get(getAadharUrl);
                  // console.log(sanctionOrderNumber)
                  // if(response.data=== 'available'){
                  //  return "noChanges";
                  //}
                  // else if( response.data=== 'duplicateAadhar'){
                  //   alert("Duplicate! Aadhaar already exist in Application.");
                  //   return "duplicateAadharData";
                  // }
                  //else{
                  return true;
                  // }
                }
              }
            } else {
              //alert("Please enter 12 digit correct Aadhaar ");
              setSnackbar({ children: 'Please enter 12 digit correct Aadhaar', severity: 'error' });
              return false;
            }
          } else {
            //alert('Only numeric value is allow in Aadhaar ');
            setSnackbar({ children: 'Only numeric value is allow in Aadhaar', severity: 'error' });
            return false;
          }
        } else {
          return true;
        }
      }
    }
  };

  {
    /*const checkCommonValidationForUidNumber = (uidNo) => {
          //alert('  - '+uidNo);
          if (/^\d+$/.test(uidNo)) {
            return true;
          }
          else{
            alert('Only numeric value is allow in Aadhaar ');
            return false;
          }
          };*/
  }
  const options = {
    sanctionOrderNo: 'Sanction Order No'
  };
  const [optionValues, setOptionValues] = useState(null);
  const handleSearchOptionValuesChange = (newOptionValues) => {
    //alert('--- '+newOptionValues.searchText);
    setOptionValues(newOptionValues);
  };

  useEffect(() => {}, [submitFinalValue]);

  const columns = [
    {
      field: 'sanctionOrderNo',
      headerName: 'Sanction Order No',
      flex: 1,
      editable: false,
      disableColumnMenu: true
    },
    {
      field: 'applicantName',
      headerName: 'Pensioner Name',
      flex: 1,
      editable: false,
      disableColumnMenu: true
    },
    {
      field: 'fatherHusbandName',
      headerName: 'Father/Husband Name',
      flex: 1,
      editable: false,
      disableColumnMenu: true
    },
    {
      field: 'schemeCode',
      headerName: 'Scheme Name',
      flex: 1,
      editable: false,
      disableColumnMenu: true
    },

    {
      field: 'nameasUid',
      disableColumnMenu: true,
      sortable: false,
      headerName: (
        <div>
          <EditIcon fontSize="small" style={{ marginBottom: '-4px', color: 'blue' }} /> Name as Per Aadhaar
        </div>
      ),
      flex: 1,
      // editable:()=> uidcheckStatus === false , // Allow editing only if not verified
      //cellClassName: () => uidcheckStatus===true ? 'disabled-cell-success' : '' ,
      //editable:(params)=>  (params.row.id === testRowId ? (uidcheckStatus === true ? 'disabled-cell-success' :(uidcheckStatus===false ? 'disabled-cell-failed':'')) : ''),
      //cellClassName: (params) => (params.row.id === testRowId ?(uidcheckStatus === true ? 'disabled-cell-success' :(uidcheckStatus===false ? 'disabled-cell-failed':'')) : ''),

      editable: (params) =>
        params.row.aadharVerify ? 'disabled-cell-successOne' : params.row.aadharVerify === false ? 'disabled-cell-failed' : '',
      cellClassName: (params) =>
        params.row.aadharVerify ? 'disabled-cell-successOne' : params.row.aadharVerify === false ? 'disabled-cell-failed' : ''
      //cellClassName: () => aadharVerify===true ? 'disabled-cell-success' : '',
    },
    {
      field: 'uidNo',
      disableColumnMenu: true,
      sortable: false,
      headerName: (
        <div>
          <EditIcon fontSize="small" style={{ marginBottom: '-4px', color: 'blue' }} /> Aadhaar
        </div>
      ),
      flex: 1,
      //editable:(params)=>  (params.row.id === testRowId ? (uidcheckStatus === true ? 'disabled-cell-success' :(uidcheckStatus===false ? 'disabled-cell-failed':'')) : ''),
      // cellClassName: (params) => (params.row.id === testRowId ?(uidcheckStatus === true ? 'disabled-cell-success' :(uidcheckStatus===false ? 'disabled-cell-failed':'')) : ''),

      editable: (params) =>
        params.row.aadharVerify ? 'disabled-cell-success' : params.row.aadharVerify === false ? 'disabled-cell-failed' : '',
      cellClassName: (params) =>
        params.row.aadharVerify ? 'disabled-cell-success' : params.row.aadharVerify === false ? 'disabled-cell-failed' : ''
    },
    {
      headerName: '',
      disableColumnMenu: true,
      sortable: false,
      width: 100,
      //valueGetter:(params)=>  (params.row.id === testRowId ? (checkData === 'yes' ? <p style={{color:'green'}}>verified</p> :(checkData==='no' ? <p style={{color:'red'}}>failed</p>:'')) : ''),
      //valueGetter:(params)=>  (params.row.id === testRowId ? (checkData === 'yes' ? 'verified' :(checkData==='no' ? 'failed':'')) : ''),
      //cellClassName: (params) => (params.row.id === testRowId ?(checkData === 'yes' ? 'disabled-cell-success' :(checkData==='no' ? 'disabled-cell-failed':'')) : ''),
      valueGetter: (params) => (params.row.aadharVerify ? 'verified' : params.row.aadharVerify === false ? 'failed' : ''),
      cellClassName: (params) => (params.row.aadharVerify ? 'verified-cell' : params.row.aadharVerify === false ? 'failed-cell' : '')
    }
  ];

  const validateForm = () => {
    const errors = {};
    if (optionValues.sanctionOrderNo === null && !selectedDistrictId) {
      errors.selectedDistrictId = messages_en.districtRequired;
    }
    if (optionValues.sanctionOrderNo === null && !selectedAreaId) {
      errors.selectedAreaId = messages_en.areaRequired;
    }
    if (optionValues.sanctionOrderNo === null && !selectedSubDistrictId) {
      errors.selectedSubDistrictId = messages_en.subDistrictRequired;
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  console.log(uidcheckStatus, testRowId, checkData);
  function checkUidDataFun(uidNumber, rowId, uidName, sanctionData) {
    if (/^\d*$/.test(uidName)) {
      //ok fine
    } else {
      //alert('Only text allow in Name as Per Aadhar ');
    }

    if (uidNumber === undefined || uidNumber === 'undefined') {
      console.log('undefined');
    } else {
      if (uidNumber !== null && uidNumber !== '') {
        var lenCheck = uidNumber.length;
        if (uidName === null || uidName === '') {
          alert('Aadhaar Name can not be null');
        } else {
          //alert('no null');
          if (lenCheck == 12) {
            //api calling
            aadharApiTesting(uidName, uidNumber, rowId, sanctionData);
          } else {
            //alert("Aadhaar Number length must be 12 digit ");
            //setSelectedRowId(rowId);
            checkCommonValidationForUidName(uidName, uidNumber, rowId);
            setAllDistrict((prevRows) => prevRows.map((row) => (row.uidNo === rowId ? { ...row, ['uidNo']: '00' } : row)));
          }
        }
      } else {
        console.log('lenght is not valid');
      }
    }

    async function aadharApiTesting(uidName, uidNumber, rowId, sanctionData) {
      try {
        //alert("-- uidName  : "+uidName + '  --uidNumber '+uidNumber);

        //start added for aadhar security
        //alert(process.env.REACT_APP_CryptoJS_SALT +" :: "+process.env.REACT_APP_CryptoJS_KEY); //it is not working
        const encryptedUidData = AadharEncrypter({ uidNumber: uidNumber });
        //end added for aadhar security

        var aadharDetails = { nameasUid: uidName, uidNo: encryptedUidData, sanctionOrderNo: sanctionData };
        var body = { ...aadharDetails };

        const getUrl = `/aadhar-consent-updation/getAadharDetailsVerifying`;
        setLoading(true);
        const response = await axiosInstance.post(getUrl, JSON.stringify(body));

        if (response.status >= 100 && response.status <= 500) {
          // alert(response.data); // api success/failed data is comming
          if (response.data.aadharErrorDescription === 'Aadhaar verified successfully') {
            //console.log("here -- ")
            setUidcheckStatus(true);
            setTestRowId(sanctionData);
            setCheckData('yes');
            handleChangeVer(true, sanctionData);
            setLoading(false);
            //console.log(`row is is :: ${testRowId}  - `+testRowId+ ' - '+rowId)
          } else if (response.data.aadharErrorDescription === 'Aadhaar verified failed') {
            setUidcheckStatus(false);
            setTestRowId(sanctionData);
            setCheckData('no');
            handleChangeVer(false, sanctionData);
            setLoading(false);
          } else {
            alert(response.data.aadharErrorDescription);
            setUidcheckStatus(false);
            setTestRowId(sanctionData);
            setCheckData('no');
            setLoading(false);
            //handleChangeVer(false,sanctionData);
            //console.log("not here --")
          }
          return response.data;
        } else {
          return false;
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }
  }

  const handleSelectState = (state) => {
    setSelectedState(state);
  };

  const handleSelectDistrict = (selectedDistrictId) => {
    setSelectedDistrict(selectedDistrictId);
    setSelectedArea(null);
    setSelectedSubDistrict(null);
    setSelectedGramPanchyat(null);
    setSelectedVillage(null);
    setFormErrors((prevErrors) => {
      const updatedErrors = { ...prevErrors };
      delete updatedErrors.selectedDistrictId;
      return updatedErrors;
    });
  };

  const handleSelectArea = (selectedAreaId) => {
    setSelectedArea(selectedAreaId);
    setSelectedSubDistrict(null);
    setSelectedGramPanchyat(null);
    setSelectedVillage(null);
    setFormErrors((prevErrors) => {
      const updatedErrors = { ...prevErrors };
      delete updatedErrors.selectedAreaId;
      return updatedErrors;
    });
  };

  const handleSelectSubDistrict = (selectedSubDistrictId) => {
    setSelectedSubDistrict(selectedSubDistrictId);
    setSelectedGramPanchyat(null);
    setSelectedVillage(null);
    setFormErrors((prevErrors) => {
      const updatedErrors = { ...prevErrors };
      delete updatedErrors.selectedSubDistrictId;
      return updatedErrors;
    });
  };

  const handleGramPanchyat = (selectedGramPanchyat) => {
    setSelectedGramPanchyat(selectedGramPanchyat);
    setSelectedVillage(null);
  };
  const [selectedVillage, setSelectedVillage] = useState(null);
  const handleSelectVillgae = (selectedVillage) => {
    setSelectedVillage(selectedVillage);
  };

  const handleClickOpen = (e) => {
    e.preventDefault();
    // if (!isverError && selectedDistrictId) {
    //   console.log('selectedDistrictId successfully!', selectedDistrictId);
    // } else {
    //   setIsverError(!selectedDistrictId);
    //   if (submitformRef.current) {
    //     submitformRef.current.scrollIntoView({ behavior: 'auto', block: 'start' });
    //   }
    //   return;
    // }

    fetchData()
      .then((res) => {
        if (res) {
          // Data is not null
          const districtData = res || [];
          setAllDistrict(districtData);
          setAllDistrictTemp(districtData);
          // setAllDistrict(res);
          console.log(res);
        } else {
          // Data is null
          setAllDistrict([]);
          //setAllDistrictTemp([]);

          //setSnackbar({ children: 'No Data Found', severity: 'error' });
          return false;
        }
      })
      .catch((e) => {
        console.log(e.message);
      });
  };

  const useFakeMutation = () => {
    return React.useCallback(
      (updatedRow) =>
        new Promise((resolve, reject) => {
          setTimeout(() => {
            if (updatedRow.sanctionOrderNo?.trim() === '') {
              reject(new Error("Error: District Name can't be empty."));
            } else {
              resolve({ ...updatedRow, sanctionOrderNo: updatedRow.sanctionOrderNo?.toUpperCase() });
            }
          }, 200);
        }),
      []
    );
  };
  const handleProcessRowUpdateError = React.useCallback((error) => {
    setSnackbar({ children: error.message, severity: 'error' });
  }, []);
  const mutateRow = useFakeMutation();

  const fetchData = async () => {
    //if ( optionValues.sanctionOrderNo ===null && (selectedDistrictId === null || selectedAreaId === null || selectedSubDistrictId === null)) {
    //  alert("District |Area |Sub District are mandatory.");
    //  }
    //  else{
    const isFormValid = validateForm();
    if (isFormValid) {
      try {
        //alert("-- final  : "+uidStatus + '  -- '+optionValues);
        var location = {
          stateID: selectedStateId,
          districtID: selectedDistrictId,
          area: selectedAreaId,
          subDistID: selectedSubDistrictId,
          gpID: selectedGramPanchyat,
          villageID: selectedVillage,
          uidStatus: uidStatus
        };
        var body = { ...optionValues, ...location };
        const getUrl = `/aadhar-consent-updation/getAadharConsentUpdation`;
        setLoading(true);
        const response = await axiosInstance.post(getUrl, JSON.stringify(body));
        if (response.status >= 200 && response.status < 300) {
          if (response.data.length > 0) {
            return response.data;
          } else {
            setSnackbar({ children: 'No Data Found!', severity: 'error' });
          }
        } else {
          return false;
        }
      } catch (error) {
        if (error.response.data.sanctionOrderNo) {
          setSnackbar({ children: error.response.data.sanctionOrderNo, severity: 'error' });
        } else {
          setSnackbar({ children: 'No Data Found', severity: 'error' });
        }

        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSelectionChange = (newSelection) => {
    setSelectedRows(newSelection);
  };

  const rows = getAllDistrict.map((item) => ({
    id: item.sanctionOrderNo,
    sanctionOrderNo: item.sanctionOrderNo,
    applicantName: item.applicantName,
    fatherHusbandName: item.fatherHusbandName,
    nameasUid: item.nameasUid,
    //uidNo:item.uidNo,
    uidNo: item.uidNo ? item.uidNo.slice(0, 8).replace(/\d/g, 'X') + item.uidNo.slice(8) : item.uidNo,
    schemeCode: item.schemeCode,
    contactPersonMobile: item.contactPersonMobile,
    stateCode: item.stateCode,
    districtCode: item.districtCode,
    gender: item.gender,
    freezAc: item.freezAc,
    dbtConsent: item.dbtConsent,
    consentDate: item.consentDate,
    npciStatus: item.npciStatus,
    gendbankPoAccountNoer: item.bankPoAccountNo,
    ifscCode: item.ifscCode,
    uidstatus: item.uidstatus,
    subDistrictMunicipalAreaCode: item.subDistrictMunicipalAreaCode,
    gramPanchayatWardCode: item.gramPanchayatWardCode,
    villageCode: item.villageCode,
    area: item.area,
    aadharVerify: item.aadharVerify,
    uidNoEncrypt: item.uidNoEncrypt
  }));
  const processRowUpdate = React.useCallback(
    async (updatedRow) => {
      try {
        const updatedRowData = await mutateRow(updatedRow);
        setAllDistrict((prevRows) => {
          const rowIndex = prevRows.findIndex((row) => row.sanctionOrderNo === updatedRowData.sanctionOrderNo);

          const updatedRows = [...prevRows];
          alert(' updated uid_NO-- ' + updatedRowData.uidNo + '   naME->>> ' + updatedRowData.nameasUid);
          // alert(updatedRow.length + '  length is  -- ' + updatedRows.length);
          if (updatedRow.length === undefined) {
            var resultName = checkCommonValidationForUidName(updatedRowData.nameasUid, updatedRowData.uidNo);
            if (resultName === true) {
              var checkResult = validateAadharConsentFormVerified(
                getAllDistrictTemp,
                updatedRowData.sanctionOrderNo,
                updatedRowData.nameasUid,
                updatedRowData.uidNo
              );

              if (checkResult === 'true') {
                checkUidDataFun(updatedRowData.uidNo, rowIndex, updatedRowData.nameasUid, updatedRowData.sanctionOrderNo);
              }
              updatedRows[rowIndex] = {
                ...updatedRows[rowIndex],
                nameasUid: updatedRowData.nameasUid,
                uidNo: updatedRowData.uidNo,
                uidNoEncrypt: AadharEncrypter({ uidNumber: updatedRowData.uidNo })
              };
              return updatedRows;
            } else {
              //alert("inside false");
              updatedRows[rowIndex] = {
                ...updatedRows[rowIndex],
                nameasUid: updatedRowData.nameasUid,
                uidNo: updatedRowData.uidNo,
                uidNoEncrypt: AadharEncrypter({ uidNumber: updatedRowData.uidNo })
              };
              return updatedRows;
            }
          } else {
            updatedRows[rowIndex] = {
              ...updatedRows[rowIndex],
              nameasUid: updatedRowData.nameasUid,
              uidNo: updatedRowData.uidNo,
              uidNoEncrypt: AadharEncrypter({ uidNumber: updatedRowData.uidNo })
            };
            return updatedRows;
          }
        });

        return updatedRowData;
      } catch (error) {
        console.error('Error updating row:', error);
        setSnackbar({ children: error.message, severity: 'error' });
        throw error;
      }
    },
    [mutateRow, getAllDistrict, setSnackbar, selectedRows]
  );

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    //alert(" --  "+uidStatus);

    if (selectedRows.length === 0) {
      setSnackbar({ children: 'Please select at least one row.', severity: 'error' });
      return;
    }
    const selectedData = getAllDistrict.filter((row) => selectedRows.indexOf(row.sanctionOrderNo) !== -1);

    const updatedData1 = await processRowUpdate(selectedData);
    console.log('updated Row status : ', JSON.stringify(selectedData));

    const validationErrors = validateAadharConsentForm(selectedRows, getAllDistrict);

    if (validationErrors.length > 0) {
      validationErrors.forEach((error) => {
        setSnackbar({ children: error, severity: 'error' });
      });
      return;
    }

    try {
      selectedData.every((data) => {
        data.uidNo = null;
      });
      const body = { uidStatus, updatedData1 };
      const apiUrl = '/aadhar-consent-updation/saveAadhaarDetails/' + uidStatus;
      setLoading(true);
      const response = await axiosInstance.post(apiUrl, JSON.stringify(body));

      console.log('API Response:', response.data);

      if (response.status >= 200 && response.status < 300) {
        setSnackbar({ children: 'Record successfully updated', severity: 'success' });
        await new Promise((resolve) => setTimeout(resolve, 1250));

        handleClickOpen(e);
      } else {
        setSnackbar({ children: 'Error in updating data', severity: 'success' });
        await new Promise((resolve) => setTimeout(resolve, 1250));
      }
    } catch (error) {
      if (error.response.status === 424) {
        setSnackbar({ children: 'Found duplicate Aadhaar Number.Kindly update correct aadhaar no.', severity: 'error' });
        setTimeout(() => {
          navigate('/verification/aadharConsentUpdation');
        }, 6000);
      } else {
        console.error('Error sending data:', error);
        setSnackbar({ children: error.message, severity: 'error' });
      }
    } finally {
      setLoading(false);
    }
  };
  const [cellModesModel, setCellModesModel] = React.useState({});

  const handleCellClick = React.useCallback((params, event) => {
    if (!params.isEditable) {
      return;
    }

    // Ignore portal
    if (event.target.nodeType === 1 && !event.currentTarget.contains(event.target)) {
      return;
    }

    setCellModesModel((prevModel) => {
      return {
        ...Object.keys(prevModel).reduce(
          (acc, id) => ({
            ...acc,
            [id]: Object.keys(prevModel[id]).reduce(
              (acc2, field) => ({
                ...acc2,
                [field]: { mode: GridCellModes.View }
              }),
              {}
            )
          }),
          {}
        ),
        [params.id]: {
          ...Object.keys(prevModel[params.id] || {}).reduce((acc, field) => ({ ...acc, [field]: { mode: GridCellModes.View } }), {}),
          [params.field]: { mode: GridCellModes.Edit }
        }
      };
    });
  }, []);
  const handleCellModesModelChange = React.useCallback((newModel) => {
    setCellModesModel(newModel);
  }, []);
  return (
    <div>
      <MainCard title="Aadhaar Consent/Change Aadhaar Updation">
        {!!snackbar && (
          <Snackbar open anchorOrigin={{ vertical: 'top', horizontal: 'center' }} onClose={handleCloseSnackbar} autoHideDuration={6000}>
            <Alert {...snackbar} onClose={handleCloseSnackbar} />
          </Snackbar>
        )}
        <Backdrop open={loading} style={{ zIndex: 999, color: '#fff' }}>
          <CircularProgress color="inherit" />
        </Backdrop>
        <form onSubmit={(e) => handleClickOpen(e)}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <StateList onSelectState={handleSelectState} />
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <DistrictList
                  selectedStateId={selectedStateId}
                  setSelectedDistrict={setSelectedDistrict}
                  onSelectDistrict={handleSelectDistrict}
                />
                {formErrors.selectedDistrictId && (
                  <FormHelperText>
                    <Typography style={{ color: 'red', fontSize: '0.8rem' }}>{formErrors.selectedDistrictId}</Typography>
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <AreaList selectedDistrictId={selectedDistrictId} selectedArea={selectedAreaId} onSelectArea={handleSelectArea} />
                {formErrors.selectedAreaId && (
                  <FormHelperText>
                    <Typography style={{ color: 'red', fontSize: '0.8rem' }}>{formErrors.selectedAreaId}</Typography>
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <SubDistrictList
                  selectedAreaId={selectedAreaId}
                  selectedDistrictId={selectedDistrictId}
                  setSelectedSubDistrict={setSelectedSubDistrict}
                  onSelectSubDistrict={handleSelectSubDistrict}
                />
                {formErrors.selectedSubDistrictId && (
                  <FormHelperText>
                    <Typography style={{ color: 'red', fontSize: '0.8rem' }}>{formErrors.selectedSubDistrictId}</Typography>
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <GramPanchayatList
                  selectedSubDistrictMunicipalAreaId={selectedSubDistrictId}
                  setSelectedGramPanchayat={selectedGramPanchyat}
                  onSelectGramPanchayat={handleGramPanchyat}
                />
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <VillageList
                  selectedGramPanchayatId={selectedGramPanchyat}
                  setSelectedVillage={setSelectedVillage}
                  onSelectVillage={handleSelectVillgae}
                />
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={12}>
              <Divider>
                {' '}
                <Chip label="OR SEARCH BY" />{' '}
              </Divider>
              <br />
            </Grid>
            <Grid>
              <SearchComponent options={options} onOptionValuesChange={handleSearchOptionValuesChange} />
            </Grid>

            <Grid>
              <RadioGroup
                style={{ marginLeft: '100px', marginTop: '22px' }}
                row
                aria-label="uidstatus"
                name="uidstatus"
                value={uidStatus}
                onChange={handleUidStatusChange}
              >
                <FormControlLabel value="notverified" control={<Radio />} label="Not Verified" />
                <FormControlLabel value="verified" control={<Radio />} label="Verified" />
              </RadioGroup>
            </Grid>

            <Grid item xs={12} alignItems="center">
              <Button type="submit" variant="contained" color="secondary" title="Submit">
                Submit
              </Button>
              &nbsp;
              <Button
                variant="contained"
                color="primary"
                onClick={() => {
                  cancelValue();
                }}
                title="Cancel"
              >
                Cancel
              </Button>
            </Grid>
          </Grid>
        </form>
      </MainCard>

      {getAllDistrict.length > 0 ? (
        <>
          <form onSubmit={handleFormSubmit}>
            <MainCard>
              <DataGrid
                checkboxSelection
                disableRowSelectionOnClick
                getRowId={(row) => row.sanctionOrderNo}
                slots={{ toolbar: GridToolbar }}
                slotProps={{
                  toolbar: {
                    showQuickFilter: true,
                    printOptions: { disableToolbarButton: true }
                  }
                }}
                rows={rows}
                columns={columns}
                cellModesModel={cellModesModel}
                onCellModesModelChange={handleCellModesModelChange}
                onCellClick={handleCellClick}
                processRowUpdate={processRowUpdate}
                onProcessRowUpdateError={handleProcessRowUpdateError}
                onRowSelectionModelChange={handleSelectionChange}
                initialState={{
                  pagination: {
                    paginationModel: {
                      pageSize: 15
                    }
                  }
                }}
                pageSizeOptions={[15]}
              />
              {uidStatus === 'verified' ? (
                <span style={{ textAlign: 'center', color: 'red' }} className="blink">
                  <b>NOTE:</b> Need to approve aadhar number from approver authority.
                </span>
              ) : (
                ''
              )}

              <Grid item xs={12} alignItems="center">
                <Button
                  type="submit"
                  variant="contained"
                  color="secondary"
                  onClick={() => {
                    setSubmitValue();
                  }}
                  title="Submit"
                  style={{ marginTop: '5px' }}
                >
                  Submit
                </Button>
                &nbsp;
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => {
                    cancelValue();
                  }}
                  title="Cancel"
                  style={{ marginTop: '5px' }}
                >
                  Cancel
                </Button>
              </Grid>
            </MainCard>
          </form>
        </>
      ) : (
        <div></div>
      )}
    </div>
  );
}

export default AadharConsentUpdation;
