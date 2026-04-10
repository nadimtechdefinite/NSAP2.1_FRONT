// import Box from '@mui/material/Box';
import MainCard from 'ui-component/cards/MainCard';
import { DataGrid, GridToolbar, GridCellModes } from '@mui/x-data-grid';
import React, { useState, useEffect, useRef } from 'react';
import {
  Grid,
  Button,
  FormControl,
  Typography,
  MenuItem,
  Select,
  InputLabel,
  Chip,
  Snackbar,
  Alert,
  CircularProgress,
  Backdrop,
  Divider
} from '@mui/material';
import axiosInstance from 'hooks/useAuthTokenUrl';
import EditIcon from '@mui/icons-material/Edit';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import SearchComponent from 'components/common/SearchTypeCommon';
import { validateForm } from 'components/discontinue/validateDiscontinue';
import SubDistrictCommon from 'components/common/SubDistrictCommon';

function DiscontinueStart() {
  const [isError, setIsError] = useState(false);
  const [isverError, setIsverError] = useState(false);
  const [isVAError, setIsVAError] = useState(false);
  const [isAAError, setIsAAError] = useState(false);
  const [getAllDistrict, setAllDistrict] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  // const [selectedStateId, setSelectedState] = useState('');
  const [snackbar, setSnackbar] = React.useState(null);
  const handleCloseSnackbar = () => setSnackbar(null);
  const [loading, setLoading] = useState(false);
  // const [selectedDistrictId, setSelectedDistrict] = useState(null);
  // const [selectedAreaId, setSelectedArea] = useState(null);
  // const [selectedSubDistrictId, setSelectedSubDistrict] = useState(null);
  // const [selectedGramPanchyat, setSelectedGramPanchyat] = useState(null);
  const [locationOptionValues, setLocationOptionValues] = useState({});
  const [eligstatusOptions, setEligstatusOptions] = useState([]);
  // const [selectedOption, setSelectedOption] = useState('option1');
  // const [editableValue, setEditableValue] = useState('');
  const [selectedDropdownValue, setSelectedDropdownValue] = useState('');
  const [selectedDropdownValue1, setSelectedDropdownValue1] = useState('');
  const [verifyerOptions, setVerifyerOptions] = useState([]);
  const [approverOptions, setApproverOptions] = useState([]);
  const datePickerRef = useRef(null);
  const subDistrictCommonRef = React.createRef();
  const [verifyingDate, setVerifyingDate] = useState(null);
  const [approvingDate, setApprovingDate] = useState(null);
  const options = {
    sanctionOrderNo: 'Sanction Order No',
    beneficiaryCode: 'Beneficiary Code'
  };
  const [optionValues, setOptionValues] = useState({});
  const handleLocationValuesChange = (newLocOptionValues) => {
    setLocationOptionValues(newLocOptionValues);
  };
  const handleSearchOptionValuesChange = (newOptionValues) => {
    setOptionValues(newOptionValues);
  };
  const handleDropdownChange = (id, field, selectedValue) => {
    if (field == 'continued') {
      if (selectedValue == '') {
        // alert("please select");
        return;
      }
    }
    setAllDistrict((prevRows) => prevRows.map((row) => (row.sanctionOrderNo === id ? { ...row, [field]: selectedValue } : row)));
  };

  const handleApprovingDateChange = (date) => {
    setApprovingDate(date);
    setIsError(!date);
  };
  const handleVerifyingDateChange = (date) => {
    setVerifyingDate(date);
    setIsverError(!date);
  };

  const handleDropdownChangenew = (event) => {
    setSelectedDropdownValue(event.target.value);
    setIsVAError(!event.target.value);
  };
  const handleDropdownChangenew1 = (event) => {
    setSelectedDropdownValue1(event.target.value);
    setIsAAError(!event.target.value);
  };

  useEffect(() => { }, [selectedDropdownValue, selectedDropdownValue1]);

  const columns = [
    {
      field: 'sanctionOrderNo',
      headerName: 'Sanction Order No',
      flex: 1,
      editable: false
    },
    {
      field: 'firstName',
      headerName: 'Applicant Name',
      flex: 1,
      editable: false,
      renderCell: (params) => (
        <div>
          {params.row.firstName} {params.row.middleName} {params.row.lastName}
        </div>
      )
    },
    {
      field: 'fatherHusbandName',
      headerName: 'Father/Husband Name',
      // flex:1,
      width: 155,
      editable: false
    },
    {
      field: 'beneficiryNo',
      headerName: 'Beneficiry No',
      flex: 1,
      editable: false
    },

    {
      field: 'eligstatus',
      headerName: 'Status',

      width: 120,
      renderCell: (params) => (
        <select
          value={params.value}
          onChange={(e) => handleDropdownChange(params.id, 'eligstatus', e.target.value)}
          style={{ background: 'white', border: '0', width: '80px' }}
        >
          <option value="">Select</option>
          {eligstatusOptions.map((option) => (
            <option key={option.statusCode} value={option.statusCode}>
              {option.statusDesc}
            </option>
          ))}
        </select>
      )
    },
    {
      field: 'continued',
      headerName: 'To Be Continued',
      width: 120,
      renderCell: (params) => {
        const eligstatusValue = params.row.eligstatus;
        // const showContinued = eligstatusValue === 'ELI'; // Replace 'specific_condition' with your actual condition
        // console.log('------' + eligstatusValue)
        return (
          <select
            value={params.value} // Set the initial selected value based on params.value
            onChange={(e) => handleDropdownChange(params.id, 'continued', e.target.value)}
            style={{ background: 'white', border: '0' }}
            disabled={eligstatusValue === null || eligstatusValue === ''} // Disable if eligstatusValue is not 'ELI'
          >
            {eligstatusValue === 'ELI' ? (
              <>
                <option value="">Select</option>
                <option value="YES">Yes</option>
              </>
            ) : eligstatusValue === '' ? (
              <>
                <option value="">Select</option>
              </>
            ) : (
              <>
                <option value="">Select</option>
                <option value="NO">No</option>
              </>
            )}
          </select>
        );
      }
    },
    {
      field: 'creationRemarks',
      headerName: (
        <div>
          <EditIcon fontSize="small" style={{ marginBottom: '-4px', color: 'purple' }} /> Remarks
        </div>
      ),
      flex: 1,
      editable: true
    }
  ];

  const handleClickOpen = (e) => {
    e.preventDefault();

    // setOpen(true);
    // alert(JSON.stringify(optionValues));
    // if(!optionValues.sanctionOrderNo && !optionValues.beneficiaryCode && !selectedDistrictId){
    //   alert("Please Search using at least One Option");
    //   return;
    // }

    if (subDistrictCommonRef.current && !Object.values(optionValues).some((value) => value !== null)) {
      if (subDistrictCommonRef.current.validateSelectedDropDown() != 'RJ') {
        return false;
      }
    }

    fetchData()
      .then((res) => {
        if (res) {
          // Data is not null
          const districtData = res || [];
          setAllDistrict(districtData);
          // setAllDistrict(res);
          console.log(res);
        } else {
          // Data is null
          setAllDistrict([]);

          // setSnackbar({ children: 'No Data Found', severity: 'error' });
          return false;
        }
      })
      .catch((e) => {
        console.log(e.message);
      });
  };

  const useFakeMutation = () => {
    return React.useCallback(
      (updatedRow) =>
        new Promise((resolve, reject) => {
          setTimeout(() => {
            if (updatedRow.sanctionOrderNo?.trim() === '') {
              reject(new Error("Error: District Name can't be empty."));
            } else {
              resolve({ ...updatedRow, sanctionOrderNo: updatedRow.sanctionOrderNo?.toUpperCase() });
            }
          }, 200);
        }),
      []
    );
  };
  const handleProcessRowUpdateError = React.useCallback((error) => {
    setSnackbar({ children: error.message, severity: 'error' });
  }, []);
  const mutateRow = useFakeMutation();

  const fetchData = async () => {
    try {
      // var body;
      // if (selectedOption && editableValue.trim()) {
      const selectedStateId = locationOptionValues.stateCode;
      const selectedDistrictId = locationOptionValues.districtCode;
      const selectedAreaId = locationOptionValues.ruralUrbanArea;
      const selectedSubDistrictId = locationOptionValues.subDistrictMunicipalAreaCode;
      var location = { stateID: selectedStateId, districtID: selectedDistrictId, area: selectedAreaId, subDistID: selectedSubDistrictId };
      var body = { ...optionValues, ...location };
      // alert(JSON.stringify(optionValues));

      const getUrl = `/discontinueMaster/findAllDiscontinueData`;

      setLoading(true);
      const response = await axiosInstance.post(getUrl, JSON.stringify(body));
      if (response.status >= 200 && response.status < 300) {
        return response.data;
      } else {
        return false;
      }
    } catch (error) {
      if (error.response.data.sanctionOrderNo) {
        setSnackbar({ children: error.response.data.sanctionOrderNo, severity: 'error' });
      } else {
        setSnackbar({ children: 'No Data Found', severity: 'error' });
      }

      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchEligstatusOptions = async () => {
      try {
        const response = await axiosInstance.get('/discontinueMaster/getStatusMasterData');
        if (response.status === 200) {
          // console.log(response.data);
          setEligstatusOptions(response.data);
        } else {
          console.error('Failed to fetch eligstatus options');
        }
        const verifyerResponse = await axiosInstance.get('/discontinueMaster/getVerifyingOfficersDetails');
        if (verifyerResponse.status === 200) {
          // console.log(verifyerResponse.data);
          setVerifyerOptions(verifyerResponse.data);
        } else {
          console.error('Failed to fetch eligstatus options');
        }
        const approverResponse = await axiosInstance.get('/discontinueMaster/getApprovingOfficersDetails');
        if (approverResponse.status === 200) {
          // console.log(approverResponse.data);
          setApproverOptions(approverResponse.data);
        } else {
          console.error('Failed to fetch eligstatus options');
        }
      } catch (error) {
        console.error('Error fetching eligstatus options:', error);
      }
    };
    fetchEligstatusOptions();
  }, []);
  const handleSelectionChange = (newSelection) => {
    setSelectedRows(newSelection);
  };

  const rows = getAllDistrict.map((item) => ({
    status: item.status,
    sanctionOrderNo: item.sanctionOrderNo,
    id: item.sanctionOrderNo,
    firstName: item.firstName,
    middleName: item.middleName,
    lastName: item.lastName,
    fatherHusbandName: item.fatherHusbandName,
    mobileNo: item.mobileNo,
    creationRemarks: item.creationRemarks,
    beneficiryNo: item.beneficiryNo,
    eligstatus: item.eligstatus,
    continued: item.continued
  }));
  const processRowUpdate = React.useCallback(
    async (updatedRow) => {
      try {
        const updatedRowData = await mutateRow(updatedRow);

        setAllDistrict((prevRows) => {
          const rowIndex = prevRows.findIndex((row) => row.sanctionOrderNo === updatedRowData.sanctionOrderNo);
          const updatedRows = [...prevRows];
          updatedRows[rowIndex] = {
            ...updatedRows[rowIndex],
            status: updatedRowData.status,
            creationRemarks: updatedRowData.creationRemarks,
            continued: updatedRowData.continued,
            eligstatus: updatedRowData.eligstatus
            // veryfyingAuthority:selectedDropdownValue,
            // // verifyingDate: verifyingDate,
            // approvingAuth:selectedDropdownValue1,
            // approvingDate:approvingDate
          };

          return updatedRows;
        });

        return updatedRowData;
      } catch (error) {
        console.error('Error updating row:', error);
        setSnackbar({ children: error.message, severity: 'error' });
        throw error;
      }
    },
    [mutateRow, getAllDistrict, setSnackbar, selectedDropdownValue, selectedDropdownValue1, selectedRows]
  );

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    if (!isVAError && selectedDropdownValue) {
      console.log('verifying successfully!', selectedDropdownValue);
    } else {
      setIsVAError(!selectedDropdownValue);
      if (datePickerRef.current) {
        datePickerRef.current.scrollIntoView({ behavior: 'auto', block: 'start' });
      }
      setLoading(false);

      return;
    }
    if (!isverError && verifyingDate) {
      console.log('verifyingDate successfully!', verifyingDate);
    } else {
      setIsverError(!verifyingDate);
      if (datePickerRef.current) {
        datePickerRef.current.scrollIntoView({ behavior: 'auto', block: 'start' });
      }
      setLoading(false);

      return;
    }
    if (!isError && approvingDate) {
      console.log('approvingDate successfully!', approvingDate);
    } else {
      setIsError(!approvingDate);
      if (datePickerRef.current) {
        datePickerRef.current.scrollIntoView({ behavior: 'auto', block: 'start' });
      }
      setLoading(false);

      return;
    }
    if (!isAAError && selectedDropdownValue1) {
      console.log('Approving successfully!', selectedDropdownValue1);
    } else {
      setIsAAError(!selectedDropdownValue1);
      if (datePickerRef.current) {
        datePickerRef.current.scrollIntoView({ behavior: 'auto', block: 'start' });
      }
      setLoading(false);

      return;
    }
    if (verifyingDate && approvingDate && verifyingDate < approvingDate) {
      console.log('Verification date is earlier than approving date.');
    } else {
      // Handle error
      setLoading(false);

      setSnackbar({ children: 'Verification date should be earlier than approving date.', severity: 'error' });

      return;
    }

    if (selectedRows.length === 0) {
      setLoading(false);

      setSnackbar({ children: 'Please select at least one row.', severity: 'error' });

      return;
    }
    const selectedData = getAllDistrict.filter((row) => selectedRows.indexOf(row.sanctionOrderNo) !== -1);
    const updatedData1 = await processRowUpdate(selectedData);
    console.log('updatedRow fsdgs status : ', JSON.stringify(selectedData));

    const validationErrors = validateForm(selectedRows, getAllDistrict);

    if (validationErrors.length > 0) {
      validationErrors.forEach((error) => {
        setSnackbar({ children: error, severity: 'error' });
      });
      setLoading(false);

      return;
    }
    // veryfyingAuthority:,
    // // verifyingDate: verifyingDate,
    // approvingAuth:selectedDropdownValue1,
    const veryfyingAuthority = selectedDropdownValue;
    const approvingAuth = selectedDropdownValue1;
    try {
      setLoading(true);

      const body = { approvingDate, verifyingDate, veryfyingAuthority, approvingAuth, updatedData1 };
      const apiUrl = '/discontinueMaster/saveDiscontinueDetails';
      const response = await axiosInstance.post(apiUrl, JSON.stringify(body));

      console.log('API Response:', response.data);
      if (response.status >= 200 && response.status < 300) {
        setLoading(false);

        setSnackbar({ children: 'Successfully updated', severity: 'success' });
        await new Promise((resolve) => setTimeout(resolve, 1250));

        handleClickOpen(e);
      } else {
        setLoading(false);

        setSnackbar({ children: 'Error in updating data', severity: 'success' });
        await new Promise((resolve) => setTimeout(resolve, 1250));
      }
    } catch (error) {
      setLoading(false);
      console.error('Error sending data:', error);
      setSnackbar({ children: error.message, severity: 'error' });
    } finally {
      setLoading(false);
    }
  };
  const [cellModesModel, setCellModesModel] = React.useState({});

  const handleCellClick = React.useCallback((params, event) => {
    if (!params.isEditable) {
      return;
    }

    // Ignore portal
    if (event.target.nodeType === 1 && !event.currentTarget.contains(event.target)) {
      return;
    }

    setCellModesModel((prevModel) => {
      return {
        ...Object.keys(prevModel).reduce(
          (acc, id) => ({
            ...acc,
            [id]: Object.keys(prevModel[id]).reduce(
              (acc2, field) => ({
                ...acc2,
                [field]: { mode: GridCellModes.View }
              }),
              {}
            )
          }),
          {}
        ),
        [params.id]: {
          ...Object.keys(prevModel[params.id] || {}).reduce((acc, field) => ({ ...acc, [field]: { mode: GridCellModes.View } }), {}),
          [params.field]: { mode: GridCellModes.Edit }
        }
      };
    });
  }, []);
  const handleCellModesModelChange = React.useCallback((newModel) => {
    setCellModesModel(newModel);
  }, []);
  return (
    <div>
      <MainCard title="Discontinue Pensioners">
        {!!snackbar && (
          <Snackbar open anchorOrigin={{ vertical: 'top', horizontal: 'center' }} onClose={handleCloseSnackbar} autoHideDuration={6000}>
            <Alert {...snackbar} onClose={handleCloseSnackbar} />
          </Snackbar>
        )}
        <Backdrop open={loading} style={{ zIndex: 999, color: '#fff' }}>
          <CircularProgress color="inherit" />
        </Backdrop>
        <form onSubmit={(e) => handleClickOpen(e)}>
          <div>
            <SubDistrictCommon ref={subDistrictCommonRef} validationLevel={'D'} onFormInputValuesChange={handleLocationValuesChange} />
          </div>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={12}>
              <Divider>
                {' '}
                <Chip label="OR SEARCH BY" />{' '}
              </Divider>
              <br />
            </Grid>
            <Grid>
              <div>
                <SearchComponent options={options} onOptionValuesChange={handleSearchOptionValuesChange} />
              </div>
            </Grid>


          </Grid>
          <Grid container justifyContent="center" alignItems="center" xs={12}>
            <Grid item>
              <Button type="submit" variant="contained" color="secondary">
                Submit
              </Button>
            </Grid>
          </Grid>

        </form>
      </MainCard>

      {getAllDistrict.length > 0 ? (
        <>
          <form onSubmit={handleFormSubmit}>
            <MainCard ref={datePickerRef}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={2}>
                  <FormControl variant="outlined" fullWidth>
                    <InputLabel id="dropdown-label">
                      Verifying Authority
                      <span style={{ color: 'red' }}> *</span>
                    </InputLabel>
                    <Select
                      labelId="dropdown-label"
                      id="dropdown"
                      value={selectedDropdownValue}
                      onChange={handleDropdownChangenew}
                      label="Verifying Authority"
                      renderInput={(params) => (
                        <>
                          {isVAError && (
                            <Typography color="error" variant="caption">
                              Verifying Authority is required
                            </Typography>
                          )}
                          {params.inputProps.ref(params.inputRef)}
                          {(params.inputProps['aria-invalid'] = isVAError)}
                          {(params.inputProps['aria-describedby'] = isVAError ? 'Verifying-error-text' : '')}
                        </>
                      )}
                    >
                      <MenuItem value="">Select</MenuItem>

                      {verifyerOptions ? (
                        verifyerOptions.map((option) => (
                          <MenuItem key={option.verifyId} value={option.verifyId}>
                            {option.verifyingOfficer}
                          </MenuItem>
                        ))
                      ) : (
                        <MenuItem value="" disabled>
                          Loading...
                        </MenuItem>
                      )}
                    </Select>
                    {isVAError && (
                      <Typography id="Verifying-error-text" color="error" variant="caption">
                        Verifying Authority is required
                      </Typography>
                    )}
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={2}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <FormControl components={['DatePicker', 'DatePicker']}>
                      <DatePicker
                        label={
                          <span>
                            Date of Verification <span style={{ color: 'red' }}>*</span>
                          </span>
                        }
                        name="verifyingDate"
                        format="YYYY-MM-DD"
                        value={verifyingDate}
                        onChange={handleVerifyingDateChange}
                        disableFuture
                        renderInput={(params) => (
                          <>
                            {isverError && (
                              <Typography color="error" variant="caption">
                                Date is required
                              </Typography>
                            )}
                            {params.inputProps.ref(params.inputRef)}
                            {(params.inputProps['aria-invalid'] = isverError)}
                            {(params.inputProps['aria-describedby'] = isverError ? 'verdate-error-text' : '')}
                          </>
                        )}
                      />
                      {isverError && (
                        <Typography id="verdate-error-text" color="error" variant="caption">
                          Date is required
                        </Typography>
                      )}
                    </FormControl>
                  </LocalizationProvider>
                </Grid>

                <Grid item xs={12} sm={2}>
                  <FormControl variant="outlined" fullWidth>
                    <InputLabel id="dropdown-label">
                      Approving Authority
                      <span style={{ color: 'red' }}> *</span>
                    </InputLabel>
                    <Select
                      labelId="dropdown-label"
                      id="dropdown"
                      value={selectedDropdownValue1}
                      onChange={handleDropdownChangenew1}
                      label="Approving Authority"
                      renderInput={(params) => (
                        <>
                          {isAAError && (
                            <Typography color="error" variant="caption">
                              Approving Authority is required
                            </Typography>
                          )}
                          {params.inputProps.ref(params.inputRef)}
                          {(params.inputProps['aria-invalid'] = isAAError)}
                          {(params.inputProps['aria-describedby'] = isAAError ? 'Approving-error-text' : '')}
                        </>
                      )}
                    >
                      <MenuItem value="">Select</MenuItem>
                      {approverOptions ? (
                        approverOptions.map((option) => (
                          <MenuItem key={option.approvingId} value={option.approvingId}>
                            {option.approvingName}
                          </MenuItem>
                        ))
                      ) : (
                        <MenuItem value="" disabled>
                          Loading...
                        </MenuItem>
                      )}
                    </Select>
                    {isAAError && (
                      <Typography id="Approving-error-text" color="error" variant="caption">
                        Approving Authority is required
                      </Typography>
                    )}
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={2}>
                  <div>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <FormControl components={['DatePicker', 'DatePicker']}>
                        <DatePicker
                          label={
                            <span>
                              Approving Date <span style={{ color: 'red' }}>*</span>
                            </span>
                          }
                          name="approvingDate"
                          format="YYYY-MM-DD"
                          // ref={datePickerRef}
                          value={approvingDate}
                          // onChange={(date) => setApprovingDate(date)}
                          required
                          onChange={handleApprovingDateChange}
                          disableFuture
                          renderInput={(params) => (
                            <>
                              {isError && (
                                <Typography color="error" variant="caption">
                                  Date is required
                                </Typography>
                              )}
                              {params.inputProps.ref(params.inputRef)}
                              {(params.inputProps['aria-invalid'] = isError)}
                              {(params.inputProps['aria-describedby'] = isError ? 'date-error-text' : '')}
                            </>
                          )}
                        // error={isError}
                        // helperText={isError ? "Date is required" : ""}
                        // inputProps={{
                        //   "aria-describedby": isError ? "date-error-text" : ""
                        // }}
                        />
                        {isError && (
                          <Typography id="date-error-text" color="error" variant="caption">
                            Date is required
                          </Typography>
                        )}
                      </FormControl>
                    </LocalizationProvider>
                  </div>
                </Grid>
              </Grid>
            </MainCard>
            <MainCard>
              <DataGrid
                checkboxSelection
                disableRowSelectionOnClick
                getRowId={(row) => row.sanctionOrderNo}
                slots={{ toolbar: GridToolbar }}
                slotProps={{
                  toolbar: {
                    showQuickFilter: true
                  }
                }}
                rows={rows}
                columns={columns}
                // columns={columns.map((column) => ({
                //   ...column,
                //   headerStyle: { whiteSpace: 'normal',width:10 }, // Apply a class to each header cell
                // }))}
                cellModesModel={cellModesModel}
                onCellModesModelChange={handleCellModesModelChange}
                onCellClick={handleCellClick}
                processRowUpdate={processRowUpdate}
                onProcessRowUpdateError={handleProcessRowUpdateError}
                onRowSelectionModelChange={handleSelectionChange}
                initialState={{
                  pagination: {
                    paginationModel: {
                      pageSize: 15
                    }
                  }
                }}
                pageSizeOptions={[15]}
              // checkboxSelection
              // disableRowSelectionOnClick
              />

              {/* </Box> */}

              <Grid item xs={12} alignItems="center">
                <Button type="submit" variant="contained" color="secondary">
                  Submit
                </Button>
              </Grid>
            </MainCard>
          </form>
        </>
      ) : (
        <div></div>
      )}
    </div>
  );
}

export default DiscontinueStart;
