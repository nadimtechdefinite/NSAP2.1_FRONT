import MainCard from 'ui-component/cards/MainCard';
import { DataGrid ,GridToolbar ,GridCellModes  } from '@mui/x-data-grid';
import React ,{useState,useEffect }  from 'react'
import { Grid, Button,Breadcrumbs,Link,Typography,Snackbar, Alert,CircularProgress,Backdrop} from '@mui/material';
import axiosInstance from 'hooks/useAuthTokenUrl';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { GRID_CHECKBOX_SELECTION_COL_DEF } from '@mui/x-data-grid';
import { useNavigate } from "react-router-dom";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { accountBankFormValidation } from './MarkBenificiaryFormValidation';
import './approveMarkBeneficiary.css'

function ApproveMarkNSAPBeneficiaryLevelData() {
  const [getAllDistrict, setAllDistrict] = useState([])
  const [selectedRows, setSelectedRows] = useState([]);
  const [snackbar, setSnackbar] = React.useState(null);
  const handleCloseSnackbar = () => setSnackbar(null);
  const [loading, setLoading] = useState(false);
  const [stateCap, setStateCap] = useState('');
  const navigate = useNavigate();
  const [districtName, setDistrictName] = useState('');
  const [gpNameData, setgpNameData] = useState('');
  const [subDisNameData, setSubDisNameData]=useState('');
  

  function setSubmitValue(){ 
    //setSubmitFinalValue('true')
  }

  function cancelValue(){
    navigate('/nsap/dashboard/default');
  }

      const getLabelFirstData = async () => {
        try {
          const findFirtsLabelData = '/approve-mark-nsap-beneficiary/getApproveMarkLabelData';
          setLoading(true);
          const response = await axiosInstance.get(findFirtsLabelData);  
          setStateCap(response.data);
        } catch (error) {
          console.error('Error fetching data :', error);
        }
        finally{
          setLoading(false);
        }
      };

      const getLabelData = async () => {
        try {
            //alert("ben level --- "+localStorage.getItem('gramId'));
            const findAllLabelData = '/approve-mark-nsap-beneficiary/getApproveMarkNSAPBeneficiaryForPensionerData/' + localStorage.getItem('gramId');
            setLoading(true);
          const response = await axiosInstance.get(findAllLabelData);  
          setAllDistrict(response.data);
        } catch (error) {
          console.error('Error fetching data :', error);
        }
        finally{
          setLoading(false);
        }
      };

      const getDistrictNameData = async () => {
        try {
            const districtNameData = '/approve-mark-nsap-beneficiary/getDistrictData/' + localStorage.getItem('districtId');
          const response = await axiosInstance.get(districtNameData);  
          setDistrictName(response.data);
        } catch (error) {
          console.error('Error fetching data :', error);
        }
      };
      const getGPNameData = async () => {
        try {
            const gpNameData = '/approve-mark-nsap-beneficiary/getGramPanchayat/' + localStorage.getItem('gramId');
          const response = await axiosInstance.get(gpNameData);  
          //alert("-gp name is : - "+response.data);
          setgpNameData(response.data);
        } catch (error) {
          console.error('Error fetching data :', error);
        }
      };

      const getSubDistNameData = async () => {
        try {
            const subDistNameData = '/approve-mark-nsap-beneficiary/getGPData/' + localStorage.getItem('subDistId');
          const response = await axiosInstance.get(subDistNameData);  
          //alert("-gp name is : - "+response.data);
          setSubDisNameData(response.data);
        } catch (error) {
          console.error('Error fetching data :', error);
        }
      };

      const backItem = () => {
        localStorage.setItem('gramId', '');
        navigate('/verification/approveMarkNSAPBeneficiaryGP');
      };

 
  useEffect(() => {
    getLabelData();getLabelFirstData();getDistrictNameData();getGPNameData();getSubDistNameData();
  }, []);

  const [selectionModel, setSelectionModel] = useState([]);
  useEffect(() => {
    const initialSelection = getAllDistrict.map((item) => item.sanctionOrderNo);
    setSelectionModel(initialSelection);
    setSelectedRows(initialSelection);
    
  }, [getAllDistrict.length]);

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
  } ,
  {
    field: 'categoryCode',
    headerName: 'Category Code',
    flex:1,
    editable: false,
    disableColumnMenu: true,
  } ,
  {
    field: 'gramPanchayatWardName',
    headerName: 'Gram Panchayat Ward Name',
    flex:1,
    editable: false,
    disableColumnMenu: true,
  } ,
  {
    field: 'paymentMode',
    headerName: 'Payment Mode',
    flex:1,
    editable: false,
    disableColumnMenu: true,
  } ,
  {
    field: '',
    headerName: 'Checked All',
    width:'95',
    editable: false,
    disableColumnMenu: true,
  } ,
  // {
  //   field: 'checkedBenefiary',
  //   headerName: 'Move to NSAP Category',
  //   width:'175',
  //   disableColumnMenu: true,
  //   sortable: false,
  //   renderCell: (params) => (
  //     <input
  //       type="checkbox"
  //        checked={params.value==="true" ?true:false}
  //       onChange={(e) => handleChange(params.id, e.target.checked)}
  //     />
  //   ),
  // },  

];
// function handleChange(sanId,chk){
// if(chk===false){
//   setAllDistrict((prevRows) =>
//   prevRows.map((row) =>
//     row.sanctionOrderNo === sanId
//       ? { ...row, ['checkedBenefiary']: "false" }
//       : row
//   )
// );
// }else{
//   setAllDistrict((prevRows) =>
//   prevRows.map((row) =>
//     row.sanctionOrderNo === sanId
//       ? { ...row, ['checkedBenefiary']: "true" }
//       : row
//   )
// );
// }
// }

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

  const handleClickOpen = (e) => {
    e.preventDefault();
    fetchData()
    .then((res) =>  {if (res) {
      const districtData = res || [];
      setAllDistrict(districtData);
      console.log(res);
  } else {
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
     }
     
    const handleSelectionChange = (newSelection) => {
     setSelectedRows(newSelection);
     setSelectionModel(newSelection);
    };
   
    const rows = getAllDistrict.map((item,index) => ({
      id: item.sanctionOrderNo,
      serialNumber: index + 1,
      gpCode: item.gpCode,
      gpName: item.gpName,
      districtCode: item.districtCode,
      subDistrictCode:item.subDistrictCode,
      totalBeneficiary: item.totalBeneficiary,
      pendingForApproval: item.pendingForApproval,
      approved: item.approved,
      area: item.area, 
      sanctionOrderNo:item.sanctionOrderNo,
      name:item.name, 
      fatherHusbandName:item.fatherHusbandName, 
      age:item.age, 
      gender:item.gender,
      categoryCode:item.categoryCode, 
      gramPanchayatWardName:item.gramPanchayatWardName,
      paymentMode:item.paymentMode, 
      checkedBenefiary:item.checkedBenefiary,     
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
        setSnackbar({ children: 'Please checked atleast one checkbox.', severity: 'error' });
        return;
      }
     
      const validationErrors =  accountBankFormValidation(getAllDistrict);
          
      if (validationErrors.length > 0) {
        validationErrors.forEach((error) => {
          setSnackbar({ children: error, severity: 'error' });
        });
        return;
      }
      const selectedData = getAllDistrict.filter(
        (row) => selectedRows.indexOf(row.sanctionOrderNo) !== -1
      );
      const updatedData1=await processRowUpdate(selectedData);
      console.log('updated Row status : ', JSON.stringify(selectedData));   
      
      try {
        //const body=getAllDistrict;
        const body={updatedData1};
        const apiUrl = '/approve-mark-nsap-beneficiary/saveApproveMarkNSAPBeneficiaryLevel'; 
        setLoading(true);
        const response = await axiosInstance.post(apiUrl,JSON.stringify(body));
        console.log('API Response:', response.data);
        if(response.data[0].status ==='You are exceeding the State Cap.'){
          setSnackbar({ children: 'You are exceeding the State Cap.' , severity: 'error' });  
          setTimeout(() => {
            navigate('/verification/approveMarkNSAPBeneficiary');
          }, 4000); 
        }
        else if (response.status >= 200 && response.status < 300) {
          setSnackbar({ children: 'Record successfully updated' , severity: 'success' });  
          setTimeout(() => {
            navigate('/verification/approveMarkNSAPBeneficiary');
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
 <Button
        title="Back"
        variant="contained"
        color="primary"
        style={{ float: 'right', marginTop: '-7px' }}
        onClick={backItem}
        startIcon={<ArrowBackIcon />}
      >Back
      </Button>
      <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb" style={{ marginBottom: '20px' }}>
          <Link color="inherit" href="#" style={{color:'blue'}} title='Home'>
            Home
          </Link>
          <Link color="inherit" href="#" style={{color:'blue'}} title='Verification'>
          Verification
          </Link>
          <Typography color="textInfo" title='Approve Mark NSAP Beneficiary'>Approve Mark NSAP Beneficiary</Typography>
        </Breadcrumbs> 
     <MainCard title="Approve Migrate Scheme Category">

     <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap'   }}>
  <kbd className="responsive-kbd" style={{fontSize:'15px'}}>Total Benificiary: {stateCap.totalBenData}</kbd>
  <kbd className="responsive-kbd" style={{fontSize:'15px'}}>State Cap: {stateCap.stateCapData}</kbd>
  <kbd className="responsive-kbd" style={{fontSize:'15px'}}>Pending For Approval: {stateCap.pendingForData}</kbd>
  <kbd className="responsive-kbd" style={{fontSize:'15px'}}>Approved: {stateCap.approvedData}</kbd>
</div>
<div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap'   }}>
  <kbd className="responsive-kbd" style={{fontSize:'13px'}}>District Name: {districtName}</kbd>
  <kbd className="responsive-kbd" style={{fontSize:'13px'}}>Sub-District Name: {subDisNameData}</kbd>
  <kbd className="responsive-kbd" style={{fontSize:'13px'}}>GP Name: {gpNameData}</kbd>
</div>

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
    

      </MainCard>

      {getAllDistrict.length>0  ? (
        <>
        <form  onSubmit={handleFormSubmit}>
         <MainCard >
         <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap'   }}>
         <span style={{marginLeft:'',color:'darkblue', backgroundColor:'aliceblue'}}><b>Move to NSAP Category</b></span>
         </div>
      <DataGrid  checkboxSelection disableRowSelectionOnClick getRowId={(row) => row.sanctionOrderNo} 
        slots={{ toolbar: GridToolbar}}
      slotProps={{
          toolbar: {
            showQuickFilter: true,
            printOptions: { disableToolbarButton: true } ,
          },
        }}
         columns={columnsWithCheckbox}
        rows={rows}
        cellModesModel={cellModesModel}
        onCellModesModelChange={handleCellModesModelChange}
        onCellClick={handleCellClick}
          processRowUpdate={processRowUpdate}
        onProcessRowUpdateError={handleProcessRowUpdateError}
          //onRowSelectionModelChange={handleSelectionChange,handleSelectionModelChange}
          onRowSelectionModelChange={handleSelectionChange}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 15,
            },
          },
        }}
        rowSelectionModel={selectionModel}
        pageSizeOptions={[15]}
      />  
    <Grid item xs={12} alignItems="center">
              <Button type="submit" variant="contained" color="secondary" onClick={() => {setSubmitValue()}} style={{marginTop:'5px'}} title='Submit'>APPROVE</Button>
              &nbsp;<Button variant="contained" color="primary" onClick={() => {cancelValue()}} style={{marginTop:'5px'}} title='Cancel'>Cancel</Button>
    </Grid>
    </MainCard>
    </form>
    </>
    ):(
      <div>
        <br/>
        <span style={{color:'red',fontSize:'16px',marginLeft:'659px'}}>No Data Found...</span>
      </div>
    )}
    </div>
  );
}
export default ApproveMarkNSAPBeneficiaryLevelData
