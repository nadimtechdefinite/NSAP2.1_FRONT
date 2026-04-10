import React, { useState } from 'react';
import axiosInstance from 'hooks/useAuthTokenUrl';
import MainCard from 'ui-component/cards/MainCard';
import {
  Alert,
  Backdrop,
  Button,
  CircularProgress,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField
} from '@mui/material';
import { useEffect } from 'react';
import reportcss from 'components/common/reportsCSS';

const MonthlyProgressReport1 = () => {
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState(null);
  const handleCloseSnackbar = () => setSnackbar(null);
  const classes = reportcss();

  const [monthData, setMonthData] = useState([]);
  const [yearData, setYearData] = useState([]);
  //to be changed in form type
  const [month, setSelectedMonth] = useState('');
  const [year, setSelectedYear] = useState('');
  const [editMpr, setEditMpr] = useState(false);
  const [updatingMPR, setUpdatingMPR] = useState(false);
  const [mprData, setMprData] = useState({});
  const [statusDownload, setStatusDownload] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [showDownloadButton, setShowDownloadButton] = useState(false);

  React.useEffect(() => {
    if (statusDownload.trim() === 'MPR is already Uploaded and Freezed. Available for Download !!') {
      setOpenSnackbar(true);
    } else {
      setShowDownloadButton(false);
    }
  }, [statusDownload]);

  const handleSnackbarClose = () => {
    setOpenSnackbar(false);
    setShowDownloadButton(true);
  };
  const getMonths = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('MPR/getMonths');
      if (response.status == 204) {
        setSnackbar({ children: 'No Data Available', severity: 'error' });
        return false;
      }
      const newData = response.data.map((row) => ({ ...row, id: row.monthName }));
      setMonthData(newData);
    } catch (error) {
      setSnackbar({ children: 'Some Internal Error Occured While Getting Months', severity: 'error' });
      console.error('Error fetching Getting Months', error);
    } finally {
      setLoading(false);
    }
  };

  const getYears = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('MPR/getYears');
      if (response.status == 204) {
        setSnackbar({ children: 'No Data Available', severity: 'error' });
        return false;
      }
      const newData = response.data.map((row) => ({ ...row, id: row.year }));
      setYearData(newData);
    } catch (error) {
      setSnackbar({ children: 'Some Internal Error Occured While Getting Months', severity: 'error' });
      console.error('Error fetching Getting Months', error);
    } finally {
      setLoading(false);
    }
  };
  const handleDownload = async () => {
    try {
      const selectedMonth = monthData.find((s) => s.monthName === month);
      const response = await axiosInstance.get(`/MPR/downloadPdf/${year}/${selectedMonth.monthValue}?downloadStatus=true`, {
        responseType: 'blob'
      });

      if (response.data) {
        const pdfBlob = new Blob([response.data], { type: 'application/pdf' });
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(pdfBlob);
        link.download = `Monthly_Progress_Report_${month}_${year}.pdf`;
        link.click();
      }
    } catch (error) {
      console.error('Error downloading PDF:', error);
    }
  };

  const checkMPR1Uploaded = async () => {
    try {
      setLoading(true);
      const selectedMonth = monthData.find((s) => s.monthName === month);
      const response = await axiosInstance.get('MPR/checkMPR1/' + year + '/' + selectedMonth.monthValue);
      setStatusDownload(response.data.status);

      if (response.data.status != 'ok') {
        setEditMpr(false);
        if (response.data.status == 'MPR uploaded available for edit') {
          let edit = window.confirm(response.data.status);
          if (edit) {
            setEditMpr(true);
            setUpdatingMPR(true);
            setMprData(response.data);

            return false;
          }
          setUpdatingMPR(false);
          setEditMpr(false);
          return false;
        }
        setUpdatingMPR(false);
        setEditMpr(false);
        setSnackbar({ children: response.data.status, severity: 'error' });
        return false;
      }
      setEditMpr(true);
    } catch (error) {
      setSnackbar({ children: 'Some Internal Error Occured While getting MPR Uploaded Details', severity: 'error' });
      console.error('Error fetching Getting MPR Uploaded Details', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    resetValue();
    resetColor();
  }, [editMpr]);

  useEffect(() => {
    if (updatingMPR && editMpr) {
      setValueToFormForEdit(mprData);
    }
  }, [editMpr, updatingMPR]);

  const handleMonthChange = (e) => {
    setSelectedMonth(e.target.value);
  };

  const handleYearChange = (e) => {
    setSelectedYear(e.target.value);
  };

  useEffect(() => {
    getMonths();
    getYears();
  }, []);

  useEffect(() => {
    resetValue();
    resetColor();

    if (month !== '' && year !== '') {
      checkMPR1Uploaded();
    }
  }, [month, year]);

  const resetColor = () => {
    let allInput = document.querySelectorAll('input');
    allInput.forEach((a) => {
      a.style.backgroundColor = 'white';
    });
  };

  const resetValue = () => {
    let allInput = document.querySelectorAll('input');
    allInput.forEach((a) => {
      a.value = 0;
    });
  };

  const handleNumInput = (event) => {
    if (event) {
      event.target.value = event.target.value.replace(/[^0-9]/g, '');
      if (event.target.value == '') {
        event.target.value = 0;
      } else {
        event.target.value = parseInt(event.target.value);
      }
    }

    calcTotalBenCount();
    calcBankTotalDisb();
    calcTotalDisb();
    calcCumTransIgnoaps();
    calcCumTransIgnwps();
    calcCumTransIgndps();
  };

  const handleFloatInput = (event) => {
    if (event) {
      event.target.value = event.target.value.replace(/[^0-9.]/g, '');
      event.target.value = event.target.value.replace(/(\..*)\./g, '$1');
      if (event.target.value == '') {
        event.target.value = parseFloat(0);
      } else if (!event.target.value.endsWith('.')) {
        event.target.value = parseFloat(event.target.value);
      }
    }

    calcTotalFund();
    calcClosingBalance();
    calcCumlativeExpenditure();
    calcCumAmtIgnoaps();
    calcCumAmtIgnwps();
    calcCumAmtIgndps();
  };

  //calculation starts
  const calcTotalFund = () => {
    document.getElementById('totalFund').value = parseFloat(
      parseFloat(document.getElementById('openingBalance').value) + parseFloat(document.getElementById('amountReleasedCSS').value)
    ).toFixed(2);
  };

  const calcClosingBalance = () => {
    document.getElementById('closingBalance').value = parseFloat(
      parseFloat(document.getElementById('totalFund').value) - parseFloat(document.getElementById('expenditureForMonth').value)
    ).toFixed(2);
  };

  const calcCumlativeExpenditure = () => {
    document.getElementById('cumulativeForIgnoaps').value = parseFloat(document.getElementById('expenditureForIgnoaps').value).toFixed(2);
    document.getElementById('cumulativeForIgnwps').value = parseFloat(document.getElementById('expenditureForIgnwps').value).toFixed(2);
    document.getElementById('cumulativeForIgndps').value = parseFloat(document.getElementById('expenditureForIgndps').value).toFixed(2);
    document.getElementById('cumulativeForNFBS').value = parseFloat(document.getElementById('expenditureForNFBS').value).toFixed(2);
    document.getElementById('cumulativeForANNAPURNA').value = parseFloat(document.getElementById('expenditureForANNAPURNA').value).toFixed(
      2
    );
  };

  const calcTotalBenCount = () => {
    document.getElementById('totalCountIgnoaps').value =
      parseInt(document.getElementById('femaleCountIgnoaps').value) +
      parseInt(document.getElementById('maleCountIgnoaps').value) +
      parseInt(document.getElementById('transCountIgnoaps').value);
    document.getElementById('totalCountIgnwps').value =
      parseInt(document.getElementById('femaleCountIgnwps').value) + parseInt(document.getElementById('transCountIgnwps').value);
    document.getElementById('totalCountIgndps').value =
      parseInt(document.getElementById('femaleCountIgndps').value) +
      parseInt(document.getElementById('maleCountIgndps').value) +
      parseInt(document.getElementById('transCountIgndps').value);
    document.getElementById('totalCountNFBS').value =
      parseInt(document.getElementById('femaleCountNFBS').value) +
      parseInt(document.getElementById('maleCountNFBS').value) +
      parseInt(document.getElementById('transCountNFBS').value);
    document.getElementById('totalCountANNAPURNA').value =
      parseInt(document.getElementById('femaleCountANNAPURNA').value) +
      parseInt(document.getElementById('maleCountANNAPURNA').value) +
      parseInt(document.getElementById('transCountANNAPURNA').value);
  };

  const calcBankTotalDisb = () => {
    document.getElementById('bankDisbTotalIgnoaps').value =
      parseInt(document.getElementById('apbDisbIgnoaps').value) + parseInt(document.getElementById('neftDisbIgnoaps').value);
    document.getElementById('bankDisbTotalIgnwps').value =
      parseInt(document.getElementById('apbDisbIgnwps').value) + parseInt(document.getElementById('neftDisbIgnwps').value);
    document.getElementById('bankDisbTotalIgndps').value =
      parseInt(document.getElementById('apbDisbIgndps').value) + parseInt(document.getElementById('neftDisbIgndps').value);
    document.getElementById('bankDisbTotalNFBS').value =
      parseInt(document.getElementById('apbDisbNFBS').value) + parseInt(document.getElementById('neftDisbNFBS').value);
    document.getElementById('bankDisbTotalANNAPURNA').value =
      parseInt(document.getElementById('apbDisbANNAPURNA').value) + parseInt(document.getElementById('neftDisbANNAPURNA').value);
  };

  const calcTotalDisb = () => {
    document.getElementById('totalDisbIgnoaps').value =
      parseInt(document.getElementById('apbDisbIgnoaps').value) +
      parseInt(document.getElementById('neftDisbIgnoaps').value) +
      parseInt(document.getElementById('poDisbIgnoaps').value) +
      parseInt(document.getElementById('cashDisbIgnoaps').value) +
      parseInt(document.getElementById('moneyDisbIgnoaps').value);
    document.getElementById('totalDisbIgnwps').value =
      parseInt(document.getElementById('apbDisbIgnwps').value) +
      parseInt(document.getElementById('neftDisbIgnwps').value) +
      parseInt(document.getElementById('poDisbIgnwps').value) +
      parseInt(document.getElementById('cashDisbIgnwps').value) +
      parseInt(document.getElementById('moneyDisbIgnwps').value);
    document.getElementById('totalDisbIgndps').value =
      parseInt(document.getElementById('apbDisbIgndps').value) +
      parseInt(document.getElementById('neftDisbIgndps').value) +
      parseInt(document.getElementById('poDisbIgndps').value) +
      parseInt(document.getElementById('cashDisbIgndps').value) +
      parseInt(document.getElementById('moneyDisbIgndps').value);
    document.getElementById('totalDisbNFBS').value =
      parseInt(document.getElementById('apbDisbNFBS').value) +
      parseInt(document.getElementById('neftDisbNFBS').value) +
      parseInt(document.getElementById('poDisbNFBS').value) +
      parseInt(document.getElementById('cashDisbNFBS').value) +
      parseInt(document.getElementById('moneyDisbNFBS').value);
    document.getElementById('totalDisbANNAPURNA').value =
      parseInt(document.getElementById('apbDisbANNAPURNA').value) +
      parseInt(document.getElementById('neftDisbANNAPURNA').value) +
      parseInt(document.getElementById('poDisbANNAPURNA').value) +
      parseInt(document.getElementById('cashDisbANNAPURNA').value) +
      parseInt(document.getElementById('moneyDisbANNAPURNA').value);
  };

  const calcCumTransIgnoaps = () => {
    //useless code
    document.getElementById('cumNoOfTxnApbIgnoaps').value = parseInt(document.getElementById('noOfTxnApbIgnoaps').value);
    document.getElementById('cumNoOfTxnNeftIgnoaps').value = parseInt(document.getElementById('noOfTxnNeftIgnoaps').value);
    document.getElementById('cumNoOfTxnPoIgnoaps').value = parseInt(document.getElementById('noOfTxnPoIgnoaps').value);
    document.getElementById('cumNoOfTxnMoIgnoaps').value = parseInt(document.getElementById('noOfTxnMoIgnoaps').value);
    document.getElementById('cumNoOfTxnCashIgnoaps').value = parseInt(document.getElementById('noOfTxnCashIgnoaps').value);

    //calc  totalTransSum and totalCumSum
    document.getElementById('noOfTxnTotalIgnoaps').value =
      parseInt(document.getElementById('noOfTxnApbIgnoaps').value) +
      parseInt(document.getElementById('noOfTxnNeftIgnoaps').value) +
      parseInt(document.getElementById('noOfTxnPoIgnoaps').value) +
      parseInt(document.getElementById('noOfTxnMoIgnoaps').value) +
      parseInt(document.getElementById('noOfTxnCashIgnoaps').value);
    document.getElementById('cumNoOfTxnTotalIgnoaps').value =
      parseInt(document.getElementById('cumNoOfTxnApbIgnoaps').value) +
      parseInt(document.getElementById('cumNoOfTxnNeftIgnoaps').value) +
      parseInt(document.getElementById('cumNoOfTxnPoIgnoaps').value) +
      parseInt(document.getElementById('cumNoOfTxnMoIgnoaps').value) +
      parseInt(document.getElementById('cumNoOfTxnCashIgnoaps').value);
  };

  const calcCumAmtIgnoaps = () => {
    document.getElementById('cumMonthlyAmountApbIgnoaps').value = parseFloat(
      document.getElementById('monthlyAmountApbIgnoaps').value
    ).toFixed(2);
    document.getElementById('cumMonthlyAmountNeftIgnoaps').value = parseFloat(
      document.getElementById('monthlyAmountNeftIgnoaps').value
    ).toFixed(2);
    document.getElementById('cumMonthlyAmountPoIgnoaps').value = parseFloat(
      document.getElementById('monthlyAmountPoIgnoaps').value
    ).toFixed(2);
    document.getElementById('cumMonthlyAmountMoIgnoaps').value = parseFloat(
      document.getElementById('monthlyAmountMoIgnoaps').value
    ).toFixed(2);
    document.getElementById('cumMonthlyAmountCashIgnoaps').value = parseFloat(
      document.getElementById('monthlyAmountCashIgnoaps').value
    ).toFixed(2);

    //calc totalAmtSum and totalCumSum
    document.getElementById('monthlyAmountTotalIgnoaps').value = parseFloat(
      parseFloat(document.getElementById('monthlyAmountApbIgnoaps').value) +
        parseFloat(document.getElementById('monthlyAmountNeftIgnoaps').value) +
        parseFloat(document.getElementById('monthlyAmountPoIgnoaps').value) +
        parseFloat(document.getElementById('monthlyAmountMoIgnoaps').value) +
        parseFloat(document.getElementById('monthlyAmountCashIgnoaps').value)
    ).toFixed(2);
    document.getElementById('cumMonthlyAmountTotalIgnoaps').value = parseFloat(
      parseFloat(document.getElementById('cumMonthlyAmountApbIgnoaps').value) +
        parseFloat(document.getElementById('cumMonthlyAmountNeftIgnoaps').value) +
        parseFloat(document.getElementById('cumMonthlyAmountPoIgnoaps').value) +
        parseFloat(document.getElementById('cumMonthlyAmountMoIgnoaps').value) +
        parseFloat(document.getElementById('cumMonthlyAmountCashIgnoaps').value)
    ).toFixed(2);
  };

  const calcCumTransIgnwps = () => {
    //useless code
    document.getElementById('cumNoOfTxnApbIgnwps').value = parseInt(document.getElementById('noOfTxnApbIgnwps').value);
    document.getElementById('cumNoOfTxnNeftIgnwps').value = parseInt(document.getElementById('noOfTxnNeftIgnwps').value);
    document.getElementById('cumNoOfTxnPoIgnwps').value = parseInt(document.getElementById('noOfTxnPoIgnwps').value);
    document.getElementById('cumNoOfTxnMoIgnwps').value = parseInt(document.getElementById('noOfTxnMoIgnwps').value);
    document.getElementById('cumNoOfTxnCashIgnwps').value = parseInt(document.getElementById('noOfTxnCashIgnwps').value);

    //calc  totalTransSum and totalCumSum
    document.getElementById('noOfTxnTotalIgnwps').value =
      parseInt(document.getElementById('noOfTxnApbIgnwps').value) +
      parseInt(document.getElementById('noOfTxnNeftIgnwps').value) +
      parseInt(document.getElementById('noOfTxnPoIgnwps').value) +
      parseInt(document.getElementById('noOfTxnMoIgnwps').value) +
      parseInt(document.getElementById('noOfTxnCashIgnwps').value);
    document.getElementById('cumNoOfTxnTotalIgnwps').value =
      parseInt(document.getElementById('cumNoOfTxnApbIgnwps').value) +
      parseInt(document.getElementById('cumNoOfTxnNeftIgnwps').value) +
      parseInt(document.getElementById('cumNoOfTxnPoIgnwps').value) +
      parseInt(document.getElementById('cumNoOfTxnMoIgnwps').value) +
      parseInt(document.getElementById('cumNoOfTxnCashIgnwps').value);
  };

  const calcCumAmtIgnwps = () => {
    document.getElementById('cumMonthlyAmountApbIgnwps').value = parseFloat(
      document.getElementById('monthlyAmountApbIgnwps').value
    ).toFixed(2);
    document.getElementById('cumMonthlyAmountNeftIgnwps').value = parseFloat(
      document.getElementById('monthlyAmountNeftIgnwps').value
    ).toFixed(2);
    document.getElementById('cumMonthlyAmountPoIgnwps').value = parseFloat(document.getElementById('monthlyAmountPoIgnwps').value).toFixed(
      2
    );
    document.getElementById('cumMonthlyAmountMoIgnwps').value = parseFloat(document.getElementById('monthlyAmountMoIgnwps').value).toFixed(
      2
    );
    document.getElementById('cumMonthlyAmountCashIgnwps').value = parseFloat(
      document.getElementById('monthlyAmountCashIgnwps').value
    ).toFixed(2);

    //calc totalAmtSum and totalCumSum
    document.getElementById('monthlyAmountTotalIgnwps').value = parseFloat(
      parseFloat(document.getElementById('monthlyAmountApbIgnwps').value) +
        parseFloat(document.getElementById('monthlyAmountNeftIgnwps').value) +
        parseFloat(document.getElementById('monthlyAmountPoIgnwps').value) +
        parseFloat(document.getElementById('monthlyAmountMoIgnwps').value) +
        parseFloat(document.getElementById('monthlyAmountCashIgnwps').value)
    ).toFixed(2);
    document.getElementById('cumMonthlyAmountTotalIgnwps').value = parseFloat(
      parseFloat(document.getElementById('cumMonthlyAmountApbIgnwps').value) +
        parseFloat(document.getElementById('cumMonthlyAmountNeftIgnwps').value) +
        parseFloat(document.getElementById('cumMonthlyAmountPoIgnwps').value) +
        parseFloat(document.getElementById('cumMonthlyAmountMoIgnwps').value) +
        parseFloat(document.getElementById('cumMonthlyAmountCashIgnwps').value)
    ).toFixed(2);
  };

  const calcCumTransIgndps = () => {
    //useless code
    document.getElementById('cumNoOfTxnApbIgndps').value = parseInt(document.getElementById('noOfTxnApbIgndps').value);
    document.getElementById('cumNoOfTxnNeftIgndps').value = parseInt(document.getElementById('noOfTxnNeftIgndps').value);
    document.getElementById('cumNoOfTxnPoIgndps').value = parseInt(document.getElementById('noOfTxnPoIgndps').value);
    document.getElementById('cumNoOfTxnMoIgndps').value = parseInt(document.getElementById('noOfTxnMoIgndps').value);
    document.getElementById('cumNoOfTxnCashIgndps').value = parseInt(document.getElementById('noOfTxnCashIgndps').value);

    //calc  totalTransSum and totalCumSum
    document.getElementById('noOfTxnTotalIgndps').value =
      parseInt(document.getElementById('noOfTxnApbIgndps').value) +
      parseInt(document.getElementById('noOfTxnNeftIgndps').value) +
      parseInt(document.getElementById('noOfTxnPoIgndps').value) +
      parseInt(document.getElementById('noOfTxnMoIgndps').value) +
      parseInt(document.getElementById('noOfTxnCashIgndps').value);
    document.getElementById('cumNoOfTxnTotalIgndps').value =
      parseInt(document.getElementById('cumNoOfTxnApbIgndps').value) +
      parseInt(document.getElementById('cumNoOfTxnNeftIgndps').value) +
      parseInt(document.getElementById('cumNoOfTxnPoIgndps').value) +
      parseInt(document.getElementById('cumNoOfTxnMoIgndps').value) +
      parseInt(document.getElementById('cumNoOfTxnCashIgndps').value);
  };

  const calcCumAmtIgndps = () => {
    document.getElementById('cumMonthlyAmountApbIgndps').value = parseFloat(
      document.getElementById('monthlyAmountApbIgndps').value
    ).toFixed(2);
    document.getElementById('cumMonthlyAmountNeftIgndps').value = parseFloat(
      document.getElementById('monthlyAmountNeftIgndps').value
    ).toFixed(2);
    document.getElementById('cumMonthlyAmountPoIgndps').value = parseFloat(document.getElementById('monthlyAmountPoIgndps').value).toFixed(
      2
    );
    document.getElementById('cumMonthlyAmountMoIgndps').value = parseFloat(document.getElementById('monthlyAmountMoIgndps').value).toFixed(
      2
    );
    document.getElementById('cumMonthlyAmountCashIgndps').value = parseFloat(
      document.getElementById('monthlyAmountCashIgndps').value
    ).toFixed(2);

    //calc totalAmtSum and totalCumSum
    document.getElementById('monthlyAmountTotalIgndps').value = parseFloat(
      parseFloat(document.getElementById('monthlyAmountApbIgndps').value) +
        parseFloat(document.getElementById('monthlyAmountNeftIgndps').value) +
        parseFloat(document.getElementById('monthlyAmountPoIgndps').value) +
        parseFloat(document.getElementById('monthlyAmountMoIgndps').value) +
        parseFloat(document.getElementById('monthlyAmountCashIgndps').value)
    ).toFixed(2);
    document.getElementById('cumMonthlyAmountTotalIgndps').value = parseFloat(
      parseFloat(document.getElementById('cumMonthlyAmountApbIgndps').value) +
        parseFloat(document.getElementById('cumMonthlyAmountNeftIgndps').value) +
        parseFloat(document.getElementById('cumMonthlyAmountPoIgndps').value) +
        parseFloat(document.getElementById('cumMonthlyAmountMoIgndps').value) +
        parseFloat(document.getElementById('cumMonthlyAmountCashIgndps').value)
    ).toFixed(2);
  };

  const submitValidation = () => {
    resetColor();

    if (month === '') {
      setSnackbar({ children: 'Please Select Month', severity: 'error' });
      return false;
    }
    if (year === '') {
      setSnackbar({ children: 'Please Select Year', severity: 'error' });
      return false;
    }

    if (parseInt(document.getElementById('totalDisbIgnoaps').value) != parseInt(document.getElementById('totalCountIgnoaps').value)) {
      setSnackbar({ children: 'IGNOAPS reported beneficiaries not equal to the disbursed beneficiaries', severity: 'error' });
      document.getElementById('totalDisbIgnoaps').style.backgroundColor = 'red';
      document.getElementById('totalCountIgnoaps').style.backgroundColor = 'red';
      return false;
    }
    if (parseInt(document.getElementById('totalDisbIgnwps').value) != parseInt(document.getElementById('totalCountIgnwps').value)) {
      setSnackbar({ children: 'IGNWPS reported beneficiaries not equal to the disbursed beneficiaries', severity: 'error' });
      document.getElementById('totalDisbIgnwps').style.backgroundColor = 'red';
      document.getElementById('totalCountIgnwps').style.backgroundColor = 'red';
      return false;
    }
    if (parseInt(document.getElementById('totalDisbIgndps').value) != parseInt(document.getElementById('totalCountIgndps').value)) {
      setSnackbar({ children: 'IGNDPS reported beneficiaries not equal to the disbursed beneficiaries', severity: 'error' });
      document.getElementById('totalDisbIgndps').style.backgroundColor = 'red';
      document.getElementById('totalCountIgndps').style.backgroundColor = 'red';
      return false;
    }
    if (parseInt(document.getElementById('totalDisbNFBS').value) != parseInt(document.getElementById('totalCountNFBS').value)) {
      setSnackbar({ children: 'NFBS reported beneficiaries not equal to the disbursed beneficiaries', severity: 'error' });
      document.getElementById('totalDisbNFBS').style.backgroundColor = 'red';
      document.getElementById('totalCountNFBS').style.backgroundColor = 'red';
      return false;
    }
    if (parseInt(document.getElementById('totalDisbANNAPURNA').value) != parseInt(document.getElementById('totalCountANNAPURNA').value)) {
      setSnackbar({ children: 'ANNAPURNA reported beneficiaries not equal to the disbursed beneficiaries', severity: 'error' });
      document.getElementById('totalDisbANNAPURNA').style.backgroundColor = 'red';
      document.getElementById('totalCountANNAPURNA').style.backgroundColor = 'red';
      return false;
    }

    if (
      parseFloat(document.getElementById('expenditureForIgnoaps').value).toFixed(2) !=
      parseFloat(document.getElementById('monthlyAmountTotalIgnoaps').value).toFixed(2)
    ) {
      setSnackbar({
        children:
          'Expenditure Reported for the month is not equal to the expense shown in disbursement of IGNOAPS:' +
          document.getElementById('expenditureForIgnoaps').value +
          ' not equal ' +
          document.getElementById('monthlyAmountTotalIgnoaps').value,
        severity: 'error'
      });
      document.getElementById('expenditureForIgnoaps').style.backgroundColor = 'red';
      document.getElementById('monthlyAmountTotalIgnoaps').style.backgroundColor = 'red';
      return false;
    }

    if (
      parseFloat(document.getElementById('expenditureForIgnwps').value).toFixed(2) !=
      parseFloat(document.getElementById('monthlyAmountTotalIgnwps').value).toFixed(2)
    ) {
      setSnackbar({
        children:
          'Expenditure Reported for the month is not equal to the expense shown in disbursement of IGNWPS:' +
          document.getElementById('expenditureForIgnwps').value +
          ' not equal ' +
          document.getElementById('monthlyAmountTotalIgnwps').value,
        severity: 'error'
      });
      document.getElementById('expenditureForIgnwps').style.backgroundColor = 'red';
      document.getElementById('monthlyAmountTotalIgnwps').style.backgroundColor = 'red';
      return false;
    }

    if (
      parseFloat(document.getElementById('expenditureForIgndps').value).toFixed(2) !=
      parseFloat(document.getElementById('monthlyAmountTotalIgndps').value).toFixed(2)
    ) {
      setSnackbar({
        children:
          'Expenditure Reported for the month is not equal to the expense shown in disbursement of IGNDPS:' +
          document.getElementById('expenditureForIgndps').value +
          ' not equal ' +
          document.getElementById('monthlyAmountTotalIgndps').value,
        severity: 'error'
      });
      document.getElementById('expenditureForIgndps').style.backgroundColor = 'red';
      document.getElementById('monthlyAmountTotalIgndps').style.backgroundColor = 'red';
      return false;
    }

    return true;
  };

  //calculation ends

  const saveMPR1 = async (isFinalSubmit = false) => {
    if (!submitValidation()) {
      return false;
    }
    try {
      let body = finalBody();

      body.isFinalSubmit = isFinalSubmit;
      console.log(JSON.stringify(body));
      setLoading(true);
      const response = await axiosInstance.post('MPR/saveMPR', body);

      if (response.data === 'Monthly Progress Report Ssved In Draft Successfully') {
        setEditMpr(false);
        setUpdatingMPR(false);
        setSnackbar({ children: response.data, severity: 'success' });
        return false;
      } else if (response.data === 'Monthly Progress Report Finalized Successfully') {
        setEditMpr(false);
        setUpdatingMPR(false);
        setSnackbar({ children: response.data, severity: 'success' });
        return false;
      } else {
        setSnackbar({ children: response.data, severity: 'error' });
        return false;
      }
    } catch (error) {
      setSnackbar({ children: 'Some Internal Error Occurred While Saving MPR1', severity: 'error' });
      console.error('Error fetching Saving MPR1', error);
    } finally {
      setLoading(false);
    }
  };

  const setValueToFormForEdit = async (data) => {
    resetValue();
    resetColor();

    let ignoaps = data.ignoaps;
    document.getElementById('openingBalance').value = ignoaps.openingBalance || 0;
    document.getElementById('amountReleasedCSS').value = ignoaps.cssReleaseBal || 0;
    document.getElementById('totalFund').value = ignoaps.totalAvailableFund || 0;
    document.getElementById('expenditureForMonth').value = ignoaps.expUptoMonth || 0;
    document.getElementById('closingBalance').value = ignoaps.closingBalance || 0;

    document.getElementById('physicalCoverageIgnoaps').value = ignoaps.phyCoverage || 0;
    document.getElementById('expenditureForIgnoaps').value = ignoaps.monthlyExp || 0;
    document.getElementById('cumulativeForIgnoaps').value = ignoaps.monthlyExpComulative || 0;
    document.getElementById('maleCountIgnoaps').value = ignoaps.male || 0;
    document.getElementById('femaleCountIgnoaps').value = ignoaps.female || 0;
    document.getElementById('transCountIgnoaps').value = ignoaps.transgender || 0;
    document.getElementById('neftDisbIgnoaps').value = ignoaps.neft || 0;
    document.getElementById('apbDisbIgnoaps').value = ignoaps.apb || 0;
    document.getElementById('poDisbIgnoaps').value = ignoaps.po;
    document.getElementById('moneyDisbIgnoaps').value = ignoaps.mo || 0;
    document.getElementById('cashDisbIgnoaps').value = ignoaps.cash || 0;
    document.getElementById('noOfTxnApbIgnoaps').value = ignoaps.noOfTransactionsApb || 0;
    document.getElementById('cumNoOfTxnApbIgnoaps').value = ignoaps.transactionComulativeApb || 0;
    document.getElementById('monthlyAmountApbIgnoaps').value = ignoaps.monthlyAmtApb || 0;
    document.getElementById('cumMonthlyAmountApbIgnoaps').value = ignoaps.monthlyAmtComulativeApb || 0;
    document.getElementById('noOfTxnNeftIgnoaps').value = ignoaps.noOfTransactionsNeft || 0;
    document.getElementById('cumNoOfTxnNeftIgnoaps').value = ignoaps.transactionComulativeNeft || 0;
    document.getElementById('monthlyAmountNeftIgnoaps').value = ignoaps.monthlyAmtNeft || 0;
    document.getElementById('cumMonthlyAmountNeftIgnoaps').value = ignoaps.monthlyAmtComulativeNeft || 0;
    document.getElementById('noOfTxnPoIgnoaps').value = ignoaps.noOfTransactionsPo || 0;
    document.getElementById('cumNoOfTxnPoIgnoaps').value = ignoaps.transactionComulativePo || 0;
    document.getElementById('monthlyAmountPoIgnoaps').value = ignoaps.monthlyAmtPo || 0;
    document.getElementById('cumMonthlyAmountPoIgnoaps').value = ignoaps.monthlyAmtComulativePo || 0;
    document.getElementById('noOfTxnMoIgnoaps').value = ignoaps.noOfTransactionsMo || 0;
    document.getElementById('cumNoOfTxnMoIgnoaps').value = ignoaps.transactionComulativeMo || 0;
    document.getElementById('monthlyAmountMoIgnoaps').value = ignoaps.monthlyAmtMo || 0;
    document.getElementById('cumMonthlyAmountMoIgnoaps').value = ignoaps.monthlyAmtComulativeMo || 0;
    document.getElementById('noOfTxnCashIgnoaps').value = ignoaps.noOfTransactionsCash || 0;
    document.getElementById('cumNoOfTxnCashIgnoaps').value = ignoaps.transactionComulativeCash || 0;
    document.getElementById('monthlyAmountCashIgnoaps').value = ignoaps.monthlyAmtCash || 0;
    document.getElementById('cumMonthlyAmountCashIgnoaps').value = ignoaps.monthlyAmtComulativeCash || 0;

    let ignwps = data.ignwps;
    document.getElementById('physicalCoverageIgnwps').value = ignwps.phyCoverage || 0;
    document.getElementById('expenditureForIgnwps').value = ignwps.monthlyExp || 0;
    document.getElementById('cumulativeForIgnwps').value = ignwps.monthlyExpComulative || 0;
    document.getElementById('femaleCountIgnwps').value = ignwps.female || 0;
    document.getElementById('transCountIgnwps').value = ignwps.transgender || 0;
    document.getElementById('neftDisbIgnwps').value = ignwps.neft || 0;
    document.getElementById('apbDisbIgnwps').value = ignwps.apb || 0;
    document.getElementById('poDisbIgnwps').value = ignwps.po || 0;
    document.getElementById('moneyDisbIgnwps').value = ignwps.mo || 0;
    document.getElementById('cashDisbIgnwps').value = ignwps.cash || 0;
    document.getElementById('noOfTxnApbIgnwps').value = ignwps.noOfTransactionsApb || 0;
    document.getElementById('cumNoOfTxnApbIgnwps').value = ignwps.transactionComulativeApb || 0;
    document.getElementById('monthlyAmountApbIgnwps').value = ignwps.monthlyAmtApb || 0;
    document.getElementById('cumMonthlyAmountApbIgnwps').value = ignwps.monthlyAmtComulativeApb || 0;
    document.getElementById('noOfTxnNeftIgnwps').value = ignwps.noOfTransactionsNeft || 0;
    document.getElementById('cumNoOfTxnNeftIgnwps').value = ignwps.transactionComulativeNeft || 0;
    document.getElementById('monthlyAmountNeftIgnwps').value = ignwps.monthlyAmtNeft || 0;
    document.getElementById('cumMonthlyAmountNeftIgnwps').value = ignwps.monthlyAmtComulativeNeft || 0;
    document.getElementById('noOfTxnPoIgnwps').value = ignwps.noOfTransactionsPo || 0;
    document.getElementById('cumNoOfTxnPoIgnwps').value = ignwps.transactionComulativePo || 0;
    document.getElementById('monthlyAmountPoIgnwps').value = ignwps.monthlyAmtPo || 0;
    document.getElementById('cumMonthlyAmountPoIgnwps').value = ignwps.monthlyAmtComulativePo || 0;
    document.getElementById('noOfTxnMoIgnwps').value = ignwps.noOfTransactionsMo || 0;
    document.getElementById('cumNoOfTxnMoIgnwps').value = ignwps.transactionComulativeMo || 0;
    document.getElementById('monthlyAmountMoIgnwps').value = ignwps.monthlyAmtMo || 0;
    document.getElementById('cumMonthlyAmountMoIgnwps').value = ignwps.monthlyAmtComulativeMo || 0;
    document.getElementById('noOfTxnCashIgnwps').value = ignwps.noOfTransactionsCash || 0;
    document.getElementById('cumNoOfTxnCashIgnwps').value = ignwps.transactionComulativeCash || 0;
    document.getElementById('monthlyAmountCashIgnwps').value = ignwps.monthlyAmtCash || 0;
    document.getElementById('cumMonthlyAmountCashIgnwps').value = ignwps.monthlyAmtComulativeCash || 0;

    let igndps = data.igndps;
    document.getElementById('physicalCoverageIgndps').value = igndps.phyCoverage || 0;
    document.getElementById('expenditureForIgndps').value = igndps.monthlyExp || 0;
    document.getElementById('cumulativeForIgndps').value = igndps.monthlyExpComulative || 0;
    document.getElementById('maleCountIgndps').value = igndps.male || 0;
    document.getElementById('femaleCountIgndps').value = igndps.female || 0;
    document.getElementById('transCountIgndps').value = igndps.transgender || 0;
    document.getElementById('neftDisbIgndps').value = igndps.neft || 0;
    document.getElementById('apbDisbIgndps').value = igndps.apb || 0;
    document.getElementById('poDisbIgndps').value = igndps.po || 0;
    document.getElementById('moneyDisbIgndps').value = igndps.mo || 0;
    document.getElementById('cashDisbIgndps').value = igndps.cash || 0;
    document.getElementById('noOfTxnApbIgndps').value = igndps.noOfTransactionsApb || 0;
    document.getElementById('cumNoOfTxnApbIgndps').value = igndps.transactionComulativeApb || 0;
    document.getElementById('monthlyAmountApbIgndps').value = igndps.monthlyAmtApb || 0;
    document.getElementById('cumMonthlyAmountApbIgndps').value = igndps.monthlyAmtComulativeApb || 0;
    document.getElementById('noOfTxnNeftIgndps').value = igndps.noOfTransactionsNeft || 0;
    document.getElementById('cumNoOfTxnNeftIgndps').value = igndps.transactionComulativeNeft || 0;
    document.getElementById('monthlyAmountNeftIgndps').value = igndps.monthlyAmtNeft || 0;
    document.getElementById('cumMonthlyAmountNeftIgndps').value = igndps.monthlyAmtComulativeNeft || 0;
    document.getElementById('noOfTxnPoIgndps').value = igndps.noOfTransactionsPo || 0;
    document.getElementById('cumNoOfTxnPoIgndps').value = igndps.transactionComulativePo || 0;
    document.getElementById('monthlyAmountPoIgndps').value = igndps.monthlyAmtPo || 0;
    document.getElementById('cumMonthlyAmountPoIgndps').value = igndps.monthlyAmtComulativePo || 0;
    document.getElementById('noOfTxnMoIgndps').value = igndps.noOfTransactionsMo || 0;
    document.getElementById('cumNoOfTxnMoIgndps').value = igndps.transactionComulativeMo || 0;
    document.getElementById('monthlyAmountMoIgndps').value = igndps.monthlyAmtMo || 0;
    document.getElementById('cumMonthlyAmountMoIgndps').value = igndps.monthlyAmtComulativeMo || 0;
    document.getElementById('noOfTxnCashIgndps').value = igndps.noOfTransactionsCash || 0;
    document.getElementById('cumNoOfTxnCashIgndps').value = igndps.transactionComulativeCash || 0;
    document.getElementById('monthlyAmountCashIgndps').value = igndps.monthlyAmtCash || 0;
    document.getElementById('cumMonthlyAmountCashIgndps').value = igndps.monthlyAmtComulativeCash || 0;

    let nfbs = data.nfbs;

    document.getElementById('physicalCoverageNFBS').value = nfbs.phyCoverage || 0;
    document.getElementById('expenditureForNFBS').value = nfbs.monthlyExp || 0;
    document.getElementById('cumulativeForNFBS').value = nfbs.monthlyExpComulative || 0;
    document.getElementById('maleCountNFBS').value = nfbs.male || 0;
    document.getElementById('femaleCountNFBS').value = nfbs.female || 0;
    document.getElementById('transCountNFBS').value = nfbs.transgender || 0;
    document.getElementById('neftDisbNFBS').value = nfbs.neft || 0;
    document.getElementById('apbDisbNFBS').value = nfbs.apb || 0;
    document.getElementById('poDisbNFBS').value = nfbs.po || 0;
    document.getElementById('moneyDisbNFBS').value = nfbs.mo || 0;
    document.getElementById('cashDisbNFBS').value = nfbs.cash || 0;

    let annapurna = data.annapurna;

    document.getElementById('physicalCoverageANNAPURNA').value = annapurna.phyCoverage || 0;
    document.getElementById('expenditureForANNAPURNA').value = annapurna.monthlyExp || 0;
    document.getElementById('cumulativeForANNAPURNA').value = annapurna.monthlyExpComulative || 0;
    document.getElementById('maleCountANNAPURNA').value = annapurna.male || 0;
    document.getElementById('femaleCountANNAPURNA').value = annapurna.female || 0;
    document.getElementById('transCountANNAPURNA').value = annapurna.transgender || 0;
    document.getElementById('neftDisbANNAPURNA').value = annapurna.neft || 0;
    document.getElementById('apbDisbANNAPURNA').value = annapurna.apb || 0;
    document.getElementById('poDisbANNAPURNA').value = annapurna.po || 0;
    document.getElementById('moneyDisbANNAPURNA').value = annapurna.mo || 0;
    document.getElementById('cashDisbANNAPURNA').value = annapurna.cash || 0;

    //update totals
    handleNumInput();
    handleFloatInput();
  };

  const finalBody = () => {
    const selectedMonth = monthData.find((s) => s.monthName === month);

    let ignoaps = {
      year: year,
      month: month,
      monthCode: selectedMonth.monthValue,
      schemeCode: 'IGNOAPS',
      openingBalance: document.getElementById('openingBalance').value,
      cssReleaseBal: document.getElementById('amountReleasedCSS').value,
      totalAvailableFund: document.getElementById('totalFund').value,
      expUptoMonth: document.getElementById('expenditureForMonth').value,
      closingBalance: document.getElementById('closingBalance').value,
      phyCoverage: document.getElementById('physicalCoverageIgnoaps').value,
      monthlyExp: document.getElementById('expenditureForIgnoaps').value,
      monthlyExpComulative: document.getElementById('cumulativeForIgnoaps').value,
      male: document.getElementById('maleCountIgnoaps').value,
      female: document.getElementById('femaleCountIgnoaps').value,
      transgender: document.getElementById('transCountIgnoaps').value,
      neft: document.getElementById('neftDisbIgnoaps').value,
      apb: document.getElementById('apbDisbIgnoaps').value,
      po: document.getElementById('poDisbIgnoaps').value,
      mo: document.getElementById('moneyDisbIgnoaps').value,
      cash: document.getElementById('cashDisbIgnoaps').value,
      noOfTransactionsApb: document.getElementById('noOfTxnApbIgnoaps').value,
      transactionComulativeApb: document.getElementById('cumNoOfTxnApbIgnoaps').value,
      monthlyAmtApb: document.getElementById('monthlyAmountApbIgnoaps').value,
      monthlyAmtComulativeApb: document.getElementById('cumMonthlyAmountApbIgnoaps').value,
      noOfTransactionsNeft: document.getElementById('noOfTxnNeftIgnoaps').value,
      transactionComulativeNeft: document.getElementById('cumNoOfTxnNeftIgnoaps').value,
      monthlyAmtNeft: document.getElementById('monthlyAmountNeftIgnoaps').value,
      monthlyAmtComulativeNeft: document.getElementById('cumMonthlyAmountNeftIgnoaps').value,
      noOfTransactionsPo: document.getElementById('noOfTxnPoIgnoaps').value,
      transactionComulativePo: document.getElementById('cumNoOfTxnPoIgnoaps').value,
      monthlyAmtPo: document.getElementById('monthlyAmountPoIgnoaps').value,
      monthlyAmtComulativePo: document.getElementById('cumMonthlyAmountPoIgnoaps').value,
      noOfTransactionsMo: document.getElementById('noOfTxnMoIgnoaps').value,
      transactionComulativeMo: document.getElementById('cumNoOfTxnMoIgnoaps').value,
      monthlyAmtMo: document.getElementById('monthlyAmountMoIgnoaps').value,
      monthlyAmtComulativeMo: document.getElementById('cumMonthlyAmountMoIgnoaps').value,
      noOfTransactionsCash: document.getElementById('noOfTxnCashIgnoaps').value,
      transactionComulativeCash: document.getElementById('cumNoOfTxnCashIgnoaps').value,
      monthlyAmtCash: document.getElementById('monthlyAmountCashIgnoaps').value,
      monthlyAmtComulativeCash: document.getElementById('cumMonthlyAmountCashIgnoaps').value
    };
    let ignwps = {
      year: year,
      month: month,
      monthCode: selectedMonth.monthValue,
      schemeCode: 'IGNWPS',
      openingBalance: document.getElementById('openingBalance').value,
      cssReleaseBal: document.getElementById('amountReleasedCSS').value,
      totalAvailableFund: document.getElementById('totalFund').value,
      expUptoMonth: document.getElementById('expenditureForMonth').value,
      closingBalance: document.getElementById('closingBalance').value,
      phyCoverage: document.getElementById('physicalCoverageIgnwps').value,
      monthlyExp: document.getElementById('expenditureForIgnwps').value,
      monthlyExpComulative: document.getElementById('cumulativeForIgnwps').value,
      male: '0',
      female: document.getElementById('femaleCountIgnwps').value,
      transgender: document.getElementById('transCountIgnwps').value,
      neft: document.getElementById('neftDisbIgnwps').value,
      apb: document.getElementById('apbDisbIgnwps').value,
      po: document.getElementById('poDisbIgnwps').value,
      mo: document.getElementById('moneyDisbIgnwps').value,
      cash: document.getElementById('cashDisbIgnwps').value,
      noOfTransactionsApb: document.getElementById('noOfTxnApbIgnwps').value,
      transactionComulativeApb: document.getElementById('cumNoOfTxnApbIgnwps').value,
      monthlyAmtApb: document.getElementById('monthlyAmountApbIgnwps').value,
      monthlyAmtComulativeApb: document.getElementById('cumMonthlyAmountApbIgnwps').value,
      noOfTransactionsNeft: document.getElementById('noOfTxnNeftIgnwps').value,
      transactionComulativeNeft: document.getElementById('cumNoOfTxnNeftIgnwps').value,
      monthlyAmtNeft: document.getElementById('monthlyAmountNeftIgnwps').value,
      monthlyAmtComulativeNeft: document.getElementById('cumMonthlyAmountNeftIgnwps').value,
      noOfTransactionsPo: document.getElementById('noOfTxnPoIgnwps').value,
      transactionComulativePo: document.getElementById('cumNoOfTxnPoIgnwps').value,
      monthlyAmtPo: document.getElementById('monthlyAmountPoIgnwps').value,
      monthlyAmtComulativePo: document.getElementById('cumMonthlyAmountPoIgnwps').value,
      noOfTransactionsMo: document.getElementById('noOfTxnMoIgnwps').value,
      transactionComulativeMo: document.getElementById('cumNoOfTxnMoIgnwps').value,
      monthlyAmtMo: document.getElementById('monthlyAmountMoIgnwps').value,
      monthlyAmtComulativeMo: document.getElementById('cumMonthlyAmountMoIgnwps').value,
      noOfTransactionsCash: document.getElementById('noOfTxnCashIgnwps').value,
      transactionComulativeCash: document.getElementById('cumNoOfTxnCashIgnwps').value,
      monthlyAmtCash: document.getElementById('monthlyAmountCashIgnwps').value,
      monthlyAmtComulativeCash: document.getElementById('cumMonthlyAmountCashIgnwps').value
    };
    let igndps = {
      year: year,
      month: month,
      monthCode: selectedMonth.monthValue,
      schemeCode: 'IGNDPS',
      openingBalance: document.getElementById('openingBalance').value,
      cssReleaseBal: document.getElementById('amountReleasedCSS').value,
      totalAvailableFund: document.getElementById('totalFund').value,
      expUptoMonth: document.getElementById('expenditureForMonth').value,
      closingBalance: document.getElementById('closingBalance').value,
      phyCoverage: document.getElementById('physicalCoverageIgndps').value,
      monthlyExp: document.getElementById('expenditureForIgndps').value,
      monthlyExpComulative: document.getElementById('cumulativeForIgndps').value,
      male: document.getElementById('maleCountIgndps').value,
      female: document.getElementById('femaleCountIgndps').value,
      transgender: document.getElementById('transCountIgndps').value,
      neft: document.getElementById('neftDisbIgndps').value,
      apb: document.getElementById('apbDisbIgndps').value,
      po: document.getElementById('poDisbIgndps').value,
      mo: document.getElementById('moneyDisbIgndps').value,
      cash: document.getElementById('cashDisbIgndps').value,
      noOfTransactionsApb: document.getElementById('noOfTxnApbIgndps').value,
      transactionComulativeApb: document.getElementById('cumNoOfTxnApbIgndps').value,
      monthlyAmtApb: document.getElementById('monthlyAmountApbIgndps').value,
      monthlyAmtComulativeApb: document.getElementById('cumMonthlyAmountApbIgndps').value,
      noOfTransactionsNeft: document.getElementById('noOfTxnNeftIgndps').value,
      transactionComulativeNeft: document.getElementById('cumNoOfTxnNeftIgndps').value,
      monthlyAmtNeft: document.getElementById('monthlyAmountNeftIgndps').value,
      monthlyAmtComulativeNeft: document.getElementById('cumMonthlyAmountNeftIgndps').value,
      noOfTransactionsPo: document.getElementById('noOfTxnPoIgndps').value,
      transactionComulativePo: document.getElementById('cumNoOfTxnPoIgndps').value,
      monthlyAmtPo: document.getElementById('monthlyAmountPoIgndps').value,
      monthlyAmtComulativePo: document.getElementById('cumMonthlyAmountPoIgndps').value,
      noOfTransactionsMo: document.getElementById('noOfTxnMoIgndps').value,
      transactionComulativeMo: document.getElementById('cumNoOfTxnMoIgndps').value,
      monthlyAmtMo: document.getElementById('monthlyAmountMoIgndps').value,
      monthlyAmtComulativeMo: document.getElementById('cumMonthlyAmountMoIgndps').value,
      noOfTransactionsCash: document.getElementById('noOfTxnCashIgndps').value,
      transactionComulativeCash: document.getElementById('cumNoOfTxnCashIgndps').value,
      monthlyAmtCash: document.getElementById('monthlyAmountCashIgndps').value,
      monthlyAmtComulativeCash: document.getElementById('cumMonthlyAmountCashIgndps').value
    };
    let nfbs = {
      year: year,
      month: month,
      monthCode: selectedMonth.monthValue,
      schemeCode: 'NFBS',
      openingBalance: document.getElementById('openingBalance').value,
      cssReleaseBal: document.getElementById('amountReleasedCSS').value,
      totalAvailableFund: document.getElementById('totalFund').value,
      expUptoMonth: document.getElementById('expenditureForMonth').value,
      closingBalance: document.getElementById('closingBalance').value,
      phyCoverage: document.getElementById('physicalCoverageNFBS').value,
      monthlyExp: document.getElementById('expenditureForNFBS').value,
      monthlyExpComulative: document.getElementById('cumulativeForNFBS').value,
      male: document.getElementById('maleCountNFBS').value,
      female: document.getElementById('femaleCountNFBS').value,
      transgender: document.getElementById('transCountNFBS').value,
      neft: document.getElementById('neftDisbNFBS').value,
      apb: document.getElementById('apbDisbNFBS').value,
      po: document.getElementById('poDisbNFBS').value,
      mo: document.getElementById('moneyDisbNFBS').value,
      cash: document.getElementById('cashDisbNFBS').value,
      noOfTransactionsApb: '0',
      transactionComulativeApb: '0',
      monthlyAmtApb: '0',
      monthlyAmtComulativeApb: '0',
      noOfTransactionsNeft: '0',
      transactionComulativeNeft: '0',
      monthlyAmtNeft: '0',
      monthlyAmtComulativeNeft: '0',
      noOfTransactionsPo: '0',
      transactionComulativePo: '0',
      monthlyAmtPo: '0',
      monthlyAmtComulativePo: '0',
      noOfTransactionsMo: '0',
      transactionComulativeMo: '0',
      monthlyAmtMo: '0',
      monthlyAmtComulativeMo: '0',
      noOfTransactionsCash: '0',
      transactionComulativeCash: '0',
      monthlyAmtCash: '0',
      monthlyAmtComulativeCash: '0'
    };

    let annapurna = {
      year: year,
      month: month,
      monthCode: selectedMonth.monthValue,
      schemeCode: 'ANNAPURNA',
      openingBalance: document.getElementById('openingBalance').value,
      cssReleaseBal: document.getElementById('amountReleasedCSS').value,
      totalAvailableFund: document.getElementById('totalFund').value,
      expUptoMonth: document.getElementById('expenditureForMonth').value,
      closingBalance: document.getElementById('closingBalance').value,
      phyCoverage: document.getElementById('physicalCoverageANNAPURNA').value,
      monthlyExp: document.getElementById('expenditureForANNAPURNA').value,
      monthlyExpComulative: document.getElementById('cumulativeForANNAPURNA').value,
      male: document.getElementById('maleCountANNAPURNA').value,
      female: document.getElementById('femaleCountANNAPURNA').value,
      transgender: document.getElementById('transCountANNAPURNA').value,
      neft: document.getElementById('neftDisbANNAPURNA').value,
      apb: document.getElementById('apbDisbANNAPURNA').value,
      po: document.getElementById('poDisbANNAPURNA').value,
      mo: document.getElementById('moneyDisbANNAPURNA').value,
      cash: document.getElementById('cashDisbANNAPURNA').value,
      noOfTransactionsApb: '0',
      transactionComulativeApb: '0',
      monthlyAmtApb: '0',
      monthlyAmtComulativeApb: '0',
      noOfTransactionsNeft: '0',
      transactionComulativeNeft: '0',
      monthlyAmtNeft: '0',
      monthlyAmtComulativeNeft: '0',
      noOfTransactionsPo: '0',
      transactionComulativePo: '0',
      monthlyAmtPo: '0',
      monthlyAmtComulativePo: '0',
      noOfTransactionsMo: '0',
      transactionComulativeMo: '0',
      monthlyAmtMo: '0',
      monthlyAmtComulativeMo: '0',
      noOfTransactionsCash: '0',
      transactionComulativeCash: '0',
      monthlyAmtCash: '0',
      monthlyAmtComulativeCash: '0'
    };

    return { ignoaps, ignwps, igndps, nfbs, annapurna };
  };

  return (
    <>
      <Backdrop open={loading} style={{ zIndex: 999, color: '#fff' }}>
        <CircularProgress color="inherit" />
      </Backdrop>

      {!!snackbar && (
        <Snackbar
          open
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          onClose={handleCloseSnackbar}
          autoHideDuration={snackbar.severity === 'warning' && snackbar.children.includes('Final Submit') ? null : 18000} // Keep Final Submit open, others auto-close
        >
          <Alert
            severity={snackbar.severity}
            onClose={handleCloseSnackbar}
            action={
              <Button color="inherit" size="small" onClick={handleCloseSnackbar}>
                OK
              </Button>
            }
            sx={{
              bgcolor:
                snackbar.children && snackbar.children.includes('Final Submit')
                  ? '#f5d157'
                  : snackbar.severity === 'success'
                  ? '#f5d157'
                  : snackbar.severity === 'error'
                  ? '#FFB300'
                  : snackbar.severity === 'info'
                  ? '#2196F3'
                  : snackbar.severity === 'warning'
                  ? '#FF9800'
                  : 'inherit',
              color: '#000',
              fontWeight: snackbar.children && snackbar.children.includes('Final Submit') ? 'bold' : 'normal'
            }}
          >
            {snackbar.children}
          </Alert>
        </Snackbar>
      )}

      <MainCard title="Monthly Progress Report">
        <Grid container spacing={2} alignItems="center">
          {' '}
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <InputLabel id="month-label">Month</InputLabel>
              <Select name="month" label="Month" labelId="month-label" onChange={handleMonthChange}>
                {monthData.map((item) => (
                  <MenuItem key={item.monthName} value={item.monthName}>
                    {item.monthName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <InputLabel id="year-label">Year</InputLabel>
              <Select name="year" label="Year" labelId="year-label" onChange={handleYearChange}>
                {yearData.map((item) => (
                  <MenuItem key={item.year} value={item.year}>
                    {item.year}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Snackbar open={openSnackbar} autoHideDuration={null} onClose={handleSnackbarClose}>
            <Alert onClose={handleSnackbarClose} severity="info" sx={{ width: '100%' }}>
              {statusDownload}
            </Alert>
          </Snackbar>
          <Grid item xs={12} sm={3.5} display="flex" justifyContent="right">
            {showDownloadButton && (
              <Button
                variant="contained"
                color="primary"
                onClick={handleDownload}
                size="small"
                sx={{
                  boxShadow: 'none',
                  '&:hover': { boxShadow: 'none' }
                }}
              >
                Download Report
              </Button>
            )}
          </Grid>
        </Grid>

        {editMpr && (
          <>
            <TableContainer className={classes.tableContainer} style={{ marginTop: '20px' }} disabled>
              <Table stickyHeader aria-label="sticky table" className={classes.table}>
                <TableBody>
                  <TableRow>
                    <TableCell className={classes.tableFormBody}>
                      1. Opening Balance of Centrally Sponsored Scheme(CSS) under NSAP as on 1st April {year}:
                    </TableCell>
                    <TableCell className={classes.tableFormBody}>
                      <TextField
                        id="openingBalance"
                        variant="outlined"
                        autoComplete="off"
                        fullWidth
                        inputProps={{ maxLength: 10, inputMode: 'numeric' }}
                        onBlur={handleFloatInput}
                      ></TextField>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className={classes.tableFormBody}>2. CSS released for NSAP upto month of reporting(Rs. in lakh) :</TableCell>
                    <TableCell className={classes.tableFormBody}>
                      <TextField
                        id="amountReleasedCSS"
                        variant="outlined"
                        autoComplete="off"
                        fullWidth
                        inputProps={{ maxLength: 10, inputMode: 'numeric' }}
                        onBlur={handleFloatInput}
                      ></TextField>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className={classes.tableFormBody}>3. Total available funds NSAP(1+2)(Rs. in lakh) :</TableCell>
                    <TableCell className={classes.tableFormBody}>
                      <TextField
                        id="totalFund"
                        variant="outlined"
                        autoComplete="off"
                        fullWidth
                        inputProps={{ maxLength: 10, inputMode: 'numeric' }}
                        onBlur={handleFloatInput}
                        disabled
                      ></TextField>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className={classes.tableFormBody}>
                      4. Expenditure for NSAP upto the month of reporting(Rs. in lakh) :
                    </TableCell>
                    <TableCell className={classes.tableFormBody}>
                      <TextField
                        id="expenditureForMonth"
                        variant="outlined"
                        autoComplete="off"
                        fullWidth
                        inputProps={{ maxLength: 10, inputMode: 'numeric' }}
                        onBlur={handleFloatInput}
                      ></TextField>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className={classes.tableFormBody}>
                      5. Closing balance at the end of month of reporting (3-4)(Rs. in lakh):
                    </TableCell>
                    <TableCell className={classes.tableFormBody}>
                      <TextField
                        id="closingBalance"
                        variant="outlined"
                        autoComplete="off"
                        fullWidth
                        inputProps={{ maxLength: 10, inputMode: 'numeric' }}
                        onBlur={handleFloatInput}
                        disabled
                      ></TextField>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
            <TableContainer className={classes.tableContainer} style={{ marginTop: '20px' }}>
              <Table stickyHeader aria-label="sticky table" className={classes.table}>
                <TableHead>
                  <TableRow>
                    <TableCell></TableCell>
                    <TableCell className={classes.stickyHeader}>IGNOAPS</TableCell>
                    <TableCell className={classes.stickyHeader}>IGNWPS</TableCell>
                    <TableCell className={classes.stickyHeader}>IGNDPS</TableCell>
                    <TableCell className={classes.stickyHeader}>NFBS</TableCell>
                    <TableCell className={classes.stickyHeader}>ANNAPURNA</TableCell>
                    <TableCell className={classes.stickyHeader}></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell sx={{ textAlign: 'left', paddingLeft: '00px', whiteSpace: 'nowrap' }}>
                      <strong>1. Physical Coverage (in numbers)</strong>
                    </TableCell>
                    <TableCell className={classes.tableFormBody}>
                      <TextField
                        id="physicalCoverageIgnoaps"
                        variant="outlined"
                        autoComplete="off"
                        fullWidth
                        inputProps={{ maxLength: 10, inputMode: 'numeric' }}
                        onChange={handleNumInput}
                      ></TextField>
                    </TableCell>
                    <TableCell className={classes.tableFormBody}>
                      <TextField
                        id="physicalCoverageIgnwps"
                        variant="outlined"
                        autoComplete="off"
                        fullWidth
                        inputProps={{ maxLength: 10, inputMode: 'numeric' }}
                        onChange={handleNumInput}
                      ></TextField>
                    </TableCell>
                    <TableCell className={classes.tableFormBody}>
                      <TextField
                        id="physicalCoverageIgndps"
                        variant="outlined"
                        autoComplete="off"
                        fullWidth
                        inputProps={{ maxLength: 10, inputMode: 'numeric' }}
                        onChange={handleNumInput}
                      ></TextField>
                    </TableCell>
                    <TableCell className={classes.tableFormBody}>
                      <TextField
                        id="physicalCoverageNFBS"
                        variant="outlined"
                        autoComplete="off"
                        fullWidth
                        inputProps={{ maxLength: 10, inputMode: 'numeric' }}
                        onChange={handleNumInput}
                      ></TextField>
                    </TableCell>
                    <TableCell className={classes.tableFormBody}>
                      <TextField
                        id="physicalCoverageANNAPURNA"
                        variant="outlined"
                        autoComplete="off"
                        fullWidth
                        inputProps={{ maxLength: 10, inputMode: 'numeric' }}
                        onChange={handleNumInput}
                      ></TextField>
                    </TableCell>
                    <TableCell className={classes.tableFormBody}></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ textAlign: 'left', paddingLeft: '00px', whiteSpace: 'nowrap' }}>
                      <strong> 2. Expenditure Monthly Cumulator</strong>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ textAlign: 'left', paddingLeft: '16px', whiteSpace: 'nowrap' }}>
                      (a) Expenditure of Month(Rs. in lakh)
                    </TableCell>
                    <TableCell className={classes.tableFormBody}>
                      <TextField
                        id="expenditureForIgnoaps"
                        variant="outlined"
                        autoComplete="off"
                        fullWidth
                        inputProps={{ maxLength: 10, inputMode: 'numeric' }}
                        onBlur={handleFloatInput}
                      ></TextField>
                    </TableCell>
                    <TableCell className={classes.tableFormBody}>
                      <TextField
                        id="expenditureForIgnwps"
                        variant="outlined"
                        autoComplete="off"
                        fullWidth
                        inputProps={{ maxLength: 10, inputMode: 'numeric' }}
                        onBlur={handleFloatInput}
                      ></TextField>
                    </TableCell>
                    <TableCell className={classes.tableFormBody}>
                      <TextField
                        id="expenditureForIgndps"
                        variant="outlined"
                        autoComplete="off"
                        fullWidth
                        inputProps={{ maxLength: 10, inputMode: 'numeric' }}
                        onBlur={handleFloatInput}
                      ></TextField>
                    </TableCell>
                    <TableCell className={classes.tableFormBody}>
                      <TextField
                        id="expenditureForNFBS"
                        variant="outlined"
                        autoComplete="off"
                        fullWidth
                        inputProps={{ maxLength: 10, inputMode: 'numeric' }}
                        onBlur={handleFloatInput}
                      ></TextField>
                    </TableCell>
                    <TableCell className={classes.tableFormBody}>
                      <TextField
                        id="expenditureForANNAPURNA"
                        variant="outlined"
                        autoComplete="off"
                        fullWidth
                        inputProps={{ maxLength: 10, inputMode: 'numeric' }}
                        onBlur={handleFloatInput}
                      ></TextField>
                    </TableCell>
                    <TableCell className={classes.tableFormBody}></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ textAlign: 'left', paddingLeft: '16px', whiteSpace: 'nowrap' }}>
                      (b) Cumulative Expenditure (Rs. in lakh)
                    </TableCell>
                    <TableCell className={classes.tableFormBody}>
                      <TextField
                        id="cumulativeForIgnoaps"
                        variant="outlined"
                        autoComplete="off"
                        fullWidth
                        inputProps={{ maxLength: 10, inputMode: 'numeric' }}
                        onBlur={handleFloatInput}
                        disabled
                      ></TextField>
                    </TableCell>
                    <TableCell className={classes.tableFormBody}>
                      <TextField
                        id="cumulativeForIgnwps"
                        variant="outlined"
                        autoComplete="off"
                        fullWidth
                        inputProps={{ maxLength: 10, inputMode: 'numeric' }}
                        onBlur={handleFloatInput}
                        disabled
                      ></TextField>
                    </TableCell>
                    <TableCell className={classes.tableFormBody}>
                      <TextField
                        id="cumulativeForIgndps"
                        variant="outlined"
                        autoComplete="off"
                        fullWidth
                        inputProps={{ maxLength: 10, inputMode: 'numeric' }}
                        onBlur={handleFloatInput}
                        disabled
                      ></TextField>
                    </TableCell>
                    <TableCell className={classes.tableFormBody}>
                      <TextField
                        id="cumulativeForNFBS"
                        variant="outlined"
                        autoComplete="off"
                        fullWidth
                        inputProps={{ maxLength: 10, inputMode: 'numeric' }}
                        onBlur={handleFloatInput}
                        disabled
                      ></TextField>
                    </TableCell>
                    <TableCell className={classes.tableFormBody}>
                      <TextField
                        id="cumulativeForANNAPURNA"
                        variant="outlined"
                        autoComplete="off"
                        fullWidth
                        inputProps={{ maxLength: 10, inputMode: 'numeric' }}
                        onBlur={handleFloatInput}
                        disabled
                      ></TextField>
                    </TableCell>
                    <TableCell className={classes.tableFormBody}></TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell sx={{ textAlign: 'left', paddingLeft: '00px', whiteSpace: 'nowrap' }}>
                      <strong>3. Reported/Covered no. of beneficiaries (in numbers)</strong>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ textAlign: 'left', paddingLeft: '16px', whiteSpace: 'nowrap' }}>(a) Female</TableCell>
                    <TableCell className={classes.tableFormBody}>
                      <TextField
                        id="femaleCountIgnoaps"
                        variant="outlined"
                        autoComplete="off"
                        fullWidth
                        inputProps={{ maxLength: 10, inputMode: 'numeric' }}
                        onChange={handleNumInput}
                      ></TextField>
                    </TableCell>
                    <TableCell className={classes.tableFormBody}>
                      <TextField
                        id="femaleCountIgnwps"
                        variant="outlined"
                        autoComplete="off"
                        fullWidth
                        inputProps={{ maxLength: 10, inputMode: 'numeric' }}
                        onChange={handleNumInput}
                      ></TextField>
                    </TableCell>
                    <TableCell className={classes.tableFormBody}>
                      <TextField
                        id="femaleCountIgndps"
                        variant="outlined"
                        autoComplete="off"
                        fullWidth
                        inputProps={{ maxLength: 10, inputMode: 'numeric' }}
                        onChange={handleNumInput}
                      ></TextField>
                    </TableCell>
                    <TableCell className={classes.tableFormBody}>
                      <TextField
                        id="femaleCountNFBS"
                        variant="outlined"
                        autoComplete="off"
                        fullWidth
                        inputProps={{ maxLength: 10, inputMode: 'numeric' }}
                        onChange={handleNumInput}
                      ></TextField>
                    </TableCell>
                    <TableCell className={classes.tableFormBody}>
                      <TextField
                        id="femaleCountANNAPURNA"
                        variant="outlined"
                        autoComplete="off"
                        fullWidth
                        inputProps={{ maxLength: 10, inputMode: 'numeric' }}
                        onChange={handleNumInput}
                      ></TextField>
                    </TableCell>
                    <TableCell className={classes.tableFormBody}></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ textAlign: 'left', paddingLeft: '16px', whiteSpace: 'nowrap' }}>(b) Male</TableCell>
                    <TableCell className={classes.tableFormBody}>
                      <TextField
                        id="maleCountIgnoaps"
                        variant="outlined"
                        autoComplete="off"
                        fullWidth
                        inputProps={{ maxLength: 10, inputMode: 'numeric' }}
                        onChange={handleNumInput}
                      ></TextField>
                    </TableCell>
                    <TableCell className={classes.tableFormBody}></TableCell>
                    <TableCell className={classes.tableFormBody}>
                      <TextField
                        id="maleCountIgndps"
                        variant="outlined"
                        autoComplete="off"
                        fullWidth
                        inputProps={{ maxLength: 10, inputMode: 'numeric' }}
                        onChange={handleNumInput}
                      ></TextField>
                    </TableCell>
                    <TableCell className={classes.tableFormBody}>
                      <TextField
                        id="maleCountNFBS"
                        variant="outlined"
                        autoComplete="off"
                        fullWidth
                        inputProps={{ maxLength: 10, inputMode: 'numeric' }}
                        onChange={handleNumInput}
                      ></TextField>
                    </TableCell>
                    <TableCell className={classes.tableFormBody}>
                      <TextField
                        id="maleCountANNAPURNA"
                        variant="outlined"
                        autoComplete="off"
                        fullWidth
                        inputProps={{ maxLength: 10, inputMode: 'numeric' }}
                        onChange={handleNumInput}
                      ></TextField>
                    </TableCell>
                    <TableCell className={classes.tableFormBody}></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ textAlign: 'left', paddingLeft: '16px', whiteSpace: 'nowrap' }}>(c) Trans Gender</TableCell>
                    <TableCell className={classes.tableFormBody}>
                      <TextField
                        id="transCountIgnoaps"
                        variant="outlined"
                        autoComplete="off"
                        fullWidth
                        inputProps={{ maxLength: 10, inputMode: 'numeric' }}
                        onChange={handleNumInput}
                      ></TextField>
                    </TableCell>
                    <TableCell className={classes.tableFormBody}>
                      <TextField
                        id="transCountIgnwps"
                        variant="outlined"
                        autoComplete="off"
                        fullWidth
                        inputProps={{ maxLength: 10, inputMode: 'numeric' }}
                        onChange={handleNumInput}
                      ></TextField>
                    </TableCell>
                    <TableCell className={classes.tableFormBody}>
                      <TextField
                        id="transCountIgndps"
                        variant="outlined"
                        autoComplete="off"
                        fullWidth
                        inputProps={{ maxLength: 10, inputMode: 'numeric' }}
                        onChange={handleNumInput}
                      ></TextField>
                    </TableCell>
                    <TableCell className={classes.tableFormBody}>
                      <TextField
                        id="transCountNFBS"
                        variant="outlined"
                        autoComplete="off"
                        fullWidth
                        inputProps={{ maxLength: 10, inputMode: 'numeric' }}
                        onChange={handleNumInput}
                      ></TextField>
                    </TableCell>
                    <TableCell className={classes.tableFormBody}>
                      <TextField
                        id="transCountANNAPURNA"
                        variant="outlined"
                        autoComplete="off"
                        fullWidth
                        inputProps={{ maxLength: 10, inputMode: 'numeric' }}
                        onChange={handleNumInput}
                      ></TextField>
                    </TableCell>
                    <TableCell className={classes.tableFormBody}></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className={classes.tableFormBody}>
                      <strong>Total((a)+(b)+(c))</strong>
                    </TableCell>
                    <TableCell className={classes.tableFormBody}>
                      <TextField
                        id="totalCountIgnoaps"
                        variant="outlined"
                        autoComplete="off"
                        fullWidth
                        inputProps={{ maxLength: 10, inputMode: 'numeric' }}
                        onChange={handleNumInput}
                        disabled
                      ></TextField>
                    </TableCell>
                    <TableCell className={classes.tableFormBody}>
                      <TextField
                        id="totalCountIgnwps"
                        variant="outlined"
                        autoComplete="off"
                        fullWidth
                        inputProps={{ maxLength: 10, inputMode: 'numeric' }}
                        onChange={handleNumInput}
                        disabled
                      ></TextField>
                    </TableCell>
                    <TableCell className={classes.tableFormBody}>
                      <TextField
                        id="totalCountIgndps"
                        variant="outlined"
                        autoComplete="off"
                        fullWidth
                        inputProps={{ maxLength: 10, inputMode: 'numeric' }}
                        onChange={handleNumInput}
                        disabled
                      ></TextField>
                    </TableCell>
                    <TableCell className={classes.tableFormBody}>
                      <TextField
                        id="totalCountNFBS"
                        variant="outlined"
                        autoComplete="off"
                        fullWidth
                        inputProps={{ maxLength: 10, inputMode: 'numeric' }}
                        onChange={handleNumInput}
                        disabled
                      ></TextField>
                    </TableCell>
                    <TableCell className={classes.tableFormBody}>
                      <TextField
                        id="totalCountANNAPURNA"
                        variant="outlined"
                        autoComplete="off"
                        fullWidth
                        inputProps={{ maxLength: 10, inputMode: 'numeric' }}
                        onChange={handleNumInput}
                        disabled
                      ></TextField>
                    </TableCell>
                    <TableCell className={classes.tableFormBody}></TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell sx={{ textAlign: 'left', paddingLeft: '00px', whiteSpace: 'nowrap' }}>
                      <strong>4. Beneficiaries opted disbursement mode(in numbers)</strong>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ textAlign: 'left', paddingLeft: '12px', whiteSpace: 'nowrap' }}>(a) Bank Account</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ textAlign: 'left', paddingLeft: '30px', whiteSpace: 'nowrap' }}>(a1) ABP </TableCell>
                    <TableCell className={classes.tableFormBody}>
                      <TextField
                        id="apbDisbIgnoaps"
                        variant="outlined"
                        autoComplete="off"
                        fullWidth
                        inputProps={{ maxLength: 10, inputMode: 'numeric' }}
                        onChange={handleNumInput}
                      ></TextField>
                    </TableCell>
                    <TableCell className={classes.tableFormBody}>
                      <TextField
                        id="apbDisbIgnwps"
                        variant="outlined"
                        autoComplete="off"
                        fullWidth
                        inputProps={{ maxLength: 10, inputMode: 'numeric' }}
                        onChange={handleNumInput}
                      ></TextField>
                    </TableCell>
                    <TableCell className={classes.tableFormBody}>
                      <TextField
                        id="apbDisbIgndps"
                        variant="outlined"
                        autoComplete="off"
                        fullWidth
                        inputProps={{ maxLength: 10, inputMode: 'numeric' }}
                        onChange={handleNumInput}
                      ></TextField>
                    </TableCell>
                    <TableCell className={classes.tableFormBody}>
                      <TextField
                        id="apbDisbNFBS"
                        variant="outlined"
                        autoComplete="off"
                        fullWidth
                        inputProps={{ maxLength: 10, inputMode: 'numeric' }}
                        onChange={handleNumInput}
                      ></TextField>
                    </TableCell>
                    <TableCell className={classes.tableFormBody}>
                      <TextField
                        id="apbDisbANNAPURNA"
                        variant="outlined"
                        autoComplete="off"
                        fullWidth
                        inputProps={{ maxLength: 10, inputMode: 'numeric' }}
                        onChange={handleNumInput}
                      ></TextField>
                    </TableCell>
                    <TableCell className={classes.tableFormBody}></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ textAlign: 'left', paddingLeft: '30px', whiteSpace: 'nowrap' }}>(a2) NEFT </TableCell>
                    <TableCell className={classes.tableFormBody}>
                      <TextField
                        id="neftDisbIgnoaps"
                        variant="outlined"
                        autoComplete="off"
                        fullWidth
                        inputProps={{ maxLength: 10, inputMode: 'numeric' }}
                        onChange={handleNumInput}
                      ></TextField>
                    </TableCell>
                    <TableCell className={classes.tableFormBody}>
                      <TextField
                        id="neftDisbIgnwps"
                        variant="outlined"
                        autoComplete="off"
                        fullWidth
                        inputProps={{ maxLength: 10, inputMode: 'numeric' }}
                        onChange={handleNumInput}
                      ></TextField>
                    </TableCell>
                    <TableCell className={classes.tableFormBody}>
                      <TextField
                        id="neftDisbIgndps"
                        variant="outlined"
                        autoComplete="off"
                        fullWidth
                        inputProps={{ maxLength: 10, inputMode: 'numeric' }}
                        onChange={handleNumInput}
                      ></TextField>
                    </TableCell>
                    <TableCell className={classes.tableFormBody}>
                      <TextField
                        id="neftDisbNFBS"
                        variant="outlined"
                        autoComplete="off"
                        fullWidth
                        inputProps={{ maxLength: 10, inputMode: 'numeric' }}
                        onChange={handleNumInput}
                      ></TextField>
                    </TableCell>
                    <TableCell className={classes.tableFormBody}>
                      <TextField
                        id="neftDisbANNAPURNA"
                        variant="outlined"
                        autoComplete="off"
                        fullWidth
                        inputProps={{ maxLength: 10, inputMode: 'numeric' }}
                        onChange={handleNumInput}
                      ></TextField>
                    </TableCell>
                    <TableCell className={classes.tableFormBody}></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ textAlign: 'left', paddingLeft: '12px', whiteSpace: 'nowrap' }}>
                      <strong>Bank Total ((a1) + (a2))</strong>
                    </TableCell>
                    <TableCell className={classes.tableFormBody}>
                      <TextField
                        id="bankDisbTotalIgnoaps"
                        variant="outlined"
                        autoComplete="off"
                        fullWidth
                        inputProps={{ maxLength: 10, inputMode: 'numeric' }}
                        onChange={handleNumInput}
                        disabled
                      ></TextField>
                    </TableCell>
                    <TableCell className={classes.tableFormBody}>
                      <TextField
                        id="bankDisbTotalIgnwps"
                        variant="outlined"
                        autoComplete="off"
                        fullWidth
                        inputProps={{ maxLength: 10, inputMode: 'numeric' }}
                        onChange={handleNumInput}
                        disabled
                      ></TextField>
                    </TableCell>
                    <TableCell className={classes.tableFormBody}>
                      <TextField
                        id="bankDisbTotalIgndps"
                        variant="outlined"
                        autoComplete="off"
                        fullWidth
                        inputProps={{ maxLength: 10, inputMode: 'numeric' }}
                        onChange={handleNumInput}
                        disabled
                      ></TextField>
                    </TableCell>
                    <TableCell className={classes.tableFormBody}>
                      <TextField
                        id="bankDisbTotalNFBS"
                        variant="outlined"
                        autoComplete="off"
                        fullWidth
                        inputProps={{ maxLength: 10, inputMode: 'numeric' }}
                        onChange={handleNumInput}
                        disabled
                      ></TextField>
                    </TableCell>
                    <TableCell className={classes.tableFormBody}>
                      <TextField
                        id="bankDisbTotalANNAPURNA"
                        variant="outlined"
                        autoComplete="off"
                        fullWidth
                        inputProps={{ maxLength: 10, inputMode: 'numeric' }}
                        onChange={handleNumInput}
                        disabled
                      ></TextField>
                    </TableCell>
                    <TableCell className={classes.tableFormBody}></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ textAlign: 'left', paddingLeft: '12px', whiteSpace: 'nowrap' }}>(b) Post Office Account</TableCell>
                    <TableCell className={classes.tableFormBody}>
                      <TextField
                        id="poDisbIgnoaps"
                        variant="outlined"
                        autoComplete="off"
                        fullWidth
                        inputProps={{ maxLength: 10, inputMode: 'numeric' }}
                        onChange={handleNumInput}
                      ></TextField>
                    </TableCell>
                    <TableCell className={classes.tableFormBody}>
                      <TextField
                        id="poDisbIgnwps"
                        variant="outlined"
                        autoComplete="off"
                        fullWidth
                        inputProps={{ maxLength: 10, inputMode: 'numeric' }}
                        onChange={handleNumInput}
                      ></TextField>
                    </TableCell>
                    <TableCell className={classes.tableFormBody}>
                      <TextField
                        id="poDisbIgndps"
                        variant="outlined"
                        autoComplete="off"
                        fullWidth
                        inputProps={{ maxLength: 10, inputMode: 'numeric' }}
                        onChange={handleNumInput}
                      ></TextField>
                    </TableCell>
                    <TableCell className={classes.tableFormBody}>
                      <TextField
                        id="poDisbNFBS"
                        variant="outlined"
                        autoComplete="off"
                        fullWidth
                        inputProps={{ maxLength: 10, inputMode: 'numeric' }}
                        onChange={handleNumInput}
                      ></TextField>
                    </TableCell>
                    <TableCell className={classes.tableFormBody}>
                      <TextField
                        id="poDisbANNAPURNA"
                        variant="outlined"
                        autoComplete="off"
                        fullWidth
                        inputProps={{ maxLength: 10, inputMode: 'numeric' }}
                        onChange={handleNumInput}
                      ></TextField>
                    </TableCell>
                    <TableCell className={classes.tableFormBody}></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ textAlign: 'left', paddingLeft: '12px', whiteSpace: 'nowrap' }}>(c) Cash</TableCell>
                    <TableCell className={classes.tableFormBody}>
                      <TextField
                        id="cashDisbIgnoaps"
                        variant="outlined"
                        autoComplete="off"
                        fullWidth
                        inputProps={{ maxLength: 10, inputMode: 'numeric' }}
                        onChange={handleNumInput}
                      ></TextField>
                    </TableCell>
                    <TableCell className={classes.tableFormBody}>
                      <TextField
                        id="cashDisbIgnwps"
                        variant="outlined"
                        autoComplete="off"
                        fullWidth
                        inputProps={{ maxLength: 10, inputMode: 'numeric' }}
                        onChange={handleNumInput}
                      ></TextField>
                    </TableCell>
                    <TableCell className={classes.tableFormBody}>
                      <TextField
                        id="cashDisbIgndps"
                        variant="outlined"
                        autoComplete="off"
                        fullWidth
                        inputProps={{ maxLength: 10, inputMode: 'numeric' }}
                        onChange={handleNumInput}
                      ></TextField>
                    </TableCell>
                    <TableCell className={classes.tableFormBody}>
                      <TextField
                        id="cashDisbNFBS"
                        variant="outlined"
                        autoComplete="off"
                        fullWidth
                        inputProps={{ maxLength: 10, inputMode: 'numeric' }}
                        onChange={handleNumInput}
                      ></TextField>
                    </TableCell>
                    <TableCell className={classes.tableFormBody}>
                      <TextField
                        id="cashDisbANNAPURNA"
                        variant="outlined"
                        autoComplete="off"
                        fullWidth
                        inputProps={{ maxLength: 10, inputMode: 'numeric' }}
                        onChange={handleNumInput}
                      ></TextField>
                    </TableCell>
                    <TableCell className={classes.tableFormBody}></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ textAlign: 'left', paddingLeft: '12px', whiteSpace: 'nowrap' }}>(d) Money Order</TableCell>
                    <TableCell className={classes.tableFormBody}>
                      <TextField
                        id="moneyDisbIgnoaps"
                        variant="outlined"
                        autoComplete="off"
                        fullWidth
                        inputProps={{ maxLength: 10, inputMode: 'numeric' }}
                        onChange={handleNumInput}
                      ></TextField>
                    </TableCell>
                    <TableCell className={classes.tableFormBody}>
                      <TextField
                        id="moneyDisbIgnwps"
                        variant="outlined"
                        autoComplete="off"
                        fullWidth
                        inputProps={{ maxLength: 10, inputMode: 'numeric' }}
                        onChange={handleNumInput}
                      ></TextField>
                    </TableCell>
                    <TableCell className={classes.tableFormBody}>
                      <TextField
                        id="moneyDisbIgndps"
                        variant="outlined"
                        autoComplete="off"
                        fullWidth
                        inputProps={{ maxLength: 10, inputMode: 'numeric' }}
                        onChange={handleNumInput}
                      ></TextField>
                    </TableCell>
                    <TableCell className={classes.tableFormBody}>
                      <TextField
                        id="moneyDisbNFBS"
                        variant="outlined"
                        autoComplete="off"
                        fullWidth
                        inputProps={{ maxLength: 10, inputMode: 'numeric' }}
                        onChange={handleNumInput}
                      ></TextField>
                    </TableCell>
                    <TableCell className={classes.tableFormBody}>
                      <TextField
                        id="moneyDisbANNAPURNA"
                        variant="outlined"
                        autoComplete="off"
                        fullWidth
                        inputProps={{ maxLength: 10, inputMode: 'numeric' }}
                        onChange={handleNumInput}
                      ></TextField>
                    </TableCell>
                    <TableCell className={classes.tableFormBody}></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className={classes.tableFormBody}>
                      <strong>Total((a) + (b) + (c) + (d))</strong>
                    </TableCell>
                    <TableCell className={classes.tableFormBody}>
                      <TextField
                        id="totalDisbIgnoaps"
                        variant="outlined"
                        autoComplete="off"
                        fullWidth
                        inputProps={{ maxLength: 10, inputMode: 'numeric' }}
                        onChange={handleNumInput}
                        disabled
                      ></TextField>
                    </TableCell>
                    <TableCell className={classes.tableFormBody}>
                      <TextField
                        id="totalDisbIgnwps"
                        variant="outlined"
                        autoComplete="off"
                        fullWidth
                        inputProps={{ maxLength: 10, inputMode: 'numeric' }}
                        onChange={handleNumInput}
                        disabled
                      ></TextField>
                    </TableCell>
                    <TableCell className={classes.tableFormBody}>
                      <TextField
                        id="totalDisbIgndps"
                        variant="outlined"
                        autoComplete="off"
                        fullWidth
                        inputProps={{ maxLength: 10, inputMode: 'numeric' }}
                        onChange={handleNumInput}
                        disabled
                      ></TextField>
                    </TableCell>
                    <TableCell className={classes.tableFormBody}>
                      <TextField
                        id="totalDisbNFBS"
                        variant="outlined"
                        autoComplete="off"
                        fullWidth
                        inputProps={{ maxLength: 10, inputMode: 'numeric' }}
                        onChange={handleNumInput}
                        disabled
                      ></TextField>
                    </TableCell>
                    <TableCell className={classes.tableFormBody}>
                      <TextField
                        id="totalDisbANNAPURNA"
                        variant="outlined"
                        autoComplete="off"
                        fullWidth
                        inputProps={{ maxLength: 10, inputMode: 'numeric' }}
                        onChange={handleNumInput}
                        disabled
                      ></TextField>
                    </TableCell>
                    <TableCell className={classes.tableFormBody}></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ textAlign: 'left', paddingLeft: '00px', whiteSpace: 'nowrap' }}>
                      <strong>5. Disbursement Details</strong>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell></TableCell>
                    <TableCell className={classes.stickyHeader}>APB</TableCell>
                    <TableCell className={classes.stickyHeader}>NEFT</TableCell>
                    <TableCell className={classes.stickyHeader}>PO</TableCell>
                    <TableCell className={classes.stickyHeader}>MO</TableCell>
                    <TableCell className={classes.stickyHeader}>CASH</TableCell>
                    <TableCell className={classes.stickyHeader}>Total</TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell sx={{ textAlign: 'left', paddingLeft: '00px', whiteSpace: 'nowrap' }}>(a) IGNOAPS</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ textAlign: 'left', paddingLeft: '16px', whiteSpace: 'nowrap' }}>
                      (i.) No. of Transactions in the month
                    </TableCell>
                    <TableCell className={classes.tableFormBody}>
                      <TextField
                        id="noOfTxnApbIgnoaps"
                        variant="outlined"
                        autoComplete="off"
                        fullWidth
                        inputProps={{ maxLength: 10, inputMode: 'numeric' }}
                        onChange={handleNumInput}
                      ></TextField>
                    </TableCell>
                    <TableCell className={classes.tableFormBody}>
                      <TextField
                        id="noOfTxnNeftIgnoaps"
                        variant="outlined"
                        autoComplete="off"
                        fullWidth
                        inputProps={{ maxLength: 10, inputMode: 'numeric' }}
                        onChange={handleNumInput}
                      ></TextField>
                    </TableCell>
                    <TableCell className={classes.tableFormBody}>
                      <TextField
                        id="noOfTxnPoIgnoaps"
                        variant="outlined"
                        autoComplete="off"
                        fullWidth
                        inputProps={{ maxLength: 10, inputMode: 'numeric' }}
                        onChange={handleNumInput}
                      ></TextField>
                    </TableCell>
                    <TableCell className={classes.tableFormBody}>
                      <TextField
                        id="noOfTxnMoIgnoaps"
                        variant="outlined"
                        autoComplete="off"
                        fullWidth
                        inputProps={{ maxLength: 10, inputMode: 'numeric' }}
                        onChange={handleNumInput}
                      ></TextField>
                    </TableCell>
                    <TableCell className={classes.tableFormBody}>
                      <TextField
                        id="noOfTxnCashIgnoaps"
                        variant="outlined"
                        autoComplete="off"
                        fullWidth
                        inputProps={{ maxLength: 10, inputMode: 'numeric' }}
                        onChange={handleNumInput}
                      ></TextField>
                    </TableCell>
                    <TableCell className={classes.tableFormBody}>
                      <TextField
                        id="noOfTxnTotalIgnoaps"
                        variant="outlined"
                        autoComplete="off"
                        fullWidth
                        inputProps={{ maxLength: 10, inputMode: 'numeric' }}
                        onChange={handleNumInput}
                        disabled
                      ></TextField>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ textAlign: 'left', paddingLeft: '16px', whiteSpace: 'nowrap' }}>
                      (ii.) Cumulative no. of transactions
                    </TableCell>
                    <TableCell className={classes.tableFormBody}>
                      <TextField
                        id="cumNoOfTxnApbIgnoaps"
                        variant="outlined"
                        autoComplete="off"
                        fullWidth
                        inputProps={{ maxLength: 10, inputMode: 'numeric' }}
                        onChange={handleNumInput}
                        disabled
                      ></TextField>
                    </TableCell>
                    <TableCell className={classes.tableFormBody}>
                      <TextField
                        id="cumNoOfTxnNeftIgnoaps"
                        variant="outlined"
                        autoComplete="off"
                        fullWidth
                        inputProps={{ maxLength: 10, inputMode: 'numeric' }}
                        onChange={handleNumInput}
                        disabled
                      ></TextField>
                    </TableCell>
                    <TableCell className={classes.tableFormBody}>
                      <TextField
                        id="cumNoOfTxnPoIgnoaps"
                        variant="outlined"
                        autoComplete="off"
                        fullWidth
                        inputProps={{ maxLength: 10, inputMode: 'numeric' }}
                        onChange={handleNumInput}
                        disabled
                      ></TextField>
                    </TableCell>
                    <TableCell className={classes.tableFormBody}>
                      <TextField
                        id="cumNoOfTxnMoIgnoaps"
                        variant="outlined"
                        autoComplete="off"
                        fullWidth
                        inputProps={{ maxLength: 10, inputMode: 'numeric' }}
                        onChange={handleNumInput}
                        disabled
                      ></TextField>
                    </TableCell>
                    <TableCell className={classes.tableFormBody}>
                      <TextField
                        id="cumNoOfTxnCashIgnoaps"
                        variant="outlined"
                        autoComplete="off"
                        fullWidth
                        inputProps={{ maxLength: 10, inputMode: 'numeric' }}
                        onChange={handleNumInput}
                        disabled
                      ></TextField>
                    </TableCell>
                    <TableCell className={classes.tableFormBody}>
                      <TextField
                        id="cumNoOfTxnTotalIgnoaps"
                        variant="outlined"
                        autoComplete="off"
                        fullWidth
                        inputProps={{ maxLength: 10, inputMode: 'numeric' }}
                        onChange={handleNumInput}
                        disabled
                      ></TextField>
                    </TableCell>
                  </TableRow>
                  {/* <TableRow>
                    <TableCell sx={{ textAlign: 'left', paddingLeft: '12px', whiteSpace: 'nowrap' }}>(a1) Amount(rupees in lakh)</TableCell>
                  </TableRow> */}
                  <TableRow>
                    <TableCell sx={{ textAlign: 'left', paddingLeft: '16px', whiteSpace: 'nowrap' }}>
                      (iii.) Monthly Disbursed Amount(Rs. in lakh)
                    </TableCell>
                    <TableCell className={classes.tableFormBody}>
                      <TextField
                        id="monthlyAmountApbIgnoaps"
                        variant="outlined"
                        autoComplete="off"
                        fullWidth
                        inputProps={{ maxLength: 10, inputMode: 'numeric' }}
                        onBlur={handleFloatInput}
                      ></TextField>
                    </TableCell>
                    <TableCell className={classes.tableFormBody}>
                      <TextField
                        id="monthlyAmountNeftIgnoaps"
                        variant="outlined"
                        autoComplete="off"
                        fullWidth
                        inputProps={{ maxLength: 10, inputMode: 'numeric' }}
                        onBlur={handleFloatInput}
                      ></TextField>
                    </TableCell>
                    <TableCell className={classes.tableFormBody}>
                      <TextField
                        id="monthlyAmountPoIgnoaps"
                        variant="outlined"
                        autoComplete="off"
                        fullWidth
                        inputProps={{ maxLength: 10, inputMode: 'numeric' }}
                        onBlur={handleFloatInput}
                      ></TextField>
                    </TableCell>
                    <TableCell className={classes.tableFormBody}>
                      <TextField
                        id="monthlyAmountMoIgnoaps"
                        variant="outlined"
                        autoComplete="off"
                        fullWidth
                        inputProps={{ maxLength: 10, inputMode: 'numeric' }}
                        onBlur={handleFloatInput}
                      ></TextField>
                    </TableCell>
                    <TableCell className={classes.tableFormBody}>
                      <TextField
                        id="monthlyAmountCashIgnoaps"
                        variant="outlined"
                        autoComplete="off"
                        fullWidth
                        inputProps={{ maxLength: 10, inputMode: 'numeric' }}
                        onBlur={handleFloatInput}
                      ></TextField>
                    </TableCell>
                    <TableCell className={classes.tableFormBody}>
                      <TextField
                        id="monthlyAmountTotalIgnoaps"
                        variant="outlined"
                        autoComplete="off"
                        fullWidth
                        inputProps={{ maxLength: 10, inputMode: 'numeric' }}
                        onBlur={handleFloatInput}
                        disabled
                      ></TextField>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ textAlign: 'left', paddingLeft: '16px', whiteSpace: 'nowrap' }}>
                      (iv.) Cumulative Disbursed Amount(Rs. in lakh)
                    </TableCell>
                    <TableCell className={classes.tableFormBody}>
                      <TextField
                        id="cumMonthlyAmountApbIgnoaps"
                        variant="outlined"
                        autoComplete="off"
                        fullWidth
                        inputProps={{ maxLength: 10, inputMode: 'numeric' }}
                        onBlur={handleFloatInput}
                        disabled
                      ></TextField>
                    </TableCell>
                    <TableCell className={classes.tableFormBody}>
                      <TextField
                        id="cumMonthlyAmountNeftIgnoaps"
                        variant="outlined"
                        autoComplete="off"
                        fullWidth
                        inputProps={{ maxLength: 10, inputMode: 'numeric' }}
                        onBlur={handleFloatInput}
                        disabled
                      ></TextField>
                    </TableCell>
                    <TableCell className={classes.tableFormBody}>
                      <TextField
                        id="cumMonthlyAmountPoIgnoaps"
                        variant="outlined"
                        autoComplete="off"
                        fullWidth
                        inputProps={{ maxLength: 10, inputMode: 'numeric' }}
                        onBlur={handleFloatInput}
                        disabled
                      ></TextField>
                    </TableCell>
                    <TableCell className={classes.tableFormBody}>
                      <TextField
                        id="cumMonthlyAmountMoIgnoaps"
                        variant="outlined"
                        autoComplete="off"
                        fullWidth
                        inputProps={{ maxLength: 10, inputMode: 'numeric' }}
                        onBlur={handleFloatInput}
                        disabled
                      ></TextField>
                    </TableCell>
                    <TableCell className={classes.tableFormBody}>
                      <TextField
                        id="cumMonthlyAmountCashIgnoaps"
                        variant="outlined"
                        autoComplete="off"
                        fullWidth
                        inputProps={{ maxLength: 10, inputMode: 'numeric' }}
                        onBlur={handleFloatInput}
                        disabled
                      ></TextField>
                    </TableCell>
                    <TableCell className={classes.tableFormBody}>
                      <TextField
                        id="cumMonthlyAmountTotalIgnoaps"
                        variant="outlined"
                        autoComplete="off"
                        fullWidth
                        inputProps={{ maxLength: 10, inputMode: 'numeric' }}
                        onBlur={handleFloatInput}
                        disabled
                      ></TextField>
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell sx={{ textAlign: 'left', paddingLeft: '00px', whiteSpace: 'nowrap' }}>(b) IGNWPS</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ textAlign: 'left', paddingLeft: '16px', whiteSpace: 'nowrap' }}>
                      (i.) No. of Transactions in the month
                    </TableCell>
                    <TableCell className={classes.tableFormBody}>
                      <TextField
                        id="noOfTxnApbIgnwps"
                        variant="outlined"
                        autoComplete="off"
                        fullWidth
                        inputProps={{ maxLength: 10, inputMode: 'numeric' }}
                        onChange={handleNumInput}
                      ></TextField>
                    </TableCell>
                    <TableCell className={classes.tableFormBody}>
                      <TextField
                        id="noOfTxnNeftIgnwps"
                        variant="outlined"
                        autoComplete="off"
                        fullWidth
                        inputProps={{ maxLength: 10, inputMode: 'numeric' }}
                        onChange={handleNumInput}
                      ></TextField>
                    </TableCell>
                    <TableCell className={classes.tableFormBody}>
                      <TextField
                        id="noOfTxnPoIgnwps"
                        variant="outlined"
                        autoComplete="off"
                        fullWidth
                        inputProps={{ maxLength: 10, inputMode: 'numeric' }}
                        onChange={handleNumInput}
                      ></TextField>
                    </TableCell>
                    <TableCell className={classes.tableFormBody}>
                      <TextField
                        id="noOfTxnMoIgnwps"
                        variant="outlined"
                        autoComplete="off"
                        fullWidth
                        inputProps={{ maxLength: 10, inputMode: 'numeric' }}
                        onChange={handleNumInput}
                      ></TextField>
                    </TableCell>
                    <TableCell className={classes.tableFormBody}>
                      <TextField
                        id="noOfTxnCashIgnwps"
                        variant="outlined"
                        autoComplete="off"
                        fullWidth
                        inputProps={{ maxLength: 10, inputMode: 'numeric' }}
                        onChange={handleNumInput}
                      ></TextField>
                    </TableCell>
                    <TableCell className={classes.tableFormBody}>
                      <TextField
                        id="noOfTxnTotalIgnwps"
                        variant="outlined"
                        autoComplete="off"
                        fullWidth
                        inputProps={{ maxLength: 10, inputMode: 'numeric' }}
                        onChange={handleNumInput}
                        disabled
                      ></TextField>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ textAlign: 'left', paddingLeft: '16px', whiteSpace: 'nowrap' }}>
                      (ii.) Cumulative no. of transactions
                    </TableCell>
                    <TableCell className={classes.tableFormBody}>
                      <TextField
                        id="cumNoOfTxnApbIgnwps"
                        variant="outlined"
                        autoComplete="off"
                        fullWidth
                        inputProps={{ maxLength: 10, inputMode: 'numeric' }}
                        onChange={handleNumInput}
                        disabled
                      ></TextField>
                    </TableCell>
                    <TableCell className={classes.tableFormBody}>
                      <TextField
                        id="cumNoOfTxnNeftIgnwps"
                        variant="outlined"
                        autoComplete="off"
                        fullWidth
                        inputProps={{ maxLength: 10, inputMode: 'numeric' }}
                        onChange={handleNumInput}
                        disabled
                      ></TextField>
                    </TableCell>
                    <TableCell className={classes.tableFormBody}>
                      <TextField
                        id="cumNoOfTxnPoIgnwps"
                        variant="outlined"
                        autoComplete="off"
                        fullWidth
                        inputProps={{ maxLength: 10, inputMode: 'numeric' }}
                        onChange={handleNumInput}
                        disabled
                      ></TextField>
                    </TableCell>
                    <TableCell className={classes.tableFormBody}>
                      <TextField
                        id="cumNoOfTxnMoIgnwps"
                        variant="outlined"
                        autoComplete="off"
                        fullWidth
                        inputProps={{ maxLength: 10, inputMode: 'numeric' }}
                        onChange={handleNumInput}
                        disabled
                      ></TextField>
                    </TableCell>
                    <TableCell className={classes.tableFormBody}>
                      <TextField
                        id="cumNoOfTxnCashIgnwps"
                        variant="outlined"
                        autoComplete="off"
                        fullWidth
                        inputProps={{ maxLength: 10, inputMode: 'numeric' }}
                        onChange={handleNumInput}
                        disabled
                      ></TextField>
                    </TableCell>
                    <TableCell className={classes.tableFormBody}>
                      <TextField
                        id="cumNoOfTxnTotalIgnwps"
                        variant="outlined"
                        autoComplete="off"
                        fullWidth
                        inputProps={{ maxLength: 10, inputMode: 'numeric' }}
                        onChange={handleNumInput}
                        disabled
                      ></TextField>
                    </TableCell>
                  </TableRow>
                  {/* <TableRow>
                    <TableCell sx={{ textAlign: 'left', paddingLeft: '12px', whiteSpace: 'nowrap' }}>(b1) Amount(rupees in lakh)</TableCell>
                  </TableRow> */}
                  <TableRow>
                    <TableCell sx={{ textAlign: 'left', paddingLeft: '16px', whiteSpace: 'nowrap' }}>
                      (iii.) Monthly Disbursed Amount(Rs. in lakh)
                    </TableCell>
                    <TableCell className={classes.tableFormBody}>
                      <TextField
                        id="monthlyAmountApbIgnwps"
                        variant="outlined"
                        autoComplete="off"
                        fullWidth
                        inputProps={{ maxLength: 10, inputMode: 'numeric' }}
                        onBlur={handleFloatInput}
                      ></TextField>
                    </TableCell>
                    <TableCell className={classes.tableFormBody}>
                      <TextField
                        id="monthlyAmountNeftIgnwps"
                        variant="outlined"
                        autoComplete="off"
                        fullWidth
                        inputProps={{ maxLength: 10, inputMode: 'numeric' }}
                        onBlur={handleFloatInput}
                      ></TextField>
                    </TableCell>
                    <TableCell className={classes.tableFormBody}>
                      <TextField
                        id="monthlyAmountPoIgnwps"
                        variant="outlined"
                        autoComplete="off"
                        fullWidth
                        inputProps={{ maxLength: 10, inputMode: 'numeric' }}
                        onBlur={handleFloatInput}
                      ></TextField>
                    </TableCell>
                    <TableCell className={classes.tableFormBody}>
                      <TextField
                        id="monthlyAmountMoIgnwps"
                        variant="outlined"
                        autoComplete="off"
                        fullWidth
                        inputProps={{ maxLength: 10, inputMode: 'numeric' }}
                        onBlur={handleFloatInput}
                      ></TextField>
                    </TableCell>
                    <TableCell className={classes.tableFormBody}>
                      <TextField
                        id="monthlyAmountCashIgnwps"
                        variant="outlined"
                        autoComplete="off"
                        fullWidth
                        inputProps={{ maxLength: 10, inputMode: 'numeric' }}
                        onBlur={handleFloatInput}
                      ></TextField>
                    </TableCell>
                    <TableCell className={classes.tableFormBody}>
                      <TextField
                        id="monthlyAmountTotalIgnwps"
                        variant="outlined"
                        autoComplete="off"
                        fullWidth
                        inputProps={{ maxLength: 10, inputMode: 'numeric' }}
                        onBlur={handleFloatInput}
                        disabled
                      ></TextField>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ textAlign: 'left', paddingLeft: '16px', whiteSpace: 'nowrap' }}>
                      (iv.) Cumulative Disbursed Amount(Rs. in lakh)
                    </TableCell>
                    <TableCell className={classes.tableFormBody}>
                      <TextField
                        id="cumMonthlyAmountApbIgnwps"
                        variant="outlined"
                        autoComplete="off"
                        fullWidth
                        inputProps={{ maxLength: 10, inputMode: 'numeric' }}
                        onBlur={handleFloatInput}
                        disabled
                      ></TextField>
                    </TableCell>
                    <TableCell className={classes.tableFormBody}>
                      <TextField
                        id="cumMonthlyAmountNeftIgnwps"
                        variant="outlined"
                        autoComplete="off"
                        fullWidth
                        inputProps={{ maxLength: 10, inputMode: 'numeric' }}
                        onBlur={handleFloatInput}
                        disabled
                      ></TextField>
                    </TableCell>
                    <TableCell className={classes.tableFormBody}>
                      <TextField
                        id="cumMonthlyAmountPoIgnwps"
                        variant="outlined"
                        autoComplete="off"
                        fullWidth
                        inputProps={{ maxLength: 10, inputMode: 'numeric' }}
                        onBlur={handleFloatInput}
                        disabled
                      ></TextField>
                    </TableCell>
                    <TableCell className={classes.tableFormBody}>
                      <TextField
                        id="cumMonthlyAmountMoIgnwps"
                        variant="outlined"
                        autoComplete="off"
                        fullWidth
                        inputProps={{ maxLength: 10, inputMode: 'numeric' }}
                        onBlur={handleFloatInput}
                        disabled
                      ></TextField>
                    </TableCell>
                    <TableCell className={classes.tableFormBody}>
                      <TextField
                        id="cumMonthlyAmountCashIgnwps"
                        variant="outlined"
                        autoComplete="off"
                        fullWidth
                        inputProps={{ maxLength: 10, inputMode: 'numeric' }}
                        onBlur={handleFloatInput}
                        disabled
                      ></TextField>
                    </TableCell>
                    <TableCell className={classes.tableFormBody}>
                      <TextField
                        id="cumMonthlyAmountTotalIgnwps"
                        variant="outlined"
                        autoComplete="off"
                        fullWidth
                        inputProps={{ maxLength: 10, inputMode: 'numeric' }}
                        onBlur={handleFloatInput}
                        disabled
                      ></TextField>
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell sx={{ textAlign: 'left', paddingLeft: '00px', whiteSpace: 'nowrap' }}>(c) IGNDPS</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ textAlign: 'left', paddingLeft: '16px', whiteSpace: 'nowrap' }}>
                      (i.) No. of Transactions in the month
                    </TableCell>
                    <TableCell className={classes.tableFormBody}>
                      <TextField
                        id="noOfTxnApbIgndps"
                        variant="outlined"
                        autoComplete="off"
                        fullWidth
                        inputProps={{ maxLength: 10, inputMode: 'numeric' }}
                        onChange={handleNumInput}
                      ></TextField>
                    </TableCell>
                    <TableCell className={classes.tableFormBody}>
                      <TextField
                        id="noOfTxnNeftIgndps"
                        variant="outlined"
                        autoComplete="off"
                        fullWidth
                        inputProps={{ maxLength: 10, inputMode: 'numeric' }}
                        onChange={handleNumInput}
                      ></TextField>
                    </TableCell>
                    <TableCell className={classes.tableFormBody}>
                      <TextField
                        id="noOfTxnPoIgndps"
                        variant="outlined"
                        autoComplete="off"
                        fullWidth
                        inputProps={{ maxLength: 10, inputMode: 'numeric' }}
                        onChange={handleNumInput}
                      ></TextField>
                    </TableCell>
                    <TableCell className={classes.tableFormBody}>
                      <TextField
                        id="noOfTxnMoIgndps"
                        variant="outlined"
                        autoComplete="off"
                        fullWidth
                        inputProps={{ maxLength: 10, inputMode: 'numeric' }}
                        onChange={handleNumInput}
                      ></TextField>
                    </TableCell>
                    <TableCell className={classes.tableFormBody}>
                      <TextField
                        id="noOfTxnCashIgndps"
                        variant="outlined"
                        autoComplete="off"
                        fullWidth
                        inputProps={{ maxLength: 10, inputMode: 'numeric' }}
                        onChange={handleNumInput}
                      ></TextField>
                    </TableCell>
                    <TableCell className={classes.tableFormBody}>
                      <TextField
                        id="noOfTxnTotalIgndps"
                        variant="outlined"
                        autoComplete="off"
                        fullWidth
                        inputProps={{ maxLength: 10, inputMode: 'numeric' }}
                        onChange={handleNumInput}
                        disabled
                      ></TextField>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ textAlign: 'left', paddingLeft: '16px', whiteSpace: 'nowrap' }}>
                      (ii.) Cumulative no. of transactions
                    </TableCell>
                    <TableCell className={classes.tableFormBody}>
                      <TextField
                        id="cumNoOfTxnApbIgndps"
                        variant="outlined"
                        autoComplete="off"
                        fullWidth
                        inputProps={{ maxLength: 10, inputMode: 'numeric' }}
                        onChange={handleNumInput}
                        disabled
                      ></TextField>
                    </TableCell>
                    <TableCell className={classes.tableFormBody}>
                      <TextField
                        id="cumNoOfTxnNeftIgndps"
                        variant="outlined"
                        autoComplete="off"
                        fullWidth
                        inputProps={{ maxLength: 10, inputMode: 'numeric' }}
                        onChange={handleNumInput}
                        disabled
                      ></TextField>
                    </TableCell>
                    <TableCell className={classes.tableFormBody}>
                      <TextField
                        id="cumNoOfTxnPoIgndps"
                        variant="outlined"
                        autoComplete="off"
                        fullWidth
                        inputProps={{ maxLength: 10, inputMode: 'numeric' }}
                        onChange={handleNumInput}
                        disabled
                      ></TextField>
                    </TableCell>
                    <TableCell className={classes.tableFormBody}>
                      <TextField
                        id="cumNoOfTxnMoIgndps"
                        variant="outlined"
                        autoComplete="off"
                        fullWidth
                        inputProps={{ maxLength: 10, inputMode: 'numeric' }}
                        onChange={handleNumInput}
                        disabled
                      ></TextField>
                    </TableCell>
                    <TableCell className={classes.tableFormBody}>
                      <TextField
                        id="cumNoOfTxnCashIgndps"
                        variant="outlined"
                        autoComplete="off"
                        fullWidth
                        inputProps={{ maxLength: 10, inputMode: 'numeric' }}
                        onChange={handleNumInput}
                        disabled
                      ></TextField>
                    </TableCell>
                    <TableCell className={classes.tableFormBody}>
                      <TextField
                        id="cumNoOfTxnTotalIgndps"
                        variant="outlined"
                        autoComplete="off"
                        fullWidth
                        inputProps={{ maxLength: 10, inputMode: 'numeric' }}
                        onChange={handleNumInput}
                        disabled
                      ></TextField>
                    </TableCell>
                  </TableRow>
                  {/*<TableRow>
                     <TableCell sx={{ textAlign: 'left', paddingLeft: '12px', whiteSpace: 'nowrap' }}>(c1) Amount(rupees in lakh)</TableCell>
                  </TableRow> */}
                  <TableRow>
                    <TableCell sx={{ textAlign: 'left', paddingLeft: '16px', whiteSpace: 'nowrap' }}>
                      (iii.) Monthly Disbursed Amount(Rs. in lakh)
                    </TableCell>
                    <TableCell className={classes.tableFormBody}>
                      <TextField
                        id="monthlyAmountApbIgndps"
                        variant="outlined"
                        autoComplete="off"
                        fullWidth
                        inputProps={{ maxLength: 10, inputMode: 'numeric' }}
                        onBlur={handleFloatInput}
                      ></TextField>
                    </TableCell>
                    <TableCell className={classes.tableFormBody}>
                      <TextField
                        id="monthlyAmountNeftIgndps"
                        variant="outlined"
                        autoComplete="off"
                        fullWidth
                        inputProps={{ maxLength: 10, inputMode: 'numeric' }}
                        onBlur={handleFloatInput}
                      ></TextField>
                    </TableCell>
                    <TableCell className={classes.tableFormBody}>
                      <TextField
                        id="monthlyAmountPoIgndps"
                        variant="outlined"
                        autoComplete="off"
                        fullWidth
                        inputProps={{ maxLength: 10, inputMode: 'numeric' }}
                        onBlur={handleFloatInput}
                      ></TextField>
                    </TableCell>
                    <TableCell className={classes.tableFormBody}>
                      <TextField
                        id="monthlyAmountMoIgndps"
                        variant="outlined"
                        autoComplete="off"
                        fullWidth
                        inputProps={{ maxLength: 10, inputMode: 'numeric' }}
                        onBlur={handleFloatInput}
                      ></TextField>
                    </TableCell>
                    <TableCell className={classes.tableFormBody}>
                      <TextField
                        id="monthlyAmountCashIgndps"
                        variant="outlined"
                        autoComplete="off"
                        fullWidth
                        inputProps={{ maxLength: 10, inputMode: 'numeric' }}
                        onBlur={handleFloatInput}
                      ></TextField>
                    </TableCell>
                    <TableCell className={classes.tableFormBody}>
                      <TextField
                        id="monthlyAmountTotalIgndps"
                        variant="outlined"
                        autoComplete="off"
                        fullWidth
                        inputProps={{ maxLength: 10, inputMode: 'numeric' }}
                        onBlur={handleFloatInput}
                        disabled
                      ></TextField>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ textAlign: 'left', paddingLeft: '16px', whiteSpace: 'nowrap' }}>
                      (iv.) Cumulative Disbursed Amount(Rs. in lakh)
                    </TableCell>
                    <TableCell className={classes.tableFormBody}>
                      <TextField
                        id="cumMonthlyAmountApbIgndps"
                        variant="outlined"
                        autoComplete="off"
                        fullWidth
                        inputProps={{ maxLength: 10, inputMode: 'numeric' }}
                        onBlur={handleFloatInput}
                        disabled
                      ></TextField>
                    </TableCell>
                    <TableCell className={classes.tableFormBody}>
                      <TextField
                        id="cumMonthlyAmountNeftIgndps"
                        variant="outlined"
                        autoComplete="off"
                        fullWidth
                        inputProps={{ maxLength: 10, inputMode: 'numeric' }}
                        onBlur={handleFloatInput}
                        disabled
                      ></TextField>
                    </TableCell>
                    <TableCell className={classes.tableFormBody}>
                      <TextField
                        id="cumMonthlyAmountPoIgndps"
                        variant="outlined"
                        autoComplete="off"
                        fullWidth
                        inputProps={{ maxLength: 10, inputMode: 'numeric' }}
                        onBlur={handleFloatInput}
                        disabled
                      ></TextField>
                    </TableCell>
                    <TableCell className={classes.tableFormBody}>
                      <TextField
                        id="cumMonthlyAmountMoIgndps"
                        variant="outlined"
                        autoComplete="off"
                        fullWidth
                        inputProps={{ maxLength: 10, inputMode: 'numeric' }}
                        onBlur={handleFloatInput}
                        disabled
                      ></TextField>
                    </TableCell>
                    <TableCell className={classes.tableFormBody}>
                      <TextField
                        id="cumMonthlyAmountCashIgndps"
                        variant="outlined"
                        autoComplete="off"
                        fullWidth
                        inputProps={{ maxLength: 10, inputMode: 'numeric' }}
                        onBlur={handleFloatInput}
                        disabled
                      ></TextField>
                    </TableCell>
                    <TableCell className={classes.tableFormBody}>
                      <TextField
                        id="cumMonthlyAmountTotalIgndps"
                        variant="outlined"
                        autoComplete="off"
                        fullWidth
                        inputProps={{ maxLength: 10, inputMode: 'numeric' }}
                        onBlur={handleFloatInput}
                        disabled
                      ></TextField>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px', gap: '10px' }}>
              <Button variant="contained" color="primary" onClick={() => saveMPR1(false)}>
                Draft Save
              </Button>
              <Button
                variant="contained"
                color="secondary"
                onClick={() => {
                  setSnackbar({
                    severity: 'warning',
                    children: ' Are you sure you want to finalize the submission? This action cannot be undone!',
                    action: (
                      <>
                        <Button
                          color="inherit"
                          size="small"
                          onClick={() => {
                            saveMPR1(true);
                          }}
                        >
                          CONFIRM
                        </Button>
                        <Button color="inherit" size="small" onClick={() => setSnackbar(null)}>
                          CANCEL
                        </Button>
                      </>
                    )
                  });
                }}
              >
                Final Submit
              </Button>

              <Button variant="contained" color="primary" onClick={handleDownload}>
                Download/Print
              </Button>
            </div>
          </>
        )}
      </MainCard>
    </>
  );
};
export default MonthlyProgressReport1;
