import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import MainCard from 'ui-component/cards/MainCard';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import axiosInstance from 'hooks/useAuthTokenUrl';
import EditIcon from '@mui/icons-material/Edit';
import { Paper, Button, FormControl, Grid, Typography, TextField, InputAdornment, Alert, Backdrop, CircularProgress } from '@mui/material';
import AlertSucess from 'components/common/alertSucess';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AreaList from 'components/form_components/AreaList';
import DistrictList from 'components/form_components/DistrictList';
import SubDistrictList from 'components/form_components/SubDistrictList';
//import GramPanchayatList from 'components/form_components/GramPanchayatList';
import StateList from 'components/form_components/StateList';
//import VillageList from 'components/form_components/VillageList';
import { showalertwhenObjectretrnvalidation } from 'components/common/fieldValidationFunctionByjava';

function UpdateHabitation() {
  const [showedit, setShowEdit] = useState(false);

  const columns = [
    {
      field: 'Count',
      headerName: 'S. No.',
      flex: 0.5
    },
    {
      field: 'id',
      headerName: 'Habitation Code',
      flex: 1.5
    },
    {
      field: 'districtName',
      headerName: 'District Name',
      flex: 1
    },
    {
      field: 'ruralUrbanArea',
      headerName: 'Area',
      flex: 1
    },
    {
      field: 'subDistrictMunicipalAreaName',
      headerName: 'Sub-District',
      flex: 1
    },
    {
      field: 'gramPanchayatWardName',
      headerName: 'GramPanchayat',
      flex: 1
    },
    {
      field: 'villageName',
      headerName: 'Village Name',
      flex: 1
    },
    {
      field: 'habitationName',
      headerName: 'Habitation Name',
      flex: 1
    },
    {
      field: 'habitationShortName',
      headerName: 'Habitation Short Name',
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

  const [getAllState, setAllState] = useState([]);
  const [stateId, setStateId] = useState('');
  const [districtId, setdistrictId] = useState('');
  const [areaid, setareaid] = useState('');
  const [subdist, setsubdist] = useState('');
  const [loading, setLoading] = useState(false);
  const [buttonClicked, setButtonClicked] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    const getUrl = `/master-management/findAllHabitationMaster/${stateId}/${districtId}/${subdist}`;
    const response = await axiosInstance.get(getUrl);
    console.log('check habitation', JSON.stringify(response.data));
    if (response.status >= 200 && response.status < 300) {
      const dataWithSerialNumber = response.data.map((item, index) => ({
        ...item,
        Count: index + 1 // Using index as the default row identifier
      }));
      setLoading(false);
      return dataWithSerialNumber;
    } else {
      throw new Error('Data coud not be fetched!', response.status);
    }
  };

  // --------------------------------------------------------------------
  const [getallRowEdit, setallRowEdit] = useState({});
  const [warningAlert, setShowwarningAlert] = useState('');
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

  const handleArea = (area) => {
    setallRowEdit((prevRowEdit) => ({
      ...prevRowEdit,
      ruralUrbanArea: area
    }));
  };
  // const handleDist = (dist) => {
  //   setallRowEdit((prevRowEdit) => ({
  //     ...prevRowEdit,
  //     districtId: dist
  //   }));
  // };
  async function postData(e) {
    e.preventDefault();
    event.target.reset();
    setLoading(true);
    setButtonClicked(true);

    const postFormDate = JSON.stringify(getallRowEdit);
    console.log('kuch vlikh', postFormDate);
    var result = window.confirm('Are you sure want to Update the record? ');
    if (result) {
      try {
        const postUrl = '/master-management/saveUpdatedHabitationMaster';
        const res = await axiosInstance.put(postUrl, postFormDate);
        console.log(postFormDate);
        console.log('Sub-District Master Data update : Status Code : ', res.status);
        if (res.status === 202) {
          setShowAlert(true);

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

  const rows = getAllState.map((item) => ({
    habitationId: item.habitationId,
    subDistrictMunicipalAreaId: item.subDistrictMunicipalAreaId,
    Count: item.Count,
    ruralUrbanArea: item.ruralUrbanArea,
    habitationShortName: item.habitationShortName,
    habitationName: item.habitationName,
    villageId: item.villageId,
    villageName: item.villageName,
    districtName: item ? item.districtName : '',
    stateName: item ? item.stateName : '',
    subDistrictMunicipalAreaName: item ? item.subDistrictName : '',
    stateId: item.stateId,
    gramPanchayatWardName: item.gramPanchayatWardName,
    gramPanchayatWardId: item.gramPanchayatWardId,
    districtId: item.districtId
  }));

  const handleBackButtonClick = () => {
    setShowEdit(false);
  };

  // const handleSubDist = (subdist) => {
  //   setallRowEdit((prevRowEdit) => ({
  //     ...prevRowEdit,
  //     subDistrictMunicipalAreaId: subdist
  //   }));
  // };

  // const handleGrampanchayat = (gp) => {
  //   setallRowEdit((prevRowEdit) => ({
  //     ...prevRowEdit,
  //     gramPanchayatWardId: gp
  //   }));
  // };
  // const handleVillage = (vill) => {
  //   setallRowEdit((prevRowEdit) => ({
  //     ...prevRowEdit,
  //     villageId: vill
  //   }));
  // };
  const handleSelectStateid = (state) => {
    setStateId(state);
  };

  const handleDistid = (dist) => {
    setdistrictId(dist);
  };

  const handleAreaid = (area) => {
    setareaid(area);
  };
  const handleSubDistid = (sd) => {
    setsubdist(sd);
  };

  useEffect(() => {
    if (subdist) {
      fetchData()
        .then((res) => {
          setAllState(res);
        })
        .catch((e) => {
          console.log(e.message);
        });
    }
  }, [subdist]);
  const handleClose = () => {
    setShowwarningAlert('');
  };
  return (
    <div>
      {/* ------------------------------------------------------------------- */}

      {!showedit && (
        <MainCard title="Update Habitation Master">
          <Grid container spacing={2} style={{ paddingBottom: '20px' }}>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <StateList onSelectState={handleSelectStateid} />
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <DistrictList selectedStateId={stateId} onSelectDistrict={handleDistid} isMandatory={true} />
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
            </Paper>
          )}

          {rows.length !== 0 && (
            <Box sx={{ height: 700, width: '100%' }}>
              <DataGrid
                getRowId={(row) => row.habitationId}
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
          )}
        </MainCard>
      )}
      {/* ------------------------Edit-------------------------------------------------------- */}

      {showAlert && <AlertSucess msg={'Habitation'} setShowAlert={setShowAlert} />}

      {showedit && (
        <MainCard title="Edit Habitation Master">
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
                    <TextField fullWidth label="Habitation Code" value={getallRowEdit.habitationId} aria-readonly />
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    label="District Name"
                    value={getallRowEdit.districtName || ''}
                    variant="outlined"
                    fullWidth
                    InputProps={{
                      readOnly: true
                    }}
                  />
                  <input type="hidden" name="districtId" value={getallRowEdit.districtId || ''} />
                  {/* <input type="hidden" name="stateId" value={getallRowEdit.stateId || ''} /> */}
                  <input type="hidden" name="stateId" value={getallRowEdit.habitationId || ''} />
                </Grid>
                {/* <Grid item xs={12} sm={4}>
                  <FormControl fullWidth>
                    <DistrictList
                      selectedStateId={getallRowEdit.stateCode}
                      onSelectDistrict={handleDist}
                      defaultSelectedDistrict={getallRowEdit.districtId}
                      isMandatory={true}
                    />
                  </FormControl>
                </Grid> */}
                <Grid item xs={12} sm={4}>
                  <FormControl fullWidth>
                    <AreaList selectedArea={getallRowEdit.ruralUrbanArea} onSelectArea={handleArea} isMandatory={true} />
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    label="Subdistrict Name"
                    value={getallRowEdit.subDistrictMunicipalAreaName || ''}
                    variant="outlined"
                    fullWidth
                    InputProps={{
                      readOnly: true
                    }}
                  />
                  <input type="hidden" name="subDistrictId" value={getallRowEdit.subDistrictMunicipalAreaId || ''} />
                </Grid>
                {/* <Grid item xs={12} sm={4}>
                  <FormControl fullWidth>
                    <SubDistrictList
                      selectedDistrictId={getallRowEdit.districtId}
                      selectedAreaId={getallRowEdit.ruralUrbanArea}
                      onSelectSubDistrict={handleSubDist}
                      defaultSelectedSubDistrict={getallRowEdit.subDistrictMunicipalAreaId}
                      isMandatory={true}
                    />
                  </FormControl>
                </Grid>
                */}
                <Grid item xs={12} sm={4}>
                  <TextField
                    label="Grampanchayat Name"
                    value={getallRowEdit.gramPanchayatWardName || ''}
                    variant="outlined"
                    fullWidth
                    InputProps={{
                      readOnly: true
                    }}
                  />
                  <input type="hidden" name="GramPanchayatId" value={getallRowEdit.gramPanchayatWardId || ''} />
                </Grid>
                {/* <Grid item xs={12} sm={4}>
                  <FormControl fullWidth>
                    <GramPanchayatList
                      selectedSubDistrictMunicipalAreaId={getallRowEdit.subDistrictMunicipalAreaId}
                      onSelectGramPanchayat={handleGrampanchayat}
                      defaultSelectGramPanchayatWardId={getallRowEdit.gramPanchayatWardId}
                      isMandatory={true}
                    />
                  </FormControl>
                </Grid> */}

                <Grid item xs={12} sm={4}>
                  <TextField
                    label="Grampanchayat Name"
                    value={getallRowEdit.gramPanchayatWardName || ''}
                    variant="outlined"
                    fullWidth
                    InputProps={{
                      readOnly: true
                    }}
                  />
                  <input type="hidden" name="GramPanchayatId" value={getallRowEdit.gramPanchayatWardId || ''} />
                </Grid>

                <Grid item xs={12} sm={4}>
                  <TextField
                    label="Village Name"
                    value={getallRowEdit.villageName || ''}
                    variant="outlined"
                    fullWidth
                    InputProps={{
                      readOnly: true
                    }}
                  />
                  <input type="hidden" name="villageId" value={getallRowEdit.villageId || ''} />
                </Grid>
                {/* <Grid item xs={12} sm={4}>
                  <FormControl fullWidth>
                    <VillageList
                      selectedGramPanchayatId={getallRowEdit.gramPanchayatWardId}
                      onSelectVillage={handleVillage}
                      defaultSelectVillageId={getallRowEdit.villageId}
                      isMandatory={true}
                    />
                  </FormControl>
                </Grid> */}
                <Grid item xs={12} sm={4}>
                  <TextField
                    value={(getallRowEdit.habitationName || '').toUpperCase()}
                    label="Habitation Name"
                    name="habitationName"
                    placeholder="Enter Habitation Name"
                    required
                    variant="outlined"
                    fullWidth
                    onChange={handleInput}
                    InputProps={{
                      inputProps: {
                        pattern: '^[A-Za-z\\d\\s]*$',
                        title: 'Only characters and numbers are allowed',
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
                    value={(getallRowEdit.habitationShortName || '').toUpperCase()}
                    label="Habitation Short Name"
                    name="habitationShortName"
                    placeholder="Enter Habitation Short Name"
                    required
                    variant="outlined"
                    fullWidth
                    onChange={handleInput}
                    InputProps={{
                      inputProps: {
                        pattern: '^[A-Za-z\\d\\s]*$',
                        title: 'Only characters and numbers are allowed',
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

              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '20px' }}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  style={{ marginRight: '10px' }}
                  title="Update"
                  disabled={buttonClicked}
                >
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

export default UpdateHabitation;
