export const validateAadharConsentFormVerified =   (getAllDistrict,sanctionOrderNumber,updateName,updateNo) => {
    var aadharCheck = 'false';
    const selectedRow = getAllDistrict.find((row) => row.sanctionOrderNo === sanctionOrderNumber);  
  if(selectedRow){

    //alert("---:: "+selectedRow.nameasUid+" - "+updateName);
    //alert("--->> "+selectedRow.uidNo+" - "+updateNo);
     //if(selectedRow.nameasUid===updateName && selectedRow.uidNo===updateNo){
     // aadharCheck = 'false';
     //}
    // if(selectedRow.nameasUid===updateName){
    //   aadharCheck = 'false';
    //  }
    //  else if(selectedRow.uidNo===updateNo){
    //   aadharCheck = 'false';
    //  }
     if(selectedRow.uidNo===updateNo){
      aadharCheck = 'false';
     }
     else{
      aadharCheck = 'true';
     }
}  
    return aadharCheck;
  };