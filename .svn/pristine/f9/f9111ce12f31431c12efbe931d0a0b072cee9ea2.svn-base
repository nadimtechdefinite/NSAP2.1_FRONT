import React from 'react';
import MainCard from 'ui-component/cards/MainCard';
import Typography from '@mui/material/Typography';
import { Grid } from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
const NPCIChargesReportDetails = ({ stateName, schemeName, finYearCode, monthDuration, setReportDetails }) => {
  const columns = [
    {
      field: 'serialNo',
      headerName: 'S.NO',
      width: 50
    },
    {
      field: 'monthYear',
      headerName: 'Month-Year',
      width: 100
    },
    {
      field: 'state_name',
      headerName: 'State',
      width: 150
    },
    {
      field: 'district_name',
      headerName: 'District',
      width: 150
    },
    {
      field: 'scheme_code',
      headerName: 'Scheme',
      width: 100
    },
    {
      field: 'total_record',
      headerName: 'Total Transaction',
      width: 200
    },
    {
      field: 'success_record',
      headerName: 'Successful Transaction',
      width: 200
    },
    {
      field: 'unsuccess_record',
      headerName: 'Unsuccessful Transaction',
      width: 200
    },
    {
      field: 'pending_record',
      headerName: 'Pending Transaction',
      width: 200
    },
    {
      field: 'transaction_charges',
      headerName: 'Transaction charges (.5*successful transaction)',
      width: 200
    },
    {
      field: 'fixed_charges',
      headerName: 'Fixed charges (5*successful transaction)',
      width: 200
    },
    {
      field: 'success_record_wrt_distinct_amount',
      headerName: '{No. of Successful Transaction , distinct amount}',
      width: 300
    },
    {
      field: 'success_record_wrt_vc_greater_5',
      headerName: 'No. of Successful Transactions for Variable Charges greater than Rs.5 (N)',
      width: 300
    },
    {
      field: 'total_amount_of_greater_5',
      headerName: 'Total amount of Transactions in column N',
      width: 200
    },
    {
      field: 'variable_Charges_VC1',
      headerName: 'Variable Charges VC1.',
      width: 200
    },
    {
      field: 'success_record_wrt_less_or_equal_5',
      headerName: 'Successful Transactions for Variable Charges Less or equal to Rs.5 (Q)',
      width: 300
    },
    {
      field: 'total_amount_of_less_or_equal_5',
      headerName: 'Total amount of Transactions in column Q',
      width: 200
    },
    {
      field: 'variable_Charges_VC2',
      headerName: 'Variable Charges VC2.',
      width: 200
    },
    {
      field: 'variable_charges',
      headerName: 'Total Variable charges (.5*amount of transaction)/100 . Subject to maximum of Rs.5/- ie. (VC1+VC2)',
      width: 300
    },
    {
      field: 'total_npci_charges',
      headerName: 'total_npci_charges',
      width: 200
    }
  ];
  return (
    <div style={{ marginTop: '20px' }}>
      <MainCard title="DETAILS">
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="h4" gutterBottom>
              State: {stateName} {' -> '} Scheme: {schemeName} {' -> '} Financial Year: {finYearCode} {' -> '} Duration: {monthDuration}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <DataGrid
              getRowId={(row) => row.serialNo}
              rows={setReportDetails}
              columns={columns}
              slots={{ toolbar: GridToolbar }}
              slotProps={{
                toolbar: {
                  showQuickFilter: true,
                  printOptions: { disableToolbarButton: true },
                  csvOptions: {
                    fileName: `StateName-${stateName}-Scheme-${schemeName}-FinYear-${finYearCode}-MonthDuration-${monthDuration}`
                  }
                }
              }}
              initialState={{
                pagination: {
                  paginationModel: {
                    pageSize: 10
                  }
                }
              }}
              pageSizeOptions={[10]}
              disableRowSelectionOnClick
            />
          </Grid>
        </Grid>
      </MainCard>
    </div>
  );
};
export default NPCIChargesReportDetails;
