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
  Link,
  FormHelperText,
  Typography
} from '@mui/material';
import MainCard from 'ui-component/cards/MainCard';
import StateList from 'components/form_components/StateList';
import DistrictList from 'components/form_components/DistrictList';
import SubDistrictList from 'components/form_components/SubDistrictList';
import AreaList from 'components/form_components/AreaList';
import axiosInstance from 'hooks/useAuthTokenUrl';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import reportcss from 'components/PFMSRegistrationSummary/reportsCSS';
import { useNavigate } from 'react-router-dom';
import messages_en from 'components/common/messages_en.json';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import Stack from '@mui/material/Stack';

function DiscontinueReport() {
  const [snackbar, setSnackbar] = React.useState(null);
  const handleCloseSnackbar = () => setSnackbar(null);
  const [loading, setLoading] = useState(false);
  const [selectedDistrictId, setSelectedDistrict] = useState(null);
  const [selectedAreaId, setSelectedArea] = useState(null);
  const [selectedSubDistrictId, setSelectedSubDistrict] = useState(null);
  const [selectedStateId, setSelectedState] = useState('');
  const [finYear, setFinYear] = useState([]);
  const [selectedFinYear, setSelectedFinYear] = useState(null);
  const [discontinueData, setDiscontinueData] = useState({});
  const [stausType, setStausType] = useState(null);
  const [dataSummary, setDataSummary] = useState([]);
  const classes = reportcss();
  const [formErrors, setFormErrors] = useState({});

  const navigate = useNavigate();

  const cancelValue = () => {
    navigate('/nsap/dashboard/default');
  };
  const getFinYear = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/migrationLog/findAllFinYearData');
      // console.log(JSON.stringify(response.data));
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

  const handleStatus = (e) => {
    setDataSummary([]);
    setStausType(e.target.value);
    setFormErrors((prevErrors) => {
      const updatedErrors = { ...prevErrors };
      delete updatedErrors.status;
      return updatedErrors;
    });
  };
  const handleFinYearChange = (event) => {
    setDataSummary([]);
    if (event.target.value !== 0) {
      setSelectedFinYear(event.target.value);
      setFormErrors((prevErrors) => {
        const updatedErrors = { ...prevErrors };
        delete updatedErrors.yearCode;
        return updatedErrors;
      });
    } else {
      setSelectedFinYear(null);
    }
  };
  const handleSelectState = (state) => {
    setSelectedState(state);
    setFormErrors((prevErrors) => {
      const updatedErrors = { ...prevErrors };
      delete updatedErrors.stateCode;
      return updatedErrors;
    });
  };

  const handleSelectDistrict = (selectedDistrictId) => {
    setDataSummary([]);
    setSelectedDistrict(selectedDistrictId);
    setSelectedArea(null);
    setSelectedSubDistrict(null);
  };

  const handleSelectArea = (selectedAreaId) => {
    setSelectedArea(selectedAreaId);
    setSelectedSubDistrict(null);
    setDataSummary([]);
  };

  const handleSelectSubDistrict = (selectedSubDistrictId) => {
    setSelectedSubDistrict(selectedSubDistrictId);
    setDataSummary([]);
  };
  const validateForm = () => {
    const errors = {};
    // Add validation logic for each field
    if (!selectedStateId) {
      errors.stateCode = messages_en.stateRequired;
    }

    if (!selectedFinYear) {
      errors.yearCode = messages_en.yearFeildRequired;
    }

    if (!stausType) {
      errors.status = messages_en.DiscontinueStatus;
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0; // Return true if no errors
  };
  const fetchData = async () => {
    const isFormValid = validateForm();
    if (isFormValid) {
      if (selectedFinYear === null || selectedFinYear === '' || stausType === null || stausType === '') {
        alert('Finencial Year and Status are mandatory.');
      } else {
        try {
          var location = {
            stateID: selectedStateId,
            districtID: selectedDistrictId,
            area: selectedAreaId,
            subDistID: selectedSubDistrictId,
            finyr: selectedFinYear,
            status: stausType
          };
          var body = { ...location };
          const getUrl = `/discontinueReport/showDiscontinueDetails`;
          setLoading(true);
          const response = await axiosInstance.post(getUrl, JSON.stringify(body));
          if (response.status >= 200 && response.status < 300) {
            return response.data;
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
    }
  };
  const handleClickOpen = (e) => {
    e.preventDefault();
    fetchData()
      .then((res) => {
        if (res) {
          const data = res || [];
          //   setAllDistrict(districtData);
          setDiscontinueData(data);
          const newData = data.disData.map((row) => ({ ...row, id: row.districtCode }));
          if (newData.length <= 1) {
            setDataSummary([]);
            setSnackbar({ children: 'No Data Found', severity: 'error' });
          } else {
            setDataSummary(newData);
          }
          // setDataSummary(newData);
          console.log(discontinueData);
          console.log(res);
        } else {
          setDiscontinueData({});
          return false;
        }
      })
      .catch((e) => {
        console.log(e.message);
      });
  };
  useEffect(() => {
    console.log(discontinueData.reportLevel);
  }, [dataSummary, discontinueData]);

  const handleExportPdf = () => {
    const doc = new jsPDF({ orientation: 'landscape' });
    doc.text('Discontinue/Appealed/Rejected Report', 14, 15);

    const headers = columnsReport.filter((col) => col.field && col.headerName).map((col) => col.headerName);
    const tableData = dataSummary.map((row) =>
      columnsReport.filter((col) => col.field && col.headerName).map((col) => row[col.field] ?? '')
    );

    // const tableData = Object.entries(dataSummary)
    //   .filter(([key]) => key !== 'stCode' && key !== 'statusMaster') // ignore statusMaster if present
    //   .map(([key, value]) => [key.toUpperCase(), value]);

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

    doc.save(`Discountinue_Report_${selectedFinYear}.pdf`);
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
      field: 'sno',
      headerName: 'S. No.',
      flex: 1,
      align: 'right',
      headerAlign: 'center',
      sortable: false
    },
    {
      field: 'districtName',
      align: 'center',
      headerAlign: 'center',
      headerName:
        discontinueData.reportLevel === 'D' ? 'District' : discontinueData.reportLevel === 'SD' ? 'Sub District' : 'Gram Panchayat',
      width: 200,
      renderCell: (params) =>
        params.row.districtCode === 'GRAND TOTAL' ? (
          params.value
        ) : discontinueData.reportLevel === 'GP' ? (
          params.value
        ) : (
          <Link
            style={{ cursor: 'pointer', color: 'blue', textDecorationColor: 'blue' }}
            onClick={() =>
              discontinueData.reportLevel === 'D'
                ? getReportSummary(params.row.locationCode, null, null)
                : discontinueData.reportLevel === 'SD'
                ? getReportSummary(null, params.row.locationCode, null)
                : ''
            }
          >
            {params.value}
          </Link>
        )
    },
    discontinueData.reportLevel === 'SD'
      ? {
          field: 'area',
          align: 'center',
          headerAlign: 'center',
          headerName: 'Area',
          width: 100
        }
      : discontinueData.reportLevel === 'GP'
      ? {
          field: 'area',
          align: 'center',
          headerAlign: 'center',
          headerName: 'Area',
          width: 100
        }
      : null,
    {
      field: 'apr',
      headerName: 'Apr',
      flex: 1,
      align: 'right',
      headerAlign: 'center',
      sortable: false,
      renderCell: (params) =>
        params.row.districtCode === 'GRAND TOTAL' ? (
          params.value
        ) : params.row.apr === '0' ? (
          params.value
        ) : (
          <Link
            color="#1e88e5"
            style={{ cursor: 'pointer', textDecoration: 'none' }}
            title="Download"
            onClick={() =>
              discontinueData.reportLevel === 'D'
                ? downloadDataInExcel('4', params.row.locationCode, null, null, null)
                : discontinueData.reportLevel === 'SD'
                ? downloadDataInExcel('4', null, params.row.locationCode, null, params.row.area)
                : downloadDataInExcel('4', null, null, params.row.locationCode, params.row.area)
            }
          >
            {params.value}
          </Link>
        )
    },
    {
      field: 'may',
      headerName: 'May',
      flex: 1,
      align: 'right',
      headerAlign: 'center',
      sortable: false,
      renderCell: (params) =>
        params.row.districtCode === 'GRAND TOTAL' ? (
          params.value
        ) : params.row.may === '0' ? (
          params.value
        ) : (
          <Link
            color="#1e88e5"
            style={{ cursor: 'pointer', textDecoration: 'none' }}
            title="Download"
            onClick={() =>
              discontinueData.reportLevel === 'D'
                ? downloadDataInExcel('5', params.row.locationCode, null, null, null)
                : discontinueData.reportLevel === 'SD'
                ? downloadDataInExcel('5', null, params.row.locationCode, null, params.row.area)
                : downloadDataInExcel('5', null, null, params.row.locationCode, params.row.area)
            }
          >
            {params.value}
          </Link>
        )
    },
    {
      field: 'june',
      headerName: 'June',
      flex: 1,
      align: 'right',
      headerAlign: 'center',
      sortable: false,
      renderCell: (params) =>
        params.row.districtCode === 'GRAND TOTAL' ? (
          params.value
        ) : params.row.june === '0' ? (
          params.value
        ) : (
          <Link
            color="#1e88e5"
            style={{ cursor: 'pointer', textDecoration: 'none' }}
            title="Download"
            onClick={() =>
              discontinueData.reportLevel === 'D'
                ? downloadDataInExcel('6', params.row.locationCode, null, null, null)
                : discontinueData.reportLevel === 'SD'
                ? downloadDataInExcel('6', null, params.row.locationCode, null, params.row.area)
                : downloadDataInExcel('6', null, null, params.row.locationCode, params.row.area)
            }
          >
            {params.value}
          </Link>
        )
    },
    {
      field: 'july',
      headerName: 'July',
      flex: 1,
      align: 'right',
      headerAlign: 'center',
      sortable: false,
      renderCell: (params) =>
        params.row.districtCode === 'GRAND TOTAL' ? (
          params.value
        ) : params.row.july === '0' ? (
          params.value
        ) : (
          <Link
            color="#1e88e5"
            style={{ cursor: 'pointer', textDecoration: 'none' }}
            title="Download"
            onClick={() =>
              discontinueData.reportLevel === 'D'
                ? downloadDataInExcel('7', params.row.locationCode, null, null, null)
                : discontinueData.reportLevel === 'SD'
                ? downloadDataInExcel('7', null, params.row.locationCode, null, params.row.area)
                : downloadDataInExcel('7', null, null, params.row.locationCode, params.row.area)
            }
          >
            {params.value}
          </Link>
        )
    },
    {
      field: 'aug',
      headerName: 'Aug',
      flex: 1,
      align: 'right',
      headerAlign: 'center',
      sortable: false,
      renderCell: (params) =>
        params.row.districtCode === 'GRAND TOTAL' ? (
          params.value
        ) : params.row.aug === '0' ? (
          params.value
        ) : (
          <Link
            color="#1e88e5"
            style={{ cursor: 'pointer', textDecoration: 'none' }}
            title="Download"
            onClick={() =>
              discontinueData.reportLevel === 'D'
                ? downloadDataInExcel('8', params.row.locationCode, null, null, null)
                : discontinueData.reportLevel === 'SD'
                ? downloadDataInExcel('8', null, params.row.locationCode, null, params.row.area)
                : downloadDataInExcel('8', null, null, params.row.locationCode, params.row.area)
            }
          >
            {params.value}
          </Link>
        )
    },
    {
      field: 'sep',
      headerName: 'Sep',
      flex: 1,
      align: 'right',
      headerAlign: 'center',
      sortable: false,
      renderCell: (params) =>
        params.row.districtCode === 'GRAND TOTAL' ? (
          params.value
        ) : params.row.sep === '0' ? (
          params.value
        ) : (
          <Link
            color="#1e88e5"
            style={{ cursor: 'pointer', textDecoration: 'none' }}
            title="Download"
            onClick={() =>
              discontinueData.reportLevel === 'D'
                ? downloadDataInExcel('9', params.row.locationCode, null, null, null)
                : discontinueData.reportLevel === 'SD'
                ? downloadDataInExcel('9', null, params.row.locationCode, null, params.row.area)
                : downloadDataInExcel('9', null, null, params.row.locationCode, params.row.area)
            }
          >
            {params.value}
          </Link>
        )
    },
    {
      field: 'oct',
      headerName: 'Oct',
      flex: 1,
      align: 'right',
      headerAlign: 'center',
      sortable: false,
      renderCell: (params) =>
        params.row.districtCode === 'GRAND TOTAL' ? (
          params.value
        ) : params.row.oct === '0' ? (
          params.value
        ) : (
          <Link
            color="#1e88e5"
            style={{ cursor: 'pointer', textDecoration: 'none' }}
            title="Download"
            onClick={() =>
              discontinueData.reportLevel === 'D'
                ? downloadDataInExcel('10', params.row.locationCode, null, null, null)
                : discontinueData.reportLevel === 'SD'
                ? downloadDataInExcel('10', null, params.row.locationCode, null, params.row.area)
                : downloadDataInExcel('10', null, null, params.row.locationCode, params.row.area)
            }
          >
            {params.value}
          </Link>
        )
    },
    {
      field: 'nov',
      headerName: 'Nov',
      flex: 1,
      align: 'right',
      headerAlign: 'center',
      sortable: false,
      renderCell: (params) =>
        params.row.districtCode === 'GRAND TOTAL' ? (
          params.value
        ) : params.row.nov === '0' ? (
          params.value
        ) : (
          <Link
            color="#1e88e5"
            style={{ cursor: 'pointer', textDecoration: 'none' }}
            title="Download"
            onClick={() =>
              discontinueData.reportLevel === 'D'
                ? downloadDataInExcel('11', params.row.locationCode, null, null, null)
                : discontinueData.reportLevel === 'SD'
                ? downloadDataInExcel('11', null, params.row.locationCode, null, params.row.area)
                : downloadDataInExcel('11', null, null, params.row.locationCode, params.row.area)
            }
          >
            {params.value}
          </Link>
        )
    },
    {
      field: 'dec',
      headerName: 'Dec',
      flex: 1,
      align: 'right',
      headerAlign: 'center',
      sortable: false,
      renderCell: (params) =>
        params.row.districtCode === 'GRAND TOTAL' ? (
          params.value
        ) : params.row.dec === '0' ? (
          params.value
        ) : (
          <Link
            color="#1e88e5"
            style={{ cursor: 'pointer', textDecoration: 'none' }}
            title="Download"
            onClick={() =>
              discontinueData.reportLevel === 'D'
                ? downloadDataInExcel('12', params.row.locationCode, null, null, null)
                : discontinueData.reportLevel === 'SD'
                ? downloadDataInExcel('12', null, params.row.locationCode, null, params.row.area)
                : downloadDataInExcel('12', null, null, params.row.locationCode, params.row.area)
            }
          >
            {params.value}
          </Link>
        )
    },

    {
      field: 'jan',
      headerName: 'Jan',
      flex: 1,
      align: 'right',
      headerAlign: 'center',
      sortable: false,
      renderCell: (params) =>
        params.row.districtCode === 'GRAND TOTAL' ? (
          params.value
        ) : params.row.jan === '0' ? (
          params.value
        ) : (
          <Link
            color="#1e88e5"
            style={{ cursor: 'pointer', textDecoration: 'none' }}
            title="Download"
            onClick={() =>
              discontinueData.reportLevel === 'D'
                ? downloadDataInExcel('1', params.row.locationCode, null, null, null)
                : discontinueData.reportLevel === 'SD'
                ? downloadDataInExcel('1', null, params.row.locationCode, null, params.row.area)
                : downloadDataInExcel('1', null, null, params.row.locationCode, params.row.area)
            }
          >
            {params.value}
          </Link>
        )
    },
    {
      field: 'feb',
      headerName: 'Feb',
      flex: 1,
      align: 'right',
      headerAlign: 'center',
      sortable: false,
      renderCell: (params) =>
        params.row.districtCode === 'GRAND TOTAL' ? (
          params.value
        ) : params.row.feb === '0' ? (
          params.value
        ) : (
          <Link
            color="#1e88e5"
            style={{ cursor: 'pointer', textDecoration: 'none' }}
            title="Download"
            onClick={() =>
              discontinueData.reportLevel === 'D'
                ? downloadDataInExcel('2', params.row.locationCode, null, null, null)
                : discontinueData.reportLevel === 'SD'
                ? downloadDataInExcel('2', null, params.row.locationCode, null, params.row.area)
                : downloadDataInExcel('2', null, null, params.row.locationCode, params.row.area)
            }
          >
            {params.value}
          </Link>
        )
    },
    {
      field: 'march',
      headerName: 'Mar',
      flex: 1,
      align: 'right',
      headerAlign: 'center',
      sortable: false,
      renderCell: (params) =>
        params.row.districtCode === 'GRAND TOTAL' ? (
          params.value
        ) : params.row.march === '0' ? (
          params.value
        ) : (
          <Link
            color="#1e88e5"
            style={{ cursor: 'pointer', textDecoration: 'none' }}
            title="Download"
            onClick={() =>
              discontinueData.reportLevel === 'D'
                ? downloadDataInExcel('3', params.row.locationCode, null, null, null)
                : discontinueData.reportLevel === 'SD'
                ? downloadDataInExcel('3', null, params.row.locationCode, null, params.row.area)
                : downloadDataInExcel('3', null, null, params.row.locationCode, params.row.area)
            }
          >
            {params.value}
          </Link>
        )
    },

    {
      field: 'total',
      headerName: 'Total',
      flex: 1,
      align: 'right',
      headerAlign: 'center',
      sortable: false,
      renderCell: (params) =>
        params.row.districtCode === 'GRAND TOTAL' ? (
          params.value
        ) : params.row.total === '0' ? (
          params.value
        ) : (
          <Link
            color="#1e88e5"
            style={{ cursor: 'pointer', textDecoration: 'none' }}
            title="Download"
            onClick={() =>
              discontinueData.reportLevel === 'D'
                ? downloadDataInExcel('All', params.row.locationCode, null, null, null)
                : discontinueData.reportLevel === 'SD'
                ? downloadDataInExcel('All', null, params.row.locationCode, null, params.row.area)
                : downloadDataInExcel('All', null, null, params.row.locationCode, params.row.area)
            }
          >
            {params.value}
          </Link>
        )
    }
  ].filter(Boolean);

  const getReportSummary = async (districtCode, subDistrictCode, gpCode) => {
    console.log(gpCode);
    if (selectedFinYear === null || selectedFinYear === '' || stausType === null || stausType === '') {
      alert('Finencial Year and Status are mandatory.');
    } else {
      var location = {
        stateID: selectedStateId,
        districtID: districtCode,
        area: selectedAreaId,
        subDistID: subDistrictCode,
        finyr: selectedFinYear,
        status: stausType
      };
      var body = { ...location };
      // const body = {stateCode:selectedStateId, districtCode: districtCode,areaCode:formData.areaCode, subDistrictMunicipalCode: subDistrictCode, gramPanchayatWardCode: gpCode };
      // console.log(JSON.stringify(body));
      try {
        setLoading(true);
        const response = await axiosInstance.post('/discontinueReport/showDiscontinueDetails', body);
        setDiscontinueData(response.data);
        // console.log(response);
        const newData = response.data.disData.map((row) => ({ ...row, id: row.districtCode }));
        if (newData.length <= 1) {
          setDataSummary([]);
          setSnackbar({ children: 'No Data Found', severity: 'error' });
        } else {
          setDataSummary(newData);
        }
      } catch (error) {
        setSnackbar({ children: 'Some Internal Error Occured While Getting Summary', severity: 'error' });
        console.error('Error fetching generated Summary', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const downloadDataInExcel = async (type, districtCode, subDistrictCode, gpCode, area) => {
    const body = {
      month: type,
      stateID: selectedStateId,
      districtID: districtCode,
      area: area,
      subDistID: subDistrictCode,
      gpCode: gpCode,
      finyr: selectedFinYear,
      status: stausType
    };
    try {
      setLoading(true);
      const response = await axiosInstance.post('/discontinueReport/getDisconDataInExcel', body, {
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
      link.download = `Beneficiary_Discontinue_data.xlsx`;
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
      <MainCard title="Discontinue/Appealed/Rejected Report">
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
            <Grid item xs={12} sm={3}>
              <FormControl fullWidth>
                <StateList onSelectState={handleSelectState} isMendatory={true} />
                {formErrors.stateCode && (
                  <FormHelperText>
                    <Typography style={{ color: 'red', fontSize: '0.8rem' }}>{formErrors.stateCode}</Typography>
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={3}>
              <FormControl fullWidth>
                <DistrictList
                  selectedStateId={selectedStateId}
                  setSelectedDistrict={setSelectedDistrict}
                  onSelectDistrict={handleSelectDistrict}
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={3}>
              <FormControl fullWidth>
                <AreaList selectedDistrictId={selectedDistrictId} selectedArea={selectedAreaId} onSelectArea={handleSelectArea} />
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={3}>
              <FormControl fullWidth>
                <SubDistrictList
                  selectedAreaId={selectedAreaId}
                  selectedDistrictId={selectedDistrictId}
                  setSelectedSubDistrict={setSelectedSubDistrict}
                  onSelectSubDistrict={handleSelectSubDistrict}
                />
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={3}>
              <FormControl fullWidth>
                <InputLabel id="finYear-label" style={{ display: 'flex', alignItems: 'center' }}>
                  Financial Year <span style={{ color: 'red' }}> *</span>
                </InputLabel>
                <Select
                  name="finYear"
                  id="finYear"
                  labelId="finYear-label"
                  label="Financial Year"
                  onChange={handleFinYearChange}
                  MenuProps={{ PaperProps: { style: { maxHeight: 200 } } }}
                >
                  {/* <MenuItem value="0">--Select Financial Year--</MenuItem> */}
                  {finYear.map((item) => (
                    <MenuItem key={item.finyearcode} value={item.finyear}>
                      {item.finyear}
                    </MenuItem>
                  ))}
                </Select>
                {formErrors.yearCode && (
                  <FormHelperText>
                    <Typography style={{ color: 'red', fontSize: '0.8rem' }}>{formErrors.yearCode}</Typography>
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={3}>
              <FormControl fullWidth>
                <InputLabel id="status-label" style={{ display: 'flex', alignItems: 'center' }}>
                  Status <span style={{ color: 'red' }}> *</span>
                </InputLabel>
                <Select name="status" onChange={handleStatus} label="Status" value={stausType}>
                  <MenuItem value="DISCONTINUED">Discontinued</MenuItem>
                  <MenuItem value="APPEALED">Appealed</MenuItem>
                  <MenuItem value="REJECTED">Rejected</MenuItem>
                </Select>
                {formErrors.status && (
                  <FormHelperText>
                    <Typography style={{ color: 'red', fontSize: '0.8rem' }}>{formErrors.status}</Typography>
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12} alignItems="center">
              <Button type="submit" variant="contained" color="secondary" title="Submit">
                Submit
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
        </form>
      </MainCard>
      {dataSummary.length > 1 && (
        <MainCard title="Discontinue/Appealed/Rejected Report">
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
                  showQuickFilter: true
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
            {discontinueData.reportLevel == 'SD' && [2, 3].includes(discontinueData.loginLevel) && (
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
            {discontinueData.reportLevel == 'GP' && (
              <Button
                type="button"
                variant="contained"
                color="error"
                style={{ marginLeft: '10px' }}
                title="Back"
                onClick={() =>
                  getReportSummary(
                    dataSummary[0].districtCode.substring(0, 4),
                    [2, 3].includes(discontinueData.loginLevel) ? null : null,
                    null
                  )
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
}

export default DiscontinueReport;
