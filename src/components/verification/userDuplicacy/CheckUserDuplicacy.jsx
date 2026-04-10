import MainCard from 'ui-component/cards/MainCard';
import { DataGrid ,GridToolbar ,GridCellModes  } from '@mui/x-data-grid';
import React ,{useState,useEffect }  from 'react'
import { Grid, Button,FormControl,
  Chip,Snackbar, Alert,CircularProgress,Backdrop,Divider,InputLabel,Select,MenuItem,FormHelperText, Typography} from '@mui/material';
import axiosInstance from 'hooks/useAuthTokenUrl';
import SearchComponent from 'components/common/SearchTypeCommon';
import StateList from 'components/form_components/StateList';
import DistrictList from 'components/form_components/DistrictList';
import SubDistrictList from 'components/form_components/SubDistrictList';
import AreaList from 'components/form_components/AreaList';
import Checkbox from '@mui/material/Checkbox';
import { useNavigate } from "react-router-dom";
import messages_en from '../../../components/common/messages_en.json';
import  '../../../components/verification/mark-nsap-beneficiary/approveMarkBeneficiary.css';

function CheckUserDuplicacy() {
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
 const [schemeeData, setSchemeeData] = useState([]);
 const [formErrors, setFormErrors] = useState({});
 const [selectScheme, setSelectScheme] = useState('');
 const navigate = useNavigate();
 const [checkboxData, setCheckboxData] = useState({
  applicantNameChk: false,
  husbandFatherNameChk: false,
  bankPOAccountNoChk: false,
  uidNumberChk: false,
  pfmsBankPOAccountNoChk: false,
  pfmsUIDChk: false,
});

  function cancelValue(){
     navigate('/nsap/dashboard/default');
   }

   const handleCheckboxChange = (event) => {
    const { name, checked, value } = event.target;
    setCheckboxData(prevState => ({
      ...prevState,
      [name]: checked ? value : ""
  }));
  };

 const getSchemeData = async () => {
  try {
    const getYearData = '/user-duplicacy-check/getSchemeData';
    setLoading(true);
    const response = await axiosInstance.get(getYearData); 
    setSchemeeData(response.data);
  } catch (error) {
    console.error('Error fetching in scheme data :', error);
  }
  finally{
    setLoading(false);
  }
};

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
        "sanctionOrderNo": "Applicant Name",
        "husbandFatherName": "Husband/Father Name",
        "bankPoAccount": "Bank/PO Account",
        "aadhaarNo": "Aadhaar",
      };
      const [optionValues, setOptionValues] = useState(null);
      const handleSearchOptionValuesChange = (newOptionValues) => {
            setOptionValues(newOptionValues);
          };

  useEffect(() => {
    getSchemeData();
  }, []);

  const columns = [
    {
      field: 'id',
      headerName: 'SrNo.',
      width: '60',
      editable: false,
      disableColumnMenu: true,
      headerClassName:'bkColr',
    }, 
   {
    field: 'districtName',
    headerName: 'District',
    flex:1,
    editable: false,
    disableColumnMenu: true,
    headerClassName:'bkColr',
  }, 
  {
    field: 'subDistrictMunicipalAreaName',
    headerName: 'Subdistrict/Municipality',
    flex:1,
    editable: false,
    disableColumnMenu: true,
    headerClassName:'bkColr',
  }, 
  {
    field: 'gramPanchayatWardName',
    headerName: 'Grampanchayat/Ward',
    flex:1,
    editable: false,
    disableColumnMenu: true,
    headerClassName:'bkColr',
  },
  {
    field: 'applicantName',
    headerName: 'Applicant Name',
    flex:1,
    editable: false,
    disableColumnMenu: true,
    headerClassName:'bkColr',
  },
  {
    field: 'fatherHusbandName',
    headerName: 'Father/Husband Name',
    flex:1,
    editable: false,
    disableColumnMenu: true,
    headerClassName:'bkColr',
  },
  {
    field: 'applicationNo',
    headerName: 'Applicant No.',
    flex:1,
    editable: false,
    disableColumnMenu: true,
    headerClassName:'bkColr',
  },
  {
    field: 'bankPoAccountNo',
    headerName: 'Bank/Po Account No',
    flex:1,
    editable: false,
    disableColumnMenu: true,
    headerClassName:'bkColr',
  },
  {
    field: 'pfmsBankPoAccountNo',
    headerName: 'PFMS A/C No',
    flex:1,
    editable: false,
    disableColumnMenu: true,
    headerClassName:'bkColr',
  },
  {
    field: 'schemeCode',
    headerName: 'Scheme',
    width: '110',
    editable: false,
    disableColumnMenu: true,
    headerClassName:'bkColr',
  },
  {
    field: 'dbt',
    headerName: 'DBT',
    width:'5',
    editable: false,
    disableColumnMenu: true,
    headerClassName:'bkColr',
  },
  {
    field: 'status',
    headerName: 'Status',
    flex:1,
    editable: false,
    disableColumnMenu: true,
    headerClassName:'bkColr',
  },
];

const validateForm = () => {
  const errors = {};
  if(optionValues.sanctionOrderNo !== null || optionValues.husbandFatherName !== null ||
    optionValues.bankPoAccount !== null || optionValues.aadhaarNo !== null){
      //radio button based searching
  }
  else {
    if(!selectScheme) {
      errors.selectScheme = messages_en.schemeRequired;
  }
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
  };
 
  const handleSelectArea = (selectedAreaId) => {
    setSelectedArea(selectedAreaId);
    setSelectedSubDistrict(null);
  }

  const handleSelectSubDistrict = (selectedSubDistrictId) => {
    setSelectedSubDistrict(selectedSubDistrictId);
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
        if(checkboxData.applicantNameChk===false & checkboxData.husbandFatherNameChk===false & checkboxData.bankPOAccountNoChk===false & 
          checkboxData.uidNumberChk===false & checkboxData.pfmsBankPOAccountNoChk===false & checkboxData.pfmsUIDChk===false){
            if(optionValues.sanctionOrderNo !== null || optionValues.husbandFatherName !== null ||
              optionValues.bankPoAccount !== null || optionValues.aadhaarNo !== null){
              //radio button based searching...
             try{
              var locationOne={ stateID:selectedStateId, districtID:selectedDistrictId, area:selectedAreaId, subDistID:selectedSubDistrictId,schemeCode:selectScheme, 
                applicantNameChkValue:checkboxData.applicantNameChk, husbandFatherNameChkValue:checkboxData.husbandFatherNameChk, 
                bankPOAccountNoChkValue:checkboxData.bankPOAccountNoChk,uidNumberChkValue:checkboxData.uidNumberChk,
                pfmsBankPOAccountNoChkValue:checkboxData.pfmsBankPOAccountNoChk, pfmsUIDChkValue:checkboxData.pfmsUIDChk};
                      var bodyOne={...optionValues,...locationOne,};
                    const getUrl=`/user-duplicacy-check/getUserDuplicacyCheckData`;
                    setLoading(true);
                    const response = await axiosInstance.post(getUrl,JSON.stringify(bodyOne));
                    if (response.status >= 200 && response.status < 300) {
                      return response.data
                    } else {
                    
                      return false;
                    }
              }
              catch (error) {
                if(error.response.data.sanctionOrderNo){
                  setSnackbar({ children: error.response.data.sanctionOrderNo, severity: 'error' });
                }
                else if(error.response.data.husbandFatherName){
                  setSnackbar({ children: error.response.data.husbandFatherName, severity: 'error' });
                }
                else if(error.response.data.bankPoAccount){
                  setSnackbar({ children: error.response.data.bankPoAccount, severity: 'error' }); 
                }
                else if(error.response.data.aadhaarNo){
                  setSnackbar({ children: error.response.data.aadhaarNo, severity: 'error' });
                }
                else{
                  setSnackbar({ children: "No Data Found", severity: 'error' });
                }
 
                  console.error('Error fetching data:', error);
              }
            }
              else{
            setSnackbar({ children: "Please select either of one checkbox.", severity: 'error' });
              }
        } else{  
          var location={ stateID:selectedStateId, districtID:selectedDistrictId, area:selectedAreaId, subDistID:selectedSubDistrictId,schemeCode:selectScheme, 
    applicantNameChkValue:checkboxData.applicantNameChk, husbandFatherNameChkValue:checkboxData.husbandFatherNameChk, 
    bankPOAccountNoChkValue:checkboxData.bankPOAccountNoChk,uidNumberChkValue:checkboxData.uidNumberChk,
    pfmsBankPOAccountNoChkValue:checkboxData.pfmsBankPOAccountNoChk, pfmsUIDChkValue:checkboxData.pfmsUIDChk};
          var body={...optionValues,...location,};
        const getUrl=`/user-duplicacy-check/getUserDuplicacyCheckData`;
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
      id: item.counter,
      sanctionOrderNo:item.counter,
      districtName: item.districtName,
      subDistrictMunicipalAreaName: item.subDistrictMunicipalAreaName,
      gramPanchayatWardName: item.gramPanchayatWardName,
      applicantName: item.applicantName,
      fatherHusbandName: item.fatherHusbandName,
      applicationNo: item.applicationNo,
      bankPoAccountNo: item.bankPoAccountNo,
      pfmsBankPoAccountNo: item.pfmsBankPoAccountNo,
      schemeCode: item.schemeCode,
      dbt: item.dbt,
      status: item.status,
      seacrhBasedLabel:item.seacrhBasedLabel,
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

     
     <MainCard title="Check Dupilcate Pensioners">

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
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={3}>
            <FormControl fullWidth>
                <AreaList selectedDistrictId={selectedDistrictId} selectedArea={selectedAreaId} onSelectArea={handleSelectArea} />               
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={3}>
              <FormControl fullWidth>
                <SubDistrictList selectedAreaId={selectedAreaId} selectedDistrictId={selectedDistrictId} setSelectedSubDistrict={setSelectedSubDistrict} onSelectSubDistrict={handleSelectSubDistrict}  />
              </FormControl>
            </Grid>
           
            <Grid item xs={12} sm={3}>
              <FormControl fullWidth> 
      <InputLabel id="scheme-name">Select Scheme <span style={{ color: 'red' }}>*</span></InputLabel>
      <Select
        labelId="scheme-name"
        id="schemeCode"
        label="scheme Name"
        name="schemeCode"
        onChange={(event) => {setSelectScheme(event.target.value);
          setFormErrors((prevErrors) => {
            const updatedErrors = { ...prevErrors };
            delete updatedErrors.selectScheme;
            return updatedErrors;
        });
        }} >
          <MenuItem value="ALLSCH">All Scheme</MenuItem>
          <MenuItem value="ALLCENTERSCH">All Center Scheme</MenuItem>
          <MenuItem value="ALLSTATESCH">All State Scheme</MenuItem>
         {schemeeData.map((item) => (
        <MenuItem key={item} value={item.schemeCode}>{item.schemeName}</MenuItem>
        ))}
      </Select>
      {formErrors.selectScheme && (
                  <FormHelperText>
                    <Typography style={{ color: 'red', fontSize: '0.8rem' }}>{formErrors.selectScheme}</Typography>
                  </FormHelperText>
                )}
    </FormControl>
    </Grid>

    <Grid item xs={12} sm={12} >
    <Checkbox name="applicantNameChk" checked={checkboxData.applicantNameChk} onChange={handleCheckboxChange} value="applicantNameChk" />Applicant Name 
    <Checkbox name="husbandFatherNameChk" checked={checkboxData.husbandFatherNameChk} onChange={handleCheckboxChange} value="husbandFatherNameChk"/>Husband/Father Name 
    <Checkbox name="bankPOAccountNoChk" checked={checkboxData.bankPOAccountNoChk} onChange={handleCheckboxChange} value="bankPOAccountNoChk"/>Bank/PO Account No 
    <Checkbox name="uidNumberChk" checked={checkboxData.uidNumberChk} onChange={handleCheckboxChange} value="uidNumberChk"/>UID Number 
    <Checkbox name="pfmsBankPOAccountNoChk" checked={checkboxData.pfmsBankPOAccountNoChk} onChange={handleCheckboxChange} value="pfmsBankPOAccountNoChk"/>PFMS bank/PO Account No 
    <Checkbox name="pfmsUIDChk" checked={checkboxData.pfmsUIDChk} onChange={handleCheckboxChange} value="pfmsUIDChk"/>PFMS UID 
    </Grid>

            <Grid item xs={12} sm={12} >
          <Divider> <Chip label="OR SEARCH BY" /> </Divider>
          <br/>
          </Grid>
         <Grid>
        
              <SearchComponent options={options} onOptionValuesChange={handleSearchOptionValuesChange}  />     
      </Grid>  

      <Grid item xs={12} alignItems="center">
              <Button type="submit" variant="contained" color="secondary" title="Submit">Submit</Button>&nbsp;
              <Button variant="contained" color="primary" onClick={() => {cancelValue()}} title='Cancel'>Cancel</Button> 
            </Grid>
             
      </Grid>
        </form>

      </MainCard>

      {getAllDistrict.length>0  ? (
        <>
        <form  onSubmit={handleFormSubmit}>
        
         <MainCard >

         <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap'   }}>
         <kbd className="responsive-kbd">Search Duplicates Records based on : {rows[0].seacrhBasedLabel}</kbd> 
        </div>

      <DataGrid  disableRowSelectionOnClick getRowId={(row) => row.sanctionOrderNo} 
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
export default CheckUserDuplicacy
