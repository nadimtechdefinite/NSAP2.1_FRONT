import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import MainCard from 'ui-component/cards/MainCard';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import axiosInstance from 'hooks/useAuthTokenUrl';
import EditIcon from '@mui/icons-material/Edit';
import { Button, FormControl, Grid,  Typography, TextField ,InputAdornment ,Alert, Backdrop, CircularProgress} from '@mui/material';
import AlertSucess from 'components/common/alertSucess';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import BankTypeList from 'components/form_components/BankTypeList';
import MandatoryFields from 'components/common/MandatoryFields';
import Duplicate from 'components/common/Duplicate';
import { showalertwhenObjectretrnvalidation } from 'components/common/fieldValidationFunctionByjava';

function BankUpdate() {
  const [showedit, setShowEdit] = useState(false);

  const columns = [
    {
      field: 'Count',
      headerNam: 'S. No.',
      flex: 1
    },
    {
      field: 'bankCode',
      headerName: 'Bank Code',
      flex: 1
    },
    {
      field: 'bankTypeDesc',
      headerName: 'Bank Type',
      flex: 1
    },
    {
      field: 'bankName',
      headerName: 'Bank Name',
      flex: 1
    },
    {
      field: 'bankShortName',
      headerName: 'Bank Short Name',
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
  const [showValidationPopup, setShowValidationPopup] = useState(false);
  const [showAlertDup, setShowAlertDup] = useState(false);
  const [warningAlert, setShowwarningAlert] = useState('');
  const [loading, setLoading] = useState(false);
  const [buttonClicked, setButtonClicked] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    const getUrl = '/master-management/findAllBankMaster';
    const response = await axiosInstance.get(getUrl);
    if (response.status >= 200 && response.status < 300) {
      const dataWithSerialNumber = response.data.map((item, index) => ({
        ...item,
        Count: index + 1 // Using index as the default row identifier
      }));
      setLoading(false);
      return dataWithSerialNumber;
    } else {
      setLoading(false);
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

  const handleDist = (dist) => {
    setallRowEdit((prevRowEdit) => ({
      ...prevRowEdit,
      bankType: dist
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
      const mandatoryFields = ['bankType', 'bankCode', 'bankName', 'bankShortName'];

      const isFormValid = mandatoryFields.every((field) => getallRowEdit[field]);

    if (!isFormValid) {
      setShowValidationPopup(true);
      // Hide the popup after 3 seconds (adjust the timing as needed)
      setTimeout(() => {
        setShowValidationPopup(false);
      }, 3000);
      return;
    }
      try {
        const postUrl = '/master-management/updateBankMaster';
        const res = await axiosInstance.put(postUrl, postFormDate);
        console.log('Bank Master Data update : Status Code : ', res.status);
        const msg = res.data.msg;
        if (res.status === 201) {
         
          if (msg === 'duplicate') {
            setShowAlertDup(true);
            
          } else {
            setShowAlert(true);
           
          }
          const updatedData = await fetchData();
          // Update the Bank with the new data
          setAllState(updatedData);
          setLoading(false);
          setButtonClicked(false);
          // Automatically hide the alert after 5 seconds
          const timeoutId = setTimeout(() => {
            setShowAlertDup(false);
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
    id: item.id,
    bankCode: item.bankCode,
    Count: item.Count,
    bankType: item.bankType,
    bankName: item.bankName,
    bankShortName: item.bankShortName,
    bankTypeDesc: item.bankTypeDesc
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
        <MainCard title="Update Bank Master">
           {warningAlert && (
          <Alert variant="filled" severity="warning" onClose={handleClose}>
            {warningAlert}
          </Alert>
        )}
           {showValidationPopup && <MandatoryFields />}
          <Box sx={{ height: 700, width: '100%' }}>
            <DataGrid
              getRowId={(row) => row.bankCode}
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

      {showAlert && <AlertSucess msg={'Bank'} setShowAlert={setShowAlert} />}
      {showAlertDup && <Duplicate />}
      {showedit && (
        <MainCard title="Edit Bank Master">
          <Box sx={{ height: 400, width: '100%' }}>
            <form method="post" onSubmit={postData}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                  <FormControl fullWidth>
                    <TextField fullWidth label="Bank Code" value={getallRowEdit.bankCode} aria-readonly />
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <FormControl fullWidth>
                    <BankTypeList onSelectbankType={handleDist} defaultSelectedBankType={getallRowEdit.bankType}/>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    value={(getallRowEdit.bankName || '').toUpperCase()}
                    label="Bank Name"
                    name="bankName"
                    placeholder="Enter Bank Name"
                    required
                    variant="outlined"
                    fullWidth
                    onChange={handleInput}
                    InputProps={{
                      inputProps: {
                        pattern: '^[A-Za-z\\s]*$',
                        title: 'Only characters are allowed',
                        maxLength: 70,
    
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
                    value={(getallRowEdit.bankShortName || '').toUpperCase()}
                    label="Bank Short Name"
                    name="bankShortName"
                    placeholder="Enter Bank Short Name"
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

export default BankUpdate;
