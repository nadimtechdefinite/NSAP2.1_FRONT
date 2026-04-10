import React, { useState, useEffect } from 'react';
import MainCard from 'ui-component/cards/MainCard';
import {
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Snackbar,
  Alert,
  Typography
} from '@mui/material';
import { styled } from '@mui/system';
import axiosInstance from 'hooks/useAuthTokenUrl';

const StyledTableContainer = styled(TableContainer)({
  overflowX: 'auto'
});

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  border: '1px solid rgba(224, 224, 224, 1)',
  padding: theme.spacing(1)
}));

const RoleBaseMenu = () => {
  const [roles, setRoles] = useState([]);
  const [menus, setMenus] = useState([]);
  const [userRoleId, setUserRoleId] = useState('');
  const [checkedMenuIds, setCheckedMenuIds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState(null);
  const handleCloseSnackbar = () => setSnackbar(null);
  const fetchRoles = async () => {
    try {
      const getUrl = `/master-management/findAllRoleMaster`;
      const response = await axiosInstance.get(getUrl);
      setRoles(response.data);
      console.log(JSON.stringify(response.data));
    } catch (error) {
      console.error('Error fetching Roles:', error);
    }
  };

  const fetchAllMenu = async () => {
    try {
      const getUrl = `/master-management/findAllMenu`;
      const response = await axiosInstance.get(getUrl);
      setMenus(response.data);
      console.log('findAllMenu', response);
    } catch (error) {
      console.error('Error fetching Menus:', error);
    }
  };

  const fetchAllMenuByUserRoleId = async () => {
    try {
      const getUrl = `/master-management/findAllMenuByUserRoleId/${userRoleId}`;
      const response = await axiosInstance.get(getUrl);
      console.log('menu by role Id : ', response);
      setCheckedMenuIds(response.data.map((item) => item.menuId));
    } catch (error) {
      console.error('Error fetching Menus:', error);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  useEffect(() => {
    if (userRoleId) {
      fetchAllMenu();
    }
  }, [userRoleId]);

  useEffect(() => {
    if (userRoleId) {
      fetchAllMenuByUserRoleId();
    }
  }, [userRoleId]);

  const handleChange = (event) => {
    const roleId = event.target.value;
    setUserRoleId(roleId);
  };

  const handleCheckboxChange = async (menuId) => {
    try {
      setLoading(true);
      const postUrl = `/master-management/assignMenuWithRole/${userRoleId}/${menuId}`;
      const response = await axiosInstance.post(postUrl);
      if (response.data) {
        setCheckedMenuIds((prevState) => {
          if (prevState.includes(menuId)) {
            return prevState.filter((id) => id !== menuId);
          } else {
            return [...prevState, menuId];
          }
        });
        setSnackbar({ children: 'Records update seccessfully.', severity: 'success' });
      } else {
        console.error('Error Assign Menus. Status: ', response.data);
        setSnackbar({ children: 'Error Assign Menus.', severity: 'error' });
      }
    } catch (error) {
      console.error('Error Assign Menus:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <MainCard title="Add Role Menu Master">
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <InputLabel id="Role Name-label">
                Role<span style={{ color: 'red' }}> *</span>
              </InputLabel>
              <Select labelId="Role Name-label" id="roleId" label="Role" name="roleId" value={userRoleId} onChange={handleChange} required>
                {roles.map((item) => (
                  <MenuItem key={item.roleId} value={item.roleId}>
                    {item.roleName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </MainCard>
      {menus.length !== 0 && (
        <div style={{ marginTop: 10 }}>
          <MainCard>
            <StyledTableContainer component={Paper}>
              <Table aria-label="role menu table">
                <TableHead>
                  <TableRow>
                    <StyledTableCell>Module</StyledTableCell>
                    <StyledTableCell>SubModule Group</StyledTableCell>
                    <StyledTableCell>SubModule</StyledTableCell>
                    <StyledTableCell>Menu</StyledTableCell>
                    <StyledTableCell align="center">Assigned</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {menus.map((module, moduleIndex) => (
                    <React.Fragment key={moduleIndex}>
                      {module.children.map((group, groupIndex) => (
                        <React.Fragment key={`${moduleIndex}-${groupIndex}`}>
                          {group.children.map((subModule, subModuleIndex) => (
                            <React.Fragment key={`${moduleIndex}-${groupIndex}-${subModuleIndex}`}>
                              {subModule.children.map((menu, menuIndex) => (
                                <TableRow key={`${moduleIndex}-${groupIndex}-${subModuleIndex}-${menuIndex}`}>
                                  {groupIndex === 0 && subModuleIndex === 0 && menuIndex === 0 && (
                                    <StyledTableCell
                                      rowSpan={module.children.reduce(
                                        (acc, group) =>
                                          acc + group.children.reduce((subAcc, subModule) => subAcc + subModule.children.length, 0),
                                        0
                                      )}
                                    >
                                      <Typography variant="h5">{module.moduleName}</Typography>
                                    </StyledTableCell>
                                  )}

                                  {subModuleIndex === 0 && menuIndex === 0 && (
                                    <StyledTableCell
                                      rowSpan={group.children.reduce((subAcc, subModule) => subAcc + subModule.children.length, 0)}
                                    >
                                      <Typography variant="h5">{group.groupName !== 'NA' ? group.groupName : ''}</Typography>
                                    </StyledTableCell>
                                  )}

                                  {menuIndex === 0 && (
                                    <StyledTableCell rowSpan={subModule.children.length}>
                                      <Typography variant="h5">
                                        {subModule.subModuleName !== 'NA' ? subModule.subModuleName : ''}
                                      </Typography>
                                    </StyledTableCell>
                                  )}

                                  <StyledTableCell>{menu.menuName}</StyledTableCell>
                                  <StyledTableCell align="center">
                                    <Checkbox
                                      checked={checkedMenuIds.includes(menu.menuId)}
                                      onChange={() => handleCheckboxChange(menu.menuId)}
                                      disabled={loading}
                                    />
                                  </StyledTableCell>
                                </TableRow>
                              ))}
                            </React.Fragment>
                          ))}
                        </React.Fragment>
                      ))}
                    </React.Fragment>
                  ))}
                </TableBody>
              </Table>
            </StyledTableContainer>
          </MainCard>
        </div>
      )}

      {!!snackbar && (
        <Snackbar open anchorOrigin={{ vertical: 'top', horizontal: 'center' }} onClose={handleCloseSnackbar} autoHideDuration={4000}>
          <Alert {...snackbar} onClose={handleCloseSnackbar} />
        </Snackbar>
      )}
    </>
  );
};

export default RoleBaseMenu;
