import React from 'react';
import { useReducer, useState } from 'react';
import axiosInstance from 'hooks/useAuthTokenUrl';
import { Button, Grid, Typography, TextField, InputAdornment, Backdrop, CircularProgress } from '@mui/material';
import MainCard from 'ui-component/cards/MainCard';
import AlertSucess from 'components/common/alertSucess';
import Duplicate from 'components/common/Duplicate';

function CategoryAdd() {
  const [formInput, setFormInput] = useReducer((state, newState) => ({ ...state, ...newState }), {
    categoryId: '',
    categoryName: '',
    categoryShortName: ''
  });

  const handleReset = () => {
    setFormInput({
      categoryId: '',
      categoryName: '',
      categoryShortName: ''
    });
  };

  const [showAlert, setShowAlert] = useState(false);
  const [showAlertDup, setShowAlertDup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [buttonClicked, setButtonClicked] = useState(false);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    event.target.reset();
    setLoading(true);
    setButtonClicked(true);
    
    const postFormDate = JSON.stringify(formInput);
    try {
      const postUrl = '/master-management/saveCategoryMaster';
      const res = await axiosInstance.post(postUrl, postFormDate);
      console.log('Category Master Data Save : Status Code : ', res.status);
      // Reset form fields using dispatch

      const msg = res.data.msg;
      if (res.status === 201) {
        if (msg === 'duplicate') {
          setShowAlertDup(true);
          setLoading(false);
          setButtonClicked(false);
        } else {
          setShowAlert(true);
        }
        setLoading(false);
        setButtonClicked(false);
        setFormInput({
          categoryId: '',
          categoryName: '',
          categoryShortName: ''
        });
        // Automatically hide the alert after 5 seconds
        const timeoutId = setTimeout(() => {
          setLoading(false);
          setButtonClicked(false);
        }, 5000);

        // Clear the timeout when the component is unmounted or when showAlert changes
        return () => clearTimeout(timeoutId);
      }
      setLoading(false);
      setButtonClicked(false);
     
    } catch (e) {
      setLoading(false);
      setButtonClicked(false);
      console.log('Category Master Data Not Save : Some error has occured : ', e);
    }
  };

  const handleInput = (evt) => {
    const name = evt.target.name;
    const newValue = evt.target.value.toUpperCase();
    setFormInput({ [name]: newValue });
  };

  return (
    <div>
      <MainCard title="Add Category">
       
        {showAlertDup && <Duplicate />}
        {showAlert && <AlertSucess msg={'Category'} setShowAlert={setShowAlert} />}
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <TextField
                label="Category Code"
                name="categoryId"
                placeholder="Enter Category Code"
                variant="outlined"
                fullWidth
                value={formInput.categoryId.toUpperCase()}
                onChange={handleInput}
                required
                InputProps={{
                  inputProps: {
                    pattern: '^[A-Za-z]*$',
                    title: 'Only characters are allowed',
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
                label="Category Name"
                name="categoryName"
                placeholder="Enter Category Name"
                variant="outlined"
                fullWidth
                value={formInput.categoryName.toUpperCase()}
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
                label="Category Short Name"
                name="categoryShortName"
                placeholder="Enter Category Short Name"
                variant="outlined"
                fullWidth
                value={formInput.categoryShortName.toUpperCase()}
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
export default CategoryAdd;
