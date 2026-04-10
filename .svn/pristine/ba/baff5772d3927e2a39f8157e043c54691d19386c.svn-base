import React, { useState } from "react";
import axiosInstance from 'hooks/useAuthTokenUrl';
import MainCard from "ui-component/cards/MainCard";
import { Alert, Backdrop, Button, CircularProgress, Snackbar, Table, TableBody, TableCell, TableContainer, TableFooter, TableHead, TableRow } from "@mui/material";
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import DownloadIcon from '@mui/icons-material/Download';

import reportcss from 'components/common/reportsCSS';
import { useEffect } from "react";

const MarkNsapReport = () => {

    const classes = reportcss();
    const [loading, setLoading] = useState(false);
    const [snackbar, setSnackbar] = useState(null);
    const handleCloseSnackbar = () => setSnackbar(null);
    const [dataSummary, setDataSummary] = useState([]);

     

    const getMarkNsapAllStateReport = async () => {
       
        try {
            setLoading(true);
            const response = await axiosInstance.get("mark-nsap-beneficiary/MarkNsapReportAllState");
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


        <MainCard title="MARKED NSAP BENEFICIARY REPORT">
             

            {dataSummary.length > 0 &&
                <>
                    <div style={{ textAlign: 'left',paddingTop:'10px' }}>
                        <Button variant="contained" style={{ backgroundColor: '#8555a3' }} onClick={() => exportToExcel('NSAP_FLAGGED_REPORT')} >
                            <DownloadIcon/> Excel
                        </Button>
                    </div>
                        <TableContainer  className={classes.tableContainer} style={{ marginTop: '20px' }} >
                            <Table  aria-label="sticky table"  id='NSAP_FLAGGED_REPORT' className={classes.table}  >
                                <TableHead >
                                    <TableRow style={{ position: 'sticky', top: -1, zIndex: 999,background: 'white' }} >
                                        <TableCell className={classes.tableBody}   >Sr. No.</TableCell>
                                        <TableCell className={classes.tableBody}   >State</TableCell>
                                        <TableCell className={classes.tableBody} style={{ background:'#d9ebe2'}} colSpan={4}  >IGNOAPS</TableCell>
                                        <TableCell className={classes.tableBody} style={{ background:'#c9d1cd'}} colSpan={4}  >IGNWPS</TableCell>
                                        <TableCell className={classes.tableBody} style={{ background:'#e7c8a7'}} colSpan={4} >IGNDPS</TableCell>
                                    </TableRow>
                                    <TableRow style={{ position: 'sticky', top:1.5, zIndex: 999,background: 'white' }}>
                                        <TableCell className={classes.tableBody}></TableCell>
                                        <TableCell className={classes.tableBody}></TableCell>
                                        <TableCell className={classes.tableBody} >State Cap</TableCell>
                                        <TableCell className={classes.tableBody} >DATA DIGITIZED</TableCell>
                                        <TableCell className={classes.tableBody} >MARKED CENTRAL BENEFICIARY</TableCell>
                                        <TableCell className={classes.tableBody} >ADDITIONAL BENEFICIARY</TableCell>

                                        <TableCell className={classes.tableBody} >State Cap</TableCell>
                                        <TableCell className={classes.tableBody} >DATA DIGITIZED</TableCell>
                                        <TableCell className={classes.tableBody} >MARKED CENTRAL BENEFICIARY</TableCell>
                                        <TableCell className={classes.tableBody} >ADDITIONAL BENEFICIARY</TableCell>

                                        <TableCell className={classes.tableBody} >State Cap</TableCell>
                                        <TableCell className={classes.tableBody} >DATA DIGITIZED</TableCell>
                                        <TableCell className={classes.tableBody} >MARKED CENTRAL BENEFICIARY</TableCell>
                                        <TableCell className={classes.tableBody} >ADDITIONAL BENEFICIARY</TableCell>

                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {
                                        dataSummary.filter(s => s.stateName != 'TOTAL').map((temp) => (
                                            <TableRow key={temp.sno}>
                                                <TableCell className={classes.tableBody} >{temp.sno}</TableCell>
                                                <TableCell className={classes.tableBody} >{temp.stateName}</TableCell>

                                                {temp.ignoaps.addBenef==0?
                                                <>
                                                <TableCell className={classes.tableBody} style={{ background:'#aedd8b'}} >{temp.ignoaps.stateCap}</TableCell>
                                                <TableCell className={classes.tableBody} style={{ background:'#aedd8b'}}>{temp.ignoaps.totalDigitized}</TableCell>
                                                <TableCell className={classes.tableBody} style={{ background:'#aedd8b'}}>{temp.ignoaps.markedCentral}</TableCell>
                                                {/* <TableCell className={classes.tableBody} style={{ background:'#aedd8b'}}>{temp.ignoaps.addBenef}</TableCell> */}
                                                </>
                                                :<>
                                                <TableCell className={classes.tableBody} style={{ background:'#d9ebe2'}} >{temp.ignoaps.stateCap}</TableCell>
                                                <TableCell className={classes.tableBody} style={{ background:'#d9ebe2'}}>{temp.ignoaps.totalDigitized}</TableCell>
                                                <TableCell className={classes.tableBody} style={{ background:'#d9ebe2'}}>{temp.ignoaps.markedCentral}</TableCell>
                                                </>
                                                }
                                                <TableCell className={classes.tableBody} style={{ background:'#d9ebe2'}}>{temp.ignoaps.addBenef}</TableCell>





                                                {temp.ignwps.addBenef==0?
                                                <>
                                                <TableCell className={classes.tableBody} style={{ background:'#aedd8b'}}>{temp.ignwps.stateCap}</TableCell>
                                                <TableCell className={classes.tableBody} style={{ background:'#aedd8b'}}>{temp.ignwps.totalDigitized}</TableCell>
                                                <TableCell className={classes.tableBody} style={{ background:'#aedd8b'}}>{temp.igndps.markedCentral}</TableCell>
                                                {/* <TableCell className={classes.tableBody} style={{ background:'#aedd8b'}}>{temp.ignwps.addBenef}</TableCell> */}
                                                </>
                                                :<>
                                                <TableCell className={classes.tableBody} style={{ background:'#c9d1cd'}}>{temp.ignwps.stateCap}</TableCell>
                                                <TableCell className={classes.tableBody} style={{ background:'#c9d1cd'}}>{temp.ignwps.totalDigitized}</TableCell>
                                                <TableCell className={classes.tableBody} style={{ background:'#c9d1cd'}}>{temp.igndps.markedCentral}</TableCell>
                                                </>
                                                }
                                                <TableCell className={classes.tableBody} style={{ background:'#c9d1cd'}}>{temp.ignwps.addBenef}</TableCell>
                                             


                                                {temp.igndps.addBenef==0?
                                                <>
                                                <TableCell className={classes.tableBody} style={{ background:'#aedd8b'}}>{temp.igndps.stateCap}</TableCell>
                                                <TableCell className={classes.tableBody} style={{ background:'#aedd8b'}}>{temp.igndps.totalDigitized}</TableCell>
                                                <TableCell className={classes.tableBody} style={{ background:'#aedd8b'}}>{temp.igndps.markedCentral}</TableCell>
                                                {/* <TableCell className={classes.tableBody} style={{ background:'#aedd8b'}}>{temp.igndps.addBenef}</TableCell> */}
                                                </>
                                                :
                                                <>
                                                <TableCell className={classes.tableBody} style={{ background:'#e7c8a7'}}>{temp.igndps.stateCap}</TableCell>
                                                <TableCell className={classes.tableBody} style={{ background:'#e7c8a7'}}>{temp.igndps.totalDigitized}</TableCell>
                                                <TableCell className={classes.tableBody} style={{ background:'#e7c8a7'}}>{temp.igndps.markedCentral}</TableCell>
                                                </>
                                                }
                                                <TableCell className={classes.tableBody} style={{ background:'#e7c8a7'}}>{temp.igndps.addBenef}</TableCell> 

  
                                                
                                            </TableRow>
                                        ))
                                    }
                                </TableBody>
                                <TableFooter style={{ position: 'sticky', bottom:-1, zIndex: 1000 }}>
                                    {
                                        dataSummary.filter(s => s.stateName == 'TOTAL').map((temp) => (
                                            <TableRow key={temp.sno}>
                                                
                                                <TableCell className={classes.tableFooter} ></TableCell>
                                                <TableCell className={classes.tableFooter} >{temp.stateName}</TableCell>

                                                <TableCell className={classes.tableFooter} >{temp.ignoaps.stateCap}</TableCell>
                                                <TableCell className={classes.tableFooter} >{temp.ignoaps.totalDigitized}</TableCell>
                                                <TableCell className={classes.tableFooter} >{temp.ignoaps.markedCentral}</TableCell>
                                                <TableCell className={classes.tableFooter} >{temp.ignoaps.addBenef}</TableCell>
 
                                                <TableCell className={classes.tableFooter} >{temp.ignwps.stateCap}</TableCell>
                                                <TableCell className={classes.tableFooter} >{temp.ignwps.totalDigitized}</TableCell>
                                                <TableCell className={classes.tableFooter} >{temp.ignwps.markedCentral}</TableCell>
                                                <TableCell className={classes.tableFooter} >{temp.ignwps.addBenef}</TableCell>
 
                                                <TableCell className={classes.tableFooter} >{temp.igndps.stateCap}</TableCell>
                                                <TableCell className={classes.tableFooter} >{temp.igndps.totalDigitized}</TableCell>
                                                <TableCell className={classes.tableFooter} >{temp.igndps.markedCentral}</TableCell>
                                                <TableCell className={classes.tableFooter} >{temp.igndps.addBenef}</TableCell>                                                

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
export default MarkNsapReport;



