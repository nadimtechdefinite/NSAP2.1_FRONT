import { Alert, Backdrop, Button, CircularProgress, Link, Snackbar } from '@mui/material';
import axiosInstance from 'hooks/useAuthTokenUrl';
import React, { useState } from 'react';
import MainCard from 'ui-component/cards/MainCard';
import { useEffect } from 'react';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import reportcss from 'components/common/reportsCSS';
import Alert1 from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import '../verification/aadharConsentUpdation/aadharConsent.css'

const PFMSRegistrationSummary = () => {

    const [loading, setLoading] = useState(false);
    const [reportSummary, setReportSummary] = useState({});
    const [dataSummary, setDataSummary] = useState([]);
    const [snackbar, setSnackbar] = useState(null);
    const handleCloseSnackbar = () => setSnackbar(null);


    const classes = reportcss();


    const columnsReport = [
        { field: 'sno', headerName: 'SNo.', width: 10 },
        {
            field: 'name', align: 'center', headerAlign: 'center', headerName: reportSummary.reportLevel === 'D' ? 'District' : (reportSummary.reportLevel === 'SD' ? 'Sub District' : 'Gram Panchayat'), width: 200,
            renderCell: (params) => (
                params.row.locationCode === 'GRAND TOTAL' ? params.value : reportSummary.reportLevel === 'GP' ? params.value :
                    <Link style={{ cursor: 'pointer', color: 'blue', textDecorationColor: 'blue' }} onClick={() => reportSummary.reportLevel === 'D' ? getReportSummary(params.row.locationCode, 'ALL', null) : reportSummary.reportLevel === 'SD' ? getReportSummary(null, params.row.locationCode, 'ALL') : ''}>
                        {params.value}
                    </Link>

            )
        }, reportSummary.reportLevel === 'D' ? null :
            { field: 'name2', align: 'center', headerAlign: 'center', headerName: reportSummary.reportLevel === 'D' ? '' : 'Area', width: 50, },

        {
            field: 'pfmsRegistered', headerName: 'PFMS Registered', flex: 1, align: 'right', headerAlign: 'center', sortable: false, renderCell: (params) => (
                params.row.locationCode === 'GRAND TOTAL' || params.value === '0' ? params.value :
                    <Link color="#1e88e5" style={{ cursor: 'pointer', textDecoration: 'none' }} title="Download" onClick={() => reportSummary.reportLevel === 'D' ? downloadDataInExcel("All", params.row.locationCode, null, null) : reportSummary.reportLevel === 'SD' ? downloadDataInExcel('All', null, params.row.locationCode, null) : downloadDataInExcel("All", null, null, params.row.locationCode)}>
                        {params.value}
                    </Link>
            )
        },

        {
            field: 'accountBasedRegistered', headerName: 'Account Based Registered', align: 'right', headerAlign: 'center', sortable: false, flex: 1, renderCell: (params) => (
                params.row.locationCode === 'GRAND TOTAL' || params.value === '0' ? params.value :
                    <Link color="#1e88e5" style={{ cursor: 'pointer', textDecoration: 'none' }} title="Download" onClick={() => reportSummary.reportLevel === 'D' ? downloadDataInExcel("NEFT", params.row.locationCode, null, null) : reportSummary.reportLevel === 'SD' ? downloadDataInExcel('NEFT', null, params.row.locationCode, null) : downloadDataInExcel("NEFT", null, null, params.row.locationCode)}>
                        {params.value}
                    </Link>
            )
        },
        {
            field: 'aadhaarBasedRegistered', headerName: 'Aadhaar Based Registered', align: 'right', headerAlign: 'center', sortable: false, flex: 1, renderCell: (params) => (
                params.row.locationCode === 'GRAND TOTAL' || params.value === '0' ? params.value :
                    <Link color="#1e88e5" style={{ cursor: 'pointer', textDecoration: 'none' }} title="Download" onClick={() => reportSummary.reportLevel === 'D' ? downloadDataInExcel("BANK_APB", params.row.locationCode, null, null) : reportSummary.reportLevel === 'SD' ? downloadDataInExcel('BANK_APB', null, params.row.locationCode, null) : downloadDataInExcel("BANK_APB", null, null, params.row.locationCode)}>
                        {params.value}
                    </Link>
            )
        },
        {
            field: 'registeredOnBoth', headerName: 'Registered on Both', align: 'right', headerAlign: 'center', flex: 1, sortable: false, renderCell: (params) => (
                params.row.locationCode === 'GRAND TOTAL' || params.value === '0' ? params.value :
                    <Link color="#1e88e5" style={{ cursor: 'pointer', textDecoration: 'none' }} title="Download" onClick={() => reportSummary.reportLevel === 'D' ? downloadDataInExcel("BOTH_APB_NEFT", params.row.locationCode, null, null) : reportSummary.reportLevel === 'SD' ? downloadDataInExcel('BOTH_APB_NEFT', null, params.row.locationCode, null) : downloadDataInExcel("BOTH_APB_NEFT", null, null, params.row.locationCode)}>
                        {params.value}
                    </Link>
            )
        },
        {
            field: 'pfmsNotRegistered', headerName: 'Not Registered', align: 'right', headerAlign: 'center', flex: 1, sortable: false, renderCell: (params) => (
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    {(params.row.locationCode === 'GRAND TOTAL' || params.value === '0' ? params.value :
                        <Link color="#1e88e5" style={{ cursor: 'pointer', textDecoration: 'none' }} title="Download" onClick={() => reportSummary.reportLevel === 'D' ? downloadDataInExcel(null, params.row.locationCode, null, null) : reportSummary.reportLevel === 'SD' ? downloadDataInExcel(null, null, params.row.locationCode, null) : downloadDataInExcel(null, null, null, params.row.locationCode)}>
                            {params.value}
                        </Link>)}
                </div>
            )
        },
    ].filter(Boolean);


    const getReportSummary = async (districtCode, subDistrictCode, gpCode) => {
        const body = { districtCode: districtCode, subDistrictMunicipalAreaCode: subDistrictCode, gramPanchayatCode: gpCode };
        // console.log(JSON.stringify(body));
        try {
            setLoading(true);
            const response = await axiosInstance.post("pfmsRegistrationSummary/getPFMSRegistrationModeAbstract", body);
            setReportSummary(response.data);
            const newData = response.data.reportData.map((row) => ({ ...row, id: row.locationCode }));
            setDataSummary(newData);
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
        getReportSummary(null, null, null);
    }, []);

    useEffect(() => {
        // console.log(reportSummary);
    }, [dataSummary, reportSummary]);


    const downloadDataInExcel = async (type, districtCode, subDistrictCode, gpCode) => {
        const body = { typeOfReg: type, districtCode: districtCode, subDistrictMunicipalAreaCode: subDistrictCode, gramPanchayatCode: gpCode };
        try {
            setLoading(true);
            const response = await axiosInstance.post("pfmsRegistrationSummary/getRegBeneficiariesInExcel", body, {
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
            link.download = `Beneficiary_${type != null ? type : "not_registered"}_data.xlsx`;
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

        {dataSummary.length > 0 && (<MainCard title="PFMS Registered Mode Abstract">

            <Stack sx={{ width: '100%' }} spacing={2}>
                <Alert1 variant="filled" severity="warning" style={{ color: 'red' }}>Note: This report includes <b style={{ color: 'blue' }}>SO_SAVED and DONE</b> beneficiary data only.</Alert1>
            </Stack>

            <div style={{ height: 600, width: '100%' ,marginTop: '20px' }} className={classes.root}>
                <DataGrid
                    slots={{ toolbar: GridToolbar }}
                    slotProps={{
                        toolbar: {
                            showQuickFilter: true,
                        },
                    }}
                    rows={dataSummary}
                    columns={columnsReport}
                    hideFooterPagination
                    disableRowSelectionOnClick
                    density="compact"
                    
                />
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }} >
                {
                    (reportSummary.reportLevel == 'SD' && [2, 3].includes(reportSummary.loginLevel) && <Button type="button" variant="contained" color="error" style={{ marginLeft: '10px' }} title="Back" onClick={() => getReportSummary(null, null, null)} > Back </Button>)

                }
                {
                    (reportSummary.reportLevel == 'GP' && <Button type="button" variant="contained" color="error" style={{ marginLeft: '10px' }} title="Back" onClick={() => getReportSummary(dataSummary[0].locationCode.substring(0, 4), [2, 3].includes(reportSummary.loginLevel) ? 'ALL' : null, null)} > Back </Button>)

                }
            </div>
        </MainCard>)}
    </>)
}
export default PFMSRegistrationSummary;