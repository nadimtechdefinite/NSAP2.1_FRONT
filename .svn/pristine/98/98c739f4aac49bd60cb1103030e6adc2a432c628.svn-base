import { Typography } from '@mui/material';
import React, { useState, useEffect, useMemo } from 'react';
import NavGroup from './NavGroup';
import { useNavigate } from 'react-router';
import { checkValidToken } from 'utils/storageUtils';
import { fetchMenuItemsFromAPI } from 'menu-items';
import { List } from '@mui/material';

// ==============================|| SIDEBAR MENU LIST ||============================== //

const MenuList = () => {
  const navigate = useNavigate();
  // State to store menu data
  const [sessionExpired, setSessionExpired] = useState(false);
  const [loading, setLoading] = useState(true); // Add loading state
  const [cachedMenuItems, setCachedMenuItems] = useState([]);
  // Effect to fetch menu data from the API
  useEffect(() => {
    const verifySessionAndFetchMenu = async () => {
      if (!checkValidToken()) {
        setSessionExpired(true);
        setTimeout(() => navigate('/home'), 3000);
        return;
      }
      try {
        const fetchedMenuItems = await fetchMenuItemsFromAPI();
        setCachedMenuItems(fetchedMenuItems);
        setLoading(false); // Update loading state after fetching
      } catch (error) {
        console.error('Error fetching menu items:', error);
      } finally {
        setLoading(false);
      }
    };

    verifySessionAndFetchMenu();
  }, [navigate]); // This effect depends on `navigate` but it essentially runs once due to the nature of navigate being stable.

  const menuItems = useMemo(() => {
    return cachedMenuItems;
  }, [cachedMenuItems]);

  if (sessionExpired) {
    return (
      <Typography variant="h6" color="error" align="center">
        Session expired. Redirecting to login page...
      </Typography>
    );
  }
  if (loading) {
    return (
      <Typography variant="h6" align="center">
        Loading menu items...
      </Typography>
    );
  }

  const navItems = menuItems.map((item, index) => {
    switch (item.type) {
      case 'group':
        return <NavGroup key={index} item={item} />;
      default:
        return (
          <Typography key={item.id} variant="h6" color="error" align="center">
            Menu Items Error
          </Typography>
        );
    }
  });

  return (
    <List disablePadding sx={{ padding: 0, margin: 0 }}>
      {navItems}
    </List>
  );
};

export default MenuList;
