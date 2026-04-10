import React, { useState, useEffect } from 'react';
import MainCard from 'ui-component/cards/MainCard';
import axiosInstance from 'hooks/useAuthTokenUrl';
import reportcss from 'components/reports/STCReport/reportCSS';
import { FormControl, Button } from '@mui/material';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import SaveAlt from '@mui/icons-material/SaveAlt';
import PropTypes from 'prop-types';

const CastAbstractReport = ({ schemeCode }) => {
  const [tableData, setTableData] = useState([]);
  const classes = reportcss();

  CastAbstractReport.propTypes = {
    schemeCode: PropTypes.string.isRequired
  };

  const exportToExcel = () => {
    const wb = XLSX.utils.book_new();
    const wsTemp = XLSX.utils.table_to_sheet(document.getElementById('exportDataTableforexcel'));
    XLSX.utils.book_append_sheet(wb, wsTemp);
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    saveAs(new Blob([excelBuffer], { type: 'application/octet-stream' }), 'CasteAbstractReport.xlsx');
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
                    <strong>Caste Abstract Report</strong>
                  </h1>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <div>
                    <FormControl>
                      <Button variant="contained" color="secondary" onClick={exportToExcel}>
                        <SaveAlt style={{ color: 'white' }} />
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
                
                font-size: 15px;
                color: #33b5e5;
              }
              .tbl-social-cat tr>td:nth-child(2) {
                text-align: left;
              }

              .scheme-ignoaps {
                  background-color: #FCF3CF; /* Set background color for IGNOAPS */
                }
                .scheme-ignwps {
                  background-color: #FCF3CF; /* Set background color for IGNWPS */
                }
                .scheme-igndps {
                  background-color: #D4EFDF; /* Set background color for IGNDPS */
                }
                .scheme-nfbs {
                  background-color: #D4EFDF; /* Set background color for NFBS */
                }
                
            `}</style>
                    {schemeCode === 'all' ? (
                      <table
                        id="exportDataTableforexcel"
                        className="dtexport table table-sm table-striped table-hover table-bordered mb-0 tbl-social-cat"
                      >
                        <thead className="text-center table-active" style={{ borderBottom: '2px' }}>
                          <tr>
                            <th></th>
                            <th></th>
                            <th align="center" colSpan="7" className="scheme-ignoaps">
                              IGNOAPS
                            </th>
                            <th align="center" colSpan="7" className="scheme-igndps">
                              IGNDPS
                            </th>
                            <th align="center" colSpan="7" className="scheme-ignwps">
                              IGNWPS
                            </th>
                            <th align="center" colSpan="7" className="scheme-nfbs">
                              NFBS
                            </th>
                          </tr>
                          <tr>
                            <th>S.No</th>
                            <th>State Name</th>

                            <th className="scheme-ignoaps">State Cap (A)</th>
                            <th className="scheme-ignoaps">NSAP Beneficiaries (B)</th>
                            <th className="scheme-ignoaps">Min of (A) & (B)</th>
                            <th className="scheme-ignoaps">GEN</th>
                            <th className="scheme-ignoaps">OBC</th>
                            <th className="scheme-ignoaps">SC</th>
                            <th className="scheme-ignoaps">ST</th>

                            <th className="scheme-igndps">State Cap (A)</th>
                            <th className="scheme-igndps">NSAP Beneficiaries (B)</th>
                            <th className="scheme-igndps">Min of (A) & (B)</th>
                            <th className="scheme-igndps">GEN</th>
                            <th className="scheme-igndps">OBC</th>
                            <th className="scheme-igndps">SC</th>
                            <th className="scheme-igndps">ST</th>

                            <th className="scheme-ignwps">State Cap (A)</th>
                            <th className="scheme-ignwps">NSAP Beneficiaries (B)</th>
                            <th className="scheme-ignwps">Min of (A) & (B)</th>
                            <th className="scheme-ignwps">GEN</th>
                            <th className="scheme-ignwps">OBC</th>
                            <th className="scheme-ignwps">SC</th>
                            <th className="scheme-ignwps">ST</th>

                            <th className="scheme-nfbs">State Cap (A)</th>
                            <th className="scheme-nfbs">NSAP Beneficiaries (B)</th>
                            <th className="scheme-nfbs">Min of (A) & (B)</th>
                            <th className="scheme-nfbs">GEN</th>
                            <th className="scheme-nfbs">OBC</th>
                            <th className="scheme-nfbs">SC</th>
                            <th className="scheme-nfbs">ST</th>
                          </tr>
                        </thead>
                        <tbody className={classes.root}>
                          {tableData.map((row, index) => (
                            <tr key={index} className={row.stateName.trim().toUpperCase() === 'TOTAL' ? 'table-dark' : ''}>
                              <td style={{ width: '2%' }}>{row.sno}</td>

                              <td>{row.stateName}</td>
                              <td className={row.stateName.trim().toUpperCase() === 'TOTAL' ? '' : 'scheme-ignoaps'}>
                                {row.ignoapsStateCap}
                              </td>
                              <td className={row.stateName.trim().toUpperCase() === 'TOTAL' ? '' : 'scheme-ignoaps'}>
                                {row.ignoapsDigitizedBeneficiary}
                              </td>
                              <td className={row.stateName.trim().toUpperCase() === 'TOTAL' ? '' : 'scheme-ignoaps'}>
                                {row.ignoapsMinOfAAndB}
                              </td>
                              <td className={row.stateName.trim().toUpperCase() === 'TOTAL' ? '' : 'scheme-ignoaps'}>{row.ignoapsGen}</td>
                              <td className={row.stateName.trim().toUpperCase() === 'TOTAL' ? '' : 'scheme-ignoaps'}>{row.ignoapsObc}</td>
                              <td className={row.stateName.trim().toUpperCase() === 'TOTAL' ? '' : 'scheme-ignoaps'}>{row.ignoapsSc}</td>
                              <td className={row.stateName.trim().toUpperCase() === 'TOTAL' ? '' : 'scheme-ignoaps'}>{row.ignoapsSt}</td>

                              <td className={row.stateName.trim().toUpperCase() === 'TOTAL' ? '' : 'scheme-igndps'}>
                                {row.igndpsStateCap}
                              </td>
                              <td className={row.stateName.trim().toUpperCase() === 'TOTAL' ? '' : 'scheme-igndps'}>
                                {row.igndpsDigitizedBeneficiary}
                              </td>
                              <td className={row.stateName.trim().toUpperCase() === 'TOTAL' ? '' : 'scheme-igndps'}>
                                {row.igndpsMinOfAAndB}
                              </td>
                              <td className={row.stateName.trim().toUpperCase() === 'TOTAL' ? '' : 'scheme-igndps'}>{row.igndpsGen}</td>
                              <td className={row.stateName.trim().toUpperCase() === 'TOTAL' ? '' : 'scheme-igndps'}>{row.igndpsObc}</td>
                              <td className={row.stateName.trim().toUpperCase() === 'TOTAL' ? '' : 'scheme-igndps'}>{row.igndpsSc}</td>
                              <td className={row.stateName.trim().toUpperCase() === 'TOTAL' ? '' : 'scheme-igndps'}>{row.igndpsSt}</td>

                              <td className={row.stateName.trim().toUpperCase() === 'TOTAL' ? '' : 'scheme-ignwps'}>
                                {row.ignwpsStateCap}
                              </td>
                              <td className={row.stateName.trim().toUpperCase() === 'TOTAL' ? '' : 'scheme-ignwps'}>
                                {row.ignwpsDigitizedBeneficiary}
                              </td>
                              <td className={row.stateName.trim().toUpperCase() === 'TOTAL' ? '' : 'scheme-ignwps'}>
                                {row.ignwpsMinOfAAndB}
                              </td>
                              <td className={row.stateName.trim().toUpperCase() === 'TOTAL' ? '' : 'scheme-ignwps'}>{row.ignwpsGen}</td>
                              <td className={row.stateName.trim().toUpperCase() === 'TOTAL' ? '' : 'scheme-ignwps'}>{row.ignwpsObc}</td>
                              <td className={row.stateName.trim().toUpperCase() === 'TOTAL' ? '' : 'scheme-ignwps'}>{row.ignwpsSc}</td>
                              <td className={row.stateName.trim().toUpperCase() === 'TOTAL' ? '' : 'scheme-ignwps'}>{row.ignwpsSt}</td>

                              <td className={row.stateName.trim().toUpperCase() === 'TOTAL' ? '' : 'scheme-nfbs'}>{row.nfbsStateCap}</td>
                              <td className={row.stateName.trim().toUpperCase() === 'TOTAL' ? '' : 'scheme-nfbs'}>
                                {row.nfbsDigitizedBeneficiary}
                              </td>
                              <td className={row.stateName.trim().toUpperCase() === 'TOTAL' ? '' : 'scheme-nfbs'}>{row.nfbsMinOfAAndB}</td>
                              <td className={row.stateName.trim().toUpperCase() === 'TOTAL' ? '' : 'scheme-nfbs'}>{row.nfbsGen}</td>
                              <td className={row.stateName.trim().toUpperCase() === 'TOTAL' ? '' : 'scheme-nfbs'}>{row.nfbsObc}</td>
                              <td className={row.stateName.trim().toUpperCase() === 'TOTAL' ? '' : 'scheme-nfbs'}>{row.nfbsSc}</td>
                              <td className={row.stateName.trim().toUpperCase() === 'TOTAL' ? '' : 'scheme-nfbs'}>{row.nfbsSt}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : schemeCode === 'ignoaps' ? (
                      <table
                        id="exportDataTableforexcel"
                        className="dtexport table table-sm table-striped table-hover table-bordered mb-0 tbl-social-cat"
                      >
                        <thead className="text-center table-active" style={{ borderBottom: '2px' }}>
                          <tr>
                            <th></th>
                            <th></th>
                            <th align="center" colSpan="7" className="scheme-ignoaps">
                              IGNOAPS
                            </th>
                          </tr>
                          <tr>
                            <th>S.No</th>
                            <th>State Name</th>

                            <th className="scheme-ignoaps">State Cap (A)</th>
                            <th className="scheme-ignoaps">NSAP Beneficiaries (B)</th>
                            <th className="scheme-ignoaps">Min of (A) & (B)</th>
                            <th className="scheme-ignoaps">GEN</th>
                            <th className="scheme-ignoaps">OBC</th>
                            <th className="scheme-ignoaps">SC</th>
                            <th className="scheme-ignoaps">ST</th>
                          </tr>
                        </thead>
                        <tbody className={classes.root}>
                          {tableData.map((row, index) => (
                            <tr key={index} className={row.stateName.trim().toUpperCase() === 'TOTAL' ? 'table-dark' : ''}>
                              <td style={{ width: '2%' }}>{row.sno}</td>

                              <td>{row.stateName}</td>
                              <td className={row.stateName.trim().toUpperCase() === 'TOTAL' ? '' : 'scheme-ignoaps'}>
                                {row.ignoapsStateCap}
                              </td>
                              <td className={row.stateName.trim().toUpperCase() === 'TOTAL' ? '' : 'scheme-ignoaps'}>
                                {row.ignoapsDigitizedBeneficiary}
                              </td>
                              <td className={row.stateName.trim().toUpperCase() === 'TOTAL' ? '' : 'scheme-ignoaps'}>
                                {row.ignoapsMinOfAAndB}
                              </td>
                              <td className={row.stateName.trim().toUpperCase() === 'TOTAL' ? '' : 'scheme-ignoaps'}>{row.ignoapsGen}</td>
                              <td className={row.stateName.trim().toUpperCase() === 'TOTAL' ? '' : 'scheme-ignoaps'}>{row.ignoapsObc}</td>
                              <td className={row.stateName.trim().toUpperCase() === 'TOTAL' ? '' : 'scheme-ignoaps'}>{row.ignoapsSc}</td>
                              <td className={row.stateName.trim().toUpperCase() === 'TOTAL' ? '' : 'scheme-ignoaps'}>{row.ignoapsSt}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : schemeCode === 'igndps' ? (
                      <table
                        id="exportDataTableforexcel"
                        className="dtexport table table-sm table-striped table-hover table-bordered mb-0 tbl-social-cat"
                      >
                        <thead className="text-center table-active" style={{ borderBottom: '2px' }}>
                          <tr>
                            <th></th>
                            <th></th>
                            <th align="center" colSpan="7" className="scheme-igndps">
                              IGNDPS
                            </th>
                          </tr>
                          <tr>
                            <th>S.No</th>
                            <th>State Name</th>

                            <th className="scheme-igndps">State Cap (A)</th>
                            <th className="scheme-igndps">NSAP Beneficiaries (B)</th>
                            <th className="scheme-igndps">Min of (A) & (B)</th>
                            <th className="scheme-igndps">GEN</th>
                            <th className="scheme-igndps">OBC</th>
                            <th className="scheme-igndps">SC</th>
                            <th className="scheme-igndps">ST</th>
                          </tr>
                        </thead>
                        <tbody className={classes.root}>
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
                              <td className={row.stateName.trim().toUpperCase() === 'TOTAL' ? '' : 'scheme-igndps'}>
                                {row.igndpsStateCap}
                              </td>
                              <td className={row.stateName.trim().toUpperCase() === 'TOTAL' ? '' : 'scheme-igndps'}>
                                {row.igndpsDigitizedBeneficiary}
                              </td>
                              <td className={row.stateName.trim().toUpperCase() === 'TOTAL' ? '' : 'scheme-igndps'}>
                                {row.igndpsMinOfAAndB}
                              </td>
                              <td className={row.stateName.trim().toUpperCase() === 'TOTAL' ? '' : 'scheme-igndps'}>{row.igndpsGen}</td>
                              <td className={row.stateName.trim().toUpperCase() === 'TOTAL' ? '' : 'scheme-igndps'}>{row.igndpsObc}</td>
                              <td className={row.stateName.trim().toUpperCase() === 'TOTAL' ? '' : 'scheme-igndps'}>{row.igndpsSc}</td>
                              <td className={row.stateName.trim().toUpperCase() === 'TOTAL' ? '' : 'scheme-igndps'}>{row.igndpsSt}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : schemeCode === 'ignwps' ? (
                      <table
                        id="exportDataTableforexcel"
                        className="dtexport table table-sm table-striped table-hover table-bordered mb-0 tbl-social-cat"
                      >
                        <thead className="text-center table-active" style={{ borderBottom: '2px' }}>
                          <tr>
                            <th></th>
                            <th></th>
                            <th align="center" colSpan="7" className="scheme-ignwps">
                              IGNWPS
                            </th>
                          </tr>
                          <tr>
                            <th>S.No</th>
                            <th>State Name</th>

                            <th className="scheme-ignwps">State Cap (A)</th>
                            <th className="scheme-ignwps">NSAP Beneficiaries (B)</th>
                            <th className="scheme-ignwps">Min of (A) & (B)</th>
                            <th className="scheme-ignwps">GEN</th>
                            <th className="scheme-ignwps">OBC</th>
                            <th className="scheme-ignwps">SC</th>
                            <th className="scheme-ignwps">ST</th>
                          </tr>
                        </thead>
                        <tbody className={classes.root}>
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
                              <td className={row.stateName.trim().toUpperCase() === 'TOTAL' ? '' : 'scheme-ignwps'}>
                                {row.ignwpsStateCap}
                              </td>
                              <td className={row.stateName.trim().toUpperCase() === 'TOTAL' ? '' : 'scheme-ignwps'}>
                                {row.ignwpsDigitizedBeneficiary}
                              </td>
                              <td className={row.stateName.trim().toUpperCase() === 'TOTAL' ? '' : 'scheme-ignwps'}>
                                {row.ignwpsMinOfAAndB}
                              </td>
                              <td className={row.stateName.trim().toUpperCase() === 'TOTAL' ? '' : 'scheme-ignwps'}>{row.ignwpsGen}</td>
                              <td className={row.stateName.trim().toUpperCase() === 'TOTAL' ? '' : 'scheme-ignwps'}>{row.ignwpsObc}</td>
                              <td className={row.stateName.trim().toUpperCase() === 'TOTAL' ? '' : 'scheme-ignwps'}>{row.ignwpsSc}</td>
                              <td className={row.stateName.trim().toUpperCase() === 'TOTAL' ? '' : 'scheme-ignwps'}>{row.ignwpsSt}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : schemeCode === 'nfbs' ? (
                      <table
                        id="exportDataTableforexcel"
                        className="dtexport table table-sm table-striped table-hover table-bordered mb-0 tbl-social-cat"
                      >
                        <thead className="text-center table-active" style={{ borderBottom: '2px' }}>
                          <tr>
                            <th></th>
                            <th></th>
                            <th align="center" colSpan="7" className="scheme-nfbs">
                              NFBS
                            </th>
                          </tr>
                          <tr>
                            <th>S.No</th>
                            <th>State Name</th>

                            <th className="scheme-nfbs">State Cap (A)</th>
                            <th className="scheme-nfbs">NSAP Beneficiaries (B)</th>
                            <th className="scheme-nfbs">Min of (A) & (B)</th>
                            <th className="scheme-nfbs">GEN</th>
                            <th className="scheme-nfbs">OBC</th>
                            <th className="scheme-nfbs">SC</th>
                            <th className="scheme-nfbs">ST</th>
                          </tr>
                        </thead>
                        <tbody className={classes.root}>
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
                              <td className={row.stateName.trim().toUpperCase() === 'TOTAL' ? '' : 'scheme-nfbs'}>{row.nfbsStateCap}</td>
                              <td className={row.stateName.trim().toUpperCase() === 'TOTAL' ? '' : 'scheme-nfbs'}>
                                {row.nfbsDigitizedBeneficiary}
                              </td>
                              <td className={row.stateName.trim().toUpperCase() === 'TOTAL' ? '' : 'scheme-nfbs'}>{row.nfbsMinOfAAndB}</td>
                              <td className={row.stateName.trim().toUpperCase() === 'TOTAL' ? '' : 'scheme-nfbs'}>{row.nfbsGen}</td>
                              <td className={row.stateName.trim().toUpperCase() === 'TOTAL' ? '' : 'scheme-nfbs'}>{row.nfbsObc}</td>
                              <td className={row.stateName.trim().toUpperCase() === 'TOTAL' ? '' : 'scheme-nfbs'}>{row.nfbsSc}</td>
                              <td className={row.stateName.trim().toUpperCase() === 'TOTAL' ? '' : 'scheme-nfbs'}>{row.nfbsSt}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : schemeCode === 'allExceptNfbs' ? (
                      <table
                        id="exportDataTableforexcel"
                        className="dtexport table table-sm table-striped table-hover table-bordered mb-0 tbl-social-cat"
                      >
                        <thead className="text-center table-active" style={{ borderBottom: '2px' }}>
                          <tr>
                            <th></th>
                            <th></th>
                            <th align="center" colSpan="7" className="scheme-ignoaps">
                              IGNOAPS
                            </th>
                            <th align="center" colSpan="7" className="scheme-igndps">
                              IGNDPS
                            </th>
                            <th align="center" colSpan="7" className="scheme-ignwps">
                              IGNWPS
                            </th>
                          </tr>
                          <tr>
                            <th>S.No</th>
                            <th>State Name</th>

                            <th className="scheme-ignoaps">State Cap (A)</th>
                            <th className="scheme-ignoaps">NSAP Beneficiaries (B)</th>
                            <th className="scheme-ignoaps">Min of (A) & (B)</th>
                            <th className="scheme-ignoaps">GEN</th>
                            <th className="scheme-ignoaps">OBC</th>
                            <th className="scheme-ignoaps">SC</th>
                            <th className="scheme-ignoaps">ST</th>

                            <th className="scheme-igndps">State Cap (A)</th>
                            <th className="scheme-igndps">NSAP Beneficiaries (B)</th>
                            <th className="scheme-igndps">Min of (A) & (B)</th>
                            <th className="scheme-igndps">GEN</th>
                            <th className="scheme-igndps">OBC</th>
                            <th className="scheme-igndps">SC</th>
                            <th className="scheme-igndps">ST</th>

                            <th className="scheme-ignwps">State Cap (A)</th>
                            <th className="scheme-ignwps">NSAP Beneficiaries (B)</th>
                            <th className="scheme-ignwps">Min of (A) & (B)</th>
                            <th className="scheme-ignwps">GEN</th>
                            <th className="scheme-ignwps">OBC</th>
                            <th className="scheme-ignwps">SC</th>
                            <th className="scheme-ignwps">ST</th>
                          </tr>
                        </thead>
                        <tbody className={classes.root}>
                          {tableData.map((row, index) => (
                            <tr key={index} className={row.stateName.trim().toUpperCase() === 'TOTAL' ? 'table-dark' : ''}>
                              <td style={{ width: '2%' }}>{row.sno}</td>

                              <td>{row.stateName}</td>
                              <td className={row.stateName.trim().toUpperCase() === 'TOTAL' ? '' : 'scheme-ignoaps'}>
                                {row.ignoapsStateCap}
                              </td>
                              <td className={row.stateName.trim().toUpperCase() === 'TOTAL' ? '' : 'scheme-ignoaps'}>
                                {row.ignoapsDigitizedBeneficiary}
                              </td>
                              <td className={row.stateName.trim().toUpperCase() === 'TOTAL' ? '' : 'scheme-ignoaps'}>
                                {row.ignoapsMinOfAAndB}
                              </td>
                              <td className={row.stateName.trim().toUpperCase() === 'TOTAL' ? '' : 'scheme-ignoaps'}>{row.ignoapsGen}</td>
                              <td className={row.stateName.trim().toUpperCase() === 'TOTAL' ? '' : 'scheme-ignoaps'}>{row.ignoapsObc}</td>
                              <td className={row.stateName.trim().toUpperCase() === 'TOTAL' ? '' : 'scheme-ignoaps'}>{row.ignoapsSc}</td>
                              <td className={row.stateName.trim().toUpperCase() === 'TOTAL' ? '' : 'scheme-ignoaps'}>{row.ignoapsSt}</td>

                              <td className={row.stateName.trim().toUpperCase() === 'TOTAL' ? '' : 'scheme-igndps'}>
                                {row.igndpsStateCap}
                              </td>
                              <td className={row.stateName.trim().toUpperCase() === 'TOTAL' ? '' : 'scheme-igndps'}>
                                {row.igndpsDigitizedBeneficiary}
                              </td>
                              <td className={row.stateName.trim().toUpperCase() === 'TOTAL' ? '' : 'scheme-igndps'}>
                                {row.igndpsMinOfAAndB}
                              </td>
                              <td className={row.stateName.trim().toUpperCase() === 'TOTAL' ? '' : 'scheme-igndps'}>{row.igndpsGen}</td>
                              <td className={row.stateName.trim().toUpperCase() === 'TOTAL' ? '' : 'scheme-igndps'}>{row.igndpsObc}</td>
                              <td className={row.stateName.trim().toUpperCase() === 'TOTAL' ? '' : 'scheme-igndps'}>{row.igndpsSc}</td>
                              <td className={row.stateName.trim().toUpperCase() === 'TOTAL' ? '' : 'scheme-igndps'}>{row.igndpsSt}</td>

                              <td className={row.stateName.trim().toUpperCase() === 'TOTAL' ? '' : 'scheme-ignwps'}>
                                {row.ignwpsStateCap}
                              </td>
                              <td className={row.stateName.trim().toUpperCase() === 'TOTAL' ? '' : 'scheme-ignwps'}>
                                {row.ignwpsDigitizedBeneficiary}
                              </td>
                              <td className={row.stateName.trim().toUpperCase() === 'TOTAL' ? '' : 'scheme-ignwps'}>
                                {row.ignwpsMinOfAAndB}
                              </td>
                              <td className={row.stateName.trim().toUpperCase() === 'TOTAL' ? '' : 'scheme-ignwps'}>{row.ignwpsGen}</td>
                              <td className={row.stateName.trim().toUpperCase() === 'TOTAL' ? '' : 'scheme-ignwps'}>{row.ignwpsObc}</td>
                              <td className={row.stateName.trim().toUpperCase() === 'TOTAL' ? '' : 'scheme-ignwps'}>{row.ignwpsSc}</td>
                              <td className={row.stateName.trim().toUpperCase() === 'TOTAL' ? '' : 'scheme-ignwps'}>{row.ignwpsSt}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : null}
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
export default CastAbstractReport;
