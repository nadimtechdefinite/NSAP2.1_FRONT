import React, { useState, useEffect } from 'react';
import MainCard from 'ui-component/cards/MainCard';
import axiosInstance from 'hooks/useAuthTokenUrl';
//import reportcss from 'components/reports/STCReport/reportCSS';
import { FormControl, Button } from '@mui/material';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import DownloadIcon from '@mui/icons-material/Download';

const MobileNoAbstractReport = () => {
  const [tableData, setTableData] = useState([]);
  //const classes = reportcss();

  const exportToExcel = () => {
    const wb = XLSX.utils.book_new();
    const wsTemp = XLSX.utils.table_to_sheet(document.getElementById('exportDataTableforexcel'));
    XLSX.utils.book_append_sheet(wb, wsTemp);
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    saveAs(new Blob([excelBuffer], { type: 'application/octet-stream' }), 'MobileNoAbstractReport.xlsx');
  };
  const getCasteAbstractReportDetails = async () => {
    try {
      const response = await axiosInstance.get(`/report/findAllCastReportDetails`);
      console.log('response.data', response.data);
      setTableData(response.data);
    } catch (error) {
      console.error('Error fetching IFSC codes:', error);
    }
  };

  useEffect(() => {
    getCasteAbstractReportDetails();
  }, []);

  return (
    <>
      {tableData.length > 0 && (
        <div style={{ marginTop: '20px' }}>
          <MainCard>
            <section className="mb-3">
              <div className="card">
                <div className="card-header text-center py-2">
                  <h1 className="mb-0 text-center">
                    <strong>Mobile No Abstract Report</strong>
                  </h1>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <div>
                    <FormControl>
                      <Button variant="contained" color="secondary" onClick={exportToExcel}>
                        <DownloadIcon/>
                        Excel
                      </Button>
                    </FormControl>
                  </div>
                </div>
                <div className="card-body">
                  <div className="table-responsive">
                    <style>{`
              .tbl-social-cat {
                border-collapse: collapse; /* Collapse borders */
              }
              .tbl-social-cat th,
              .tbl-social-cat td {
                border: 1px solid #ddd; /* Add border to th and td */
              }
              .tbl-social-cat th {
                color: #33b5e5;
                font-size: 15px;
              }
              .tbl-social-cat tr>td:nth-child(2) {
                text-align: left;
              }
            `}</style>
                    <table
                      id="exportDataTableforexcel"
                      className="dtexport table table-sm table-striped table-hover table-bordered mb-0 tbl-social-cat"
                    >
                      <thead className="text-center table-active" style={{ borderBottom: '2px' }}>
                        <tr>
                          <th></th>
                          <th></th>
                          <th align="center" colSpan="5">
                            IGNOAPS
                          </th>
                          <th align="center" colSpan="5">
                            IGNDPS
                          </th>
                          <th align="center" colSpan="5">
                            IGNWPS
                          </th>
                          <th align="center" colSpan="5">
                            NFBS
                          </th>
                        </tr>
                        <tr>
                          <th>S.No</th>
                          <th>State Name</th>

                          <th>State Cap (A)</th>
                          <th>NSAP Beneficiaries (B)</th>
                          <th>Min of (A) & (B)</th>
                          <th>Mobile No</th>
                          <th>Non Mobile No</th>

                          <th>State Cap (A)</th>
                          <th>NSAP Beneficiaries (B)</th>
                          <th>Min of (A) & (B)</th>
                          <th>Mobile No</th>
                          <th>Non Mobile No</th>

                          <th>State Cap (A)</th>
                          <th>NSAP Beneficiaries (B)</th>
                          <th>Min of (A) & (B)</th>
                          <th>Mobile No</th>
                          <th>Non Mobile No</th>

                          <th>State Cap (A)</th>
                          <th>NSAP Beneficiaries (B)</th>
                          <th>Min of (A) & (B)</th>
                          <th>Mobile No</th>
                          <th>Non Mobile No</th>
                        </tr>
                      </thead>
                      {/* <tbody className={classes.root}>
                        {tableData.map((row, index) => (
                          <tr key={index} className={row.stateName.trim().toUpperCase() === 'TOTAL' ? 'table-dark' : ''}>
                            {console.log(
                              'row.stateName:',
                              row.stateName,
                              'class:',
                              row.stateName.trim().toUpperCase() === 'TOTAL' ? 'table-dark' : ''
                            )}
                            <td style={{ width: '2%' }}>{row.sno}</td>

                            <td>{row.stateName}</td>
                            <td>{row.ignoapsStateCap}</td>
                            <td>{row.ignoapsDigitizedBeneficiary}</td>
                            <td>{row.ignoapsMinOfAAndB}</td>
                            <td>{row.ignoapsGen}</td>
                            <td>{row.ignoapsObc}</td>
                            <td>{row.ignoapsSc}</td>
                            <td>{row.ignoapsSt}</td>
                            <td>{row.igndpsStateCap}</td>
                            <td>{row.igndpsDigitizedBeneficiary}</td>
                            <td>{row.igndpsMinOfAAndB}</td>
                            <td>{row.igndpsGen}</td>
                            <td>{row.igndpsObc}</td>
                            <td>{row.igndpsSc}</td>
                            <td>{row.igndpsSt}</td>
                            <td>{row.ignwpsStateCap}</td>
                            <td>{row.ignwpsDigitizedBeneficiary}</td>
                            <td>{row.ignwpsMinOfAAndB}</td>
                            <td>{row.ignwpsGen}</td>
                            <td>{row.ignwpsObc}</td>
                            <td>{row.ignwpsSc}</td>
                            <td>{row.ignwpsSt}</td>
                          </tr>
                        ))}
                      </tbody> */}
                    </table>
                  </div>
                </div>
              </div>
            </section>
          </MainCard>
        </div>
      )}
    </>
  );
};
export default MobileNoAbstractReport;
