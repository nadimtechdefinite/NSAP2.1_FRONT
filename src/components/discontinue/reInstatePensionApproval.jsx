import React, { useState } from 'react';
import { DataGrid, GridToolbar, GridCellModes } from '@mui/x-data-grid';
import { Button, Box, Divider, Chip } from '@mui/material';
import axiosInstance from 'hooks/useAuthTokenUrl';
import MainCard from 'ui-component/cards/MainCard';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import Backdrop from '@mui/material/Backdrop';
import EditIcon from '@mui/icons-material/Edit';
import SearchComponent from 'components/common/SearchTypeCommon';
import SubDistrictCommon from 'components/common/SubDistrictCommon';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';

const ReInstatePensionApproval = () => {
  const [discontinuedData, setDiscontinuedData] = useState([]);
  const [snackbar, setSnackbar] = React.useState(null);
  const handleCloseSnackbar = () => setSnackbar(null);
  const [loading, setLoading] = useState(false);
  const [cellModesModel, setCellModesModel] = React.useState({});
  // const [infoData,setInfoData]=React.useState(null);

  const options = {
    sanctionOrderNo: 'Sanction Order No',
    beneficiaryNo: 'Beneficiary No'
  };

  const [optionValues, setOptionValues] = useState({});
  const [locationOptionValues, setLocationOptionValues] = useState({});

  const columns = [
    { field: 'sanctionOrderNo', headerName: 'Sanction Order No', width: 125 },
    { field: 'beneficiaryNo', headerName: 'Beneficiary No', width: 125 },
    { field: 'applicantName', headerName: 'Applicant Name', width: 125 },
    { field: 'fatherHusbandName', headerName: 'Father/Husband Name', width: 170 },
    { field: 'statusDesc', headerName: 'Discontinue Reason', width: 150 },
    { field: 'creationRemarks', headerName: 'Discontinue Remarks', width: 150 },
    { field: 'discontinuationDate', headerName: 'Discontinued Date', width: 125 },
    { field: 'appealRemarks', headerName: 'Appeal Remarks', width: 150 },
    {
      field: 'disbursementUptoCenter',
      headerName: (
        <div>
          <EditIcon color="primary" fontSize="small" style={{ marginBottom: '-4px' }} />
          Pension Effective From Date
        </div>
      ),
      width: 180,
      renderCell: (params) => (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            value={dayjs(params.value)} // Set value from backend
            onChange={(date) => handleDateChange(params.id, date)} // Handle date change
            renderInput={(params) => <input {...params.inputProps} />}
            minDate={dayjs(params.value)}
            maxDate={dayjs()} // Disable future dates
          />
        </LocalizationProvider>
      )
    },
    {
      field: 'verifyRemarks',
      headerName: (
        <div>
          {' '}
          <EditIcon color="primary" fontSize="small" style={{ marginBottom: '-4px' }} /> Remarks{' '}
        </div>
      ),
      editable: true,
      width: 150
    },
    {
      field: 'approvedStatus',
      headerName: 'Action',
      width: 150,
      headerAlign: 'center',
      renderCell: (params) => (
        <>
          <Button
            variant="outlined"
            color="success"
            style={{ cursor: 'pointer', fontSize: '12px', marginRight: '8px' }}
            onClick={(e) => submitUpdateRequest(e, params.row.id, 'true')}
          >
            Approve
          </Button>
          <Button
            variant="outlined"
            color="error"
            style={{ cursor: 'pointer', fontSize: '12px' }}
            onClick={(e) => submitUpdateRequest(e, params.row.id, 'false')}
          >
            Reject
          </Button>
        </>
      )
    }
  ];

  const handleDateChange = (id, date) => {
    const updatedRows = discontinuedData.map((row) => {
      if (row.id === id) {
        return { ...row, pensionEffectiveFromDate: date };
      }
      return row;
    });
    setDiscontinuedData(updatedRows);
  };

  const handleFetchData = async (e) => {
    console.log(e.target.name);
    e.preventDefault();
    try {
      if (subDistrictCommonRef.current && !Object.values(optionValues).some((value) => value !== null)) {
        if (subDistrictCommonRef.current.validateSelectedDropDown() != 'RJ') {
          return false;
        }
      }

      var requestData = { ...optionValues, ...locationOptionValues };
      console.log('final:' + JSON.stringify(requestData));

      setLoading(true);
      const response = await axiosInstance.post('appeals/findAllReInstateAppealsDetails', JSON.stringify(requestData));

      if (response.data.length < 1) {
        setDiscontinuedData([]);
        setSnackbar({ children: 'No ReInstate Appeals Found', severity: 'error' });
        return false;
      }
      const newData = response.data.map((row) => ({ ...row, id: row.sanctionOrderNo }));
      setDiscontinuedData(newData);
    } catch (error) {
      if (error.response.data.sanctionOrderNo) {
        setSnackbar({ children: error.response.data.sanctionOrderNo, severity: 'error' });
      } else if (error.response.data.beneficiaryNo) {
        setSnackbar({ children: error.response.data.beneficiaryNo, severity: 'error' });
      } else {
        setSnackbar({ children: 'Some Internal Error Occured', severity: 'error' });
      }
    } finally {
      setLoading(false);
    }
  };

  const submitUpdateRequest = async (e, id, type) => {
    e.preventDefault();

    const selectedData = discontinuedData.filter((row) => row.sanctionOrderNo === id);

    const isRemarksValid = selectedData.every(() => {
      const selectedRow = discontinuedData.find((row) => row.sanctionOrderNo === id);
      return selectedRow && selectedRow.verifyRemarks != null && selectedRow.verifyRemarks.trim() !== '';
    });

    if (!isRemarksValid) {
      setSnackbar({ children: 'Please fill in remarks !!! ', severity: 'error' });
      return false;
    }

    //sry for two tym
    let gapReason = null;

    if (type == 'true') {
      var sdata = discontinuedData.find((row) => row.sanctionOrderNo === id);

      if (dayjs(sdata.pensionEffectiveFromDate).diff(dayjs(sdata.disbursementUptoCenter), 'day', true) == 0) {
        setSnackbar({ children: 'Please Update Pension Effective From Date', severity: 'error' });
        return false;
      }

      const diff = dayjs(sdata.pensionEffectiveFromDate).diff(dayjs(sdata.disbursementUptoCenter), 'month', true); // Get the difference in months
      if (diff > 1) {
        while (gapReason === null || gapReason === '') {
          gapReason = prompt('Please provide the reason for the gap in payment');
        }
      }
    }

    //rows update
    const updatedData = await processRowUpdate(selectedData);

    const bodyData = JSON.stringify(
      Object.values(updatedData)
        .filter((value) => value !== null && value !== undefined)
        .map((item) => {
          item.paymentGapRemark = gapReason;
          return item;
        })
    );

    try {
      if (type == 'true') {
        var requestData = { stateId: '0', sanctionOrderNo: sdata.sanctionOrderNo };
        const info = await axiosInstance.post('advance-search/findAllAdvanceSearchDetails', JSON.stringify(requestData));
        var result = window.confirm(
          'Registered Account Details Are Below Mention. If You want Update it, Kindly use Change Account Details Module after successfull reinstate. \n' +
            ' Account No. : ' +
            info.data.map((row) => ({ ...row, id: row.sanctionOrderNo }))[0].bankPoAccountNo +
            ' Ifsc Code. : ' +
            info.data.map((row) => ({ ...row, id: row.sanctionOrderNo }))[0].ifscCode +
            '\n Branch Name. : ' +
            info.data.map((row) => ({ ...row, id: row.sanctionOrderNo }))[0].branchName
        );
        if (!result) {
          return false;
        }
      }

      setLoading(true);
      const response = await axiosInstance.put('appeals/saveApprRejReInstateAppealsDetails/' + type, bodyData);

      // if (response.status===201) {
      setSnackbar({ children: response.data, severity: 'success' });
      await new Promise((resolve) => setTimeout(resolve, 1250));
      handleFetchData(e);
      // }
    } catch (error) {
      if (error.response.data.flag) {
        setSnackbar({ childer: error.response.data.flag, severity: 'error' });
      } else if (error.response.data.verifyRemarks) {
        setSnackbar({ childer: error.response.data.flag, severity: 'error' });
      } else {
        setSnackbar({ children: 'Some Internal Error Occured', severity: 'error' });
      }
      // console.log(error);
      // setSnackbar({ children: 'Some Internal Error Occured', severity: 'error' });
      // return false;
    } finally {
      setLoading(false);
    }
  };

  const useFakeMutation = () => {
    return React.useCallback(
      (updatedRow) =>
        new Promise((resolve, reject) => {
          setTimeout(() => {
            if (updatedRow.verifyRemarks?.trim() === '') {
              reject(new Error("Error:Appeals Remark can't be empty."));
            } else {
              resolve({
                ...updatedRow,
                verifyRemarks: updatedRow.verifyRemarks?.toUpperCase(),
                pensionEffectiveFromDate: updatedRow.pensionEffectiveFromDate
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

        setDiscontinuedData((prevRows) => {
          const rowIndex = prevRows.findIndex((row) => row.sanctionOrderNo === updatedRowData.sanctionOrderNo);

          const updatedRows = [...prevRows];
          updatedRows[rowIndex] = {
            ...updatedRows[rowIndex], // Keep the existing fields
            verifyRemarks: updatedRowData.verifyRemarks,
            pensionEffectiveFromDate: updatedRowData.pensionEffectiveFromDate // Update only the 'status' field (replace with your field names)
          };

          return updatedRows;
        });

        return updatedRowData;
      } catch (error) {
        console.error('Error updating row:', error);
        throw error;
      }
    },
    [mutateRow, setDiscontinuedData]
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

  const handleOptionValuesChange = (newOptionValues) => {
    setOptionValues(newOptionValues);
  };

  const handleLocationValuesChange = (newLocOptionValues) => {
    setLocationOptionValues(newLocOptionValues);
  };

  const subDistrictCommonRef = React.createRef();

  return (
    <>
      <MainCard title="Pensioner Reinstate Appeal Approval/Reject">
        <Box justifyContent="space-between" marginBottom={2}>
          <div>
            <SubDistrictCommon ref={subDistrictCommonRef} validationLevel={'D'} onFormInputValuesChange={handleLocationValuesChange} />
          </div>

          <Divider style={{ marginTop: 5 }}>
            <Chip label="OR SEARCH BY" />
          </Divider>

          <div>
            <SearchComponent options={options} onOptionValuesChange={handleOptionValuesChange} />
          </div>

          <Box marginTop={2} style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
            <Button variant="contained" color="primary" onClick={handleFetchData}>
              Search
            </Button>
          </Box>
        </Box>

        {discontinuedData.length > 0 && (
          <form>
            <div style={{ height: 400, width: '100%' }}>
              <DataGrid
                rows={discontinuedData}
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
          </form>
        )}

        {!!snackbar && (
          <Snackbar open anchorOrigin={{ vertical: 'top', horizontal: 'center' }} onClose={handleCloseSnackbar} autoHideDuration={6000}>
            <Alert {...snackbar} onClose={handleCloseSnackbar} />
          </Snackbar>
        )}

        <Backdrop open={loading} style={{ zIndex: 999, color: '#fff' }}>
          <CircularProgress color="inherit" />
        </Backdrop>
      </MainCard>
    </>
  );
};

export default ReInstatePensionApproval;
