import React,{useEffect,useState}  from 'react'
import MainCard from 'ui-component/cards/MainCard';
import {Button,Backdrop ,Snackbar,CircularProgress,Alert} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import axiosInstance from 'hooks/useAuthTokenUrl';

export default function DSCStatus() {
    const [snackbar, setSnackbar] = React.useState(null);
    const [loading, setLoading] = useState(false);
    const [digitalSignatureData, setDigitalSignatureData] = useState([]);
    const handleCloseSnackbar = () => setSnackbar(null);

    const pendingRecordColumn = [
    
        { field: 'id',headerName: 'Registration Id',flex: 1,editable: false}, 
       {field: 'certName',headerName: 'Name',flex: 1,editable: false},
       {field: 'certSerialNo',headerName: 'Serial No',flex: 1,editable: false},
       {field: 'validFrom',headerName: 'Valid From',flex: 1,editable: false},
      {field: 'validTo',headerName: 'Valid Upto',flex: 1,editable: false},
      {field: 'msgId',headerName: 'File Name',flex: 1,editable: false},
      {field: 'status',headerName: 'Approved Status',flex: 1,editable: false},
     
      {
        field: '',
        headerName: 'Status',
        width: 230,
        headerAlign: 'center',
        renderCell: (params) => (
          <>
          {params.row.status!=='Reject' ?( <> {params.row.status!=='Approved' ? (<><Button
                variant="outlined"
                color="primary"
                style={{ cursor: 'pointer', fontSize: '12px', marginRight: '8px' }}
                onClick={(e) => approveRecord(e, params.row.id, params.row.msgId)}
              >
                Approve
              </Button>
            
              <Button
                variant="outlined"
                color="primary"
                style={{ cursor: 'pointer', fontSize: '12px', marginRight: '8px' }}
                onClick={(e) => rejectRecord(e, params.row.id, params.row.msgId)}
              >
               Reject
              </Button>
              </>):( <> <p>Approved  </p>
             
              <Button
                variant="outlined"
                color="primary"
                style={{ cursor: 'pointer', fontSize: '12px', marginRight: '8px' }}
                onClick={(e) => rejectRecord(e, params.row.id, params.row.msgId)}
              >
               Reject
              </Button></>)
          }
              </>
              ):( <p>Rejected</p>)}
         
           
          </>
        ),
      }
      
    ].filter(Boolean);
    const approveRecord=async(e,id,msgId)=>{
        e.preventDefault();
        try{
          var result = window.confirm("Please Confirm File Will be Sent To PFMS ?");
          if(result){
           const body={id:id,msgId:msgId};
           const getUrl=`/digitalSignature/approveRecord`;
          setLoading(true);
          const response = await axiosInstance.post(getUrl,JSON.stringify(body));
          if (response.status >= 200 && response.status < 300) {
            // setXMLData(response.data);
            if(response.data){
              setDigitalSignatureData(response.data);
              setSnackbar({ children: "DSC Registration reguest Approved ", severity: 'success' });
            }
           else{
            // setDigitalSignatureData([]);
            setSnackbar({ children: "DSC Registration reguest Failed, Contact To ADMIN ", severity: 'error' });
           }
           
            return response.data
          } else {
            
            return false;
          }
        }
        else{
          return false;
        }
        }
        catch(error){
          console.error("An error occurred while XML Data:", error);
          return false;
        }
        finally{
          setLoading(false);
        }
       }
       const rejectRecord=async(e,id,msgId)=>{
        e.preventDefault();
        try{

           const body={id:id,msgId:msgId};
           const getUrl=`/digitalSignature/rejectRecord`;
          setLoading(true);
          const response = await axiosInstance.post(getUrl,JSON.stringify(body));
          if (response.status >= 200 && response.status < 300) {
            // setXMLData(response.data);
            setDigitalSignatureData(response.data);
            setSnackbar({ children: "DSC Registration reguest Rejected", severity: 'success' });
            return response.data
          } else {
            
            return false;
          }
        }
        catch(error){
          console.error("An error occurred while XML Data:", error);
          return false;
        }
        finally{
          setLoading(false);
        }
       }
    useEffect(() => {
        getPendingRecord();
       
         // Fetch data when component mounts
      }, []);
    const getPendingRecord=async()=>{
        
        try{
            // console.log("1");
        //   const body={id:id,msgId:msgId};
          const getUrl=`/digitalSignature/getPendingDSCApproverData`;
          setLoading(true);
          // console.log("2");
          const response = await axiosInstance.get(getUrl);
          // console.log("3");
          if (response.status >= 200 && response.status < 300) {
            // console.log("4");
            // console.log("-----------"+response.data);
            if (response.data.length === 0) {
              setDigitalSignatureData([]);
              setSnackbar({ children: "No Data Found", severity: 'error' });
              return false;
            }
            else{
              setDigitalSignatureData(response.data);
            }
           
            return response.data
          } else {
            // console.log("5");
            return false;
          }
        }
        catch(error){
            // console.log("6");
          setSnackbar({ children: "XML file Not Found", severity: 'error' });
          console.error("An error occurred while XML Data:", error);
          return false;
        }
        finally{
          setLoading(false);
        }
       }
    const pendingRecord = digitalSignatureData.map((item) => ({
        id: item.registerId,
        certName: item.certUserName,
        certSerialNo:item.certSerialNo,
        validFrom: item.certificateValidFrom,
        validTo:item.certificateValidUpto,
        msgId:item.msgId,
        status:item.approveStatus,
        signedStatus:item.signStatus
        
    }));
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
        
               
              <MainCard title="Digital Signature Registration Status">
            <Backdrop open={loading}   style={{ zIndex: 999, color: '#fff' }}>
                <CircularProgress color="inherit" />
              </Backdrop>  
              <DataGrid  disableRowSelectionOnClick  
      // slots={{ toolbar: GridToolbar }}
    //   slotProps={{
    //    toolbar: {
    //      showQuickFilter: true,
    //    },
    //  }}
     rows={pendingRecord}
     
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
              </MainCard>
      </div>     
    )   
}