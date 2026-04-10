import {
  Alert,
  Backdrop,
  Button,
  CircularProgress,
  FormControl,
  Grid,
  InputLabel,
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
import SearchComponent from '../../../common/checkComponent';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import DownloadIcon from '@mui/icons-material/Download';

import reportcss from 'components/common/reportsCSS';

const DisbursementTransactionMonthWiseReport = () => {
  const classes = reportcss();
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState(null);
  const handleCloseSnackbar = () => setSnackbar(null);
  const [finYear, setFinYear] = useState([]);
  const [selectedFinYear, setSelectedFinYear] = useState(0);
  const [viewState, setViewState] = useState(false);
  const [reportSummary, setReportSummary] = useState(null);
  const [dataSummary, setDataSummary] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState({});

  const options = { IGNOAPS: 'IGNOAPS', IGNWPS: 'IGNWPS', IGNDPS: 'IGNDPS', NFBS: 'NFBS' };

  const handleSearchOptionValuesChange = (newOptionValues) => {
    const ss = Object.keys(newOptionValues).filter((key) => newOptionValues[key]);
    if (JSON.stringify(ss) !== JSON.stringify(selectedOptions)) {
      setSelectedOptions(ss);
    }
  };

  const getFinYear = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('transactionReport/getFinanceYears');
      const newData = response.data.map((row) => ({ ...row, id: row.finYearCode }));
      setFinYear(newData);
    } catch (error) {
      setSnackbar({ children: 'Some Internal Error Occured While Getting Finance Years', severity: 'error' });
      console.error('Error fetching Finance Years', error);
    } finally {
      setLoading(false);
    }
  };

  const getReportSummary = async () => {
    if (selectedFinYear == 0) {
      setSnackbar({ children: 'Please Select Financial Year', severity: 'error' });
      return false;
    }
    if (selectedOptions.length < 1) {
      setSnackbar({ children: 'Please select Atleast One Scheme', severity: 'error' });
      return false;
    }

    const body = { finYear: selectedFinYear, disburseType: 'DD', schemeCode: selectedOptions };

    try {
      setLoading(true);
      setViewState(false);
      const response = await axiosInstance.post('transactionReport/getDisburseTransacMonthWiseReport', body);
      if (response.status == 204) {
        setSnackbar({ children: 'No Data Available', severity: 'error' });
        return false;
      }
      setReportSummary(response.data);
      const newData = response.data.disbTransMonthWiseData.map((row) => ({ ...row, id: row.sno }));
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

      <MainCard title="Disbursement Transactiion Month Wise">
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

            {/* <Grid item xs={12} sm={3}> */}
            <div style={{ marginLeft: '10px' }}>
              <SearchComponent options={options} onOptionValuesChange={handleSearchOptionValuesChange} />
            </div>

            <Grid item xs={12} sm={3} style={{ display: 'flex', alignItems: 'center' }}>
              <Button variant="contained" color="primary" onClick={() => getReportSummary()}>
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
                    <TableCell className={classes.tableBody}>S.No</TableCell>
                    <TableCell className={classes.tableBody}>State </TableCell>

                    <TableCell className={classes.tableBody} style={{ background: '#FCF3CF' }} colSpan={6}>
                      APRIL
                    </TableCell>
                    <TableCell className={classes.tableBody} style={{ background: '#D4EFDF' }} colSpan={6}>
                      MAY
                    </TableCell>
                    <TableCell className={classes.tableBody} style={{ background: '#FCF3CF' }} colSpan={6}>
                      JUNE
                    </TableCell>
                    <TableCell className={classes.tableBody} style={{ background: '#D4EFDF' }} colSpan={6}>
                      JULY
                    </TableCell>
                    <TableCell className={classes.tableBody} style={{ background: '#FCF3CF' }} colSpan={6}>
                      AUGUST
                    </TableCell>
                    <TableCell className={classes.tableBody} style={{ background: '#D4EFDF' }} colSpan={6}>
                      SEPTEMBER
                    </TableCell>
                    <TableCell className={classes.tableBody} style={{ background: '#FCF3CF' }} colSpan={6}>
                      OCTOBER
                    </TableCell>
                    <TableCell className={classes.tableBody} style={{ background: '#D4EFDF' }} colSpan={6}>
                      NOVEMBER
                    </TableCell>
                    <TableCell className={classes.tableBody} style={{ background: '#FCF3CF' }} colSpan={6}>
                      DECEMBER
                    </TableCell>
                    <TableCell className={classes.tableBody} style={{ background: '#D4EFDF' }} colSpan={6}>
                      JANAUARY
                    </TableCell>
                    <TableCell className={classes.tableBody} style={{ background: '#FCF3CF' }} colSpan={6}>
                      FEBRURARY
                    </TableCell>
                    <TableCell className={classes.tableBody} style={{ background: '#D4EFDF' }} colSpan={6}>
                      MARCH
                    </TableCell>
                    <TableCell className={classes.tableFooter} colSpan={6}>
                      TOTAL
                    </TableCell>
                  </TableRow>
                  <TableRow style={{ position: 'sticky', top: -1, zIndex: 999, backgroundColor: 'white' }}>
                    <TableCell className={classes.tableBody}></TableCell>
                    <TableCell className={classes.tableBody}></TableCell>

                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((temp) => (
                      <>
                        {temp % 2 != 0 ? (
                          <>
                            <TableCell className={classes.tableBody} style={{ background: '#FCF3CF' }} colSpan={6}>
                              Transactions
                            </TableCell>
                          </>
                        ) : (
                          <>
                            <TableCell className={classes.tableBody} style={{ background: '#D4EFDF' }} colSpan={6}>
                              Transactions
                            </TableCell>{' '}
                          </>
                        )}
                      </>
                    ))}
                    <TableCell className={classes.tableFooter} colSpan={6}>
                      Transactions
                    </TableCell>
                  </TableRow>
                  <TableRow style={{ position: 'sticky', top: 50, zIndex: 998, backgroundColor: 'white' }}>
                    <TableCell className={classes.tableBody}></TableCell>
                    <TableCell className={classes.tableBody}></TableCell>
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((temp) => (
                      <>
                        {temp % 2 != 0 ? (
                          <>
                            <TableCell className={classes.tableBody} style={{ background: '#FCF3CF' }}>
                              NEFT
                            </TableCell>{' '}
                            <TableCell className={classes.tableBody} style={{ background: '#FCF3CF' }}>
                              BANK
                            </TableCell>
                            <TableCell className={classes.tableBody} style={{ background: '#FCF3CF' }}>
                              APB
                            </TableCell>{' '}
                            <TableCell className={classes.tableBody} style={{ background: '#FCF3CF' }}>
                              PO
                            </TableCell>{' '}
                            <TableCell className={classes.tableBody} style={{ background: '#FCF3CF' }}>
                              MO
                            </TableCell>{' '}
                            <TableCell className={classes.tableBody} style={{ background: '#FCF3CF' }}>
                              CASH
                            </TableCell>{' '}
                          </>
                        ) : (
                          <>
                            <TableCell className={classes.tableBody} style={{ background: '#D4EFDF' }}>
                              NEFT
                            </TableCell>{' '}
                            <TableCell className={classes.tableBody} style={{ background: '#D4EFDF' }}>
                              BANK
                            </TableCell>
                            <TableCell className={classes.tableBody} style={{ background: '#D4EFDF' }}>
                              APB
                            </TableCell>{' '}
                            <TableCell className={classes.tableBody} style={{ background: '#D4EFDF' }}>
                              PO
                            </TableCell>{' '}
                            <TableCell className={classes.tableBody} style={{ background: '#D4EFDF' }}>
                              MO
                            </TableCell>{' '}
                            <TableCell className={classes.tableBody} style={{ background: '#D4EFDF' }}>
                              CASH
                            </TableCell>{' '}
                          </>
                        )}
                      </>
                    ))}
                    <TableCell className={classes.tableFooter}>NEFT</TableCell> <TableCell className={classes.tableFooter}>BANK</TableCell>
                    <TableCell className={classes.tableFooter}>APB</TableCell> <TableCell className={classes.tableFooter}>PO</TableCell>{' '}
                    <TableCell className={classes.tableFooter}>MO</TableCell> <TableCell className={classes.tableFooter}>CASH</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {dataSummary
                    .filter((s) => s.stateName != 'TOTAL')
                    .map((temp) => (
                      <TableRow key={temp.sno}>
                        <TableCell className={classes.tableBody}>{temp.sno}</TableCell>
                        <TableCell className={classes.tableBody}>{temp.stateName}</TableCell>
                        <TableCell className={classes.tableBody} style={{ background: '#FCF3CF' }}>
                          {temp.apr.neft}
                        </TableCell>{' '}
                        <TableCell className={classes.tableBody} style={{ background: '#FCF3CF' }}>
                          {temp.apr.bank}
                        </TableCell>{' '}
                        <TableCell className={classes.tableBody} style={{ background: '#FCF3CF' }}>
                          {temp.apr.apb}
                        </TableCell>{' '}
                        <TableCell className={classes.tableBody} style={{ background: '#FCF3CF' }}>
                          {temp.apr.po}
                        </TableCell>{' '}
                        <TableCell className={classes.tableBody} style={{ background: '#FCF3CF' }}>
                          {temp.apr.mo}
                        </TableCell>{' '}
                        <TableCell className={classes.tableBody} style={{ background: '#FCF3CF' }}>
                          {temp.apr.cash}
                        </TableCell>
                        <TableCell className={classes.tableBody} style={{ background: '#D4EFDF' }}>
                          {temp.may.neft}
                        </TableCell>{' '}
                        <TableCell className={classes.tableBody} style={{ background: '#D4EFDF' }}>
                          {temp.may.bank}
                        </TableCell>{' '}
                        <TableCell className={classes.tableBody} style={{ background: '#D4EFDF' }}>
                          {temp.may.apb}
                        </TableCell>{' '}
                        <TableCell className={classes.tableBody} style={{ background: '#D4EFDF' }}>
                          {temp.may.po}
                        </TableCell>{' '}
                        <TableCell className={classes.tableBody} style={{ background: '#D4EFDF' }}>
                          {temp.may.mo}
                        </TableCell>{' '}
                        <TableCell className={classes.tableBody} style={{ background: '#D4EFDF' }}>
                          {temp.may.cash}
                        </TableCell>
                        <TableCell className={classes.tableBody} style={{ background: '#FCF3CF' }}>
                          {temp.jun.neft}
                        </TableCell>{' '}
                        <TableCell className={classes.tableBody} style={{ background: '#FCF3CF' }}>
                          {temp.jun.bank}
                        </TableCell>{' '}
                        <TableCell className={classes.tableBody} style={{ background: '#FCF3CF' }}>
                          {temp.jun.apb}
                        </TableCell>{' '}
                        <TableCell className={classes.tableBody} style={{ background: '#FCF3CF' }}>
                          {temp.jun.po}
                        </TableCell>{' '}
                        <TableCell className={classes.tableBody} style={{ background: '#FCF3CF' }}>
                          {temp.jun.mo}
                        </TableCell>{' '}
                        <TableCell className={classes.tableBody} style={{ background: '#FCF3CF' }}>
                          {temp.jun.cash}
                        </TableCell>
                        <TableCell className={classes.tableBody} style={{ background: '#D4EFDF' }}>
                          {temp.jul.neft}
                        </TableCell>{' '}
                        <TableCell className={classes.tableBody} style={{ background: '#D4EFDF' }}>
                          {temp.jul.bank}
                        </TableCell>{' '}
                        <TableCell className={classes.tableBody} style={{ background: '#D4EFDF' }}>
                          {temp.jul.apb}
                        </TableCell>{' '}
                        <TableCell className={classes.tableBody} style={{ background: '#D4EFDF' }}>
                          {temp.jul.po}
                        </TableCell>{' '}
                        <TableCell className={classes.tableBody} style={{ background: '#D4EFDF' }}>
                          {temp.jul.mo}
                        </TableCell>{' '}
                        <TableCell className={classes.tableBody} style={{ background: '#D4EFDF' }}>
                          {temp.jul.cash}
                        </TableCell>
                        <TableCell className={classes.tableBody} style={{ background: '#FCF3CF' }}>
                          {temp.aug.neft}
                        </TableCell>{' '}
                        <TableCell className={classes.tableBody} style={{ background: '#FCF3CF' }}>
                          {temp.aug.bank}
                        </TableCell>{' '}
                        <TableCell className={classes.tableBody} style={{ background: '#FCF3CF' }}>
                          {temp.aug.apb}
                        </TableCell>{' '}
                        <TableCell className={classes.tableBody} style={{ background: '#FCF3CF' }}>
                          {temp.aug.po}
                        </TableCell>{' '}
                        <TableCell className={classes.tableBody} style={{ background: '#FCF3CF' }}>
                          {temp.aug.mo}
                        </TableCell>{' '}
                        <TableCell className={classes.tableBody} style={{ background: '#FCF3CF' }}>
                          {temp.aug.cash}
                        </TableCell>
                        <TableCell className={classes.tableBody} style={{ background: '#D4EFDF' }}>
                          {temp.sep.neft}
                        </TableCell>{' '}
                        <TableCell className={classes.tableBody} style={{ background: '#D4EFDF' }}>
                          {temp.sep.bank}
                        </TableCell>{' '}
                        <TableCell className={classes.tableBody} style={{ background: '#D4EFDF' }}>
                          {temp.sep.apb}
                        </TableCell>{' '}
                        <TableCell className={classes.tableBody} style={{ background: '#D4EFDF' }}>
                          {temp.sep.po}
                        </TableCell>{' '}
                        <TableCell className={classes.tableBody} style={{ background: '#D4EFDF' }}>
                          {temp.sep.mo}
                        </TableCell>{' '}
                        <TableCell className={classes.tableBody} style={{ background: '#D4EFDF' }}>
                          {temp.sep.cash}
                        </TableCell>
                        <TableCell className={classes.tableBody} style={{ background: '#FCF3CF' }}>
                          {temp.oct.neft}
                        </TableCell>{' '}
                        <TableCell className={classes.tableBody} style={{ background: '#FCF3CF' }}>
                          {temp.oct.bank}
                        </TableCell>{' '}
                        <TableCell className={classes.tableBody} style={{ background: '#FCF3CF' }}>
                          {temp.oct.apb}
                        </TableCell>{' '}
                        <TableCell className={classes.tableBody} style={{ background: '#FCF3CF' }}>
                          {temp.oct.po}
                        </TableCell>{' '}
                        <TableCell className={classes.tableBody} style={{ background: '#FCF3CF' }}>
                          {temp.oct.mo}
                        </TableCell>{' '}
                        <TableCell className={classes.tableBody} style={{ background: '#FCF3CF' }}>
                          {temp.oct.cash}
                        </TableCell>
                        <TableCell className={classes.tableBody} style={{ background: '#D4EFDF' }}>
                          {temp.nov.neft}
                        </TableCell>{' '}
                        <TableCell className={classes.tableBody} style={{ background: '#D4EFDF' }}>
                          {temp.nov.bank}
                        </TableCell>{' '}
                        <TableCell className={classes.tableBody} style={{ background: '#D4EFDF' }}>
                          {temp.nov.apb}
                        </TableCell>{' '}
                        <TableCell className={classes.tableBody} style={{ background: '#D4EFDF' }}>
                          {temp.nov.po}
                        </TableCell>{' '}
                        <TableCell className={classes.tableBody} style={{ background: '#D4EFDF' }}>
                          {temp.nov.mo}
                        </TableCell>{' '}
                        <TableCell className={classes.tableBody} style={{ background: '#D4EFDF' }}>
                          {temp.nov.cash}
                        </TableCell>
                        <TableCell className={classes.tableBody} style={{ background: '#FCF3CF' }}>
                          {temp.dec.neft}
                        </TableCell>{' '}
                        <TableCell className={classes.tableBody} style={{ background: '#FCF3CF' }}>
                          {temp.dec.bank}
                        </TableCell>{' '}
                        <TableCell className={classes.tableBody} style={{ background: '#FCF3CF' }}>
                          {temp.dec.apb}
                        </TableCell>{' '}
                        <TableCell className={classes.tableBody} style={{ background: '#FCF3CF' }}>
                          {temp.dec.po}
                        </TableCell>{' '}
                        <TableCell className={classes.tableBody} style={{ background: '#FCF3CF' }}>
                          {temp.dec.mo}
                        </TableCell>{' '}
                        <TableCell className={classes.tableBody} style={{ background: '#FCF3CF' }}>
                          {temp.dec.cash}
                        </TableCell>
                        <TableCell className={classes.tableBody} style={{ background: '#D4EFDF' }}>
                          {temp.jan.neft}
                        </TableCell>{' '}
                        <TableCell className={classes.tableBody} style={{ background: '#D4EFDF' }}>
                          {temp.jan.bank}
                        </TableCell>{' '}
                        <TableCell className={classes.tableBody} style={{ background: '#D4EFDF' }}>
                          {temp.jan.apb}
                        </TableCell>{' '}
                        <TableCell className={classes.tableBody} style={{ background: '#D4EFDF' }}>
                          {temp.jan.po}
                        </TableCell>{' '}
                        <TableCell className={classes.tableBody} style={{ background: '#D4EFDF' }}>
                          {temp.jan.mo}
                        </TableCell>{' '}
                        <TableCell className={classes.tableBody} style={{ background: '#D4EFDF' }}>
                          {temp.jan.cash}
                        </TableCell>
                        <TableCell className={classes.tableBody} style={{ background: '#FCF3CF' }}>
                          {temp.feb.neft}
                        </TableCell>{' '}
                        <TableCell className={classes.tableBody} style={{ background: '#FCF3CF' }}>
                          {temp.feb.bank}
                        </TableCell>{' '}
                        <TableCell className={classes.tableBody} style={{ background: '#FCF3CF' }}>
                          {temp.feb.apb}
                        </TableCell>{' '}
                        <TableCell className={classes.tableBody} style={{ background: '#FCF3CF' }}>
                          {temp.feb.po}
                        </TableCell>{' '}
                        <TableCell className={classes.tableBody} style={{ background: '#FCF3CF' }}>
                          {temp.feb.mo}
                        </TableCell>{' '}
                        <TableCell className={classes.tableBody} style={{ background: '#FCF3CF' }}>
                          {temp.feb.cash}
                        </TableCell>
                        <TableCell className={classes.tableBody} style={{ background: '#D4EFDF' }}>
                          {temp.mar.neft}
                        </TableCell>{' '}
                        <TableCell className={classes.tableBody} style={{ background: '#D4EFDF' }}>
                          {temp.mar.bank}
                        </TableCell>{' '}
                        <TableCell className={classes.tableBody} style={{ background: '#D4EFDF' }}>
                          {temp.mar.apb}
                        </TableCell>{' '}
                        <TableCell className={classes.tableBody} style={{ background: '#D4EFDF' }}>
                          {temp.mar.po}
                        </TableCell>{' '}
                        <TableCell className={classes.tableBody} style={{ background: '#D4EFDF' }}>
                          {temp.mar.mo}
                        </TableCell>{' '}
                        <TableCell className={classes.tableBody} style={{ background: '#D4EFDF' }}>
                          {temp.mar.cash}
                        </TableCell>
                        <TableCell className={classes.tableFooter}>{temp.tot.neft}</TableCell>{' '}
                        <TableCell className={classes.tableFooter}>{temp.tot.bank}</TableCell>{' '}
                        <TableCell className={classes.tableFooter}>{temp.tot.apb}</TableCell>{' '}
                        <TableCell className={classes.tableFooter}>{temp.tot.po}</TableCell>{' '}
                        <TableCell className={classes.tableFooter}>{temp.tot.mo}</TableCell>{' '}
                        <TableCell className={classes.tableFooter}>{temp.tot.cash}</TableCell>
                      </TableRow>
                    ))}
                </TableBody>
                <TableFooter style={{ position: 'sticky', bottom: 0, zIndex: 1000 }}>
                  {dataSummary
                    .filter((s) => s.stateName === 'TOTAL')
                    .map((temp) => (
                      <TableRow key={temp.sno}>
                        <TableCell className={classes.tableFooter}> </TableCell>
                        <TableCell className={classes.tableFooter}>{temp.stateName}</TableCell>
                        <TableCell className={classes.tableFooter}>{temp.apr.neft}</TableCell>{' '}
                        <TableCell className={classes.tableFooter}>{temp.apr.bank}</TableCell>{' '}
                        <TableCell className={classes.tableFooter}>{temp.apr.apb}</TableCell>{' '}
                        <TableCell className={classes.tableFooter}>{temp.apr.po}</TableCell>{' '}
                        <TableCell className={classes.tableFooter}>{temp.apr.mo}</TableCell>{' '}
                        <TableCell className={classes.tableFooter}>{temp.apr.cash}</TableCell>
                        <TableCell className={classes.tableFooter}>{temp.may.neft}</TableCell>{' '}
                        <TableCell className={classes.tableFooter}>{temp.may.bank}</TableCell>{' '}
                        <TableCell className={classes.tableFooter}>{temp.may.apb}</TableCell>{' '}
                        <TableCell className={classes.tableFooter}>{temp.may.po}</TableCell>{' '}
                        <TableCell className={classes.tableFooter}>{temp.may.mo}</TableCell>{' '}
                        <TableCell className={classes.tableFooter}>{temp.may.cash}</TableCell>
                        <TableCell className={classes.tableFooter}>{temp.jun.neft}</TableCell>{' '}
                        <TableCell className={classes.tableFooter}>{temp.jun.bank}</TableCell>{' '}
                        <TableCell className={classes.tableFooter}>{temp.jun.apb}</TableCell>{' '}
                        <TableCell className={classes.tableFooter}>{temp.jun.po}</TableCell>{' '}
                        <TableCell className={classes.tableFooter}>{temp.jun.mo}</TableCell>{' '}
                        <TableCell className={classes.tableFooter}>{temp.jun.cash}</TableCell>
                        <TableCell className={classes.tableFooter}>{temp.jul.neft}</TableCell>{' '}
                        <TableCell className={classes.tableFooter}>{temp.jul.bank}</TableCell>{' '}
                        <TableCell className={classes.tableFooter}>{temp.jul.apb}</TableCell>{' '}
                        <TableCell className={classes.tableFooter}>{temp.jul.po}</TableCell>{' '}
                        <TableCell className={classes.tableFooter}>{temp.jul.mo}</TableCell>{' '}
                        <TableCell className={classes.tableFooter}>{temp.jul.cash}</TableCell>
                        <TableCell className={classes.tableFooter}>{temp.aug.neft}</TableCell>{' '}
                        <TableCell className={classes.tableFooter}>{temp.aug.bank}</TableCell>{' '}
                        <TableCell className={classes.tableFooter}>{temp.aug.apb}</TableCell>{' '}
                        <TableCell className={classes.tableFooter}>{temp.aug.po}</TableCell>{' '}
                        <TableCell className={classes.tableFooter}>{temp.aug.mo}</TableCell>{' '}
                        <TableCell className={classes.tableFooter}>{temp.aug.cash}</TableCell>
                        <TableCell className={classes.tableFooter}>{temp.sep.neft}</TableCell>{' '}
                        <TableCell className={classes.tableFooter}>{temp.sep.bank}</TableCell>{' '}
                        <TableCell className={classes.tableFooter}>{temp.sep.apb}</TableCell>{' '}
                        <TableCell className={classes.tableFooter}>{temp.sep.po}</TableCell>{' '}
                        <TableCell className={classes.tableFooter}>{temp.sep.mo}</TableCell>{' '}
                        <TableCell className={classes.tableFooter}>{temp.sep.cash}</TableCell>
                        <TableCell className={classes.tableFooter}>{temp.oct.neft}</TableCell>{' '}
                        <TableCell className={classes.tableFooter}>{temp.oct.bank}</TableCell>{' '}
                        <TableCell className={classes.tableFooter}>{temp.oct.apb}</TableCell>{' '}
                        <TableCell className={classes.tableFooter}>{temp.oct.po}</TableCell>{' '}
                        <TableCell className={classes.tableFooter}>{temp.oct.mo}</TableCell>{' '}
                        <TableCell className={classes.tableFooter}>{temp.oct.cash}</TableCell>
                        <TableCell className={classes.tableFooter}>{temp.nov.neft}</TableCell>{' '}
                        <TableCell className={classes.tableFooter}>{temp.nov.bank}</TableCell>{' '}
                        <TableCell className={classes.tableFooter}>{temp.nov.apb}</TableCell>{' '}
                        <TableCell className={classes.tableFooter}>{temp.nov.po}</TableCell>{' '}
                        <TableCell className={classes.tableFooter}>{temp.nov.mo}</TableCell>{' '}
                        <TableCell className={classes.tableFooter}>{temp.nov.cash}</TableCell>
                        <TableCell className={classes.tableFooter}>{temp.dec.neft}</TableCell>{' '}
                        <TableCell className={classes.tableFooter}>{temp.dec.bank}</TableCell>{' '}
                        <TableCell className={classes.tableFooter}>{temp.dec.apb}</TableCell>{' '}
                        <TableCell className={classes.tableFooter}>{temp.dec.po}</TableCell>{' '}
                        <TableCell className={classes.tableFooter}>{temp.dec.mo}</TableCell>{' '}
                        <TableCell className={classes.tableFooter}>{temp.dec.cash}</TableCell>
                        <TableCell className={classes.tableFooter}>{temp.jan.neft}</TableCell>{' '}
                        <TableCell className={classes.tableFooter}>{temp.jan.bank}</TableCell>{' '}
                        <TableCell className={classes.tableFooter}>{temp.jan.apb}</TableCell>{' '}
                        <TableCell className={classes.tableFooter}>{temp.jan.po}</TableCell>{' '}
                        <TableCell className={classes.tableFooter}>{temp.jan.mo}</TableCell>{' '}
                        <TableCell className={classes.tableFooter}>{temp.jan.cash}</TableCell>
                        <TableCell className={classes.tableFooter}>{temp.feb.neft}</TableCell>{' '}
                        <TableCell className={classes.tableFooter}>{temp.feb.bank}</TableCell>{' '}
                        <TableCell className={classes.tableFooter}>{temp.feb.apb}</TableCell>{' '}
                        <TableCell className={classes.tableFooter}>{temp.feb.po}</TableCell>{' '}
                        <TableCell className={classes.tableFooter}>{temp.feb.mo}</TableCell>{' '}
                        <TableCell className={classes.tableFooter}>{temp.feb.cash}</TableCell>
                        <TableCell className={classes.tableFooter}>{temp.mar.neft}</TableCell>{' '}
                        <TableCell className={classes.tableFooter}>{temp.mar.bank}</TableCell>{' '}
                        <TableCell className={classes.tableFooter}>{temp.mar.apb}</TableCell>{' '}
                        <TableCell className={classes.tableFooter}>{temp.mar.po}</TableCell>{' '}
                        <TableCell className={classes.tableFooter}>{temp.mar.mo}</TableCell>{' '}
                        <TableCell className={classes.tableFooter}>{temp.mar.cash}</TableCell>
                        <TableCell className={classes.tableFooter}>{temp.tot.neft}</TableCell>{' '}
                        <TableCell className={classes.tableFooter}>{temp.tot.bank}</TableCell>{' '}
                        <TableCell className={classes.tableFooter}>{temp.tot.apb}</TableCell>{' '}
                        <TableCell className={classes.tableFooter}>{temp.tot.po}</TableCell>{' '}
                        <TableCell className={classes.tableFooter}>{temp.tot.mo}</TableCell>{' '}
                        <TableCell className={classes.tableFooter}>{temp.tot.cash}</TableCell>
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
export default DisbursementTransactionMonthWiseReport;
