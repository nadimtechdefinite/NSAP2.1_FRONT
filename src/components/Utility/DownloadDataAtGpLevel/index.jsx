import React, { useState, useEffect } from 'react';
import MainCard from 'ui-component/cards/MainCard';
import { Grid, FormControl, FormHelperText, Typography, Button, Snackbar, Alert } from '@mui/material';
import StateList from 'components/form_components/StateList';
import DistrictList from 'components/form_components/DistrictList';
import AreaList from 'components/form_components/AreaList';
import SubDistrictList from 'components/form_components/SubDistrictList';
import GramPanchayatList from 'components/form_components/GramPanchayatList';
import messages_en from 'components/common/messages_en.json';
import axiosInstance from 'hooks/useAuthTokenUrl';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import reportcss from 'components/reports/STCReport/reportCSS';
import CircularProgress from '@mui/material/CircularProgress';

const DownloadDataAtGpLevel = () => {
  const [formErrors, setFormErrors] = useState({});
  const [formData, setFormData] = useState({
    stateCode: '',
    districtCode: '',
    areaCode: '',
    subDistrictMunicipalCode: '',
    gramPanchayatWardCode: ''
  });
  const [isSearchClicked, setIsSearchClicked] = useState(false);
  const [dataSummary, setDataSummary] = useState([]);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState(null);
  const handleCloseSnackbar = () => setSnackbar(null);

  const classes = reportcss();

  const CustomToolbar = (props) => {
    return (
      <div>
        <GridToolbar {...props} />
        <div style={{ borderBottom: '1px solid #ccc', marginTop: '8px' }}></div>
      </div>
    );
  };

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

  const validateForm = () => {
    const errors = {};
    if (!formData.stateCode) {
      errors.stateCode = messages_en.stateRequired;
    }
    if (!formData.districtCode) {
      errors.districtCode = messages_en.districtRequired;
    }
    if (!formData.areaCode) {
      errors.areaCode = messages_en.areaRequired;
    }
    if (!formData.subDistrictMunicipalCode) {
      errors.subDistrictMunicipalCode = messages_en.subDistrictRequired;
    }

    if (!formData.gramPanchayatWardCode) {
      errors.gramPanchayatWardCode = messages_en.gramPanchayatRequired;
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0; // Return true if no errors
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const isFormValid = validateForm();
    if (isFormValid) {
      console.log('Form  valid!');
      console.log('Form Data : ', formData);
      setLoading(true);

      try {
        const requestBody = {
          districtCode: formData.districtCode,
          area: formData.areaCode,
          subDistrictMunicipalCode: formData.subDistrictMunicipalCode,
          gramPanchayatWardCode: formData.gramPanchayatWardCode
        };

        const response = await axiosInstance.post('utility/getGpDataRecords', JSON.stringify(requestBody));

        console.log(response.data);
        const dataWithIds = response.data.map((item, index) => ({ id: index + 1, ...item }));

        setDataSummary(dataWithIds);

        setIsSearchClicked(true);
      } catch (error) {
        console.error('Error fetching center list:', error);
        setSnackbar({ children: 'Some Internal Error Occurred While Getting Summary', severity: 'error' });
      } finally {
        setLoading(false);
      }
    } else {
      console.log('Form not valid!');
    }
  };

  const cancelButton = () => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      districtCode: '',
      areaCode: '',
      subDistrictMunicipalCode: '',
      gramPanchayatWardCode: ''
    }));
    setIsSearchClicked(false);
  };

  const columnsReport = [
    { field: 'id', headerName: <div style={{ whiteSpace: 'normal', lineHeight: '1.2' }}>SNo.</div>, width: 10 },
    {
      field: 'schemeCode',
      headerName: <div style={{ whiteSpace: 'normal', lineHeight: '1.2' }}>Scheme Name</div>,
      align: 'left',
      headerAlign: 'center',
      width: 90
    },
    {
      field: 'stateCode',
      headerName: <div style={{ whiteSpace: 'normal', lineHeight: '1.2' }}>State Name</div>,
      align: 'left',
      headerAlign: 'center',
      width: 150
    },
    {
      field: 'districtCode',
      headerName: <div style={{ whiteSpace: 'normal', lineHeight: '1.2' }}>District Name</div>,
      align: 'left',
      headerAlign: 'center',
      width: 100
    },
    {
      field: 'area',
      headerName: <div style={{ whiteSpace: 'normal', lineHeight: '1.2' }}>Rural/ Urban</div>,
      align: 'left',
      headerAlign: 'center',
      width: 60
    },
    {
      field: 'subDistrictMunicipalCode',
      headerName: <div style={{ whiteSpace: 'normal', lineHeight: '.90' }}>Block/ Subdistrict Name</div>,
      align: 'left',
      headerAlign: 'center',
      width: 100
    },
    {
      field: 'gramPanchayatWardCode',
      headerName: <div style={{ whiteSpace: 'normal', lineHeight: '1.2' }}>Gram Panchayat Name</div>,
      align: 'left',
      headerAlign: 'center',
      width: 130
    },
    {
      field: 'applicantName',
      headerName: <div style={{ whiteSpace: 'normal', lineHeight: '1.2' }}>Beneficiary Name</div>,
      align: 'left',
      headerAlign: 'center',
      width: 130
    },
    {
      field: 'fatherHusbandName',
      headerName: <div style={{ whiteSpace: 'normal', lineHeight: '1.2' }}>Father/ Husband Name</div>,
      align: 'left',
      headerAlign: 'center',
      width: 120
    },
    {
      field: 'age',
      headerName: <div style={{ whiteSpace: 'normal', lineHeight: '1.2' }}>Age</div>,
      align: 'left',
      headerAlign: 'center',
      width: 50
    },
    {
      field: 'dateOfBirth',
      headerName: <div style={{ whiteSpace: 'normal', lineHeight: '1.2' }}>DOB</div>,
      align: 'left',
      headerAlign: 'center',
      width: 80
    },
    {
      field: 'gender',
      headerName: <div style={{ whiteSpace: 'normal', lineHeight: '1.2' }}>Gender</div>,
      align: 'left',
      headerAlign: 'center',
      width: 60
    },
    {
      field: 'categoryName',
      headerName: <div style={{ whiteSpace: 'normal', lineHeight: '1.2' }}>Category</div>,
      align: 'left',
      headerAlign: 'center',
      width: 70
    },
    {
      field: 'modeOfPayment',
      headerName: <div style={{ whiteSpace: 'normal', lineHeight: '1.2' }}>Payment Mode</div>,
      align: 'left',
      headerAlign: 'center',
      width: 100
    },
    {
      field: 'sanctionOrderNo',
      headerName: <div style={{ whiteSpace: 'normal', lineHeight: '1.2' }}>Sanction Order No</div>,
      align: 'left',
      headerAlign: 'center',
      width: 120
    }
  ].filter(Boolean);

  // Determine if the "Village Name" column should be included
  const shouldShowVillageColumn = dataSummary.some((row) => row.area === 'R');

  if (shouldShowVillageColumn) {
    columnsReport.splice(7, 0, {
      field: 'villageName',
      headerName: <div style={{ whiteSpace: 'normal', lineHeight: '1.2' }}>Village Name</div>,
      align: 'left',
      headerAlign: 'center',
      width: 130
    });
  }

  async function fetchPdfData() {
    try {
      const postUrl = `/utility/downloadPdf`;
      var location = {
        districtCode: formData.districtCode,
        area: formData.areaCode,
        subDistrictMunicipalCode: formData.subDistrictMunicipalCode,
        gramPanchayatWardCode: formData.gramPanchayatWardCode
      };
      const response = await axiosInstance.post(postUrl, JSON.stringify(location), { responseType: 'blob' });
      const responseForGPName = await axiosInstance.get(
        `/approve-mark-nsap-beneficiary/getGramPanchayat/${formData.gramPanchayatWardCode}`
      );
      if (response.data) {
        const pdfBlob = new Blob([response.data], { type: 'application/pdf' });
        // Create a link element and trigger a download
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(pdfBlob);
        link.download = 'GRAMPANCHAYAT_WARD_' + responseForGPName.data + '.pdf';
        link.click();
      }
    } catch (e) {
      console.log('error: ', e);
    }
  }

  const handleClickPdfDownLoad = (e) => {
    e.preventDefault();
    fetchPdfData();
  };

  useEffect(() => {
    if (isSearchClicked && dataSummary.length === 0) {
      setSnackbar({ children: 'No data available to display.', severity: 'info' });
    }
  }, [isSearchClicked, dataSummary.length]);

  return (
    <>
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
      <MainCard>
        <h3 style={{ fontSize: '2rem', color: 'black', fontWeight: 'normal' }}>Download Data at Gram Panchayat Level</h3>
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
                isMendatory={true}
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
              <AreaList onSelectArea={handleAreaChange} selectedArea={formData.areaCode} isMendatory={true} />
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
                isMendatory={true}
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
                isMendatory={true}
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
      {isSearchClicked && dataSummary.length > 0 && (
        <div style={{ marginTop: '20px' }}>
          <MainCard>
            <div className={classes.root}>
              <DataGrid
                slots={{ toolbar: CustomToolbar }}
                slotProps={{
                  toolbar: {
                    showQuickFilter: true,
                    printOptions: { disableToolbarButton: true },
                    csvOptions: { disableToolbarButton: true }
                  }
                }}
                rows={dataSummary}
                columns={columnsReport}
                stickyFooter
                hideFooterPagination
                disableRowSelectionOnClick
                density="compact"
                headerClassName="custom-header"
                getRowClassName={(params) => (params.index % 2 === 0 ? 'white-row' : 'grey-row')}
              />
            </div>
            <Grid item container justifyContent="center" style={{ marginTop: '20px' }}>
              <Button type="button" variant="contained" color="secondary" onClick={handleClickPdfDownLoad}>
                DOWNLOAD PDF
              </Button>
            </Grid>
          </MainCard>
        </div>
      )}
    </>
  );
};
export default DownloadDataAtGpLevel;
