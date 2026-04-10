import React, { useState } from 'react';
import MainCard from 'ui-component/cards/MainCard';
import { Grid, CircularProgress } from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import PensionersLinkedPersonalDetails from '../PensionersLinkedPersonalDetails';
import axiosInstance from 'hooks/useAuthTokenUrl';

const PostOfficeSummeryCountReports = ({ BankTypeStatus, PostOfficeCountDetails }) => {
  const [pensionersPersonalDetails, setPensionersPersonalDetails] = useState([]);
  const [loading, setLoading] = useState(false);

  const columns = [
    {
      field: 'districtName',
      headerName: 'District Name',
      width: 200
    },
    {
      field: 'ruralUrbanArea',
      headerName: 'Rural/Urban',
      width: 100
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
      field: 'postOfficeName',
      headerName: 'Post Office Name',
      width: 400
    },
    {
      field: 'micrCode',
      headerName: 'MICR Code',
      width: 200
    },
    {
      field: 'totCount',
      headerName: 'Number of Beneficiaries',
      width: 200,
      renderCell: (params) => (
        <span
          style={{ color: 'blue', cursor: 'pointer' }}
          onClick={() => handlePensionesPostOffice(params.row.pdaCode)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              handlePensionesPostOffice(params.row.pdaCode);
            }
          }}
          role="button"
          tabIndex={0}
        >
          {params.value}
        </span>
      )
    }
  ];

  const handlePensionesPostOffice = (pdaCode) => {
    console.log(pdaCode);
    fetchPostOfficePensionesDetailsData(pdaCode);
  };

  const fetchPostOfficePensionesDetailsData = async (pdaCode) => {
    console.log('pdaCode : ', pdaCode);
    try {
      setLoading(true);
      setPensionersPersonalDetails([]);
      const getUrl = `/login/report/findAllPostOfficeBeneficiariesPersonalDetails/${pdaCode}`;
      const response = await axiosInstance.get(getUrl);
      const newData = response.data.map((row, index) => ({
        ...row,
        id: row.sanctionOrderNo,
        serialNo: index + 1 // Serial number starts from 1
      }));
      setPensionersPersonalDetails(newData);
    } catch (error) {
      console.log('Error  : ', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ marginTop: '20px' }}>
      {loading && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 9999,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <CircularProgress />
        </div>
      )}
      <MainCard title="Post Office Summery Details">
        <Grid container spacing={2}>
          <DataGrid
            getRowId={(row) => row.serialNo}
            rows={PostOfficeCountDetails}
            columns={columns}
            slots={{ toolbar: GridToolbar }}
            slotProps={{
              toolbar: {
                showQuickFilter: true,
                printOptions: { disableToolbarButton: true },
                csvOptions: { fileName: `PostOfficeCountDetails${BankTypeStatus}` }
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

      {!pensionersPersonalDetails.length == 0 && (
        <PensionersLinkedPersonalDetails BankTypeStatus={BankTypeStatus} BeneficiariesCountDetails={pensionersPersonalDetails} />
      )}
    </div>
  );
};
export default PostOfficeSummeryCountReports;
