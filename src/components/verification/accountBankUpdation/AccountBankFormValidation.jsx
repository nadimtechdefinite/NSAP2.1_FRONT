import axiosInstance from 'hooks/useAuthTokenUrl';
export const accountBankFormValidation = async  (selectedRows, getAllDistrictTemp,getAllDistrict) => {
    const errors = [];
    const isDataValid = await Promise.all(selectedRows.map(async (id) => {
    const selectedRowTwo = getAllDistrictTemp.find((row) => row.sanctionOrderNo === id);  
    const selectedRowOne = getAllDistrict.find((row) => row.sanctionOrderNo === id); 
     
    if((selectedRowOne && selectedRowTwo) !=null){

      if((selectedRowOne.bankPoAccountNo.length<8 )){
        errors.push("Please enter a valid account number.");
      }
    if(selectedRowTwo.disbursementCode===selectedRowOne.disbursementCode && selectedRowTwo.bankPoAccountNo===selectedRowOne.bankPoAccountNo && selectedRowTwo.ifscCode===selectedRowOne.ifscCode){
      errors.push('Please make necessary changes for bank/account updation.');
   }
     if(selectedRowOne.ifscCode != null){
      var ifscValidatorResult=  await getIfscDataChecking(selectedRowOne.ifscCode)
      if(ifscValidatorResult===false){
        errors.push('Invalid IFSC code with sanction order no '+selectedRowOne.sanctionOrderNo);
      }
    }
}
 
if(errors.length==0 && selectedRowOne.aadharVerify=== false){
  errors.push('Kindly update valid details.');
}

}));
console.log(isDataValid);
return errors;
};
  const getIfscDataChecking = async (ifscValue) => {
    try {
        const findAllCriteriaUrl = `/bank-account-updation/getCheckCorrectIFSCOrNot/${ifscValue}`;
        const response = await axiosInstance.get(findAllCriteriaUrl);
        return response.data;
    } catch (error) {
      console.error('Error fetching ifsc data:', error);
    }
  };