export const validateAadharConsentForm = (selectedRows, getAllDistrict) => {
  const errors = [];

  const isuidName = selectedRows.every((rowId) => {
    const selectedRow = getAllDistrict.find((row) => row.sanctionOrderNo === rowId);
    return selectedRow && selectedRow.nameasUid !== null;
  });

  if (!isuidName) {
    errors.push('Please fill name as per aadhaar for all selected rows.');
  }

  const isuidNo = selectedRows.every((rowId) => {
    const selectedRow = getAllDistrict.find((row) => row.sanctionOrderNo === rowId);
    return selectedRow && selectedRow.uidNo !== null;
  });

  if (!isuidNo) {
    errors.push('Please fill aadhaar for all selected rows.');
  }

  const isAadharChanges = selectedRows.every((rowId) => {
    const selectedRow = getAllDistrict.find((row) => row.sanctionOrderNo === rowId);
    return selectedRow && selectedRow.aadharVerify === true;
  });

  if (!isAadharChanges) {
    errors.push('Please change necessary details for aadhaar verified.');
  }

  return errors;
};
