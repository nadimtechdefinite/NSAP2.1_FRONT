import axiosInstance from "hooks/useAuthTokenUrl";
import React, { useState, useEffect } from "react";
import {
    Grid, FormControl, Select, InputLabel, Button,
    TextField, Typography, FormHelperText, Box, IconButton, CircularProgress, Alert,
    Snackbar
} from '@mui/material';
import { TableContainer, Table, TableHead, TableBody,TableFooter, TableRow, TableCell,  Paper } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';

import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import MainCard from 'ui-component/cards/MainCard';
import { MenuItem } from "@mui/material";
import RefreshIcon from '@mui/icons-material/Refresh';
import config from 'config';
import messages_en from 'components/common/messages_en.json';
import axios from 'axios';

export default function DisbursementAbstract() {
    const apiBaseUrl = config.API_BASE_URL;
    const [snackbar, setSnackbar] = useState(null);
    const [stateList, setStateList] = useState([]);
    const [finYearList, setFinYearList] = useState([]);
    const [captchaImage, setCapchaImage] = useState('');
    const [captchaToken, setCaptchaToken] = useState('');
    const [loading, setLoading] = useState(false);
    const [disbursementdata, setDisbursementData] = useState([]);
    const handleCloseSnackbar = () => setSnackbar(null);
    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await axiosInstance.get(`/nationalDashboard/getDashboardFormData`);
            const data = response.data;
            setStateList(data.listStates);
            setFinYearList(data.financialYear);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };
   

const fetchCaptcha = async () => {
    setLoading(true);
    const captchaUrl = `${apiBaseUrl}/login/captcha`;
    try {
        const response = await axios.post(captchaUrl, { captchaToken });
        setCapchaImage(response.data.captchaImage);
        setCaptchaToken(response.data.captchaToken);

    } catch (error) {
        console.error('Error fetching CAPTCHA:', error);
    } finally {
        setLoading(false);
    }
};

useEffect(() => {
    Promise.all([fetchCaptcha(), fetchData()]);
}, []);
const [errors, setErrors] = useState({});
const [formData, setFormData] = useState({
    stateCode: 'All',
    schemeCode: '',
    finYear: '',
    captcha: '',
   

});

const handleSelectState = (event) => {
    setFormData({ ...formData, stateCode: event.target.value });
    setErrors((prevErrors) => {
        const updatedErrors = { ...prevErrors };
        delete updatedErrors.stateCode;
        return updatedErrors;
    });
};
const handleChangeSchemeCode = (event) => {
    setFormData({ ...formData, schemeCode: event.target.value });
    setErrors((prevErrors) => {
        const updatedErrors = { ...prevErrors };
        delete updatedErrors.fundType;
        return updatedErrors;
    });
};

const handleChangFinYear = (event) => {
    setFormData({ ...formData, finYear: event.target.value });
    setErrors((prevErrors) => {
        const updatedErrors = { ...prevErrors };
        delete updatedErrors.fundType;
        return updatedErrors;
    });
};

const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
}

const handleRefreshCaptcha = () => {
    fetchCaptcha();
};
const handleSubmit = (event) => {
    event.preventDefault();
    getAbstractReportData();
    event.target.reset();
    setFormData(prevState => ({
        ...prevState,
        captcha: '' // Reset captcha value
    }));
};
async function getAbstractReportData() {
    const isFormValid = validateForm();
    if (isFormValid) {
        try {
            setLoading(true);
            const postUrl = `/report/disbursementAbstract`;
            var location = {
                stateCode: formData.stateCode,
                schemeCode: formData.schemeCode,
                finyr: formData.finYear,
                captcha: formData.captcha,
                captchaToken: captchaToken
            };
            const response = await axiosInstance.post(postUrl, JSON.stringify(location));
            console.log("response----"+ response.data.length);
            if (response.data && Object.keys(response.data).length > 0) {
                setDisbursementData(response.data);
             
                console.log(response.data);
            } else {
                setSnackbar({ children: 'No records are found.', severity: 'error' });
              
                setDisbursementData([]);
            }
            handleRefreshCaptcha();
        } catch (error) {
            console.error('Error fetching Submit:', error);
            if (error.response && error.response.data && error.response.data.message) {
                const errorMssg = error.response.data.message;
                setSnackbar({ children: errorMssg, severity: 'error' });
            } else {
                setSnackbar({ children: 'An unexpected error occurred.', severity: 'error' });
            }
        } finally {
            setLoading(false);
        }
    }
}
const calculateColumnSums = () => {
    let sums = {
      apr: 0,
      apramt: 0,
      may: 0,
      mayamt: 0,
      june: 0,
      juneamt: 0,
      july: 0,
      julyamt: 0,
      aug: 0,
      augamt: 0,
      sep: 0,
      sepamt: 0,
      oct: 0,
      octamt: 0,
      nov: 0,
      novamt: 0,
      dec: 0,
      decamt: 0,
      jan: 0,
      janamt: 0,
      feb: 0,
      febamt: 0,
      mar: 0,
      maramt: 0,
      totalP:0,
      totalA: 0
    };

    Object.values(disbursementdata).forEach((row) => {
        // Check if any object in the row has null scheme code
        // const hasNullSchemeCode = row.some(value => value.schemecode === null);
    
        // If any object in the row has null scheme code, skip processing the row
      
          row.forEach((value) => {
            const  test=value.schemeCode==='TOTAL';
            if(!test){
            Object.entries(value).forEach(([key, val]) => {
              // Exclude month columns from the sum and sum only if schemecode is not null
              if (!isNaN(parseFloat(val)) && isFinite(val) && key !== "schemecode") {
                sums[key] += parseFloat(val);
              }
            });
        }
          });
       
      });
      // Round the sums to two decimal places
      for (const key in sums) {
        sums[key] = Math.round((sums[key] + Number.EPSILON) * 100) / 100;
      }
    

    return sums;
  };
  const exportToExcel = (id) => {
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.table_to_sheet(document.getElementById(id));
    XLSX.utils.book_append_sheet(wb, ws, id);
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    saveAs(new Blob([excelBuffer], { type: 'application/octet-stream' }), id + '.xlsx');
};
const validateForm = () => {
    const errors = {};
    // Add validation logic for each field
    if (!formData.stateCode) {
        errors.stateCode = messages_en.stateRequired;
    }
   
    if (!formData.schemeCode) {
        errors.schemeCode = messages_en.schemCodeRequired;
    }

    if (!formData.finYear) {
        errors.finYear = messages_en.finYearRequired;
    }
    

    if (!formData.captcha) {
        errors.captcha = messages_en.captchaRequired;
    }

    // Add more validation logic for other fields...

    setErrors(errors);

    return Object.keys(errors).length === 0; // Return true if no errors
};
    return (
        <div className="dashboard-container">
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
         <MainCard title="Disbursement Abstract Report">
                <form onSubmit={(e) => handleSubmit(e)}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={4}>
                            <FormControl fullWidth >
                                <InputLabel id="stateId">State&nbsp;<span style={{ color: 'red' }}>*</span></InputLabel>
                                <Select
                                    labelId="stateId"
                                    id="stateId"
                                    label="State"
                                    name="stateCode"
                                    value={formData.stateCode}
                                    onChange={handleSelectState}
                                >
                                    <MenuItem key="All" value="All">All State</MenuItem>
                                    {stateList.map((state) => (
                                        <MenuItem key={state.stateId} value={state.stateId}>{state.stateName}</MenuItem>
                                    )
                                    )}
                                </Select>

                                {errors.stateCode && (
                                    <FormHelperText>
                                        <Typography variant="caption" color="error">
                                            {errors.stateCode}
                                        </Typography>
                                    </FormHelperText>
                                )}
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <FormControl fullWidth>
                                <InputLabel id="schemeCode">Scheme Code&nbsp;<span style={{ color: 'red' }}>*</span></InputLabel>
                                <Select
                                    labelId="schemeCode"
                                    id="schemeCode"
                                    label="Scheme Code"
                                    name="schemeCode"
                                    value={formData.schemeCode}
                                    onChange={handleChangeSchemeCode}
                                >
                                    <MenuItem key="All" value="All">All Scheme</MenuItem>
                                    <MenuItem key="IGONAPS" value="IGNOAPS">IGNOAPS</MenuItem>
                                    <MenuItem key="IGNDPS" value="IGNDPS">IGNDPS</MenuItem>
                                    <MenuItem key="IGNWPS" value="IGNWPS">IGNWPS</MenuItem>
                                    <MenuItem key="NFBS" value="NFBS">NFBS</MenuItem>
                                </Select>
                                {errors.schemeCode && (
                                    <FormHelperText>
                                        <Typography variant="caption" color="error">
                                            {errors.schemeCode}
                                        </Typography>
                                    </FormHelperText>
                                )}
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <FormControl fullWidth>
                                <InputLabel id="finYear">Financial Year&nbsp;<span style={{ color: 'red' }}>*</span></InputLabel>
                                <Select
                                    id="finYear"
                                    labelId="finYear"
                                    name="finYear"
                                    label="Financial Year"
                                    value={formData.finYear}
                                    onChange={handleChangFinYear}>
                                    {finYearList.map((finYear) => (
                                        <MenuItem key={finYear} value={finYear}>{finYear}</MenuItem>
                                    )
                                    )}
                                </Select>
                                {errors.finYear && (
                                    <FormHelperText>
                                        <Typography variant="caption" color="error">
                                            {errors.finYear}
                                        </Typography>
                                    </FormHelperText>
                                )}
                            </FormControl>
                        </Grid>
                     <Grid item xs={12} sm={2}>
                            <FormControl fullWidth>
                                <TextField
                                    id="outlined-basic"
                                    label={
                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                            <span style={{ marginRight: '4px' }}>Captcha Code</span>
                                            <Typography style={{ color: 'red' }}>*</Typography>
                                        </div>
                                    }
                                    variant="outlined"
                                    value={formData.captcha}
                                    name="captcha"
                                    inputProps={{ maxLength: 6 }}
                                    onChange={(e) => handleChange('captcha', e.target.value)}
                                />
                                {/* Display error message for from amount */}
                                {errors.captcha && (
                                    <FormHelperText error id="captcha-error">
                                        {errors.captcha}
                                    </FormHelperText>
                                )}
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={2}>
                            <Box display="flex" alignItems="center">
                                <img
                                    src={`data:image/png;base64,${captchaImage}`}
                                    alt="captcha"
                                    style={{ marginRight: '10px', overflow: 'hidden', borderRadius: '10px' }}
                                />
                                <IconButton onClick={handleRefreshCaptcha} aria-label="refresh captcha" variant="primary">
                                    <RefreshIcon />
                                </IconButton>
                            </Box>
                        </Grid>
                        <Grid item xs={12} alignItems="center">
                            <Button
                                type="submit"
                                variant="contained"
                                color="secondary"
                                disabled={loading} // Disable button when loading
                            >
                                {loading ? 'Submitting...' : 'Submit'}
                            </Button>
                        </Grid>
                    </Grid>
                </form>
                {!!snackbar && (
    <Snackbar open anchorOrigin={{ vertical: 'top', horizontal: 'center' }} onClose={handleCloseSnackbar} autoHideDuration={6000}>
        <Alert {...snackbar} onClose={handleCloseSnackbar} />
    </Snackbar>
)}
            </MainCard>
            {Object.keys(disbursementdata).length > 0 && ( <MainCard title="Disbursement Abstract">
        <div style={{ textAlign: 'left',paddingTop:'10px' }}>
                        <Button variant="contained" style={{ backgroundColor: '#8555a3' }} onClick={() => exportToExcel('Disbursement_Abstract')} >
                            <DownloadIcon/> Excel
                        </Button>
                    </div>
        <div style={{ overflowX: 'auto' }}>
        <TableContainer component={Paper} style={{ maxHeight: 500, border: '1px solid #f0f0f0'  }}>
        <Table   sx={{ minWidth: 650 }} id='Disbursement_Abstract' borderRadius={1} size="small" aria-label="a dense table">
        <TableHead >
        <TableRow style={{ position: 'sticky', top: 0, zIndex: 999,backgroundColor: 'rgba(71, 140, 255, 1)' }}>
          
          <TableCell style={{color:'white'}} align="center" ></TableCell>
            <TableCell style={{color:'white'}} align="center" colSpan={2} >Apr</TableCell>
            <TableCell style={{color:'white'}} align="center" colSpan={2}>May</TableCell>
            <TableCell style={{color:'white'}} align="center" colSpan={2}>June</TableCell>
            <TableCell style={{color:'white'}} align="center" colSpan={2}>July</TableCell>
            <TableCell style={{color:'white'}} align="center" colSpan={2}>Aug</TableCell>
            <TableCell style={{color:'white'}} align="center" colSpan={2}>Sep</TableCell>
            <TableCell style={{color:'white'}} align="center" colSpan={2}>Oct</TableCell>
            <TableCell style={{color:'white'}} align="center" colSpan={2}>Nov</TableCell>
            <TableCell style={{color:'white'}} align="center" colSpan={2}>Dec</TableCell>
            <TableCell style={{color:'white'}} align="center" colSpan={2}>Jan</TableCell>
            <TableCell style={{color:'white'}} align="center" colSpan={2}>Feb</TableCell>
            <TableCell style={{color:'white'}} align="center" colSpan={2}>Mar</TableCell>
            <TableCell style={{color:'white'}} align="center" colSpan={2}>Total</TableCell>
          </TableRow>
          <TableRow style={{ position: 'sticky',  top: 35, zIndex: 998, backgroundColor: 'rgba(71, 140, 255, 1)' }}>
          <TableCell style={{color:'white'}} align="center" rowSpan={2}>Scheme Name</TableCell>
          <TableCell style={{color:'white'}} align="center">P</TableCell>
          <TableCell style={{color:'white'}} align="center">A</TableCell>
          <TableCell style={{color:'white'}} align="center">P</TableCell>
          <TableCell style={{color:'white'}} align="center">A</TableCell>
          <TableCell style={{color:'white'}} align="center">P</TableCell>
          <TableCell style={{color:'white'}} align="center">A</TableCell>
          <TableCell style={{color:'white'}} align="center">P</TableCell>
          <TableCell style={{color:'white'}} align="center">A</TableCell>
          <TableCell style={{color:'white'}} align="center">P</TableCell>
          <TableCell style={{color:'white'}} align="center">A</TableCell>
          <TableCell style={{color:'white'}} align="center">P</TableCell>
          <TableCell style={{color:'white'}} align="center">A</TableCell>
          <TableCell style={{color:'white'}} align="center">P</TableCell>
          <TableCell style={{color:'white'}} align="center">A</TableCell>
          <TableCell style={{color:'white'}} align="center">P</TableCell>
          <TableCell style={{color:'white'}} align="center">A</TableCell>
          <TableCell style={{color:'white'}} align="center">P</TableCell>
          <TableCell style={{color:'white'}} align="center">A</TableCell>
          <TableCell style={{color:'white'}} align="center">P</TableCell>
          <TableCell style={{color:'white'}} align="center">A</TableCell>
          <TableCell style={{color:'white'}} align="center">P</TableCell>
          <TableCell style={{color:'white'}} align="center">A</TableCell>
          <TableCell style={{color:'white'}} align="center">P</TableCell>
          <TableCell style={{color:'white'}} align="center">A</TableCell>
          <TableCell style={{color:'white'}} align="center">P</TableCell>
          <TableCell style={{color:'white'}} align="center">A</TableCell>
          
          </TableRow>
        </TableHead>
        <TableBody>
        {Object.entries(disbursementdata).map(([key, values]) => (
            <React.Fragment key={key}>
            <TableRow key={key}   style={{ backgroundColor: '#f0f0f0' }}>
            <TableCell colSpan={27} align="center"><strong>{key}</strong></TableCell>
           
            </TableRow>
            {values.map((value, innerIndex) => (
            <TableRow key={`${key}_${innerIndex}`} style={{ backgroundColor: 'white' }}>
              <TableCell align="left"><strong>{value.schemeCode ? value.schemeCode : 'Total'}</strong></TableCell> {/* Accessing the 'name' property */}
              <TableCell align="center">{value.apr}</TableCell>
              <TableCell align="center">{value.apramt}</TableCell>
              <TableCell align="center">{value.may}</TableCell>
              <TableCell align="center">{value.mayamt}</TableCell>
              <TableCell align="center">{value.june}</TableCell>
              <TableCell align="center">{value.juneamt}</TableCell>
              <TableCell align="center">{value.july}</TableCell>
              <TableCell align="center">{value.julyamt}</TableCell>
              <TableCell align="center">{value.aug}</TableCell>
              <TableCell align="center">{value.augamt}</TableCell>
              <TableCell align="center">{value.sep}</TableCell>
              <TableCell align="center">{value.sepamt}</TableCell>
              <TableCell align="center">{value.oct}</TableCell>
              <TableCell align="center">{value.octamt}</TableCell>
              <TableCell align="center">{value.nov}</TableCell>
              <TableCell align="center">{value.novamt}</TableCell>
              <TableCell align="center">{value.dec}</TableCell>
              <TableCell align="center">{value.decamt}</TableCell>
              <TableCell align="center">{value.jan}</TableCell>
              <TableCell align="center">{value.janamt}</TableCell>
              <TableCell align="center">{value.feb}</TableCell>
              <TableCell align="center">{value.febamt}</TableCell>
              <TableCell align="center">{value.mar}</TableCell>
              <TableCell align="center">{value.maramt}</TableCell>
              <TableCell align="center">{value.totalP}</TableCell>
              <TableCell align="center">{value.totalA}</TableCell>
            </TableRow>
          ))}
        
            </React.Fragment>
        ))}
        </TableBody>
        <TableFooter style={{backgroundColor:'rgba(71, 140, 255, 1)',color:'white', position: 'sticky', bottom: 0, zIndex: 1000 }}>
            <TableRow>
              <TableCell style={{color:'white'}}><strong>Grand Total</strong></TableCell>
              {Object.values(calculateColumnSums()).map((sum, index) => (
                <TableCell style={{color:'white'}} key={index}>{sum}</TableCell>
              ))}
            </TableRow>
          </TableFooter>
        </Table>
    </TableContainer>
    <div>
  <p>  Total Amount in Lakhs</p>
        <p>P- Total Pensioners</p>
        <p>A - Amount Rs. </p>
      </div>
    </div>
        </MainCard>)}
</div>

    )
}