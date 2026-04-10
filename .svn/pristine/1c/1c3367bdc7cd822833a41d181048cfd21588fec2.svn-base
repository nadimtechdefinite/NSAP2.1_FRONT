import Box from '@mui/material/Box';
import MainCard from 'ui-component/cards/MainCard';
import { DataGrid, GridToolbar, GridCellModes } from '@mui/x-data-grid';
import React, { useState } from 'react';
import { Grid, Button, FormControl, Divider, Chip, CircularProgress, Backdrop, FormHelperText, Typography } from '@mui/material';
import axiosInstance from 'hooks/useAuthTokenUrl';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import StateList from 'components/form_components/StateList';
import DistrictList from 'components/form_components/DistrictList';
import SubDistrictList from 'components/form_components/SubDistrictList';
import GramPanchayatList from 'components/form_components/GramPanchayatList';
import VillageList from 'components/form_components/VillageList';
import AreaList from 'components/form_components/AreaList';
import SearchComponent from 'components/common/SearchTypeCommon';
import { useNavigate } from 'react-router-dom';
import messages_en from '../../components/common/messages_en.json';
import '../../components/verification/mark-nsap-beneficiary/approveMarkBeneficiary.css';

export default function PrintSanctionOrder() {
  const navigate = useNavigate();
  const [getAllDisData, setAllDisConData] = useState([]);
  const [selectedStateId, setSelectedState] = useState(null);
  const [snackbar, setSnackbar] = React.useState(null);
  const handleCloseSnackbar = () => setSnackbar(null);
  const [loading, setLoading] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  function cancelValue() {
    navigate('/nsap/dashboard/default');
  }

  const columns = [
    {
      field: 'sanctionOrderNo',
      headerName: 'Sanction Order No',
      editable: false,
      flex: 1,
      disableColumnMenu: true,
      headerClassName: 'bkColr'
    },
    {
      field: 'applicantName',
      headerName: 'Applicant Name',
      editable: false,
      flex: 1,
      disableColumnMenu: true,
      headerClassName: 'bkColr'
    },
    {
      field: 'fatherHusbandName',
      headerName: 'Father/Husband Name',
      editable: false,
      flex: 1,
      disableColumnMenu: true,
      headerClassName: 'bkColr'
    },
    {
      field: 'mobileNumber',
      headerName: 'Mobile Number',
      editable: false,
      flex: 1,
      disableColumnMenu: true,
      headerClassName: 'bkColr'
    },
    {
      field: 'ageData',
      headerName: 'Date Of Birth',
      editable: false,
      flex: 1,
      disableColumnMenu: true,
      headerClassName: 'bkColr'
    },

    {
      field: 'action',
      headerName: 'Action',
      headerClassName: 'bkColr',
      sortable: false,
      disableColumnMenu: true,
      width: 180,
      headerAlign: '',
      renderCell: (params) => (
        <>
          <Button
            variant="outlined"
            color="primary"
            title="Print Sanction"
            style={{ cursor: 'pointer', fontSize: '12px', marginRight: '8px' }}
            onClick={(e) => handleButtonForView(e, params.row.id)}
          >
            Print Sanction
          </Button>
        </>
      )
    }
  ];

  const validateForm = () => {
    const errors = {};
    if (optionValues.sanctionOrderNo === null && !selectedDistrictId) {
      errors.selectedDistrictId = messages_en.districtRequired;
    }
    if (optionValues.sanctionOrderNo === null && !selectedAreaId) {
      errors.selectedAreaId = messages_en.areaRequired;
    }
    if (optionValues.sanctionOrderNo === null && !selectedSubDistrictId) {
      errors.selectedSubDistrictId = messages_en.subDistrictRequired;
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const options = {
    sanctionOrderNo: 'Sanction Order No'
  };
  const [optionValues, setOptionValues] = useState(null);
  const handleSearchOptionValuesChange = (newOptionValues) => {
    //alert('--- '+newOptionValues.searchText);
    setOptionValues(newOptionValues);
  };
  const handleSelectState = (state) => {
    setSelectedState(state);
  };
  const [selectedDistrictId, setSelectedDistrict] = useState(null);
  const handleSelectDistrict = (selectedDistrictId) => {
    setSelectedDistrict(selectedDistrictId);
    setSelectedArea(null);
    setSelectedSubDistrict(null);
    setSelectedGP(null);
    setSelectedVillage(null);
    setFormErrors((prevErrors) => {
      const updatedErrors = { ...prevErrors };
      delete updatedErrors.selectedDistrictId;
      return updatedErrors;
    });
  };
  const [selectedAreaId, setSelectedArea] = useState(null);
  const handleSelectArea = (selectedAreaId) => {
    setSelectedArea(selectedAreaId);
    setSelectedSubDistrict(null);
    setSelectedGP(null);
    setSelectedVillage(null);
    setFormErrors((prevErrors) => {
      const updatedErrors = { ...prevErrors };
      delete updatedErrors.selectedAreaId;
      return updatedErrors;
    });
  };
  const [selectedSubDistrictId, setSelectedSubDistrict] = useState(null);
  const handleSelectSubDistrict = (selectedSubDistrictId) => {
    setSelectedSubDistrict(selectedSubDistrictId);
    setSelectedGP(null);
    setSelectedVillage(null);
    setFormErrors((prevErrors) => {
      const updatedErrors = { ...prevErrors };
      delete updatedErrors.selectedSubDistrictId;
      return updatedErrors;
    });
  };
  const [selectedGP, setSelectedGP] = useState(null);
  const handleSelectGP = (selectedGP) => {
    setSelectedGP(selectedGP);
    setSelectedVillage(null);
  };

  const [selectedVillage, setSelectedVillage] = useState(null);
  const handleSelectVillgae = (selectedVillage) => {
    setSelectedVillage(selectedVillage);
  };
  const handleClickOpen = (e) => {
    e.preventDefault();
    fetchData()
      .then((res) => {
        if (res) {
          const districtData = res || [];
          setAllDisConData(districtData);
          console.log('chck 123', JSON.stringify(res));
        } else {
          setAllDisConData([]);
          //setSnackbar({ children: 'No Data Found', severity: 'error' });
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
            if (updatedRow.sanctionOrderNo?.trim() === '') {
              reject(new Error("Error: District Name can't be empty."));
            } else {
              resolve({ ...updatedRow, sanctionOrderNo: updatedRow.sanctionOrderNo?.toUpperCase() });
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
      try {
        var location = {
          stateID: selectedStateId,
          districtID: selectedDistrictId,
          area: selectedAreaId,
          subDistID: selectedSubDistrictId,
          gpID: selectedGP,
          villageID: selectedVillage
        };
        var body = { ...optionValues, ...location };
        const getUrl = `/print-sanction-order-master/getPrintSanctionOrderNo`;
        setLoading(true);
        const response = await axiosInstance.post(getUrl, body);
        // console.log("---------------------"+response[0].status);
        if (response.status >= 200 && response.status < 300) {
          if (response.data.length > 0) {
            return response.data;
          } else {
            setSnackbar({ children: 'No Data Found!', severity: 'error' });
          }
        } else {
          return false;
          //  throw new Error('Data coud not be fetched!', response.data)
        }
      } catch (error) {
        if (error.response.data.sanctionOrderNo) {
          setSnackbar({ children: error.response.data.sanctionOrderNo, severity: 'error' });
        } else {
          setSnackbar({ children: 'No Data Found', severity: 'error' });
        }

        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const rows = getAllDisData.map((item) => ({
    id: item.sanctionOrderNo,
    applicantName: item.applicantName,
    fatherHusbandName: item.fatherHusbandName,
    mobileNumber: item.mobileNumber,
    sanctionOrderNo: item.sanctionOrderNo,
    ageData: item.ageData
  }));
  const processRowUpdate = React.useCallback(
    async (updatedRow) => {
      try {
        const updatedRowData = await mutateRow(updatedRow);
        console.log('updatedRow check status : ', updatedRowData);

        setAllDisConData((prevRows) => {
          // Find the index of the updated row
          const rowIndex = prevRows.findIndex((row) => row.sanctionOrderNo === updatedRowData.sanctionOrderNo);

          const updatedRows = [...prevRows];
          updatedRows[rowIndex] = {
            ...updatedRows[rowIndex], // Keep the existing fields

            sanctionRemarks: updatedRowData.sanctionRemarks, // Update only the 'status' field (replace with your field names)
            sanctionDate: updatedRowData.sanctionDate,
            pensionEffectiveDate: updatedRowData.pensionEffectiveDate
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
    [mutateRow, setAllDisConData, setSnackbar]
  );

  async function handleButtonForView(id, appno) {
    try {
      console.log('-- ' + appno + ' - ' + id);
      //const postUrl = `/print-sanction-order-master/download`;
      const postUrl = `/print-sanction-order-master/getSanctionOrderNoData/${appno}`;
      setLoading(true);
      const response = await axiosInstance.post(postUrl, {}, { responseType: 'blob' });
      console.log('check213', JSON.stringify(response));

      // Create a Blob from the PDF data
      const pdfBlob = new Blob([response.data], { type: 'application/pdf' });

      // Create a link element and trigger a download
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(pdfBlob);
      link.download = 'IndividualBeneficiaryReport.pdf';
      link.click();
    } catch (e) {
      console.log('error: ', e);
    } finally {
      setLoading(false);
    }
  }

  const [cellModesModel, setCellModesModel] = React.useState({});

  const handleCellClick = React.useCallback((params, event) => {
    if (!params.isEditable) {
      return;
    }

    // Ignore portal
    if (event.target.nodeType === 1 && !event.currentTarget.contains(event.target)) {
      return;
    }

    setCellModesModel((prevModel) => {
      return {
        // Revert the mode of the other cells from other rows
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
          // Revert the mode of other cells in the same row
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
      <MainCard title="Print Sanction Order No">
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
                <StateList onSelectState={handleSelectState} />
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
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
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <AreaList selectedDistrictId={selectedDistrictId} selectedArea={selectedAreaId} onSelectArea={handleSelectArea} />
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
                  onSelectSubDistrict={handleSelectSubDistrict}
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
                  setSelectedGramPanchayat={setSelectedGP}
                  onSelectGramPanchayat={handleSelectGP}
                />
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <VillageList
                  selectedGramPanchayatId={selectedGP}
                  setSelectedVillage={setSelectedVillage}
                  onSelectVillage={handleSelectVillgae}
                />
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={12}>
              <Divider>
                {' '}
                <Chip label="OR SEARCH BY" />{' '}
              </Divider>
              <br />
            </Grid>
            <Grid>
              <SearchComponent options={options} onOptionValuesChange={handleSearchOptionValuesChange} />
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

      {getAllDisData.length > 0 ? (
        <MainCard title="Print Sanction Order No">
          <Box sx={{ height: 400, width: '100%' }}>
            <DataGrid
              disableRowSelectionOnClick
              getRowId={(row) => row.sanctionOrderNo}
              slots={{ toolbar: GridToolbar }}
              slotProps={{
                toolbar: {
                  showQuickFilter: true,
                  printOptions: { disableToolbarButton: true }
                }
              }}
              rows={rows}
              columns={columns}
              cellModesModel={cellModesModel}
              onCellModesModelChange={handleCellModesModelChange}
              onCellClick={handleCellClick}
              processRowUpdate={processRowUpdate}
              onProcessRowUpdateError={handleProcessRowUpdateError}
              initialState={{
                pagination: {
                  paginationModel: {
                    pageSize: 15
                  }
                }
              }}
              pageSizeOptions={[15]}
            />
          </Box>
        </MainCard>
      ) : (
        <div></div>
      )}
    </div>
  );
}
