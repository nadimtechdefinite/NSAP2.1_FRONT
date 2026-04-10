import React,{useReducer,useEffect,useState } from 'react'
import Button from '@mui/material/Button';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';
import axiosInstance from 'hooks/useAuthTokenUrl';
import {Breadcrumbs,Link,Typography,TextField,CircularProgress,Backdrop} from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { Table, TableBody, TableCell, TableContainer, TableRow  } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import MainCard from 'ui-component/cards/MainCard';

export default function ViewSanctionOrder() {
    const [snackbar, setSnackbar] = useState(null);
    const [condition,setCondition] = useState(false);
    const handleCloseSnackbar = () => setSnackbar(null);
    const navigate = useNavigate();
    const [approvalStatus, setApprovalStatus] = useState(true);
    const [loading, setLoading] = useState(false);

    const [formInput, setFormInput] = useReducer((state, newState) => ({ ...state, ...newState }),
    {
        applicantName: '',
        applicationNo: '',fatherHusbandName : '',
        applicationDate :'',dateOfBirth:'',
        veRlev1Date:'',veRlev2Date:'',veRlev3Date:'',
        pendingDays:'',mobileNumber:'',  
        status:'',gender:'',
        stateName:'',districtName:'',
        subDisName:'',gpName:'',
        sanctionRemarks:'',approvalStatus:'',
        sanctionDate:'',pensionEffectiveDate:'',
        categoryName:'',nomineeName:'',
        schemeCode:'',annualIncome:'',  
        widows:'', disabilityStatus:'', disabilityCode:'', disabilityPercent:'',
        disbursementCode:'', ifscCode:'',
        ageCertificatePhoto:'',incomeCertificatePhoto:'',beneficiaryPhoto:'',
    }
  );

    const getSanctionData = async () => {
        //console.log('-- '+formInput);
        try {
          const findSanctionUrl = '/sanction-order-master/getPendingSanctionOrderNoRecordNew/' + localStorage.getItem('appnoSanction');
          const res = await axiosInstance.get(findSanctionUrl);
          setFormInput(res.data);
          alert('-- : '+res.data[0].applicantName);
        } catch (error) {
          console.error('Error fetching sanction data:', error);
        }
      };

      async function postData(e) {
        e.preventDefault();
        //alert("--- inside submit "+e.type+" -- "+e.type.value);
        if(approvalStatus === 'sanction' && formInput.sanctionDate === null){
          alert('Date Of Sanction & Pension Effective Date can not be empty in sanction case! ');
        }
        else{
        const postFormDate = JSON.stringify(formInput);
        //alert(formInput.sanctionDate +" -- "+formInput.pensionEffectiveDate);
        if( formInput.sanctionDate=== 'Invalid Date'){
         alert("Kindly correct Date of Sanction format.")
        }

        else if(formInput.pensionEffectiveDate !== null){
          var patternForPED = /^(0[1-9]|[1-2][0-9]|3[0-1])-(0[1-9]|1[0-2])-[0-9]{4}$/;
          if(!patternForPED.test(formInput.pensionEffectiveDate)){
          alert("Kindly correct Pension Effective Date format.")
          }
          else{

      //ADDED
      var appDateSplit=formInput.applicationDate.split('-');
      const appDate = `${appDateSplit[2]}-${appDateSplit[1]}-${appDateSplit[0]}`;
      var sanDate=formInput.sanctionDate;

       const [day1, month1, year1] = appDate.split('-').map(Number);
       const [day2, month2, year2] = sanDate.split('-').map(Number);
       const appDate1 = new Date(year1, month1 - 1, day1);
       const sanDate1 = new Date(year2, month2 - 1, day2);
       if(appDate1 > sanDate1){
       alert("Date Of Sanction can not less than Application Date." );
       return false;
       }else{
        const [day3, month3, year3] = formInput.pensionEffectiveDate.split('-').map(Number);
        const penEffectiveDate1 = new Date(year3, month3 - 1, day3);
        if(appDate1 > penEffectiveDate1){
          alert("Pension Effective Date can not less than Application Date." );
          return false;
        }
        else{
          try{
            var result = window.confirm("Are you sure want to "+approvalStatus.charAt(0).toUpperCase() + approvalStatus.slice(1) +" the record!");
            if (result) {
              const postUrl = '/sanction-order-master/getPendingSanctionOrderNoRecordNew/'+localStorage.getItem("appnoSanction");
              setLoading(true);
              const res = await axiosInstance.post(postUrl, postFormDate)
              console.log('Sanction Data: Status Code : ', res.status)
              if (res.status >= 200 ) {
                setFormInput({sanctionDate: '',pensionEffectiveDate: '',sanctionRemarks: ''});
                localStorage.setItem('appnoSanction', '');
                setSnackbar({ children: res.data , severity: 'success' });
                setTimeout(() => {
                  navigate('/sanction/generatesanction');
                }, 6000); 
              } 
           }
           else{
              //do nothing
           }
          }catch (error) {
            console.error('Error fetching data:', error);
        }
        finally {
          setLoading(false);
        }
        }

       }

          }
        }

        else{
        var resultOne = window.confirm("Are you sure want to "+approvalStatus.charAt(0).toUpperCase() + approvalStatus.slice(1) +" the record!");
     try{
        if (resultOne) {
        const postUrl = '/sanction-order-master/getPendingSanctionOrderNoRecordNew/'+localStorage.getItem("appnoSanction");
        setLoading(true);
        const res = await axiosInstance.post(postUrl, postFormDate)
        console.log('Sanction Data: Status Code : ', res.status)
        if (res.status >= 200 ) {
          setFormInput({sanctionDate: '',pensionEffectiveDate: '',sanctionRemarks: ''});
          localStorage.setItem('appnoSanction', '');
          setSnackbar({ children: res.data , severity: 'success' });
          setTimeout(() => {
            navigate('/sanction/generatesanction');
          }, 6000); 
        } 
     }
     else{
        //do nothing
     }
    }catch (error) {
      console.error('Error fetching data:', error);
  }
  finally {
    setLoading(false);
  }
    }


     }
      }

      function isOnlyTextRemarkd(inputString) {
        return /^[a-zA-Z\s,.]+$/.test(inputString);
      }
      const handleInputChangeData = (event) => {
        if(event.target.value != null && event.target.value != ""){
        event.target.value = event.target.value.replace(/[^0-9-]/g, '');
        }
        };

        const handleInput = evt => {
        const name = evt.target.name;
        const newValue = evt.target.value;
       if (isOnlyTextRemarkd(newValue)) {
          setFormInput({ [name]: newValue });
        } else {
          alert("Not allow numeric and special characters in remarks");
          setFormInput({ [name]: '' });
          //return;
        }       
      };

    const backItem = () => {
        localStorage.setItem('appnoSanction', '');
        navigate('/sanction/generatesanction');
      };

      function workValue(id){
        //alert("method() : "+id);
        setApprovalStatus(id);
        //console.log(approvalStatus);
        setFormInput({ ['approvalStatus']: id });
        }

        const handleChange = (field, value,) => {
         if(value !=null){
          //var dateObjNew=value.format('DD-MM-YYYY').split('-');
           //var dateObjNewForSet='01-'+dateObjNew[1]+'-'+dateObjNew[2];
           /*var dateData,monthData,yearData;
           if(dateObjNew[1]==='01'){
            dateData='31';monthData='12';yearData = dateObjNew[2]-1;
           }
           else if(dateObjNew[1]==='02'){
            dateData='28'; monthData=dateObjNew[1]-1; yearData = dateObjNew[2];
           }
           else if(dateObjNew[1]==='03' || dateObjNew[1]==='05'  || dateObjNew[1]==='07'  || dateObjNew[1]==='08'  || dateObjNew[1]==='10'|| dateObjNew[1]==='12'  ){
            dateData='30'; monthData=dateObjNew[1]-1;yearData = dateObjNew[2];
           }
           else{
            dateData='31';monthData=dateObjNew[1]-1;yearData = dateObjNew[2];
           }
           alert(`Pension Calculation Will be Taken As The Date (${dateData}-${monthData}-${yearData}) Please Confirm`); */
           setFormInput({ ['sanctionDate']: value.format('DD-MM-YYYY') });

           var appDateSplit=formInput.applicationDate.split('-');
           const appDate = `${appDateSplit[2]}-${appDateSplit[1]}-${appDateSplit[0]}`;
            setFormInput({ ['pensionEffectiveDate']:appDate });
            setCondition(true);
            }
          }
            //console.log("checking--- "+condition)
   {/*} async function openDocumentInNewWindow(fileType) {
      //alert(" -- "+fileType);
      if(fileType==null){
        // do nothing
      }else{
        try {
          const findSanctionUrl = '/sanction-order-master/downloadAttachment/112' ;
          const res = await axiosInstance.get(findSanctionUrl);
          //setFormInput(res.data);
          //alert('-- : '+res.data[0].applicantName);
          console.log("-- "+res);
        } catch (error) {
          console.error('Error fetching sanction data:', error);
        }
        window.open('/fileUpload/'+fileType, '_blank');
      }}*/}
      {/*async function openDocumentInNewWindow(fileType) {
        if (fileType === null) {
          // do nothing
        } else {
          try {
            const findSanctionUrl = '/sanction-order-master/downloadAttachment/112';
            const res = await axiosInstance.get(findSanctionUrl, { responseType: 'blob' });
      
            // Create a Blob from the response data
            const blob = new Blob([res.data], { type: 'application/jpg' });
            // Create a URL for the Blob
            const url = URL.createObjectURL(blob);
      
            // Open the URL in a new window
            window.open(url, '_blank');
          } catch (error) {
            console.error('Error fetching sanction data:', error);
          }
        }
      }
    */}

    async function openDocumentInNewWindow(fileType) {
      if (fileType === null) {
        // do nothing
      } else {
        try {
          const findSanctionUrl = '/sanction-order-master/downloadBeneficiaryAttachment/'+fileType;
          const res = await axiosInstance.get(findSanctionUrl, { responseType: 'blob' });
          const url = URL.createObjectURL(res.data);
          window.open(url, '_blank');
        } catch (error) {
          console.error('Error fetching sanction data:', error);
        }
      }
    }

      useEffect(() => {
        getSanctionData();
      }, []);

  return (
    <>
{!!snackbar && (  
        <Snackbar
          open
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          onClose={handleCloseSnackbar}
          autoHideDuration={9600}
        >
          <Alert {...snackbar} onClose={handleCloseSnackbar} style={{marginLeft:'209px',marginTop:'65px'}}/>
        </Snackbar>
      )}

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
          <Link color="inherit" href="#" style={{color:'blue'}} title='Sanction'>
          Sanction
          </Link>
          <Typography color="textInfo" title='View Sanction Order No'>View Sanction Order No</Typography>
        </Breadcrumbs>
        <MainCard title="Generate Sanction Order No">
        <Backdrop open={loading} style={{ zIndex: 999, color: '#fff' }}>
        <CircularProgress color="inherit" />
      </Backdrop>
        <form method="post" onSubmit={postData}>
        <TableContainer>
      <Table>  
        <TableBody>
          <TableRow>
            <TableCell><b>Application Number</b></TableCell>
            <TableCell>{formInput.applicationNo}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell><b>Applicant Name</b></TableCell>
            <TableCell>{formInput.applicantName}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell><b>State/District/ Sub-District/ Gram Panchayat</b></TableCell>
            <TableCell>{formInput.stateName}/ {formInput.districtName}/ {formInput.subDisName}/ {formInput.gpName}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell><b>Father/ Husband Name</b></TableCell>
            <TableCell>{formInput.fatherHusbandName}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell><b>Category/ scheme Name</b></TableCell>
            <TableCell>{formInput.categoryName}/ {formInput.schemeCode}</TableCell>
          </TableRow>
          <TableRow>
          <TableCell><b>Nominee Name/ Annual Income</b></TableCell>
          <TableCell>{formInput.nomineeName==null ? 'NA' : formInput.nomineeName}/ {formInput.annualIncome==null ? 0 : formInput.annualIncome}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell><b>Widows/ Disability Status/ Disability Code/ Disability Percent</b></TableCell>
            <TableCell>{formInput.widows=='Y' ? "Yes" : "No"}/ {formInput.disabilityStatus=='Y' ? "Yes" : "No"}/ {formInput.disabilityCode ==null ? 'NA' : formInput.disabilityCode}/ {formInput.disabilityPercent==null? 'NA':formInput.disabilityPercent}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell><b>Application Date</b></TableCell>
            <TableCell>{formInput.applicationDate}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell><b>Disbursement Code/ IFSC </b></TableCell>
            <TableCell>{formInput.disbursementCode=='1' ? "BANK ACCOUNT":( formInput.disbursementCode=='2' ? "POST OFFICE ACCOUNT" 
            :(formInput.disbursementCode=='3' ? "POST OFFICE MONEY ORDER" : "CASH"))}/ {formInput.ifscCode}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell><b>Date Of Birth (Age)</b></TableCell>
            <TableCell>{formInput.dateOfBirth}</TableCell>
          </TableRow>
          <TableRow>
            {/* <TableCell><b>Ver level1 Date/Ver level2 Date/Ver level2 Date</b></TableCell>
            <TableCell>{formInput.veRlev1Date}/ {formInput.verLev2Date}/ {formInput.verLev3Date}</TableCell> */}
            <TableCell><b>Verification Date</b></TableCell>
            <TableCell>{formInput.veRlev1Date}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell><b>Pending Days/ Mobile Number</b></TableCell>
            {/* <TableCell>{formInput.pendingDays.toString().replace(/\.0+$/, '')} days / {formInput.mobileNumber}</TableCell> */}
            <TableCell>{formInput.pendingDays ? formInput.pendingDays.toString().replace(/\.0+$/, '') : ''} days / {formInput.mobileNumber}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell><b>Gender/ Status</b></TableCell>
            <TableCell>{formInput.gender==='F'? 'Female' : (formInput.gender==='M' ? "Male":"Transgender")} / {formInput.status}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell><b>Beneficiary Photo/ Age Certificate/ Income Certificate <svg className="MuiSvgIcon-root MuiSvgIcon-fontSizeMedium" focusable="false" aria-hidden="true" viewBox="0 0 24 24"
        style={{ verticalAlign: 'middle'}} width="20px">
      <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z" fill="blue"/></svg></b></TableCell>
            <TableCell>
            <button title='Download' style={{textDecoration:'underline',color:'blue',borderBottomStyle:'hidden',borderRightStyle:'hidden',borderLeftStyle:'hidden',borderTopStyle:'hidden',cursor:'pointer',backgroundColor:'white'}}
            onClick={(e)=>{e.preventDefault();openDocumentInNewWindow(formInput.beneficiaryPhoto)}} > {formInput.beneficiaryPhoto==null ? <p style={{color:'red',textDecoration:'inherit'}}>No Document</p>:formInput.beneficiaryPhoto} </button>
            /
            <button title='Download' style={{textDecoration:'underline',color:'blue',borderBottomStyle:'hidden',borderRightStyle:'hidden',borderLeftStyle:'hidden',borderTopStyle:'hidden',cursor:'pointer' ,backgroundColor:'white'}} 
            onClick={(e)=>{e.preventDefault();openDocumentInNewWindow(formInput.ageCertificatePhoto)}} > {formInput.ageCertificatePhoto==null ? <p style={{color:'red',textDecoration:'inherit'}}>No Document</p>:formInput.ageCertificatePhoto} </button>
            /
            <button title='Download' style={{textDecoration:'underline',color:'blue',borderBottomStyle:'hidden',borderRightStyle:'hidden',borderLeftStyle:'hidden',borderTopStyle:'hidden',cursor:'pointer' ,backgroundColor:'white'}}
            onClick={(e)=>{e.preventDefault();openDocumentInNewWindow(formInput.incomeCertificatePhoto)}} > {formInput.incomeCertificatePhoto== null ? <p style={{color:'red',textDecoration:'inherit'}}>No Document</p>:formInput.incomeCertificatePhoto} </button>
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell><b>Date Of Sanction</b></TableCell>
            <TableCell>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker
    label="Date of Sanctioned" required
    format="DD-MM-YYYY" 
    disableFuture 
    name="sanctionDate"  
    slotProps={{ textField: { fullWidth:false,style: { width: '368px' } } }} 
    variant='outlined' 
    onChange={(selectedDate) => handleChange('sanctionDate', selectedDate)}>
    </DatePicker>
      </LocalizationProvider>
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell><b>Pension Effective Date</b></TableCell>
            <TableCell>
            <TextField label="Pension Effective Date" value={formInput.pensionEffectiveDate} style={{width:'368px'}}  
            onChange={(e) => setFormInput({...formInput, pensionEffectiveDate: e.target.value})} disabled={condition===false ? 'disabled' : null} onInput={handleInputChangeData}/>
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell><b>Remarks <sup style={{color:'red'}}>*</sup></b></TableCell>
            <TableCell><TextField
            style={{width:'368px',height:'2.4375em', marginBottom:'11px'}}
            required
              label="Remarks"
              name="sanctionRemarks"
              autoComplete="off"
              placeholder="Please Enter Remarks"
              onChange={handleInput}
              value={formInput.sanctionRemarks}
            /></TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
      {/*Applicant No: {formInput.applicationNo}<br/>
      Applicant Name: {formInput.applicantName}<br/>
      State: {formInput.stateName}<br/>
      District: {formInput.districtName}<br/>
      Sub-District: {formInput.subDisName}<br/>
      GP: {formInput.gpName}<br/>
      Father/Husband Name: {formInput.fatherHusbandName}<br/>
      Application Date: {formInput.applicationDate}<br/>
      Date Of Birth: {formInput.dateOfBirth}<br/>
      Ver level1 Date: {formInput.veRlev1Date}<br/>
      Ver level2 Date: {formInput.verLev2Date}<br/>
      Ver level3 Date: {formInput.verLev3Date}<br/>
      Pending Days: {formInput.pendingDays.toString().replace(/\.0+$/, '')}<br/>
      Mobile Number: {formInput.mobileNumber}<br/>
      Gender: {formInput.gender==='F'? 'Female' : (formInput.gender==='M' ? "Male":"Transgender")}<br/>
      Status: {formInput.status}<br/>
      Attachment Doc1:<a href="">Document1</a> <br/>
      Attachment Doc2:<a href="">Document2</a> <br/>
      Attachment Doc3: <a href="">Document3</a><br/><br/>
      */}

    {/** application number is :
    {
    localStorage.getItem('appnoSanction')   
    } */}
    
        <br/>
        <Button type="submit" variant="" color="primary" style={{backgroundColor:'#5cb85c',color:'white',borderColor:'#4cae4c',marginLeft:'0px'}} title='Sanction' onClick={()=>workValue('sanction')}>Sanction</Button>
      &nbsp;&nbsp;&nbsp;<Button type="submit" variant="" color="secondary" style={{backgroundColor:'#d9534f',color:'white',borderColor:'#d43f3a'}}  title='Reject' onClick={()=>workValue('reject')}> Reject</Button>
    </form>
    </MainCard>
    </>
  )
}
