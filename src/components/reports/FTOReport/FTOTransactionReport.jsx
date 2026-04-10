import React, { useState } from 'react';
import {
  Grid,
  Paper,
  FormControl,
  Typography,
  Button,
  Snackbar,
  Alert,
  FormHelperText,
  CircularProgress,
  Backdrop,
  MenuItem,
  Select,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  InputLabel
} from '@mui/material';
import MandatoryFields from 'components/common/MandatoryFields';
import YearList from '../common-component/YearList';
import MonthList from '../../form_components/MonthListForAdmin';
import StateList from '../../form_components/StateList';
import SchemeList from '../../form_components/SchemeList';
import axiosInstance from 'hooks/useAuthTokenUrl';
import SaveAlt from '@mui/icons-material/SaveAlt';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
const FTOTransactionReport = (isMandatory) => {
  const [formData, setFormData] = useState({
    year: '',
    month: '',
    stateCode: '',
    schemeCode: '',
    ftoStatus: ''
  });

  const [formErrors, setFormErrors] = useState({});
  const [snackbar, setSnackbar] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showValidationPopup, setShowValidationPopup] = useState(false);
  const [unvalidField, setUnvalidField] = useState('');
  const [reportData, setReportData] = useState([]);
  const [submittedScheme, setSubmittedScheme] = useState('');
  const [formKey, setFormKey] = useState(0);
  const schemeList = ['IGNOAPS', 'IGNDPS', 'IGNWPS', 'NFBS'];

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setFormErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const handleCloseSnackbar = () => {
    setSnackbar(null);
  };

  const fetchData = async () => {
    const { year, month, stateCode, schemeCode, ftoStatus } = formData;
    const errors = {};

    if (!year) {
      errors.year = 'Year is required';
      setUnvalidField('Year');
    } else if (!month) {
      errors.month = 'Month is required';
      setUnvalidField('Month');
    } else if (!stateCode) {
      errors.stateCode = 'State is required';
      setUnvalidField('State');
    } else if (!schemeCode) {
      errors.schemeCode = 'Scheme is required';
      setUnvalidField('Scheme');
    } else if (!ftoStatus) {
      errors.ftoStatus = 'FTO Status is required';
      setUnvalidField('FTO Status');
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      setShowValidationPopup(true);
      return;
    }

    setFormErrors({});
    setShowValidationPopup(false);
    setUnvalidField('');

    try {
      setLoading(true);
      const response = await axiosInstance.get('/fto/fto-transaction', {
        params: { ...formData }
      });

      setReportData(response.data);
      setSubmittedScheme(formData.schemeCode);
      setSnackbar({ severity: 'success', message: 'Report data fetched successfully.' });
    } catch (error) {
      console.error(error);
      setSnackbar({ severity: 'error', message: 'Error fetching report data.' });
    } finally {
      setLoading(false);
    }
  };

 

  const pivotedData = reportData.reduce((acc, curr) => {
    const state = curr.stateName;
    if (!acc[state]) {
      acc[state] = {
        stateName: state,
        IGNOAPS: {},
        IGNDPS: {},
        IGNWPS: {},
        NFBS: {}
      };
    }
    acc[state][curr.schemeCode] = {
      ftoGenerated: curr.ftoGenerated,
      totalBeneficiaries: curr.totalBeneficiaries,
      succRec: curr.succRec,
      unsucRec: curr.unsucRec,
      pendingRec: curr.pendingRec,
      apbAmt: parseFloat(curr.apbAmt).toFixed(2),
      neftAmt: parseFloat(curr.neftAmt).toFixed(2),
      poAmt: parseFloat(curr.poAmt).toFixed(2)
    };
    return acc;
  }, {});

  const handleDownloadExcel = () => {
    const wb = XLSX.utils.book_new();
    const wsData = [];

    const headerRow1 = ['State'];
    const headerRow2 = [''];

    const schemes = submittedScheme === 'ALL' ? schemeList : [submittedScheme];

    schemes.forEach((scheme) => {
      headerRow1.push(scheme, '', '', '', '', '', '', '', '');
      headerRow2.push(
        'FTO Generated',
        'No. of Beneficiary',
        'Credit Response Success',
        'Credit Response Fail',
        'Credit Response Pending',
        'ABP Payment',
        'NEFT Payment',
        'PO Payment'
      );
    });

    wsData.push(headerRow1);
    wsData.push(headerRow2);

    Object.values(pivotedData).forEach((row) => {
      const rowData = [row.stateName];
      schemes.forEach((scheme) => {
        const data = row[scheme] || {};
        rowData.push(
          data.ftoGenerated || '-',
          data.totalBeneficiaries || '-',
          data.succRec || '-',
          data.unsucRec || '-',
          data.pendingRec || '-',
          data.apbAmt || '-',
          data.neftAmt || '-',
          data.poAmt || '-'
        );
      });
      wsData.push(rowData);
    });

    const ws = XLSX.utils.aoa_to_sheet(wsData);

    // Apply bold + background color to first 2 header rows
    const totalCols = 1 + schemes.length * 8; // State + 8 columns per scheme

    for (let c = 0; c < totalCols; c++) {
      const cell1 = ws[XLSX.utils.encode_cell({ r: 0, c })];
      const cell2 = ws[XLSX.utils.encode_cell({ r: 1, c })];

      if (cell1) {
        cell1.s = {
          font: { bold: true, color: { rgb: 'FFFFFF' } },
          fill: { fgColor: { rgb: '4F81BD' } },
          alignment: { horizontal: 'center', vertical: 'center' }
        };
      }
      if (cell2) {
        cell2.s = {
          font: { bold: true },
          fill: { fgColor: { rgb: 'D9E1F2' } },
          alignment: { horizontal: 'center' }
        };
      }
    }

    // Adjust column widths (optional)
    ws['!cols'] = Array(totalCols).fill({ wch: 20 });

    XLSX.utils.book_append_sheet(wb, ws, 'FTO Report');

    const wbout = XLSX.write(wb, {
      bookType: 'xlsx',
      type: 'array',
      cellStyles: true
    });

    saveAs(new Blob([wbout], { type: 'application/octet-stream' }), `FTO_Report_${formData.year}_${formData.month}.xlsx`);
  };
  const handleCancel = () => {
    setFormData({
      year: '',
      month: '',
      stateCode: '',
      schemeCode: '',
      ftoStatus: ''
    });
    setReportData([]);
    setSubmittedScheme('');
    setFormErrors({});
    setShowValidationPopup(false);
    setUnvalidField('');
    setFormKey((prev) => prev + 1);
  };
  return (
    <Paper elevation={3} style={{ padding: '20px', marginTop: '20px' }}>

      <Backdrop open={loading} style={{ zIndex: 999, color: '#fff' }}>
        <CircularProgress color="inherit" />
      </Backdrop>
       <form key={formKey} autoComplete="off">
      <Grid container spacing={2}>
        <Grid item xs={12} sm={3}>
          <FormControl fullWidth error={!!formErrors.year}>
            <YearList value={formData.year} onSelectYear={(val) => handleChange('year', val)} isMendatory={true} />
            {formErrors.year && <FormHelperText>{formErrors.year}</FormHelperText>}
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={3}>
          <FormControl fullWidth error={!!formErrors.month}>
            <MonthList value={formData.month} onSelectMonth={(val) => handleChange('month', val)} isMendatory={true} />
            {formErrors.month && <FormHelperText>{formErrors.month}</FormHelperText>}
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={3}>
          <FormControl fullWidth error={!!formErrors.stateCode}>
            <StateList
              value={formData.stateCode}
              onSelectState={(val) => handleChange('stateCode', val)}
              isMandatory={true}
              showAllIndex={true}
            />
            {formErrors.stateCode && <FormHelperText>{formErrors.stateCode}</FormHelperText>}
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={3}>
          <FormControl fullWidth error={!!formErrors.schemeCode}>
            <SchemeList
              value={formData.schemeCode}
              onSelectScheme={(val) => handleChange('schemeCode', val)}
              isMandatory={true}
              showAllIndex={true}
              selectedStateCode={formData.stateCode}
            />
            {formErrors.schemeCode && <FormHelperText>{formErrors.schemeCode}</FormHelperText>}
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={3}>
          <FormControl fullWidth error={!!formErrors.ftoStatus}>
            <InputLabel id="ftoStatus-label">FTO Status {isMandatory && <span style={{ color: 'red' }}>*</span>}</InputLabel>
            <Select
              labelId="ftoStatus-label"
              id="ftoStatus"
              name="ftoStatus"
              value={formData.ftoStatus}
              onChange={(e) => handleChange('ftoStatus', e.target.value)}
              label="FTO Status"
              required={isMandatory}
              readOnly={false}
            >
              <MenuItem value="" disabled>
                Select FTO Status
              </MenuItem>
              <MenuItem value="All">All</MenuItem>
              <MenuItem value="Done">Accepted</MenuItem>
              <MenuItem value="REJECTED">Rejected</MenuItem>
              <MenuItem value="Pending">Under Process</MenuItem>
            </Select>
            {formErrors.ftoStatus && <FormHelperText>{formErrors.ftoStatus}</FormHelperText>}
          </FormControl>
        </Grid>
      </Grid>

      <Grid item xs={12} sm={2}>
        <Button variant="contained" color="primary" style={{ marginTop: '20px' }} onClick={fetchData}>
          Submit
        </Button>
        &nbsp;&nbsp;&nbsp;
        <Button
          variant="contained"
          color="secondary"
          style={{ marginTop: '20px' }}
          onClick={handleDownloadExcel}
          disabled={reportData.length === 0}
        >
          <SaveAlt style={{ color: 'white' }} />
          Excel
        </Button>
         &nbsp;&nbsp;&nbsp;
         <Button variant="outlined" color="secondary" style={{ marginTop: '20px' }} onClick={handleCancel}>
            Cancel
          </Button>
      </Grid>
      </form>
      {(formData.year || formData.month || formData.stateCode || formData.schemeCode || formData.ftoStatus) && (
        <Typography variant="body1" style={{ marginTop: '20px' }}>
          Showing report for:&nbsp;
          {formData.year && <strong>Year: {formData.year}</strong>}&nbsp;
          {formData.month && <strong>Month: {formData.month}</strong>}&nbsp;
          {formData.stateCode && <strong>State: {formData.stateCode}</strong>}&nbsp;
          {formData.schemeCode && <strong>Scheme: {formData.schemeCode}</strong>}&nbsp;
          {formData.ftoStatus && (
            <strong>
              FTO Status:{' '}
              {formData.ftoStatus === 'Done'
                ? 'Accepted'
                : formData.ftoStatus === 'REJECTED'
                ? 'Rejected'
                : formData.ftoStatus === 'Pending'
                ? 'Under Process'
                : 'All'}
            </strong>
          )}
        </Typography>
      )}

      {showValidationPopup && <MandatoryFields fieldName={unvalidField} />}

      {!!snackbar && (
        <Snackbar open anchorOrigin={{ vertical: 'top', horizontal: 'center' }} onClose={handleCloseSnackbar} autoHideDuration={6000}>
          <Alert severity={snackbar.severity} onClose={handleCloseSnackbar}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      )}

      <style>{`
        .tbl-social-cat {
          border-collapse: collapse;
        }
        .tbl-social-cat th,
        .tbl-social-cat td {
          border: 1px solid #ddd;
          text-align: center;
        }
        .tbl-social-cat th {
          color: #33b5e5;
          font-size: 15px;
        }
        .tbl-social-cat tr > td:nth-child(1) {
          color: #33b5e5;
          font-weight: bold;
        }
        .scheme-ignoaps {
          background-color: #FCF3CF;
        }
        .scheme-ignwps {
          background-color: #FCF3CF;
        }
        .scheme-igndps {
          background-color: #D4EFDF;
        }
        .scheme-nfbs {
          background-color: #E0F7FA;
        }
      `}</style>

      {reportData.length > 0 && (
        <Paper elevation={2} style={{ marginTop: '30px' }}>
          <TableContainer component={Paper}>
            <Table className="tbl-social-cat">
              <TableHead>
                <TableRow>
                  <TableCell rowSpan={2}>State</TableCell>
                  {(submittedScheme === 'ALL' ? schemeList : [submittedScheme]).map((scheme) => (
                    <TableCell key={scheme} colSpan={8} className={`scheme-${scheme.toLowerCase()}`}>
                      <strong>{scheme}</strong>
                    </TableCell>
                  ))}
                </TableRow>
                <TableRow>
                  {(submittedScheme === 'ALL' ? schemeList : [submittedScheme]).map((scheme) => (
                    <React.Fragment key={scheme}>
                      <TableCell className={`scheme-${scheme.toLowerCase()}`}>FTO Generated</TableCell>
                      <TableCell className={`scheme-${scheme.toLowerCase()}`}>No. Of Beneficiary</TableCell>
                      <TableCell className={`scheme-${scheme.toLowerCase()}`}>Credit Response Success</TableCell>
                      <TableCell className={`scheme-${scheme.toLowerCase()}`}>Credit Response Fail</TableCell>
                      <TableCell className={`scheme-${scheme.toLowerCase()}`}>Credit Response Pending</TableCell>
                      <TableCell className={`scheme-${scheme.toLowerCase()}`}>ABP Payment</TableCell>
                      <TableCell className={`scheme-${scheme.toLowerCase()}`}>NEFT Payment</TableCell>
                      <TableCell className={`scheme-${scheme.toLowerCase()}`}>PO Payment</TableCell>
                    </React.Fragment>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {Object.values(pivotedData).map((row, index) => (
                  <TableRow key={index}>
                    <TableCell>{row.stateName}</TableCell>
                    {(submittedScheme === 'ALL' ? schemeList : [submittedScheme]).map((scheme) => {
                      const data = row[scheme] || {};
                      return (
                        <React.Fragment key={scheme}>
                          <TableCell className={`scheme-${scheme.toLowerCase()}`}>{data.ftoGenerated || '-'}</TableCell>
                          <TableCell className={`scheme-${scheme.toLowerCase()}`}>{data.totalBeneficiaries || '-'}</TableCell>
                          <TableCell className={`scheme-${scheme.toLowerCase()}`}>{data.succRec || '-'}</TableCell>
                          <TableCell className={`scheme-${scheme.toLowerCase()}`}>{data.unsucRec || '-'}</TableCell>
                          <TableCell className={`scheme-${scheme.toLowerCase()}`}>{data.pendingRec || '-'}</TableCell>
                          <TableCell className={`scheme-${scheme.toLowerCase()}`}>{data.apbAmt || '-'}</TableCell>
                          <TableCell className={`scheme-${scheme.toLowerCase()}`}>{data.neftAmt || '-'}</TableCell>
                          <TableCell className={`scheme-${scheme.toLowerCase()}`}>{data.poAmt || '-'}</TableCell>
                        </React.Fragment>
                      );
                    })}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}
    </Paper>
  );
};

export default FTOTransactionReport;
