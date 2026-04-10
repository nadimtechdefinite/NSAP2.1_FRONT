import React,{useState,useEffect} from 'react'
import axios from 'axios';
import './PreviewPage.css';
import {
    Grid
  } from '@mui/material' 
  
function Preview() {
    const [getAllBpl, setAllBpl] = useState([])
  const storedData = localStorage.getItem('applicationNo')
  console.log('confirm: ',storedData)
  const getGithubData = () => {
    let endpoints = [
      `http://localhost:9000/api/v1/beneficiaryRegistration/getAllRegistrationData/${storedData}`
    ];
    Promise.all(endpoints.map((endpoint) => axios.get(endpoint))).then(([{data: allBpl}] )=> {
      setAllBpl(allBpl)
      console.log('Preview:',getAllBpl)
     
    });
  }
  useEffect(() => {
    
    getGithubData();
    
  }, [])
  const dateOfBirth = new Date(getAllBpl.dateOfBirth);
  const consentDate = new Date(getAllBpl.consentDate);
  return (
    
    <div className="myText">
      <h1>Preview</h1>
      <div className="preview-content">
        <div className="preview-section">
          <h2>Beneficiary Personal Details</h2>
          <Grid container spacing={0}>
          <Grid item xs={12} sm={3}>
          <p><b>Beneficiary Name:</b> {getAllBpl.beneficiaryName}</p> 
          </Grid>
          <Grid item xs={12} sm={3}>
          <p><b>Husband/Father Name:</b> {getAllBpl.fatherHusbandName}</p>
          </Grid>
          <Grid item xs={12} sm={3}>
          <p><b>Gender:</b> {getAllBpl.genderName}</p>
          </Grid>
          <Grid item xs={12} sm={3}>
          <p><b>Date of Birth:</b> {dateOfBirth.toLocaleDateString()}</p>
          </Grid>
          <Grid item xs={12} sm={3}>
          <p><b>Mobile No:</b> {getAllBpl.mobileNo}</p>
         </Grid>
         <Grid item xs={12} sm={3}>
         <p><b>Address1:</b> {getAllBpl.address1}</p>
         </Grid>
         <Grid item xs={12} sm={3}>
         <p><b>Address2:</b> {getAllBpl.address2}</p>
         </Grid>
         <Grid item xs={12} sm={3}>
         <p><b>Address3:</b> {getAllBpl.address3}</p>
         </Grid>
         <Grid item xs={12} sm={3}>
         <p><b>Pincode:</b> {getAllBpl.pincode}</p>
         </Grid>
         <Grid item xs={12} sm={3}>
         <p><b>Category:</b> {getAllBpl.categoryName}</p>
         </Grid>
         <Grid item xs={12} sm={3}>
         <p><b>Annual Income:</b> {getAllBpl.annualIncome}</p>
         </Grid>
         <Grid item xs={12} sm={3}>
         <p><b>Epic No:</b> {getAllBpl.epicNo}</p>
         </Grid>
         <Grid item xs={12} sm={3}>
         <p><b>Ration Card No:</b> {getAllBpl.rationcardNo}</p>
         </Grid>
         <Grid item xs={12} sm={3}>
         <p><b>Minority Status:</b> {String(getAllBpl.minorityStatus)}</p>
         </Grid>
         <Grid item xs={12} sm={3}>
         <p><b>Widow Status:</b> {String(getAllBpl.widowsStatus)}</p>
         </Grid>
         <Grid item xs={12} sm={3}>
         <p><b>Area:</b> {getAllBpl.ruralUrbanAreaName}</p>
         </Grid>
         </Grid>
          </div>
        <div className="preview-section">
          <h2>Beneficiary Bank Details</h2>
          <Grid container spacing={0}>
          <Grid item xs={12} sm={3}>
          <p><b>Bank/PO Account No:</b> {getAllBpl.bankPoAccountNo}</p> 
          </Grid>
          <Grid item xs={12} sm={3}>
          <p><b>IFSC Code:</b> {getAllBpl.ifscCode}</p>
          </Grid>
          <Grid item xs={12} sm={3}>
          <p><b>Bank Type:</b> {getAllBpl.bankTypeName}</p>
          </Grid>
          <Grid item xs={12} sm={3}>
          <p><b>Branch Name:</b> {getAllBpl.bankBranchName}</p>
          </Grid>
          
         
         </Grid>
          
        </div>
        {/* Add more sections as needed */}
        <div className="preview-section">
          <h2>Beneficiary Aadhar Details</h2>
          <Grid container spacing={0}>
          <Grid item xs={12} sm={3}>
          <p><b>Consent Date:</b> {consentDate.toLocaleDateString()}</p> 
          </Grid>
          <Grid item xs={12} sm={3}>
          <p><b>Aadhar Number:</b> {getAllBpl.uidNo}</p>
          </Grid>
         </Grid>
          </div>
        <div className="preview-section">
          <h2>Beneficiary BPL Details</h2>
          <Grid container spacing={0}>
          <Grid item xs={12} sm={3}>
          <p><b>BPL Year:</b> {getAllBpl.bplYear}</p> 
          </Grid>
          <Grid item xs={12} sm={3}>
          <p><b>Location:</b> {getAllBpl.bplLocation}</p>
          </Grid>
          <Grid item xs={12} sm={3}>
          <p><b>Family Id No:</b> {getAllBpl.bplFamilyId}</p>
          </Grid>
          <Grid item xs={12} sm={3}>
          <p><b>Member Id:</b> {getAllBpl.bplMemberId}</p>
          </Grid>
          
          
         </Grid>
          
        </div>
      </div>
      </div>
    
    
  ) 
}

export default Preview
