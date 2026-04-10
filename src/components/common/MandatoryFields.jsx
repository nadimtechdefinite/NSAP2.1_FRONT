import React ,{} from 'react'
import {  Alert } from '@mui/material';

function MandatoryFields(props) {
    console.log(props.showValidationPop);
  return (
    <div>
       {/* Popup for mandatory field validation */}
    
            <Alert severity="error" sx={{ width: '100%' }}>
              Please fill in {props.fieldName} fields.
            </Alert>
          
        
    </div>
  )
}

export default MandatoryFields
