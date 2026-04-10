import { Alert, Backdrop, Button, CircularProgress, Link, Snackbar } from '@mui/material';
import axiosInstance from 'hooks/useAuthTokenUrl';
import Alert1 from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import '../../verification/aadharConsentUpdation/aadharConsent.css';
import React, { useState } from 'react';
import MainCard from 'ui-component/cards/MainCard';
import { useEffect } from 'react';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import reportcss from 'components/common/reportsCSS';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const NFBSClaimantSummary = () => {
  const [loading, setLoading] = useState(false);
  const [reportSummary, setReportSummary] = useState({});
  const [dataSummary, setDataSummary] = useState([]);
  const [snackbar, setSnackbar] = useState(null);
  const handleCloseSnackbar = () => setSnackbar(null);

  const classes = reportcss();

  const handleExportPdf = () => {
    const doc = new jsPDF({ orientation: 'landscape' });
    doc.text('NFBS Claimant Summary', 14, 15);

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

    doc.save(`NFBS_Claimant_Report.pdf`);
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
    { field: 'sno', headerName: 'SNo.', width: 10 },
    {
      field: 'name',
      align: 'center',
      headerAlign: 'center',
      headerName: reportSummary.reportLevel === 'D' ? 'District' : reportSummary.reportLevel === 'SD' ? 'Sub District' : 'Gram Panchayat',
      width: 200,
      renderCell: (params) =>
        params.row.locationCode === 'GRAND TOTAL' ? (
          params.value
        ) : reportSummary.reportLevel === 'GP' ? (
          params.value
        ) : (
          <Link
            style={{ cursor: 'pointer', color: 'blue', textDecorationColor: 'blue' }}
            onClick={() =>
              reportSummary.reportLevel === 'D'
                ? getReportSummary(params.row.locationCode, 'ALL', null)
                : reportSummary.reportLevel === 'SD'
                ? getReportSummary(null, params.row.locationCode, 'ALL')
                : ''
            }
          >
            {params.value}
          </Link>
        )
    },
    reportSummary.reportLevel === 'D'
      ? null
      : { field: 'name2', align: 'center', headerAlign: 'center', headerName: reportSummary.reportLevel === 'D' ? '' : 'Area', width: 50 },

    {
      field: 'paid',
      headerName: 'Paid',
      flex: 1,
      align: 'right',
      headerAlign: 'center',
      sortable: false,
      renderCell: (params) =>
        params.row.locationCode === 'GRAND TOTAL' || params.value === '0' ? (
          params.value
        ) : (
          <Link
            color="#1e88e5"
            style={{ cursor: 'pointer', textDecoration: 'none' }}
            title="Download"
            onClick={() =>
              reportSummary.reportLevel === 'D'
                ? downloadDataInExcel('PAID', null, params.row.locationCode, null, null)
                : reportSummary.reportLevel === 'SD'
                ? downloadDataInExcel('PAID', null, null, params.row.locationCode, null)
                : downloadDataInExcel('PAID', null, null, null, params.row.locationCode)
            }
          >
            {params.value}
          </Link>
        )
    },

    {
      field: 'toBePaid',
      headerName: 'To Be Paid',
      align: 'right',
      headerAlign: 'center',
      sortable: false,
      flex: 1,
      renderCell: (params) =>
        params.row.locationCode === 'GRAND TOTAL' || params.value === '0' ? (
          params.value
        ) : (
          <Link
            color="#1e88e5"
            style={{ cursor: 'pointer', textDecoration: 'none' }}
            title="Download"
            onClick={() =>
              reportSummary.reportLevel === 'D'
                ? downloadDataInExcel('TOBEPAID', null, params.row.locationCode, null, null)
                : reportSummary.reportLevel === 'SD'
                ? downloadDataInExcel('TOBEPAID', null, null, params.row.locationCode, null)
                : downloadDataInExcel('TOBEPAID', null, null, null, params.row.locationCode)
            }
          >
            {params.value}
          </Link>
        )
    },
    // { field: 'newSan', headerName: 'New Application',align: 'right',headerAlign: 'center',sortable: false, flex:1, renderCell: (params) => (
    //     params.row.locationCode==='GRAND TOTAL' ? params.value :
    //   <Link color="#1e88e5" style={{cursor: 'pointer',textDecoration:'none'}} title="Download" onClick={() =>   reportSummary.reportLevel === 'D' ? downloadDataInExcel("BANK_APB", params.row.locationCode, null,null): reportSummary.reportLevel === 'SD' ? downloadDataInExcel('BANK_APB', null,params.row.locationCode,null):downloadDataInExcel("BANK_APB",null, null ,params.row.locationCode)}>
    //     {params.value}
    //   </Link>
    // ) },
    {
      field: 'pfmsRegistered',
      headerName: 'PFMS Registered',
      align: 'right',
      headerAlign: 'center',
      flex: 1,
      sortable: false,
      renderCell: (params) =>
        params.row.locationCode === 'GRAND TOTAL' || params.value === '0' ? (
          params.value
        ) : (
          <Link
            color="#1e88e5"
            style={{ cursor: 'pointer', textDecoration: 'none' }}
            title="Download"
            onClick={() =>
              reportSummary.reportLevel === 'D'
                ? downloadDataInExcel('PFMS REGISTERED (SO_SAVED)', 'Y', params.row.locationCode, null, null)
                : reportSummary.reportLevel === 'SD'
                ? downloadDataInExcel('TOBEPAID', 'Y', null, params.row.locationCode, null)
                : downloadDataInExcel('TOBEPAID', 'Y', null, null, params.row.locationCode)
            }
          >
            {params.value}
          </Link>
        )
    },
    {
      field: 'pfmsNotRegistered',
      headerName: 'Not PFMS Registered',
      align: 'right',
      headerAlign: 'center',
      flex: 1,
      sortable: false,
      renderCell: (params) => (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          {params.row.locationCode === 'GRAND TOTAL' || params.value === '0' ? (
            params.value
          ) : (
            <Link
              color="#1e88e5"
              style={{ cursor: 'pointer', textDecoration: 'none' }}
              title="Download"
              onClick={() =>
                reportSummary.reportLevel === 'D'
                  ? downloadDataInExcel('PFMS NOT REGISTERED (SO_SAVED) ', 'N', params.row.locationCode, null, null)
                  : reportSummary.reportLevel === 'SD'
                  ? downloadDataInExcel('TOBEPAID', 'N', null, params.row.locationCode, null)
                  : downloadDataInExcel('TOBEPAID', 'N', null, null, params.row.locationCode)
              }
            >
              {params.value}
            </Link>
          )}
        </div>
      )
    },
    {
      field: 'totalBeneficiaries',
      headerName: 'Total Beneficiaries',
      align: 'right',
      headerAlign: 'center',
      flex: 1,
      sortable: false,
      renderCell: (params) => (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          {params.row.locationCode === 'GRAND TOTAL' || params.value === '0' ? (
            params.value
          ) : (
            <Link
              color="#1e88e5"
              style={{ cursor: 'pointer', textDecoration: 'none' }}
              title="Download"
              onClick={() =>
                reportSummary.reportLevel === 'D'
                  ? downloadDataInExcel('ALL', null, params.row.locationCode, null, null)
                  : reportSummary.reportLevel === 'SD'
                  ? downloadDataInExcel('ALL', null, null, params.row.locationCode, null)
                  : downloadDataInExcel('ALL', null, null, null, params.row.locationCode)
              }
            >
              {params.value}
            </Link>
          )}
        </div>
      )
    }
  ].filter(Boolean);

  const getReportSummary = async (districtCode, subDistrictCode, gpCode) => {
    const body = { districtCode: districtCode, subDistrictMunicipalAreaCode: subDistrictCode, gramPanchayatCode: gpCode };
    // console.log(JSON.stringify(body));
    try {
      setLoading(true);
      const response = await axiosInstance.post('NFBSClaimantSummary/getNFBSClaimantSummary', body);
      setReportSummary(response.data);
      const newData = response.data.reportData.map((row) => ({ ...row, id: row.locationCode }));
      setDataSummary(newData);
    } catch (error) {
      setSnackbar({ children: 'Some Internal Error Occured While Getting Summary', severity: 'error' });
      console.error('Error fetching generated Summary', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getReportSummary(null, null, null);
  }, []);

  useEffect(() => {
    // console.log(reportSummary);
  }, [dataSummary, reportSummary]);

  const downloadDataInExcel = async (statusType, isRegistered, districtCode, subDistrictCode, gpCode) => {
    const body = {
      statusType: statusType,
      isRegistered: isRegistered,
      districtCode: districtCode,
      subDistrictMunicipalAreaCode: subDistrictCode,
      gramPanchayatCode: gpCode
    };
    try {
      setLoading(true);
      const response = await axiosInstance.post('NFBSClaimantSummary/getNFBSClaimantBeneficiariesInExcel', body, {
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
      link.download = `Beneficiary_${statusType}_data.xlsx`;
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
    <>
      <Backdrop open={loading} style={{ zIndex: 999, color: '#fff' }}>
        <CircularProgress color="inherit" />
      </Backdrop>

      {!!snackbar && (
        <Snackbar open anchorOrigin={{ vertical: 'top', horizontal: 'center' }} onClose={handleCloseSnackbar} autoHideDuration={6000}>
          <Alert {...snackbar} onClose={handleCloseSnackbar} />
        </Snackbar>
      )}

      {dataSummary.length > 0 && (
        <MainCard title="NFBS CLAIMANT SUMMARY">
          <Stack sx={{ width: '100%' }} spacing={2}>
            <Alert1 variant="filled" severity="warning" style={{ color: 'red' }}>
              Note: This report includes <b style={{ color: 'blue' }}>SO_SAVED and DONE</b> beneficiary data only.
            </Alert1>
          </Stack>
          <div style={{ height: 600, width: '100%', marginTop: '20px' }} className={classes.root}>
            <DataGrid
              slots={{ toolbar: (props) => <CustomToolbarWithExportButton {...props} handleExportPdf={handleExportPdf} /> }}
              slotProps={{
                toolbar: {
                  showQuickFilter: true,
                  printOptions: { disableToolbarButton: true }
                }
              }}
              rows={dataSummary}
              columns={columnsReport}
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
                onClick={() => getReportSummary(null, null, null)}
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
                  getReportSummary(
                    dataSummary[0].locationCode.substring(0, 4),
                    [2, 3].includes(reportSummary.loginLevel) ? 'ALL' : null,
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
    </>
  );
};
export default NFBSClaimantSummary;
