import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import MainCard from 'ui-component/cards/MainCard';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import axiosInstance from 'hooks/useAuthTokenUrl';
import EditIcon from '@mui/icons-material/Edit';
import {
  Button,
  FormControl,
  Grid,
  Typography,
  TextField,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment ,Alert,
  Backdrop,
  CircularProgress
} from '@mui/material';
import AlertSucess from 'components/common/alertSucess';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import MandatoryFields from 'components/common/MandatoryFields';
import StateList from 'components/form_components/StateList';
import SchemeList from 'components/form_components/SchemeList';
import Duplicate from 'components/common/Duplicate';
import { showalertwhenObjectretrnvalidation } from 'components/common/fieldValidationFunctionByjava';

function PensionAmountMasterUpdate() {
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
      field: 'centralContribution',
      headerName: 'Central Contribution',
      flex: 1
    },
    {
      field: 'centerRangeValue',
      headerName: 'Central Age range',
      flex: 1
    },

    {
      field: 'stateContribution',
      headerName: 'State Contribution',
      flex: 1
    },
    {
      field: 'stateRangeValue',
      headerName: 'State Age range',
      flex: 1
    },
    {
      field: 'fromDate',
      headerName: 'From Date',
      flex: 1
    },
    {
      field: 'toDate',
      headerName: 'To Date',
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
  const [stateId, setStateId] = useState('');
  const [schemeCode, setschemeCode] = useState('');
  const [years, setYears] = useState([]);
  const [months, setmonths] = useState([]);
  
  const fetchData = async () => {
    setLoading(true);
    setShowwarningAlert(false);
    const getUrl = `/master-management/findAllPensionerAmount/${stateId}/${schemeCode}`;
    const response = await axiosInstance.get(getUrl);
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

  const handleSelectFromYear = (evt) => {
    const year = evt.target.value;
    setallRowEdit((prevRowEdit) => ({
      ...prevRowEdit,
      fromYear: year
    }));
  };

  const handleeditScheme = (scheme) => {
    setallRowEdit((prevRowEdit) => ({
      ...prevRowEdit,
      schemeCode: scheme
    }));
  };

  const handleSelectScheme = (scheme) => {
    setschemeCode(scheme);
  };
  async function postData(e) {
    e.preventDefault();
    event.target.reset();
    setLoading(true);
    setButtonClicked(true);
    setShowwarningAlert(false);
    const postFormDate = JSON.stringify(getallRowEdit);
    var result = window.confirm('Are you sure want to Update the record? ');
    if (result) {
      const mandatoryFields = [];
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
        const postUrl = '/master-management/updateAmountMaster';
        const res = await axiosInstance.put(postUrl, postFormDate);
        console.log('Pension Amount Master Master Data update : Status Code : ', res.status);
        const msg = res.data.msg;
        if (res.status === 201) {
          if (msg === 'duplicate') {
            setShowAlertDup(true);
          } else {
            setShowAlert(true);
          }
          setLoading(false);
          setButtonClicked(false);
          // Automatically hide the alert after 5 seconds
          const timeoutId = setTimeout(() => {
            setShowAlert(false);
            setShowAlertDup(false);
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
  function transformDate(dateString) {
    const dateParts = dateString.split(' ');
    const formattedDate = dateParts[0].split('-').reverse().join('-');
    return formattedDate;
  }
  const rows = getAllState.map((item) => ({
    Count: item.Count,
    pensionAmountId: item.pensionAmountId,
    centralAgeRange: item.centralAgeRange,
    stateId: item.stateId,
    centralContribution: item.centralContribution,
    schemeCode: item.schemeCode,
    stateContribution: item.stateContribution,
    stateAgeRange: item.stateAgeRange,
    centerRangeValue: item.centerRangeValue,
    stateRangeValue: item.stateRangeValue,
    fromDate: transformDate(item.fromDate),
    toDate: transformDate(item.toDate),
    fromMonth: NUM_NAME_MONTH(transformDate(item.fromDate)),
    fromYear: FIND_YEAR(transformDate(item.fromDate)),
    toMonth: NUM_NAME_MONTH(transformDate(item.toDate)),
    toYear: FIND_YEAR(transformDate(item.toDate))
  }));

  function NUM_NAME_MONTH(dateString) {
    const dateParts = dateString.split('-');
    const formattedDate = new Date(`${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`);

    const monthAbbreviation = formattedDate.toLocaleString('default', { month: 'short' }).toUpperCase();
    return monthAbbreviation;
  }

  function FIND_YEAR(dateString) {
    const dateParts = dateString.split('-');
    const formattedDate = new Date(`${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`);
    const yearFull = formattedDate.toLocaleString('default', { year: 'numeric' });
    return yearFull;
  }

  const handleBackButtonClick = () => {
    setShowEdit(false);
  };
  const handleInputtoYear = (evt) => {
    const year = evt.target.value;
    setallRowEdit((prevRowEdit) => ({
      ...prevRowEdit,
      toYear: year
    }));
  };

  const handleInputFromMonth = (evt) => {
    const month = evt.target.value;
    setallRowEdit((prevRowEdit) => ({
      ...prevRowEdit,
      fromMonth: month
    }));
  };
  const handleInputToMonth = (evt) => {
    const month = evt.target.value;
    setallRowEdit((prevRowEdit) => ({
      ...prevRowEdit,
      toMonth: month
    }));
  };

  const handleSelectState = (state) => {
    setallRowEdit((prevRowEdit) => ({
      ...prevRowEdit,
      stateId: state
    }));
  };
  const handleSelectStateid = (state) => {
    setStateId(state);
  };

  useEffect(() => {
   

    if (schemeCode) {
      const currentYear = new Date().getFullYear();
      const previousYears = Array.from({ length: 5 }, (_, index) => currentYear - index - 1).reverse();
      const nextYears = Array.from({ length: 5 }, (_, index) => currentYear + index + 1);

      const allYears = [...previousYears, currentYear, ...nextYears];

      setYears(allYears);

      const abbreviatedMonths = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
      setmonths(abbreviatedMonths);

      setAllState([]);
      fetchData()
        .then((res) => {
          setAllState(res);
        })
        .catch((e) => {
          console.log(e.message);
        });
    }
  }, [schemeCode, getallRowEdit.schemeCode]);

  const handleClose = () => {
    setShowwarningAlert('');
  };
  return (
    <div>
      
      {/* ------------------------------------------------------------------- */}
     
      {!showedit && (
        <MainCard title="Update Pension Amount Master Master">
          <Grid container spacing={2} style={{ paddingBottom: '20px' }}>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <Typography variant="h6" color="error">
                  *
                </Typography>
                <StateList onSelectState={handleSelectStateid} />
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <Typography variant="h6" color="error">
                  *
                </Typography>
                <SchemeList onSelectScheme={handleSelectScheme} isMandatory={true}/>
              </FormControl>
            </Grid>
          </Grid>

          {rows.length !== 0 && (
            <Box sx={{ height: 700, width: '100%' }}>
              <DataGrid
                getRowId={(row) => row.pensionAmountId}
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

      {showAlert && <AlertSucess msg={'Pension Amount Master'} setShowAlert={setShowAlert} />}
      {showValidationPopup && <MandatoryFields />}
      {showAlertDup && <Duplicate />}
      {showedit && (
        <MainCard title="Edit Pension Amount Master Master">
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
                    <StateList onSelectState={handleSelectState} defaultSelectedState={getallRowEdit.stateId} />
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <FormControl fullWidth>
                    <SchemeList onSelectScheme={handleeditScheme} defaultSelectedScheme={getallRowEdit.schemeCode} />
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={4}>
                  <TextField
                    labelId="Central Contribution"
                    id="centralContribution"
                    label="Central Contribution"
                    name="centralContribution"
                    value={getallRowEdit.centralContribution}
                    variant="outlined"
                    fullWidth
                    onChange={handleInput}
                    required
                    InputProps={{
                      inputProps: {
                        pattern: '^[0-9]*$',
                        title: 'Only Number are allowed',
                        maxLength: 70
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
                    <TextField fullWidth label=" Central Age range" value={getallRowEdit.centerRangeValue} aria-readonly />
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    labelId="State Contribution"
                    id="stateContribution"
                    label="State Contribution"
                    name="stateContribution"
                    value={getallRowEdit.stateContribution}
                    variant="outlined"
                    fullWidth
                    onChange={handleInput}
                    required
                    InputProps={{
                      inputProps: {
                        pattern: '^[0-9]*$',
                        title: 'Only Number are allowed',
                        maxLength: 70
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
                    <TextField fullWidth label=" State Age range" value={getallRowEdit.stateRangeValue} aria-readonly />
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={4}>
                  <FormControl fullWidth>
                    <InputLabel id="From Year-label">
                      From Year
                      <Typography variant="h6" color="error">
                        *
                      </Typography>
                    </InputLabel>
                    <Select
                      labelId="From Year"
                      id="fromYear"
                      label="From Year"
                      name="fromYear"
                      value={getallRowEdit.fromYear}
                      onChange={handleSelectFromYear}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <Typography variant="h3" color="error">
                              *
                            </Typography>
                          </InputAdornment>
                        )
                      }}
                    >
                      {years.map((item) => (
                        <MenuItem key={item} value={item}>
                          {item}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <FormControl fullWidth>
                    <InputLabel id="To Year-label">
                      To Year
                      <Typography variant="h6" color="error">
                        *
                      </Typography>
                    </InputLabel>
                    <Select
                      labelId="To Year"
                      id="toYear"
                      label="To Year"
                      name="toYear"
                      value={getallRowEdit.toYear}
                      onChange={handleInputtoYear}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <Typography variant="h3" color="error">
                              *
                            </Typography>
                          </InputAdornment>
                        )
                      }}
                    >
                      {years.map((item) => (
                        <MenuItem key={item} value={item}>
                          {item}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <FormControl fullWidth>
                    <InputLabel id="From Month-label">
                      From Month
                      <Typography variant="h6" color="error">
                        *
                      </Typography>
                    </InputLabel>
                    <Select
                      labelId="From Month"
                      id="fromMonth"
                      label="From Month"
                      name="fromMonth"
                      value={getallRowEdit.fromMonth}
                      onChange={handleInputFromMonth}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <Typography variant="h3" color="error">
                              *
                            </Typography>
                          </InputAdornment>
                        )
                      }}
                    >
                      {months.map((item) => (
                        <MenuItem key={item} value={item}>
                          {item}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <FormControl fullWidth>
                    <InputLabel id="To Month-label">
                      To Month
                      <Typography variant="h6" color="error">
                        *
                      </Typography>
                    </InputLabel>
                    <Select
                      labelId="From Month"
                      id="toMonth"
                      label="To Month"
                      name="toMonth"
                      value={getallRowEdit.toMonth}
                      onChange={handleInputToMonth}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <Typography variant="h3" color="error">
                              *
                            </Typography>
                          </InputAdornment>
                        )
                      }}
                    >
                      {months.map((item) => (
                        <MenuItem key={item} value={item}>
                          {item}
                        </MenuItem>
                      ))}
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
         
        </MainCard>
      )}
       <Backdrop open={loading} style={{ zIndex: 999, color: '#fff' }}>
          <CircularProgress color="inherit" />
        </Backdrop>
    </div>
  );
}

export default PensionAmountMasterUpdate;
