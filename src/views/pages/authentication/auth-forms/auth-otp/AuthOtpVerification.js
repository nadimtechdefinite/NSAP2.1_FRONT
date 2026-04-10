import { useState, useEffect } from 'react';
import config from 'config';
import axios from 'axios';
import PropTypes from 'prop-types';
import Decrypter from '../../../../../components/common/Decrypter';

// material-ui
import { useTheme } from '@mui/material/styles';
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  InputLabel,
  OutlinedInput,
  Alert,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  InputAdornment,
  Typography,
  Stack,
  useMediaQuery,
  CircularProgress
} from '@mui/material';

// third party
import * as Yup from 'yup';
import { Formik } from 'formik';

// project imports
import useScriptRef from 'hooks/useScriptRef';
import AnimateButton from 'ui-component/extended/AnimateButton';

// assets
import { useNavigate } from 'react-router';
// ============================|| FIREBASE - LOGIN ||============================ //
import { MailOutline as OtpIcon } from '@mui/icons-material'; // Assuming you have an icon for OTP
import { setUserInfo, removeOTPResponseInfo } from 'utils/storageUtils';
import Snackbar from '@material-ui/core/Snackbar';
import FirebaseResetPassword from '../AuthResetPassword';
const FirebaseOtpVerification = ({ setLoginUserInfo }) => {
  const theme = useTheme();
  const matchDownSM = useMediaQuery(theme.breakpoints.down('md'));
  const scriptedRef = useScriptRef();
  const navigate = useNavigate();
  const [getError, setError] = useState(null);
  const [isSuccessDialogOpen, setSuccessDialogOpen] = useState(false);
  const [isErrorDialogOpen, setIsErrorDialogOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmittingButton, setIsSubmittingButton] = useState(false);
  const [timer, setTimer] = useState(10);
  const [isTimerRunning, setIsTimerRunning] = useState(true);
  const [resendAttempts, setResendAttempts] = useState(0);
  const [showResendButton, setShowResendButton] = useState(true);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [passwordReset, setPasswordReset] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const handleCloseSuccessDialog = () => {
    setSuccessDialogOpen(false);
    navigate('/dashboard/default');
  };

  const handleOpenSuccessDialog = () => {
    setSuccessDialogOpen(true);
    setTimeout(() => {
      handleCloseSuccessDialog();
    }, 2000);
  };

  const handleOpenErrorDialog = () => {
    setIsErrorDialogOpen(true);
  };
  const handleCloseErrorDialog = () => {
    setIsErrorDialogOpen(false);
    window.location.reload();
  };
  const userCode = setLoginUserInfo.userCode;
  const otpStatusMessage = setLoginUserInfo.otpResponse.message;
  const userMobileNumber = setLoginUserInfo.otpResponse.mobileNumber;
  const passwordResetFlag = setLoginUserInfo.isPasswordReset;
  const MAX_RESEND_ATTEMPTS = 3;
  useEffect(() => {
    let interval;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimer((prevTimer) => (prevTimer > 0 ? prevTimer - 1 : 0));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  const handleResendOtp = () => {
    if (!isTimerRunning && resendAttempts < MAX_RESEND_ATTEMPTS) {
      setIsTimerRunning(true);
      setTimer(10); // Reset timer
      setResendAttempts((prevAttempts) => prevAttempts + 1);

      try {
        const resendOTPRequest = {
          userCode: userCode,
          mobileNumber: userMobileNumber,
          resendOTPCountValue: resendAttempts
        };
        const apiBaseUrl = config.API_BASE_URL;
        const loginUrl = `${apiBaseUrl}/login/resendOTP`;
        axios
          .post(loginUrl, resendOTPRequest, {
            mode: 'no-cors',
            headers: {
              'Access-Control-Allow-Origin': '*',
              'Content-Type': 'application/json'
            }
          })
          .then((response) => {
            if (response.data.resendOTPStatus) {
              setOpenSnackbar(response.data.resendOTPStatus);
            }
          })
          .catch((err) => {
            console.log(err);
          });
      } catch (err) {
        console.error(err);
      }
    }
  };

  useEffect(() => {
    if (resendAttempts >= MAX_RESEND_ATTEMPTS) {
      setShowResendButton(false);
      handleOpenErrorDialog();
      setErrorMessage('Maximum resend attempts reached. Please try again later.');
    }
  }, [resendAttempts]);

  useEffect(() => {
    if (timer === 0) {
      setTimer(0);
      setIsTimerRunning(false);
    }
  }, [timer]);
  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };
  return (
    <>
      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert elevation={6} variant="filled" onClose={handleCloseSnackbar} severity="success">
          OTP Resent Successfully!
        </Alert>
      </Snackbar>
      {!otpVerified && (
        <Grid container direction="column" justifyContent="center" spacing={2}>
          <Grid item xs={12} container alignItems="center" justifyContent="center">
            <Grid item xs={12}>
              <Grid container direction={matchDownSM ? 'column-reverse' : 'row'} alignItems="center" justifyContent="center">
                <Grid item>
                  <Stack alignItems="center" justifyContent="center" spacing={1}>
                    <Typography color={theme.palette.secondary.main} gutterBottom variant={matchDownSM ? 'h4' : 'h3'}>
                      OTP Verification
                    </Typography>
                    <Typography variant="h6" fontSize="14px" textAlign={matchDownSM ? 'center' : 'inherit'}>
                      {otpStatusMessage}
                    </Typography>
                    <Typography variant="h6" fontSize="12px" textAlign={matchDownSM ? 'center' : 'inherit'}>
                      Enter the code generated on your mobile device below.
                    </Typography>
                  </Stack>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      )}
      {getError && (
        <Box sx={{ mt: 2 }}>
          <Alert severity="error">{getError}</Alert>
        </Box>
      )}

      {!passwordReset ? (
        <Formik
          initialValues={{
            otpCode: '',
            submit: null
          }}
          validationSchema={Yup.object().shape({
            /* otpVerification: Yup.string().max(255).required('OTP Code is required') */
            otpCode: Yup.string()
              .matches(/^[0-9]{6}$/, 'OTP Code must be a 6-digit number')
              .required('OTP Code is required')
          })}
          onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
            try {
              setIsSubmittingButton(true);
              if (scriptedRef.current) {
                values.userCode = userCode;
                values.mobileNumber = userMobileNumber;
                const apiBaseUrl = config.API_BASE_URL;
                const loginUrl = `${apiBaseUrl}/login/verifyOTP`;

                console.log(values.otpCode);
                axios
                  .post(loginUrl, values, {
                    mode: 'no-cors',
                    headers: {
                      'Access-Control-Allow-Origin': '*',
                      'Content-Type': 'application/json',
                      userInfo: JSON.stringify(setLoginUserInfo)
                    }
                  })
                  .then((response) => {
                    const encryptedUidData = Decrypter({ encryptedData: response.data });
                    const result = encryptedUidData.split('*');
                    const resOtp=result[0];
                    const status=result[1];
                   
                  
                    if (status === 'true') {
                      if (passwordResetFlag) {
                        setPasswordReset(passwordResetFlag);
                        setOtpVerified(response.data);
                      } else if(resOtp == values.otpCode){
                        // Get the user info from the state
                        const userInfo = { ...setLoginUserInfo };
                        // Remove the properties you want to exclude
                        removeOTPResponseInfo(userInfo);
                        setUserInfo(userInfo);
                        setStatus({ success: true });
                        setSubmitting(true);
                        handleOpenSuccessDialog();
                      }else {
                        setError('An unexpected error occurred.');
                      }
                    }
                  })
                  .catch((err) => {
                    console.log(err);
                    if (err.response && err.response.data && err.response.data.message) {
                      const errorMssg = err.response.data.message;
                      setError(errorMssg);
                    } else {
                      if (err.response.data.otpCode) {
                        setErrors({ otpCode: err.response.data.otpCode });
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
            <form noValidate onSubmit={handleSubmit}>
              <FormControl fullWidth error={Boolean(touched.otpCode && errors.otpCode)} sx={{ ...theme.typography.customInput }}>
                <InputLabel htmlFor="outlined-adornment-otpCode-login">Enter OTP</InputLabel>
                <OutlinedInput
                  id="outlined-adornment-otpCode-login"
                  type="text"
                  value={values.otpCode}
                  name="otpCode"
                  onBlur={(e) => {
                    handleBlur(e);
                    if (e.target.value.trim().length === 0) {
                      setError(null); // Clear error state if input is empty
                    } else if (e.target.value.length !== 6) {
                      setError('OTP Code must be a 6-digit number');
                    } else {
                      setError(null);
                    }
                  }}
                  onChange={handleChange}
                  label="Enter OTP"
                  inputProps={{ maxLength: 6 }}
                  endAdornment={
                    <InputAdornment position="end">
                      <OtpIcon color="action" />
                    </InputAdornment>
                  }
                />
                {touched.otpCode && errors.otpCode && (
                  <FormHelperText error id="standard-weight-helper-text-otpCode-login">
                    {errors.otpCode}
                  </FormHelperText>
                )}
              </FormControl>

              {errors.submit && (
                <Box sx={{ mt: 2 }}>
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
                    Verify OTP
                  </Button>
                </AnimateButton>
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginTop: 2 }}>
                <Typography variant="body2" color="textSecondary">
                  {timer > 0 && isTimerRunning && showResendButton
                    ? `Resend OTP in ${timer} seconds`
                    : showResendButton && (
                        <Button variant="outlined" onClick={handleResendOtp} disabled={isSubmittingButton}>
                          Resend OTP
                        </Button>
                      )}
                </Typography>
              </Box>
            </form>
          )}
        </Formik>
      ) : (
        <FirebaseResetPassword userCodeValue={userCode} />
      )}

      {/* Success Dialog */}
      <Dialog open={isSuccessDialogOpen} onClose={handleCloseSuccessDialog} className="success-dialog">
        <DialogTitle>Success!</DialogTitle>
        <DialogContent>
          <DialogContentText>Login successful! You will be redirected to the dashboard..</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseSuccessDialog} color="primary" autoFocus>
            OK
          </Button>
        </DialogActions>
      </Dialog>

      {/* Error Dialog */}
      <Dialog open={isErrorDialogOpen} onClose={handleCloseErrorDialog}>
        <DialogTitle>Warning</DialogTitle>
        <DialogContent>
          <DialogContentText>{errorMessage}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseErrorDialog} color="primary" autoFocus>
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
FirebaseOtpVerification.propTypes = {
  setLoginUserInfo: PropTypes.shape({
    userCode: PropTypes.string,
    otpResponse: PropTypes.shape({
      message: PropTypes.string,
      mobileNumber: PropTypes.string
    })
  }).isRequired
};
export default FirebaseOtpVerification;
