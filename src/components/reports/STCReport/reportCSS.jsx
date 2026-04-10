import { makeStyles } from '@mui/styles';

const useStyles = makeStyles({
  root: {
    border: '1px solid #e0e0e0', // Set border for the entire DataGrid
    '& .MuiDataGrid-cell': {
      borderBottom: '1px solid #e0e0e0', // Set bottom border for cells
      borderRight: '1px solid #e0e0e0', // Set right border for cells
      textAlign: 'right !important'
    },
    '& .MuiDataGrid-columnHeader, .MuiDataGrid-rowHeader': {
      borderBottom: '1px solid #e0e0e0', // Set bottom border for header cells
      borderRight: '1px solid #e0e0e0' // Set right border for header cells
    },
    '& .MuiDataGrid-row': {
      '&:nth-of-type(odd)': {
        backgroundColor: '#f2f2f2' // Grey background color for even rows
      },
      '&:nth-of-type(even)': {
        backgroundColor: '#ffffff' // White background color for odd rows
      }
    },
    // New style for table-dark
    '& .table-dark': {
      backgroundColor: '#33b5e5',
      color: '#fff' // White text color
    }
  }
});

export default useStyles;
