import React from 'react';
import { Grid } from '@mui/material';
import MainCard from 'ui-component/cards/MainCard';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
const VerifiedNonVerifiedBeneficiariesCountDetails = ({ BeneficiariesStatus, BeneficiariesCountDetails }) => {
  // console.log('BeneficiariesStatus : ', BeneficiariesStatus);
  // console.log('BeneficiariesCountDetails : ', BeneficiariesCountDetails);
  const columns = [
    {
      field: 'serialNo',
      headerName: 'S.No.',
      width: 100,
      align: 'center',
      headerAlign: 'center', // Align the header to the center
      renderCell: (params) => <span style={{ display: 'flex', justifyContent: 'center' }}>{params.value}</span>
    },
    {
      field: 'sanctionOrderNo',
      headerName: 'Sanction Order No',
      width: 140
    },

    {
      field: 'applicantName',
      headerName: 'Applicant Name',
      width: 140
    },
    {
      field: 'fatherHusbandName',
      headerName: 'Father/Husband Name',
      width: 140
    },
    {
      field: 'nameAsPerAccount',
      headerName: 'Name as per Bank',
      width: 140
    },

    {
      field: 'verificationStatus',
      headerName: 'Verification Status',
      width: 140
    },
    {
      field: 'pfmsBankPoAccountNo',
      headerName: 'PFMS A/C No',
      width: 140
    },
    {
      field: 'pfmsIfscCode',
      headerName: 'PFMS IFSC',
      width: 140
    },
    {
      field: 'pfmsBankName',
      headerName: 'Bank Name',
      width: 140
    },
    {
      field: 'cpsmsBeneficiaryId',
      headerName: 'PFMS ID',
      width: 140
    },
    {
      field: 'bankPoAccountNo',
      headerName: 'Account No',
      width: 140
    },
    {
      field: 'ifscCode',
      headerName: 'IFSC Code',
      width: 140
    }
  ];
  return (
    <div>
      <div style={{ marginTop: '20px' }}>
        <MainCard title={BeneficiariesStatus + ' BENEFICIARIES DETAILS'}>
          <Grid container spacing={2}>
            <DataGrid
              getRowId={(row) => row.sanctionOrderNo}
              rows={BeneficiariesCountDetails}
              columns={columns}
              slots={{ toolbar: GridToolbar }}
              slotProps={{
                toolbar: {
                  showQuickFilter: true,
                  printOptions: { disableToolbarButton: true },
                  csvOptions: { fileName: 'VERIFIED-NON-VERIFIED-BENEFICIARIES-DETAILS' }
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
    </div>
  );
};

export default VerifiedNonVerifiedBeneficiariesCountDetails;
