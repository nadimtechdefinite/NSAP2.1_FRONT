import { Backdrop, CircularProgress } from '@mui/material';
import React, { useState, useEffect } from 'react';
import MainCard from 'ui-component/cards/MainCard';
import axiosInstance from 'hooks/useAuthTokenUrl';
import { Box } from '@mui/system';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';

function ComplaintReport() {
  const [loading, setLoading] = useState(false);
  const [listData, setlistData] = useState([]);
  const [listDataUser, setlistDataUser] = useState([]);
  const [listDataModule, setlistDataModule] = useState([]);
  const [listDataDate, setlistDataDate] = useState([]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const getUrl = `/complain-management/findAllComplainReport`;
      const response = await axiosInstance.get(getUrl);

      if (response.status >= 200 && response.status < 300) {
        return response.data;
      } else {
        throw new Error('Data could not be fetched!', response.status);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      throw error; // Re-throw the error to be handled by the caller
    } finally {
      setLoading(false); // Set loading state to false regardless of success or failure
    }
  };

  useEffect(() => {
    fetchData()
      .then((res) => {
        setlistData(res.countList);
        setlistDataUser(res.countListUser);
        setlistDataModule(res.countListModule);
        setlistDataDate(res.countListDate);
      })
      .catch((e) => {
        console.log(e.message);
      });
  }, []);

  const columns = [
    {
      field: 'id',
      headerName: 'S. No.',
      flex: 0.5
    },
    {
      field: 'stateName',
      headerName: 'State Name',
      flex: 1.5
    },
    {
      field: 'pending',
      headerName: 'Pending Complaint',
      flex: 1.5,
      type: 'number'
    },
    {
      field: 'inProcess',
      headerName: 'In Process',
      flex: 1.5,
      type: 'number'
    },
    {
      field: 'resolved',
      headerName: 'Resolved',
      flex: 1.5,
      type: 'number'
    },
    {
      field: 'total',
      headerName: 'Total',
      flex: 1.5,
      type: 'number'
    },
    // {
    //   field: 'subtotal',
    //   headerName: 'Subtotal',
    //   flex: 1.5,
    //   type: 'number',
    //   renderCell: (params) => <strong>{params.row.total + params.row.pending + params.row.inProcess + params.row.resolved}</strong>
    // }
  ];

  const columnsNSAPUser = [
    {
      field: 'id',
      headerName: 'S. No.',
      flex: 0.5
    },
    {
      field: 'userCode',
      headerName: 'Nsap User Id',
      flex: 1.5
    },
    {
      field: 'userName',
      headerName: 'Nsap User Name',
      flex: 1.5
    },
    {
      field: 'pending',
      headerName: 'Pending Complaint',
      flex: 1.5
    },
    {
      field: 'inProcess',
      headerName: 'In Process',
      flex: 1.5
    },
    {
      field: 'resolved',
      headerName: 'Resolved',
      flex: 1.5
    },
    {
      field: 'total',
      headerName: 'Total',
      flex: 1.5
    }
  ];

  const columnsModule = [
    {
      field: 'id',
      headerName: 'S. No.',
      flex: 0.5
    },
    {
      field: 'module',
      headerName: 'Module Name',
      flex: 1.5
    },
    {
      field: 'subModule',
      headerName: 'Sub Module Name',
      flex: 1.5
    },
    {
      field: 'pending',
      headerName: 'Pending Complaint',
      flex: 1.5
    },
    {
      field: 'inProcess',
      headerName: 'In Process',
      flex: 1.5
    },
    {
      field: 'resolved',
      headerName: 'Resolved',
      flex: 1.5
    },
    {
      field: 'total',
      headerName: 'Total',
      flex: 1.5
    }
  ];

  const columnsDate = [
    {
      field: 'id',
      headerName: 'S. No.',
      flex: 0.5
    },
    {
      field: 'dateWise',
      headerName: 'Date',
      flex: 1.5
    },
    {
      field: 'pending',
      headerName: 'Pending Complaint',
      flex: 1.5
    },
    {
      field: 'inProcess',
      headerName: 'In Process',
      flex: 1.5
    },
    {
      field: 'resolved',
      headerName: 'Resolved',
      flex: 1.5
    },
    {
      field: 'total',
      headerName: 'Total',
      flex: 1.5
    }
  ];

  const rows = listData.map((item, index) => ({
    id: index + 1,
    stateName: item.stateName,
    total: item.total,
    pending: item.pending,
    inProcess: item.inProcess,
    resolved: item.resolved
  }));

  const totalRow = {
    id: '',
    stateName: 'Grand Total',
    total: rows.reduce((acc, curr) => acc + curr.total, 0),
    pending: rows.reduce((acc, curr) => acc + curr.pending, 0),
    inProcess: rows.reduce((acc, curr) => acc + curr.inProcess, 0),
    resolved: rows.reduce((acc, curr) => acc + curr.resolved, 0)
  };

  // Add totalRow to rows array
  rows.push(totalRow);

  const rowsUSER = listDataUser.map((item, index) => ({
    id: index + 1,
    userCode: item.userCode,
    userName: item.userName,
    total: item.total,
    pending: item.pending,
    inProcess: item.inProcess,
    resolved: item.resolved
  }));

  const totalRowUSER  = {
    id: '',
    userCode: 'Grand Total',
    userName: '',
    total: rows.reduce((acc, curr) => acc + curr.total, 0),
    pending: rows.reduce((acc, curr) => acc + curr.pending, 0),
    inProcess: rows.reduce((acc, curr) => acc + curr.inProcess, 0),
    resolved: rows.reduce((acc, curr) => acc + curr.resolved, 0)
  };

  // Add totalRow to rows array
  rowsUSER.push(totalRowUSER);


  const rowsModule = Array.isArray(listDataModule)
    ? listDataModule.map((item, index) => ({
        id: index + 1,
        module: item?.module || '',
        subModule: item?.subModule || '',
        total: item?.total || 0,
        pending: item?.pending || 0,
        inProcess: item?.inProcess || 0,
        resolved: item?.resolved || 0
      }))
    : [];

    const totalRowModule = {
      id: '',
      module: 'Grand Total',
      subModule: '',
      total: rows.reduce((acc, curr) => acc + curr.total, 0),
      pending: rows.reduce((acc, curr) => acc + curr.pending, 0),
      inProcess: rows.reduce((acc, curr) => acc + curr.inProcess, 0),
      resolved: rows.reduce((acc, curr) => acc + curr.resolved, 0)
    };
  
    // Add totalRow to rows array
    rowsModule.push(totalRowModule);

  const rowsDate = Array.isArray(listDataDate)
    ? listDataDate.map((item, index) => ({
        id: index + 1,
        dateWise: item?.dateWise || '',
        total: item?.total || 0,
        pending: item?.pending || 0,
        inProcess: item?.inProcess || 0,
        resolved: item?.resolved || 0
      }))
    : [];


    const totalRowDate = {
      id: '',
      dateWise: 'Grand Total',
      total: rows.reduce((acc, curr) => acc + curr.total, 0),
      pending: rows.reduce((acc, curr) => acc + curr.pending, 0),
      inProcess: rows.reduce((acc, curr) => acc + curr.inProcess, 0),
      resolved: rows.reduce((acc, curr) => acc + curr.resolved, 0)
    };
  
    // Add totalRow to rows array
    rowsDate.push(totalRowDate);

  return (
    <div>
      <MainCard style={{ backgroundColor: '#333', color: 'white', padding: '10px' }}>
        <div style={{ borderBottom: '3px solid white', paddingBottom: '2px', textAlign: 'center' }}>
          <h3>Complaint Report</h3>
        </div>
      </MainCard>

      {/* Complaint Report Statewise */}

      <MainCard style={{ padding: '5px', marginTop: '5px' }}>
        <h3 style={{ marginBottom: '2px', textAlign: 'center', padding: '3px' }}>Complaint Report (State Wise)</h3>
        {rows.length !== 0 && (
          <Box sx={{ height: 700, width: '100%' }}>
            <DataGrid
              getRowId={(row) => row.id}
              slots={{ toolbar: GridToolbar }}
              slotProps={{
                toolbar: {
                  showQuickFilter: true
                }
              }}
              rows={rows}
              columns={columns}
              initialState={{
                pagination: {
                  paginationModel: {
                    pageSize: 10
                  }
                }
              }}
              pageSizeOptions={[10]}
              // checkboxSelection
              disableRowSelectionOnClick
            />
          </Box>
        )}
      </MainCard>

      {/* Complaintt Report (NSAP User Wise */}

      <MainCard style={{ padding: '5px', textAlign: 'center', marginTop: '5px' }}>
        <h4 style={{ marginBottom: '2px' }}>Complaint Report (NSAP User Wise)</h4>
        {rowsUSER.length !== 0 && (
          <Box sx={{ height: 700, width: '100%' }}>
            <DataGrid
              getRowId={(row) => row.id}
              slots={{ toolbar: GridToolbar }}
              slotProps={{
                toolbar: {
                  showQuickFilter: true
                }
              }}
              rows={rowsUSER}
              columns={columnsNSAPUser}
              initialState={{
                pagination: {
                  paginationModel: {
                    pageSize: 10
                  }
                }
              }}
              pageSizeOptions={[10]}
              // checkboxSelection
              disableRowSelectionOnClick
            />
          </Box>
        )}
      </MainCard>

      {/* Complaintt Report (Module Wise) */}

      <MainCard style={{ padding: '5px', marginTop: '5px', textAlign: 'center' }}>
        <h4 style={{ marginBottom: '2px' }}>Complaint Report (Module Wise)</h4>
        {rowsUSER.length !== 0 && (
          <Box sx={{ height: 700, width: '100%' }}>
            <DataGrid
              getRowId={(row) => row.id}
              slots={{ toolbar: GridToolbar }}
              slotProps={{
                toolbar: {
                  showQuickFilter: true
                }
              }}
              rows={rowsModule}
              columns={columnsModule}
              initialState={{
                pagination: {
                  paginationModel: {
                    pageSize: 10
                  }
                }
              }}
              pageSizeOptions={[10]}
              // checkboxSelection
              disableRowSelectionOnClick
            />
          </Box>
        )}
      </MainCard>

      {/* Complaintt Report (date Wise) */}

      <MainCard style={{ padding: '5px', marginTop: '5px', textAlign: 'center' }}>
        <h4 style={{ marginBottom: '2px' }}>Complaint Report (Date Wise)</h4>
        {rowsUSER.length !== 0 && (
          <Box sx={{ height: 700, width: '100%' }}>
            <DataGrid
              getRowId={(row) => row.id}
              slots={{ toolbar: GridToolbar }}
              slotProps={{
                toolbar: {
                  showQuickFilter: true
                }
              }}
              rows={rowsDate}
              columns={columnsDate}
              initialState={{
                pagination: {
                  paginationModel: {
                    pageSize: 10
                  }
                }
              }}
              pageSizeOptions={[10]}
              // checkboxSelection
              disableRowSelectionOnClick
            />
          </Box>
        )}
      </MainCard>

      <Backdrop open={loading} style={{ zIndex: 999, color: '#fff' }}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </div>
  );
}

export default ComplaintReport;
