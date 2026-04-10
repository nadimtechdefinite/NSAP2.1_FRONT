import MainCard from 'ui-component/cards/MainCard';
import { DataGrid ,GridToolbar ,GridCellModes  } from '@mui/x-data-grid';
import React ,{useState,useEffect }  from 'react'
import { Grid, Button,FormControl,
  Chip,Snackbar, Alert,CircularProgress,Backdrop,Divider,FormHelperText, Typography} from '@mui/material';
import axiosInstance from 'hooks/useAuthTokenUrl';
import SearchComponent from 'components/common/SearchTypeCommon';
import StateList from 'components/form_components/StateList';
import DistrictList from 'components/form_components/DistrictList';
import SubDistrictList from 'components/form_components/SubDistrictList';
import GramPanchayatList from 'components/form_components/GramPanchayatList';
import VillageList from 'components/form_components/VillageList';
import AreaList from 'components/form_components/AreaList';
import { GRID_CHECKBOX_SELECTION_COL_DEF } from '@mui/x-data-grid';
import './reRegistration.css'
import { useNavigate } from 'react-router-dom';
import { getUserInfo } from 'utils/storageUtils';
import  '../../../components/verification/mark-nsap-beneficiary/approveMarkBeneficiary.css';
import messages_en from '../../../components/common/messages_en.json';

function EnableReRegistration() {
  const [getAllDistrict, setAllDistrict] = useState([])
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectedStateId, setSelectedState] = useState('');
  const [snackbar, setSnackbar] = React.useState(null);
  const handleCloseSnackbar = () => setSnackbar(null);
  const [loading, setLoading] = useState(false);
  const [selectedDistrictId, setSelectedDistrict] = useState(null);
  const [selectedAreaId, setSelectedArea] = useState(null);
  const [selectedSubDistrictId, setSelectedSubDistrict] = useState(null);
  const [selectedGramPanchyat, setSelectedGramPanchyat] = useState(null);
 const [submitFinalValue, setSubmitFinalValue]=React.useState(false);
 const userinfoHeader = getUserInfo();
 const navigate = useNavigate();
 const [formErrors, setFormErrors] = useState({});

 function cancelValue(){
  navigate('/nsap/dashboard/default');
}

  function setSubmitValue(){
    setSubmitFinalValue('true')
  }

  const handleChangeVer = (value,rowId) => {
      setAllDistrict((prevRows) =>
          prevRows.map((row) =>
            row.sanctionOrderNo === rowId
              ? { ...row, ['aadharVerify']: value }
              : row
          )
        );
      };
      
  const options = {
        "applicantName" : "Applicant Name",
        "sanctionOrderNo": "Sanction Order No",
      };
      const [optionValues, setOptionValues] = useState(null);
      const handleSearchOptionValuesChange = (newOptionValues) => {
            setOptionValues(newOptionValues);
          };

  useEffect(() => {
  }, [submitFinalValue]);

  const columns = [
    {
      field: 'serialNumber',
      headerName: 'Sr No',
      width: '100',
      editable: false,
      disableColumnMenu: true,
    },
   {
    field: 'sanctionOrderNo',
    headerName: 'Sanction Order No',
    //flex:1,
    width:'406',
    editable: false,
    disableColumnMenu: true,
  }, 
  {
    field: 'applicantName',
    headerName: 'Applicant Name',
    //flex:1,
    width:'406',
    editable: false,
    disableColumnMenu: true,
  }, 
  {
    field: 'fatherHusbandName',
    headerName: 'Father/Husband Name',
    //flex:1,
    width:'406',
    editable: false,
    disableColumnMenu: true,
  }, 
  {
    field: '',
    headerName: 'Check All',
    width:'79',
    disableColumnMenu: true,
    sortable: false,
  }, 
];

const validateForm = () => {
  const errors = {};
 
  if((( optionValues.sanctionOrderNo ===null && optionValues.applicantName ==null) &&  !selectedDistrictId)) 
    {
  errors.selectedDistrictId = messages_en.districtRequired;
  }
  setFormErrors(errors);
  return Object.keys(errors).length === 0; 
};

const columnsWithCheckbox = React.useMemo(
  () => [
    ...columns, 
    {
      ...GRID_CHECKBOX_SELECTION_COL_DEF,
      //width: 0,
    },
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
    setSelectedGramPanchyat(null);
    setSelectedVillage(null);
    setFormErrors((prevErrors) => {
      const updatedErrors = { ...prevErrors };
      delete updatedErrors.selectedDistrictId;
      return updatedErrors;
  });
  };
 
  const handleSelectArea = (selectedAreaId) => {
    setSelectedArea(selectedAreaId);
    setSelectedSubDistrict(null);
    setSelectedGramPanchyat(null);
    setSelectedVillage(null);
  }

  const handleSelectSubDistrict = (selectedSubDistrictId) => {
    setSelectedSubDistrict(selectedSubDistrictId);
    setSelectedGramPanchyat(null);
    setSelectedVillage(null);
  };

  const handleGramPanchyat = (selectedGramPanchyat) => {
    setSelectedGramPanchyat(selectedGramPanchyat);
    setSelectedVillage(null);
  };

  const [selectedVillage, setSelectedVillage] = useState(null);
  const handleSelectVillgae = (selectedVillage) => {
    setSelectedVillage(selectedVillage);
  };
 
  const handleClickOpen = (e) => {
    e.preventDefault();
    fetchData()
    .then((res) =>  {if (res) {
      // Data is not null
      const districtData = res || [];
      setAllDistrict(districtData);
      console.log(res);
  } else {
      // Data is null
      setAllDistrict([]);
       
      //setSnackbar({ children: 'No Data Found', severity: 'error' });
      return false;
  }})
    .catch((e) => {
      console.log(e.message)
    })
  };
  
  const useFakeMutation = () => {
    return React.useCallback(
      (updatedRow ) =>
        new Promise((resolve, reject) => {
          setTimeout(() => {
            if (updatedRow.sanctionOrderNo?.trim() === '') {
              reject(new Error("Error: District Name can't be empty."));
            } else {
              resolve({ ...updatedRow , sanctionOrderNo: updatedRow .sanctionOrderNo?.toUpperCase() });
            }
           
          }, 200);
        }),
      [],
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
          var location={ stateID:selectedStateId, districtID:selectedDistrictId, area:selectedAreaId, subDistID:selectedSubDistrictId, gpID:selectedGramPanchyat, villageID:selectedVillage};
          var body={...optionValues,...location};
        const getUrl=`/enable-re-registration/getEnableReRegistration`;
        setLoading(true);
        const response = await axiosInstance.post(getUrl,JSON.stringify(body));
        if (response.status >= 200 && response.status < 300) {
          if(response.data.length>0){
            return response.data
            }else{
            setSnackbar({ children: "No Data Found!", severity: 'error' });
            }
        } else {
        
          return false;
        }
    } catch (error) {
      if(error.response.data.sanctionOrderNo){
        setSnackbar({ children: error.response.data.sanctionOrderNo, severity: 'error' });
      }
      // else{
      //   setSnackbar({ children: "No Data Found", severity: 'error' });
      // }

      else if(error.response.data.applicantName){
        setSnackbar({ children: error.response.data.applicantName, severity: 'error' });
      }
      else{
        setSnackbar({ children: "No Data Found", severity: 'error' });
      }
     
        console.error('Error fetching data:', error);
    }
    finally {
      setLoading(false);
    }
  }
   
     }
     
    const handleSelectionChange = (newSelection) => {
     setSelectedRows(newSelection);
    };
   
    const rows = getAllDistrict.map((item,index) => ({
      id: item.sanctionOrderNo,
      serialNumber: index + 1,
      sanctionOrderNo: item.sanctionOrderNo,
      applicantName: item.applicantName,
      fatherHusbandName: item.fatherHusbandName,
      schemeCode:item.schemeCode,
      stateCode:item.stateCode,
      districtCode:item.districtCode,
      area:item.area,
      subDistrictMunicipalAreaCode:item.subDistrictMunicipalAreaCode,
      gramPanchayatWardCode:item.gramPanchayatWardCode,
      villageCode:item.villageCode,
    }));
    const processRowUpdate = React.useCallback(
      async (updatedRow) => {
        try {
          const updatedRowData = await mutateRow(updatedRow);
          setAllDistrict((prevRows) => {
            const rowIndex = prevRows.findIndex((row) => row.sanctionOrderNo === updatedRowData.sanctionOrderNo);
            const updatedRows = [...prevRows];
            handleChangeVer(true,updatedRowData.sanctionData);
            updatedRows[rowIndex] = {
                   ...updatedRows[rowIndex], 
                   bankPoAccountNo:updatedRowData.bankPoAccountNo,
                   ifscCode:updatedRowData.ifscCode
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
      [mutateRow, getAllDistrict, setSnackbar,selectedRows]
    );
  
    const handleFormSubmit = async (e) => {
      e.preventDefault();

      if (selectedRows.length === 0) {
        setSnackbar({ children: 'Please select at least one row.', severity: 'error' });
        return;
      }
      const selectedData = getAllDistrict.filter(
        (row) => selectedRows.indexOf(row.sanctionOrderNo) !== -1
      );

      const updatedData1=await processRowUpdate(selectedData);
      console.log('updated Row status : ', JSON.stringify(selectedData));  
      
      try {
        const body={updatedData1};
        const apiUrl = '/enable-re-registration/saveEnableReRegistration'; 
        setLoading(true);
        const response = await axiosInstance.post(apiUrl,JSON.stringify(body));
       
        console.log('API Response:', response.data);
        if (response.status >= 200 && response.status < 300) {
          setSnackbar({ children: 'Record successfully updated' , severity: 'success' });  
          await new Promise(resolve => setTimeout(resolve, 2550));  
          //setAllDistrict([]);
          setTimeout(() => {
            navigate('/verification/enableReRegistration');
          }, 1000); 
        handleClickOpen(e);
        }
     else{
      setSnackbar({ children: 'Error in updating data' , severity: 'success' });  
          await new Promise(resolve => setTimeout(resolve, 2550));  
     }
        
      } catch (error) {
        console.error('Error sending data:', error);
        setSnackbar({ children: error.message, severity: 'error' });
       
      }
      finally{
        setLoading(false);
      }
     
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
                  [field]: { mode: GridCellModes.View },
                }),
                {},
              ),
            }),
            {},
          ),
          [params.id]: {
            ...Object.keys(prevModel[params.id] || {}).reduce(
              (acc, field) => ({ ...acc, [field]: { mode: GridCellModes.View } }),
              {},
            ),
            [params.field]: { mode: GridCellModes.Edit },
          },
        };
      });
    }, []);
    const handleCellModesModelChange = React.useCallback((newModel) => {
      setCellModesModel(newModel);
    }, []);
  return (
    <div>      

     <MainCard title="Pensioner's Re-Registration">

     {!!snackbar && (
        <Snackbar
          open
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          onClose={handleCloseSnackbar}
          autoHideDuration={6000}
        >
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
                <DistrictList selectedStateId={selectedStateId} setSelectedDistrict={setSelectedDistrict} onSelectDistrict={handleSelectDistrict} />
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
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <SubDistrictList selectedAreaId={selectedAreaId} selectedDistrictId={selectedDistrictId} setSelectedSubDistrict={setSelectedSubDistrict} onSelectSubDistrict={handleSelectSubDistrict}  />
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <GramPanchayatList selectedSubDistrictMunicipalAreaId={selectedSubDistrictId} setSelectedGramPanchayat={setSelectedGramPanchyat} onSelectGramPanchayat={handleGramPanchyat} />
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <VillageList selectedGramPanchayatId={selectedGramPanchyat}  setSelectedVillage={setSelectedVillage} onSelectVillage={handleSelectVillgae}  />
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={12} >
          <Divider> <Chip label="OR SEARCH BY" /> </Divider>
          <br/>
          </Grid>
         <Grid>
        
              <SearchComponent options={options} onOptionValuesChange={handleSearchOptionValuesChange}  />     
      </Grid>  

      <Grid item xs={12} alignItems="center">
              <Button type="submit" variant="contained" color="secondary" title='Submit'>Submit</Button>
              &nbsp;<Button variant="contained" color="primary" onClick={() => {cancelValue()}} title='Cancel'>Cancel</Button>
            </Grid>
             
      </Grid>
        </form>

      </MainCard>

      {getAllDistrict.length>0  ? (
        <>
        <form  onSubmit={handleFormSubmit}>
         <MainCard >
         <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap'   }}>
         <kbd className="responsive-kbd">Records for scheme : {userinfoHeader.selectedSchemeCode}</kbd>
         </div>

      <DataGrid checkboxSelection disableRowSelectionOnClick getRowId={(row) => row.sanctionOrderNo} 
        slots={{ toolbar: GridToolbar}}
      slotProps={{
          toolbar: {
            showQuickFilter: true,
            printOptions: { disableToolbarButton: true } ,
          },
        }}
         columns={columnsWithCheckbox}
        rows={rows}
        //columns={columns}
        cellModesModel={cellModesModel}
        onCellModesModelChange={handleCellModesModelChange}
        onCellClick={handleCellClick}
          processRowUpdate={processRowUpdate}
        onProcessRowUpdateError={handleProcessRowUpdateError}
          onRowSelectionModelChange={handleSelectionChange}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 15,
            },
          },
        }}
        pageSizeOptions={[15]}
      />  
    <Grid item xs={12} alignItems="center">
              <Button type="submit" variant="contained" color="secondary" onClick={() => {setSubmitValue()}} style={{marginTop:'5px'}} title='Submit'>Submit</Button>
            </Grid>
    
    </MainCard>
    </form>
    </>
    ):(
      <div>
      </div>
    )}
    </div>
  );
}
export default EnableReRegistration
