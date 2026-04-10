// material-ui
import React from 'react';
import { useReducer } from "react";
import axiosInstance from 'hooks/useAuthTokenUrl';
import MainCard from 'ui-component/cards/MainCard';
import {Grid ,TextField , Button} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';
// ==============================|| SAMPLE PAGE ||============================== //


function AddMinistry() {
  const [formInput, setFormInput] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    {
      ministryCode: "",
      ministryName: "",
      ministryShortName: "",
      ministryAddress:"",
      createdBy:"",
      creationDate:null
    }
  );

// Define action types
const RESET_FORM = 'RESET_FORM';
  const handleSubmit = async (e) => {
    e.preventDefault()
    event.target.reset();
    const postFormDate = JSON.stringify(formInput)
    try {
      const postUrl = '/master-management/saveMinistryMaster';
      const res = await axiosInstance.post(postUrl, postFormDate)
      console.log('Ministry Master Data Save : Status Code : ', res.status)
      // Reset form fields using dispatch
    dispatch({ type: RESET_FORM, initialState: newState });
    } catch (e) {
      console.log('Ministry Master Data Not Save : Some error has occured : ', e)
    }
  }

  const handleInput = evt => {
    const name = evt.target.name;
    const newValue = evt.target.value;
    setFormInput({ [name]: newValue });
  };
  

  return (
    <div>
       <MainCard title="Add Ministry">
       <form onSubmit={handleSubmit}>
   <Grid container spacing={2}>

  <Grid item xs={12} sm={4}>
    <TextField label="Ministry Code" name='ministryCode' placeholder='Enter Ministry Code' variant='outlined' fullWidth onChange={handleInput}/>
  </Grid>
  <Grid item xs={12} sm={4}>
  <TextField label="Ministry Name" name='ministryName' placeholder="Enter Ministry Name" variant='outlined' fullWidth onChange={handleInput}/>
  </Grid>
  <Grid item xs={12} sm={4}>
  <TextField label="Ministry Short Name" name='ministryShortName' placeholder="Enter Ministry Short Name" variant='outlined' fullWidth onChange={handleInput}/>
  </Grid>

 
  <Grid item xs={12} sm={4}>
    <TextField label="Ministry Address" name="ministryAddress" placeholder="Enter Ministry Address" variant='outlined' fullWidth onChange={handleInput}/>
  </Grid>
      <Grid item xs={12} sm={4}>
  <TextField label="Created/Modified By" name="createdBy" placeholder="Enter Created/Modified by " variant='outlined' fullWidth onChange={handleInput}/>
  </Grid>
  <Grid item xs={12} sm={4}>
{/*   <DatePicker label="Created/Modified Date " name="creationDate" placeholder="Enter Creation Date" variant='outlined' fullWidth onChange={handleInput}/>
 */}  
 <LocalizationProvider dateAdapter={AdapterDayjs}  onChange={handleInput}>
      <DatePicker defaultValue={dayjs(new Date())} format="DD-MM-YYYY" disableFuture name="creationDate" slotProps={{ textField: { fullWidth: true } }} variant='outlined'  />
    </LocalizationProvider>
 </Grid>
  <Grid item xs={12} alignItems="center">
 <Button type="submit" variant="contained" color="secondary">ADD</Button>
  </Grid>
</Grid>
</form>
  </MainCard>
    </div>
  )
}

export default AddMinistry
