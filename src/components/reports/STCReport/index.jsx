import { Alert, Backdrop, CircularProgress, Snackbar } from '@mui/material';
import axiosInstance from 'hooks/useAuthTokenUrl';
import React, { useState } from 'react';
import MainCard from 'ui-component/cards/MainCard';
import { useEffect } from 'react';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import reportcss from 'components/reports/STCReport/reportCSS';

const STCReport = () => {
  const [loading, setLoading] = useState(false);
  const [dataSummary, setDataSummary] = useState([]);
  const [snackbar, setSnackbar] = useState(null);
  const handleCloseSnackbar = () => setSnackbar(null);

  const classes = reportcss();

  const columnsReport = [
    { field: 'id', headerName: <div style={{ whiteSpace: 'normal', lineHeight: '1.2' }}>SNo.</div>, width: 10 },
    {
      field: 'state_name',
      headerName: <div style={{ whiteSpace: 'normal', lineHeight: '1.2' }}>State</div>,
      align: 'left',
      headerAlign: 'center',
      width: 140
    },
    {
      field: 'district_name',
      headerName: <div style={{ whiteSpace: 'normal', lineHeight: '1.2' }}>District</div>,
      align: 'left',
      headerAlign: 'center',
      width: 140
    },
    {
      field: 'total_data_digitized',
      headerName: <div style={{ whiteSpace: 'normal', lineHeight: '1.2' }}>Total Data Digitized</div>,
      align: 'left',
      headerAlign: 'center',
      width: 90
    },
    {
      field: 'total_aadhaar_data_digitized',
      headerName: <div style={{ whiteSpace: 'normal', lineHeight: '1.2' }}>Total Aadhaar Data Digitized</div>,
      align: 'left',
      headerAlign: 'center',
      width: 110
    },
    {
      headerName: <div style={{ whiteSpace: 'normal', lineHeight: '1.2' }}>Total Scheme</div>,
      align: 'left',
      headerAlign: 'center',
      sortable: false,
      width: 210,
      renderCell: () => (
        <div>
          <p>IGNOAPS, IGNDPS, IGNWPS</p>
        </div>
      )
    },
    {
      field: 'ignoaps',
      headerName: <div style={{ whiteSpace: 'normal', lineHeight: '1.2' }}>Old Age Pensioners</div>,
      align: 'left',
      headerAlign: 'center',
      width: 90
    },
    {
      field: 'igndps',
      headerName: <div style={{ whiteSpace: 'normal', lineHeight: '1.2' }}>Disabled Pensioners</div>,
      align: 'left',
      headerAlign: 'center',
      width: 90
    },
    {
      field: 'ignwps',
      headerName: <div style={{ whiteSpace: 'normal', lineHeight: '1.2' }}>Widow Pensioners</div>,
      align: 'left',
      headerAlign: 'center',
      width: 90
    },
    {
      field: 'totalBeneficiary',
      headerName: <div style={{ whiteSpace: 'normal', lineHeight: '1.2' }}>Total Beneficiary</div>,
      align: 'left',
      headerAlign: 'center',
      width: 90
    },
    {
      field: 'bank_ac',
      headerName: <div style={{ whiteSpace: 'normal', lineHeight: '1.2' }}>Total Bank A/C</div>,
      align: 'left',
      headerAlign: 'center',
      width: 100
    },
    {
      field: 'post_ac',
      headerName: <div style={{ whiteSpace: 'normal', lineHeight: '1.2' }}>Total P.O A/C</div>,
      align: 'left',
      headerAlign: 'center',
      width: 90
    },
    {
      field: 'mo_ac',
      headerName: <div style={{ whiteSpace: 'normal', lineHeight: '1.2' }}>Total M.O A/C</div>,
      align: 'left',
      headerAlign: 'center',
      width: 90
    },
    {
      field: 'cash_ac',
      headerName: <div style={{ whiteSpace: 'normal', lineHeight: '1.2' }}>Total Cash A/C</div>,
      align: 'left',
      headerAlign: 'center',
      width: 89
    },
    {
      field: 'total_aadhar',
      headerName: <div style={{ whiteSpace: 'normal', lineHeight: '1.2' }}>Total Aadhaar</div>,
      align: 'left',
      headerAlign: 'center',
      width: 90
    },
    {
      field: 'adharSeeded',
      headerName: <div style={{ whiteSpace: 'normal', lineHeight: '.85' }}>Aadhaar Seeded with Bank</div>,
      align: 'left',
      headerAlign: 'center',
      width: 110
    },
    {
      field: 'dbt',
      headerName: <div style={{ whiteSpace: 'normal', lineHeight: '1.2' }}>Paid through DBT</div>,
      align: 'left',
      headerAlign: 'center',
      width: 100
    }
  ].filter(Boolean);

  const getReportSummary = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('report/findAllStcReportDetails');
      const newData = response.data.map((row, index) => ({ ...row, id: index + 1 }));
      if (newData.length === 0) {
        setSnackbar({ children: 'No record found', severity: 'error' });
      }
      setDataSummary(newData);
    } catch (error) {
      setSnackbar({ children: 'Some Internal Error Occurred While Getting Summary', severity: 'error' });
      console.error('Error fetching generated Summary', error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    getReportSummary();
  }, []);

  const CustomToolbar = (props) => {
    return (
      <div>
        <GridToolbar {...props} />
        <div style={{ borderBottom: '1px solid #ccc', marginTop: '8px' }}></div>
      </div>
    );
  };
  console.log('STC REPORT');
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
        <MainCard>
          <h3 style={{ fontSize: '2rem', color: 'black', fontWeight: 'normal' }}>STC Report</h3>
          <div style={{ height: 600, width: '100%' }} className={classes.root}>
            <DataGrid
              slots={{ toolbar: CustomToolbar }}
              slotProps={{
                toolbar: {
                  showQuickFilter: true,
                  printOptions: { disableToolbarButton: true },
                  csvOptions: { fileName: 'STC_REPORT' }
                }
              }}
              rows={dataSummary}
              columns={columnsReport}
              stickyFooter
              hideFooterPagination
              disableRowSelectionOnClick
              density="compact"
              getRowClassName={(params) => (params.index % 2 === 0 ? 'white-row' : 'grey-row')}
            />
          </div>
        </MainCard>
      )}
    </>
  );
};
export default STCReport;
