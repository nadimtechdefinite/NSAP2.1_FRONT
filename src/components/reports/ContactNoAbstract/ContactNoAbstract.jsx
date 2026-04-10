import MainCard from 'ui-component/cards/MainCard';
import { DataGrid ,GridToolbar ,GridCellModes  } from '@mui/x-data-grid';
import React ,{useState,useEffect }  from 'react'
import { Grid, Button,FormControl,Snackbar, Alert,CircularProgress,Backdrop,InputLabel,Select,MenuItem,FormHelperText, Typography} from '@mui/material';
import axiosInstance from 'hooks/useAuthTokenUrl';
import StateList from 'components/form_components/StateList';
import DistrictList from 'components/form_components/DistrictList';
import SubDistrictList from 'components/form_components/SubDistrictList';
import GramPanchayatList from 'components/form_components/GramPanchayatList';
import AreaList from 'components/form_components/AreaList';
import { GRID_CHECKBOX_SELECTION_COL_DEF } from '@mui/x-data-grid';
import  '../../../components/verification/mark-nsap-beneficiary/approveMarkBeneficiary.css';
import Alert1 from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import '../../verification/aadharConsentUpdation/aadharConsent.css'
import messages_en from '../../../components/common/messages_en.json';
import { useNavigate } from "react-router-dom";
import DownloadIcon from '@mui/icons-material/Download';

function ContactNoAbstract() {
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
  const [schemeData, setSchemeData] = useState([]);
  const [selectScheme, setSelectScheme] = useState('');
  const [formErrors, setFormErrors] = useState({});

  const [ar, setAr] = useState('');
  const [sc, setSc] = useState('');

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

      const downloadDataInExcel = async (stateCode,districtCode, areaCode,subDisCode, gpCode,schemeCode,type) => {
        event.preventDefault();
        const body = { stateCode: stateCode, districtCode: districtCode, area: areaCode, subDistrictMunicipalCode: subDisCode,gramPanchayatWardCode:gpCode,schemeCode:schemeCode,type:type };
        try {
           setLoading(true);
           var urlData="/contact-no-abstract/getContactNoAbstractInExcel";
           const response = await axiosInstance.post(urlData, body, {
               responseType: 'blob', // specify responseType as 'blob' for binary data
           });

           if (response.status == 204) {
               // alert("No Data Available");
               setSnackbar({ children: 'No Data Available', severity: 'error' });
               return false;
           }

           const blob = new Blob([response.data], { type: 'application/octet-stream' });
           const link = document.createElement('a');
           link.href = window.URL.createObjectURL(blob);
           var title='Contact_No_Abstract';
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
    getSchemeData();
  }, []);

  const columns = [
    {
      field: 'serialNumber',
      headerName: 'Sr No',
      width: '500',
      editable: false,
      disableColumnMenu: true,
      headerClassName:'bkColr',
    },
{
    field: 'totalMobile',
    headerName: 'Mobile No',
    width: '524',
    editable: false,
    headerClassName:'bkColr',
    disableColumnMenu: true,
    // renderCell: (params) => (
    //     <a title='Download' href={`#`} 
    //       style={{color: '#007bff', textDecoration: 'underline', cursor: 'pointer', }}
    //       onClick={(e) => {
    //       e.preventDefault(); downloadDataInExcel(selectedStateId,selectedDistrictId,selectedAreaId,selectedSubDistrictId,selectedGramPanchyat,selectScheme,"mobile"); }}>
    //       <b>{params.value}</b>
    //     </a>
    //   ),
    renderCell: (params) => {
      const count = params.value || 0;
      if (count === 0 || count === "0") {
        return <span style={{ color: 'red' }}> <b>{count} </b></span>;
      } else {
        return (
          <a title='Download' href={`#`}
            style={{ color: '#007bff', textDecoration: 'none', cursor: 'pointer' }}
            onClick={(e) => {
              e.preventDefault(); downloadDataInExcel(selectedStateId,selectedDistrictId,selectedAreaId,selectedSubDistrictId,selectedGramPanchyat,selectScheme,"mobile"); }}>
            <b>{count} <DownloadIcon style={{ marginLeft: '-6px', verticalAlign: 'middle',fontSize:'19px' }}/></b>
          </a>
        );
      }
    },
  },

{
    field: 'totalNonMobile',
    headerName: 'Non-Mobile No',
    width: '524',
    editable: false,
    headerClassName:'bkColr',
    disableColumnMenu: true,
    // renderCell: (params) => (
    //     <a title='Download' href={`#`} 
    //       style={{color: '#007bff', textDecoration: 'underline', cursor: 'pointer', }}
    //       onClick={(e) => {
    //       e.preventDefault(); downloadDataInExcel(selectedStateId,selectedDistrictId,selectedAreaId,selectedSubDistrictId,selectedGramPanchyat,selectScheme,"nonmobile"); }}>
    //      <b> {params.value}</b>
    //     </a>
    //   ),  
    renderCell: (params) => {
      const count = params.value || 0;
      if (count === 0 || count === "0") {
        return <span style={{ color: 'red' }}> <b>{count} </b></span>;
      } else {
        return (
          <a title='Download' href={`#`}
            style={{ color: '#007bff', textDecoration: 'none', cursor: 'pointer' }}
            onClick={(e) => {
              e.preventDefault(); downloadDataInExcel(selectedStateId,selectedDistrictId,selectedAreaId,selectedSubDistrictId,selectedGramPanchyat,selectScheme,"nonmobile"); }}>
            <b>{count} <DownloadIcon style={{ marginLeft: '-6px', verticalAlign: 'middle',fontSize:'19px' }}/></b>
          </a>
        );
      }
    },
},
];

const validateForm = () => {
  const errors = {};
  if(!selectedDistrictId) 
    {
  errors.selectedDistrictId = messages_en.districtRequired;
  }
  if(!selectScheme) 
    {
  errors.selectScheme = messages_en.schemeRequired;
  } 
  setFormErrors(errors);
  return Object.keys(errors).length === 0; 
};

const columnsWithCheckbox = React.useMemo(
  () => [
    ...columns, 
    {
      ...GRID_CHECKBOX_SELECTION_COL_DEF,
    },
  ],
  [columns]
);

  const handleSelectState = (state) => {
    setSelectedState(state);
  };
  
  const handleSelectDistrict = (selectedDistrictId) => {
    setSelectedDistrict(selectedDistrictId);
    setSelectedArea(null);
    setSelectedSubDistrict(null);
    setSelectedGramPanchyat(null);
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
  }

  const handleSelectSubDistrict = (selectedSubDistrictId) => {
    setSelectedSubDistrict(selectedSubDistrictId);
    setSelectedGramPanchyat(null);
  };

  const handleGramPanchyat = (selectedGramPanchyat) => {
    setSelectedGramPanchyat(selectedGramPanchyat);
  };
 
  const handleClickOpen = (e) => {
    e.preventDefault();
    fetchData()
    .then((res) =>  {if (res) {
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
     
      // if ( (selectedDistrictId === null || selectScheme === null  || selectScheme === "")) { 
      // alert("District |Scheme Name are mandatory.");
      // }
      // else{
      const isFormValid = validateForm();
      if (isFormValid) {
      try {     
          var location={ stateID:selectedStateId, districtID:selectedDistrictId, area:selectedAreaId, subDistID:selectedSubDistrictId, gpID:selectedGramPanchyat,schemeCode:selectScheme};
          var body={...location};
        const getUrl=`/contact-no-abstract/getContactNoAbstract`;
        setLoading(true);
        const response = await axiosInstance.post(getUrl,JSON.stringify(body));
        if (response.status >= 200 && response.status < 300) {
          setAr(response.data[0].area);
          setSc(response.data[0].schemeCode);
          return response.data;
        } else {
        
          return false;
        }
    } catch (error) {
      if(error.response.data.id){
        setSnackbar({ children: error.response.data.id, severity: 'error' });
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
   
    const rows = getAllDistrict.map((item,index) => ({
      id: item.index + 1,
      serialNumber: index + 1,
      totalMobile: item.totalMobile,
      totalNonMobile: item.totalNonMobile,
    }));
    const processRowUpdate = React.useCallback(
      async (updatedRow) => {
        try {
          const updatedRowData = await mutateRow(updatedRow);
          setAllDistrict((prevRows) => {
            const rowIndex = prevRows.findIndex((row) => row.id === updatedRowData.id);
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

     {/* <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb" style={{ marginBottom: '20px' }}>
          <Link color="inherit" href="#" style={{color:'blue'}} title='Home'>
            Home
          </Link>
          <Link color="inherit" href="#" style={{color:'blue'}} title='Verification'>
          Reports
          </Link>
          <Typography color="textInfo" title='Contact No. Abstract'>Contact No. Abstract</Typography>
        </Breadcrumbs> */}
     <MainCard title="Total Beneficiaries Mobile No and Non Mobile No">
     
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
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <SubDistrictList selectedAreaId={selectedAreaId} selectedDistrictId={selectedDistrictId} setSelectedSubDistrict={setSelectedSubDistrict} onSelectSubDistrict={handleSelectSubDistrict}  />
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <GramPanchayatList selectedSubDistrictMunicipalAreaId={selectedSubDistrictId} setSelectedGramPanchayat={setSelectedGramPanchyat} onSelectGramPanchayat={handleGramPanchyat} />
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth> 
      <InputLabel id="scheme-name">Scheme Name <span style={{ color: 'red' }}>*</span></InputLabel>
      <Select
        labelId="scheme-name"
        id="schemeCode"
        label="Scheme Name"
        name="schemeCode"
        onChange={(event) => (setSelectScheme(event.target.value),
          setFormErrors((prevErrors) => {
            const updatedErrors = { ...prevErrors };
            delete updatedErrors.selectScheme;
            return updatedErrors;
        }))
        } >
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
            
      <Grid item xs={12} alignItems="center">
              <Button type="submit" variant="contained" color="secondary" title='Submit'>Submit</Button> &nbsp;
              <Button variant="contained" color="primary" onClick={() => {cancelValue()}} title='Close'>Close</Button>
            </Grid>
             
      </Grid>
        </form>

      </MainCard>

      {getAllDistrict.length>0  ? (
        <>
        <form  onSubmit={handleFormSubmit}>
         <MainCard >
        <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap'}}>
        <kbd style={{fontSize:'14px'}} className="responsive-kbd">Area :  {ar ==='R' ? 'Rural' :(ar === 'U' ? 'Urban' : 'Both') }</kbd>
        <kbd style={{fontSize:'14px'}} className="responsive-kbd">Scheme Name : {sc}</kbd>
        </div>

      <DataGrid  disableRowSelectionOnClick getRowId={(row) => row.id} 
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
    </MainCard>
    <Stack sx={{ width: '100%' }} spacing={2}>
    <Alert1 variant="filled" severity="warning" className={'blinking' } style={{color:'red'}}>Note: This report include only <b style={{color:'blue'}}>SO_SAVED</b> beneficiary data.</Alert1>
    </Stack>
    </form>
    </>
    ):(
      <div>
      </div>
    )}
    </div>
  );
}
export default ContactNoAbstract
