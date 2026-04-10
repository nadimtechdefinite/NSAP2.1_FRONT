import React, { useState, useEffect } from 'react';
import { DataGrid, GridToolbar, GridCellModes } from '@mui/x-data-grid';
import { Button, Box, Grid, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import axiosInstance from 'hooks/useAuthTokenUrl';
import MainCard from 'ui-component/cards/MainCard';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import Backdrop from '@mui/material/Backdrop';
import jsPDF from 'jspdf';
console.log('jsPDF import:', jsPDF);
import autoTable from 'jspdf-autotable';

const MonthlyProgressReport2 = () => {
  const [mprData, setMprData] = useState([]);

  const [snackbar, setSnackbar] = React.useState(null);
  const handleCloseSnackbar = () => setSnackbar(null);
  const [loading, setLoading] = useState(false);
  const [cellModesModel, setCellModesModel] = React.useState({});

  const [monthData, setMonthData] = useState([]);
  const [yearData, setYearData] = useState([]);
  const [month, setSelectedMonth] = useState('');
  const [year, setSelectedYear] = useState('');
  const [isFrozen, setIsFrozen] = useState(false);
  const [statusDownload, setStatusDownload] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [showDownloadButton, setShowDownloadButton] = useState(false);

  React.useEffect(() => {
    if (statusDownload.trim() === 'MPR2 is frozen and cannot be edited. Available for download.') {
      setOpenSnackbar(true);
    } else {
      setShowDownloadButton(false);
    }
  }, [statusDownload]);

  const handleSnackbarClose = () => {
    setOpenSnackbar(false);
    setShowDownloadButton(true);
  };
  const handleExportPdf = () => {
    const doc = new jsPDF();

    doc.text('Monthly Progress Report 2', 14, 15);

    // Extract headers from your existing columns
    const headers = columns
      .filter((col) => col.field && col.headerName) // skip actions or hidden ones
      .map((col) => col.headerName);

    // Extract row values from existing mprData
    const data = mprData.map((row) => columns.filter((col) => col.field && col.headerName).map((col) => row[col.field] ?? ''));
    const generatedDate = new Date().toLocaleDateString('en-IN');

    autoTable(doc, {
      startY: 20,
      head: [headers],
      body: data,
      styles: {
        fontSize: 8,
        cellPadding: 2
      },
      headStyles: {
        fillColor: [33, 150, 243],
        textColor: 255
      },
      didDrawPage: function (data) {
        const pageHeight = doc.internal.pageSize.height;
        doc.setFontSize(8);
        doc.setTextColor(100);
        doc.text('Powered By NSAP-PPS - Delivering Reliable Pension Processing', 14, pageHeight - 15);
        doc.text(`Generated From - https://nsap.nic.in/ on - ${generatedDate}`, 14, pageHeight - 10);
        console.log(data);
      }
    });

    doc.save(`MPR2_Report_${month}_${year}.pdf`);
  };

  const getMonths = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('MPR/getMonths');
      if (response.status == 204) {
        setSnackbar({ children: 'No Data Available', severity: 'error' });
        return false;
      }
      const newData = response.data.map((row) => ({ ...row, id: row.monthName }));
      setMonthData(newData);
    } catch (error) {
      setSnackbar({ children: 'Some Internal Error Occured While Getting Months', severity: 'error' });
      console.error('Error fetching Getting Months', error);
    } finally {
      setLoading(false);
    }
  };

  const getYears = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('MPR/getYears');
      if (response.status == 204) {
        setSnackbar({ children: 'No Data Available', severity: 'error' });
        return false;
      }
      const newData = response.data.map((row) => ({ ...row, id: row.year }));
      setYearData(newData);
    } catch (error) {
      setSnackbar({ children: 'Some Internal Error Occured While Getting Months', severity: 'error' });
      console.error('Error fetching Getting Months', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    try {
      const response = await axiosInstance.get(`/MPR/downloadPdf2/${year}/${month}?downloadStatus=true`, {
        responseType: 'blob'
      });

      if (response.data) {
        const pdfBlob = new Blob([response.data], { type: 'application/pdf' });
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(pdfBlob);
        link.download = `Monthly_Progress_Report2_${month}_${year}.pdf`;
        link.click();
      }
    } catch (error) {
      console.error('Error downloading PDF:', error);
    }
  };

  const checkMPR2Uploaded = async () => {
    if (year === '' || month === '') {
      setSnackbar({ children: 'Please select MONTH and YEAR both', severity: 'error' });
      return false;
    }
    try {
      setMprData([]);
      setLoading(true);

      const response = await axiosInstance.get(`MPR/checkMPR2/${year}/${month}`);
      setStatusDownload(response.data.status);
      console.log('download status', response.data.status);
      if (response.data.status.includes('frozen')) {
        setSnackbar({ children: response.data.status, severity: 'warning' });
        setIsFrozen(true);
        return;
      }

      if (response.data.data.length > 0) {
        setMprData(response.data.data.map((row) => ({ ...row, id: row.schemeCode })));
        setSnackbar({ children: response.data.status, severity: 'success' });
        setIsFrozen(false);
      } else {
        setSnackbar({ children: response.data.status, severity: 'info' });
        setIsFrozen(false);
      }
    } catch (error) {
      setSnackbar({ children: response.data.status, severity: 'error' });
      console.error('Error fetching MPR Uploaded Details', error);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { field: 'schemeCode', headerName: 'Scheme ', width: 100 },
    {
      field: 'totalNumberOfBeneficiaries',
      headerName: 'Total Number of Beneficiaries',

      flex: 1,
      renderCell: (params) => (
        <input
          type="number"
          value={params.value}
          onChange={(e) => updateValue(params.id, e, 'totalNumberOfBeneficiaries')}
          min={0}
          maxLength={20}
        />
      )
    },
    {
      field: 'noOfBeneficiariesReceivedPension',
      headerName: 'Number of Beneficiaries Received Pension',

      renderCell: (params) => (
        <input
          type="number"
          value={params.value}
          onChange={(e) => updateValue(params.id, e, 'noOfBeneficiariesReceivedPension')}
          min={0}
          maxLength={20}
        />
      ),
      flex: 1
    },
    {
      field: 'noOfBeneficiariesNotReceivedPension',
      headerName: 'Number of Beneficiaries Not Received Pension',

      renderCell: (params) => (
        <input
          type="number"
          value={params.value}
          onChange={(e) => updateValue(params.id, e, 'noOfBeneficiariesNotReceivedPension')}
          min={0}
          maxLength={20}
        />
      ),
      flex: 1
    }
  ];

  const updateValue = (id, e, fieldName) => {
    let value = parseInt(e.target.value) || 0;
    if (fieldName === 'totalNumberOfBeneficiaries') {
      setMprData((prevRows) =>
        prevRows.map((row) => (row.schemeCode === id ? { ...row, totalNumberOfBeneficiaries: value === '' ? 0 : value } : row))
      );
    } else if (fieldName === 'noOfBeneficiariesReceivedPension') {
      setMprData((prevRows) =>
        prevRows.map((row) => (row.schemeCode === id ? { ...row, noOfBeneficiariesReceivedPension: value === '' ? 0 : value } : row))
      );
    } else if (fieldName === 'noOfBeneficiariesNotReceivedPension') {
      setMprData((prevRows) =>
        prevRows.map((row) => (row.schemeCode === id ? { ...row, noOfBeneficiariesNotReceivedPension: value === '' ? 0 : value } : row))
      );
    }
  };

  const handleFormSubmit = async (e, isFinalSubmit = false) => {
    e.preventDefault();

    let flag = false;
    for (let i = 0; i < mprData.length; i++) {
      const s = mprData[i];
      const total =
        parseInt(s.totalNumberOfBeneficiaries) -
        (parseInt(s.noOfBeneficiariesReceivedPension) + parseInt(s.noOfBeneficiariesNotReceivedPension));

      if (total !== 0) {
        flag = true;
        setSnackbar({
          children: `Total no of beneficiaries does not match received + not received for scheme ${s.schemeCode}`,
          severity: 'error'
        });
        return false;
      }
    }

    if (flag) return;

    try {
      setLoading(true);

      const updatedData = mprData.map((s) => ({
        ...s,
        year: year,
        month: month
      }));

      console.log('Submitting Data:', updatedData);

      const response = await axiosInstance.post(`MPR/saveMPR2?downloadStatus=${isFinalSubmit}`, updatedData, {
        headers: { 'Content-Type': 'application/json' }
      });
      if (response.status === 200) {
        setSnackbar({ children: response.data, severity: 'success' });

        setTimeout(() => {
          checkMPR2Uploaded();
        }, 3000);
      } else {
        setSnackbar({ children: response.data, severity: 'error' });
      }
    } catch (error) {
      console.error('Error submitting MPR2:', error);
      setSnackbar({ children: 'Some Internal Error Occurred', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const useFakeMutation = () => {
    return React.useCallback(
      (updatedRow) =>
        new Promise((resolve, reject) => {
          setTimeout(() => {
            if (
              updatedRow.totalNumberOfBeneficiaries?.trim() === '' ||
              updatedRow.noOfBeneficiariesReceivedPension === '' ||
              updatedRow.noOfBeneficiariesNotReceivedPension === ''
            ) {
              reject(new Error("Error:Field can't be empty."));
            } else {
              resolve({
                ...updatedRow,
                totalNumberOfBeneficiaries: updatedRow.totalNumberOfBeneficiaries,
                noOfBeneficiariesReceivedPension: updatedRow.noOfBeneficiariesReceivedPension,
                noOfBeneficiariesNotReceivedPension: updatedRow.noOfBeneficiariesNotReceivedPension
              });
            }
          }, 200);
        }),
      []
    );
  };

  const mutateRow = useFakeMutation();

  const processRowUpdate = React.useCallback(
    async (updatedRow) => {
      try {
        const updatedRowData = await mutateRow(updatedRow);

        setMprData((prevRows) => {
          const rowIndex = prevRows.findIndex((row) => row.schemeCode === updatedRowData.schemeCode);

          const updatedRows = [...prevRows];
          updatedRows[rowIndex] = {
            ...updatedRows[rowIndex],

            totalNumberOfBeneficiaries: updatedRowData.totalNumberOfBeneficiaries,
            noOfBeneficiariesReceivedPension: updatedRowData.noOfBeneficiariesReceivedPension,
            noOfBeneficiariesNotReceivedPension: updatedRowData.noOfBeneficiariesNotReceivedPension,
            year: { year },
            month: { month }
          };

          return updatedRows;
        });
        return updatedRowData;
      } catch (error) {
        console.error('Error updating row:', error);
        throw error;
      }
    },
    [mutateRow, setMprData]
  );

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

  const handleMonthChange = (e) => {
    setSelectedMonth(e.target.value);
  };

  const handleYearChange = (e) => {
    setSelectedYear(e.target.value);
  };

  useEffect(() => {
    getMonths();
    getYears();
  }, []);

  useEffect(() => {
    if (year != '' && month != '') {
      checkMPR2Uploaded();
    }
  }, [year, month]);

  return (
    <>
      <MainCard title="Monthly Progress Report 2">
        {!!snackbar && (
          <Snackbar
            open
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            onClose={handleCloseSnackbar}
            autoHideDuration={snackbar.severity === 'warning' && snackbar.children.includes('Final Submit') ? null : 18000}
          >
            <Alert
              severity={snackbar.severity}
              onClose={handleCloseSnackbar}
              action={
                <Button color="inherit" size="small" onClick={handleCloseSnackbar}>
                  OK
                </Button>
              }
              sx={{
                bgcolor:
                  snackbar.children && snackbar.children.includes('Final Submit')
                    ? '#f5d157'
                    : snackbar.severity === 'success'
                    ? '#f5d157'
                    : snackbar.severity === 'error'
                    ? '#FFB300'
                    : snackbar.severity === 'info'
                    ? '#2196F3'
                    : snackbar.severity === 'warning'
                    ? '#FF9800'
                    : 'inherit',
                color: '#000',
                fontWeight: snackbar.children && snackbar.children.includes('Final Submit') ? 'bold' : 'normal'
              }}
            >
              {snackbar.children}
            </Alert>
          </Snackbar>
        )}

        <Backdrop open={loading} style={{ zIndex: 999, color: '#fff' }}>
          <CircularProgress color="inherit" />
        </Backdrop>

        <Box justifyContent="space-between" marginBottom={2}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <InputLabel id="month-label">Month</InputLabel>
                <Select name="month" label="Month" labelId="month-label" onChange={handleMonthChange} required>
                  {monthData.map((item) => (
                    <MenuItem key={item.monthName} value={item.monthName}>
                      {item.monthName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <InputLabel id="year-label">Year</InputLabel>
                <Select name="year" label="year" labelId="year-label" onChange={handleYearChange} required>
                  {yearData.map((item) => (
                    <MenuItem key={item.year} value={item.year}>
                      {item.year}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Snackbar open={openSnackbar} autoHideDuration={null} onClose={handleSnackbarClose}>
              <Alert onClose={handleSnackbarClose} severity="info" sx={{ width: '100%' }}>
                {statusDownload}
              </Alert>
            </Snackbar>
            <Grid item xs={12} sm={3.5} display="flex" justifyContent="Right">
              {showDownloadButton && (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleDownload}
                  size="small"
                  sx={{
                    boxShadow: 'none',
                    '&:hover': { boxShadow: 'none' }
                  }}
                >
                  Download Report
                </Button>
              )}
            </Grid>
            {/* <Grid item xs={12} sm={3.5} display="flex" justifyContent="Right">
              <Button
                variant="contained"
                color="primary"
                onClick={handleDownload}
                disabled={statusDownload.trim() !== 'MPR2 is frozen and cannot be edited. Available for download.'}
                size="small"
                sx={{
                  boxShadow: 'none',
                  '&:hover': { boxShadow: 'none' },
                  display: statusDownload.trim() !== 'MPR2 is frozen and cannot be edited. Available for download.' ? 'none' : 'inline-flex'
                }}
              >
                Download Report
              </Button>
            </Grid> */}
          </Grid>
        </Box>

        {mprData.length > 0 && (
          <form onSubmit={handleFormSubmit}>
            <div style={{ height: 400, width: '100%' }}>
              <DataGrid
                rows={mprData}
                columns={columns}
                processRowUpdate={processRowUpdate}
                slots={{ toolbar: GridToolbar }}
                slotProps={{
                  toolbar: {
                    showQuickFilter: true
                  }
                }}
                cellModesModel={cellModesModel}
                onCellModesModelChange={handleCellModesModelChange}
                onCellClick={handleCellClick}
              />
            </div>
            <Button variant="contained" onClick={handleExportPdf}>
              Export PDF
            </Button>

            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px', gap: '10px' }}>
              <Button type="submit" variant="contained" color="primary" disabled={isFrozen}>
                {mprData.length > 0 ? 'Save Draft' : 'Submit'}
              </Button>

              <Button
                variant="contained"
                color="secondary"
                onClick={() => {
                  setSnackbar({
                    severity: 'warning',
                    children: 'Are you sure you want to finalize the submission? This action cannot be undone!',
                    action: (
                      <>
                        <Button
                          color="inherit"
                          size="small"
                          onClick={() => {
                            handleFormSubmit(event, true);
                          }}
                        >
                          CONFIRM
                        </Button>
                        <Button color="inherit" size="small" onClick={() => setSnackbar(null)}>
                          CANCEL
                        </Button>
                      </>
                    )
                  });
                }}
              >
                Final Submit
              </Button>

              <Button variant="contained" color="primary" onClick={handleDownload}>
                Download/Print
              </Button>
            </div>
          </form>
        )}
      </MainCard>
    </>
  );
};

export default MonthlyProgressReport2;
