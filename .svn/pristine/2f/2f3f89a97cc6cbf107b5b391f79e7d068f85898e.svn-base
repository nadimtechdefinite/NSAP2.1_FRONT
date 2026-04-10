import MainCard from 'ui-component/cards/MainCard';
import { DataGrid ,GridToolbar ,GridCellModes  } from '@mui/x-data-grid';
import React ,{useState,useEffect }  from 'react'
import { Grid, Button,FormControl,Snackbar, Alert,CircularProgress,Backdrop,InputLabel,Select,MenuItem,Divider,Chip,FormHelperText, Typography} from '@mui/material';
import axiosInstance from 'hooks/useAuthTokenUrl';
import StateList from 'components/form_components/StateList';
import DistrictList from 'components/form_components/DistrictList';
import  '../../../components/verification/mark-nsap-beneficiary/approveMarkBeneficiary.css';
import '../../verification/aadharConsentUpdation/aadharConsent.css'
import SearchComponent from 'components/common/SearchTypeCommon';
import DownloadIcon from '@mui/icons-material/Download';
import { useNavigate } from "react-router-dom";
import messages_en from '../../../components/common/messages_en.json';

function PfmsPaymentFailedDetails() {
  const [getAllDistrict, setAllDistrict] = useState([])
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectedStateId, setSelectedState] = useState('');
  const [snackbar, setSnackbar] = React.useState(null);
  const handleCloseSnackbar = () => setSnackbar(null);
  const [loading, setLoading] = useState(false);
  const [selectedDistrictId, setSelectedDistrict] = useState(null);
  const [schemeData, setSchemeData] = useState([]);
  const [selectScheme, setSelectScheme] = useState('');
  const [yearAndMonth, setYearAndMonth] = useState([]);
  const [selectMonth, setSelectMonth] = useState('');
  const [selectIntialial, setSelectIntialial] = useState('false');
  //const [selectGrandTotal, setSelectGrandTotal] = useState();
  const [formErrors, setFormErrors] = useState({});

  const [selectSearch, setSelectSearch] = useState('');
  const navigate = useNavigate();

  function cancelValue(){
     navigate('/nsap/dashboard/default');
   }


      const getSchemeData = async () => {
        try {
          const getStateData = '/contact-no-abstract/getSchemeData';
          setLoading(true);
          const response = await axiosInstance.get(getStateData);  
          setSchemeData(response.data);
        } catch (error) {
          console.error('Error fetching data :', error);
        }
        finally{
          setLoading(false);
        }
      };
 

    const yearAndMonthData = async (disCode,schemeCode) => {
        try {
          const getYearAndMonthData = '/pfms-payment-failed-details/getYearAndMonthData/'+disCode+"/"+schemeCode;
          setLoading(true);
          const response = await axiosInstance.get(getYearAndMonthData);  
          setYearAndMonth(response.data);
        } catch (error) {
          console.error('Error fetching data :', error);
        }
        finally{
          setLoading(false);
        }
      }
      //console.log("-- "+selectMonth);

      const getDataDownloadInExcel = async (selectedStateId,selectedDistrictId,selectScheme,selectMonth) => {
        //alert(selectedStateId+" - "+selectedDistrictId+" - "+selectScheme+" - "+selectMonth);
        event.preventDefault();
        const body = { stateCode: selectedStateId, districtCode: selectedDistrictId,schemeCode:selectScheme,monthCode:selectMonth };
        try {
           setLoading(true);
           var urlData="/pfms-payment-failed-details/getDataDownloadInExcel";
           const response = await axiosInstance.post(urlData, body, {
               responseType: 'blob', 
           });

           if (response.status == 204) {
               // alert("No Data Available");
               setSnackbar({ children: 'No Data Available', severity: 'error' });
               return false;
           }

           const blob = new Blob([response.data], { type: 'application/octet-stream' });
           const link = document.createElement('a');
           link.href = window.URL.createObjectURL(blob);
           var title='PFMS-Payment Failed Details';
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

   async function downloadBasedOnSearch(optionData){
    //alert(optionData.sanctionOrderNo +" - "+optionData.pfmsCode+ " - "+optionData.aadharNo);
    try{
      const body = { sanctionOrderNo: optionData.sanctionOrderNo,pfmsCode: optionData.pfmsCode,aadharNo: optionData.aadharNo, };
      setLoading(true);
      var urlData="/pfms-payment-failed-details/getDataDownloadInExcel";
      const response = await axiosInstance.post(urlData, body, {
          responseType: 'blob', 
      });

      if (response.status == 204) {
          // alert("No Data Available");
          setSnackbar({ children: 'No Data Available', severity: 'error' });
          return false;
      }

      const blob = new Blob([response.data], { type: 'application/octet-stream' });
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      var title='PFMS-Payment Failed Details';
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


   const options = {
    "sanctionOrderNo": "Sanction Order No",
    "pfmsCode": "PFMS Code",
    "aadharNo": "Aadhar",
  };
  const [optionValues, setOptionValues] = useState(null);
  const handleSearchOptionValuesChange = (newOptionValues) => {
        setOptionValues(newOptionValues);
      };
      //console.log(optionValues);

  useEffect(() => {
    getSchemeData();
  }, []);

  const columnsOne = [
    {
      field: 'serialNumber',
      headerName: 'Sr No',
      width: '42',
      editable: false,
      disableColumnMenu: true,
    },

    {
      field: 'districtNameOne',
      headerName: 'District',
     flex:1,
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
      field: 'applicantName',
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
      field: 'pfmsCode',
      headerName: 'PFMS Code',
      flex:1,
      editable: false,
      disableColumnMenu: true,
    },
    {
      field: 'paybleUpTo',
      headerName: 'Disbursed Month and Year',
      flex:1,
      editable: false,
      disableColumnMenu: true,
    },
    {
      field: 'schemeCode',
      headerName: 'Scheme Code',
      flex:1,
      editable: false,
      disableColumnMenu: true,
    },

    {
      field: 'bankAccountNo',
      headerName: 'Bank/PO AC/No(At the time of Disbursement)',
      flex:1,
      editable: false,
      disableColumnMenu: true,
    },
    {
      field: 'ifscCode',
      headerName: 'IFSC Code (At the time of Disbursement)',
      flex:1,
      editable: false,
      disableColumnMenu: true,
    },

    {
      field: 'disbursementMode',
      headerName: 'DBT Mode',
      flex:1,
      editable: false,
      disableColumnMenu: true,
    },

    {
      field: 'pfmsBankAccountNo',
      headerName: 'Bank/PO AC/No(Registered PFMS)',
      flex:1,
      editable: false,
      disableColumnMenu: true,
    },
    {
      field: 'pfmsIfscCode',
      headerName: 'IFSC Code (Registered PFMS)',
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
      field: 'reasonForPaymentFail',
      headerName: 'Reason for Payment fail',
      flex:1,
      editable: false,
      disableColumnMenu: true,
    }, 
  ];
  
  const columnsTwo = [
    {
      field: 'serialNumber',
      headerName: 'Sr No',
      width: '300',
      editable: false,
      disableColumnMenu: true,
    },
    
      {
        field: 'districtName',
        headerName: 'District',
        width: '500',
        editable: false,
        disableColumnMenu: true,
      },
      {
        field: 'count',
        headerName: 'Rejected Pensioners',
        width: '500',
        editable: false,
        disableColumnMenu: true,

        renderCell: (params) => {
          const count = params.value || 0;
          const districtCode = params.row.districtCode;
          if (count === 0 || count === "0") {
            return <span style={{ color: 'red' }}> <b>{count} </b></span>;
          } 
          else if(districtCode==='GRAND TOTAL'){
          <b>{count}</b>
          }
          else {
            return (
              <a title='Download' href={`#`}
                style={{ color: '#007bff', textDecoration: 'underline', cursor: 'pointer' }}
                onClick={(e) => {
                  e.preventDefault(); getDataDownloadInExcel(selectedStateId,districtCode,selectScheme,selectMonth); }}>
                <b>{count}</b>
              </a>
            );
          }
        },

      },

      {
        field: 'districtCode',
        headerName: 'District code',
        width: '0',
        editable: false,
        disableColumnMenu: true,
        renderHeader: () => null, 
        renderCell: () => null, 
      },
    
  ];

  const validateForm = () => {
    const errors = {};
    
    if( ((optionValues.sanctionOrderNo ===null && optionValues.pfmsCode ===null && optionValues.aadharNo ===null) &&  !selectScheme)) 
      {
    errors.selectScheme = messages_en.schemeRequired;
    }

    if(((optionValues.sanctionOrderNo ===null && optionValues.pfmsCode ===null && optionValues.aadharNo ===null) &&  !selectMonth)) 
      {
    errors.selectMonth ="Month and Year are mandatory.";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0; 
  };

const [columnCondition, setColumnCondition] = useState(null);
var selectedColumns =  columnCondition==='colOne' ? columnsOne : columnsTwo;

  const handleSelectState = (state) => {
    setSelectedState(state);
  };
  
  const handleSelectDistrict = (selectedDistrictId) => {
    setSelectedDistrict(selectedDistrictId);
  };
 
  const handleClickOpen = (e) => {
    e.preventDefault();
    fetchData()
    .then((res) =>  {if (res) {
      const districtData = res || [];
      setAllDistrict(districtData);
     // console.log(res);
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

      if(selectScheme === null  || selectScheme === "" || selectMonth===null || selectMonth===""){
        setColumnCondition('colOne');
        setSelectSearch("show");
      }
      else if(selectScheme !== null  && selectScheme !== "" && selectMonth !==null && selectMonth !=="" && optionValues.sanctionOrderNo !==null){
        setColumnCondition('colOne');
        setSelectSearch("show");
      }
      else if(selectScheme !== null  && selectScheme !== "" && selectMonth !==null && selectMonth !=="" && optionValues.pfmsCode !==null){
        setColumnCondition('colOne');
        setSelectSearch("show");
      }
      else if(selectScheme !== null  && selectScheme !== "" && selectMonth !==null && selectMonth !=="" && optionValues.aadharNo !==null){
        setColumnCondition('colOne');
        setSelectSearch("show");
      }
      else{
        setColumnCondition('colTwo');
        setSelectSearch("hide");
      }
      
     const isFormValid = validateForm();
      if (isFormValid) {
      try {     
          var location={ stateCode:selectedStateId, districtCode:selectedDistrictId, schemeCode:selectScheme,monthCode:selectMonth};
          var body={...optionValues,...location};
        const getUrl=`/pfms-payment-failed-details/getPfmsPaymentFailedDetails`;
        setLoading(true);
        const response = await axiosInstance.post(getUrl,JSON.stringify(body));
        if (response.status >= 200 && response.status < 300) {
          // if( optionValues.sanctionOrderNo ===null && optionValues.pfmsCode ===null && optionValues.aadharNo ===null ) {
          //   //alert("-- "+response.data.length  );
          //   const lastObject = response.data[response.data.length - 1];
          //   setSelectGrandTotal(lastObject.grandTotal);
          // }
          if(response.data.length ==0){
            setSelectIntialial('true');
          }else{
            setSelectIntialial('false');
          }
          return response.data
        } else {
        
          return false;
        }
    } catch (error) {
      if(error.response.data.sanctionOrderNo){
        setSnackbar({ children: error.response.data.sanctionOrderNo, severity: 'error' });
      }
      else if(error.response.data.aadharNo){
        setSnackbar({ children: error.response.data.aadharNo, severity: 'error' });
      }
      else if(error.response.data.pfmsCode){
        setSnackbar({ children: error.response.data.pfmsCode, severity: 'error' });
      }
      else{
        //setSnackbar({ children: "No Data Found", severity: 'error' });
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
   
    const rows = getAllDistrict.map((item,index) => ({
      id: item + 1,
      serialNumber: index + 1,
      count: item.count,
      districtName: item.districtName,
      districtCode: item.districtCode,
      sanctionOrderNo:item.sanctionOrderNo,
      pfmsCode:item.pfmsCode,
      aadharNo:item.aadharNo,
      fatherHusbandName:item.fatherHusbandName,
      applicantName:item.applicantName,
      districtNameOne: item.districtNameOne,
      paybleUpTo:item.paybleUpTo,
      schemeCode:item.schemeCode,
      bankAccountNo:item.bankAccountNo,
      ifscCode:item.ifscCode,

      disbursementMode:item.disbursementMode,
      pfmsBankAccountNo:item.pfmsBankAccountNo,
      pfmsIfscCode:item.pfmsIfscCode,

      paymentMode:item.paymentMode,
      reasonForPaymentFail:item.reasonForPaymentFail,
    }));
    const processRowUpdate = React.useCallback(
      async (updatedRow) => {
        try {
          const updatedRowData = await mutateRow(updatedRow);
          setAllDistrict((prevRows) => {
            const rowIndex = prevRows.findIndex((row) => row.id === updatedRowData.districtCode);
            const updatedRows = [...prevRows];
            handleChangeVer(true,updatedRowData.sanctionData);
            updatedRows[rowIndex] = {
                   ...updatedRows[rowIndex]
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

     <MainCard title="PFMS-Payment Failed Details">
     
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
      <InputLabel id="scheme-name">Scheme Name <span style={{ color: 'red' }}>*</span></InputLabel>
      <Select
        labelId="scheme-name"
        id="schemeCode"
        label="Scheme Name"
        name="schemeCode"
        onChange={(event) => {
            const selectedScheme = event.target.value; 
            setSelectScheme(selectedScheme); 
            yearAndMonthData(selectedDistrictId,selectedScheme); 
          }}
        >
    {schemeData.map((item) => (
  <MenuItem key={item.schemeCode} value={item.schemeCode}>
      {item.schemeName}
    </MenuItem>
    ))}
      </Select>

      {formErrors.selectScheme && (
<FormHelperText>
<Typography style={{ color: 'red', fontSize: '0.8rem' }}>{formErrors.selectScheme}</Typography>
</FormHelperText>
)} 
    </FormControl>
    </Grid>

    <Grid item xs={12} sm={3}>
              <FormControl fullWidth> 
      <InputLabel id="month-name">Pension Amount Payable Up To  <span style={{ color: 'red' }}>*</span></InputLabel>
      <Select
        labelId="month-name"
        id="monthCode"
        label="month Name"
        name="monthCode"
        onChange={(event) => setSelectMonth(event.target.value)} >
            <MenuItem value='0'>--Select Month,Year--</MenuItem>
    {yearAndMonth.map((item) => (
  <MenuItem key={item.payableMonth+"-"+item.payableYear} value={item.payableMonth+"-"+item.payableYear}>
      {item.payableMonth}  {item.payableYear}
    </MenuItem>
    ))}
      </Select>
      {formErrors.selectMonth && (
<FormHelperText>
<Typography style={{ color: 'red', fontSize: '0.8rem' }}>{formErrors.selectMonth}</Typography>
</FormHelperText>
)} 
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

      {getAllDistrict.length>0   ? (
        <>
        <form  onSubmit={handleFormSubmit}>
         <MainCard >
      {/* {optionValues.sanctionOrderNo !==null || optionValues.pfmsCode !==null || optionValues.aadharNo !==null ?  
      <Button title="Download Excel " variant="contained" color="primary"  style={{marginLeft:'1379px',marginTop:'-24px'}} 
      onClick={(e) => { e.preventDefault(); downloadBasedOnSearch(optionValues); }} >Download Excel &nbsp;
      
      <DownloadIcon style={{ marginLeft: '-6px', verticalAlign: 'middle',fontSize:'19px' }}/></Button>: 
        <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap'   }}>
        <kbd className="responsive-kbd">Scheme Name : {selectScheme}</kbd>
        <kbd className="responsive-kbd">Disbursement Month and Year : {selectMonth}</kbd>
        </div> 
        } */}

{selectSearch==='show' ?  
      <Button title="Download Excel " variant="contained" color="info"  style={{marginLeft:'1389px',marginTop:'-24px'}} 
      onClick={(e) => { e.preventDefault(); downloadBasedOnSearch(optionValues); }} >Download Excel &nbsp;
      
      <DownloadIcon style={{ marginLeft: '-6px', verticalAlign: 'middle',fontSize:'19px' }}/></Button>: 
        <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap'   }}>
        <kbd className="responsive-kbd">Scheme Name : {selectScheme}</kbd>
        <kbd className="responsive-kbd">Disbursement Month and Year : {selectMonth}</kbd>
        </div> 
        }

      <DataGrid  disableRowSelectionOnClick getRowId={(row) => row.districtCode} 
        slots={{ toolbar: GridToolbar}}
      slotProps={{
          toolbar: {
            showQuickFilter: true,
            printOptions: { disableToolbarButton: true } ,
          },
        }}
         columns={selectedColumns}
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
        pageSizeOptions={[15]} /> 
         {/* <span style={{backgroundColor:'azure'}}> <b><u>GRAND TOTAL</u></b> : <b>{selectGrandTotal}</b> </span> */}
    </MainCard>
   
    </form>
    </>
    ):(
      <div><br/>
       {selectIntialial ==='true' ? 
      <span style={{color:'red'}}><b>No Data Found.</b></span> :''
        }
      </div>
    )}
    </div>
  );
}
export default PfmsPaymentFailedDetails
