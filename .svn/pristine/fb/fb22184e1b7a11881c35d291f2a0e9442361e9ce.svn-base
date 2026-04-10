import React from 'react';
import { Outlet } from 'react-router-dom';

// material-ui
import { styled, useTheme } from '@mui/material/styles';
import { AppBar, Box, CssBaseline, Toolbar } from '@mui/material';

// project imports
import Header from './Header';
import Footer from './Footer';
import './scroll.css';
// styles
const Main = styled('main')(({ theme }) => ({
  ...theme.typography.mainContent,
  borderBottomLeftRadius: 0,
  borderBottomRightRadius: 0,

  [theme.breakpoints.up('md')]: {
    marginLeft: theme.spacing(0),
    marginRight: theme.spacing(0)
    // padding: theme.spacing(3)
  },
  [theme.breakpoints.down('md')]: {
    marginLeft: theme.spacing(0),
    marginRight: theme.spacing(0)
    //padding: theme.spacing(2)
  },
  [theme.breakpoints.down('sm')]: {
    marginLeft: theme.spacing(0),
    marginRight: theme.spacing(0)
    //padding: theme.spacing(1)
  }
}));

// ==============================|| MAIN LAYOUT ||============================== //

const HomeLayout = () => {
  const theme = useTheme();

  return (
    <Box>
      <CssBaseline />
      {/* header */}
      <AppBar enableColorOnDark position="fixed" color="inherit" elevation={0}>
        <Toolbar>
          <Header />
        </Toolbar>
      </AppBar>
      {/* main content */}
      <Main theme={theme}>
        <Outlet />
      </Main>
      <Footer />
    </Box>
  );
};

export default HomeLayout;
