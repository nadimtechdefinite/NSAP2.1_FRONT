import React, { useReducer, useState, useEffect } from 'react';

import MainCard from 'ui-component/cards/MainCard';
import axiosInstance from 'hooks/useAuthTokenUrl';
import StateList from 'components/form_components/StateList';
import AlertSucess from 'components/common/alertSucess';
import Duplicate from 'components/common/Duplicate';
import { Button, FormControl, Grid, InputLabel, MenuItem, Select ,Alert, Backdrop, CircularProgress} from '@mui/material';
import { showalertwhenObjectretrnvalidation } from 'components/common/fieldValidationFunctionByjava';

function AddPfmsAgencyConfig() {
  const [formInput, setFormInput] = useReducer((state, newState) => ({ ...state, ...newState }), {
    stateCode: '',
    schemeCode: '',
    pfmsLevel: ''
  });

  const handleReset = () => {
    setFormInput({
      stateCode: '',
      schemeCode: '',
      pfmsLevel: ''
    });
  };


  const [getSucess, setSucess] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const [showAlertDup, setShowAlertDup] = useState(false);
  const [warningAlert, setShowwarningAlert] = useState('');
  const [loading, setLoading] = useState(false);
  const [buttonClicked, setButtonClicked] = useState(false);
  // ------------------------------
  // ------------------------------

  // const [selectedStateId, setSelectedState] = useState('');
  const handleSelectState = (state) => {
    console.log('cccccc---------' + JSON.stringify(state.stateCode));
    // setSelectedState(state.stateId);
    setFormInput({ stateCode: state });
  };

  const handleClose = () => {
    setShowwarningAlert('');
  };
  // -------------------------------
  const handleInput = (evt) => {
    if (evt && evt.target) {
      const name = evt.target.name;
      setFormInput({ [name]: evt.target.value });
    } else {
      console.error('Event or event.target is undefined:', evt);
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    event.target.reset();
    setLoading(true);
    setButtonClicked(true);
    const postFormDate = JSON.stringify(formInput);
    try {
      const postUrl = '/master-agencyPfms/saveAgencyMasterConfig';
      const res = await axiosInstance.post(postUrl, postFormDate);
      console.log('User Master Data Save : Status Code : ', res.status);
      setSucess(res.status);
      if (res.status === 201) {
        setShowAlert(true);
        setLoading(false);
        setButtonClicked(false);
        setFormInput({
          stateCode: '',
          schemeCode: '',
          pfmsLevel: ''
        });
        // Automatically hide the alert after 5 seconds
        const timeoutId = setTimeout(() => {
          setShowAlert(false);
        }, 5000);

        // Clear the timeout when the component is unmounted or when showAlert changes
        return () => clearTimeout(timeoutId);
      }


      if (res.status === 205) {
        setShowAlertDup(true);
        setLoading(false);
        setButtonClicked(false);
        // Automatically hide the alert after 5 seconds
        const timeoutId = setTimeout(() => {
          setShowAlertDup(false);
        }, 5000);

        // Clear the timeout when the component is unmounted or when showAlert changes
        return () => clearTimeout(timeoutId);
      }
      // Reset form fields using dispatch
         setLoading(false);
        setButtonClicked(false);
  
    } catch (e) {
      setLoading(false);
        setButtonClicked(false);
      setShowwarningAlert(showalertwhenObjectretrnvalidation(e));
      console.log('Angency Master Data Not Save : Some error has occured : ', e);
    }
  };
  // ------------------------get scheme list--------------------------------------------------
  const [getAllscheme, setAllscheme] = useState([]);
  const getSchemeData = async () => {
    try {
      const findAllCriteriaUrl = '/criteria-master/findAllScheme';
      const response = await axiosInstance.get(findAllCriteriaUrl);
      setAllscheme(response.data);
    } catch (error) {
      console.error('Error fetching criteria data:', error);
    }
  };
  // ----------------------------------------------------------

  useEffect(() => {
    getSchemeData();
  }, [getSucess]);

  // ----------------------------------------------

  // -------------------------------------

  return (
    <div>
      

      <MainCard title="Add PFMS Agency Config" >
      {warningAlert && (
          <Alert variant="filled" severity="warning" onClose={handleClose}>
            {warningAlert}
          </Alert>
        )}
         {showAlertDup && <Duplicate />}
        {showAlert && <AlertSucess msg={'Agency'} />}

        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <StateList onSelectState={handleSelectState} />
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <InputLabel id="schemeCode">Scheme Name</InputLabel>
                <Select name="schemeCode" label="schemeCode" required onChange={handleInput} value={formInput.schemeCode}>
                  <MenuItem value="0">--Select Scheme--</MenuItem>
                  {getAllscheme.map((item) => (
                    <MenuItem key={item.schemeCode} value={item.schemeCode}>
                      {item.schemeCode}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <InputLabel id="pfmsLevel">PFMS Level</InputLabel>
                <Select
                  labelId="pfmsLevel"
                  id="pfmsLevel"
                  name="pfmsLevel"
                  required
                  value={formInput.agencyCode}
                  label="pfmsLevel"
                  onChange={handleInput}
                >
                  <MenuItem value={'S'}>State</MenuItem>
                  <MenuItem value={'D'}>District</MenuItem>
                  <MenuItem value={'SD'}>Sub-District</MenuItem>
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

export default AddPfmsAgencyConfig;
