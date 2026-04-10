import React, { useState,useEffect } from "react";
import MainCard from "ui-component/cards/MainCard";
import axiosInstance from "hooks/useAuthTokenUrl";
import {Grid, FormControl,TextField, Select, InputLabel, Typography,FormHelperText,MenuItem,Button,Box, IconButton,Snackbar,Alert,Backdrop,CircularProgress } from '@mui/material';
import { TableContainer, Table, TableHead, TableBody, TableRow, TableCell, TableFooter, Paper } from '@mui/material';
import config from 'config';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import DownloadIcon from '@mui/icons-material/Download';
import RefreshIcon from '@mui/icons-material/Refresh';
import axios from 'axios';
import messages_en from 'components/common/messages_en.json';
import { useNavigate } from 'react-router-dom';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import SearchIcon from '@mui/icons-material/Search';

export default function SocialAuditNewReport() {
    const apiBaseUrl = config.API_BASE_URL;
    const [snackbar, setSnackbar] = useState(null)
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [captchaImage, setCapchaImage] = useState('');
    const [captchaToken, setCaptchaToken] = useState('');
    const handleCloseSnackbar = () => setSnackbar(null);
    const [benAbstarctReportData, setBenAbstarctReportData] = useState([]);
    const [formData, setFormData] = useState({
        finYearData: '0',
        searchByData:'0',
        schemeData:'0',
        areaData: '0',
        captcha: ''
    });

    const [schemeLabel, setSchemeLabel] = useState('');
    const [areaLabel, setAreaLabel] = useState('');
    const [radioLabel, setRadioLabel] = useState('');
    const navigate = useNavigate();

    function cancelValue(){
        navigate('/nsap/reports');
      }

      const handleSearchByData = (event) => {
          var element = document.getElementById('scId');
          var elementOne = document.getElementById('arId');
            if(event.target.value==='completeReport'){
              setFormData({ ...formData, searchByData: event.target.value,schemeData:'0',areaData:'0'});
              element.style.visibility = 'hidden';
              elementOne.style.visibility = 'hidden';
            }else{
              setFormData({ ...formData, searchByData: event.target.value});
              element.style.visibility = 'visible';
              elementOne.style.visibility = 'visible';
            }
            setErrors((prevErrors) => {
              const updatedErrors = { ...prevErrors };
              delete updatedErrors.searchByData;
              return updatedErrors;
          });
        };
      
        const handleChangeFinYear  = (event) => {
          setFormData({ ...formData, finYearData: event.target.value});
          setErrors((prevErrors) => {
            const updatedErrors = { ...prevErrors };
            delete updatedErrors.finYearData;
            return updatedErrors;
        });
        }

        const handleChangeScheme  = (event) => {
          setFormData({ ...formData, schemeData: event.target.value});
          setErrors((prevErrors) => {
            const updatedErrors = { ...prevErrors };
            delete updatedErrors.schemeData;
            return updatedErrors;
        });
        } 

        const handleChangeArea = (event) => {
          setFormData({ ...formData, areaData: event.target.value });
          setErrors((prevErrors) => {
              const updatedErrors = { ...prevErrors };
              delete updatedErrors.areaData;
              return updatedErrors;
          });
      };

    const handleChange = (field, value) => {
        setFormData({ ...formData, [field]: value });
        setErrors((prevErrors) => {
            const updatedErrors = { ...prevErrors };
            delete updatedErrors.captcha;
            return updatedErrors;
        });
    }

    const handleRefreshCaptcha = () => {
        fetchCaptcha();
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
        Promise.all([ fetchCaptcha()]);
    }, []);

    const handleSubmit = (event) => {
        event.preventDefault();
        getStateAbstractPaymentModeAndAadhaarReport();
        event.target.reset();
        setFormData(prevState => ({
            ...prevState,
            captcha: '' // Reset captcha value
        }));
    };
    async function getStateAbstractPaymentModeAndAadhaarReport() {
        const isFormValid = validateForm();
        if (isFormValid) {
            try {
                setLoading(true);
                const postUrl = `/state-abstract-payment-mode-and-aadhaar-report/getStateAbstractPaymentModeAndAadhaarReport`;
                var location = {finYearData:formData.finYearData, searchByData:formData.searchByData,schemeData:formData.schemeData, areaData:formData.areaData,captcha: formData.captcha,captchaToken: captchaToken};
                const response = await axiosInstance.post(postUrl, JSON.stringify(location));
                if (response.data.length > 1) {
                    setSchemeLabel(response.data[0].schemeData);
                    setAreaLabel(response.data[0].areaData);
                    setRadioLabel(response.data[0].radioButtonFilterLabel);
                    setBenAbstarctReportData(response.data);                    
                } else {
                    setBenAbstarctReportData([]);
                    setSnackbar({ children: 'No records are found.', severity: 'error' });
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
        
        if (formData.finYearData=='0') {
            errors.finYearData = messages_en.finYearRequired;
        }

        if (formData.searchByData=='0') {
          errors.searchByData = messages_en.stateRadioChecked;
      }

        if(formData.searchByData==='completeReport'){
            // no mandatory 
        }else{
          if (formData.schemeData=='0') {
            errors.schemeData = messages_en.schemeRequired;
        }
        if (formData.areaData=='0') {
          errors.areaData = messages_en.areaRequired;
      }
        }
        if (!formData.captcha) {
            errors.captcha = messages_en.captchaRequired;
        }  

        // Add more validation logic for other fields...

        setErrors(errors);

        return Object.keys(errors).length === 0; // Return true if no errors
    };
    const lastRecord = benAbstarctReportData[benAbstarctReportData.length - 1];
    const dataWithoutFooter = benAbstarctReportData.slice(0, -1);
    return (
        <div>
        <MainCard title="State Abstract">
        <Backdrop open={loading} style={{ zIndex: 999, color: '#fff' }}>
        <CircularProgress color="inherit" />
      </Backdrop>
        <form onSubmit={(e) => handleSubmit(e)}>
        <Grid container spacing={2}>
          
        <Grid item xs={12} sm={2}>
          <FormControl fullWidth>
           <InputLabel id="finYearData">Financial Year&nbsp;<span style={{ color: 'red' }}>*</span></InputLabel>
           <Select labelId="finYearData" id="finYearData" label="Financial Year" name="finYearData" value={formData.finYearData} onChange={handleChangeFinYear}>
            <MenuItem key="0" value="0">--Select Financial Year--</MenuItem> 
            <MenuItem key="2024-2025" value="2024-2025">2024-2025</MenuItem>
            <MenuItem key="2023-2024" value="2023-2024">2023-2024</MenuItem>  
            <MenuItem key="2022-2023" value="2022-2023">2022-2023</MenuItem>  
            <MenuItem key="2021-2022" value="2021-2022">2021-2022</MenuItem>  
            <MenuItem key="2020-2021" value="2020-2021">2020-2021</MenuItem>  
            <MenuItem key="2019-2020" value="2019-2020">2019-2020</MenuItem> 
            <MenuItem key="2018-2019" value="2018-2019">2018-2019</MenuItem> 
            <MenuItem key="2017-2018" value="2017-2018">2017-2018</MenuItem> 
            <MenuItem key="2016-2017" value="2016-2017">2016-2017</MenuItem>  
            </Select>
            {errors.finYearData && (<FormHelperText><Typography variant="caption" color="error">{errors.finYearData}</Typography></FormHelperText>)}
          </FormControl>
          </Grid>

          <Grid item xs={12} sm={5}>

<RadioGroup style={{marginLeft:'23px',marginTop:'7px'}}
  row
  aria-label="seacrhByStatus"
  name="serachByStatus"
  value={formData.searchByData}
  onChange={handleSearchByData}
>
  <FormControlLabel value="allStateUt" control={<Radio />} label="ALL (States/ UTs)"/>
  <FormControlLabel value="states" control={<Radio />} label="States" />
  <FormControlLabel value="ut" control={<Radio />} label="Union Territories" />
  <FormControlLabel value="completeReport" control={<Radio />} label="Complete Report(R/U)" />
</RadioGroup>
{errors.searchByData && (<FormHelperText><Typography variant="caption" color="error">{errors.searchByData}</Typography></FormHelperText>)}
</Grid>

          <Grid item xs={12} sm={2} style={{marginLeft:'-123px', visibility: 'hidden'}} id='scId'>
          <FormControl fullWidth>
           <InputLabel id="schemeData">Scheme&nbsp;<span style={{ color: 'red' }}>*</span></InputLabel>
           <Select labelId="schemeData" id="schemeData" label="Scheme" name="schemeData" value={formData.schemeData} onChange={handleChangeScheme}>
            <MenuItem key="0" value="0">--Select Scheme--</MenuItem> 
            <MenuItem key="ALL" value="ALL">ALL</MenuItem>
            <MenuItem key="IGNOAPS" value="IGNOAPS">IGNOAPS</MenuItem>
            <MenuItem key="IGNDPS" value="IGNDPS">IGNDPS</MenuItem>
            <MenuItem key="IGNWPS" value="IGNWPS">IGNWPS</MenuItem>  
            <MenuItem key="NFBS" value="NFBS">NFBS</MenuItem>
            </Select>
            {errors.schemeData && (<FormHelperText><Typography variant="caption" color="error">{errors.schemeData}</Typography></FormHelperText>)}
          </FormControl>
          </Grid>


          <Grid item xs={12} sm={2} style={{  visibility: 'hidden'}} id='arId'>
          <FormControl fullWidth>
           <InputLabel id="areaData">Area&nbsp;<span style={{ color: 'red' }}>*</span></InputLabel>
           <Select labelId="areaData" id="areaData" label="Area" name="areaData" value={formData.areaData} onChange={handleChangeArea}>
            <MenuItem key="0" value="0">--Select Area--</MenuItem> 
            <MenuItem key="B" value="B">Both</MenuItem>
            <MenuItem key="R" value="R">Rural</MenuItem>
            <MenuItem key="U" value="U">Urban</MenuItem>  
            </Select>
            {errors.areaData && (<FormHelperText><Typography variant="caption" color="error">{errors.areaData}</Typography></FormHelperText>)}
          </FormControl>
          </Grid>

          </Grid>
          <br/>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={2}>
            <FormControl fullWidth>
            <TextField id="outlined-basic" label={
                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <span style={{ marginRight: '4px' }}>Captcha Code</span>
                                        <Typography style={{ color: 'red' }}>*</Typography>
                                        </div>
                                    }
            variant="outlined" value={formData.captcha} name="captcha" inputProps={{ maxLength: 6 }} onChange={(e) => handleChange('captcha', e.target.value)} />
            {errors.captcha && (<FormHelperText error id="captcha-error">{errors.captcha}</FormHelperText>)}</FormControl>
             </Grid>


            <Grid item xs={12} sm={2}>
             <Box display="flex" alignItems="center">
              <img src={`data:image/png;base64,${captchaImage}`} alt="captcha" style={{ marginRight: '10px', overflow: 'hidden', borderRadius: '10px' }} />
              <IconButton onClick={handleRefreshCaptcha} aria-label="refresh captcha" variant="primary" title="Refresh"> <RefreshIcon /> </IconButton>   
            </Box>
            </Grid>
         

          <Grid item xs={12} alignItems="center">
           <Button type="submit" variant="contained" color="secondary" title="Search" disabled={loading} >{loading ? 'Searching...' : 'Search'} <SearchIcon /></Button>
           &nbsp;<Button variant="contained" color="primary" onClick={() => {cancelValue()}} title='Cancel'>Cancel</Button>
         </Grid>

          </Grid>
        </form>

        {!!snackbar && (
    <Snackbar open anchorOrigin={{ vertical: 'top', horizontal: 'center' }} onClose={handleCloseSnackbar} autoHideDuration={6000}>
        <Alert {...snackbar} onClose={handleCloseSnackbar} />
    </Snackbar>
)}
        </MainCard>
        {radioLabel ==='no' ? 
        benAbstarctReportData.length > 1  ? <MainCard title={`State wise Abstract (Payment mode and Aadhaar) w.r.to Data Digitized SCHEME : ${schemeLabel} AREA : ${areaLabel}`} >
        <div style={{ textAlign: 'left',paddingTop:'10px' }}>
        <Button variant="contained" style={{ backgroundColor: 'blue',marginBottom:'5px' }} onClick={() => exportToExcel('State wise Abstract Report')} title="Download Excel">
        <DownloadIcon/> Excel</Button> </div>
        
        <div style={{ overflowX: 'auto' }}>
        <TableContainer component={Paper} style={{ maxHeight: 400, border: '1px solid #f0f0f0'  }}>
        <Table   sx={{ minWidth: 650 }} id='State wise Abstract Report' borderRadius={1} size="small" aria-label="a dense table">
        <TableHead >
          
        <TableRow >
  <TableCell style={{borderLeft: '0.5px solid rgba(224, 224, 224, 1)', borderRight: '0.5px solid rgba(224, 224, 224, 1)', borderTop: '0.5px solid rgba(224, 224, 224, 1)', borderBottom: '0.5px solid rgba(224, 224, 224, 1)',textAlign:'',color:'rgb(51, 181, 229)'}}><b>S.No</b></TableCell>
  <TableCell style={{borderLeft: '0.5px solid rgba(224, 224, 224, 1)', borderRight: '0.5px solid rgba(224, 224, 224, 1)', borderTop: '0.5px solid rgba(224, 224, 224, 1)', borderBottom: '0.5px solid rgba(224, 224, 224, 1)',textAlign:'',color:'rgb(51, 181, 229)'}}><b>State Name</b></TableCell>
  <TableCell style={{borderLeft: '0.5px solid rgba(224, 224, 224, 1)', borderRight: '0.5px solid rgba(224, 224, 224, 1)', borderTop: '0.5px solid rgba(224, 224, 224, 1)', borderBottom: '0.5px solid rgba(224, 224, 224, 1)',textAlign:'',color:'rgb(51, 181, 229)'}}><b>State Cap</b></TableCell>
  <TableCell style={{borderLeft: '0.5px solid rgba(224, 224, 224, 1)', borderRight: '0.5px solid rgba(224, 224, 224, 1)', borderTop: '0.5px solid rgba(224, 224, 224, 1)', borderBottom: '0.5px solid rgba(224, 224, 224, 1)',textAlign:'',color:'rgb(51, 181, 229)'}}><b>Total Beneficiary</b></TableCell>
  <TableCell style={{borderLeft: '0.5px solid rgba(224, 224, 224, 1)', borderRight: '0.5px solid rgba(224, 224, 224, 1)', borderTop: '0.5px solid rgba(224, 224, 224, 1)', borderBottom: '0.5px solid rgba(224, 224, 224, 1)',textAlign:'',color:'rgb(51, 181, 229)'}}><b>Min Of A & B</b></TableCell>
  <TableCell style={{borderLeft: '0.5px solid rgba(224, 224, 224, 1)', borderRight: '0.5px solid rgba(224, 224, 224, 1)', borderTop: '0.5px solid rgba(224, 224, 224, 1)', borderBottom: '0.5px solid rgba(224, 224, 224, 1)',textAlign:'',color:'rgb(51, 181, 229)'}}><b>With Bank A/C</b></TableCell>
  <TableCell style={{borderLeft: '0.5px solid rgba(224, 224, 224, 1)', borderRight: '0.5px solid rgba(224, 224, 224, 1)', borderTop: '0.5px solid rgba(224, 224, 224, 1)', borderBottom: '0.5px solid rgba(224, 224, 224, 1)',textAlign:'',color:'rgb(51, 181, 229)'}} ><b>With PO A/C</b></TableCell>
  <TableCell style={{borderLeft: '0.5px solid rgba(224, 224, 224, 1)', borderRight: '0.5px solid rgba(224, 224, 224, 1)', borderTop: '0.5px solid rgba(224, 224, 224, 1)', borderBottom: '0.5px solid rgba(224, 224, 224, 1)',textAlign:'',color:'rgb(51, 181, 229)'}}><b>Through MO</b></TableCell>
  <TableCell style={{borderLeft: '0.5px solid rgba(224, 224, 224, 1)', borderRight: '0.5px solid rgba(224, 224, 224, 1)', borderTop: '0.5px solid rgba(224, 224, 224, 1)', borderBottom: '0.5px solid rgba(224, 224, 224, 1)',textAlign:'',color:'rgb(51, 181, 229)'}}><b>Through Cash</b></TableCell>
  <TableCell style={{borderLeft: '0.5px solid rgba(224, 224, 224, 1)', borderRight: '0.5px solid rgba(224, 224, 224, 1)', borderTop: '0.5px solid rgba(224, 224, 224, 1)', borderBottom: '0.5px solid rgba(224, 224, 224, 1)',textAlign:'',color:'rgb(51, 181, 229)'}}><b>Aadhaar in NSAP Database</b></TableCell>
  <TableCell style={{borderLeft: '0.5px solid rgba(224, 224, 224, 1)', borderRight: '0.5px solid rgba(224, 224, 224, 1)', borderTop: '0.5px solid rgba(224, 224, 224, 1)', borderBottom: '0.5px solid rgba(224, 224, 224, 1)',textAlign:'',color:'rgb(51, 181, 229)'}}><b>NPCI Mapper Count</b></TableCell>
  <TableCell style={{borderLeft: '0.5px solid rgba(224, 224, 224, 1)', borderRight: '0.5px solid rgba(224, 224, 224, 1)', borderTop: '0.5px solid rgba(224, 224, 224, 1)', borderBottom: '0.5px solid rgba(224, 224, 224, 1)',textAlign:'',color:'rgb(51, 181, 229)'}}><b>Aadhaar in State Aadhaar Vault</b></TableCell>
  <TableCell style={{borderLeft: '0.5px solid rgba(224, 224, 224, 1)', borderRight: '0.5px solid rgba(224, 224, 224, 1)', borderTop: '0.5px solid rgba(224, 224, 224, 1)', borderBottom: '0.5px solid rgba(224, 224, 224, 1)',textAlign:'',color:'rgb(51, 181, 229)'}}><b>Total Mobile</b></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
        {dataWithoutFooter.map((item,index) => (
            <TableRow key={item.srNo} style={{ backgroundColor: index % 2 === 0 ? 'white' : '#f0f0f0' }}>
            <TableCell style={{borderLeft: '0.5px solid rgba(224, 224, 224, 1)',borderRight: '0.5px solid rgba(224, 224, 224, 1)'}}>{item.srNo}</TableCell>
            <TableCell style={{borderRight: '0.5px solid rgba(224, 224, 224, 1)'}}> {item.stateName}</TableCell> 
            <TableCell style={{borderRight: '0.5px solid rgba(224, 224, 224, 1)'}}>{item.stateCap}</TableCell>
            <TableCell style={{borderRight: '0.5px solid rgba(224, 224, 224, 1)'}}>{item.totalBeneficiary}</TableCell>
            <TableCell style={{borderRight: '0.5px solid rgba(224, 224, 224, 1)'}}>{item.minOfAB}</TableCell>
            <TableCell style={{borderRight: '0.5px solid rgba(224, 224, 224, 1)'}}>{item.totalBankAc}</TableCell>
            <TableCell style={{borderRight: '0.5px solid rgba(224, 224, 224, 1)'}}>{item.totalPoAc}</TableCell>
            <TableCell style={{borderRight: '0.5px solid rgba(224, 224, 224, 1)'}}>{item.totalMo}</TableCell>
            <TableCell style={{borderRight: '0.5px solid rgba(224, 224, 224, 1)'}}>{item.totalCash}</TableCell>
            <TableCell style={{borderRight: '0.5px solid rgba(224, 224, 224, 1)'}}>{item.totalAadhar}</TableCell>
            <TableCell style={{borderRight: '0.5px solid rgba(224, 224, 224, 1)'}}>{item.totalNpci}</TableCell>
            <TableCell style={{borderRight: '0.5px solid rgba(224, 224, 224, 1)'}}>{item.totalAadharVault}</TableCell>
            <TableCell style={{borderRight: '0.5px solid rgba(224, 224, 224, 1)'}}>{item.totalMobile}</TableCell>

            </TableRow>
        ))}
        </TableBody>
        <TableFooter style={{backgroundColor:'rgba(71, 140, 255, 1)',color:'white', position: 'sticky', bottom: 0, zIndex: 1000 }}>
        
            <TableRow>
            <TableCell style={{color:'white',borderLeft: '0.5px solid white',borderRight: '0.5px solid white'}}>{lastRecord.srNo}</TableCell>
            <TableCell style={{color:'white',borderRight: '0.5px solid white'}}>{lastRecord.stateName =='GRAND TOTAL' ? 'GRAND TOTAL' :''}</TableCell>
            <TableCell style={{color:'white',borderRight: '0.5px solid white'}}>{lastRecord.stateCap}</TableCell>
            <TableCell style={{color:'white',borderRight: '0.5px solid white'}}>{lastRecord.totalBeneficiary}</TableCell>
            <TableCell style={{color:'white',borderRight: '0.5px solid white'}}>{lastRecord.minOfAB}</TableCell>
            <TableCell style={{color:'white',borderRight: '0.5px solid white'}}>{lastRecord.totalBankAc}</TableCell>
            <TableCell style={{color:'white',borderRight: '0.5px solid white'}}>{lastRecord.totalPoAc}</TableCell>
            <TableCell style={{color:'white',borderRight: '0.5px solid white'}}>{lastRecord.totalMo}</TableCell>
            <TableCell style={{color:'white',borderRight: '0.5px solid white'}}>{lastRecord.totalCash}</TableCell>
            <TableCell style={{color:'white',borderRight: '0.5px solid white'}}>{lastRecord.totalAadhar}</TableCell>
            <TableCell style={{color:'white',borderRight: '0.5px solid white'}}>{lastRecord.totalNpci}</TableCell>
            <TableCell style={{color:'white',borderRight: '0.5px solid white'}}>{lastRecord.totalAadharVault}</TableCell>
            <TableCell style={{color:'white',borderRight: '0.5px solid white'}}>{lastRecord.totalMobile}</TableCell>
            </TableRow>
       
        </TableFooter>
        </Table>
    </TableContainer>
    </div>
        </MainCard> :''
        : (radioLabel === 'yes' ? 
          //2nd table start from here
          benAbstarctReportData.length > 1  ? <MainCard title={`State wise Scheme wise Rural and Urban Beneficiaries w.r.to Data Digitized   SCHEME : Center Scheme`} >
        <div style={{ textAlign: 'left',paddingTop:'10px' }}>
        <Button variant="contained" style={{ backgroundColor: 'blue',marginBottom:'5px' }} onClick={() => exportToExcel('State wise Abstract Report')} title="Download Excel">
        <DownloadIcon/> Excel</Button> </div>
        
        <div style={{ overflowX: 'auto' }}>
        <TableContainer component={Paper} style={{ maxHeight: 400, border: '1px solid #f0f0f0'  }}>
        <Table   sx={{ minWidth: 650 }} id='State wise Abstract Report' borderRadius={1} size="small" aria-label="a dense table">
        <TableHead >
          
        <TableRow>
    <TableCell rowSpan={3} style={{borderLeft: '0.5px solid rgba(224, 224, 224, 1)', borderRight: '0.5px solid rgba(224, 224, 224, 1)', borderTop: '0.5px solid rgba(224, 224, 224, 1)', borderBottom: '0.5px solid rgba(224, 224, 224, 1)', textAlign: '', color: 'rgb(51, 181, 229)'}}><b>S.No</b></TableCell>
    <TableCell rowSpan={3} style={{borderLeft: '0.5px solid rgba(224, 224, 224, 1)', borderRight: '0.5px solid rgba(224, 224, 224, 1)', borderTop: '0.5px solid rgba(224, 224, 224, 1)', borderBottom: '0.5px solid rgba(224, 224, 224, 1)', textAlign: '', color: 'rgb(51, 181, 229)'}}><b>State</b></TableCell>
    <TableCell rowSpan={3} style={{borderLeft: '0.5px solid rgba(224, 224, 224, 1)', borderRight: '0.5px solid rgba(224, 224, 224, 1)', borderTop: '0.5px solid rgba(224, 224, 224, 1)', borderBottom: '0.5px solid rgba(224, 224, 224, 1)', textAlign: '', color: 'rgb(51, 181, 229)'}}><b>State Cap</b></TableCell>
    <TableCell colSpan={10} style={{borderLeft: '0.5px solid rgba(224, 224, 224, 1)', borderRight: '0.5px solid rgba(224, 224, 224, 1)', borderTop: '0.5px solid rgba(224, 224, 224, 1)', borderBottom: '0.5px solid rgba(224, 224, 224, 1)', textAlign: '', color: 'rgb(51, 181, 229)'}}><b>Data Digitized</b></TableCell>
  </TableRow>

  <TableRow>
    <TableCell colSpan={2} style={{borderLeft: '0.5px solid rgba(224, 224, 224, 1)', borderRight: '0.5px solid rgba(224, 224, 224, 1)', borderTop: '0.5px solid rgba(224, 224, 224, 1)', borderBottom: '0.5px solid rgba(224, 224, 224, 1)', textAlign: '', color: 'rgb(51, 181, 229)'}}><b>IGNOAPS</b></TableCell>
    <TableCell colSpan={2} style={{borderLeft: '0.5px solid rgba(224, 224, 224, 1)', borderRight: '0.5px solid rgba(224, 224, 224, 1)', borderTop: '0.5px solid rgba(224, 224, 224, 1)', borderBottom: '0.5px solid rgba(224, 224, 224, 1)', textAlign: '', color: 'rgb(51, 181, 229)'}}><b>IGNDPS</b></TableCell>
    <TableCell colSpan={2} style={{borderLeft: '0.5px solid rgba(224, 224, 224, 1)', borderRight: '0.5px solid rgba(224, 224, 224, 1)', borderTop: '0.5px solid rgba(224, 224, 224, 1)', borderBottom: '0.5px solid rgba(224, 224, 224, 1)', textAlign: '', color: 'rgb(51, 181, 229)'}}><b>IGNWPS</b></TableCell>
    <TableCell colSpan={2} style={{borderLeft: '0.5px solid rgba(224, 224, 224, 1)', borderRight: '0.5px solid rgba(224, 224, 224, 1)', borderTop: '0.5px solid rgba(224, 224, 224, 1)', borderBottom: '0.5px solid rgba(224, 224, 224, 1)', textAlign: '', color: 'rgb(51, 181, 229)'}}><b>NFBS</b></TableCell>
    <TableCell colSpan={2} style={{borderLeft: '0.5px solid rgba(224, 224, 224, 1)', borderRight: '0.5px solid rgba(224, 224, 224, 1)', borderTop: '0.5px solid rgba(224, 224, 224, 1)', borderBottom: '0.5px solid rgba(224, 224, 224, 1)', textAlign: '', color: 'rgb(51, 181, 229)'}}><b>Total</b></TableCell>
  </TableRow>

  <TableRow>
  <TableCell style={{borderLeft: '0.5px solid rgba(224, 224, 224, 1)', borderRight: '0.5px solid rgba(224, 224, 224, 1)', borderTop: '0.5px solid rgba(224, 224, 224, 1)', borderBottom: '0.5px solid rgba(224, 224, 224, 1)', textAlign: '', color: 'rgb(51, 181, 229)'}}><b>Rural</b></TableCell>
    <TableCell style={{borderLeft: '0.5px solid rgba(224, 224, 224, 1)', borderRight: '0.5px solid rgba(224, 224, 224, 1)', borderTop: '0.5px solid rgba(224, 224, 224, 1)', borderBottom: '0.5px solid rgba(224, 224, 224, 1)', textAlign: '', color: 'rgb(51, 181, 229)'}}><b>Urban</b></TableCell>
    <TableCell style={{borderLeft: '0.5px solid rgba(224, 224, 224, 1)', borderRight: '0.5px solid rgba(224, 224, 224, 1)', borderTop: '0.5px solid rgba(224, 224, 224, 1)', borderBottom: '0.5px solid rgba(224, 224, 224, 1)', textAlign: '', color: 'rgb(51, 181, 229)'}}><b>Rural</b></TableCell>
    <TableCell style={{borderLeft: '0.5px solid rgba(224, 224, 224, 1)', borderRight: '0.5px solid rgba(224, 224, 224, 1)', borderTop: '0.5px solid rgba(224, 224, 224, 1)', borderBottom: '0.5px solid rgba(224, 224, 224, 1)', textAlign: '', color: 'rgb(51, 181, 229)'}}><b>Urban</b></TableCell>
    <TableCell style={{borderLeft: '0.5px solid rgba(224, 224, 224, 1)', borderRight: '0.5px solid rgba(224, 224, 224, 1)', borderTop: '0.5px solid rgba(224, 224, 224, 1)', borderBottom: '0.5px solid rgba(224, 224, 224, 1)', textAlign: '', color: 'rgb(51, 181, 229)'}}><b>Rural</b></TableCell>
    <TableCell style={{borderLeft: '0.5px solid rgba(224, 224, 224, 1)', borderRight: '0.5px solid rgba(224, 224, 224, 1)', borderTop: '0.5px solid rgba(224, 224, 224, 1)', borderBottom: '0.5px solid rgba(224, 224, 224, 1)', textAlign: '', color: 'rgb(51, 181, 229)'}}><b>Urban</b></TableCell>
    <TableCell style={{borderLeft: '0.5px solid rgba(224, 224, 224, 1)', borderRight: '0.5px solid rgba(224, 224, 224, 1)', borderTop: '0.5px solid rgba(224, 224, 224, 1)', borderBottom: '0.5px solid rgba(224, 224, 224, 1)', textAlign: '', color: 'rgb(51, 181, 229)'}}><b>Rural</b></TableCell>
    <TableCell style={{borderLeft: '0.5px solid rgba(224, 224, 224, 1)', borderRight: '0.5px solid rgba(224, 224, 224, 1)', borderTop: '0.5px solid rgba(224, 224, 224, 1)', borderBottom: '0.5px solid rgba(224, 224, 224, 1)', textAlign: '', color: 'rgb(51, 181, 229)'}}><b>Urban</b></TableCell>
    <TableCell style={{borderLeft: '0.5px solid rgba(224, 224, 224, 1)', borderRight: '0.5px solid rgba(224, 224, 224, 1)', borderTop: '0.5px solid rgba(224, 224, 224, 1)', borderBottom: '0.5px solid rgba(224, 224, 224, 1)', textAlign: '', color: 'rgb(51, 181, 229)'}}><b>Rural</b></TableCell>
    <TableCell style={{borderLeft: '0.5px solid rgba(224, 224, 224, 1)', borderRight: '0.5px solid rgba(224, 224, 224, 1)', borderTop: '0.5px solid rgba(224, 224, 224, 1)', borderBottom: '0.5px solid rgba(224, 224, 224, 1)', textAlign: '', color: 'rgb(51, 181, 229)'}}><b>Urban</b></TableCell>
  </TableRow>

        </TableHead>
        <TableBody>
        {dataWithoutFooter.map((item,index) => (
            <TableRow key={item.srNo} style={{ backgroundColor: index % 2 === 0 ? 'white' : '#f0f0f0' }}>
            <TableCell style={{borderLeft: '0.5px solid rgba(224, 224, 224, 1)',borderRight: '0.5px solid rgba(224, 224, 224, 1)'}}>{item.srNo}</TableCell>
            <TableCell style={{borderRight: '0.5px solid rgba(224, 224, 224, 1)'}}> {item.stateName}</TableCell> 
            <TableCell style={{borderRight: '0.5px solid rgba(224, 224, 224, 1)'}}>{item.stateCap}</TableCell>
            <TableCell style={{borderRight: '0.5px solid rgba(224, 224, 224, 1)'}}>{item.totalBeneficiary}</TableCell>
            <TableCell style={{borderRight: '0.5px solid rgba(224, 224, 224, 1)'}}>{item.minOfAB}</TableCell>
            <TableCell style={{borderRight: '0.5px solid rgba(224, 224, 224, 1)'}}>{item.totalBankAc}</TableCell>
            <TableCell style={{borderRight: '0.5px solid rgba(224, 224, 224, 1)'}}>{item.totalPoAc}</TableCell>
            <TableCell style={{borderRight: '0.5px solid rgba(224, 224, 224, 1)'}}>{item.totalMo}</TableCell>
            <TableCell style={{borderRight: '0.5px solid rgba(224, 224, 224, 1)'}}>{item.totalCash}</TableCell>
            <TableCell style={{borderRight: '0.5px solid rgba(224, 224, 224, 1)'}}>{item.totalAadhar}</TableCell>
            <TableCell style={{borderRight: '0.5px solid rgba(224, 224, 224, 1)'}}>{item.totalNpci}</TableCell>
            <TableCell style={{borderRight: '0.5px solid rgba(224, 224, 224, 1)'}}>{item.totalAadharVault}</TableCell>
            <TableCell style={{borderRight: '0.5px solid rgba(224, 224, 224, 1)'}}>{item.totalMobile}</TableCell>

            </TableRow>
        ))}
        </TableBody>
        <TableFooter style={{backgroundColor:'rgba(71, 140, 255, 1)',color:'white', position: 'sticky', bottom: 0, zIndex: 1000 }}>
        
            <TableRow>
            <TableCell style={{color:'white',borderLeft: '0.5px solid white',borderRight: '0.5px solid white'}}>{lastRecord.srNo}</TableCell>
            <TableCell style={{color:'white',borderRight: '0.5px solid white'}}>{lastRecord.stateName =='' ? 'GRAND TOTAL' :''}</TableCell>
            <TableCell style={{color:'white',borderRight: '0.5px solid white'}}>{lastRecord.stateCap}</TableCell>
            <TableCell style={{color:'white',borderRight: '0.5px solid white'}}>{lastRecord.totalBeneficiary}</TableCell>
            <TableCell style={{color:'white',borderRight: '0.5px solid rgba(224, 224, 224, 1)'}}>{lastRecord.minOfAB}</TableCell>
            <TableCell style={{color:'white',borderRight: '0.5px solid rgba(224, 224, 224, 1)'}}>{lastRecord.totalBankAc}</TableCell>
            <TableCell style={{color:'white',borderRight: '0.5px solid rgba(224, 224, 224, 1)'}}>{lastRecord.totalPoAc}</TableCell>
            <TableCell style={{color:'white',borderRight: '0.5px solid rgba(224, 224, 224, 1)'}}>{lastRecord.totalMo}</TableCell>
            <TableCell style={{color:'white',borderRight: '0.5px solid rgba(224, 224, 224, 1)'}}>{lastRecord.totalCash}</TableCell>
            <TableCell style={{color:'white',borderRight: '0.5px solid rgba(224, 224, 224, 1)'}}>{lastRecord.totalAadhar}</TableCell>
            <TableCell style={{color:'white',borderRight: '0.5px solid rgba(224, 224, 224, 1)'}}>{lastRecord.totalNpci}</TableCell>
            <TableCell style={{color:'white',borderRight: '0.5px solid rgba(224, 224, 224, 1)'}}>{lastRecord.totalAadharVault}</TableCell>
            <TableCell style={{color:'white',borderRight: '0.5px solid rgba(224, 224, 224, 1)'}}>{lastRecord.totalMobile}</TableCell>
            </TableRow>
       
        </TableFooter>
        </Table>
    </TableContainer>
    </div>
        </MainCard> :''
          :
          '')
      }
 </div>
    );
}


