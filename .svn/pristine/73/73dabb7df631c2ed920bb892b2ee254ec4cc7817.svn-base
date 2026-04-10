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
import EditIcon from '@mui/icons-material/Edit';
import SearchComponent from 'components/common/SearchTypeCommon';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import { accountBankFormValidation } from './AccountBankFormValidation';
import { List, ListItem, Popper } from '@mui/material';
import StateList from 'components/form_components/StateList';
import DistrictList from 'components/form_components/DistrictList';
import SubDistrictList from 'components/form_components/SubDistrictList';
import GramPanchayatList from 'components/form_components/GramPanchayatList';
import VillageList from 'components/form_components/VillageList';
import AreaList from 'components/form_components/AreaList';
import './accountBank.css';
import { useNavigate } from 'react-router-dom';
import messages_en from '../../../components/common/messages_en.json';

function AccountBankDetailsUpdation() {
  const [getAllDistrictTemp, setAllDistrictTemp] = useState([]);
  const [allIfscCodeData, setAllIfscCodeData] = useState([]);
  // const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [getAllDistrict, setAllDistrict] = useState([]);
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
  //const [uidcheckStatus, setUidcheckStatus] = React.useState('');
  //const [testRowId, setTestRowId] = React.useState(null);
  //const [checkData, setCheckData]=React.useState('');
  const [submitFinalValue, setSubmitFinalValue] = React.useState(false);
  const [sanctionNumberTemp, setSanctionNumberTemp] = React.useState();
  const [formErrors, setFormErrors] = useState({});
  const navigate = useNavigate();

  const handleUidStatusChange = (event) => {
    setUidStatus(event.target.value);
  };

  function cancelValue() {
    navigate('/nsap/dashboard/default');
  }

  const handleDropdownChange = (id, field, selectedValue) => {
    setAllDistrict((prevRows) => prevRows.map((row) => (row.sanctionOrderNo === id ? { ...row, [field]: selectedValue } : row)));
  };

  function setSubmitValue() {
    setSubmitFinalValue('true');
  }

  const handleChangeVer = (value, rowId) => {
    //alert(value+'  - '+rowId);
    setAllDistrict((prevRows) => prevRows.map((row) => (row.sanctionOrderNo === rowId ? { ...row, ['aadharVerify']: value } : row)));
  };

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
      field: 'disbursementCode',
      disableColumnMenu: true,
      sortable: false,
      headerName: (
        <div>
          <EditIcon fontSize="small" style={{ marginBottom: '-4px', color: 'blue' }} /> Disbursement Mode
        </div>
      ),
      flex: 1,
      width: 54,
      renderCell: (params) => (
        <select
          value={params.value}
          onChange={(e) => handleDropdownChange(params.id, 'disbursementCode', e.target.value)}
          style={{
            background: 'white',
            border: '1px solid #ced4da',
            borderRadius: '4px',
            padding: '6px 12px',
            width: '65%',
            boxSizing: 'border-box',
            fontSize: '14px'
          }}
        >
          <option value="0">Select</option>
          <option value="1">Bank</option>
          <option value="2">PO</option>
          <option value="3">MO</option>
          <option value="4">Cash</option>
        </select>
      )
    },
    {
      field: 'bankPoAccountNo',
      disableColumnMenu: true,
      sortable: false,
      headerName: (
        <div>
          <EditIcon fontSize="small" style={{ marginBottom: '-4px', color: 'blue' }} /> Bank Account No
        </div>
      ),
      flex: 1,
      renderCell: (params) => (
        <input
          style={{
            borderBottomStyle: 'hidden',
            borderTopStyle: 'hidden',
            borderLeftStyle: 'hidden',
            borderRightStyle: 'hidden',
            height: '39px'
          }}
          type="text"
          value={params.value}
          onChange={(e) => handleInputBankPoChange(params.id, e.target.value)}
          onInput={handleInputChangeData}
          maxLength={20}
          onBlur={(e) => {
            handleBnakPo(params.id, e.target.value);
            checkingLength(e.target.value);
          }}
        />
      )
    },
    {
      field: 'ifscCode',
      disableColumnMenu: true,
      sortable: false,
      headerName: (
        <div>
          <EditIcon fontSize="small" style={{ marginBottom: '-4px', color: 'blue' }} /> IFSC Code
        </div>
      ),
      flex: 1,
      renderCell: (params) => (
        <input
          style={{
            borderBottomStyle: 'hidden',
            borderTopStyle: 'hidden',
            borderLeftStyle: 'hidden',
            borderRightStyle: 'hidden',
            height: '39px'
          }}
          type="text"
          value={params.value}
          onChange={(e) => handleInputChange(params.id, e.target.value, e)}
          maxLength={20}
        />
      )
    },
    {
      headerName: '',
      width: 10,
      valueGetter: (params) => (params.row.aadharVerify ? '✔' : params.row.aadharVerify === false ? '✖' : ''),
      //valueGetter: (params) => params.row.aadharVerify ? '✅' : (params.row.aadharVerify === false ? '❌' : ''),
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

  const handleEditCellChange = (params) => {
    if (params.field === 'ifscCode') {
      const newValue = params.props.value; // The new value entered in the cell
      console.log('New value entered:', newValue);
    }
  };

  const handleListItemClick = (event, index, updatedIfscCode, sanctionOrderNo) => {
    //alert(" ==== : "+updatedIfscCode)
    console.log(event, index);
    //event.preventDefault();
    setAnchorEl(null);
    setAllDistrict((prevRows) =>
      prevRows.map((row) => (row.sanctionOrderNo === sanctionOrderNo ? { ...row, ['ifscCode']: updatedIfscCode } : row))
    );
    setAllIfscCodeData([]);

    setAllDistrict((prevRows) =>
      prevRows.map((row) => (row.sanctionOrderNo === sanctionOrderNo ? { ...row, ['aadharVerify']: true } : row))
    );
  };

  const handleInputChangeData = (event) => {
    if (event.target.value != null && event.target.value != '') {
      event.target.value = event.target.value.replace(/[^0-9]/g, '');
    }
  };

  async function handleBnakPo(id, value) {
    //console.log("+++++ "+id+" - "+value);
    //alert("+++++ "+id+" - "+value+ " - "+value.length);
    if (value.length != 0 && value.length >= 8) {
      const findIfscData = `/bank-account-updation/getCheckAccountNumberOrNot/${value}/${id}`;
      const response = await axiosInstance.get(findIfscData);
      console.log('@@@-- ' + response.data);
      if (response.data.length != 0) {
        alert(response.data);
        setAllDistrict((prevRows) => prevRows.map((row) => (row.sanctionOrderNo === id ? { ...row, ['aadharVerify']: false } : row)));
      }
    }
  }

  function checkingLength(acc) {
    //console.log("length is "+acc.length)
    if (acc.length < 8) {
      alert('Bank Account No length is not valid(min:8 & max:20)');
    }
  }

  const handleInputBankPoChange = (id, value) => {
    console.log('-->>>> ' + id, value, value.length);

    // start if account no is less then 6 digit checking here
    if (value.length >= 8) {
      setAllDistrict((prevRows) => prevRows.map((row) => (row.sanctionOrderNo === id ? { ...row, ['aadharVerify']: true } : row)));
    } else {
      setAllDistrict((prevRows) => prevRows.map((row) => (row.sanctionOrderNo === id ? { ...row, ['aadharVerify']: false } : row)));
    }
    //end

    setAllDistrict((prevRows) => prevRows.map((row) => (row.sanctionOrderNo === id ? { ...row, ['bankPoAccountNo']: value } : row)));
  };

  const handleInputChange = (id, value, e) => {
    //console.log("san order is: "+id+" --- ifsc code is: "+value);
    e.preventDefault();
    setAnchorEl(e.currentTarget);
    fetchIfscCodeData(value, e);
    setSanctionNumberTemp(id);

    const result = getAllDistrict.find((row) => row.sanctionOrderNo === id);

    if (result.bankPoAccountNo === '') {
      alert('Please first fill Bank Account No !');
    } else {
      setAllDistrict((prevRows) => prevRows.map((row) => (row.sanctionOrderNo === id ? { ...row, ['ifscCode']: value } : row)));

      setAllDistrict((prevRows) => prevRows.map((row) => (row.sanctionOrderNo === id ? { ...row, ['aadharVerify']: false } : row)));
    }
  };

  const fetchIfscCodeData = async (inputValue) => {
    try {
      if (inputValue.length >= 3) {
        const findIfscCodeUrl = `/bank-account-updation/getBankIFSC/${inputValue}`;
        const response = await axiosInstance.get(findIfscCodeUrl);
        console.log('++++ :: ' + response.data.length);
        if (response.data.length != 0) {
          setAllIfscCodeData(Array.isArray(response.data) ? response.data : []);
        } else {
          //alert("Not valid Ifsc Code !");
          setSnackbar({ children: 'Not valid Ifsc Code', severity: 'error' });
        }
      } else if (inputValue.length < 3) {
        //alert(allIfscCodeData.length);
        setAllIfscCodeData([]);
      }
    } catch (error) {
      console.error('Error fetching criteria data:', error);
    }
  };

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
        const getUrl = `/bank-account-updation/getBankAccountUpdation`;
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
    schemeCode: item.schemeCode,
    contactPersonMobile: item.contactPersonMobile,
    stateCode: item.stateCode,
    districtCode: item.districtCode,
    gender: item.gender,
    bankPoAccountNo: item.bankPoAccountNo,
    ifscCode: item.ifscCode,
    disbursementCode: item.disbursementCode,
    nameAsPerAccount: item.nameAsPerAccount,
    banktype: item.banktype,
    branchCode: item.branchCode,
    subDistrictMunicipalAreaCode: item.subDistrictMunicipalAreaCode,
    gramPanchayatWardCode: item.gramPanchayatWardCode,
    villageCode: item.villageCode,
    area: item.area,
    aadharVerify: item.aadharVerify
  }));
  const processRowUpdate = React.useCallback(
    async (updatedRow) => {
      try {
        const updatedRowData = await mutateRow(updatedRow);
        setAllDistrict((prevRows) => {
          const rowIndex = prevRows.findIndex((row) => row.sanctionOrderNo === updatedRowData.sanctionOrderNo);

          const updatedRows = [...prevRows];
          //alert(" updated uid_NO-- "+updatedRowData.uidNo+"   naME->>> "+updatedRowData.nameasUid);
          //alert(updatedRow.length+'  length is  -- '+updatedRows.length);
          handleChangeVer(true, updatedRowData.sanctionData);

          updatedRows[rowIndex] = {
            ...updatedRows[rowIndex],
            bankPoAccountNo: updatedRowData.bankPoAccountNo,
            ifscCode: updatedRowData.ifscCode
          };
          return updatedRows;
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

    if (selectedRows.length === 0) {
      setSnackbar({ children: 'Please select at least one row.', severity: 'error' });
      return;
    }
    const selectedData = getAllDistrict.filter((row) => selectedRows.indexOf(row.sanctionOrderNo) !== -1);

    const updatedData1 = await processRowUpdate(selectedData);
    console.log('updated Row status : ', JSON.stringify(selectedData));

    const validationErrors = await accountBankFormValidation(selectedRows, getAllDistrictTemp, getAllDistrict);

    if (validationErrors.length > 0) {
      validationErrors.forEach((error) => {
        setSnackbar({ children: error, severity: 'error' });
      });
      return;
    }

    try {
      const body = { uidStatus, updatedData1 };
      const apiUrl = '/bank-account-updation/saveBankAccountDetails/' + uidStatus;
      setLoading(true);
      const response = await axiosInstance.post(apiUrl, JSON.stringify(body));

      console.log('API Response:', response.data);
      if (response.status >= 200 && response.status < 300) {
        setSnackbar({ children: 'Record successfully updated', severity: 'success' });
        await new Promise((resolve) => setTimeout(resolve, 1250));
        setAllDistrict([]);
        handleClickOpen(e);
      } else {
        setSnackbar({ children: 'Error in updating data', severity: 'success' });
        await new Promise((resolve) => setTimeout(resolve, 1250));
      }
    } catch (error) {
      if (error.response.status === 424) {
        setSnackbar({ children: 'Found duplicate Bank Account No.Kindly update correct.', severity: 'error' });
        setTimeout(() => {
          navigate('/verification/accountBankDetailsUpdation');
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
      <MainCard title="Bank Account Updation">
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
                  setSelectedGramPanchayat={setSelectedGramPanchyat}
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
                <FormControlLabel value="notverified" control={<Radio />} label="Not Registered" />
                <FormControlLabel value="verified" control={<Radio />} label="Registered" />
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
                onEditCellChange={handleEditCellChange}
                initialState={{
                  pagination: {
                    paginationModel: {
                      pageSize: 15
                    }
                  }
                }}
                pageSizeOptions={[15]}
              />

              {allIfscCodeData.length >= 1 && (
                <Popper
                  open={Boolean(anchorEl)}
                  anchorEl={anchorEl}
                  onClose={() => setAnchorEl(null)}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left'
                  }}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left'
                  }}
                  PaperProps={{
                    style: {
                      maxHeight: '300px',
                      width: '500px',
                      overflowY: 'auto',
                      marginLeft: '-41px'
                    }
                  }}
                >
                  <List style={{ maxHeight: '300px', width: '500px', overflowY: 'auto', backgroundColor: 'slategray', color: 'white' }}>
                    {allIfscCodeData.map((data, index) =>
                      data.ifscCode === 'No Data Found.' ? (
                        'No Data Found.'
                      ) : (
                        <ListItem
                          button
                          key={index}
                          onClick={(event) => {
                            event.preventDefault();
                            handleListItemClick(event, index, data.ifscCode, sanctionNumberTemp);
                          }}
                        >
                          {data.ifscCode}--{data.bankType}--{data.bankBranchCode}--{data.bankCode}--{data.bankBranchName}
                          <br />
                          {data.bankName}--{data.bankBranchAddress}
                        </ListItem>
                      )
                    )}
                  </List>
                </Popper>
              )}

              {uidStatus === 'verified' ? (
                <span style={{ textAlign: 'center', color: 'red' }} className="blink">
                  <b>NOTE:</b> Need to approve Bank Account No from approver authority.
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
export default AccountBankDetailsUpdation;
