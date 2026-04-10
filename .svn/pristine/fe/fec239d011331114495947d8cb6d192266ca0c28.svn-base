import React, { useEffect, useState } from 'react';
import {
  Grid,
  FormControl,
  TextField,
  Select,
  FormHelperText,
  Typography,
  MenuItem,
  InputLabel,
  Button,
  TableCell,
  TableBody,
  TableRow,
  Table,
  TableHead
} from '@mui/material';
import MainCard from 'ui-component/cards/MainCard';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import axiosInstance from 'hooks/useAuthTokenUrl';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import messages_en from 'components/common/messages_en.json';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import DownloadIcon from '@mui/icons-material/Download';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2)
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1)
  }
}));
const RegistrationModes = () => {
  const [formData, setFormData] = useState({
    fromDate: '',
    toDate: '',
    areaCode: ''
  });

  const [data, setData] = useState([]);
  const [lastData, setLastData] = useState([]);
  const [districtData, setDistrictData] = useState([]);
  //   const [lastDistrictData, setLastDistrictData] = useState([]);
  const [open, setOpen] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  console.log(districtData);
  useEffect(() => {
    if (data.length > 0) {
      setLastData(data[data.length - 1]);
      const hiddenFromDate = document.getElementById('hiddenFromDate');
      const hiddenToDate = document.getElementById('hiddenToDate');
      const hiddenAreaCode = document.getElementById('hiddenAreaCode');

      if (hiddenFromDate && hiddenToDate && hiddenAreaCode) {
        hiddenFromDate.value = formData.fromDate;
        hiddenToDate.value = formData.toDate;
        hiddenAreaCode.value = formData.areaCode;
      }
    }
  }, [data]);

  const handleChangeFromDate = (fieldName, selectedDate) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [fieldName]: selectedDate
    }));
    setFormErrors((prevErrors) => {
      const updatedErrors = { ...prevErrors };
      delete updatedErrors.fromDate;
      return updatedErrors;
    });
  };

  const handleChangeToDate = (fieldName, selectedDate) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [fieldName]: selectedDate
    }));
    setFormErrors((prevErrors) => {
      const updatedErrors = { ...prevErrors };
      delete updatedErrors.toDate;
      return updatedErrors;
    });
  };

  const handleChangeAreaCode = (event) => {
    const value = event.target.value;
    setFormData((prevFormData) => ({
      ...prevFormData,
      areaCode: value
    }));
    setFormErrors((prevErrors) => {
      const updatedErrors = { ...prevErrors };
      delete updatedErrors.areaCode;
      return updatedErrors;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const isFormValid = validateForm();
    if (isFormValid) {
      try {
        const postUrl = '/registrationModes/getByState';
        const location = {
          fromDate: formData.fromDate,
          toDate: formData.toDate,
          areaCode: formData.areaCode
        };
        const response = await axiosInstance.post(postUrl, JSON.stringify(location));
        setData(response.data);

        console.log('Form Data : ', formData);
      } catch (error) {
        console.log('Error  : ', error);
      }
    }
  };

  const handleByDistrict = async (dCode) => {
    console.log(dCode);
    const fDate = document.getElementById('hiddenFromDate').value;
    const tDate = document.getElementById('hiddenToDate').value;
    const aCode = document.getElementById('hiddenAreaCode').value;

    try {
      const postUrl = '/registrationModes/getByDistrict';
      const location = {
        fromDate: fDate,
        toDate: tDate,
        areaCode: aCode,
        districtCode: dCode
      };
      const response = await axiosInstance.post(postUrl, JSON.stringify(location));
      setDistrictData(response.data);
      setOpen(true); // Open the dialog when link is clicked

      console.log('Form Data : ', formData);
    } catch (error) {
      console.log('Error  : ', error);
    }
    //setOpen(true); // Open the dialog when link is clicked
  };

  useEffect(() => {
    if (districtData) {
      console.log('districtData updated: ', districtData);
    }
  }, [districtData]);
  const handleClose = () => {
    setOpen(false); // Close the dialog
  };

  //console.log(districtData);

  const validateForm = () => {
    const errors = {};
    // Add validation logic for each field
    if (!formData.fromDate) {
      errors.fromDate = messages_en.fromDateRequired;
    }

    if (!formData.toDate) {
      errors.toDate = messages_en.toDateRequired;
    }

    if (!formData.areaCode) {
      errors.areaCode = messages_en.areaCodeRequired;
    }
    // Add more validation logic for other fields...

    setFormErrors(errors);

    return Object.keys(errors).length === 0; // Return true if no errors
  };

  const exportToExcelMain = () => {
    // Create a new workbook
    const wb = XLSX.utils.book_new();
    // Create a new worksheet
    //const ws = XLSX.utils.book_new();
    // Iterate through each table
    //Object.keys(responseData).forEach((key, index) => {
    // Convert the table to a worksheet
    const wsTemp = XLSX.utils.table_to_sheet(document.getElementById('tableMain'));
    // Add the worksheet to the main worksheet
    XLSX.utils.book_append_sheet(wb, wsTemp);
    // });
    // Save the workbook as an Excel file
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    saveAs(new Blob([excelBuffer], { type: 'application/octet-stream' }), 'Report.xlsx');
  };

  const exportToExcelChild = () => {
    const wb = XLSX.utils.book_new();
    const wsTemp = XLSX.utils.table_to_sheet(document.getElementById('tableChild'));
    XLSX.utils.book_append_sheet(wb, wsTemp);
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    saveAs(new Blob([excelBuffer], { type: 'application/octet-stream' }), 'Report.xlsx');
  };
  return (
    <div>
      <MainCard title="BENEFICIARY REGISTRATION PLATFORM">
        <form onSubmit={(e) => handleSubmit(e)}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={2}>
              <FormControl fullWidth>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    label={
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <span style={{ marginRight: '4px' }}>From Date</span>
                        <Typography style={{ color: 'red' }}>*</Typography>
                      </div>
                    }
                    name="fromDate"
                    format="DD-MM-YYYY"
                    variant="outlined"
                    onChange={(selectedDate) => handleChangeFromDate('fromDate', selectedDate)}
                    renderInput={(params) => <TextField {...params} />}
                    disableFuture
                  ></DatePicker>
                  {formErrors.fromDate && (
                    <FormHelperText error id="fromDate-error">
                      {formErrors.fromDate}
                    </FormHelperText>
                  )}
                </LocalizationProvider>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={2}>
              <FormControl fullWidth>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    label={
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <span style={{ marginRight: '4px' }}>To Date</span>
                        <Typography style={{ color: 'red' }}>*</Typography>
                      </div>
                    }
                    format="DD-MM-YYYY"
                    name="toDate"
                    //value={formData.toDate}
                    slotProps={{ textField: { fullWidth: true } }}
                    variant="outlined"
                    onChange={(selectedDate) => handleChangeToDate('toDate', selectedDate)}
                    renderInput={(params) => <TextField {...params} />}
                    disableFuture
                  />
                </LocalizationProvider>
                {formErrors.toDate && (
                  <FormHelperText error id="toDate-error">
                    {formErrors.toDate}
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <InputLabel id="areaCode">
                  Area&nbsp;<span style={{ color: 'red' }}>*</span>
                </InputLabel>
                <Select
                  labelId="areaCode"
                  id="areaCode"
                  label="Area"
                  name="areaCode"
                  value={formData.areaCode}
                  onChange={handleChangeAreaCode}
                >
                  <MenuItem key="both" value="both">
                    BOTH
                  </MenuItem>
                  <MenuItem key="rural" value="rural">
                    RURAL
                  </MenuItem>
                  <MenuItem key="urban" value="urban">
                    URBAN
                  </MenuItem>
                </Select>
                {formErrors.areaCode && (
                  <FormHelperText error>
                    <Typography variant="caption" color="error">
                      {formErrors.areaCode}
                    </Typography>
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={2}>
              <Button type="submit" variant="contained" color="primary">
                SUBMIT
              </Button>
            </Grid>
          </Grid>
        </form>
      </MainCard>
      &nbsp;
      <MainCard>
        <Grid container spacing={2}>
          {data.length > 1 && (
            <Button variant="contained" style={{ backgroundColor: '#8555a3', float: 'right' }} onClick={exportToExcelMain}>
              <DownloadIcon />
              Excel
            </Button>
          )}
          {data.length > 1 && (
            <Grid item xs={12}>
              <div style={{ height: 600, width: '100%', overflow: 'auto' }}>
                <Table
                  className="table table-bordered table-striped order-column"
                  style={{ textAlign: 'center', borderCollapse: 'separate' }}
                  id="tableMain"
                >
                  <TableHead>
                    <TableRow>
                      <TableCell rowSpan={3} style={{ backgroundColor: '#bee6c9' }}>
                        SNo.
                      </TableCell>
                      <TableCell rowSpan={3} style={{ backgroundColor: '#bee6c9' }}>
                        District
                      </TableCell>
                      <TableCell colSpan={8} style={{ backgroundColor: 'aliceblue', textAlign: 'center' }}>
                        UMANG
                      </TableCell>
                      <TableCell colSpan={8} style={{ backgroundColor: '#cbd2d9', textAlign: 'center' }}>
                        SAMBAL
                      </TableCell>
                      <TableCell colSpan={8} style={{ backgroundColor: '#cce3f7', textAlign: 'center' }}>
                        WEBSITE
                      </TableCell>
                      <TableCell colSpan={2} rowSpan={2}>
                        Total
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell style={{ backgroundColor: 'aliceblue' }} colSpan={2}>
                        IGNOAPS
                      </TableCell>
                      <TableCell style={{ backgroundColor: 'aliceblue' }} colSpan={2}>
                        IGNWPS
                      </TableCell>
                      <TableCell style={{ backgroundColor: 'aliceblue' }} colSpan={2}>
                        IGNDPS
                      </TableCell>
                      <TableCell style={{ backgroundColor: 'aliceblue' }} colSpan={2}>
                        UMANG TOTAL
                      </TableCell>

                      <TableCell style={{ backgroundColor: '#cbd2d9' }} colSpan={2}>
                        IGNOAPS
                      </TableCell>
                      <TableCell style={{ backgroundColor: '#cbd2d9' }} colSpan={2}>
                        IGNWPS
                      </TableCell>
                      <TableCell style={{ backgroundColor: '#cbd2d9' }} colSpan={2}>
                        IGNDPS
                      </TableCell>
                      <TableCell style={{ backgroundColor: '#cbd2d9' }} colSpan={2}>
                        SAMBAL TOTAL
                      </TableCell>

                      <TableCell style={{ backgroundColor: '#cce3f7' }} colSpan={2}>
                        IGNOAPS
                      </TableCell>
                      <TableCell style={{ backgroundColor: '#cce3f7' }} colSpan={2}>
                        IGNWPS
                      </TableCell>
                      <TableCell style={{ backgroundColor: '#cce3f7' }} colSpan={2}>
                        IGNDPS
                      </TableCell>
                      <TableCell style={{ backgroundColor: '#cce3f7' }} colSpan={2}>
                        WEBSITE TOTAL
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell style={{ backgroundColor: 'aliceblue', fontSize: 'x-small' }}>TOTAL</TableCell>
                      <TableCell style={{ backgroundColor: 'aliceblue', fontSize: 'x-small' }}>PENDING</TableCell>
                      <TableCell style={{ backgroundColor: 'aliceblue', fontSize: 'x-small' }}>TOTAL</TableCell>
                      <TableCell style={{ backgroundColor: 'aliceblue', fontSize: 'x-small' }}>PENDING</TableCell>
                      <TableCell style={{ backgroundColor: 'aliceblue', fontSize: 'x-small' }}>TOTAL</TableCell>
                      <TableCell style={{ backgroundColor: 'aliceblue', fontSize: 'x-small' }}>PENDING</TableCell>
                      <TableCell style={{ backgroundColor: 'aliceblue', fontSize: 'x-small' }}>TOTAL</TableCell>
                      <TableCell style={{ backgroundColor: 'aliceblue', fontSize: 'x-small' }}>PENDING</TableCell>

                      <TableCell style={{ backgroundColor: '#cbd2d9', fontSize: 'x-small' }}>TOTAL</TableCell>
                      <TableCell style={{ backgroundColor: '#cbd2d9', fontSize: 'x-small' }}>PENDING</TableCell>
                      <TableCell style={{ backgroundColor: '#cbd2d9', fontSize: 'x-small' }}>TOTAL</TableCell>
                      <TableCell style={{ backgroundColor: '#cbd2d9', fontSize: 'x-small' }}>PENDING</TableCell>
                      <TableCell style={{ backgroundColor: '#cbd2d9', fontSize: 'x-small' }}>TOTAL</TableCell>
                      <TableCell style={{ backgroundColor: '#cbd2d9', fontSize: 'x-small' }}>PENDING</TableCell>
                      <TableCell style={{ backgroundColor: '#cbd2d9', fontSize: 'x-small' }}>TOTAL</TableCell>
                      <TableCell style={{ backgroundColor: '#cbd2d9', fontSize: 'x-small' }}>PENDING</TableCell>

                      <TableCell style={{ backgroundColor: '#cce3f7', fontSize: 'x-small' }}>TOTAL</TableCell>
                      <TableCell style={{ backgroundColor: '#cce3f7', fontSize: 'x-small' }}>PENDING</TableCell>
                      <TableCell style={{ backgroundColor: '#cce3f7', fontSize: 'x-small' }}>TOTAL</TableCell>
                      <TableCell style={{ backgroundColor: '#cce3f7', fontSize: 'x-small' }}>PENDING</TableCell>
                      <TableCell style={{ backgroundColor: '#cce3f7', fontSize: 'x-small' }}>TOTAL</TableCell>
                      <TableCell style={{ backgroundColor: '#cce3f7', fontSize: 'x-small' }}>PENDING</TableCell>
                      <TableCell style={{ backgroundColor: '#cce3f7', fontSize: 'x-small' }}>TOTAL</TableCell>
                      <TableCell style={{ backgroundColor: '#cce3f7', fontSize: 'x-small' }}>PENDING</TableCell>

                      <TableCell style={{ backgroundColor: 'white', fontSize: 'x-small' }}>TOTAL</TableCell>
                      <TableCell style={{ backgroundColor: 'white', fontSize: 'x-small' }}>PENDING</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {data.slice(0, -1).map((row, index) => (
                      <TableRow key={index}>
                        <TableCell style={{ backgroundColor: '#bee6c9' }}>{++index}</TableCell>
                        <TableCell
                          style={{ backgroundColor: '#bee6c9', textAlign: 'left', cursor: 'pointer', color: 'blue' }}
                          onClick={() => handleByDistrict(row.districtCode)}
                        >
                          {row.districtName}
                        </TableCell>
                        <TableCell style={{ backgroundColor: 'aliceblue', textAlign: 'right' }}>{row.u_ignoaps_total}</TableCell>
                        <TableCell style={{ backgroundColor: 'aliceblue', textAlign: 'right' }}>{row.u_ignoaps_pending}</TableCell>
                        <TableCell style={{ backgroundColor: 'aliceblue', textAlign: 'right' }}>{row.u_ignwps_total}</TableCell>
                        <TableCell style={{ backgroundColor: 'aliceblue', textAlign: 'right' }}>{row.u_ignwps_pending}</TableCell>
                        <TableCell style={{ backgroundColor: 'aliceblue', textAlign: 'right' }}>{row.u_igndps_total}</TableCell>
                        <TableCell style={{ backgroundColor: 'aliceblue', textAlign: 'right' }}>{row.u_igndps_pending}</TableCell>
                        <TableCell style={{ backgroundColor: 'aliceblue', textAlign: 'right' }}>{row.u_total}</TableCell>
                        <TableCell style={{ backgroundColor: 'aliceblue', textAlign: 'right' }}>{row.u_pending}</TableCell>

                        <TableCell style={{ backgroundColor: '#cbd2d9', textAlign: 'right' }}>{row.s_ignoaps_total}</TableCell>
                        <TableCell style={{ backgroundColor: '#cbd2d9', textAlign: 'right' }}>{row.s_ignoaps_pending}</TableCell>
                        <TableCell style={{ backgroundColor: '#cbd2d9', textAlign: 'right' }}>{row.s_ignwps_total}</TableCell>
                        <TableCell style={{ backgroundColor: '#cbd2d9', textAlign: 'right' }}>{row.s_ignwps_pending}</TableCell>
                        <TableCell style={{ backgroundColor: '#cbd2d9', textAlign: 'right' }}>{row.s_igndps_total}</TableCell>
                        <TableCell style={{ backgroundColor: '#cbd2d9', textAlign: 'right' }}>{row.s_igndps_pending}</TableCell>
                        <TableCell style={{ backgroundColor: '#cbd2d9', textAlign: 'right' }}>{row.s_total}</TableCell>
                        <TableCell style={{ backgroundColor: '#cbd2d9', textAlign: 'right' }}>{row.s_pending}</TableCell>

                        <TableCell style={{ backgroundColor: '#cce3f7', textAlign: 'right' }}>{row.w_ignoaps_total}</TableCell>
                        <TableCell style={{ backgroundColor: '#cce3f7', textAlign: 'right' }}>{row.w_ignoaps_pending}</TableCell>
                        <TableCell style={{ backgroundColor: '#cce3f7', textAlign: 'right' }}>{row.w_ignwps_total}</TableCell>
                        <TableCell style={{ backgroundColor: '#cce3f7', textAlign: 'right' }}>{row.w_ignwps_pending}</TableCell>
                        <TableCell style={{ backgroundColor: '#cce3f7', textAlign: 'right' }}>{row.w_igndps_total}</TableCell>
                        <TableCell style={{ backgroundColor: '#cce3f7', textAlign: 'right' }}>{row.w_igndps_pending}</TableCell>
                        <TableCell style={{ backgroundColor: '#cce3f7', textAlign: 'right' }}>{row.w_total}</TableCell>
                        <TableCell style={{ backgroundColor: '#cce3f7', textAlign: 'right' }}>{row.w_pending}</TableCell>

                        <TableCell style={{ backgroundColor: 'white', textAlign: 'right' }}>{row.total_total}</TableCell>
                        <TableCell style={{ backgroundColor: 'white', textAlign: 'right' }}>{row.total_pending}</TableCell>
                      </TableRow>
                    ))}

                    <TableRow key={data.length}>
                      <TableCell style={{ backgroundColor: '#bee4e6' }}></TableCell>
                      <TableCell style={{ backgroundColor: '#bee4e6' }}>
                        <b>{lastData.districtName}</b>
                      </TableCell>
                      <TableCell style={{ backgroundColor: '#bee4e6', textAlign: 'right' }}>
                        <b>{lastData.u_ignoaps_total}</b>
                      </TableCell>
                      <TableCell style={{ backgroundColor: '#bee4e6', textAlign: 'right' }}>
                        <b>{lastData.u_ignoaps_pending}</b>
                      </TableCell>
                      <TableCell style={{ backgroundColor: '#bee4e6', textAlign: 'right' }}>
                        <b>{lastData.u_ignwps_total}</b>
                      </TableCell>
                      <TableCell style={{ backgroundColor: '#bee4e6', textAlign: 'right' }}>
                        <b>{lastData.u_ignwps_pending}</b>
                      </TableCell>
                      <TableCell style={{ backgroundColor: '#bee4e6', textAlign: 'right' }}>
                        <b>{lastData.u_igndps_total}</b>
                      </TableCell>
                      <TableCell style={{ backgroundColor: '#bee4e6', textAlign: 'right' }}>
                        <b>{lastData.u_igndps_pending}</b>
                      </TableCell>
                      <TableCell style={{ backgroundColor: '#bee4e6', textAlign: 'right' }}>
                        <b>{lastData.u_total}</b>
                      </TableCell>
                      <TableCell style={{ backgroundColor: '#bee4e6', textAlign: 'right' }}>
                        <b>{lastData.u_pending}</b>
                      </TableCell>

                      <TableCell style={{ backgroundColor: '#bee4e6', textAlign: 'right' }}>
                        <b>{lastData.s_ignoaps_total}</b>
                      </TableCell>
                      <TableCell style={{ backgroundColor: '#bee4e6', textAlign: 'right' }}>
                        <b>{lastData.s_ignoaps_pending}</b>
                      </TableCell>
                      <TableCell style={{ backgroundColor: '#bee4e6', textAlign: 'right' }}>
                        <b>{lastData.s_ignwps_total}</b>
                      </TableCell>
                      <TableCell style={{ backgroundColor: '#bee4e6', textAlign: 'right' }}>
                        <b>{lastData.s_ignwps_pending}</b>
                      </TableCell>
                      <TableCell style={{ backgroundColor: '#bee4e6', textAlign: 'right' }}>
                        <b>{lastData.s_igndps_total}</b>
                      </TableCell>
                      <TableCell style={{ backgroundColor: '#bee4e6', textAlign: 'right' }}>
                        <b>{lastData.s_igndps_pending}</b>
                      </TableCell>
                      <TableCell style={{ backgroundColor: '#bee4e6', textAlign: 'right' }}>
                        <b>{lastData.s_total}</b>
                      </TableCell>
                      <TableCell style={{ backgroundColor: '#bee4e6', textAlign: 'right' }}>
                        <b>{lastData.s_pending}</b>
                      </TableCell>

                      <TableCell style={{ backgroundColor: '#bee4e6', textAlign: 'right' }}>
                        <b>{lastData.w_ignoaps_total}</b>
                      </TableCell>
                      <TableCell style={{ backgroundColor: '#bee4e6', textAlign: 'right' }}>
                        <b>{lastData.w_ignoaps_pending}</b>
                      </TableCell>
                      <TableCell style={{ backgroundColor: '#bee4e6', textAlign: 'right' }}>
                        <b>{lastData.w_ignwps_total}</b>
                      </TableCell>
                      <TableCell style={{ backgroundColor: '#bee4e6', textAlign: 'right' }}>
                        <b>{lastData.w_ignwps_pending}</b>
                      </TableCell>
                      <TableCell style={{ backgroundColor: '#bee4e6', textAlign: 'right' }}>
                        <b>{lastData.w_igndps_total}</b>
                      </TableCell>
                      <TableCell style={{ backgroundColor: '#bee4e6', textAlign: 'right' }}>
                        <b>{lastData.w_igndps_pending}</b>
                      </TableCell>
                      <TableCell style={{ backgroundColor: '#bee4e6', textAlign: 'right' }}>
                        <b>{lastData.w_total}</b>
                      </TableCell>
                      <TableCell style={{ backgroundColor: '#bee4e6', textAlign: 'right' }}>
                        <b>{lastData.w_pending}</b>
                      </TableCell>

                      <TableCell style={{ backgroundColor: '#bee4e6', textAlign: 'right' }}>
                        <b>{lastData.total_total}</b>
                      </TableCell>
                      <TableCell style={{ backgroundColor: '#bee4e6', textAlign: 'right' }}>
                        <b>{lastData.total_pending}</b>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </Grid>
          )}
          {data.length === 1 && (
            <center>
              <div>
                <b>No Record Found</b>
              </div>
            </center>
          )}

          <input id="hiddenFromDate" type="hidden" />
          <input id="hiddenToDate" type="hidden" />
          <input id="hiddenAreaCode" type="hidden" />
        </Grid>
      </MainCard>
      <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
        fullWidth // Add this prop to make the dialog full width
        maxWidth="lg" // Adjust the maxWidth prop to your desired width, here 'lg' stands for large
      >
        <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
          <Button variant="contained" style={{ backgroundColor: '#8555a3', float: 'left' }} onClick={exportToExcelChild}>
            <DownloadIcon />
            Excel
          </Button>
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500]
          }}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent dividers>
          {districtData.length > 1 && (
            <Table
              className="table table-bordered table-striped order-column"
              style={{ textAlign: 'center', borderCollapse: 'separate' }}
              id="tableChild"
            >
              <TableHead>
                <TableRow>
                  <TableCell rowSpan={3} style={{ backgroundColor: '#bee6c9' }}>
                    SNo.
                  </TableCell>
                  <TableCell rowSpan={3} style={{ backgroundColor: '#bee6c9' }}>
                    District
                  </TableCell>
                  <TableCell rowSpan={3} style={{ backgroundColor: '#bee6c9' }}>
                    Sub District
                  </TableCell>
                  <TableCell rowSpan={3} style={{ backgroundColor: '#bee6c9' }}>
                    Area{' '}
                  </TableCell>
                  <TableCell colSpan={8} style={{ backgroundColor: 'aliceblue', textAlign: 'center' }}>
                    UMANG
                  </TableCell>
                  <TableCell colSpan={8} style={{ backgroundColor: '#cbd2d9', textAlign: 'center' }}>
                    SAMBAL
                  </TableCell>
                  <TableCell colSpan={8} style={{ backgroundColor: '#cce3f7', textAlign: 'center' }}>
                    WEBSITE
                  </TableCell>
                  <TableCell colSpan={2} rowSpan={2}>
                    Total
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell style={{ backgroundColor: 'aliceblue' }} colSpan={2}>
                    IGNOAPS
                  </TableCell>
                  <TableCell style={{ backgroundColor: 'aliceblue' }} colSpan={2}>
                    IGNWPS
                  </TableCell>
                  <TableCell style={{ backgroundColor: 'aliceblue' }} colSpan={2}>
                    IGNDPS
                  </TableCell>
                  <TableCell style={{ backgroundColor: 'aliceblue' }} colSpan={2}>
                    UMANG TOTAL
                  </TableCell>

                  <TableCell style={{ backgroundColor: '#cbd2d9' }} colSpan={2}>
                    IGNOAPS
                  </TableCell>
                  <TableCell style={{ backgroundColor: '#cbd2d9' }} colSpan={2}>
                    IGNWPS
                  </TableCell>
                  <TableCell style={{ backgroundColor: '#cbd2d9' }} colSpan={2}>
                    IGNDPS
                  </TableCell>
                  <TableCell style={{ backgroundColor: '#cbd2d9' }} colSpan={2}>
                    SAMBAL TOTAL
                  </TableCell>

                  <TableCell style={{ backgroundColor: '#cce3f7' }} colSpan={2}>
                    IGNOAPS
                  </TableCell>
                  <TableCell style={{ backgroundColor: '#cce3f7' }} colSpan={2}>
                    IGNWPS
                  </TableCell>
                  <TableCell style={{ backgroundColor: '#cce3f7' }} colSpan={2}>
                    IGNDPS
                  </TableCell>
                  <TableCell style={{ backgroundColor: '#cce3f7' }} colSpan={2}>
                    WEBSITE TOTAL
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell style={{ backgroundColor: 'aliceblue', fontSize: 'x-small' }}>TOTAL</TableCell>
                  <TableCell style={{ backgroundColor: 'aliceblue', fontSize: 'x-small' }}>PENDING</TableCell>
                  <TableCell style={{ backgroundColor: 'aliceblue', fontSize: 'x-small' }}>TOTAL</TableCell>
                  <TableCell style={{ backgroundColor: 'aliceblue', fontSize: 'x-small' }}>PENDING</TableCell>
                  <TableCell style={{ backgroundColor: 'aliceblue', fontSize: 'x-small' }}>TOTAL</TableCell>
                  <TableCell style={{ backgroundColor: 'aliceblue', fontSize: 'x-small' }}>PENDING</TableCell>
                  <TableCell style={{ backgroundColor: 'aliceblue', fontSize: 'x-small' }}>TOTAL</TableCell>
                  <TableCell style={{ backgroundColor: 'aliceblue', fontSize: 'x-small' }}>PENDING</TableCell>

                  <TableCell style={{ backgroundColor: '#cbd2d9', fontSize: 'x-small' }}>TOTAL</TableCell>
                  <TableCell style={{ backgroundColor: '#cbd2d9', fontSize: 'x-small' }}>PENDING</TableCell>
                  <TableCell style={{ backgroundColor: '#cbd2d9', fontSize: 'x-small' }}>TOTAL</TableCell>
                  <TableCell style={{ backgroundColor: '#cbd2d9', fontSize: 'x-small' }}>PENDING</TableCell>
                  <TableCell style={{ backgroundColor: '#cbd2d9', fontSize: 'x-small' }}>TOTAL</TableCell>
                  <TableCell style={{ backgroundColor: '#cbd2d9', fontSize: 'x-small' }}>PENDING</TableCell>
                  <TableCell style={{ backgroundColor: '#cbd2d9', fontSize: 'x-small' }}>TOTAL</TableCell>
                  <TableCell style={{ backgroundColor: '#cbd2d9', fontSize: 'x-small' }}>PENDING</TableCell>

                  <TableCell style={{ backgroundColor: '#cce3f7', fontSize: 'x-small' }}>TOTAL</TableCell>
                  <TableCell style={{ backgroundColor: '#cce3f7', fontSize: 'x-small' }}>PENDING</TableCell>
                  <TableCell style={{ backgroundColor: '#cce3f7', fontSize: 'x-small' }}>TOTAL</TableCell>
                  <TableCell style={{ backgroundColor: '#cce3f7', fontSize: 'x-small' }}>PENDING</TableCell>
                  <TableCell style={{ backgroundColor: '#cce3f7', fontSize: 'x-small' }}>TOTAL</TableCell>
                  <TableCell style={{ backgroundColor: '#cce3f7', fontSize: 'x-small' }}>PENDING</TableCell>
                  <TableCell style={{ backgroundColor: '#cce3f7', fontSize: 'x-small' }}>TOTAL</TableCell>
                  <TableCell style={{ backgroundColor: '#cce3f7', fontSize: 'x-small' }}>PENDING</TableCell>

                  <TableCell style={{ backgroundColor: 'white', fontSize: 'x-small' }}>TOTAL</TableCell>
                  <TableCell style={{ backgroundColor: 'white', fontSize: 'x-small' }}>PENDING</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {districtData.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell style={{ backgroundColor: '#bee6c9' }}> {index === districtData.length - 1 ? null : ++index}</TableCell>
                    <TableCell style={{ backgroundColor: '#bee6c9', textAlign: 'left' }}>{row.districtName}</TableCell>
                    <TableCell style={{ backgroundColor: '#bee6c9', textAlign: 'left' }}>{row.subDistrictName}</TableCell>
                    <TableCell style={{ backgroundColor: '#bee6c9', textAlign: 'left' }}>{row.areaName}</TableCell>
                    <TableCell style={{ backgroundColor: 'aliceblue', textAlign: 'right' }}>{row.u_ignoaps_total}</TableCell>
                    <TableCell style={{ backgroundColor: 'aliceblue', textAlign: 'right' }}>{row.u_ignoaps_pending}</TableCell>
                    <TableCell style={{ backgroundColor: 'aliceblue', textAlign: 'right' }}>{row.u_ignwps_total}</TableCell>
                    <TableCell style={{ backgroundColor: 'aliceblue', textAlign: 'right' }}>{row.u_ignwps_pending}</TableCell>
                    <TableCell style={{ backgroundColor: 'aliceblue', textAlign: 'right' }}>{row.u_igndps_total}</TableCell>
                    <TableCell style={{ backgroundColor: 'aliceblue', textAlign: 'right' }}>{row.u_igndps_pending}</TableCell>
                    <TableCell style={{ backgroundColor: 'aliceblue', textAlign: 'right' }}>{row.u_total}</TableCell>
                    <TableCell style={{ backgroundColor: 'aliceblue', textAlign: 'right' }}>{row.u_pending}</TableCell>

                    <TableCell style={{ backgroundColor: '#cbd2d9', textAlign: 'right' }}>{row.s_ignoaps_total}</TableCell>
                    <TableCell style={{ backgroundColor: '#cbd2d9', textAlign: 'right' }}>{row.s_ignoaps_pending}</TableCell>
                    <TableCell style={{ backgroundColor: '#cbd2d9', textAlign: 'right' }}>{row.s_ignwps_total}</TableCell>
                    <TableCell style={{ backgroundColor: '#cbd2d9', textAlign: 'right' }}>{row.s_ignwps_pending}</TableCell>
                    <TableCell style={{ backgroundColor: '#cbd2d9', textAlign: 'right' }}>{row.s_igndps_total}</TableCell>
                    <TableCell style={{ backgroundColor: '#cbd2d9', textAlign: 'right' }}>{row.s_igndps_pending}</TableCell>
                    <TableCell style={{ backgroundColor: '#cbd2d9', textAlign: 'right' }}>{row.s_total}</TableCell>
                    <TableCell style={{ backgroundColor: '#cbd2d9', textAlign: 'right' }}>{row.s_pending}</TableCell>

                    <TableCell style={{ backgroundColor: '#cce3f7', textAlign: 'right' }}>{row.w_ignoaps_total}</TableCell>
                    <TableCell style={{ backgroundColor: '#cce3f7', textAlign: 'right' }}>{row.w_ignoaps_pending}</TableCell>
                    <TableCell style={{ backgroundColor: '#cce3f7', textAlign: 'right' }}>{row.w_ignwps_total}</TableCell>
                    <TableCell style={{ backgroundColor: '#cce3f7', textAlign: 'right' }}>{row.w_ignwps_pending}</TableCell>
                    <TableCell style={{ backgroundColor: '#cce3f7', textAlign: 'right' }}>{row.w_igndps_total}</TableCell>
                    <TableCell style={{ backgroundColor: '#cce3f7', textAlign: 'right' }}>{row.w_igndps_pending}</TableCell>
                    <TableCell style={{ backgroundColor: '#cce3f7', textAlign: 'right' }}>{row.w_total}</TableCell>
                    <TableCell style={{ backgroundColor: '#cce3f7', textAlign: 'right' }}>{row.w_pending}</TableCell>

                    <TableCell style={{ backgroundColor: 'white', textAlign: 'right' }}>{row.total_total}</TableCell>
                    <TableCell style={{ backgroundColor: 'white', textAlign: 'right' }}>{row.total_pending}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
          {districtData.length === 1 && (
            <div>
              <center>
                <b>No Record Found</b>
              </center>
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleClose}>
            Close
          </Button>
        </DialogActions>
      </BootstrapDialog>
    </div>
  );
};

export default RegistrationModes;
