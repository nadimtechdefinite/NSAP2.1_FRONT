import React, { useState } from 'react';
import {
  Grid,
  Button,
  FormControl,
  Divider,
  Chip,
  FormHelperText,
  Typography,
  CircularProgress,
  Backdrop,
  Snackbar,
  Alert
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import MainCard from 'ui-component/cards/MainCard';
import axiosInstance from 'hooks/useAuthTokenUrl';
import StateList from 'components/form_components/StateList';
import DistrictList from 'components/form_components/DistrictList';
import AreaList from 'components/form_components/AreaList';
import SubDistrictList from 'components/form_components/SubDistrictList';
import GramPanchayatList from 'components/form_components/GramPanchayatList';
import VillageList from 'components/form_components/VillageList';
import SearchComponent from 'components/common/SearchTypeCommon';
import messages_en from '../../../components/common/messages_en.json';
import dayjs from 'dayjs';

const DobUpdation = () => {
  const [selectedStateId, setSelectedState] = useState('');
  const [selectedDistrictId, setSelectedDistrict] = useState(null);
  const [selectedAreaId, setSelectedArea] = useState(null);
  const [selectedSubDistrictId, setSelectedSubDistrict] = useState(null);
  const [selectedGramPanchyat, setSelectedGramPanchyat] = useState(null);
  const [selectedVillage, setSelectedVillage] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [optionValues, setOptionValues] = useState(null);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState(null);
  const [rows, setRows] = useState([]);
  const [editedRows, setEditedRows] = useState({});

  const handleCloseSnackbar = () => setSnackbar(null);

  const validateForm = () => {
    const errors = {};
    if (!optionValues?.sanctionOrderNo && !selectedDistrictId) errors.selectedDistrictId = messages_en.districtRequired;
    if (!optionValues?.sanctionOrderNo && !selectedAreaId) errors.selectedAreaId = messages_en.areaRequired;
    if (!optionValues?.sanctionOrderNo && !selectedSubDistrictId) errors.selectedSubDistrictId = messages_en.subDistrictRequired;
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const fetchData = async () => {
    if (!validateForm()) return;
    setLoading(true);
    try {
      const location = {
        stateID: selectedStateId,
        districtID: selectedDistrictId,
        area: selectedAreaId,
        subDistID: selectedSubDistrictId,
        gpID: selectedGramPanchyat,
        villageID: selectedVillage
      };
      const cleanPayload = Object.fromEntries(Object.entries({ ...optionValues, ...location }).map(([k, v]) => [k, v === '' ? null : v]));
      const response = await axiosInstance.post('/dob-updation/getDobUpdation', JSON.stringify(cleanPayload));
      if (response.data?.length > 0) {
        const prepared = response.data.map((r) => ({
          ...r,
          id: r.sanctionOrderNo,
          applicantNameNew: r.applicantName,
          newDob: r.dob
        }));
        setRows(prepared);
        setEditedRows({});
        setSnackbar({ severity: 'success' });
      } else {
        setRows([]);
        setSnackbar({ children: 'No data found.', severity: 'error' });
      }
    } catch (error) {
      console.error('Error fetching:', error);
      setSnackbar({ children: 'Fetch error.', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const processRowUpdate = async (newRow) => {
    const original = rows.find((r) => r.sanctionOrderNo === newRow.sanctionOrderNo);
    const appNo = newRow.sanctionOrderNo.replace('S', 'A');

    const isNameChanged = newRow.applicantNameNew?.trim() !== original.applicantName?.trim();

    const newDobFormatted = newRow.newDob ? dayjs(newRow.newDob).format('YYYY-MM-DD') : null;
    const oldDobFormatted = original.dob ? dayjs(original.dob).format('YYYY-MM-DD') : null;
    const isDobChanged = newDobFormatted !== oldDobFormatted;

    if (isNameChanged || isDobChanged) {
      setEditedRows((prev) => ({
        ...prev,
        [appNo]: {
          ...original,
          applicantNameNew: newRow.applicantNameNew,
          newDob: newRow.newDob,
          sanctionOrderNo: newRow.sanctionOrderNo
        }
      }));
    } else {
      setEditedRows((prev) => {
        const updated = { ...prev };
        delete updated[appNo];
        return updated;
      });
    }

    return newRow;
  };

  const handleDOBChange = (sanctionOrderNo, newDob) => {
    const appNo = sanctionOrderNo.replace('S', 'A');
    const original = rows.find((r) => r.sanctionOrderNo === sanctionOrderNo);

    // Use edited name if available, otherwise the latest from rows
    const nameToUse = editedRows[appNo]?.applicantNameNew ?? original.applicantNameNew ?? original.applicantName;

    setEditedRows((prev) => ({
      ...prev,
      [appNo]: {
        ...original,
        ...prev[appNo],
        newDob,
        applicantNameNew: nameToUse,
        sanctionOrderNo
      }
    }));

    setRows((prev) => prev.map((r) => (r.sanctionOrderNo === sanctionOrderNo ? { ...r, newDob, applicantNameNew: nameToUse } : r)));
  };

  const handleSaveDobChanges = async () => {
    if (Object.keys(editedRows).length === 0) {
      setSnackbar({ children: 'No changes to save.', severity: 'info' });
      return;
    }

    const payload = {
      updatedData: Object.entries(editedRows).reduce((acc, [appNo, row]) => {
        acc[appNo] = {
          applicantNameNew: row.applicantNameNew,
          newDob: dayjs(row.newDob).format('YYYY-MM-DD'),
          sanctionOrderNo: row.sanctionOrderNo,
          stateCode: row.stateCode || selectedStateId,
          districtCode: row.districtCode || selectedDistrictId,
          area: row.area || selectedAreaId,
          subDistrictMunicipalAreaCode: row.subDistrictMunicipalAreaCode || selectedSubDistrictId,
          gramPanchayatWardCode: row.gramPanchayatWardCode || selectedGramPanchyat,
          villageCode: row.villageCode || selectedVillage
        };
        return acc;
      }, {})
    };

    try {
      setLoading(true);
      await axiosInstance.post(`/dob-updation/saveDobDetails`, payload);
      setSnackbar({
        severity: 'success',
        children: 'Changes sent for approval.'
      });
      fetchData();
    } catch (error) {
      console.error('Save error:', error);
      setSnackbar({ children: 'Failed to save.', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { field: 'sanctionOrderNo', headerName: 'Sanction Order No', flex: 1 },
    {
      field: 'applicantNameNew',
      headerName: 'Applicant Name',
      flex: 1,
      renderCell: (params) => {
        const appNo = params.row.sanctionOrderNo.replace('S', 'A');
        const value = editedRows[appNo]?.applicantNameNew ?? params.row.applicantNameNew ?? params.row.applicantName;

        return (
          <input
            type="text"
            value={value || ''}
            onChange={(e) => {
              const newName = e.target.value;
              setEditedRows((prev) => ({
                ...prev,
                [appNo]: {
                  ...params.row,
                  ...prev[appNo],
                  applicantNameNew: newName,
                  sanctionOrderNo: params.row.sanctionOrderNo
                }
              }));
              setRows((prev) =>
                prev.map((r) => (r.sanctionOrderNo === params.row.sanctionOrderNo ? { ...r, applicantNameNew: newName } : r))
              );
            }}
            onKeyDown={(e) => e.stopPropagation()}
            style={{
              width: '100%',
              border: '1px solid #ccc',
              borderRadius: '4px',
              padding: '4px'
            }}
          />
        );
      }
    },
    { field: 'fatherHusbandName', headerName: 'Father/Husband Name', flex: 1 },
    { field: 'gender', headerName: 'Gender', flex: 1 },
    { field: 'schemeCode', headerName: 'Scheme Code', flex: 1 },
    {
      field: 'newDob',
      headerName: 'New DOB',
      flex: 1,
      editable: true,
      renderCell: (params) => {
        const appNo = params.row.sanctionOrderNo.replace('S', 'A');
        const edited = editedRows?.[appNo]?.newDob ?? params.row.newDob ?? params.row.dob;

        return (
          <input
            type="date"
            value={edited ? dayjs(edited).format('YYYY-MM-DD') : ''}
            min={params.row.minDate || ''}
            max={params.row.maxDate || ''}
            onChange={(e) => handleDOBChange(params.row.sanctionOrderNo, e.target.value)}
            style={{ width: '100%', border: 'none', background: 'transparent' }}
          />
        );
      }
    }
  ];

  return (
    <MainCard title="DOB Updation">
      {!!snackbar && (
        <Snackbar open anchorOrigin={{ vertical: 'top', horizontal: 'center' }} onClose={handleCloseSnackbar} autoHideDuration={6000}>
          <Alert
            {...snackbar}
            onClose={() => {
              handleCloseSnackbar();
              snackbar?.onClose?.();
            }}
          />
        </Snackbar>
      )}
      <Backdrop open={loading} style={{ zIndex: 999, color: '#fff' }}>
        <CircularProgress color="inherit" />
      </Backdrop>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          fetchData();
        }}
      >
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <StateList onSelectState={setSelectedState} />
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <DistrictList
                selectedStateId={selectedStateId}
                setSelectedDistrict={setSelectedDistrict}
                onSelectDistrict={setSelectedDistrict}
              />
              {formErrors.selectedDistrictId && (
                <FormHelperText>
                  <Typography style={{ color: 'red', fontSize: '0.8rem' }}>{formErrors.selectedDistrictId}</Typography>
                </FormHelperText>
              )}
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <AreaList selectedDistrictId={selectedDistrictId} selectedArea={selectedAreaId} onSelectArea={setSelectedArea} />
              {formErrors.selectedAreaId && (
                <FormHelperText>
                  <Typography style={{ color: 'red', fontSize: '0.8rem' }}>{formErrors.selectedAreaId}</Typography>
                </FormHelperText>
              )}
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <SubDistrictList
                selectedAreaId={selectedAreaId}
                selectedDistrictId={selectedDistrictId}
                setSelectedSubDistrict={setSelectedSubDistrict}
                onSelectSubDistrict={setSelectedSubDistrict}
              />
              {formErrors.selectedSubDistrictId && (
                <FormHelperText>
                  <Typography style={{ color: 'red', fontSize: '0.8rem' }}>{formErrors.selectedSubDistrictId}</Typography>
                </FormHelperText>
              )}
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <GramPanchayatList
                selectedSubDistrictMunicipalAreaId={selectedSubDistrictId}
                setSelectedGramPanchayat={setSelectedGramPanchyat}
                onSelectGramPanchayat={setSelectedGramPanchyat}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <VillageList
                selectedGramPanchayatId={selectedGramPanchyat}
                setSelectedVillage={setSelectedVillage}
                onSelectVillage={setSelectedVillage}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={12}>
            <Divider>
              <Chip label="OR SEARCH BY" />
            </Divider>
          </Grid>
          <Grid item xs={12} sm={4}>
            <SearchComponent
              options={{ sanctionOrderNo: 'Sanction Order No' }}
              onOptionValuesChange={(newValues) => {
                const upperCaseSanction = newValues?.sanctionOrderNo?.toUpperCase?.() || '';
                setOptionValues({ ...newValues, sanctionOrderNo: upperCaseSanction });
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <Button type="submit" variant="contained" color="secondary">
              Submit
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
                processRowUpdate={processRowUpdate}
                experimentalFeatures={{ newEditingApi: true }}
                initialState={{
                  columns: {
                    columnVisibilityModel: {
                      dob: false
                    }
                  }
                }}
              />
            </div>
          </Grid>
          <Grid item xs={12} style={{ textAlign: 'right' }}>
            <Button variant="contained" color="primary" onClick={handleSaveDobChanges}>
              Save DOB Changes
            </Button>
          </Grid>
        </Grid>
      )}
    </MainCard>
  );
};

export default DobUpdation;
