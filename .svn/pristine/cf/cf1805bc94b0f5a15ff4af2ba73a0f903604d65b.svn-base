import React, { useState } from "react";
import axiosInstance from 'hooks/useAuthTokenUrl';
import MainCard from "ui-component/cards/MainCard";
import { Alert, Backdrop, Button, CircularProgress, Grid, Snackbar, Table, TableBody, TableCell, TableContainer, TableFooter, TableHead, TableRow } from "@mui/material";
import SearchComponent from "../../common/checkComponent";
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import DownloadIcon from '@mui/icons-material/Download';

import reportcss from 'components/common/reportsCSS';

const SeccAadhaarReport = () => {

    const classes = reportcss();
    const [loading, setLoading] = useState(false);
    const [snackbar, setSnackbar] = useState(null);
    const handleCloseSnackbar = () => setSnackbar(null);
    const [dataSummary, setDataSummary] = useState([]);

    const [selectedOptions, setSelectedOptions] = useState({});
    const options = { IGNOAPS: "IGNOAPS", IGNWPS: "IGNWPS", IGNDPS: "IGNDPS", NFBS: "NFBS" };

    const handleSearchOptionValuesChange = (newOptionValues) => {
        const ss = Object.keys(newOptionValues).filter((key) => newOptionValues[key]);
        if (JSON.stringify(ss) !== JSON.stringify(selectedOptions)) {
            setSelectedOptions(ss);
        }
    };

    const getSeccAadhaarReport = async () => {
        // console.log(selectedOptions);
        if(selectedOptions.length<1){
            setSnackbar({ children: 'Please select Atleast One Scheme', severity: 'error' });
            return false;
        }
        const body = { schemeCode: selectedOptions };
        try {
            setLoading(true);
            // console.log(JSON.stringify(body));
            const response = await axiosInstance.post("seccAadhaarReport/getData", body);
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


        <MainCard title="SECC TIN Seeding and Aadhaar Status(Only Rural Beneficiaries)">
            <Grid item xs={12} sm={4}>
                <div style={{ display: "flex", alignItems: "center"}} >
                    <div style={{ display: "flex", alignItems: "center" }}>
                        <SearchComponent options={options} onOptionValuesChange={handleSearchOptionValuesChange} />
                    </div>
                    <Button variant="contained" color="primary" style={{marginLeft:"20px"}} onClick={() => getSeccAadhaarReport()}>
                        Submit
                    </Button>
                </div>

            </Grid>

            {dataSummary.length > 0 &&
                <>
                    <div style={{ textAlign: 'left',paddingTop:'10px' }}>
                        <Button variant="contained" style={{ backgroundColor: '#8555a3' }} onClick={() => exportToExcel('SECC_TIN_Aadhaar_report')} >
                            <DownloadIcon/> Excel
                        </Button>
                    </div>
                    {/* <Paper sx={{ width: '100%', overflow: 'hidden' }} style={{ marginTop: '20px' }}> */}
                        <TableContainer  className={classes.tableContainer} style={{ marginTop: '20px' }} >
                            <Table stickyHeader aria-label="sticky table"  id='SECC_TIN_Aadhaar_report' className={classes.table}  >
                                <TableHead >
                                    <TableRow >
                                        <TableCell className={classes.stickyHeader}   >Sr. No.</TableCell>
                                        <TableCell className={classes.stickyHeader}   >State</TableCell>
                                        <TableCell className={classes.stickyHeader}   >(1)<br />Total Pensioners</TableCell>
                                        <TableCell className={classes.stickyHeader}   >(2)<br />Total Automatic Seeded with TIN</TableCell>
                                        <TableCell className={classes.stickyHeader}   >(3)<br />Total Manual Seeded with TIN</TableCell>
                                        <TableCell className={classes.stickyHeader}   >(1-5)<br />Total Not Seeded with TIN</TableCell>
                                        <TableCell className={classes.stickyHeader}   >(4)<br />Total TIN Seeded Yesterday</TableCell>
                                        <TableCell className={classes.stickyHeader}   >(5)<br />Total TIN Seeded </TableCell>
                                        <TableCell className={classes.stickyHeader}   >(6)<br />Percentage Seeded TIN (%)</TableCell>
                                        <TableCell className={classes.stickyHeader}   >(7)<br />Aadhaar in NSAP Database</TableCell>
                                        <TableCell className={classes.stickyHeader}   >(8)<br />Aadhaar in State Aadhaar Vault </TableCell>
                                        <TableCell className={classes.stickyHeader}   >(9)<br />Total Aadhaar Seeded Yesterday</TableCell>
                                        <TableCell className={classes.stickyHeader}   >(10)<br />Percentage Seeded Aadhaar (%)</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {
                                        dataSummary.filter(s => s.state != 'TOTAL').map((temp) => (
                                            <TableRow key={temp.sno}>
                                                <TableCell className={classes.tableBody} >{temp.sno}</TableCell>
                                                <TableCell className={classes.tableBody} >{temp.state}</TableCell>
                                                <TableCell className={classes.tableBody} >{temp.totalPen}</TableCell>
                                                <TableCell className={classes.tableBody} >{temp.totalTinSeededAuto}</TableCell>
                                                <TableCell className={classes.tableBody} >{temp.totalTinSeededMan}</TableCell>
                                                <TableCell className={classes.tableBody} >{temp.totalNotSeededTin}</TableCell>
                                                <TableCell className={classes.tableBody} >{temp.totalTinSeededYest}</TableCell>
                                                <TableCell className={classes.tableBody} >{temp.totalTinSeeded}</TableCell>
                                                <TableCell className={classes.tableBody} >{temp.tinSeededPerc}</TableCell>
                                                <TableCell className={classes.tableBody} >{temp.aadhaarInNSAP}</TableCell>
                                                <TableCell className={classes.tableBody} >{temp.aadhaarInStVault}</TableCell>
                                                <TableCell className={classes.tableBody} >{temp.aadhaarSeededYest}</TableCell>
                                                <TableCell className={classes.tableBody} >{temp.aadhaarSeededPerc}</TableCell>
                                            </TableRow>
                                        ))
                                    }
                                </TableBody>
                                <TableFooter style={{ position: 'sticky', bottom: -1, zIndex: 1000 }}>
                                    {
                                        dataSummary.filter(s => s.state == 'TOTAL').map((temp) => (
                                            <TableRow key={temp.sno}>
                                                <TableCell className={classes.tableFooter} ></TableCell>
                                                <TableCell className={classes.tableFooter} >{temp.state}</TableCell>
                                                <TableCell className={classes.tableFooter} >{temp.totalPen}</TableCell>
                                                <TableCell className={classes.tableFooter} >{temp.totalTinSeededAuto}</TableCell>
                                                <TableCell className={classes.tableFooter} >{temp.totalTinSeededMan}</TableCell>
                                                <TableCell className={classes.tableFooter} >{temp.totalNotSeededTin}</TableCell>
                                                <TableCell className={classes.tableFooter} >{temp.totalTinSeededYest}</TableCell>
                                                <TableCell className={classes.tableFooter} >{temp.totalTinSeeded}</TableCell>
                                                <TableCell className={classes.tableFooter} >{temp.tinSeededPerc}</TableCell>
                                                <TableCell className={classes.tableFooter} >{temp.aadhaarInNSAP}</TableCell>
                                                <TableCell className={classes.tableFooter} >{temp.aadhaarInStVault}</TableCell>
                                                <TableCell className={classes.tableFooter} >{temp.aadhaarSeededYest}</TableCell>
                                                <TableCell className={classes.tableFooter} >{temp.aadhaarSeededPerc}</TableCell>
                                            </TableRow>
                                        ))
                                    }
                                </TableFooter>
                            </Table>
                        </TableContainer>
                    {/* </Paper> */}
                </>
            }
        </MainCard>

    </>)
}
export default SeccAadhaarReport;



