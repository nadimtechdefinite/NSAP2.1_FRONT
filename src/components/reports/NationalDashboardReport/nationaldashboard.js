import React, { useState, useEffect, useMemo } from 'react';
import {
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Paper
} from '@mui/material';
import Button from '@mui/material/Button';
import CloseIcon from '@mui/icons-material/Close';
import axiosInstance from 'hooks/useAuthTokenUrl';

import MainCard from 'ui-component/cards/MainCard';
import Chart from 'react-apexcharts';

export default function NationalDashboard() {
  const [nationalDashdata, setnationDashData] = useState(null);
  const [errorMessageDashBoard, setError] = useState(null);

  // ---------------- Drilldown state ----------------
  const [drillOpen, setDrillOpen] = useState(false);
  const [drillMetric, setDrillMetric] = useState(null); // 'NSAP_BEN' | 'STATE_BEN'
  const [drillRows, setDrillRows] = useState([]);
  const [drillLoading, setDrillLoading] = useState(false);
  const [drillError, setDrillError] = useState(null);

  // breadcrumb (where we are): [{ level, label, stateCode?, districtCode?, subdistrictCode? }]
  const [drillStack, setDrillStack] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get(`/nationalDashboard/getNationalDashBoardData`);
        setnationDashData(response.data);
        setError(null);
      } catch (error) {
        setError(error.message);
        console.log(errorMessageDashBoard);
      }
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ----- SCHEMA (source of truth for the drilldown table) -----
  const SCHEMA = useMemo(
    () => ({
      left: [{ field: 'schemeName', headerName: 'Scheme' }],
      digitized: [{ field: 'dataDigitized', headerName: 'Data Digitized' }],
      profile: [
        { field: 'bankAc', headerName: 'Bank A/c' },
        { field: 'poAc', headerName: 'PO A/c' },
        { field: 'moAc', headerName: 'MO' },
        { field: 'cashAc', headerName: 'Cash' },
        { field: 'aadhaar', headerName: 'Aadhaar' }
      ],
      disbursement: {
        title: 'Total Disbursement Transaction (Current FY)',
        fields: [
          { field: 'abp', headerName: 'ABP' },
          { field: 'neft', headerName: 'NEFT' },
          { field: 'poTxn', headerName: 'PO' },
          { field: 'moTxn', headerName: 'MO' },
          { field: 'cashTxn', headerName: 'Cash' }
        ]
      }
    }),
    []
  );

  const baseFields = useMemo(() => [SCHEMA.left[0], ...SCHEMA.digitized, ...SCHEMA.profile], [SCHEMA]);
  const disbFields = useMemo(() => SCHEMA.disbursement.fields, [SCHEMA]);
  const disbTitle = SCHEMA.disbursement.title;

  const COLS_COUNT = baseFields.length + disbFields.length;

  const Num = ({ value }) => <span style={{ float: 'right' }}>{Number(value || 0).toLocaleString('en-IN')}</span>;

  // generic fetcher (finYear stays backend-only)
  const fetchDrill = async ({ metric, level, stateCode, districtCode, subdistrictCode }) => {
    setDrillLoading(true);
    setDrillError(null);
    try {
      const { data } = await axiosInstance.get(`/nationalDashboard/drilldown`, {
        params: { metric, level, stateCode, districtCode, subdistrictCode }
      });
      // IMPORTANT: use backend rows directly; don't aggregate/sum on UI
      setDrillRows(Array.isArray(data) ? data : []);
    } catch (e) {
      setDrillRows([]);
      setDrillError(e?.message || 'Failed to load details');
    } finally {
      setDrillLoading(false);
    }
  };

  // open dialog at STATE level
  const openDrill = async (metric) => {
    setDrillMetric(metric);
    setDrillOpen(true);
    setDrillStack([{ level: 'STATE', label: 'States' }]);
    await fetchDrill({ metric, level: 'STATE' });
  };

  if (!nationalDashdata) return <div>Loading...</div>;

  // existing chart data (unchanged)
  const pData = [
    nationalDashdata.total_Ben,
    nationalDashdata.stateScheme,
    nationalDashdata.total_aadhar,
    nationalDashdata.nsap_bank_account,
    nationalDashdata.total_poAc,
    nationalDashdata.total_moAc,
    nationalDashdata.total_cashAc
  ];

  const xLabels = [
    'NSAP Beneficiaries',
    'State Pension Schemes Beneficiaries',
    'NSAP Aadhaar',
    'With Bank A/C (NSAP)',
    'With PO A/C (NSAP)',
    'Through MO',
    'Through Cash'
  ];

  const colors = ['#1e88e5', '#008000', '#BE8400', '#EE82EE', '#1e88e5', '#800080', '#008000'];
  const options = {
    chart: { height: 350, type: 'bar' },
    xaxis: { categories: xLabels, labels: { style: { fontSize: '12px' } } },
    yaxis: { title: { text: 'Beneficiary Count', style: { fontSize: '14px' } } },
    colors,
    plotOptions: { bar: { distributed: true } },
    legend: { show: false },
    dataLabels: { enabled: false }
  };

  const drillTitle = drillMetric === 'STATE_BEN' ? 'State Pension Schemes Beneficiaries' : 'NSAP Beneficiaries';

  return (
    <>
      <MainCard title="National Dashboard(NSAP) w.r.t. Data Digitized">
        <Grid container spacing={4}>
          <Grid item xs={12}>
            <TableContainer>
              <Table>
                <TableHead></TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell style={{ fontSize: 16, borderBottom: 'none', padding: '8px 16px' }}>NSAP Beneficiaries</TableCell>
                    <TableCell style={{ fontSize: 16, borderBottom: 'none', padding: '8px 16px' }}>
                      State Pension Schemes Beneficiaries
                    </TableCell>
                    <TableCell style={{ fontSize: 16, borderBottom: 'none', padding: '8px 16px' }}>NSAP Aadhaar</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell style={{ verticalAlign: 'top', padding: '8px 16px' }}>
                      <Button variant="contained" style={{ fontSize: 20 }} onClick={() => openDrill('NSAP_BEN')}>
                        {nationalDashdata.total_Ben}
                      </Button>
                    </TableCell>
                    <TableCell style={{ verticalAlign: 'top', padding: '8px 16px' }}>
                      <Button variant="contained" style={{ fontSize: 20, backgroundColor: 'Green' }} onClick={() => openDrill('STATE_BEN')}>
                        {nationalDashdata.stateScheme}
                      </Button>
                    </TableCell>
                    <TableCell style={{ verticalAlign: 'top', padding: '8px 16px' }}>
                      <Button variant="contained" style={{ fontSize: 20, backgroundColor: '#BE8400' }}>
                        {nationalDashdata.total_aadhar}
                      </Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell style={{ fontSize: 16, borderBottom: 'none', padding: '8px 16px' }}>With Bank A/C (NSAP)</TableCell>
                    <TableCell style={{ fontSize: 16, borderBottom: 'none', padding: '8px 16px' }}>With PO A/C (NSAP)</TableCell>
                    <TableCell style={{ fontSize: 16, borderBottom: 'none', padding: '8px 16px' }}>Through MO</TableCell>
                    <TableCell style={{ fontSize: 16, borderBottom: 'none', padding: '8px 16px' }}>Through Cash</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell style={{ borderBottom: 'none', verticalAlign: 'top', padding: '8px 16px' }}>
                      <Button variant="contained" style={{ fontSize: 20, backgroundColor: 'violet' }}>
                        {nationalDashdata.nsap_bank_account}
                      </Button>
                    </TableCell>
                    <TableCell style={{ borderBottom: 'none', verticalAlign: 'top', padding: '8px 16px' }}>
                      <Button variant="contained" style={{ fontSize: 20 }}>
                        {nationalDashdata.total_poAc}
                      </Button>
                    </TableCell>
                    <TableCell style={{ borderBottom: 'none', verticalAlign: 'top', padding: '8px 16px' }}>
                      <Button variant="contained" style={{ fontSize: 20, backgroundColor: 'purple' }}>
                        {nationalDashdata.total_moAc}
                      </Button>
                    </TableCell>
                    <TableCell style={{ borderBottom: 'none', verticalAlign: 'top', padding: '8px 16px' }}>
                      <Button variant="contained" style={{ fontSize: 20, backgroundColor: 'Green' }}>
                        {nationalDashdata.total_cashAc}
                      </Button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
      </MainCard>

      <br />

      <MainCard>
        <Grid container spacing={4}>
          <Grid item xs={12}>
            <Chart options={options} series={[{ data: pData, colors }]} type="bar" height={'auto'} />
          </Grid>
        </Grid>
      </MainCard>

      {/* ---------------- Drilldown Dialog (MUI Table, dynamic headers) ---------------- */}
      <Dialog open={drillOpen} onClose={() => setDrillOpen(false)} fullWidth maxWidth="xl">
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            {/* show drillTitle + breadcrumb */}
            <strong>{drillTitle}</strong>{' '}
            {drillStack.map((n, idx) => (
              <React.Fragment key={idx}>
                {idx > 0 && ' / '}
                <Button
                  size="small"
                  variant="text"
                  onClick={async () => {
                    const target = drillStack[idx];
                    setDrillStack(drillStack.slice(0, idx + 1));
                    await fetchDrill({
                      metric: drillMetric,
                      level: target.level,
                      stateCode: target.stateCode,
                      districtCode: target.districtCode,
                      subdistrictCode: target.subdistrictCode
                    });
                  }}
                  sx={{ textTransform: 'none', p: 0, minWidth: 0 }}
                >
                  {n.label || n.level}
                </Button>
              </React.Fragment>
            ))}
          </div>

          <IconButton onClick={() => setDrillOpen(false)} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent>
          <TableContainer component={Paper} sx={{ maxHeight: 600 }}>
            <Table
              stickyHeader
              size="small"
              sx={{
                border: '1px solid #ddd',
                borderCollapse: 'collapse',
                '& td, & th': { border: '1px solid #ddd' }
              }}
            >
              <TableHead>
                {/* Row 1: base columns (rowSpan=2) + grouped disbursement band */}
                <TableRow>
                  {baseFields.map((c) => (
                    <TableCell key={`band-${c.field}`} sx={{ background: '#f7f9fc' }} rowSpan={2}>
                      {c.headerName}
                    </TableCell>
                  ))}
                  <TableCell sx={{ background: '#f7f9fc', textAlign: 'center' }} colSpan={disbFields.length}>
                    {disbTitle}
                  </TableCell>
                </TableRow>

                {/* Row 2: only the disbursement leaf headers */}
                <TableRow>
                  {disbFields.map((c) => (
                    <TableCell key={`leaf-${c.field}`}>{c.headerName}</TableCell>
                  ))}
                </TableRow>
              </TableHead>

              <TableBody>
                {drillLoading ? (
                  <TableRow>
                    <TableCell colSpan={COLS_COUNT} align="center">
                      Loading…
                    </TableCell>
                  </TableRow>
                ) : drillError ? (
                  <TableRow>
                    <TableCell colSpan={COLS_COUNT} align="center" sx={{ color: 'crimson' }}>
                      {drillError}
                    </TableCell>
                  </TableRow>
                ) : drillRows.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={COLS_COUNT} align="center">
                      No rows
                    </TableCell>
                  </TableRow>
                ) : (
                  drillRows.map((row, i) => {
                    if (row.rowType === 'group') {
                      // determine current level from breadcrumb top
                      const currentLevel = drillStack[drillStack.length - 1]?.level || 'STATE';

                      const handleGroupClick = async () => {
                        if (!row.stateCode) return;

                        if (currentLevel === 'STATE') {
                          // STATE → DISTRICT
                          const next = { level: 'DISTRICT', label: row.stateName, stateCode: row.stateCode };
                          setDrillStack((s) => [...s, next]);
                          await fetchDrill({ metric: drillMetric, level: 'DISTRICT', stateCode: row.stateCode });
                        } else if (currentLevel === 'DISTRICT') {
                          // DISTRICT → SUBDISTRICT (backend must support this path)
                          const next = { level: 'SUBDISTRICT', label: row.stateName, districtCode: row.stateCode };
                          setDrillStack((s) => [...s, next]);
                          await fetchDrill({ metric: drillMetric, level: 'SUBDISTRICT', districtCode: row.stateCode });
                        }
                      };
                      return (
                        <TableRow key={`g-${row.stateCode || row.stateName || i}`}>
                          <TableCell colSpan={COLS_COUNT} sx={{ background: '#0aa4a5', color: '#fff', fontWeight: 700 }}>
                            <Button
                              variant="text"
                              onClick={handleGroupClick}
                              sx={{
                                color: '#fff',
                                fontWeight: 700,
                                textTransform: 'none',
                                p: 0,
                                '&:hover': { background: 'transparent', textDecoration: 'underline' }
                              }}
                            >
                              {String(row.stateName || '').toUpperCase()}
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    }

                    if (row.rowType === 'total') {
                      return (
                        <TableRow key={`t-${row.stateCode || i}`} sx={{ background: '#f5f7fa', fontWeight: 700 }}>
                          <TableCell> Total : </TableCell>
                          {baseFields.slice(1).map((c) => (
                            <TableCell key={`t-${c.field}-${i}`}>
                              <Num value={row[c.field]} />
                            </TableCell>
                          ))}
                          {disbFields.map((c) => (
                            <TableCell key={`t-${c.field}-${i}`}>
                              <Num value={row[c.field]} />
                            </TableCell>
                          ))}
                        </TableRow>
                      );
                    }

                    // data rows
                    return (
                      <TableRow key={`d-${row.stateCode || ''}-${row.schemeCode || row.schemeName || i}`}>
                        <TableCell>{row.schemeName}</TableCell>
                        {baseFields.slice(1).map((c) => (
                          <TableCell key={`d-${c.field}-${i}`}>
                            <Num value={row[c.field]} />
                          </TableCell>
                        ))}
                        {disbFields.map((c) => (
                          <TableCell key={`ds-${c.field}-${i}`}>
                            <Num value={row[c.field]} />
                          </TableCell>
                        ))}
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
      </Dialog>
    </>
  );
}
