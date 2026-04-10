import MainCard from 'ui-component/cards/MainCard';
import { DataGrid ,GridToolbar ,GridCellModes  } from '@mui/x-data-grid';
import React ,{useState,useEffect }  from 'react'
import { Grid, Button,Breadcrumbs,Link,Typography,
  Snackbar, Alert,CircularProgress,Backdrop} from '@mui/material';
import axiosInstance from 'hooks/useAuthTokenUrl';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { GRID_CHECKBOX_SELECTION_COL_DEF } from '@mui/x-data-grid';
import { useNavigate } from "react-router-dom";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DownloadIcon from '@mui/icons-material/Download';
import './approveMarkBeneficiary.css'

function ApproveMarkNSAPBeneficiaryGP() {
  const [getAllDistrict, setAllDistrict] = useState([])
  const [selectedRows, setSelectedRows] = useState([]);
  const [snackbar, setSnackbar] = React.useState(null);
  const handleCloseSnackbar = () => setSnackbar(null);
  const [loading, setLoading] = useState(false);
  const [stateCap, setStateCap] = useState('');
  const navigate = useNavigate();
  const [districtName, setDistrictName] = useState('');
  const [gpNameData, setgpNameData] = useState('');
  

  function setSubmitValue(){ 
    //setSubmitFinalValue('true')
  }

  const handleChangeVer = (value,rowId) => {
      setAllDistrict((prevRows) =>
          prevRows.map((row) =>
            row.gpCode === rowId
              ? { ...row, ['aadharVerify']: value }
              : row
          )
        );
      };

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
            const findAllLabelData = '/approve-mark-nsap-beneficiary/getApproveMarkNSAPBeneficiaryForGP/' + localStorage.getItem('gpId');
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
            const gpNameData = '/approve-mark-nsap-beneficiary/getGPData/' + localStorage.getItem('gpId');
          const response = await axiosInstance.get(gpNameData);  
          setgpNameData(response.data);
        } catch (error) {
          console.error('Error fetching data :', error);
        }
      };


      const handleDataForGP = (gpCode) => {
        //alert(' gp wala  -- '+gpCode)
        localStorage.setItem("subDistId", localStorage.getItem('gpId'));
        localStorage.setItem("gramId", gpCode);
        navigate('/verification/approveMarkNSAPBeneficiaryLevelData');
      };

      const backItem = () => {
        localStorage.setItem('subDistId', '');
        navigate('/verification/approveMarkNSAPBeneficiarySubDis/');
      };
      
      async function downloadDataGP(distrcitCode,subDistrcitCode,gpId) {
        try {
          //alert(distrcitCode + " - "+" - "+subDistrcitCode+"  - "+gpId);
          const postUrl = '/approve-mark-nsap-beneficiary/downloadDataForDistrict/'+distrcitCode+"/"+subDistrcitCode+"/"+gpId;
          setLoading(true);
          const response = await axiosInstance.post(postUrl, {}, { responseType: 'blob' });
      
          const pdfBlob = new Blob([response.data], { type: 'application/pdf' });
      
          const currentDate =
               new Date().toISOString().slice(8, 10) + '-' + new Date().toISOString().slice(5, 7) + '-' + new Date().toISOString().slice(0, 4);
          const link = document.createElement('a');
          link.href = window.URL.createObjectURL(pdfBlob);
          link.download = `Mark_NSAP_Beneficiary_${currentDate}.pdf`;
          link.click();
      
        } catch (e) {
          console.log('error: ', e);
        }
         finally{
           setLoading(false);
         }
      }

 
  useEffect(() => {
    getLabelData();getLabelFirstData();getDistrictNameData();getGPNameData();
  }, []);

  const columns = [
    {
      field: 'serialNumber',
      headerName: 'Sr No',
      width: '56',
      editable: false,
      disableColumnMenu: true,
    },
   {
    field: 'gpName',
    headerName: 'GP Name',
    flex:1,
    disableColumnMenu: true,
    renderCell: (params) => (
        <a title='Click' href={`#`} 
          style={{color: '#007bff', textDecoration: 'underline', cursor: 'pointer', }}
          onClick={(e) => {
          e.preventDefault(); handleDataForGP(params.row.gpCode); }} >
          {params.value} 
        </a>
      ),
  },
  {
    field: 'area',
    headerName: 'Area',
    flex:1,
    editable: false,
    disableColumnMenu: true,
  },
  {
    field: 'totalBeneficiary',
    headerName: 'Total Beneficiary',
    flex:1,
    editable: false,
    disableColumnMenu: true,
  } ,
  {
    field: 'pendingForApproval',
    headerName: 'Pending For Approval',
    flex:1,
    editable: false,
    disableColumnMenu: true,
    renderCell: (params) => {
        if (params.value > 0) {
          return (
            <a title='Download'
            href={`#`}
              style={{ color: 'blue', textDecoration: 'none', cursor: 'pointer', }} 
              onClick={(e) => {
                e.preventDefault(); downloadDataGP(params.row.districtCode,params.row.subDistrictCode,params.row.gpCode); }}>
              <b>{params.value} <DownloadIcon style={{ marginLeft: '-6px', verticalAlign: 'middle',fontSize:'19px' }}/></b>
            </a>
          );
        } else {
          return params.value;
        }
      },
  } ,
  {
    field: 'approved',
    headerName: 'Approved',
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
            if (updatedRow.gpCode?.trim() === '') {
              reject(new Error("Error: District Name can't be empty."));
            } else {
              resolve({ ...updatedRow , gpCode: updatedRow .gpCode?.toUpperCase() });
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
      if (selectedDistrictId === null || selectedAreaId === null || selectedSubDistrictId === null || selectedGramPanchyat===null) {
        //alert("District |Area |Sub District |GP are mandatory.");
        }
        else{
      try {     
          var location={ stateID:selectedStateId, districtID:selectedDistrictId, area:selectedAreaId, subDistID:selectedSubDistrictId, gpID:selectedGramPanchyat};
          var body={...location};
        const getUrl=`/mark-nsap-beneficiary/getMarkNSAPBeneficiary`;
        setLoading(true);
        const response = await axiosInstance.post(getUrl,JSON.stringify(body));
        if (response.status >= 200 && response.status < 300) {
          return response.data
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
      id: item.gpCode,
      serialNumber: index + 1,
      gpCode: item.gpCode,
      gpName: item.gpName,
      districtCode: item.districtCode,
      subDistrictCode:item.subDistrictCode,
      totalBeneficiary: item.totalBeneficiary,
      pendingForApproval: item.pendingForApproval,
      approved: item.approved,
      area: item.area,      
    }));
    const processRowUpdate = React.useCallback(
      async (updatedRow) => {
        try {
          const updatedRowData = await mutateRow(updatedRow);
          setAllDistrict((prevRows) => {
            const rowIndex = prevRows.findIndex((row) => row.gpCode === updatedRowData.gpCode);
            const updatedRows = [...prevRows];
            handleChangeVer(true,updatedRowData.sanctionData);
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
        setSnackbar({ children: 'Please checked at least one checkbox where Pending For Approval count available.', severity: 'error' });
        return;
      }
      const selectedData = getAllDistrict.filter(
        (row) => selectedRows.indexOf(row.gpCode) !== -1
      );

      const updatedData1=await processRowUpdate(selectedData);
      console.log('updated Row status : ', JSON.stringify(selectedData));  
      
      try {
        const body={updatedData1};
        const apiUrl = '/approve-mark-nsap-beneficiary/saveApproveMarkNSAPBeneficiaryGP'; 
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
  <kbd className="responsive-kbd" style={{fontSize:'13px'}}>Sub-District Name: {gpNameData}</kbd>
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
         
      <DataGrid checkboxSelection disableRowSelectionOnClick getRowId={(row) => row.gpCode} 
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
              <Button type="submit" variant="contained" color="secondary" onClick={() => {setSubmitValue()}} style={{marginTop:'5px'}} title='Submit'>APPROVE</Button>
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
export default ApproveMarkNSAPBeneficiaryGP