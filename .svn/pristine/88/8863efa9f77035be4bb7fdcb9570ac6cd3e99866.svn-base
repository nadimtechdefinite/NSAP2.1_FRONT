import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import MainCard from 'ui-component/cards/MainCard';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import axiosInstance from 'hooks/useAuthTokenUrl';
import EditIcon from '@mui/icons-material/Edit';
import {  Button, FormControl, Grid, Typography, TextField ,InputLabel, Select, MenuItem, Backdrop, CircularProgress } from '@mui/material';
import AlertSucess from 'components/common/alertSucess';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import StateList from 'components/form_components/StateList';
function AssignRoleUpdate() {
  const [showedit, setShowEdit] = useState(false);

  const columns = [
    {
      field: 'Count',
      headerNam: 'S. No.',
      flex: 1
    },
    {
      field: 'userCode',
      headerName: 'User Name',
      flex: 1
    },
    {
      field: 'roleName',
      headerName: 'Role Name',
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
  const [stateId, setStateId] = useState('');

  const [getAllState, setAllState] = useState([]);

  const fetchData = async () => {
    // alert(stateId)
    const getUrl = `/master-management/findAllAssignRole/${stateId}`;
    const response = await axiosInstance.get(getUrl);
    console.log('data' +JSON.stringify(response.data));
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
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [buttonClicked, setButtonClicked] = useState(false);


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
        const postUrl = '/master-management/AssignRoleUpdate';
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
        console.error('Error updating data:', error);
        // setSnackbar({ children: 'Record failed in update!', severity: 'error' });
      }
    } else {
      // ...do nothing
    }
  }

  const rows = getAllState.map((item) => ({
    userRoleId: item.userRoleId,
    Count: item.Count,
    roleName: item.roleName,
    userCode: item.userCode,
    roleId: item.roleId,
    
  }));

  const handleBackButtonClick = () => {
    setShowEdit(false);
  };

  const fetchRoles = async () => {
    try {
      const getUrl = `/master-management/findAllRoleMaster/${stateId}`;
      const response = await axiosInstance.get(getUrl);
      setRoles(response.data);
    } catch (error) {
      console.error('Error fetching banktypes:', error);
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
      
        fetchRoles();
      }
     

  }, [stateId]);

  const handleSelectStateid = (state) => {
    setStateId(state);
  };

  return (
    <div>
      
      {/* ------------------------------------------------------------------- */}

      {!showedit && (
        <MainCard title="Update Assign Role Master">
          <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <StateList onSelectState={handleSelectStateid} isMandatory={true} />
              </FormControl>
            </Grid>
         </Grid>
          <Box sx={{ height: 700, width: '100%' }}>
            <DataGrid
              getRowId={(row) => row.userRoleId}
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

      {showAlert && <AlertSucess msg={'Assign Role'} setShowAlert={setShowAlert}/>}

      {showedit && (
        <MainCard title="Edit Assign Role Master">
          <Box sx={{ height: 400, width: '100%' }}>
            <form method="post" onSubmit={postData}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                  <FormControl fullWidth>
                    <TextField fullWidth label="User Name" value={getallRowEdit.userCode} aria-readonly />
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <InputLabel id="User Name-label">
                  Role Name
                  <Typography variant="body1" color="error" style={{ marginLeft: 5 }}>
                    *
                  </Typography>
                </InputLabel>
                <Select
                  labelId="Role Name-label"
                  id="roleId"
                  label="Role Name-label"
                  name="roleId"
                  value={getallRowEdit.roleId}
                  onChange={handleInput}
                  required
                >
                  {roles.map((item) => (
                    <MenuItem key={item.roleId} value={item.roleId}>
                      {item.roleName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

                
              </Grid>

              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '20px' }}>
                <Button type="submit" variant="contained" color="primary" style={{ marginRight: '10px' }} title="Update" disabled={buttonClicked}>
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

export default AssignRoleUpdate;
