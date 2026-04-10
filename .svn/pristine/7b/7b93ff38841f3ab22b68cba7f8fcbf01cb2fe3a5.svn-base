import axiosInstance from "hooks/useAuthTokenUrl";
import React, { useState, useEffect } from "react";
import {
    Grid, FormControl, Select, InputLabel, Button,
    TextField, Typography, FormHelperText, Box, IconButton, CircularProgress, Alert,
    Snackbar
} from '@mui/material';
import MainCard from 'ui-component/cards/MainCard';
import { MenuItem } from "@mui/material";
import RefreshIcon from '@mui/icons-material/Refresh';
import config from 'config';
import './dashboardreport.css'; // Import CSS file for styling
import messages_en from 'components/common/messages_en.json';
import axios from 'axios';

export default function DashboardReport() {
    const apiBaseUrl = config.API_BASE_URL;
    const [snackbar, setSnackbar] = useState(null);
    const [stateList, setStateList] = useState([]);
    const [finYearList, setFinYearList] = useState([]);
    const [captchaImage, setCapchaImage] = useState('');
    const [captchaToken, setCaptchaToken] = useState('');
    const [loading, setLoading] = useState(false);
    const [dashboardReportData, setDashboardReportData] = useState([]);
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
        captcha: ''
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

    async function fetchExcelData() {
        try {
            const postUrl = `/nationalDashboard/downloadExcel`;
            var location = {
                stateCode: document.getElementById('hiddenStateCode').value,
                schemeCode: document.getElementById('hiddenSchemeCode').value,
                finYear: document.getElementById('hiddenFinancialYear').value
            };
            const response = await axiosInstance.post(postUrl, JSON.stringify(location), { responseType: 'blob' });
            // Create a Blob from the XLSX data
            if (response.data) {
                const xlsxBlob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
                // Create a link element and trigger a download
                const link = document.createElement('a');
                link.href = window.URL.createObjectURL(xlsxBlob);
                link.download = 'BeneficiaryDetailsDemand.xlsx';
                link.click();
            }
        } catch (e) {
            console.log('error: ', e);
        }
    }

    const handleClickExcelDownLoad = (e) => {
        e.preventDefault();
        fetchExcelData();
    };

    async function fetchPdfData() {
        try {
            const postUrl = `/nationalDashboard/downloadPdf`;
            var location = {
                stateCode: document.getElementById('hiddenStateCode').value,
                schemeCode: document.getElementById('hiddenSchemeCode').value,
                finYear: document.getElementById('hiddenFinancialYear').value
            };
            const response = await axiosInstance.post(postUrl, JSON.stringify(location), { responseType: 'blob' });
            // Create a Blob from the PDF data
            // alert("response.data"+response.data);
            if (response.data) {
                const pdfBlob = new Blob([response.data], { type: 'application/pdf' });
                // Create a link element and trigger a download
                const link = document.createElement('a');
                link.href = window.URL.createObjectURL(pdfBlob);
                link.download = 'DasboardReport.pdf';
                link.click();
            }
        } catch (e) {
            console.log('error: ', e);
        }
    }

    const handleClickPdfDownLoad = (e) => {
        e.preventDefault();
        fetchPdfData();
    };

    const validateForm = () => {
        const errors = {};
        // Add validation logic for each field
        if (!formData.stateCode) {
            errors.stateCode = messages_en.stateRequired;
        }

        if (!formData.schemeCode) {
            errors.schemeCode = messages_en.districtRequired;
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

    async function getDashBoardReportData() {
        const isFormValid = validateForm();
        if (isFormValid) {
            try {
                setLoading(true);
                const postUrl = `/nationalDashboard/getDashboardReportData`;
                var location = {
                    stateCode: formData.stateCode,
                    schemeCode: formData.schemeCode,
                    finYear: formData.finYear,
                    captcha: formData.captcha,
                    captchaToken: captchaToken,
                };
                const response = await axiosInstance.post(postUrl, JSON.stringify(location));
                if (response.data && response.data.length > 1) {
                    setDashboardReportData(response.data);
                } else {
                    setSnackbar({ children: 'No records are found.', severity: 'error' });
                    setDashboardReportData([]);
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

    useEffect(() => {
        if (dashboardReportData.length > 0) {
            const hiddenStateCode = document.getElementById('hiddenStateCode');
            const hiddenSchemeCode = document.getElementById('hiddenSchemeCode');
            const hiddenFinancialYear = document.getElementById('hiddenFinancialYear');
    
            if (hiddenStateCode && hiddenSchemeCode && hiddenFinancialYear) {
                hiddenStateCode.value = formData.stateCode;
                hiddenSchemeCode.value = formData.schemeCode;
                hiddenFinancialYear.value = formData.finYear;
            }
        }
    }, [dashboardReportData]);

    const handleSubmit = (event) => {
        event.preventDefault();
        getDashBoardReportData();
        event.target.reset();
        setFormData(prevState => ({
            ...prevState,
            captcha: '' // Reset captcha value
        }));
    };


    const dashboardReportDataWithSerial = dashboardReportData.map((row, index) => ({
        ...row,
        srNo: index + 1
    }));

    const lastRecord = dashboardReportDataWithSerial[dashboardReportDataWithSerial.length - 1];
    const dashboardReportDataWithoutLast = dashboardReportDataWithSerial.slice(0, -1);
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
            <MainCard title="Dashboard">
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
            </MainCard>
            <br></br>
            <MainCard>
                <Grid container spacing={2}>
                    {dashboardReportDataWithoutLast.length > 0 && (<Grid item xs={12}>
                        <div className="table-container">
                            <table>
                                <thead>
                                    <tr>
                                        <th>SR No</th>
                                        <th>State Name</th>
                                        <th>District Name</th>
                                        <th>Total Beneficiaries digitilized on NSAP-PPS</th>
                                        <th>Total Bank A/C</th>
                                        <th>Total PO A/C</th>
                                        <th>Total Thru MO</th>
                                        <th>Total Thru Cash</th>
                                        <th>Total Mobile No.</th>
                                        <th>Total Aadhaar No.</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {dashboardReportDataWithoutLast.map(item => (
                                        <tr key={item.srNo}>
                                            <td>{item.srNo}</td>
                                            <td>{item.stateName}</td>
                                            <td>{item.districtName}</td>
                                            <td>{item.totalBeneficiary}</td>
                                            <td>{item.totalBankAcc}</td>
                                            <td>{item.totalPoAccount}</td>
                                            <td>{item.totalMoAccount}</td>
                                            <td>{item.totalCash}</td>
                                            <td>{item.totalMobileNo}</td>
                                            <td>{item.totalAddhar}</td>
                                        </tr>
                                    ))}
                                </tbody>
                                {lastRecord && (
                                    <tfoot>
                                        <tr>
                                            <td>{lastRecord.srNo}</td>
                                            <td>GRAND TOTAL</td>
                                            <td>GRAND TOTAL</td>
                                            <td>{lastRecord.totalBeneficiary}</td>
                                            <td>{lastRecord.totalBankAcc}</td>
                                            <td>{lastRecord.totalPoAccount}</td>
                                            <td>{lastRecord.totalMoAccount}</td>
                                            <td>{lastRecord.totalCash}</td>
                                            <td>{lastRecord.totalMobileNo}</td>
                                            <td>{lastRecord.totalAddhar}</td>
                                        </tr>
                                    </tfoot>)}
                            </table>
                        </div>
                    </Grid>)}
                </Grid>
                <br></br>
                {dashboardReportDataWithoutLast.length > 0 && (<Grid container justifyContent="center" spacing={1}>
                    <input id="hiddenStateCode" type="hidden" />
                    <input id="hiddenSchemeCode" type="hidden" />
                    <input id="hiddenFinancialYear" type="hidden" />

                    <Grid item>
                        <Button
                            type="button"
                            variant="contained"
                            color="secondary"
                            onClick={handleClickExcelDownLoad}
                        >
                            DOWNLOAD EXCEL
                        </Button>
                    </Grid>
                    <Grid item>
                        <Button
                            type="button"
                            variant="contained"
                            color="secondary"
                            onClick={handleClickPdfDownLoad}
                        >
                            DOWNLOAD PDF
                        </Button>
                    </Grid>
                </Grid>)}
            </MainCard>

            {!!snackbar && (
                <Snackbar open anchorOrigin={{ vertical: 'top', horizontal: 'center' }} onClose={handleCloseSnackbar} autoHideDuration={6000}>
                    <Alert {...snackbar} onClose={handleCloseSnackbar} />
                </Snackbar>
            )}
        </div>
    );
}

