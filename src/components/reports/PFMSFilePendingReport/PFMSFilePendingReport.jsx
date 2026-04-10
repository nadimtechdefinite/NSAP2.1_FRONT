import { Alert, Backdrop, Button, CircularProgress, FormControl, Grid, InputLabel, MenuItem, Paper, Select, Snackbar, Table,  TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import MainCard from 'ui-component/cards/MainCard';
import React, { useState, useEffect } from 'react';
import axiosInstance from 'hooks/useAuthTokenUrl';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import reportcss from 'components/common/reportsCSS';
import DownloadIcon from '@mui/icons-material/Download';


const PFMSPendingFileReport = () => {


    const [states, setStates] = useState([]);
    const [selectedState,setSelectedState] = useState("ALL");

    const classes = reportcss();
    const [loading, setLoading] = useState(false);
    const [snackbar, setSnackbar] = useState(null);
    const handleCloseSnackbar = () => setSnackbar(null);
    const [fileType, setFileType] = useState("CPSMS Payment Request");
    const [viewState, setViewState] = useState(false);
    const [dataSummary, setDataSummary] = useState(null);

    useEffect(() => {
        fetchStates();
    }, []);

    const fetchStates = async () => {
        try {
            const getUrl = '/common/findAllState';
            const response = await axiosInstance.get(getUrl);
            setStates(response.data);
        } catch (error) {
            console.error('Error fetching states:', error);
        }
    };

    const getReportSummary = async () => {

        if (fileType == null) {
            setSnackbar({ children: 'Please Select File Type', severity: 'error' });
            return false;
        }
        
        try {
            setLoading(true);
            setViewState(false);
            const response = await axiosInstance.get("BenefPFMSPendingFile/getBeneficiariesPendingFileReport/"+selectedState+"/"+fileType);
            if (response.status == 204) {
                setSnackbar({ children: 'No Data Available', severity: 'error' });
                return false;
            }
            const newData = response.data.map((row) => ({ ...row, id: row.fileName }));
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

    const handleFileTypeChange = (event) => {
            setFileType(event.target.value);
    }

    const exportToExcel = (id) => {
        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.table_to_sheet(document.getElementById(id));
        XLSX.utils.book_append_sheet(wb, ws, id);
        const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        saveAs(new Blob([excelBuffer], { type: 'application/octet-stream' }), id + '.xlsx');
    };

    const handleStateChange = (e) => {
        setSelectedState(e.target.value);
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

        <MainCard title="PFMS Pending File Report">


            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px', marginBottom: '20px' }}>

                <Grid container spacing={1}>
                    <Grid item xs={12} sm={3}>
                        <FormControl fullWidth >
                            <InputLabel id="State-label" style={{ display: 'flex', alignItems: 'center' }}>State</InputLabel>
                            <Select labelId="State-label" id="stateId" label="State" name="stateId" value={selectedState} onChange={handleStateChange}>
                                <MenuItem value="ALL">ALL</MenuItem>
                                {states.map((item) => (
                                    <MenuItem key={item.stateId} value={item.stateId} >
                                        {item.stateName}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>    
                    </Grid>

                    <Grid item xs={12} sm={3}>
                        <FormControl fullWidth>
                            <InputLabel id="fileType-label" style={{ display: 'flex', alignItems: 'center' }}>FileType</InputLabel>
                            <Select name="fileType" id="fileType" labelId="fileType-label" label="Financial Year" value={fileType} onChange={handleFileTypeChange}  >
                                <MenuItem value="CPSMS Payment Request">CPSMS Payment Request</MenuItem> 
                                <MenuItem value="CPSMS Id Request">CPSMS Id Request</MenuItem> 
                            </Select>
                        </FormControl>
                    </Grid>




                    <Grid item xs={12} sm={3} style={{ display: 'flex', alignItems: 'center' }}>
                        <Button variant="contained" color="primary" onClick={() => getReportSummary()}>
                            Submit
                        </Button>
                    </Grid>
                </Grid>



            </div>


            {viewState == true &&
                <>
                    <div style={{ textAlign: 'right' }}>
                        <Button
                            variant="contained"
                            style={{ backgroundColor: '#8555a3', marginLeft: '20px' }}
                            onClick={() => exportToExcel('transaction-report')}
                        >
                            <DownloadIcon/>
                            Excel
                        </Button>
                    </div>

                    {/* <Paper sx={{ width: '100%', overflow: 'hidden' }} style={{ marginTop: '20px' }}> */}
                    <TableContainer component={Paper} className={classes.tableContainer} style={{ marginTop: '20px' }} >
                        <Table aria-label="sticky table" id='transaction-report' className={classes.table} >
                            <TableHead>
                                <TableRow style={{ position: 'sticky', top: -1, zIndex: 999, backgroundColor: 'white' }}>

                                    <TableCell className={classes.tableHeader}  >S.No</TableCell>
                                    <TableCell className={classes.tableHeader}  >State </TableCell>

                                    <TableCell className={classes.tableHeader}  >Request Date</TableCell>
                                    <TableCell className={classes.tableHeader}  >Response Date</TableCell>
                                    <TableCell className={classes.tableHeader}  >Status</TableCell>
                                    <TableCell className={classes.tableHeader}  >File Name</TableCell>
                                    <TableCell className={classes.tableHeader}  >Scheme Code</TableCell>
                                    <TableCell className={classes.tableHeader}  >No Of Record Sent</TableCell>
                                    <TableCell className={classes.tableHeader}  >No Of Success Record</TableCell>
                                    <TableCell className={classes.tableHeader}  >No Of Unsuccessfull Record</TableCell>
                                    <TableCell className={classes.tableHeader}  >Pending Record</TableCell>
                                    <TableCell className={classes.tableHeader}  >Deemed Record</TableCell>
                                    <TableCell className={classes.tableHeader}  >Pending Since</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>



                                {
                                    dataSummary.filter(s => s.stateName != 'TOTAL').map((temp) => (
                                        <TableRow key={temp.sno}>
                                            <TableCell className={classes.tableBody}>{temp.sno}</TableCell>
                                            <TableCell className={classes.tableBody}>{temp.state}</TableCell>
                                            <TableCell className={classes.tableBody}>{temp.requestDate}</TableCell>
                                            <TableCell className={classes.tableBody}>{temp.responseDate}</TableCell>
                                            <TableCell className={classes.tableBody}>{temp.status}</TableCell>
                                            <TableCell className={classes.tableBody}>{temp.fileName}</TableCell>
                                            <TableCell className={classes.tableBody}>{temp.schemeCode}</TableCell>
                                            <TableCell className={classes.tableBody}>{temp.noOfRecordSent}</TableCell>
                                            <TableCell className={classes.tableBody}>{temp.noOfSuccessRecord}</TableCell>
                                            <TableCell className={classes.tableBody}>{temp.noOfUnsuccessRecord}</TableCell>
                                            <TableCell className={classes.tableBody}>{temp.pendingRecord}</TableCell>
                                            <TableCell className={classes.tableBody}>{temp.deemedRecord}</TableCell>
                                            <TableCell className={classes.tableBody}>{temp.pendingSince}</TableCell>
                                        </TableRow>
                                    ))
                                }

                            </TableBody>
                            {/* <TableFooter style={{ position: 'sticky', bottom: 0, zIndex: 1000 }}>
                                {
                                    dataSummary.filter(s => s.stateName === 'TOTAL').map((temp) => (
                                        <TableRow key={temp.sno}>

<TableCell className={classes.tableBody}>{temp.sno}</TableCell>

                                            <TableCell className={classes.tableBody}>{temp.state}</TableCell>
                                            <TableCell className={classes.tableBody}>{temp.requestDate}</TableCell>
                                            <TableCell className={classes.tableBody}>{temp.responseDate}</TableCell>
                                            <TableCell className={classes.tableBody}>{temp.status}</TableCell>
                                            <TableCell className={classes.tableBody}>{temp.fileName}</TableCell>
                                            <TableCell className={classes.tableBody}>{temp.schemeCode}</TableCell>
                                            <TableCell className={classes.tableBody}>{temp.noOfRecordSent}</TableCell>
                                            <TableCell className={classes.tableBody}>{temp.noOfSuccessRecord}</TableCell>
                                            <TableCell className={classes.tableBody}>{temp.noOfUnsuccessRecord}</TableCell>
                                            <TableCell className={classes.tableBody}>{temp.pendingRecord}</TableCell>
                                            <TableCell className={classes.tableBody}>{temp.deemedRecord}</TableCell>
                                            <TableCell className={classes.tableBody}>{temp.pendingSince}</TableCell>
                                     
                                        </TableRow>
                                    ))
                                }
                            </TableFooter> */}
                        </Table>
                    </TableContainer>
                   
                </>

            }

        </MainCard>
    </>)
}
export default PFMSPendingFileReport;