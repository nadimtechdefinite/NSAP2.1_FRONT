import { useState } from 'react';
import axios from 'axios';
import config from 'config';

// material-ui
import { useTheme } from '@mui/material/styles';
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Stack,
  Typography,
  Alert,
  CircularProgress
} from '@mui/material';

// third party
import * as Yup from 'yup';
import { Formik } from 'formik';

// project imports
import useScriptRef from 'hooks/useScriptRef';
import AnimateButton from 'ui-component/extended/AnimateButton';

// assets
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import RefreshIcon from '@mui/icons-material/Refresh';
import FirebaseOtpVerification from './auth-otp/AuthOtpVerification';
import FirebaseResetPassword from './AuthResetPassword';
import { useEffect } from 'react';
import CryptoJS from 'crypto-js';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import RedirectToHomeButton from 'utils/RedirectToHomeButton';
// ============================|| FIREBASE - LOGIN ||============================ //

const FirebaseLogin = ({ ...others }) => {
  const theme = useTheme();
  const navigate = useNavigate(); // Hook for navigation
  const scriptedRef = useScriptRef();
  const [checked, setChecked] = useState(true);
  const [getError, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [requireOtpVerification, setRequireOtpVerification] = useState(false);
  const [loginUserInfo, setLoginUserInfo] = useState(null);
  const [isSubmittingButton, setIsSubmittingButton] = useState(false);
  const [captchaImage, setCaptchaImage] = useState('');
  const [captchaToken, setCaptchaToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [passwordResetFlag, setPasswordResetFlag] = useState(false);
  const [passwordResetUserCode, setPasswordResetUserCode] = useState('');

  const apiBaseUrl = config.API_BASE_URL;
  function hashPassword(password) {
    return CryptoJS.SHA256(password).toString();
  }
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  useEffect(() => {
    sessionStorage.clear();
  }, []);

  const fetchCaptcha = async () => {
    setLoading(true);
    const captchaUrl = `${apiBaseUrl}/login/captcha`;
    try {
      const response = await axios.post(captchaUrl, { captchaToken });
      setCaptchaImage(response.data.captchaImage);
      setCaptchaToken(response.data.captchaToken);
    } catch (error) {
      console.error('Error fetching CAPTCHA:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefreshCaptcha = () => {
    fetchCaptcha();
  };

  useEffect(() => {
    fetchCaptcha();
  }, []);
  // Handler for clicking "Forgot Password?"
  const handleForgotPasswordClick = () => {
    return () => {
      navigate('/forgotPassword'); // Navigate to the forgot password route with state
    };
  };
  return (
    <>
      {!requireOtpVerification && !passwordResetFlag && (
        <Grid container direction="column" justifyContent="center" spacing={2}>
          <Grid item xs={12} container alignItems="center" justifyContent="center">
            <Box sx={{ mb: 2 }}>
              <Typography variant="h3" textAlign={'center'} color={theme.palette.secondary.main}>
                Enter your credentials to continue..
              </Typography>
            </Box>
          </Grid>
        </Grid>
      )}

      {passwordResetFlag && (
        <Grid container direction="column" justifyContent="center" spacing={2}>
          <Grid item xs={12} container alignItems="center" justifyContent="center">
            <Box sx={{ mb: 2 }}>
              <Typography variant="h3" textAlign={'center'} color={theme.palette.secondary.main}>
                Reset User Password
              </Typography>
            </Box>
          </Grid>
        </Grid>
      )}

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
      {!requireOtpVerification && !passwordResetFlag ? (
        <Formik
          initialValues={{
            userCode: '',
            password: '',
            captcha: '',
            submit: null
          }}
          validationSchema={Yup.object().shape({
            userCode: Yup.string()
              .matches(/^[a-zA-Z0-9-]+$/, 'User Id can only contain alphanumeric characters and dashes')
              .max(100)
              .required('User Id is required'),
            password: Yup.string().max(50).required('Password is required'),
            captcha: Yup.string()
              .matches(/^[a-zA-Z0-9]*$/, 'Captcha should contain only alphanumeric characters.')
              .min(6, 'Captcha must be at least 6 characters long')
              .required('Captcha is required')
          })}
          onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
            try {
              setIsSubmittingButton(true);
              setError(null);
              if (scriptedRef.current) {
                const apiBaseUrl = config.API_BASE_URL;
                const loginUrl = `${apiBaseUrl}/login`;
                const hashPasswordFirst = hashPassword(values.password);
                const loginRequestData = {
                  userCode: values.userCode,
                  password: hashPassword(hashPasswordFirst + captchaToken),
                  captcha: values.captcha,
                  captchaToken: captchaToken
                };
                axios
                  .post(loginUrl, loginRequestData, {
                    mode: 'no-cors',
                    headers: {
                      'Access-Control-Allow-Origin': '*',
                      'Content-Type': 'application/json'
                    }
                  })
                  .then((response) => {
                    if (loginRequestData.userCode != response.data.userCode || loginRequestData.password != response.data.password) {
                      setError('Invalid user credentials !!');
                      return false;
                    }

                    setLoginUserInfo(response.data);
                    setStatus({ success: true });
                    setSubmitting(false);
                    if (response.data && response.data.isPasswordReset) {
                      setPasswordResetFlag(response.data.isPasswordReset);
                      setPasswordResetUserCode(response.data.userCode);
                    } else if (response.data && response.data.otpResponse) {
                      const otpStatus = response.data.otpResponse.otpStatus;
                      setRequireOtpVerification(otpStatus);
                    }
                  })
                  .catch((err) => {
                    console.log(err);
                    if (err.response && err.response.data && err.response.data.message) {
                      const errorMssg = err.response.data.message;
                      setError(errorMssg);
                    } else {
                      if (err.response.data.captcha) {
                        setErrors({ captcha: err.response.data.captcha });
                      } else {
                        setError('An unexpected error occurred.');
                      }
                    }
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
                <InputLabel htmlFor="outlined-adornment-userCode-login">User Id</InputLabel>
                <OutlinedInput
                  id="outlined-adornment-userCode-login"
                  type="text"
                  value={values.userCode}
                  name="userCode"
                  autoComplete="current-userCode"
                  onBlur={handleBlur}
                  onChange={(event) => handleChange({ target: { name: 'userCode', value: event.target.value.toUpperCase() } })}
                  endAdornment={
                    <InputAdornment position="end">
                      <AccountCircleIcon />
                    </InputAdornment>
                  }
                  label="User Id"
                  inputProps={{ maxLength: 101 }}
                />
                {touched.userCode && errors.userCode && (
                  <FormHelperText error id="standard-weight-helper-text-userCode-login">
                    {errors.userCode}
                  </FormHelperText>
                )}
              </FormControl>

              <FormControl fullWidth error={Boolean(touched.password && errors.password)} sx={{ ...theme.typography.customInput }}>
                <InputLabel htmlFor="outlined-adornment-password-login">Password</InputLabel>
                <OutlinedInput
                  id="outlined-adornment-password-login"
                  type={showPassword ? 'text' : 'password'}
                  value={values.password}
                  name="password"
                  autoComplete="current-password"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                      >
                        {showPassword ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>
                  }
                  label="Password"
                  inputProps={{ maxLength: 51 }}
                />
                {touched.password && errors.password && (
                  <FormHelperText error id="standard-weight-helper-text-password-login">
                    {errors.password}
                  </FormHelperText>
                )}
              </FormControl>

              <Box display="flex" alignItems="center">
                <img
                  src={`data:image/png;base64,${captchaImage}`}
                  alt="captcha"
                  style={{ marginRight: '10px', overflow: 'hidden', borderRadius: '10px' }}
                />
                <IconButton onClick={handleRefreshCaptcha} aria-label="refresh captcha">
                  <RefreshIcon />
                </IconButton>
              </Box>
              <FormControl fullWidth error={Boolean(touched.captcha && errors.captcha)} sx={{ ...theme.typography.customInput }}>
                <InputLabel htmlFor="outlined-adornment-captcha">Captcha Code</InputLabel>
                <OutlinedInput
                  id="outlined-adornment-captcha"
                  type="text"
                  value={values.captcha}
                  name="captcha"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  label="Captcha Code"
                  inputProps={{ maxLength: 6 }}
                />
                {touched.captcha && errors.captcha && (
                  <FormHelperText error id="standard-weight-helper-text-captcha">
                    {errors.captcha}
                  </FormHelperText>
                )}
              </FormControl>

              <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1}>
                <FormControlLabel
                  control={
                    <Checkbox checked={checked} onChange={(event) => setChecked(event.target.checked)} name="checked" color="primary" />
                  }
                  label="Remember me"
                />
                <Typography
                  onClick={handleForgotPasswordClick()}
                  variant="subtitle1"
                  color="secondary"
                  sx={{ textDecoration: 'none', cursor: 'pointer' }}
                >
                  Forgot Password?
                </Typography>
              </Stack>
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
                    endIcon={isSubmittingButton && <CircularProgress size={24} />}
                  >
                    Sign in
                  </Button>
                </AnimateButton>
              </Box>
              <RedirectToHomeButton />
            </form>
          )}
        </Formik>
      ) : passwordResetFlag ? (
        <FirebaseResetPassword userCodeValue={passwordResetUserCode} />
      ) : (
        <FirebaseOtpVerification setLoginUserInfo={loginUserInfo} />
      )}
    </>
  );
};

export default FirebaseLogin;
