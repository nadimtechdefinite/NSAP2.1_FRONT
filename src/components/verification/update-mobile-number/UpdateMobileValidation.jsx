export const updateMobileValidation =   (selectedRows, getAllDistrictTemp,getAllDistrict) => {
    const errors = [];
    const isDataValid = (selectedRows.map( (id) => {
    
    const selectedRowTwo = getAllDistrictTemp.find((row) => row.sanctionOrderNo === id);  
    const selectedRowOne = getAllDistrict.find((row) => row.sanctionOrderNo === id); 
    
    if(selectedRowOne.checkVerify=== null || selectedRowOne.checkVerify=== false){
    errors.push('Kindly provide valid details for Mobile No. updation.');
    }

   if(selectedRowOne.checkVerify=== true){
    if(selectedRowTwo.contactPersonMobile == selectedRowOne.contactPersonMobile){
        errors.push('Kindly provide valid details for Mobile No. updation.');
    }
}
}))
console.log(isDataValid);
return errors;
}
