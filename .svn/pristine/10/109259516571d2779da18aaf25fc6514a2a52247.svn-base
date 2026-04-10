import React, { } from 'react';
import { Alert, AlertTitle } from '@mui/material';

function AlertSucess(props) {

  const handleClose = () => {
    props.setShowAlert(false);
  };

  const customStyles = {
    paddingBottom: '30px', // Add your desired padding value here
  };

  return (
    <div>
      
        <Alert severity="success" style={customStyles} onClose={handleClose}>
          <AlertTitle>Success</AlertTitle>
          <strong>{props.msg} has been submitted successfully!</strong>
        </Alert>
      
    </div>
  );
}

export default AlertSucess;
