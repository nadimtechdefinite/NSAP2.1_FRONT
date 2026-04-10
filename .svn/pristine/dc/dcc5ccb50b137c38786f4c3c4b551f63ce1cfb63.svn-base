import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import MainCard from 'ui-component/cards/MainCard';
import { Breadcrumbs, Link, Typography, Grid, Paper } from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import axiosInstance from 'hooks/useAuthTokenUrl';

export default function ViewCriteria() {
  
  const navigate = useNavigate();
  const [criteriaData, setCriteriaData] = useState({
    conditionOne: '',
    operatorOne: '',
    valueOne: '',
    logicalOperator: '',
    operatorTwo: '',
    valueTwo: '',
    schemeCode: '',
    gender: '',
    bpl: '',
    stateCode: '',
    userCreated: '',
    dateFormatted: '',
  });

  const getCriteriaData = async () => {
    try {
      const findAllCriteriaUrl = '/criteria-master/findAllCriteria/' + localStorage.getItem('crViewId');
      const res = await axiosInstance.get(findAllCriteriaUrl);
      setCriteriaData(res.data);
    } catch (error) {
      console.error('Error fetching criteria data:', error);
    }
  };

  const backItem = () => {
    localStorage.setItem('crViewId', '');
    navigate('/masters/criteria/update');
  };

  useEffect(() => {
    getCriteriaData();
  }, []);

  const customColumnNames = {
    schemeCode: 'Scheme Name',
    conditionOne: 'Condition',
    operatorOne: 'Operator1',
    valueOne: 'Value1',
    logicalOperator: 'Logical Operator',
    operatorTwo: 'Operator2',
    valueTwo: 'Value2',
    gender: 'Scheme Applicable To',
    bpl: 'BPL',
    userCreated: 'Created/Updated By',
    dateFormatted: 'Created/Updated Date',
  };

  return (
    <>
      <Button
        title="Back"
        variant="contained"
        color="primary"
        style={{ float: 'right', marginTop: '-7px' }}
        onClick={backItem}
        startIcon={<ArrowBackIcon />}
      >Back
      </Button>

      <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb" style={{ marginBottom: '20px' }}>
        <Link color="inherit" href="#" style={{ color: 'blue' }} title="Home">
          Home
        </Link>
        <Link color="inherit" href="#" style={{ color: 'blue' }} title="Masters">
          Masters
        </Link>
        <Typography color="textInfo" title="View Criteria Master">
          View Criteria Master
        </Typography>
      </Breadcrumbs>
      <MainCard title="View Criteria Master" style={{ marginRight: 'center' }}>
        <Grid container spacing={3}>
          {Object.entries(customColumnNames).map(([dataKey, customName]) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={dataKey}>
              <Paper elevation={3} style={{ padding: '16px', textAlign: 'center' }}>
                <Typography variant="subtitle1" gutterBottom>
                  <b>{customName}</b>
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {dataKey === 'gender'
                    ? criteriaData[dataKey] === 'M'
                      ? 'Male'
                      : criteriaData[dataKey] === 'A'
                      ? 'All'
                      : criteriaData[dataKey] === 'F'
                      ? 'Female'
                      : 'Transgender'
                    : criteriaData[dataKey] === 'Y'
                    ? 'Yes'
                    : criteriaData[dataKey] === 'N'
                    ? 'No'
                    : criteriaData[dataKey]}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
        <br/><br/><br/><br/><br/><br/><br/><br/><br/>
      </MainCard>
    </>
  );
}