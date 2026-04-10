import MainCard from 'ui-component/cards/MainCard';
import { DataGrid ,GridToolbar ,GridCellModes  } from '@mui/x-data-grid';
import React ,{useState,useEffect }  from 'react'
import { Grid, Button,FormControl,Snackbar, Alert,CircularProgress,Backdrop} from '@mui/material';
import axiosInstance from 'hooks/useAuthTokenUrl';
import StateList from 'components/form_components/StateList';
import DistrictList from 'components/form_components/DistrictList';
import SubDistrictList from 'components/form_components/SubDistrictList';
import AreaList from 'components/form_components/AreaList';
import { useNavigate } from "react-router-dom";
import  '../../../components/verification/mark-nsap-beneficiary/approveMarkBeneficiary.css';
import DownloadIcon from '@mui/icons-material/Download';
//import Radio from '@mui/material/Radio';
//import RadioGroup from '@mui/material/RadioGroup';
//import FormControlLabel from '@mui/material/FormControlLabel';
import Alert1 from '@mui/material/Alert';
import Stack from '@mui/material/Stack';


function AadharDownloadInExcel() {
  const [getAllDistrict, setAllDistrict] = useState([])
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectedStateId, setSelectedState] = useState('');
  const [snackbar, setSnackbar] = React.useState(null);
  const handleCloseSnackbar = () => setSnackbar(null);
  const [loading, setLoading] = useState(false);
  const [selectedDistrictId, setSelectedDistrict] = useState(null);
  const [selectedAreaId, setSelectedArea] = useState(null);
  const [selectedSubDistrictId, setSelectedSubDistrict] = useState(null);
  //const [uidStatus, setUidStatus] = React.useState(null);


 const navigate = useNavigate();

 function cancelValue(){
  navigate('/nsap/dashboard/default');
  }
  //const handleUidStatusChange = (event) => {
   // setUidStatus(event.target.value);
  //};

//   const options = {
//     "sanctionOrderNo": "Incorrect Aadhaar",
//     "aadhaarNo": "Not Matched/Not Verified Aadhaar",
//   };
//   const [optionValues, setOptionValues] = useState(null);
//   const handleSearchOptionValuesChange = (newOptionValues) => {
//         setOptionValues(newOptionValues);
//       };
    console.log("--- "+selectedStateId);
      const downloadDataInExcel = async (districtCode,selectedAreaId,selectedSubDistrictId) => {
        event.preventDefault();
        const body = { districtCode: districtCode, area: selectedAreaId, subDistrictMunicipalCode: selectedSubDistrictId };
        try {
           setLoading(true);
           var urlData="/aadhar-download-in-excel/getAadharDownloadInExcelDownlaod";
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
           var title='Beneficiary Details For Incorrect Aadhaar';
           const currentDate = new Date().toISOString().slice(8, 10) + '-' + new Date().toISOString().slice(5, 7) + '-' + new Date().toISOString().slice(0, 4);
           link.download = `${title}_${currentDate}.xlsx`;
           document.body.appendChild(link);
           link.click();
           document.body.removeChild(link);
           window.URL.revokeObjectURL(link.href);
       }
       catch (error) {
           setSnackbar({ children: 'Some Internal Error Occured While fetching data', severity: 'error' });
           console.error('Error fetching data:', error.message);
       }
       finally {
           setLoading(false);
       }
   }

      
  useEffect(() => {
  }, []);

  const columns = [
   {
    field: 'id',
    headerName: 'SNo.',
    width:'260',
    editable: false,
    headerClassName:'bkColr',
  }, 
  {
    field: 'reason',
    headerName: 'Reason',
    flex:1,
    editable: false,
    headerClassName:'bkColr',
  }, 
];

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
      // Data is not
      const districtData = res || [];
      setAllDistrict(districtData);
      console.log(res);
  } else {
      setAllDistrict([]);
       
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
            if (updatedRow.id?.trim() === '') {
              reject(new Error("Error: District Name can't be empty."));
            } else {
              resolve({ ...updatedRow , id: updatedRow .id?.toUpperCase() });
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
        //if(uidStatus === null){
        //    alert("please select either one!");
        //    return false;
        //}

        downloadDataInExcel(selectedDistrictId,selectedAreaId,selectedSubDistrictId);

    //   try {     
    //       var location={ stateID:selectedStateId, districtID:selectedDistrictId, area:selectedAreaId, subDistID:selectedSubDistrictId};
    //       var body={...location};
    //     const getUrl=`/invalid-pensioner-detail/getInvalidPensionerDetail`;
    //     setLoading(true);
    //     const response = await axiosInstance.post(getUrl,JSON.stringify(body));
    //     if (response.status >= 200 && response.status < 300) {
    //       return response.data
    //     } else {
        
    //       return false;
    //     }
    // } catch (error) {
    //     console.error('Error fetching data:', error);
    // }
    // finally {
    //   setLoading(false);
    // }
  }
   

     
    const handleSelectionChange = (newSelection) => {
     setSelectedRows(newSelection);
    };
   
    const rows = getAllDistrict.map((item) => ({
      id: item.counter,
      reason: item.heading,
    }));
    const processRowUpdate = React.useCallback(
      async (updatedRow) => {
        try {
          const updatedRowData = await mutateRow(updatedRow);
          setAllDistrict((prevRows) => {
            const rowIndex = prevRows.findIndex((row) => row.id === updatedRowData.id);
            const updatedRows = [...prevRows];
            //handleChangeVer(true,updatedRowData.sanctionData);
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
        (row) => selectedRows.indexOf(row.id) !== -1
      );

      const updatedData1=await processRowUpdate(selectedData);
      console.log('updated Row status : ', JSON.stringify(selectedData));  
      
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

     <MainCard title="Verification - Beneficiary Details For Incorrect Aadhaar">    

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

        
            {/* <Grid item xs={12} sm={2}>
            <span><kbd className="responsive-kbd">Type to be download <span style={{ color: 'red' }}>*</span></kbd></span>
            </Grid>
            <Grid item xs={12} sm={3}>
        <RadioGroup style={{marginLeft:'-80px',marginTop:'-11px'}}
        row
        aria-label="uidstatus"
        name="uidstatus"
        value={uidStatus}
        onChange={handleUidStatusChange}
      >
        <FormControlLabel
          value="incorrectAadhaar"
          control={<Radio />}
          label="Incorrect Aadhaar" 
        />
        <FormControlLabel
          value="notMatchedAadhaar"
          control={<Radio />}
          label="Not Matched/Not Verified Aadhaar"
        />
      </RadioGroup>    
      </Grid> */}

      <Grid item xs={12} alignItems="center">
              <Button type="submit" variant="contained" color="secondary" title='Download Excel'>Download Excel <DownloadIcon/></Button>
              &nbsp;&nbsp;<Button type="submit" variant="contained" color="primary" onClick={() => {cancelValue()}} style={{marginTop:''}} title='Cancel'>Cancel</Button>

            </Grid>
             
      </Grid>
        </form>

      </MainCard><br/>
      <Stack sx={{ width: '100%' }} spacing={2}>
    <Alert1 variant="filled" severity="warning" className={'blinking' } style={{color:'red'}}>Note: This module include only <b style={{color:'blue'}}>SO_SAVED, SANCTIONED</b> beneficiary data.</Alert1>
    </Stack>
      {getAllDistrict.length>0  ? (
        <>
        <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap'   }}>
        <kbd className="responsive-kbd">{districtName} {subDisName !=null ? ': '+subDisName : ''}</kbd>
        <kbd className="responsive-kbd">Scheme : {schemeName}</kbd>
        </div>
        <form  onSubmit={handleFormSubmit}>
        
         <MainCard >
      <DataGrid  disableRowSelectionOnClick getRowId={(row) => row.id} 
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
export default AadharDownloadInExcel
