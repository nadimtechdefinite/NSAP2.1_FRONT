// components/common/ResponseDialog.jsx
import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { green, red } from '@mui/material/colors';

const ResponseDialog = ({ open, onClose, type = 'success', message }) => {
  const isSuccess = type === 'success';

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>
        <span
          style={{
            color: isSuccess ? green[600] : red[600],
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            font: 'icon'
          }}
        >
          {isSuccess ? (
            <>
              <CheckCircleIcon />
              Success!!
            </>
          ) : (
            <>
              <ErrorOutlineIcon />
              Error
            </>
          )}
        </span>
      </DialogTitle>
      <DialogContent>
        <Typography>{message}</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="contained" color={isSuccess ? 'success' : 'error'}>
          OK
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ResponseDialog;
