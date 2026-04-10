import React, { useState, useEffect } from 'react';
import { Grid, FormControl, Alert, Stack, Button, FormHelperText, Typography } from '@mui/material';
import MainCard from 'ui-component/cards/MainCard';
import StateList from 'components/form_components/StateList';
import DistrictList from 'components/form_components/DistrictList';
import AreaList from 'components/form_components/AreaList';
import SubDistrictList from 'components/form_components/SubDistrictList';
import MonthList from 'components/form_components/MonthList';
import YearList from 'components/form_components/YearList';
import messages_en from 'components/common/messages_en.json';
import axiosInstance from 'hooks/useAuthTokenUrl';
import { Table, TableHead, TableRow, TableCell, TableBody, CircularProgress, Snackbar } from '@mui/material';
import ConfirmationDialog from 'components/common/ConfirmationDialog';
import { getUserInfo } from 'utils/storageUtils';
const PensionComputationReset = () => {
  const userInfo = getUserInfo();
  const userLevel = userInfo.userLevel;
  const [snackbar, setSnackbar] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [selectedStateId, setSelectedState] = useState('');
  const [selectedDistrictId, setSelectedDistrict] = useState('');
  const [selectedArea, setSelectedArea] = useState('');
  const [selectedSubDistrictId, setSelectedSubDistrict] = useState('');
  const [computationLevelFlag, setComputationLevelFlag] = useState('');
  const [formData, setFormData] = useState({
    monthCode: '',
    yearCode: ''
  });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogTitle, setDialogTitle] = useState('');
  const [dialogContent, setDialogContent] = useState('');
  const [fileName, setFileName] = useState('');
  const handleCloseSnackbar = () => setSnackbar(null);
  const [enableComputationResetButton, setEnableComputationResetButton] = useState(null);
  const [computationFileList, setComputationFileList] = useState([]);
  const fetchDataComputationalLevel = async () => {
    try {
      setLoading(true);
      const getUrl = `/computePension/getComputationalLevel/${selectedStateId}`;
      const response = await axiosInstance.get(getUrl);
      const result = await response.data;
      setComputationLevelFlag(result);
    } catch (error) {
      if (error && error.response.data) {
        console.log('Computational Level Flag is null');
      } else {
        console.log(error);
      }
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (selectedStateId) {
      fetchDataComputationalLevel();
    }
  }, [selectedStateId]);
  const handleStateChange = (stateId) => {
    setSelectedState(stateId);
    setFormData({ ...formData, stateCode: stateId });
    setFormErrors((prevErrors) => {
      const updatedErrors = { ...prevErrors };
      delete updatedErrors.stateCode;
      return updatedErrors;
    });
  };
  const handleDistrictChange = (districtId) => {
    setSelectedDistrict(districtId);
    setSelectedArea('');
    setFormData({ ...formData, districtCode: districtId });
    //setFormData({ ...formData, districtCode: districtId, areaCode: userLevel === 4 ? userInfo.areaCode : '' });
    setFormErrors((prevErrors) => {
      const updatedErrors = { ...prevErrors };
      delete updatedErrors.districtCode;
      return updatedErrors;
    });
  };
  const handleAreaChange = (areaCode) => {
    setSelectedArea(areaCode);
    setSelectedSubDistrict('');
    setFormData({ ...formData, areaCode: areaCode });
    //setFormData({ ...formData, areaCode: areaCode, subDistrictMunicipalCode: '' });
    setFormErrors((prevErrors) => {
      const updatedErrors = { ...prevErrors };
      delete updatedErrors.areaCode;
      return updatedErrors;
    });
  };

  const handleSubDistrictChange = (subDistrictCode) => {
    setSelectedSubDistrict(subDistrictCode);
    setFormData({ ...formData, subDistrictMunicipalCode: subDistrictCode });
    //setFormData({ ...formData, subDistrictMunicipalCode: subDistrictCode });
    //setComputationalLevelError(false);
    setFormErrors((prevErrors) => {
      const updatedErrors = { ...prevErrors };
      delete updatedErrors.subDistrictMunicipalCode;
      return updatedErrors;
    });
  };
  const handleMonthChange = (monthCode) => {
    setFormData({ ...formData, monthCode: monthCode });
    setFormErrors((prevErrors) => {
      const updatedErrors = { ...prevErrors };
      delete updatedErrors.monthCode;
      return updatedErrors;
    });
  };

  const handleYearChange = (year) => {
    setFormData({ ...formData, yearCode: year });
    setFormErrors((prevErrors) => {
      const updatedErrors = { ...prevErrors };
      delete updatedErrors.yearCode;
      return updatedErrors;
    });
  };

  const cancelButton = () => {
    if (userLevel === 4) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        monthCode: '',
        yearCode: ''
      }));
    } else if (userLevel === 3) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        monthCode: '',
        yearCode: ''
      }));
      setSelectedArea('');
      setSelectedSubDistrict('');
    } else {
      setFormData((prevFormData) => ({
        ...prevFormData,
        monthCode: '',
        yearCode: ''
      }));
      setSelectedDistrict('');
      setSelectedArea('');
      setSelectedSubDistrict('');
    }
  };

  const validateForm = () => {
    const errors = {};
    // Add validation logic for each field
    if (!selectedStateId) {
      errors.stateCode = messages_en.stateRequired;
    }

    if (!selectedDistrictId) {
      errors.districtCode = messages_en.districtRequired;
    }

    if (!selectedArea && computationLevelFlag === 'SD') {
      errors.areaCode = messages_en.areaRequired;
    }

    if (!selectedSubDistrictId && computationLevelFlag === 'SD') {
      errors.subDistrictMunicipalCode = messages_en.subDistrictRequired;
    }

    if (!formData.monthCode) {
      errors.monthCode = messages_en.monthFeildRequired;
    }

    if (!formData.yearCode) {
      errors.yearCode = messages_en.yearFeildRequired;
    }

    // Add more validation logic for other fields...

    setFormErrors(errors);

    return Object.keys(errors).length === 0; // Return true if no errors
  };

  const handleSubmit = async (e) => {
    if (e) {
      e.preventDefault();
    }
    const isFormValid = validateForm();
    if (isFormValid) {
      setLoading(true);
      console.log('Form Submitted!');
      try {
        const updatedFormData = {
          ...formData,
          stateCode: selectedStateId,
          districtCode: selectedDistrictId,
          areaCode: selectedArea,
          subDistrictMunicipalCode: selectedSubDistrictId,
          computationLevelFlag: computationLevelFlag
        };
        const postUrl = '/computePension/pensionComputationReset';
        const response = await axiosInstance.post(postUrl, updatedFormData);

        console.log('updatedFormData', updatedFormData);
        if (response.data && typeof response.data === 'object') {
          const { fileResetStatus, computationFileList } = response.data;
          // Log fileResetStatus
          if (fileResetStatus !== undefined && fileResetStatus !== null) {
            console.log('File Reset Status : ', fileResetStatus);
            if (fileResetStatus === 'EnableComputeResetButton') {
              setEnableComputationResetButton(true);
            } else {
              setEnableComputationResetButton(false);
              setSnackbar({ children: fileResetStatus, severity: 'error', variant: 'filled' });
            }
          } else {
            console.warn('File Reset Status is null or undefined.');
            setEnableComputationResetButton(false);
          }

          // Log computationFileList
          if (computationFileList !== undefined && computationFileList !== null) {
            console.log('Computation File List : ', computationFileList);
            setComputationFileList(computationFileList);
          } else {
            setComputationFileList([]);
          }
        } else {
          console.error('Unexpected response format: ', response.data);
        }
      } catch (error) {
        if (error.response.data.errors && error.response.data.errors[0].code === 'ConditionalValidation') {
          console.log(error.response.data.errors[0].defaultMessage);
          setSnackbar({ children: error.response.data.errors[0].defaultMessage, severity: 'error', variant: 'filled' });
        } else {
          console.log('Error Pension Computation Reset : ', error);
        }
      } finally {
        setLoading(false);
      }
    } else {
      console.log('Form not valid!');
      // Handle form not valid case, maybe show an error message
    }
  };

  const handleOpenDialog = (title, content, fileName) => () => {
    setDialogTitle(title);
    setDialogContent(content);
    setFileName(fileName);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  const handleConfirmDialog = async () => {
    if (fileName !== '') {
      await handleResetFileClick(fileName);
      await handleSubmit(); // Call handleSubmit after handleResetFileClick
    } else {
      await handleComputationResetSubmit();
    }
    setDialogOpen(false);
  };

  const handleResetFileClick = async (fileName) => {
    const handleResetRequest = {
      ...formData
    };
    handleResetRequest.computeFileName = fileName;
    try {
      setLoading(true);
      const postUrl = '/computePension/pensionComputationResetFileWise';
      const response = await axiosInstance.post(postUrl, handleResetRequest);
      console.log('xhk 4321', response.data);
      setSnackbar({ children: response.data, severity: 'success', variant: 'filled' });
    } catch (error) {
      console.error('Error Compute File Reset Time :', error);
      setSnackbar({ children: 'Error Compute File Reset Time', severity: 'error', variant: 'filled' });
    } finally {
      setLoading(false);
    }
  };

  const handleComputationResetSubmit = async () => {
    console.log('formData:', formData); //--------------------------
    const handleResetDataRequest = {
      ...formData
    };
    console.log('Request Payload:', handleResetDataRequest);
    try {
      setLoading(true);
      console.log('Sending API request now...'); //----------------------------------
      const postUrl = '/computePension/pensionComputationResetData';
      const response = await axiosInstance.post(postUrl, handleResetDataRequest);
      console.log('print', handleResetDataRequest);
      setEnableComputationResetButton(false);
      setSnackbar({ children: response.data, severity: 'success', variant: 'filled' });
    } catch (error) {
      console.error('Error Compute Data Reset Time :', error);
      setSnackbar({ children: 'Error Compute Data Reset Time', severity: 'error', variant: 'filled' });
    } finally {
      setLoading(false);
    }
  };
  return (
    <div>
      {loading && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 9999,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <CircularProgress />
        </div>
      )}
      <MainCard title="Computation Reset">
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Stack sx={{ width: '100%' }} spacing={2}>
              <Alert severity="info">
                Note:- File generated after{' '}
                <Typography variant="body1" component="span" fontWeight="bold">
                  15-03-2023
                </Typography>{' '}
                can only be reset.
              </Alert>
            </Stack>
          </Grid>

          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <StateList onSelectState={handleStateChange} isMandatory={true} />
              {formErrors.stateCode && (
                <FormHelperText>
                  <Typography style={{ color: 'red', fontSize: '0.8rem' }}>{formErrors.stateCode}</Typography>
                </FormHelperText>
              )}
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <DistrictList
                onSelectDistrict={handleDistrictChange}
                selectedStateId={selectedStateId}
                isMandatory={true}
                defaultSelectedDistrict={selectedDistrictId}
              />
              {formErrors.districtCode && (
                <FormHelperText>
                  <Typography style={{ color: 'red', fontSize: '0.8rem' }}>{formErrors.districtCode}</Typography>
                </FormHelperText>
              )}
            </FormControl>
          </Grid>
          {computationLevelFlag === 'SD' && (
            <>
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth>
                  <AreaList
                    onSelectArea={handleAreaChange}
                    selectedArea={selectedArea}
                    selectedDistrict={selectedDistrictId}
                    isMandatory={true}
                  />
                  {formErrors.areaCode && (
                    <FormHelperText>
                      <Typography style={{ color: 'red', fontSize: '0.8rem' }}>{formErrors.areaCode}</Typography>
                    </FormHelperText>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth>
                  <SubDistrictList
                    defaultSelectedSubDistrict={selectedSubDistrictId}
                    onSelectSubDistrict={handleSubDistrictChange}
                    selectedDistrictId={selectedDistrictId}
                    selectedAreaId={selectedArea}
                    isMandatory={true}
                  />
                  {formErrors.subDistrictMunicipalCode && (
                    <FormHelperText>
                      <Typography style={{ color: 'red', fontSize: '0.8rem' }}>{formErrors.subDistrictMunicipalCode}</Typography>
                    </FormHelperText>
                  )}
                </FormControl>
              </Grid>
            </>
          )}
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <MonthList onSelectMonth={handleMonthChange} isMendatory={true} defaultSelectedMonth={formData.monthCode} />
              {formErrors.monthCode && (
                <FormHelperText>
                  <Typography style={{ color: 'red', fontSize: '0.8rem' }}>{formErrors.monthCode}</Typography>
                </FormHelperText>
              )}
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <YearList onSelectYear={handleYearChange} isMandatory={true} defaultSelectedYear={formData.yearCode} />
              {formErrors.yearCode && (
                <FormHelperText>
                  <Typography style={{ color: 'red', fontSize: '0.8rem' }}>{formErrors.yearCode}</Typography>
                </FormHelperText>
              )}
            </FormControl>
          </Grid>
          <Grid item xs={12} alignItems="center">
            <Button type="submit" variant="contained" color="primary" disabled={loading} onClick={handleSubmit}>
              SUBMIT
            </Button>
            &nbsp; &nbsp; &nbsp;
            <Button type="button" variant="contained" color="error" onClick={cancelButton}>
              CANCEL
            </Button>
          </Grid>
        </Grid>
      </MainCard>

      {enableComputationResetButton && (
        <div style={{ marginTop: '20px', overflowX: 'auto' }}>
          <MainCard>
            <Grid container spacing={2}>
              <Grid item xs={12} alignItems="center">
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={loading}
                  onClick={handleOpenDialog('Confirm Computation Reset', 'Are you sure you want to reset the computation?', '')}
                >
                  Computation Reset
                </Button>
              </Grid>
            </Grid>
          </MainCard>
        </div>
      )}

      {!computationFileList.length == 0 && (
        <div style={{ marginTop: '20px', overflowX: 'auto' }}>
          <MainCard title="Computation File Details">
            <Grid container spacing={2}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell style={{ borderColor: 'black', borderWidth: 1, borderStyle: 'solid' }}>S.NO</TableCell>
                    <TableCell style={{ borderColor: 'black', borderWidth: 1, borderStyle: 'solid' }}>File Name</TableCell>
                    <TableCell style={{ borderColor: 'black', borderWidth: 1, borderStyle: 'solid' }}>NSAP Status</TableCell>
                    <TableCell style={{ borderColor: 'black', borderWidth: 1, borderStyle: 'solid' }}>PFMS Status</TableCell>
                    <TableCell style={{ borderColor: 'black', borderWidth: 1, borderStyle: 'solid' }}>Action</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {computationFileList.map((row, index) => (
                    <TableRow key={index}>
                      <TableCell style={{ borderColor: 'black', borderWidth: 1, borderStyle: 'solid' }}>{index + 1}</TableCell>
                      <TableCell
                        style={{
                          borderColor: 'black',
                          borderWidth: 1,
                          borderStyle: 'solid'
                        }}
                      >
                        {row.fileName}
                      </TableCell>
                      <TableCell
                        style={{
                          borderColor: 'black',
                          borderWidth: 1,
                          borderStyle: 'solid'
                        }}
                      >
                        {row.nsapStatus}
                      </TableCell>
                      <TableCell
                        style={{
                          borderColor: 'black',
                          borderWidth: 1,
                          borderStyle: 'solid'
                        }}
                      >
                        {row.pfmsStatus === 'null' ? 'Not Sent' : row.pfmsStatus}
                      </TableCell>
                      <TableCell
                        style={{
                          borderColor: 'black',
                          borderWidth: 1,
                          borderStyle: 'solid'
                        }}
                      >
                        {row.fileActionStatus === 'File Reset' ? (
                          <Button
                            variant="contained"
                            color="primary"
                            disabled={loading}
                            onClick={handleOpenDialog(
                              'Confirm Computation File Reset',
                              'Are you sure you want to reset this file?',
                              row.fileName
                            )}
                          >
                            {row.fileActionStatus}
                          </Button>
                        ) : (
                          <>Already Resetted</>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Grid>
          </MainCard>
        </div>
      )}

      {!!snackbar && (
        <Snackbar open anchorOrigin={{ vertical: 'top', horizontal: 'center' }} onClose={handleCloseSnackbar} autoHideDuration={10000}>
          <Alert {...snackbar} onClose={handleCloseSnackbar} />
        </Snackbar>
      )}

      <ConfirmationDialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        onConfirm={handleConfirmDialog}
        title={dialogTitle}
        content={dialogContent}
        loading={loading}
      />
    </div>
  );
};

export default PensionComputationReset;
