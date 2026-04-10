import React, { useState, useEffect } from 'react';
import { useReducer } from 'react';
import MainCard from 'ui-component/cards/MainCard';
import { Button,Grid,Typography,FormControl, InputLabel, Select, MenuItem, Backdrop, CircularProgress} from '@mui/material';
import AlertSucess from 'components/common/alertSucess';
import axiosInstance from 'hooks/useAuthTokenUrl';
import MandatoryFields from 'components/common/MandatoryFields';
import Duplicate from 'components/common/Duplicate';
import StateList from 'components/form_components/StateList';

function AssignRoleAdd() {
  const [formInput, setFormInput] = useReducer((state, newState) => ({ ...state, ...newState }), {
    stateId: '',
    userCode: '',
    roleId: ''
  });

  const handleReset = () => {
    setFormInput({
       userCode: '',
    roleId: ''
    });
  };

  const [showAlert, setShowAlert] = useState(false);
  const [showAlertDup, setShowAlertDup] = useState(false);
  const [showValidationPopup, setShowValidationPopup] = useState(false);
  const [UserNames, setUserNames] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [buttonClicked, setButtonClicked] = useState(false);


  const fetchUserNames = async () => {
    try {
      const getUrl = `/master-management/findAllUserManagement/${formInput.stateId}`;
      const response = await axiosInstance.get(getUrl);
      setUserNames(response.data);
    } catch (error) {
      console.error('Error fetching banktypes:', error);
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


  const handleSubmit = async (e) => {
    e.preventDefault();
    event.target.reset();
    setLoading(true);
    setButtonClicked(true);
    const mandatoryFields = ['userCode', 'roleId'];

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
      const postUrl = '/master-management/saveUserRoleMaster';
      const res = await axiosInstance.post(postUrl, postFormDate);
      console.log('District Master Data Save : Status Code : ', res.status);
      // Reset form fields using dispatch
      const msg = res.data.msg;
      if (res.status === 201) {
        if (msg === 'duplicate') {
          setShowAlertDup(true);
        } else {
          setShowAlert(true);
        }
        setFormInput({
          userCode: '',
          roleId: ''
        });
        setLoading(false);
        setButtonClicked(false);
        // Automatically hide the alert after 5 seconds
        const timeoutId = setTimeout(() => {
          setShowAlert(false);
          setShowAlertDup(false);
        }, 5000);

        // Clear the timeout when the component is unmounted or when showAlert changes
        return () => clearTimeout(timeoutId);
      }
      setLoading(false);
      setButtonClicked(false);
    } catch (e) {
      setLoading(false);
      setButtonClicked(false);
      console.log('District Master Data Not Save : Some error has occured : ', e);
    }
  };

  const handleInput = (evt) => {
    const name = evt.target.name;
    const newValue = evt.target.value;
    setFormInput({ [name]: newValue });
  };
  const [getAllState, setAllState] = useState([]);
  const getGithubData = () => {
    const findAllStatesUrl = '/master-management/findAllStates';
    let endpoints = [findAllStatesUrl];
    Promise.all(endpoints.map((endpoint) => axiosInstance.get(endpoint))).then(([{ data: allState }]) => {
      setAllState(allState);
    });
  };
  console.log(getAllState[0]);
  useEffect(() => {
    getGithubData();
    
    if(formInput.stateId){
      fetchUserNames();
      fetchRoles();
    }
    
  }, [formInput.stateId]);

  const handleSelectStateid = (state) => {
    setFormInput({ stateId: state });
  };

  return (
    <div>
      
      <MainCard title="Add Assign Role">
        {showValidationPopup && <MandatoryFields />}
        {showAlertDup && <Duplicate />}
        {showAlert && <AlertSucess msg={'Assign Role'} />}
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <StateList onSelectState={handleSelectStateid} isMandatory={true} />
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <InputLabel id="User Name-label">
                  User Name
                  <Typography variant="body1" color="error" style={{ marginLeft: 5 }}>
                    *
                  </Typography>
                </InputLabel>
                <Select
                  labelId="User Name-label"
                  id="userCode"
                  label="User Name-label"
                  name="userCode"
                  value={formInput.userCode}
                  onChange={handleInput}
                  required
                >
                  {UserNames.map((item) => (
                    <MenuItem key={item.userCode} value={item.userCode}>
                      {item.userCode}
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
                  {roles.map((item) => (
                    <MenuItem key={item.roleId} value={item.roleId}>
                      {item.roleName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            
          </Grid>
          <Grid container spacing={2} style={{ marginTop: '20px', marginLeft: '10px' }}>
            <Grid item xs={12} sm={4}>
              <Button type="submit" variant="contained" style={{ marginTop: '20px', marginLeft: '10px' }} color="secondary" disabled={buttonClicked}>
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

export default AssignRoleAdd;
