import React, { useEffect, useState } from 'react';
import { useReducer } from 'react';
import axiosInstance from 'hooks/useAuthTokenUrl';

import MainCard from 'ui-component/cards/MainCard';
import { Grid, FormControl, TextField, Button, Breadcrumbs, Link, Typography ,InputAdornment, Alert, Backdrop, CircularProgress } from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import StateList from 'components/form_components/StateList';
import DistrictList from 'components/form_components/DistrictList';
import AreaList from 'components/form_components/AreaList';
import AlertSucess from 'components/common/alertSucess';
import SubDistrictList from 'components/form_components/SubDistrictList';
import GramPanchayatList from 'components/form_components/GramPanchayatList';
// import MandatoryFields from 'components/common/MandatoryFields';
import Duplicate from 'components/common/Duplicate';
import { showalertwhenObjectretrnvalidation } from 'components/common/fieldValidationFunctionByjava';

function AddVillageMaster() {
  const [formInput, setFormInput] = useReducer((state, newState) => ({ ...state, ...newState }), {
    stateId: '',
    districtId: '',
    subDistrictMunicipalAreaId: '',
    villageName: '',
    villageShortName: '',
    ruralUrbanArea: '',
    gramPanchayatWardId: '',
    lgdCode: ''
  });


  const handleReset = () => {
    setFormInput({
      stateId: '',
    districtId: '',
    subDistrictMunicipalAreaId: '',
    villageName: '',
    villageShortName: '',
    ruralUrbanArea: '',
    gramPanchayatWardId: '',
    lgdCode: ''
    });
  };


  const [showAlert, setShowAlert] = useState(false);
  const [showAlertDup, setShowAlertDup] = useState(false);
  // const [showValidationPopup, setShowValidationPopup] = useState(false);
  const [warningAlert, setShowwarningAlert] = useState('');
  const [loading, setLoading] = useState(false);
  const [buttonClicked, setButtonClicked] = useState(false);


  const handleSubmit = async (e) => {
    e.preventDefault();
    event.target.reset();
    setLoading(true);
    setButtonClicked(true);
    // const mandatoryFields = [
    //   'stateId',
    //   'districtId',
    //   'subDistrictMunicipalAreaId',
    //   'villageName',
    //   'villageShortName',
    //   'ruralUrbanArea',
    //   'gramPanchayatWardId'
    // ];

    // const isFormValid = mandatoryFields.every((field) => formInput[field]);

    // if (!isFormValid) {
    //   setShowValidationPopup(true);
    //   // Hide the popup after 3 seconds (adjust the timing as needed)
    //   setTimeout(() => {
    //     setShowValidationPopup(false);
    //   }, 3000);
    //   return;
    // }
    const postFormDate = JSON.stringify(formInput);
    try {
      const postUrl = '/master-management/saveVillage';
      const res = await axiosInstance.post(postUrl, postFormDate);
      console.log('Village Master Data Save : Status Code : ', res.status);
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
      setLoading(false);
        setButtonClicked(false);
      setShowwarningAlert(showalertwhenObjectretrnvalidation(e));
      console.log('Sub District Master Data Not Save : Some error has occured : ', e);
    }finally{
      setLoading(false);
      setButtonClicked(false);
      setFormInput({
        stateId: '',
        districtId: '',
        subDistrictMunicipalAreaId: '',
        villageName: '',
        villageShortName: '',
        ruralUrbanArea: '',
        gramPanchayatWardId: '',
        lgdCode: ''
      });
      
    }
  };

  const handleInput = (evt) => {
    const name = evt.target.name;
    const newValue = evt.target.value;
    setFormInput({ [name]: newValue });
  };

  useEffect(() => {}, []);

  const handleSelectState = (state) => {
    const name = 'stateId';
    setFormInput({ [name]: state });
  };

  const handleDist = (dist) => {
    const name = 'districtId';
    setFormInput({ [name]: dist });
  };

  const handleArea = (area) => {
    const name = 'ruralUrbanArea';
    setFormInput({ [name]: area });
  };
  const handleSubDist = (area) => {
    const name = 'subDistrictMunicipalAreaId';
    setFormInput({ [name]: area });
  };

  const handleGrampanchayat = (gp) => {
    const name = 'gramPanchayatWardId';
    setFormInput({ [name]: gp });
  };
  const handleInputChangeData = (event) => {
    if(event.target.value != null && event.target.value != ""){
    event.target.value = event.target.value.replace(/[^0-9]/g, '');
    }
    };
    const handleClose = () => {
      setShowwarningAlert('');
    };
  return (
    <div>
      <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb" style={{ marginBottom: '20px' }}>
        <Link id="link" color="inherit" href="#" style={{ color: 'blue' }} title="Home">
          Home
        </Link>
        <Link color="inherit" href="#" style={{ color: 'blue' }} title="Masters">
          Masters
        </Link>
        <Link color="inherit" href="#" style={{ color: 'blue' }} title="Masters">
          Village Master
        </Link>
        <Typography color="textInfo" title="Add State">
          Add Village
        </Typography>
      </Breadcrumbs>

      <MainCard title="Add Village">
      {warningAlert && (
          <Alert variant="filled" severity="warning" onClose={handleClose}>
            {warningAlert}
          </Alert>
        )}
      {/* {showValidationPopup && (
          <MandatoryFields />
        )} */}
        {showAlertDup && <Duplicate />}
        {showAlert && <AlertSucess msg={'Village'} />}
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <StateList onSelectState={handleSelectState} isMandatory={true}/>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <DistrictList selectedStateId={formInput.stateId} onSelectDistrict={handleDist} isMandatory={true}/>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <AreaList onSelectArea={handleArea} isMandatory={true}/>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <SubDistrictList
                  selectedDistrictId={formInput.districtId}
                  selectedAreaId={formInput.ruralUrbanArea}
                  getsubdistbyarea={handleSubDist}
                  onSelectSubDistrict={handleSubDist}
                  isMandatory={true}
                />
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <GramPanchayatList
                  selectedSubDistrictMunicipalAreaId={formInput.subDistrictMunicipalAreaId}
                  onSelectGramPanchayat={handleGrampanchayat} isMandatory={true}
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                label="Village Code Short Name"
                name="villageShortName"
                placeholder="Enter Village Short Name"
                variant="outlined"
                fullWidth
                required
                value={(formInput.villageShortName || '').toUpperCase()}
                onChange={handleInput}
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
              <TextField
                label=" Village"
                name="villageName"
                placeholder="Enter Village Name"
                variant="outlined"
                fullWidth
                required
                value={(formInput.villageName || '').toUpperCase()}
                onChange={handleInput}
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
              <TextField
                label="Lgd Code"
                name="lgdCode"
                placeholder="Enter Lgt Village Code"
                variant="outlined"
                fullWidth
                onChange={handleInput}
                onInput={handleInputChangeData}
                value={formInput.lgdCode}
                InputProps={{
                  inputProps: {
                    pattern: '^[0-9]*$', // Allow only numbers
                  title: 'Only numbers are allowed',
                    maxLength: 10,

                  }
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

export default AddVillageMaster;
