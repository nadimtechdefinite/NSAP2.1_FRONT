import { Alert, Backdrop, Box, CircularProgress, FormControl, Grid, InputLabel, MenuItem, Select, Snackbar } from '@mui/material';
import axiosInstance from 'hooks/useAuthTokenUrl';

import React, { useState } from 'react';
import MainCard from 'ui-component/cards/MainCard';

import SubDistrictCommon from 'components/common/SubDistrictCommon';
import { useEffect } from 'react';
import { Button } from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';

const PFMSRegistrationSummary = () => {
  const [locationOptionValues, setLocationOptionValues] = useState({});
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [selectedFileName, setSelectedFileName] = useState('0');
  const [fileSummary, setFileSummary] = useState([]);
  const [reportSummary, setReportSummary] = useState([]);
  const [snackbar, setSnackbar] = React.useState(null);
  const handleCloseSnackbar = () => setSnackbar(null);

  const columns = [
    { field: 'sanctionOrderNo', headerName: 'Sanction Order No.', width: 150 },
    { field: 'munciplityName', headerName: 'Sub District', width: 150 },
    { field: 'applicantName', headerName: 'Applicant Name', width: 160 },
    { field: 'fatherHusbandName', headerName: 'Father/Husband Name', width: 160 },
    { field: 'regMode', headerName: 'PFMS Payment Mode', width: 150 },
    { field: 'accountNo', headerName: 'Bank/Postal A/C', width: 150 },
    { field: 'bankName', headerName: 'Bank Name', width: 300 },
    { field: 'cpsmsId', headerName: 'PFMS Id', width: 150 },
    { field: 'cpsmsErrWarStatus', headerName: 'PFMS Reponse Remark', width: 200 }
    // Add other columns based on your requirements
  ];

  const subDistrictCommonRef = React.createRef();

  const handleLocationValuesChange = (newLocOptionValues) => {
    setLocationOptionValues(newLocOptionValues);
  };

  // useEffect(() => {
  //     getFilesNames();
  // }, [locationOptionValues]);

  useEffect(() => {
    setFileList([]);
    setSelectedFileName('0');
  }, [locationOptionValues]);

  const getFilesNames = async () => {
    if (subDistrictCommonRef.current) {
      console.log(subDistrictCommonRef.current.validateSelectedDropDown());
      if (subDistrictCommonRef.current.validateSelectedDropDown() != 'RJ') {
        setFileList([]);
        setFileSummary([]);
        setReportSummary([]);
        setSelectedFileName('0');
        return false;
      }
    }

    setFileSummary([]);
    setReportSummary([]);
    setSelectedFileName('0');

    const body = { ...locationOptionValues };
    try {
      setLoading(true);
      const response = await axiosInstance.post('pfmsRegistrationSummary/getAllRegistrationFiles', body);
      if (response.data.length > 0) {
        const newData = response.data.map((row) => ({ ...row, id: row.fileName }));
        setFileList(newData);
      } else {
        setSnackbar({ children: 'No Registration Files Found', severity: 'error' });
        setFileList([]);
      }
    } catch (error) {
      setSnackbar({ children: 'Some Internal Error Occured While Getting Files', severity: 'error' });
      // console.error('Error fetching generated file', error)
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = async (event) => {
    setSelectedFileName(event.target.value != '0' ? event.target.value : '0');
    // console.log(selectedFileName);
  };

  useEffect(() => {
    if (selectedFileName != '0') {
      getSelectedFileSummary('DONE');
    }
  }, [selectedFileName]);

  const getSelectedFileSummary = async (recStatus) => {
    if (selectedFileName == '0') {
      // alert("Please Select File ");
      setSnackbar({ children: 'Please Select File', severity: 'error' });
      return false;
    }

    setFileSummary([]);

    const body = { fileName: selectedFileName, recStatus: recStatus };
    try {
      setLoading(true);
      const response = await axiosInstance.post('pfmsRegistrationSummary/getRegistrationFileSummary', body);
      // const newData = response.data.reportData.map((row) => ({ ...row, id: row.locationCode }));

      setReportSummary(response.data);

      if (response.data.benListData.length > 0) {
        const newData = response.data.benListData.map((row) => ({ ...row, id: row.sanctionOrderNo }));
        setFileSummary(newData);
      } else {
        setSnackbar({
          children:
            'No Data Found For ' +
            (recStatus == 'DONE' ? 'Successfully Records' : recStatus == 'RJCT' ? 'Rejected Records' : 'Pending Records'),
          severity: 'error'
        });
      }
    } catch (error) {
      if (error.response.data.fileName) {
        setSnackbar({ children: error.response.data.fileName, severity: 'error' });
      } else if (error.response.data.recStatus) {
        setSnackbar({ children: error.response.data.recStatus, severity: 'error' });
      } else {
        setSnackbar({ children: 'Some Internal Error Occured While Getting Files Summary', severity: 'error' });
      }
      // console.error('Error fetching generated file Summary', error)
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

      <MainCard title="PFMS Registration Files Summary">
        <Box justifyContent="space-between" marginBottom={2}>
          <div>
            <SubDistrictCommon ref={subDistrictCommonRef} validationLevel={'D'} onFormInputValuesChange={handleLocationValuesChange} />
          </div>
        </Box>

        <Grid container spacing={2}>
          <Grid item xs={12} sm={3.9}>
            <FormControl fullWidth style={{ marginLeft: '20px' }}>
              <InputLabel id="file-label" style={{ display: 'flex', alignItems: 'center' }}>
                FileName
              </InputLabel>
              <Select
                name=""
                id=""
                value={selectedFileName}
                labelId="file-label"
                label="file-label"
                onChange={(e) => {
                  handleFileChange(e);
                }}
              >
                {/* <MenuItem key="" value={"0"}>--Select File--</MenuItem> */}
                {fileList.map((item) => (
                  <MenuItem key={item.fileName} value={item.fileName}>
                    {item.fileName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px', marginLeft: '20px' }}>
            <Button variant="contained" color="primary" onClick={() => getFilesNames()} style={{ marginLeft: '20px' }}>
              Fetch Files
            </Button>
          </div>
        </Grid>

        {selectedFileName != '0' && (
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
            <Button variant="contained" color="primary" onClick={() => getSelectedFileSummary('DONE')} style={{ marginLeft: '20px' }}>
              Successfully Registered : {reportSummary.succReg}
            </Button>
            <Button variant="contained" color="error" onClick={() => getSelectedFileSummary('RJCT')} style={{ marginLeft: '20px' }}>
              Rejected Records : {reportSummary.failReg}
            </Button>
            <Button variant="contained" color="warning" onClick={() => getSelectedFileSummary('PENDING')} style={{ marginLeft: '20px' }}>
              Pending Records : {reportSummary.pendingReg}
            </Button>
          </div>
        )}
      </MainCard>

      <MainCard>
        {
          <>
            {/* <Card>
            <CardContent style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h5" gutterBottom>
                  SuccessFully Registered :
                </Typography>{reportSummary.succReg}
            </CardContent>
            </Card> */}
          </>
        }
        {selectedFileName != '0' && fileSummary.length > 0 && (
          <>
            <DataGrid
              rowHeight={30}
              rows={fileSummary}
              columns={columns}
              slots={{ toolbar: GridToolbar }}
              slotProps={{
                toolbar: {
                  showQuickFilter: true,
                  printOptions: { disableToolbarButton: true }
                }
              }}
              disableRowSelectionOnClick
            />
          </>
        )}
      </MainCard>
    </>
  );
};
export default PFMSRegistrationSummary;
