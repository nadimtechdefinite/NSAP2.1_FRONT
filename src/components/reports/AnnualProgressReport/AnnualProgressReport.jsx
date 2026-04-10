import React, { useState, useEffect } from 'react';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';

//import { columnGroupingModel } from '@mui/x-data-grid-pro';
import {
  Backdrop,
  CircularProgress,
  Snackbar,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Button,
  Stack,
  Typography
} from '@mui/material';
import jsPDF from 'jspdf';
console.log('jsPDF import:', jsPDF);
import autoTable from 'jspdf-autotable';
import StateList from 'components/form_components/StateList';
import axiosInstance from 'hooks/useAuthTokenUrl';

const AnnualProgressReport = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState(null);
  const [selectedState, setSelectedState] = useState('');
  const [selectedFinancialYear, setSelectedFinancialYear] = useState('');
  const [financialYears, setFinancialYears] = useState([]);

  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [selectedSubDistrict, setSelectedSubDistrict] = useState(null);
  const [selectedGramPanchayat, setSelectedGramPanchayat] = useState(null);
  const [selectedVillage, setSelectedVillage] = useState(null);
  const [selectedLevel, setSelectedLevel] = useState('D');
  const [previousPayload, setPreviousPayload] = useState(null);
  const [navigationHistory, setNavigationHistory] = useState([]);
  // const [statusType, setStatusType] = useState([]);

  useEffect(() => {
    fetchFinancialYears();
  }, []);
  console.log(previousPayload);
  const fetchFinancialYears = async () => {
    try {
      const response = await axiosInstance.get('annualVerificationSummary/getFinanceYears');
      setFinancialYears(response.data);
      setSelectedFinancialYear(response.data.finYear);
    } catch (error) {
      console.error('Error fetching financial years:', error);
    }
  };
  const handleExportPdf = () => {
    const doc = new jsPDF({ orientation: 'landscape' });
    doc.text('Annual Progress Report', 14, 15);

    const headers = columns.filter((col) => col.field && col.headerName).map((col) => col.headerName);

    const tableData = data.map((row) =>
      columns
        .filter((col) => col.field && col.headerName)
        .map((col) => {
          if (col.field === 'numberOfWidowBeneficiaryGettingMarried') {
            return 0;
          }
          return row[col.field] ?? '';
        })
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

    doc.save(`Annual_Report_${selectedFinancialYear}_${selectedLevel}.pdf`);
  };

  const fetchData = async () => {
    setLoading(true);

    let requestPayload = {
      stateCode: selectedState,
      districtCode: selectedDistrict,
      subDistrictMunicipalAreaCode: selectedSubDistrict,
      gramPanchayatCode: selectedGramPanchayat,
      villageCode: selectedVillage,
      finYear: selectedFinancialYear
    };

    try {
      const response = await axiosInstance.post('annualVerificationSummary/getAnnualProgressData', requestPayload);

      console.log('API Response', response);
      if (response.data && Array.isArray(response.data)) {
        const formattedData = response.data.map((item, index) => ({
          id: item.villageCode || item.gramPanchayatCode || item.subDistrictMunicipalAreaCode || item.districtCode || `${index}`,
          ...item
        }));
        setPreviousPayload(requestPayload);
        setData(formattedData);

        if (selectedVillage) {
          setSelectedState(null);
          setSelectedDistrict(null);
          setSelectedSubDistrict(null);
          setSelectedGramPanchayat(null);
        } else if (selectedGramPanchayat) {
          setSelectedState(null);
          setSelectedDistrict(null);
          setSelectedSubDistrict(null);
          setSelectedGramPanchayat((prev) => prev);
        } else if (selectedSubDistrict) {
          setSelectedState(null);
          setSelectedDistrict(null);
          setSelectedSubDistrict((prev) => prev);
        } else if (selectedDistrict) {
          setSelectedState(null);
          setSelectedDistrict((prev) => prev);
        }
      } else {
        setData([]);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setSnackbar({ children: 'Error fetching data', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (rowData, statusType) => {
    let payloadDownload = {
      statusType: statusType,
      finYear: selectedFinancialYear,
      districtCode: null,
      subDistrictMunicipalAreaCode: null,
      gramPanchayatCode: null,
      villageCode: null
    };

    if (rowData.villageCode) {
      payloadDownload.villageCode = rowData.villageCode;
      payloadDownload.gramPanchayatCode = rowData.gramPanchayatCode;
      payloadDownload.subDistrictMunicipalAreaCode = rowData.subDistrictMunicipalAreaCode;
      payloadDownload.districtCode = rowData.districtCode;
    } else if (rowData.gramPanchayatCode) {
      payloadDownload.gramPanchayatCode = rowData.gramPanchayatCode;
      payloadDownload.subDistrictMunicipalAreaCode = rowData.subDistrictMunicipalAreaCode;
      payloadDownload.districtCode = rowData.districtCode;
    } else if (rowData.subDistrictMunicipalAreaCode) {
      payloadDownload.subDistrictMunicipalAreaCode = rowData.subDistrictMunicipalAreaCode;
      payloadDownload.districtCode = rowData.districtCode;
    } else if (rowData.districtCode) {
      payloadDownload.districtCode = rowData.districtCode;
    }

    try {
      setLoading(true);
      const response = await axiosInstance.post('annualVerificationSummary/getAnnualProgressReportInExcel', payloadDownload, {
        responseType: 'blob'
      });

      if (response.status === 204) {
        setSnackbar({ children: 'No Data Available', severity: 'error' });
        return false;
      }

      const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = `Beneficiary_${statusType}_data.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(link.href);
    } catch (error) {
      setSnackbar({ children: 'Some Internal Error Occurred While fetching data', severity: 'error' });
      console.error('Error fetching data:', error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if ((selectedState || selectedDistrict || selectedSubDistrict || selectedGramPanchayat) && selectedFinancialYear) {
      fetchData();
    }
  }, [selectedState, selectedDistrict, selectedSubDistrict, selectedGramPanchayat, selectedVillage]);

  const handleRowClick = (params) => {
    if (selectedLevel === 'GP' && params.row.ruralUrbanArea === 'U') {
      return;
    }

    setData([]);

    const currentPayload = {
      stateCode: selectedState,
      districtCode: selectedDistrict,
      subDistrictMunicipalAreaCode: selectedSubDistrict,
      gramPanchayatCode: selectedGramPanchayat,
      villageCode: selectedVillage,
      finYear: selectedFinancialYear
    };

    setNavigationHistory((prev) => [...prev, currentPayload]);

    if (!selectedDistrict && params.row.districtCode) {
      setSelectedDistrict(params.row.districtCode);
      setSelectedLevel('SD');
    } else if (!selectedSubDistrict && params.row.subDistrictMunicipalAreaCode) {
      setSelectedSubDistrict(params.row.subDistrictMunicipalAreaCode);
      setSelectedLevel('GP');
    } else if (!selectedGramPanchayat && params.row.gramPanchayatCode) {
      setSelectedGramPanchayat(params.row.gramPanchayatCode);
      setSelectedLevel('V');
    } else if (!selectedVillage && params.row.villageCode) {
      setSelectedVillage(params.row.villageCode);
    }

    fetchData();
  };

  const handleBack = () => {
    if (navigationHistory.length === 0) return;

    setData([]);

    const lastPayload = navigationHistory[navigationHistory.length - 1];
    setNavigationHistory((prev) => prev.slice(0, -1));

    setSelectedState(lastPayload.stateCode);
    setSelectedDistrict(lastPayload.districtCode);
    setSelectedSubDistrict(lastPayload.subDistrictMunicipalAreaCode);
    setSelectedGramPanchayat(lastPayload.gramPanchayatCode);
    setSelectedVillage(lastPayload.villageCode);

    if (lastPayload.gramPanchayatCode) {
      setSelectedLevel('V');
    } else if (lastPayload.subDistrictMunicipalAreaCode) {
      setSelectedLevel('GP');
    } else if (lastPayload.districtCode) {
      setSelectedLevel('SD');
    } else {
      setSelectedLevel('D');
    }

    setPreviousPayload(lastPayload);
  };

  const handleStateChange = (stateId) => {
    setSelectedState(stateId);
    setSelectedDistrict(null);
    setSelectedSubDistrict(null);
    setSelectedGramPanchayat(null);
    setSelectedVillage(null);
  };

  const handleFinancialYearChange = (event) => {
    setSelectedFinancialYear(event.target.value);
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

  const columns = [
    {
      field:
        selectedLevel === 'V'
          ? 'villageName'
          : selectedLevel === 'GP'
          ? 'gramPanchayatName'
          : selectedLevel === 'SD'
          ? 'subDistrictName'
          : 'districtName',
      headerName:
        selectedLevel === 'V' ? 'Village' : selectedLevel === 'GP' ? 'Gram Panchayat' : selectedLevel === 'SD' ? 'Subdistrict' : 'District',
      width: 200,
      renderCell: (params) => {
        if (selectedLevel === 'V' || (selectedLevel === 'GP' && params.row.ruralUrbanArea === 'U')) {
          return <Typography>{params.value}</Typography>;
        }

        return (
          <Button color="primary" onClick={() => handleRowClick(params)} sx={{ textTransform: 'none', textDecoration: 'underline' }}>
            {params.value}
          </Button>
        );
      }
    },
    {
      field: 'totalBeneficiary',
      headerName: 'Total Registered Beneficiary',
      width: 140,
      renderCell: (params) =>
        params.value > 0 ? (
          <Button
            color="secondary"
            onClick={() => handleDownload(params.row, 'totalBeneficiary')}
            sx={{ textTransform: 'none', textDecoration: 'underline' }}
          >
            {params.value}
          </Button>
        ) : (
          <Typography>{params.value || '0'}</Typography>
        )
    },
    {
      field: 'total',
      headerName: 'Total Verification',
      width: 100,
      renderCell: (params) => (
        <Button
          color="secondary"
          onClick={() => handleDownload(params.row, 'total')}
          sx={{ textTransform: 'none', textDecoration: 'underline' }}
        >
          {params.value || '0'}
        </Button>
      )
    },
    {
      field: 'eligible',
      headerName: 'Eligible',
      width: 60,
      renderCell: (params) => (
        <Button
          color="secondary"
          onClick={params.value > 0 ? () => handleDownload(params.row, 'ELI') : undefined}
          disableRipple
          sx={{
            textTransform: 'none',
            textDecoration: params.value > 0 ? 'underline' : 'none',
            cursor: params.value > 0 ? 'pointer' : 'default',
            pointerEvents: params.value > 0 ? 'auto' : 'none'
            //color: 'inherit' // keeps text color same even when "disabled"
          }}
        >
          {params.value || '0'}
        </Button>
      )
    },
    {
      field: 'dead',
      headerName: 'Dead',
      width: 60,
      renderCell: (params) => (
        <Button
          color="secondary"
          onClick={params.value > 0 ? () => handleDownload(params.row, 'dead') : undefined}
          disableRipple
          sx={{
            textTransform: 'none',
            textDecoration: params.value > 0 ? 'underline' : 'none',
            cursor: params.value > 0 ? 'pointer' : 'default',
            pointerEvents: params.value > 0 ? 'auto' : 'none'
          }}
        >
          {params.value || '0'}
        </Button>
      )
    },
    {
      field: 'migrated',
      headerName: 'Migrated',
      width: 80,
      renderCell: (params) => (
        <Button
          color="secondary"
          onClick={params.value > 0 ? () => handleDownload(params.row, 'migrated') : undefined}
          disableRipple
          sx={{
            textTransform: 'none',
            textDecoration: params.value > 0 ? 'underline' : 'none',
            cursor: params.value > 0 ? 'pointer' : 'default',
            pointerEvents: params.value > 0 ? 'auto' : 'none'
          }}
        >
          {params.value || '0'}
        </Button>
      )
    },
    {
      field: 'nonTraceable',
      headerName: 'Non-Traceable',
      width: 120,
      renderCell: (params) => (
        <Button
          color="secondary"
          onClick={params.value > 0 ? () => handleDownload(params.row, 'MIS') : undefined}
          disableRipple
          sx={{
            textTransform: 'none',
            textDecoration: params.value > 0 ? 'underline' : 'none',
            cursor: params.value > 0 ? 'pointer' : 'default',
            pointerEvents: params.value > 0 ? 'auto' : 'none'
          }}
        >
          {params.value || '0'}
        </Button>
      )
    },
    {
      field: 'duplicateRecord',
      headerName: 'Getting Pension from Other Scheme',
      width: 130,
      renderCell: (params) => (
        <Button
          color="secondary"
          onClick={params.value > 0 ? () => handleDownload(params.row, 'IOR') : undefined}
          disableRipple
          sx={{
            textTransform: 'none',
            textDecoration: params.value > 0 ? 'underline' : 'none',
            cursor: params.value > 0 ? 'pointer' : 'default',
            pointerEvents: params.value > 0 ? 'auto' : 'none'
          }}
        >
          {params.value || '0'}
        </Button>
      )
    },
    {
      field: 'numberOfWidowBeneficiaryGettingMarried',
      headerName: 'No. Of Widow Beneficiary Getting Married',
      width: 200,
      valueGetter: () => 0
    },
    {
      field: 'invalidAcc',
      headerName: 'Invalid Account',
      width: 130,
      renderCell: (params) => (
        <Button
          color="secondary"
          onClick={params.value > 0 ? () => handleDownload(params.row, 'STP') : undefined}
          disableRipple
          sx={{
            textTransform: 'none',
            textDecoration: params.value > 0 ? 'underline' : 'none',
            cursor: params.value > 0 ? 'pointer' : 'default',
            pointerEvents: params.value > 0 ? 'auto' : 'none'
          }}
        >
          {params.value || '0'}
        </Button>
      )
    },
    {
      field: 'ineligibleInVerification',
      headerName: 'Ineligible In Verification',
      width: 130,
      renderCell: (params) => (
        <Button
          color="secondary"
          onClick={params.value > 0 ? () => handleDownload(params.row, 'IPS') : undefined}
          disableRipple
          sx={{
            textTransform: 'none',
            textDecoration: params.value > 0 ? 'underline' : 'none',
            cursor: params.value > 0 ? 'pointer' : 'default',
            pointerEvents: params.value > 0 ? 'auto' : 'none'
          }}
        >
          {params.value || '0'}
        </Button>
      )
    },
    {
      field: 'ineligibleAge',
      headerName: 'Ineligible Age',
      width: 130,
      renderCell: (params) => (
        <Button
          color="secondary"
          onClick={params.value > 0 ? () => handleDownload(params.row, 'INA') : undefined}
          disableRipple
          sx={{
            textTransform: 'none',
            textDecoration: params.value > 0 ? 'underline' : 'none',
            cursor: params.value > 0 ? 'pointer' : 'default',
            pointerEvents: params.value > 0 ? 'auto' : 'none'
          }}
        >
          {params.value || '0'}
        </Button>
      )
    },
    {
      field: 'ineligibleOtherReason',
      headerName: 'Ineligible Other',
      width: 130,
      renderCell: (params) => (
        <Button
          color="secondary"
          onClick={params.value > 0 ? () => handleDownload(params.row, 'INO') : undefined}
          disableRipple
          sx={{
            textTransform: 'none',
            textDecoration: params.value > 0 ? 'underline' : 'none',
            cursor: params.value > 0 ? 'pointer' : 'default',
            pointerEvents: params.value > 0 ? 'auto' : 'none'
          }}
        >
          {params.value || '0'}
        </Button>
      )
    },
    {
      field: 'beneficiaryPhotoUploaded',
      headerName: 'Photo Uploaded',
      width: 140,
      renderCell: (params) => (
        <Button
          color="secondary"
          onClick={params.value > 0 ? () => handleDownload(params.row, 'beneficiaryPhotoUploaded') : undefined}
          disableRipple
          sx={{
            textTransform: 'none',
            textDecoration: params.value > 0 ? 'underline' : 'none',
            cursor: params.value > 0 ? 'pointer' : 'default',
            pointerEvents: params.value > 0 ? 'auto' : 'none'
          }}
        >
          {params.value || '0'}
        </Button>
      )
    },
    {
      field: 'beneficiaryPhotoNotUploaded',
      headerName: 'Photo Not Uploaded',
      width: 140,
      renderCell: (params) => (
        <Button
          color="secondary"
          onClick={params.value > 0 ? () => handleDownload(params.row, 'beneficiaryPhotoNotUploaded') : undefined}
          disableRipple
          sx={{
            textTransform: 'none',
            textDecoration: params.value > 0 ? 'underline' : 'none',
            cursor: params.value > 0 ? 'pointer' : 'default',
            pointerEvents: params.value > 0 ? 'auto' : 'none'
          }}
        >
          {params.value || '0'}
        </Button>
      )
    }
  ];

  const columnGroupingModel = [
    {
      field:
        selectedLevel === 'V'
          ? 'villageName'
          : selectedLevel === 'GP'
          ? 'gramPanchayatName'
          : selectedLevel === 'SD'
          ? 'subDistrictName'
          : 'districtName'
    },
    {
      groupId: 'Beneficiary Data',
      children: [{ field: 'totalBeneficiary' }, { field: 'total' }, { field: 'eligible' }]
    },
    {
      groupId: ' Reason wise Number of beneficiaries found Not Eligible',
      children: [
        { field: 'dead' },
        { field: 'migrated' },
        { field: 'nonTraceable' },
        { field: 'duplicateRecord' },
        { field: 'numberOfWidowBeneficiaryGettingMarried' },
        { field: 'invalidAcc' },
        { field: 'ineligibleInVerification' },
        { field: 'ineligibleAge' },
        { field: 'ineligibleOtherReason' }
      ]
    },
    {
      groupId: 'Photo Upload Status',
      children: [{ field: 'beneficiaryPhotoUploaded' }, { field: 'beneficiaryPhotoNotUploaded' }]
    }
  ];

  return (
    <>
      <Backdrop open={loading} style={{ zIndex: 999, color: '#fff' }}>
        <CircularProgress color="inherit" />
      </Backdrop>

      {!!snackbar && (
        <Snackbar open anchorOrigin={{ vertical: 'top', horizontal: 'center' }} onClose={() => setSnackbar(null)} autoHideDuration={6000}>
          <Alert {...snackbar} onClose={() => setSnackbar(null)} />
        </Snackbar>
      )}

      <div style={{ padding: '20px' }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <StateList onSelectState={handleStateChange} />
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <InputLabel>Financial Year</InputLabel>
              <Select value={selectedFinancialYear} onChange={handleFinancialYearChange}>
                {financialYears.map((year) => (
                  <MenuItem key={year.finYearCode} value={year.finYear}>
                    {year.finYear}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Button variant="contained" color="primary" onClick={fetchData} style={{ marginTop: '10px' }}>
              Submit
            </Button>
          </Grid>
        </Grid>

        {data.length > 0 && (
          <>
            <div style={{ height: 500, width: '100%', marginTop: '20px' }}>
              <DataGrid
                slots={{
                  toolbar: (props) => <CustomToolbarWithExportButton {...props} handleExportPdf={handleExportPdf} />
                }}
                slotProps={{
                  toolbar: {
                    showQuickFilter: true,
                    printOptions: {
                      disableToolbarButton: true
                    }
                  }
                }}
                rows={data}
                columns={columns}
                getRowId={(row) => row.id}
                hideFooterPagination
                disableRowSelectionOnClick
                density="compact"
                experimentalFeatures={{ columnGrouping: true }}
                columnGroupingModel={columnGroupingModel}
                sx={{
                  '& .MuiDataGrid-columnHeaders': {
                    backgroundColor: '#1976d2',
                    color: 'white',
                    borderBottom: '2px solid #ddd'
                  },
                  '& .MuiDataGrid-columnHeader, & .MuiDataGrid-cell': {
                    borderRight: '1px solid #ddd'
                  },
                  '& .MuiDataGrid-columnHeader:last-child, & .MuiDataGrid-cell:last-child': {
                    borderRight: 'none'
                  },
                  '& .MuiDataGrid-columnHeaderTitleContainer': {
                    justifyContent: 'center'
                  },
                  '& .MuiDataGrid-columnHeadersInner': {
                    backgroundColor: '#1976d2'
                  }
                }}
              />
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
              <Button
                variant="contained"
                color="secondary"
                onClick={handleBack}
                disabled={!selectedDistrict && !selectedSubDistrict && !selectedGramPanchayat && !selectedVillage}
              >
                Back
              </Button>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default AnnualProgressReport;
