import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MainCard from 'ui-component/cards/MainCard';
import config from 'config';
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  Paper,
  CircularProgress,
  Divider,
  Box,
  Button,
  Stack
} from '@mui/material';

const ViewData = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({ femaleCoverage: [], genderPensioners: [] });
  const [level, setLevel] = useState('STATE');
  const [drillStack, setDrillStack] = useState([]);
  const [femaleSchemeList, setFemaleSchemeList] = useState([]);
  const baseUrl = config.API_BASE_URL;
  const navigate = useNavigate();


  const fetchDrilldown = async (
    lvl = 'STATE',
    code = null,
    parentStateCode = null,
    parentDistrictCode = null,
    parentSubDistrictCode = null
  ) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ metric: 'NSAPMM_BEN', level: lvl });

      if (lvl === 'DISTRICT' && code) {
        params.append('stateCode', code);
      }
      if (lvl === 'SUBDISTRICT' && code) {
        if (!parentStateCode) {
          console.error('Cannot fetch SUBDISTRICT without stateCode');
          setLoading(false);
          return;
        }
        params.append('stateCode', parentStateCode);
        params.append('districtCode', code);
      }
      if (lvl === 'GRAMPANCHAYAT' && code) {
        if (!parentStateCode || !parentDistrictCode) {
          console.error('Cannot fetch GRAMPANCHAYAT without stateCode and districtCode');
          setLoading(false);
          return;
        }

        params.append('stateCode', parentStateCode);
        params.append('districtCode', parentDistrictCode);
        params.append('subdistrictCode', code);
      }
      if (lvl === 'VILLAGE' && code) {
        if (!parentStateCode || !parentDistrictCode || !parentSubDistrictCode) {
          console.error('Cannot fetch VILLAGE without stateCode, districtCode, and subdistrictCode');
          setLoading(false);
          return;
        }
        params.append('stateCode', parentStateCode);
        params.append('districtCode', parentDistrictCode);
        params.append('subdistrictCode', parentSubDistrictCode);
        params.append('grampanchayatCode', code);
      }

      const res = await fetch(`${baseUrl}/GenderDashboard/drilldown?${params.toString()}`);
      const result = await res.json();

      setData({
        femaleCoverage: result.femaleCoverage || [],
        genderPensioners: result.pensioners || []
      });

      const femaleSchemes = result.femaleCoverage?.map((item) => item.schemeCode) || [];
      setFemaleSchemeList(femaleSchemes);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDrilldown();
  }, []);

  const drillDown = (row) => {
    let nextLevel = '';
    let code = '';
    let parentStateCode = null;
    let parentDistrictCode = null;
    let parentSubDistrictCode = null;
    let apiLevel = '';

    if (level === 'STATE') {
      nextLevel = 'DISTRICT';
      apiLevel = 'DISTRICT';
      code = row.stateCode;
    } else if (level === 'DISTRICT') {
      nextLevel = 'SUBDISTRICT';
      apiLevel = 'SUBDISTRICT';
      code = row.districtCode;
      parentStateCode = row.stateCode || drillStack[drillStack.length - 1]?.code;
      if (!parentStateCode) {
        console.error('State code is missing for SUBDISTRICT level!');
        return;
      }
    } else if (level === 'SUBDISTRICT') {
      nextLevel = 'GRAMPANCHAYAT/WARD';
      apiLevel = 'GRAMPANCHAYAT';
      code = row.subdistrictCode || row.subDistrictMunicipalCode;
      parentStateCode = row.stateCode;
      parentDistrictCode = row.districtCode;
    } else if (level === 'GRAMPANCHAYAT/WARD') {
      if (row.ruralUrbanArea === 'R') {
        nextLevel = 'VILLAGE';
        apiLevel = 'VILLAGE';
        code = row.gramPanchayatCode;
        parentStateCode = row.stateCode;
        parentDistrictCode = row.districtCode;
        parentSubDistrictCode = row.subDistrictMunicipalCode;
      } else {
        return;
      }
    }

    setDrillStack([
      ...drillStack,
      {
        level,
        name: row[`${level.toLowerCase()}Name`] || row.subDistrictMunicipalName,
        code,
        parentStateCode,
        parentDistrictCode,
        parentSubDistrictCode
      }
    ]);

    setLevel(nextLevel);
    fetchDrilldown(apiLevel, code, parentStateCode, parentDistrictCode, parentSubDistrictCode);
  };

  
  const drillUp = () => {
    if (!drillStack.length) return;

    const newStack = [...drillStack];
    const last = newStack.pop();

    const prevLevel = last.level;
    const prevCode = newStack.length ? newStack[newStack.length - 1].code : null;
    const prevParentStateCode = newStack.length ? newStack[newStack.length - 1].parentStateCode : null;
    const prevParentDistrictCode = newStack.length ? newStack[newStack.length - 1].parentDistrictCode : null;

    setDrillStack(newStack);
    setLevel(prevLevel);

    
    const apiLevel = prevLevel.replace('/WARD', '');
    fetchDrilldown(apiLevel, prevCode, prevParentStateCode, prevParentDistrictCode);
  };

  const safeValue = (val) => val ?? '-';

  const getColSpan = () => {
    return femaleSchemeList.filter((s) => s !== 'Total').reduce((sum, s) => sum + (s.toLowerCase() === 'ignwps' ? 4 : 6), 0) + 2;
  };

  const hasDataToShow = (rows) => {
    if (!rows.length) return false;

    const filteredRows = rows.filter((row) => {
      return !(
        (level === 'STATE' && row.stateName === 'Total') ||
        (level === 'DISTRICT' && row.districtName === 'Total') ||
        (level === 'SUBDISTRICT' && (row.subdistrictName === 'Total' || row.subDistrictMunicipalName === 'Total')) ||
        (level === 'GRAMPANCHAYAT' && row.gramPanchayatName === 'Total') ||
        (level === 'VILLAGE' && row.villageName === 'Total')
      );
    });

    return filteredRows.length > 0;
  };

  const getLevelName = (row) => {
    if (level === 'STATE') return row.stateName;
    if (level === 'DISTRICT') return row.districtName;
    if (level === 'SUBDISTRICT') return row.subdistrictName || row.subDistrictMunicipalName;
    if (level === 'GRAMPANCHAYAT/WARD') return row.gramPanchayatName;
    if (level === 'VILLAGE') return row.villageName;
    return '-';
  };

  return (
    <MainCard title="Gender Based Dashboard">
      {/* Female % Coverage Table */}
      <MainCard>
        <h3 style={{ textAlign: 'center', marginTop: 0, marginBottom: 0 }}>Female % Coverage</h3>
        <Divider sx={{ visibility: 'hidden', my: 1 }} />
        <Box>
          {loading ? (
            <CircularProgress />
          ) : (
            <TableContainer component={Paper} sx={{ p: 0, m: 0 }}>
              <Table className="tbl-social-cat" sx={{ width: '30%', margin: '0 auto', height: '10vh' }}>
                <TableHead>
                  <TableRow style={{ backgroundColor: '#FCF3CF', color: 'black' }}>
                    <TableCell>Scheme</TableCell>
                    <TableCell>Total Beneficiaries</TableCell>
                    <TableCell>Female</TableCell>
                    <TableCell>%Age Coverage</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.femaleCoverage.length && !(data.femaleCoverage.length === 1 && data.femaleCoverage[0].schemeCode === 'Total') ? (
                    data.femaleCoverage.map((row, index) => {
                      const bgColor = row.schemeCode === 'Total' ? 'black' : index % 2 === 0 ? '#D4EFDF' : '#FCF3CF';
                      const textColor = row.schemeCode === 'Total' ? 'white' : 'black';
                      return (
                        <TableRow key={index} style={{ backgroundColor: bgColor }}>
                          <TableCell style={{ color: textColor }}>{row.schemeCode}</TableCell>
                          <TableCell style={{ color: textColor }}>{row.totalPensioners}</TableCell>
                          <TableCell style={{ color: textColor }}>{row.totalGenderFemale}</TableCell>
                          <TableCell style={{ color: textColor }}>{row.femalePercentage}</TableCell>
                        </TableRow>
                      );
                    })
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} align="center">
                        No data found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Box>
      </MainCard>

      {/* Gender-Based Pensioners Table */}
      <MainCard>
        <h3 style={{ textAlign: 'center', marginTop: 0, marginBottom: 0 }}>Gender Based Pensioners - Details</h3>
        <Divider sx={{ visibility: 'hidden', my: 1 }} />
        <Box>
          {loading ? (
            <CircularProgress />
          ) : (
            <TableContainer component={Paper}>
              <Table className="tbl-social-cat">
                <TableHead>
                  <TableRow>
                    <TableCell rowSpan={2}>S.No</TableCell>
                    <TableCell rowSpan={2}>{level} Name</TableCell>
                    {femaleSchemeList
                      .filter((scheme) => scheme !== 'Total')
                      .map((scheme) => {
                        const key = scheme.toLowerCase();
                        const colSpan = level === 'STATE' ? (key === 'ignwps' ? 4 : 6) : key === 'ignwps' ? 2 : 4;
                        return (
                          <TableCell key={scheme} colSpan={colSpan}>
                            <strong>{scheme}</strong>
                          </TableCell>
                        );
                      })}
                  </TableRow>
                  <TableRow>
                    {femaleSchemeList
                      .filter((scheme) => scheme !== 'Total')
                      .map((scheme) => {
                        const key = scheme.toLowerCase();
                        return (
                          <React.Fragment key={scheme}>
                            {level === 'STATE' && <TableCell>State Cap (A)</TableCell>}
                            <TableCell>Total Beneficiaries (B)</TableCell>
                            {level === 'STATE' && <TableCell>Min(A,B)</TableCell>}
                            {key !== 'ignwps' && <TableCell>Male</TableCell>}
                            <TableCell>Female</TableCell>
                            {key !== 'ignwps' && <TableCell>Trans</TableCell>}
                          </React.Fragment>
                        );
                      })}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {hasDataToShow(data.genderPensioners) ? (
                    data.genderPensioners.map((row, idx) => {
                      const isTotal =
                        (level === 'STATE' && row.stateName === 'Total') ||
                        (level === 'DISTRICT' && row.districtName === 'Total') ||
                        (level === 'SUBDISTRICT' && (row.subdistrictName === 'Total' || row.subDistrictMunicipalName === 'Total')) ||
                        (level === 'GRAMPANCHAYAT/WARD' && row.gramPanchayatName === 'Total') ||
                        (level === 'VILLAGE' && row.villageName === 'Total');

                      const bgColor = isTotal ? 'black' : idx % 2 === 0 ? '#D4EFDF' : '#FCF3CF';
                      const textColor = isTotal ? 'white' : 'black';

                      const isClickable = !isTotal && level !== 'VILLAGE' && (level !== 'GRAMPANCHAYAT/WARD' || row.ruralUrbanArea === 'R');

                      return (
                        <TableRow key={idx} style={{ backgroundColor: bgColor }}>
                          <TableCell style={{ color: textColor }}>{idx + 1}</TableCell>
                          <TableCell style={{ color: textColor }}>
                            {isClickable ? (
                              <Button
                                variant="text"
                                onClick={() => drillDown(row)}
                                style={{ textDecoration: 'none', color: '#1976d2', fontWeight: 600 }}
                              >
                                {getLevelName(row)}
                              </Button>
                            ) : (
                              getLevelName(row)
                            )}
                          </TableCell>

                          {femaleSchemeList
                            .filter((scheme) => scheme !== 'Total')
                            .map((scheme) => {
                              const key = scheme.toLowerCase();
                              return (
                                <React.Fragment key={scheme}>
                                  {level === 'STATE' && (
                                    <TableCell style={{ color: textColor }}>{safeValue(row[`${key}StateCap`])}</TableCell>
                                  )}
                                  <TableCell style={{ color: textColor }}>{safeValue(row[`${key}TotalPensioners`])}</TableCell>
                                  {level === 'STATE' && (
                                    <TableCell style={{ color: textColor }}>{safeValue(row[`${key}MinStateCapPen`])}</TableCell>
                                  )}
                                  {key !== 'ignwps' && (
                                    <TableCell style={{ color: textColor }}>{safeValue(row[`${key}TotalGenderM`])}</TableCell>
                                  )}
                                  <TableCell style={{ color: textColor }}>{safeValue(row[`${key}TotalGenderF`])}</TableCell>
                                  {key !== 'ignwps' && (
                                    <TableCell style={{ color: textColor }}>{safeValue(row[`${key}TotalGenderT`])}</TableCell>
                                  )}
                                </React.Fragment>
                              );
                            })}
                        </TableRow>
                      );
                    })
                  ) : (
                    <TableRow>
                      <TableCell colSpan={getColSpan()} align="center">
                        No data found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Box>

        {/* Bottom Buttons */}
        {drillStack.length > 0 && (
          <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
            <Button variant="contained" color="primary" onClick={drillUp} sx={{ mb: 2 }}>
              Back
            </Button>
          </Stack>
        )}

        {level === 'STATE' && (
          <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
            <Button variant="contained" color="primary" onClick={() => navigate(-1)}>
              Back
            </Button>
            <Button variant="outlined" onClick={() => navigate(-1)}>
              Close
            </Button>
          </Stack>
        )}
      </MainCard>
    </MainCard>
  );
};

export default ViewData;
