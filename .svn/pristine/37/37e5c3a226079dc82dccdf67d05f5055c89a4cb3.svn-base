import React /* {useState,useEffect} */ from 'react';
import { useLocation } from 'react-router-dom';
import Typography from '@mui/material/Typography';

function ComputationDetailsAfterComputation() {
  const location = useLocation();
  const data = location.state && location.state.data;
  const stateName = data.stateName;
  const districtName = data.districtName;
  const subDistrictName = data.subDistrictMunicipalAreaName;
  const payableUpto = data.payableUpto;
  const dateObject = new Date(payableUpto);
  const month = dateObject.toLocaleString('default', { month: 'long' });

  const year = dateObject.getFullYear();

  return (
    <div>
      <Typography variant="h3">Computation has been completed</Typography>
      <Typography variant="body1">
        <br></br>
        <strong>State Name :</strong> {stateName}
        <br></br>
        <strong>District Name :</strong> {districtName}
        <br></br>
        {subDistrictName !== undefined && subDistrictName !== null && (
          <>
            <strong>Sub District Name :</strong> {subDistrictName}
          </>
        )}
        <br></br>
        <strong>Month :</strong> {month}
        <br></br>
        <strong>Year :</strong> {year}
      </Typography>
    </div>
  );
}

export default ComputationDetailsAfterComputation;
