import React, { useState } from "react";
import axiosInstance from 'hooks/useAuthTokenUrl';
import MainCard from "ui-component/cards/MainCard";
import { Alert, Backdrop, Button, CircularProgress, Snackbar, Table, TableBody, TableCell, TableContainer, TableFooter, TableHead, TableRow } from "@mui/material";
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import DownloadIcon from '@mui/icons-material/Download';

import reportcss from 'components/common/reportsCSS';
import { useEffect } from "react";
import Alert1 from '@mui/material/Alert';
import Stack from '@mui/material/Stack';

const MarkNsapPendingForApprovalReport = () => {

    const classes = reportcss();
    const [loading, setLoading] = useState(false);
    const [snackbar, setSnackbar] = useState(null);
    const handleCloseSnackbar = () => setSnackbar(null);
    const [dataSummary, setDataSummary] = useState([]);

     

    const getMarkNsapAllStateReport = async () => {
       
        try {
            setLoading(true);
            const response = await axiosInstance.get("mark-nsap-beneficiary/MarkNsapPendingForApprovalReport");
            if(response.status==204){
                setSnackbar({ children: 'No Data Available', severity: 'error' });
                return false;
            }
            const newData = response.data.map((row) => ({ ...row, id: row.sno }));
            setDataSummary(newData);
        }
        catch (error) {
            setSnackbar({ children: 'Some Internal Error Occured While Getting Report Data', severity: 'error' });
            console.error('Error fetching Getting Report Data', error)
        }
        finally {
            // console.log(dataSummary);
            setLoading(false);
        }
    }

    useEffect (()=>{
        getMarkNsapAllStateReport();
    },[]);

    const exportToExcel = (id) => {
        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.table_to_sheet(document.getElementById(id));
        XLSX.utils.book_append_sheet(wb, ws, id);
        const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        saveAs(new Blob([excelBuffer], { type: 'application/octet-stream' }), id + '.xlsx');
    };

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


        <MainCard title="Pending Central Marking With State For Approval">
             

            {dataSummary.length > 0 &&
                <>
                        <Stack sx={{ width: '100%' }} spacing={2}>
                            <Alert1 variant="filled" severity="warning" style={{ color: 'red' }}>Note: This report include beneficiary Count which are Processed by District and Sub District for Central Marking are pending at <b style={{ color: 'blue' }}>State Level</b>.</Alert1>
                        </Stack>
                    <div style={{ textAlign: 'left',paddingTop:'10px' }}>
                        <Button variant="contained" style={{ backgroundColor: '#8555a3' }} onClick={() => exportToExcel('Pending_Approval_Marking_Report')} >
                            <DownloadIcon/> Excel
                        </Button>
                    </div>
                        <TableContainer  className={classes.tableContainer} style={{ marginTop: '20px' }} >
                            <Table  aria-label="sticky table"  id='Pending_Approval_Marking_Report' className={classes.table}  >
                                <TableHead >
                                    <TableRow style={{ position: 'sticky', top: -1, zIndex: 999,background: 'white' }} >
                                        <TableCell className={classes.stickyHeader}   >Sr. No.</TableCell>
                                        <TableCell className={classes.stickyHeader}   >State</TableCell>
                                        <TableCell className={classes.stickyHeader}   >District</TableCell>

                                        <TableCell className={classes.stickyHeader}   >Pending For Approval IGNOAPS</TableCell>
                                        <TableCell className={classes.stickyHeader}   >Pending For Approval IGNWPS</TableCell>
                                        <TableCell className={classes.stickyHeader}   >Pending For Approval IGNDPS</TableCell>
                                    </TableRow>
                                </TableHead>
                                {/* style={{backgroundColor:'#d6dcdf'}} */}
                                <TableBody>
                                    {
                                        dataSummary.filter(s => s.stateName != 'GRAND TOTAL').map((temp) => (
                                            <TableRow key={temp.sno}>{
                                                temp.districtName=='TOTAL'?
                                                <>
                                                <TableCell className={classes.tableBody} style={{backgroundColor:'#d6dcdf'}} >{temp.sno}</TableCell>
                                                <TableCell className={classes.tableBody} style={{backgroundColor:'#d6dcdf'}} >{temp.stateName}</TableCell>
                                                <TableCell className={classes.tableBody} style={{backgroundColor:'#d6dcdf'}} >{temp.districtName}</TableCell>
                                                <TableCell className={classes.tableBody} style={{backgroundColor:'#d6dcdf'}} >{temp.ignoaps.pendingForApproval}</TableCell>
                                                <TableCell className={classes.tableBody} style={{backgroundColor:'#d6dcdf'}} >{temp.ignwps.pendingForApproval}</TableCell>     
                                                <TableCell className={classes.tableBody} style={{backgroundColor:'#d6dcdf'}} >{temp.igndps.pendingForApproval}</TableCell>
                                                </>:
                                                <>
                                                <TableCell className={classes.tableBody} >{temp.sno}</TableCell>
                                                <TableCell className={classes.tableBody} >{temp.stateName}</TableCell>
                                                <TableCell className={classes.tableBody} >{temp.districtName}</TableCell>
                                                <TableCell className={classes.tableBody} >{temp.ignoaps.pendingForApproval}</TableCell>
                                                <TableCell className={classes.tableBody} >{temp.ignwps.pendingForApproval}</TableCell>     
                                                <TableCell className={classes.tableBody} >{temp.igndps.pendingForApproval}</TableCell>
                                                </>}
                                            </TableRow>
                                        ))
                                    }
                                </TableBody>
                                <TableFooter style={{ position: 'sticky', bottom:-1, zIndex: 1000 }}>
                                    {
                                        dataSummary.filter(s => s.stateName == 'GRAND TOTAL').map((temp) => (
                                            <TableRow key={temp.sno}>
                                                
                                                <TableCell className={classes.tableFooter}  ></TableCell>
                                                <TableCell className={classes.tableFooter}  >{temp.stateName}</TableCell>
                                                <TableCell className={classes.tableFooter}  >{temp.districtName}</TableCell>

                                                <TableCell className={classes.tableFooter} >{temp.ignoaps.pendingForApproval}</TableCell>
                                                <TableCell className={classes.tableFooter} >{temp.ignwps.pendingForApproval}</TableCell>
                                                <TableCell className={classes.tableFooter} >{temp.igndps.pendingForApproval}</TableCell>
                                            </TableRow>
                                        ))
                                    }
                                </TableFooter>
                            </Table>
                        </TableContainer>
                </>
            }
        </MainCard>

    </>)
}
export default MarkNsapPendingForApprovalReport;



