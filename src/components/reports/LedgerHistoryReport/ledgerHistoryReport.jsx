import React, { useState /* ,useEffect,useRef */ } from 'react';
import axiosInstance from 'hooks/useAuthTokenUrl';
import SearchComponent from 'components/common/SearchTypeCommon';
import SubDistrictCommon from 'components/common/SubDistrictCommon';
import MainCard from 'ui-component/cards/MainCard';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import Stack from '@mui/material/Stack';

import { Grid, Button, Chip, Snackbar, Alert, CircularProgress, Backdrop, Divider } from '@mui/material';
function LedgerHistoryReport() {
  const [snackbar, setSnackbar] = React.useState(null);
  const handleCloseSnackbar = () => setSnackbar(null);
  const [locationOptionValues, setLocationOptionValues] = useState({});
  const [optionValues, setOptionValues] = useState({});
  const subDistrictCommonRef = React.createRef();
  const [loading, setLoading] = useState(false);
  const [getLedgerReportData, setLedgerReportData] = useState([]);
  const navigate = useNavigate();

  const cancelValue = () => {
    navigate('/nsap/dashboard/default');
  };
  const options = {
    sanctionOrderNo: 'Sanction Order No',
    applicantName: 'Applicant Name'
  };
  const handleLocationValuesChange = (newLocOptionValues) => {
    setLocationOptionValues(newLocOptionValues);
  };
  const handleSearchOptionValuesChange = (newOptionValues) => {
    setOptionValues(newOptionValues);
  };
  const handleClickOpen = (e) => {
    e.preventDefault();
    if (subDistrictCommonRef.current && !Object.values(optionValues).some((value) => value !== null)) {
      if (subDistrictCommonRef.current.validateSelectedDropDown() != 'RJ') {
        return false;
      }
    }
    fetchData()
      .then((res) => {
        if (res.length > 0) {
          // Data is not null
          const districtData = res || [];
          setLedgerReportData(districtData);
          // setAllDistrict(res);
          console.log(res);
        } else {
          // Data is null
          setLedgerReportData([]);
          setSnackbar({ children: 'No Data Found', severity: 'error' });
          return false;
        }
      })
      .catch((e) => {
        console.log(e.message);
      });
  };
  const fetchData = async () => {
    try {
      // var body;
      // if (selectedOption && editableValue.trim()) {
      const selectedStateId = locationOptionValues.stateCode;
      const selectedDistrictId = locationOptionValues.districtCode;
      const selectedAreaId = locationOptionValues.ruralUrbanArea;
      const selectedSubDistrictId = locationOptionValues.subDistrictMunicipalAreaCode;
      var location = {
        stateID: selectedStateId,
        districtID: selectedDistrictId,
        area: selectedAreaId,
        subDistID: selectedSubDistrictId
      };
      var body = {
        ...optionValues,
        ...location
      };
      // alert(JSON.stringify(optionValues));

      const getUrl = `/ledgerHistory/showDetails`;
      setLoading(true);
      const response = await axiosInstance.post(getUrl, JSON.stringify(body));
      if (response.status >= 200 && response.status < 300) {
        return response.data;
      } else {
        return false;
      }
    } catch (error) {
      if (error.response.data.sanctionOrderNo) {
        setSnackbar({
          children: error.response.data.sanctionOrderNo,
          severity: 'error'
        });
      } else {
        setSnackbar({
          children: 'No Data Found',
          severity: 'error'
        });
      }

      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExportPdf = () => {
    const doc = new jsPDF({ orientation: 'landscape' });
    doc.text('Ledger History', 14, 15);

    const headers = columns.filter((col) => col.field && col.headerName).map((col) => col.headerName);

    // const tableData = getLedgerReportData.map((row) =>
    //   columns.filter((col) => col.field && col.headerName).map((col) => row[col.field] ?? '')
    // );

    const tableData = getLedgerReportData.map((row) => {
      return columns
        .filter((col) => col.field && col.headerName)
        .map((col) => {
          switch (col.field) {
            case 'firstName':
              return `${row.firstName || ''} ${row.middleName || ''} ${row.lastName || ''}`.trim();
            case 'sanctionOrderNo':
              return row.sanctionOrderNo || '';
            case 'fatherHusbandName':
              return row.fatherHusName || '';
            default:
              return row[col.field] ?? '';
          }
        });
    });

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

    doc.save(`Ledger_History.pdf`);
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
      field: 'sanctionOrderNo',
      headerName: 'Sanction Order No',
      flex: 1,
      editable: false,
      renderCell: (params) => {
        const count = params.value || 0;

        return (
          <a
            title="Download"
            href={`#`}
            style={{ color: '#007bff', textDecoration: 'underline', cursor: 'pointer' }}
            onClick={(e) => {
              e.preventDefault();
              downloadDataGP(params.row.sanctionOrderNo, params.row.stateID, params.row.districtId, params.row.subDisId);
            }}
          >
            <b>{count}</b>
          </a>
        );
      }
    },

    {
      field: 'firstName',
      headerName: 'Applicant Name',
      flex: 1,
      editable: false,
      renderCell: (params) => (
        <div>
          {params.row.firstName} {params.row.middleName} {params.row.lastName}
        </div>
      )
    },
    {
      field: 'fatherHusbandName',
      headerName: 'Father/Husband Name',
      // flex:1,
      width: 155,
      editable: false
      //  renderCell: (params) => <div>{params.row.fatherHusbandName}</div>
    }
  ];
  const rows = getLedgerReportData.map((item) => ({
    status: item.applicantName,
    sanctionOrderNo: item.sanctionOrderNo,
    id: item.sanctionOrderNo,
    firstName: item.firstName,
    middleName: item.middleName,
    lastName: item.lastName,
    fatherHusbandName: item.fatherHusName,
    stateID: item.stateId,
    districtId: item.districtId,
    subDisId: item.subDisId
  }));

  async function downloadDataGP(sanctionOrder, stateCode, distCode, subDisId) {
    try {
      //alert(distrcitCode + " - "+" - "+subDistrcitCode+"  - "+gpId);
      const postUrl = '/ledgerHistory/downloadData/' + sanctionOrder + '/' + stateCode + '/' + distCode + '/' + subDisId;
      setLoading(true);
      const response = await axiosInstance.post(postUrl, {}, { responseType: 'blob' });

      const pdfBlob = new Blob([response.data], { type: 'application/pdf' });

      const currentDate =
        new Date().toISOString().slice(8, 10) + '-' + new Date().toISOString().slice(5, 7) + '-' + new Date().toISOString().slice(0, 4);
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(pdfBlob);
      link.download = `Ledger_History__${currentDate}.pdf`;
      link.click();
    } catch (e) {
      console.log('error: ', e);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <MainCard title="Ledger History Report">
        {!!snackbar && (
          <Snackbar open anchorOrigin={{ vertical: 'top', horizontal: 'center' }} onClose={handleCloseSnackbar} autoHideDuration={6000}>
            <Alert {...snackbar} onClose={handleCloseSnackbar} />
          </Snackbar>
        )}
        <Backdrop open={loading} style={{ zIndex: 999, color: '#fff' }}>
          <CircularProgress color="inherit" />
        </Backdrop>
        <form onSubmit={(e) => handleClickOpen(e)}>
          <div>
            <SubDistrictCommon ref={subDistrictCommonRef} validationLevel={'D'} onFormInputValuesChange={handleLocationValuesChange} />
          </div>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={12}>
              <Divider>
                {' '}
                <Chip label="OR SEARCH BY" />{' '}
              </Divider>
              <br />
            </Grid>
            <Grid>
              <div>
                <SearchComponent options={options} onOptionValuesChange={handleSearchOptionValuesChange} />
              </div>
            </Grid>

            <Grid item xs={12} alignItems="center">
              <Button type="submit" variant="contained" color="secondary">
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
      {getLedgerReportData.length > 0 && (
        <MainCard title="Ledger History Report">
          <DataGrid
            disableRowSelectionOnClick
            getRowId={(row) => row.sanctionOrderNo}
            slots={{ toolbar: (props) => <CustomToolbarWithExportButton {...props} handleExportPdf={handleExportPdf} /> }}
            slotProps={{
              toolbar: {
                showQuickFilter: true,
                printOptions: { disableToolbarButton: true }
              }
            }}
            rows={rows}
            columns={columns}
            // columns={columns.map((column) => ({
            //   ...column,
            //   headerStyle: { whiteSpace: 'normal',width:10 }, // Apply a class to each header cell
            // }))}
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: 15
                }
              }
            }}
            pageSizeOptions={[15]}
            // checkboxSelection
            // disableRowSelectionOnClick
          />
        </MainCard>
      )}
    </div>
  );
}
export default LedgerHistoryReport;
