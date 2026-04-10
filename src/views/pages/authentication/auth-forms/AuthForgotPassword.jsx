import { useEffect, useState } from 'react';
import axios from 'axios';
import config from 'config';
// material-ui
import { useTheme } from '@mui/material/styles';
import {
  Box,
  Button,
  IconButton,
  FormControl,
  FormHelperText,
  InputLabel,
  OutlinedInput,
  Alert,
  CircularProgress,
  InputAdornment
} from '@mui/material';

// third party
import * as Yup from 'yup';
import { Formik } from 'formik';

// project imports
import useScriptRef from 'hooks/useScriptRef';
import AnimateButton from 'ui-component/extended/AnimateButton';
import RefreshIcon from '@mui/icons-material/Refresh';
import FirebaseOtpVerification from './auth-otp/AuthOtpVerification';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import RedirectToHomeButton from 'utils/RedirectToHomeButton';
// ===========================|| FIREBASE - REGISTER ||=========================== //

const FirebaseForgotPassword = ({ ...others }) => {
  const theme = useTheme();
  const scriptedRef = useScriptRef();
  const [captchaImage, setCaptchaImage] = useState('');
  const [captchaToken, setCaptchaToken] = useState('');
  const [getError, setError] = useState(null);
  const [requireOtpVerification, setRequireOtpVerification] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isSubmittingButton, setIsSubmittingButton] = useState(false);
  const [loginUserInfo, setLoginUserInfo] = useState(null);
  const apiBaseUrl = config.API_BASE_URL;
  useEffect(() => {
    localStorage.clear();
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
      {!requireOtpVerification ? (
        <Formik
          initialValues={{
            userCode: '',
            captcha: '',
            submit: null
          }}
          validationSchema={Yup.object().shape({
            userCode: Yup.string()
              .matches(/^[a-zA-Z0-9-]+$/, 'User Id can only contain alphanumeric characters and dashes')
              .max(100)
              .required('User Id is required'),
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
                const loginUrl = `${apiBaseUrl}/login/userForgotPassword`;
                values.captchaToken = captchaToken;
                axios
                  .post(loginUrl, values, {
                    mode: 'no-cors',
                    headers: {
                      'Access-Control-Allow-Origin': '*',
                      'Content-Type': 'application/json'
                    }
                  })
                  .then((response) => {
                    console.log('response.data', response.data);
                    setLoginUserInfo(response.data);
                    setStatus({ success: true });
                    setSubmitting(false);
                    if (response.data && response.data.otpResponse) {
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
                <InputLabel htmlFor="outlined-adornment-userCode-forgotPassword">Enter Registered User Id</InputLabel>
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
                  label="Enter Registered User Id"
                  inputProps={{ maxLength: 101 }}
                />
                {touched.userCode && errors.userCode && (
                  <FormHelperText error id="standard-weight-helper-text--forgotPassword">
                    {errors.userCode}
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
                <InputLabel htmlFor="outlined-adornment-captcha">Enter Captcha Code</InputLabel>
                <OutlinedInput
                  id="outlined-adornment-captcha"
                  type="text"
                  value={values.captcha}
                  name="captcha"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  label="Enter Captcha Code"
                  inputProps={{ maxLength: 6 }}
                />
                {touched.captcha && errors.captcha && (
                  <FormHelperText error id="standard-weight-helper-text-captcha">
                    {errors.captcha}
                  </FormHelperText>
                )}
              </FormControl>
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
                    SUBMIT
                  </Button>
                </AnimateButton>
              </Box>
              <RedirectToHomeButton />
            </form>
          )}
        </Formik>
      ) : (
        <FirebaseOtpVerification setLoginUserInfo={loginUserInfo} />
      )}
    </>
  );
};

export default FirebaseForgotPassword;
