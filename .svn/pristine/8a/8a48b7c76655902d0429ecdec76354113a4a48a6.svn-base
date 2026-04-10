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
  TableFooter,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import MainCard from 'ui-component/cards/MainCard';
import React, { useState, useEffect } from 'react';
import axiosInstance from 'hooks/useAuthTokenUrl';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import DownloadIcon from '@mui/icons-material/Download';
import reportcss from 'components/common/reportsCSS';

const StateTransactionReport = () => {
  const classes = reportcss();
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState(null);
  const handleCloseSnackbar = () => setSnackbar(null);
  const [finYear, setFinYear] = useState([]);
  const [selectedFinYear, setSelectedFinYear] = useState(0);
  const [area, setArea] = useState('B');
  const [disburseType, setDisburseType] = useState('DD');
  const [viewState, setViewState] = useState(false);
  const [reportSummary, setReportSummary] = useState(null);
  const [dataSummary, setDataSummary] = useState(null);

  const getFinYear = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('transactionReport/getFinanceYears');
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

  const getReportSummary = async (districtCode, subDistrictCode, gpCode) => {
    if (selectedFinYear == 0) {
      setSnackbar({ children: 'Please Select Financial Year', severity: 'error' });
      return false;
    }

    const body = {
      districtCode: districtCode,
      subDistrictMunicipalAreaCode: subDistrictCode,
      gramPanchayatCode: gpCode,
      finYear: selectedFinYear,
      ruralUrbanArea: area,
      disburseType: disburseType
    };
    // console.log(JSON.stringify(body));
    try {
      setLoading(true);
      setViewState(false);
      const response = await axiosInstance.post('transactionReport/getStateTransactionReport', body);
      if (response.status == 204) {
        setSnackbar({ children: 'No Data Available', severity: 'error' });
        return false;
      }
      setReportSummary(response.data);
      const newData = response.data.reportData.map((row) => ({ ...row, id: row.locationCode }));
      setDataSummary(newData);
      setViewState(true);
    } catch (error) {
      setSnackbar({ children: 'Some Internal Error Occured While Getting Summary', severity: 'error' });
      console.error('Error fetching generated Summary', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getFinYear();
  }, []);

  const handleFinYearChange = (event) => {
    if (event.target.value !== 0) {
      setSelectedFinYear(event.target.value);
    } else {
      setSelectedFinYear(null);
    }
  };

  const handleAreaSelect = (e) => {
    setArea(e.target.value);
  };

  const handleDisburseSelect = (e) => {
    setDisburseType(e.target.value);
  };

  const exportToExcel = (id) => {
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.table_to_sheet(document.getElementById(id));
    XLSX.utils.book_append_sheet(wb, ws, id);
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    saveAs(new Blob([excelBuffer], { type: 'application/octet-stream' }), id + '.xlsx');
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

      <MainCard title="State Transaction Report">
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px', marginBottom: '20px' }}>
          <Grid container spacing={1}>
            <Grid item xs={12} sm={3}>
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

            <Grid item xs={12} sm={3}>
              <FormControl fullWidth>
                <InputLabel id="area-label" style={{ display: 'flex', alignItems: 'center' }}>
                  Area
                </InputLabel>
                <Select name="area" onChange={handleAreaSelect} label="Area" value={area}>
                  <MenuItem value="B">BOTH</MenuItem>
                  <MenuItem value="R">RURAL</MenuItem>
                  <MenuItem value="U">URBAN</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={3}>
              <FormControl fullWidth>
                <InputLabel id="dis-label" style={{ display: 'flex', alignItems: 'center' }}>
                  Disbursement Type
                </InputLabel>
                <Select name="dis" onChange={handleDisburseSelect} label="Disbursement Type" value={disburseType}>
                  <MenuItem value="DD">Disbursement Date</MenuItem>
                  <MenuItem value="PD">Payable Date</MenuItem>
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

        {viewState == true && (
          <>
            <div style={{ textAlign: 'right' }}>
              <Button
                variant="contained"
                style={{ backgroundColor: '#8555a3', marginLeft: '20px' }}
                onClick={() => exportToExcel('transaction-report')}
              >
                <DownloadIcon />
                Excel
              </Button>
            </div>

            {/* <Paper sx={{ width: '100%', overflow: 'hidden' }} style={{ marginTop: '20px' }}> */}
            <TableContainer component={Paper} className={classes.tableContainer} style={{ marginTop: '20px' }}>
              <Table aria-label="sticky table" id="transaction-report" className={classes.table}>
                <TableHead>
                  <TableRow style={{ position: 'sticky', top: -1, zIndex: 999, backgroundColor: 'white' }}>
                    {reportSummary.reportLevel == 'D' && (
                      <>
                        <TableCell className={classes.tableBody}>District</TableCell>
                      </>
                    )}
                    {reportSummary.reportLevel == 'SD' && (
                      <>
                        <TableCell className={classes.tableBody}>Sub District</TableCell>
                        <TableCell className={classes.tableBody}>Area</TableCell>
                      </>
                    )}
                    {reportSummary.reportLevel == 'GP' && (
                      <>
                        <TableCell className={classes.tableBody}>Gram Panchayat/Ward </TableCell>
                        <TableCell className={classes.tableBody}>Area</TableCell>
                      </>
                    )}
                    <TableCell className={classes.tableBody} style={{ background: '#FCF3CF' }} colSpan={5}>
                      APRIL
                    </TableCell>
                    <TableCell className={classes.tableBody} style={{ background: '#D4EFDF' }} colSpan={5}>
                      MAY
                    </TableCell>
                    <TableCell className={classes.tableBody} style={{ background: '#FCF3CF' }} colSpan={5}>
                      JUNE
                    </TableCell>
                    <TableCell className={classes.tableBody} style={{ background: '#D4EFDF' }} colSpan={5}>
                      JULY
                    </TableCell>
                    <TableCell className={classes.tableBody} style={{ background: '#FCF3CF' }} colSpan={5}>
                      AUGUST
                    </TableCell>
                    <TableCell className={classes.tableBody} style={{ background: '#D4EFDF' }} colSpan={5}>
                      SEPTEMBER
                    </TableCell>
                    <TableCell className={classes.tableBody} style={{ background: '#FCF3CF' }} colSpan={5}>
                      OCTOBER
                    </TableCell>
                    <TableCell className={classes.tableBody} style={{ background: '#D4EFDF' }} colSpan={5}>
                      NOVEMBER
                    </TableCell>
                    <TableCell className={classes.tableBody} style={{ background: '#FCF3CF' }} colSpan={5}>
                      DECEMBER
                    </TableCell>
                    <TableCell className={classes.tableBody} style={{ background: '#D4EFDF' }} colSpan={5}>
                      JANAUARY
                    </TableCell>
                    <TableCell className={classes.tableBody} style={{ background: '#FCF3CF' }} colSpan={5}>
                      FEBRURARY
                    </TableCell>
                    <TableCell className={classes.tableBody} style={{ background: '#D4EFDF' }} colSpan={5}>
                      MARCH
                    </TableCell>
                  </TableRow>
                  <TableRow style={{ position: 'sticky', top: 25, zIndex: 998, backgroundColor: 'white' }}>
                    {reportSummary.reportLevel == 'D' && (
                      <>
                        <TableCell className={classes.tableBody}></TableCell>
                      </>
                    )}
                    {reportSummary.reportLevel == 'SD' && (
                      <>
                        <TableCell className={classes.tableBody}></TableCell>
                        <TableCell className={classes.tableBody}></TableCell>
                      </>
                    )}
                    {reportSummary.reportLevel == 'GP' && (
                      <>
                        <TableCell className={classes.tableBody}></TableCell>
                        <TableCell className={classes.tableBody}></TableCell>
                      </>
                    )}

                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((temp) => (
                      <>
                        {temp % 2 != 0 ? (
                          <>
                            <TableCell className={classes.tableBody} style={{ background: '#FCF3CF' }}>
                              NEFT Transactions
                            </TableCell>{' '}
                            <TableCell className={classes.tableBody} style={{ background: '#FCF3CF' }}>
                              PO Transactions
                            </TableCell>
                            <TableCell className={classes.tableBody} style={{ background: '#FCF3CF' }}>
                              APB Transactions
                            </TableCell>{' '}
                            <TableCell className={classes.tableBody} style={{ background: '#FCF3CF' }}>
                              Total Transactions
                            </TableCell>{' '}
                            <TableCell className={classes.tableBody} style={{ background: '#FCF3CF' }}>
                              APB Percentage
                            </TableCell>{' '}
                          </>
                        ) : (
                          <>
                            <TableCell className={classes.tableBody} style={{ background: '#D4EFDF' }}>
                              NEFT Transactions
                            </TableCell>{' '}
                            <TableCell className={classes.tableBody} style={{ background: '#D4EFDF' }}>
                              PO Transactions
                            </TableCell>
                            <TableCell className={classes.tableBody} style={{ background: '#D4EFDF' }}>
                              APB Transactions
                            </TableCell>{' '}
                            <TableCell className={classes.tableBody} style={{ background: '#D4EFDF' }}>
                              Total Transactions
                            </TableCell>{' '}
                            <TableCell className={classes.tableBody} style={{ background: '#D4EFDF' }}>
                              APB Percentage
                            </TableCell>{' '}
                          </>
                        )}
                        {/* ,background:'#FCF3CF' */}
                      </>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {dataSummary
                    .filter((s) => s.name != 'GRAND TOTAL')
                    .map((temp) => (
                      <TableRow key={temp.locationCode}>
                        {reportSummary.reportLevel == 'D' && (
                          <>
                            <TableCell className={classes.tableBody}>
                              {' '}
                              <Link
                                color="#1e88e5"
                                style={{ cursor: 'pointer' }}
                                onClick={() => getReportSummary(temp.locationCode, 'ALL', null)}
                              >
                                {temp.name}
                              </Link>
                            </TableCell>
                          </>
                        )}
                        {reportSummary.reportLevel == 'SD' && (
                          <>
                            <TableCell className={classes.tableBody}>
                              {' '}
                              {temp.name}
                              {/* <Link color="#1e88e5" onClick={() => getReportSummary(null, temp.locationCode, 'ALL')} >{temp.name}</Link> */}
                            </TableCell>
                            <TableCell className={classes.tableBody}>{temp.name2}</TableCell>
                          </>
                        )}
                        {reportSummary.reportLevel == 'GP' && (
                          <>
                            <TableCell className={classes.tableBody}>{temp.name}</TableCell>
                            <TableCell className={classes.tableBody}>{temp.name2}</TableCell>
                          </>
                        )}
                        <TableCell className={classes.tableBody} style={{ background: '#FCF3CF' }}>
                          {temp.apr.neft}
                        </TableCell>{' '}
                        <TableCell className={classes.tableBody} style={{ background: '#FCF3CF' }}>
                          {temp.apr.po}
                        </TableCell>
                        <TableCell className={classes.tableBody} style={{ background: '#FCF3CF' }}>
                          {temp.apr.apb}
                        </TableCell>{' '}
                        <TableCell className={classes.tableBody} style={{ background: '#FCF3CF' }}>
                          {temp.apr.total}
                        </TableCell>{' '}
                        <TableCell className={classes.tableBody} style={{ background: '#FCF3CF' }}>
                          {temp.apr.total !== 0 ? ((temp.apr.apb / temp.apr.total) * 100).toFixed(2) : 0}
                        </TableCell>
                        <TableCell className={classes.tableBody} style={{ background: '#D4EFDF' }}>
                          {temp.may.neft}
                        </TableCell>{' '}
                        <TableCell className={classes.tableBody} style={{ background: '#D4EFDF' }}>
                          {temp.may.po}
                        </TableCell>
                        <TableCell className={classes.tableBody} style={{ background: '#D4EFDF' }}>
                          {temp.may.apb}
                        </TableCell>{' '}
                        <TableCell className={classes.tableBody} style={{ background: '#D4EFDF' }}>
                          {temp.may.total}
                        </TableCell>{' '}
                        <TableCell className={classes.tableBody} style={{ background: '#D4EFDF' }}>
                          {temp.may.total !== 0 ? ((temp.may.apb / temp.may.total) * 100).toFixed(2) : 0}
                        </TableCell>
                        <TableCell className={classes.tableBody} style={{ background: '#FCF3CF' }}>
                          {temp.jun.neft}
                        </TableCell>{' '}
                        <TableCell className={classes.tableBody} style={{ background: '#FCF3CF' }}>
                          {temp.jun.po}
                        </TableCell>
                        <TableCell className={classes.tableBody} style={{ background: '#FCF3CF' }}>
                          {temp.jun.apb}
                        </TableCell>{' '}
                        <TableCell className={classes.tableBody} style={{ background: '#FCF3CF' }}>
                          {temp.jun.total}
                        </TableCell>{' '}
                        <TableCell className={classes.tableBody} style={{ background: '#FCF3CF' }}>
                          {temp.jun.total !== 0 ? ((temp.jun.apb / temp.jun.total) * 100).toFixed(2) : 0}
                        </TableCell>
                        <TableCell className={classes.tableBody} style={{ background: '#D4EFDF' }}>
                          {temp.jul.neft}
                        </TableCell>{' '}
                        <TableCell className={classes.tableBody} style={{ background: '#D4EFDF' }}>
                          {temp.jul.po}
                        </TableCell>
                        <TableCell className={classes.tableBody} style={{ background: '#D4EFDF' }}>
                          {temp.jul.apb}
                        </TableCell>{' '}
                        <TableCell className={classes.tableBody} style={{ background: '#D4EFDF' }}>
                          {temp.jul.total}
                        </TableCell>{' '}
                        <TableCell className={classes.tableBody} style={{ background: '#D4EFDF' }}>
                          {temp.jul.total !== 0 ? ((temp.jul.apb / temp.jul.total) * 100).toFixed(2) : 0}
                        </TableCell>
                        <TableCell className={classes.tableBody} style={{ background: '#FCF3CF' }}>
                          {temp.aug.neft}
                        </TableCell>{' '}
                        <TableCell className={classes.tableBody} style={{ background: '#FCF3CF' }}>
                          {temp.aug.po}
                        </TableCell>
                        <TableCell className={classes.tableBody} style={{ background: '#FCF3CF' }}>
                          {temp.aug.apb}
                        </TableCell>{' '}
                        <TableCell className={classes.tableBody} style={{ background: '#FCF3CF' }}>
                          {temp.aug.total}
                        </TableCell>{' '}
                        <TableCell className={classes.tableBody} style={{ background: '#FCF3CF' }}>
                          {temp.aug.total !== 0 ? ((temp.aug.apb / temp.aug.total) * 100).toFixed(2) : 0}
                        </TableCell>
                        <TableCell className={classes.tableBody} style={{ background: '#D4EFDF' }}>
                          {temp.sep.neft}
                        </TableCell>{' '}
                        <TableCell className={classes.tableBody} style={{ background: '#D4EFDF' }}>
                          {temp.sep.po}
                        </TableCell>
                        <TableCell className={classes.tableBody} style={{ background: '#D4EFDF' }}>
                          {temp.sep.apb}
                        </TableCell>{' '}
                        <TableCell className={classes.tableBody} style={{ background: '#D4EFDF' }}>
                          {temp.sep.total}
                        </TableCell>{' '}
                        <TableCell className={classes.tableBody} style={{ background: '#D4EFDF' }}>
                          {temp.sep.total !== 0 ? ((temp.sep.apb / temp.sep.total) * 100).toFixed(2) : 0}
                        </TableCell>
                        <TableCell className={classes.tableBody} style={{ background: '#FCF3CF' }}>
                          {temp.oct.neft}
                        </TableCell>{' '}
                        <TableCell className={classes.tableBody} style={{ background: '#FCF3CF' }}>
                          {temp.oct.po}
                        </TableCell>
                        <TableCell className={classes.tableBody} style={{ background: '#FCF3CF' }}>
                          {temp.oct.apb}
                        </TableCell>{' '}
                        <TableCell className={classes.tableBody} style={{ background: '#FCF3CF' }}>
                          {temp.oct.total}
                        </TableCell>{' '}
                        <TableCell className={classes.tableBody} style={{ background: '#FCF3CF' }}>
                          {temp.oct.total !== 0 ? ((temp.oct.apb / temp.oct.total) * 100).toFixed(2) : 0}
                        </TableCell>
                        <TableCell className={classes.tableBody} style={{ background: '#D4EFDF' }}>
                          {temp.nov.neft}
                        </TableCell>{' '}
                        <TableCell className={classes.tableBody} style={{ background: '#D4EFDF' }}>
                          {temp.nov.po}
                        </TableCell>
                        <TableCell className={classes.tableBody} style={{ background: '#D4EFDF' }}>
                          {temp.nov.apb}
                        </TableCell>{' '}
                        <TableCell className={classes.tableBody} style={{ background: '#D4EFDF' }}>
                          {temp.nov.total}
                        </TableCell>{' '}
                        <TableCell className={classes.tableBody} style={{ background: '#D4EFDF' }}>
                          {temp.nov.total !== 0 ? ((temp.nov.apb / temp.nov.total) * 100).toFixed(2) : 0}
                        </TableCell>
                        <TableCell className={classes.tableBody} style={{ background: '#FCF3CF' }}>
                          {temp.dec.neft}
                        </TableCell>{' '}
                        <TableCell className={classes.tableBody} style={{ background: '#FCF3CF' }}>
                          {temp.dec.po}
                        </TableCell>
                        <TableCell className={classes.tableBody} style={{ background: '#FCF3CF' }}>
                          {temp.dec.apb}
                        </TableCell>{' '}
                        <TableCell className={classes.tableBody} style={{ background: '#FCF3CF' }}>
                          {temp.dec.total}
                        </TableCell>{' '}
                        <TableCell className={classes.tableBody} style={{ background: '#FCF3CF' }}>
                          {temp.dec.total !== 0 ? ((temp.dec.apb / temp.dec.total) * 100).toFixed(2) : 0}
                        </TableCell>
                        <TableCell className={classes.tableBody} style={{ background: '#D4EFDF' }}>
                          {temp.jan.neft}
                        </TableCell>{' '}
                        <TableCell className={classes.tableBody} style={{ background: '#D4EFDF' }}>
                          {temp.jan.po}
                        </TableCell>
                        <TableCell className={classes.tableBody} style={{ background: '#D4EFDF' }}>
                          {temp.jan.apb}
                        </TableCell>{' '}
                        <TableCell className={classes.tableBody} style={{ background: '#D4EFDF' }}>
                          {temp.jan.total}
                        </TableCell>{' '}
                        <TableCell className={classes.tableBody} style={{ background: '#D4EFDF' }}>
                          {temp.jan.total !== 0 ? ((temp.jan.apb / temp.jan.total) * 100).toFixed(2) : 0}
                        </TableCell>
                        <TableCell className={classes.tableBody} style={{ background: '#FCF3CF' }}>
                          {temp.feb.neft}
                        </TableCell>{' '}
                        <TableCell className={classes.tableBody} style={{ background: '#FCF3CF' }}>
                          {temp.feb.po}
                        </TableCell>
                        <TableCell className={classes.tableBody} style={{ background: '#FCF3CF' }}>
                          {temp.feb.apb}
                        </TableCell>{' '}
                        <TableCell className={classes.tableBody} style={{ background: '#FCF3CF' }}>
                          {temp.feb.total}
                        </TableCell>{' '}
                        <TableCell className={classes.tableBody} style={{ background: '#FCF3CF' }}>
                          {temp.feb.total !== 0 ? ((temp.feb.apb / temp.feb.total) * 100).toFixed(2) : 0}
                        </TableCell>
                        <TableCell className={classes.tableBody} style={{ background: '#D4EFDF' }}>
                          {temp.mar.neft}
                        </TableCell>{' '}
                        <TableCell className={classes.tableBody} style={{ background: '#D4EFDF' }}>
                          {temp.mar.po}
                        </TableCell>
                        <TableCell className={classes.tableBody} style={{ background: '#D4EFDF' }}>
                          {temp.mar.apb}
                        </TableCell>{' '}
                        <TableCell className={classes.tableBody} style={{ background: '#D4EFDF' }}>
                          {temp.mar.total}
                        </TableCell>{' '}
                        <TableCell className={classes.tableBody} style={{ background: '#D4EFDF' }}>
                          {temp.mar.total !== 0 ? ((temp.mar.apb / temp.mar.total) * 100).toFixed(2) : 0}
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
                <TableFooter style={{ position: 'sticky', bottom: -1, zIndex: 1000 }}>
                  {dataSummary
                    .filter((s) => s.name == 'GRAND TOTAL')
                    .map((temp) => (
                      <TableRow key={temp.locationCode}>
                        {reportSummary.reportLevel == 'D' && (
                          <>
                            <TableCell className={classes.tableFooter}> {temp.name}</TableCell>
                          </>
                        )}
                        {reportSummary.reportLevel == 'SD' && (
                          <>
                            <TableCell className={classes.tableFooter}>{temp.name}</TableCell>
                            <TableCell className={classes.tableFooter}>{temp.name2}</TableCell>
                          </>
                        )}
                        {reportSummary.reportLevel == 'GP' && (
                          <>
                            <TableCell style={{ border: '1px solid #000000', padding: '0px' }}>{temp.name}</TableCell>
                            <TableCell className={classes.tableFooter}>{temp.name2}</TableCell>
                          </>
                        )}
                        <TableCell className={classes.tableFooter}>{temp.apr.neft}</TableCell>{' '}
                        <TableCell className={classes.tableFooter}>{temp.apr.po}</TableCell>
                        <TableCell className={classes.tableFooter}>{temp.apr.apb}</TableCell>{' '}
                        <TableCell className={classes.tableFooter}>{temp.apr.total}</TableCell>{' '}
                        <TableCell className={classes.tableFooter}>
                          {temp.apr.total !== 0 ? ((temp.apr.apb / temp.apr.total) * 100).toFixed(2) : 0}
                        </TableCell>
                        <TableCell className={classes.tableFooter}>{temp.may.neft}</TableCell>{' '}
                        <TableCell className={classes.tableFooter}>{temp.may.po}</TableCell>
                        <TableCell className={classes.tableFooter}>{temp.may.apb}</TableCell>{' '}
                        <TableCell className={classes.tableFooter}>{temp.may.total}</TableCell>{' '}
                        <TableCell className={classes.tableFooter}>
                          {temp.may.total !== 0 ? ((temp.may.apb / temp.may.total) * 100).toFixed(2) : 0}
                        </TableCell>
                        <TableCell className={classes.tableFooter}>{temp.jun.neft}</TableCell>{' '}
                        <TableCell className={classes.tableFooter}>{temp.jun.po}</TableCell>
                        <TableCell className={classes.tableFooter}>{temp.jun.apb}</TableCell>{' '}
                        <TableCell className={classes.tableFooter}>{temp.jun.total}</TableCell>{' '}
                        <TableCell className={classes.tableFooter}>
                          {temp.jun.total !== 0 ? ((temp.jun.apb / temp.jun.total) * 100).toFixed(2) : 0}
                        </TableCell>
                        <TableCell className={classes.tableFooter}>{temp.jul.neft}</TableCell>{' '}
                        <TableCell className={classes.tableFooter}>{temp.jul.po}</TableCell>
                        <TableCell className={classes.tableFooter}>{temp.jul.apb}</TableCell>{' '}
                        <TableCell className={classes.tableFooter}>{temp.jul.total}</TableCell>{' '}
                        <TableCell className={classes.tableFooter}>
                          {temp.jul.total !== 0 ? ((temp.jul.apb / temp.jul.total) * 100).toFixed(2) : 0}
                        </TableCell>
                        <TableCell className={classes.tableFooter}>{temp.aug.neft}</TableCell>{' '}
                        <TableCell className={classes.tableFooter}>{temp.aug.po}</TableCell>
                        <TableCell className={classes.tableFooter}>{temp.aug.apb}</TableCell>{' '}
                        <TableCell className={classes.tableFooter}>{temp.aug.total}</TableCell>{' '}
                        <TableCell className={classes.tableFooter}>
                          {temp.aug.total !== 0 ? ((temp.aug.apb / temp.aug.total) * 100).toFixed(2) : 0}
                        </TableCell>
                        <TableCell className={classes.tableFooter}>{temp.sep.neft}</TableCell>{' '}
                        <TableCell className={classes.tableFooter}>{temp.sep.po}</TableCell>
                        <TableCell className={classes.tableFooter}>{temp.sep.apb}</TableCell>{' '}
                        <TableCell className={classes.tableFooter}>{temp.sep.total}</TableCell>{' '}
                        <TableCell className={classes.tableFooter}>
                          {temp.sep.total !== 0 ? ((temp.sep.apb / temp.sep.total) * 100).toFixed(2) : 0}
                        </TableCell>
                        <TableCell className={classes.tableFooter}>{temp.oct.neft}</TableCell>{' '}
                        <TableCell className={classes.tableFooter}>{temp.oct.po}</TableCell>
                        <TableCell className={classes.tableFooter}>{temp.oct.apb}</TableCell>{' '}
                        <TableCell className={classes.tableFooter}>{temp.oct.total}</TableCell>{' '}
                        <TableCell className={classes.tableFooter}>
                          {temp.oct.total !== 0 ? ((temp.oct.apb / temp.oct.total) * 100).toFixed(2) : 0}
                        </TableCell>
                        <TableCell className={classes.tableFooter}>{temp.nov.neft}</TableCell>{' '}
                        <TableCell className={classes.tableFooter}>{temp.nov.po}</TableCell>
                        <TableCell className={classes.tableFooter}>{temp.nov.apb}</TableCell>{' '}
                        <TableCell className={classes.tableFooter}>{temp.nov.total}</TableCell>{' '}
                        <TableCell className={classes.tableFooter}>
                          {temp.nov.total !== 0 ? ((temp.nov.apb / temp.nov.total) * 100).toFixed(2) : 0}
                        </TableCell>
                        <TableCell className={classes.tableFooter}>{temp.dec.neft}</TableCell>{' '}
                        <TableCell className={classes.tableFooter}>{temp.dec.po}</TableCell>
                        <TableCell className={classes.tableFooter}>{temp.dec.apb}</TableCell>{' '}
                        <TableCell className={classes.tableFooter}>{temp.dec.total}</TableCell>{' '}
                        <TableCell className={classes.tableFooter}>
                          {temp.dec.total !== 0 ? ((temp.dec.apb / temp.dec.total) * 100).toFixed(2) : 0}
                        </TableCell>
                        <TableCell className={classes.tableFooter}>{temp.jan.neft}</TableCell>{' '}
                        <TableCell className={classes.tableFooter}>{temp.jan.po}</TableCell>
                        <TableCell className={classes.tableFooter}>{temp.jan.apb}</TableCell>{' '}
                        <TableCell className={classes.tableFooter}>{temp.jan.total}</TableCell>{' '}
                        <TableCell className={classes.tableFooter}>
                          {temp.jan.total !== 0 ? ((temp.jan.apb / temp.jan.total) * 100).toFixed(2) : 0}
                        </TableCell>
                        <TableCell className={classes.tableFooter}>{temp.feb.neft}</TableCell>{' '}
                        <TableCell className={classes.tableFooter}>{temp.feb.po}</TableCell>
                        <TableCell className={classes.tableFooter}>{temp.feb.apb}</TableCell>{' '}
                        <TableCell className={classes.tableFooter}>{temp.feb.total}</TableCell>{' '}
                        <TableCell className={classes.tableFooter}>
                          {temp.feb.total !== 0 ? ((temp.feb.apb / temp.feb.total) * 100).toFixed(2) : 0}
                        </TableCell>
                        <TableCell className={classes.tableFooter}>{temp.mar.neft}</TableCell>{' '}
                        <TableCell className={classes.tableFooter}>{temp.mar.po}</TableCell>
                        <TableCell className={classes.tableFooter}>{temp.mar.apb}</TableCell>{' '}
                        <TableCell className={classes.tableFooter}>{temp.mar.total}</TableCell>{' '}
                        <TableCell className={classes.tableFooter}>
                          {temp.mar.total !== 0 ? ((temp.mar.apb / temp.mar.total) * 100).toFixed(2) : 0}
                        </TableCell>
                      </TableRow>
                    ))}
                </TableFooter>
              </Table>
            </TableContainer>
            {/* </Paper>             */}
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
        )}
      </MainCard>
    </>
  );
};
export default StateTransactionReport;
