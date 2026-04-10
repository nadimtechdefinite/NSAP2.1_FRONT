import { useState, useEffect } from 'react';

//import { useSelector } from 'react-redux';

// material-ui
import { useTheme } from '@mui/material/styles';
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  CircularProgress,
  Alert
} from '@mui/material';

// third party
import * as Yup from 'yup';
import { Formik } from 'formik';

// project imports
import useScriptRef from 'hooks/useScriptRef';
//import Google from 'assets/images/icons/social-google.svg';
import AnimateButton from 'ui-component/extended/AnimateButton';
import { strengthColor, strengthIndicator } from 'utils/password-strength';

// assets
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useNavigate } from 'react-router';
import axios from 'axios';
import config from 'config';
import CryptoJS from 'crypto-js';
import RedirectToHomeButton from 'utils/RedirectToHomeButton';
// ===========================|| FIREBASE - REGISTER ||=========================== //

const FirebaseResetPassword = ({ userCodeValue, ...others }) => {
  const theme = useTheme();
  const scriptedRef = useScriptRef();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSuccessDialogOpen, setSuccessDialogOpen] = useState(false);
  const [strength, setStrength] = useState(0);
  const [level, setLevel] = useState();
  const [newPasswordState, setNewPasswordState] = useState('');
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [randonToken, setRandonToken] = useState('');
  const [getError, setError] = useState('');
  const [isSubmittingButton, setIsSubmittingButton] = useState(false);
  const apiBaseUrl = config.API_BASE_URL;

  function hashPassword(password) {
    return CryptoJS.SHA256(password).toString();
  }

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleClickShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleMouseDownConfirmPassword = (event) => {
    event.preventDefault();
  };

  const changePassword = (value) => {
    setNewPasswordState(value);
    const temp = strengthIndicator(value);
    setStrength(temp);
    setLevel(strengthColor(temp));
  };

  useEffect(() => {
    changePassword('');
  }, []);

  const handleCloseSuccessDialog = () => {
    setSuccessDialogOpen(false);
    navigate('/home');
  };

  const handleOpenSuccessDialog = () => {
    setSuccessDialogOpen(true);
    setTimeout(() => {
      handleCloseSuccessDialog();
    }, 2000);
  };

  const fetchTokenValue = async () => {
    setLoading(true);
    const getUrl = `${apiBaseUrl}/login/generateRandamToken`;
    try {
      const response = await axios.get(getUrl);
      setRandonToken(response.data);
    } catch (error) {
      console.error('Error Fetching Generate Randam Token:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userCodeValue !== null) {
      fetchTokenValue();
    } else {
      navigate('/login');
    }
  }, [userCodeValue]);

  const handleConfirmPasswordBlur = async (event) => {
    // Check if confirm password matches the new password
    const confirmPassword = event.target.value;
    const newPassword = newPasswordState;
    setError('');
    if (newPassword === confirmPassword) {
      try {
        setLoading(true); // Set loading state to true while making the request
        // Make the POST request to the desired endpoint
        const hashPasswordFirst = hashPassword(confirmPassword);
        const postUrl = `${apiBaseUrl}/login/checkLastThreeUserPassword`;
        const response = await axios.post(postUrl, {
          userCode: userCodeValue,
          password: hashPassword(hashPasswordFirst + randonToken), // Hash the password before sending
          token: randonToken
          // Other data to send along with the request if needed
        });
        if (response.data === true) {
          setError('Please choose a different password. This password was used recently.');
        }
        setIsSubmittingButton(response.data);
        console.log('Check if any of the last three passwords match the provided password :', response.data);

        // Do something with the response if needed

        // Optionally, set a success message or perform any other action
      } catch (error) {
        console.error('Error changing password:', error);
        setError('An unexpected error occurred.');
      } finally {
        setLoading(false); // Set loading state back to false after the request is completed
      }
    }
  };
  return (
    <>
      {getError && (
        <Box sx={{ mt: 2 }}>
          <Alert severity="error">{getError}</Alert>
        </Box>
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

      <Formik
        initialValues={{
          userCode: userCodeValue,
          newPassword: '',
          confirmPassword: '',
          submit: null
        }}
        validationSchema={Yup.object().shape({
          userCode: Yup.string()
            .matches(/^[a-zA-Z0-9-]+$/, 'User Id can only contain alphanumeric characters and dashes')
            .max(50)
            .required('User Id is required'),
          newPassword: Yup.string()
            .matches(
              /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
              'Password must contain at least one uppercase letter, one lowercase letter, one numeric character, and one special character, and be at least eight characters long'
            )
            .max(50)
            .required('Password is required'),
          confirmPassword: Yup.string()
            .oneOf([Yup.ref('newPassword'), null], 'Passwords must match') // Validation for matching passwords
            .max(50)
            .required('Confirm Password is required')
        })}
        onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
          try {
            setIsSubmittingButton(true);
            if (scriptedRef.current) {
              values.password = hashPassword(values.confirmPassword);
              const apiBaseUrl = config.API_BASE_URL;
              const loginUrl = `${apiBaseUrl}/login/resetUserPassword`;
              axios
                .post(loginUrl, values, {
                  mode: 'no-cors',
                  headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Content-Type': 'application/json'
                  }
                })
                .then((response) => {
                  if (response.data === true) {
                    setStatus({ success: true });
                    setSubmitting(true);
                    handleOpenSuccessDialog();
                  }
                })
                .catch((err) => {
                  console.log(err);
                  setError('An unexpected error occurred.');
                })
                .finally(() => {
                  setIsSubmittingButton(false); // Set isSubmitting to false after request completion
                });
            }
          } catch (err) {
            console.error(err);
            if (scriptedRef.current) {
              setStatus({ success: false });
              setErrors({ submit: err.message });
              setSubmitting(false);
              setIsSubmittingButton(false);
            }
          }
        }}
      >
        {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
          <form noValidate onSubmit={handleSubmit} {...others}>
            <FormControl fullWidth error={Boolean(touched.userCode && errors.userCode)} sx={{ ...theme.typography.customInput }}>
              <InputLabel htmlFor="outlined-adornment-userCode-register">Enter Registered User Id</InputLabel>
              <OutlinedInput
                id="outlined-adornment-userCode-register"
                type="text"
                value={values.userCode}
                name="userCode"
                onBlur={handleBlur}
                onChange={handleChange}
                inputProps={{}}
                readOnly={true}
              />
              {touched.userCode && errors.userCode && (
                <FormHelperText error id="standard-weight-helper-text--register">
                  {errors.userCode}
                </FormHelperText>
              )}
            </FormControl>

            <FormControl fullWidth error={Boolean(touched.newPassword && errors.newPassword)} sx={{ ...theme.typography.customInput }}>
              <InputLabel htmlFor="outlined-adornment-password-register">Enter New Password</InputLabel>
              <OutlinedInput
                id="outlined-adornment-newPassword-register"
                type={showPassword ? 'text' : 'password'}
                value={values.newPassword}
                name="newPassword"
                label="Enter New Password"
                onBlur={handleBlur}
                onChange={(e) => {
                  handleChange(e);
                  changePassword(e.target.value);
                }}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                      size="large"
                    >
                      {showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                }
                inputProps={{}}
              />
              {touched.newPassword && errors.newPassword && (
                <FormHelperText error id="standard-weight-helper-text-newPassword-register">
                  {errors.newPassword}
                </FormHelperText>
              )}
            </FormControl>
            <FormControl
              fullWidth
              error={Boolean(touched.confirmPassword && errors.confirmPassword)}
              sx={{ ...theme.typography.customInput }}
            >
              <InputLabel htmlFor="outlined-adornment-confirmPassword-register">Enter Confirm Password</InputLabel>
              <OutlinedInput
                id="outlined-adornment-confirmPassword-register"
                type={showConfirmPassword ? 'text' : 'password'}
                value={values.confirmPassword}
                name="confirmPassword"
                label="Enter Confirm Password"
                onBlur={(event) => {
                  handleBlur(event);
                  handleConfirmPasswordBlur(event);
                }}
                onChange={(e) => {
                  handleChange(e);
                }}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowConfirmPassword}
                      onMouseDown={handleMouseDownConfirmPassword}
                      edge="end"
                      size="large"
                    >
                      {showConfirmPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                }
                inputProps={{}}
              />
              {touched.confirmPassword && errors.confirmPassword && (
                <FormHelperText error id="standard-weight-helper-text-confirmPassword-register">
                  {errors.confirmPassword}
                </FormHelperText>
              )}
            </FormControl>
            {strength !== 0 && (
              <FormControl fullWidth>
                <Box sx={{ mb: 2 }}>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item>
                      <Box style={{ backgroundColor: level?.color }} sx={{ width: 85, height: 8, borderRadius: '7px' }} />
                    </Grid>
                    <Grid item>
                      <Typography variant="subtitle1" fontSize="0.75rem">
                        {level?.label}
                      </Typography>
                    </Grid>
                  </Grid>
                </Box>
              </FormControl>
            )}

            {errors.submit && (
              <Box sx={{ mt: 3 }}>
                <FormHelperText error>{errors.submit}</FormHelperText>
              </Box>
            )}

            <Box sx={{ mt: 2 }}>
              <AnimateButton>
                <Button
                  disableElevation
                  disabled={isSubmitting || isSubmittingButton}
                  fullWidth
                  size="large"
                  type="submit"
                  variant="contained"
                  color="secondary"
                >
                  Reset Password
                </Button>
              </AnimateButton>
            </Box>
            <RedirectToHomeButton />
          </form>
        )}
      </Formik>

      {/* Success Dialog */}
      <Dialog open={isSuccessDialogOpen} onClose={handleCloseSuccessDialog}>
        <DialogTitle>Success!</DialogTitle>
        <DialogContent>
          <DialogContentText>User Password Reset successful! You will be redirected to the home..</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseSuccessDialog} color="primary" autoFocus>
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default FirebaseResetPassword;
