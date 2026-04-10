export const validateForm = (selectedRows, getAllDistrict) => {
  const errors = [];

  // Check if remarks are filled for each selected row
  const isRemarksValid = selectedRows.every((rowId) => {
    const selectedRow = getAllDistrict.find((row) => row.sanctionOrderNo === rowId);
    return selectedRow && selectedRow.creationRemarks !== null && selectedRow.creationRemarks.trim() !== '';
  });


  if (!isRemarksValid) {
    errors.push('Please fill in remarks for all selected rows.');
  }
// Validate "Status" field
const isStatusValid = selectedRows.every((rowId) => {
  const selectedRow = getAllDistrict.find((row) => row.sanctionOrderNo === rowId);
  return selectedRow && (selectedRow.eligstatus !== null &&  selectedRow.eligstatus !== '');
});

if (!isStatusValid) {
  errors.push('Please ensure that "Status" is filled for all selected rows');
  
}

// Validate "To Be Continued" field
const isContinuedValid = selectedRows.every((rowId) => {
  const selectedRow = getAllDistrict.find((row) => row.sanctionOrderNo === rowId);
  return selectedRow && selectedRow.continued !== null ;
});

if (!isContinuedValid) {
  errors.push('Please ensure that "To Be Continued" is filled for all selected rows.');

}
// Validate status and "To Be Continued" fields
const isStatusandcontinueValid = selectedRows.every((rowId) => {
  const selectedRow = getAllDistrict.find((row) => row.sanctionOrderNo === rowId);
  console.log("yuyuyu"+rowId+"===="+ selectedRow.eligstatus +" ===="+selectedRow.continued );
  return (
    (selectedRow && selectedRow.eligstatus == 'ELI' && selectedRow.continued == 'YES') ||
    (selectedRow && selectedRow.eligstatus != 'ELI' && selectedRow.continued != 'YES') 
  );
});

if (!isStatusandcontinueValid) {
  errors.push('Kindly select  "To Be Continued" for all selected rows.');
 
}



// const isVerificationDateValid = selectedRows.every((rowId) => {
//   const selectedRow = getAllDistrict.find((row) => row.sanctionOrderNo === rowId);
//   console.log("test date"+selectedRow.verifyingDate);
//   return selectedRow && selectedRow.verifyingDate !== null /* && selectedRow.verifyingDate.trim() !== '' */;
// });
// if (!isVerificationDateValid) {
//   errors.push('Please select Verification Date.');
 
// }
// const isApprovingDateValid = selectedRows.every((rowId) => {
//   const selectedRow = getAllDistrict.find((row) => row.sanctionOrderNo === rowId);
//   return selectedRow && selectedRow.approvingDate !== null/*  && selectedRow.approvingDate.trim() !== '' */;
// });
// if (!isApprovingDateValid) {
//   errors.push('Please select Approving Date');
 
// }
  // // Validate "Verifying Authority" and "Date of Verification" fields
  // const isVerificationValid = selectedRows.every((rowId) => {
  //   const selectedRow = getAllDistrict.find((row) => row.sanctionOrderNo === rowId);
  //   return selectedRow && selectedRow.veryfyingAuthority !== null && selectedRow.verifyingDate !== null;
  // });

  // if (!isVerificationValid) {
  //   errors.push('Please ensure that "Verifying Authority" and "Date of Verification" are filled for all selected rows.');
  // }

  

  // Add more validations as needed

  return errors;
};