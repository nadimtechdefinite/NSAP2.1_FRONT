import AreaList from 'components/form_components/AreaList';
import DistrictList from 'components/form_components/DistrictList';
import StateList from 'components/form_components/StateList';
import SubDistrictList from 'components/form_components/SubDistrictList';
import React, { useState, useEffect } from 'react';
import {
  FormControl,
  Grid,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableContainer,
  Paper,
  TableBody,
  TextField,
  Modal,
  Snackbar,
  Alert,
  Backdrop,
  CircularProgress,
  Button
} from '@mui/material';
import axiosInstance from 'hooks/useAuthTokenUrl';
import { number } from 'prop-types';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import DownloadIcon from '@mui/icons-material/Download';

function AgeAbstractReport() {
  const [stateId, setStateId] = useState('');
  const [districtId, setdistrictId] = useState('');
  const [areaid, setareaid] = useState('');
  const [subdist, setsubdist] = useState('');
  const [AllAgeAbsData, setAllAgeAbsData] = useState([]);
  const [PensionerDetailsWithScheme, setPensionerDetailsWithScheme] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const handleCloseSnackbar = () => setSnackbar(null);
  const [snackbar, setSnackbar] = React.useState(null);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const getUrl = `/age-abstract/findAgeAbstractDetails/${stateId}/${districtId}/${areaid}/${subdist}`;
      const response = await axiosInstance.get(getUrl);
      if (response.data.length < 1) {
        setSnackbar({ children: 'No  Data Found', severity: 'error' });
        return false;
      }
      if (response.status >= 200 && response.status < 300) {
        const dataWithSerialNumber = response.data.map((item, index) => ({
          ...item,
          Count: index + 1 // Using index as the default row identifier
        }));

        return dataWithSerialNumber;
      } else {
        setSnackbar({ children: 'No  Data Found', severity: 'error' });
      }
    } catch (e) {
      setSnackbar({ children: 'No  Data Found', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const fetchPensionerDetailsWithScheme = async (x, scheme, ageRange) => {
    try {
      setLoading(true);
      setPensionerDetailsWithScheme([]);
      const getUrl = `/age-abstract/findPensionerDetailsWithScheme/${x.gpCode}/${scheme}/${ageRange}`;
      const response = await axiosInstance.get(getUrl);

      if (response.data.length < 1) {
        setPensionerDetailsWithScheme([]);
        setSnackbar({ children: 'No  Data Found', severity: 'error' });
        return false;
      }

      const dataWithSerialNumber = response.data.map((item, index) => ({
        ...item,
        Count: index + 1 // Using index as the default row identifier
      }));
      setPensionerDetailsWithScheme(dataWithSerialNumber);
    } catch (error) {
      setSnackbar({ children: 'No  Data Found', severity: 'error' });
    } finally {
      setOpenModal(true);
      setLoading(false);
    }
  };

  const handleSelectStateid = (state) => {
    setStateId(state);
  };

  const handleDistid = (dist) => {
    setdistrictId(dist);
  };

  const handleAreaid = (area) => {
    setareaid(area);
  };
  const handleSubDistid = (sd) => {
    setsubdist(sd);
  };

  const showPensionerDetails = (x, scheme, ageRange) => {
    fetchPensionerDetailsWithScheme(x, scheme, ageRange);
  };

  useEffect(() => {
    if (subdist) {
      fetchData()
        .then((res) => {
          setAllAgeAbsData(res);
        })
        .catch((e) => {
          console.log(e.message);
        });
    }
  }, [subdist]);

  const handleCloseModal = () => setOpenModal(false);

  const handleChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredPensioners = PensionerDetailsWithScheme.filter((item) => {
    const searchFields = [
      item.districtName,
      item.subdistrictName,
      item.gpName,
      item.villageName,
      item.area,
      item.sanctionOrderNo,
      item.applicantName,
      item.fatherHusName,
      item.ageApplicant.toString(),
      item.dob.toString(),
      item.schemeCode
    ];
    return searchFields.some((field) => field.toLowerCase().includes(searchTerm.toLowerCase()));
  });

  // const headers = [
  //   'District',
  //   'Sub-District',
  //   'Grampanchayat/Ward',
  //   'Village',
  //   'Area',
  //   'Sanction No.',
  //   'Applicant Name',
  //   'Father/Husband Name',
  //   'Age',
  //   'D.O.B',
  //   'Scheme'
  // ];

  // const dataWithHeaders = PensionerDetailsWithScheme.map(item => [
  //   item.districtName,
  //   item.subdistrictName,
  //   item.gpName,
  //   item.villageName,
  //   item.area,
  //   item.sanctionOrderNo,
  //   item.applicantName,
  //   item.fatherHusName,
  //   item.ageApplicant,
  //   item.dob,
  //   item.schemeCode
  // ]);

  // const exportToExcel = () => {
  //   const worksheet = XLSX.utils.aoa_to_sheet([headers, ...dataWithHeaders]);
  //     const workbook = XLSX.utils.book_new();
  //   XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
  //   XLSX.writeFile(workbook, 'pensioner_details.xlsx');

  // };

  const exportToExcel = (id) => {
    // Create a new workbook
    const wb = XLSX.utils.book_new();
    // Convert the table to a worksheet
    const ws = XLSX.utils.table_to_sheet(document.getElementById(id));
    // Add the worksheet to the workbook
    XLSX.utils.book_append_sheet(wb, ws, id);
    // Save the workbook as an Excel file
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    saveAs(new Blob([excelBuffer], { type: 'application/octet-stream' }), id + '.xlsx');
  };

  return (
    <div>
      {!!snackbar && (
        <Snackbar open anchorOrigin={{ vertical: 'top', horizontal: 'center' }} onClose={handleCloseSnackbar} autoHideDuration={6000}>
          <Alert {...snackbar} onClose={handleCloseSnackbar} />
        </Snackbar>
      )}

      <Grid container spacing={2} style={{ paddingBottom: '20px' }} size="small">
        <Grid item xs={12} sm={3}>
          <FormControl fullWidth>
            <StateList onSelectState={handleSelectStateid} isMandatory={true} />
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={3}>
          <FormControl fullWidth>
            <DistrictList selectedStateId={stateId} onSelectDistrict={handleDistid} isMandatory={true} />
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={3}>
          <FormControl fullWidth>
            <AreaList onSelectArea={handleAreaid} isMandatory={true} />
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={3}>
          <FormControl fullWidth>
            <SubDistrictList
              selectedDistrictId={districtId}
              selectedAreaId={areaid}
              onSelectSubDistrict={handleSubDistid}
              isMandatory={true}
            />
          </FormControl>
        </Grid>
      </Grid>
      {/* ----------------------------------------------------------------------------------------- */}
      {AllAgeAbsData.length > 0 && (
        <div>
          <TableContainer component={Paper} style={{ marginTop: '25px' }}>
            <div style={{ textAlign: 'right' }}>
              <Button
                variant="contained"
                style={{ backgroundColor: '#8555a3', marginLeft: '20px' }}
                onClick={() => exportToExcel('pensioner-count')}
              >
                <DownloadIcon />
                Excel
              </Button>
            </div>
            <div style={{ backgroundColor: '#333', color: 'white', padding: '10px' }}>
              <div style={{ borderBottom: '3px solid white', paddingBottom: '10px', textAlign: 'center' }}>
                <h2> Pensioner Age Abstract Report</h2>
                <h4>Area: {areaid === 'R' ? 'Rural' : areaid === 'U' ? 'Urban' : 'Unknown'}</h4>
              </div>
            </div>
            <div style={{ overflowX: 'auto', maxWidth: '100%', height: '700px' }}>
              <Table id="pensioner-count">
                <TableHead style={{ backgroundColor: '#bfbfbf' }}>
                  <TableRow>
                    <TableCell align="center" rowSpan={2} style={{ border: '1px solid #000' }}>
                      <font size="2">Sr. No.</font>
                    </TableCell>
                    <TableCell align="center" rowSpan={2} style={{ border: '1px solid #000' }}>
                      <font size="2">GramPanchayat/Ward</font>
                    </TableCell>
                    <TableCell align="center" colSpan={4} style={{ border: '1px solid #000' }}>
                      <font size="2">IGNOAPS</font>
                    </TableCell>
                    <TableCell align="center" colSpan={4} style={{ border: '1px solid #000' }}>
                      <font size="2">IGNWPS</font>
                    </TableCell>
                    <TableCell align="center" colSpan={4} style={{ border: '1px solid #000' }}>
                      <font size="2">IGNDPS</font>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell style={{ border: '1px solid #000' }}>
                      <font size="2">60-79 </font>
                    </TableCell>
                    <TableCell style={{ border: '1px solid #000' }}>
                      <font size="2">80-100 </font>
                    </TableCell>
                    <TableCell style={{ border: '1px solid #000' }}>
                      <font size="2">100-105 </font>
                    </TableCell>
                    <TableCell style={{ border: '1px solid #000' }}>
                      <font size="2">105above </font>
                    </TableCell>
                    <TableCell style={{ border: '1px solid #000' }}>
                      <font size="2">40-79 </font>
                    </TableCell>
                    <TableCell style={{ border: '1px solid #000' }}>
                      <font size="2">80-100 </font>
                    </TableCell>
                    <TableCell style={{ border: '1px solid #000' }}>
                      <font size="2">100-105 </font>
                    </TableCell>
                    <TableCell style={{ border: '1px solid #000' }}>
                      <font size="2">105above </font>
                    </TableCell>
                    <TableCell style={{ border: '1px solid #000' }}>
                      <font size="2">18-79 </font>
                    </TableCell>
                    <TableCell style={{ border: '1px solid #000' }}>
                      <font size="2">80-100 </font>
                    </TableCell>
                    <TableCell style={{ border: '1px solid #000' }}>
                      <font size="2">100-105 </font>
                    </TableCell>
                    <TableCell style={{ border: '1px solid #000' }}>
                      <font size="2">105above </font>
                    </TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {AllAgeAbsData.map((item) => (
                    <TableRow key={item.id}>
                      {' '}
                      {/* Assuming there's an id property */}
                      <TableCell style={{ border: '1px solid #000' }}>
                        <font size="2">{item.Count}</font>
                      </TableCell>
                      <TableCell style={{ border: '1px solid #000' }}>
                        <font size="2">{item.gpName}</font>
                      </TableCell>
                      <TableCell style={{ border: '1px solid #000', textAlign: 'right' }}>
                        <button
                          type="button"
                          onClick={() => showPensionerDetails(item, 'IGNOAPS', '60-79')}
                          style={{
                            color: 'blue',
                            backgroundColor: 'transparent',
                            border: 'none',
                            cursor: 'pointer',
                            textDecoration: 'underline'
                          }}
                        >
                          <font size="2">{item.ignoaps6079}</font>
                        </button>
                      </TableCell>
                      <TableCell style={{ border: '1px solid #000', textAlign: 'right' }}>
                        <button
                          type="button"
                          onClick={() => showPensionerDetails(item, 'IGNOAPS', '80-100')}
                          style={{
                            color: 'blue',
                            backgroundColor: 'transparent',
                            border: 'none',
                            cursor: 'pointer',
                            textDecoration: 'underline'
                          }}
                        >
                          <font size="2">{item.ignoaps80100}</font>
                        </button>
                      </TableCell>
                      <TableCell style={{ border: '1px solid #000', textAlign: 'right' }}>
                        <button
                          type="button"
                          onClick={() => showPensionerDetails(item, 'IGNOAPS', '100-105')}
                          style={{
                            color: 'blue',
                            backgroundColor: 'transparent',
                            border: 'none',
                            cursor: 'pointer',
                            textDecoration: 'underline'
                          }}
                        >
                          <font size="2">{item.ignoaps100105}</font>
                        </button>
                      </TableCell>
                      <TableCell style={{ border: '1px solid #000', textAlign: 'right' }}>
                        <button
                          type="button"
                          onClick={() => showPensionerDetails(item, 'IGNOAPS', '105-200')}
                          style={{
                            color: 'blue',
                            backgroundColor: 'transparent',
                            border: 'none',
                            cursor: 'pointer',
                            textDecoration: 'underline'
                          }}
                        >
                          <font size="2">{item.ignoaps105above}</font>
                        </button>
                      </TableCell>
                      <TableCell style={{ border: '1px solid #000', textAlign: 'right' }}>
                        <button
                          type="button"
                          onClick={() => showPensionerDetails(item, 'IGNWPS', '40-79')}
                          style={{
                            color: 'blue',
                            backgroundColor: 'transparent',
                            border: 'none',
                            cursor: 'pointer',
                            textDecoration: 'underline'
                          }}
                        >
                          <font size="2">{item.ignwps4079}</font>
                        </button>
                      </TableCell>
                      <TableCell style={{ border: '1px solid #000', textAlign: 'right' }}>
                        <button
                          type="button"
                          onClick={() => showPensionerDetails(item, 'IGNWPS', '80-100')}
                          style={{
                            color: 'blue',
                            backgroundColor: 'transparent',
                            border: 'none',
                            cursor: 'pointer',
                            textDecoration: 'underline'
                          }}
                        >
                          <font size="2">{item.ignwps80100}</font>
                        </button>
                      </TableCell>
                      <TableCell style={{ border: '1px solid #000', textAlign: 'right' }}>
                        <button
                          type="button"
                          onClick={() => showPensionerDetails(item, 'IGNWPS', '100-105')}
                          style={{
                            color: 'blue',
                            backgroundColor: 'transparent',
                            border: 'none',
                            cursor: 'pointer',
                            textDecoration: 'underline'
                          }}
                        >
                          <font size="2">{item.ignwps100105}</font>
                        </button>
                      </TableCell>
                      <TableCell style={{ border: '1px solid #000', textAlign: 'right' }}>
                        <button
                          type="button"
                          onClick={() => showPensionerDetails(item, 'IGNWPS', '105-200')}
                          style={{
                            color: 'blue',
                            backgroundColor: 'transparent',
                            border: 'none',
                            cursor: 'pointer',
                            textDecoration: 'underline'
                          }}
                        >
                          <font size="2">{item.ignwps105above}</font>
                        </button>
                      </TableCell>
                      <TableCell style={{ border: '1px solid #000', textAlign: 'right' }}>
                        <button
                          type="button"
                          onClick={() => showPensionerDetails(item, 'IGNDPS', '18-79')}
                          style={{
                            color: 'blue',
                            backgroundColor: 'transparent',
                            border: 'none',
                            cursor: 'pointer',
                            textDecoration: 'underline'
                          }}
                        >
                          <font size="2">{item.igndps4079}</font>
                        </button>
                      </TableCell>
                      <TableCell style={{ border: '1px solid #000', textAlign: 'right' }}>
                        <button
                          type="button"
                          onClick={() => showPensionerDetails(item, 'IGNDPS', '80-100')}
                          style={{
                            color: 'blue',
                            backgroundColor: 'transparent',
                            border: 'none',
                            cursor: 'pointer',
                            textDecoration: 'underline'
                          }}
                        >
                          <font size="2">{item.igndps80100}</font>
                        </button>
                      </TableCell>
                      <TableCell style={{ border: '1px solid #000', textAlign: 'right' }}>
                        <button
                          type="button"
                          onClick={() => showPensionerDetails(item, 'IGNDPS', '100-105')}
                          style={{
                            color: 'blue',
                            backgroundColor: 'transparent',
                            border: 'none',
                            cursor: 'pointer',
                            textDecoration: 'underline'
                          }}
                        >
                          <font size="2">{item.igndps100105}</font>
                        </button>
                      </TableCell>
                      <TableCell style={{ border: '1px solid #000', textAlign: 'right' }}>
                        <button
                          type="button"
                          onClick={() => showPensionerDetails(item, 'IGNDPS', '105-200')}
                          style={{
                            color: 'blue',
                            backgroundColor: 'transparent',
                            border: 'none',
                            cursor: 'pointer',
                            textDecoration: 'underline'
                          }}
                        >
                          <font size="2">{item.igndps105above}</font>
                        </button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TableContainer>
        </div>
      )}
      {/* ---------------------------------------------------------------------------------------------------------------------------------------- */}
      <div>
        {PensionerDetailsWithScheme.length > 0 && (
          <Modal
            open={openModal}
            onClose={handleCloseModal}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Paper
              style={{
                width: '90%',
                maxHeight: '90%',
                overflowY: 'auto',
                boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
                padding: '20px',
                position: 'relative',
                backgroundColor: '#fff',
                borderRadius: '8px'
              }}
            >
              <div>
                <div style={{ backgroundColor: '#333', color: 'white', padding: '10px' }}>
                  <div style={{ borderBottom: '2px solid white', paddingBottom: '5px', textAlign: 'center' }}>
                    {' '}
                    <h2> Pensioner Age Abstract Details</h2>
                  </div>
                </div>
                <div style={{ textAlign: 'right', marginTop: '15px' }}>
                  <TextField
                    label="Search"
                    variant="outlined"
                    value={searchTerm}
                    onChange={handleChange}
                    style={{ marginBottom: '10px' }}
                  />

                  <Button
                    variant="contained"
                    style={{ backgroundColor: '#8555a3', marginLeft: '20px' }}
                    onClick={() => exportToExcel('pensioner-table')}
                  >
                    <DownloadIcon />
                    Excel
                  </Button>
                </div>

                <div style={{ overflowX: 'auto', maxWidth: '100%', height: '700px' }}>
                  <Table id="pensioner-table">
                    <TableHead style={{ backgroundColor: '#f2f2f2' }}>
                      <TableRow>
                        <TableCell>
                          <font size="2">Sr.No</font>
                        </TableCell>
                        <TableCell>
                          <font size="2">District</font>
                        </TableCell>
                        <TableCell>
                          <font size="2">Sub-District</font>
                        </TableCell>
                        <TableCell>
                          <font size="2">Grampanchayat/Ward</font>
                        </TableCell>
                        <TableCell>
                          <font size="2">Village</font>
                        </TableCell>
                        <TableCell>
                          <font size="2">Area</font>
                        </TableCell>
                        <TableCell>
                          <font size="2">Sanction No.</font>
                        </TableCell>
                        <TableCell>
                          <font size="2">Applicant Name</font>
                        </TableCell>
                        <TableCell>
                          <font size="2">Father/Husband Name</font>
                        </TableCell>
                        <TableCell>
                          <font size="2">Age</font>
                        </TableCell>
                        <TableCell>
                          <font size="2">D.O.B</font>
                        </TableCell>
                        <TableCell>
                          <font size="2">Scheme</font>
                        </TableCell>
                      </TableRow>
                    </TableHead>

                    <TableBody>
                      {filteredPensioners.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell style={{ border: '1px solid #000' }}>
                            <font size="2">{item.Count}</font>
                          </TableCell>
                          <TableCell style={{ border: '1px solid #000' }}>
                            <font size="2">{item.districtName}</font>
                          </TableCell>
                          <TableCell style={{ border: '1px solid #000' }}>
                            <font size="2">{item.subdistrictName}</font>
                          </TableCell>
                          <TableCell style={{ border: '1px solid #000' }}>
                            <font size="2">{item.gpName}</font>
                          </TableCell>
                          <TableCell style={{ border: '1px solid #000' }}>
                            <font size="2">{item.villageName}</font>
                          </TableCell>
                          <TableCell style={{ border: '1px solid #000' }}>
                            <font size="2">{item.area}</font>
                          </TableCell>
                          <TableCell style={{ border: '1px solid #000' }}>
                            <font size="2">{item.sanctionOrderNo}</font>
                          </TableCell>
                          <TableCell style={{ border: '1px solid #000' }}>
                            <font size="2">{item.applicantName}</font>
                          </TableCell>
                          <TableCell style={{ border: '1px solid #000' }}>
                            <font size="2">{item.fatherHusName}</font>
                          </TableCell>

                          <TableCell style={{ border: '1px solid #000', textAlign: 'right' }}>
                            <font size="2">{item.ageApplicant | number}</font>
                          </TableCell>
                          <TableCell style={{ border: '1px solid #000', textAlign: 'right' }}>
                            <font size="2">{item.dob}</font>
                          </TableCell>
                          <TableCell style={{ border: '1px solid #000' }}>
                            <font size="2">{item.schemeCode}</font>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </Paper>
          </Modal>
        )}
      </div>

      {/* --------------------------------------------------------------------------- */}
      <Backdrop open={loading} style={{ zIndex: 999, color: '#fff' }}>
        <CircularProgress color="inherit" />
      </Backdrop>
      {/* -------------------------------------------------------------- */}
    </div>
  );
}

export default AgeAbstractReport;
