import React, { useState } from 'react';
import {
  Grid,
  Button,
  CircularProgress,
  Snackbar,
  Alert,
  Backdrop,
  Divider,
  Chip,
  FormHelperText,
  Typography,
  TextField,
  FormControl
} from '@mui/material';
import StateList from 'components/form_components/StateList';
import DistrictList from 'components/form_components/DistrictList';
import AreaList from 'components/form_components/AreaList';
import SubDistrictList from 'components/form_components/SubDistrictList';
import GramPanchayatList from 'components/form_components/GramPanchayatList';
import VillageList from 'components/form_components/VillageList';
import SearchComponent from 'components/common/SearchTypeCommon';
import MainCard from 'ui-component/cards/MainCard';
import axiosInstance from 'hooks/useAuthTokenUrl';
import { DataGrid } from '@mui/x-data-grid';
import messages_en from 'components/common/messages_en.json';

function ApproveDobDetailsUpdation() {
  const [stateCode, setState] = useState('');
  const [districtCode, setDistrict] = useState('');
  const [area, setArea] = useState('');
  const [subDistrictCode, setSubDistrict] = useState('');
  const [gramPanchayatCode, setGramPanchayat] = useState('');
  const [villageCode, setVillage] = useState('');
  const [formErrors, setFormErrors] = useState({});
  const [optionValues, setOptionValues] = useState(null);
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState([]);
  const [snackbar, setSnackbar] = useState(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const [remarksMap, setRemarksMap] = useState({});

  const handleCloseSnackbar = () => setSnackbar(null);

  const validateForm = () => {
    const errors = {};
    if (!optionValues?.sanctionOrderNo && !districtCode) errors.districtCode = messages_en.districtRequired;
    if (!optionValues?.sanctionOrderNo && !area) errors.area = messages_en.areaRequired;
    if (!optionValues?.sanctionOrderNo && !subDistrictCode) errors.subDistrictCode = messages_en.subDistrictRequired;
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const fetchApprovalData = async () => {
    if (!validateForm()) return;
    setLoading(true);
    try {
      const payload = {
        ...optionValues,
        stateID: stateCode,
        districtID: districtCode,
        area,
        subDistID: subDistrictCode,
        gpID: gramPanchayatCode,
        villageID: villageCode
      };
      Object.keys(payload).forEach((key) => {
        if (typeof payload[key] === 'string' && payload[key].trim() === '') {
          payload[key] = null;
        }
      });
      const response = await axiosInstance.post('/dob-updation/getDobApprovalData', JSON.stringify(payload));
      console.log('checkkkkk', response.data);
      setRows(response.data || []);
      setRemarksMap({});
      setSelectedRows([]);
      if (response.data && response.data.length > 0) {
        setRows(response.data);
        setSnackbar({ severity: 'success', children: 'Beneficiary available for approval.' });
      } else {
        setRows([]);
        setSnackbar({ severity: 'info', children: 'No beneficiary available for approval.' });
      }
    } catch (err) {
      setSnackbar({ severity: 'error', children: 'Error fetching DOB approval data.' });
    } finally {
      setLoading(false);
    }
  };

  const handleSelectionChange = (newSelection) => {
    setSelectedRows(newSelection);
  };

  const handleRemarksChange = (id, value) => {
    setRemarksMap((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (actionType) => {
    const endpoint = actionType === 'approve' ? '/dob-updation/approveDobDetails' : '/dob-updation/rejectDobDetails';
    const payload = selectedRows.map((rowId) => {
      const row = rows.find((r) => r.sanctionOrderNo === rowId);
      return {
        sanctionOrderNo: row.sanctionOrderNo,
        applicantName: row.applicantName,
        applicant_name_old: row.applicant_name_old,
        applicant_name_new: row.applicant_name_new,
        dateOfBirthOld: row.dateOfBirthOld,
        dateOfBirthNew: row.dateOfBirthNew,
        remarks: remarksMap[rowId] || ''
      };
    });

    const hasMissingRemarks = payload.some((item) => !item.remarks.trim());
    if (hasMissingRemarks) {
      setSnackbar({ severity: 'error', children: 'Remarks are mandatory for all selected rows.' });
      return;
    }

    try {
      setLoading(true);
      await axiosInstance.post(endpoint, payload);
      setSnackbar({ severity: 'success', children: `DOB ${actionType === 'approve' ? 'approvals' : 'rejections'} submitted.` });
      fetchApprovalData();
    } catch (err) {
      console.error(err);
      setSnackbar({ severity: 'error', children: `Failed to ${actionType} DOB details.` });
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { field: 'sanctionOrderNo', headerName: 'Sanction Order No', flex: 1 },
    { field: 'applicantName', headerName: 'Applicant Name', flex: 1 },
    { field: 'applicant_name_old', headerName: 'Old Name', flex: 1 },
    { field: 'applicant_name_new', headerName: 'New Name', flex: 1 },
    { field: 'dateOfBirthOld', headerName: 'Old DOB', flex: 1 },
    { field: 'dateOfBirthNew', headerName: 'New DOB', flex: 1 },
    {
      field: 'remarks',
      headerName: 'Remarks',
      flex: 1,
      renderCell: (params) => (
        <FormControl fullWidth>
          <TextField
            size="small"
            variant="outlined"
            value={remarksMap[params.row.sanctionOrderNo] || ''}
            onChange={(e) => handleRemarksChange(params.row.sanctionOrderNo, e.target.value)}
            onKeyDown={(e) => e.stopPropagation()}
          />
        </FormControl>
      )
    }
  ];

  return (
    <MainCard title="DOB Approval">
      {snackbar && (
        <Snackbar open autoHideDuration={6000} onClose={handleCloseSnackbar}>
          <Alert {...snackbar} onClose={handleCloseSnackbar} />
        </Snackbar>
      )}

      <Backdrop open={loading} style={{ zIndex: 999 }}>
        <CircularProgress color="inherit" />
      </Backdrop>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          fetchApprovalData();
        }}
      >
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <StateList onSelectState={setState} />
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <DistrictList selectedStateId={stateCode} onSelectDistrict={setDistrict} />
              {formErrors.districtCode && (
                <FormHelperText>
                  <Typography style={{ color: 'red' }}>{formErrors.districtCode}</Typography>
                </FormHelperText>
              )}
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <AreaList selectedDistrictId={districtCode} onSelectArea={setArea} />
              {formErrors.area && (
                <FormHelperText>
                  <Typography style={{ color: 'red' }}>{formErrors.area}</Typography>
                </FormHelperText>
              )}
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <SubDistrictList selectedAreaId={area} selectedDistrictId={districtCode} onSelectSubDistrict={setSubDistrict} />
              {formErrors.subDistrictCode && (
                <FormHelperText>
                  <Typography style={{ color: 'red' }}>{formErrors.subDistrictCode}</Typography>
                </FormHelperText>
              )}
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <GramPanchayatList selectedSubDistrictMunicipalAreaId={subDistrictCode} onSelectGramPanchayat={setGramPanchayat} />
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <VillageList selectedGramPanchayatId={gramPanchayatCode} onSelectVillage={setVillage} />
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <Divider>
              <Chip label="OR SEARCH BY" />
            </Divider>
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <SearchComponent options={{ sanctionOrderNo: 'Sanction Order No' }} onOptionValuesChange={setOptionValues} />
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <Button variant="contained" color="secondary" type="submit">
              Search
            </Button>
          </Grid>
        </Grid>
      </form>

      {rows.length > 0 && (
        <Grid container spacing={2} style={{ marginTop: 20 }}>
          <Grid item xs={12}>
            <div style={{ height: 400, width: '100%' }}>
              <DataGrid
                rows={rows}
                columns={columns}
                getRowId={(row) => row.sanctionOrderNo}
                checkboxSelection
                disableRowSelectionOnClick
                onRowSelectionModelChange={handleSelectionChange}
                pageSize={5}
              />
            </div>
          </Grid>
          <Grid item xs={12} style={{ textAlign: 'right' }}>
            <Button variant="contained" color="primary" onClick={() => handleSubmit('approve')} disabled={selectedRows.length === 0}>
              Approve Selected
            </Button>{' '}
            <Button variant="contained" color="error" onClick={() => handleSubmit('reject')} disabled={selectedRows.length === 0}>
              Reject Selected
            </Button>
          </Grid>
        </Grid>
      )}
    </MainCard>
  );
}

export default ApproveDobDetailsUpdation;
