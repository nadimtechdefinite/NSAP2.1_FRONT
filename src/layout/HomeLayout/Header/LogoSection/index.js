import { Link } from 'react-router-dom';
import { ButtonBase, Grid } from '@mui/material'; // Import Grid from Material-UI

// project imports
import HomePageLogo from 'ui-component/HomePageLogo';

const LogoSection = () => {
  return (
    <Grid container alignItems="center" justifyContent="center" spacing={2}>
      {' '}
      {/* Use Grid container for responsive layout */}
      <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
        {' '}
        {/* Use xs={12} for full width on small screens */}
        <ButtonBase disableRipple component={Link} to={'/home'} style={{ display: 'flex', justifyContent: 'center' }}>
          <HomePageLogo />
        </ButtonBase>
      </Grid>
    </Grid>
  );
};

export default LogoSection;
