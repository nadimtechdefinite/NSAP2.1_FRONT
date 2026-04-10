import React, { useState, useEffect } from 'react';
import { Grid, FormControl, Button, FormHelperText, Typography } from '@mui/material';
import MainCard from 'ui-component/cards/MainCard';
import StateList from 'components/form_components/StateList';
import DistrictList from 'components/form_components/DistrictList';
import SchemeMasterListByStateCode from 'components/form_components/SchemeMasterListByStateCode';
import MonthList from 'components/form_components/MonthList';
import SubSchemeWiseReportYearList from './SubSchemeWiseReportYearList';
import messages_en from 'components/common/messages_en.json';
import axiosInstance from 'hooks/useAuthTokenUrl';
import { Table, TableHead, TableRow, TableCell, TableBody, TableFooter, Alert, Snackbar, CircularProgress } from '@mui/material';
const SubSchemeWiseReport = () => {
  const [tableData, setTableData] = useState([]);
  const [planData, setPlanData] = useState([]);
  const [grandTotal, setGrantTotal] = useState([]);
  const [formErrors, setFormErrors] = useState({});
  const [snackbar, setSnackbar] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    stateCode: '',
    districtCode: '',
    schemeCode: '',
    monthCode: '',
    yearCode: ''
  });
  const handleCloseSnackbar = () => setSnackbar(null);
  const handleStateChange = (stateId) => {
    setFormData({ ...formData, stateCode: stateId });
    setFormErrors((prevErrors) => {
      const updatedErrors = { ...prevErrors };
      delete updatedErrors.stateCode;
      return updatedErrors;
    });
  };
  const handleDistrictChange = (districtId) => {
    setFormData({ ...formData, districtCode: districtId });
    /* setFormErrors((prevErrors) => {
      const updatedErrors = { ...prevErrors };
      delete updatedErrors.districtCode;
      return updatedErrors;
    }); */
  };

  const handleSchemeChange = (schemeCodeId) => {
    setFormData({ ...formData, schemeCode: schemeCodeId });
    setFormErrors((prevErrors) => {
      const updatedErrors = { ...prevErrors };
      delete updatedErrors.schemeCode;
      return updatedErrors;
    });
  };

  const handleMonthChange = (monthCode) => {
    setFormData({ ...formData, monthCode: monthCode });
    setFormErrors((prevErrors) => {
      const updatedErrors = { ...prevErrors };
      delete updatedErrors.monthCode;
      return updatedErrors;
    });
  };

  const handleYearChange = (year) => {
    setFormData({ ...formData, yearCode: year });
    setFormErrors((prevErrors) => {
      const updatedErrors = { ...prevErrors };
      delete updatedErrors.yearCode;
      return updatedErrors;
    });
  };

  useEffect(() => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      areaCode: '',
      subDistrictMunicipalCode: ''
    }));
  }, [formData.districtCode]);

  const cancelButton = () => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      districtCode: '',
      schemeCode: '',
      monthCode: '',
      yearCode: ''
    }));
    setTableData([]);
  };

  const validateForm = () => {
    const errors = {};
    // Add validation logic for each field
    if (!formData.stateCode) {
      errors.stateCode = messages_en.stateRequired;
    }

    if (!formData.schemeCode) {
      errors.schemeCode = messages_en.schemCodeRequired;
    }

    if (!formData.monthCode) {
      errors.monthCode = messages_en.monthFeildRequired;
    }

    if (!formData.yearCode) {
      errors.yearCode = messages_en.yearFeildRequired;
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0; // Return true if no errors
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const isFormValid = validateForm();
    if (isFormValid) {
      setLoading(true);
      try {
        const postUrl = '/login/report/findSubSchemeWiseReport';
        const response = await axiosInstance.post(postUrl, formData);
        // console.log('Response : ', response.data);
        if (response.data.resultObjectArray) {
          // Calculate Grand Total
          let grandTotal = {};
          response.data.resultObjectArray.forEach((item) => {
            for (let key in item) {
              if (Object.prototype.hasOwnProperty.call(item, key) && typeof item[key] === 'number') {
                grandTotal[key] = (grandTotal[key] || 0) + item[key];
              }
            }
          });
          setGrantTotal(grandTotal);
          setTableData(response.data.resultObjectArray);
          setPlanData(response.data.planList);
        } else {
          setTableData([]);
          setSnackbar({ children: 'No records are found.', severity: 'error' });
        }
      } catch (error) {
        if (error.response.data && error.response.data.message) {
          setSnackbar({ children: 'No records are found.', severity: 'error' });
        } else {
          console.log('Error  : ', error);
        }
      } finally {
        setLoading(false);
      }
    } else {
      console.log('Form not valid!');
      // Handle form not valid case, maybe show an error message
    }
  };
  const grandTotalArray = Object.entries(grandTotal);
  return (
    <div>
      {loading && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 9999,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <CircularProgress />
        </div>
      )}

      <MainCard title="Sub Scheme Wise Beneficiaries in NSAP Schemes and State Scheme">
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <StateList onSelectState={handleStateChange} isMendatory={true} />
              {formErrors.stateCode && (
                <FormHelperText>
                  <Typography style={{ color: 'red', fontSize: '0.8rem' }}>{formErrors.stateCode}</Typography>
                </FormHelperText>
              )}
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <DistrictList
                onSelectDistrict={handleDistrictChange}
                selectedStateId={formData.stateCode}
                isMendatory={false}
                defaultSelectedDistrict={formData.districtCode}
              />
              {formErrors.districtCode && (
                <FormHelperText>
                  <Typography style={{ color: 'red', fontSize: '0.8rem' }}>{formErrors.districtCode}</Typography>
                </FormHelperText>
              )}
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <SchemeMasterListByStateCode
                selectedStateCode={formData.stateCode}
                onSelectScheme={handleSchemeChange}
                isMendatory={true}
                defaultSelectedScheme={formData.schemeCode}
              />
              {formErrors.schemeCode && (
                <FormHelperText>
                  <Typography style={{ color: 'red', fontSize: '0.8rem' }}>{formErrors.schemeCode}</Typography>
                </FormHelperText>
              )}
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <MonthList onSelectMonth={handleMonthChange} isMendatory={true} defaultSelectedMonth={formData.monthCode} />
              {formErrors.monthCode && (
                <FormHelperText>
                  <Typography style={{ color: 'red', fontSize: '0.8rem' }}>{formErrors.monthCode}</Typography>
                </FormHelperText>
              )}
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <SubSchemeWiseReportYearList
                selectedStateCode={formData.stateCode}
                onSelectYear={handleYearChange}
                isMendatory={true}
                defaultValueYear={formData.yearCode}
              />
              {formErrors.yearCode && (
                <FormHelperText>
                  <Typography style={{ color: 'red', fontSize: '0.8rem' }}>{formErrors.yearCode}</Typography>
                </FormHelperText>
              )}
            </FormControl>
          </Grid>
          <Grid item xs={12} alignItems="center">
            <Button type="submit" variant="contained" color="primary" onClick={handleSubmit}>
              SUBMIT
            </Button>
            &nbsp; &nbsp; &nbsp;
            <Button type="button" variant="contained" color="error" onClick={cancelButton}>
              CANCEL
            </Button>
          </Grid>
        </Grid>
      </MainCard>
      {!tableData.length == 0 && (
        <div style={{ marginTop: '20px' }}>
          <MainCard title="Beneficiaries Details">
            <Grid container spacing={2}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell rowSpan={2} style={{ borderColor: 'black', borderWidth: 1, borderStyle: 'solid' }}>
                      S.NO
                    </TableCell>
                    <TableCell rowSpan={2} style={{ borderColor: 'black', borderWidth: 1, borderStyle: 'solid' }}>
                      NAME OF DISTRICTS
                    </TableCell>
                    <TableCell colSpan={planData.length} style={{ borderColor: 'black', borderWidth: 1, borderStyle: 'solid' }}>
                      NUMBER OF Beneficiaries
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    {planData.map((item, index) => (
                      <TableCell key={index} style={{ borderColor: 'black', borderWidth: 1, borderStyle: 'solid' }}>
                        {item.planCode}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>

                <TableBody>
                  {tableData.map((row, index) => (
                    <TableRow key={index}>
                      <TableCell style={{ borderColor: 'black', borderWidth: 1, borderStyle: 'solid' }}>{index + 1}</TableCell>
                      {row.map((cell, cellIndex) => (
                        <TableCell key={cellIndex} style={{ borderColor: 'black', borderWidth: 1, borderStyle: 'solid' }}>
                          {cell}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
                <TableFooter>
                  <TableRow>
                    <TableCell style={{ borderColor: 'black', borderWidth: 1, borderStyle: 'solid' }}></TableCell>
                    <TableCell style={{ borderColor: 'black', borderWidth: 1, borderStyle: 'solid', fontWeight: 'bold' }}>
                      Grand Total
                    </TableCell>
                    {grandTotalArray.map(([key, value], index) => (
                      <TableCell
                        key={index}
                        style={{
                          borderColor: 'black',
                          borderWidth: 1,
                          borderStyle: 'solid',
                          fontWeight: 'bold',
                          color: key === 'Grand Total' ? 'blue' : 'inherit'
                        }}
                      >
                        {value}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableFooter>
              </Table>
            </Grid>
          </MainCard>
        </div>
      )}

      {!!snackbar && (
        <Snackbar open anchorOrigin={{ vertical: 'top', horizontal: 'center' }} onClose={handleCloseSnackbar} autoHideDuration={8000}>
          <Alert {...snackbar} onClose={handleCloseSnackbar} />
        </Snackbar>
      )}
    </div>
  );
};

export default SubSchemeWiseReport;
