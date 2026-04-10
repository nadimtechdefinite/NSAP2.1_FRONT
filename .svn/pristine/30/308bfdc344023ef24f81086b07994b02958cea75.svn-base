import { useEffect, useState } from 'react';
import { Grid, CircularProgress } from '@mui/material';
import { gridSpacing } from 'store/constant';
import DashboardDetails from './DashboardDetails';
import axiosInstance from 'hooks/useAuthTokenUrl';
import PropTypes from 'prop-types';
// ==============================|| DEFAULT DASHBOARD ||============================== //

const Dashboard = ({ selectedScheme }) => {
  const [dashboardData, setDashboardData] = useState([]);
  const [loading, setLoading] = useState(false);
  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/dashboard');
      if (response.status >= 200 && response.status < 300) {
        setDashboardData(response.data);
      } else {
        throw new Error('Dashboard Data : Data could not be fetched : ', response.status);
      }

      setTimeout(() => {
        setLoading(false);
      }, 1000);
    } catch (e) {
      console.error('Error fetching dashboard data:', e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedScheme) {
      fetchData();
    }
  }, [selectedScheme]);
  const dynamicData = [
    { title: 'Total Beneficiaries', value: dashboardData?.totalBeneficiarics?.toString() || '0', link: 'false', key: '' },
    { title: 'Active Beneficiaries', value: dashboardData?.activeBeneficiarics?.toString() || '0', link: 'false', key: '' },
    { title: 'New Beneficiaries', value: dashboardData?.newBeneficiarics?.toString() || '0', link: 'false', key: '' },

    { title: 'PFMS Registered with Account', value: dashboardData?.pfmsRegisteredWithAccount?.toString() || '0', link: 'false', key: '' },
    { title: 'PFMS Registered with APB', value: dashboardData?.pfmsRegisteredWithApb?.toString() || '0', link: 'false', key: '' },
    { title: 'PFMS Registered with Both Mode', value: dashboardData?.pfmsRegisteredWithBoth?.toString() || '0', link: 'false', key: '' },

    { title: 'Total Beneficiaries with Bank Account', value: dashboardData?.withBankAc?.toString() || '0', link: 'false', key: '' },
    { title: 'Total Beneficiaries with Post Office Account', value: dashboardData?.WithPoAc?.toString() || '0', link: 'false', key: '' },
    {
      title: 'Total Beneficiaries Bank/PO with Aadhaar',
      value: dashboardData?.bankPoWithAadhar?.toString() || '0',
      link: 'false',
      key: ''
    },

    { title: 'Total Beneficiaries with Aadhaar', value: dashboardData?.totalAadhar?.toString() || '0', link: 'false', key: '' },
    { title: 'Pending for Sanction', value: dashboardData?.pendingForSantionedBeneficiarics?.toString() || '0', link: 'false', key: '' },
    { title: 'Discontinued', value: dashboardData?.discontinuedBeneficiarics?.toString() || '0', link: 'false', key: '' },

    {
      title: 'Active Beneficiaries Not Registered with PFMS',
      value: dashboardData?.pfmsNotRegistered?.toString() || '0',
      link: 'true',
      key: 'pfmsNotRegistered'
    },
    {
      title: 'Total Beneficiaries Not Having Account',
      value: dashboardData?.totalBeneficiaricsNotHavingAccount?.toString() || '0',
      link: 'true',
      key: 'not_having_account'
    },
    {
      title: 'Total Beneficiaries Not Having Aadhaar',
      value: dashboardData?.totalBeneficiaricsNotHavingAadhar?.toString() || '0',
      link: 'true',
      key: 'not_having_uid_no'
    },

    {
      title: 'Under Transfer',
      value: dashboardData?.totalBeneficiaricsUnderTransfer?.toString() || '0',
      link: 'true',
      key: 'UnderTransfer'
    }
  ];
  return (
    <>
      {dashboardData?.isActive && (
        <Grid container spacing={gridSpacing}>
          <Grid item xs={12}>
            <Grid container spacing={gridSpacing}>
              <Grid item xs={12} md={12}>
                {loading ? (
                  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
                    <CircularProgress />
                  </div>
                ) : (
                  <DashboardDetails data={dynamicData} />
                )}
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      )}
    </>
  );
};
Dashboard.propTypes = {
  selectedScheme: PropTypes.string // Update the type as needed
};
export default Dashboard;
