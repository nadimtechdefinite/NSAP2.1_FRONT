import React, { useState, useEffect } from 'react';
import { useReducer } from 'react';
import MainCard from 'ui-component/cards/MainCard';
import { Button, Grid,  Typography, TextField ,InputAdornment,Alert, Backdrop, CircularProgress, FormControl } from '@mui/material';
import AlertSucess from 'components/common/alertSucess';
import axiosInstance from 'hooks/useAuthTokenUrl';
import Duplicate from 'components/common/Duplicate';
import { showalertwhenObjectretrnvalidation } from 'components/common/fieldValidationFunctionByjava';
import UserLevelList from 'components/form_components/UserLevelList';
import StateList from 'components/form_components/StateList';

function AddRole() {
  const [formInput, setFormInput] = useReducer((state, newState) => ({ ...state, ...newState }), {
    stateId: '',
    roleName: '',
    userLevelId: '',
    roleDescription: '',
   
  });
  const [showAlert, setShowAlert] = useState(false);
  const [showAlertDup, setShowAlertDup] = useState(false);
  const [warningAlert, setShowwarningAlert] = useState('');
  const [loading, setLoading] = useState(false);
  const [buttonClicked, setButtonClicked] = useState(false);
  


  const handleSubmit = async (e) => {
    e.preventDefault();
    event.target.reset();
    setButtonClicked(true);
    setLoading(true);
   
    const postFormDate = JSON.stringify(formInput);
    try {
      const postUrl = '/master-management/saveRole';
      const res = await axiosInstance.post(postUrl, postFormDate);
      console.log('Role Master Data Save : Status Code : ', res.status);
      // Reset form fields using dispatch
      const msg = res.data.msg;
      if (res.status === 201) {
        if (msg === 'duplicate') {
          setShowAlertDup(true);
        } else {
          setShowAlert(true);
        }
        setLoading(false);
        setButtonClicked(false);
        setFormInput({
          stateId: '',
          roleName: '',
          roleDescription: '',
         
        });
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
      setShowwarningAlert(showalertwhenObjectretrnvalidation(e));
      console.log('Role Master Data Not Save : Some error has occured : ', e);
    }
  };

  const handleSelectUserLevel = (userLevelId) => {
    setFormInput({ userLevelId: userLevelId });
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
  }, []);


  const handleClose = () => {
    setShowwarningAlert('');
  };
  const handleSelectStateid = (state) => {
    setFormInput({ stateId: state });
  };
  return (
    <div>
      {warningAlert && (
          <Alert variant="filled" severity="warning" onClose={handleClose}>
            {warningAlert}
          </Alert>
        )}
       
        {showAlertDup && <Duplicate />}
        {showAlert && <AlertSucess msg={'Role'} />}
      <MainCard title="Add Role">
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <StateList onSelectState={handleSelectStateid} isMandatory={true}/>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                label="Role"
                name="roleName"
                placeholder="Enter Role Name"
                variant="outlined"
                fullWidth
                value={formInput.roleName.toUpperCase()}
                onChange={handleInput}
                required
                InputProps={{
                  inputProps: {
                    pattern: '^[A-Za-z\\d\\s]*$',
                    title: 'Only characters and numbers are allowed',
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
              <FormControl fullWidth>
                <UserLevelList onSelectUserLevel={handleSelectUserLevel} isMandatory={true}/>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                label="Role Description"
                name="roleDescription"
                placeholder="Role Description"
                variant="outlined"
                fullWidth
                value={formInput.roleDescription.toUpperCase()}
                onChange={handleInput}
                required
                InputProps={{
                  inputProps: {
                    pattern: '^[A-Za-z\\d\\s]*$',
                    title: 'Only characters and numbers are allowed',
                    maxLength: 100,

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
            
            
           

            <Grid item xs={12} alignItems="center">
              <Button type="submit" variant="contained" color="secondary" disabled={buttonClicked}>
                ADD
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

export default AddRole;
