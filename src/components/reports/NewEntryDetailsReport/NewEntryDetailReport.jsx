import { Alert, Backdrop, Button, CircularProgress, FormControl, Grid, InputLabel, Link, MenuItem, Paper, Select, Snackbar, Table,TableFooter, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@mui/material";
import MainCard from 'ui-component/cards/MainCard';
import React, { useState, useEffect } from 'react';
import axiosInstance from 'hooks/useAuthTokenUrl';
import Alert1 from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import '../../verification/aadharConsentUpdation/aadharConsent.css'
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import DownloadIcon from '@mui/icons-material/Download';

 import reportcss from 'components/common/reportsCSS';

 const NewEntryDetailReport = () => {

     
    const classes = reportcss();
    const [loading, setLoading] = useState(false);
    const [snackbar, setSnackbar] = useState(null);
    const handleCloseSnackbar = () => setSnackbar(null);
    const [finYear, setFinYear] = useState([]);
    const [selectedFinYear, setSelectedFinYear] = useState("");
    const [beneficiaryType, setBeneficiaryType] = useState("BOTH");
    const [statusType, setStatusType] = useState("NEW");
    // const [disburseType, setDisburseType] = useState("DD");
    const [viewState, setViewState] = useState(false);
    const [reportSummary, setReportSummary] = useState(null);
    const [dataSummary,setDataSummary]=useState(null);

    const getFinYear = async () => {
        try {
            setLoading(true);
            const response = await axiosInstance.get("newEntryDetails/getFinanceYears");
            const newData = response.data.map((row) => ({ ...row, id: row.finYearCode }));
            setFinYear(newData);
            // console.log(JSON.stringify(response.data));
        }
        catch (error) {
            setSnackbar({ children: 'Some Internal Error Occured While Getting Finance Years', severity: 'error' });
            console.error('Error fetching Finance Years', error)
        }
        finally {
            setLoading(false);
        }
    }


    const getReportSummary = async (districtCode, subDistrictCode, gpCode) => {

        if (selectedFinYear == "") {
            setSnackbar({ children: 'Please Select Financial Year', severity: 'error' });
            return false;
        }

        const body = { districtCode: districtCode, subDistrictMunicipalAreaCode: subDistrictCode, gramPanchayatCode: gpCode, finYear: selectedFinYear, status: statusType , beneficiaryType:beneficiaryType };
        // console.log(JSON.stringify(body));
        try {
            setLoading(true);
            setViewState(false);
            const response = await axiosInstance.post("newEntryDetails/getReportData", body);
            if(response.status==204){
                setSnackbar({ children: 'No Data Available', severity: 'error' });
                return false;
            }
            setReportSummary(response.data);
            const newData = response.data.reportData.map((row) => ({ ...row, id: row.locationCode }));
            setDataSummary(newData);
            setViewState(true);
        }
        catch (error) {
            setSnackbar({ children: 'Some Internal Error Occured While Getting Summary', severity: 'error' });
            console.error('Error fetching generated Summary', error)
        }
        finally {
            setLoading(false);
        }
    }



    useEffect(() => {
        getFinYear();
    }, [])

    const handleFinYearChange = (event) => {
        if (event.target.value !== "") {
            setSelectedFinYear(event.target.value)
        }
        else {
            setSelectedFinYear("");
        }
    }


    const handleBeneficiaryType = (e) => {
        setBeneficiaryType(e.target.value);
    };


    const handleStatusType = (e) => {
        setStatusType(e.target.value);
    };

    const exportToExcel = (id) => {
        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.table_to_sheet(document.getElementById(id));
        XLSX.utils.book_append_sheet(wb, ws, id);
        const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        saveAs(new Blob([excelBuffer], { type: 'application/octet-stream' }), id + '.xlsx');
      };


      const downloadDataInExcel = async (districtCode, subDistrictCode, gpCode, month) => {
        const body = { districtCode: districtCode, subDistrictMunicipalAreaCode: subDistrictCode, gramPanchayatCode: gpCode, finYear: selectedFinYear, status: statusType , beneficiaryType:beneficiaryType,month:month };
        try {
            setLoading(true);
            const response = await axiosInstance.post("newEntryDetails/getNewEntryDetailsInExcel", body, {
                responseType: 'blob', // specify responseType as 'blob' for binary data
            });

            if (response.status == 204) {
                // alert("No Data Available");
                setSnackbar({ children: 'No Data Available', severity: 'error' });
                return false;
            }

            const blob = new Blob([response.data], { type: 'application/octet-stream' });
            const link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.download = `New_Entry_Details_${statusType}_data.xlsx`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(link.href);

        }
        catch (error) {
            setSnackbar({ children: 'Some Internal Error Occured While fetching data', severity: 'error' });
            console.error('Error fetching data:', error.message);
        }
        finally {
            setLoading(false);
        }
    }


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

        <MainCard title="New Entry Detail Report">

        

            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px', marginBottom: '20px' }}>

                <Grid container spacing={1}>
                    <Grid item xs={12} sm={3}>
                        <FormControl fullWidth >
                            <InputLabel id="finYear-label" style={{ display: 'flex', alignItems: 'center' }}>Financial Year</InputLabel>
                            <Select name="finYear" id="finYear" labelId="finYear-label" label="Financial Year" onChange={handleFinYearChange}  >
                                 {/* <MenuItem value={"0"}>--Select Financial Year--</MenuItem>  */}
                                {finYear.map((item) => (
                                    <MenuItem key={item.id} value={item.completeFinYear}>{item.completeFinYear}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid item xs={12} sm={3}>
                        <FormControl fullWidth>
                            <InputLabel id="beneficiary-label" style={{ display: 'flex', alignItems: 'center' }}>Beneficiary Type</InputLabel>
                            <Select name="area" onChange={handleBeneficiaryType} label="Beneficiary Type" value={beneficiaryType}>
                                <MenuItem value='BOTH'>BOTH</MenuItem>
                                <MenuItem value='NEW_SO_SAVED'>NEW</MenuItem>
                                <MenuItem value='LEGACY_SO_SAVED'>LEGACY</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid item xs={12} sm={3}>
                        <FormControl fullWidth>
                            <InputLabel id="status-label" style={{ display: 'flex', alignItems: 'center' }}>Status Type</InputLabel>
                            <Select name="statusType" onChange={handleStatusType} label="Status Type" value={statusType} >
                                <MenuItem value='NEW'>NEW</MenuItem>
                                <MenuItem value='SO_SAVED'>SANCTION (SO_SAVED)</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid item xs={12} sm={3} style={{ display: 'flex', alignItems: 'center' }}>
                        <Button variant="contained" color="primary" onClick={() => getReportSummary(null, null, null)}>
                            Submit
                        </Button>
                    </Grid>
                </Grid>



            </div>


            {viewState == true &&
            <>

            <Stack sx={{ width: '100%' }} spacing={2}>
                <Alert1 variant="filled" severity="warning" style={{ color: 'red' }}>Note: This report includes <b style={{ color: 'blue' }}>NEW and SO_SAVED</b> beneficiary data only.</Alert1>
            </Stack>    

            <div style={{ textAlign: 'right',marginTop: '20px' }}>
              <Button
                variant="contained"
                style={{ backgroundColor: '#8555a3', marginLeft: '20px' }}
                onClick={() => exportToExcel('new-entry-report')}
              >
                <DownloadIcon/>
                Excel
              </Button>
            </div>

                    {/* <Paper sx={{ width: '100%', overflow: 'hidden' }} style={{ marginTop: '20px' }}> */}
                        <TableContainer component={Paper} className={classes.tableContainer} style={{ marginTop: '20px' }} >
                            <Table  aria-label="sticky table" id='new-entry-report'   className={classes.table} >
                                <TableHead>
                                <TableRow style={{ position: 'sticky', top: -1, zIndex: 999,backgroundColor:'white' }}>
                                {reportSummary.reportLevel == 'D' && (<><TableCell className={classes.stickyHeader}  >District</TableCell></>)}
                                {reportSummary.reportLevel == 'SD' && (<><TableCell className={classes.stickyHeader}  >Sub District</TableCell><TableCell className={classes.stickyHeader}  >Area</TableCell></>)}
                                {reportSummary.reportLevel == 'GP' && (<><TableCell className={classes.stickyHeader}  >Gram Panchayat/Ward </TableCell><TableCell className={classes.stickyHeader}  >Area</TableCell></>)}
                                 <TableCell className={classes.stickyHeader}  >APRIL</TableCell>
                                 <TableCell className={classes.stickyHeader}  >MAY</TableCell>
                                 <TableCell className={classes.stickyHeader}  >JUNE</TableCell>
                                 <TableCell className={classes.stickyHeader}  >JULY</TableCell>
                                 <TableCell className={classes.stickyHeader}  >AUGUST</TableCell>
                                 <TableCell className={classes.stickyHeader}  >SEPTEMBER</TableCell>
                                 <TableCell className={classes.stickyHeader}  >OCTOBER</TableCell>
                                 <TableCell className={classes.stickyHeader}  >NOVEMBER</TableCell>
                                 <TableCell className={classes.stickyHeader}  >DECEMBER</TableCell>
                                 <TableCell className={classes.stickyHeader}  >JANAUARY</TableCell>
                                 <TableCell className={classes.stickyHeader}  >FEBRURARY</TableCell>
                                 <TableCell className={classes.stickyHeader}  >MARCH</TableCell>
                                 <TableCell className={classes.stickyHeader}  >TOTAL</TableCell>
                                </TableRow>
                                </TableHead>
                                <TableBody>
                               


                                {
                                dataSummary.filter(s => s.name != 'GRAND TOTAL').map((temp) => (
                                 <TableRow key={temp.locationCode}>   
                                {reportSummary.reportLevel == 'D' && (<><TableCell className={classes.tableBody}  > <Link color="#1e88e5" style={{ cursor: 'pointer'}} onClick={() => getReportSummary(temp.locationCode, 'ALL', null)} >{temp.name}</Link></TableCell></>)}
                                {reportSummary.reportLevel == 'SD' && (<><TableCell className={classes.tableBody}  > <Link color="#1e88e5" style={{ cursor: 'pointer'}} onClick={() => getReportSummary(null, temp.locationCode, 'ALL')} >{temp.name}</Link></TableCell><TableCell className={classes.tableBody}  >{temp.name2}</TableCell></>)}
                                {reportSummary.reportLevel == 'GP' && (<><TableCell className={classes.tableBody}   >{temp.name}</TableCell><TableCell className={classes.tableBody}  >{temp.name2}</TableCell></>)}

                                 <TableCell className={classes.tableBody} >{temp.apr==0?0:<Link style={{cursor: 'pointer'}} onClick={() => downloadDataInExcel(reportSummary.reportLevel == 'D'?temp.locationCode:null,reportSummary.reportLevel == 'SD'?temp.locationCode:null,reportSummary.reportLevel == 'GP'?temp.locationCode:null,4)}>{temp.apr}</Link>}</TableCell> 
                                 <TableCell className={classes.tableBody} >{temp.may==0?0:<Link style={{cursor: 'pointer'}} onClick={() => downloadDataInExcel(reportSummary.reportLevel == 'D'?temp.locationCode:null,reportSummary.reportLevel == 'SD'?temp.locationCode:null,reportSummary.reportLevel == 'GP'?temp.locationCode:null,5)}>{temp.may}</Link>}</TableCell>
                                 <TableCell className={classes.tableBody} >{temp.jun==0?0:<Link style={{cursor: 'pointer'}} onClick={() => downloadDataInExcel(reportSummary.reportLevel == 'D'?temp.locationCode:null,reportSummary.reportLevel == 'SD'?temp.locationCode:null,reportSummary.reportLevel == 'GP'?temp.locationCode:null,6)}>{temp.jun}</Link>}</TableCell>
                                 <TableCell className={classes.tableBody} >{temp.jul==0?0:<Link style={{cursor: 'pointer'}} onClick={() => downloadDataInExcel(reportSummary.reportLevel == 'D'?temp.locationCode:null,reportSummary.reportLevel == 'SD'?temp.locationCode:null,reportSummary.reportLevel == 'GP'?temp.locationCode:null,7)}>{temp.jul}</Link>}</TableCell>
                                 <TableCell className={classes.tableBody} >{temp.aug==0?0:<Link style={{cursor: 'pointer'}} onClick={() => downloadDataInExcel(reportSummary.reportLevel == 'D'?temp.locationCode:null,reportSummary.reportLevel == 'SD'?temp.locationCode:null,reportSummary.reportLevel == 'GP'?temp.locationCode:null,8)}>{temp.aug}</Link>}</TableCell>
                                 <TableCell className={classes.tableBody} >{temp.sep==0?0:<Link style={{cursor: 'pointer'}} onClick={() => downloadDataInExcel(reportSummary.reportLevel == 'D'?temp.locationCode:null,reportSummary.reportLevel == 'SD'?temp.locationCode:null,reportSummary.reportLevel == 'GP'?temp.locationCode:null,9)}>{temp.sep}</Link>}</TableCell>
                                 <TableCell className={classes.tableBody} >{temp.oct==0?0:<Link style={{cursor: 'pointer'}} onClick={() => downloadDataInExcel(reportSummary.reportLevel == 'D'?temp.locationCode:null,reportSummary.reportLevel == 'SD'?temp.locationCode:null,reportSummary.reportLevel == 'GP'?temp.locationCode:null,10)}>{temp.oct}</Link>}</TableCell>
                                 <TableCell className={classes.tableBody} >{temp.nov==0?0:<Link style={{cursor: 'pointer'}} onClick={() => downloadDataInExcel(reportSummary.reportLevel == 'D'?temp.locationCode:null,reportSummary.reportLevel == 'SD'?temp.locationCode:null,reportSummary.reportLevel == 'GP'?temp.locationCode:null,11)}>{temp.nov}</Link>}</TableCell>
                                 <TableCell className={classes.tableBody} >{temp.dec==0?0:<Link style={{cursor: 'pointer'}} onClick={() => downloadDataInExcel(reportSummary.reportLevel == 'D'?temp.locationCode:null,reportSummary.reportLevel == 'SD'?temp.locationCode:null,reportSummary.reportLevel == 'GP'?temp.locationCode:null,12)}>{temp.dec}</Link>}</TableCell>
                                 <TableCell className={classes.tableBody} >{temp.jan==0?0:<Link style={{cursor: 'pointer'}} onClick={() => downloadDataInExcel(reportSummary.reportLevel == 'D'?temp.locationCode:null,reportSummary.reportLevel == 'SD'?temp.locationCode:null,reportSummary.reportLevel == 'GP'?temp.locationCode:null,1)}>{temp.jan}</Link>}</TableCell>
                                 <TableCell className={classes.tableBody} >{temp.feb==0?0:<Link style={{cursor: 'pointer'}} onClick={() => downloadDataInExcel(reportSummary.reportLevel == 'D'?temp.locationCode:null,reportSummary.reportLevel == 'SD'?temp.locationCode:null,reportSummary.reportLevel == 'GP'?temp.locationCode:null,2)}>{temp.feb}</Link>}</TableCell>
                                 <TableCell className={classes.tableBody} >{temp.mar==0?0:<Link style={{cursor: 'pointer'}} onClick={() => downloadDataInExcel(reportSummary.reportLevel == 'D'?temp.locationCode:null,reportSummary.reportLevel == 'SD'?temp.locationCode:null,reportSummary.reportLevel == 'GP'?temp.locationCode:null,3)}>{temp.mar}</Link>}</TableCell>
                                 <TableCell className={classes.tableFooter} >{temp.total==0?0:<Link style={{cursor: 'pointer', color:'white'}} onClick={() => downloadDataInExcel(reportSummary.reportLevel == 'D'?temp.locationCode:null,reportSummary.reportLevel == 'SD'?temp.locationCode:null,reportSummary.reportLevel == 'GP'?temp.locationCode:null,null)}>{temp.total}</Link>}</TableCell>
                                 
                                </TableRow>
                                ))
                                }    

                                </TableBody>
                                <TableFooter style={{ position: 'sticky', bottom: -1, zIndex: 1000 }}>
                                {
                                dataSummary.filter(s => s.name == 'GRAND TOTAL').map((temp) => (
                                 <TableRow key={temp.locationCode}>   
                                {reportSummary.reportLevel == 'D' && (<><TableCell className={classes.tableFooter}  > {temp.name} </TableCell></>)}
                                {reportSummary.reportLevel == 'SD' && (<><TableCell className={classes.tableFooter}  > {temp.name2} </TableCell><TableCell className={classes.tableFooter}  >{temp.name2}</TableCell></>)}
                                {reportSummary.reportLevel == 'GP' && (<><TableCell className={classes.tableFooter}   > {temp.name} </TableCell><TableCell className={classes.tableFooter}  >{temp.name2}</TableCell></>)}

                                 <TableCell className={classes.tableFooter} >{temp.apr}</TableCell> 
                                 <TableCell className={classes.tableFooter} >{temp.may}</TableCell>
                                 <TableCell className={classes.tableFooter} >{temp.jun}</TableCell>
                                 <TableCell className={classes.tableFooter} >{temp.jul}</TableCell>
                                 <TableCell className={classes.tableFooter} >{temp.aug}</TableCell>
                                 <TableCell className={classes.tableFooter} >{temp.sep}</TableCell>
                                 <TableCell className={classes.tableFooter} >{temp.oct}</TableCell>
                                 <TableCell className={classes.tableFooter} >{temp.nov}</TableCell>
                                 <TableCell className={classes.tableFooter} >{temp.dec}</TableCell>
                                 <TableCell className={classes.tableFooter} >{temp.jan}</TableCell>
                                 <TableCell className={classes.tableFooter} >{temp.feb}</TableCell>
                                 <TableCell className={classes.tableFooter} >{temp.mar}</TableCell>
                                 <TableCell className={classes.tableFooter} >{temp.total}</TableCell>

                                 
                                </TableRow>
                                ))
                                }    
                                </TableFooter>
                            </Table>
                        </TableContainer>
                    {/* </Paper>             */}
                    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }} >
                    {
                        (reportSummary.reportLevel == 'SD' && [2, 3].includes(reportSummary.loginLevel) && <Button type="button" variant="contained" color="error" style={{ marginLeft: '10px' }} title="Back" onClick={() => getReportSummary(null, null, null)} > Back </Button>)

                    }
                    {
                        (reportSummary.reportLevel == 'GP' && <Button type="button" variant="contained" color="error" style={{ marginLeft: '10px' }} title="Back" onClick={() => getReportSummary(dataSummary[0].locationCode.substring(0, 4), [2, 3].includes(reportSummary.loginLevel) ? 'ALL' : null, null)} > Back </Button>)

                    }
                </div>
            </>
            
            }






                        </MainCard>



                    </>)
}
export default NewEntryDetailReport;