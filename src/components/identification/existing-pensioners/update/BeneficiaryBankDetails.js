import React, {useState,useEffect} from 'react';
import { useReducer } from "react";
import axios from 'axios';


import {
    TextField,
    Button,
    Grid,
    FormControl,
    InputLabel , 
    MenuItem , 
    Select
    
  } from '@mui/material' 

function BeneficiaryBankDetails(){
    const [formInput, setFormInput] = useReducer(
        (state, newState) => ({ ...state, ...newState }),
        { 
          applicationNo:"",
          bankPoAccountNo:"",
          ifscCode: "",
          bankType:"",
          branchCode:""
          }
      );
      //const RESET_FORM = 'RESET_FORM';
      const handleSubmit1 = async (e) => {
        e.preventDefault()
        event.target.reset();
        //const postFormDate = JSON.stringify(formInput)
        /* const headers = { 
          'Content-Type': 'application/json'
      }; */
        try {
          const response = await fetch('http://localhost:9000/api/v1/beneficiaryRegistration/saveBeneficiaryBankDetails', {
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
            console.log('applicationNo:', jsonData.applicationNo);
            localStorage.setItem('applicationNo', jsonData.applicationNo);
            
            
            if(jsonData.length==0){
              setShowNoRecordsMessage(true);
            }
          } else {
            console.error('Form submission failed');
          }
        } catch (e) {
          console.log(e)
        }
      }

      const [bankTypeStatus, setBankTypeStatus] = React.useState('');
      const [branch, setBranch] = React.useState('');
    
      const handleInput = evt => {
        const name = evt.target.name;
        const newValue = evt.target.value;
        setFormInput({ [name]: newValue });
      };

      const handleChange = (event) => {
        handleInput(event);
        setBankTypeStatus(event.target.value);
      };

      const handleChange1 = (event) => {
        handleInput(event);
        setBranch(event.target.value);
      };

      const [getAllBankType, setAllBankType] = useState([])
      const [getAllBranch, setAllBranch] = useState([])
      const getGithubData = () => {
        let endpoints = [
          'http://localhost:9000/api/v1/beneficiaryRegistration/findAllBankTypeDetails',
          'http://localhost:9000/api/v1/master-management/findAllBranch'
        ];
        Promise.all(endpoints.map((endpoint) => axios.get(endpoint))).then(([{data: allBankType},{data: allBranch}] )=> {
          setAllBankType(allBankType)
          setAllBranch(allBranch)
          console.log(getAllBranch);
         
        });
      }
      useEffect(() => {
        getGithubData();
      }, [])
    

    
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
    <TextField 
    label="Bank/PO Account No" 
    name='bankPoAccountNo' 
    placeholder="Enter Bank/PO Account No" 
    variant='outlined' 
    fullWidth 
    onChange={handleInput}
    />
    </Grid>
    <Grid item xs={12} sm={4}>
    <TextField 
    label="IFSC Code" 
    name='ifscCode' 
    placeholder="Enter IFSC Code" 
    variant='outlined' 
    fullWidth
    onChange={handleInput}
    />
    </Grid>

    
    
    
   <Grid item xs={12} sm={4}>
    <FormControl fullWidth>
    <InputLabel id="demo-simple-select-label">Bank Type</InputLabel>
    <Select
      labelId="demo-simple-select-label"
      id="demo-simple-select"
      label="Bank Type"
      name="bankType"
      value={bankTypeStatus}
      onChange={handleChange}
    >
        {getAllBankType.map(item => (
        <MenuItem key={item.bankType} value={item.bankType}>{item.bankTypeName}</MenuItem>
        
      ))}
      
     
    </Select>
    </FormControl>
    </Grid>
    <Grid item xs={12} sm={4}>
    <FormControl fullWidth>
    <InputLabel id="demo-simple-select-label">Branch Name</InputLabel>
    <Select
      labelId="demo-simple-select-label"
      id="demo-simple-select"
      label="Branch Name"
      name="branchCode"
      value={branch}
      onChange={handleChange1}
    >
       {getAllBranch.map(item => (
        <MenuItem key={item.branchCode} value={item.branchCode}>{item.bankBranchName}</MenuItem>
        
      ))}
      
    
    </Select>
    </FormControl>
    </Grid> 
              <Grid item xs={12} alignItems="center">
     <Button type="submit" variant="contained" color="secondary">ADD</Button>
      </Grid>
    </Grid>
    </form>
              </div>
            </>
        
      )
    }


export default BeneficiaryBankDetails;