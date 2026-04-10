import MainCard from 'ui-component/cards/MainCard';
import React, { useState, useEffect } from 'react';
import { CircularProgress, Backdrop } from '@mui/material';
import axiosInstance from 'hooks/useAuthTokenUrl';
import '../../../components/verification/mark-nsap-beneficiary/approveMarkBeneficiary.css';
import '../../verification/aadharConsentUpdation/aadharConsent.css';
import { Table, TableHead, TableBody, TableRow, TableCell, Box } from '@material-ui/core';
import { getUserInfo } from 'utils/storageUtils';
import Button from '@mui/material/Button';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

function PensionersProgressiveAbstract() {
  const [getAllDistrict, setAllDistrict] = useState([]);
  const [getAllDistrictUrban, setAllDistrictUrban] = useState([]);
  const [loading, setLoading] = useState(false);
  const [tableFilter, setTableFilter] = useState('');
  const [searchData, setSearchData] = useState('');
  const userinfoHeader = getUserInfo();

  useEffect(() => {
    fetchData();
  }, []);

  const getSubDistrictEvent = async (disCode) => {
    try {
      event.preventDefault();
      var seacrhFlag = 'gp';
      const getUrl = `/pensioners-progressive-abstract/getPensionersProgressiveAbstractGp/` + disCode + '/' + seacrhFlag;
      setLoading(true);
      const response = await axiosInstance.get(getUrl);
      if (response.status >= 200 && response.status < 300) {
        setAllDistrict(response.data);
        setSearchData(response.data[0].searchData); // value set for back button
        setTableFilter('gp');
        return response.data;
      } else {
        return false;
      }
    } catch (error) {
      if (error.response.data.id) {
        // setSnackbar({ children: error.response.data.id, severity: 'error' });
      } else {
        // setSnackbar({ children: "No Data Found", severity: 'error' });
      }
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };
  const handleExportPdf = () => {
    const doc = new jsPDF(); // Portrait
    const generatedDate = new Date().toLocaleDateString('en-IN');

    //let headers = [];
    let rowsToExport = [];
    let formattedRows = [];
    let reportTitle = 'Pensioners Progressive Abstract Report';

    // Dynamic title and location label
    let locationLabel = 'Location';

    if (tableFilter === 'st') {
      reportTitle = 'District-wise Pensioners Report';
      locationLabel = 'District';
    } else if (tableFilter === 'subDis') {
      reportTitle = 'Subdistrict-wise Pensioners Report';
      locationLabel = 'Subdistrict';
    } else if (tableFilter === 'gp') {
      reportTitle = 'GP-wise Pensioners Report';
      locationLabel = 'Gram Panchayat';
    }

    const mergedHeaders = [
      [
        { content: locationLabel, rowSpan: 2, halign: 'center' },
        { content: 'Total Pensioner', rowSpan: 2, halign: 'center' },
        { content: 'Live Pensioner', colSpan: 6, halign: 'center' },
        { content: 'Pending', colSpan: 3, halign: 'center' },
        { content: 'Other Status', colSpan: 3, halign: 'center' }
      ],
      [
        'Bank A/C',
        'PO',
        'MO',
        'Cash',
        'UID',
        'EID',
        'Pending For Verification',
        'Pending For Sanction',
        'Pending For Issue SO',
        'Application Rejected Status',
        'Discontinued Pensioner',
        'Reinstated Pensioner'
      ]
    ];

    // Get all visible data
    rowsToExport = [];

    if (tableFilter === 'st') {
      // At district level → include both rural and urban
      rowsToExport = [
        ...(Array.isArray(getAllDistrict) ? getAllDistrict : []),
        ...(Array.isArray(getAllDistrictUrban) ? getAllDistrictUrban : [])
      ];
    } else {
      // At any drill-down level → only export what's in getAllDistrict
      rowsToExport = Array.isArray(getAllDistrict) ? getAllDistrict : [];
    }

    // Get dynamic name for location column
    const getLocationName = (row) => row.subDistrictName || row.gramPanchayatName || row.villageName || row.districtName || '—';

    formattedRows = rowsToExport.map((row) => [
      getLocationName(row),
      row.disTotalPensioner || 0,
      row.livePensioner || 0,
      row.livePensionerBankAc || 0,
      row.livePensionerPo || 0,
      row.livePensionerMo || 0,
      row.livePensionerCash || 0,
      row.livePensionerUid || 0,
      row.livePensionerEid || 0,
      row.pendingForVerification || 0,
      row.pendingForSanction || 0,
      row.pendingForIssueSo || 0,
      row.statusApplicationRejected || 0,
      row.inactivePensionersDiscontinued || 0,
      row.inactivePensionersAppealedToReinstate || 0
    ]);

    if (!formattedRows.length) {
      alert('No data available to export.');
      return;
    }

    doc.text(reportTitle, 14, 15);

    autoTable(doc, {
      startY: 20,
      head: mergedHeaders,
      body: formattedRows,
      styles: {
        fontSize: 7,
        cellPadding: 1,
        halign: 'center'
      },
      headStyles: {
        fillColor: [33, 150, 243],
        textColor: 255,
        halign: 'center',
        lineWidth: 0.1, // Border thickness for body
        lineColor: [0, 0, 0],
        fontStyle: 'bold'
      },
      didDrawPage: function () {
        const pageHeight = doc.internal.pageSize.height;
        doc.setFontSize(8);
        doc.setTextColor(100);
        doc.text(
          `Powered By NSAP-PPS - Delivering Reliable Pension Processing - https://nsap.nic.in/ on - ${generatedDate}`,
          14,
          pageHeight - 10
        );
      }
    });

    doc.save(`${reportTitle.replace(/\s+/g, '_')}.pdf`);
  };

  const getDistrictEvent = async (disCode) => {
    try {
      event.preventDefault();
      var seacrhFlag = 'subDis';
      const getUrl = `/pensioners-progressive-abstract/getPensionersProgressiveAbstractSubDis/` + disCode + '/' + seacrhFlag;
      setLoading(true);
      const response = await axiosInstance.get(getUrl);
      if (response.status >= 200 && response.status < 300) {
        const { list1, list2 } = response.data;
        setAllDistrict(list1);
        setAllDistrictUrban(list2);

        if (list1[0].searchData !== null) {
          setSearchData(list1[0].searchData); // value set for back button
        } else {
          setSearchData(list2[0].searchData); // value set for back button
        }
        setTableFilter('subDis');
        return response.data;
      } else {
        return false;
      }
    } catch (error) {
      if (error.response.data.id) {
        // setSnackbar({ children: error.response.data.id, severity: 'error' });
      } else {
        // setSnackbar({ children: "No Data Found", severity: 'error' });
      }
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getDisTotalPensionerEvent = async (code, level, header) => {
    event.preventDefault();
    const body = { codeDw: code, levelDw: level, headerDw: header };
    try {
      setLoading(true);
      var urlData = `/pensioners-progressive-abstract/getPensionersProgressiveAbstractInExcel`;
      const response = await axiosInstance.post(urlData, body, {
        responseType: 'blob'
      });
      if (response.status == 204) {
        return false;
      }
      const blob = new Blob([response.data], { type: 'application/octet-stream' });
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      var title = 'Pending_Applications';
      const currentDate =
        new Date().toISOString().slice(8, 10) + '-' + new Date().toISOString().slice(5, 7) + '-' + new Date().toISOString().slice(0, 4);
      link.download = `${title}_${currentDate}.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(link.href);
    } catch (error) {
      console.error('Error fetching data:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchData = async () => {
    //alert("level ::: "+userinfoHeader.userLevelId + " = "+localStorage.getItem('userinfo'));
    try {
      var seacrhFlag = 'null';
      const getUrl = `/pensioners-progressive-abstract/getPensionersProgressiveAbstract/` + seacrhFlag;
      setLoading(true);
      const response = await axiosInstance.get(getUrl);
      if (response.status >= 200 && response.status < 300) {
        //alert("-  "+response.data[0].searchFlag);
        //setAllDistrict(response.data);

        const { list1, list2 } = response.data;
        setAllDistrict(list1);
        setAllDistrictUrban(list2);

        //setTableFilter("dis");
        setTableFilter(list1[0].searchFlag);
        return response.data;
      } else {
        return false;
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
  };

  //console.log("tableFilter --:: "+tableFilter);
  return (
    <div>
      <MainCard title={'PROGRESSIVE ABSTRACT FOR ' + userinfoHeader.selectedSchemeCode}>
        <Backdrop open={loading} style={{ zIndex: 999, color: '#fff' }}>
          <CircularProgress color="inherit" />
        </Backdrop>

        {tableFilter === 'st' ? (
          ''
        ) : tableFilter === 'dis' ? (
          ''
        ) : tableFilter === 'subDis' ? (
          <Button
            title="Back"
            variant="contained"
            color="primary"
            style={{ float: 'right', marginTop: '-80px' }}
            onClick={() => fetchData()}
            startIcon={<ArrowBackIcon />}
          >
            Back
          </Button>
        ) : (
          <Button
            title="Back"
            variant="contained"
            color="primary"
            style={{ float: 'right', marginTop: '-80px' }}
            onClick={() => getDistrictEvent(searchData)}
            startIcon={<ArrowBackIcon />}
          >
            Back
          </Button>
        )}
        <Box display="flex" justifyContent="flex-end" mb={2}>
          <Button variant="contained" onClick={handleExportPdf}>
            Download PDF
          </Button>
        </Box>

        {tableFilter === 'st' ? (
          <div style={{ overflowX: 'auto' }}>
            <Table style={{ border: '1px solid #dddddd' }}>
              <TableHead>
                <TableRow>
                  <TableCell
                    rowSpan={2}
                    style={{ border: '1px solid #dddddd', borderTopColor: 'black', borderRightColor: 'black', borderLeftColor: 'black' }}
                  >
                    <b>District </b>
                  </TableCell>
                  <TableCell
                    rowSpan={2}
                    style={{ border: '1px solid #dddddd', borderTopColor: 'black', borderRightColor: 'black', borderLeftColor: 'black' }}
                  >
                    <b>Total Pensioners</b>
                  </TableCell>
                  <TableCell
                    rowSpan={2}
                    style={{ border: '1px solid #dddddd', borderTopColor: 'black', borderRightColor: 'black', borderLeftColor: 'black' }}
                  >
                    <b>Live Pensioners</b>
                  </TableCell>
                  <TableCell
                    colSpan={6}
                    style={{
                      border: '1px solid #dddddd',
                      textAlign: 'center',
                      borderTopColor: 'black',
                      borderRightColor: 'black',
                      borderLeftColor: 'black'
                    }}
                  >
                    <b>Live Pensioners</b>
                  </TableCell>
                  <TableCell
                    colSpan={3}
                    style={{
                      border: '1px solid #dddddd',
                      textAlign: 'center',
                      borderTopColor: 'black',
                      borderRightColor: 'black',
                      borderLeftColor: 'black'
                    }}
                  >
                    <b>Pending For</b>
                  </TableCell>
                  <TableCell
                    colSpan={1}
                    style={{
                      border: '1px solid #dddddd',
                      textAlign: 'center',
                      borderTopColor: 'black',
                      borderRightColor: 'black',
                      borderLeftColor: 'black'
                    }}
                  >
                    <b>Status</b>
                  </TableCell>
                  <TableCell
                    colSpan={2}
                    style={{
                      border: '1px solid #dddddd',
                      textAlign: 'center',
                      borderTopColor: 'black',
                      borderRightColor: 'black',
                      borderLeftColor: 'black'
                    }}
                  >
                    <b>Inactive Pensioners</b>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell style={{ border: '1px solid #dddddd', borderRightColor: 'black', borderLeftColor: 'black' }}>
                    <b>Bank a/c</b>
                  </TableCell>
                  <TableCell style={{ border: '1px solid #dddddd', borderRightColor: 'black', borderLeftColor: 'black' }}>
                    <b>PO</b>
                  </TableCell>
                  <TableCell style={{ border: '1px solid #dddddd', borderRightColor: 'black', borderLeftColor: 'black' }}>
                    <b>MO</b>
                  </TableCell>
                  <TableCell style={{ border: '1px solid #dddddd', borderRightColor: 'black', borderLeftColor: 'black' }}>
                    <b>Cash</b>
                  </TableCell>
                  <TableCell style={{ border: '1px solid #dddddd', borderRightColor: 'black', borderLeftColor: 'black' }}>
                    <b>UID</b>
                  </TableCell>
                  <TableCell style={{ border: '1px solid #dddddd', borderRightColor: 'black', borderLeftColor: 'black' }}>
                    <b>EID</b>
                  </TableCell>
                  <TableCell style={{ border: '1px solid #dddddd', borderRightColor: 'black', borderLeftColor: 'black' }}>
                    <b>Verification</b>
                  </TableCell>
                  <TableCell style={{ border: '1px solid #dddddd', borderRightColor: 'black', borderLeftColor: 'black' }}>
                    <b>Sanction</b>
                  </TableCell>
                  <TableCell style={{ border: '1px solid #dddddd', borderRightColor: 'black', borderLeftColor: 'black' }}>
                    <b>Issue SO</b>
                  </TableCell>
                  <TableCell style={{ border: '1px solid #dddddd', borderRightColor: 'black', borderLeftColor: 'black' }}>
                    <b>Application Rejected</b>
                  </TableCell>
                  {/* <TableCell  style={{border:'1px solid #dddddd',backgroundColor:'#3B0B17',color:'white'}}><b>Stopped</b></TableCell> */}
                  <TableCell style={{ border: '1px solid #dddddd', borderRightColor: 'black', borderLeftColor: 'black' }}>
                    <b>Discontinued</b>
                  </TableCell>
                  <TableCell style={{ border: '1px solid #dddddd', borderRightColor: 'black', borderLeftColor: 'black' }}>
                    <b>Appealed to re-instate</b>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {getAllDistrict.map((row, index) =>
                  row.districtName !== null ? (
                    <TableRow key={index}>
                      <TableCell style={{ border: '1px solid black' }}>
                        <a style={{ color: 'blue' }} href={row.districtCode} onClick={() => getDistrictEvent(row.districtCode)}>
                          {row.districtName}
                        </a>
                      </TableCell>
                      <TableCell style={{ border: '1px solid black' }}>
                        {row.disTotalPensioner > 0 ? (
                          <a
                            style={{ color: 'blue', textDecoration: 'none' }}
                            title="Download"
                            href={row.disTotalPensioner}
                            onClick={() => getDisTotalPensionerEvent(row.districtCode, 'dis', 'TotalPensioner')}
                          >
                            {row.disTotalPensioner}
                          </a>
                        ) : (
                          <span>{row.disTotalPensioner}</span>
                        )}
                      </TableCell>
                      <TableCell style={{ border: '1px solid black' }}>
                        {row.livePensioner > 0 ? (
                          <a
                            style={{ color: 'blue', textDecoration: 'none' }}
                            title="Download"
                            href={row.livePensioner}
                            onClick={() => getDisTotalPensionerEvent(row.districtCode, 'dis', 'livePensioner')}
                          >
                            {row.livePensioner}
                          </a>
                        ) : (
                          <span>{row.livePensioner}</span>
                        )}
                      </TableCell>
                      <TableCell style={{ border: '1px solid black' }}>
                        {row.livePensionerBankAc > 0 ? (
                          <a
                            style={{ color: 'blue', textDecoration: 'none' }}
                            title="Download"
                            href={row.livePensionerBankAc}
                            onClick={() => getDisTotalPensionerEvent(row.districtCode, 'dis', 'livePensionerBankAc')}
                          >
                            {row.livePensionerBankAc}
                          </a>
                        ) : (
                          <span>{row.livePensionerBankAc}</span>
                        )}
                      </TableCell>
                      <TableCell style={{ border: '1px solid black' }}>
                        {row.livePensionerPo > 0 ? (
                          <a
                            style={{ color: 'blue', textDecoration: 'none' }}
                            title="Download"
                            href={row.livePensionerPo}
                            onClick={() => getDisTotalPensionerEvent(row.districtCode, 'dis', 'livePensionerPo')}
                          >
                            {row.livePensionerPo}
                          </a>
                        ) : (
                          <span>{row.livePensionerPo}</span>
                        )}
                      </TableCell>
                      <TableCell style={{ border: '1px solid black' }}>
                        {row.livePensionerMo > 0 ? (
                          <a
                            style={{ color: 'blue', textDecoration: 'none' }}
                            title="Download"
                            href={row.livePensionerMo}
                            onClick={() => getDisTotalPensionerEvent(row.districtCode, 'dis', 'livePensionerMo')}
                          >
                            {row.livePensionerMo}
                          </a>
                        ) : (
                          <span>{row.livePensionerMo}</span>
                        )}
                      </TableCell>
                      <TableCell style={{ border: '1px solid black' }}>
                        {row.livePensionerCash > 0 ? (
                          <a
                            style={{ color: 'blue', textDecoration: 'none' }}
                            title="Download"
                            href={row.livePensionerCash}
                            onClick={() => getDisTotalPensionerEvent(row.districtCode, 'dis', 'livePensionerCash')}
                          >
                            {row.livePensionerCash}
                          </a>
                        ) : (
                          <span>{row.livePensionerCash}</span>
                        )}
                      </TableCell>
                      <TableCell style={{ border: '1px solid black' }}>
                        {row.livePensionerUid > 0 ? (
                          <a
                            style={{ color: 'blue', textDecoration: 'none' }}
                            title="Download"
                            href={row.livePensionerUid}
                            onClick={() => getDisTotalPensionerEvent(row.districtCode, 'dis', 'livePensionerUid')}
                          >
                            {row.livePensionerUid}
                          </a>
                        ) : (
                          <span>{row.livePensionerUid}</span>
                        )}
                      </TableCell>
                      <TableCell style={{ border: '1px solid black' }}>
                        {row.livePensionerEid > 0 ? (
                          <a
                            style={{ color: 'blue', textDecoration: 'none' }}
                            title="Download"
                            href={row.livePensionerEid}
                            onClick={() => getDisTotalPensionerEvent(row.districtCode, 'dis', 'livePensionerEid')}
                          >
                            {row.livePensionerEid}
                          </a>
                        ) : (
                          <span>{row.livePensionerEid}</span>
                        )}
                      </TableCell>
                      <TableCell style={{ border: '1px solid black' }}>
                        {row.pendingForVerification > 0 ? (
                          <a
                            style={{ color: 'blue', textDecoration: 'none' }}
                            title="Download"
                            href={row.pendingForVerification}
                            onClick={() => getDisTotalPensionerEvent(row.districtCode, 'dis', 'livePensionerVerification')}
                          >
                            {row.pendingForVerification}
                          </a>
                        ) : (
                          <span>{row.pendingForVerification}</span>
                        )}
                      </TableCell>
                      <TableCell style={{ border: '1px solid black' }}>
                        {row.pendingForSanction > 0 ? (
                          <a
                            style={{ color: 'blue', textDecoration: 'none' }}
                            title="Download"
                            href={row.pendingForSanction}
                            onClick={() => getDisTotalPensionerEvent(row.districtCode, 'dis', 'livePensionerSanction')}
                          >
                            {row.pendingForSanction}
                          </a>
                        ) : (
                          <span>{row.pendingForSanction}</span>
                        )}
                      </TableCell>
                      <TableCell style={{ border: '1px solid black' }}>
                        {row.pendingForIssueSo > 0 ? (
                          <a
                            style={{ color: 'blue', textDecoration: 'none' }}
                            title="Download"
                            href={row.pendingForIssueSo}
                            onClick={() => getDisTotalPensionerEvent(row.districtCode, 'dis', 'livePensionerIssueSo')}
                          >
                            {row.pendingForIssueSo}
                          </a>
                        ) : (
                          <span>{row.pendingForIssueSo}</span>
                        )}
                      </TableCell>
                      <TableCell style={{ border: '1px solid black' }}>
                        {row.statusApplicationRejected > 0 ? (
                          <a
                            style={{ color: 'blue', textDecoration: 'none' }}
                            title="Download"
                            href={row.statusApplicationRejected}
                            onClick={() => getDisTotalPensionerEvent(row.districtCode, 'dis', 'livePensionerApplicationRejected')}
                          >
                            {row.statusApplicationRejected}
                          </a>
                        ) : (
                          <span>{row.statusApplicationRejected}</span>
                        )}
                      </TableCell>
                      {/* <TableCell style={{border:'1px solid black'}}>{row.inactivePensionersStopped > 0 ? (<a href={row.inactivePensionersStopped} onClick={() => getDisTotalPensionerEvent(row.districtCode,'dis','livePensionerStopped')}>{row.inactivePensionersStopped}</a>):(<span>{row.inactivePensionersStopped}</span>)}</TableCell> */}
                      <TableCell style={{ border: '1px solid black' }}>
                        {row.inactivePensionersDiscontinued > 0 ? (
                          <a
                            style={{ color: 'blue', textDecoration: 'none' }}
                            title="Download"
                            href={row.inactivePensionersDiscontinued}
                            onClick={() => getDisTotalPensionerEvent(row.districtCode, 'dis', 'livePensionerDiscontinued')}
                          >
                            {row.inactivePensionersDiscontinued}
                          </a>
                        ) : (
                          <span>{row.inactivePensionersDiscontinued}</span>
                        )}
                      </TableCell>
                      <TableCell style={{ border: '1px solid black' }}>
                        {row.inactivePensionersAppealedToReinstate > 0 ? (
                          <a
                            style={{ color: 'blue', textDecoration: 'none' }}
                            title="Download"
                            href={row.inactivePensionersAppealedToReinstate}
                            onClick={() => getDisTotalPensionerEvent(row.districtCode, 'dis', 'livePensionerReInstate')}
                          >
                            {row.inactivePensionersAppealedToReinstate}
                          </a>
                        ) : (
                          <span>{row.inactivePensionersAppealedToReinstate}</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ) : (
                    <TableRow key={index} style={{ backgroundColor: 'rgba(71, 140, 255, 1)' }}>
                      <TableCell style={{ border: '1px solid black', color: 'white' }}>TOTAL</TableCell>
                      <TableCell style={{ border: '1px solid black', color: 'white' }}>{row.disTotalPensioner}</TableCell>
                      <TableCell style={{ border: '1px solid black', color: 'white' }}>{row.livePensioner}</TableCell>
                      <TableCell style={{ border: '1px solid black', color: 'white' }}>{row.livePensionerBankAc}</TableCell>
                      <TableCell style={{ border: '1px solid black', color: 'white' }}>{row.livePensionerPo}</TableCell>
                      <TableCell style={{ border: '1px solid black', color: 'white' }}>{row.livePensionerMo}</TableCell>
                      <TableCell style={{ border: '1px solid black', color: 'white' }}>{row.livePensionerCash}</TableCell>
                      <TableCell style={{ border: '1px solid black', color: 'white' }}>{row.livePensionerUid}</TableCell>
                      <TableCell style={{ border: '1px solid black', color: 'white' }}>{row.livePensionerEid}</TableCell>
                      <TableCell style={{ border: '1px solid black', color: 'white' }}>{row.pendingForVerification}</TableCell>
                      <TableCell style={{ border: '1px solid black', color: 'white' }}>{row.pendingForSanction}</TableCell>
                      <TableCell style={{ border: '1px solid black', color: 'white' }}>{row.pendingForIssueSo}</TableCell>
                      <TableCell style={{ border: '1px solid black', color: 'white' }}>{row.statusApplicationRejected}</TableCell>
                      {/* <TableCell style={{border:'1px solid black',color:'white'}}>{row.inactivePensionersStopped}</TableCell> */}
                      <TableCell style={{ border: '1px solid black', color: 'white' }}>{row.inactivePensionersDiscontinued}</TableCell>
                      <TableCell style={{ border: '1px solid black', color: 'white' }}>
                        {row.inactivePensionersAppealedToReinstate}
                      </TableCell>
                    </TableRow>
                  )
                )}
              </TableBody>
            </Table>
          </div>
        ) : tableFilter === 'dis' ? (
          <div style={{ overflowX: 'auto' }}>
            <Table style={{ border: '1px solid #dddddd' }}>
              <TableHead>
                <TableRow>
                  <TableCell rowSpan={2} style={{ border: '1px solid #dddddd', backgroundColor: '#3B0B17', color: 'white' }}>
                    <b>District </b>
                  </TableCell>
                  <TableCell rowSpan={2} style={{ border: '1px solid #dddddd', backgroundColor: '#3B0B17', color: 'white' }}>
                    <b>Total Pensioners</b>
                  </TableCell>
                  <TableCell rowSpan={2} style={{ border: '1px solid #dddddd', backgroundColor: '#3B0B17', color: 'white' }}>
                    <b>Live Pensioners</b>
                  </TableCell>
                  <TableCell
                    colSpan={6}
                    style={{ border: '1px solid #dddddd', backgroundColor: '#3B0B17', color: 'white', textAlign: 'center' }}
                  >
                    <b>Live Pensioners</b>
                  </TableCell>
                  <TableCell
                    colSpan={3}
                    style={{ border: '1px solid #dddddd', backgroundColor: '#3B0B17', color: 'white', textAlign: 'center' }}
                  >
                    <b>Pending For</b>
                  </TableCell>
                  <TableCell
                    colSpan={1}
                    style={{ border: '1px solid #dddddd', backgroundColor: '#3B0B17', color: 'white', textAlign: 'center' }}
                  >
                    <b>Status</b>
                  </TableCell>
                  <TableCell
                    colSpan={2}
                    style={{ border: '1px solid #dddddd', backgroundColor: '#3B0B17', color: 'white', textAlign: 'center' }}
                  >
                    <b>Inactive Pensioners</b>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell style={{ border: '1px solid #dddddd', backgroundColor: '#3B0B17', color: 'white' }}>
                    <b>Bank a/c</b>
                  </TableCell>
                  <TableCell style={{ border: '1px solid #dddddd', backgroundColor: '#3B0B17', color: 'white' }}>
                    <b>PO</b>
                  </TableCell>
                  <TableCell style={{ border: '1px solid #dddddd', backgroundColor: '#3B0B17', color: 'white' }}>
                    <b>MO</b>
                  </TableCell>
                  <TableCell style={{ border: '1px solid #dddddd', backgroundColor: '#3B0B17', color: 'white' }}>
                    <b>Cash</b>
                  </TableCell>
                  <TableCell style={{ border: '1px solid #dddddd', backgroundColor: '#3B0B17', color: 'white' }}>
                    <b>UID</b>
                  </TableCell>
                  <TableCell style={{ border: '1px solid #dddddd', backgroundColor: '#3B0B17', color: 'white' }}>
                    <b>EID</b>
                  </TableCell>
                  <TableCell style={{ border: '1px solid #dddddd', backgroundColor: '#3B0B17', color: 'white' }}>
                    <b>Verification</b>
                  </TableCell>
                  <TableCell style={{ border: '1px solid #dddddd', backgroundColor: '#3B0B17', color: 'white' }}>
                    <b>Sanction</b>
                  </TableCell>
                  <TableCell style={{ border: '1px solid #dddddd', backgroundColor: '#3B0B17', color: 'white' }}>
                    <b>Issue SO</b>
                  </TableCell>
                  <TableCell style={{ border: '1px solid #dddddd', backgroundColor: '#3B0B17', color: 'white' }}>
                    <b>Application Rejected</b>
                  </TableCell>
                  {/* <TableCell  style={{border:'1px solid #dddddd',backgroundColor:'#3B0B17',color:'white'}}><b>Stopped</b></TableCell> */}
                  <TableCell style={{ border: '1px solid #dddddd', backgroundColor: '#3B0B17', color: 'white' }}>
                    <b>Discontinued</b>
                  </TableCell>
                  <TableCell style={{ border: '1px solid #dddddd', backgroundColor: '#3B0B17', color: 'white' }}>
                    <b>Appealed to re-instate</b>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {getAllDistrict.map((row, index) =>
                  row.districtCode !== 'TOTAL' ? (
                    <TableRow key={index}>
                      <TableCell style={{ border: '1px solid black' }}>
                        <a style={{ color: 'blue' }} href={row.districtCode} onClick={() => getDistrictEvent(row.districtCode)}>
                          {row.districtName}
                        </a>
                      </TableCell>
                      <TableCell style={{ border: '1px solid black' }}>
                        {row.disTotalPensioner > 0 ? (
                          <a
                            style={{ color: 'blue', textDecoration: 'none' }}
                            title="Download"
                            href={row.disTotalPensioner}
                            onClick={() => getDisTotalPensionerEvent(row.districtCode, 'subDis', 'TotalPensioner')}
                          >
                            {row.disTotalPensioner}
                          </a>
                        ) : (
                          <span>{row.disTotalPensioner}</span>
                        )}
                      </TableCell>
                      <TableCell style={{ border: '1px solid black' }}>
                        {row.livePensioner > 0 ? (
                          <a
                            style={{ color: 'blue', textDecoration: 'none' }}
                            title="Download"
                            href={row.livePensioner}
                            onClick={() => getDisTotalPensionerEvent(row.districtCode, 'subDis', 'livePensioner')}
                          >
                            {row.livePensioner}
                          </a>
                        ) : (
                          <span>{row.livePensioner}</span>
                        )}
                      </TableCell>
                      <TableCell style={{ border: '1px solid black' }}>
                        {row.livePensionerBankAc > 0 ? (
                          <a
                            style={{ color: 'blue', textDecoration: 'none' }}
                            title="Download"
                            href={row.livePensionerBankAc}
                            onClick={() => getDisTotalPensionerEvent(row.districtCode, 'subDis', 'livePensionerBankAc')}
                          >
                            {row.livePensionerBankAc}
                          </a>
                        ) : (
                          <span>{row.livePensionerBankAc}</span>
                        )}
                      </TableCell>
                      <TableCell style={{ border: '1px solid black' }}>
                        {row.livePensionerPo > 0 ? (
                          <a
                            style={{ color: 'blue', textDecoration: 'none' }}
                            title="Download"
                            href={row.livePensionerPo}
                            onClick={() => getDisTotalPensionerEvent(row.districtCode, 'subDis', 'livePensionerPo')}
                          >
                            {row.livePensionerPo}
                          </a>
                        ) : (
                          <span>{row.livePensionerPo}</span>
                        )}
                      </TableCell>
                      <TableCell style={{ border: '1px solid black' }}>
                        {row.livePensionerMo > 0 ? (
                          <a
                            style={{ color: 'blue', textDecoration: 'none' }}
                            title="Download"
                            href={row.livePensionerMo}
                            onClick={() => getDisTotalPensionerEvent(row.districtCode, 'subDis', 'livePensionerMo')}
                          >
                            {row.livePensionerMo}
                          </a>
                        ) : (
                          <span>{row.livePensionerMo}</span>
                        )}
                      </TableCell>
                      <TableCell style={{ border: '1px solid black' }}>
                        {row.livePensionerCash > 0 ? (
                          <a
                            style={{ color: 'blue', textDecoration: 'none' }}
                            title="Download"
                            href={row.livePensionerCash}
                            onClick={() => getDisTotalPensionerEvent(row.districtCode, 'subDis', 'livePensionerCash')}
                          >
                            {row.livePensionerCash}
                          </a>
                        ) : (
                          <span>{row.livePensionerCash}</span>
                        )}
                      </TableCell>
                      <TableCell style={{ border: '1px solid black' }}>
                        {row.livePensionerUid > 0 ? (
                          <a
                            style={{ color: 'blue', textDecoration: 'none' }}
                            title="Download"
                            href={row.livePensionerUid}
                            onClick={() => getDisTotalPensionerEvent(row.districtCode, 'subDis', 'livePensionerUid')}
                          >
                            {row.livePensionerUid}
                          </a>
                        ) : (
                          <span>{row.livePensionerUid}</span>
                        )}
                      </TableCell>
                      <TableCell style={{ border: '1px solid black' }}>
                        {row.livePensionerEid > 0 ? (
                          <a
                            style={{ color: 'blue', textDecoration: 'none' }}
                            title="Download"
                            href={row.livePensionerEid}
                            onClick={() => getDisTotalPensionerEvent(row.districtCode, 'subDis', 'livePensionerEid')}
                          >
                            {row.livePensionerEid}
                          </a>
                        ) : (
                          <span>{row.livePensionerEid}</span>
                        )}
                      </TableCell>
                      <TableCell style={{ border: '1px solid black' }}>
                        {row.pendingForVerification > 0 ? (
                          <a
                            style={{ color: 'blue', textDecoration: 'none' }}
                            title="Download"
                            href={row.pendingForVerification}
                            onClick={() => getDisTotalPensionerEvent(row.districtCode, 'subDis', 'livePensionerVerification')}
                          >
                            {row.pendingForVerification}
                          </a>
                        ) : (
                          <span>{row.pendingForVerification}</span>
                        )}
                      </TableCell>
                      <TableCell style={{ border: '1px solid black' }}>
                        {row.pendingForSanction > 0 ? (
                          <a
                            style={{ color: 'blue', textDecoration: 'none' }}
                            title="Download"
                            href={row.pendingForSanction}
                            onClick={() => getDisTotalPensionerEvent(row.districtCode, 'subDis', 'livePensionerSanction')}
                          >
                            {row.pendingForSanction}
                          </a>
                        ) : (
                          <span>{row.pendingForSanction}</span>
                        )}
                      </TableCell>
                      <TableCell style={{ border: '1px solid black' }}>
                        {row.pendingForIssueSo > 0 ? (
                          <a
                            style={{ color: 'blue', textDecoration: 'none' }}
                            title="Download"
                            href={row.pendingForIssueSo}
                            onClick={() => getDisTotalPensionerEvent(row.districtCode, 'subDis', 'livePensionerIssueSo')}
                          >
                            {row.pendingForIssueSo}
                          </a>
                        ) : (
                          <span>{row.pendingForIssueSo}</span>
                        )}
                      </TableCell>
                      <TableCell style={{ border: '1px solid black' }}>
                        {row.statusApplicationRejected > 0 ? (
                          <a
                            style={{ color: 'blue', textDecoration: 'none' }}
                            title="Download"
                            href={row.statusApplicationRejected}
                            onClick={() => getDisTotalPensionerEvent(row.districtCode, 'subDis', 'livePensionerApplicationRejected')}
                          >
                            {row.statusApplicationRejected}
                          </a>
                        ) : (
                          <span>{row.statusApplicationRejected}</span>
                        )}
                      </TableCell>
                      {/* <TableCell style={{border:'1px solid black'}}>{row.inactivePensionersStopped > 0 ? (<a href={row.inactivePensionersStopped} onClick={() => getDisTotalPensionerEvent(row.districtCode,'SubDis','livePensionerStopped')}>{row.inactivePensionersStopped}</a>):(<span>{row.inactivePensionersStopped}</span>)}</TableCell> */}
                      <TableCell style={{ border: '1px solid black' }}>
                        {row.inactivePensionersDiscontinued > 0 ? (
                          <a
                            style={{ color: 'blue', textDecoration: 'none' }}
                            title="Download"
                            href={row.inactivePensionersDiscontinued}
                            onClick={() => getDisTotalPensionerEvent(row.districtCode, 'subDis', 'livePensionerDiscontinued')}
                          >
                            {row.inactivePensionersDiscontinued}
                          </a>
                        ) : (
                          <span>{row.inactivePensionersDiscontinued}</span>
                        )}
                      </TableCell>
                      <TableCell style={{ border: '1px solid black' }}>
                        {row.inactivePensionersAppealedToReinstate > 0 ? (
                          <a
                            style={{ color: 'blue', textDecoration: 'none' }}
                            title="Download"
                            href={row.inactivePensionersAppealedToReinstate}
                            onClick={() => getDisTotalPensionerEvent(row.districtCode, 'subDis', 'livePensionerReInstate')}
                          >
                            {row.inactivePensionersAppealedToReinstate}
                          </a>
                        ) : (
                          <span>{row.inactivePensionersAppealedToReinstate}</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ) : (
                    <TableRow key={index} style={{ backgroundColor: 'rgba(71, 140, 255, 1)' }}>
                      <TableCell style={{ border: '1px solid black', color: 'white' }}>{row.districtCode}</TableCell>
                      <TableCell style={{ border: '1px solid black', color: 'white' }}>{row.disTotalPensioner}</TableCell>
                      <TableCell style={{ border: '1px solid black', color: 'white' }}>{row.livePensioner}</TableCell>
                      <TableCell style={{ border: '1px solid black', color: 'white' }}>{row.livePensionerBankAc}</TableCell>
                      <TableCell style={{ border: '1px solid black', color: 'white' }}>{row.livePensionerPo}</TableCell>
                      <TableCell style={{ border: '1px solid black', color: 'white' }}>{row.livePensionerMo}</TableCell>
                      <TableCell style={{ border: '1px solid black', color: 'white' }}>{row.livePensionerCash}</TableCell>
                      <TableCell style={{ border: '1px solid black', color: 'white' }}>{row.livePensionerUid}</TableCell>
                      <TableCell style={{ border: '1px solid black', color: 'white' }}>{row.livePensionerEid}</TableCell>
                      <TableCell style={{ border: '1px solid black', color: 'white' }}>{row.pendingForVerification}</TableCell>
                      <TableCell style={{ border: '1px solid black', color: 'white' }}>{row.pendingForSanction}</TableCell>
                      <TableCell style={{ border: '1px solid black', color: 'white' }}>{row.pendingForIssueSo}</TableCell>
                      <TableCell style={{ border: '1px solid black', color: 'white' }}>{row.statusApplicationRejected}</TableCell>
                      {/* <TableCell style={{border:'1px solid black'}}>{row.inactivePensionersStopped > 0 ? (<a href={row.inactivePensionersStopped} onClick={() => getDisTotalPensionerEvent(row.districtCode,'SubDis','livePensionerStopped')}>{row.inactivePensionersStopped}</a>):(<span>{row.inactivePensionersStopped}</span>)}</TableCell> */}
                      <TableCell style={{ border: '1px solid black', color: 'white' }}>{row.inactivePensionersDiscontinued}</TableCell>
                      <TableCell style={{ border: '1px solid black', color: 'white' }}>
                        {row.inactivePensionersAppealedToReinstate}
                      </TableCell>
                    </TableRow>
                  )
                )}
              </TableBody>
            </Table>
          </div>
        ) : tableFilter === 'subDis' ? (
          <div style={{ overflowX: 'auto' }}>
            <Table style={{ border: '1px solid #dddddd' }}>
              <TableHead>
                <TableRow>
                  <TableCell rowSpan={2} style={{ border: '1px solid #dddddd', backgroundColor: '#3B0B17', color: 'white' }}>
                    <b>Subdistrict/Municipality </b>
                  </TableCell>
                  <TableCell rowSpan={2} style={{ border: '1px solid #dddddd', backgroundColor: '#3B0B17', color: 'white' }}>
                    <b>Total Pensioners</b>
                  </TableCell>
                  <TableCell rowSpan={2} style={{ border: '1px solid #dddddd', backgroundColor: '#3B0B17', color: 'white' }}>
                    <b>Live Pensioners</b>
                  </TableCell>
                  <TableCell
                    colSpan={6}
                    style={{ border: '1px solid #dddddd', backgroundColor: '#3B0B17', color: 'white', textAlign: 'center' }}
                  >
                    <b>Live Pensioners</b>
                  </TableCell>
                  <TableCell
                    colSpan={3}
                    style={{ border: '1px solid #dddddd', backgroundColor: '#3B0B17', color: 'white', textAlign: 'center' }}
                  >
                    <b>Pending For</b>
                  </TableCell>
                  <TableCell
                    colSpan={1}
                    style={{ border: '1px solid #dddddd', backgroundColor: '#3B0B17', color: 'white', textAlign: 'center' }}
                  >
                    <b>Status</b>
                  </TableCell>
                  <TableCell
                    colSpan={2}
                    style={{ border: '1px solid #dddddd', backgroundColor: '#3B0B17', color: 'white', textAlign: 'center' }}
                  >
                    <b>Inactive Pensioners</b>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell style={{ border: '1px solid #dddddd', backgroundColor: '#3B0B17', color: 'white' }}>
                    <b>Bank a/c</b>
                  </TableCell>
                  <TableCell style={{ border: '1px solid #dddddd', backgroundColor: '#3B0B17', color: 'white' }}>
                    <b>PO</b>
                  </TableCell>
                  <TableCell style={{ border: '1px solid #dddddd', backgroundColor: '#3B0B17', color: 'white' }}>
                    <b>MO</b>
                  </TableCell>
                  <TableCell style={{ border: '1px solid #dddddd', backgroundColor: '#3B0B17', color: 'white' }}>
                    <b>Cash</b>
                  </TableCell>
                  <TableCell style={{ border: '1px solid #dddddd', backgroundColor: '#3B0B17', color: 'white' }}>
                    <b>UID</b>
                  </TableCell>
                  <TableCell style={{ border: '1px solid #dddddd', backgroundColor: '#3B0B17', color: 'white' }}>
                    <b>EID</b>
                  </TableCell>
                  <TableCell style={{ border: '1px solid #dddddd', backgroundColor: '#3B0B17', color: 'white' }}>
                    <b>Verification</b>
                  </TableCell>
                  <TableCell style={{ border: '1px solid #dddddd', backgroundColor: '#3B0B17', color: 'white' }}>
                    <b>Sanction</b>
                  </TableCell>
                  <TableCell style={{ border: '1px solid #dddddd', backgroundColor: '#3B0B17', color: 'white' }}>
                    <b>Issue SO</b>
                  </TableCell>
                  <TableCell style={{ border: '1px solid #dddddd', backgroundColor: '#3B0B17', color: 'white' }}>
                    <b>Application Rejected</b>
                  </TableCell>
                  {/* <TableCell  style={{border:'1px solid #dddddd',backgroundColor:'#3B0B17',color:'white'}}><b>Stopped</b></TableCell> */}
                  <TableCell style={{ border: '1px solid #dddddd', backgroundColor: '#3B0B17', color: 'white' }}>
                    <b>Discontinued</b>
                  </TableCell>
                  <TableCell style={{ border: '1px solid #dddddd', backgroundColor: '#3B0B17', color: 'white' }}>
                    <b>Appealed to re-instate</b>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {/* <label htmlFor="rural" style={{fontSize:'15px',display: 'flex', alignItems: 'center'}}> <u>Rural</u></label>  */}
                <TableRow>
                  <TableCell colSpan={18} style={{ textAlign: 'center', backgroundColor: '#604954', color: 'white' }}>
                    RURAL
                  </TableCell>
                </TableRow>
                {getAllDistrict.map((row, index) =>
                  row.districtName !== 'TOTAL' ? (
                    <TableRow key={index}>
                      <TableCell style={{ border: '1px solid black' }}>
                        <a style={{ color: 'blue' }} href={row.districtCode} onClick={() => getSubDistrictEvent(row.districtCode)}>
                          {row.districtName}
                        </a>
                      </TableCell>
                      <TableCell style={{ border: '1px solid black' }}>
                        {row.disTotalPensioner > 0 ? (
                          <a
                            style={{ color: 'blue', textDecoration: 'none' }}
                            title="Download"
                            href={row.disTotalPensioner}
                            onClick={() => getDisTotalPensionerEvent(row.districtCode, 'subDis', 'TotalPensioner')}
                          >
                            {row.disTotalPensioner}
                          </a>
                        ) : (
                          <span>{row.disTotalPensioner}</span>
                        )}
                      </TableCell>
                      <TableCell style={{ border: '1px solid black' }}>
                        {row.livePensioner > 0 ? (
                          <a
                            style={{ color: 'blue', textDecoration: 'none' }}
                            title="Download"
                            href={row.livePensioner}
                            onClick={() => getDisTotalPensionerEvent(row.districtCode, 'subDis', 'livePensioner')}
                          >
                            {row.livePensioner}
                          </a>
                        ) : (
                          <span>{row.livePensioner}</span>
                        )}
                      </TableCell>
                      <TableCell style={{ border: '1px solid black' }}>
                        {row.livePensionerBankAc > 0 ? (
                          <a
                            style={{ color: 'blue', textDecoration: 'none' }}
                            title="Download"
                            href={row.livePensionerBankAc}
                            onClick={() => getDisTotalPensionerEvent(row.districtCode, 'subDis', 'livePensionerBankAc')}
                          >
                            {row.livePensionerBankAc}
                          </a>
                        ) : (
                          <span>{row.livePensionerBankAc}</span>
                        )}
                      </TableCell>
                      <TableCell style={{ border: '1px solid black' }}>
                        {row.livePensionerPo > 0 ? (
                          <a
                            style={{ color: 'blue', textDecoration: 'none' }}
                            title="Download"
                            href={row.livePensionerPo}
                            onClick={() => getDisTotalPensionerEvent(row.districtCode, 'subDis', 'livePensionerPo')}
                          >
                            {row.livePensionerPo}
                          </a>
                        ) : (
                          <span>{row.livePensionerPo}</span>
                        )}
                      </TableCell>
                      <TableCell style={{ border: '1px solid black' }}>
                        {row.livePensionerMo > 0 ? (
                          <a
                            style={{ color: 'blue', textDecoration: 'none' }}
                            title="Download"
                            href={row.livePensionerMo}
                            onClick={() => getDisTotalPensionerEvent(row.districtCode, 'subDis', 'livePensionerMo')}
                          >
                            {row.livePensionerMo}
                          </a>
                        ) : (
                          <span>{row.livePensionerMo}</span>
                        )}
                      </TableCell>
                      <TableCell style={{ border: '1px solid black' }}>
                        {row.livePensionerCash > 0 ? (
                          <a
                            style={{ color: 'blue', textDecoration: 'none' }}
                            title="Download"
                            href={row.livePensionerCash}
                            onClick={() => getDisTotalPensionerEvent(row.districtCode, 'subDis', 'livePensionerCash')}
                          >
                            {row.livePensionerCash}
                          </a>
                        ) : (
                          <span>{row.livePensionerCash}</span>
                        )}
                      </TableCell>
                      <TableCell style={{ border: '1px solid black' }}>
                        {row.livePensionerUid > 0 ? (
                          <a
                            style={{ color: 'blue', textDecoration: 'none' }}
                            title="Download"
                            href={row.livePensionerUid}
                            onClick={() => getDisTotalPensionerEvent(row.districtCode, 'subDis', 'livePensionerUid')}
                          >
                            {row.livePensionerUid}
                          </a>
                        ) : (
                          <span>{row.livePensionerUid}</span>
                        )}
                      </TableCell>
                      <TableCell style={{ border: '1px solid black' }}>
                        {row.livePensionerEid > 0 ? (
                          <a
                            style={{ color: 'blue', textDecoration: 'none' }}
                            title="Download"
                            href={row.livePensionerEid}
                            onClick={() => getDisTotalPensionerEvent(row.districtCode, 'subDis', 'livePensionerEid')}
                          >
                            {row.livePensionerEid}
                          </a>
                        ) : (
                          <span>{row.livePensionerEid}</span>
                        )}
                      </TableCell>
                      <TableCell style={{ border: '1px solid black' }}>
                        {row.pendingForVerification > 0 ? (
                          <a
                            style={{ color: 'blue', textDecoration: 'none' }}
                            title="Download"
                            href={row.pendingForVerification}
                            onClick={() => getDisTotalPensionerEvent(row.districtCode, 'subDis', 'livePensionerVerification')}
                          >
                            {row.pendingForVerification}
                          </a>
                        ) : (
                          <span>{row.pendingForVerification}</span>
                        )}
                      </TableCell>
                      <TableCell style={{ border: '1px solid black' }}>
                        {row.pendingForSanction > 0 ? (
                          <a
                            style={{ color: 'blue', textDecoration: 'none' }}
                            title="Download"
                            href={row.pendingForSanction}
                            onClick={() => getDisTotalPensionerEvent(row.districtCode, 'subDis', 'livePensionerSanction')}
                          >
                            {row.pendingForSanction}
                          </a>
                        ) : (
                          <span>{row.pendingForSanction}</span>
                        )}
                      </TableCell>
                      <TableCell style={{ border: '1px solid black' }}>
                        {row.pendingForIssueSo > 0 ? (
                          <a
                            style={{ color: 'blue', textDecoration: 'none' }}
                            title="Download"
                            href={row.pendingForIssueSo}
                            onClick={() => getDisTotalPensionerEvent(row.districtCode, 'subDis', 'livePensionerIssueSo')}
                          >
                            {row.pendingForIssueSo}
                          </a>
                        ) : (
                          <span>{row.pendingForIssueSo}</span>
                        )}
                      </TableCell>
                      <TableCell style={{ border: '1px solid black' }}>
                        {row.statusApplicationRejected > 0 ? (
                          <a
                            style={{ color: 'blue', textDecoration: 'none' }}
                            title="Download"
                            href={row.statusApplicationRejected}
                            onClick={() => getDisTotalPensionerEvent(row.districtCode, 'subDis', 'livePensionerApplicationRejected')}
                          >
                            {row.statusApplicationRejected}
                          </a>
                        ) : (
                          <span>{row.statusApplicationRejected}</span>
                        )}
                      </TableCell>
                      {/* <TableCell style={{border:'1px solid black'}}>{row.inactivePensionersStopped > 0 ? (<a href={row.inactivePensionersStopped} onClick={() => getDisTotalPensionerEvent(row.districtCode,'SubDis','livePensionerStopped')}>{row.inactivePensionersStopped}</a>):(<span>{row.inactivePensionersStopped}</span>)}</TableCell> */}
                      <TableCell style={{ border: '1px solid black' }}>
                        {row.inactivePensionersDiscontinued > 0 ? (
                          <a
                            style={{ color: 'blue', textDecoration: 'none' }}
                            title="Download"
                            href={row.inactivePensionersDiscontinued}
                            onClick={() => getDisTotalPensionerEvent(row.districtCode, 'subDis', 'livePensionerDiscontinued')}
                          >
                            {row.inactivePensionersDiscontinued}
                          </a>
                        ) : (
                          <span>{row.inactivePensionersDiscontinued}</span>
                        )}
                      </TableCell>
                      <TableCell style={{ border: '1px solid black' }}>
                        {row.inactivePensionersAppealedToReinstate > 0 ? (
                          <a
                            style={{ color: 'blue', textDecoration: 'none' }}
                            title="Download"
                            href={row.inactivePensionersAppealedToReinstate}
                            onClick={() => getDisTotalPensionerEvent(row.districtCode, 'subDis', 'livePensionerReInstate')}
                          >
                            {row.inactivePensionersAppealedToReinstate}
                          </a>
                        ) : (
                          <span>{row.inactivePensionersAppealedToReinstate}</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ) : (
                    <TableRow key={index} style={{ backgroundColor: 'rgba(71, 140, 255, 1)' }}>
                      <TableCell style={{ border: '1px solid black', color: 'white' }}>{row.districtName}</TableCell>
                      <TableCell style={{ border: '1px solid black', color: 'white' }}>{row.disTotalPensioner}</TableCell>
                      <TableCell style={{ border: '1px solid black', color: 'white' }}>{row.livePensioner}</TableCell>
                      <TableCell style={{ border: '1px solid black', color: 'white' }}>{row.livePensionerBankAc}</TableCell>
                      <TableCell style={{ border: '1px solid black', color: 'white' }}>{row.livePensionerPo}</TableCell>
                      <TableCell style={{ border: '1px solid black', color: 'white' }}>{row.livePensionerMo}</TableCell>
                      <TableCell style={{ border: '1px solid black', color: 'white' }}>{row.livePensionerCash}</TableCell>
                      <TableCell style={{ border: '1px solid black', color: 'white' }}>{row.livePensionerUid}</TableCell>
                      <TableCell style={{ border: '1px solid black', color: 'white' }}>{row.livePensionerEid}</TableCell>
                      <TableCell style={{ border: '1px solid black', color: 'white' }}>{row.pendingForVerification}</TableCell>
                      <TableCell style={{ border: '1px solid black', color: 'white' }}>{row.pendingForSanction}</TableCell>
                      <TableCell style={{ border: '1px solid black', color: 'white' }}>{row.pendingForIssueSo}</TableCell>
                      <TableCell style={{ border: '1px solid black', color: 'white' }}>{row.statusApplicationRejected}</TableCell>
                      {/* <TableCell style={{border:'1px solid black'}}>{row.inactivePensionersStopped > 0 ? (<a href={row.inactivePensionersStopped} onClick={() => getDisTotalPensionerEvent(row.districtCode,'SubDis','livePensionerStopped')}>{row.inactivePensionersStopped}</a>):(<span>{row.inactivePensionersStopped}</span>)}</TableCell> */}
                      <TableCell style={{ border: '1px solid black', color: 'white' }}>{row.inactivePensionersDiscontinued}</TableCell>
                      <TableCell style={{ border: '1px solid black', color: 'white' }}>
                        {row.inactivePensionersAppealedToReinstate}
                      </TableCell>
                    </TableRow>
                  )
                )}

                {/* <label htmlFor="urban" style={{fontSize:'15px'}}>  <u>Urban</u></label>   */}
                <TableRow>
                  <TableCell colSpan={18} style={{ textAlign: 'center', backgroundColor: '#604954', color: 'white' }}>
                    URBAN
                  </TableCell>
                </TableRow>
                {getAllDistrictUrban.map((row, index) =>
                  row.districtName !== 'TOTAL' ? (
                    <TableRow key={index}>
                      <TableCell style={{ border: '1px solid black' }}>
                        <a style={{ color: 'blue' }} href={row.districtCode} onClick={() => getSubDistrictEvent(row.districtCode)}>
                          {row.districtName}
                        </a>
                      </TableCell>
                      <TableCell style={{ border: '1px solid black' }}>
                        {row.disTotalPensioner > 0 ? (
                          <a
                            style={{ color: 'blue', textDecoration: 'none' }}
                            title="Download"
                            href={row.disTotalPensioner}
                            onClick={() => getDisTotalPensionerEvent(row.districtCode, 'subDis', 'TotalPensioner')}
                          >
                            {row.disTotalPensioner}
                          </a>
                        ) : (
                          <span>{row.disTotalPensioner}</span>
                        )}
                      </TableCell>
                      <TableCell style={{ border: '1px solid black' }}>
                        {row.livePensioner > 0 ? (
                          <a
                            style={{ color: 'blue', textDecoration: 'none' }}
                            title="Download"
                            href={row.livePensioner}
                            onClick={() => getDisTotalPensionerEvent(row.districtCode, 'subDis', 'livePensioner')}
                          >
                            {row.livePensioner}
                          </a>
                        ) : (
                          <span>{row.livePensioner}</span>
                        )}
                      </TableCell>
                      <TableCell style={{ border: '1px solid black' }}>
                        {row.livePensionerBankAc > 0 ? (
                          <a
                            style={{ color: 'blue', textDecoration: 'none' }}
                            title="Download"
                            href={row.livePensionerBankAc}
                            onClick={() => getDisTotalPensionerEvent(row.districtCode, 'subDis', 'livePensionerBankAc')}
                          >
                            {row.livePensionerBankAc}
                          </a>
                        ) : (
                          <span>{row.livePensionerBankAc}</span>
                        )}
                      </TableCell>
                      <TableCell style={{ border: '1px solid black' }}>
                        {row.livePensionerPo > 0 ? (
                          <a
                            style={{ color: 'blue', textDecoration: 'none' }}
                            title="Download"
                            href={row.livePensionerPo}
                            onClick={() => getDisTotalPensionerEvent(row.districtCode, 'subDis', 'livePensionerPo')}
                          >
                            {row.livePensionerPo}
                          </a>
                        ) : (
                          <span>{row.livePensionerPo}</span>
                        )}
                      </TableCell>
                      <TableCell style={{ border: '1px solid black' }}>
                        {row.livePensionerMo > 0 ? (
                          <a
                            style={{ color: 'blue', textDecoration: 'none' }}
                            title="Download"
                            href={row.livePensionerMo}
                            onClick={() => getDisTotalPensionerEvent(row.districtCode, 'subDis', 'livePensionerMo')}
                          >
                            {row.livePensionerMo}
                          </a>
                        ) : (
                          <span>{row.livePensionerMo}</span>
                        )}
                      </TableCell>
                      <TableCell style={{ border: '1px solid black' }}>
                        {row.livePensionerCash > 0 ? (
                          <a
                            style={{ color: 'blue', textDecoration: 'none' }}
                            title="Download"
                            href={row.livePensionerCash}
                            onClick={() => getDisTotalPensionerEvent(row.districtCode, 'subDis', 'livePensionerCash')}
                          >
                            {row.livePensionerCash}
                          </a>
                        ) : (
                          <span>{row.livePensionerCash}</span>
                        )}
                      </TableCell>
                      <TableCell style={{ border: '1px solid black' }}>
                        {row.livePensionerUid > 0 ? (
                          <a
                            style={{ color: 'blue', textDecoration: 'none' }}
                            title="Download"
                            href={row.livePensionerUid}
                            onClick={() => getDisTotalPensionerEvent(row.districtCode, 'subDis', 'livePensionerUid')}
                          >
                            {row.livePensionerUid}
                          </a>
                        ) : (
                          <span>{row.livePensionerUid}</span>
                        )}
                      </TableCell>
                      <TableCell style={{ border: '1px solid black' }}>
                        {row.livePensionerEid > 0 ? (
                          <a
                            style={{ color: 'blue', textDecoration: 'none' }}
                            title="Download"
                            href={row.livePensionerEid}
                            onClick={() => getDisTotalPensionerEvent(row.districtCode, 'subDis', 'livePensionerEid')}
                          >
                            {row.livePensionerEid}
                          </a>
                        ) : (
                          <span>{row.livePensionerEid}</span>
                        )}
                      </TableCell>
                      <TableCell style={{ border: '1px solid black' }}>
                        {row.pendingForVerification > 0 ? (
                          <a
                            style={{ color: 'blue', textDecoration: 'none' }}
                            title="Download"
                            href={row.pendingForVerification}
                            onClick={() => getDisTotalPensionerEvent(row.districtCode, 'subDis', 'livePensionerVerification')}
                          >
                            {row.pendingForVerification}
                          </a>
                        ) : (
                          <span>{row.pendingForVerification}</span>
                        )}
                      </TableCell>
                      <TableCell style={{ border: '1px solid black' }}>
                        {row.pendingForSanction > 0 ? (
                          <a
                            style={{ color: 'blue', textDecoration: 'none' }}
                            title="Download"
                            href={row.pendingForSanction}
                            onClick={() => getDisTotalPensionerEvent(row.districtCode, 'subDis', 'livePensionerSanction')}
                          >
                            {row.pendingForSanction}
                          </a>
                        ) : (
                          <span>{row.pendingForSanction}</span>
                        )}
                      </TableCell>
                      <TableCell style={{ border: '1px solid black' }}>
                        {row.pendingForIssueSo > 0 ? (
                          <a
                            style={{ color: 'blue', textDecoration: 'none' }}
                            title="Download"
                            href={row.pendingForIssueSo}
                            onClick={() => getDisTotalPensionerEvent(row.districtCode, 'subDis', 'livePensionerIssueSo')}
                          >
                            {row.pendingForIssueSo}
                          </a>
                        ) : (
                          <span>{row.pendingForIssueSo}</span>
                        )}
                      </TableCell>
                      <TableCell style={{ border: '1px solid black' }}>
                        {row.statusApplicationRejected > 0 ? (
                          <a
                            style={{ color: 'blue', textDecoration: 'none' }}
                            title="Download"
                            href={row.statusApplicationRejected}
                            onClick={() => getDisTotalPensionerEvent(row.districtCode, 'subDis', 'livePensionerApplicationRejected')}
                          >
                            {row.statusApplicationRejected}
                          </a>
                        ) : (
                          <span>{row.statusApplicationRejected}</span>
                        )}
                      </TableCell>
                      {/* <TableCell style={{border:'1px solid black'}}>{row.inactivePensionersStopped > 0 ? (<a href={row.inactivePensionersStopped} onClick={() => getDisTotalPensionerEvent(row.districtCode,'subDis','livePensionerStopped')}>{row.inactivePensionersStopped}</a>):(<span>{row.inactivePensionersStopped}</span>)}</TableCell> */}
                      <TableCell style={{ border: '1px solid black' }}>
                        {row.inactivePensionersDiscontinued > 0 ? (
                          <a
                            style={{ color: 'blue', textDecoration: 'none' }}
                            title="Download"
                            href={row.inactivePensionersDiscontinued}
                            onClick={() => getDisTotalPensionerEvent(row.districtCode, 'subDis', 'livePensionerDiscontinued')}
                          >
                            {row.inactivePensionersDiscontinued}
                          </a>
                        ) : (
                          <span>{row.inactivePensionersDiscontinued}</span>
                        )}
                      </TableCell>
                      <TableCell style={{ border: '1px solid black' }}>
                        {row.inactivePensionersAppealedToReinstate > 0 ? (
                          <a
                            style={{ color: 'blue', textDecoration: 'none' }}
                            title="Download"
                            href={row.inactivePensionersAppealedToReinstate}
                            onClick={() => getDisTotalPensionerEvent(row.districtCode, 'subDis', 'livePensionerReInstate')}
                          >
                            {row.inactivePensionersAppealedToReinstate}
                          </a>
                        ) : (
                          <span>{row.inactivePensionersAppealedToReinstate}</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ) : (
                    <TableRow key={index} style={{ backgroundColor: 'rgba(71, 140, 255, 1)' }}>
                      <TableCell style={{ border: '1px solid black', color: 'white' }}>{row.districtName}</TableCell>
                      <TableCell style={{ border: '1px solid black', color: 'white' }}>{row.disTotalPensioner}</TableCell>
                      <TableCell style={{ border: '1px solid black', color: 'white' }}>{row.livePensioner}</TableCell>
                      <TableCell style={{ border: '1px solid black', color: 'white' }}>{row.livePensionerBankAc}</TableCell>
                      <TableCell style={{ border: '1px solid black', color: 'white' }}>{row.livePensionerPo}</TableCell>
                      <TableCell style={{ border: '1px solid black', color: 'white' }}>{row.livePensionerMo}</TableCell>
                      <TableCell style={{ border: '1px solid black', color: 'white' }}>{row.livePensionerCash}</TableCell>
                      <TableCell style={{ border: '1px solid black', color: 'white' }}>{row.livePensionerUid}</TableCell>
                      <TableCell style={{ border: '1px solid black', color: 'white' }}>{row.livePensionerEid}</TableCell>
                      <TableCell style={{ border: '1px solid black', color: 'white' }}>{row.pendingForVerification}</TableCell>
                      <TableCell style={{ border: '1px solid black', color: 'white' }}>{row.pendingForSanction}</TableCell>
                      <TableCell style={{ border: '1px solid black', color: 'white' }}>{row.pendingForIssueSo}</TableCell>
                      <TableCell style={{ border: '1px solid black', color: 'white' }}>{row.statusApplicationRejected}</TableCell>
                      {/* <TableCell style={{border:'1px solid black'}}>{row.inactivePensionersStopped > 0 ? (<a href={row.inactivePensionersStopped} onClick={() => getDisTotalPensionerEvent(row.districtCode,'SubDis','livePensionerStopped')}>{row.inactivePensionersStopped}</a>):(<span>{row.inactivePensionersStopped}</span>)}</TableCell> */}
                      <TableCell style={{ border: '1px solid black', color: 'white' }}>{row.inactivePensionersDiscontinued}</TableCell>
                      <TableCell style={{ border: '1px solid black', color: 'white' }}>
                        {row.inactivePensionersAppealedToReinstate}
                      </TableCell>
                    </TableRow>
                  )
                )}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <Table style={{ border: '1px solid #dddddd' }}>
              <TableHead>
                <TableRow>
                  <TableCell rowSpan={2} style={{ border: '1px solid #dddddd', backgroundColor: '#3B0B17', color: 'white' }}>
                    <b>GP/Ward</b>
                  </TableCell>
                  <TableCell rowSpan={2} style={{ border: '1px solid #dddddd', backgroundColor: '#3B0B17', color: 'white' }}>
                    <b>Total Pensioners</b>
                  </TableCell>
                  <TableCell rowSpan={2} style={{ border: '1px solid #dddddd', backgroundColor: '#3B0B17', color: 'white' }}>
                    <b>Live Pensioners</b>
                  </TableCell>
                  <TableCell
                    colSpan={6}
                    style={{ border: '1px solid #dddddd', backgroundColor: '#3B0B17', color: 'white', textAlign: 'center' }}
                  >
                    <b>Live Pensioners</b>
                  </TableCell>
                  <TableCell
                    colSpan={3}
                    style={{ border: '1px solid #dddddd', backgroundColor: '#3B0B17', color: 'white', textAlign: 'center' }}
                  >
                    <b>Pending For</b>
                  </TableCell>
                  <TableCell
                    colSpan={1}
                    style={{ border: '1px solid #dddddd', backgroundColor: '#3B0B17', color: 'white', textAlign: 'center' }}
                  >
                    <b>Status</b>
                  </TableCell>
                  <TableCell
                    colSpan={2}
                    style={{ border: '1px solid #dddddd', backgroundColor: '#3B0B17', color: 'white', textAlign: 'center' }}
                  >
                    <b>Inactive Pensioners</b>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell style={{ border: '1px solid #dddddd', backgroundColor: '#3B0B17', color: 'white' }}>
                    <b>Bank a/c</b>
                  </TableCell>
                  <TableCell style={{ border: '1px solid #dddddd', backgroundColor: '#3B0B17', color: 'white' }}>
                    <b>PO</b>
                  </TableCell>
                  <TableCell style={{ border: '1px solid #dddddd', backgroundColor: '#3B0B17', color: 'white' }}>
                    <b>MO</b>
                  </TableCell>
                  <TableCell style={{ border: '1px solid #dddddd', backgroundColor: '#3B0B17', color: 'white' }}>
                    <b>Cash</b>
                  </TableCell>
                  <TableCell style={{ border: '1px solid #dddddd', backgroundColor: '#3B0B17', color: 'white' }}>
                    <b>UID</b>
                  </TableCell>
                  <TableCell style={{ border: '1px solid #dddddd', backgroundColor: '#3B0B17', color: 'white' }}>
                    <b>EID</b>
                  </TableCell>
                  <TableCell style={{ border: '1px solid #dddddd', backgroundColor: '#3B0B17', color: 'white' }}>
                    <b>Verification</b>
                  </TableCell>
                  <TableCell style={{ border: '1px solid #dddddd', backgroundColor: '#3B0B17', color: 'white' }}>
                    <b>Sanction</b>
                  </TableCell>
                  <TableCell style={{ border: '1px solid #dddddd', backgroundColor: '#3B0B17', color: 'white' }}>
                    <b>Issue SO</b>
                  </TableCell>
                  <TableCell style={{ border: '1px solid #dddddd', backgroundColor: '#3B0B17', color: 'white' }}>
                    <b>Application Rejected</b>
                  </TableCell>
                  {/* <TableCell  style={{border:'1px solid #dddddd',backgroundColor:'#3B0B17',color:'white'}}><b>Stopped</b></TableCell> */}
                  <TableCell style={{ border: '1px solid #dddddd', backgroundColor: '#3B0B17', color: 'white' }}>
                    <b>Discontinued</b>
                  </TableCell>
                  <TableCell style={{ border: '1px solid #dddddd', backgroundColor: '#3B0B17', color: 'white' }}>
                    <b>Appealed to re-instate</b>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {getAllDistrict.map((row, index) =>
                  row.districtName !== 'TOTAL' ? (
                    <TableRow key={index}>
                      <TableCell style={{ border: '1px solid black' }}>{row.districtName}</TableCell>
                      <TableCell style={{ border: '1px solid black' }}>
                        {row.disTotalPensioner > 0 ? (
                          <a
                            style={{ color: 'blue', textDecoration: 'none' }}
                            title="Download"
                            href={row.disTotalPensioner}
                            onClick={() => getDisTotalPensionerEvent(row.districtCode, 'gp', 'TotalPensioner')}
                          >
                            {row.disTotalPensioner}
                          </a>
                        ) : (
                          <span>{row.disTotalPensioner}</span>
                        )}
                      </TableCell>
                      <TableCell style={{ border: '1px solid black' }}>
                        {row.livePensioner > 0 ? (
                          <a
                            style={{ color: 'blue', textDecoration: 'none' }}
                            title="Download"
                            href={row.livePensioner}
                            onClick={() => getDisTotalPensionerEvent(row.districtCode, 'gp', 'livePensioner')}
                          >
                            {row.livePensioner}
                          </a>
                        ) : (
                          <span>{row.livePensioner}</span>
                        )}
                      </TableCell>
                      <TableCell style={{ border: '1px solid black' }}>
                        {row.livePensionerBankAc > 0 ? (
                          <a
                            style={{ color: 'blue', textDecoration: 'none' }}
                            title="Download"
                            href={row.livePensionerBankAc}
                            onClick={() => getDisTotalPensionerEvent(row.districtCode, 'gp', 'livePensionerBankAc')}
                          >
                            {row.livePensionerBankAc}
                          </a>
                        ) : (
                          <span>{row.livePensionerBankAc}</span>
                        )}
                      </TableCell>
                      <TableCell style={{ border: '1px solid black' }}>
                        {row.livePensionerPo > 0 ? (
                          <a
                            style={{ color: 'blue', textDecoration: 'none' }}
                            title="Download"
                            href={row.livePensionerPo}
                            onClick={() => getDisTotalPensionerEvent(row.districtCode, 'gp', 'livePensionerPo')}
                          >
                            {row.livePensionerPo}
                          </a>
                        ) : (
                          <span>{row.livePensionerPo}</span>
                        )}
                      </TableCell>
                      <TableCell style={{ border: '1px solid black' }}>
                        {row.livePensionerMo > 0 ? (
                          <a
                            style={{ color: 'blue', textDecoration: 'none' }}
                            title="Download"
                            href={row.livePensionerMo}
                            onClick={() => getDisTotalPensionerEvent(row.districtCode, 'gp', 'livePensionerMo')}
                          >
                            {row.livePensionerMo}
                          </a>
                        ) : (
                          <span>{row.livePensionerMo}</span>
                        )}
                      </TableCell>
                      <TableCell style={{ border: '1px solid black' }}>
                        {row.livePensionerCash > 0 ? (
                          <a
                            style={{ color: 'blue', textDecoration: 'none' }}
                            title="Download"
                            href={row.livePensionerCash}
                            onClick={() => getDisTotalPensionerEvent(row.districtCode, 'gp', 'livePensionerCash')}
                          >
                            {row.livePensionerCash}
                          </a>
                        ) : (
                          <span>{row.livePensionerCash}</span>
                        )}
                      </TableCell>
                      <TableCell style={{ border: '1px solid black' }}>
                        {row.livePensionerUid > 0 ? (
                          <a
                            style={{ color: 'blue', textDecoration: 'none' }}
                            title="Download"
                            href={row.livePensionerUid}
                            onClick={() => getDisTotalPensionerEvent(row.districtCode, 'gp', 'livePensionerUid')}
                          >
                            {row.livePensionerUid}
                          </a>
                        ) : (
                          <span>{row.livePensionerUid}</span>
                        )}
                      </TableCell>
                      <TableCell style={{ border: '1px solid black' }}>
                        {row.livePensionerEid > 0 ? (
                          <a
                            style={{ color: 'blue', textDecoration: 'none' }}
                            title="Download"
                            href={row.livePensionerEid}
                            onClick={() => getDisTotalPensionerEvent(row.districtCode, 'gp', 'livePensionerEid')}
                          >
                            {row.livePensionerEid}
                          </a>
                        ) : (
                          <span>{row.livePensionerEid}</span>
                        )}
                      </TableCell>
                      <TableCell style={{ border: '1px solid black' }}>
                        {row.pendingForVerification > 0 ? (
                          <a
                            style={{ color: 'blue', textDecoration: 'none' }}
                            title="Download"
                            href={row.pendingForVerification}
                            onClick={() => getDisTotalPensionerEvent(row.districtCode, 'gp', 'livePensionerVerification')}
                          >
                            {row.pendingForVerification}
                          </a>
                        ) : (
                          <span>{row.pendingForVerification}</span>
                        )}
                      </TableCell>
                      <TableCell style={{ border: '1px solid black' }}>
                        {row.pendingForSanction > 0 ? (
                          <a
                            style={{ color: 'blue', textDecoration: 'none' }}
                            title="Download"
                            href={row.pendingForSanction}
                            onClick={() => getDisTotalPensionerEvent(row.districtCode, 'gp', 'livePensionerSanction')}
                          >
                            {row.pendingForSanction}
                          </a>
                        ) : (
                          <span>{row.pendingForSanction}</span>
                        )}
                      </TableCell>
                      <TableCell style={{ border: '1px solid black' }}>
                        {row.pendingForIssueSo > 0 ? (
                          <a
                            style={{ color: 'blue', textDecoration: 'none' }}
                            title="Download"
                            href={row.pendingForIssueSo}
                            onClick={() => getDisTotalPensionerEvent(row.districtCode, 'gp', 'livePensionerIssueSo')}
                          >
                            {row.pendingForIssueSo}
                          </a>
                        ) : (
                          <span>{row.pendingForIssueSo}</span>
                        )}
                      </TableCell>
                      <TableCell style={{ border: '1px solid black' }}>
                        {row.statusApplicationRejected > 0 ? (
                          <a
                            style={{ color: 'blue', textDecoration: 'none' }}
                            title="Download"
                            href={row.statusApplicationRejected}
                            onClick={() => getDisTotalPensionerEvent(row.districtCode, 'gp', 'livePensionerApplicationRejected')}
                          >
                            {row.statusApplicationRejected}
                          </a>
                        ) : (
                          <span>{row.statusApplicationRejected}</span>
                        )}
                      </TableCell>
                      {/* <TableCell style={{border:'1px solid black'}}>{row.inactivePensionersStopped > 0 ? (<a href={row.inactivePensionersStopped} onClick={() => getDisTotalPensionerEvent(row.districtCode,'gp','livePensionerStopped')}>{row.inactivePensionersStopped}</a>):(<span>{row.inactivePensionersStopped}</span>)}</TableCell> */}
                      <TableCell style={{ border: '1px solid black' }}>
                        {row.inactivePensionersDiscontinued > 0 ? (
                          <a
                            style={{ color: 'blue', textDecoration: 'none' }}
                            title="Download"
                            href={row.inactivePensionersDiscontinued}
                            onClick={() => getDisTotalPensionerEvent(row.districtCode, 'gp', 'livePensionerDiscontinued')}
                          >
                            {row.inactivePensionersDiscontinued}
                          </a>
                        ) : (
                          <span>{row.inactivePensionersDiscontinued}</span>
                        )}
                      </TableCell>
                      <TableCell style={{ border: '1px solid black' }}>
                        {row.inactivePensionersAppealedToReinstate > 0 ? (
                          <a
                            style={{ color: 'blue', textDecoration: 'none' }}
                            title="Download"
                            href={row.inactivePensionersAppealedToReinstate}
                            onClick={() => getDisTotalPensionerEvent(row.districtCode, 'gp', 'livePensionerReInstate')}
                          >
                            {row.inactivePensionersAppealedToReinstate}
                          </a>
                        ) : (
                          <span>{row.inactivePensionersAppealedToReinstate}</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ) : (
                    <TableRow key={index} style={{ backgroundColor: 'rgb(71, 140, 255)' }}>
                      <TableCell style={{ border: '1px solid black', color: 'white' }}>{row.districtName}</TableCell>
                      <TableCell style={{ border: '1px solid black', color: 'white' }}>{row.disTotalPensioner}</TableCell>
                      <TableCell style={{ border: '1px solid black', color: 'white' }}>{row.livePensioner}</TableCell>
                      <TableCell style={{ border: '1px solid black', color: 'white' }}>{row.livePensionerBankAc}</TableCell>
                      <TableCell style={{ border: '1px solid black', color: 'white' }}>{row.livePensionerPo}</TableCell>
                      <TableCell style={{ border: '1px solid black', color: 'white' }}>{row.livePensionerMo}</TableCell>
                      <TableCell style={{ border: '1px solid black', color: 'white' }}>{row.livePensionerCash}</TableCell>
                      <TableCell style={{ border: '1px solid black', color: 'white' }}>{row.livePensionerUid}</TableCell>
                      <TableCell style={{ border: '1px solid black', color: 'white' }}>{row.livePensionerEid}</TableCell>
                      <TableCell style={{ border: '1px solid black', color: 'white' }}>{row.pendingForVerification}</TableCell>
                      <TableCell style={{ border: '1px solid black', color: 'white' }}>{row.pendingForSanction}</TableCell>
                      <TableCell style={{ border: '1px solid black', color: 'white' }}>{row.pendingForIssueSo}</TableCell>
                      <TableCell style={{ border: '1px solid black', color: 'white' }}>{row.statusApplicationRejected}</TableCell>
                      {/* <TableCell style={{border:'1px solid black'}}>{row.inactivePensionersStopped > 0 ? (<a href={row.inactivePensionersStopped} onClick={() => getDisTotalPensionerEvent(row.districtCode,'gp','livePensionerStopped')}>{row.inactivePensionersStopped}</a>):(<span>{row.inactivePensionersStopped}</span>)}</TableCell> */}
                      <TableCell style={{ border: '1px solid black', color: 'white' }}>{row.inactivePensionersDiscontinued}</TableCell>
                      <TableCell style={{ border: '1px solid black', color: 'white' }}>
                        {row.inactivePensionersAppealedToReinstate}
                      </TableCell>
                    </TableRow>
                  )
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </MainCard>

      {getAllDistrict.length > 0 ? (
        <>
          <form onSubmit={handleFormSubmit}>{/* for form data */}</form>
        </>
      ) : (
        <div></div>
      )}
    </div>
  );
}
export default PensionersProgressiveAbstract;
