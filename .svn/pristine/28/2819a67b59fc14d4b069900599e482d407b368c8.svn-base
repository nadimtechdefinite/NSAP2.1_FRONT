import React, { useState } from 'react';
import { useTheme } from '@mui/material/styles';
import { Box, Button, Drawer, IconButton, List, ListItem, ListItemText } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { NavLink } from 'react-router-dom';
import LogoSection from './LogoSection';

// Define an array of links
const links = [
  { label: 'Home', path: '/home' },
  { label: 'About Us', path: '/about' },
  { label: 'Guidelines', path: '/guidelines' },
  { label: 'Reports', path: '/reports' },
  { label: 'FAQ', path: '/faq' },
  { label: 'Circulars', path: '/circulars' },
  { label: 'Contact Us', path: '/contact' },
  { label: 'Gallery', path: '/gallery' },
  { label: 'Grievance Redressal', path: 'https://pgportal.gov.in/' },
  { label: 'Sitemap', path: '/sitemap' }
];

const Header = () => {
  const theme = useTheme();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setDrawerOpen(open);
  };

  const buttonStyles = {
    marginRight: theme.spacing(1),
    color: theme.palette.text.primary,
    fontWeight: 'bold',
    textTransform: 'none',
    '&.active': {
      borderBottom: `2px solid ${theme.palette.primary.main}`
    }
  };

  const buttonStylesLogin = {
    marginRight: theme.spacing(1),
    color: theme.palette.common.white,
    backgroundColor: theme.palette.primary.main,
    fontWeight: 'bold',
    textTransform: 'none',
    '&:hover': {
      backgroundColor: theme.palette.primary.dark
    }
  };

  const list = () => (
    <Box sx={{ width: 250 }} role="presentation" onClick={toggleDrawer(false)} onKeyDown={toggleDrawer(false)}>
      <List>
        {links.map((link, index) => (
          <ListItem
            button
            component={link.path.startsWith('http') ? 'a' : NavLink}
            href={link.path.startsWith('http') ? link.path : undefined}
            to={link.path.startsWith('http') ? undefined : link.path}
            target={link.path.startsWith('http') ? '_blank' : undefined}
            rel={link.path.startsWith('http') ? 'noopener noreferrer' : undefined}
            key={index}
          >
            <ListItemText primary={link.label} />
          </ListItem>
        ))}
        <ListItem button component={NavLink} to="/login">
          <ListItemText primary="Login" />
        </ListItem>
      </List>
    </Box>
  );

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          width: '100%',
          justifyContent: 'space-between',
          backgroundColor: theme.palette.background.default,
          [theme.breakpoints.down('md')]: {
            justifyContent: 'space-between'
          }
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center'
          }}
        >
          <Box component="span" sx={{ display: { xs: 'block', md: 'block' }, flexGrow: 0 }}>
            <LogoSection />
          </Box>
        </Box>
        <Box
          sx={{
            display: { xs: 'none', md: 'table-row-group' },
            justifyContent: 'flex-end',
            alignItems: 'center',
            width: '100%',
            paddingRight: '0px',
            textAlign: 'end'
          }}
        >
          {links.map((link, index) => (
            <Button
              key={index}
              component={link.path.startsWith('http') ? 'a' : NavLink}
              href={link.path.startsWith('http') ? link.path : undefined}
              to={link.path.startsWith('http') ? undefined : link.path}
              target={link.path.startsWith('http') ? '_blank' : undefined}
              rel={link.path.startsWith('http') ? 'noopener noreferrer' : undefined}
              variant="text"
              sx={buttonStyles}
            >
              {link.label}
            </Button>
          ))}
          <Button component={NavLink} to="/login" variant="contained" sx={buttonStylesLogin}>
            Login
          </Button>
        </Box>
        <IconButton color="inherit" aria-label="open drawer" edge="start" onClick={toggleDrawer(true)} sx={{ display: { md: 'none' } }}>
          <MenuIcon />
        </IconButton>
      </Box>
      <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
        {list()}
      </Drawer>
    </>
  );
};

export default Header;
