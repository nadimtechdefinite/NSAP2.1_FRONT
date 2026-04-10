import Box from '@mui/material/Box';
import MainCard from 'ui-component/cards/MainCard';
import { DataGrid ,GridToolbar ,GridCellModes   } from '@mui/x-data-grid';
import React ,{useState} from 'react'
import { Grid, Button,FormControl,Breadcrumbs,Link,Typography } from '@mui/material';
import axiosInstance from 'hooks/useAuthTokenUrl';
import StateList from 'components/form_components/StateList';
import DistrictList from 'components/form_components/DistrictList';
import SubDistrictList from 'components/form_components/SubDistrictList';
import AreaList from 'components/form_components/AreaList';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import EditIcon from '@mui/icons-material/Edit';

function DiscontinueApprStart() {
  const [getAllDisData, setAllDisConData] = useState([])
  // const [selectedRows, setSelectedRows] = useState([]);
  const [selectedStateId, setSelectedState] = useState('');
  const [snackbar, setSnackbar] = React.useState(null);
  const handleCloseSnackbar = () => setSnackbar(null);

  const columns = [
 
    {
     field: 'sanctionOrderNo',
     headerName: 'Sanction Order No',
     flex:1,
     editable: false,
   }, 
   {
     field: 'firstName',
     headerName: 'First Name',
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
    field: 'statusDesc',
    headerName: 'Discontinue Reason',
    flex:1,
    editable: false,
  },
  
   {
     field: 'creationRemarks',
     headerName: 'Remarks',
     flex:1,
     editable: false,
   },
   {
     field: 'approvedRemarks',
    
     headerName: (
      <div >
         <EditIcon fontSize="small" style={{ marginBottom: '-4px', color: 'purple' }}/> Approver Remarks
      </div>
    ),
     flex:1,
     editable: true,
   },
   {
     field: 'action',
     headerName: 'Action',
     width: 180,
     headerAlign: 'center',
     renderCell: (params) => (
       <>
         <Button
           variant="outlined"
           color="success"
           
           style={{ cursor: 'pointer', fontSize: '12px',  marginRight: '8px' }} 
                   onClick={(e) => handleButtonClick1(e,params.row.id, 'true','Approved')}
         >
           Approve
         </Button>
         <Button
           variant="outlined"
           color="error"
           style={{ cursor: 'pointer', fontSize: '12px' }}
           onClick={(e) => handleButtonClick1(e,params.row.id, 'false','Rejected')}
         >
           Reject
         </Button>
       </>
     ),
   }
   
   
 ];
  const handleSelectState = (state) => {
    setSelectedState(state);
  };
  const [selectedDistrictId, setSelectedDistrict] = useState(null)
  const handleSelectDistrict = (selectedDistrictId) => {
    setSelectedDistrict(selectedDistrictId);
    setSelectedArea(null);
    setSelectedSubDistrict(null);
  };
  const [selectedAreaId, setSelectedArea] = useState(null)
  const handleSelectArea = (selectedAreaId) => {
    setSelectedArea(selectedAreaId);
    setSelectedSubDistrict(null);
  }
  const [selectedSubDistrictId, setSelectedSubDistrict] = useState(null);
  const handleSelectSubDistrict = (selectedSubDistrictId) => {
    setSelectedSubDistrict(selectedSubDistrictId);

  };
 
  const handleClickOpen = (e) => {
    e.preventDefault();
    // setOpen(true);
    fetchData()
    .then((res) =>  {if (res) {
      // Data is not null
      const districtData = res || [];
      setAllDisConData(districtData);
      // setAllDisConData(res);
      console.log(res);
  } else {
      // Data is null
      setAllDisConData([]);
       
      setSnackbar({ children: 'No Data Found', severity: 'error' });
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
            // Simulate saving data to the backend
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
      try {
        const getUrl=`/discontinueMaster/findAllDiscontinueDetails`;
        const body= JSON.stringify({ stateID:selectedStateId, districtID:selectedDistrictId, area:selectedAreaId, subDistID:selectedSubDistrictId });
        const response = await axiosInstance.post(getUrl,body);
        // console.log("---------------------"+response[0].status);
        if (response.status >= 200 && response.status < 300) {
          
          return response.data
        } else {
        
          return false;
        //  throw new Error('Data coud not be fetched!', response.data)
        }
    } catch (error) {
        console.error('Error fetching data:', error);
    }
   
     }
    
   
    const rows = getAllDisData.map((item) => ({
      // firstName: item.firstName,
      // middleName: item.middleName,
      // lastName: item.lastName,
      status: item.status,
      sanctionOrderNo: item.sanctionOrderNo,
      id: item.sanctionOrderNo,
      firstName: item.firstName,
      fatherHusbandName: item.fatherHusbandName,
      mobileNo: item.mobileNo,
      creationRemarks:item.creationRemarks,
      approvedRemarks:item.approvedRemarks,
      statusDesc:item.statusDesc
      
      // additionalInput: additionalInputValues[item.applicationNo] || '',
    }));
    // const selectionModel = useSelectionModel();
    const processRowUpdate = React.useCallback(
      async (updatedRow) => {
        try {
          // Make the HTTP request to save in the backend
          const updatedRowData = await mutateRow(updatedRow);
          console.log('updatedRow check status : ', updatedRowData);
          
          setAllDisConData((prevRows) => {
            // Find the index of the updated row
            const rowIndex = prevRows.findIndex((row) => row.sanctionOrderNo === updatedRowData.sanctionOrderNo);
    
            // Create a new array with the updated row
            const updatedRows = [...prevRows];
            updatedRows[rowIndex] = {
              ...updatedRows[rowIndex], // Keep the existing fields
             
              approvedRemarks: updatedRowData.approvedRemarks, // Update only the 'status' field (replace with your field names)
            };
    
            // Return the new array
            return updatedRows;
          });
          // setSnackbar({ children: 'Successfully updated', severity: 'success' });
          
          return updatedRowData;
        } catch (error) {
          console.error('Error updating row:', error);
          setSnackbar({ children: error.message, severity: 'error' });
          throw error;
        }
      },
      [mutateRow, setAllDisConData, setSnackbar]
    );
   
    // const handleFormSubmit = async (e) => {
    //   e.preventDefault();
    //   const selectedData = getAllDisData.filter(
    //     (row) => selectedRows.indexOf(row.sanctionOrderNo) !== -1
    //   );
    //   const updatedData1=await processRowUpdate(selectedData);
    //   console.log('updatedRow fsdgs status : ', getAllDisData);

      
    //   try {
       
    //     const apiUrl = '/discontinueMaster/saveDiscontinueDetails'; // Replace with your actual API endpoint
    //     const response = await axiosInstance.post(apiUrl,JSON.stringify(updatedData1));
       
    //     console.log('API Response:', response.data);
    //     setSnackbar({ children: 'Successfully updated', severity: 'success' });
        
    //     handleClickOpen(e);
        
    //   } catch (error) {
    //     console.error('Error sending data:', error);
    //     setSnackbar({ children: error.message, severity: 'error' });
       
    //   }
     
    // };
    const handleButtonClick1 = async (e,rowId, action,status) => {
      try {
        e.preventDefault();
         // Find the row corresponding to the clicked button
    const selectedRow = getAllDisData.find((row) => row.sanctionOrderNo === rowId);

    // Validate that approved remarks are filled
    if (!selectedRow.approvedRemarks || selectedRow.approvedRemarks.trim() === '') {
      setSnackbar({ children: 'Please enter approver remarks', severity: 'error' });
      return;
    }
        const updatedRowData = { ...getAllDisData.find((row) => row.sanctionOrderNo === rowId), approvedStatus: action };
    console.log("update row 1"+JSON.stringify(updatedRowData));
        setAllDisConData((prevRows) => {
          const rowIndex = prevRows.findIndex((row) => row.sanctionOrderNo === rowId);
          const updatedRows = [...prevRows];
          updatedRows[rowIndex] = {
            ...updatedRows[rowIndex],
            approvedStatus:updatedRowData.approvedStatus,
            approvedRemarks: updatedRowData.approvedRemarks,
          };
          console.log("update row 2"+JSON.stringify(updatedRowData));
          return updatedRows;
        });
        const updatedData1=await processRowUpdate(updatedRowData);
        
        console.log(JSON.stringify(updatedData1));
        try {
           var apiUrl =null;
       if(action==='true'){
         apiUrl = '/discontinueMaster/approveDiscontinueData';
       }
       else{
         apiUrl = '/discontinueMaster/rjctDiscontinueData'; 
       }
          // Replace with your actual API endpoint
          // const response = await axiosInstance.post(apiUrl,JSON.stringify(updatedRowData));
          const response = await axiosInstance.post(apiUrl, {
            [updatedRowData.sanctionOrderNo]: updatedRowData,
            // other key-value pairs...
          });
          if (response.status >= 200 && response.status < 300) {
            console.log('API Response:', response.data);
            setSnackbar({ children: 'Successfully updated' , severity: 'success' });  
            await new Promise(resolve => setTimeout(resolve, 1250));  
  
          handleClickOpen(e);
          }
          // setSnackbar({ children: 'Successfully updated', severity: 'success' });
       else{
        setSnackbar({ children: 'Error in updating data' , severity: 'success' });  
            await new Promise(resolve => setTimeout(resolve, 1250));  
       }
 
        } catch (error) {
          console.error('Error sending data:', error);
          setSnackbar({ children: error.message, severity: 'error' });
         
        }
        
        // setSnackbar({ children: `${status} successfully`, severity: 'success' });
        setSnackbar({ children:  `${status} successfully` , severity: 'success' });  
        await new Promise(resolve => setTimeout(resolve, 1250));  
        handleClickOpen(e);
      } catch (error) {
        console.error('Error calling API:', error);
        setSnackbar({ children: error.message, severity: 'error' });
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
          // Revert the mode of the other cells from other rows
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
            // Revert the mode of other cells in the same row
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
       <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb" style={{ marginBottom: '20px' }}>
          <Link color="inherit" href="#" style={{color:'blue'}} title='Home'>
            Home
          </Link>
          <Link color="inherit" href="#" style={{color:'blue'}} title='Discontinue'>
          Discontinue
          </Link>
          <Typography color="textInfo" title='Approve Discontinue Data'>Approval</Typography>
        </Breadcrumbs>

     <MainCard title="Approve Pensioners">

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

        <form onSubmit={(e) => handleClickOpen(e)}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <StateList onSelectState={handleSelectState} />
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <DistrictList onSelectDistrict={handleSelectDistrict} />
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <AreaList onSelectArea={handleSelectArea} />
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <SubDistrictList districtId={selectedDistrictId} onSelectSubDistrict={handleSelectSubDistrict} />
              </FormControl>
            </Grid>
          
            <Grid item xs={12} alignItems="center">
              <Button type="submit" variant="contained" color="secondary" >Submit</Button>
            </Grid>
          </Grid>
        </form>

      </MainCard>

      {getAllDisData.length>0  ? ( <MainCard title="Pensioners for Approvel">
    <Box sx={{ height : 400, width: '100%' }}>
      <DataGrid  disableRowSelectionOnClick  getRowId={(row) => row.sanctionOrderNo}
         slots={{ toolbar: GridToolbar }}
         slotProps={{
          toolbar: {
            showQuickFilter: true,
          },
        }}
        rows={rows}
        
        columns={columns}
          
        cellModesModel={cellModesModel}
        onCellModesModelChange={handleCellModesModelChange}
        onCellClick={handleCellClick}
          processRowUpdate={processRowUpdate}
        onProcessRowUpdateError={handleProcessRowUpdateError}
       
          // onRowSelectionModelChange={handleSelectionChange}
      
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 15,
            },
          },
        }}
        pageSizeOptions={[15]}
        // checkboxSelection
        // disableRowSelectionOnClick
      />
       
    </Box>
   
    </MainCard>):(
      <div>
      </div>
    )}
    </div>
  );
}

export default DiscontinueApprStart
