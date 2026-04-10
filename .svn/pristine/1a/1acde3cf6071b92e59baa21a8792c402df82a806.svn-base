import MainCard from 'ui-component/cards/MainCard';
import { DataGrid, GridToolbar, GridCellModes } from '@mui/x-data-grid';
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
  FormHelperText,
  Typography
} from '@mui/material';
import axiosInstance from 'hooks/useAuthTokenUrl';
import StateList from 'components/form_components/StateList';
import DistrictList from 'components/form_components/DistrictList';
import SubDistrictList from 'components/form_components/SubDistrictList';
import AreaList from 'components/form_components/AreaList';
import { GRID_CHECKBOX_SELECTION_COL_DEF } from '@mui/x-data-grid';
import '../../../components/verification/mark-nsap-beneficiary/approveMarkBeneficiary.css';
import messages_en from '../../../components/common/messages_en.json';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import { useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import Stack from '@mui/material/Stack';

function ComputationAndDBTPaymentStatus() {
  const [getAllDistrict, setAllDistrict] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectedStateId, setSelectedState] = useState('');
  const [snackbar, setSnackbar] = React.useState(null);
  const handleCloseSnackbar = () => setSnackbar(null);
  const [loading, setLoading] = useState(false);
  const [selectedDistrictId, setSelectedDistrict] = useState(null);
  const [selectedAreaId, setSelectedArea] = useState(null);
  const [selectedSubDistrictId, setSelectedSubDistrict] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [yearData, setYearData] = useState([]);
  const [monthData, setMonthData] = useState([]);
  const [selectScheme, setSelectScheme] = useState('');
  const [monthNameData, setMonthNameData] = useState('');
  const [searchOption, setSearchOption] = React.useState(null);

  const navigate = useNavigate();

  function cancelValue() {
    navigate('/nsap/dashboard/default');
  }

  const getSchemeData = async () => {
    try {
      const getYearData = '/computation-and-dbt-payment-status/getYearData';
      setLoading(true);
      const response = await axiosInstance.get(getYearData);
      setYearData(response.data);
    } catch (error) {
      console.error('Error fetching in year data :', error);
    } finally {
      setLoading(false);
    }
  };

  const callMonthData = (e) => {
    getMonthData(e);
  };

  const getMonthData = async (yr) => {
    try {
      const getMonthData = '/computation-and-dbt-payment-status/getMonthData/' + yr;
      setLoading(true);
      const response = await axiosInstance.get(getMonthData);
      setMonthData(response.data);
    } catch (error) {
      console.error('Error fetching in month data :', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOptionStatusChange = (event) => {
    setSearchOption(event.target.value);
  };

  const downloadDataInExcel = async (code, finYear, monthData, searchOpt, columnDetails) => {
    event.preventDefault();
    const body = {
      disParam: code,
      finYearData: finYear,
      monthNumber: monthData,
      searchValue: searchOpt,
      dwnParameter: columnDetails,
      districtCode: selectedDistrictId,
      area: selectedAreaId,
      subDistrictMunicipalCode: selectedSubDistrictId
    };
    try {
      setLoading(true);
      var urlData = '/computation-and-dbt-payment-status/getComputationAndDbtPaymentStatusInExcel';
      const response = await axiosInstance.post(urlData, body, {
        responseType: 'blob'
      });

      if (response.status == 204) {
        // alert("No Data Available");
        setSnackbar({ children: 'No Data Available', severity: 'error' });
        return false;
      }

      const blob = new Blob([response.data], { type: 'application/octet-stream' });
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      var title = 'Computation_And_Dbt_Payment_Status_Report';
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

  useEffect(() => {
    getSchemeData();
  }, []);

  const handleExportPdf = () => {
    const doc = new jsPDF({ orientation: 'landscape' });
    doc.text('Computation Dbt Payment Status Report', 14, 15);

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
        doc.text(
          `Powered By NSAP-PPS - Delivering Reliable Pension Processing - https://nsap.nic.in/ on - ${generatedDate}`,
          14,
          pageHeight - 10
        );
      }
    });

    doc.save(`Computation_DBT_Payment_Status.pdf`);
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
      field: 'id',
      headerName: 'Sr No',
      flex: 1,
      editable: false,
      disableColumnMenu: true,
      headerClassName: 'bkColr'
    },
    {
      field: 'districtName',
      headerName: 'Name',
      flex: 1,
      editable: false,
      disableColumnMenu: true,
      headerClassName: 'bkColr'
    },
    {
      field: 'fromPensioner',
      headerName: 'Total Beneficiary',
      flex: 1,
      editable: false,
      disableColumnMenu: true,
      headerClassName: 'bkColr'
    },

    {
      field: 'dbt',
      headerName: 'DBT / DBT SUCCESS',
      flex: 1,
      editable: false,
      disableColumnMenu: true,
      headerClassName: 'bkColr',
      renderCell: (params) => {
        const count = params.value || 0;
        if (count === 0 || count === '0') {
          return <span style={{ color: 'black' }}> {count} </span>;
        } else {
          return (
            <a
              title="Download"
              href={`#`}
              style={{ color: '#007bff', textDecoration: 'underline', cursor: 'pointer' }}
              onClick={(e) => {
                e.preventDefault();
                downloadDataInExcel(rows.districtCode, selectScheme, monthNameData, searchOption, 'dbt');
              }}
            >
              <b>{count}</b>
            </a>
          );
        }
      }
    },
    {
      field: 'nonDbt',
      headerName: 'Non DBT / DBT FAILED',
      flex: 1,
      editable: false,
      disableColumnMenu: true,
      headerClassName: 'bkColr',
      renderCell: (params) => {
        const count = params.value || 0;
        if (count === 0 || count === '0') {
          return <span style={{ color: 'black' }}> {count} </span>;
        } else {
          return (
            <a
              title="Download"
              href={`#`}
              style={{ color: '#007bff', textDecoration: 'underline', cursor: 'pointer' }}
              onClick={(e) => {
                e.preventDefault();
                downloadDataInExcel(rows.districtCode, selectScheme, monthNameData, searchOption, 'nondbt');
              }}
            >
              <b>{count}</b>
            </a>
          );
        }
      }
    },

    {
      field: 'failure',
      headerName: 'Failed / Non DBT',
      flex: 1,
      editable: false,
      disableColumnMenu: true,
      headerClassName: 'bkColr',
      renderCell: (params) => {
        const count = params.value || 0;
        if (count === 0 || count === '0') {
          return <span style={{ color: 'black' }}> {count} </span>;
        } else {
          return (
            <a
              title="Download"
              href={`#`}
              style={{ color: '#007bff', textDecoration: 'underline', cursor: 'pointer' }}
              onClick={(e) => {
                e.preventDefault();
                downloadDataInExcel(params.row.districtCode, selectScheme, monthNameData, searchOption, 'failed');
              }}
            >
              <b>{count}</b>
            </a>
          );
        }
      }
    }
  ];

  const validateForm = () => {
    const errors = {};

    if (!selectScheme) {
      errors.selectScheme = messages_en.yearFeildRequired;
    }
    if (!monthNameData) {
      errors.monthNameData = messages_en.monthFeildRequired;
    }
    if (!selectedDistrictId) {
      errors.selectedDistrictId = messages_en.districtRequired;
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const columnsWithCheckbox = React.useMemo(
    () => [
      ...columns,
      {
        ...GRID_CHECKBOX_SELECTION_COL_DEF
      }
    ],
    [columns]
  );

  const handleSelectState = (state) => {
    setSelectedState(state);
  };

  const handleSelectDistrict = (selectedDistrictId) => {
    setSelectedDistrict(selectedDistrictId);
    setSelectedArea(null);
    setSelectedSubDistrict(null);
    setFormErrors((prevErrors) => {
      const updatedErrors = { ...prevErrors };
      delete updatedErrors.selectedDistrictId;
      return updatedErrors;
    });
  };

  const handleSelectArea = (selectedAreaId) => {
    setSelectedArea(selectedAreaId);
    setSelectedSubDistrict(null);
  };

  const handleSelectSubDistrict = (selectedSubDistrictId) => {
    setSelectedSubDistrict(selectedSubDistrictId);
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
    const isFormValid = validateForm();
    if (isFormValid) {
      if (searchOption === null) {
        setSnackbar({ children: 'Select One Option between Computation Status OR Payment Status', severity: 'error' });
        return false;
      } else {
        try {
          if (selectedAreaId !== null) {
            if (selectedSubDistrictId === null) {
              alert('Please Select Sub-District also');
              return false;
            } else {
              try {
                var locationOne = {
                  stateID: selectedStateId,
                  districtID: selectedDistrictId,
                  area: selectedAreaId,
                  subDistID: selectedSubDistrictId,
                  finYear: selectScheme,
                  computedMonth: monthNameData,
                  searchValue: searchOption
                };
                console.log(locationOne.finYear);
                var bodyOne = { ...locationOne };
                const getUrl = `/computation-and-dbt-payment-status/getComputationAndDbtPaymentStatus`;
                setLoading(true);
                const response = await axiosInstance.post(getUrl, JSON.stringify(bodyOne));
                if (response.status >= 200 && response.status < 300) {
                  if (response.data.length > 0) {
                    return response.data;
                  } else {
                    setSnackbar({ children: 'No Data Found!', severity: 'error' });
                  }
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

          var location = {
            stateID: selectedStateId,
            districtID: selectedDistrictId,
            area: selectedAreaId,
            subDistID: selectedSubDistrictId,
            finYear: selectScheme,
            computedMonth: monthNameData,
            searchValue: searchOption
          };
          var body = { ...location };
          const getUrl = `/computation-and-dbt-payment-status/getComputationAndDbtPaymentStatus`;
          setLoading(true);
          const response = await axiosInstance.post(getUrl, JSON.stringify(body));
          if (response.status >= 200 && response.status < 300) {
            if (response.data.length > 0) {
              return response.data;
            } else {
              setSnackbar({ children: 'No Data Found!', severity: 'error' });
            }
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

  const handleSelectionChange = (newSelection) => {
    setSelectedRows(newSelection);
  };

  const rows = getAllDistrict.map((item) => ({
    id: item.counter,
    districtName: item.districtName,
    districtCode: item.districtCode,
    fromPensioner: item.fromPensioner,
    disbursmentpensioner: item.disbursmentpensioner,
    dbt: item.dbt,
    nonDbt: item.nonDbt,
    failure: item.failure,
    headerVal: item.header,
    srhVal: item.searchStatus
  }));

  // dynamic column hide/show
  const firstRow = rows[0];
  const srhValTest = firstRow ? firstRow.srhVal : null;
  if (srhValTest === 'computation') {
    columns[3].headerName = 'DBT';
    columns[4].headerName = 'Non DBT';
    columns[5].headerName = 'Failed';
  } else {
    columns[3].headerName = 'DBT SUCCESS';
    columns[4].headerName = 'DBT FAILED';
    columns[5].headerName = 'Non DBT';
  }

  const processRowUpdate = React.useCallback(
    async (updatedRow) => {
      try {
        const updatedRowData = await mutateRow(updatedRow);
        setAllDistrict((prevRows) => {
          const rowIndex = prevRows.findIndex((row) => row.id === updatedRowData.id);
          const updatedRows = [...prevRows];
          handleChangeVer(true, updatedRowData.sanctionData);
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
  return (
    <div>
      <MainCard title="Computation Dbt Payment status Report">
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
                <StateList onSelectState={handleSelectState} />
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={3}>
              <FormControl fullWidth>
                <DistrictList
                  selectedStateId={selectedStateId}
                  setSelectedDistrict={setSelectedDistrict}
                  onSelectDistrict={handleSelectDistrict}
                />
                {formErrors.selectedDistrictId && (
                  <FormHelperText>
                    <Typography style={{ color: 'red', fontSize: '0.8rem' }}>{formErrors.selectedDistrictId}</Typography>
                  </FormHelperText>
                )}
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
                <InputLabel id="year-name">
                  Year <span style={{ color: 'red' }}>*</span>
                </InputLabel>
                <Select
                  labelId="year-name"
                  id="finYear"
                  label="Year Name"
                  name="finYear"
                  value={selectScheme}
                  onChange={(event) => {
                    setSelectScheme(event.target.value);
                    callMonthData(event.target.value);
                    setFormErrors((prevErrors) => {
                      const updatedErrors = { ...prevErrors };
                      delete updatedErrors.selectScheme;
                      return updatedErrors;
                    });
                  }}
                >
                  {yearData.map((item) => (
                    <MenuItem key={item} value={parseInt(item)}>
                      {parseInt(item)}
                    </MenuItem>
                  ))}
                </Select>
                {formErrors.selectScheme && (
                  <FormHelperText>
                    <Typography style={{ color: 'red', fontSize: '0.8rem' }}>{formErrors.selectScheme}</Typography>
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={3}>
              <FormControl fullWidth>
                <InputLabel id="month-name">
                  Month <span style={{ color: 'red' }}>*</span>
                </InputLabel>
                <Select
                  labelId="month-name"
                  id="monthNumber"
                  label="Month Name"
                  name="monthNumber"
                  value={monthNameData}
                  onChange={(event) => {
                    setMonthNameData(event.target.value);
                    setFormErrors((prevErrors) => {
                      const updatedErrors = { ...prevErrors };
                      delete updatedErrors.monthNameData;
                      return updatedErrors;
                    });
                  }}
                >
                  {monthData.map((item) => (
                    <MenuItem key={item.monthNumber} value={parseInt(item.monthNumber)}>
                      {item.monthName}
                    </MenuItem>
                  ))}
                </Select>
                {formErrors.monthNameData && (
                  <FormHelperText>
                    <Typography style={{ color: 'red', fontSize: '0.8rem' }}>{formErrors.monthNameData}</Typography>
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>

            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <RadioGroup
                  style={{ marginLeft: '10px', marginTop: '2px' }}
                  row
                  aria-label="searchOption"
                  name="searchOption"
                  value={searchOption}
                  onChange={handleOptionStatusChange}
                >
                  <FormControlLabel value="computation" control={<Radio />} label="Check Computation Status" />
                  <FormControlLabel value="payment" control={<Radio />} label="Check Payment Status" />
                </RadioGroup>
              </Grid>
            </Grid>

            <Grid item xs={12} alignItems="center">
              <Button type="submit" variant="contained" color="secondary" title="Submit">
                Submit
              </Button>
              &nbsp;
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

      {getAllDistrict.length > 0 ? (
        <>
          <form onSubmit={handleFormSubmit}>
            <MainCard>
              <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap' }}>
                {/* <kbd className="responsive-kbd">Year :  {selectScheme }</kbd> */}
                {/* <kbd className="responsive-kbd">Month : {parseInt(monthNameData)}</kbd> */}
                <kbd className="responsive-kbd">{rows[0].headerVal}</kbd>
              </div>

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
          </form>
        </>
      ) : (
        <div></div>
      )}
    </div>
  );
}
export default ComputationAndDBTPaymentStatus;
