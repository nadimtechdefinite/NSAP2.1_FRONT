import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import MainCard from 'ui-component/cards/MainCard';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import axiosInstance from 'hooks/useAuthTokenUrl';
import EditIcon from '@mui/icons-material/Edit';
import { Button, FormControl, Grid, Typography, TextField ,Alert, Backdrop, CircularProgress} from '@mui/material';
import AlertSucess from 'components/common/alertSucess';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Paper from '@mui/material/Paper'; // Import Paper component
import { showalertwhenObjectretrnvalidation } from 'components/common/fieldValidationFunctionByjava';
import StateList from 'components/form_components/StateList';

function UpdateAgencyMaster() {
  const [showedit, setShowEdit] = useState(false);

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
      field: 'districtName',
      headerNam: 'district Name',
      flex: 1
    },
    {
      field: 'area',
      headerNam: 'Area',
      flex: 1
    },
    {
      field: 'Sub_DistrictName',
      headerNam: 'Sub-District Name',
      flex: 1
    },
    {
      field: 'agencyCode',
      headerName: 'Agency Code',
      flex: 1
      //   editable: true
    },
    {
      field: 'agencyName',
      headerName: 'Agency Name',
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

  const [showAlert, setShowAlert] = useState(false);
  const [warningAlert, setShowwarningAlert] = useState('');
  const [getAllAgencyMaster, setAgencyMaster] = useState([]);
  const [loading, setLoading] = useState(false);
  const [buttonClicked, setButtonClicked] = useState(false);
  const [stateId, setStateId] = useState('');

  const handleSelectStateid = (state) => {
    setStateId(state);
  };


  const fetchData = async () => {
    setLoading(true);
    const getUrl = `/master-agencyPfms/findAllInMasterAgency/${stateId}`;
    const response = await axiosInstance.get(getUrl);
    if (response.status === 200) {
      const dataWithSerialNumber = response.data.map((item, index) => ({
        ...item,
        Count: index + 1 // Using index as the default row identifier
      }));
      setLoading(false);
      return dataWithSerialNumber;
    } else {
      setLoading(false);
      throw new Error('Agency Master Master : Data coud not be fetched : ', response.status);
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
  const handleClose = () => {
    setShowwarningAlert('');
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
        const postUrl = '/master-agencyPfms/updateAgencyMaster';
        const res = await axiosInstance.post(postUrl, postFormDate);
        console.log('Agency Master Data update : Status Code : ', res.status);
        if (res.status === 202) {
          setShowAlert(true);

          const updatedData = await fetchData();
          // Update the state with the new data
          setAgencyMaster(updatedData);
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
      // ...do nothing
    }
  }

  const rows = getAllAgencyMaster.map((item) => ({
    id: item.id,
    Count: item.Count,
    stateCode: item.stateCode,
    statName: item.statName,
    schemeCode: item.schemeCode,
    districtName: item.districtName,
    districtCode: item.districtCode,
    area: item.area,
    Sub_DistrictName: item.subDistrictMunicipalAreaName,
    subDistrictMunicipalAreaCode: item.subDistrictMunicipalAreaCode,
    agencyCode: item.agencyCode,
    agencyName: item.agencyName
  }));

  const handleBackButtonClick = () => {
    setShowEdit(false);
  };
  useEffect(() => {
    if (stateId) {
    fetchData()
      .then((res) => {
        setAgencyMaster(res);

      
      })
      .catch((e) => {
        console.log(e.message);
      });
    }
  }, [stateId]);
  return (
    <div>
     
      {/* ------------------------------------------------------------------- */}

      {!showedit && (
        <MainCard title="Update Agency Master">
            <Grid container spacing={2} style={{ paddingBottom: '20px' }}>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <StateList onSelectState={handleSelectStateid} />
              </FormControl>
            </Grid>
            {/* <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <DistrictList onSelectState={handleSelectStateid} onSelectDistrict={handleDistid} />
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <AreaList onSelectArea={handleAreaid} />
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <SubDistrictList selectedDistrictId={districtId} selectedAreaId={areaid} onSelectSubDistrict={handleSubDistid} />
              </FormControl>
            </Grid> */}
          </Grid>
          <Paper
            elevation={1} // Set the elevation to give it a shadow
            style={{ backgroundColor: 'lightblue', padding: '16px' }} // Set your desired background color
          >
            <Typography variant="h5" style={{ color: 'black', textAlign: 'center' }}>
              State Name - {rows.length > 0 ? rows[0].statName : ''}
            </Typography>
          </Paper>
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
          </Box>
        </MainCard>
      )}
      {/* ------------------------Edit-------------------------------------------------------- */}

  
      {showAlert && <AlertSucess msg={'Agency'} />}

      {showedit && (
        <MainCard title="Edit Agency Master">
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
                    <TextField fullWidth label="State Name" value={getallRowEdit.statName} aria-readonly />
                  </FormControl>
                </Grid>
                {getallRowEdit.districtName !== '' && (
                  <Grid item xs={12} sm={4}>
                    <FormControl fullWidth>
                      <TextField fullWidth label="District Name" value={getallRowEdit.districtName} aria-readonly />
                    </FormControl>
                  </Grid>
                )}
                {getallRowEdit.area !== '' && (
                  <Grid item xs={12} sm={4}>
                    <FormControl fullWidth>
                      <TextField fullWidth label="Area" value={getallRowEdit.area} aria-readonly />
                    </FormControl>
                  </Grid>
                )}
                {getallRowEdit.subDistrictMunicipalAreaCode !== '' && (
                  <Grid item xs={12} sm={4}>
                    <FormControl fullWidth>
                      <TextField fullWidth label="Sub-District Name" value={getallRowEdit.Sub_DistrictName} aria-readonly />
                    </FormControl>
                  </Grid>
                )}
                <Grid item xs={12} sm={4}>
                  <FormControl fullWidth>
                    <TextField fullWidth label="Scheme Code" value={getallRowEdit.schemeCode} aria-readonly />
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={4}>
                  <TextField
                    value={(getallRowEdit.agencyCode || '').toUpperCase()}
                    label="Agency Code"
                    name="agencyCode"
                    placeholder="Enter Agency Code"
                    required
                    variant="outlined"
                    fullWidth
                    onChange={handleInput}
                    inputProps={{
                      maxLength: 15,
                      // pattern: '[a-zA-Z0-9]*' // This allows only alphanumeric characters
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    value={(getallRowEdit.agencyName || '').toUpperCase()}
                    label="Agency Name"
                    name="agencyName"
                    placeholder="Enter Agency Name"
                    required
                    variant="outlined"
                    fullWidth
                    onChange={handleInput}
                    inputProps={{
                      maxLength: 15,
                      // pattern: '[a-zA-Z0-9]*' // This allows only alphanumeric characters
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

export default UpdateAgencyMaster;
