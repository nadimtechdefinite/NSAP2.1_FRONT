import React ,{useState,useEffect }  from 'react'
import { Grid, Button,FormControl,Snackbar, Alert,CircularProgress,Backdrop,InputLabel,Select,MenuItem,Link} from '@mui/material';
import MainCard from 'ui-component/cards/MainCard';
import StateList from 'components/form_components/StateList';
import DistrictList from 'components/form_components/DistrictList';
import SubDistrictList from 'components/form_components/SubDistrictList';
import AreaList from 'components/form_components/AreaList';
import axiosInstance from 'hooks/useAuthTokenUrl';
import { TableContainer, Table, TableHead, TableBody,TableFooter, TableRow, TableCell,  Paper,FormHelperText,Typography } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import messages_en from '../../../components/common/messages_en.json';

import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

function MigrationLogReport() {
    const [snackbar, setSnackbar] = React.useState(null);
    const handleCloseSnackbar = () => setSnackbar(null);
    const [loading, setLoading] = useState(false);
    const [selectedDistrictId, setSelectedDistrict] = useState(null);
    const [selectedAreaId, setSelectedArea] = useState(null);
    const [selectedSubDistrictId, setSelectedSubDistrict] = useState(null);
    const [selectedStateId, setSelectedState] = useState('');
    const [schemeData, setSchemeData] = useState([]);
    const [selectFromScheme, setFromScheme] = useState('');
    const [selectToScheme, setToScheme] = useState('');
    const [finYear, setFinYear] = useState([]);
    const [selectedFinYear, setSelectedFinYear] = useState(0);
    const [migrationData, setMigrationData] = useState([]);
    const [formErrors, setFormErrors] = useState({});

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
      const getFinYear = async () => {
        try {
            setLoading(true);
            const response = await axiosInstance.get("/migrationLog/findAllFinYearData");
            // console.log(JSON.stringify(response.data));
            const newData = response.data.map((row) => ({ ...row, id: row.finYearCode }));
            setFinYear(newData);
            // console.log(JSON.stringify(response.data));
        }
        catch (error) {
            setSnackbar({ children: 'Some Internal Error Occured While Getting Finance Years', severity: 'error' });
            console.error('Error fetching Finance Years', error)
        }
        finally {
            setLoading(false);
        }
    }
      useEffect(() => {
        getSchemeData();
      }, []);
      useEffect(() => {
        getFinYear();
    }, [])

  
    const handleFinYearChange = (event) => {
        if (event.target.value !== 0) {
            setSelectedFinYear(event.target.value)
            setFormErrors((prevErrors) => {
              const updatedErrors = { ...prevErrors };
              delete updatedErrors.selectedFinYear;
              return updatedErrors;
          });
        }
        else {
            setSelectedFinYear(null);
        }
    }
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
    
      const validateForm = () => {
        const errors = {};
        if(!selectFromScheme) 
          {
        errors.selectFromScheme = messages_en.fromScheme;
        }
        if(!selectToScheme) 
          {
        errors.selectToScheme = messages_en.toScheme;
        }
        if(selectedFinYear===0) 
          {
        errors.selectedFinYear = messages_en.finYearRequired;
        }
        if(selectFromScheme===selectToScheme) 
          {
        errors.selectFromScheme = messages_en.schemeCheck;
        errors.selectToScheme = messages_en.schemeCheck;
        }
        setFormErrors(errors);
        return Object.keys(errors).length === 0; 
      };
      const fetchData = async () => {
     
        const isFormValid = validateForm();
        if (isFormValid) {
        try {     
            var location={ stateID:selectedStateId, districtID:selectedDistrictId, area:selectedAreaId, subDistID:selectedSubDistrictId, schemeFromCode:selectFromScheme,schemeToCode:selectToScheme,finyr:selectedFinYear};
            var body={...location};
          const getUrl=`/migrationLog/showMigrationDetails`;
          setLoading(true);
          const response = await axiosInstance.post(getUrl,JSON.stringify(body));
          if (response.status >= 200 && response.status < 300) {
            if(response.data.length>0){
              return response.data
            }
            else{
              setSnackbar({ children: "No Data Found", severity: 'error' });
              return false
            }
           
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
       const handleClickOpen = (e) => {
        e.preventDefault();
        fetchData()
        .then((res) =>  {if (res) {
          const data = res || [];
        //   setAllDistrict(districtData);
        setMigrationData(data);

          console.log(res);
      } else {
          setMigrationData([]);
          return false;
      }})
        .catch((e) => {
          console.log(e.message)
        })
      };
      const exportToExcel = (id) => {
        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.table_to_sheet(document.getElementById(id));
        XLSX.utils.book_append_sheet(wb, ws, id);
        const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        saveAs(new Blob([excelBuffer], { type: 'application/octet-stream' }), id + '.xlsx');
    };
    const calculateColumnSums = () => {
        let sums = {
        aprTotal: 0,
        mayTotal: 0,
        juneTotal: 0,
        julyTotal: 0,
        augTotal: 0,
        sepTotal: 0,
        octTotal: 0,
        novTotal: 0,
        decTotal: 0,
        janTotal: 0,
        febTotal: 0,
        marchTotal: 0,
        totalCount: 0
        };
    
        migrationData.forEach((item) => {
            Object.entries(item).forEach(([key, value]) => {
                if (!isNaN(parseFloat(value)) && isFinite(value)) {
                    if (key !== 'districtCode' && key !== 'stateCode' && key !=='grampanchayatCode' && key !=='subDistrictMunicipalCode') {
                        sums[key] = (sums[key] || 0) + parseFloat(value);
                    }
                }
            });
        });
        return sums;
      };
      const handleClick=async (value,key)=>{
        var location;
if(key==='d'){
   location={ stateID:selectedStateId, districtID:value, area:selectedAreaId, subDistID:selectedSubDistrictId, schemeFromCode:selectFromScheme,schemeToCode:selectToScheme,finyr:selectedFinYear};

}
else if (key==='sd'){
   location={ stateID:selectedStateId, districtID:'0', area:selectedAreaId, subDistID:value, schemeFromCode:selectFromScheme,schemeToCode:selectToScheme,finyr:selectedFinYear};

}


if ( (/* selectedDistrictId === null || */ selectFromScheme === null  || selectFromScheme === "" || selectToScheme === null  || selectToScheme === "")) { 
  alert("From Scheme and To Scheme Name are mandatory.");
  }
  else{
  try {     
      // var location={ stateID:selectedStateId, districtID:selectDis, area:selectedAreaId, subDistID:selecteSubDis, schemeFromCode:selectFromScheme,schemeToCode:selectToScheme,finyr:selectedFinYear};
      var body={...location};
    const getUrl=`/migrationLog/showMigrationDetails`;
    setLoading(true);
    const response = await axiosInstance.post(getUrl,JSON.stringify(body));
    if (response.status >= 200 && response.status < 300) {
      setMigrationData(response.data);
      return response.data
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
      const downloadDataInExcel = async ( districtCode, subDistrictCode, gpCode,mnth) => {
        const body = { districtID: districtCode, subDistID: subDistrictCode, gpId: gpCode
          ,schemeFromCode:selectFromScheme,schemeToCode:selectToScheme,finyr:selectedFinYear,mnth:mnth
         };
        try {
            setLoading(true);
            const response = await axiosInstance.post("/migrationLog/getMigrationdataInExcel", body, {
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
            link.download = `Beneficiary_Migration_data.xlsx`;
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
return(
    <div>
<MainCard title="Migration Log Report">
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
      <InputLabel id="scheme-name">From Scheme <span style={{ color: 'red' }}>*</span></InputLabel>
      <Select
        labelId="scheme-name"
        id="schemeCode"
        label="Scheme Name"
        name="schemeCode"
        onChange={(event) => (setFromScheme(event.target.value),
          setFormErrors((prevErrors) => {
            const updatedErrors = { ...prevErrors };
            delete updatedErrors.selectFromScheme;
            return updatedErrors;
        }))
        } 
      >
    {schemeData.map((item) => (
  <MenuItem key={item.schemeCode} value={item.schemeCode}>
      {item.schemeName}
    </MenuItem>
    ))}
      </Select>
      {formErrors.selectFromScheme && (
                <FormHelperText>
                <Typography style={{ color: 'red', fontSize: '0.8rem' }}>{formErrors.selectFromScheme}</Typography>
                </FormHelperText>
                  )}
    </FormControl>
    </Grid>
    <Grid item xs={12} sm={3}>
              <FormControl fullWidth> 
      <InputLabel id="scheme-nameto">To Scheme <span style={{ color: 'red' }}>*</span></InputLabel>
      <Select
        labelId="scheme-nameto"
        id="schemeCodeto"
       label="Scheme Name"
        name="To Scheme"
        onChange={(event) => (setToScheme(event.target.value),
          setFormErrors((prevErrors) => {
            const updatedErrors = { ...prevErrors };
            delete updatedErrors.selectToScheme;
            return updatedErrors;
        }))
        } >
    {schemeData.map((item) => (
  <MenuItem key={item.schemeCode} value={item.schemeCode}>
      {item.schemeName}
    </MenuItem>
    ))}
      </Select>
      {formErrors.selectToScheme && (
                <FormHelperText>
                <Typography style={{ color: 'red', fontSize: '0.8rem' }}>{formErrors.selectToScheme}</Typography>
                </FormHelperText>
                  )}
    </FormControl>
    </Grid>
    <Grid item xs={12} sm={3}>
                        <FormControl fullWidth >
                            <InputLabel id="finYear-label" style={{ display: 'flex', alignItems: 'center' }}>Financial Year <span style={{ color: 'red' }}> *</span></InputLabel>
                            <Select name="finYear" id="finYear" labelId="finYear-label" label="Financial Year"
                             onChange={handleFinYearChange}  
                             MenuProps={{ PaperProps: { style: { maxHeight: 200 } } }}>
                                {/* <MenuItem value="0">--Select Financial Year--</MenuItem> */}
                                {finYear.map((item) => (
                                    <MenuItem key={item.finyearcode} value={item.finyear}>{item.finyear}
                                    </MenuItem>
                                ))}
                            </Select>
                            {formErrors.selectedFinYear && (
                <FormHelperText>
                <Typography style={{ color: 'red', fontSize: '0.8rem' }}>{formErrors.selectedFinYear}</Typography>
                </FormHelperText>
                  )}
                        </FormControl>
                    </Grid>   
      <Grid item xs={12} alignItems="center">
              <Button type="submit" variant="contained" color="secondary" title='Submit'>Submit</Button>
            </Grid>
             
      </Grid>
        </form>
</MainCard>
{migrationData.length > 0 && ( <MainCard title="Migration Log Report">
        <div style={{ textAlign: 'left',paddingTop:'10px' }}>
                        <Button variant="contained" style={{ backgroundColor: '#8555a3' }} onClick={() => exportToExcel('Migration_log')} >
                            <DownloadIcon/> Excel
                        </Button>
                    </div>
        <div style={{ overflowX: 'auto' }}>
        <TableContainer component={Paper} style={{ maxHeight: 400, border: '1px solid #f0f0f0'  }}>
        <Table stickyHeader  sx={{ minWidth: 650 }} id='Migration_log' borderradius={1} size="small" aria-label="a dense table">
        <TableHead >
        {/* {migrationData.map((value,index) => ( */}
          <TableRow  style={{ position: 'sticky', bottom: 0, zIndex: 1000 }}>
            <TableCell style={{color:'rgb(128, 0, 128)'}}> {migrationData[0].districtCode !== null ? 'District Name' : migrationData[0].subDistrictMunicipalCode !== null? 'Sub - District Name': migrationData[0].grampanchayatCode!==null?'Gram Panchayat Name':'District Name'}</TableCell>
        
            <TableCell style={{color:'rgb(128, 0, 128)'}} align="center" >Apr</TableCell>
            <TableCell style={{color:'rgb(128, 0, 128)'}} align="center" >May</TableCell>
            <TableCell style={{color:'rgb(128, 0, 128)'}} align="center">June</TableCell>
            <TableCell style={{color:'rgb(128, 0, 128)'}} align="center" >July</TableCell>
            <TableCell style={{color:'rgb(128, 0, 128)'}} align="center" >Aug</TableCell>
            <TableCell style={{color:'rgb(128, 0, 128)'}} align="center">Sep</TableCell>
            <TableCell style={{color:'rgb(128, 0, 128)'}} align="center" >Oct</TableCell>
            <TableCell style={{color:'rgb(128, 0, 128)'}} align="center" >Nov</TableCell>
            <TableCell style={{color:'rgb(128, 0, 128)'}} align="center">Dec</TableCell>
            <TableCell style={{color:'rgb(128, 0, 128)'}} align="center" >Jan</TableCell>
            <TableCell style={{color:'rgb(128, 0, 128)'}} align="center" >Feb</TableCell>
            <TableCell style={{color:'rgb(128, 0, 128)'}} align="center">Mar</TableCell>
            <TableCell style={{color:'rgb(128, 0, 128)'}}>Total</TableCell>
          </TableRow>
          {/* ))} */}
        </TableHead>
        <TableBody>
        {/* {migrationData.map(([values]) => ( */}
            {/* <React.Fragment key={key}> */}
            {/* <TableRow key={key}   style={{ backgroundColor: '#f0f0f0' }}>
            <TableCell colSpan={14} align="center"><strong>{key}</strong></TableCell>
           
            </TableRow> */}
            {migrationData.map((value,index) => (
            <TableRow key={index} style={{ backgroundColor: 'white' }}>
            <TableCell align="left">
            {value.districtCode !== null ? (
              <Link  style={{cursor: 'pointer',textDecoration:'none'}} onClick={() => handleClick(value.districtCode,'d')}>
          {value.districtName}
          </Link>
      ) : value.subDistrictMunicipalCode !== null ? (
        <Link style={{cursor: 'pointer',textDecoration:'none'}} onClick={() => handleClick(value.subDistrictMunicipalCode,'sd')}>
          {value.subdistrictName}
        </Link>
      ) : value.grampanchayatCode !== null ? (
       value.grampanchayatName
      ) : (
        'NA'
      )}
    </TableCell>
              {/* <TableCell align="left">{value.subdistrictName}</TableCell>  */}
              <TableCell align="center">
              {value.aprTotal==='0'?value.aprTotal:(
               <Link style={{cursor: 'pointer',textDecoration:'none'}} 
              onClick={() => downloadDataInExcel(value.districtCode,value.subDistrictMunicipalCode,value.grampanchayatCode,'4')}>
          {value.aprTotal}
        </Link>
            )}
             </TableCell>
              <TableCell align="center"> 
              {value.mayTotal==='0'?value.mayTotal:(
              <Link style={{cursor: 'pointer',textDecoration:'none'}} 
              onClick={() => downloadDataInExcel(value.districtCode,value.subDistrictMunicipalCode,value.grampanchayatCode,'5')}>
          {value.mayTotal}
        </Link>)}</TableCell>
              <TableCell align="center"> 
              {value.juneTotal==='0'?value.juneTotal:(
              <Link style={{cursor: 'pointer',textDecoration:'none'}} 
              onClick={() => downloadDataInExcel(value.districtCode,value.subDistrictMunicipalCode,value.grampanchayatCode,'6')}>
         {value.juneTotal}
        </Link>)}
        </TableCell>
              <TableCell align="center"> 
              {value.julyTotal==='0'?value.julyTotal:(<Link style={{cursor: 'pointer',textDecoration:'none'}} 
              onClick={() => downloadDataInExcel(value.districtCode,value.subDistrictMunicipalCode,value.grampanchayatCode,'7')}>
          {value.julyTotal}
        </Link>)}</TableCell>
              <TableCell align="center">
              {value.augTotal==='0'?value.augTotal:( <Link style={{cursor: 'pointer',textDecoration:'none'}} 
              onClick={() => downloadDataInExcel(value.districtCode,value.subDistrictMunicipalCode,value.grampanchayatCode,'8')}>
         {value.augTotal}
        </Link>)}</TableCell>
              <TableCell align="center">
              {value.sepTotal==='0'?value.sepTotal:(  <Link style={{cursor: 'pointer',textDecoration:'none'}} 
              onClick={() => downloadDataInExcel(value.districtCode,value.subDistrictMunicipalCode,value.grampanchayatCode,'9')}>
         {value.sepTotal}
        </Link>)}</TableCell>
              <TableCell align="center"> 
              {value.octTotal==='0'?value.octTotal:( <Link style={{cursor: 'pointer',textDecoration:'none'}} 
              onClick={() => downloadDataInExcel(value.districtCode,value.subDistrictMunicipalCode,value.grampanchayatCode,'10')}>
          {value.octTotal}
        </Link>)}</TableCell>
              <TableCell align="center">
              {value.novTotal==='0'?value.novTotal:( <Link style={{cursor: 'pointer',textDecoration:'none'}} 
              onClick={() => downloadDataInExcel(value.districtCode,value.subDistrictMunicipalCode,value.grampanchayatCode,'11')}>
          {value.novTotal}
        </Link>)}</TableCell>
              <TableCell align="center"> 
              {value.decTotal==='0'?value.decTotal:(<Link style={{cursor: 'pointer',textDecoration:'none'}} 
              onClick={() => downloadDataInExcel(value.districtCode,value.subDistrictMunicipalCode,value.grampanchayatCode,'12')}>
         {value.decTotal}
        </Link>)}</TableCell>
              <TableCell align="center"> 
              {value.janTotal==='0'?value.janTotal:( <Link style={{cursor: 'pointer',textDecoration:'none'}} 
              onClick={() => downloadDataInExcel(value.districtCode,value.subDistrictMunicipalCode,value.grampanchayatCode,'1')}>
          {value.janTotal}
        </Link>)}</TableCell>
              <TableCell align="center">
              {value.febTotal==='0'?value.febTotal:( <Link style={{cursor: 'pointer',textDecoration:'none'}} 
              onClick={() => downloadDataInExcel(value.districtCode,value.subDistrictMunicipalCode,value.grampanchayatCode,'2')}>
          {value.febTotal}
        </Link>)}</TableCell>
              <TableCell align="center"> 
              {value.marchTotal==='0'?value.marchTotal:( <Link style={{cursor: 'pointer',textDecoration:'none'}} 
              onClick={() => downloadDataInExcel(value.districtCode,value.subDistrictMunicipalCode,value.grampanchayatCode,'3')}>
          {value.marchTotal}
        </Link>)}</TableCell>
              <TableCell align="center"> {value.totalCount}</TableCell>
            </TableRow>
          ))}
        
            {/* </React.Fragment> */}
        {/* ))} */}
        </TableBody>
        <TableFooter style={{backgroundColor:'rgba(71, 140, 255, 1)',color:'white', position: 'sticky', bottom: 0, zIndex: 1000 }}>
            <TableRow >
              <TableCell style={{color:'white',align:'center'}}>Total</TableCell>
               {Object.values(calculateColumnSums()).map((sum, index) => (
                <TableCell align="center" style={{color:'white'}} key={index}>{sum}</TableCell>
              ))} 
            </TableRow>
          </TableFooter>
        </Table>
    </TableContainer>
    </div>
        </MainCard>)}
    </div>
)
}
export default MigrationLogReport;