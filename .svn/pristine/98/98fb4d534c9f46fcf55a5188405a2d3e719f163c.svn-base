import React, { useReducer, useState, useEffect } from 'react';

import MainCard from 'ui-component/cards/MainCard';
import axiosInstance from 'hooks/useAuthTokenUrl';
import StateList from 'components/form_components/StateList';
import AlertSucess from 'components/common/alertSucess';
import { Button, FormControl, Grid, InputLabel, MenuItem, Select,TextField ,Alert, Backdrop, CircularProgress} from '@mui/material';
import Duplicate from 'components/common/Duplicate';
import { showalertwhenObjectretrnvalidation } from 'components/common/fieldValidationFunctionByjava';

function AddPfmsAgency() {
  const [formInput, setFormInput] = useReducer((state, newState) => ({ ...state, ...newState }), {
    stateCode: null,
    districtCode: null,
    area: null,
    subDistrictMunicipalAreaCode: null,
    schemeCode: '',
    agencyCode: '',
    agencyName: '',
    pfmsLevel: ''
  });

  const handleReset = () => {
    setFormInput({
      stateCode: null,
      districtCode: null,
      area: null,
      subDistrictMunicipalAreaCode: null,
      schemeCode: '',
      agencyCode: '',
      agencyName: '',
      pfmsLevel: ''
    });
  };



  const [pfmsLevel, setpfmsLevel] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const [loading, setLoading] = useState(false);
  const [buttonClicked, setButtonClicked] = useState(false);
  const [stateId, setStateId] = useState('');

  const handleInputScheme = (evt) => {
    const name = evt.target.name;
    const filteredSchemes = getAllScheme.filter((scheme) => scheme.schemeCode === evt.target.value);
    const pfmsLevel_val = filteredSchemes[0].pfmsLevel;
    setpfmsLevel(pfmsLevel_val);
    setFormInput({ ['pfmsLevel']: pfmsLevel_val });
    setFormInput({ [name]: evt.target.value });
    if (pfmsLevel_val === 'D' || pfmsLevel_val === 'SD') {
      getAllDistList();
    }
  };

  const handleInput = (evt) => {
    const name = evt.target.name;
    setFormInput({ [name]: evt.target.value });
  };

  const handleInputArea = (evt) => {
    const name = evt.target.name;
    setFormInput({ [name]: evt.target.value });
    getAllSubDistList(evt.target.value);
  };

  // const RESET_FORM = 'RESET_FORM';
  const [getSucess, setSucess] = useState([]);
  const [showAlertDup, setShowAlertDup] = useState(false);
  const [getArea, setArea] = useState([]);
  const [warningAlert, setShowwarningAlert] = useState('');
  const fetchArea = async () => {
    try {
      const getUrl = '/common/findAllArea';
      const response = await axiosInstance.get(getUrl);
      const data = response.data;
      setArea(data);
    } catch (error) {
      console.error('Error fetching Gender List :', error);
    }
  };

  // const RESET_FORM = 'RESET_FORM';
  const handleSubmit = async (e) => {
    e.preventDefault();
    e.target.reset(); // Ensure that this line is not causing unintended side effects
    setLoading(true);
    setButtonClicked(true);
    const postFormDate = JSON.stringify(formInput);

    try {
      const postUrl = '/master-agencyPfms/saveAgencyMaster';
      const res = await axiosInstance.post(postUrl, postFormDate);
      setSucess(res.status);
      console.log('User Master Data Save : Status Code : ', res.status);
      // Reset form fields using dispatch
      

      if (res.status === 201) {
        setShowAlert(true);
        setLoading(false);
        setButtonClicked(false);
        setFormInput({
          districtCode: '',
          area: '',
          subDistrictMunicipalAreaCode: '',
          schemeCode: '',
          agencyCode: '',
          agencyName: '',
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
      setLoading(false);
        setButtonClicked(false);
    } catch (e) {
      setLoading(false);
        setButtonClicked(false);
      setShowwarningAlert(showalertwhenObjectretrnvalidation(e));
      console.log('Angency Master Data Not Save : Some error has occurred : ', e);
    }
  };

  // -------------------------------------
  const handleSelectState = (state) => {
    setStateId(state);
    const name = 'stateCode';
    setFormInput({ [name]: state });
  };

  // ---------------------------------

  const [getAllScheme, setAllScheme] = useState([]);
  const getAllAgencyScheme = () => {
    let endpoints = [`/master-agencyPfms/findAllSchemeInConfigAgency/${stateId}`];
    Promise.all(endpoints.map((endpoint) => axiosInstance.get(endpoint))).then(([{ data: allScheme }]) => {
      setAllScheme(allScheme);
    });
  };

  const [getAllDist, setAllDist] = useState([]);
  const getAllDistList = () => {
    let endpoints = ['/common/findAllDistrict'];
    Promise.all(endpoints.map((endpoint) => axiosInstance.get(endpoint))).then(([{ data: allDist }]) => {
      setAllDist(allDist);
    });
  };

  const [getAllSubDist, setAllSubDist] = useState([]);
  const getAllSubDistList = (area) => {
    let endpoints = [`/common/findAllSubDistrictByDistrictId/${formInput.districtCode}/${area}`];
    Promise.all(endpoints.map((endpoint) => axiosInstance.get(endpoint))).then(([{ data: allSubDist }]) => {
      setAllSubDist(allSubDist);
    });
  };
  // ---------------------------------------------
  const handleClose = () => {
    setShowwarningAlert('');
  };
  const [isMounted, setIsMounted] = useState(true);

  useEffect(() => {
    if (pfmsLevel === 'SD') {
      fetchArea();
    }

    if (isMounted && stateId) {
      getAllAgencyScheme();
      setIsMounted(false); // Set isMounted to false after the initial render
    }
    
  }, [getSucess, isMounted, pfmsLevel,stateId]);

  return (
    <div>
      

      <MainCard title="Add PFMS Agency">
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
                <InputLabel id="demo-simple-select-label">Scheme Code</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  label="Scheme Code"
                  name="schemeCode"
                  required
                  value={formInput.schemeCode}
                  onChange={handleInputScheme}
                >
                  {getAllScheme.map((scheme) => (
                    <MenuItem key={scheme.schemeCode} value={scheme.schemeCode}>
                      {scheme.schemeCode}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            {(pfmsLevel === 'D' || pfmsLevel === 'SD') && (
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">District Code</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    label="District Code"
                    name="districtCode"
                    value={formInput.districtCode || ''} // Set a default value, like an empty string
                    onChange={handleInput}
                  >
                    {getAllDist.map((dist) => (
                      <MenuItem key={dist.districtId} value={dist.districtId}>
                        {dist.districtName}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            )}

            {pfmsLevel === 'SD' && (
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth>
                  <InputLabel id="Area-label">Area</InputLabel>
                  <Select labelId="Area-label" id="area" label="Area-label" name="area" value={formInput.area} onChange={handleInputArea}>
                    {getArea.map((item) => (
                      <MenuItem key={item.ruralUrbanArea} value={item.ruralUrbanArea}>
                        {item.ruralUrbanAreaName}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            )}

            {pfmsLevel === 'SD' && (
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">Sub-District Code</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    label="Sub-District Code"
                    name="subDistrictMunicipalAreaCode"
                    placeholder="Select Sub-District Code"
                    value={formInput.subDistrictMunicipalAreaCode}
                    onChange={handleInput}
                  >
                    {getAllSubDist.map((dist) => (
                      <MenuItem key={dist.subDistrictMunicipalAreaId} value={dist.subDistrictMunicipalAreaId}>
                        {dist.subDistrictMunicipalAreaName}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            )}

            <Grid item xs={12} sm={4}>
              <TextField
                value={(formInput.agencyCode || '').toUpperCase()}
                label="Agency Code"
                name="agencyCode"
                placeholder="Enter Agency Code"
                required
                variant="outlined"
                fullWidth
                onChange={handleInput}
                inputProps={{
                  maxLength: 15,
                  pattern: '[a-zA-Z0-9]*' // This allows only alphanumeric characters
                }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                value={(formInput.agencyName || '').toUpperCase()}
                label="Agency Name"
                name="agencyName"
                placeholder="Enter Agency Name"
                required
                variant="outlined"
                fullWidth
                onChange={handleInput}
                inputProps={{
                  maxLength: 15
                  // pattern: '[a-zA-Z0-9]*' // This allows only alphanumeric characters
                }}
              />
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

export default AddPfmsAgency;
