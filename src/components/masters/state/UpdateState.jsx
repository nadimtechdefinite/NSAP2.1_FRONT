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
  MenuItem,
  Select,
  InputAdornment,
  Backdrop,
  CircularProgress
} from '@mui/material';
import AlertSucess from 'components/common/alertSucess';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
function UpdateState() {
  const [showedit, setShowEdit] = useState(false);

  const columns = [
    {
      field: 'Count',
      headerNam: 'S. No.',
      flex: 1
    },
    {
      field: 'stateId',
      headerName: 'State Code',
      flex: 1
    },
    {
      field: 'stateName',
      headerName: 'State Name',
      flex: 1
    },
    {
      field: 'stateShortName',
      headerName: 'State Short Name',
      flex: 1
    },
    {
      field: 'stateNodalAgencyName',
      headerName: 'State Nodal Agency Name',
      flex: 1
    },
    {
      field: 'stateAgencyAddress',
      headerName: 'State Nodal Agency Address',
      flex: 1
    },
    {
      field: 'levelOfApplication',
      headerName: 'Level Of Application',
      flex: 1
    },
    {
      field: 'unionTerritory',
      headerName: 'Union Territory',
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
  const [loading, setLoading] = useState(false);
  const [buttonClicked, setButtonClicked] = useState(false);

  const fetchData = async () => {
    const getUrl = '/master-management/findAllStates';
    const response = await axiosInstance.get(getUrl);
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
    const mandatoryFields = ['stateName', 'stateShortName'];

    const isFormValid = mandatoryFields.every((field) => getallRowEdit[field]);

    if (!isFormValid) {
      setShowValidationPopup(true);
      // Hide the popup after 3 seconds (adjust the timing as needed)
      setTimeout(() => {
        setShowValidationPopup(false);
      }, 3000);
      return;
    }

    const postFormDate = JSON.stringify(getallRowEdit);
    var result = window.confirm('Are you sure want to Update the record? ');
    if (result) {
      setLoading(true);
      setButtonClicked(true);
      try {
        const postUrl = '/master-management/updateState';
        const res = await axiosInstance.put(postUrl, postFormDate);
        console.log('State Master Data update : Status Code : ', res.status);
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
        console.error('Error updating data:', error);
        // setSnackbar({ children: 'Record failed in update!', severity: 'error' });
      }
    } else {
      // ...do nothing
    }
  }

  const rows = getAllState.map((item) => ({
    id: item.stateId,
    Count: item.Count,
    stateName: item.stateName,
    stateId: item.stateId,
    stateShortName: item.stateShortName,
    stateNodalAgencyName: item.stateNodalAgencyName,
    stateAgencyAddress: item.stateAgencyAddress,
    levelOfApplication: item.levelOfApplication,
    unionTerritory: item.unionTerritory
  }));

  const handleBackButtonClick = () => {
    setShowEdit(false);
  };
  useEffect(() => {
    fetchData()
      .then((res) => {
        setAllState(res);
      })
      .catch((e) => {
        console.log(e.message);
      });
  }, []);
  return (
    <div>
      {/* ------------------------------------------------------------------- */}

      {!showedit && (
        <MainCard title="Update State Master">
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

      {showAlert && <AlertSucess msg={'State'} />}

      {showedit && (
        <MainCard title="Edit State Master">
          <Box sx={{ height: 400, width: '100%' }}>
            <form method="post" onSubmit={postData}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                  <FormControl fullWidth>
                    <TextField fullWidth label="State Code" value={getallRowEdit.id} aria-readonly />
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={4}>
                  <TextField
                    value={(getallRowEdit.stateName || '').toUpperCase()}
                    label="State Name"
                    name="stateName"
                    placeholder="Enter State Name"
                    required
                    variant="outlined"
                    fullWidth
                    onChange={handleInput}
                    InputProps={{
                      inputProps: {
                        pattern: '^[A-Za-z\\s]*$',
                        title: 'Only characters are allowed',
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
                    value={(getallRowEdit.stateShortName || '').toUpperCase()}
                    label="State Short Name"
                    name="stateName"
                    placeholder="Enter State Short Name"
                    required
                    variant="outlined"
                    fullWidth
                    onChange={handleInput}
                    InputProps={{
                      inputProps: {
                        pattern: '^[A-Za-z\\s]*$',
                        title: 'Only characters are allowed',
                        maxLength: 2
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

                {/* <Grid item xs={12} sm={4}>
                  <TextField
                    value={(getallRowEdit.stateNodalAgencyName || '').toUpperCase()}
                    label="State Nodal Agency Name"
                    name="stateNodalAgencyName"
                    placeholder="Enter State Nodal Agency Name"
                    required
                    variant="outlined"
                    fullWidth
                    onChange={handleInput}
                    InputProps={{
                      inputProps: {
                        pattern: '^[A-Za-z\\s]*$',
                        title: 'Only characters are allowed',
                        maxLength: 50,
    
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
                    value={getallRowEdit.stateAgencyAddress || ''}
                    label="State Nodal Agency Address"
                    name="stateAgencyAddress"
                    placeholder="Enter State Nodal Agency Address"
                    required
                    variant="outlined"
                    fullWidth
                    onChange={handleInput}
                    InputProps={{
                      inputProps: {
                        // pattern: '^[A-Za-z\\s]*$',
                        // title: 'Only characters are allowed',
                        maxLength: 50,
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
                </Grid> */}

                {/* <Grid item xs={12} sm={4}>
                  <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">Level Of Application</InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      label="Level Of Application"
                      name="levelOfApplication"
                      value={getallRowEdit.levelOfApplication}
                      onChange={handleInput}
                    >
                      <MenuItem value="1">1</MenuItem>
                      <MenuItem value="2">2</MenuItem>
                      <MenuItem value="3">3</MenuItem>
                    </Select>
                  </FormControl>
                </Grid> */}

                <Grid item xs={12} sm={4}>
                  <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">Union Territory</InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      label="Union Territory"
                      name="unionTerritory"
                      value={getallRowEdit.unionTerritory}
                      onChange={handleInput}
                    >
                      <MenuItem value="Yes">Yes</MenuItem>
                      <MenuItem value="No">No</MenuItem>
                    </Select>
                  </FormControl>
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

export default UpdateState;
