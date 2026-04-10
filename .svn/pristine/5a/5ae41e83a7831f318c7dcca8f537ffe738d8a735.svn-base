import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import MainCard from 'ui-component/cards/MainCard';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import axiosInstance from 'hooks/useAuthTokenUrl';
import EditIcon from '@mui/icons-material/Edit';
import {
  Button,
  FormControl,
  Grid,
  Typography,
  TextField,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
  Alert,
  Backdrop,
  CircularProgress
} from '@mui/material';
import AlertSucess from 'components/common/alertSucess';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import BankTypeList from 'components/form_components/BankTypeList';
import MandatoryFields from 'components/common/MandatoryFields';
import StateList from 'components/form_components/StateList';
import DistrictList from 'components/form_components/DistrictList';
import { showalertwhenObjectretrnvalidation } from 'components/common/fieldValidationFunctionByjava';

function BranchUpdate() {
  const [showedit, setShowEdit] = useState(false);

  const columns = [
    {
      field: 'Count',
      headerNam: 'S. No.',
      flex: 1
    },
    {
      field: 'branchCode',
      headerName: 'Branch Code',
      flex: 1
    },
    {
      field: 'ifscCode',
      headerName: 'IFSC Code',
      flex: 1
    },
    {
      field: 'bankName',
      headerName: 'Bank Name',
      flex: 1
    },

    {
      field: 'bankBranchName',
      headerName: 'Branch Name',
      flex: 1
    },
    {
      field: 'bankBranchAddress',
      headerName: 'Branch Address',
      flex: 1
    },

    {
      field: 'action',
      headerName: 'Action',
      flex: 1,
      // headerAlign: 'center',
      renderCell: (params) => (
        <>
          <Button
            //   variant="outlined"
            color="info"
            style={{ cursor: 'pointer', fontSize: '12px', marginRight: '8px' }}
            onClick={() => handleEdit(params)}
          >
            <EditIcon />
          </Button>
        </>
      )
    }
  ];

  const [showAlert, setShowAlert] = useState(false);

  const [getAllState, setAllState] = useState([]);
  const [showValidationPopup, setShowValidationPopup] = useState(false);

  const [bankNames, setBankNames] = useState([]);
  const [stateId, setStateId] = useState('');
  const [districtId, setdistrictId] = useState('');
  const [bankTypeid, setbankTypeid] = useState('');
  const [warningAlert, setShowwarningAlert] = useState('');
  const [loading, setLoading] = useState(false);
  const [buttonClicked, setButtonClicked] = useState(false);
  const fetchBanks = async () => {
    setLoading(true);
    try {
      const getUrl = `/common/findAllBanksByBankType/${getallRowEdit.bankType}`;
      const response = await axiosInstance.get(getUrl);
      setBankNames(response.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error('Error fetching banktypes:', error);
    }
  };

  const fetchData = async () => {
    setLoading(true);

    const getUrl = `/master-management/findAllBranch/${stateId}/${districtId}/${bankTypeid}`;
    const response = await axiosInstance.get(getUrl);
    console.log('llll', response);
    if (response.status >= 200 && response.status < 300) {
      const dataWithSerialNumber = response.data.map((item, index) => ({
        ...item,
        Count: index + 1
      }));
      setLoading(false);
      return dataWithSerialNumber;
    } else {
      setLoading(false);
      throw new Error('Data coud not be fetched!', response.status);
    }
  };

  // --------------------------------------------------------------------
  const [getallRowEdit, setallRowEdit] = useState({});

  const handleEdit = (rowData) => {
    setShowEdit(true);
    setallRowEdit({
      ...rowData.row,
      districtName: rowData.row.districtName // Ensure districtName is included
    });
  };

  const handleInput = (evt) => {
    const name = evt.target.name;
    setallRowEdit((prevRowEdit) => ({
      ...prevRowEdit,
      [name]: evt.target.value
    }));
  };

  // const handleDist = (dist) => {
  //   setallRowEdit((prevRowEdit) => ({
  //     ...prevRowEdit,
  //     districtId: dist
  //   }));
  // };
  const handleSelectbank = (bankType) => {
    setallRowEdit((prevRowEdit) => ({
      ...prevRowEdit,
      bankType: bankType
    }));
  };

  async function postData(e) {
    e.preventDefault();
    event.target.reset();
    setLoading(true);
    setButtonClicked(true);
    const postFormDate = JSON.stringify(getallRowEdit);
    console.log('kkkkkkkkkk', getallRowEdit);
    var result = window.confirm('Are you sure want to Update the record? ');
    if (result) {
      const mandatoryFields = ['bankType', 'bankCode', 'stateId', 'districtId', 'ifscCode', 'bankBranchName', 'bankBranchAddress'];
      const isFormValid = mandatoryFields.every((field) => getallRowEdit[field]);

      if (!isFormValid) {
        setShowValidationPopup(true);
        // Hide the popup after 3 seconds (adjust the timing as needed)
        setTimeout(() => {
          setShowValidationPopup(false);
        }, 3000);
        return;
      }
      try {
        const postUrl = '/master-management/updateBranchMaster';
        const res = await axiosInstance.put(postUrl, postFormDate);
        console.log('formdata', postFormDate);
        console.log('Branch Master Data update : Status Code : ', res.status);
        if (res.status === 201) {
          setShowAlert(true);

          const updatedData = await fetchData();
          // Update the Branch with the new data
          setAllState(updatedData);
          setLoading(false);
          setButtonClicked(false);
          // Automatically hide the alert after 5 seconds
          const timeoutId = setTimeout(() => {
            setShowAlert(false);
          }, 5000);

          // Clear the timeout when the component is unmounted or when showAlert changes
          return () => clearTimeout(timeoutId);
        }
        setLoading(false);
        setButtonClicked(false);
        //navigate("/masters/criteria/update");
      } catch (error) {
        setLoading(false);
        setButtonClicked(false);
        setShowwarningAlert(showalertwhenObjectretrnvalidation(error));

        console.error('Error updating data:', error);
        // setSnackbar({ children: 'Record failed in update!', severity: 'error' });
      }
    } else {
      // ...do nothing
    }
  }

  const rows = getAllState.map((item) => ({
    Count: item.Count,
    bankType: item.bankType,
    id: item.id,
    bankCode: item.bankCode,
    bankName: item.bankName,
    stateId: item.stateId,
    districtId: item.districtId,
    districtName: item ? item.districtName : '',
    ifscCode: item.ifscCode,
    branchCode: item.branchCode,
    bankBranchName: item.bankBranchName,
    bankBranchAddress: item.bankBranchAddress
  }));

  const handleBackButtonClick = () => {
    setShowEdit(false);
  };
  const handleInputBank = (event) => {
    const dist = event.target.value;
    setallRowEdit((prevRowEdit) => ({
      ...prevRowEdit,
      bankCode: dist
    }));
  };

  const handleSelectState = (state) => {
    setStateId(state);
  };

  const handleDistid = (dist) => {
    setdistrictId(dist);
  };
  const handleSelectFilter = (dist) => {
    setbankTypeid(dist);
  };

  useEffect(() => {
    if (bankTypeid) {
      setAllState([]);
      fetchData()
        .then((res) => {
          setAllState(res);
        })
        .catch((e) => {
          console.log(e.message);
        });
    }
    if (getallRowEdit.bankType) {
      fetchBanks();
    }
  }, [bankTypeid, getallRowEdit.bankType]);

  const handleClose = () => {
    setShowwarningAlert('');
  };
  const handleInputChangeData = (event) => {
    if (event.target.value != null && event.target.value != '') {
      event.target.value = event.target.value.replace(/[^a-zA-Z0-9\s()\-.,]/g, '');
    }
  };
  return (
    <div>
      {/* ------------------------------------------------------------------- */}

      {!showedit && (
        <MainCard title="Update Branch Master">
          <Grid container spacing={2} style={{ paddingBottom: '20px' }}>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <StateList onSelectState={handleSelectState} />
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <DistrictList selectedStateId={stateId} onSelectDistrict={handleDistid} />
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <BankTypeList onSelectbankType={handleSelectFilter} />
              </FormControl>
            </Grid>
          </Grid>

          {rows.length !== 0 && (
            <Box sx={{ height: 700, width: '100%' }}>
              <DataGrid
                getRowId={(row) => row.id}
                slots={{ toolbar: GridToolbar }}
                slotProps={{
                  toolbar: {
                    showQuickFilter: true
                  }
                }}
                rows={rows}
                columns={columns}
                initialState={{
                  pagination: {
                    paginationModel: {
                      pageSize: 10
                    }
                  }
                }}
                pageSizeOptions={[10]}
                // checkboxSelection
                disableRowSelectionOnClick
              />
            </Box>
          )}
        </MainCard>
      )}
      {/* ------------------------Edit-------------------------------------------------------- */}

      {showAlert && <AlertSucess msg={'Branch'} setShowAlert={setShowAlert} />}
      {showValidationPopup && <MandatoryFields />}
      {showedit && (
        <MainCard title="Edit Branch Master">
          {warningAlert && (
            <Alert variant="filled" severity="warning" onClose={handleClose}>
              {warningAlert}
            </Alert>
          )}
          <Box sx={{ height: 400, width: '100%' }}>
            <form method="post" onSubmit={postData}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                  <FormControl fullWidth>
                    <StateList onSelectState={handleSelectState} />
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    label="District Name"
                    value={getallRowEdit.districtName || ''}
                    variant="outlined"
                    fullWidth
                    InputProps={{
                      readOnly: true
                    }}
                  />
                  <input type="hidden" name="districtId" value={getallRowEdit.districtId || ''} />
                  <input type="hidden" name="stateId" value={getallRowEdit.stateId || ''} />
                  {/* <input type="hidden" name="stateId" value={getallRowEdit.habitationId || ''} /> */}
                </Grid>
                {/* <Grid item xs={12} sm={4}>
                  <FormControl fullWidth>
                    <DistrictList
                      selectedStateId={getallRowEdit.stateId}
                      onSelectDistrict={handleDist}
                      defaultSelectedDistrict={getallRowEdit.districtId}
                    />
                  </FormControl>
                </Grid> */}

                <Grid item xs={12} sm={4}>
                  <FormControl fullWidth>
                    <TextField fullWidth label="Branch Code" value={getallRowEdit.branchCode} aria-readonly />
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <FormControl fullWidth>
                    <TextField fullWidth label="IFSC Code" value={getallRowEdit.ifscCode} aria-readonly />
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <FormControl fullWidth>
                    <BankTypeList onSelectbankType={handleSelectbank} defaultSelectedBankType={getallRowEdit.bankType} />
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <FormControl fullWidth>
                    <InputLabel id="Bank Name-label">Bank Name</InputLabel>
                    <Select
                      labelId="Bank Name-label"
                      id="bankCode"
                      label="Bank Name-label"
                      name="bankCode"
                      value={getallRowEdit.bankCode}
                      onChange={handleInputBank}
                    >
                      {bankNames.map((item) => (
                        <MenuItem key={item.bankCode} value={item.bankCode}>
                          {item.bankName}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    value={(getallRowEdit.bankName || '').toUpperCase()}
                    label="Branch Name"
                    name="bankName"
                    placeholder="Enter Branch Name"
                    required
                    variant="outlined"
                    fullWidth
                    onChange={handleInput}
                    InputProps={{
                      inputProps: {
                        pattern: '^[A-Za-z\\s]*$',
                        title: 'Only characters are allowed',
                        maxLength: 70
                      },
                      endAdornment: (
                        <InputAdornment position="end">
                          <Typography variant="h3" color="error">
                            *
                          </Typography>
                        </InputAdornment>
                      )
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={4}>
                  <TextField
                    value={(getallRowEdit.bankBranchAddress || '').toUpperCase()}
                    label="Branch Address"
                    name="bankBranchAddress"
                    placeholder="Enter Branch Address"
                    required
                    variant="outlined"
                    fullWidth
                    onChange={handleInput}
                    onInput={handleInputChangeData}
                  />
                </Grid>
              </Grid>

              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '20px' }}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  style={{ marginRight: '10px' }}
                  title="Update"
                  disabled={buttonClicked}
                >
                  Update
                </Button>
                <Button
                  type="button"
                  variant="contained"
                  color="error" // Note: "danger" is not a valid color, you might want to use "error"
                  style={{ marginLeft: '10px' }}
                  title="Back"
                  onClick={() => handleBackButtonClick()} // Add an onClick handler if needed
                >
                  <ArrowBackIcon /> Back
                </Button>
              </div>
            </form>
          </Box>
        </MainCard>
      )}
      <Backdrop open={loading} style={{ zIndex: 999, color: '#fff' }}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </div>
  );
}

export default BranchUpdate;
