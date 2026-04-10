import React from 'react';
import MainCard from 'ui-component/cards/MainCard';
import { Grid } from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';

const PensionersLinkedPersonalDetails = ({ BankTypeStatus, BeneficiariesCountDetails }) => {
  const columns = [
    {
      field: 'serialNo',
      headerName: 'S.No',
      width: 100
    },

    {
      field: 'sanctionOrderNumber',
      headerName: 'Sanction Order No.',
      width: 150
    },
    {
      field: 'applicantName',
      headerName: 'Applicant Name',
      width: 200
    },
    {
      field: 'fatherHusbandName',
      headerName: 'Father/Husband Name',
      width: 200
    },

    {
      field: 'beneficiaryNumber',
      headerName: 'Beneficiary Number',
      width: 200
    },
    {
      field: 'districtName',
      headerName: 'District Name',
      width: 150
    },
    {
      field: 'subDistrictMunicipalAreaName',
      headerName: 'Sub District Name',
      width: 200
    },
    {
      field: 'grampanchayatName',
      headerName: 'Grampanchayat Name',
      width: 200
    },
    {
      field: 'villageName',
      headerName: 'Village Name',
      width: 200
    },
    {
      field: 'schemeCode',
      headerName: 'Scheme Code',
      width: 200
    }
  ];
  // Conditionally add the bankAccountNumber column
  if (BankTypeStatus !== 'CASH') {
    columns.push({
      field: 'bankAccountNumber',
      headerName: BankTypeStatus === 'BANK' ? 'Bank Account' : 'Post Account No',
      width: 200
    });
  }
  return (
    <div style={{ marginTop: '20px' }}>
      <MainCard title="Pensioners Details">
        <Grid container spacing={2}>
          <DataGrid
            getRowId={(row) => row.serialNo}
            rows={BeneficiariesCountDetails}
            columns={columns}
            slots={{ toolbar: GridToolbar }}
            slotProps={{
              toolbar: {
                showQuickFilter: true,
                printOptions: { disableToolbarButton: true },
                csvOptions: { fileName: `PensionersDetails${BankTypeStatus}` }
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
      </MainCard>
    </div>
  );
};
export default PensionersLinkedPersonalDetails;
