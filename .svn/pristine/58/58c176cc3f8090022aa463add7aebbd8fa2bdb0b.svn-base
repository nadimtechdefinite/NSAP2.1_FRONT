import React, { useEffect, useState } from 'react';
import { useReducer } from 'react';
import axiosInstance from 'hooks/useAuthTokenUrl';
import { FormControl, Grid, InputLabel, Select, MenuItem, Input, Button, Alert, Snackbar, Typography, TextField ,InputAdornment  } from '@mui/material';
import MandatoryFields from 'components/common/MandatoryFields';
import AlertSucess from 'components/common/alertSucess';
import { TextareaAutosize } from '@material-ui/core';
import MainCard from 'ui-component/cards/MainCard';

function RaiseComplain() {
  const [formInput, setFormInput] = useReducer((state, newState) => ({ ...state, ...newState }), {
    moduleId: '',
    subModuleId: '',
    menuId: 0,
    sendPdf: '',
    sendPdf2: '',
    ComplainTitle: '',
    ComplainDetails: ''
  });
  const [snackbar, setSnackbar] = React.useState(null);
  const handleCloseSnackbar = () => setSnackbar(null);
  const [warningAlert, setShowwarningAlert] = useState('');
  const [unvalidField, setunvalidField] = useState([]);
  const [showValidationPopup, setShowValidationPopup] = useState(false);
  const [filePdf, setFilePdf] = useState(null);
  const [filePdf2, setFilePdf2] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [MMMasterNames, setMMMasterNames] = useState([]);
  const [subMMMasterNames, setsubMMMasterNames] = useState([]);
  const [menuMaster, setmenuMaster] = useState([]);
  const [getSucess, setSucess] = useState([]);

  const handleInput = (evt) => {
    const name = evt.target.name;
    setFormInput({ [name]: evt.target.value });
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];

    if (file) {
        if (file.type !== 'application/pdf' && file.type.indexOf('image/') !== 0) {
          setSnackbar({ children: 'Only PDF files and images are allowed.', severity: 'error' });
          event.target.value = '';
        } else {
          setFilePdf(file);
        }
      } else {
        console.log('No file selected');
      }
      
  };

  const handleFileChange2 = (event) => {
    const file = event.target.files[0];

    if (file) {
        if (file.type !== 'application/pdf' && file.type.indexOf('image/') !== 0) {
          setSnackbar({ children: 'Only PDF files and images are allowed.', severity: 'error' });
          event.target.value = '';
        } else {
          setFilePdf2(file);
        }
      } else {
        console.log('No file selected');
      }
      
  };

  const fetchModuleMaster = async () => {
    try {
      const getUrl = `/userManagement/findAllModuleMaster`;
      const response = await axiosInstance.get(getUrl);

      setMMMasterNames(response.data);
    } catch (error) {
      console.error('Error fetching module masters:', error);
    }
  };

  const fetchSubModuleMaster = async () => {
    try {
      const getUrl = `/userManagement/findAllSubModuleMasterByModuleId/${formInput.moduleId}`;
      const response = await axiosInstance.get(getUrl);

      setsubMMMasterNames(response.data);
    } catch (error) {
      console.error('Error fetching module masters:', error);
    }
  };

  const findAllMenuMasterBySubModule = async () => {
    try {
      const getUrl = `/userManagement/findAllMenuMasterBySubModule/${formInput.subModuleId}`;
      const response = await axiosInstance.get(getUrl);

      setmenuMaster(response.data);
    } catch (error) {
      console.error('Error fetching module masters:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.target.reset(); // Ensure that this line is not causing unintended side effects
    // const postFormDate = JSON.stringify(formInput);
    const mandatoryFields = ['ComplainTitle', 'ComplainDetails'].filter((field) => field !== '');

    const validationResults = mandatoryFields.map((field) => ({
      field: field,
      isValid: Boolean(formInput[field])
    }));

    const isFormValid = validationResults.every((result) => result.isValid);

    if (!isFormValid) {
      const unvalidFields = validationResults.filter((result) => !result.isValid).map((result) => result.field + ',  ');
      setunvalidField(unvalidFields);
    
      setShowValidationPopup(true);
      setTimeout(() => {
        setShowValidationPopup(false);
      }, 3000);
      return;
    }
    try {
      const formData = new FormData();
      formData.append('file', filePdf);
      formData.append('file2', filePdf2);
      formData.append('ComplainTitle', formInput.ComplainTitle);
      formData.append('ComplainDetails', formInput.ComplainDetails);
      formData.append('moduleId', formInput.moduleId);
      formData.append('subModuleId', formInput.subModuleId);
      formData.append('menuId', formInput.menuId);
    

      const config = {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      };

      const postUrl = '/complain-management/complainRaise';
      const res = await axiosInstance.post(postUrl, formData, config);
      setSucess(res.status);
      // Reset form fields using dispatch
      setFormInput({
        finyr: '',
        fileUploadType: ''
      });

      if (res.status === 200) {
        setShowAlert(true);
        // Automatically hide the alert after 5 seconds
        const timeoutId = setTimeout(() => {
          setShowAlert(false);
        }, 5000);

        // Clear the timeout when the component is unmounted or when showAlert changes
        return () => clearTimeout(timeoutId);
      }

    } catch (e) {
      console.error(e);
      if (e.response) {
        setSnackbar({ children: e.response.data, severity: 'error' });
        // setShowwarningAlert(showalertwhenObjectretrnvalidation(e));
      } else {
        setSnackbar({ children: 'Some error Occured.', severity: 'error' });
      }
    }
  };

  useEffect(() => {
    fetchModuleMaster();
    if (formInput.moduleId) {
      fetchSubModuleMaster();
    }

    if (formInput.subModuleId) {
      findAllMenuMasterBySubModule();
    }
  }, [formInput.moduleId, formInput.subModuleId,getSucess]);

  const handleClose = () => {
    setShowwarningAlert('');
  };

  return (
    <div>
      {showValidationPopup && <MandatoryFields fieldName={unvalidField} />}
      {warningAlert && (
        <Alert variant="filled" severity="warning" onClose={handleClose}>
          {warningAlert}
        </Alert>
      )}
      {!!snackbar && (
        <Snackbar open anchorOrigin={{ vertical: 'top', horizontal: 'center' }} onClose={handleCloseSnackbar} autoHideDuration={6000}>
          <Alert {...snackbar} onClose={handleCloseSnackbar} />
        </Snackbar>
      )}
      {showAlert && <AlertSucess msg={'Complain Raised'} />}
      {/* <div style={{ backgroundColor: '#333', color: 'white', padding: '10px' }}>
        <div style={{ borderBottom: '3px solid white', paddingBottom: '2px', textAlign: 'center' }}>
          <h3>Raise Complain </h3>
        </div>
      </div> */}
      <MainCard title="Raise Complaint">
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2} style={{ marginBottom: '10px', marginTop: '10px' }} size="small">
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <InputLabel id="Module Master">
                Module Master
                {/* <Typography variant="body1" color="error" style={{ marginLeft: 5 }}>
                  *
                </Typography> */}
                <span style={{ color: 'red' }}> *</span>
              </InputLabel>
              <Select
                labelId="Module Master"
                id="moduleId"
                label="Module Master"
                name="moduleId"
                value={formInput.moduleId}
                onChange={handleInput}
                required
              >
                {MMMasterNames.map((item) => (
                  <MenuItem key={item.moduleId} value={item.moduleId}>
                    {item.moduleName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <InputLabel id="Sub Module Master">
                Sub Module Master
                {/* <Typography variant="body1" color="error" style={{ marginLeft: 5 }}>
                  *
                </Typography> */}
                <span style={{ color: 'red' }}> *</span>
              </InputLabel>
              <Select
                labelId="Sub Module Master"
                id="subModuleId"
                label="Sub Module Master"
                name="subModuleId"
                value={formInput.subModuleId}
                onChange={handleInput}
                required
              >
                {subMMMasterNames.map((item) => (
                  <MenuItem key={item.subModuleId} value={item.subModuleId}>
                    {item.subModuleName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <InputLabel id="Menu Master">
                Menu Master
                {/* <Typography variant="body1" color="error" style={{ marginLeft: 5 }}>
                  *
                </Typography> */}
                <span style={{ color: 'red' }}> *</span>
              </InputLabel>
              <Select
                labelId="Menu Master"
                id="menuId"
                label="Menu Master"
                name="menuId"
                value={formInput.menuId}
                onChange={handleInput}
                required
              >
                {menuMaster.map((item) => (
                  <MenuItem key={item.menuId} value={item.menuId}>
                    {item.menuName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={12}>
            <TextField
              label="Complaint Title"
              name="ComplainTitle"
              placeholder="Enter Complaint Title"
              variant="outlined"
              fullWidth
              required
              value={formInput.ComplainTitle}
              onChange={handleInput}
              InputProps={{
                inputProps: {
                  // pattern: '^[A-Za-z\\s]*$',
                  // title: 'Only characters are allowed',
                  maxLength: 50
                },
                // endAdornment: (
                //   <InputAdornment position="end">
                //     <Typography variant="h3" color="error">
                //       *
                //     </Typography>
                //   </InputAdornment>
                // )
              }}
            />
          </Grid>
          <Grid item xs={12} sm={12} justify="center">
          <FormControl fullWidth>
            <TextareaAutosize  label="Complaint Details"
              name="ComplainDetails"
              placeholder="Enter Complaint Details"
              variant="outlined"
              fullWidth
              required
              value={formInput.ComplainDetails}
              onChange={handleInput}
              InputProps={{
                inputProps: {
                  pattern: '^[A-Za-z\\s]*$',
                  title: 'Only characters are allowed',
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
              rows={4}/>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth style={{ marginTop: '10px' }}>
              <b>Upload doc 1 (Only .pdf ,image Format Allowed)</b>
              <Input
                type="file"
                name="filePdf"
                onChange={handleFileChange}
                inputProps={{
                    accept: 'application/pdf, image/*'
                }}
              />
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={4}>
            <FormControl fullWidth style={{ marginTop: '10px' }}>
              <b>Upload doc 2 (Only .pdf ,image Format Allowed)</b>
              <Input
                type="file"
                name="filePdf2"
                onChange={handleFileChange2}
                inputProps={{
                    accept: 'application/pdf, image/*'
                }}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4} alignItems="center">
            <Button type="submit" variant="contained" color="primary">
              Raise Complaint
            </Button>
          </Grid>
        </Grid>
      </form>
      </MainCard>
    </div>
  );
}

export default RaiseComplain;
