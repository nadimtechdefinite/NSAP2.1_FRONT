import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import MainCard from 'ui-component/cards/MainCard';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import axiosInstance from 'hooks/useAuthTokenUrl';
import EditIcon from '@mui/icons-material/Edit';
import { Paper, Button, FormControl, Grid, Typography, TextField, InputAdornment, Alert, Backdrop, CircularProgress } from '@mui/material';
import AlertSucess from 'components/common/alertSucess';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import StateList from 'components/form_components/StateList';
import { showalertwhenObjectretrnvalidation } from 'components/common/fieldValidationFunctionByjava';

function UpdateDistrict() {
  const [showedit, setShowEdit] = useState(false);

  const columns = [
    {
      field: 'Count',
      headerNam: 'S. No.',
      flex: 1
    },
    {
      field: 'districtId',
      headerName: 'District Code',
      flex: 1
    },
    {
      field: 'districtName',
      headerName: 'District Name',
      flex: 1
    },
    {
      field: 'districtShortName',
      headerName: 'District Short Name',
      flex: 1
    },
    {
      field: 'lgtDistrictCode',
      headerName: 'District LGD',
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
  const [stateId, setStateId] = useState('');
  const [warningAlert, setShowwarningAlert] = useState('');
  const [loading, setLoading] = useState(false);
  const [buttonClicked, setButtonClicked] = useState(false);

  const fetchData = async () => {
    // alert(stateId)
    const getUrl = `/master-management/findAllDistrict/${stateId}`;
    const response = await axiosInstance.get(getUrl);
    console.log('data' + JSON.stringify(response.data));
    if (response.status >= 200 && response.status < 300) {
      const dataWithSerialNumber = response.data.map((item, index) => ({
        ...item,
        Count: index + 1 // Using index as the default row identifier
      }));
      return dataWithSerialNumber;
    } else {
      throw new Error('Data coud not be fetched!', response.status);
    }
  };

  // --------------------------------------------------------------------
  const [getallRowEdit, setallRowEdit] = useState({});

  const handleEdit = (rowData) => {
    setShowEdit(true);
    console.log('Editing:', rowData.row);
    setallRowEdit(rowData.row);

    // }
  };

  const handleInput = (evt) => {
    const name = evt.target.name;
    setallRowEdit((prevRowEdit) => ({
      ...prevRowEdit,
      [name]: evt.target.value
    }));
  };

  async function postData(e) {
    e.preventDefault();
    event.target.reset();
    setLoading(true);
    setButtonClicked(true);
    const postFormDate = JSON.stringify(getallRowEdit);
    var result = window.confirm('Are you sure want to Update the record? ');
    if (result) {
      try {
        const postUrl = '/master-management/updateDistrict';
        const res = await axiosInstance.put(postUrl, postFormDate);
        console.log('District Master Data update : Status Code : ', res.status);
        if (res.status === 201) {
          setShowAlert(true);

          const updatedData = await fetchData();
          // Update the state with the new data
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
        alert()
        setShowwarningAlert(showalertwhenObjectretrnvalidation(error));
        console.error('Error updating data:', error);
        // setSnackbar({ children: 'Record failed in update!', severity: 'error' });
      }
    } else {
      setLoading(false);
        setButtonClicked(false);
    }
  }

  const rows = getAllState.map((item) => ({
    id: item.districtId,
    Count: item.Count,
    stateName: item.stateName,
    stateId: item.stateId,
    districtName: item.districtName,
    districtShortName: item.districtShortName,
    districtId: item.districtId,
    lgtDistrictCode: item.lgtDistrictCode
  }));

  const handleBackButtonClick = () => {
    setShowEdit(false);
  };

  const handleSelectState = (state) => {
    setStateId(state);
  };
  const handleInputChangeData = (event) => {
    if (event.target.value != null && event.target.value != '') {
      event.target.value = event.target.value.replace(/[^0-9]/g, '');
    }
  };
  useEffect(() => {
    if(stateId){
      fetchData()
      .then((res) => {
        setAllState(res);
      })
      .catch((e) => {
        console.log(e.message);
      });
    }
    
  }, [stateId]);

  const handleClose = () => {
    setShowwarningAlert('');
  };

  return (
    <div>
      {/* ------------------------------------------------------------------- */}

      {!showedit && (
        <MainCard title="Update District Master">
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <StateList onSelectState={handleSelectState} />
              </FormControl>
            </Grid>
          </Grid>

          <Paper
            elevation={1} // Set the elevation to give it a shadow
            style={{ backgroundColor: 'lightblue', padding: '16px' }} // Set your desired background color
          >
            <Typography variant="h5" style={{ color: 'black', textAlign: 'center' }}>
              State Name - {rows.length > 0 ? rows[0].stateName : ''}
            </Typography>
          </Paper>
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
        </MainCard>
      )}
      {/* ------------------------Edit-------------------------------------------------------- */}

      {showAlert && <AlertSucess msg={'District'} setShowAlert={setShowAlert} />}

      {showedit && (
        <MainCard title="Edit District Master">
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
                    <TextField fullWidth label="District Code" value={getallRowEdit.id} aria-readonly />
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={4}>
                  <TextField
                    value={(getallRowEdit.districtName || '').toUpperCase()}
                    label="District Name"
                    name="districtName"
                    placeholder="Enter District Name"
                    required
                    variant="outlined"
                    fullWidth
                    onChange={handleInput}
                    InputProps={{
                      inputProps: {
                        pattern: '^[A-Za-z\\d\\s]*$',
                        title: 'Only characters and numbers are allowed',
                        maxLength: 50
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
                    value={(getallRowEdit.districtShortName || '').toUpperCase()}
                    label="District Short Name"
                    name="districtShortName"
                    placeholder="Enter District Short Name"
                    required
                    variant="outlined"
                    fullWidth
                    onChange={handleInput}
                    InputProps={{
                      inputProps: {
                        pattern: '^[A-Za-z\\d\\s]*$',
                        title: 'Only characters and numbers are allowed',
                        maxLength: 50
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
                    value={getallRowEdit.lgtDistrictCode || ''}
                    label="District LGD"
                    name="lgtDistrictCode"
                    placeholder="Enter District LGD"
                    required
                    variant="outlined"
                    fullWidth
                    onChange={handleInput}
                    onInput={handleInputChangeData}
                    InputProps={{
                      inputProps: {
                        pattern: '^[0-9]*$', // Allow only numbers
                        title: 'Only numbers are allowed',
                        maxLength: 10
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
          <Backdrop open={loading} style={{ zIndex: 999, color: '#fff' }}>
            <CircularProgress color="inherit" />
          </Backdrop>
        </MainCard>
      )}
    </div>
  );
}

export default UpdateDistrict;
