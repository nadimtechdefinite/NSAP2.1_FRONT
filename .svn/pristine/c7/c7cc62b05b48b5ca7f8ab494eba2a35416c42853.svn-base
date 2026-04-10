import React, { useState, useEffect } from 'react';
import { Grid, FormControl, Button, FormHelperText, Typography, Link } from '@mui/material';
// import Alert1 from '@mui/material/Alert';
// import Stack from '@mui/material/Stack';
import MainCard from 'ui-component/cards/MainCard';
import StateList from 'components/form_components/StateList';
import DistrictList from 'components/form_components/DistrictList';
import AreaList from 'components/form_components/AreaList';
import SubDistrictList from 'components/form_components/SubDistrictList';
import GramPanchayatList from 'components/form_components/GramPanchayatList';
import messages_en from 'components/common/messages_en.json';
import axiosInstance from 'hooks/useAuthTokenUrl';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import reportcss from 'components/PFMSRegistrationSummary/reportsCSS';
import { useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import Stack from '@mui/material/Stack';

import { /*Table, TableHead, TableRow, TableCell, TableBody   , */ Alert, Snackbar, CircularProgress } from '@mui/material';

const BeneficieryRegistrationReport = () => {
  const [loading, setLoading] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [dataSummary, setDataSummary] = useState([]);
  const [reportSummary, setReportSummary] = useState({});
  const [snackbar, setSnackbar] = useState(null);
  const handleCloseSnackbar = () => setSnackbar(null);
  const classes = reportcss();
  const navigate = useNavigate();

  const cancelValue = () => {
    navigate('/nsap/dashboard/default');
  };
  const [formData, setFormData] = useState({
    stateCode: '',
    districtCode: '',
    areaCode: '',
    subDistrictMunicipalCode: '',
    gramPanchayatWardCode: ''
  });
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
  useEffect(() => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      gramPanchayatWardCode: ''
    }));
  }, [formData.subDistrictMunicipalCode]);

  // const cancelButton = () => {
  //   setFormData((prevFormData) => ({
  //     ...prevFormData,
  //     districtCode: '',
  //     areaCode: '',
  //     subDistrictMunicipalCode: '',
  //     gramPanchayatWardCode: ''
  //   }));
  // };
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
      //   setCountDetailsData([]);
      try {
        const postUrl = '/beneficiaryRegistration/getRegistrationData';
        const response = await axiosInstance.post(postUrl, formData);
        //console.log('response  : ', response.data);
        setReportSummary(response.data);
        const newData = response.data.regData.map((row) => ({ ...row, id: row.locationCode }));
        setDataSummary(newData);
        return response.data;
      } catch (error) {
        console.log('Error  : ', error);
      } finally {
        setLoading(false);
      }
    } else {
      console.log('Form not valid!');
    }
  };

  const handleExportPdf = () => {
    const doc = new jsPDF({ orientation: 'landscape' });
    doc.text('BENEFICIARIES REGISTRATION REPORT', 14, 15);

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
        doc.text(
          `Powered By NSAP-PPS - Delivering Reliable Pension Processing - https://nsap.nic.in/ on - ${generatedDate}`,
          14,
          pageHeight - 10
        );
      }
    });

    doc.save(`Beneficiary_registration_report.pdf`);
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
    {
      field: 'districtName',
      align: 'center',
      headerAlign: 'center',
      headerName: reportSummary.reportLevel === 'D' ? 'District' : reportSummary.reportLevel === 'SD' ? 'Sub District' : 'Gram Panchayat',
      width: 200,
      renderCell: (params) =>
        reportSummary.reportLevel === 'GP' ? (
          params.value
        ) : (
          <Link
            style={{ cursor: 'pointer', color: 'blue', textDecorationColor: 'blue' }}
            onClick={() =>
              reportSummary.reportLevel === 'D'
                ? getReportSummary(params.row.locationCode, '', '')
                : reportSummary.reportLevel === 'SD'
                ? getReportSummary('', params.row.locationCode, '')
                : ''
            }
          >
            {params.value}
          </Link>
        )
    },
    reportSummary.reportLevel === 'SD'
      ? {
          field: 'area',
          align: 'center',
          headerAlign: 'center',
          headerName: 'Area',
          width: 100
        }
      : reportSummary.reportLevel === 'GP'
      ? {
          field: 'area',
          align: 'center',
          headerAlign: 'center',
          headerName: 'Area',
          width: 100
        }
      : null,
    {
      field: 'totalBeneficiery',
      headerName: 'Total Beneficiary',
      flex: 1,
      align: 'right',
      headerAlign: 'center',
      sortable: false
    },

    {
      field: 'notRegistered',
      headerName: 'Not Registered',
      align: 'right',
      headerAlign: 'center',
      sortable: false,
      flex: 1,
      renderCell: (params) => (
        <Link
          color="#1e88e5"
          style={{ cursor: 'pointer', textDecoration: 'none' }}
          title="Download"
          onClick={() =>
            reportSummary.reportLevel === 'D'
              ? downloadDataInExcel('notRegistered', params.row.locationCode, null, null)
              : reportSummary.reportLevel === 'SD'
              ? downloadDataInExcel('notRegistered', null, params.row.locationCode, null)
              : downloadDataInExcel('notRegistered', null, null, params.row.locationCode)
          }
        >
          {params.value}
        </Link>
      )
    },
    {
      field: 'registered',
      headerName: 'Registered',
      align: 'right',
      headerAlign: 'center',
      sortable: false,
      flex: 1,
      renderCell: (params) => (
        <Link
          color="#1e88e5"
          style={{ cursor: 'pointer', textDecoration: 'none' }}
          title="Download"
          onClick={() =>
            reportSummary.reportLevel === 'D'
              ? downloadDataInExcel('REG', params.row.locationCode, null, null)
              : reportSummary.reportLevel === 'SD'
              ? downloadDataInExcel('REG', null, params.row.locationCode, null)
              : downloadDataInExcel('REG', null, null, params.row.locationCode)
          }
        >
          {params.value}
        </Link>
      )
    },
    {
      field: 'elgibleforReregister',
      headerName: 'Eligible for Re-Register',
      align: 'right',
      headerAlign: 'center',
      sortable: false,
      flex: 1,
      renderCell: (params) => (
        <Link
          color="#1e88e5"
          style={{ cursor: 'pointer', textDecoration: 'none' }}
          title="Download"
          onClick={() =>
            reportSummary.reportLevel === 'D'
              ? downloadDataInExcel('ELEGIBLE', params.row.locationCode, null, null)
              : reportSummary.reportLevel === 'SD'
              ? downloadDataInExcel('ELEGIBLE', null, params.row.locationCode, null)
              : downloadDataInExcel('ELEGIBLE', null, null, params.row.locationCode)
          }
        >
          {params.value}
        </Link>
      )
    },
    {
      field: 'statusPensding',
      headerName: 'Status Pending',
      align: 'right',
      headerAlign: 'center',
      sortable: false,
      flex: 1,
      renderCell: (params) => (
        <Link
          color="#1e88e5"
          style={{ cursor: 'pointer', textDecoration: 'none' }}
          title="Download"
          onClick={() =>
            reportSummary.reportLevel === 'D'
              ? downloadDataInExcel('PENDING', params.row.locationCode, null, null)
              : reportSummary.reportLevel === 'SD'
              ? downloadDataInExcel('PENDING', null, params.row.locationCode, null)
              : downloadDataInExcel('PENDING', null, null, params.row.locationCode)
          }
        >
          {params.value}
        </Link>
      )
    }
  ].filter(Boolean);
  useEffect(() => {
    // console.log(reportSummary);
  }, [dataSummary, reportSummary]);
  const getReportSummary = async (districtCode, subDistrictCode, gpCode) => {
    const body = {
      stateCode: formData.stateCode,
      districtCode: districtCode,
      areaCode: formData.areaCode,
      subDistrictMunicipalCode: subDistrictCode,
      gramPanchayatWardCode: gpCode
    };
    // console.log(JSON.stringify(body));
    try {
      setLoading(true);
      const response = await axiosInstance.post('/beneficiaryRegistration/getRegistrationData', body);
      setReportSummary(response.data);
      const newData = response.data.regData.map((row) => ({ ...row, id: row.locationCode }));
      setDataSummary(newData);
    } catch (error) {
      setSnackbar({ children: 'Some Internal Error Occured While Getting Summary', severity: 'error' });
      console.error('Error fetching generated Summary', error);
    } finally {
      setLoading(false);
    }
  };

  const downloadDataInExcel = async (type, districtCode, subDistrictCode, gpCode) => {
    // const body = { regType: type, districtCode: districtCode, subDistrictMunicipalAreaCode: subDistrictCode, gramPanchayatCode: gpCode };
    const body = {
      regType: type,
      stateCode: formData.stateCode,
      districtCode: districtCode,
      areaCode: formData.areaCode,
      subDistrictMunicipalCode: subDistrictCode,
      gramPanchayatWardCode: gpCode
    };
    try {
      setLoading(true);
      const response = await axiosInstance.post('/beneficiaryRegistration/getBenRegistrationInExcel', body, {
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
      link.download = `Beneficiary_${type != null ? type : 'not_registered'}_data.xlsx`;
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
      {!!snackbar && (
        <Snackbar open anchorOrigin={{ vertical: 'top', horizontal: 'center' }} onClose={handleCloseSnackbar} autoHideDuration={6000}>
          <Alert {...snackbar} onClose={handleCloseSnackbar} />
        </Snackbar>
      )}
      <MainCard title="BENEFICIARIES REGISTRATION REPORT">
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
            <Button type="submit" variant="contained" color="secondary" onClick={handleSubmit}>
              SUBMIT
            </Button>
            &nbsp; &nbsp; &nbsp;
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                cancelValue();
              }}
              title="Cancel"
            >
              Cancel
            </Button>
          </Grid>
        </Grid>
      </MainCard>
      {dataSummary.length > 0 && (
        <MainCard title="Beneficiery Registration Report">
          {/* <Stack sx={{ width: '100%' }} spacing={2}>
        <Alert1 variant="filled" severity="warning" style={{ color: 'red' }}>Note: This report includes <b style={{ color: 'blue' }}>SO_SAVED and DONE</b> beneficiary data only.</Alert1>
    </Stack> */}

          <div style={{ height: 600, width: '100%', marginTop: '20px' }} className={classes.root}>
            <DataGrid
              slots={{
                toolbar: (props) => <CustomToolbarWithExportButton {...props} handleExportPdf={handleExportPdf} />
              }}
              slotProps={{
                toolbar: {
                  showQuickFilter: true,
                  printOptions: { disableToolbarButton: true }
                }
              }}
              rows={dataSummary}
              columns={columnsReport}
              stickyFooter
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
                onClick={() => getReportSummary('', '', '')}
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
                  getReportSummary(dataSummary[0].locationCode.substring(0, 4), [2, 3].includes(reportSummary.loginLevel) ? '' : '', '')
                }
              >
                {' '}
                Back{' '}
              </Button>
            )}
          </div>
        </MainCard>
      )}
    </div>
  );
};
export default BeneficieryRegistrationReport;
