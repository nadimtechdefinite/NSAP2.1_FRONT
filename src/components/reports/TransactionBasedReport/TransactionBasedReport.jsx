import MainCard from 'ui-component/cards/MainCard';
import React, { useState, useEffect } from 'react';
import {
  Grid,
  Button,
  FormControl,
  Snackbar,
  Alert,
  CircularProgress,
  Backdrop,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Typography,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell
} from '@mui/material';
import axiosInstance from 'hooks/useAuthTokenUrl';
import '../../../components/verification/mark-nsap-beneficiary/approveMarkBeneficiary.css';
import '../../verification/aadharConsentUpdation/aadharConsent.css';
import messages_en from '../../../components/common/messages_en.json';
import { useNavigate } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import DownloadIcon from '@mui/icons-material/Download';

function TransactionBasedReport() {
  const [getAllDistrict, setAllDistrict] = useState([]);
  const [snackbar, setSnackbar] = React.useState(null);
  const handleCloseSnackbar = () => setSnackbar(null);
  const [loading, setLoading] = useState(false);
  const [schemeData, setSchemeData] = useState([]);
  const [selectScheme, setSelectScheme] = useState('');
  const [selectFinYear, setSelectFinYear] = useState('');
  const [formErrors, setFormErrors] = useState({});
  const [finLabel, setFinLabel] = useState('');
  const [schemeLabel, setSchemeLabel] = useState('');
  const navigate = useNavigate();

  function cancelValue() {
    navigate('/nsap/dashboard/default');
  }

  function handleSelectFinYear(finData) {
    setSelectFinYear(finData);
    setFormErrors((prevErrors) => {
      const updatedErrors = { ...prevErrors };
      delete updatedErrors.selectFinYear;
      return updatedErrors;
    });
  }

  function handleSelectScheme(schemeData) {
    setSelectScheme(schemeData);
    setFormErrors((prevErrors) => {
      const updatedErrors = { ...prevErrors };
      delete updatedErrors.selectScheme;
      return updatedErrors;
    });
  }

  const getSchemeData = async () => {
    try {
      const getStateData = '/transaction-based-report/getSchemeData';
      setLoading(true);
      const response = await axiosInstance.get(getStateData);
      setSchemeData(response.data);
    } catch (error) {
      console.error('Error fetching data :', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getSchemeData();
  }, []);

  const validateForm = () => {
    const errors = {};

    if (!selectFinYear) {
      errors.selectFinYear = 'Financial Year is required';
    }

    if (!selectScheme) {
      errors.selectScheme = messages_en.schemeRequired;
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleClickOpen = (e) => {
    e.preventDefault();
    fetchData()
      .then((res) => {
        if (res) {
          const districtData = res || [];
          setAllDistrict(districtData);
          console.log(res);
        } else {
          setAllDistrict([]);
          return false;
        }
      })
      .catch((e) => {
        console.log(e.message);
      });
  };

  const fetchData = async () => {
    const isFormValid = validateForm();
    if (isFormValid) {
      try {
        var location = { finYear: selectFinYear, schemeCode: selectScheme };
        var body = { ...location };
        const getUrl = `/transaction-based-report/getTransactionBasedReport`;
        setLoading(true);
        const response = await axiosInstance.post(getUrl, JSON.stringify(body));
        if (response.status >= 200 && response.status < 300) {
          if (response.data.length > 1) {
            setFinLabel(response.data[0].fin);
            setSchemeLabel(response.data[0].schemeLabel);
            return response.data;
          } else {
            setSnackbar({ children: 'No Data Found!', severity: 'error' });
          }
        } else {
          return false;
        }
      } catch (error) {
        if (error.response.data.id) {
          setSnackbar({ children: error.response.data.id, severity: 'error' });
        } else {
          setSnackbar({ children: 'No Data Found', severity: 'error' });
        }
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    }
  };
  const handleFormSubmit = async (e) => {
    e.preventDefault();
  };

  const exportToExcel = (id) => {
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.table_to_sheet(document.getElementById(id));
    XLSX.utils.book_append_sheet(wb, ws, id);
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    saveAs(new Blob([excelBuffer], { type: 'application/octet-stream' }), id + '.xlsx');
  };

  return (
    <div>
      <MainCard title="APB/NEFT Transaction Abstract">
        {!!snackbar && (
          <Snackbar open anchorOrigin={{ vertical: 'top', horizontal: 'center' }} onClose={handleCloseSnackbar} autoHideDuration={6000}>
            <Alert {...snackbar} onClose={handleCloseSnackbar} />
          </Snackbar>
        )}
        <Backdrop open={loading} style={{ zIndex: 999, color: '#fff' }}>
          <CircularProgress color="inherit" />
        </Backdrop>
        <form onSubmit={(e) => handleClickOpen(e)}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <InputLabel id="financial-year">
                  Financial Year <span style={{ color: 'red' }}>*</span>
                </InputLabel>
                <Select
                  labelId="financial-year"
                  id="financialYear"
                  label="Financial Year"
                  name="financialYear"
                  onChange={(event) => handleSelectFinYear(event.target.value)}
                >
                  <MenuItem value="2023-2024">2023-2024 </MenuItem>
                  <MenuItem value="2022-2023">2022-2023 </MenuItem>
                  <MenuItem value="2021-2022">2021-2022 </MenuItem>
                </Select>
                {formErrors.selectFinYear && (
                  <FormHelperText>
                    <Typography style={{ color: 'red', fontSize: '0.8rem' }}>{formErrors.selectFinYear}</Typography>
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <InputLabel id="scheme-name">
                  Scheme Name <span style={{ color: 'red' }}>*</span>
                </InputLabel>
                <Select
                  labelId="scheme-name"
                  id="schemeCode"
                  label="Scheme Name"
                  name="schemeCode"
                  onChange={(event) => handleSelectScheme(event.target.value)}
                >
                  <MenuItem value="all">ALL</MenuItem>
                  <MenuItem value="all_without_nfbs">ALL WITHOUT NFBS</MenuItem>
                  {schemeData.map((item) => (
                    <MenuItem key={item.schemeCode} value={item.schemeCode}>
                      {item.schemeCode}
                    </MenuItem>
                  ))}
                </Select>
                {formErrors.selectScheme && (
                  <FormHelperText>
                    <Typography style={{ color: 'red', fontSize: '0.8rem' }}>{formErrors.selectScheme}</Typography>
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={4}>
              <Button type="submit" variant="contained" color="secondary" title="Search" style={{ marginTop: '7px' }}>
                Search <SearchIcon />
              </Button>{' '}
              &nbsp;
              <Button
                variant="contained"
                color="primary"
                onClick={() => {
                  cancelValue();
                }}
                title="Cancel"
                style={{ marginTop: '7px' }}
              >
                Cancel
              </Button>
            </Grid>
          </Grid>
        </form>
      </MainCard>

      {getAllDistrict.length > 0 ? (
        <>
          <form onSubmit={handleFormSubmit}>
            <MainCard>
              <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', marginTop: '-28px' }}>
                <kbd className="responsive-kbd">Financial Year : {finLabel} </kbd>
                <kbd className="responsive-kbd">Scheme Name : {schemeLabel}</kbd>
              </div>

              <Button
                variant="contained"
                style={{ backgroundColor: '#8555a3', marginLeft: '-1px', marginBottom: '2px' }}
                onClick={() => exportToExcel('APB-NEFT-Transaction-Abstract')}
                title="Download Excel"
              >
                Excel <DownloadIcon />
              </Button>

              <Table style={{ border: '1px solid ' }} id="APB-NEFT-Transaction-Abstract" size="small" aria-label="a dense table">
                <TableHead>
                  <TableRow>
                    <TableCell rowSpan={2} style={{ borderRightWidth: '1px', borderRightStyle: 'solid', textAlign: 'center' }}>
                      <b>Sr. No.</b>
                    </TableCell>
                    <TableCell rowSpan={2} style={{ borderRightWidth: '1px', borderRightStyle: 'solid', textAlign: 'center' }}>
                      <b>State/UT</b>
                    </TableCell>
                    <TableCell
                      colSpan={2}
                      style={{ backgroundColor: 'aliceblue', textAlign: 'center', borderRightWidth: '1px', borderRightStyle: 'solid' }}
                    >
                      <b>Account(NEFT | BANK | PO)</b>
                    </TableCell>
                    <TableCell
                      colSpan={2}
                      style={{ backgroundColor: 'lightgray', textAlign: 'center', borderRightWidth: '1px', borderRightStyle: 'solid' }}
                    >
                      <b>Aadhar(APB)</b>
                    </TableCell>
                    <TableCell colSpan={2} style={{ backgroundColor: 'beige', textAlign: 'center' }}>
                      <b>Total(NEFT | BANK | PO | APB)</b>
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell style={{ borderRightWidth: '1px', borderRightStyle: 'solid', textAlign: 'center' }}>
                      <b>Transaction</b>
                    </TableCell>
                    <TableCell style={{ borderRightWidth: '1px', borderRightStyle: 'solid', textAlign: 'center' }}>
                      <b>Amount</b>
                    </TableCell>
                    <TableCell style={{ borderRightWidth: '1px', borderRightStyle: 'solid', textAlign: 'center' }}>
                      <b>Transaction</b>
                    </TableCell>
                    <TableCell style={{ borderRightWidth: '1px', borderRightStyle: 'solid', textAlign: 'center' }}>
                      <b>Amount</b>
                    </TableCell>
                    <TableCell style={{ borderRightWidth: '1px', borderRightStyle: 'solid', textAlign: 'center' }}>
                      <b>Transaction</b>
                    </TableCell>
                    <TableCell style={{ borderRightWidth: '1px', borderRightStyle: 'solid', textAlign: 'center' }}>
                      <b>Amount</b>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {getAllDistrict.map((item) =>
                    item.stateName === 'TOTAL' ? (
                      <TableRow key={item.srNo}>
                        <TableCell
                          style={{
                            backgroundColor: 'rgba(71, 140, 255, 1)',
                            color: 'white',
                            borderRightWidth: '1px',
                            borderRightStyle: 'solid',
                            textAlign: 'center'
                          }}
                        >
                          {item.srNo}
                        </TableCell>
                        <TableCell
                          style={{
                            backgroundColor: 'rgba(71, 140, 255, 1)',
                            color: 'white',
                            borderRightWidth: '1px',
                            borderRightStyle: 'solid',
                            textAlign: 'center'
                          }}
                        >
                          {item.stateName}
                        </TableCell>
                        <TableCell
                          style={{
                            backgroundColor: 'rgba(71, 140, 255, 1)',
                            color: 'white',
                            textAlign: 'center',
                            borderRightWidth: '1px',
                            borderRightStyle: 'solid'
                          }}
                        >
                          {item.accountBasedTr}
                        </TableCell>
                        <TableCell style={{ backgroundColor: 'rgba(71, 140, 255, 1)', color: 'white', textAlign: 'center' }}>
                          {item.accountBasedAm}
                        </TableCell>
                        <TableCell
                          style={{
                            backgroundColor: 'rgba(71, 140, 255, 1)',
                            color: 'white',
                            textAlign: 'center',
                            borderRightWidth: '1px',
                            borderRightStyle: 'solid'
                          }}
                        >
                          {item.aadharBasedTr}
                        </TableCell>
                        <TableCell style={{ backgroundColor: 'rgba(71, 140, 255, 1)', color: 'white', textAlign: 'center' }}>
                          {item.aadharBasedAm}
                        </TableCell>
                        <TableCell
                          style={{
                            backgroundColor: 'rgba(71, 140, 255, 1)',
                            color: 'white',
                            textAlign: 'center',
                            borderRightWidth: '1px',
                            borderRightStyle: 'solid'
                          }}
                        >
                          {item.totalTr}
                        </TableCell>
                        <TableCell style={{ backgroundColor: 'rgba(71, 140, 255, 1)', color: 'white', textAlign: 'center' }}>
                          {item.totalAm}
                        </TableCell>
                      </TableRow>
                    ) : (
                      <TableRow key={item.srNo}>
                        <TableCell style={{ borderRightWidth: '1px', borderRightStyle: 'solid', textAlign: 'center' }}>
                          {item.srNo}
                        </TableCell>
                        <TableCell style={{ borderRightWidth: '1px', borderRightStyle: 'solid', textAlign: 'center' }}>
                          {item.stateName}
                        </TableCell>
                        <TableCell
                          style={{ backgroundColor: 'aliceblue', textAlign: 'center', borderRightWidth: '1px', borderRightStyle: 'solid' }}
                        >
                          {item.accountBasedTr}
                        </TableCell>
                        <TableCell style={{ backgroundColor: 'aliceblue', textAlign: 'center' }}>{item.accountBasedAm}</TableCell>
                        <TableCell
                          style={{ backgroundColor: 'lightgray', textAlign: 'center', borderRightWidth: '1px', borderRightStyle: 'solid' }}
                        >
                          {item.aadharBasedTr}
                        </TableCell>
                        <TableCell style={{ backgroundColor: 'lightgray', textAlign: 'center' }}>{item.aadharBasedAm}</TableCell>
                        <TableCell
                          style={{ backgroundColor: 'beige', textAlign: 'center', borderRightWidth: '1px', borderRightStyle: 'solid' }}
                        >
                          {item.totalTr}
                        </TableCell>
                        <TableCell style={{ backgroundColor: 'beige', textAlign: 'center' }}>{item.totalAm}</TableCell>
                      </TableRow>
                    )
                  )}
                </TableBody>
              </Table>
            </MainCard>
          </form>
        </>
      ) : (
        <div></div>
      )}
    </div>
  );
}
export default TransactionBasedReport;
