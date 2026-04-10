import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import MainCard from 'ui-component/cards/MainCard';
import { DataGrid, GridDeleteIcon, GridToolbar } from '@mui/x-data-grid';
import axiosInstance from 'hooks/useAuthTokenUrl';
// import EditIcon from '@mui/icons-material/Edit';
import { Button, Grid, Typography, FormControl, InputLabel, Select, MenuItem, Paper, Backdrop, CircularProgress, Alert } from '@mui/material';
import AlertSucess from 'components/common/alertSucess';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { showalertwhenObjectretrnvalidation } from 'components/common/fieldValidationFunctionByjava';
import StateList from 'components/form_components/StateList';

function UpdateRoleMenuMaster() {
  const [showedit, setShowEdit] = useState(false);

  const columns = [
    {
      field: 'Count',
      headerName: 'S. No.',
      flex: 0.5
    },
    {
      field: 'moduleName',
      headerName: 'Module Master',
      flex: 1
    },
    {
      field: 'subModuleName',
      headerName: 'Sub Module Master',
      flex: 1
    },
    {
      field: 'menuName',
      headerName: 'Menu Master',
      flex: 1
    },
    {
      field: 'roleName',
      headerName: 'Role Name',
      flex: 2
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
            color="error"
            style={{ cursor: 'pointer', fontSize: '12px', marginRight: '8px' }}
            onClick={() => handleDelete(params)}
          >
            <GridDeleteIcon />
          </Button>
        </>
      )
      // renderCell: (params) => (
      //   <>
      //     <Button
      //       //   variant="outlined"
      //       color="info"
      //       style={{ cursor: 'pointer', fontSize: '12px', marginRight: '8px' }}
      //       onClick={() => handleEdit(params)}
      //     >
      //       <EditIcon />
      //     </Button>
      //   </>
      // )
    }
  ];

  const [showAlert, setShowAlert] = useState(false);
  const [showAlertrm, setShowAlertrm] = useState(false);

  const [getAllState, setAllState] = useState([]);

  const [MMMasterNames, setMMMasterNames] = useState([]);
  const [subMMMasterNames, setsubMMMasterNames] = useState([]);
  const [menuMaster, setmenuMaster] = useState([]);
  const [roles, setRoles] = useState([]);
  const [role, setRole] = useState('');
  const [loading, setLoading] = useState(false);
  const [warningAlert, setShowwarningAlert] = useState('');
  const [stateId, setStateId] = useState('');

  const fetchModuleMaster = async () => {
    setLoading(true);
    try {
      const getUrl = `/userManagement/findAllModuleMaster`;
      const response = await axiosInstance.get(getUrl);

      setMMMasterNames(response.data);
    } catch (error) {
      console.error('Error fetching module masters:', error);
    }finally{
      setLoading(false);
    }
  };
  const fetchRoles = async () => {
    setLoading(true);
    try {
      const getUrl = `/master-management/findAllRoleMaster/${stateId}`;
      const response = await axiosInstance.get(getUrl);
      setRoles(response.data);
    } catch (error) {
      console.error('Error fetching banktypes:', error);
    }finally{
      setLoading(false);
    }
  };

  const fetchSubModuleMaster = async () => {
    setLoading(true);
    try {
      const getUrl = `/userManagement/findAllSubModuleMasterByModuleId/${getallRowEdit.moduleId}`;
      const response = await axiosInstance.get(getUrl);

      setsubMMMasterNames(response.data);
    } catch (error) {
      console.error('Error fetching module masters:', error);
    }
  };
  const findAllMenuMasterBySubModule = async () => {
    setLoading(true);
    try {
      const getUrl = `/userManagement/findAllMenuMasterBySubModule/${getallRowEdit.submoduleId}`;
      const response = await axiosInstance.get(getUrl);

      setmenuMaster(response.data);
    } catch (error) {
      console.error('Error fetching module masters:', error);
    }finally{
      setLoading(false);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    setShowwarningAlert('');
    try {
      const getUrl = `/userManagement/findAllRoleMenuMaster/${role}/${stateId}`;
      const response = await axiosInstance.get(getUrl);
  
      if (response.status >= 200 && response.status < 300) {
        const dataWithSerialNumber = response.data.map((item, index) => ({
          ...item,
          Count: index + 1 // Using index as the default row identifier
        }));
        
        setLoading(false);
        return dataWithSerialNumber;
      } else {
        setLoading(false);
        setShowwarningAlert(showalertwhenObjectretrnvalidation(error));
        throw new Error('Data could not be fetched!'); // Throw an error with a generic message
      }
    } catch (error) {
      setLoading(false);
      setShowwarningAlert(showalertwhenObjectretrnvalidation(error));
      throw new Error('Data could not be fetched!'); // Throw an error with a generic message
    }
  };
  

  // --------------------------------------------------------------------
  const [getallRowEdit, setallRowEdit] = useState({});

  const handleDelete = async (rowData) => {
    console.log('Deleting:', rowData.row);
  
    const postFormDate = JSON.stringify(rowData.row);
  
    const result = window.confirm('Are you sure you want to remove the record?');
  
    if (result) {
      try {
        const postUrl = '/userManagement/disableRoleMenuMaster';
        const res = await axiosInstance.put(postUrl, postFormDate);
  
        console.log('User Master Data update : Status Code : ', res.status);
  
        if (res.status === 201) {
          setShowAlertrm(true);
          // Fetch updated data after deletion
          const updatedData = await fetchData();
  
          // Update state with the new data
          setAllState(updatedData);
  
          // Automatically hide the alert after 5 seconds
          const timeoutId = setTimeout(() => {
            setShowAlertrm(false);
          }, 5000);
  
          // Clear the timeout when the component is unmounted or when showAlert changes
          return () => clearTimeout(timeoutId);
        } else {
          // Handle other status codes if needed
        }
  
      } catch (error) {
        console.error('Error updating data:', error);
        // Handle error scenarios
      }
    } else {
      // User clicked cancel, do nothing or handle accordingly
    }
  };
  
  // const handleEdit = (rowData) => {
  //   setShowEdit(true);
  //   console.log('Editing:', rowData.row);
  //   setallRowEdit(rowData.row);

  //   // }
  // };

  const handleInput = (evt) => {
    const name = evt.target.name;

    setallRowEdit((prevRowEdit) => ({
      ...prevRowEdit,
      [name]: evt.target.value
    }));
  };

  const setRolevalue = (evt) => {
    setRole(evt.target.value);
  };

  async function postData(e) {
    e.preventDefault();
    event.target.reset();
    const postFormDate = JSON.stringify(getallRowEdit);
    var result = window.confirm('Are you sure want to Update the record? ');
    if (result) {
      try {
        const postUrl = '/userManagement/updateRoleMenuMaster';
        const res = await axiosInstance.put(postUrl, postFormDate);
        console.log('User Master Data update : Status Code : ', res.status);
        if (res.status === 201) {
          setShowAlert(true);

          const updatedData = await fetchData();
          // Update the state with the new data
          setAllState(updatedData);

          // Automatically hide the alert after 5 seconds
          const timeoutId = setTimeout(() => {
            setShowAlert(false);
          }, 5000);

          // Clear the timeout when the component is unmounted or when showAlert changes
          return () => clearTimeout(timeoutId);
        }

        //navigate("/masters/criteria/update");
      } catch (error) {
        console.error('Error updating data:', error);
        // setSnackbar({ children: 'Record failed in update!', severity: 'error' });
      }
    } else {
      // ...do nothing
    }
  }

  const rows = getAllState.map((item) => {
    // console.log('xxxx', item.moduleId);

    return {
      roleMenuId: item.roleMenuId,
      Count: item.Count,
      moduleName: item.moduleName,
      subModuleName: item.subModuleName,
      menuName: item.menuName,
      roleName: item.roleName,
      moduleId: item.moduleId,
      submoduleId: item.submoduleId,
      menuId: item.menuId,
      roleId: item.roleId
    };
  });

  const handleBackButtonClick = () => {
    setShowEdit(false);
  };

  useEffect(() => {
    if(stateId){
      fetchRoles();
    }
   

    fetchModuleMaster();

    if (getallRowEdit.moduleId) {
      fetchSubModuleMaster();
    }

    if (getallRowEdit.submoduleId) {
      
      findAllMenuMasterBySubModule();
    }


if(role){
  setAllState([]);
  fetchData()
  .then((res) => {
    setAllState(res);
  })
  .catch((e) => {
    console.log(e.message);
  });
}

   
  }, [getallRowEdit.moduleId, getallRowEdit.submoduleId,role,stateId]);

  const handleClose = () => {
    setShowwarningAlert('');
  };
  const handleSelectStateid = (state) => {
    setStateId(state);
  };
  return (
    <div>
      {/* ------------------------------------------------------------------- */}
      {showAlert && <AlertSucess msg={'Role Menu'} setShowAlert={setShowAlert} />}
      {showAlertrm && <Alert severity="warning">Role Menu removed Successfully.</Alert>}
      {warningAlert && (
          <Alert variant="filled" severity="warning" onClose={handleClose}>
            {warningAlert}
          </Alert>
        )}
      <MainCard title="Update Role Menu Master">
      
        <Grid container spacing={2} style={{ paddingTop: '10px', paddingBottom: '10px' }}>
        <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <StateList onSelectState={handleSelectStateid} isMandatory={true}/>
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
              <Select labelId="Role Name-label" id="role" label="Role Name-label" name="role" value={role} onChange={setRolevalue} required>
              {roles ? (
                    roles.map((item) => (
                      <MenuItem key={item.roleId} value={item.roleId}>
                        {item.roleName}
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem disabled>No roles available</MenuItem>
                  )}
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        {!showedit && (
          <React.Fragment>
            {rows.length !== 0 && (
              <Paper
                elevation={1} // Set the elevation to give it a shadow
                style={{ backgroundColor: 'lightblue', padding: '16px' }} // Set your desired background color
              ></Paper>
            )}

            {rows.length !== 0 && (
              <Box sx={{ height: 700, width: '100%' }}>
                <DataGrid
                  getRowId={(row) => row.roleMenuId}
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
          </React.Fragment>
        )}
      </MainCard>
      {/* ------------------------Edit-------------------------------------------------------- */}


      {showedit && (
        <MainCard title="Edit Role Menu Master">
          <Box sx={{ height: 400, width: '100%' }}>
            <form method="post" onSubmit={postData}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                  <FormControl fullWidth>
                    <InputLabel id="Module Master">
                      Module Master
                      <Typography variant="body1" color="error" style={{ marginLeft: 5 }}>
                        *
                      </Typography>
                    </InputLabel>
                    <Select
                      labelId="Module Master"
                      id="moduleId"
                      label="Module Master"
                      name="moduleId"
                      value={getallRowEdit.moduleId}
                      onChange={handleInput}
                      required
                    >
                      {MMMasterNames.map((item) => (
                        <MenuItem key={item.moduleId} value={item.moduleId}>
                          {item.moduleName}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={4}>
                  <FormControl fullWidth>
                    <InputLabel id="Sub Module Master">
                      Sub Module Master
                      <Typography variant="body1" color="error" style={{ marginLeft: 5 }}>
                        *
                      </Typography>
                    </InputLabel>
                    <Select
                      labelId="Sub Module Master"
                      id="submoduleId"
                      label="Sub Module Master"
                      name="submoduleId"
                      value={getallRowEdit.submoduleId}
                      onChange={handleInput}
                      required
                    >
                      {subMMMasterNames.map((item) => (
                        <MenuItem key={item.subModuleId} value={item.subModuleId}>
                          {item.subModuleName}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={4}>
                  <FormControl fullWidth>
                    <InputLabel id="Menu Master">
                      Menu Master
                      <Typography variant="body1" color="error" style={{ marginLeft: 5 }}>
                        *
                      </Typography>
                    </InputLabel>
                    <Select
                      labelId="Menu Master"
                      id="menuId"
                      label="Menu Master"
                      name="menuId"
                      value={getallRowEdit.menuId}
                      onChange={handleInput}
                      required
                    >
                      {menuMaster.map((item) => (
                        <MenuItem key={item.menuId} value={item.menuId}>
                          {item.menuName}
                        </MenuItem>
                      ))}
                    </Select>
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
                <Button type="submit" variant="contained" color="primary" style={{ marginRight: '10px' }} title="Update">
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

export default UpdateRoleMenuMaster;
