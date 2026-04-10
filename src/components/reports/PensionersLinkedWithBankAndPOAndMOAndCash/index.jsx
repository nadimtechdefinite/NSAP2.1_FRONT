import React, { useState, useEffect } from 'react';
import MainCard from 'ui-component/cards/MainCard';
import { Grid, Table, TableHead, TableRow, TableCell, TableBody, CircularProgress } from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import axiosInstance from 'hooks/useAuthTokenUrl';
import PensionersLinkedPersonalDetails from './PensionersLinkedPersonalDetails';
import PostOfficeSummeryCountReports from './PostOfficeSummery';
import CashSummeryCountReports from './CashSummery';
import MOSummeryCountReports from './MOSummery';
const PensionersLinkedWithBankAndPOAndMOAndCashReport = () => {
  const [loading, setLoading] = useState(false);
  const [totalCount, setTotalCount] = useState([]);
  const [totalCountBankSummery, setTotalCountBankSummery] = useState([]);
  const [totalCountBankBranchSummery, setTotalCountBankBranchSummery] = useState([]);
  const [branchPensionersDetails, setBranchPensionersDetails] = useState([]);
  const [pensionersPersonalDetails, setPensionersPersonalDetails] = useState([]);
  const [bankType, setBankType] = useState('');
  const [postOfficeCountDetails, setPostOfficeCountDetails] = useState([]);
  const [cashCountDetails, setCashCountDetails] = useState([]);
  const [moCountDetails, setMOCountDetails] = useState([]);
  const fetchCountData = async () => {
    try {
      setLoading(true);
      const getUrl = '/login/report/pensionersLinkedWithBankAndPOAndMOAndCashReport';
      const response = await axiosInstance.get(getUrl);
      const result = await response.data;
      setTotalCount(result);
    } catch (error) {
      console.log('Error fetching count data : ', error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchCountData();
  }, []);

  const handleCountDetailsFunction = (paramFlag) => {
    console.log('COUNT DETAILS FLAG : ', paramFlag);
    setBankType(paramFlag);
  };

  useEffect(() => {
    if (bankType === 'PO' || bankType === 'CASH' || bankType === 'MO') {
      setTotalCountBankSummery([]);
      setTotalCountBankBranchSummery([]);
      setBranchPensionersDetails([]);
      setPensionersPersonalDetails([]);
    }
  }, [bankType]);

  useEffect(() => {
    if (bankType) {
      if (bankType === 'BANK') {
        fetchBankSummaryCountReport();
      } else if (bankType === 'PO') {
        fetchPostOfficeSummaryCountReport();
      } else if (bankType === 'CASH') {
        fetchCashSummaryCountReport();
      } else if (bankType === 'MO') {
        fetchMOSummaryCountReport();
      }
    }
  }, [bankType]);

  const fetchBankSummaryCountReport = async () => {
    try {
      setLoading(true);
      setTotalCountBankSummery([]);
      const getUrl = '/login/report/getBankSummaryCountReport';
      const response = await axiosInstance.get(getUrl);
      setTotalCountBankSummery(response.data);
    } catch (error) {
      console.log('Error  : ', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPostOfficeSummaryCountReport = async () => {
    try {
      setLoading(true);
      const getUrl = '/login/report/findPostOfficeSummaryReport';
      const response = await axiosInstance.get(getUrl);
      const newData = response.data.map((row, index) => ({
        ...row,
        id: row.districtCode,
        serialNo: index + 1 // Serial number starts from 1
      }));
      setPostOfficeCountDetails(newData);
    } catch (error) {
      console.log('Error  : ', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCashSummaryCountReport = async () => {
    try {
      setLoading(true);
      const getUrl = '/login/report/findCashCountSummaryReport';
      const response = await axiosInstance.get(getUrl);
      const newData = response.data.map((row, index) => ({
        ...row,
        id: row.districtCode,
        serialNo: index + 1 // Serial number starts from 1
      }));
      setCashCountDetails(newData);
    } catch (error) {
      console.log('Error  : ', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMOSummaryCountReport = async () => {
    try {
      setLoading(true);
      const getUrl = '/login/report/findMOCountSummaryReport';
      const response = await axiosInstance.get(getUrl);
      const newData = response.data.map((row, index) => ({
        ...row,
        id: row.districtCode,
        serialNo: index + 1 // Serial number starts from 1
      }));
      setMOCountDetails(newData);
    } catch (error) {
      console.log('Error  : ', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBankNameClick = (bankCode) => {
    fetchBankBranchData(bankCode);
  };

  const fetchBankBranchData = async (bankCode) => {
    console.log('COUNT DETAILS FLAG BANK CODE : ', bankCode);
    try {
      setLoading(true);
      setBranchPensionersDetails([]);
      setPensionersPersonalDetails([]);
      const getUrl = `/login/report/getBranchSummaryCountReportByBankCode/${bankCode}`;
      const response = await axiosInstance.get(getUrl);
      setTotalCountBankBranchSummery(response.data);
    } catch (error) {
      console.log('Error  : ', error);
    } finally {
      setLoading(false);
    }
  };
  const handleBankBranchNameClick = (bankCode, bankBranchCode) => {
    fetchBankBranchPensionersData(bankCode, bankBranchCode);
  };
  const fetchBankBranchPensionersData = async (bankCode, bankBranchCode) => {
    try {
      setLoading(true);
      setBranchPensionersDetails([]);
      setPensionersPersonalDetails([]);
      const getUrl = `/login/report/findAllBankPensionersDetailsByBankCodeAndBranchCode/${bankCode}/${bankBranchCode}`;
      const response = await axiosInstance.get(getUrl);
      setBranchPensionersDetails(response.data);
    } catch (error) {
      console.log('Error  : ', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePensionesDetailsClick = (paramBankCode, paramBankBranchCode, paramGramPanchayatWardCode) => {
    fetchBankBranchPensionesDetailsData(paramBankCode, paramBankBranchCode, paramGramPanchayatWardCode);
  };

  const fetchBankBranchPensionesDetailsData = async (paramBankCode, paramBankBranchCode, paramGramPanchayatWardCode) => {
    try {
      setLoading(true);
      setPensionersPersonalDetails([]);
      const getUrl = `/login/report/findAllBankBeneficiariesPersonalDetailsByBankCodeAndBranchCodeAndGPCode/${paramBankCode}/${paramBankBranchCode}/${paramGramPanchayatWardCode}`;
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

  const columnsBankCount = [
    {
      field: 'bankName',
      headerName: 'Bank Name',
      width: 1000,
      renderCell: (params) => (
        <span
          style={{ color: 'blue', cursor: 'pointer' }}
          onClick={() => handleBankNameClick(params.row.bankCode)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              handleBankNameClick(params.row.bankCode);
            }
          }}
          role="button"
          tabIndex={0}
        >
          {params.value}
        </span>
      )
    },

    {
      field: 'totalBenCountBankWise',
      headerName: 'Number of Beneficiaries',
      width: 300
    }
  ];

  const columnsBankBranchWiseCount = [
    {
      field: 'branchName',
      headerName: 'Branch Name',
      width: 1000,
      renderCell: (params) => (
        <span
          style={{ color: 'blue', cursor: 'pointer' }}
          onClick={() => handleBankBranchNameClick(params.row.bankCode, params.row.bankBranchCode)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              handleBankBranchNameClick(params.row.bankCode, params.row.bankBranchCode);
            }
          }}
          role="button"
          tabIndex={0}
        >
          {params.value}
        </span>
      )
    },

    {
      field: 'totalBenCountBranchWise',
      headerName: 'Number of Beneficiaries',
      width: 300
    }
  ];

  const columnsBranchDetails = [
    {
      field: 'districtName',
      headerName: 'District',
      width: 200
    },

    {
      field: 'ruralUrbanArea',
      headerName: 'Rural/Urban',
      width: 150
    },
    {
      field: 'subDistrictMunicipalAreaName',
      headerName: 'Sub District / Municipal Area Name',
      width: 200
    },
    {
      field: 'grampanchayatName',
      headerName: 'Gram Panchayat Name',
      width: 200
    },

    {
      field: 'ifscCode',
      headerName: 'IFSC Code',
      width: 200
    },
    {
      field: 'bankBranchCode',
      headerName: 'Branch Code',
      width: 150
    },
    {
      field: 'bankBranchName',
      headerName: 'Branch Name',
      width: 200
    },
    {
      field: 'totCount',
      headerName: 'Number of Beneficiaries',
      width: 200,
      renderCell: (params) => (
        <span
          style={{ color: 'blue', cursor: 'pointer' }}
          onClick={() => handlePensionesDetailsClick(params.row.bankCode, params.row.bankBranchCode, params.row.grampanchayatCode)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              handlePensionesDetailsClick(params.row.bankCode, params.row.bankBranchCode, params.row.grampanchayatCode);
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

  return (
    <div>
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
      <MainCard title="Existing Pensioners Getting Regular Pension Through Bank, Post Office, Money order And Cash">
        <Grid container spacing={2}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell style={{ borderColor: 'black', borderWidth: 1, borderStyle: 'solid' }}>Bank</TableCell>
                <TableCell style={{ borderColor: 'black', borderWidth: 1, borderStyle: 'solid' }}>Post Office</TableCell>
                <TableCell style={{ borderColor: 'black', borderWidth: 1, borderStyle: 'solid' }}>Cash</TableCell>
                <TableCell style={{ borderColor: 'black', borderWidth: 1, borderStyle: 'solid' }}>Money Order</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              <TableCell
                style={{
                  borderColor: 'black',
                  borderWidth: 1,
                  borderStyle: 'solid',
                  cursor: totalCount.totalBankCount > 0 ? 'pointer' : 'default',
                  color: totalCount.totalBankCount > 0 ? '#2686e0' : 'inherit'
                }}
                onClick={() => {
                  totalCount.totalBankCount > 0 && handleCountDetailsFunction('BANK');
                }}
              >
                {totalCount.totalBankCount}
              </TableCell>
              <TableCell
                style={{
                  borderColor: 'black',
                  borderWidth: 1,
                  borderStyle: 'solid',
                  cursor: totalCount.totalPostOfficeCount > 0 ? 'pointer' : 'default',
                  color: totalCount.totalPostOfficeCount > 0 ? '#2686e0' : 'inherit'
                }}
                onClick={() => {
                  totalCount.totalBankCount > 0 && handleCountDetailsFunction('PO');
                }}
              >
                {totalCount.totalPostOfficeCount}
              </TableCell>
              <TableCell
                style={{
                  borderColor: 'black',
                  borderWidth: 1,
                  borderStyle: 'solid',
                  cursor: totalCount.totalCashCount > 0 ? 'pointer' : 'default',
                  color: totalCount.totalCashCount > 0 ? '#2686e0' : 'inherit'
                }}
                onClick={() => {
                  totalCount.totalBankCount > 0 && handleCountDetailsFunction('CASH');
                }}
              >
                {totalCount.totalCashCount}
              </TableCell>
              <TableCell
                style={{
                  borderColor: 'black',
                  borderWidth: 1,
                  borderStyle: 'solid',
                  cursor: totalCount.totalMoneyOrderCount > 0 ? 'pointer' : 'default',
                  color: totalCount.totalMoneyOrderCount > 0 ? '#2686e0' : 'inherit'
                }}
                onClick={() => {
                  totalCount.totalBankCount > 0 && handleCountDetailsFunction('MO');
                }}
              >
                {totalCount.totalMoneyOrderCount}
              </TableCell>
            </TableBody>
          </Table>
        </Grid>
      </MainCard>
      {!totalCountBankSummery.length == 0 && (
        <div style={{ marginTop: '20px' }}>
          <MainCard title="Bank Details">
            <Grid container spacing={2}>
              <DataGrid
                getRowId={(row) => row.bankCode}
                rows={totalCountBankSummery}
                columns={columnsBankCount}
                slots={{ toolbar: GridToolbar }}
                slotProps={{
                  toolbar: {
                    showQuickFilter: true,
                    printOptions: { disableToolbarButton: true },
                    csvOptions: { fileName: 'BankDetails' }
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
      )}
      {!totalCountBankBranchSummery.length == 0 && (
        <div style={{ marginTop: '20px' }}>
          <MainCard title="Bank Branch Details">
            <Grid container spacing={2}>
              <DataGrid
                getRowId={(row) => row.bankBranchCode}
                rows={totalCountBankBranchSummery}
                columns={columnsBankBranchWiseCount}
                slots={{ toolbar: GridToolbar }}
                slotProps={{
                  toolbar: {
                    showQuickFilter: true,
                    printOptions: { disableToolbarButton: true },
                    csvOptions: { fileName: 'BankBranchDetails' }
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
      )}

      {!branchPensionersDetails.length == 0 && (
        <div style={{ marginTop: '20px' }}>
          <MainCard title="Branch Details">
            <Grid container spacing={2}>
              <DataGrid
                getRowId={(row) => row.bankBranchCode}
                rows={branchPensionersDetails}
                columns={columnsBranchDetails}
                slots={{ toolbar: GridToolbar }}
                slotProps={{
                  toolbar: {
                    showQuickFilter: true,
                    printOptions: { disableToolbarButton: true },
                    csvOptions: { fileName: 'BranchDetails' }
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
      )}

      {!pensionersPersonalDetails.length == 0 && (
        <PensionersLinkedPersonalDetails BankTypeStatus={bankType} BeneficiariesCountDetails={pensionersPersonalDetails} />
      )}
      {bankType === 'PO' && <PostOfficeSummeryCountReports BankTypeStatus={bankType} PostOfficeCountDetails={postOfficeCountDetails} />}
      {bankType === 'CASH' && <CashSummeryCountReports BankTypeStatus={bankType} CashCountDetails={cashCountDetails} />}
      {bankType === 'MO' && <MOSummeryCountReports BankTypeStatus={bankType} MOCountDetails={moCountDetails} />}
    </div>
  );
};
export default PensionersLinkedWithBankAndPOAndMOAndCashReport;
