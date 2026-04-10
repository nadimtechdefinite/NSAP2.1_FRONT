import React, { useState, useEffect } from 'react';
import axiosInstance from 'hooks/useAuthTokenUrl';
import { Button,Breadcrumbs,Link,Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import DataTable from 'mui-datatables';
import MainCard from 'ui-component/cards/MainCard';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import 'components/masters/criteria/criteria.css'
import { useNavigate } from "react-router-dom";
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { Table, TableBody, TableCell, TableContainer, TableRow, Paper } from '@mui/material';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));

export default function UpdateCriteria() { 

  const [open, setOpen] = useState(false);
  const handleClose = () => {
    setOpen(false);
  };
  const [criteriaData, setCriteriaData] = useState({
    conditionOne: '',
    operatorOne: '',
    valueOne: '',
    logicalOperator: '',
    operatorTwo: '',
    valueTwo: '',
    schemeCode: '',
    gender: '',
    bpl: '',
    stateCode: '',
    userCreated: '',
    dateFormatted: '',
  });
  const navigate = useNavigate();
  const [snackbar, setSnackbar] = useState(null);
  const handleCloseSnackbar = () => setSnackbar(null);
  const [getAllCriteria, setAllCriteria] = useState([]);
  const getCriteriaData = async () => {
    try {
      const findAllCriteriaUrl = '/criteria-master/findAllCriteria/list';
      const response = await axiosInstance.get(findAllCriteriaUrl);  
      setAllCriteria(response.data);
    } catch (error) {
      console.error('Error fetching criteria data:', error);
    }
  };

  useEffect(() => {
    getCriteriaData();
  }, []);

  const columns = [
    {
      name: 'criteriaId',
      label: 'Criteria Id',
    },
    {
      name: 'schemeName',
      label: 'Scheme Name',
    },
    {
      name: 'condition',
      label: 'Condition',
    },
    {
      name: 'createdBy',
      label: 'Created By',
    },
    {
      name: 'date',
      label: 'Date',
    },
    {
      name: 'schemeApplicableTo',
      label: 'Scheme Applicable To',
    },
    { 
      name: 'bpl',
      label: 'BPL',
    },
    {
      name: 'status',
      label: 'Status',
    },
    { 
      name: 'View',
      options: {
        filter: false,
        customBodyRender: (value, tableMeta) => (
          <Button variant="text" title='View' color="success" onClick={() => handleView(tableMeta.rowData)}>
            <RemoveRedEyeIcon />
          </Button>
        ),
      },
    },
    {
      name: 'Edit',
      options: {
        filter: false,
        customBodyRender: (value, tableMeta) => (
          <Button variant="text" title='Edit' color="info" onClick={() => handleEdit(tableMeta.rowData)}>
            <EditIcon />
          </Button>
        ),
      },
    },
    {
      name: 'Delete',
      options: {
        filter: false,
        customBodyRender: (value, tableMeta) => (
          <Button variant="text" title='Delete' color="error" onClick={() => handleDelete(tableMeta.rowData)}>
            <DeleteIcon />
          </Button>
        ),
      },
    },
  ];

  const options = {
    filter: false,
    download: true,
    print: false,
    selectableRows: 'none',
    downloadOptions: {
      filename: 'list_of_criteria_data.csv', // Specify the filename for the downloaded file
      separator: ',',
    },
  };

  const handleView = (rowData) => {
    //alert(' View record for id -- '+rowData[0])
    localStorage.setItem("crViewId", rowData[0]);
    setOpen(true);
    getCriteriaDataView(rowData[0]);
    //navigate('/masters/criteria/view');
  };

  const getCriteriaDataView = async () => {
    try {
      const findAllCriteriaUrl = '/criteria-master/findAllCriteria/' + localStorage.getItem('crViewId');
      const res = await axiosInstance.get(findAllCriteriaUrl);
      setCriteriaData(res.data);
    } catch (error) {
      console.error('Error fetching criteria data:', error);
    }
  };

  const handleEdit = (rowData) => {
    console.log('Editing:', rowData);
    localStorage.setItem("crUpdateId", rowData[0]);
    //var result = window.confirm("Are you sure want to Edit? ")
     //if (result) {
      navigate('/masters/criteria/singleUpdate/');
    // }
  };

  const handleDelete = async (rowData) => {
    var result = window.confirm("Are you sure want to Inactive the record? ")
    var stFlag=rowData[7];
    if(stFlag=='Active'){
    if (result) {
    try {
      const deleteCriteriaUrl = '/criteria-master/findAllCriteria/'+rowData[0];
      const response = await axiosInstance.delete(deleteCriteriaUrl);
      console.log('Record deleted status :'+response.status);
      if (response.status >= 200 ) {
        setSnackbar({ children: 'Record inactive successfully!' , severity: 'success' });
        //setAllCriteria((cr) => cr.filter((chkObj) => chkObj.criteriaId !== rowData[0]));
        getCriteriaData();
      } 
    } catch (error) {
      console.error('Error deleted criteria data:', error);
      setSnackbar({ children: 'Error in deleting record' , severity: 'error' });
    }
  }
  }else{
      alert("Record is already Inactive!");
  }
  };

  return (
    <>
    {!!snackbar && (  
        <Snackbar
          open
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          onClose={handleCloseSnackbar}
          autoHideDuration={6000}
        >
          <Alert {...snackbar} onClose={handleCloseSnackbar} style={{marginLeft:'130px'}}/>
        </Snackbar>
)}
    <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb" style={{ marginBottom: '20px' }}>
          <Link id="link" color="inherit" href="#" style={{color:'blue'}} title='Home'>
            Home
          </Link>
          <Link color="inherit" href="#" style={{color:'blue'}} title='Masters'>
            Masters
          </Link>
          <Typography color="textInfo" title='List Of Criteria'>List Of Criteria</Typography>
        </Breadcrumbs>
      <MainCard title="List Of Criteria">
      <DataTable title="" columns={columns} data={getAllCriteria} options={options} />
      </MainCard>

      <BootstrapDialog 
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}>
        <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title"
        style={{width:'600px',textAlign:'center',backgroundColor:'cadetblue',color:'white',fontSize:'15px'}}>
        <u>View Criteria Master</u>
        </DialogTitle>
        <IconButton title='Close' style={{backgroundColor:'white'}}
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}>
          <CloseIcon />
        </IconButton>
        <DialogContent dividers>
        <TableContainer component={Paper}>
      <Table>  
        <TableBody>
          <TableRow>
            <TableCell><b>Scheme Name</b></TableCell>
            <TableCell>{criteriaData.schemeCode}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell><b>Condition</b></TableCell>
            <TableCell>{criteriaData.conditionOne}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell><b>Operator1</b></TableCell>
            <TableCell>{criteriaData.operatorOne}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell><b>Value1</b></TableCell>
            <TableCell>{criteriaData.valueOne}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell><b>Logical Operator</b></TableCell>
            <TableCell>{criteriaData.logicalOperator}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell><b>Operator2</b></TableCell>
            <TableCell>{criteriaData.operatorTwo}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell><b>Value2</b></TableCell>
            <TableCell>{criteriaData.valueTwo}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell><b>Scheme applicable to</b></TableCell>
            <TableCell>{criteriaData.gender === 'M' ? "Male" : (criteriaData.gender === 'F' ? "Female" : criteriaData.gender === 'A' ? "All" : "Transgender")}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell><b>BPL</b></TableCell>
            <TableCell>{criteriaData.bpl === 'N' ? "No" : criteriaData.bpl === 'Y' ? "Yes" :"" }</TableCell>
          </TableRow>
          <TableRow>
            <TableCell><b>Created/Updated By</b></TableCell>
            <TableCell>{criteriaData.userCreated}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell><b>Created/Updated Date</b></TableCell>
            <TableCell>{criteriaData.dateFormatted} </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>  
        </DialogContent>
        <DialogActions>
          <Button style={{pointerEvents:'none'}}>  
          </Button>
        </DialogActions>
      </BootstrapDialog>
    </>
  );
}
  