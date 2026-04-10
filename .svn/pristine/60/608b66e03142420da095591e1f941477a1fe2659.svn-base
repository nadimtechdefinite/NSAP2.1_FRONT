import MainCard from 'ui-component/cards/MainCard';
import { DataGrid ,GridToolbar ,GridCellModes  } from '@mui/x-data-grid';
import React ,{useState,useEffect }  from 'react'
import { Grid, Button,FormControl,
  Snackbar, Alert,CircularProgress,Backdrop,Divider,InputLabel,Select,MenuItem,FormHelperText, Typography} from '@mui/material';
import axiosInstance from 'hooks/useAuthTokenUrl';
import StateList from 'components/form_components/StateList';
import DistrictList from 'components/form_components/DistrictList';
import SubDistrictList from 'components/form_components/SubDistrictList';
import AreaList from 'components/form_components/AreaList';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import { useNavigate } from "react-router-dom";
import messages_en from '../../../components/common/messages_en.json';
import DownloadIcon from '@mui/icons-material/Download';
import Alert1 from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import  '../../../components/verification/mark-nsap-beneficiary/approveMarkBeneficiary.css';

function CPSMSRegisteredPensioner() {
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
 //const [submitFinalValue, setSubmitFinalValue]=React.useState(false);
 const [searchOption, setSearchOption] = React.useState(null);
 const [xmlRecord, setXmlRecord] = useState([]);
 const [formErrors, setFormErrors] = useState({});
 const [selectFile, setSelectFile] = React.useState(null);
 const [optionFlag, setOptionFlag] = React.useState(null);

 const navigate = useNavigate();

 function cancelValue(){
  navigate('/nsap/dashboard/default');
  }

 const handleOptionStatusChange = (event) => {
    //alert("--- "+event.target.value);
    setSearchOption(event.target.value);
    if(event.target.value==='newBeneficiaries'){
      setXmlRecord([]);
    }
    if(event.target.value==='pending'){
    getFileNameData();
    }
  };

   function submitFun(val){
    // console.log("1:--- "+val);
     setOptionFlag(val);
   }
  function submitFun1(val){
    //console.log("2:--- "+val);
    setOptionFlag(val);
  }

  const handleInput = evt => {
    //const name = evt.target.name;
    //const newValue = evt.target.value;
    setSelectFile(evt.target.value);
  };


  async function downloadBasedOnSearch(){
    try{
      const body = { stateID:selectedStateId, districtID:selectedDistrictId, area:selectedAreaId, subDistID:selectedSubDistrictId, searchOption:searchOption , fileName:selectFile,mode:optionFlag };
      setLoading(true);
      var urlData="/cpsms-registered-pensioner/getDownloadDetailInExcel";
      const response = await axiosInstance.post(urlData, body, {
          responseType: 'blob', 
      });

      if (response.status == 204) {
          setSnackbar({ children: 'No Data Available', severity: 'error' });
          return false;
      }

      const blob = new Blob([response.data], { type: 'application/octet-stream' });
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      var title='GET CPSMS Registered And Unregistered Details';
      const currentDate = new Date().toISOString().slice(8, 10) + '-' + new Date().toISOString().slice(5, 7) + '-' + new Date().toISOString().slice(0, 4);
      link.download = `${title}_${currentDate}.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(link.href);


    }catch(error){
      console.error('Error fetching data:', error.message);
    }
    finally{
      setLoading(false);
    }
   }


  const getFileNameData = async () => {
      if(selectedDistrictId === null){
          // do nothing...
      }else{
        try{
      const getFileNameData = '/cpsms-registered-pensioner/getFileNameData/'+selectedStateId+"/"+selectedDistrictId+"/"+selectedSubDistrictId;
      setLoading(true);
      const response = await axiosInstance.get(getFileNameData);  
      setXmlRecord(response.data);
    } catch (error) {
      console.error('Error xml data :', error);
    }
    finally{
      setLoading(false);
    }
  }
  };

  const handleChangeVer = (value,rowId) => {
      setAllDistrict((prevRows) =>
          prevRows.map((row) =>
            row.sanctionOrderNo === rowId
              ?value
              : row
          )
        );
      };

  useEffect(() => {
  }, []);

  const columns = [
    {
        field: 'counter',
        headerName: 'Sr No.',
        width:'60',
        editable: false,
        disableColumnMenu: true,
        headerClassName:'bkColr',
      }, 
    {
    field: 'sanctionOrderNo',
    headerName: 'Sanction Order No',
    width:'150',
    editable: false,
    disableColumnMenu: true,
    headerClassName:'bkColr',
  }, 
  {
    field: 'subDistrictName',
    headerName: 'Sub District Name',
    width:'150',
    editable: false,
    disableColumnMenu: true,
    headerClassName:'bkColr',
  }, 
  {
    field: 'gpName',
    headerName: 'GP Name',
    width:'150',
    editable: false,
    disableColumnMenu: true,
    headerClassName:'bkColr',
  }, 
  {
    field: 'applicantName',
    headerName: 'Applicant Name',
    width:'150',
    editable: false,
    disableColumnMenu: true,
    headerClassName:'bkColr',
  }, 


  {
    field: 'fatherHusbandName',
    headerName: 'Father Husband Name',
    width:'150',
    editable: false,
    disableColumnMenu: true,
    headerClassName:'bkColr',
  }, 
  {
    field: 'pfmsPaymentFlag',
    headerName: 'Payment Mode',
    width:'150',
    editable: false,
    disableColumnMenu: true,
    headerClassName:'bkColr',
  },
  
  {
    field: 'bankPoAccountNo',
    headerName: 'Bank/Postal A/C',
    width:'165',
    editable: false,
    disableColumnMenu: true,
    headerClassName:'bkColr',
  }, 
  {
    field: 'ifsc',
    headerName: 'IFSC',
    width:'150',
    editable: false,
    disableColumnMenu: true,
    headerClassName:'bkColr',
  }, 
  {
    field: 'cpsmsBeneficiaryId',
    headerName: 'PFMS Id',
    width:'150',
    editable: false,
    disableColumnMenu: true,
    headerClassName:'bkColr',
  },
  {
    field: 'uidNo',
    headerName: 'Aadhaar',
    width:'150',
    editable: false,
    disableColumnMenu: true,
    headerClassName:'bkColr',
  },
  {
    field: 'pfmsBankName',
    headerName: 'Bank Name',
    width:'280',
    editable: false,
    disableColumnMenu: true,
    headerClassName:'bkColr',
  },
  {
    field: 'recStatus',
    headerName: 'PFMS Response',
    width:'150',
    editable: false,
    disableColumnMenu: true,
    headerClassName:'bkColr',
  },
  {
    field: 'remarks',
    headerName: 'Remarks',
    width:'150',
    editable: false,
    disableColumnMenu: true,
    headerClassName:'bkColr',
  }

];

const validateForm = () => {
  const errors = {};
  if (!selectedDistrictId) {
    errors.selectedDistrictId = messages_en.districtRequired;
  }

  // if (selectedAreaId !== null) {
  //   if (selectedSubDistrictId === null) {
  //     errors.selectedSubDistrictId = messages_en.subDistrictRequired;
  //   }
  // }

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
    setSearchOption(null);
    setXmlRecord([]);
    setFormErrors((prevErrors) => {
      const updatedErrors = { ...prevErrors };
      delete updatedErrors.selectedDistrictId;
      return updatedErrors;
  });
  };
 
  const handleSelectArea = (selectedAreaId) => {
    setSelectedArea(selectedAreaId);
    setSelectedSubDistrict(null);
    setSearchOption(null);
  }

  const handleSelectSubDistrict = (selectedSubDistrictId) => {
    setSelectedSubDistrict(selectedSubDistrictId);
    setSearchOption(null);
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

            if(optionFlag === 'unregister'){
                  if(searchOption === null){
                   setSnackbar({ children: "Please select either New Beneficiaries given Pending/Rejected", severity: 'error' });
                    return false;
                  }
                  else{
                    try {     
                      var location1={ stateID:selectedStateId, districtID:selectedDistrictId, area:selectedAreaId, subDistID:selectedSubDistrictId, searchOption:searchOption , fileName:selectFile,mode:optionFlag};
                      var body1={...location1};
                    const getUrl=`/cpsms-registered-pensioner/getCPSMSRegisteredPensionerDetails`;
                    setLoading(true);
                    const response = await axiosInstance.post(getUrl,JSON.stringify(body1));
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


      try {     
          var location={ stateID:selectedStateId, districtID:selectedDistrictId, area:selectedAreaId, subDistID:selectedSubDistrictId, searchOption:searchOption , fileName:selectFile,mode:optionFlag};
          var body={...location};
        const getUrl=`/cpsms-registered-pensioner/getCPSMSRegisteredPensionerDetails`;
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
      counter:item.counter,
      id: item.sanctionOrderNo,
      sanctionOrderNo: item.sanctionOrderNo,
      pfmsPaymentFlag:item.pfmsPaymentFlag,
      fatherHusbandName:item.fatherHusbandName,
      applicantName:item.applicantName,
      gpName:item.gpName,
      subDistrictName:item.subDistrictName,
      bankPostal:item.bankPostal,
      ifsc:item.ifsc,
      cpsmsBeneficiaryId :item.cpsmsBeneficiaryId,
      pfmsBankName:item.pfmsBankName,
      bankPoAccountNo:item.bankPoAccountNo,
      remarks:item.remarks,
      uidNo:item.uidNo,
      recStatus:item.recStatus,
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

     <MainCard title="GET CPSMS Registered And Unregistered Details">

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
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={3}>
              <FormControl fullWidth>
                <SubDistrictList selectedAreaId={selectedAreaId} selectedDistrictId={selectedDistrictId} setSelectedSubDistrict={setSelectedSubDistrict} onSelectSubDistrict={handleSelectSubDistrict}  />
                {/* {formErrors.selectedSubDistrictId && (
                  <FormHelperText>
                    <Typography style={{ color: 'red', fontSize: '0.8rem' }}>{formErrors.selectedSubDistrictId}</Typography>
                  </FormHelperText>
                )}  */}
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={12} >
          <Divider></Divider>
         
          </Grid>
         
          <Grid container spacing={2}>
            <Grid item xs={12} sm={3}>
      <RadioGroup style={{marginLeft:'10px',marginTop:'2px'}}
        row
        aria-label="searchOption"
        name="searchOption"
        value={searchOption}
        onChange={handleOptionStatusChange}
      >
        <FormControlLabel
          value="newBeneficiaries"
          control={<Radio />}
          label="New Beneficiaries" title='New Beneficiaries'
        />
        <FormControlLabel
          value="pending"
          control={<Radio />}
          label="Pending/Rejected" title='Pending/Rejected'
        />
      </RadioGroup>
      </Grid>
      {searchOption !== null &&  searchOption === 'pending' ? 
      <>
      <span style={{marginTop:'33px',marginRight:'-15px', }}>Request File Name</span>
      <Grid item xs={12} sm={3} >
      <FormControl style={{ width: '75%', marginTop:'1px' }}>
              <InputLabel id="file-label"> -- ALL RECORDS --</InputLabel>
              <Select name="fileName" label={"-- ALL RECORDS --"} onChange={handleInput} value={selectFile}>
                {xmlRecord.map((item, index) => (
              <MenuItem key={index} value={item.fileName}>
                          {item.fileName}
                  </MenuItem>
                ))}
            </Select>

            </FormControl>
            </Grid> </>:''}
    </Grid>

      <Grid item xs={12} alignItems="center">
              <Button type="submit" variant="contained" color="secondary" value="registerd" title="Registerd Pensioners" onClick={() => submitFun('register')}>CPSMS Registerd Pensioners</Button> &nbsp;
              <Button type="submit" variant="contained" color="info" value="unRegisterd" title="Unregisterd Pensioners" onClick={() => submitFun1('unregister')}>CPSMS Unregisterd Pensioners</Button> &nbsp;
              <Button variant="contained" color="primary" onClick={() => {cancelValue()}} title='Cancel'>Cancel</Button>
            </Grid>
             
      </Grid>
        </form>

      </MainCard>
      {getAllDistrict.length>0  ? (
        <>
        <form  onSubmit={handleFormSubmit}>
        
         <MainCard >

         <Button title="Download Excel Report" variant="contained" color="info"  style={{marginLeft:'1330px',marginTop:'-24px'}} 
      onClick={(e) => { e.preventDefault(); downloadBasedOnSearch(); }} startIcon={<DownloadIcon style={{ marginLeft: '-6px', verticalAlign: 'middle',fontSize:'19px' }}/>}>
        Download Excel Report
       </Button>

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
    <Stack sx={{ width: '100%' }} spacing={2}>
    <Alert1 variant="filled" severity="warning" className={'blinking' } style={{color:'red'}}>
      <b>Note:</b> A new bank branch based on IFSC is introduced. Beneficiaries having bank a/c should be linked with correct IFSC branch master under Identification,Verification modules.
      New bank can be added with State user only and new Bank Branch can be added by state and district users both. 
    </Alert1>
    </Stack>
    </div>
  );
}
export default CPSMSRegisteredPensioner
