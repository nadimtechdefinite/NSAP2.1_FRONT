import React, { useState,useEffect } from "react";
import axiosInstance from 'hooks/useAuthTokenUrl';
import { Alert, Backdrop, Box, Button, CircularProgress, FormControl, Grid, IconButton, Paper, Snackbar, Table, TableBody, TableCell, TableContainer, TableRow, TextField, Typography, } from "@mui/material";
import MainCard from "ui-component/cards/MainCard";
import greenArrow from "./images/greenArrow.jpg"
import newApplication from "./images/newApplication.png"
import printing from "./images/printing.png"
import sanctioned from "./images/sanctioned.png"
import rejected from "./images/rejected.png"
import RefreshIcon from '@mui/icons-material/Refresh';



const ApplicationStatusTracker = () => {
    const [loading, setLoading] = useState(false);
    const [snackbar, setSnackbar] = useState(null);
    const handleCloseSnackbar = () => setSnackbar(null);
    const [applicationNo, setApplicationNo] = useState(null);
    const [applicationData, setApplicationData] = useState({});
    const [formData, setFormData] = useState({ });
    const [captchaImage, setCaptchaImage] = useState('');
    const [captchaToken, setCaptchaToken] = useState('');

    const getApplicationStatus = async () => {
        if(formData.captcha==null || formData.captcha.length<6){
            setSnackbar({ children: "Invalid Captcha", severity: 'error' });
            return false;
        }
        var regexPattern = /^[A-Z]{2}-A-\d{8}$/ ;
        console.log(applicationNo==null);
        if (applicationNo==null || !regexPattern.test(applicationNo)) {
            setSnackbar({ children: 'Application No. is Not Valid', severity: 'error' });
            return false;
        } 

        try {
            setLoading(true);
            const response = await axiosInstance.get('applicationTracker/getApplicationStatus/'+ applicationNo+"/"+formData.captcha+"/"+captchaToken);
            if (response.status == 200) {
                setApplicationData(response.data);
                handleRefreshCaptcha();
            }
            else {
                setSnackbar({ children: 'No Data Found', severity: 'error' });
            }
        }
        catch (error) {
            if (error.response.data.message=='Invalid CAPTCHA!') {
                setSnackbar({ children: "Invalid Captcha", severity: 'error' });
            }
            else{
            setSnackbar({ children: 'Some Internal Error Occured While Getting Report Data', severity: 'error' });
            console.error('Error fetching Getting Report Data', error)
            }
        }
        finally {
            setLoading(false);
        }
    }

    const handleInputChangeData = (event) => {
        setApplicationNo(event.target.value);
    };

    const fetchCaptcha = async () => {
        setLoading(true);
        try {
          const response = await axiosInstance.post('/login/captcha', { captchaToken });
          setCaptchaImage(response.data.captchaImage);
          setCaptchaToken(response.data.captchaToken);
        } catch (error) {
          console.error('Error fetching CAPTCHA:', error);
        } finally {
          setLoading(false);
        }
      };

      const handleChangeCaptcha = (event) => {
        setFormData({ ...formData, captcha: event.target.value });
        
      };

      const handleRefreshCaptcha = () => {
        setFormData({ ...formData, captcha: null });
        document.getElementById('captchaId').value='';
        fetchCaptcha();
      };
    
      useEffect(() => {
        fetchCaptcha();
      }, []);

    


    return (<>

        <Backdrop open={loading} style={{ zIndex: 999, color: '#fff' }}>
            <CircularProgress color="inherit" />
        </Backdrop>


        {!!snackbar && (
            <Snackbar
                open
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                onClose={handleCloseSnackbar}
                autoHideDuration={6000}
            >
                <Alert {...snackbar} onClose={handleCloseSnackbar} />
            </Snackbar>
        )}

        <MainCard title="Track Application Status">
            <Grid item xs={12} sm={4} style={{display:"flex"}}>
                <TextField required label="Application No." name="applicationNo" placeholder="Application No." onChange={handleInputChangeData} inputProps={{ maxLength: 13,onInput: (event) => { event.target.value = event.target.value.toUpperCase();} }} />

                {/* <Grid item xs={12} sm={3}> */}
            <FormControl >
            <Box display="flex" alignItems="center">
              <TextField  id="captchaId" label={
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <span style={{ marginRight: '4px' }}>Captcha Code</span>
                    <Typography style={{ color: 'red' }}>*</Typography>
                  </div>
                }  style={{marginLeft:'10px'}}
                variant="outlined" value={formData.captcha} name="captcha"  inputProps={{ maxLength: 6 }} onChange={handleChangeCaptcha}  />
               
        
              <img
                src={`data:image/png;base64,${captchaImage}`}
                alt="captcha"
                style={{ marginLeft: '10px', overflow: 'hidden', borderRadius: '10px' }}
              />
              <IconButton onClick={handleRefreshCaptcha} aria-label="refresh captcha">
                <RefreshIcon />
              </IconButton>
            </Box>
            </FormControl>
          {/* </Grid> */}

                <Button variant="contained" color="primary" onClick={() => getApplicationStatus()} style={{marginLeft:"10px"}}>
                    Submit
                </Button>
            </Grid>


            {Object.keys(applicationData).length > 0 &&
                <>
                    <Paper sx={{ width: '100%', overflow: 'hidden' }} style={{ marginTop: '20px' }}>
                        <TableContainer component={Paper} >
                            <Table  id='seccAadhaar-report'  >
                                <TableBody>
                                    <TableRow>
                                        <TableCell> <strong>Applicant Name : </strong>{applicationData.applicantName}</TableCell><TableCell><strong>Status :</strong> {applicationData.status}</TableCell><TableCell><strong>Application No. :</strong> {applicationData.applicationNo}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell><strong>Father/Husband Name :</strong> {applicationData.fatherHusbandName}</TableCell><TableCell><strong>Application Date :</strong> {applicationData.applicationDate!=null?applicationData.applicationDate:"NA"}</TableCell><TableCell><strong>Verification Date :</strong> {applicationData.verificationDate!=null?applicationData.verificationDate:"NA"}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell><strong>Sanction Date :</strong> {applicationData.sanctionDate!=null?applicationData.sanctionDate:"NA"}</TableCell><TableCell><strong>Pension Effective From Date :</strong> {applicationData.pensionEffectiveFromDate!=null?applicationData.pensionEffectiveFromDate:"NA"}</TableCell><TableCell><strong>Scheme :</strong> {applicationData.schemeCode}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell><strong>Age :</strong> {applicationData.age}</TableCell><TableCell><strong>Gender :</strong> {applicationData.gender}</TableCell><TableCell><strong>Disburse Mode :</strong> {applicationData.disbMode}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell><strong>Verification Remark :</strong> {applicationData.verificationReason!=null?applicationData.verificationReason:"NA"}</TableCell><TableCell><strong>Sanction Remark :</strong> {applicationData.sanctionReason!=null?applicationData.sanctionReason:"NA"}</TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Paper>


                   
                </>
            }
        </MainCard>

            {Object.keys(applicationData).length > 0 &&
                 <div style={{display:"flex",justifyContent:"center"}}>
                 {/* <Paper style={{ marginTop: '20px',padding: '5px', border: '1px solid black' }}  > */}

                     {applicationData.status!=null && applicationData.status.trim() === "NEW" && <img style={{width:"700px"}} src={newApplication} alt="New Application" /> }
                     {applicationData.status!=null && applicationData.status.trim() === "APPROVED" && <img  style={{width:"700px"}} src={greenArrow} alt="Green Arrow" /> }
                     {applicationData.status!=null && applicationData.status.trim() === "SANCTIONED" &&  <img style={{width:"700px"}} src={sanctioned} alt="Sanctioned" /> }
                     {applicationData.status!=null && applicationData.status.trim().includes("SO_SAVED","LEGACY_SO_SAVED") && <img style={{width:"700px"}} src={printing} alt="Printing" /> }
                     {applicationData.status!=null && applicationData.status.trim() === "RETURNED" &&  <img style={{width:"700px"}} src={rejected} alt="Rejected" /> }
                 {/* </Paper> */}
             </div>
            }


    </>)
}
export default ApplicationStatusTracker;