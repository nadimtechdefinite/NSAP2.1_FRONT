import React, { useState, useEffect } from 'react';
import { useReducer } from 'react';
import MainCard from 'ui-component/cards/MainCard';
import { Button, Grid, Typography, FormControl, InputLabel, Select, MenuItem, Backdrop, CircularProgress } from '@mui/material';
import AlertSucess from 'components/common/alertSucess';
import axiosInstance from 'hooks/useAuthTokenUrl';
import MandatoryFields from 'components/common/MandatoryFields';
import Duplicate from 'components/common/Duplicate';
import StateList from 'components/form_components/StateList';

function AddRoleMenuMaster() {
  const [formInput, setFormInput] = useReducer((state, newState) => ({ ...state, ...newState }), {
    stateId: '',
    moduleId: '',
    submoduleId: '',
    menuId: 0,
    roleId: 0
  });

  const handleReset = () => {
    setFormInput({
      stateId: '',
      moduleId: '',
      submoduleId: '',
      menuId: 0,
      roleId: 0
    });
  };

  const [showAlert, setShowAlert] = useState(false);
  const [showAlertDup, setShowAlertDup] = useState(false);
  const [showValidationPopup, setShowValidationPopup] = useState(false);
  const [MMMasterNames, setMMMasterNames] = useState([]);
  const [subMMMasterNames, setsubMMMasterNames] = useState([]);
  const [menuMaster, setmenuMaster] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [buttonClicked, setButtonClicked] = useState(false);

  const fetchModuleMaster = async () => {
    try {
      const getUrl = `/userManagement/findAllModuleMaster`;
      const response = await axiosInstance.get(getUrl);

      setMMMasterNames(response.data);
    } catch (error) {
      console.error('Error fetching module masters:', error);
    }
  };

  const fetchRoles = async () => {
    try {
      const getUrl = `/master-management/findAllRoleMaster/${formInput.stateId}`;
      const response = await axiosInstance.get(getUrl);
      setRoles(response.data);
    } catch (error) {
      console.error('Error fetching banktypes:', error);
    }
  };

  const fetchSubModuleMaster = async () => {
    try {
      const getUrl = `/userManagement/findAllSubModuleMasterByModuleId/${formInput.moduleId}`;
      const response = await axiosInstance.get(getUrl);

      setsubMMMasterNames(response.data);
    } catch (error) {
      console.error('Error fetching module masters:', error);
    }
  };
  const findAllMenuMasterBySubModule = async () => {
    try {
      const getUrl = `/userManagement/findAllMenuMasterBySubModule/${formInput.submoduleId}`;
      const response = await axiosInstance.get(getUrl);

      setmenuMaster(response.data);
    } catch (error) {
      console.error('Error fetching module masters:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    event.target.reset();
    setLoading(true);
    setButtonClicked(true);
    const mandatoryFields = ['moduleId', 'submoduleId', 'menuId', 'roleId'];

    const isFormValid = mandatoryFields.every((field) => formInput[field]);

    if (!isFormValid) {
      setShowValidationPopup(true);
      // Hide the popup after 3 seconds (adjust the timing as needed)
      setTimeout(() => {
        setShowValidationPopup(false);
      }, 3000);
      return;
    }
    const postFormDate = JSON.stringify(formInput);
    try {
      const postUrl = '/userManagement/saveRoleMenuMaster';
      const res = await axiosInstance.post(postUrl, postFormDate);
      console.log('Role Menu Master Data Save : Status Code : ', res.status);
      // Reset form fields using dispatch
      const msg = res.data.msg;
      if (res.status === 201) {
        if (msg === 'duplicate') {
          setShowAlertDup(true);
        } else {
          setShowAlert(true);
        }
        setFormInput({
          moduleId: '',
          submoduleId: '',
          menuId: 0,
          roleId: 0
        });
        // Automatically hide the alert after 5 seconds
        const timeoutId = setTimeout(() => {
          setShowAlert(false);
          setShowAlertDup(false);
        }, 5000);

        // Clear the timeout when the component is unmounted or when showAlert changes
        return () => clearTimeout(timeoutId);
      }
    } catch (e) {
      console.log('Role Master Data Not Save : Some error has occured : ', e);
    } finally {
      setLoading(false);
      setButtonClicked(false);
    }
  };

  const handleInput = (evt) => {
    console.log(evt.target);
    const name = evt.target.name;
    const newValue = evt.target.value;
    setFormInput({ [name]: newValue });
  };
  const handleSelectStateid = (state) => {
    setFormInput({ stateId: state });
  };
  useEffect(() => {
    if (formInput.stateId) {
      fetchRoles();
    }

    fetchModuleMaster();
    if (formInput.moduleId) {
      fetchSubModuleMaster();
    }

    if (formInput.submoduleId) {
      findAllMenuMasterBySubModule();
    }
  }, [formInput.moduleId, formInput.submoduleId, formInput.stateId]);

  return (
    <div>
      <MainCard title="Add Role Menu Master">
        {showValidationPopup && <MandatoryFields />}
        {showAlertDup && <Duplicate />}
        {showAlert && <AlertSucess msg={'Add Role Menu'} />}
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <StateList onSelectState={handleSelectStateid} isMandatory={true} />
              </FormControl>
            </Grid>
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
                  value={formInput.moduleId}
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
                  value={formInput.submoduleId}
                  onChange={handleInput}
                  required
                >
                  {subMMMasterNames.map((item) => (
                    <MenuItem key={item.subModuleId} value={item.subModuleId}>
                      {item.subModuleDescription}
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
                  value={formInput.menuId}
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
                  value={formInput.roleId}
                  onChange={handleInput}
                  required
                >
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
          <Grid container spacing={2} style={{ marginTop: '20px', marginLeft: '10px' }}>
            <Grid item xs={12} sm={4}>
              <Button
                type="submit"
                variant="contained"
                style={{ marginTop: '20px', marginLeft: '10px' }}
                color="secondary"
                disabled={buttonClicked}
              >
                ADD
              </Button>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Button
                onClick={handleReset}
                type="reset"
                variant="contained"
                color="error"
                style={{ marginTop: '20px', marginLeft: '10px' }}
                title="Reset"
              >
                Reset
              </Button>
            </Grid>
          </Grid>
        </form>

        <Backdrop open={loading} style={{ zIndex: 999, color: '#fff' }}>
          <CircularProgress color="inherit" />
        </Backdrop>
      </MainCard>
    </div>
  );
}

export default AddRoleMenuMaster;
