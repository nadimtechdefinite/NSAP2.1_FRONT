import MainCard from 'ui-component/cards/MainCard';
import { DataGrid, GridToolbar, GridCellModes } from '@mui/x-data-grid';
import React, { useState, useEffect } from 'react';
import { Grid, Button, FormControl, Snackbar, Alert, CircularProgress, Backdrop, InputLabel, Select, MenuItem } from '@mui/material';
import axiosInstance from 'hooks/useAuthTokenUrl';
import DistrictList from 'components/form_components/DistrictList';
import { GRID_CHECKBOX_SELECTION_COL_DEF } from '@mui/x-data-grid';
import '../../../components/verification/mark-nsap-beneficiary/approveMarkBeneficiary.css';
import Alert1 from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import { useNavigate } from 'react-router-dom';
import DownloadIcon from '@mui/icons-material/Download';
import StateList from 'components/form_components/StateList';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

function NFBSBeneficiariesSanctionedReceivedBenefits() {
  const [getAllDistrict, setAllDistrict] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [snackbar, setSnackbar] = React.useState(null);
  const handleCloseSnackbar = () => setSnackbar(null);
  const [loading, setLoading] = useState(false);
  const [selectedDistrictId, setSelectedDistrict] = useState(null);
  const [selectScheme, setSelectScheme] = useState('');
  const navigate = useNavigate();
  const [flag, setFlag] = useState(false);

  function cancelValue() {
    navigate('/nsap/dashboard/default');
  }

  const downloadDataInExcel = async (districtCode, yearCode, monthCode) => {
    event.preventDefault();
    const body = { districtCode: districtCode, year: yearCode, month: parseInt(monthCode) };
    try {
      setLoading(true);
      var urlData = '/nfbs-beneficiaries-sanctioned-received-benefits/getNFBSBeneficiariesSanctionedReceivedBenefitsExcel';
      const response = await axiosInstance.post(urlData, body, {
        responseType: 'blob'
      });

      if (response.status == 204) {
        setSnackbar({ children: 'No Data Available', severity: 'error' });
        return false;
      }
      const blob = new Blob([response.data], { type: 'application/octet-stream' });
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      var title = 'NFBS Beneficiaries Who Got Sanctioned And Received Benefits';
      const currentDate =
        new Date().toISOString().slice(8, 10) + '-' + new Date().toISOString().slice(5, 7) + '-' + new Date().toISOString().slice(0, 4);
      link.download = `${title}_${currentDate}.xlsx`;
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

  useEffect(() => {}, []);

  const handleExportPdf = () => {
    const doc = new jsPDF({ orientation: 'landscape' });
    doc.text('NFBS Beneficiaries Who Got Sanctioned And Received Benefits', 14, 15);

    const headers = columns.filter((col) => col.field && col.headerName).map((col) => col.headerName);
    const tableData = getAllDistrict.map((row) => columns.filter((col) => col.field && col.headerName).map((col) => row[col.field] ?? ''));

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
        doc.text('Powered By NSAP-PPS - Delivering Reliable Pension Processing', 14, pageHeight - 15);
        doc.text(`Generated From - https://nsap.nic.in/ on - ${generatedDate}`, 14, pageHeight - 10);
      }
    });

    doc.save(`NFBS_Sanctioned_Received_benefits_${selectedDistrictId}.pdf`);
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
      field: 'serialNumber',
      headerName: 'Sr No',
      width: '110',
      editable: false,
      disableColumnMenu: true,
      headerClassName: 'bkColr'
    },
    {
      field: 'districtName',
      headerName: 'District Name',
      width: '350',
      editable: false,
      disableColumnMenu: true,
      headerClassName: 'bkColr'
    },

    {
      field: 'year',
      headerName: 'Year',
      flex: 1,
      editable: false,
      disableColumnMenu: true,
      headerClassName: 'bkColr'
    },

    {
      field: 'monthName',
      headerName: 'Month Name',
      flex: 1,
      editable: false,
      disableColumnMenu: true,
      headerClassName: 'bkColr'
    },

    {
      field: 'totalAmount',
      headerName: 'Total Amount',
      flex: 1,
      editable: false,
      disableColumnMenu: true,
      headerClassName: 'bkColr'
    },
    {
      field: 'totalBeneficiary',
      headerName: 'Total Beneficiary',
      flex: 1,
      editable: false,
      disableColumnMenu: true,
      headerClassName: 'bkColr',
      renderCell: (params) => {
        if (params.value > 0) {
          return (
            <a
              title="Download"
              href={`#`}
              style={{ color: 'blue', textDecoration: 'none', cursor: 'pointer' }}
              onClick={(e) => {
                e.preventDefault();
                downloadDataInExcel(params.row.districtCode, params.row.year, params.row.monthCode);
              }}
            >
              <b>
                {params.value} <DownloadIcon style={{ marginLeft: '-6px', verticalAlign: 'middle', fontSize: '19px' }} />
              </b>
            </a>
          );
        } else {
          return params.value;
        }
      }
    }
  ];

  const columnsWithCheckbox = React.useMemo(
    () => [
      ...columns,
      {
        ...GRID_CHECKBOX_SELECTION_COL_DEF
      }
    ],
    [columns]
  );

  const handleSelectDistrict = (selectedDistrictId) => {
    setSelectedDistrict(selectedDistrictId);
  };

  const handleClickOpen = (e) => {
    e.preventDefault();
    fetchData()
      .then((res) => {
        if (res) {
          const districtData = res || [];
          setAllDistrict(districtData);
          console.log(res);
        } else {
          setAllDistrict([]);
          return false;
        }
      })
      .catch((e) => {
        console.log(e.message);
      });
  };

  const useFakeMutation = () => {
    return React.useCallback(
      (updatedRow) =>
        new Promise((resolve, reject) => {
          setTimeout(() => {
            if (updatedRow.id?.trim() === '') {
              reject(new Error("Error: District Name can't be empty."));
            } else {
              resolve({ ...updatedRow, id: updatedRow.id?.toUpperCase() });
            }
          }, 200);
        }),
      []
    );
  };
  const handleProcessRowUpdateError = React.useCallback((error) => {
    setSnackbar({ children: error.message, severity: 'error' });
  }, []);
  const mutateRow = useFakeMutation();

  const fetchData = async () => {
    try {
      var location = { districtID: selectedDistrictId, finYear: selectScheme };
      var body = { ...location };
      const getUrl = `/nfbs-beneficiaries-sanctioned-received-benefits/getNFBSBeneficiariesSanctionedReceivedBenefits`;
      setLoading(true);
      setFlag(true);
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
  };

  const handleSelectionChange = (newSelection) => {
    setSelectedRows(newSelection);
  };

  const rows = getAllDistrict.map((item, index) => ({
    id: item.counter,
    serialNumber: index + 1,
    districtCode: item.districtCode,
    districtName: item.districtName,
    year: parseFloat(item.year.toString().replace(/\..*$/, '')),
    monthName: item.monthName,
    monthCode: item.month,
    totalAmount: item.totalAmount,
    totalBeneficiary: item.totalBeneficiary
  }));
  const processRowUpdate = React.useCallback(
    async (updatedRow) => {
      try {
        const updatedRowData = await mutateRow(updatedRow);
        setAllDistrict((prevRows) => {
          const rowIndex = prevRows.findIndex((row) => row.id === updatedRowData.id);
          const updatedRows = [...prevRows];

          updatedRows[rowIndex] = {
            ...updatedRows[rowIndex]
          };
          return updatedRows;
        });
        return updatedRowData;
      } catch (error) {
        console.error('Error updating row:', error);
        setSnackbar({ children: error.message, severity: 'error' });
        throw error;
      }
    },
    [mutateRow, getAllDistrict, setSnackbar, selectedRows]
  );

  const handleFormSubmit = async (e) => {
    e.preventDefault();
  };
  const [cellModesModel, setCellModesModel] = React.useState({});

  const handleCellClick = React.useCallback((params, event) => {
    if (!params.isEditable) {
      return;
    }

    if (event.target.nodeType === 1 && !event.currentTarget.contains(event.target)) {
      return;
    }

    setCellModesModel((prevModel) => {
      return {
        ...Object.keys(prevModel).reduce(
          (acc, id) => ({
            ...acc,
            [id]: Object.keys(prevModel[id]).reduce(
              (acc2, field) => ({
                ...acc2,
                [field]: { mode: GridCellModes.View }
              }),
              {}
            )
          }),
          {}
        ),
        [params.id]: {
          ...Object.keys(prevModel[params.id] || {}).reduce((acc, field) => ({ ...acc, [field]: { mode: GridCellModes.View } }), {}),
          [params.field]: { mode: GridCellModes.Edit }
        }
      };
    });
  }, []);
  const handleCellModesModelChange = React.useCallback((newModel) => {
    setCellModesModel(newModel);
  }, []);

  const [stateId, setstateId] = useState([]);

  const handleSelectState = (state) => {
    setstateId(state);
  };

  return (
    <div>
      <MainCard title="NFBS Beneficiaries Who Got Sanctioned And Received Benefits">
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
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <StateList onSelectState={handleSelectState} isMandatory={true} />
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <DistrictList selectedStateId={stateId} onSelectDistrict={handleSelectDistrict} />
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <InputLabel id="year-name">Year </InputLabel>
                <Select
                  labelId="year-name"
                  id="schemeCode"
                  label="Year"
                  name="schemeCode"
                  onChange={(event) => setSelectScheme(event.target.value)}
                >
                  <MenuItem value="0">-- Select Year --</MenuItem>
                  <MenuItem value="2018">2018</MenuItem>
                  <MenuItem value="2019">2019</MenuItem>
                  <MenuItem value="2020">2020</MenuItem>
                  <MenuItem value="2021">2021</MenuItem>
                  <MenuItem value="2022">2022</MenuItem>
                  <MenuItem value="2023">2023</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={4}>
              <Button type="submit" variant="contained" color="secondary" title="Submit" style={{ marginTop: '5px' }}>
                Submit
              </Button>
              &nbsp;&nbsp;
              <Button
                type="submit"
                variant="contained"
                color="primary"
                onClick={() => {
                  cancelValue();
                }}
                style={{ marginTop: '5px' }}
                title="Cancel"
              >
                Cancel
              </Button>
            </Grid>
          </Grid>
        </form>
      </MainCard>

      {getAllDistrict.length > 0 ? (
        <>
          <form onSubmit={handleFormSubmit}>
            <MainCard>
              <DataGrid
                disableRowSelectionOnClick
                getRowId={(row) => row.id}
                slots={{ toolbar: (props) => <CustomToolbarWithExportButton {...props} handleExportPdf={handleExportPdf} /> }}
                slotProps={{
                  toolbar: {
                    showQuickFilter: true,
                    printOptions: { disableToolbarButton: true }
                  }
                }}
                columns={columnsWithCheckbox}
                rows={rows}
                cellModesModel={cellModesModel}
                onCellModesModelChange={handleCellModesModelChange}
                onCellClick={handleCellClick}
                processRowUpdate={processRowUpdate}
                onProcessRowUpdateError={handleProcessRowUpdateError}
                onRowSelectionModelChange={handleSelectionChange}
                initialState={{
                  pagination: {
                    paginationModel: {
                      pageSize: 15
                    }
                  }
                }}
                pageSizeOptions={[15]}
              />
            </MainCard>
            <Stack sx={{ width: '100%' }} spacing={2}>
              <Alert1 variant="filled" severity="warning" className={'blinking'} style={{ color: 'red' }}>
                Note: This report include only <b style={{ color: 'blue' }}>NFBS</b> scheme data.
              </Alert1>
            </Stack>
          </form>
        </>
      ) : (
        <div>{flag == true ? <span style={{ display: 'block', textAlign: 'center', color: 'red' }}>No Data Available.</span> : ''}</div>
      )}
    </div>
  );
}
export default NFBSBeneficiariesSanctionedReceivedBenefits;
