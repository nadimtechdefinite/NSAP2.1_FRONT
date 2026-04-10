import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import MainCard from 'ui-component/cards/MainCard';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import axiosInstance from 'hooks/useAuthTokenUrl';
import EditIcon from '@mui/icons-material/Edit';
import { Button, FormControl, Grid, InputLabel, MenuItem, Select, Typography, TextField, Backdrop, CircularProgress } from '@mui/material';
import Duplicate from 'components/common/Duplicate';
import AlertSucess from 'components/common/alertSucess';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Paper from '@mui/material/Paper'; // Import Paper component
import StateList from 'components/form_components/StateList';

function AddPfmsAgencyConfigUpdate() {
  const [showedit, setShowEdit] = useState(false);
  const [stateId, setStateId] = useState('');

  const columns = [
    {
      field: 'Count',
      headerNam: 'S. No.',
      flex: 1
    },
    // {
    //   field: 'statName',
    //   headerNam: 'State Code',
    //   flex: 1
    // },
    {
      field: 'schemeCode',
      headerName: 'Scheme Code',
      flex: 1
      //   editable: true
    },
    {
      field: 'pfmsLevelName',
      headerName: 'Pfms Level',
      flex: 1
      //   editable: true
    },
    {
      field: 'action',
      headerName: 'Action',
      flex: 1,
      // headerAlign: 'center',
      renderCell: (params) => (
        <>
          <Button
            //   variant="outlined"
            color="info"
            style={{ cursor: 'pointer', fontSize: '12px', marginRight: '8px' }}
            onClick={() => handleEdit(params)}
          >
            <EditIcon />
          </Button>
        </>
      )
    }
  ];

  

  const [showAlertDup, setShowAlertDup] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [loading, setLoading] = useState(false);
  const [buttonClicked, setButtonClicked] = useState(false);

  const [getAllAgencyConfig, setAgencyConfig] = useState([]);
  const fetchData = async () => {
    const getUrl = `/master-agencyPfms/findAllSchemeInConfigAgency/${stateId}`;
    const response = await axiosInstance.get(getUrl);
    if (response.status === 200) {
      const dataWithSerialNumber = response.data.map((item, index) => ({
        ...item,
        Count: index + 1 // Using index as the default row identifier
      }));
      return dataWithSerialNumber;
    } else {
      throw new Error('Agency Config Master : Data coud not be fetched : ', response.status);
    }
  };

  // --------------------------------------------------------------------
  const [getallRowEdit, setallRowEdit] = useState({
    id: '',
    stateCode: '',
    schemeCode: '',
    pfmsLevel: '' // Set a default value that matches one of the available options
  });

  const handleEdit = (rowData) => {
    setShowEdit(true);
    console.log('Editing:', rowData.row);
    setallRowEdit(rowData.row);

    // }
  };

  const handleInput = (evt) => {
    const name = evt.target.name;
    setallRowEdit((prevRowEdit) => ({
      ...prevRowEdit,
      [name]: evt.target.value
    }));
  };

  async function postData(e) {
    e.preventDefault();
    event.target.reset();
    setLoading(true);
    setButtonClicked(true);
    const postFormDate = JSON.stringify(getallRowEdit);
    console.log(postFormDate);
    var result = window.confirm('Are you sure want to Update the record? ');
    if (result) {
      try {
        const postUrl = '/master-agencyPfms/updateAgencyConfig';
        const res = await axiosInstance.post(postUrl, postFormDate);
        console.log('Agency Master Data update : Status Code : ', res.status);
        if (res.status === 201) {
        
          setShowAlert(true);

          const updatedData = await fetchData();
          // Update the state with the new data
          setAgencyConfig(updatedData);
          setLoading(false);
        setButtonClicked(false);
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
        //navigate("/masters/criteria/update");
        setLoading(false);
        setButtonClicked(false);
      } catch (error) {
        setLoading(false);
        setButtonClicked(false);
        console.error('Error updating data:', error);
        // setSnackbar({ children: 'Record failed in update!', severity: 'error' });
      }
    } else {
      // ...do nothing
    }
  }

  const rows = getAllAgencyConfig.map((item) => ({
  
    id:item.id,
    Count: item.Count,
    statName: item.statName,
    stateCode: item.stateCode,
    schemeCode: item.schemeCode,
    pfmsLevel: item.pfmsLevel,
    pfmsLevelName: 
    item.pfmsLevel === 'D' ? 'District' :
    item.pfmsLevel === 'SD' ? 'Sub-District' :
    item.pfmsLevel === 'S' ? 'State' :
    item.pfmsLevel,
    
  
  }));
 
  const handleBackButtonClick = () => {
    setShowEdit(false)
  };


  useEffect(() => {
    if(stateId){
      fetchData()
      .then((res) => {
        setAgencyConfig(res);
       
        res.map((item) => (
          console.log('xxxxx',JSON.stringify(item.stateMaster.statName))
        ));
      })
      .catch((e) => {
        console.log(e.message);
      });
    }
    
  }, [stateId]);


  const handleSelectStateid = (state) => {
    setStateId(state);
  };

  return (
    <div>
      
      {/* ------------------------------------------------------------------- */}

      {!showedit && (
        <MainCard title="Update Agency Config">
          <Grid container spacing={2} style={{ paddingBottom: '20px' }}>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <StateList onSelectState={handleSelectStateid} />
              </FormControl>
            </Grid>
          </Grid>
           <Paper
            elevation={1} // Set the elevation to give it a shadow
            style={{ backgroundColor: 'lightblue', padding: '16px' }} // Set your desired background color
          >
            <Typography variant="h5" style={{ color: 'black' ,textAlign:'center'}}>
             State Name  - {rows.length > 0 ? rows[0].statName : ''}
            </Typography>
          </Paper>
          <Box sx={{ height: 400, width: '100%' }}>
            <DataGrid
              getRowId={(row) => row.id}
              slots={{ toolbar: GridToolbar }}
              slotProps={{
                toolbar: {
                  showQuickFilter: true
                }
              }}
              rows={rows}
              columns={columns}
              initialState={{
                pagination: {
                  paginationModel: {
                    pageSize: 5
                  }
                }
              }}
              pageSizeOptions={[5]}
              // checkboxSelection
              disableRowSelectionOnClick
            />
          </Box>
        </MainCard>
      )}
      {/* ------------------------Edit-------------------------------------------------------- */}

      {showAlertDup && <Duplicate />}
      {showAlert && <AlertSucess msg={'Agency'} />}

      {showedit && (
        <MainCard title="Edit Agency Config">
          <Box sx={{ height: 400, width: '100%' }}>
            <form method="post" onSubmit={postData}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                  <FormControl fullWidth>
                    <TextField fullWidth label="State Name" value={getallRowEdit.statName} aria-readonly/>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <FormControl fullWidth>
                    <TextField fullWidth label="Scheme Code" value={getallRowEdit.schemeCode} aria-readonly/>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <FormControl fullWidth>
                    <InputLabel id="pfmsLevel">PFMS Level</InputLabel>
                    <Select
                      labelId="pfmsLevel"
                      id="pfmsLevel"
                      name="pfmsLevel"
                      required
                      value={getallRowEdit.pfmsLevel}
                      label="pfmsLevel"
                      onChange={handleInput}
                    >
                      <MenuItem value={'S'} selected={getallRowEdit.pfmsLevel == getallRowEdit.pfmsLevel}>
                        State
                      </MenuItem>
                      <MenuItem value={'D'} selected={getallRowEdit.pfmsLevel == getallRowEdit.pfmsLevel}>
                        District
                      </MenuItem>
                      <MenuItem value={'SD'} selected={getallRowEdit.pfmsLevel == getallRowEdit.pfmsLevel}>
                        Sub-District
                      </MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>

              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '20px' }}>
                <Button type="submit" variant="contained" color="primary" style={{ marginRight: '10px' }} title="Update" disabled={buttonClicked}>
                  Update
                </Button>
                <Button
                  type="button"
                  variant="contained"
                  color="error" // Note: "danger" is not a valid color, you might want to use "error"
                  style={{ marginLeft: '10px' }}
                  title="Back"
                  onClick={() => handleBackButtonClick()} // Add an onClick handler if needed
                >
                  <ArrowBackIcon /> Back
                </Button>
              </div>
            </form>
          </Box>
          <Backdrop open={loading} style={{ zIndex: 999, color: '#fff' }}>
          <CircularProgress color="inherit" />
        </Backdrop>
        </MainCard>
      )}
    </div>
  );
}

export default AddPfmsAgencyConfigUpdate;
