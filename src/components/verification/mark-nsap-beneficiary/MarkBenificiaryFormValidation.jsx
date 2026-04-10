
export const accountBankFormValidation = (getAllDistrict) => {
    const errors = [];
var countTrue = 0;
getAllDistrict.forEach((item) => {
  if (item.checkedBenefiary === "true") {
    countTrue++;
  }
});

if(countTrue === 0){
    errors.push('Kindly checked atleast one checkbox.');
  }
return errors;
};
  