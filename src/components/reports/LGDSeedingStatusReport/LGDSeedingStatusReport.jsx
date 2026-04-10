import MainCard from 'ui-component/cards/MainCard';
import React ,{useState,useEffect }  from 'react'
import {  Button,CircularProgress,Backdrop,Table, TableHead, TableBody, TableRow, TableCell } from '@mui/material';
import axiosInstance from 'hooks/useAuthTokenUrl';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import DownloadIcon from '@mui/icons-material/Download';

function LGDSeedingStatusReport() {
  const [getAllDistrict, setAllDistrict] = useState([])
  const [loading, setLoading] = useState(false);
  
       const getLGDStatusData = async () => {
        try {
          const getStateData = '/lgd-seeding-status-report/getLGDSeedingStatus';
          setLoading(true);
          const response = await axiosInstance.get(getStateData);  
          setAllDistrict(response.data);
        } catch (error) {
          console.error('Error fetching data :', error);
        }
        finally{
          setLoading(false);
        }
      };

  useEffect(() => {
    getLGDStatusData();
  }, []);

    const exportToExcel = (id) => {
        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.table_to_sheet(document.getElementById(id));
        XLSX.utils.book_append_sheet(wb, ws, id);
        const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        saveAs(new Blob([excelBuffer], { type: 'application/octet-stream' }), id + '.xlsx');
      };

  return (
    <div>      
     <MainCard title="LGD Seeding Status">
     
      <Backdrop open={loading} style={{ zIndex: 999, color: '#fff' }}>
        <CircularProgress color="inherit" />
      </Backdrop>
        
      </MainCard>

      {getAllDistrict.length>0  ? (
        <>
         <MainCard >
       
        <Button variant="contained" style={{ backgroundColor: 'blue', marginLeft: '-1px',marginBottom:'2px' }} onClick={() => exportToExcel('LGD Seeding Status Report')} title='Download Excel'>Excel <DownloadIcon/></Button>

        <Table style={{border:'1px solid '}} id="LGD Seeding Status Report" size="small" aria-label="a dense table">
      <TableHead >
       
        <TableRow >
  <TableCell style={{borderRightWidth:'1px',borderRightStyle:'solid',textAlign:'center',color:'rgb(51, 181, 229)'}}><b>S.No</b></TableCell>
  <TableCell style={{borderRightWidth:'1px',borderRightStyle:'solid',textAlign:'center',color:'rgb(51, 181, 229)'}}><b>State/UT</b></TableCell>
  <TableCell style={{borderRightWidth:'1px',borderRightStyle:'solid',textAlign:'center',color:'rgb(51, 181, 229)'}}><b>NSAP Total Districts</b></TableCell>
  <TableCell style={{borderRightWidth:'1px',borderRightStyle:'solid',textAlign:'center',color:'rgb(51, 181, 229)'}} ><b>LGD Seeded Districts</b></TableCell>
  <TableCell style={{borderRightWidth:'1px',borderRightStyle:'solid',textAlign:'center',color:'rgb(51, 181, 229)'}}><b>%age</b></TableCell>
  <TableCell style={{borderRightWidth:'1px',borderRightStyle:'solid',textAlign:'center',color:'rgb(51, 181, 229)'}}><b>NSAP Total Sub-Districts</b></TableCell>

  <TableCell style={{borderRightWidth:'1px',borderRightStyle:'solid',textAlign:'center',color:'rgb(51, 181, 229)'}}><b>LGD Seeded Sub-Districts</b></TableCell>
  <TableCell style={{borderRightWidth:'1px',borderRightStyle:'solid',textAlign:'center',color:'rgb(51, 181, 229)'}}><b>%age</b></TableCell>
  <TableCell style={{borderRightWidth:'1px',borderRightStyle:'solid',textAlign:'center',color:'rgb(51, 181, 229)'}}><b>NSAP Total GPs</b></TableCell>
  <TableCell style={{borderRightWidth:'1px',borderRightStyle:'solid',textAlign:'center',color:'rgb(51, 181, 229)'}}><b>LGD seeded GPs</b></TableCell>

  <TableCell style={{borderRightWidth:'1px',borderRightStyle:'solid',textAlign:'center',color:'rgb(51, 181, 229)'}}><b>%age</b></TableCell>
  <TableCell style={{borderRightWidth:'1px',borderRightStyle:'solid',textAlign:'center',color:'rgb(51, 181, 229)'}}><b>NSAP Total Villages</b></TableCell>
  <TableCell style={{borderRightWidth:'1px',borderRightStyle:'solid',textAlign:'center',color:'rgb(51, 181, 229)'}}><b>LGD seeded Villages</b></TableCell>
  <TableCell style={{borderRightWidth:'1px',borderRightStyle:'solid',textAlign:'center',color:'rgb(51, 181, 229)'}}><b>%age</b></TableCell>

  </TableRow>
  </TableHead>
  <TableBody>
{getAllDistrict.map(item => (

item.dataOne ==='TOTAL' ?
<TableRow key={item.srNo}>
<TableCell style={{backgroundColor:'rgba(71, 140, 255, 1)',color:'white',borderRightWidth:'1px',borderRightStyle:'solid',textAlign:'center'}} >{item.srNo}</TableCell>
<TableCell style={{backgroundColor:'rgba(71, 140, 255, 1)',color:'white',borderRightWidth:'1px',borderRightStyle:'solid',textAlign:'center'}}>{item.dataOne}</TableCell>
<TableCell style={{backgroundColor:'rgba(71, 140, 255, 1)',color:'white',borderRightWidth:'1px',borderRightStyle:'solid',textAlign:'center'}}>{item.dataTwo}</TableCell>
<TableCell style={{backgroundColor:'rgba(71, 140, 255, 1)',color:'white',borderRightWidth:'1px',borderRightStyle:'solid',textAlign:'center'}}>{item.dataThree}</TableCell>
<TableCell style={{backgroundColor:'rgba(71, 140, 255, 1)',color:'white',borderRightWidth:'1px',borderRightStyle:'solid',textAlign:'center'}}>{item.dataFour}</TableCell>
<TableCell style={{backgroundColor:'rgba(71, 140, 255, 1)',color:'white',borderRightWidth:'1px',borderRightStyle:'solid',textAlign:'center'}}>{item.dataFive}</TableCell>
<TableCell style={{backgroundColor:'rgba(71, 140, 255, 1)',color:'white',borderRightWidth:'1px',borderRightStyle:'solid',textAlign:'center'}}>{item.dataSix}</TableCell>
<TableCell style={{backgroundColor:'rgba(71, 140, 255, 1)',color:'white',borderRightWidth:'1px',borderRightStyle:'solid',textAlign:'center'}}>{item.dataSeven}</TableCell>
<TableCell style={{backgroundColor:'rgba(71, 140, 255, 1)',color:'white',borderRightWidth:'1px',borderRightStyle:'solid',textAlign:'center'}}>{item.dataEight}</TableCell>
<TableCell style={{backgroundColor:'rgba(71, 140, 255, 1)',color:'white',borderRightWidth:'1px',borderRightStyle:'solid',textAlign:'center'}}>{item.dataNine}</TableCell>
<TableCell style={{backgroundColor:'rgba(71, 140, 255, 1)',color:'white',borderRightWidth:'1px',borderRightStyle:'solid',textAlign:'center'}}>{item.dataTen}</TableCell>
<TableCell style={{backgroundColor:'rgba(71, 140, 255, 1)',color:'white',borderRightWidth:'1px',borderRightStyle:'solid',textAlign:'center'}}>{item.dataEleven}</TableCell>
<TableCell style={{backgroundColor:'rgba(71, 140, 255, 1)',color:'white',borderRightWidth:'1px',borderRightStyle:'solid',textAlign:'center'}}>{item.dataTwelve}</TableCell>
<TableCell style={{backgroundColor:'rgba(71, 140, 255, 1)',color:'white',borderRightWidth:'1px',textAlign:'center'}}>{item.dataThirteen}</TableCell>
</TableRow>
:
<TableRow key={item.srNo}>
{item.srNo%2 ===0 ? 
<> 
<TableCell style={{borderRightWidth:'1px',borderRightStyle:'solid',textAlign:'center',backgroundColor: '#f2f2f2'}} >{item.srNo}</TableCell>
<TableCell style={{borderRightWidth:'1px',borderRightStyle:'solid',textAlign:'center',backgroundColor: '#f2f2f2'}}>{item.dataOne}</TableCell>
<TableCell style={{borderRightWidth:'1px',borderRightStyle:'solid',textAlign:'center',backgroundColor: '#f2f2f2'}}>{item.dataTwo}</TableCell>
<TableCell style={{borderRightWidth:'1px',borderRightStyle:'solid',textAlign:'center',backgroundColor: '#f2f2f2'}}>{item.dataThree}</TableCell>
<TableCell style={{borderRightWidth:'1px',borderRightStyle:'solid',textAlign:'center',backgroundColor: '#f2f2f2'}}>{item.dataFour}</TableCell>
<TableCell style={{borderRightWidth:'1px',borderRightStyle:'solid',textAlign:'center',backgroundColor: '#f2f2f2'}}>{item.dataFive}</TableCell>
<TableCell style={{borderRightWidth:'1px',borderRightStyle:'solid',textAlign:'center',backgroundColor: '#f2f2f2'}}>{item.dataSix}</TableCell>
<TableCell style={{borderRightWidth:'1px',borderRightStyle:'solid',textAlign:'center',backgroundColor: '#f2f2f2'}}>{item.dataSeven}</TableCell>
<TableCell style={{borderRightWidth:'1px',borderRightStyle:'solid',textAlign:'center',backgroundColor: '#f2f2f2'}}>{item.dataEight}</TableCell>
<TableCell style={{borderRightWidth:'1px',borderRightStyle:'solid',textAlign:'center',backgroundColor: '#f2f2f2'}}>{item.dataNine}</TableCell>
<TableCell style={{borderRightWidth:'1px',borderRightStyle:'solid',textAlign:'center',backgroundColor: '#f2f2f2'}}>{item.dataTen}</TableCell>
<TableCell style={{borderRightWidth:'1px',borderRightStyle:'solid',textAlign:'center',backgroundColor: '#f2f2f2'}}>{item.dataEleven}</TableCell>
<TableCell style={{borderRightWidth:'1px',borderRightStyle:'solid',textAlign:'center',backgroundColor: '#f2f2f2'}}>{item.dataTwelve}</TableCell>
<TableCell style={{borderRightWidth:'1px',borderRightStyle:'solid',textAlign:'center',backgroundColor: '#f2f2f2'}}>{item.dataThirteen}</TableCell>
</>
:
<>
<TableCell style={{borderRightWidth:'1px',borderRightStyle:'solid',textAlign:'center'}} >{item.srNo}</TableCell>
<TableCell style={{borderRightWidth:'1px',borderRightStyle:'solid',textAlign:'center'}}>{item.dataOne}</TableCell>
<TableCell style={{borderRightWidth:'1px',borderRightStyle:'solid',textAlign:'center'}}>{item.dataTwo}</TableCell>
<TableCell style={{borderRightWidth:'1px',borderRightStyle:'solid',textAlign:'center'}}>{item.dataThree}</TableCell>
<TableCell style={{borderRightWidth:'1px',borderRightStyle:'solid',textAlign:'center'}}>{item.dataFour}</TableCell>
<TableCell style={{borderRightWidth:'1px',borderRightStyle:'solid',textAlign:'center'}}>{item.dataFive}</TableCell>
<TableCell style={{borderRightWidth:'1px',borderRightStyle:'solid',textAlign:'center'}}>{item.dataSix}</TableCell>
<TableCell style={{borderRightWidth:'1px',borderRightStyle:'solid',textAlign:'center'}}>{item.dataSeven}</TableCell>
<TableCell style={{borderRightWidth:'1px',borderRightStyle:'solid',textAlign:'center'}}>{item.dataEight}</TableCell>
<TableCell style={{borderRightWidth:'1px',borderRightStyle:'solid',textAlign:'center'}}>{item.dataNine}</TableCell>
<TableCell style={{borderRightWidth:'1px',borderRightStyle:'solid',textAlign:'center'}}>{item.dataTen}</TableCell>
<TableCell style={{borderRightWidth:'1px',borderRightStyle:'solid',textAlign:'center'}}>{item.dataEleven}</TableCell>
<TableCell style={{borderRightWidth:'1px',borderRightStyle:'solid',textAlign:'center'}}>{item.dataTwelve}</TableCell>
<TableCell style={{borderRightWidth:'1px',borderRightStyle:'solid',textAlign:'center'}}>{item.dataThirteen}</TableCell>
</>
}
    </TableRow>
    ))}
      </TableBody>
    </Table>
    </MainCard>
    </>
    ):(
      <div>
      </div>
    )}
<div style={{display: 'flex',backgroundColor:'black',color:'white', marginTop:'9px'}}>
            <div><img src={process.env.PUBLIC_URL + '/nic-logo.png'} alt='logo' width={'103px'} style={{marginTop:'8px',marginLeft:'206px'}}/></div>
            <div style={{marginTop:'8px',marginLeft:'120px'}}>Site designed and developed by NIC. Contents provided and maintained by Ministry of Rural Development . For any NSAP related issues contact NSAP Division, MoRD</div>
</div>

    </div>
  );
}
export default LGDSeedingStatusReport
