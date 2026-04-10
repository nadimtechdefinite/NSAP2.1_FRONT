import React,{useState,useEffect} from 'react';
import { useReducer } from "react";
import axios from 'axios';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import {
  TextField,
  Grid,
  Select,
  FormControl,
  InputLabel,
  MenuItem
} from '@mui/material' 



function BeneficiaryBPLDetails(){
  const [formInput, setFormInput] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    { 
      applicationNo:"",
      bplYear:"",
      bplLocation:"",
      bplFamilyId:"",
      bplMemberId:"",
      beneficiaryPersonalDetailsId:""

      }
  );
  //const [data, setData] = useState([]);
  //const RESET_FORM = 'RESET_FORM';
  const handleSubmit1 = async (e) => {
    e.preventDefault()
    event.target.reset();
   // const postFormDate = JSON.stringify(formInput)
    /* const headers = { 
      'Content-Type': 'application/json'
  }; */
  try {
    const response = await fetch('http://localhost:9000/api/v1/beneficiaryRegistration/saveBeneficiaryBplDetails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formInput),
    });

    if (response.ok) {
      console.log('Form submitted successfully');
      const jsonData = await response.json();
      console.log(jsonData);
      if(jsonData.length==0){
        setShowNoRecordsMessage(true);
      }
    } else {
      console.error('Form submission failed');
    }
  }  catch (e) {
      console.log(e)
    }
  }
  
  //const [beneficiaryPersonalDetailsId, setBeneficiaryPersonalDetailsId] = useState(''); // Initial value can be an empty string or null
  const [getAllBpl, setAllBpl] = useState([])
  /* const storedData = JSON.parse(localStorage.getItem('formId'))
  console.log('confirm: ',storedData) */
  const getGithubData = () => {
    let endpoints = [
      `http://localhost:9000/api/v1/beneficiaryRegistration/findBeneficiaryBplDetailsByBeneficiaryPersonalDetailsId/39`
    ];
    Promise.all(endpoints.map((endpoint) => axios.get(endpoint))).then(([{data: allBpl}] )=> {
      setAllBpl(allBpl)
      
     
    });
  }
  useEffect(() => {
    
    getGithubData();
    
  }, [])
  
  const handleInputChange = (event) => {
    setBeneficiaryPersonalDetailsId(event.target.value);
  };

  console.log(getAllBpl)

  const handleInput = evt => {
    const name = evt.target.name;
    const newValue = evt.target.value;
    setFormInput({ [name]: newValue });
  };

  console.log(getAllBpl)
  const currentYear = new Date().getFullYear();
  const startYear = 1900; // Define the start year

  const years = Array.from(
    { length: currentYear - startYear + 1 },
    (_, index) => currentYear - index
  );
  
  const [isPreviewModalOpen, setPreviewModalOpen] = useState(false);
  const [selectedYear, setSelectedYear] = React.useState('');
  const handleChange = (event) => {
    handleInput(event);
    setSelectedYear(event.target.value);
  };
  
  const handlePreview = () => {
    // Implement preview logic here
    //console.log('Preview:', formData);
    // Open the preview modal
    setPreviewModalOpen(true);
  };

  const closePreviewModal = () => {
    // Close the preview modal
    setPreviewModalOpen(false);
  };

    return(
        <>
             <div>
           <form onSubmit={handleSubmit1}>
              
              <Grid container spacing={2}>
              
    
    <Grid item xs={12} sm={4}>
    <TextField 
    label="Application No" 
    name='applicationNo' 
    placeholder="Enter Application No" 
    variant='outlined' 
    fullWidth 
    onChange={handleInput}
    />
    </Grid>

    <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
    <InputLabel id="demo-simple-select-label">Year</InputLabel>
    <Select
      labelId="demo-simple-select-label"
      id="demo-simple-select"
      label="Year"
      name="bplYear"
      value={selectedYear}
      onChange={handleChange}
    >
        {years.map((year) => (
          
          <MenuItem key={year} value={year}>{year}</MenuItem>
        ))}


      </Select>
      </FormControl>
      
    </Grid>
    <Grid item xs={12} sm={4}>
    <TextField 
    label="Location" 
    name='bplLocation' 
    placeholder="Enter Location" 
    variant='outlined' 
    fullWidth 
    onChange={handleInput}
    />
    </Grid>
    <Grid item xs={12} sm={4}>
    <TextField 
    label="Family Id No" 
    name='bplFamilyId' 
    placeholder="Enter Family Id No" 
    variant='outlined' 
    fullWidth 
    onChange={handleInput}
    />
    </Grid>
    <Grid item xs={12} sm={4}>
    <TextField 
    label="Member Id" 
    name='bplMemberId' 
    placeholder="Enter Member Id" 
    variant='outlined' 
    fullWidth 
    onChange={handleInput}
    />
    </Grid>
    {/* <Grid item xs={12} sm={4}>
    <input type="file" />
      <button>Upload</button>
    </Grid>  */}
    
     <Grid item xs={12} alignItems="center">
     
     <Button type="submit" variant="contained" color="secondary">ADD</Button>
     <Button onClick={handlePreview} variant="contained" color="secondary">Preview</Button>
      </Grid>
    </Grid>
    </form>
    {/* Preview Modal */}
    <Dialog open={isPreviewModalOpen} onClose={closePreviewModal} >
        <DialogTitle fontSize={20}>Preview</DialogTitle>
        <DialogContent>
          {/* Render the preview form content */}
        
     
          <p onChange={handleInputChange}>Name:{getAllBpl.bplFamilyId}</p>
          <p>Email: anamshaikh941@gmail.com</p>
          {/* Add more fields as needed */}
        </DialogContent>
        <DialogActions>
          <Button onClick={closePreviewModal}>Close</Button>
        </DialogActions>
      </Dialog>
      </div>
      </>
      )
}
export default BeneficiaryBPLDetails;