import React, { useState/* , useEffect */ } from 'react';
import SubSchemeWiseReportYearList from 'components/reports/SubSchemeWiseReport/SubSchemeWiseReportYearList';
import MainCard from 'ui-component/cards/MainCard';
import StateList from 'components/form_components/StateList';
import DistrictList from 'components/form_components/DistrictList';
import SchemeMasterListByStateCode from 'components/form_components/AllCenterSchemeListByState';
import MonthList from 'components/form_components/MonthList';
import { Alert, Snackbar, CircularProgress } from '@mui/material';
import { Grid, FormControl, Button, FormHelperText, Typography } from '@mui/material';
import messages_en from 'components/common/messages_en.json';
import axiosInstance from 'hooks/useAuthTokenUrl';
import { useNavigate } from "react-router-dom";


const MonthlyFundDisbursementEntryReport = () => {
    const [formErrors, setFormErrors] = useState({});
    const [snackbar, setSnackbar] = useState(null);
    const [loading, setLoading] = useState(false);
    const [remarks, setRemarks] = useState('');
    const [getEntryData, setEntryData] = useState({});
    const [data, setData] = useState([]);
    const navigate = useNavigate();

    const cancelValue = () => {
      
        navigate('/');
     
    };
    const [formData, setFormData] = useState({
      stateCode: '',
      districtCode: '',
      schemeCode: '',
      monthCode: '',
      yearCode: ''
    });

    const monthNames = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
  ];

    const handleCloseSnackbar = () => setSnackbar(null);
    const handleStateChange = (stateId) => {
        setFormData({ ...formData, stateCode: stateId });
        setFormErrors((prevErrors) => {
          const updatedErrors = { ...prevErrors };
          delete updatedErrors.stateCode;
          return updatedErrors;
        });
      };
      const handleDistrictChange = (districtId) => {
        setFormData({ ...formData, districtCode: districtId });
         setFormErrors((prevErrors) => {
          const updatedErrors = { ...prevErrors };
          delete updatedErrors.districtCode;
          return updatedErrors;
        }); 
      };
      const handleSchemeChange = (schemeCodeId) => {
        setFormData({ ...formData, schemeCode: schemeCodeId });
        setFormErrors((prevErrors) => {
          const updatedErrors = { ...prevErrors };
          delete updatedErrors.schemeCode;
          return updatedErrors;
        });
      };
      const handleMonthChange = (monthCode) => {
        setFormData({ ...formData, monthCode: monthCode });
        setFormErrors((prevErrors) => {
          const updatedErrors = { ...prevErrors };
          delete updatedErrors.monthCode;
          return updatedErrors;
        });
      };
      const handleYearChange = (year) => {
        setFormData({ ...formData, yearCode: year });
        setFormErrors((prevErrors) => {
          const updatedErrors = { ...prevErrors };
          delete updatedErrors.yearCode;
          return updatedErrors;
        });
      };  
      // const cancelButton = () => {
      //   setFormData((prevFormData) => ({
      //     ...prevFormData,
      //     districtCode: '',
      //     schemeCode: '',
      //     monthCode: '',
      //     yearCode: ''
      //   }));
      //   setData([]);

      // };
      const validateForm = () => {
        const errors = {};
        // Add validation logic for each field
        if (!formData.stateCode) {
          errors.stateCode = messages_en.stateRequired;
        }
        if (!formData.districtCode) {
            errors.districtCode = messages_en.districtRequired;
          }
    
        if (!formData.schemeCode) {
          errors.schemeCode = messages_en.schemCodeRequired;
        }
    
        if (!formData.monthCode) {
          errors.monthCode = messages_en.monthFeildRequired;
        }
    
        if (!formData.yearCode) {
          errors.yearCode = messages_en.yearFeildRequired;
        }
        setFormErrors(errors);
        return Object.keys(errors).length === 0; // Return true if no errors
      };  
      const handleSubmit = async (e) => {
        e.preventDefault();
        const isFormValid = validateForm();
        if (isFormValid) {
          setLoading(true);
          try {
            const sendData = {
             
              stateId:formData.stateCode,
              distId:formData.districtCode,
              scheme:formData.schemeCode,
              month:formData.monthCode,
              year:formData.yearCode
              // Add any additional data you want to send
    
            };
            const postUrl = '/DbtPortalEntry/getEntryData';
            const response = await axiosInstance.post(postUrl, JSON.stringify(sendData));
            const data = response.data;
            setEntryData(data);
            setData(data.tableData);
            setRemarks(data.remarks);
            console.log('Response : ', response.data);
            
          } catch (error) {
            if (error.response.data && error.response.data.message) {
              setSnackbar({ children: 'No records are found.', severity: 'error' });
            } else {
              console.log('Error  : ', error);
            }
          } finally {
            setLoading(false);
          }
        } else {
          console.log('Form not valid!');
          // Handle form not valid case, maybe show an error message
        }
      };

      // const [data, setData] = useState([
      //   { disbursementThrough : 'Disbursement Through ', totalBeneficiaries: 'Total Beneficiaries', totalAmount: 'Total Amount (Rs. in lakhs)' },
      //   { disbursementThrough: 'Aadhaar Payment Bridge(APB)', totalBeneficiaries: 0, totalAmount: 0 },
      //   { disbursementThrough: 'Non Aadhaar Payment Using ECS/NEFT', totalBeneficiaries: 0, totalAmount: 0 },
      //   { disbursementThrough: 'Non Aadhaar/ Non NEFT(through Banks)', totalBeneficiaries: 0, totalAmount: 0 },
      //   { disbursementThrough: 'Postal Account', totalBeneficiaries: 0, totalAmount: 0 },
      //   { disbursementThrough: 'Money Order', totalBeneficiaries: 0, totalAmount: 0 },
      //   { disbursementThrough: 'Cash', totalBeneficiaries: 0, totalAmount: 0 },
      //   { disbursementThrough: 'Grand Total', totalBeneficiaries: getEntryData.grandTotalBeneficiry, totalAmount: getEntryData.grandTotalAmount },
      
      // ]);
      
      const handleChange = (e, index, key) => {
        let value = e.target.value;
        if (key === 'totalAmount') {
          value = value.replace(/[^\d.]/g, ''); // Allow only numbers and a single dot
          // Prevent multiple dots
          if (value.indexOf('.') !== value.lastIndexOf('.')) {
            value = value.substring(0, value.lastIndexOf('.'));
          }
        } else {
          value = value.replace(/[^\d]/g, ''); // Allow only numbers
        }
        value = value === '' ? '0' : value; // Set to 0 if empty
        const newData = [...data];
        newData[index][key] = value;
        setData(newData);
      };
      const handleRemarksChange = (e) => {
        setRemarks(e.target.value);
      };
      const calculateTotal = (key) => {
        let sum = 0;
        for (let i = 1; i < data.length - 1; i++) {
          sum += parseFloat(data[i][key] || 0);
        }
        return sum;
      };
     
      const handleSubmitTableData = async () => {
        const grandTotalNum1 = calculateTotal('totalBeneficiaries');
    const grandTotalNum2 = calculateTotal('totalAmount');
        // Prepare data to send
        const sendData = {
          tableData: data.slice(1, -1), // Remove first and last rows
          remarks: remarks,
          grandTotalBeneficiry: grandTotalNum1,
          grandTotalAmount: grandTotalNum2,
          stateId:formData.stateCode,
          distId:formData.districtCode,
          scheme:formData.schemeCode,
          month:formData.monthCode,
          year:formData.yearCode
          // Add any additional data you want to send

        };
        try {     
            // var location={ stateID:selectedStateId, districtID:selectDis, area:selectedAreaId, subDistID:selecteSubDis, schemeFromCode:selectFromScheme,schemeToCode:selectToScheme,finyr:selectedFinYear};
            
          const getUrl=`/DbtPortalEntry/MonthlyDisbursementEntry`;
          setLoading(true);
          const response = await axiosInstance.post(getUrl,JSON.stringify(sendData));
          if (response.status >= 200 && response.status < 300) {
            
            setSnackbar({ children: "Data Insert Successfully", severity: 'success' });
            setData([]);
            return response.data
          } else {
          
            return false;
          }
      } catch (error) {
        // if(error.response.data.id){
        //   setSnackbar({ children: error.response.data.id, severity: 'error' });
        // }
        // else{
        //   setSnackbar({ children: "No Data Found", severity: 'error' });
        // }
          console.error('Error fetching data:', error);
      }
      finally {
        setLoading(false);
      }
        
        };
    
    return(
        <div>
          {!!snackbar && (
        <Snackbar open anchorOrigin={{ vertical: 'top', horizontal: 'center' }} onClose={handleCloseSnackbar} autoHideDuration={8000}>
          <Alert {...snackbar} onClose={handleCloseSnackbar} />
        </Snackbar>
      )}
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
  
        <MainCard title="DBT Portal Entry">
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <StateList onSelectState={handleStateChange} isMendatory={true} />
                {formErrors.stateCode && (
                  <FormHelperText>
                    <Typography style={{ color: 'red', fontSize: '0.8rem' }}>{formErrors.stateCode}</Typography>
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <DistrictList
                  onSelectDistrict={handleDistrictChange}
                  selectedStateId={formData.stateCode}
                  isMendatory={true}
                  defaultSelectedDistrict={formData.districtCode}
                />
                {formErrors.districtCode && (
                  <FormHelperText>
                    <Typography style={{ color: 'red', fontSize: '0.8rem' }}>{formErrors.districtCode}</Typography>
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>
  
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <SchemeMasterListByStateCode
                  selectedStateCode={formData.stateCode}
                  onSelectScheme={handleSchemeChange}
                  isMendatory={true}
                  defaultSelectedScheme={formData.schemeCode}
                />
                {formErrors.schemeCode && (
                  <FormHelperText>
                    <Typography style={{ color: 'red', fontSize: '0.8rem' }}>{formErrors.schemeCode}</Typography>
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>
  
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <MonthList onSelectMonth={handleMonthChange} isMendatory={true} defaultSelectedMonth={formData.monthCode} />
                {formErrors.monthCode && (
                  <FormHelperText>
                    <Typography style={{ color: 'red', fontSize: '0.8rem' }}>{formErrors.monthCode}</Typography>
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <SubSchemeWiseReportYearList
                  selectedStateCode={formData.stateCode}
                  onSelectYear={handleYearChange}
                  isMendatory={true}
                  defaultValueYear={formData.yearCode}
                />
                {formErrors.yearCode && (
                  <FormHelperText>
                    <Typography style={{ color: 'red', fontSize: '0.8rem' }}>{formErrors.yearCode}</Typography>
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12} alignItems="center">
              <Button type="submit" variant="contained" color="secondary" onClick={handleSubmit}>
                SUBMIT
              </Button>
              &nbsp; &nbsp; &nbsp;
              <Button variant="contained" color="primary" onClick={() => {cancelValue()}} title='Cancel'>Cancel</Button>
            </Grid>
          </Grid>
        </MainCard>
        {data.length > 0 && (
        <MainCard title={`DBT Portal Entry Details for   ${monthNames[parseInt(getEntryData.month)-1]}   ${getEntryData.year}`}>
        <table>
        <thead>
          <tr>
            <th>{data[0].disbursementThrough}</th>
            <th>{data[0].totalBeneficiaries}</th>
            <th>{data[0].totalAmount}</th>
          </tr>
        </thead>
        <tbody>
          {data.slice(1, -1).map((row, index) => (
            <tr key={index}>
              <td>{row.disbursementThrough}</td>
              <td><input type="text" value={row.totalBeneficiaries} onChange={(e) => handleChange(e, index + 1, 'totalBeneficiaries')} /></td>
              <td><input type="text" value={row.totalAmount} onChange={(e) => handleChange(e, index + 1, 'totalAmount')} /></td>
            </tr>
          ))}
          
        </tbody>
        <tfoot>
          <tr>
            <td><b>{data[data.length - 1].text}</b></td>
            <td>{calculateTotal('totalBeneficiaries')}</td>
            <td>{calculateTotal('totalAmount')}</td>
          </tr>
          <tr>
  <td>
    <label htmlFor="remarks">Remarks:</label>
  </td>
  <td colSpan="2">
    <textarea
      id="remarks"
      value={remarks}
      onChange={handleRemarksChange}
      style={{ width: '100%', height: '80px' }} // Adjust width and height as needed
    />
  </td>
</tr>
        </tfoot>
      </table>
      
      <Button type="submit" variant="contained" color="primary" onClick={handleSubmitTableData}>
                SUBMIT
              </Button>
              </MainCard>)}
        </div>

    )
}
export default MonthlyFundDisbursementEntryReport;
