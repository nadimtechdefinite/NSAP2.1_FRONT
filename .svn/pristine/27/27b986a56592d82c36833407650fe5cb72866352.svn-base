import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import MainCard from 'ui-component/cards/MainCard';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import axiosInstance from 'hooks/useAuthTokenUrl';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import EditIcon from '@mui/icons-material/Edit';
import {
  Button,
  FormControl,
  Grid,
  Breadcrumbs,
  Link,
  Typography,
  TextField,
  Alert,
  Backdrop,
  CircularProgress,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment
} from '@mui/material';
import AlertSucess from 'components/common/alertSucess';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { showalertwhenObjectretrnvalidation } from 'components/common/fieldValidationFunctionByjava';

function UpdateScheme() {
  const [showedit, setShowEdit] = useState(false);

  const columns = [
    {
      field: 'Count',
      headerNam: 'S. No.',
      flex: 1
    },
    {
      field: 'schemeCode',
      headerName: 'Scheme Code',
      flex: 1
    },
    {
      field: 'schemeName',
      headerName: 'Scheme Name',
      flex: 1
    },
    {
      field: 'schemeShortName',
      headerName: 'Scheme Short Name',
      flex: 1
    },
    {
      field: 'schemeDescription',
      headerName: 'Scheme Description',
      flex: 1
    },
    {
      field: 'schemeType',
      headerName: 'Scheme Type',
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
  const [warningAlert, setShowwarningAlert] = useState('');
  const [loading, setLoading] = useState(false);
  const [buttonClicked, setButtonClicked] = useState(false);
  const [schemeType, setSchemeType] = useState('');

  const fetchData = async () => {
    const getUrl = '/master-management/findAllScheme';
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

    getallRowEdit.schemeType = schemeType;
    // setSchemeType(getallRowEdit.schemeType);
    // alert(schemeType);
    const postFormDate = JSON.stringify(getallRowEdit);
    var result = window.confirm('Are you sure want to Update the record? ');
    if (result) {
      try {
        const postUrl = '/master-management/saveSchemeMaster';
        const res = await axiosInstance.post(postUrl, postFormDate);
        console.log('Scheme Master Data update : Status Code : ', res.status);
        if (res.status === 201) {
          setShowAlert(true);

          const updatedData = await fetchData();
          // Update the Scheme with the new data
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
      // ...do nothing
    }
  }

  const rows = getAllState.map((item) => ({
    schemeCode: item.schemeCode,
    Count: item.Count,
    schemeName: item.schemeName,
    schemeShortName: item.schemeShortName,
    schemeDescription: item.schemeDescription,
    schemeType: item.schemeType
  }));

  const handleBackButtonClick = () => {
    setShowEdit(false);
  };
  useEffect(() => {
    fetchData()
      .then((res) => {
        setAllState(res);
      })
      .catch((e) => {
        console.log(e.message);
      });
  }, []);
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
          Scheme Master
        </Link>
        <Typography color="textInfo" title="List Of States">
          Update Scheme
        </Typography>
      </Breadcrumbs>
      {/* ------------------------------------------------------------------- */}

      {!showedit && (
        <MainCard title="Update Scheme Master">
          {/* <Paper
            elevation={1} // Set the elevation to give it a shadow
            style={{ backgroundColor: 'lightblue', padding: '16px' }} // Set your desired background color
          >
            <Typography variant="h5" style={{ color: 'black', textAlign: 'center' }}>
              Scheme Name - {rows.length > 0 ? rows[0].schemeName : ''}
            </Typography>
          </Paper> */}
          <Box sx={{ height: 700, width: '100%' }}>
            <DataGrid
              getRowId={(row) => row.schemeCode}
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

      {showAlert && <AlertSucess msg={'Scheme'} />}

      {showedit && (
        <MainCard title="Edit Scheme Master">
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
                    <TextField fullWidth label="Scheme Code" value={getallRowEdit.schemeCode} aria-readonly />
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={4}>
                  <TextField
                    value={(getallRowEdit.schemeName || '').toUpperCase()}
                    label="Scheme Name"
                    name="schemeName"
                    placeholder="Enter Scheme Name"
                    required
                    variant="outlined"
                    fullWidth
                    onChange={handleInput}
                    InputProps={{
                      inputProps: {
                        pattern: '^[A-Za-z\\s]*$',
                        title: 'Only characters are allowed',
                        maxLength: 50
                      }
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={4}>
                  <TextField
                    value={(getallRowEdit.schemeShortName || '').toUpperCase()}
                    label="Scheme Short Name"
                    name="schemeShortName"
                    placeholder="Enter Scheme Short Name"
                    required
                    variant="outlined"
                    fullWidth
                    onChange={handleInput}
                    InputProps={{
                      inputProps: {
                        pattern: '^[A-Za-z\\s]*$',
                        title: 'Only characters are allowed',
                        maxLength: 50
                      }
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={4}>
                  <TextField
                    value={(getallRowEdit.schemeDescription || '').toUpperCase()}
                    label="Scheme Description"
                    name="schemeDescription"
                    placeholder="Enter Scheme Description"
                    required
                    variant="outlined"
                    fullWidth
                    onChange={handleInput}
                    InputProps={{
                      inputProps: {
                        pattern: '^[A-Za-z0-9\\s\\(\\)]*$',
                        title: 'Only characters, numbers, and brackets are allowed',
                        maxLength: 50
                      }
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <FormControl fullWidth>
                    <InputLabel style={{ color: 'black' }}>Scheme Type</InputLabel>
                    <Select value={schemeType} name="schemeType" onChange={(e) => setSchemeType(e.target.value)} required InputProps={{
                   endAdornment: (
                    <InputAdornment position="end">
                      <Typography variant="h3" color="error">
                        *
                      </Typography>
                    </InputAdornment>
                  )
                }}>
                      {/* <MenuItem value="ALL">ALL</MenuItem> */}
                      <MenuItem key={'CENTER'} value="CENTER">
                        CENTER
                      </MenuItem>
                      <MenuItem key={'STATE'} value="STATE">
                        STATE
                      </MenuItem>
                    </Select>
                  </FormControl>
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

export default UpdateScheme;
