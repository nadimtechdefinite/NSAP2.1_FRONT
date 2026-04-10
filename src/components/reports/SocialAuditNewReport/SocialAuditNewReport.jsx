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
        stateCode: '0',
        disCode:'0',
        subDistrict:'0',
        schemeCode: '',
        area:'0',
        captcha: ''
    });

    const [stateData, setStateData] = useState('');
    const [disData, setDisData] = useState('');
    const [areaData, setAreaData] = useState('');
    const [allStateSelect, setAllStateSelect] = useState([]);
    const [allDistrictSelect, setAllDistrictSelect] = useState([]);
    const [allSubDistrictSelect, setAllSubDistrictSelect] = useState([]);
    const [allBenData, setAllBenData] = useState([]);
    const [penLabel, setPenLabel] = useState('');
    const navigate = useNavigate();
    
    function cancelValue(){
        navigate('/nsap/reports');
      }
      
    async function getStateData() {
        try {
          const getStateData = '/social-audit-report/getStateData';
          setLoading(true);
          const response = await axiosInstance.get(getStateData);  
          setAllStateSelect(response.data);
        } catch (error) {
          console.error('Error fetching data :', error);
        }
        finally{
          setLoading(false);
        }
      }

      async function getDistrictData(stCode) {
        try {
          const getStateData = '/common/findAllDistrictByStateId/'+stCode;
          setLoading(true);
          const response =  await axiosInstance.get(getStateData);
          setAllDistrictSelect(response.data);
        } catch (error) {
          console.error('Error fetching data :', error);
        }
        finally{
          setLoading(false);
        }
      }


      async function getSubDistrictData(disCode,arVal) {
        try {
          const getStateData = '/common/findAllSubDistrictByDistrictIdAndAreaId/'+disCode+"/"+arVal;
          setLoading(true);
          const response =  await axiosInstance.get(getStateData);
          setAllSubDistrictSelect(response.data);
        } catch (error) {
          console.error('Error fetching data :', error);
        }
        finally{
          setLoading(false);
        }
      }

    const handleSelectState = (event) => {
    
        setStateData(event.target.value);
        getDistrictData(event.target.value);
        setAllSubDistrictSelect([]);
        setFormData({ ...formData, stateCode: event.target.value,area:'0',subDistrict:'0' });
        setErrors((prevErrors) => {
            const updatedErrors = { ...prevErrors };
            delete updatedErrors.stateCode;
            return updatedErrors;
        });
        setDisData('0');
    };
    const handleChangeSchemeCode = (event) => {
        setFormData({ ...formData, schemeCode: event.target.value });
        setErrors((prevErrors) => {
            const updatedErrors = { ...prevErrors };
            delete updatedErrors.schemeCode;
            return updatedErrors;
        });
    };
    const handleChangeArea = (event) => {
      
        setAreaData(event.target.value);
        getSubDistrictData(disData,event.target.value );
        setFormData({ ...formData, area: event.target.value,subDistrict:'0' });
        setErrors((prevErrors) => {
            const updatedErrors = { ...prevErrors };
            delete updatedErrors.area;
            return updatedErrors;
        });
    };

    const handleChangeSubDis=(event) =>{
        setFormData({ ...formData, subDistrict: event.target.value });
        setErrors((prevErrors) => {
            const updatedErrors = { ...prevErrors };
            delete updatedErrors.subDistrict;
            return updatedErrors;
        });
    }

    async function getPensionerData(stCode,gpCode,scData){
        event.preventDefault(); 
    try {
        const getStateData = '/social-audit-report/getBenificairyRecords/'+stCode+'/'+gpCode+'/'+scData;
        setLoading(true);
        const response =  await axiosInstance.get(getStateData);
        setPenLabel(response.data[0].penLabelData);
        setAllBenData(response.data);
      
      } catch (error) {
        console.error('Error fetching data :', error);
      }
      finally{
        setLoading(false);
      }

    }

    console.log(stateData,areaData );
    const handleSelectDis = (event) => {
       
        setDisData(event.target.value);
        setFormData({ ...formData, disCode: event.target.value,area:'0',subDistrict:'0' });
        setAllSubDistrictSelect([]);       
        setErrors((prevErrors) => {
            const updatedErrors = { ...prevErrors };
            delete updatedErrors.disCode;
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
    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await axiosInstance.get(`/nationalDashboard/getDashboardFormData`);
            const data = response.data;
            setStateList(data.listStates);
            // setFinYearList(data.financialYear);
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
        Promise.all([ fetchCaptcha(),  fetchData()]);
        getStateData()
    }, []);

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
                const postUrl = `/social-audit-report/getSocialAuditRecords`;
                var location = {stData:formData.stateData, disData:formData.disData,arData:formData.area,subData:formData.subDistrict, schemeData:formData.schemeCode,captcha: formData.captcha,captchaToken: captchaToken};
                const response = await axiosInstance.post(postUrl, JSON.stringify(location));
                if (response.data.length > 1) {
                    setBenAbstarctReportData(response.data);
                    setPenLabel('');
                    //console.log(response.data);
                } else {
                    setBenAbstarctReportData([]);
                    setAllBenData([]);
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
        if (formData.stateCode=='0') {
            errors.stateCode = messages_en.stateRequired;
        }

        if (formData.disCode=='0') {
            errors.disCode = messages_en.districtRequired;
        }
           
        if (formData.subDistrict=='0') {
            errors.subDistrict = messages_en.subDistrictRequired;
        } 

        if (!formData.schemeCode) {
            errors.schemeCode = messages_en.schemCodeRequired;
        }

        if (formData.area=='0') {
            errors.area = messages_en.areaRequired;
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
        <MainCard title="Social Audit">
        <Backdrop open={loading} style={{ zIndex: 999, color: '#fff' }}>
        <CircularProgress color="inherit" />
      </Backdrop>
        <form onSubmit={(e) => handleSubmit(e)}>
        <Grid container spacing={2}>
          
          <Grid item xs={12} sm={4}>
          <FormControl fullWidth >
          <InputLabel id="stateId">State&nbsp;<span style={{ color: 'red' }}>*</span></InputLabel>
            <Select labelId="stateId"  id="stateId" label="State" name="stateCode" value={formData.stateCode} onChange={handleSelectState} >
            <MenuItem key="0" value="0">--Select State--</MenuItem>
             {allStateSelect.map((state) => (
              <MenuItem key={state.stateId} value={state.stateId}>{state.stateName}</MenuItem>
           ))}
        </Select>
        {errors.stateCode && (<FormHelperText><Typography variant="caption" color="error">{errors.stateCode}</Typography></FormHelperText>)}
        </FormControl>
        </Grid>


          <Grid item xs={12} sm={4}>
          <FormControl fullWidth >
          <InputLabel id="disCode">District &nbsp;<span style={{ color: 'red' }}>*</span></InputLabel>
            <Select labelId="disCode"  id="disCode" label="District" name="disCode" value={formData.disCode} onChange={handleSelectDis} >
            <MenuItem key="0" value="0">--Select District--</MenuItem> 
             {allDistrictSelect.map((dis) => (
              <MenuItem key={dis.districtId} value={dis.districtId}>{dis.districtName}</MenuItem>
           ))}
          </Select>
        {errors.disCode && (<FormHelperText><Typography variant="caption" color="error">{errors.disCode}</Typography></FormHelperText>)}
        </FormControl>
        </Grid>


          <Grid item xs={12} sm={4}>
          <FormControl fullWidth>
           <InputLabel id="area">Area&nbsp;<span style={{ color: 'red' }}>*</span></InputLabel>
           <Select labelId="area" id="area" label="Area" name="area" value={formData.area} onChange={handleChangeArea}>
            <MenuItem key="0" value="0">--Select Area--</MenuItem> 
            <MenuItem key="R" value="R">Rural</MenuItem>
            <MenuItem key="U" value="U">Urban</MenuItem>  
            </Select>
            {errors.area && (<FormHelperText><Typography variant="caption" color="error">{errors.area}</Typography></FormHelperText>)}
          </FormControl>
          </Grid>


          <Grid item xs={12} sm={4}>
          <FormControl fullWidth >
          <InputLabel id="subDistrict">Sub-District&nbsp;<span style={{ color: 'red' }}>*</span></InputLabel>
            <Select labelId="subDistrict"  id="subDistrict" label="Sub-District" name="subDistrict" value={formData.subDistrict} onChange={handleChangeSubDis} >
            <MenuItem key="0" value="0">-- Select Sub-District --</MenuItem>
             {allSubDistrictSelect.map((state) => (
              <MenuItem key={state.subDistrictMunicipalAreaId} value={state.subDistrictMunicipalAreaId}>{state.subDistrictMunicipalAreaName}</MenuItem>
           ))}
           </Select>
           {errors.subDistrict && (<FormHelperText><Typography variant="caption" color="error">{errors.subDistrict}</Typography></FormHelperText>)}
           </FormControl>
           </Grid>


          <Grid item xs={12} sm={4}>
          <FormControl fullWidth>
         <InputLabel id="schemeCode">Scheme Code&nbsp;<span style={{ color: 'red' }}>*</span></InputLabel>
           <Select labelId="schemeCode" id="schemeCode" label="Scheme Code" name="schemeCode" value={formData.schemeCode} onChange={handleChangeSchemeCode}>
           <MenuItem key="ALLSCH" value="ALLSCH">All Pension Schemes</MenuItem>
            <MenuItem key="IGONAPS" value="IGNOAPS">IGNOAPS</MenuItem>
            <MenuItem key="IGNDPS" value="IGNDPS">IGNDPS</MenuItem>
             <MenuItem key="IGNWPS" value="IGNWPS">IGNWPS</MenuItem>
             <MenuItem key="NFBS" value="NFBS">NFBS</MenuItem>
             </Select>
             {errors.schemeCode && (<FormHelperText><Typography variant="caption" color="error">{errors.schemeCode}</Typography></FormHelperText>)}
            </FormControl>
             </Grid>


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
              <IconButton onClick={handleRefreshCaptcha} aria-label="refresh captcha" variant="primary"> <RefreshIcon /> </IconButton>   
            </Box>
            </Grid>
         

          <Grid item xs={12} alignItems="center">
           <Button type="submit" variant="contained" color="secondary" title="Submit" disabled={loading} >{loading ? 'Submitting...' : 'Submit'}</Button>
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
        {benAbstarctReportData.length > 1 && penLabel ==''  ? <MainCard title="Social Audit Report">
        <div style={{ textAlign: 'left',paddingTop:'10px' }}>
        <Button variant="contained" style={{ backgroundColor: 'blue',marginBottom:'5px' }} onClick={() => exportToExcel('Social Audit')} title="Download Excel">
        <DownloadIcon/> Excel</Button> </div>
        
        <div style={{ overflowX: 'auto' }}>
        <TableContainer component={Paper} style={{ maxHeight: 400, border: '1px solid #f0f0f0'  }}>
        <Table   sx={{ minWidth: 650 }} id='Social Audit' borderRadius={1} size="small" aria-label="a dense table">
        <TableHead >
          
        <TableRow >
  <TableCell style={{borderRightWidth:'1px',borderRightStyle:'',textAlign:'',color:'rgb(51, 181, 229)'}}><b>S.No</b></TableCell>
  <TableCell style={{borderRightWidth:'1px',borderRightStyle:'',textAlign:'',color:'rgb(51, 181, 229)'}}><b>Gram Panchyat/Ward</b></TableCell>
  <TableCell style={{borderRightWidth:'1px',borderRightStyle:'',textAlign:'',color:'rgb(51, 181, 229)'}}><b>Total Bank Account</b></TableCell>
  <TableCell style={{borderRightWidth:'1px',borderRightStyle:'',textAlign:'',color:'rgb(51, 181, 229)'}} ><b>Total P.O. Account</b></TableCell>
  <TableCell style={{borderRightWidth:'1px',borderRightStyle:'',textAlign:'',color:'rgb(51, 181, 229)'}}><b>Total M.O. Account</b></TableCell>
  <TableCell style={{borderRightWidth:'1px',borderRightStyle:'',textAlign:'',color:'rgb(51, 181, 229)'}}><b>Total Cash Account</b></TableCell>
  <TableCell style={{borderRightWidth:'1px',borderRightStyle:'',textAlign:'',color:'rgb(51, 181, 229)'}}><b>Total Aadhar</b></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
        {dataWithoutFooter.map((item,index) => (
            <TableRow key={item.srNo} style={{ backgroundColor: index % 2 === 0 ? 'white' : '#f0f0f0' }}>
            <TableCell>{item.srNo}</TableCell>
            <TableCell> <a style={{color:'blue'}} href={item.gpCode} onClick={() => getPensionerData(item.stData,item.gpCode,item.schemeData)} title="Click Here"> {item.gpName}</a> </TableCell> 
            <TableCell>{item.totalBank}</TableCell>
            <TableCell>{item.totalPO}</TableCell>
            <TableCell>{item.totalMO}</TableCell>
            <TableCell>{item.totalCash}</TableCell>
            <TableCell>{item.totalAadhar}</TableCell>

            </TableRow>
        ))}
        </TableBody>
        <TableFooter style={{backgroundColor:'rgba(71, 140, 255, 1)',color:'white', position: 'sticky', bottom: 0, zIndex: 1000 }}>
        
            <TableRow>
            <TableCell style={{color:'white'}}>{lastRecord.srNo}</TableCell>
            <TableCell style={{color:'white'}}>{lastRecord.gpName =='' ? 'TOTAL' :''}</TableCell>
            <TableCell style={{color:'white'}}>{lastRecord.totalBank}</TableCell>
            <TableCell style={{color:'white'}}>{lastRecord.totalPO}</TableCell>
            <TableCell style={{color:'white'}}>{lastRecord.totalMO}</TableCell>
            <TableCell style={{color:'white'}}>{lastRecord.totalCash}</TableCell>
            <TableCell style={{color:'white'}}>{lastRecord.totalAadhar}</TableCell>
            </TableRow>
       
        </TableFooter>
        </Table>
    </TableContainer>
    </div>
        </MainCard> :''}


        {allBenData.length > 0  && penLabel =='yes' ? <MainCard title="Social Audit Report With Pensioner">
        <div style={{ textAlign: 'left',paddingTop:'10px' }}>
        <Button variant="contained" style={{ backgroundColor: 'blue',marginBottom:'5px' }} title="Download Excel" onClick={() => exportToExcel('Social_Audit_With_Pensioner')} >
        <DownloadIcon/> Excel
        </Button>
        </div>

        <div style={{ overflowX: 'auto' }}>
        <TableContainer component={Paper} style={{ maxHeight: 400, border: '1px solid #f0f0f0'  }}>
        <Table   sx={{ minWidth: 650 }} id='Social_Audit_With_Pensioner' borderRadius={1} size="small" aria-label="a dense table">
        <TableHead >
          
        <TableRow >
  <TableCell style={{borderRightWidth:'1px',borderRightStyle:'',textAlign:'',color:'rgb(51, 181, 229)'}}><b>S.No</b></TableCell>
  <TableCell style={{borderRightWidth:'1px',borderRightStyle:'',textAlign:'',color:'rgb(51, 181, 229)'}}><b>Sanction Order No</b></TableCell>
  <TableCell style={{borderRightWidth:'1px',borderRightStyle:'',textAlign:'',color:'rgb(51, 181, 229)'}}><b>Beneficiary Name</b></TableCell>
  <TableCell style={{borderRightWidth:'1px',borderRightStyle:'',textAlign:'',color:'rgb(51, 181, 229)'}} ><b>Father/Husband Name</b></TableCell>
  <TableCell style={{borderRightWidth:'1px',borderRightStyle:'',textAlign:'',color:'rgb(51, 181, 229)'}}><b>Age/Gender</b></TableCell>
  <TableCell style={{borderRightWidth:'1px',borderRightStyle:'',textAlign:'',color:'rgb(51, 181, 229)'}}><b>Category</b></TableCell>
  <TableCell style={{borderRightWidth:'1px',borderRightStyle:'',textAlign:'',color:'rgb(51, 181, 229)'}}><b>Disbursement Mode</b></TableCell>
  <TableCell style={{borderRightWidth:'1px',borderRightStyle:'',textAlign:'',color:'rgb(51, 181, 229)'}}><b>Scheme</b></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
        {allBenData.map((item,index) => (
            <TableRow key={item.sanctionOrderNo} style={{ backgroundColor: index % 2 === 0 ? 'white' : '#f0f0f0' }}>
            <TableCell>  {item.srNo} </TableCell>
            <TableCell>{item.sanctionOrderNo}</TableCell>
            <TableCell>{item.beneficiaryName}</TableCell>
            <TableCell>{item.fatherHusbandNAme}</TableCell>
            <TableCell>{item.ageGender}</TableCell>
            <TableCell>{item.category}</TableCell>
            <TableCell>{item.disbursementMode}</TableCell>
            <TableCell>{item.schemeData}</TableCell>
            </TableRow>
        ))}
        </TableBody>
        </Table>
    </TableContainer>
    </div>
        </MainCard> :''}

 </div>
    );
}