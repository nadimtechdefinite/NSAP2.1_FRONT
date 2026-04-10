import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import MainCard from 'ui-component/cards/MainCard';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import axiosInstance from 'hooks/useAuthTokenUrl';
import EditIcon from '@mui/icons-material/Edit';
import { Button, FormControl, Grid, Typography, TextField ,InputAdornment, Alert} from '@mui/material';
import AlertSucess from 'components/common/alertSucess';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { showalertwhenObjectretrnvalidation } from 'components/common/fieldValidationFunctionByjava';

function DisbursementUpdate() {
  const [showedit, setShowEdit] = useState(false);

  const columns = [
    {
      field: 'Count',
      headerNam: 'S. No.',
      flex: 1
    },
    {
      field: 'disbursementCode',
      headerName: 'Disbursement Code',
      flex: 1
    },
    {
      field: 'disbursementName',
      headerName: 'Disbursement Name',
      flex: 1
    },
    {
      field: 'disbursementShortName',
      headerName: 'Disbursement Short Name',
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

  const fetchData = async () => {
    const getUrl = '/master-management/findAllDisbursement';
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
    const postFormDate = JSON.stringify(getallRowEdit);
    var result = window.confirm('Are you sure want to Update the record? ');
    if (result) {
      try {
        const postUrl = '/master-management/saveDisbursement';
        const res = await axiosInstance.post(postUrl, postFormDate);
        console.log('Disbursement Master Data update : Status Code : ', res.status);
        if (res.status === 201) {
          setShowAlert(true);

          const updatedData = await fetchData();
          // Update the Disbursement with the new data
          setAllState(updatedData);

          // Automatically hide the alert after 5 seconds
          const timeoutId = setTimeout(() => {
            setShowAlert(false);
          }, 5000);

          // Clear the timeout when the component is unmounted or when showAlert changes
          return () => clearTimeout(timeoutId);
        }

        //navigate("/masters/criteria/update");
      } catch (error) {
        setShowwarningAlert(showalertwhenObjectretrnvalidation(error));
        console.error('Error updating data:', error);
        // setSnackbar({ children: 'Record failed in update!', severity: 'error' });
      }
    } else {
      // ...do nothing
    }
  }

  const rows = getAllState.map((item) => ({
    disbursementCode: item.disbursementCode,
    Count: item.Count,
    disbursementName: item.disbursementName,
    disbursementShortName: item.disbursementShortName,
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
      
      {/* ------------------------------------------------------------------- */}

      {!showedit && (
        <MainCard title="Update Disbursement Master">
          {/* <Paper
            elevation={1} // Set the elevation to give it a shadow
            style={{ backgroundColor: 'lightblue', padding: '16px' }} // Set your desired background color
          >
            <Typography variant="h5" style={{ color: 'black', textAlign: 'center' }}>
              Disbursement Name - {rows.length > 0 ? rows[0].disbursementName : ''}
            </Typography>
          </Paper> */}
          <Box sx={{ height: 700, width: '100%' }}>
            <DataGrid
              getRowId={(row) => row.disbursementCode}
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

      {showAlert && <AlertSucess msg={'Disbursement'} setShowAlert={setShowAlert}/>}

      {showedit && (
        <MainCard title="Edit Disbursement Master">
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
                    <TextField fullWidth label="Disbursement Code" value={getallRowEdit.disbursementCode} aria-readonly />
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={4}>
                  <TextField
                    value={(getallRowEdit.disbursementName || '').toUpperCase()}
                    label="Disbursement Name"
                    name="disbursementName"
                    placeholder="Enter Disbursement Name"
                    required
                    variant="outlined"
                    fullWidth
                    onChange={handleInput}
                    InputProps={{
                      inputProps: {
                        pattern: '^[A-Za-z\\s]*$',
                        title: 'Only characters are allowed',
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
                    value={(getallRowEdit.disbursementShortName || '').toUpperCase()}
                    label="Disbursement Short Name"
                    name="disbursementShortName"
                    placeholder="Enter Disbursement Short Name"
                    required
                    variant="outlined"
                    fullWidth
                    onChange={handleInput}
                    InputProps={{
                      inputProps: {
                        pattern: '^[A-Za-z\\s]*$',
                        title: 'Only characters are allowed',
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

              </Grid>

              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '20px' }}>
                <Button type="submit" variant="contained" color="primary" style={{ marginRight: '10px' }} title="Update">
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
        </MainCard>
      )}
    </div>
  );
}

export default DisbursementUpdate;
