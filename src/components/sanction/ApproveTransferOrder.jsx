import React , {useState ,useEffect ,useRef   }  from 'react'
import { makeStyles } from '@mui/styles';
import MainCard from 'ui-component/cards/MainCard';
import axiosInstance from 'hooks/useAuthTokenUrl';
import { Box,Button,Snackbar,Backdrop,CircularProgress,Alert,TableContainer,
    Table ,TableBody ,TableCell ,TableHead ,TableRow ,Paper,TextField,Grid } from '@mui/material';
import { DataGrid ,GridToolbar    } from '@mui/x-data-grid';

const useStyles = makeStyles({
    tableCell: {
      padding: '3px', // Adjust the padding as needed
    },
   
  });
export default function TransferSanctionOrder() {
    const classes = useStyles();
    const [isDataVisible, setDataVisible] = useState(true);
    const [pendingTransferData, setPendingTransferData] = useState([]);
    const [transferData, setTransferData] = useState({});
    const [snackbar, setSnackbar] = React.useState(null);
    const [loading, setLoading] = useState(false);
    const submitformRef = useRef(null);
    
    const handleCloseSnackbar = () => setSnackbar(null);
    const pendingTransfer = async () => {
        try {
          // e.preventDefault();
          const getUrl=`transferSanction/showPendingOrderList`;
          // const body= JSON.stringify({ stateID:selectedStateId, districtID:selectedDistrictId, area:selectedAreaId, subDistID:selectedSubDistrictId });
          setLoading(true);
          const response = await axiosInstance.get(getUrl);
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
      finally {
        setLoading(false);
      }}
    useEffect(() => {
        
        pendingTransfer().then((res) =>  {if (res) {
          const penData = res || [];
          setPendingTransferData(penData);
          // console.log(allDataforRegistration);
      } else {
        setPendingTransferData([]);
          setSnackbar({ children: 'No Data Found', severity: 'error' });
          return false;
      }})
        .catch((e) => {
          console.log(e.message)
        })
      },[]);
    const pendingRecordColumn = [
 
        { field: 'applicationNo',headerName: 'Application No',flex: 1,editable: false}, 
       {field: 'transferOrderNo',headerName: 'Transfer Order No',flex: 1,editable: false},
       {field: 'sanctionOrderNo',headerName: 'Sanction Order No',flex: 1,editable: false},
       {field: 'applicantName',headerName: 'Applicant Name',flex: 1,editable: false},
      {field: 'transferFrom',headerName: 'Transfered From',flex: 1,editable: false},
      {
        field: '',headerName: 'Action',width: 230,headerAlign: 'center',
        renderCell: (params) => (
          <>
          {
      (<Button variant="outlined" color="primary" style={{ cursor: 'pointer', fontSize: '12px',  marginRight: '8px' }} 
                onClick={(e) => getViewTransferDetails(e, params.row.transferOrderNo)} > 
                {/* VIEW */}
        View
      </Button>
      )
      }
      </>
        ),
      } 
    ]
    const getViewTransferDetails= async (e,transferOrderNo)=>{
        e.preventDefault();
      
        const body={"transferOrderNo":transferOrderNo};
        try {
            setLoading(true);
            const response= await axiosInstance.post("transferSanction/showPendingOrder",body);
            if (response.status >= 200 && response.status < 300) {
              setDataVisible(false);
                setTransferData(response.data);
                return response.data
              } else {
              
                setSnackbar({ children: 'No Data Found', severity: 'error' }); 
              return false;
              //  throw new Error('Data coud not be fetched!', response.data)
              }
           
      
        }
        catch (error) {
          setSnackbar({ children: 'Some Internal Error Occured ', severity: 'error' }); 
          console.error('Error fetching payable data:', error);
        }
        finally{
          setLoading(false);
        }
      }
    const pendingTransferOrder = pendingTransferData.map((item) => ({
        id: item.transferOrderNo,
        applicationNo: item.applicationNo,
        transferOrderNo:item.transferOrderNo,
        sanctionOrderNo: item.sanctionOrderNo,
        applicantName:item.applicantName,
        transferFrom:item.address1+" "+item.address2+" "+item.address3+" "+item.pincode
        
    }));
    const handleChange = ( fieldName, value) => {
        setTransferData((prevData) => ({
            ...prevData,
            [fieldName]: value,
          }));
   
      };
   
      const handleCancel = () => {
        setDataVisible(true);
        setSnackbar({ children: 'Operation Cancelled ', severity: 'error' }); 
        console.log('Cancel button clicked');
      };
      
      const handleFormSubmit = async (action) => {
        let updatedRemarks = '';

    if (action === 'approve') {
      updatedRemarks =  transferData.transferRemarks;
    } else if (action === 'reject') {
      updatedRemarks =  transferData.transferRemarks;
    }

    setTransferData((prevData) => ({
      ...prevData,
      transferRemarks: updatedRemarks,
    }));
    try {
        setLoading(true);
        
        const apiUrl=`transferSanction/acceptRejectTransferOrder/`+action;
       
        const response= await axiosInstance.post(apiUrl,transferData);
        if (response.status >= 200 && response.status < 300) {
          setSnackbar({ children: response.data, severity: 'success' }); 
          setDataVisible(true);

            return response.data
          } else {
          
            setSnackbar({ children: 'No Data Found', severity: 'error' }); 
          return false;
          //  throw new Error('Data coud not be fetched!', response.data)
          }
       
  
    }
    catch (error) {
      setSnackbar({ children: 'Some Internal Error Occured ', severity: 'error' }); 
      console.error('Error fetching payable data:', error);
    }
    finally{
      setLoading(false);
      pendingTransfer().then((res) =>  {if (res) {
        const penData = res || [];
        setPendingTransferData(penData);
        // console.log(allDataforRegistration);
    } else {
      setPendingTransferData([]);
        setSnackbar({ children: 'No Data Found', severity: 'error' });
        return false;
    }})
      .catch((e) => {
        console.log(e.message)
      })
    
    }

    console.log('Submitted Data:', transferData);
       console.log(action);
      };
    return (
        <div>
           
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
         {isDataVisible && ( <MainCard title="Pending Transfer Orders">
         
 <Box ref={submitformRef}  sx={{ height : 400, width: '100%' }}>
    <DataGrid  disableRowSelectionOnClick  
      slots={{ toolbar: GridToolbar }}
      slotProps={{
       toolbar: {
         showQuickFilter: true,
       },
     }}
     rows={pendingTransferOrder}
     
     columns={pendingRecordColumn}
    
     initialState={{
       pagination: {
         paginationModel: {
           pageSize: 15,
         },
       },
     }}
     pageSizeOptions={[15]}
   />
   
   </Box>
 
 </MainCard>)}
 {!isDataVisible && ( 
 <MainCard title="Accept/Reject Sanction Transfer Orders">
 <form>
 <TableContainer component={Paper}>
 <Table sx={{ minWidth: 700 }} aria-label="spanning table">
 <TableHead>
 <TableRow>
            <TableCell align="center" className={classes.tableCell} style={{ backgroundColor: 'lightblue' }} colSpan={8}>
            Transfer From
            </TableCell>
            
          </TableRow>
          
        </TableHead>
        <TableBody>
        <TableRow >
              <TableCell className={classes.tableCell} ><b>State:</b></TableCell>
              <TableCell className={classes.tableCell} align="left" colSpan={2}>{transferData.stateName}</TableCell>
              <TableCell className={classes.tableCell} align="left" colSpan={3}><b>District:</b></TableCell>
              <TableCell  className={classes.tableCell} align="left" colSpan={2}>{transferData.districtName}</TableCell>
            </TableRow>
            <TableRow >
              <TableCell className={classes.tableCell} ><b>Area :</b></TableCell>
              <TableCell className={classes.tableCell}  align="left" colSpan={1}>{transferData.ruralUrbanArea}</TableCell>
              <TableCell className={classes.tableCell}  align="left" colSpan={4}><b>Sub District / Municipal Area Name :</b></TableCell>
              <TableCell className={classes.tableCell}  align="left" colSpan={2}>{transferData.subDistrictMunicipalAreaName}</TableCell>
            </TableRow>
            <TableRow >
              <TableCell className={classes.tableCell} ><b>Village:</b></TableCell>
              <TableCell className={classes.tableCell}  align="left" colSpan={1}>{transferData.villageName}</TableCell>
              <TableCell className={classes.tableCell}  align="left" colSpan={1}><b>Habitation:</b></TableCell>
              <TableCell className={classes.tableCell}  align="left" colSpan={5}>{transferData.habitationName}</TableCell>
            </TableRow>
            <TableRow >
              <TableCell className={classes.tableCell} ><b>Address:</b></TableCell>
              <TableCell className={classes.tableCell}  align="left" colSpan={7}>{transferData.stateName}</TableCell>
              </TableRow>
              <TableRow >
              <TableCell className={classes.tableCell} ><b>House No:</b></TableCell>
              <TableCell className={classes.tableCell}  align="left" >{transferData.address1}</TableCell>
              <TableCell className={classes.tableCell}  align="left" ><b>Street:</b></TableCell>
              <TableCell className={classes.tableCell}  align="left" >{transferData.address2}</TableCell>
              <TableCell className={classes.tableCell} ><b>Locality:</b></TableCell>
              <TableCell className={classes.tableCell}  align="left" >{transferData.address3}</TableCell>
              <TableCell className={classes.tableCell}  align="left" ><b>Pincode:</b></TableCell>
              <TableCell className={classes.tableCell}  align="left" >{transferData.pincode}</TableCell>
            </TableRow>
            <TableRow >
              <TableCell className={classes.tableCell} ><b>Name:</b></TableCell>
              <TableCell className={classes.tableCell}  align="left" colSpan={7}>{transferData.applicantName}</TableCell>
              </TableRow>
              <TableRow >
              <TableCell className={classes.tableCell} ><b>Sanction Order No.:(OLD):</b></TableCell>
              <TableCell className={classes.tableCell}  align="left" colSpan={7}>{transferData.sanctionOrderNo}</TableCell>
              </TableRow>
              <TableRow >
              <TableCell className={classes.tableCell} ><b>Pension paid up to:</b></TableCell>
              <TableCell className={classes.tableCell}  align="left" colSpan={7}>{transferData.stateName}</TableCell>
              </TableRow>
              <TableRow>
            <TableCell className={classes.tableCell} style={{ backgroundColor: 'lightblue' }} align="center" colSpan={8}>
            <b>Transfer To</b>
            </TableCell>
         </TableRow>
         <TableRow >
              <TableCell className={classes.tableCell} ><b>State:</b></TableCell>
              <TableCell className={classes.tableCell}  align="left" colSpan={2}>{transferData.stateNameTransfer}</TableCell>
              <TableCell className={classes.tableCell}  align="left" colSpan={3}><b>District:</b></TableCell>
              <TableCell className={classes.tableCell}  align="left" colSpan={2}>{transferData.districtNameTransfer}</TableCell>
            </TableRow>
            <TableRow >
              <TableCell className={classes.tableCell} ><b>Area :</b></TableCell>
              <TableCell className={classes.tableCell}  align="left" colSpan={1}>{transferData.ruralUrbanAreaTransfer}</TableCell>
              <TableCell className={classes.tableCell}  align="left" colSpan={4}><b>Sub District / Municipal Area Name :</b></TableCell>
              <TableCell className={classes.tableCell}  align="left" colSpan={2}>{transferData.subDistrictMunicipalAreaNameTransfer}</TableCell>
            </TableRow>
            <TableRow >
              <TableCell className={classes.tableCell} ><b>Village:</b></TableCell>
              <TableCell className={classes.tableCell}  align="left" colSpan={1}>{transferData.villageNameTransfer}</TableCell>
              <TableCell className={classes.tableCell}  align="left" colSpan={1}><b>Habitation:</b></TableCell>
              <TableCell className={classes.tableCell}  align="left" colSpan={5}>{transferData.habitationNameTransfer}</TableCell>
            </TableRow>
            <TableRow >
              <TableCell className={classes.tableCell} ><b>House No:</b></TableCell>
              <TableCell className={classes.tableCell}  align="left" >{transferData.address1Transfer}</TableCell>
              <TableCell className={classes.tableCell}  align="left" ><b>Street:</b></TableCell>
              <TableCell className={classes.tableCell}  align="left" >{transferData.address2Transfer}</TableCell>
              <TableCell className={classes.tableCell} ><b>Locality:</b></TableCell>
              <TableCell className={classes.tableCell}  align="left" >{transferData.address3Transfer}</TableCell>
              <TableCell className={classes.tableCell}  align="left" ><b>Pincode:</b></TableCell>
              <TableCell className={classes.tableCell}  align="left" >{transferData.pincodeTransfer}</TableCell>
            </TableRow>
            <TableRow >
              <TableCell className={classes.tableCell} ><b>Sanction Order No.:(New):</b></TableCell>
              <TableCell className={classes.tableCell}  align="left" colSpan={7}>{transferData.transferSanctionNo}</TableCell>
              </TableRow>
              <TableRow >
              <TableCell className={classes.tableCell} colSpan={1}><b>Remarks:</b></TableCell>
              <TableCell className={classes.tableCell} colSpan={6} align="left" >
              <TextField
                label="Enter Remarks Here"
                variant="standard"
                value={transferData.transferRemarks}
                // onChange={handleChange}
                onChange={(e) => handleChange('transferRemarks',  e.target.value)}
              />
              </TableCell>
              </TableRow>
        </TableBody>
 </Table>
 </TableContainer>

 <Grid item xs={12} alignItems="center">
 <Box display="flex" justifyContent="center" gap={2} marginTop={2}>
              <Button type="button" variant="outlined" color="success" onClick={() => handleFormSubmit('approve')}>Accept</Button>
              <Button type="button" variant="outlined" color="error" onClick={() => handleFormSubmit('reject')}>Reject</Button>
              <Button type="button" variant="outlined" color="primary" onClick={handleCancel}>Cancel</Button>
              </Box>
            </Grid>
        
 </form>
 </MainCard>
 )}
        </div>
    );
}