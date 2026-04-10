import React, { useEffect, useState } from 'react';
import { useReducer } from 'react';

import axiosInstance from 'hooks/useAuthTokenUrl';
import { FormControl, Grid, InputLabel, Select, MenuItem, Input, Button, Alert, Snackbar } from '@mui/material';
import ResponseDialog from 'components/common/ResponseDialog';
import StateList from 'components/form_components/StateList';
// import { showalertwhenObjectretrnvalidation } from 'components/common/fieldValidationFunctionByjava';
import MandatoryFields from 'components/common/MandatoryFields';
//import AlertSucess from 'components/common/alertSucess';

function SocialAuditUploadModule() {
  const [formInput, setFormInput] = useReducer((state, newState) => ({ ...state, ...newState }), {
    stateCode: '',
    reportType: '',
    finyr: '',
    atrType: '',
    fileUploadType: '',
    sendPdf: ''
  });
  const [snackbar, setSnackbar] = React.useState(null);
  const handleCloseSnackbar = () => setSnackbar(null);
  const [warningAlert, setShowwarningAlert] = useState('');
  const [unvalidField, setunvalidField] = useState([]);
  const [showValidationPopup, setShowValidationPopup] = useState(false);
  const [filePdf, setFilePdf] = useState(null);
  const [getSucess, setSucess] = useState([]);

  const [successOpen, setSuccessOpen] = useState(false);
  const [errorOpen, setErrorOpen] = useState(false);
  const [dialogMessage, setDialogMessage] = useState('');
  const [reportList, setReportList] = useState([]);
  const [loadingReports, setLoadingReports] = useState(false);
  console.log(loadingReports);

  const handleSelectState = (state) => {
    const name = 'stateCode';
    setFormInput({ [name]: state });
  };

  const handleInput = (evt) => {
    const name = evt.target.name;
    setFormInput({ [name]: evt.target.value });
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];

    if (file) {
      if (file && file.type !== 'application/pdf') {
        setSnackbar({ children: 'Only PDF files are allowed.', severity: 'error' });
        event.target.value = '';
      }
      setFilePdf(file);
    } else {
      console.log('No file selected');
    }
  };

  const [getFinyear, setFinyear] = useState([]);
  const getAllFinyear = () => {
    let endpoints = ['/common/findAllFinYearList'];
    Promise.all(endpoints.map((endpoint) => axiosInstance.get(endpoint))).then(([{ data: allFinyr }]) => {
      setFinyear(allFinyr);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.target.reset();
    const mandatoryFields = ['stateCode', 'finyr', 'fileUploadType'].filter((field) => field !== '');

    const validationResults = mandatoryFields.map((field) => ({
      field: field,
      isValid: Boolean(formInput[field])
    }));

    const isFormValid = validationResults.every((result) => result.isValid);

    if (!isFormValid) {
      const unvalidFields = validationResults.filter((result) => !result.isValid).map((result) => result.field + ',  ');
      setunvalidField(unvalidFields);
      console.log(unvalidFields);
      setShowValidationPopup(true);
      setTimeout(() => {
        setShowValidationPopup(false);
      }, 3000);
      return;
    }
    try {
      const formData = new FormData();
      formData.append('file', filePdf);
      formData.append('stateCode', formInput.stateCode);
      formData.append('finyr', formInput.finyr);
      formData.append('reportType', formInput.reportType);
      formData.append('atrType', formInput.atrType);
      formData.append('fileUploadType', formInput.fileUploadType);

      const config = {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      };

      const postUrl = '/advance-search/socialAuditUpdate';
      const res = await axiosInstance.post(postUrl, formData, config);
      setSucess(res.status);
      console.log('status from backend', res.status);

      setFormInput({
        finyr: '',
        fileUploadType: '',
        reportType: '',
        atrType: ''
      });

      if (res.status === 200) {
        const reportType = formInput.reportType || 'Report';

        setDialogMessage(`${reportType} has been submitted successfully!`);
        setSuccessOpen(true);
      }
    } catch (e) {
      let errorMessage = 'An unexpected error occurred';

      if (e?.response?.data) {
        const errData = e.response.data;

        errorMessage = typeof errData === 'string' ? errData : errData.detail || errData.message || JSON.stringify(errData);
      }

      setDialogMessage(errorMessage);
      setErrorOpen(true);
    }
  };

  const viewPdf = async (fileName) => {
    try {
      const response = await axiosInstance.get(`/advance-search/downloadReport/${fileName}`, {
        responseType: 'blob'
      });
      const file = new Blob([response.data], { type: 'application/pdf' });
      const fileURL = URL.createObjectURL(file);
      window.open(fileURL, '_blank');
    } catch (error) {
      console.error('Error fetching the PDF:', error);
      alert('Could not open PDF file.');
    }
  };

  const fetchUploadedReports = async () => {
    const { stateCode, finyr, fileUploadType } = formInput;

    if (!stateCode || !finyr || !fileUploadType) return;

    setLoadingReports(true);
    try {
      const res = await axiosInstance.get(`/advance-search/getUploadedReportList/${stateCode}/${finyr}/${fileUploadType}`);
      console.log(res.data);
      setReportList(res.data || []);
    } catch (error) {
      console.error('Failed to fetch uploaded reports:', error);
    } finally {
      setLoadingReports(false);
    }
  };

  useEffect(() => {
    const { stateCode, finyr, fileUploadType } = formInput;
    if (stateCode && finyr && fileUploadType) {
      console.log('Triggering report fetch:', { stateCode, finyr, fileUploadType });
      fetchUploadedReports();
    }
  }, [formInput.stateCode, formInput.finyr, formInput.fileUploadType]);

  useEffect(() => {
    getAllFinyear();
  }, [getSucess]);

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
        <Snackbar open anchorOrigin={{ vertical: 'top', horizontal: 'center' }} onClose={handleCloseSnackbar}>
          <Alert
            {...snackbar}
            onClose={handleCloseSnackbar}
            sx={{
              backgroundColor: '#B22222',
              color: '#fff',
              fontWeight: 'bold'
            }}
          />
        </Snackbar>
      )}

      <ResponseDialog open={errorOpen} onClose={() => setErrorOpen(false)} type="error" message={dialogMessage} />
      <ResponseDialog open={successOpen} onClose={() => setSuccessOpen(false)} type="success" message={dialogMessage} />

      <div style={{ backgroundColor: '#35a5b6', color: 'white', padding: '10px' }}>
        <div style={{ borderBottom: '3px solid white', paddingBottom: '2px', textAlign: 'center' }}>
          <h3>Upload Annual Social Audit Report</h3>
        </div>
      </div>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2} style={{ marginBottom: '10px', marginTop: '10px' }} size="small">
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <StateList onSelectState={handleSelectState} />
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Financial Year</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                label="Financial Year"
                name="finyr"
                required
                value={formInput.finyr}
                onChange={handleInput}
              >
                {getFinyear.map((year) => (
                  <MenuItem key={year.finyear} value={year.finyear}>
                    {year.finyear}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Period</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                label="fileUploadType"
                name="fileUploadType"
                required
                value={formInput.fileUploadType}
                onChange={handleInput}
              >
                <MenuItem key="April To March" value="April To March">
                  April To March
                </MenuItem>
                <MenuItem key="April To September" value="April To September">
                  April To September
                </MenuItem>
                <MenuItem key="October To March" value="October To March">
                  October To March
                </MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <InputLabel id="report-type-label">Report Type</InputLabel>
              <Select
                labelId="report-type-label"
                id="report-type"
                label="reportType"
                name="reportType"
                required
                value={formInput.reportType}
                onChange={handleInput}
              >
                <MenuItem key="Social Audit Report" value="Social Audit Report">
                  Social Audit Report
                </MenuItem>
                <MenuItem key="Action Taking Report" value="Action Taking Report">
                  Action Taking Report
                </MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {formInput.reportType === 'Action Taking Report' && (
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <InputLabel id="atr-type-label">ATR Type</InputLabel>
                <Select
                  labelId="atr-type-label"
                  id="atr-type"
                  label="atrType"
                  name="atrType"
                  required
                  value={formInput.atrType}
                  onChange={handleInput}
                >
                  <MenuItem key="ATR of Social Audit Report" value="ATR of Social Audit Report">
                    ATR of Social Audit Report
                  </MenuItem>
                  <MenuItem key="ATR of NIRDPR" value="ATR of NIRDPR">
                    ATR of NIRDPR
                  </MenuItem>
                </Select>
              </FormControl>
            </Grid>
          )}

          <Grid item xs={12} sm={4}>
            <FormControl fullWidth style={{ marginTop: '10px' }}>
              <b>Upload Report (Only .pdf Format Allowed)</b>
              <Input
                type="file"
                name="filePdf"
                onChange={handleFileChange}
                required
                inputProps={{
                  accept: 'application/pdf'
                }}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4} alignItems="center">
            <Button type="submit" variant="contained" color="secondary">
              Upload Report
            </Button>
          </Grid>
        </Grid>
        {formInput.finyr && formInput.fileUploadType && (
          <div style={{ marginTop: '20px' }}>
            <h4>Uploaded Reports:</h4>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead style={{ backgroundColor: '#35a5b6', color: 'white' }}>
                <tr>
                  <th style={{ border: '1px solid #ccc', padding: '8px' }}>Report Name</th>
                  <th style={{ border: '1px solid #ccc', padding: '8px' }}>Financial Year</th>
                  <th style={{ border: '1px solid #ccc', padding: '8px' }}>Period</th>
                  <th style={{ border: '1px solid #ccc', padding: '8px' }}>View Uploaded Report</th>
                </tr>
              </thead>
              <tbody>
                {reportList.map((item, index) => (
                  <tr key={index}>
                    <td style={{ border: '1px solid #ccc', padding: '8px' }}>{item.reportType}</td>
                    <td style={{ border: '1px solid #ccc', padding: '8px' }}>{item.uploadDate}</td>
                    <td style={{ border: '1px solid #ccc', padding: '8px' }}>{item.fileUploadType}</td>
                    <td style={{ border: '1px solid #ccc', padding: '8px', textAlign: 'center' }}>
                      <button
                        type="button"
                        onClick={() => viewPdf(item.fileName)}
                        style={{
                          backgroundColor: '#35a5b6',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          padding: '6px 12px',
                          cursor: 'pointer'
                        }}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </form>
    </div>
  );
}

export default SocialAuditUploadModule;
