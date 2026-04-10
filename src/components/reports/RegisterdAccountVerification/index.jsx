import React, { useState, useEffect } from 'react';
import { Grid, FormControl, Button, FormHelperText, Typography } from '@mui/material';
import MainCard from 'ui-component/cards/MainCard';
import StateList from 'components/form_components/StateList';
import DistrictList from 'components/form_components/DistrictList';
import AreaList from 'components/form_components/AreaList';
import SubDistrictList from 'components/form_components/SubDistrictList';
import GramPanchayatList from 'components/form_components/GramPanchayatList';
import messages_en from 'components/common/messages_en.json';
import axiosInstance from 'hooks/useAuthTokenUrl';
import { Table, TableHead, TableRow, TableCell, TableBody /* , Alert, Snackbar */, CircularProgress } from '@mui/material';
import VerifiedNonVerifiedBeneficiariesCountDetails from './VerifiedNonVerifiedBeneficiariesCountDetails';
const RegisterdAccountVerificationReport = () => {
  const [loading, setLoading] = useState(false);
  const [searchLevel, setSearchLevel] = useState(null);
  const [beneficiariesStatus, setBeneficiariesStatus] = useState('');
  const [tableData, setTableData] = useState([]);
  const [countDetailsData, setCountDetailsData] = useState([]);
  const [formErrors, setFormErrors] = useState({});
  const [formData, setFormData] = useState({
    stateCode: '',
    districtCode: '',
    areaCode: '',
    subDistrictMunicipalCode: '',
    gramPanchayatWardCode: ''
  });
  const [selectedDistrictCode, setSelectedDistrictCode] = useState('');
  const [selectedSubDistrictCode, setSelectedSubDistrictCode] = useState('');
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
    setFormErrors((prevErrors) => {
      const updatedErrors = { ...prevErrors };
      delete updatedErrors.districtCode;
      return updatedErrors;
    });
  };
  const handleAreaChange = (areaCode) => {
    setFormData({ ...formData, areaCode: areaCode });
    setFormErrors((prevErrors) => {
      const updatedErrors = { ...prevErrors };
      delete updatedErrors.areaCode;
      return updatedErrors;
    });
  };

  const handleSubDistrictChange = (subDistrictCode) => {
    setFormData({ ...formData, subDistrictMunicipalCode: subDistrictCode });
    setFormErrors((prevErrors) => {
      const updatedErrors = { ...prevErrors };
      delete updatedErrors.subDistrictMunicipalCode;
      return updatedErrors;
    });
  };
  const handleGramPanchayatChange = (gramPanchayatCode) => {
    setFormData({ ...formData, gramPanchayatWardCode: gramPanchayatCode });
    setFormErrors((prevErrors) => {
      const updatedErrors = { ...prevErrors };
      delete updatedErrors.gramPanchayatWardCode;
      return updatedErrors;
    });
  };
  useEffect(() => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      areaCode: '',
      subDistrictMunicipalCode: '',
      gramPanchayatWardCode: ''
    }));
  }, [formData.districtCode]);

  useEffect(() => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      subDistrictMunicipalCode: '',
      gramPanchayatWardCode: ''
    }));
  }, [formData.areaCode]);

  const cancelButton = () => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      districtCode: '',
      areaCode: '',
      subDistrictMunicipalCode: '',
      gramPanchayatWardCode: ''
    }));
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.stateCode) {
      errors.stateCode = messages_en.stateRequired;
    }
    if (formData.areaCode && !formData.subDistrictMunicipalCode) {
      errors.subDistrictMunicipalCode = messages_en.subDistrictRequired;
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0; // Return true if no errors
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const isFormValid = validateForm();
    if (isFormValid) {
      setLoading(true);
      setCountDetailsData([]);
      try {
        const postUrl = '/login/report/findRegisterdAccountVerificationReport';
        const response = await axiosInstance.post(postUrl, formData);
        //console.log('response  : ', response.data);
        setSearchLevel(response.data.searchLevel);
        setTableData(response.data.verifyNonVerifyResponseList);
      } catch (error) {
        console.log('Error  : ', error);
      } finally {
        setLoading(false);
      }
    } else {
      console.log('Form not valid!');
    }
  };

  async function callOtherAPI(level, locationCode) {
    const updatedFormData = {
      ...formData
    };

    // Update formData based on the level value
    if (level === 'DISTRICT' + locationCode) {
      updatedFormData.districtCode = locationCode;
    } else if (level === 'SUBDISTRICT' + locationCode) {
      updatedFormData.subDistrictMunicipalCode = locationCode;
    } else {
      updatedFormData.gramPanchayatWardCode = locationCode;
    }

    console.log('updatedFormData : ', updatedFormData);

    try {
      setLoading(true);
      const postUrl = '/login/report/findRegisterdAccountVerificationReport';
      const response = await axiosInstance.post(postUrl, updatedFormData);
      //console.log('response  : ', response.data);
      setSelectedDistrictCode(response.data.selectedDistrictCode);
      setSelectedSubDistrictCode(response.data.subDistrictMunicipalCode);
      setSearchLevel(response.data.searchLevel);
      setTableData(response.data.verifyNonVerifyResponseList);
    } catch (error) {
      console.log('Error  : ', error);
    } finally {
      setLoading(false);
    }
  }

  async function callOtherAPIVerifiedNonVerified(level, statusValue, locationCode) {
    console.log('COUNT DETAILS : ', level, statusValue, locationCode);
    setBeneficiariesStatus(statusValue);
    const countDetailFormDataRequest = {
      ...formData
    };

    if (level === 'SUBDISTRICT') {
      countDetailFormDataRequest.districtCode = formData.districtCode ? formData.districtCode : selectedDistrictCode;
      countDetailFormDataRequest.subDistrictMunicipalCode = locationCode;
    } else if (level === 'GRAMPANCHAYAT') {
      countDetailFormDataRequest.districtCode = formData.districtCode ? formData.districtCode : selectedDistrictCode;
      countDetailFormDataRequest.subDistrictMunicipalCode = formData.subDistrictMunicipalCode
        ? formData.subDistrictMunicipalCode
        : selectedSubDistrictCode;
      countDetailFormDataRequest.gramPanchayatWardCode = locationCode;
    }
    countDetailFormDataRequest.verificationStatus = statusValue;
    console.log('countDetailFormDataRequest : ', countDetailFormDataRequest);
    try {
      setLoading(true);
      const postUrl = '/login/report/findVerifiedAndNonVerifiedBeneficiaries';
      const response = await axiosInstance.post(postUrl, countDetailFormDataRequest);
      //console.log('response  : ', response.data);
      const newData = response.data.map((row, index) => ({
        ...row,
        id: row.sanctionOrderNo,
        serialNo: index + 1 // Serial number starts from 1
      }));
      setCountDetailsData(newData);
    } catch (error) {
      console.log('Error  : ', error);
    } finally {
      setLoading(false);
    }
  }

  async function callOtherAPIVerifiedNonVerifiedExcel(level, statusValue, locationCode) {
    console.log('EXCEL : ', level, statusValue, locationCode);
    setBeneficiariesStatus(statusValue);
    const excelRequest = {
      ...formData
    };
    excelRequest.districtCode = locationCode;
    excelRequest.verificationStatus = statusValue;
    try {
      setLoading(true);
      const response = await axiosInstance.post('/login/report/downloadVerifiedAndNonVerifiedBeneficiaries', excelRequest, {
        responseType: 'blob'
      });
      const blob = new Blob([response.data], { type: 'application/octet-stream' });
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      const currentDate =
        new Date().toISOString().slice(8, 10) + '-' + new Date().toISOString().slice(5, 7) + '-' + new Date().toISOString().slice(0, 4);

      link.download = `${statusValue}_BENEFICIARIES DETAILS_${currentDate}_data.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(link.href);
    } catch (error) {
      //setSnackbar({ children: 'Some Internal Error Occured While Downloading Data', severity: 'error' });
      console.error('Error fetching data:', error.message);
    } finally {
      setLoading(false);
    }
  }

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
      <MainCard title="VERIFIED / NON-VERIFIED BENEFICIARIES REPORT">
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
              <AreaList onSelectArea={handleAreaChange} selectedArea={formData.areaCode} />
              {formErrors.areaCode && (
                <FormHelperText>
                  <Typography style={{ color: 'red', fontSize: '0.8rem' }}>{formErrors.areaCode}</Typography>
                </FormHelperText>
              )}
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <SubDistrictList
                onSelectSubDistrict={handleSubDistrictChange}
                selectedDistrictId={formData.districtCode}
                selectedAreaId={formData.areaCode}
              />
              {formErrors.subDistrictMunicipalCode && (
                <FormHelperText>
                  <Typography style={{ color: 'red', fontSize: '0.8rem' }}>{formErrors.subDistrictMunicipalCode}</Typography>
                </FormHelperText>
              )}
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <GramPanchayatList
                onSelectGramPanchayat={handleGramPanchayatChange}
                selectedSubDistrictMunicipalAreaId={formData.subDistrictMunicipalCode}
              />
              {formErrors.gramPanchayatWardCode && (
                <FormHelperText>
                  <Typography style={{ color: 'red', fontSize: '0.8rem' }}>{formErrors.gramPanchayatWardCode}</Typography>
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
        <div style={{ marginTop: '20px', overflowX: 'auto' }}>
          <MainCard title="Beneficiaries Details">
            <Grid container spacing={2}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell style={{ borderColor: 'black', borderWidth: 1, borderStyle: 'solid' }}>S.NO</TableCell>
                    <TableCell style={{ borderColor: 'black', borderWidth: 1, borderStyle: 'solid' }}>
                      {searchLevel === 'DISTRICT'
                        ? 'District Name'
                        : searchLevel === 'SUBDISTRICT'
                        ? 'Sub District Name'
                        : 'Gram Panchayat Name'}
                    </TableCell>
                    <TableCell style={{ borderColor: 'black', borderWidth: 1, borderStyle: 'solid' }}>Total Beneficiaries</TableCell>
                    <TableCell style={{ borderColor: 'black', borderWidth: 1, borderStyle: 'solid' }}>Verified</TableCell>
                    <TableCell style={{ borderColor: 'black', borderWidth: 1, borderStyle: 'solid' }}>Non-Verified</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {tableData.map((row, index) => (
                    <TableRow key={index}>
                      <TableCell style={{ borderColor: 'black', borderWidth: 1, borderStyle: 'solid' }}>{index + 1}</TableCell>
                      <TableCell
                        style={{
                          borderColor: 'black',
                          borderWidth: 1,
                          borderStyle: 'solid',
                          color: searchLevel === 'DISTRICT' ? '#2686e0' : 'inherit',
                          cursor: searchLevel === 'DISTRICT' ? 'pointer' : 'default'
                        }}
                        onClick={
                          searchLevel === 'DISTRICT' ? () => callOtherAPI(searchLevel + row.districtCode, row.districtCode) : undefined
                        }
                      >
                        {row.districtName}
                      </TableCell>
                      <TableCell style={{ borderColor: 'black', borderWidth: 1, borderStyle: 'solid' }}>{row.totalBen}</TableCell>
                      <TableCell
                        style={{
                          borderColor: 'black',
                          borderWidth: 1,
                          borderStyle: 'solid',
                          cursor: row.verifyCount > 0 ? 'pointer' : 'default',
                          color: row.verifyCount > 0 ? '#2686e0' : 'inherit'
                        }}
                        onClick={() => {
                          if ((row.verifyCount > 0 && searchLevel === 'SUBDISTRICT') || searchLevel === 'GRAMPANCHAYAT') {
                            callOtherAPIVerifiedNonVerified(searchLevel, 'VERIFIED', row.districtCode);
                          } else {
                            callOtherAPIVerifiedNonVerifiedExcel(searchLevel, 'VERIFIED', row.districtCode);
                          }
                        }}
                      >
                        {row.verifyCount}
                      </TableCell>
                      <TableCell
                        style={{
                          borderColor: 'black',
                          borderWidth: 1,
                          borderStyle: 'solid',
                          cursor: row.nonVerifyCount > 0 ? 'pointer' : 'default',
                          color: row.nonVerifyCount > 0 ? '#2686e0' : 'inherit'
                        }}
                        onClick={() => {
                          if ((row.verifyCount > 0 && searchLevel === 'SUBDISTRICT') || searchLevel === 'GRAMPANCHAYAT') {
                            callOtherAPIVerifiedNonVerified(searchLevel, 'NOT VERIFIED', row.districtCode);
                          } else {
                            callOtherAPIVerifiedNonVerifiedExcel(searchLevel, 'NOT VERIFIED', row.districtCode);
                          }
                        }}
                      >
                        {row.nonVerifyCount}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Grid>
          </MainCard>
        </div>
      )}
      {!countDetailsData.length == 0 && (
        <VerifiedNonVerifiedBeneficiariesCountDetails
          BeneficiariesStatus={beneficiariesStatus}
          BeneficiariesCountDetails={countDetailsData}
        />
      )}
    </div>
  );
};

export default RegisterdAccountVerificationReport;
