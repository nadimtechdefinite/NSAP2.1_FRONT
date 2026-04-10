import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import MainCard from 'ui-component/cards/MainCard';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import axiosInstance from 'hooks/useAuthTokenUrl';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import EditIcon from '@mui/icons-material/Edit';
import { Paper, Button, FormControl, Grid, Breadcrumbs, Link, Typography, TextField ,InputAdornment ,Alert, Backdrop, CircularProgress} from '@mui/material';
import AlertSucess from 'components/common/alertSucess';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AreaList from 'components/form_components/AreaList';
import DistrictList from 'components/form_components/DistrictList';
import StateList from 'components/form_components/StateList';
import { showalertwhenObjectretrnvalidation } from 'components/common/fieldValidationFunctionByjava';

function UpdateSubDistrict() {
  const [showedit, setShowEdit] = useState(false);

  const columns = [
    {
      field: 'Count',
      headerNam: 'S. No.',
      flex: 1
    },
    {
      field: 'districtName',
      headerName: 'District Name',
      flex: 1
    },
    {
      field: 'id',
      headerName: 'Sub-District Code',
      flex: 1
    },
    {
      field: 'area',
      headerName: 'Area',
      flex: 1
    },
    {
      field: 'subDistrictName',
      headerName: 'Sub-District Name',
      flex: 1
    },
    {
      field: 'subDistrictNameShort',
      headerName: 'Sub-District Short Name',
      flex: 1
    },
    {
      field: 'lgdCode',
      headerName: 'Sub-District LGD',
      flex: 1
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

  const [showAlert, setShowAlert] = useState(false);
  const [warningAlert, setShowwarningAlert] = useState('');

  const [getAllState, setAllState] = useState([]);
  const [stateId, setStateId] = useState('');
  const [districtId, setdistrictId] = useState('');
  const [area, setarea] = useState('');
  const [loading, setLoading] = useState(false);
  const [buttonClicked, setButtonClicked] = useState(false);

  const fetchData = async () => {
    const getUrl = `/master-management/findAllSubDistrictMaster/${stateId}/${districtId}/${area}`;
    const response = await axiosInstance.get(getUrl);
    if (response.status >= 200 && response.status < 300) {
      const dataWithSerialNumber = response.data.map((item, index) => ({
        ...item,
        Count: index + 1 // Using index as the default row identifier
      }));
      return dataWithSerialNumber;
    } else {
      throw new Error('Data coud not be fetched!', response.status);
    }
  };

  // --------------------------------------------------------------------
  const [getallRowEdit, setallRowEdit] = useState({});

  const handleEdit = (rowData) => {
    setShowwarningAlert(false);
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

  const handleArea = (area) => {
    setallRowEdit((prevRowEdit) => ({
      ...prevRowEdit,
      area: area
    }));
  };
  const handleDist = (dist) => {
    setallRowEdit((prevRowEdit) => ({
      ...prevRowEdit,
      districtId: dist
    }));
  };
  async function postData(e) {
    e.preventDefault();
    event.target.reset();
    setLoading(true);
    setButtonClicked(true);
    const postFormDate = JSON.stringify(getallRowEdit);
    var result = window.confirm('Are you sure want to Update the record? ');
    if (result) {
      try {
        const postUrl = '/master-management/UpdateSubDistrict';
        const res = await axiosInstance.put(postUrl, postFormDate);
        console.log('Sub-District Master Data update : Status Code : ', res.status);
        if (res.status === 201) {
          setShowAlert(true);

          const updatedData = await fetchData();
          // Update the state with the new data
          setAllState(updatedData);
          setLoading(false);
          setButtonClicked(false);
          // Automatically hide the alert after 5 seconds
          const timeoutId = setTimeout(() => {
            setShowAlert(false);
          }, 5000);

          // Clear the timeout when the component is unmounted or when showAlert changes
          return () => clearTimeout(timeoutId);
        }
        setLoading(false);
        setButtonClicked(false);
        //navigate("/masters/criteria/update");
      } catch (error) {
        setLoading(false);
        setButtonClicked(false);
        setShowwarningAlert(showalertwhenObjectretrnvalidation(error));
        console.error('Error updating data:', error);
        // setSnackbar({ children: 'Record failed in update!', severity: 'error' });
      }
    } else {
      setLoading(false);
      setButtonClicked(false);
    }
  }

  const rows = getAllState.map((item) => ({
    id: item.subDistrictId,
    subDistrictId: item.subDistrictId,
    Count: item.Count,
    subDistrictName: item.subDistrictName,
    subDistrictNameShort: item.subDistrictNameShort,
    area: item.area,
    lgdCode: item.lgdCode,
    stateName: item.stateName,
    districtName: item.districtName,
    districtId: item.districtId,
    stateCode: item.stateCode
  }));

  const handleBackButtonClick = () => {
    setShowEdit(false);
  };

  const handleSelectStateid = (state) => {
    setStateId(state);
  };

  const handleDistid = (dist) => {
    setdistrictId(dist);
  };

  const handleAreaid = (area) => {
    setarea(area)
    
  };
  const handleInputChangeData = (event) => {
    if(event.target.value != null && event.target.value != ""){
    event.target.value = event.target.value.replace(/[^0-9]/g, '');
    }
    };
  useEffect(() => {
    if(area){
      fetchData()
      .then((res) => {
        setAllState(res);
      })
      .catch((e) => {
        console.log(e.message);
      });
    }
    
  }, [area]);
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
          Sub-District Master
        </Link>
        <Typography color="textInfo" title="List Of States">
          Update Sub-District
        </Typography>
      </Breadcrumbs>
      {/* ------------------------------------------------------------------- */}

      {!showedit && (
        <MainCard title="Update Sub-District Master">
          <Grid container spacing={2} style={{ paddingBottom: '20px' }}>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <StateList onSelectState={handleSelectStateid} isMandatory={true}/>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <DistrictList selectedStateId={stateId} onSelectDistrict={handleDistid}  isMandatory={true}/>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <AreaList onSelectArea={handleAreaid} isMandatory={true}/>
              </FormControl>
            </Grid>
          </Grid>

          {rows.length !== 0 && (
          <Paper
            elevation={1} // Set the elevation to give it a shadow
            style={{ backgroundColor: 'lightblue', padding: '16px' }} // Set your desired background color
          >
            <Typography variant="h5" style={{ color: 'black', textAlign: 'center' }}>
              State Name - {rows.length > 0 ? rows[0].stateName : ''}
            </Typography>
          </Paper>)}
         
         {rows.length !== 0 && (
          <Box sx={{ height: 700, width: '100%' }}>
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
                    pageSize: 10
                  }
                }
              }}
              pageSizeOptions={[10]}
              // checkboxSelection
              disableRowSelectionOnClick
            />
          </Box> )}
        </MainCard>
      )}
      {/* ------------------------Edit-------------------------------------------------------- */}

      {showAlert && <AlertSucess msg={'Sub-District'} setShowAlert={setShowAlert}/>}

      {showedit && (
        <MainCard title="Edit Sub-District Master">
          {warningAlert && (
          <Alert variant="filled" severity="warning" onClose={handleClose}>
            {warningAlert}
          </Alert>
        )}
          <Box sx={{ height: 400, width: '100%' }}>
            <form method="post" onSubmit={postData}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                  <FormControl fullWidth>
                    <TextField fullWidth label="Sub-District Code" value={getallRowEdit.subDistrictId} aria-readonly />
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={4}>
                  <FormControl fullWidth>
                    <DistrictList
                      onSelectState={getallRowEdit.stateCode}
                      onSelectDistrict={handleDist}
                      defaultSelectedDistrict={getallRowEdit.districtId} isMandatory={true}
                    />
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={4}>
                  <TextField
                    value={(getallRowEdit.subDistrictName || '').toUpperCase()}
                    label="Sub-District Name"
                    name="subDistrictName"
                    placeholder="Enter Sub-District Name"
                    required
                    variant="outlined"
                    fullWidth
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
                    value={(getallRowEdit.subDistrictNameShort || '').toUpperCase()}
                    label="Sub-District Short Name"
                    name="subDistrictNameShort"
                    placeholder="Enter Sub-District Short Name"
                    required
                    variant="outlined"
                    fullWidth
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
                  <FormControl fullWidth>
                    <AreaList selectedArea={getallRowEdit.area} onSelectArea={handleArea} />
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={4}>
                  <TextField
                    value={getallRowEdit.lgdCode || ''}
                    label="Sub-District LGD"
                    name="lgdCode"
                    placeholder="Enter Sub-District LGD"
                    required
                    variant="outlined"
                    fullWidth
                    onChange={handleInput}
                    onInput={handleInputChangeData}
                    InputProps={{
                      inputProps: {
                        pattern: '^[0-9]*$', // Allow only numbers
                      title: 'Only numbers are allowed',
                        maxLength: 10,
    
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

              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '20px' }}>
                <Button type="submit" variant="contained" color="primary" style={{ marginRight: '10px' }} title="Update" disabled={buttonClicked}>
                  Update
                </Button>
                <Button
                  type="button"
                  variant="contained"
                  color="error" 
                  style={{ marginLeft: '10px' }}
                  title="Back"
                  onClick={() => handleBackButtonClick()} 
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

export default UpdateSubDistrict;
