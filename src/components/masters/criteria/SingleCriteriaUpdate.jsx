import React,{useState,useEffect,useReducer} from 'react'
import {useNavigate } from 'react-router-dom'
import axiosInstance from 'hooks/useAuthTokenUrl';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import {Button,FormControl,Grid,InputLabel,MenuItem,Select,TextField,Breadcrumbs,Link,Typography} from '@mui/material';
import MainCard from 'ui-component/cards/MainCard';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export default function SingleCriteriaUpdate() {
    const [snackbar, setSnackbar] = useState(null);
    const handleCloseSnackbar = () => setSnackbar(null);
    var navigate = useNavigate()
    const [formInput, setFormInput] = useReducer((state, newState) => ({ ...state, ...newState }),
    {
      conditionOne: '',
      schemeCode: '',
      operatorOne: '',
      valueOne: '',
      logicalOperator :'',
      operatorTwo: '',
      valueTwo:'',
      gender:'',
      bpl:'',
      isActive:'',
    }
  );

  const handleInputChangeData = (event) => {
    event.target.value = event.target.value.replace(/[^0-9]/g, '');
    };

    async function getCriteriaData() {
    try {
      //alert('getting local storage id is '+localStorage.getItem("crUpdateId"));
      const findAllCriteriaUrl = '/criteria-master/findAllCriteria/'+localStorage.getItem("crUpdateId");
      const res = await axiosInstance.get(findAllCriteriaUrl);
      setFormInput(res.data);
    } catch (error) {
      console.error('Error fetching criteria data:', error);
    }
  }

const handleInput = evt => {
  const name = evt.target.name;
  const newValue = evt.target.value;
  setFormInput({ [name]: newValue });
};

    async function postData(e) {
      e.preventDefault()
      event.target.reset();
      if (/^\d*$/.test(formInput.valueOne) && /^\d*$/.test(formInput.valueTwo)){
      const postFormDate = JSON.stringify(formInput);
        var result = window.confirm("Are you sure want to Update the record? ");
     if (result) {
        try{
          const postUrl = '/criteria-master/findAllCriteria/'+localStorage.getItem("crUpdateId");
          const res = await axiosInstance.patch(postUrl, postFormDate)
          console.log('Criteria Master Data update : Status Code : ', res.status)
          if (res.status >= 200 ) {
            setSnackbar({ children: 'Record updated successfully!' , severity: 'success' });
          } 
          //navigate("/masters/criteria/update");
      }
      catch (error) {
        console.error('Error updating data:', error);
        setSnackbar({ children: 'Record failed in update!' , severity: 'error' });
      }
    }else{
      // ...do nothing
    }
  }else{
    alert("Please Enter only numbers in Value1 and Value2 ")
  }
  }

    const [schemeAllCriteria, setSchemeAllCriteria] = useState([]);
    const getSchemeCriteriaData = async () => {
      try {
        const findAllCriteriaUrl = '/criteria-master/findAllScheme';
        const response = await axiosInstance.get(findAllCriteriaUrl);
        setSchemeAllCriteria(response.data);
      } catch (error) {
        console.error('Error fetching criteria data:', error);
      }
    };

      function backItem(){
        localStorage.setItem('crUpdateId', '');
        navigate("/masters/criteria/update"); 
      }
      useEffect(() => {
        getCriteriaData();getSchemeCriteriaData();
      }, []);

  return (
    <>
    {!!snackbar && (  
        <Snackbar
          open
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          onClose={handleCloseSnackbar}
          autoHideDuration={6000}
        >
          <Alert {...snackbar} onClose={handleCloseSnackbar} style={{marginLeft:'130px'}}/>
        </Snackbar>
      )}
        
    <Button title='Back'
          variant="contained"
          color="primary"
          style={{ float: 'right', marginTop: '-7px' }}
          onClick={() => backItem()}
          startIcon={<ArrowBackIcon />}
        >
          Back
        </Button>
    <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb" style={{ marginBottom: '20px' }}>
          <Link color="inherit" href="#" style={{color:'blue'}} title='Home'>
            Home
          </Link>
          <Link color="inherit" href="#" style={{color:'blue'}} title='Masters'>
            Masters
          </Link>
          <Typography color="textInfo" title='Add Criteria Master'>Update Criteria Master</Typography>
        </Breadcrumbs>
    
     <MainCard title="Update Criteria Master">
      <form method="post" onSubmit={postData}>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <FormControl fullWidth>
              <InputLabel id="scheme-label">Scheme Name</InputLabel>
              <Select name="schemeCode" label="scheme-label" onChange={handleInput} required value={formInput.schemeCode}>
                {schemeAllCriteria.map((item, index) => (
              <MenuItem key={index} value={item.schemeCode}>
                          {item.schemeCode}
                  </MenuItem>
                ))}
            </Select>

            </FormControl>
                    <br/> <br/>
            <FormControl fullWidth>
              
              <InputLabel id="op1-label">Operator1</InputLabel>
              <Select name="operatorOne" label="op1-label" onChange={handleInput} required value={formInput.operatorOne}>
                <MenuItem value='<' selected={formInput.operatorOne == formInput.operatorOne}>&lt; </MenuItem>
                <MenuItem value=">" selected={formInput.operatorOne == formInput.operatorOne}>&gt; </MenuItem>
                <MenuItem value="<=" selected={formInput.operatorOne == formInput.operatorOne}>&le; </MenuItem>
                <MenuItem value=">=" selected={formInput.operatorOne == formInput.operatorOne}>&ge; </MenuItem>
                <MenuItem value="=" selected={formInput.operatorOne == formInput.operatorOne}>=</MenuItem>
               
              </Select>
            </FormControl>
            <br/> <br/>
            <FormControl fullWidth>
              <InputLabel id="logical-label">Logical Operator</InputLabel>
              <Select name="logicalOperator" label="logical-label" onChange={handleInput} required value={formInput.logicalOperator}>
                <MenuItem value="AND" selected={formInput.logicalOperator == formInput.logicalOperator}>AND</MenuItem>
              </Select>
            </FormControl>
            <br/> <br/>
            <TextField
              fullWidth
              required
              label="Value2"
              name="valueTwo"
              autoComplete="off"
              placeholder="Please Enter only numbers."
              onChange={handleInput}
              inputProps={{ maxLength: 8 }}
              value={formInput.valueTwo}
              onInput={handleInputChangeData}
            />
            <br/> <br/>
            <FormControl fullWidth>
              <InputLabel id="bpl-label">BPL</InputLabel>
              <Select name="bpl" label="bpl-label" onChange={handleInput} required value={formInput.bpl}>
                <MenuItem value="N" selected={formInput.bpl == formInput.bpl}>No</MenuItem>
                <MenuItem value="Y" selected={formInput.bpl == formInput.bpl}>Yes</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <br/> <br/>
          <Grid item xs={6}>
            <FormControl fullWidth>
              <InputLabel id="con-label">Condition -- </InputLabel>
              <Select name="conditionOne" label="con-label" onChange={handleInput} required value={formInput.conditionOne}>
                <MenuItem value="AGE" selected={formInput.conditionOne == formInput.conditionOne}>AGE</MenuItem>
                <MenuItem value="ANNUAL INCOME" selected={formInput.conditionOne == formInput.conditionOne}>ANNUAL INCOME</MenuItem>
              </Select>
            </FormControl>
            <br/> <br/>
            <TextField
              fullWidth
              required
              label="Value1"
              name="valueOne"
              autoComplete="off"
              placeholder="Please Enter only numbers."
              onChange={handleInput}
              inputProps={{ maxLength: 8 }}
              value={formInput.valueOne}
              onInput={handleInputChangeData}
            />
              <br/> <br/>
            <FormControl fullWidth>
              <InputLabel id="op2-label">Operator2</InputLabel>
              <Select name="operatorTwo" label="op1-label" onChange={handleInput} required value={formInput.operatorTwo}>
                <MenuItem value='<' selected={formInput.operatorTwo == formInput.operatorTwo}>&lt; </MenuItem>
                <MenuItem value='>' selected={formInput.operatorTwo == formInput.operatorTwo}>&gt; </MenuItem>
                <MenuItem value='<=' selected={formInput.operatorTwo == formInput.operatorTwo}>&le; </MenuItem>
                <MenuItem value='>=' selected={formInput.operatorTwo == formInput.operatorTwo}>&ge; </MenuItem>
                <MenuItem value='=' selected={formInput.operatorTwo == formInput.operatorTwo}>=</MenuItem>
                              
              </Select>
            </FormControl>
            <br/> <br/>
            <FormControl fullWidth>
              <InputLabel id="gender-label">Scheme is applicable to</InputLabel>
              <Select name="gender" label="gender-label" onChange={handleInput} required value={formInput.gender}>
              <MenuItem value="A"  selected={formInput.gender === 'M'}>All</MenuItem>
             <MenuItem value="M" selected={formInput.gender === 'M'}>Male</MenuItem>
               <MenuItem value="F" selected={formInput.gender === 'F'}>Female</MenuItem>
              <MenuItem value="T" selected={formInput.gender === 'T'}>Transgender</MenuItem>
              </Select>

            </FormControl>
            <br/>
            <br/>
            <FormControl fullWidth>
              <InputLabel id="status-label">Status</InputLabel>
              <Select name="isActive" label="status-label" onChange={handleInput} required value={formInput.isActive}>
                <MenuItem value="true" selected={formInput.isActive == formInput.isActive}>Active</MenuItem>
                <MenuItem value="false" selected={formInput.isActive == formInput.isActive}>Inactive</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        <Button type="submit" variant="contained" color="primary" style={{ marginTop: '20px' }} title='Update'>
        Update
        </Button>
      </form>
      </MainCard>
    </>
  )
}
