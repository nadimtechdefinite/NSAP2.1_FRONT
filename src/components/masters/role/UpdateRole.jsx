import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import MainCard from 'ui-component/cards/MainCard';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import axiosInstance from 'hooks/useAuthTokenUrl';
import EditIcon from '@mui/icons-material/Edit';
import { Button, FormControl, Grid, Typography, TextField, InputAdornment, Alert, Backdrop, CircularProgress } from '@mui/material';
import AlertSucess from 'components/common/alertSucess';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { showalertwhenObjectretrnvalidation } from 'components/common/fieldValidationFunctionByjava';
import StateList from 'components/form_components/StateList';
import UserLevelList from 'components/form_components/UserLevelList';

function UpdateRole() {
  const [showedit, setShowEdit] = useState(false);

  const columns = [
    {
      field: 'Count',
      headerNam: 'S. No.',
      flex: 1
    },
    {
      field: 'roleName',
      headerName: 'Role Name',
      flex: 1
    },
    {
      field: 'roleDescription',
      headerName: 'Role Description',
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
  const [warningAlert, setShowwarningAlert] = useState('');
  const [loading, setLoading] = useState(false);
  const [buttonClicked, setButtonClicked] = useState(false);
  const [stateId, setStateId] = useState('');
  const [getAllState, setAllState] = useState([]);

  const fetchData = async () => {
    const getUrl = `/master-management/findAllRoleMaster/${stateId}`;
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
      [name]: evt.target.value.toUpperCase()
    }));
  };

  async function postData(e) {
    e.preventDefault();
    event.target.reset();
    setLoading(true);
    setButtonClicked(true);

    const updatedRowEdit = {
      ...getallRowEdit, // Spread the existing getallRowEdit properties
      stateId: stateId // Add stateId as a new property
    };

    const postFormDate = JSON.stringify(updatedRowEdit);
    console.log(postFormDate);
    var result = window.confirm('Are you sure want to Update the record? ');
    if (result) {
      try {
        const postUrl = '/master-management/updateRole';
        const res = await axiosInstance.put(postUrl, postFormDate);
        console.log('Role Master Data update : Status Code : ', res.status);
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
        setShowwarningAlert(showalertwhenObjectretrnvalidation(error));
        console.error('Error updating data:', error);
        // setSnackbar({ children: 'Record failed in update!', severity: 'error' });
      }
    }
    setLoading(false);
    setButtonClicked(false);
  }

  const rows = getAllState.map((item) => ({
    roleId: item.roleId,
    Count: item.Count,
    roleName: item.roleName,
    stateId: item.stateId,
    userLevelId: item.userLevelId,
    roleDescription: item.roleDescription
  }));

  const handleBackButtonClick = () => {
    setShowEdit(false);
  };
  const handleClose = () => {
    setShowwarningAlert('');
  };

  const handleSelectStateid = (state) => {
    setStateId(state);
  };

  useEffect(() => {
    setLoading(true);
    if (stateId) {
      fetchData()
        .then((res) => {
          setAllState(res);
        })
        .catch((e) => {
          setLoading(false);
          console.log(e.message);
        });
    }
    setLoading(false);
  }, [stateId]);
  return (
    <div>
      {/* ------------------------------------------------------------------- */}

      {!showedit && (
        <MainCard title="Update Role Master">
          <Grid container spacing={2} style={{ paddingBottom: '20px' }}>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <StateList onSelectState={handleSelectStateid} isMandatory={true} />
              </FormControl>
            </Grid>
          </Grid>

          <Box sx={{ height: 700, width: '100%' }}>
            <DataGrid
              getRowId={(row) => row.roleId}
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

      {showAlert && <AlertSucess msg={'Role'} setShowAlert={setShowAlert} />}

      {showedit && (
        <MainCard title="Edit Role Master">
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
                    <TextField fullWidth label="Role Code" value={getallRowEdit.roleId} aria-readonly />
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={4}>
                  <TextField
                    value={(getallRowEdit.roleName || '').toUpperCase()}
                    label="Role Name"
                    name="roleName"
                    placeholder="Enter Role Name"
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
                    value={(getallRowEdit.roleDescription || '').toUpperCase()}
                    label="Role Description"
                    name="roleDescription"
                    placeholder="Enter Role Description"
                    required
                    variant="outlined"
                    fullWidth
                    onChange={handleInput}
                    InputProps={{
                      inputProps: {
                        pattern: '^[A-Za-z\\d\\s]*$',
                        title: 'Only characters and numbers are allowed',
                        maxLength: 100
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
                  <FormControl fullWidth>
                    <UserLevelList onSelectUserLevel={handleInput} selectedUserLevel={getallRowEdit.userLevelId} isMandatory={true} />
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
        </MainCard>
      )}
      <Backdrop open={loading} style={{ zIndex: 999, color: '#fff' }}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </div>
  );
}

export default UpdateRole;
