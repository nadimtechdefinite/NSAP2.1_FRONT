import MainCard from 'ui-component/cards/MainCard';
import { DataGrid ,GridToolbar ,GridCellModes  } from '@mui/x-data-grid';
import React ,{useState,useEffect }  from 'react'
import { Grid, Button,FormControl,Typography,
  Chip,Snackbar, Alert,CircularProgress,Backdrop,Divider,FormHelperText} from '@mui/material';
import axiosInstance from 'hooks/useAuthTokenUrl';
import EditIcon from '@mui/icons-material/Edit';
import SearchComponent from 'components/common/SearchTypeCommon';
import StateList from 'components/form_components/StateList';
import DistrictList from 'components/form_components/DistrictList';
import SubDistrictList from 'components/form_components/SubDistrictList';
import GramPanchayatList from 'components/form_components/GramPanchayatList';
import VillageList from 'components/form_components/VillageList';
import AreaList from 'components/form_components/AreaList';
import './updateMobile.css';
import { updateMobileValidation } from './UpdateMobileValidation';
import messages_en from '../../../components/common/messages_en.json';
import { useNavigate } from "react-router-dom";

function UpdateMobileNumber() {
  const [getAllDistrictTemp, setAllDistrictTemp] = useState([])
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

  const handleDropdownChange = (id, field, selectedValue) => {
    setAllDistrict((prevRows) =>
        prevRows.map((row) =>
          row.sanctionOrderNo === id
            ? { ...row, [field]: selectedValue }
            : row
        )
      );
    };

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
    field: 'sanctionOrderNo',
    headerName: 'Sanction Order No',
    flex:1,
    editable: false,
  }, 
  {
    field: 'applicantName',
    headerName: 'Applicant Name',
    flex:1,
    editable: false,
  }, 
  {
    field: 'fatherHusbandName',
    headerName: 'Father/Husband Name',
    flex:1,
    editable: false,
  }, 
  {
    field: 'dob',
    headerName: 'Date of Birth',
    flex:1,
    editable: false,
  }, 
  {
    field: 'gender',
    headerName: 'Gender',
    flex:1,
    editable: false,
  }, 
  {
    field: 'contactPersonMobile',
    width:145,
    disableColumnMenu: true,
    sortable: false,
    headerName: (
    <div>
    <EditIcon fontSize="small" style={{ marginBottom: '-4px', color: 'blue' }} /> Mobile No.
    </div>
    ),
    renderCell: (params) => (
      <input style={{borderBottomStyle:'hidden',borderTopStyle:'hidden',borderLeftStyle:'hidden',borderRightStyle:'hidden',height:'39px',width:'130px'}}
        type="text"
        value={params.value}
        onChange={(e) => {mobileNumberCheck(params.id,e.target.value), handleInputMobileChange(params.id, e.target.value)}}   maxLength={10} onInput={handleInputChangeData}
      />
    ),
  },
  {  
    headerName:'',
    disableColumnMenu: true,
    sortable: false,
    width:8,
    valueGetter: (params) => params.row.checkVerify ? '✔' : (params.row.checkVerify === false ? '✖' : ''),
    cellClassName: (params) => params.row.checkVerify ? 'verified-cell' : (params.row.checkVerify === false ? 'failed-cell' : ''),
  },
  {
    field: 'mobRelation',
    disableColumnMenu: true,
    sortable: false,
    headerName: (
        <div>
        <EditIcon fontSize="small" style={{ marginBottom: '-4px', color: 'blue' }} /> Relation
        </div>
        ),
    flex:1,
    width: 54,
   renderCell: params => (
        <select
          value={params.value}
          onChange={e =>  handleDropdownChange(
              params.id,'mobRelation', e.target.value
            )}
          style={{ background: 'white', border: '1px solid #ced4da',borderRadius: '4px',padding: '6px 12px',
          width: '65%',boxSizing: 'border-box',fontSize: '14px' }}>
        <option value="self">Self</option>
		<option value="Family">Family</option>
		<option value="Relative/Other">Relative/Other</option>
        </select>
      ),
  },
];

const validateForm = () => {
  const errors = {};
  if(optionValues.sanctionOrderNo === null && (!selectedDistrictId)) 
    {
  errors.selectedDistrictId = messages_en.districtRequired;
  }
  if(optionValues.sanctionOrderNo === null && (!selectedSubDistrictId)) 
    {
  errors.selectedSubDistrictId = messages_en.subDistrictRequired;
  }
  if(optionValues.sanctionOrderNo === null && (!selectedAreaId)) 
    {
  errors.selectedAreaId = messages_en.areaRequired;
  }
  setFormErrors(errors);
  return Object.keys(errors).length === 0; 
};

const handleInputChangeData = (event) => {
  if(event.target.value != null && event.target.value != ""){
  event.target.value = event.target.value.replace(/[^0-9]/g, '');
  }
  };

const handleInputMobileChange  = (id, value) => {
console.log("-->>>> "+id,value,value.length)
setAllDistrict((prevRows) =>
  prevRows.map((row) =>
    row.sanctionOrderNo === id
      ? { ...row, ['contactPersonMobile']: value }
      : row
  )
); 
}

function mobileNumberCheck(id,val){
    var indNum = /^(?!.*(\d)\1{9})[6789]\d{9}$/;
    if(indNum.test(val)){
        setAllDistrict((prevRows) =>
        prevRows.map((row) =>
          row.sanctionOrderNo === id
            ? { ...row, ['checkVerify']: true }
            : row
        )
      );
        return;
    }
    else{
        setAllDistrict((prevRows) =>
        prevRows.map((row) =>
          row.sanctionOrderNo === id
            ? { ...row, ['checkVerify']: false }
            : row
        )
      );
       // alert('Please enter valid mobile number.'); 
    }	
}

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
    setFormErrors((prevErrors) => {
      const updatedErrors = { ...prevErrors };
      delete updatedErrors.selectedAreaId;
      return updatedErrors;
  });
  }

  const handleSelectSubDistrict = (selectedSubDistrictId) => {
    setSelectedSubDistrict(selectedSubDistrictId);
    setSelectedGramPanchyat(null);
    setSelectedVillage(null);
    setFormErrors((prevErrors) => {
      const updatedErrors = { ...prevErrors };
      delete updatedErrors.selectedSubDistrictId;
      return updatedErrors;
  });
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
      setAllDistrictTemp(districtData);
      // setAllDistrict(res);
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
        const getUrl=`/update-mobile-number/getUpdateMobileNumber`;
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
   
    const rows = getAllDistrict.map((item) => ({
      id: item.sanctionOrderNo,
      sanctionOrderNo: item.sanctionOrderNo,
      applicantName: item.applicantName,
      fatherHusbandName: item.fatherHusbandName,
      gender:item.gender,
      contactPersonMobile:item.contactPersonMobile,
      mobRelation:item.mobRelation,
      schemeCode:item.schemeCode,
      stateCode:item.stateCode,
      districtCode:item.districtCode,
      area:item.area,
      subDistrictMunicipalAreaCode:item.subDistrictMunicipalAreaCode,
      gramPanchayatWardCode:item.gramPanchayatWardCode,
      villageCode:item.villageCode,
      checkVerify:item.checkVerify,
      dob:item.dob,
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
      
       const validationErrors =  updateMobileValidation(selectedRows, getAllDistrictTemp,getAllDistrict);
          
       if (validationErrors.length > 0) {
         validationErrors.forEach((error) => {
           setSnackbar({ children: error, severity: 'error' });
         });
         return;
       }
      
      try {
        const body={updatedData1};
        const apiUrl = '/update-mobile-number/saveUpdateMobileNumber'; 
        setLoading(true);
        const response = await axiosInstance.post(apiUrl,JSON.stringify(body));
       
        console.log('API Response:', response.data);
        if (response.status >= 200 && response.status < 300) {
          setSnackbar({ children: 'Record successfully updated' , severity: 'success' });  
          await new Promise(resolve => setTimeout(resolve, 1250));  
          setAllDistrict([]);
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
  
      // Ignore portal
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

     <MainCard title="Update Mobile Number">

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
                {formErrors.selectedAreaId && (
                <FormHelperText>
                <Typography style={{ color: 'red', fontSize: '0.8rem' }}>{formErrors.selectedAreaId}</Typography>
                </FormHelperText>
                  )}              
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <SubDistrictList selectedAreaId={selectedAreaId} selectedDistrictId={selectedDistrictId} setSelectedSubDistrict={setSelectedSubDistrict} onSelectSubDistrict={handleSelectSubDistrict}  />
                {formErrors.selectedSubDistrictId && (
                <FormHelperText>
                <Typography style={{ color: 'red', fontSize: '0.8rem' }}>{formErrors.selectedSubDistrictId}</Typography>
                </FormHelperText>
                  )}
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
      <DataGrid checkboxSelection disableRowSelectionOnClick getRowId={(row) => row.sanctionOrderNo} 
        slots={{ toolbar: GridToolbar }}
      slotProps={{
          toolbar: {
            showQuickFilter: true,
            printOptions: { disableToolbarButton: true } ,
          },
        }}
        rows={rows}
        columns={columns}
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
              <Button type="submit" variant="contained" color="secondary" onClick={() => {setSubmitValue()}} title='Submit' style={{marginTop:'5px'}}>Submit</Button>
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
export default UpdateMobileNumber
