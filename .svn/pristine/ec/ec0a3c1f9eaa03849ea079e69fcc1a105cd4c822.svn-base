import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import MainCard from 'ui-component/cards/MainCard';
import axiosInstance from 'hooks/useAuthTokenUrl';
import { DataGrid } from '@mui/x-data-grid';
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div role="tabpanel" hidden={value !== index} id={`simple-tabpanel-${index}`} aria-labelledby={`simple-tab-${index}`} {...other}>
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`
  };
}

export default function BasicTabs({ formData }) {
  const [value, setValue] = React.useState(0);
  //const [getDate, setData] = useState([]);
  const [rows, setRows] = useState([]);
  const [columns, setColumns] = useState([]);

  const [rowsDataGap, setRowsDataGap] = useState([]);

  const [rowsAmount, setRowsAmount] = useState([]);

  const fetchData = async (url) => {
    try {
      const response = await axiosInstance.post(url, formData);
      if (response.status >= 200 && response.status < 300) {
        return response.data;
      } else {
        throw new Error('Data could not be fetched: ' + response.status);
      }
    } catch (error) {
      console.error('Error fetching data:', error.message);
      throw error;
    }
  };

  const getPostUrl = (tabIndex) => {
    switch (tabIndex) {
      case 0:
        return '/computePension/previousComputationSummary';
      case 1:
        return '/computePension/computationDataGapSummary';
      case 2:
        return '/computePension/computationAmountSummary';
      default:
        return '/computePension/previousComputationSummary';
    }
  };

  useEffect(() => {
    const postUrl = getPostUrl(value);
    fetchData(postUrl)
      .then((res) => {
        //setData(res);
        console.log('RESPONSE DATA LOAD FIRST TIME : ', res);

        if (value === 0) {
          const locations = Object.keys(res);
          setRows(locations.map((location) => ({ id: location, ...res[location] })));

          // Extract columns dynamically based on the months
          const months = Object.keys(res[locations[0]]);
          const columnsData = [
            { field: 'id', headerName: 'Location', width: 150 },
            ...months.map((month) => ({
              field: month,
              headerName: month,
              width: 120,
              renderCell: (params) => (params.value ? <CheckIcon style={{ color: 'green' }} /> : <ClearIcon style={{ color: 'red' }} />)
            }))
          ];
          setColumns(columnsData);
        } else if (value === 1) {
          setRowsDataGap(res);
          console.log(rowsDataGap);
        } else if (value === 2) {
          setRowsAmount(res);
        }
      })
      .catch((e) => {
        console.log(e.message);
      });
  }, [value, formData]);

  const handleChange = (event, newValue) => {
    console.log('Select tab: ', newValue);
    setValue(newValue);
  };

  //Data Gap Column
  /* const columnsDataGapSum = [
  {
    field: 'paymentModeCountDBT',
    headerName: 'Payment Mode (DBT)',
    width: 200,
  },
  {
    field: 'paymentModeCountNONDBT',
    headerName: 'Payment Mode (NON DBT)',
    width: 150,
  },
  {
    field: 'undearAgeCount',
    headerName: 'Undear Age',
    width: 150,
  },
  {
    field: 'overAgeCount',
    headerName: 'Over Age',
    width: 200,
  },
  {
    field: 'livepensionerCount',
    headerName: 'Live Pensioners',
    width: 200,
  },
  {
    field: 'nullIFSCCodeCount',
    headerName: 'IFSC Code (NULL)',
    width: 200,
  },
  {
    field: 'bankPOAccountNotGivenCount',
    headerName: 'Bank PO Account (Not Given)',
    width: 200,
  },
  {
    field: 'poPDACodeNotGivenCount',
    headerName: 'PO PDA Code (Not Given)',
    width: 200,
  },
  {
    field: 'cashMoNotGivenCount',
    headerName: 'Cash MO (Not Given)',
    width: 200,
  },
  {
    field: 'ifscLengthNotCorrectCount',
    headerName: 'IFSC Length (Not Correct)',
    width: 200,
  }
  
]; */

  //End Data Gap

  //Data Amount Column
  const columnsAmountSum = [
    {
      field: 'subDistrictMunicipalAreaName',
      headerName: 'Sub District Name',
      width: 200
    },
    {
      field: 'beneficieries',
      headerName: 'Total Beneficieries',
      width: 150
    },
    {
      field: 'amountCentral',
      headerName: 'Amount (Central)',
      width: 150
    },
    {
      field: 'amountState',
      headerName: 'Amount (State)',
      width: 200
    },
    {
      field: 'amount',
      headerName: 'Total Amount',
      width: 200
    },
    {
      field: 'paymentMode',
      headerName: 'Payment Mode',
      width: 200
    }
  ];

  //End Amount column
  // Use useEffect to fetch data for the first tab when the component mounts
  useEffect(() => {
    const postUrl = getPostUrl(value);
    fetchData(postUrl)
      .then((res) => {
        // setData(res);

        console.log('RESPONSE DATA LOAD TAB CLICK TIME : ', res);

        if (value === 0) {
          const locations = Object.keys(res);
          setRows(locations.map((location) => ({ id: location, ...res[location] })));

          // Extract columns dynamically based on the months
          const months = Object.keys(res[locations[0]]);
          const columnsData = [
            { field: 'id', headerName: 'Location', width: 150 },
            ...months.map((month) => ({
              field: month,
              headerName: month,
              width: 120,
              renderCell: (params) => (params.value ? <CheckIcon style={{ color: 'green' }} /> : <ClearIcon style={{ color: 'red' }} />)
            }))
          ];
          setColumns(columnsData);
        } else if (value === 1) {
          setRowsDataGap(res);
        } else if (value === 2) {
          setRowsAmount(res);
        }
      })
      .catch((e) => {
        console.log(e.message);
      });
  }, []); // Empty dependency array to run only once when the component mounts

  const rowsDataGap1 = [
    {
      id: 1,
      Category: 'Payment Mode DBT',
      Count: 1,
      id2: 8,
      Category2: 'Payment Mode NON DBT',
      Count2: 1
    },
    {
      id: 7,
      Category: 'Bank PO Account Not Given',
      Count: 0,
      id2: 2,
      Category2: 'Cash MO Not Given',
      Count2: 0
    },
    {
      id: 3,
      Category: 'IFSC Length Not Correct',
      Count: 0,
      id2: 4,
      Category2: 'Live Pensioner',
      Count2: 468
    },
    {
      id: 5,
      Category: 'Null IFSC Code',
      Count: 0,
      id2: 6,
      Category2: 'Over Age',
      Count2: 0
    },

    {
      id: 9,
      Category: 'PO PDA Code Not Given',
      Count: 0,
      id2: 10,
      Category2: 'Undear Age',
      Count2: 468
    }
  ];

  const columnsDataGapSum1 = [
    { field: 'Category', headerName: '', width: 200 },
    { field: 'Count', headerName: 'Count', width: 200 },
    { field: 'Category2', headerName: '', width: 200 },
    { field: 'Count2', headerName: 'Count', width: 200 }
  ];

  return (
    <MainCard>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
          <Tab label="Previous Computation Summary" {...a11yProps(0)} />
          <Tab label="Computation Data Gap Summary" {...a11yProps(1)} />
          <Tab label="Computation Amount Summary" {...a11yProps(2)} />
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        {/* Your content for Tab 0 */}
        <div style={{ height: 400, width: '100%' }}>
          <DataGrid rows={rows} columns={columns} pageSize={5} rowsPerPageOptions={[5, 10, 20]} />
        </div>
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        {/* Your content for Tab 1 */}
        {/* <div style={{ height: 400, width: '100%' }}>
          <DataGrid getRowId={(row) => row.paymentModeCountDBT} rows={rowsDataGap} columns={columnsDataGapSum} pageSize={5} rowsPerPageOptions={[5, 10, 20]} />
        </div> */}

        <DataGrid rows={rowsDataGap1} columns={columnsDataGapSum1} autoHeight pagination={false} />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={2}>
        {/* Your content for Tab 2 */}
        <div style={{ height: 400, width: '100%' }}>
          <DataGrid
            getRowId={(row) => row.subDistrictMunicipalAreaId}
            rows={rowsAmount}
            columns={columnsAmountSum}
            pageSize={5}
            rowsPerPageOptions={[5, 10, 20]}
          />
        </div>
      </CustomTabPanel>
    </MainCard>
  );
}
