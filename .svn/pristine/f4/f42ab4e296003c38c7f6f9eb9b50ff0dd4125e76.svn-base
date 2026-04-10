  import React, {useState,useRef/* ,useEffect,useRef */ }   from 'react'
  import MainCard from 'ui-component/cards/MainCard';
  import axiosInstance from 'hooks/useAuthTokenUrl';
  import { getUserInfo} from 'utils/storageUtils';
  import { Grid,FormControl, Button,TextField,Snackbar,Alert,Backdrop,
  CircularProgress,FormHelperText, Typography
    } from '@mui/material';
  import HabitateCommon from 'components/common/HabitateCommon';
  import messages_en from 'components/common/messages_en.json';


export default function TransferSanctionOrder() {
  const userInfo = getUserInfo();
  const [formErrors, setFormErrors] = useState({});
    const [searchText, setSearchText] = useState(userInfo.userCode.substring(0,2)+"-S-");
    const [snackbar, setSnackbar] = React.useState(null);
    const [locationOptionValues,setLocationOptionValues]= useState({});
    const [loading, setLoading] = useState(false);
    const [getAllPensionerData, setAllPensionerData] = useState({});
    const [houseNo, setHouseNo] = useState('');
    const habitateCommonRef = useRef(null);
    const [error, setError] = useState('');
  // const [showValidationMessage, setShowValidationMessage] = useState(false);

    const handleHouseNoChange = (event) => {
setHouseNo(event.target.value);
};
const [street, setstreet] = useState('');
    const handlestreetChange = (event) => {
      setstreet(event.target.value);
};
const [locality, setLocality] = useState('');
    const handleLocalityChange = (event) => {
      setLocality(event.target.value);
};
const [pincode, setPincode] = useState('');
    const handlePincodeChange = (event) => {
      setPincode(event.target.value);
      setFormErrors((prevErrors) => {
        const updatedErrors = { ...prevErrors };
        delete updatedErrors.pincode;
        return updatedErrors;
      });
};
const [transferRemarksData, setransferRemarksData] = useState('');
    const handleRemarksChange = (event) => {
      setransferRemarksData(event.target.value);
};
const [beatcode, setBeatcode] = useState('');
    const handleBeatcodeChange = (event) => {
      setBeatcode(event.target.value);
};
const handleLocationValuesChange = (newLocOptionValues) => {
  setLocationOptionValues(newLocOptionValues);
}; 


    const handleCloseSnackbar = () => setSnackbar(null);
    const handleSearchChange = (e) => {
      const formattedValue = formatValue(e.target.value);
      if (formattedValue.substring(0, 2) !== searchText.substring(0, 2)) {
        setSearchText(searchText.substring(0, 2) +"-S-"+ formattedValue.substring(2));
      } else {
        setSearchText(formattedValue);
      }
      // Setting the value to the state
    
        // setSearchText(e.target.value);
      };
      
      const handleClickOpen = (e) => {
        e.preventDefault();
        if (!/^([A-Z]{2}-[A-Z]-\d{8,})$/.test(searchText)) {
          console.log( userInfo.userCode.substring(0, 2));
          const userCodePrefix = userInfo.userCode.substring(0, 2);

          setError('Invalid format. Please enter in the format:'+userCodePrefix+'-S-12345678');
          return;
        }
        else{
          setError('');
        }

        fetchData()
        .then((res) =>  {if (res) {
          const transfrData = res || {};
          setAllPensionerData(transfrData);
          console.log("naveen  ----"+getAllPensionerData.length);
          
      } else {
        setAllPensionerData({});
          setSnackbar({ children: 'No Data Found', severity: 'error' });
       
          return false;
      }})
        .catch((e) => {
          console.log(e.message)
        })
      };
      const fetchData = async () => {
        try {
          const getUrl=`/transferSanction/searchSanctionOrder`;
          const body= JSON.stringify({ sanctionOrderNo:searchText });
          setLoading(true);
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
      finally {
        setLoading(false);
      }
    }
    const validateForm = () => {
      const errors = {};
      // Add validation logic for each field
     
      if (!pincode) {
        errors.pincode = messages_en.pincodeValidationError;
      }
      if(pincode.length!=6){
        errors.pincode = messages_en.pincodeValidationError;
      }
    
      setFormErrors(errors);
      return Object.keys(errors).length === 0; // Return true if no errors
    };
    const handleFormSubmit = async (e) => {
      e.preventDefault();
    //   const isFieldValid = habitateCommonRef.current.validateField();
    // setShowValidationMessage(!isFieldValid);
    // if(!isFieldValid){
    //   return;
    // }
    // else{
    //   return;
    // }
if (habitateCommonRef.current ) {
  if(habitateCommonRef.current.validateSelectedDropDown()!='RJ'){
    return false;
  }
}
const isFormValid = validateForm();
// if(pincode.length!=6){
//   alert("erorr");
//   return;
// }
if(isFormValid){



      try {
        const stateID=getAllPensionerData.stateId;
        const districtID=getAllPensionerData.districtId;
        // const area=getAllPensionerData.area;
        const subDistID=getAllPensionerData.subDistrictMunicipalAreaId;
        const village=getAllPensionerData.villageId;
       
        const stateIDTransfer=locationOptionValues.stateCode;
        const districtIDTransfer=locationOptionValues.districtCode;
        const areaTransfer=locationOptionValues.ruralUrbanArea;
        const subDistIDTransfer=locationOptionValues.subDistrictMunicipalAreaCode;
        const gpIDTransfer=locationOptionValues.gramPanchyatWardCode;
        const villageIDTransfer=locationOptionValues.villageCode;
        const habitationIdTransfer=locationOptionValues.habitationCode;
	
        const address1Transfer=houseNo;
        const address2Transfer=street;
        const address3Transfer=locality;
        const pincodeTransfer=pincode;
        const beatCodeTransfer=beatcode;
        const applicationNo=getAllPensionerData.applicationNo;
        const sanctionOrderNo=getAllPensionerData.sanctionOrderNo;
        const transferRemarks=transferRemarksData;
       
         const body=JSON.stringify({stateID,districtID,subDistID,village,stateIDTransfer,districtIDTransfer,areaTransfer,
          subDistIDTransfer,gpIDTransfer,villageIDTransfer,habitationIdTransfer,address1Transfer,address2Transfer,address3Transfer,
          pincodeTransfer,beatCodeTransfer,applicationNo,sanctionOrderNo ,transferRemarks });
        const apiUrl = '/transferSanction/transferSanctionOrder'; 
        setLoading(true);
        const response = await axiosInstance.post(apiUrl,body);
        
        if (response.status >= 200 && response.status < 300) {
          setSnackbar({ children: response.data , severity: 'success' });  
          await new Promise(resolve => setTimeout(resolve, 1450));  

       
        }
     else{
     
      setSnackbar({ children: 'Error in updating data' , severity: 'success' });  
          await new Promise(resolve => setTimeout(resolve, 1450));  
     }
   
      } catch (error) {
        // alert(error.response.data.message);

        console.error('Error sending data:', error);
        // setSnackbar({ children: error.response.data.message, severity: 'error' });
        setSnackbar({ children: error.response.data.message, severity: 'error' });
      }
      finally {
        setLoading(false);
        setAllPensionerData({});
      }
    }
      }
   
      const handleInputChange = (event) => {
       event.target.value = event.target.value.replace(/[^0-9]/g, '');
       };
      
       const formatValue = (input) => {
        // Apply upper case transformation
        let formattedInput = input.toUpperCase();
    
        // Remove any non-alphanumeric characters
        formattedInput = formattedInput.replace(/[^A-Z0-9]/g, '');
        formattedInput = formattedInput.substring(0, 2).replace(/[^A-Z]/g, '') + formattedInput.substring(2);
       
        // Apply the desired format: GF-H-0123456789
        // Insert hyphens at the appropriate positions
        if (formattedInput.length >= 2) {
          formattedInput = formattedInput.substring(0, 2) + '-' + formattedInput.substring(2);
        }
        if (formattedInput.length >= 4) {
          formattedInput = formattedInput.substring(0, 4) + '-' + formattedInput.substring(4);
        }
        if (formattedInput.length > 3) {
          formattedInput = formattedInput.substring(0, 3) + 'S' + formattedInput.substring(4);
        } else if (formattedInput.length === 3) {
          formattedInput = formattedInput.substring(0, 3) + 'S';
        }
        if (formattedInput.length > 5) {
          const numericPart = formattedInput.substring(5).replace(/[^0-9]/g, '');
          formattedInput = formattedInput.substring(0, 5) + numericPart;
        }
        // Ensure only one character after the first hyphen
        // if (formattedInput.length > 2) {
        //   formattedInput = formattedInput.substring(0, 3) + formattedInput.substring(3, 4);
        // }
    
        // Ensure length doesn't exceed 13 characters
        return formattedInput.substring(0, 14);
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
     <MainCard title="Transfer Sanction Order">
     <Backdrop open={loading} style={{ zIndex: 999, color: '#fff' }}>
        <CircularProgress color="inherit" />
      </Backdrop>
     <form  onSubmit={(e) => handleClickOpen(e)}>
            <TextField
        label="Search Sanction Order No"
        value={searchText}
        required
        onChange={handleSearchChange}
        error={!!error}
        helperText={error}
        style={{ width: 200 }}
      />
       {/* <Grid item xs={12} alignItems="center" > */}
              <Button type="submit" variant="contained" color="primary" style={{marginLeft:15,marginTop:5}} >Submit</Button>
            {/* </Grid> */}
</form>

            </MainCard>
          
            {Object.keys(getAllPensionerData).length>0  ?(<div>
            <MainCard title="Pensioner Details">
            <div> &nbsp;&nbsp;&nbsp;&nbsp;
              
            <TextField
      label="State"
     value={getAllPensionerData.stateName||'NA'}
      disabled
    />&nbsp;&nbsp;&nbsp;&nbsp;
    <TextField
      label="District"
      
      value={getAllPensionerData.districtName||'NA'}
      disabled
    />&nbsp;&nbsp;&nbsp;&nbsp;
      <TextField
             label="Sub-District"
             value={getAllPensionerData.subDistrictMunicipalAreaName||'NA'}
            
             disabled
      />&nbsp;&nbsp;&nbsp;&nbsp;
      <TextField
             label="Village"
             value={getAllPensionerData.villageName||'NA'}
            style={{color:'black'}}
             disabled
      /></div><div>
      <br />
      &nbsp;&nbsp;&nbsp;&nbsp;
      <TextField
             label="Name"
             value={getAllPensionerData.applicantName||'NA'}
             disabled
      />
      &nbsp;&nbsp;&nbsp;&nbsp;
      <TextField
             label="Father/Husband Name"
             value={getAllPensionerData.fatherHusbandName||'NA'}
             disabled
      />
      &nbsp;&nbsp;&nbsp;&nbsp;
      <TextField
             label="DOB"
             value={getAllPensionerData.dateOfBirth||'NA'}
             disabled
      />
     
        
      </div>
      
            </MainCard>
            <MainCard title="Request Transfer To">
            <form onSubmit={(e) => handleFormSubmit(e)}>
           <Grid container spacing={2}>
         
              <FormControl fullWidth>
            {/* <HabitateCommon ref={habitateCommonRef}
          onFormInputValuesChange={handleLocationValuesChange}
          
        /> */}
        <HabitateCommon   ref={habitateCommonRef}  validationLevel={'GP'}  onFormInputValuesChange={handleLocationValuesChange} />
        </FormControl>
           
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
              <TextField label="House No" value={houseNo} onChange={handleHouseNoChange} required />
             
              </FormControl>
            </Grid>
        <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
              <TextField label="Street" value={street} onChange={handlestreetChange}  required/>
              </FormControl>
            </Grid>
          
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
              <TextField label="Locality" value={locality} onChange={handleLocalityChange} required/>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
              <TextField label="Pincode" inputProps={{ maxLength: 6,minLength:6}} required onInput={handleInputChange} value={pincode} onChange={handlePincodeChange} />
              {formErrors.pincode && (
                  <FormHelperText>
                    <Typography style={{ color: 'red', fontSize: '0.8rem' }}>{formErrors.pincode}</Typography>
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>
         
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
              <TextField label="Beatcode" inputProps={{ maxLength: 2}} onInput={handleInputChange} value={beatcode} onChange={handleBeatcodeChange} />
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
              <TextField label="Remarks" value={transferRemarksData} required onChange={handleRemarksChange} />
              </FormControl>
            </Grid>
          
         <Grid>
        
      </Grid>
    
      <Grid item xs={12} alignItems="center">
              <Button type="submit" variant="contained" color="secondary" >Submit</Button>
            </Grid>
        
            
      </Grid>
        </form>
        {/* {showValidationMessage && <p style={{ color: 'red' }}>Please fix the validation errors.</p>} */}
    </MainCard>
            </div>
            ):(
      <div>
      </div>
     )}

        </div>

    );

}