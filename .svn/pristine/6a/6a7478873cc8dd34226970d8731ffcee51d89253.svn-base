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
  Typography,
  Box
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

function DiscontinueReasonReport() {
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
  const [stausDesc, setstausDesc] = useState([]);
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

      const newData = response.data.map((row) => ({ ...row, id: row.finYearCode }));
      setFinYear(newData);
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

  const handleFinYearChange = (event) => {
    setDiscontinueData({});
    if (event.target.value !== 0) {
      setSelectedFinYear(event.target.value);
      setFormErrors((prevErrors) => {
        const updatedErrors = { ...prevErrors };
        delete updatedErrors.yearCode;
        return updatedErrors;
      });
    } else {
      setSelectedFinYear([]);
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
    setDiscontinueData({});
    setSelectedDistrict(selectedDistrictId);
    setSelectedArea(null);
    setSelectedSubDistrict(null);
  };

  const handleSelectArea = (selectedAreaId) => {
    setSelectedArea(selectedAreaId);
    setSelectedSubDistrict(null);
    setDiscontinueData({});
  };

  const handleSelectSubDistrict = (selectedSubDistrictId) => {
    setSelectedSubDistrict(selectedSubDistrictId);
    setDiscontinueData({});
  };
  const validateForm = () => {
    const errors = {};

    if (!selectedStateId) {
      errors.stateCode = messages_en.stateRequired;
    }

    if (!selectedFinYear) {
      errors.yearCode = messages_en.yearFeildRequired;
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  const fetchData = async () => {
    const isFormValid = validateForm();
    if (isFormValid) {
      if (selectedFinYear === null || selectedFinYear === '') {
        alert('Financial Year and Status are mandatory.');
      } else {
        try {
          var location = {
            stateID: selectedStateId,
            districtID: selectedDistrictId,
            area: selectedAreaId,
            subDistID: selectedSubDistrictId,
            finyr: selectedFinYear
          };
          var body = { ...location };
          const getUrl = `/disconReasonReport/statusReport`;
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

          if (data.stCode != null) {
            setDiscontinueData(data);
            const newData = data.statusMaster.map((row) => ({ ...row, id: row.statusCode }));
            setstausDesc(newData);
          } else {
            setDiscontinueData({});
            setstausDesc([]);
            setSnackbar({ children: 'No Data Found', severity: 'error' });
          }
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
    console.log(discontinueData.ded);
  }, [discontinueData]);

  const handleExportPdf = () => {
    const doc = new jsPDF({ orientation: 'landscape' });
    doc.text('Discountinue Reason Report', 14, 15);

    const headers = statusColumn.filter((col) => col.field && col.headerName).map((col) => col.headerName);

    const tableData = Object.entries(discontinueData)
      .filter(([key]) => key !== 'stCode' && key !== 'statusMaster') // ignore statusMaster if present
      .map(([key, value]) => [key.toUpperCase(), value]);

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
    if (stausDesc.length > 0) {
      const statusText = stausDesc.map((s) => `${s.statusCode} = ${s.statusDesc}`).join(', ');

      const lastY = doc.lastAutoTable.finalY + 10;
      doc.setFontSize(6.5);
      doc.setTextColor(80);

      const halfLength = Math.floor(statusText.length / 2);

      let splitIndex = statusText.indexOf(',', halfLength);
      if (splitIndex === -1) splitIndex = halfLength;

      const line1 = statusText.slice(0, splitIndex + 1);
      const line2 = statusText.slice(splitIndex + 2);

      doc.setFont(undefined, 'bold');
      doc.text('Status Descriptions:', 14, lastY);

      doc.setFont(undefined, 'normal');
      doc.text(line1, 14, lastY + 5);
      doc.text(line2, 14, lastY + 10);
    }

    doc.save(`Discountinue_Reason_Report_${selectedFinYear}.pdf`);
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

  const statusColumn = [
    {
      field: 'statusCode',
      headerName: 'Status Code',
      flex: 1,
      align: 'left',
      headerAlign: 'center',
      sortable: false,
      disableColumnMenu: true
    },
    {
      field: 'statusDesc',
      headerName: 'Status Discription',
      flex: 1,
      align: 'left',
      headerAlign: 'center',
      sortable: false,
      disableColumnMenu: true
    }
  ];
  const columnsReport = [
    {
      field: 'ded',
      headerName: 'DED',
      flex: 1,
      align: 'right',
      headerAlign: 'center',
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) =>
        params.row.districtCode === 'GRAND TOTAL' ? (
          params.value
        ) : params.row.ded === '0' ? (
          params.value
        ) : (
          <Link
            color="#1e88e5"
            style={{ cursor: 'pointer', textDecoration: 'none' }}
            title="Download"
            onClick={() =>
              discontinueData.reportLevel === 'D'
                ? downloadDataInExcel('DED', null, null, null, null)
                : discontinueData.reportLevel === 'SD'
                ? downloadDataInExcel('DED', params.row.stCode, null, null, null)
                : downloadDataInExcel('DED', null, params.row.stCode, null, selectedAreaId)
            }
          >
            {params.value}
          </Link>
        )
    },
    {
      field: 'ips',
      headerName: 'IPS',
      flex: 1,
      align: 'right',
      headerAlign: 'center',
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) =>
        params.row.districtCode === 'GRAND TOTAL' ? (
          params.value
        ) : params.row.ips === '0' ? (
          params.value
        ) : (
          <Link
            color="#1e88e5"
            style={{ cursor: 'pointer', textDecoration: 'none' }}
            title="Download"
            onClick={() =>
              discontinueData.reportLevel === 'D'
                ? downloadDataInExcel('IPS', null, null, null, null)
                : discontinueData.reportLevel === 'SD'
                ? downloadDataInExcel('IPS', params.row.stCode, null, null, null)
                : downloadDataInExcel('IPS', null, params.row.stCode, null, selectedAreaId)
            }
          >
            {params.value}
          </Link>
        )
    },
    {
      field: 'ina',
      headerName: 'INA',
      flex: 1,
      align: 'right',
      headerAlign: 'center',
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) =>
        params.row.districtCode === 'GRAND TOTAL' ? (
          params.value
        ) : params.row.ina === '0' ? (
          params.value
        ) : (
          <Link
            color="#1e88e5"
            style={{ cursor: 'pointer', textDecoration: 'none' }}
            title="Download"
            onClick={() =>
              discontinueData.reportLevel === 'D'
                ? downloadDataInExcel('INA', null, null, null, null)
                : discontinueData.reportLevel === 'SD'
                ? downloadDataInExcel('INA', params.row.stCode, null, null, null)
                : downloadDataInExcel('INA', null, params.row.stCode, null, selectedAreaId)
            }
          >
            {params.value}
          </Link>
        )
    },
    {
      field: 'mgp',
      headerName: 'MGP',
      flex: 1,
      align: 'right',
      headerAlign: 'center',
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) =>
        params.row.districtCode === 'GRAND TOTAL' ? (
          params.value
        ) : params.row.mgp === '0' ? (
          params.value
        ) : (
          <Link
            color="#1e88e5"
            style={{ cursor: 'pointer', textDecoration: 'none' }}
            title="Download"
            onClick={() =>
              discontinueData.reportLevel === 'D'
                ? downloadDataInExcel('MGP', null, null, null, null)
                : discontinueData.reportLevel === 'SD'
                ? downloadDataInExcel('MGP', params.row.stCode, null, null, null)
                : downloadDataInExcel('MGP', null, params.row.stCode, null, selectedAreaId)
            }
          >
            {params.value}
          </Link>
        )
    },
    {
      field: 'mgt',
      headerName: 'MGT',
      flex: 1,
      align: 'right',
      headerAlign: 'center',
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) =>
        params.row.districtCode === 'GRAND TOTAL' ? (
          params.value
        ) : params.row.mgt === '0' ? (
          params.value
        ) : (
          <Link
            color="#1e88e5"
            style={{ cursor: 'pointer', textDecoration: 'none' }}
            title="Download"
            onClick={() =>
              discontinueData.reportLevel === 'D'
                ? downloadDataInExcel('MGT', null, null, null, null)
                : discontinueData.reportLevel === 'SD'
                ? downloadDataInExcel('MGT', params.row.stCode, null, null, null)
                : downloadDataInExcel('MGT', null, params.row.stCode, null, selectedAreaId)
            }
          >
            {params.value}
          </Link>
        )
    },
    {
      field: 'ior',
      headerName: 'IOR',
      flex: 1,
      align: 'right',
      headerAlign: 'center',
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) =>
        params.row.districtCode === 'GRAND TOTAL' ? (
          params.value
        ) : params.row.ior === '0' ? (
          params.value
        ) : (
          <Link
            color="#1e88e5"
            style={{ cursor: 'pointer', textDecoration: 'none' }}
            title="Download"
            onClick={() =>
              discontinueData.reportLevel === 'D'
                ? downloadDataInExcel('IOR', null, null, null, null)
                : discontinueData.reportLevel === 'SD'
                ? downloadDataInExcel('IOR', params.row.stCode, null, null, null)
                : downloadDataInExcel('IOR', null, params.row.stCode, null, selectedAreaId)
            }
          >
            {params.value}
          </Link>
        )
    },
    {
      field: 'ino',
      headerName: 'INO',
      flex: 1,
      align: 'right',
      headerAlign: 'center',
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) =>
        params.row.districtCode === 'GRAND TOTAL' ? (
          params.value
        ) : params.row.ino === '0' ? (
          params.value
        ) : (
          <Link
            color="#1e88e5"
            style={{ cursor: 'pointer', textDecoration: 'none' }}
            title="Download"
            onClick={() =>
              discontinueData.reportLevel === 'D'
                ? downloadDataInExcel('INO', null, null, null, null)
                : discontinueData.reportLevel === 'SD'
                ? downloadDataInExcel('INO', params.row.stCode, null, null, null)
                : downloadDataInExcel('INO', null, params.row.stCode, null, selectedAreaId)
            }
          >
            {params.value}
          </Link>
        )
    },
    {
      field: 'stp',
      headerName: 'STP',
      flex: 1,
      align: 'right',
      headerAlign: 'center',
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) =>
        params.row.districtCode === 'GRAND TOTAL' ? (
          params.value
        ) : params.row.stp === '0' ? (
          params.value
        ) : (
          <Link
            color="#1e88e5"
            style={{ cursor: 'pointer', textDecoration: 'none' }}
            title="Download"
            onClick={() =>
              discontinueData.reportLevel === 'D'
                ? downloadDataInExcel('STP', null, null, null, null)
                : discontinueData.reportLevel === 'SD'
                ? downloadDataInExcel('STP', params.row.stCode, null, null, null)
                : downloadDataInExcel('STP', null, params.row.stCode, null, selectedAreaId)
            }
          >
            {params.value}
          </Link>
        )
    }
  ].filter(Boolean);
  const rows = [
    {
      id: 1,
      stCode: discontinueData.stCode,
      ded: discontinueData.ded,
      ips: discontinueData.ips,
      ina: discontinueData.ina,
      mgp: discontinueData.mgp,
      mgt: discontinueData.mgt,
      ior: discontinueData.ior,
      ino: discontinueData.ino,
      stp: discontinueData.stp
    }
  ];
  const downloadDataInExcel = async (type, districtCode, subDistrictCode, gpCode, area) => {
    const body = {
      statusCode: type,
      stateID: selectedStateId,
      districtID: districtCode,
      area: area,
      subDistID: subDistrictCode,
      gpCode: gpCode,
      finyr: selectedFinYear
    };
    try {
      setLoading(true);
      const response = await axiosInstance.post('/disconReasonReport/getDisRsnDataInExcel', body, {
        responseType: 'blob'
      });

      if (response.status == 204) {
        setSnackbar({ children: 'No Data Available', severity: 'error' });
        return false;
      }

      const blob = new Blob([response.data], { type: 'application/octet-stream' });
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = `Beneficiary_Discontinue_Reason_data.xlsx`;
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
      <MainCard title="Stop Pension Reason Report">
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
                  {finYear.map((item, index) => (
                    <MenuItem key={index} value={item.finyear}>
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
      {Object.keys(discontinueData).length > 0 && (
        <div>
          <MainCard title="Stop Pension Reason Report">
            <div style={{ height: 180, width: '100%', marginTop: '20px' }} className={classes.root}>
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
                rows={rows}
                columns={columnsReport}
                stickyFooter
                hideFooterPagination
                disableRowSelectionOnClick
                density="compact"
                disableFooter
              />
            </div>

            {/* <div style={{ height: 460, width: '50%', marginTop: '20px' }} className={classes.root}>
              <DataGrid
                rows={stausDesc}
                columns={statusColumn}
                hideFooterPagination
                disableRowSelectionOnClick
                density="compact"
                disableFooter
              />
            </div> */}
            {stausDesc.length > 0 &&
              (() => {
                const statusText = stausDesc.map((item) => `${item.statusCode} = ${item.statusDesc}`).join(', ');
                const halfLength = Math.floor(statusText.length / 2);
                let splitIndex = statusText.indexOf(',', halfLength);
                if (splitIndex === -1) splitIndex = halfLength;

                const line1 = statusText.slice(0, splitIndex + 1);
                const line2 = statusText.slice(splitIndex + 2);

                return (
                  <Box mt={3}>
                    <Typography variant="subtitle2" gutterBottom>
                      <strong>Status Descriptions:</strong>
                    </Typography>
                    <Typography variant="body2">{line1}</Typography>
                    <Typography variant="body2">{line2}</Typography>
                  </Box>
                );
              })()}
          </MainCard>
        </div>
      )}
    </div>
  );
}

export default DiscontinueReasonReport;
