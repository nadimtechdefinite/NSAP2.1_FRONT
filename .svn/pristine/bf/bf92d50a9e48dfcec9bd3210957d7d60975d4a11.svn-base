import {
  Alert,
  Backdrop,
  Button,
  CircularProgress,
  FormControl,
  Grid,
  InputLabel,
  Link,
  MenuItem,
  Paper,
  Select,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import axiosInstance from 'hooks/useAuthTokenUrl';
import React, { useState } from 'react';
import MainCard from 'ui-component/cards/MainCard';
import { useEffect } from 'react';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import reportcss from 'components/common/reportsCSS';
import Alert1 from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import '../../verification/aadharConsentUpdation/aadharConsent.css';

const AnnualVerificationSummary = () => {
  const [loading, setLoading] = useState(false);
  const [reportSummary, setReportSummary] = useState({});
  const [dataSummary, setDataSummary] = useState([]);
  const [snackbar, setSnackbar] = useState(null);
  const handleCloseSnackbar = () => setSnackbar(null);
  const [viewState, setViewState] = useState(false);
  const [discontinuedSummary, setDiscontinuedSummary] = useState([]);
  const [selectedFinYear, setSelectedFinYear] = useState(null);

  const [finYear, setFinYear] = useState([]);

  const classes = reportcss();

  const handleExportPdf = () => {
    const doc = new jsPDF({ orientation: 'landscape' });
    doc.text('Annual Verification Report', 14, 15);

    const headers = columnsReport.filter((col) => col.field && col.headerName).map((col) => col.headerName);

    const tableData = dataSummary.map((row) =>
      columnsReport.filter((col) => col.field && col.headerName).map((col) => row[col.field] ?? '')
    );

    const generatedDate = new Date().toLocaleDateString('en-IN');

    autoTable(doc, {
      startY: 20,
      head: [headers],
      body: tableData,
      styles: {
        fontSize: 8,
        cellPadding: 2
      },
      headStyles: {
        fillColor: [33, 150, 243],
        textColor: 255
      },
      didDrawPage: function () {
        const pageHeight = doc.internal.pageSize.height;
        doc.setFontSize(8);
        doc.setTextColor(100);
        doc.text('Powered By NSAP-PPS - Delivering Reliable Pension Processing', 14, pageHeight - 15);
        doc.text(`Generated From - https://nsap.nic.in/ on - ${generatedDate}`, 14, pageHeight - 10);
      }
    });

    doc.save(`Annual_Verification_Report_${selectedFinYear}.pdf`);
  };

  const CustomToolbarWithExportButton = ({ handleExportPdf, ...toolbarProps }) => {
    return (
      <Stack direction="row" justifyContent="space-between" alignItems="center" p={1}>
        <GridToolbar {...toolbarProps} />
        <Button variant="contained" onClick={handleExportPdf}>
          Download PDF
        </Button>
      </Stack>
    );
  };

  const columnsReport = [
    { field: 'sno', headerName: 'SNo.', width: 10 },
    {
      field: 'name',
      align: 'center',
      headerAlign: 'center',
      headerName: reportSummary.reportLevel === 'D' ? 'District' : reportSummary.reportLevel === 'SD' ? 'Sub District' : 'Gram Panchayat',
      width: 200,
      renderCell: (params) =>
        params.row.locationCode === 'GRAND TOTAL' ? (
          params.value
        ) : reportSummary.reportLevel === 'GP' ? (
          params.value
        ) : (
          <Link
            style={{ cursor: 'pointer', color: 'blue', textDecorationColor: 'blue' }}
            onClick={() =>
              reportSummary.reportLevel === 'D'
                ? getReportSummary(params.row.locationCode, 'ALL', null)
                : reportSummary.reportLevel === 'SD'
                ? getReportSummary(null, params.row.locationCode, 'ALL')
                : ''
            }
          >
            {params.value}
          </Link>
        )
    },
    reportSummary.reportLevel === 'D'
      ? null
      : { field: 'name2', align: 'center', headerAlign: 'center', headerName: reportSummary.reportLevel === 'D' ? '' : 'Area', width: 50 },

    {
      field: 'totalBeneficiaries',
      headerName: 'Total Beneficiaries',
      align: 'right',
      headerAlign: 'center',
      flex: 1,
      sortable: false,
      renderCell: (params) => (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          {params.row.locationCode === 'GRAND TOTAL' || params.value === '0' ? (
            params.value
          ) : (
            <Link
              color="#1e88e5"
              style={{ cursor: 'pointer', textDecoration: 'none' }}
              title="Download"
              onClick={() =>
                reportSummary.reportLevel === 'D'
                  ? downloadDataInExcel('ALL', params.row.locationCode, null, null)
                  : reportSummary.reportLevel === 'SD'
                  ? downloadDataInExcel('ALL', null, params.row.locationCode, null)
                  : downloadDataInExcel('ALL', null, null, params.row.locationCode)
              }
            >
              {params.value}
            </Link>
          )}
        </div>
      )
    },

    {
      field: 'continued',
      headerName: 'Continued',
      flex: 1,
      align: 'right',
      headerAlign: 'center',
      sortable: false,
      renderCell: (params) =>
        params.row.locationCode === 'GRAND TOTAL' || params.value === '0' ? (
          params.value
        ) : (
          <Link
            color="#1e88e5"
            style={{ cursor: 'pointer', textDecoration: 'none' }}
            title="Download"
            onClick={() =>
              reportSummary.reportLevel === 'D'
                ? downloadDataInExcel('ELI', params.row.locationCode, null, null)
                : reportSummary.reportLevel === 'SD'
                ? downloadDataInExcel('ELI', null, params.row.locationCode, null)
                : downloadDataInExcel('ELI', null, null, params.row.locationCode)
            }
          >
            {params.value}
          </Link>
        )
    },

    {
      field: 'discontinued',
      headerName: 'Discontinued',
      align: 'right',
      headerAlign: 'center',
      sortable: false,
      flex: 1,
      renderCell: (params) =>
        params.row.locationCode === 'GRAND TOTAL' || params.value === '0' ? (
          params.value
        ) : (
          <Link
            color="#1e88e5"
            style={{ cursor: 'pointer', textDecoration: 'none' }}
            title="Download"
            onClick={() =>
              reportSummary.reportLevel === 'D'
                ? getDiscontinuedSummary(params.row.locationCode, null, null)
                : reportSummary.reportLevel === 'SD'
                ? getDiscontinuedSummary(null, params.row.locationCode, null)
                : getDiscontinuedSummary(null, null, params.row.locationCode)
            }
          >
            {params.value}
          </Link>
        )
    },

    {
      field: 'notVerified',
      headerName: 'Not Verified',
      align: 'right',
      headerAlign: 'center',
      sortable: false,
      flex: 1,
      renderCell: (params) =>
        params.row.locationCode === 'GRAND TOTAL' || params.value === '0' ? (
          params.value
        ) : (
          <Link
            color="#1e88e5"
            style={{ cursor: 'pointer', textDecoration: 'none' }}
            title="Download"
            onClick={() =>
              reportSummary.reportLevel === 'D'
                ? downloadDataInExcel('NOTVERIFIED', params.row.locationCode, null, null)
                : reportSummary.reportLevel === 'SD'
                ? downloadDataInExcel('NOTVERIFIED', null, params.row.locationCode, null)
                : downloadDataInExcel('NOTVERIFIED', null, null, params.row.locationCode)
            }
          >
            {params.value}
          </Link>
        )
    }
  ].filter(Boolean);

  const getFinYear = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('annualVerificationSummary/getFinanceYears');
      console.log(JSON.stringify(response.data));
      const newData = response.data.map((row) => ({ ...row, id: row.finYearCode }));
      setFinYear(newData);
      // console.log(JSON.stringify(response.data));
    } catch (error) {
      setSnackbar({ children: 'Some Internal Error Occured While Getting Finance Years', severity: 'error' });
      console.error('Error fetching Finance Years', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getFinYear();
  }, []);

  // useEffect(()=>{
  //     console.log(JSON.stringify(finYear));
  // },[finYear]);

  const getDiscontinuedSummary = async (districtCode, subDistrictCode, gpCode) => {
    const body = {
      districtCode: districtCode,
      subDistrictMunicipalAreaCode: subDistrictCode,
      gramPanchayatCode: gpCode,
      finYear: selectedFinYear
    };
    try {
      setLoading(true);
      const response = await axiosInstance.post('annualVerificationSummary/getDiscontinuedDetails', body);
      // setReportSummary(response.data);
      const newData = response.data.discontinuedData.map((row) => ({
        ...row,
        id: row.ded,
        locationCode: districtCode != null ? districtCode : subDistrictCode != null ? subDistrictCode : gpCode
      }));
      setDiscontinuedSummary(newData);
      setViewState(true);
    } catch (error) {
      setSnackbar({ children: 'Some Internal Error Occured While Getting Summary', severity: 'error' });
      console.error('Error fetching Summary', error);
    } finally {
      setLoading(false);
    }
  };

  const getReportSummary = async (districtCode, subDistrictCode, gpCode) => {
    const body = {
      districtCode: districtCode,
      subDistrictMunicipalAreaCode: subDistrictCode,
      gramPanchayatCode: gpCode,
      finYear: selectedFinYear
    };
    // console.log(JSON.stringify(body));
    try {
      setLoading(true);
      setViewState(false);
      const response = await axiosInstance.post('annualVerificationSummary/getAnnualVerificationSummary', body);
      setReportSummary(response.data);
      const newData = response.data.reportData.map((row) => ({ ...row, id: row.locationCode }));
      setDataSummary(newData);
    } catch (error) {
      setSnackbar({ children: 'Some Internal Error Occured While Getting Summary', severity: 'error' });
      console.error('Error fetching generated Summary', error);
    } finally {
      setLoading(false);
    }
  };

  const getReportData = () => {
    // console.log(selectedFinYear);
    if (selectedFinYear == null) {
      setSnackbar({ children: 'Please Select Financial Year', severity: 'error' });
      return false;
    }
    getReportSummary(null, null, null);
  };

  // useEffect(() => {
  //     getReportSummary(null, null, null);
  // }, []);

  useEffect(() => {
    // console.log(reportSummary);
  }, [dataSummary, reportSummary]);

  const downloadDataInExcel = async (statusType, districtCode, subDistrictCode, gpCode) => {
    const body = {
      statusType: statusType,
      districtCode: districtCode,
      subDistrictMunicipalAreaCode: subDistrictCode,
      gramPanchayatCode: gpCode,
      finYear: selectedFinYear
    };
    console.log(JSON.stringify(body));
    try {
      setLoading(true);
      const response = await axiosInstance.post('annualVerificationSummary/getAnnualVerificationBeneficiariesInExcel', body, {
        responseType: 'blob' // specify responseType as 'blob' for binary data
      });

      if (response.status == 204) {
        // alert("No Data Available");
        setSnackbar({ children: 'No Data Available', severity: 'error' });
        return false;
      }

      const blob = new Blob([response.data], { type: 'application/octet-stream' });
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = `Beneficiary_${statusType}_data.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(link.href);
    } catch (error) {
      setSnackbar({ children: 'Some Internal Error Occured While fetching data', severity: 'error' });
      console.error('Error fetching data:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFinYearChange = (event) => {
    // if (event.target.value !== 0) {
    setSelectedFinYear(event.target.value);
    // }
    // else {
    //     setSelectedFinYear(null);
    // }
  };

  return (
    <>
      <Backdrop open={loading} style={{ zIndex: 999, color: '#fff' }}>
        <CircularProgress color="inherit" />
      </Backdrop>

      {!!snackbar && (
        <Snackbar open anchorOrigin={{ vertical: 'top', horizontal: 'center' }} onClose={handleCloseSnackbar} autoHideDuration={6000}>
          <Alert {...snackbar} onClose={handleCloseSnackbar} />
        </Snackbar>
      )}

      <MainCard title="ANNUAL VERIFICATION SUMMARY">
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px', marginBottom: '20px' }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <InputLabel id="finYear-label" style={{ display: 'flex', alignItems: 'center' }}>
                  Financial Year
                </InputLabel>
                <Select name="finYear" id="finYear" labelId="finYear-label" label="Financial Year" onChange={handleFinYearChange}>
                  {/* <MenuItem value="0">--Select Financial Year--</MenuItem> */}
                  {finYear.map((item) => (
                    <MenuItem key={item.id} value={item.completeFinYear}>
                      {item.completeFinYear}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Button variant="contained" color="primary" onClick={getReportData}>
                Submit
              </Button>
            </Grid>
          </Grid>
        </div>

        {dataSummary.length > 0 && (
          <>
            <>
              <Stack sx={{ width: '100%' }} spacing={2}>
                <Alert1 variant="filled" severity="warning" style={{ color: 'red' }}>
                  Note: This report includes <b style={{ color: 'blue' }}>SO_SAVED and Discontinued</b> beneficiary data only.
                </Alert1>
              </Stack>

              <div style={{ height: 450, width: '100%', marginTop: '20px' }} className={classes.root}>
                <DataGrid
                  slots={{ toolbar: (props) => <CustomToolbarWithExportButton {...props} handleExportPdf={handleExportPdf} /> }}
                  slotProps={{
                    toolbar: {
                      showQuickFilter: true,
                      printOptions: {
                        disableToolbarButton: true
                      }
                    }
                  }}
                  rows={dataSummary}
                  columns={columnsReport}
                  hideFooterPagination
                  disableRowSelectionOnClick
                  density="compact"
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                {reportSummary.reportLevel == 'SD' && [2, 3].includes(reportSummary.loginLevel) && (
                  <Button
                    type="button"
                    variant="contained"
                    color="error"
                    style={{ marginLeft: '10px' }}
                    title="Back"
                    onClick={() => getReportSummary(null, null, null)}
                  >
                    {' '}
                    Back{' '}
                  </Button>
                )}
                {reportSummary.reportLevel == 'GP' && (
                  <Button
                    type="button"
                    variant="contained"
                    color="error"
                    style={{ marginLeft: '10px' }}
                    title="Back"
                    onClick={() =>
                      getReportSummary(
                        dataSummary[0].locationCode.substring(0, 4),
                        [2, 3].includes(reportSummary.loginLevel) ? 'ALL' : null,
                        null
                      )
                    }
                  >
                    {' '}
                    Back{' '}
                  </Button>
                )}
              </div>
            </>
            <>
              {viewState == true && (
                <TableContainer component={Paper} sx={{ maxHeight: 440 }} className={classes.tableContainer}>
                  <Table stickyHeader aria-label="sticky table" className={classes.table}>
                    <TableHead>
                      <TableRow className={classes.stickyHeader}>
                        <TableCell className={classes.tableBody}>DEAD</TableCell>
                        <TableCell className={classes.tableBody}>INELIGIBLE-ABOVE BPL</TableCell>
                        <TableCell className={classes.tableBody}>INELIGIBLE-AGE</TableCell>
                        <TableCell className={classes.tableBody}>MIGRATED PERMANENTLY</TableCell>
                        <TableCell className={classes.tableBody}>MIGRATED TEMPORARILY</TableCell>
                        <TableCell className={classes.tableBody}>STOPPED DUE TO INVALID A/C</TableCell>
                        <TableCell className={classes.tableBody}>STOPPED DUE TO MISSING</TableCell>
                        <TableCell className={classes.tableBody}>INELIGIBLE-DUPLICATE RECORD</TableCell>
                        <TableCell className={classes.tableBody}>INELIGIBLE-OTHER REASON</TableCell>
                        <TableCell className={classes.tableBody}>TOTAL</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {discontinuedSummary.map((temp) => (
                        <TableRow key={temp.ded}>
                          {reportSummary.reportLevel == 'D' && (
                            <>
                              <TableCell className={classes.tableBody}>
                                {' '}
                                {temp.ded == 0 ? (
                                  0
                                ) : (
                                  <Link
                                    style={{ cursor: 'pointer' }}
                                    color="#1e88e5"
                                    onClick={() => downloadDataInExcel('DED', temp.locationCode, null, null)}
                                  >
                                    {temp.ded}
                                  </Link>
                                )}
                              </TableCell>
                            </>
                          )}
                          {reportSummary.reportLevel == 'SD' && (
                            <>
                              <TableCell className={classes.tableBody}>
                                {temp.ded == 0 ? (
                                  0
                                ) : (
                                  <Link
                                    style={{ cursor: 'pointer' }}
                                    color="#1e88e5"
                                    onClick={() => downloadDataInExcel('DED', null, temp.locationCode, null)}
                                  >
                                    {temp.ded}
                                  </Link>
                                )}
                              </TableCell>
                            </>
                          )}
                          {reportSummary.reportLevel == 'GP' && (
                            <>
                              <TableCell className={classes.tableBody}>
                                {temp.ded == 0 ? (
                                  0
                                ) : (
                                  <Link
                                    style={{ cursor: 'pointer' }}
                                    color="#1e88e5"
                                    onClick={() => downloadDataInExcel('DED', null, null, temp.locationCode)}
                                  >
                                    {temp.ded}
                                  </Link>
                                )}
                              </TableCell>
                            </>
                          )}

                          {reportSummary.reportLevel == 'D' && (
                            <>
                              <TableCell className={classes.tableBody}>
                                {temp.ips == 0 ? (
                                  0
                                ) : (
                                  <Link
                                    style={{ cursor: 'pointer' }}
                                    color="#1e88e5"
                                    onClick={() => downloadDataInExcel('IPS', temp.locationCode, null, null)}
                                  >
                                    {temp.ips}
                                  </Link>
                                )}
                              </TableCell>
                            </>
                          )}
                          {reportSummary.reportLevel == 'SD' && (
                            <>
                              <TableCell className={classes.tableBody}>
                                {temp.ips == 0 ? (
                                  0
                                ) : (
                                  <Link
                                    style={{ cursor: 'pointer' }}
                                    color="#1e88e5"
                                    onClick={() => downloadDataInExcel('IPS', null, temp.locationCode, null)}
                                  >
                                    {temp.ips}
                                  </Link>
                                )}
                              </TableCell>
                            </>
                          )}
                          {reportSummary.reportLevel == 'GP' && (
                            <>
                              <TableCell className={classes.tableBody}>
                                {temp.ips == 0 ? (
                                  0
                                ) : (
                                  <Link
                                    style={{ cursor: 'pointer' }}
                                    color="#1e88e5"
                                    onClick={() => downloadDataInExcel('IPS', null, null, temp.locationCode)}
                                  >
                                    {temp.ips}
                                  </Link>
                                )}
                              </TableCell>
                            </>
                          )}

                          {reportSummary.reportLevel == 'D' && (
                            <>
                              <TableCell className={classes.tableBody}>
                                {temp.ina == 0 ? (
                                  0
                                ) : (
                                  <Link
                                    style={{ cursor: 'pointer' }}
                                    color="#1e88e5"
                                    onClick={() => downloadDataInExcel('INA', temp.locationCode, null, null)}
                                  >
                                    {temp.ina}
                                  </Link>
                                )}
                              </TableCell>
                            </>
                          )}
                          {reportSummary.reportLevel == 'SD' && (
                            <>
                              <TableCell className={classes.tableBody}>
                                {temp.ina == 0 ? (
                                  0
                                ) : (
                                  <Link
                                    style={{ cursor: 'pointer' }}
                                    color="#1e88e5"
                                    onClick={() => downloadDataInExcel('INA', null, temp.locationCode, null)}
                                  >
                                    {temp.ina}
                                  </Link>
                                )}
                              </TableCell>
                            </>
                          )}
                          {reportSummary.reportLevel == 'GP' && (
                            <>
                              <TableCell className={classes.tableBody}>
                                {temp.ina == 0 ? (
                                  0
                                ) : (
                                  <Link
                                    style={{ cursor: 'pointer' }}
                                    color="#1e88e5"
                                    onClick={() => downloadDataInExcel('INA', null, null, temp.locationCode)}
                                  >
                                    {temp.ina}
                                  </Link>
                                )}
                              </TableCell>
                            </>
                          )}

                          {reportSummary.reportLevel == 'D' && (
                            <>
                              <TableCell className={classes.tableBody}>
                                {temp.mgp == 0 ? (
                                  0
                                ) : (
                                  <Link
                                    style={{ cursor: 'pointer' }}
                                    color="#1e88e5"
                                    onClick={() => downloadDataInExcel('MGP', temp.locationCode, null, null)}
                                  >
                                    {temp.mgp}
                                  </Link>
                                )}
                              </TableCell>
                            </>
                          )}
                          {reportSummary.reportLevel == 'SD' && (
                            <>
                              <TableCell className={classes.tableBody}>
                                {temp.mgp == 0 ? (
                                  0
                                ) : (
                                  <Link
                                    style={{ cursor: 'pointer' }}
                                    color="#1e88e5"
                                    onClick={() => downloadDataInExcel('MGP', null, temp.locationCode, null)}
                                  >
                                    {temp.mgp}
                                  </Link>
                                )}
                              </TableCell>
                            </>
                          )}
                          {reportSummary.reportLevel == 'GP' && (
                            <>
                              <TableCell className={classes.tableBody}>
                                {temp.mgp == 0 ? (
                                  0
                                ) : (
                                  <Link
                                    style={{ cursor: 'pointer' }}
                                    color="#1e88e5"
                                    onClick={() => downloadDataInExcel('MGP', null, null, temp.locationCode)}
                                  >
                                    {temp.mgp}
                                  </Link>
                                )}
                              </TableCell>
                            </>
                          )}

                          {reportSummary.reportLevel == 'D' && (
                            <>
                              <TableCell className={classes.tableBody}>
                                {temp.mgt == 0 ? (
                                  0
                                ) : (
                                  <Link
                                    style={{ cursor: 'pointer' }}
                                    color="#1e88e5"
                                    onClick={() => downloadDataInExcel('MGT', temp.locationCode, null, null)}
                                  >
                                    {temp.mgt}
                                  </Link>
                                )}
                              </TableCell>
                            </>
                          )}
                          {reportSummary.reportLevel == 'SD' && (
                            <>
                              <TableCell className={classes.tableBody}>
                                {temp.mgt == 0 ? (
                                  0
                                ) : (
                                  <Link
                                    style={{ cursor: 'pointer' }}
                                    color="#1e88e5"
                                    onClick={() => downloadDataInExcel('MGT', null, temp.locationCode, null)}
                                  >
                                    {temp.mgt}
                                  </Link>
                                )}
                              </TableCell>
                            </>
                          )}
                          {reportSummary.reportLevel == 'GP' && (
                            <>
                              <TableCell className={classes.tableBody}>
                                {temp.mgt == 0 ? (
                                  0
                                ) : (
                                  <Link
                                    style={{ cursor: 'pointer' }}
                                    color="#1e88e5"
                                    onClick={() => downloadDataInExcel('MGT', null, null, temp.locationCode)}
                                  >
                                    {temp.mgt}
                                  </Link>
                                )}
                              </TableCell>
                            </>
                          )}

                          {reportSummary.reportLevel == 'D' && (
                            <>
                              <TableCell className={classes.tableBody}>
                                {temp.stp == 0 ? (
                                  0
                                ) : (
                                  <Link
                                    style={{ cursor: 'pointer' }}
                                    color="#1e88e5"
                                    onClick={() => downloadDataInExcel('STP', temp.locationCode, null, null)}
                                  >
                                    {temp.stp}
                                  </Link>
                                )}
                              </TableCell>
                            </>
                          )}
                          {reportSummary.reportLevel == 'SD' && (
                            <>
                              <TableCell className={classes.tableBody}>
                                {temp.stp == 0 ? (
                                  0
                                ) : (
                                  <Link
                                    style={{ cursor: 'pointer' }}
                                    color="#1e88e5"
                                    onClick={() => downloadDataInExcel('STP', null, temp.locationCode, null)}
                                  >
                                    {temp.stp}
                                  </Link>
                                )}
                              </TableCell>
                            </>
                          )}
                          {reportSummary.reportLevel == 'GP' && (
                            <>
                              <TableCell className={classes.tableBody}>
                                {temp.stp == 0 ? (
                                  0
                                ) : (
                                  <Link
                                    style={{ cursor: 'pointer' }}
                                    color="#1e88e5"
                                    onClick={() => downloadDataInExcel('STP', null, null, temp.locationCode)}
                                  >
                                    {temp.stp}
                                  </Link>
                                )}
                              </TableCell>
                            </>
                          )}

                          {reportSummary.reportLevel == 'D' && (
                            <>
                              <TableCell className={classes.tableBody}>
                                {temp.mis == 0 ? (
                                  0
                                ) : (
                                  <Link
                                    style={{ cursor: 'pointer' }}
                                    color="#1e88e5"
                                    onClick={() => downloadDataInExcel('MIS', temp.locationCode, null, null)}
                                  >
                                    {temp.mis}
                                  </Link>
                                )}
                              </TableCell>
                            </>
                          )}
                          {reportSummary.reportLevel == 'SD' && (
                            <>
                              <TableCell className={classes.tableBody}>
                                {temp.mis == 0 ? (
                                  0
                                ) : (
                                  <Link
                                    style={{ cursor: 'pointer' }}
                                    color="#1e88e5"
                                    onClick={() => downloadDataInExcel('MIS', null, temp.locationCode, null)}
                                  >
                                    {temp.mis}
                                  </Link>
                                )}
                              </TableCell>
                            </>
                          )}
                          {reportSummary.reportLevel == 'GP' && (
                            <>
                              <TableCell className={classes.tableBody}>
                                {temp.mis == 0 ? (
                                  0
                                ) : (
                                  <Link
                                    style={{ cursor: 'pointer' }}
                                    color="#1e88e5"
                                    onClick={() => downloadDataInExcel('MIS', null, null, temp.locationCode)}
                                  >
                                    {temp.mis}
                                  </Link>
                                )}
                              </TableCell>
                            </>
                          )}

                          {reportSummary.reportLevel == 'D' && (
                            <>
                              <TableCell className={classes.tableBody}>
                                {temp.ior == 0 ? (
                                  0
                                ) : (
                                  <Link
                                    style={{ cursor: 'pointer' }}
                                    color="#1e88e5"
                                    onClick={() => downloadDataInExcel('IOR', temp.locationCode, null, null)}
                                  >
                                    {temp.ior}
                                  </Link>
                                )}
                              </TableCell>
                            </>
                          )}
                          {reportSummary.reportLevel == 'SD' && (
                            <>
                              <TableCell className={classes.tableBody}>
                                {temp.ior == 0 ? (
                                  0
                                ) : (
                                  <Link
                                    style={{ cursor: 'pointer' }}
                                    color="#1e88e5"
                                    onClick={() => downloadDataInExcel('IOR', null, temp.locationCode, null)}
                                  >
                                    {temp.ior}
                                  </Link>
                                )}
                              </TableCell>
                            </>
                          )}
                          {reportSummary.reportLevel == 'GP' && (
                            <>
                              <TableCell className={classes.tableBody}>
                                {temp.ior == 0 ? (
                                  0
                                ) : (
                                  <Link
                                    style={{ cursor: 'pointer' }}
                                    color="#1e88e5"
                                    onClick={() => downloadDataInExcel('IOR', null, null, temp.locationCode)}
                                  >
                                    {temp.ior}
                                  </Link>
                                )}
                              </TableCell>
                            </>
                          )}

                          {reportSummary.reportLevel == 'D' && (
                            <>
                              <TableCell className={classes.tableBody}>
                                {temp.ino == 0 ? (
                                  0
                                ) : (
                                  <Link
                                    style={{ cursor: 'pointer' }}
                                    color="#1e88e5"
                                    onClick={() => downloadDataInExcel('INO', temp.locationCode, null, null)}
                                  >
                                    {temp.ino}
                                  </Link>
                                )}
                              </TableCell>
                            </>
                          )}
                          {reportSummary.reportLevel == 'SD' && (
                            <>
                              <TableCell className={classes.tableBody}>
                                {temp.ino == 0 ? (
                                  0
                                ) : (
                                  <Link
                                    style={{ cursor: 'pointer' }}
                                    color="#1e88e5"
                                    onClick={() => downloadDataInExcel('INO', null, temp.locationCode, null)}
                                  >
                                    {temp.ino}
                                  </Link>
                                )}
                              </TableCell>
                            </>
                          )}
                          {reportSummary.reportLevel == 'GP' && (
                            <>
                              <TableCell className={classes.tableBody}>
                                {temp.ino == 0 ? (
                                  0
                                ) : (
                                  <Link
                                    style={{ cursor: 'pointer' }}
                                    color="#1e88e5"
                                    onClick={() => downloadDataInExcel('INO', null, null, temp.locationCode)}
                                  >
                                    {temp.ino}
                                  </Link>
                                )}
                              </TableCell>
                            </>
                          )}

                          {reportSummary.reportLevel == 'D' && (
                            <>
                              <TableCell className={classes.tableBody}>
                                {temp.total == 0 ? (
                                  0
                                ) : (
                                  <Link
                                    style={{ cursor: 'pointer' }}
                                    color="#1e88e5"
                                    onClick={() => downloadDataInExcel('TOT', temp.locationCode, null, null)}
                                  >
                                    {temp.total}
                                  </Link>
                                )}
                              </TableCell>
                            </>
                          )}
                          {reportSummary.reportLevel == 'SD' && (
                            <>
                              <TableCell className={classes.tableBody}>
                                {temp.total == 0 ? (
                                  0
                                ) : (
                                  <Link
                                    style={{ cursor: 'pointer' }}
                                    color="#1e88e5"
                                    onClick={() => downloadDataInExcel('TOT', null, temp.locationCode, null)}
                                  >
                                    {temp.total}
                                  </Link>
                                )}
                              </TableCell>
                            </>
                          )}
                          {reportSummary.reportLevel == 'GP' && (
                            <>
                              <TableCell className={classes.tableBody}>
                                {temp.total == 0 ? (
                                  0
                                ) : (
                                  <Link
                                    style={{ cursor: 'pointer' }}
                                    color="#1e88e5"
                                    onClick={() => downloadDataInExcel('TOT', null, null, temp.locationCode)}
                                  >
                                    {temp.total}
                                  </Link>
                                )}
                              </TableCell>
                            </>
                          )}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </>
          </>
        )}
      </MainCard>
    </>
  );
};
export default AnnualVerificationSummary;
