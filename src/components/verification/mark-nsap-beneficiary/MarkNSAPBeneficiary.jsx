import MainCard from 'ui-component/cards/MainCard';
import { DataGrid ,GridToolbar ,GridCellModes  } from '@mui/x-data-grid';
import React ,{useState,useEffect }  from 'react'
import { Grid, Button,FormControl,Typography,
  Snackbar, Alert,CircularProgress,Backdrop,MenuItem,Select,InputLabel,FormHelperText} from '@mui/material';
import axiosInstance from 'hooks/useAuthTokenUrl';
import StateList from 'components/form_components/StateList';
import DistrictList from 'components/form_components/DistrictList';
import SubDistrictList from 'components/form_components/SubDistrictList';
import GramPanchayatList from 'components/form_components/GramPanchayatList';
import AreaList from 'components/form_components/AreaList';
import { GRID_CHECKBOX_SELECTION_COL_DEF } from '@mui/x-data-grid';
import { useNavigate } from "react-router-dom";
import messages_en from '../../../components/common/messages_en.json';

function MarkNSAPBeneficiary() {
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
 const [formErrors, setFormErrors] = useState({});
 const navigate = useNavigate();

 function cancelValue(){
  navigate('/nsap/dashboard/default');
}
 
  function setSubmitValue(){ 
    setSubmitFinalValue('true')
  }

  useEffect(() => {
  }, [submitFinalValue]);

  var showVillageColumn = false; 
  if(selectedAreaId === 'R'){
    showVillageColumn=true;
  }
 
  const columns = [
    {
      field: 'serialNumber',
      headerName: 'Sr No',
      width: '56',
      editable: false,
      disableColumnMenu: true,
    },
   {
    field: 'sanctionOrderNo',
    headerName: 'Sanction Order No',
    flex:1,
    editable: false,
    disableColumnMenu: true,
  }, 
  {
    field: 'name',
    headerName: 'Applicant Name',
    flex:1,
    editable: false,
    disableColumnMenu: true,
  }, 
  {
    field: 'fatherHusbandName',
    headerName: 'Father/Husband Name',
    flex:1,
    editable: false,
    disableColumnMenu: true,
  }, 
  {
    field: 'age',
    headerName: 'Age',
    flex:1,
    editable: false,
    disableColumnMenu: true,
  }, 
  {
    field: 'gender',
    headerName: 'Gender',
    flex:1,
    editable: false,
    disableColumnMenu: true,
  }, 
  {
    field: 'categoryCode',
    headerName: 'Category',
    flex:1,
    editable: false,
    disableColumnMenu: true,
  },
  {
    field: 'gramPanchayaWardName',
    headerName: 'Gram Panchayat/Ward',
    flex:1,
    editable: false,
    disableColumnMenu: true,
  },
  {
    field: 'paymentMode',
    headerName: 'Payment Mode',
    flex:1,
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
if (showVillageColumn) {
  columns.splice(8, 0, {
    field: 'villageName',
    headerName: 'Village',
    flex: 1,  
    editable: false,
    disableColumnMenu: true,
  });
}

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

const validateForm = () => {
  const errors = {};
  if(!selectedDistrictId) 
    {
  errors.selectedDistrictId = messages_en.districtRequired;
  }
  if(!selectedAreaId) 
    {
  errors.selectedAreaId = messages_en.areaRequired;
  }
  if(!selectedSubDistrictId) 
    {
  errors.selectedSubDistrictId = messages_en.subDistrictRequired;
  }
  if(!selectedGramPanchyat) 
    {
  errors.selectedGramPanchyat = messages_en.gramPanchayatRequired;
  }
  setFormErrors(errors);
  return Object.keys(errors).length === 0; 
};


  const handleSelectState = (state) => {
    setSelectedState(state);
  };
  
  const handleSelectDistrict = (selectedDistrictId) => {
    setSelectedDistrict(selectedDistrictId);
    setSelectedArea(null);
    setSelectedSubDistrict(null);
    setSelectedGramPanchyat(null);
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
    setFormErrors((prevErrors) => {
      const updatedErrors = { ...prevErrors };
      delete updatedErrors.selectedAreaId;
      return updatedErrors;
  });
  }

  const handleSelectSubDistrict = (selectedSubDistrictId) => {
    setSelectedSubDistrict(selectedSubDistrictId);
    setSelectedGramPanchyat(null);
    setFormErrors((prevErrors) => {
      const updatedErrors = { ...prevErrors };
      delete updatedErrors.selectedSubDistrictId;
      return updatedErrors;
  });
  };

  const handleGramPanchyat = (selectedGramPanchyat) => {
    setSelectedGramPanchyat(selectedGramPanchyat);
    setFormErrors((prevErrors) => {
      const updatedErrors = { ...prevErrors };
      delete updatedErrors.selectedGramPanchyat;
      return updatedErrors;
  });
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
      //alert(selectedDistrictId + " - "+selectedAreaId +" - "+selectedSubDistrictId+" - "+selectedGramPanchyat);
      //  if (selectedDistrictId === null || selectedAreaId === null || selectedSubDistrictId === null || selectedGramPanchyat===null) {
      //    alert("District |Area |Sub District |GP are mandatory.");
      //    }
      //    else{
        const isFormValid = validateForm();
        if (isFormValid) {
      try {     
          var location={ stateID:selectedStateId, districtID:selectedDistrictId, area:selectedAreaId, subDistID:selectedSubDistrictId, gpID:selectedGramPanchyat};
          var body={...location};
        const getUrl=`/mark-nsap-beneficiary/getMarkNSAPBeneficiary`;
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
      name: item.name,
      fatherHusbandName: item.fatherHusbandName,
      age: item.age,
      gender: item.gender,
      categoryCode:item.categoryCode,
      schemeCode:item.schemeCode,
      stateCode:item.stateCode,
      districtCode:item.districtCode,
      area:item.area,
      subDistrictMunicipalAreaCode:item.subDistrictMunicipalAreaCode,
      gramPanchayatWardCode:item.gramPanchayatWardCode,
      gramPanchayaWardName:item.gramPanchayaWardName,
      villageName:item.villageName,
      paymentMode:item.paymentMode,
      villageCode:item.villageCode,
      contactPersonMobile:item.contactPersonMobile
    }));
    const processRowUpdate = React.useCallback(
      async (updatedRow) => {
        try {
          const updatedRowData = await mutateRow(updatedRow);
          setAllDistrict((prevRows) => {
            const rowIndex = prevRows.findIndex((row) => row.sanctionOrderNo === updatedRowData.sanctionOrderNo);
            const updatedRows = [...prevRows];
            updatedRows[rowIndex] = {
                   ...updatedRows[rowIndex], 
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
        const apiUrl = '/mark-nsap-beneficiary/saveMarkNSAPBeneficiary'; 
        setLoading(true);
        const response = await axiosInstance.post(apiUrl,JSON.stringify(body));
       // console.log('API Response:', response.data);
        if (response.status >= 200 && response.status < 300) {
          if(response.data[0].status==='You are exceeding the State Cap.'){
          setSnackbar({ children: response.data[0].status , severity: 'error' });
          }else{
          setSnackbar({ children: 'Record successfully updated' , severity: 'success' });  
          }
          //await new Promise(resolve => setTimeout(resolve, 1250));  
          //setAllDistrict([]);
          setTimeout(() => {
            navigate('/verification/markNSAPBeneficiary');
          }, 1000); 
        handleClickOpen(e);
        }
     else{
      setSnackbar({ children: 'Error in updating data' , severity: 'success' });  
          await new Promise(resolve => setTimeout(resolve, 1250));  
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

     
     <MainCard title="Migrate Scheme Category">

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
            <Grid item xs={12} sm={3}>
              <FormControl fullWidth>
                <StateList onSelectState={handleSelectState} />
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={3}>
              <FormControl fullWidth>
                <DistrictList selectedStateId={selectedStateId} setSelectedDistrict={setSelectedDistrict} onSelectDistrict={handleSelectDistrict} />
                {formErrors.selectedDistrictId && (
                <FormHelperText>
                <Typography style={{ color: 'red', fontSize: '0.8rem' }}>{formErrors.selectedDistrictId}</Typography>
                </FormHelperText>
                )} 
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={3}>
            <FormControl fullWidth>
                <AreaList selectedDistrictId={selectedDistrictId} selectedArea={selectedAreaId} onSelectArea={handleSelectArea} />   
                {formErrors.selectedAreaId && (
                <FormHelperText>
                <Typography style={{ color: 'red', fontSize: '0.8rem' }}>{formErrors.selectedAreaId}</Typography>
                  </FormHelperText>
                  )}            
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={3}>
              <FormControl fullWidth>
                <SubDistrictList selectedAreaId={selectedAreaId} selectedDistrictId={selectedDistrictId} setSelectedSubDistrict={setSelectedSubDistrict} onSelectSubDistrict={handleSelectSubDistrict}  />
                {formErrors.selectedSubDistrictId && (
                <FormHelperText>
                <Typography style={{ color: 'red', fontSize: '0.8rem' }}>{formErrors.selectedSubDistrictId}</Typography>
                  </FormHelperText>
               )}  
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={3}>
              <FormControl fullWidth>
                <GramPanchayatList selectedSubDistrictMunicipalAreaId={selectedSubDistrictId} setSelectedGramPanchayat={setSelectedGramPanchyat} onSelectGramPanchayat={handleGramPanchyat} />
                {formErrors.selectedGramPanchyat && (
                <FormHelperText>
                <Typography style={{ color: 'red', fontSize: '0.8rem' }}>{formErrors.selectedGramPanchyat}</Typography>
                  </FormHelperText>
               )}  
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={3}>
              <FormControl fullWidth>
              <InputLabel id="Category-label">Category</InputLabel>
              <Select  labelId="Category-label" label="Category-label" value="State">
              <MenuItem value="State">State</MenuItem>
              </Select>
              </FormControl>
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
         <span style={{marginLeft:'600px',color:'darkblue', backgroundColor:'aliceblue'}}><b>Move to NSAP Category</b></span>
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
              <Button type="submit" variant="contained" color="secondary" onClick={() => {setSubmitValue()}} style={{marginTop:'5px'}} title='Submit'>Update</Button>
              &nbsp;<Button variant="contained" color="primary" onClick={() => {cancelValue()}} title='Cancel' style={{marginTop:'5px'}}>Cancel</Button>
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
export default MarkNSAPBeneficiary