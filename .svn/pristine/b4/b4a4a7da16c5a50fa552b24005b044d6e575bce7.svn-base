import React, { useState } from 'react';
import {
  Grid,
  FormControl,
  FormHelperText,
  Typography,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from '@mui/material';
import MainCard from 'ui-component/cards/MainCard';
import StateList from 'components/form_components/StateList';
import axiosInstance from 'hooks/useAuthTokenUrl';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { DataGrid } from '@mui/x-data-grid';
import messages_en from 'components/common/messages_en.json';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2)
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1)
  }
}));

function GenderAndSocialCategory() {
  //const [selectedYear, setSelectedYear] = React.useState('');
  const [rows, setRows] = useState([]);
  const [districtData, setDistrictData] = useState([]);
  const [flag, setFlag] = useState([]);
  const [genderCategoryCode, setGenderCategoryCode] = useState([]);
  const [finYear, setFinYear] = useState([]);
  const [formErrors, setFormErrors] = useState({});
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    stateCode: '',
    finYear: ''
  });
  const getFinancialYears = () => {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();
    const startYear = currentMonth < 3 ? currentYear - 1 : currentYear;
    const years = [];

    for (let i = 0; i < 10; i++) {
      const year = startYear - i;
      const nextYear = year + 1;
      const financialYear = `${year}-${nextYear.toString().slice(-2)}`;
      years.push(financialYear);
    }

    return years;
  };
  const handleStateChange = (stateId) => {
    setFormData({ ...formData, stateCode: stateId });
    setFormErrors((prevErrors) => {
      const updatedErrors = { ...prevErrors };
      delete updatedErrors.stateCode;
      return updatedErrors;
    });
  };

  const handleChange = (event) => {
    const { value } = event.target;
    setFormData({ ...formData, finYear: value });
    setFormErrors((prevErrors) => {
      const updatedErrors = { ...prevErrors };
      delete updatedErrors.finYear;
      return updatedErrors;
    });
  };
  const financialYears = getFinancialYears();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const isFormValid = validateForm();
    if (isFormValid) {
      try {
        const postUrl = '/genderAndServiceReport/getGenderAndServiceReport';
        const response = await axiosInstance.post(postUrl, formData);
        console.log('response  : ', response.data);
        setRows(response.data);
        document.getElementById('hiddenFinYear').value = formData.finYear;
        document.getElementById('hiddenStateCode').value = formData.stateCode;
      } catch (error) {
        console.log('Error  : ', error);
      }
    }
  };

  const handleByDistrict = async (dCode, fdate, tdate, flag, gender) => {
    try {
      const postUrl = '/genderAndServiceReport/getData';
      const location = {
        districtCode: dCode,
        fromDate: fdate,
        toDate: tdate,
        flag: flag,
        genderCategoryCode: gender
      };
      const response = await axiosInstance.post(postUrl, JSON.stringify(location));
      setDistrictData(response.data);
      setOpen(true); // Open the dialog when link is clicked
      if (flag === 'cumulative') setFlag('Cumulative');
      if (flag === 'finYear') setFlag('Financial Year');
      if (gender === 'F') setGenderCategoryCode('Female');
      if (gender === 'M') setGenderCategoryCode('Male');
      if (gender === 'T') setGenderCategoryCode('Transgender');
      if (gender === 'SC') setGenderCategoryCode('SC');
      if (gender === 'ST') setGenderCategoryCode('ST');
      if (gender === 'OBC') setGenderCategoryCode('OBC');
      if (gender === 'GEN') setGenderCategoryCode('General');

      setFinYear(document.getElementById('hiddenFinYear').value);

      console.log('Form Data : ', formData);
    } catch (error) {
      console.log('Error  : ', error);
    }
  };
  const handleClose = () => {
    setOpen(false); // Close the dialog
  };

  const columns = [
    { field: 'id', headerName: 'S/N', width: 70 },
    { field: 'applicationNo', headerName: 'Application No', width: 150 },
    { field: 'sanctionOrderNo', headerName: 'Sanction No', width: 150 },
    { field: 'applicantName', headerName: 'Applicant Name', width: 200 },
    {
      field: 'gender',
      headerName: 'Gender',
      width: 100,
      renderCell: (params) => (params.value === 'M' ? 'MALE' : params.value === 'F' ? 'FEMALE' : 'TRANSGENDER')
    },
    { field: 'category', headerName: 'Category', width: 150 },
    { field: 'fatherHusbandName', headerName: 'Father/Husband Name', width: 200 },
    { field: 'stateName', headerName: 'State', width: 150 },
    { field: 'districtName', headerName: 'District', width: 150 },
    { field: 'ruralArea', headerName: 'Rural/Urban Area', width: 150, renderCell: (params) => (params.value === 'R' ? 'RURAL' : 'URBAN') },
    { field: 'subDistrictName', headerName: 'SubDistrict/Municipal Area', width: 200 },
    { field: 'gramPanchayatName', headerName: 'Gram Panchayat', width: 200 },
    { field: 'villageName', headerName: 'Village', width: 200 }
  ];

  const rowsDistrict = districtData.map((list, index) => ({
    id: index + 1,
    applicationNo: list.applicationNo,
    sanctionOrderNo: list.sanctionOrderNo,
    applicantName: list.applicantName,
    gender: list.gender,
    category: list.catagory,
    fatherHusbandName: list.fatherHusbandName,
    stateName: list.stateName,
    districtName: list.districtName,
    ruralArea: list.ruralArea,
    subDistrictName: list.subDistrictName,
    gramPanchayatName: list.gramPanchayatName,
    villageName: list.villageName
  }));

  const validateForm = () => {
    const errors = {};
    if (!formData.finYear) {
      errors.finYear = messages_en.finYearRequired;
    }

    setFormErrors(errors);

    return Object.keys(errors).length === 0; // Return true if no errors
  };

  async function handleDownload() {
    try {
      const postUrl = `/genderAndServiceReport/downloadExcel`;
      var location = {
        stateCode: document.getElementById('hiddenStateCode').value,
        finYear: document.getElementById('hiddenFinYear').value
      };
      const response = await axiosInstance.post(postUrl, JSON.stringify(location), { responseType: 'blob' });
      // Create a Blob from the XLSX data
      if (response.data) {
        const xlsxBlob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        // Create a link element and trigger a download
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(xlsxBlob);
        link.download = 'GenderAndCategoryReport.xlsx';
        link.click();
      }
    } catch (e) {
      console.log('error: ', e);
    }
  }

  async function fetchPdfData() {
    try {
      const postUrl = `/genderAndServiceReport/downloadPdf`;
      var location = {
        stateCode: document.getElementById('hiddenStateCode').value,
        finYear: document.getElementById('hiddenFinYear').value
      };
      const response = await axiosInstance.post(postUrl, JSON.stringify(location), { responseType: 'blob' });
      // Create a Blob from the PDF data
      // alert("response.data"+response.data);
      if (response.data) {
        const pdfBlob = new Blob([response.data], { type: 'application/pdf' });
        // Create a link element and trigger a download
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(pdfBlob);
        link.download = 'GenderAndCategoryReport.pdf';
        link.click();
      }
    } catch (e) {
      console.log('error: ', e);
    }
  }

  return (
    <div>
      <MainCard title="Gender and Social Category Report">
        <form onSubmit={(e) => handleSubmit(e)}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <StateList onSelectState={handleStateChange} isMendatory={true} />
                {formErrors.stateCode && (
                  <FormHelperText>
                    <Typography style={{ color: 'red', fontSize: '0.8rem' }}>{formErrors.stateCode}</Typography>
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={4}>
              <FormControl variant="outlined" fullWidth>
                <InputLabel id="financial-year-label">Financial Year</InputLabel>
                <Select
                  labelId="financial-year-label"
                  id="financial-year-select"
                  value={formData.finYear}
                  onChange={handleChange}
                  label="Financial Year"
                  name="finYear"
                >
                  {financialYears.map((year) => (
                    <MenuItem key={year} value={year}>
                      {year}
                    </MenuItem>
                  ))}
                </Select>

                {formErrors.finYear && (
                  <FormHelperText>
                    <Typography variant="caption" color="error">
                      {formErrors.finYear}
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

      <MainCard>
        <Grid container spacing={2}>
          {rows.length > 0 && (
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table" style={{ border: '1px solid #ddd' }}>
                <TableHead>
                  <TableRow>
                    <TableCell align="center" style={{ border: '1px solid #ddd' }}>
                      S/N
                    </TableCell>
                    <TableCell style={{ border: '1px solid #ddd' }}>District Name</TableCell>
                    <TableCell align="center" style={{ border: '1px solid #ddd' }} colSpan={2}>
                      Male
                    </TableCell>
                    <TableCell align="center" style={{ border: '1px solid #ddd' }} colSpan={2}>
                      Female
                    </TableCell>
                    <TableCell align="center" style={{ border: '1px solid #ddd' }} colSpan={2}>
                      Transgender
                    </TableCell>
                    <TableCell align="center" style={{ border: '1px solid #ddd' }} colSpan={2}>
                      SC
                    </TableCell>
                    <TableCell align="center" style={{ border: '1px solid #ddd' }} colSpan={2}>
                      ST
                    </TableCell>
                    <TableCell align="center" style={{ border: '1px solid #ddd' }} colSpan={2}>
                      OBC
                    </TableCell>
                    <TableCell align="center" style={{ border: '1px solid #ddd' }} colSpan={2}>
                      General
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell align="center" style={{ border: '1px solid #ddd' }}></TableCell>
                    <TableCell style={{ border: '1px solid #ddd' }}></TableCell>
                    <TableCell align="center" style={{ border: '1px solid #ddd' }}>
                      Cumulative
                    </TableCell>
                    <TableCell align="center" style={{ border: '1px solid #ddd' }}>
                      Financial Year
                    </TableCell>
                    <TableCell align="center" style={{ border: '1px solid #ddd' }}>
                      Cumulative
                    </TableCell>
                    <TableCell align="center" style={{ border: '1px solid #ddd' }}>
                      Financial Year
                    </TableCell>
                    <TableCell align="center" style={{ border: '1px solid #ddd' }}>
                      Cumulative
                    </TableCell>
                    <TableCell align="center" style={{ border: '1px solid #ddd' }}>
                      Financial Year
                    </TableCell>
                    <TableCell align="center" style={{ border: '1px solid #ddd' }}>
                      Cumulative
                    </TableCell>
                    <TableCell align="center" style={{ border: '1px solid #ddd' }}>
                      Financial Year
                    </TableCell>
                    <TableCell align="center" style={{ border: '1px solid #ddd' }}>
                      Cumulative
                    </TableCell>
                    <TableCell align="center" style={{ border: '1px solid #ddd' }}>
                      Financial Year
                    </TableCell>
                    <TableCell align="center" style={{ border: '1px solid #ddd' }}>
                      Cumulative
                    </TableCell>
                    <TableCell align="center" style={{ border: '1px solid #ddd' }}>
                      Financial Year
                    </TableCell>
                    <TableCell align="center" style={{ border: '1px solid #ddd' }}>
                      Cumulative
                    </TableCell>
                    <TableCell align="center" style={{ border: '1px solid #ddd' }}>
                      Financial Year
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map((row, index) => (
                    <TableRow key={index}>
                      <TableCell align="center" style={{ border: '1px solid #ddd' }}>
                        {index + 1}
                      </TableCell>
                      <TableCell style={{ border: '1px solid #ddd' }}>{row.districtName}</TableCell>
                      <TableCell
                        align="center"
                        style={{
                          border: '1px solid #ddd',
                          cursor: row.gender_m_cumulative > 0 ? 'pointer' : 'default',
                          color: row.gender_m_cumulative > 0 ? 'blue' : 'inherit'
                        }}
                        onClick={
                          row.gender_m_cumulative > 0
                            ? () => handleByDistrict(row.districtCode, row.fromDate, row.toDate, 'cumulative', 'M')
                            : undefined
                        }
                      >
                        {row.gender_m_cumulative}
                      </TableCell>
                      <TableCell
                        align="center"
                        style={{
                          border: '1px solid #ddd',
                          cursor: row.gender_m_finYear > 0 ? 'pointer' : 'default',
                          color: row.gender_m_finYear > 0 ? 'blue' : 'inherit'
                        }}
                        onClick={
                          row.gender_m_finYear > 0
                            ? () => handleByDistrict(row.districtCode, row.fromDate, row.toDate, 'finYear', 'M')
                            : undefined
                        }
                      >
                        {row.gender_m_finYear}
                      </TableCell>
                      <TableCell
                        align="center"
                        style={{
                          border: '1px solid #ddd',
                          cursor: row.gender_f_cumulative > 0 ? 'pointer' : 'default',
                          color: row.gender_f_cumulative > 0 ? 'blue' : 'inherit'
                        }}
                        onClick={
                          row.gender_f_cumulative > 0
                            ? () => handleByDistrict(row.districtCode, row.fromDate, row.toDate, 'cumulative', 'F')
                            : undefined
                        }
                      >
                        {row.gender_f_cumulative}
                      </TableCell>
                      <TableCell
                        align="center"
                        style={{
                          border: '1px solid #ddd',
                          cursor: row.gender_f_finYear > 0 ? 'pointer' : 'default',
                          color: row.gender_f_finYear > 0 ? 'blue' : 'inherit'
                        }}
                        onClick={
                          row.gender_f_finYear > 0
                            ? () => handleByDistrict(row.districtCode, row.fromDate, row.toDate, 'finYear', 'F')
                            : undefined
                        }
                      >
                        {row.gender_f_finYear}
                      </TableCell>
                      <TableCell
                        align="center"
                        style={{
                          border: '1px solid #ddd',
                          cursor: row.gender_t_cumulative > 0 ? 'pointer' : 'default',
                          color: row.gender_t_cumulative > 0 ? 'blue' : 'inherit'
                        }}
                        onClick={
                          row.gender_t_cumulative > 0
                            ? () => handleByDistrict(row.districtCode, row.fromDate, row.toDate, 'cumulative', 'T')
                            : undefined
                        }
                      >
                        {row.gender_t_cumulative}
                      </TableCell>
                      <TableCell
                        align="center"
                        style={{
                          border: '1px solid #ddd',
                          cursor: row.gender_t_finYear > 0 ? 'pointer' : 'default',
                          color: row.gender_t_finYear > 0 ? 'blue' : 'inherit'
                        }}
                        onClick={
                          row.gender_t_finYear > 0
                            ? () => handleByDistrict(row.districtCode, row.fromDate, row.toDate, 'finYear', 'T')
                            : undefined
                        }
                      >
                        {row.gender_t_finYear}
                      </TableCell>
                      <TableCell
                        align="center"
                        style={{
                          border: '1px solid #ddd',
                          cursor: row.catagory_sc_cumulative > 0 ? 'pointer' : 'default',
                          color: row.catagory_sc_cumulative > 0 ? 'blue' : 'inherit'
                        }}
                        onClick={
                          row.catagory_sc_cumulative > 0
                            ? () => handleByDistrict(row.districtCode, row.fromDate, row.toDate, 'cumulative', 'SC')
                            : undefined
                        }
                      >
                        {row.catagory_sc_cumulative}
                      </TableCell>
                      <TableCell
                        align="center"
                        style={{
                          border: '1px solid #ddd',
                          cursor: row.catagory_sc_finYear > 0 ? 'pointer' : 'default',
                          color: row.catagory_sc_finYear > 0 ? 'blue' : 'inherit'
                        }}
                        onClick={
                          row.catagory_sc_finYear > 0
                            ? () => handleByDistrict(row.districtCode, row.fromDate, row.toDate, 'finYear', 'SC')
                            : undefined
                        }
                      >
                        {row.catagory_sc_finYear}
                      </TableCell>
                      <TableCell
                        align="center"
                        style={{
                          border: '1px solid #ddd',
                          cursor: row.catagory_st_cumulative > 0 ? 'pointer' : 'default',
                          color: row.catagory_st_cumulative > 0 ? 'blue' : 'inherit'
                        }}
                        onClick={
                          row.catagory_st_cumulative > 0
                            ? () => handleByDistrict(row.districtCode, row.fromDate, row.toDate, 'cumulative', 'ST')
                            : undefined
                        }
                      >
                        {row.catagory_st_cumulative}
                      </TableCell>
                      <TableCell
                        align="center"
                        style={{
                          border: '1px solid #ddd',
                          cursor: row.catagory_st_finYear > 0 ? 'pointer' : 'default',
                          color: row.catagory_st_finYear > 0 ? 'blue' : 'inherit'
                        }}
                        onClick={
                          row.catagory_st_finYear > 0
                            ? () => handleByDistrict(row.districtCode, row.fromDate, row.toDate, 'finYear', 'ST')
                            : undefined
                        }
                      >
                        {row.catagory_st_finYear}
                      </TableCell>
                      <TableCell
                        align="center"
                        style={{
                          border: '1px solid #ddd',
                          cursor: row.catagory_obc_cumulative > 0 ? 'pointer' : 'default',
                          color: row.catagory_obc_cumulative > 0 ? 'blue' : 'inherit'
                        }}
                        onClick={
                          row.catagory_obc_cumulative > 0
                            ? () => handleByDistrict(row.districtCode, row.fromDate, row.toDate, 'cumulative', 'OBC')
                            : undefined
                        }
                      >
                        {row.catagory_obc_cumulative}
                      </TableCell>
                      <TableCell
                        align="center"
                        style={{
                          border: '1px solid #ddd',
                          cursor: row.catagory_obc_finYear > 0 ? 'pointer' : 'default',
                          color: row.catagory_obc_finYear > 0 ? 'blue' : 'inherit'
                        }}
                        onClick={
                          row.catagory_obc_finYear > 0
                            ? () => handleByDistrict(row.districtCode, row.fromDate, row.toDate, 'finYear', 'OBC')
                            : undefined
                        }
                      >
                        {row.catagory_obc_finYear}
                      </TableCell>
                      <TableCell
                        align="center"
                        style={{
                          border: '1px solid #ddd',
                          cursor: row.catagory_gen_cumulative > 0 ? 'pointer' : 'default',
                          color: row.catagory_gen_cumulative > 0 ? 'blue' : 'inherit'
                        }}
                        onClick={
                          row.catagory_gen_cumulative > 0
                            ? () => handleByDistrict(row.districtCode, row.fromDate, row.toDate, 'cumulative', 'GEN')
                            : undefined
                        }
                      >
                        {row.catagory_gen_cumulative}
                      </TableCell>
                      <TableCell
                        align="center"
                        style={{
                          border: '1px solid #ddd',
                          cursor: row.catagory_gen_finYear > 0 ? 'pointer' : 'default',
                          color: row.catagory_gen_finYear > 0 ? 'blue' : 'inherit'
                        }}
                        onClick={
                          row.catagory_gen_finYear > 0
                            ? () => handleByDistrict(row.districtCode, row.fromDate, row.toDate, 'finYear', 'GEN')
                            : undefined
                        }
                      >
                        {row.catagory_gen_finYear}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}

          <input id="hiddenFinYear" type="hidden" />
          <input id="hiddenStateCode" type="hidden" />

          {rows.length > 0 && (
            <Grid item xs={12} sm={2}>
              <Button type="submit" onClick={handleDownload} variant="contained" color="primary">
                Download Excel
              </Button>
            </Grid>
          )}

          {rows.length > 0 && (
            <Grid item xs={12} sm={2}>
              <Button type="submit" onClick={fetchPdfData} variant="contained" color="primary">
                Download PDF
              </Button>
            </Grid>
          )}
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
          <h2>
            {flag} Report for {genderCategoryCode} for Financial Year {finYear}
          </h2>
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
          <DataGrid
            rows={rowsDistrict}
            columns={columns}
            sx={{
              border: '1px solid rgba(224, 224, 224, 1)',
              '& .MuiDataGrid-cell': { border: '1px solid rgba(224, 224, 224, 1)' },
              '& .MuiDataGrid-columnHeaders': { border: '1px solid rgba(224, 224, 224, 1)' }
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleClose}>
            Close
          </Button>
        </DialogActions>
      </BootstrapDialog>
    </div>
  );
}

export default GenderAndSocialCategory;
