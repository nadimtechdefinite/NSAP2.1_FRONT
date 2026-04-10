import React, { useState } from 'react';
import axiosInstance from 'hooks/useAuthTokenUrl';
import MainCard from 'ui-component/cards/MainCard';
import {
  Alert,
  Backdrop,
  Button,
  CircularProgress,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TableRow
} from '@mui/material';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import DownloadIcon from '@mui/icons-material/Download';
import reportcss from 'components/common/reportsCSS';
import { useEffect } from 'react';

const AgeAbstractAllStateReport = () => {
  const classes = reportcss();
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState(null);
  const handleCloseSnackbar = () => setSnackbar(null);
  const [dataSummary, setDataSummary] = useState([]);

  const getAgeAbstractAllStateReport = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('age-abstract/AgeAbstractReportAllState');
      if (response.status == 204) {
        setSnackbar({ children: 'No Data Available', severity: 'error' });
        return false;
      }
      const newData = response.data.map((row) => ({ ...row, id: row.sno }));
      setDataSummary(newData);
    } catch (error) {
      setSnackbar({ children: 'Some Internal Error Occured While Getting Report Data', severity: 'error' });
      console.error('Error fetching Getting Report Data', error);
    } finally {
      // console.log(dataSummary);
      setLoading(false);
    }
  };

  useEffect(() => {
    getAgeAbstractAllStateReport();
  }, []);

  const exportToExcel = (id) => {
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.table_to_sheet(document.getElementById(id));
    XLSX.utils.book_append_sheet(wb, ws, id);
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    saveAs(new Blob([excelBuffer], { type: 'application/octet-stream' }), id + '.xlsx');
  };

  return (
    <>
      <Backdrop open={loading} style={{ zIndex: 999, color: '#fff' }}>
        <CircularProgress color="inherit" />
      </Backdrop>

      {!!snackbar && (
        <Snackbar open anchorOrigin={{ vertical: 'top', horizontal: 'center' }} onClose={handleCloseSnackbar} autoHideDuration={6000}>
          <Alert {...snackbar} onClose={handleCloseSnackbar} />
        </Snackbar>
      )}

      <MainCard title="AGE Abstract Report">
        {dataSummary.length > 0 && (
          <>
            <div style={{ textAlign: 'left', paddingTop: '10px' }}>
              <Button
                variant="contained"
                style={{ backgroundColor: '#8555a3' }}
                onClick={() => exportToExcel('Age_Abstract_Report_All_State')}
              >
                <DownloadIcon /> Excel
              </Button>
            </div>
            <TableContainer className={classes.tableContainer} style={{ marginTop: '20px' }}>
              <Table aria-label="sticky table" id="Age_Abstract_Report_All_State" className={classes.table}>
                <TableHead>
                  <TableRow style={{ position: 'sticky', top: -1, zIndex: 999, background: 'white' }}>
                    <TableCell className={classes.tableBody}>Sr. No.</TableCell>
                    <TableCell className={classes.tableBody}>State</TableCell>
                    <TableCell className={classes.tableBody} style={{ background: '#e8efdb' }} colSpan={6}>
                      IGNOAPS
                    </TableCell>
                    <TableCell className={classes.tableBody} style={{ background: '#e1e7f1' }} colSpan={6}>
                      IGNWPS
                    </TableCell>
                    <TableCell className={classes.tableBody} style={{ background: '#e9e8dc' }} colSpan={6}>
                      IGNDPS
                    </TableCell>
                  </TableRow>
                  <TableRow style={{ position: 'sticky', top: 1.5, zIndex: 999, background: 'white' }}>
                    <TableCell className={classes.tableBody}></TableCell>
                    <TableCell className={classes.tableBody}></TableCell>
                    <TableCell className={classes.tableBody} style={{ background: '#e8efdb' }}>
                      State Cap
                    </TableCell>
                    <TableCell className={classes.tableBody} style={{ background: '#e8efdb' }}>
                      60-79
                    </TableCell>
                    <TableCell className={classes.tableBody} style={{ background: '#e8efdb' }}>
                      80-99
                    </TableCell>
                    <TableCell className={classes.tableBody} style={{ background: '#e8efdb' }}>
                      100-105
                    </TableCell>
                    <TableCell className={classes.tableBody} style={{ background: '#e8efdb' }}>
                      105 Above
                    </TableCell>
                    <TableCell className={classes.tableBody} style={{ background: '#e8efdb' }}>
                      Total
                    </TableCell>

                    <TableCell className={classes.tableBody} style={{ background: '#e1e7f1' }}>
                      State Cap
                    </TableCell>
                    <TableCell className={classes.tableBody} style={{ background: '#e1e7f1' }}>
                      40-79
                    </TableCell>
                    <TableCell className={classes.tableBody} style={{ background: '#e1e7f1' }}>
                      80-99
                    </TableCell>
                    <TableCell className={classes.tableBody} style={{ background: '#e1e7f1' }}>
                      100-105
                    </TableCell>
                    <TableCell className={classes.tableBody} style={{ background: '#e1e7f1' }}>
                      105 Above
                    </TableCell>
                    <TableCell className={classes.tableBody} style={{ background: '#e1e7f1' }}>
                      Total
                    </TableCell>

                    <TableCell className={classes.tableBody} style={{ background: '#e9e8dc' }}>
                      State Cap
                    </TableCell>
                    <TableCell className={classes.tableBody} style={{ background: '#e9e8dc' }}>
                      18-79
                    </TableCell>
                    <TableCell className={classes.tableBody} style={{ background: '#e9e8dc' }}>
                      80-99
                    </TableCell>
                    <TableCell className={classes.tableBody} style={{ background: '#e9e8dc' }}>
                      100-105
                    </TableCell>
                    <TableCell className={classes.tableBody} style={{ background: '#e9e8dc' }}>
                      105 Above
                    </TableCell>
                    <TableCell className={classes.tableBody} style={{ background: '#e9e8dc' }}>
                      Total
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {dataSummary
                    .filter((s) => s.stateName != 'TOTAL')
                    .map((temp) => (
                      <TableRow key={temp.sno}>
                        <TableCell className={classes.tableBody}>{temp.sno}</TableCell>
                        <TableCell className={classes.tableBody}>{temp.stateName}</TableCell>

                        <TableCell className={classes.tableBody} style={{ background: '#e8efdb' }}>
                          {temp.ignoapsStateCap}
                        </TableCell>
                        <TableCell className={classes.tableBody} style={{ background: '#e8efdb' }}>
                          {temp.ignoaps60to79}
                        </TableCell>
                        <TableCell className={classes.tableBody} style={{ background: '#e8efdb' }}>
                          {temp.ignoaps80to99}
                        </TableCell>
                        <TableCell className={classes.tableBody} style={{ background: '#e8efdb' }}>
                          {temp.ignoaps100to105}
                        </TableCell>
                        <TableCell className={classes.tableBody} style={{ background: '#e8efdb' }}>
                          {temp.ignoaps105above}
                        </TableCell>
                        <TableCell className={classes.tableBody} style={{ background: '#e8efdb' }}>
                          {temp.totalIgnoaps}
                        </TableCell>

                        <TableCell className={classes.tableBody} style={{ background: '#e1e7f1' }}>
                          {temp.ignwpsStateCap}
                        </TableCell>
                        <TableCell className={classes.tableBody} style={{ background: '#e1e7f1' }}>
                          {temp.ignwps40to79}
                        </TableCell>
                        <TableCell className={classes.tableBody} style={{ background: '#e1e7f1' }}>
                          {temp.ignwps80to99}
                        </TableCell>
                        <TableCell className={classes.tableBody} style={{ background: '#e1e7f1' }}>
                          {temp.ignwps100to105}
                        </TableCell>
                        <TableCell className={classes.tableBody} style={{ background: '#e1e7f1' }}>
                          {temp.ignwps105above}
                        </TableCell>
                        <TableCell className={classes.tableBody} style={{ background: '#e1e7f1' }}>
                          {temp.totalIgnwps}
                        </TableCell>

                        <TableCell className={classes.tableBody} style={{ background: '#e9e8dc' }}>
                          {temp.igndpsStateCap}
                        </TableCell>
                        <TableCell className={classes.tableBody} style={{ background: '#e9e8dc' }}>
                          {temp.igndps18to79}
                        </TableCell>
                        <TableCell className={classes.tableBody} style={{ background: '#e9e8dc' }}>
                          {temp.igndps80to99}
                        </TableCell>
                        <TableCell className={classes.tableBody} style={{ background: '#e9e8dc' }}>
                          {temp.igndps100to105}
                        </TableCell>
                        <TableCell className={classes.tableBody} style={{ background: '#e9e8dc' }}>
                          {temp.igndps105above}
                        </TableCell>
                        <TableCell className={classes.tableBody} style={{ background: '#e9e8dc' }}>
                          {temp.totalIgndps}
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
                <TableFooter style={{ position: 'sticky', bottom: -1, zIndex: 1000 }}>
                  {dataSummary
                    .filter((s) => s.stateName == 'TOTAL')
                    .map((temp) => (
                      <TableRow key={temp.sno}>
                        <TableCell className={classes.tableFooter}></TableCell>
                        <TableCell className={classes.tableFooter}>{temp.stateName}</TableCell>

                        <TableCell className={classes.tableFooter}>{temp.ignoapsStateCap}</TableCell>
                        <TableCell className={classes.tableFooter}>{temp.ignoaps60to79}</TableCell>
                        <TableCell className={classes.tableFooter}>{temp.ignoaps80to99}</TableCell>
                        <TableCell className={classes.tableFooter}>{temp.ignoaps100to105}</TableCell>
                        <TableCell className={classes.tableFooter}>{temp.ignoaps105above}</TableCell>
                        <TableCell className={classes.tableFooter}>{temp.totalIgnoaps}</TableCell>

                        <TableCell className={classes.tableFooter}>{temp.ignwpsStateCap}</TableCell>
                        <TableCell className={classes.tableFooter}>{temp.ignwps40to79}</TableCell>
                        <TableCell className={classes.tableFooter}>{temp.ignwps80to99}</TableCell>
                        <TableCell className={classes.tableFooter}>{temp.ignwps100to105}</TableCell>
                        <TableCell className={classes.tableFooter}>{temp.ignwps105above}</TableCell>
                        <TableCell className={classes.tableFooter}>{temp.totalIgnwps}</TableCell>

                        <TableCell className={classes.tableFooter}>{temp.igndpsStateCap}</TableCell>
                        <TableCell className={classes.tableFooter}>{temp.igndps18to79}</TableCell>
                        <TableCell className={classes.tableFooter}>{temp.igndps80to99}</TableCell>
                        <TableCell className={classes.tableFooter}>{temp.igndps100to105}</TableCell>
                        <TableCell className={classes.tableFooter}>{temp.igndps105above}</TableCell>
                        <TableCell className={classes.tableFooter}>{temp.totalIgndps}</TableCell>
                      </TableRow>
                    ))}
                </TableFooter>
              </Table>
            </TableContainer>
          </>
        )}
      </MainCard>
    </>
  );
};
export default AgeAbstractAllStateReport;
