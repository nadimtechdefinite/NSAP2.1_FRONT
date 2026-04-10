import React, { useState, useEffect } from 'react';
import MainCard from 'ui-component/cards/MainCard';
import Chart from 'react-apexcharts';
import { Typography, Grid, Button, FormControl,CircularProgress } from '@mui/material';
import SchemeList from '../../../form_components/SchemeList';
import axios from 'axios';
import config from 'config';
import { useNavigate } from "react-router-dom";

const GenderBaseReport = ({ cardStyle }) => {
  const [selectedScheme, setSelectedScheme] = useState('ALL'); // '0' = All
  const [data, setData] = useState([]);
const [loading, setLoading] = useState(false); 
  const navigate = useNavigate();

  const handleViewData = () => {
     navigate('/viewData');
  };
   const baseUrl = config.API_BASE_URL;
 
  useEffect(() => {
    const fetchData = async () => {
         setLoading(true); 
      try {
        let getUrl = `${baseUrl}/GenderDashboard/findAllGenderBasedData`;
        if (selectedScheme !== 'ALL') {
          getUrl += `?schemeCode=${selectedScheme}`;
        }

        const response = await axios.get(getUrl);
        setData(response.data);
      } catch (err) {
        console.error('Error fetching data:', err);
      }
      finally {
      setLoading(false); 
    }
    };

    fetchData();
  }, [selectedScheme]);

  const selectedRow =
    data.find(
      (row) => row.stateName === 'xTotal' && (selectedScheme === 'ALL' || selectedScheme === '0' || row.schemeCode === selectedScheme)
    ) || {};
  const getGenderData = (scheme, row) => {
    switch (scheme) {
      case 'IGNOAPS':
        return [row.ignoapsTotalGenderM || 0, row.ignoapsTotalGenderF || 0, row.ignoapsTotalGenderT || 0];
      case 'NFBS':
        return [row.nfbsTotalGenderM || 0, row.nfbsTotalGenderF || 0, row.nfbsTotalGenderT || 0];
      case 'IGNDPS':
        return [row.igndpsTotalGenderM || 0, row.igndpsTotalGenderF || 0, row.igndpsTotalGenderT || 0];
      case 'IGNWPS':
        return [row.ignwpsTotalGenderM || 0, row.ignwpsTotalGenderF || 0, row.ignwpsTotalGenderT || 0];
      case 'ALL':
      case '0':
        return [
          (row.ignoapsTotalGenderM || 0) + (row.nfbsTotalGenderM || 0) + (row.igndpsTotalGenderM || 0) + (row.ignwpsTotalGenderM || 0),
          (row.ignoapsTotalGenderF || 0) + (row.nfbsTotalGenderF || 0) + (row.igndpsTotalGenderF || 0) + (row.ignwpsTotalGenderF || 0),
          (row.ignoapsTotalGenderT || 0) + (row.nfbsTotalGenderT || 0) + (row.igndpsTotalGenderT || 0) + (row.ignwpsTotalGenderT || 0)
        ];
      default:
        return [0, 0, 0];
    }
  };

  const series = getGenderData(selectedScheme, selectedRow);
  const isAllZero = series.every((val) => val === 0);
  const chartOptions = {
    series: isAllZero ? [] : series, 
    options: {
      chart: { width: 380, type: 'pie' },
      labels: ['Male', 'Female', 'Trans'],
        noData: {
      text: "Data Not available.",
      align: "center",
      verticalAlign: "middle",
      style: {
        color: "hsla(130, 91%, 77%, 1.00)",
        fontSize: "16px"
      }
    },
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: { width: 200 },
            legend: { position: 'bottom' }
          }
        }
      ]
    }
  };

  const handleSelectScheme = (schemeCode) => {
    setSelectedScheme(schemeCode);
  };

  return (
    <MainCard style={cardStyle}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Grid container alignItems="center" justifyContent="space-between">
            <Grid item>
              <Typography variant="h4">GENDER BASED</Typography>
            </Grid>
            <Grid item xs={4}>
               <FormControl fullWidth>
                <SchemeList onSelectScheme={handleSelectScheme} defaultSelectedSchemeCode={selectedScheme} />
              </FormControl>
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={12}>
          {loading ? (
            <CircularProgress /> // show spinner while loading
          ) : (
          <Chart
            key={selectedScheme} // helps re-render on scheme change
            options={chartOptions.options}
            series={chartOptions.series}
            type="pie"
            width={380}
          />
            )}
        </Grid>

        <Grid item xs={12}>
        
      <Button
        variant="contained"
        color="primary"
        onClick={handleViewData}
        disabled={loading}
        style={{ float: 'right' }}
      >
        {loading ? "Loading..." : "View Data"}
      </Button>
        </Grid>
      </Grid>
    </MainCard>
  );
};

export default GenderBaseReport;
