import React, { useState, useEffect } from "react";
import MainCard from 'ui-component/cards/MainCard';
import axiosInstance from "hooks/useAuthTokenUrl";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
  Paper,
  Button,
  Stack
} from '@mui/material';

const ShowBoardedUnboardedStateStatus = () => {
  const [originalData, setOriginalData] = useState([]);
  const [tableData, setTableData] = useState([]);

  const getBoardedNonBoardedReportDetails = async () => {
    try {
      const response = await axiosInstance.get(`/boardedonboarded/findAllBoardedNonboarded`);
      console.log('response.data', response.data);
      setOriginalData(response.data);
      setTableData(response.data); // Initially show all
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    getBoardedNonBoardedReportDetails();
  }, []);

  const handleShowNonOnboarded = () => {
    const filtered = originalData.filter(item => item.stateStatus === false);
    setTableData(filtered);
  };

  const handleShowOnboarded = () => {
    const filtered = originalData.filter(item => item.stateStatus === true);
    setTableData(filtered);
  };

  const handleShowAll = () => {
    setTableData(originalData);
  };

  return (
    <>
      {tableData.length > 0 && (
        <div style={{ marginTop: '20px' }}>
          <MainCard title="List of Boarded and Unboarded Report">
            <div className="card-body">
              <div className="table-responsive">
                <style>{`
                  .tbl-social-cat {
                    border-collapse: collapse;
                  }
                  .tbl-social-cat th,
                  .tbl-social-cat td {
                    border: 1px solid #ddd;
                    text-align: center;
                  }
                  .tbl-social-cat th {
                    color: #33b5e5;
                    font-size: 15px;
                  }
                  .tbl-social-cat tr > td:nth-child(2) {
                    text-align: left;
                  }
                  .scheme-ignoaps {
                    background-color: #FCF3CF;
                  }
                  .scheme-ignwps {
                    background-color: #FCF3CF;
                  }
                  .scheme-igndps {
                    background-color: #D4EFDF;
                  }
                `}</style>

                {/* Buttons */}
                <Stack direction="row" spacing={2} mb={2}>
                  <Button variant="contained" color="primary" onClick={handleShowNonOnboarded}>
                    Show Non-Onboarded States
                  </Button>
                  <Button variant="contained" color="success" onClick={handleShowOnboarded}>
                    Show Onboarded States
                  </Button>
                  <Button variant="outlined" onClick={handleShowAll}>
                    Show All States
                  </Button>
                </Stack>

                {/* Table */}
                <TableContainer component={Paper}>
                  <Table
                    id="exportDataTableforexcel"
                    className="dtexport table table-sm table-striped table-hover table-bordered mb-0 tbl-social-cat"
                  >
                    <TableHead className="text-center table-active" style={{ borderBottom: '2px solid #dee2e6' }}>
                      <TableRow>
                        <TableCell rowSpan={2}>S.No</TableCell>
                        <TableCell rowSpan={2}>State Name</TableCell>
                        <TableCell colSpan={2} className="scheme-ignoaps">IGNOAPS</TableCell>
                        <TableCell colSpan={2} className="scheme-igndps">IGNDPS</TableCell>
                        <TableCell colSpan={2} className="scheme-ignwps">IGNWPS</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Pensioner</TableCell>
                        <TableCell>Transaction</TableCell>
                        <TableCell>Pensioner</TableCell>
                        <TableCell>Transaction</TableCell>
                        <TableCell>Pensioner</TableCell>
                        <TableCell>Transaction</TableCell>
                      </TableRow>
                    </TableHead>

                    <TableBody>
                      {tableData.map((row, index) => (
                        <TableRow key={index}>
                          <TableCell>{index + 1}</TableCell>
                          <TableCell>{row.stateName}</TableCell>

                          {/* IGNOAPS */}
                          <TableCell>{row.ignoapsPensionerLastUpdateDate}</TableCell>
                          <TableCell>{row.ignoapsTransectionLastUpdateDate}</TableCell>

                          {/* IGNDPS */}
                          <TableCell>{row.igndpsPensionerLastUpdateDate}</TableCell>
                          <TableCell>{row.igndpsTransectionLastUpdateDate}</TableCell>

                          {/* IGNWPS */}
                          <TableCell>{row.ignwpsPensionerLastUpdateDate}</TableCell>
                          <TableCell>{row.ignwpsTransectionLastUpdateDate}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </div>
            </div>
          </MainCard>
        </div>
      )}
    </>
  );
};

export default ShowBoardedUnboardedStateStatus;
