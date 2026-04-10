import React from 'react';
import { useReducer, useState } from 'react';
import axiosInstance from 'hooks/useAuthTokenUrl';
import {
  Button,
  Grid,
  Breadcrumbs,
  Link,
  Typography,
  TextField,
  InputAdornment,
  Alert,
  Backdrop,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select
} from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import MainCard from 'ui-component/cards/MainCard';
import AlertSucess from 'components/common/alertSucess';
// import MandatoryFields from 'components/common/MandatoryFields';
import Duplicate from 'components/common/Duplicate';
import { showalertwhenObjectretrnvalidation } from 'components/common/fieldValidationFunctionByjava';

function SchemeAdd() {
  const [formInput, setFormInput] = useReducer((state, newState) => ({ ...state, ...newState }), {
    schemeCode: '',
    schemeName: '',
    schemeShortName: '',
    schemeType: '',
    schemeDescription: ''
  });

  const [showAlert, setShowAlert] = useState(false);
  const [showAlertDup, setShowAlertDup] = useState(false);
  // const [showValidationPopup, setShowValidationPopup] = useState(false);
  const [warningAlert, setShowwarningAlert] = useState('');
  const [schemeType, setSchemeType] = useState('');
  const [loading, setLoading] = useState(false);
  const [buttonClicked, setButtonClicked] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    event.target.reset();
    setLoading(true);
    setButtonClicked(true);

    formInput.schemeType = schemeType;
    const postFormDate = JSON.stringify(formInput);
    try {
      const postUrl = '/master-management/saveSchemeMaster';
      const res = await axiosInstance.post(postUrl, postFormDate);
      console.log('Scheme Master Data Save : Status Code : ', res.status);
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
          schemeCode: '',
          schemeName: '',
          schemeShortName: '',
          schemeType: '',
          schemeDescription: ''
        });
        setSchemeType('');
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
      setShowwarningAlert(showalertwhenObjectretrnvalidation(e));
      console.log('Scheme Master Data Not Save : Some error has occured : ', e);
    } finally {
      setLoading(false);
      setButtonClicked(false);
    }
  };

  const handleInput = (evt) => {
    const name = evt.target.name;
    const newValue = evt.target.value.toUpperCase();
    setFormInput({ [name]: newValue });
  };

  const handleClose = () => {
    setShowwarningAlert('');
  };

  const handleReset = () => {
    setFormInput({
      schemeCode: '',
      schemeName: '',
      schemeShortName: '',
      schemeType: '',
      schemeDescription: ''
    });
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
          Scheme Master
        </Link>
        <Typography color="textInfo" title="Add Scheme">
          Add Scheme
        </Typography>
      </Breadcrumbs>
      <MainCard title="Add Scheme">
        {warningAlert && (
          <Alert variant="filled" severity="warning" onClose={handleClose}>
            {warningAlert}
          </Alert>
        )}
        {/* {showValidationPopup && <MandatoryFields />} */}
        {showAlertDup && <Duplicate />}
        {showAlert && <AlertSucess msg={'Scheme'} />}
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <TextField
                label="Scheme Code"
                name="schemeCode"
                placeholder="Enter Scheme Code"
                variant="outlined"
                fullWidth
                value={formInput.schemeCode.toUpperCase()}
                onChange={handleInput}
                required
                InputProps={{
                  inputProps: {
                    pattern: '^[A-Za-z]*$',
                    title: 'Only characters are allowed,Not Allowed Space',
                    maxLength: 10
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
                label="Scheme Name"
                name="schemeName"
                placeholder="Enter Scheme Name"
                variant="outlined"
                fullWidth
                value={formInput.schemeName.toUpperCase()}
                onChange={handleInput}
                required
                InputProps={{
                  inputProps: {
                    pattern: '^[A-Za-z\\s]*$',
                    title: 'Only characters are allowed',
                    maxLength: 60
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
                label="Scheme Short Name"
                name="schemeShortName"
                placeholder="Enter Scheme Short Name"
                variant="outlined"
                fullWidth
                value={formInput.schemeShortName.toUpperCase()}
                onChange={handleInput}
                required
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
                label="Scheme Description"
                name="schemeDescription"
                placeholder="Enter Scheme Nodal Agency"
                variant="outlined"
                fullWidth
                value={formInput.schemeDescription.toUpperCase()}
                onChange={handleInput}
                InputProps={{
                  inputProps: {
                    pattern: '^[A-Za-z0-9\\s\\(\\)]*$',
                    title: 'Only characters, numbers, and brackets are allowed',
                    maxLength: 50
                  }
                }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <InputLabel style={{ color: 'black' }}>Scheme Type</InputLabel>
                <Select
                  value={schemeType}
                  name="schemeType"
                  onChange={(e) => setSchemeType(e.target.value)}
                  required
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <Typography variant="h3" color="error">
                          *
                        </Typography>
                      </InputAdornment>
                    )
                  }}
                >
                  {/* <MenuItem value="ALL">ALL</MenuItem> */}
                  <MenuItem key={'CENTER'} value="CENTER">
                    CENTER
                  </MenuItem>
                  <MenuItem key={'STATE'} value="STATE">
                    STATE
                  </MenuItem>
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
export default SchemeAdd;
