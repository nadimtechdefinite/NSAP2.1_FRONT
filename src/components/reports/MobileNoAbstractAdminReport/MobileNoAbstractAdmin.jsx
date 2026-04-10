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
import messages_en from '../../../components/common/messages_en.json';
import { useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import DownloadIcon from '@mui/icons-material/Download';
import '../../../components/verification/mark-nsap-beneficiary/approveMarkBeneficiary.css';
import '../../verification/aadharConsentUpdation/aadharConsent.css';

function MobileNoAbstractAdmin() {
  const [getAllDistrict, setAllDistrict] = useState([]);
  const [snackbar, setSnackbar] = React.useState(null);
  const handleCloseSnackbar = () => setSnackbar(null);
  const [loading, setLoading] = useState(false);
  const [schemeData, setSchemeData] = useState([]);
  const [selectScheme, setSelectScheme] = useState('');
  const [formErrors, setFormErrors] = useState({});
  const [schemeLabel, setSchemeLabel] = useState('');
  const navigate = useNavigate();

  function cancelValue() {
    navigate('/nsap/dashboard/default');
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
      const getStateData = '/contact-no-abstract/getSchemeData';
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
        var location = { schemeCode: selectScheme };
        var body = { ...location };
        const getUrl = `/mobile-no-abstract-admin-report/getMobileNoAbstractAdminReport`;
        setLoading(true);
        const response = await axiosInstance.post(getUrl, JSON.stringify(body));
        if (response.status >= 200 && response.status < 300) {
          setSchemeLabel(response.data.schemeName);
          return response.data.resultObjectArray;
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
      <MainCard title="State-wise Abstract Mobile Details">
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
                Submit{' '}
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
                <kbd className="responsive-kbd">Scheme Code : {schemeLabel}</kbd>
              </div>

              <Button
                variant="contained"
                style={{ backgroundColor: '#8555a3', marginLeft: '-1px', marginBottom: '2px' }}
                onClick={() => exportToExcel('State-wise Abstract Mobile')}
                title="Download Excel"
              >
                Excel <DownloadIcon />
              </Button>

              <Table style={{ border: '1px solid ' }} id="State-wise Abstract Mobile" size="small" aria-label="a dense table">
                <TableHead>
                  <TableRow>
                    <TableCell
                      style={{ borderRightWidth: '1px', borderRightStyle: 'solid', textAlign: 'center', backgroundColor: 'lightsteelblue' }}
                    >
                      <b>Sr. No.</b>
                    </TableCell>
                    <TableCell
                      style={{ borderRightWidth: '1px', borderRightStyle: 'solid', textAlign: 'center', backgroundColor: 'lightsteelblue' }}
                    >
                      <b>State/UT</b>
                    </TableCell>
                    <TableCell
                      style={{ borderRightWidth: '1px', borderRightStyle: 'solid', textAlign: 'center', backgroundColor: 'lightsteelblue' }}
                    >
                      <b>Mobile No</b>
                    </TableCell>
                    <TableCell
                      style={{ borderRightWidth: '1px', borderRightStyle: 'solid', textAlign: 'center', backgroundColor: 'lightsteelblue' }}
                    >
                      <b>NON-Mobile NO</b>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {getAllDistrict.map((item) =>
                    item[1] === 'TOTAL' ? (
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
                          {item[0]}
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
                          {item[1]}
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
                          {item[2]}
                        </TableCell>
                        <TableCell style={{ backgroundColor: 'rgba(71, 140, 255, 1)', color: 'white', textAlign: 'center' }}>
                          {item[3]}
                        </TableCell>
                      </TableRow>
                    ) : (
                      <TableRow key={item.srNo}>
                        {item[0] % 2 === 0 ? (
                          <>
                            <TableCell style={{ borderRightWidth: '1px', borderRightStyle: 'solid', textAlign: 'center' }}>
                              {item[0]}
                            </TableCell>
                            <TableCell style={{ borderRightWidth: '1px', borderRightStyle: 'solid', textAlign: 'center' }}>
                              {item[1]}
                            </TableCell>
                            <TableCell style={{ textAlign: 'center', borderRightWidth: '1px', borderRightStyle: 'solid' }}>
                              {item[2]}
                            </TableCell>
                            <TableCell style={{ textAlign: 'center' }}>{item[3]}</TableCell>
                          </>
                        ) : (
                          <>
                            <TableCell
                              style={{
                                borderRightWidth: '1px',
                                borderRightStyle: 'solid',
                                textAlign: 'center',
                                backgroundColor: 'rgba(0, 0, 0, 0.04)'
                              }}
                            >
                              {item[0]}
                            </TableCell>
                            <TableCell
                              style={{
                                borderRightWidth: '1px',
                                borderRightStyle: 'solid',
                                textAlign: 'center',
                                backgroundColor: 'rgba(0, 0, 0, 0.04)'
                              }}
                            >
                              {item[1]}
                            </TableCell>
                            <TableCell
                              style={{
                                textAlign: 'center',
                                borderRightWidth: '1px',
                                borderRightStyle: 'solid',
                                backgroundColor: 'rgba(0, 0, 0, 0.04)'
                              }}
                            >
                              {item[2]}
                            </TableCell>
                            <TableCell style={{ textAlign: 'center', backgroundColor: 'rgba(0, 0, 0, 0.04)' }}>{item[3]}</TableCell>
                          </>
                        )}
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
export default MobileNoAbstractAdmin;
