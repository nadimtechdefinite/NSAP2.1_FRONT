import React, { useState, useEffect, useReducer } from 'react';
import {
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Breadcrumbs,
  Link,
  Typography,
  Backdrop,
  CircularProgress
} from '@mui/material';
import MainCard from 'ui-component/cards/MainCard';
import axiosInstance from 'hooks/useAuthTokenUrl';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
//import { useNavigate } from "react-router-dom";

export default function AddCriteria() {
  //const navigate = useNavigate();
  const [snackbar, setSnackbar] = useState(null);
  const handleCloseSnackbar = () => setSnackbar(null);
  const [formInput, setFormInput] = useReducer((state, newState) => ({ ...state, ...newState }), {
    conditionOne: '',
    operatorOne: '',
    valueOne: '',
    logicalOperator: '',
    operatorTwo: '',
    valueTwo: '',
    schemeCode: '',
    gender: '',
    bpl: '',
    stateCode: ''
  });
  const handleInputChangeData = (event) => {
    event.target.value = event.target.value.replace(/[^0-9]/g, '');
  };

  const handleInput = (evt) => {
    const name = evt.target.name;
    const newValue = evt.target.value;
    setFormInput({ [name]: newValue });
  };

  const handleChange = (event) => {
    handleInput(event);
    setFormInput({ schemeCode: event.target.value });
  };

  const [getAllCriteria, setAllCriteria] = useState([]);
  const [loading, setLoading] = useState(false);
  const [buttonClicked, setButtonClicked] = useState(false);

  const getCriteriaData = async () => {
    try {
      const findAllCriteriaUrl = '/criteria-master/findAllScheme';
      const response = await axiosInstance.get(findAllCriteriaUrl);
      setAllCriteria(response.data);
    } catch (error) {
      console.error('Error fetching criteria data:', error);
    }
  };

  //const RESET_FORM = 'RESET_FORM';
  const handleSubmit = async (e) => {
    e.preventDefault();
    event.target.reset();
    setLoading(true);
    setButtonClicked(true);
    if (/^\d*$/.test(formInput.valueOne) && /^\d*$/.test(formInput.valueTwo)) {
      const postFormDate = JSON.stringify(formInput);
      try {
        const postUrl = '/criteria-master/findAllCriteria';
        const res = await axiosInstance.post(postUrl, postFormDate);
        console.log('Criteria Master Data Save : Status Code : ', res.status);
        if (res.status >= 200) {
          setSnackbar({ children: 'Record added successfully!', severity: 'success' });
        }
        setLoading(false);
        setButtonClicked(false);
        //navigate("/masters/criteria/update");
        setFormInput({
          conditionOne: '',
          operatorOne: '',
          valueOne: '',
          logicalOperator: '',
          operatorTwo: '',
          valueTwo: '',
          schemeCode: '',
          gender: '',
          bpl: '',
          stateCode: ''
        });
      } catch (e) {
        setLoading(false);
        setButtonClicked(false);
        console.log('Criteria Master Data Not Save : Some error has occured : ', e);
        setSnackbar({ children: 'Error in adding record', severity: 'error' });
      }
    } else {
      alert('Please Enter only numbers in Value1 and Value2 ');
    }
  };

  const handleReset = () => {
    const form = document.getElementById('criteriaForm');
    if (form) {
      form.reset();
      setFormInput({
        conditionOne: '',
        operatorOne: '',
        valueOne: '',
        logicalOperator: '',
        operatorTwo: '',
        valueTwo: '',
        schemeCode: '',
        gender: '',
        bpl: '',
        stateCode: ''
      });
    }
  };

  useEffect(() => {
    getCriteriaData();
  }, []);

  return (
    <>
      {!!snackbar && (
        <Snackbar open anchorOrigin={{ vertical: 'top', horizontal: 'center' }} onClose={handleCloseSnackbar} autoHideDuration={6000}>
          <Alert {...snackbar} onClose={handleCloseSnackbar} style={{ marginLeft: '130px' }} />
        </Snackbar>
      )}

      <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb" style={{ marginBottom: '20px' }}>
        <Link color="inherit" href="#" style={{ color: 'blue' }} title="Home">
          Home
        </Link>
        <Link color="inherit" href="#" style={{ color: 'blue' }} title="Masters">
          Masters
        </Link>
        <Typography color="textInfo" title="Add Criteria Master">
          Add Criteria Master
        </Typography>
      </Breadcrumbs>
      <MainCard title="Add Criteria Master">
        <form method="post" action="" onSubmit={handleSubmit} id="criteriaForm">
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel id="scheme-label">Scheme Name</InputLabel>
                <Select name="schemeCode" label="scheme-label" required onChange={handleChange} value={formInput.schemeCode}>
                  <MenuItem value="0">--Select Scheme--</MenuItem>
                  {getAllCriteria.map((item) => (
                    <MenuItem key={item.schemeCode} value={item.schemeCode}>
                      {item.schemeCode}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <br /> <br />
              <FormControl fullWidth>
                <InputLabel id="op1-label">Operator1</InputLabel>
                <Select name="operatorOne" label="op1-label" onChange={handleInput} required value={formInput.operatorOne}>
                  <MenuItem value="0">--Select--</MenuItem>
                  <MenuItem value="<">&lt; </MenuItem>
                  <MenuItem value=">">&gt; </MenuItem>
                  <MenuItem value="<=">&le; </MenuItem>
                  <MenuItem value=">=">&ge; </MenuItem>
                  <MenuItem value="=">=</MenuItem>
                </Select>
              </FormControl>
              <br /> <br />
              <FormControl fullWidth>
                <InputLabel id="logical-label">Logical Operator</InputLabel>
                <Select name="logicalOperator" label="logical-label" onChange={handleInput} required value={formInput.logicalOperator}>
                  <MenuItem value="0">--Select--</MenuItem>
                  <MenuItem value="AND">AND</MenuItem>
                </Select>
              </FormControl>
              <br /> <br />
              <TextField
                fullWidth
                required
                label="Value2"
                name="valueTwo"
                autoComplete="off"
                placeholder="Please Enter only numbers."
                onChange={handleInput}
                inputProps={{ maxLength: 8 }}
                onInput={handleInputChangeData}
              />
              <br /> <br />
              <FormControl fullWidth>
                <InputLabel id="bpl-label">BPL</InputLabel>
                <Select name="bpl" label="bpl-label" onChange={handleInput} required value={formInput.bpl}>
                  <MenuItem value="N">No</MenuItem>
                  <MenuItem value="Y">Yes</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <br /> <br />
            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel id="con-label">Condition</InputLabel>
                <Select name="conditionOne" label="con-label" onChange={handleInput} required value={formInput.conditionOne}>
                  <MenuItem value="0">--Select Condition--</MenuItem>
                  <MenuItem value="AGE">AGE</MenuItem>
                  <MenuItem value="ANNUAL INCOME">ANNUAL INCOME</MenuItem>
                </Select>
              </FormControl>
              <br /> <br />
              <TextField
                fullWidth
                required
                label="Value1"
                name="valueOne"
                autoComplete="off"
                placeholder="Please Enter only numbers."
                onChange={handleInput}
                inputProps={{ maxLength: 8 }}
                onInput={handleInputChangeData}
              />
              <br /> <br />
              <FormControl fullWidth>
                <InputLabel id="op2-label">Operator2</InputLabel>
                <Select name="operatorTwo" label="op1-label" onChange={handleInput} required value={formInput.operatorTwo}>
                  <MenuItem value="0">--Select--</MenuItem>
                  <MenuItem value="<">&lt; </MenuItem>
                  <MenuItem value=">">&gt; </MenuItem>
                  <MenuItem value="<=">&le; </MenuItem>
                  <MenuItem value=">=">&ge; </MenuItem>
                  <MenuItem value="=">=</MenuItem>
                </Select>
              </FormControl>
              <br /> <br />
              <FormControl fullWidth>
                <InputLabel id="gender-label">Scheme is applicable to</InputLabel>
                <Select name="gender" label="op1-label" onChange={handleInput} required value={formInput.gender}>
                  <MenuItem value="A">All</MenuItem>
                  <MenuItem value="M">Male</MenuItem>
                  <MenuItem value="F">Female</MenuItem>
                  <MenuItem value="T">Transgender</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          <Button type="submit" variant="contained" color="primary" style={{ marginTop: '20px' }} title="Submit" disabled={buttonClicked}>
            Submit
          </Button>
          <Button
            onClick={handleReset}
            type="reset"
            variant="contained"
            color="secondary"
            style={{ marginTop: '20px', marginLeft: '10px' }}
            title="Reset"
          >
            Reset
          </Button>
        </form>
        <Backdrop open={loading} style={{ zIndex: 999, color: '#fff' }}>
          <CircularProgress color="inherit" />
        </Backdrop>
      </MainCard>
    </>
  );
}
