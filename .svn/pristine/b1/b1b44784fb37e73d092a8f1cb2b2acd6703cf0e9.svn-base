import React, { useState } from 'react';
import BeneficiaryPersonalDetails from './BeneficiaryPersonalDetails';
import BeneficiaryBankDetails from './BeneficiaryBankDetails';
import BeneficiaryAadharDetails from './BeneficiaryAadharDetails';
import BeneficiaryBPLDetails from './BeneficiaryBPLDetails';
import Preview from './Preview';
import axiosInstance from 'hooks/useAuthTokenUrl';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import messages_en from 'components/common/messages_en.json';
import { Typography, Button, Stepper, Step, StepLabel, Grid, CircularProgress } from '@mui/material';
import { makeStyles } from '@material-ui/core/styles';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import MainCard from 'ui-component/cards/MainCard';
const useStyles = makeStyles((theme) => ({
  button: {
    marginRight: theme.spacing(1)
  }
}));

function getSteps() {
  return ['Beneficiary Aadhar Details', 'Beneficiary Personal Details', 'Beneficiary Bank Details', 'Beneficiary BPL Details', 'Preview'];
}

const LinearStepper = () => {
  const [beneficiaryPersonalDetailsTO, setBeneficiaryPersonalDetailsTO] = useState({});
  const [beneficiaryBankDetailsTO, setBeneficiaryBankDetailsTO] = useState({});
  const [beneficiaryAadharDetailsTO, setBeneficiaryAadharDetailsTO] = useState({});
  const [beneficiaryBPLDetailsTO, setBeneficiaryBPLDetailsTO] = useState({});
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const classes = useStyles();
  const [activeStep, setActiveStep] = useState(0);
  const [skippedSteps, setSkippedSteps] = useState([]);
  const [displayedApplicationNo, setDisplayedApplicationNo] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [isValid, setIsValid] = useState(false);
  const [accountNumberAvailability, setAccountNumberAvailability] = useState('');
  const [aadharVerifyStatus, setAadharVerifyStatus] = useState(false);
  const [updateApplicantName, setUpdateApplicantName] = useState(false);
  const [beneficiaryNfbsDetailsTO, setBeneficiaryNfbsDetailsTO] = useState({});
  const [loading, setLoading] = useState(false);
  const [bankFormCompleted, setBankFormCompleted] = useState(false);
  const [aadharFormCompleted, setAadharFormCompleted] = useState(false);
  const [bplFormCompleted, setBplFormCompleted] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'info'
  });

  const alphabetAndSpacePattern = new RegExp(messages_en.alphabetAndSpacePattern);
  const numberLimitRegex = new RegExp(messages_en.numberLimitRegex);
  const alphabetNumberSpaceDashPattern = new RegExp(messages_en.alphabetNumberSpaceDashPattern);
  const alphanumericPattern = new RegExp(messages_en.alphanumericPattern);
  const pincodeRegex = new RegExp(messages_en.pincodeRegex);
  const accountNumberPattern = new RegExp(messages_en.accountNumberPattern);
  const validNumberRegex = new RegExp(messages_en.validMobileNumberRegex);
  const ageIgnoapsRegex = new RegExp(messages_en.ageIgnoapsRegex);
  const ageIgnwpsRegex = new RegExp(messages_en.ageIgnwpsRegex);
  const ageNfbsRegex = new RegExp(messages_en.ageNfbsRegex);
  const ageIgndpsRegex = new RegExp(messages_en.ageIgndpsRegex);

  

  String.prototype.verhoeffCheck = (function () {
    var d = [
      [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
      [1, 2, 3, 4, 0, 6, 7, 8, 9, 5],
      [2, 3, 4, 0, 1, 7, 8, 9, 5, 6],
      [3, 4, 0, 1, 2, 8, 9, 5, 6, 7],
      [4, 0, 1, 2, 3, 9, 5, 6, 7, 8],
      [5, 9, 8, 7, 6, 0, 4, 3, 2, 1],
      [6, 5, 9, 8, 7, 1, 0, 4, 3, 2],
      [7, 6, 5, 9, 8, 2, 1, 0, 4, 3],
      [8, 7, 6, 5, 9, 3, 2, 1, 0, 4],
      [9, 8, 7, 6, 5, 4, 3, 2, 1, 0]
    ];
    var p = [
      [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
      [1, 5, 7, 6, 2, 8, 3, 0, 9, 4],
      [5, 8, 0, 3, 7, 9, 6, 1, 4, 2],
      [8, 9, 1, 6, 0, 4, 3, 5, 2, 7],
      [9, 4, 5, 3, 1, 2, 6, 8, 7, 0],
      [4, 2, 8, 6, 5, 7, 3, 9, 0, 1],
      [2, 7, 9, 3, 8, 0, 6, 4, 1, 5],
      [7, 0, 4, 6, 9, 1, 3, 2, 5, 8]
    ];

    return function () {
      var c = 0;
      this.replace(/\D+/g, '')
        .split('')
        .reverse()
        .join('')
        .replace(/[\d]/g, function (u, i) {
          c = d[c][p[i & 7][parseInt(u, 10)]];
        });
      return c === 0;
    };
  })();

  const steps = getSteps();

  const isStepOptional = (step) => {
    return step === 1 || step === 2;
  };

  const isStepSkipped = (step) => {
    return skippedSteps.includes(step);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
  };

  const handleNext = async () => {
    setLoading(true);
    try {
      if (activeStep === 0) {
        if (beneficiaryAadharDetailsTO.changesMade) {
          if (validateForm(null, null, 0, activeStep)) {
            try {
              const response = await submitDataToServer();

              if (response && (response.status === 200 || response.status === 201)) {
                setAadharFormCompleted(true);
                if (activeStep < 4) {
                  setSnackbar({
                    open: true,
                    message: 'Modification successful!',
                    severity: 'success'
                  });

                  setActiveStep((prevStep) => prevStep + 1);
                  setSkippedSteps(skippedSteps.filter((skipItem) => skipItem !== activeStep));

                  setBeneficiaryAadharDetailsTO((prevAadharTO) => ({ ...prevAadharTO, changesMade: false }));
                }
              } else if (activeStep < 4) {
                setSnackbar({
                  open: true,
                  message: 'Modification failed. Please try again.',
                  severity: 'error'
                });
              }
            } catch (error) {
              console.error('Error submitting data:', error);
              setSnackbar({
                open: true,
                message: 'An unexpected error occurred. Please try again.',
                severity: 'error'
              });
            }
          }
        } else {
          setSnackbar({
            open: true,
            message: 'No changes made. Please make modifications before proceeding.',
            severity: 'warning'
          });
        }
      } else if (activeStep === 1) {
        if (validateForm(null, null, 0, activeStep)) {
          try {
            const response = await submitDataToServer();
            if (beneficiaryPersonalDetailsTO.changesMade || beneficiaryNfbsDetailsTO.changesMade || rtoken) {
              if (response && (response.status === 200 || response.status === 201)) {
                if (activeStep < 4) {
                  setSnackbar({
                    open: true,
                    message: 'Modification successful!',
                    severity: 'success'
                  });

                  setActiveStep((prevStep) => prevStep + 1);
                  setSkippedSteps(skippedSteps.filter((skipItem) => skipItem !== activeStep));

                  setBeneficiaryPersonalDetailsTO((prevPersonalTO) => ({ ...prevPersonalTO, changesMade: false }));
                  setBeneficiaryNfbsDetailsTO((prevNfbsTO) => ({ ...prevNfbsTO, changesMade: false }));
                }
              } else if (activeStep < 4) {
                setSnackbar({
                  open: true,
                  message: 'Modification failed. Please try again.',
                  severity: 'error'
                });
              }
            } else {
              setSnackbar({
                open: true,
                message: 'No changes made. Please make modifications before proceeding.',
                severity: 'warning'
              });
            }
          } catch (error) {
            console.error('Error submitting data:', error);
            setSnackbar({
              open: true,
              message: 'An unexpected error occurred. Please try again.',
              severity: 'error'
            });
          }
        }
      } else if (activeStep === 2) {
        if (beneficiaryBankDetailsTO.changesMade) {
          if (validateForm(null, null, 0, activeStep)) {
            try {
              const response = await submitDataToServer();
              if (response && (response.status === 200 || response.status === 201)) {
                setBankFormCompleted(true);
                if (activeStep < 4) {
                  setSnackbar({
                    open: true,
                    message: 'Modification successful!',
                    severity: 'success'
                  });

                  setActiveStep((prevStep) => prevStep + 1);
                  setSkippedSteps(skippedSteps.filter((skipItem) => skipItem !== activeStep));

                  setBeneficiaryBankDetailsTO((prevBankTO) => ({ ...prevBankTO, changesMade: false }));
                }
              } else if (activeStep < 4) {
                setSnackbar({
                  open: true,
                  message: 'Modification failed. Please try again.',
                  severity: 'error'
                });
              }
            } catch (error) {
              console.error('Error submitting data:', error);
              setSnackbar({
                open: true,
                message: 'An unexpected error occurred. Please try again.',
                severity: 'error'
              });
            }
          }
        } else {
          setSnackbar({
            open: true,
            message: 'No changes made. Please make modifications before proceeding.',
            severity: 'warning'
          });
        }
      } else if (activeStep === 3) {
        if (beneficiaryBPLDetailsTO.changesMade || beneficiaryNfbsDetailsTO.changesMade) {
          if (validateForm(null, null, 0, activeStep)) {
            try {
              console.log('error found2');
              const response = await submitDataToServer();

              if (response && (response.status === 200 || response.status === 201)) {
                setBplFormCompleted(true);
                if (activeStep < 4) {
                  setSnackbar({
                    open: true,
                    message: 'Modification successful!',
                    severity: 'success'
                  });

                  setBeneficiaryBPLDetailsTO((prevBplTO) => ({ ...prevBplTO, changesMade: false }));
                  setBeneficiaryNfbsDetailsTO((prevNfbsTO) => ({ ...prevNfbsTO, changesMade: false }));

                  if (bankFormCompleted && aadharFormCompleted) {
                    setActiveStep((prevStep) => prevStep + 1);
                    setSkippedSteps(skippedSteps.filter((skipItem) => skipItem !== activeStep));
                  } else {
                    setTimeout(() => {
                      setSnackbar((prevState) => ({
                        ...prevState,
                        open: false
                      }));
                      setSnackbar({
                        open: true,
                        message: 'Your form is incomplete. Please fill mandatory fields of all the sections',
                        severity: 'error'
                      });
                    }, 3000);
                  }
                }
              } else if (activeStep < 4) {
                setSnackbar({
                  open: true,
                  message: 'Modification failed. Please try again.',
                  severity: 'error'
                });
              }
            } catch (error) {
              console.error('Error submitting data:', error);
              setSnackbar({
                open: true,
                message: 'An unexpected error occurred. Please try again.',
                severity: 'error'
              });
            }
          }
        } else {
          setSnackbar({
            open: true,
            message: 'No changes made. Please make modifications before proceeding.',
            severity: 'warning'
          });
        }
      } else {
        await submitDataToServer();
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async () => {
    if (confirming) {
      return;
    }

    try {
      setConfirming(true);
      await submitDataToServer();
      handleDialogClose();
    } finally {
      setConfirming(false);
    }
  };

  let schemeCode;
  schemeCode = localStorage.getItem('schemeCode');

  const submitDataToServer = async () => {
    let response;
    let deceasedDetailsResponse;
    let tempApplicationNo;
    let tempStatus;

    try {
      if (activeStep === 0) {
        response = await axiosInstance.post(
          `/beneficiaryRegistration/insertAndUpdateDataOfPensionerUid/${beneficiaryAadharDetailsTO.applicationNo}`,
          beneficiaryAadharDetailsTO
        );
const rtoken = response.data.rtoken;

  localStorage.setItem("rtoken", rtoken);

        if (updateApplicantName === true ) {
          const requestData = {
            nameAsPerUid: response.data.nameAsPerUid,
            applicationNo: response.data.applicationNo,
            gender: response.data.gender,
            rtoken:rtoken
          };
          const postURL = '/beneficiaryRegistration/updateApplicantNameAsPerNameAsPerUid';
          const updateResponse = await axiosInstance.post(postURL, requestData);
          console.log(updateResponse);
        }
      } else if (activeStep === 1) {
         const rtoken = localStorage.getItem("rtoken");
          const payload = {
    ...beneficiaryPersonalDetailsTO,
    rtoken, 
  };
        response = await axiosInstance.post(
          `/beneficiaryRegistration/insertAndUpdateDataOfPensionerMaster/${beneficiaryPersonalDetailsTO.applicationNo}`,
         payload

        );
      response.data.rtoken = rtoken;
        const responseApplicantName = response.data.applicantName;
        localStorage.removeItem('responseApplicantName');
        localStorage.setItem('responseApplicantName', responseApplicantName);

        try {
          console.log('beneficiaryNfbsDetailsTO', beneficiaryNfbsDetailsTO);
          if (schemeCode === 'NFBS' && beneficiaryNfbsDetailsTO !== null) {
            deceasedDetailsResponse = await axiosInstance.post(
              `/beneficiaryRegistration/insertAndUpdateDataOfNfbsMaster/${beneficiaryNfbsDetailsTO.applicationNo}`,
              beneficiaryNfbsDetailsTO
            );
            console.log(deceasedDetailsResponse.data);
          }
        } catch (error) {
          setFormErrors({
            districtId1: error.response.data.districtId1,
            ruralUrbanArea1: error.response.data.ruralUrbanArea1,
            subDistrictMunicipalAreaId1: error.response.data.subDistrictMunicipalAreaId1,
            gramPanchayatWardId1: error.response.data.gramPanchayatWardId1,
            firstName1: error.response.data.firstName1,
            fatherHusbandName1: error.response.data.fatherHusbandName1,
            gender1: error.response.data.gender1,
            dateOfDeath: error.response.data.dateOfDeath,
            relationWithDeceased: error.response.data.relationWithDeceased
          });
          response.status = error.response.status;
        }
      } else if (activeStep === 2) {
        response = await axiosInstance.post(
          `/beneficiaryRegistration/insertAndUpdateDataOfPensionerBank/${beneficiaryBankDetailsTO.applicationNo}`,
          beneficiaryBankDetailsTO
        );
      } else if (activeStep === 3) {
        const getAgeFile = beneficiaryBPLDetailsTO.ageFile;
        const getIncomeFile = beneficiaryBPLDetailsTO.incomeFile;
        const getResidenceFile = beneficiaryBPLDetailsTO.residenceFile;
        const getDisabilityFile = beneficiaryBPLDetailsTO.disabilityFile;
        const getDeathFile = beneficiaryBPLDetailsTO.deathFile;
        const getBankFile = beneficiaryBPLDetailsTO.bankFile;
        const getBeneficiaryPhotoFile = beneficiaryBPLDetailsTO.beneficiaryPhotoFile;

        const data = new FormData();
        data.append('ageFile', getAgeFile);
        data.append('incomeFile', getIncomeFile);
        data.append('residenceFile', getResidenceFile);
        data.append('disabilityFile', getDisabilityFile);
        data.append('deathFile', getDeathFile);
        data.append('bankFile', getBankFile);
        data.append('beneficiaryPhotoFile', getBeneficiaryPhotoFile);
        data.append('beneficiaryBPLDetailsTO', new Blob([JSON.stringify(beneficiaryBPLDetailsTO)], { type: 'application/json' }));
        response = await axiosInstance.post(
          `/beneficiaryRegistration/insertAndUpdateDataOfPensionerOther/${beneficiaryBPLDetailsTO.applicationNo}`,
          data,
          {
            headers: {
              'Content-Type': 'multipart/form-data;image/*'
            }
          }
        );

        try {
          if (schemeCode === 'NFBS' && beneficiaryNfbsDetailsTO !== null) {
            const getAuthCertFile = beneficiaryNfbsDetailsTO.authCertFile;
            const data = new FormData();
            data.append('authCertFile', getAuthCertFile);
            data.append('beneficiaryNfbsDetailsTO', new Blob([JSON.stringify(beneficiaryNfbsDetailsTO)], { type: 'application/json' }));
            deceasedDetailsResponse = await axiosInstance.post(
              `/beneficiaryRegistration/insertAndUpdateBPLAndAddressDetailOfNfbsMaster/${beneficiaryNfbsDetailsTO.applicationNo}`,
              data,
              {
                headers: {
                  'Content-Type': 'multipart/form-data;image/*'
                }
              }
            );
            console.log(deceasedDetailsResponse.data);
          }
        } catch (error) {
          setFormErrors({
            addressNfbs1: error.response.data.addressNfbs1,
            addressNfbs2: error.response.data.addressNfbs2,
            pincodeNfbs: error.response.data.pincodeNfbs,
            bplYearNfbs: error.response.data.bplYearNfbs,
            bplLocationNfbs: error.response.data.bplLocationNfbs,
            bplFamilyIdNfbs: error.response.data.bplFamilyIdNfbs,
            bplMemberIdNfbs: error.response.data.bplMemberIdNfbs
          });
          response.status = error.response.status;
        }
      } else {
        const storedData = localStorage.getItem('applicationNo');

        if (storedData) {
          tempApplicationNo = JSON.parse(storedData);
        }
        tempStatus = beneficiaryPersonalDetailsTO.status;

        const postFormData = {
          tempApplicationNo,
          tempStatus
        };

        if (tempApplicationNo.includes('TEMP')) {
          const response = await axiosInstance.post(
            `/beneficiaryRegistration/insertTempToPensionerMaster/${tempApplicationNo}`,
            postFormData
          );
          const newApplicationNo = response.data;
          setDisplayedApplicationNo(newApplicationNo);
          setShowSuccessMessage(true);
        } else {
          setDisplayedApplicationNo(tempApplicationNo);
          setShowSuccessMessage(true);
        }
      }

      if (response && (response.status === 200 || response.status === 201)) {
        return response;
      } else {
        return null;
      }
    } catch (e) {
      if (activeStep === 1) {
        setFormErrors({
          firstName: e.response.data.firstName,
          fatherHusbandName: e.response.data.fatherHusbandName,
          dateOfBirth: e.response.data.gender,
          districtId: e.response.data.districtId,
          ruralUrbanArea: e.response.data.ruralUrbanArea,
          subDistrictMunicipalAreaId: e.response.data.subDistrictMunicipalAreaId,
          gramPanchayatWardId: e.response.data.gramPanchayatWardId,
          villageId: e.response.data.villageId,
          habitationId: e.response.data.habitationId,
          contactPersonMobile: e.response.data.contactPersonMobile,
          beneficiaryNo: e.response.data.beneficiaryNo,
          categoryId: e.response.data.categoryId,
          rtoken:rtoken
        });
      } else if (activeStep === 2) {
        setFormErrors({ bankPoAccountNo: e.response.data.bankPoAccountNo, ifscCode: e.response.data.ifscCode });
      } else if (activeStep === 0) {
        setFormErrors({
          consentDate: e.response.data.consentDate,
          nameAsPerUid: e.response.data.nameAsPerUid,
          rtoken: e.response.data.rtoken,
          gender: e.response.data.gender,
        });
      } else if (activeStep === 3) {
        setFormErrors({
          bplYear: e.response.data.bplYear,
          bplLocation: e.response.data.bplLocation,
          bplFamilyId: e.response.data.bplFamilyId,
          bplMemberId: e.response.data.bplMemberId,
          address1: e.response.data.address1,
          address2: e.response.data.address2,
          annualIncome: e.response.data.annualIncome,
          pincode: e.response.data.pincode,
          disabilityStatus: e.response.data.disabilityStatus
        });
      }

      console.error('Error submitting data:', e);
      return null;
    }
  };

  const handleSkip = () => {
    setBeneficiaryPersonalDetailsTO((prevPersonalTO) => ({ ...prevPersonalTO, changesMade: false }));
    setBeneficiaryBankDetailsTO((prevBankTO) => ({ ...prevBankTO, changesMade: false }));
    setBeneficiaryAadharDetailsTO((prevAadharTO) => ({ ...prevAadharTO, changesMade: false }));
    setBeneficiaryBPLDetailsTO((prevBplTO) => ({ ...prevBplTO, changesMade: false }));

    if (activeStep === 3) {
      if (bankFormCompleted && aadharFormCompleted && bplFormCompleted) {
        setActiveStep(activeStep + 1);
        setSkippedSteps([...skippedSteps, activeStep]);
      } else {
        setSnackbar({
          open: true,
          message: 'Your form is incomplete. Please fill mandatory fields of all the sections',
          severity: 'error'
        });
      }
    } else {
      setActiveStep(activeStep + 1);
      setSkippedSteps([...skippedSteps, activeStep]);
    }
  };

  const handlePrevious = () => {
    setBeneficiaryPersonalDetailsTO((prevPersonalTO) => ({ ...prevPersonalTO, changesMade: false }));
    setBeneficiaryBankDetailsTO((prevBankTO) => ({ ...prevBankTO, changesMade: false }));
    setBeneficiaryAadharDetailsTO((prevAadharTO) => ({ ...prevAadharTO, changesMade: false }));
    setBeneficiaryBPLDetailsTO((prevBplTO) => ({ ...prevBplTO, changesMade: false }));

    setActiveStep((prevStep) => prevStep - 1);
    setSkippedSteps(skippedSteps.filter((skipItem) => skipItem !== activeStep - 1));
    setShowSuccessMessage(false);
    setFormErrors({});
  };

  function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is zero-indexed, so we add 1
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  const validateForm = (field, value, type, activeStep) => {
    const errors = { ...formErrors };

    const storedData1 = localStorage.getItem('statusOfBeneficiary');
    let statusOfBeneficiary;
    if (storedData1) {
      statusOfBeneficiary = JSON.parse(storedData1);
    }
    if (type === 0 && activeStep === 0) {
      if (!beneficiaryAadharDetailsTO.consentDate) {
        errors.consentDate = messages_en.consentDateRequired;
      } else {
        delete errors.consentDate;
      }

    } else if (type === 0 && activeStep === 1) {
      // if (!beneficiaryPersonalDetailsTO.firstName) {
      //   errors.firstName = messages_en.firstNameRequired;
      // } else if (!alphabetAndSpacePattern.test(beneficiaryPersonalDetailsTO.firstName)) {
      //   errors.firstName = messages_en.firstNameAlphabetSpaceError;
      // } else {
      //   delete errors.firstName;
      // }

      // if (!beneficiaryPersonalDetailsTO.middleName) {
      //   delete errors.middleName;
      // }

      // if (!beneficiaryPersonalDetailsTO.lastName) {
      //   delete errors.lastName;
      // }

      if (!beneficiaryPersonalDetailsTO.fatherHusbandName) {
        errors.fatherHusbandName = messages_en.fatherHusbandNameRequired;
      } else if (!alphabetAndSpacePattern.test(beneficiaryPersonalDetailsTO.fatherHusbandName)) {
        errors.fatherHusbandName = messages_en.fatherHusbandNameAlphabetSpaceError;
      } else {
        delete errors.fatherHusbandName;
      }

      if (!beneficiaryPersonalDetailsTO.gender) {
        errors.gender = messages_en.genderRequired;
      } else {
        delete errors.gender;
      }

      if (!beneficiaryPersonalDetailsTO.beneficiaryNo) {
        errors.beneficiaryNo = messages_en.beneficiaryNoRequired;
      } else if (!alphabetNumberSpaceDashPattern.test(beneficiaryPersonalDetailsTO.beneficiaryNo)) {
        errors.beneficiaryNo = messages_en.beneficiaryNoError;
      } else {
        delete errors.beneficiaryNo;
      }

      if (!beneficiaryPersonalDetailsTO.categoryId) {
        errors.categoryId = messages_en.categoryRequired;
      } else {
        delete errors.categoryId;
      }

      if (!beneficiaryPersonalDetailsTO.districtId) {
        errors.districtId = messages_en.districtRequired;
      } else {
        delete errors.districtId;
      }

      if (!beneficiaryPersonalDetailsTO.ruralUrbanArea) {
        errors.ruralUrbanArea = messages_en.areaRequired;
      } else {
        delete errors.ruralUrbanArea;
      }

      if (!beneficiaryPersonalDetailsTO.subDistrictMunicipalAreaId) {
        errors.subDistrictMunicipalAreaId = messages_en.subDistrictRequired;
      } else {
        delete errors.subDistrictMunicipalAreaId;
      }

      if (!beneficiaryPersonalDetailsTO.gramPanchayatWardId) {
        errors.gramPanchayatWardId = messages_en.gramPanchayatRequired;
      } else {
        delete errors.gramPanchayatWardId;
      }
      if (beneficiaryPersonalDetailsTO.ruralUrbanArea === 'R') {
        if (!beneficiaryPersonalDetailsTO.villageId) {
          errors.villageId = messages_en.villageRequired;
        } else {
          delete errors.villageId;
        }

        if (!beneficiaryPersonalDetailsTO.habitationId) {
          errors.habitationId = messages_en.habitationRequired;
        } else {
          delete errors.habitationId;
        }
      } else {
        delete errors.villageId;
        delete errors.habitationId;
      }

      if (!beneficiaryPersonalDetailsTO.dateOfBirth) {
        errors.dateOfBirth = messages_en.dateOfBirthRequired;
      } else {
        delete errors.dateOfBirth;
      }

      if (schemeCode === 'IGNOAPS') {
        if (!beneficiaryPersonalDetailsTO.age) {
          errors.age = messages_en.ageRequired;
        } else if (!ageIgnoapsRegex.test(beneficiaryPersonalDetailsTO.age)) {
          errors.age = messages_en.ageIgnoapsValidationError;
        } else {
          delete errors.age;
        }
      } else if (schemeCode === 'IGNWPS') {
        if (!beneficiaryPersonalDetailsTO.age) {
          errors.age = messages_en.ageRequired;
        } else if (!ageIgnwpsRegex.test(beneficiaryPersonalDetailsTO.age)) {
          errors.age = messages_en.ageIgnwpsValidationError;
        } else {
          delete errors.age;
        }
      } else if (schemeCode === 'NFBS') {
        if (!beneficiaryPersonalDetailsTO.age) {
          errors.age = messages_en.ageRequired;
        } else if (!ageNfbsRegex.test(beneficiaryPersonalDetailsTO.age)) {
          errors.age = messages_en.ageNfbsValidationError;
        } else {
          delete errors.age;
        }
      } else if (schemeCode === 'IGNDPS') {
        if (!beneficiaryPersonalDetailsTO.age) {
          errors.age = messages_en.ageRequired;
        } else if (!ageIgndpsRegex.test(beneficiaryPersonalDetailsTO.age)) {
          errors.age = messages_en.ageIgndpsValidationError;
        } else {
          delete errors.age;
        }
      }

      if (schemeCode === 'NFBS') {
        if (!beneficiaryNfbsDetailsTO.firstName1) {
          errors.firstName1 = messages_en.firstNameRequired;
        } else if (!alphabetAndSpacePattern.test(beneficiaryNfbsDetailsTO.firstName1)) {
          errors.firstName1 = messages_en.firstNameAlphabetSpaceError;
        } else {
          delete errors.firstName1;
        }

        if (!beneficiaryNfbsDetailsTO.middleName1) {
          delete errors.middleName1;
        }

        if (!beneficiaryNfbsDetailsTO.lastName1) {
          delete errors.lastName1;
        }

        if (!beneficiaryNfbsDetailsTO.fatherHusbandName1) {
          errors.fatherHusbandName1 = messages_en.fatherHusbandNameRequired;
        } else if (!alphabetAndSpacePattern.test(beneficiaryNfbsDetailsTO.fatherHusbandName1)) {
          errors.fatherHusbandName1 = messages_en.fatherHusbandNameAlphabetSpaceError;
        } else {
          delete errors.fatherHusbandName1;
        }

        if (!beneficiaryNfbsDetailsTO.gender1) {
          errors.gender1 = messages_en.genderRequired;
        } else {
          delete errors.gender1;
        }

        if (!beneficiaryNfbsDetailsTO.districtId1) {
          errors.districtId1 = messages_en.districtRequired;
        } else {
          delete errors.districtId1;
        }

        if (!beneficiaryNfbsDetailsTO.ruralUrbanArea1) {
          errors.ruralUrbanArea1 = messages_en.areaRequired;
        } else {
          delete errors.ruralUrbanArea1;
        }

        if (!beneficiaryNfbsDetailsTO.subDistrictMunicipalAreaId1) {
          errors.subDistrictMunicipalAreaId1 = messages_en.subDistrictRequired;
        } else {
          delete errors.subDistrictMunicipalAreaId1;
        }

        if (!beneficiaryNfbsDetailsTO.gramPanchayatWardId1) {
          errors.gramPanchayatWardId1 = messages_en.gramPanchayatRequired;
        } else {
          delete errors.gramPanchayatWardId1;
        }

        if (!beneficiaryNfbsDetailsTO.dateOfDeath) {
          errors.dateOfDeath = messages_en.dateOfDeathRequired;
        } else {
          delete errors.dateOfDeath;
        }

        if (!beneficiaryNfbsDetailsTO.relationWithDeceased) {
          errors.relationWithDeceased = messages_en.relationWithDecesaedRequired;
        } else if (!alphabetAndSpacePattern.test(beneficiaryNfbsDetailsTO.relationWithDeceased)) {
          errors.relationWithDeceased = messages_en.firstNameAlphabetSpaceError;
        } else {
          delete errors.relationWithDeceased;
        }
      }
    } else if (type === 0 && activeStep === 2) {
      if (!beneficiaryBankDetailsTO.disbursementCode) {
        errors.disbursementCode = messages_en.disbursementRequired;
      } else {
        delete errors.disbursementCode;
      }
      console.log('disbursementCode:', beneficiaryBankDetailsTO.disbursementCode);

      if (!beneficiaryBankDetailsTO.bankPoAccountNo && beneficiaryBankDetailsTO.disbursementCode !== '4') {
        errors.bankPoAccountNo = messages_en.bankPoAccountNoRequired;
      } else if (!accountNumberPattern.test(beneficiaryBankDetailsTO.bankPoAccountNo) && beneficiaryBankDetailsTO.bankPoAccountNo) {
        errors.bankPoAccountNo = messages_en.bankPoAccountNoValidationError;
      } else if (accountNumberAvailability !== '') {
        errors.bankPoAccountNo = '';
      } else {
        delete errors.bankPoAccountNo;
      }

      if (!beneficiaryBankDetailsTO.ifscCode && beneficiaryBankDetailsTO.disbursementCode !== '4') {
        errors.ifscCode = messages_en.ifscCodeRequired;
      } else if (!isValid && beneficiaryBankDetailsTO.disbursementCode !== '4') {
        errors.ifscCode = messages_en.invalidIFSCError;
      } else {
        delete errors.ifscCode;
      }
    } else if (type === 0 && activeStep === 3) {
      if (!beneficiaryBPLDetailsTO.bplYear) {
        errors.bplYear = messages_en.bplYearRequired;
      } else {
        delete errors.bplYear;
      }

      if (!beneficiaryBPLDetailsTO.bplLocation) {
        errors.bplLocation = messages_en.bpllocationRequired;
      } else if (!alphabetAndSpacePattern.test(beneficiaryBPLDetailsTO.bplLocation)) {
        errors.bplLocation = messages_en.bplLocationNoValidationError;
      } else {
        delete errors.bplLocation;
      }
      if (!beneficiaryBPLDetailsTO.bplFamilyId) {
        errors.bplFamilyId = messages_en.bplFamilyIdRequired;
      } else if (!alphabetNumberSpaceDashPattern.test(beneficiaryBPLDetailsTO.bplFamilyId)) {
        errors.bplFamilyId = messages_en.bplFamilyIdValidationError;
      } else {
        delete errors.bplFamilyId;
      }
      if (!beneficiaryBPLDetailsTO.bplMemberId) {
        errors.bplMemberId = messages_en.bplMemberIdRequired;
      } else if (!numberLimitRegex.test(beneficiaryBPLDetailsTO.bplMemberId)) {
        errors.bplMemberId = messages_en.bplMemberIdValidationError;
      } else {
        delete errors.bplMemberId;
      }

      if (!beneficiaryBPLDetailsTO.address1) {
        errors.address1 = messages_en.addressRequired;
      } else if (!alphanumericPattern.test(beneficiaryBPLDetailsTO.address1)) {
        errors.address1 = messages_en.address1ValidationError;
      } else {
        delete errors.address1;
      }

      if (!beneficiaryBPLDetailsTO.address2) {
        errors.address2 = messages_en.addressRequired;
      } else if (!alphanumericPattern.test(beneficiaryBPLDetailsTO.address2)) {
        errors.address2 = messages_en.address1ValidationError;
      } else {
        delete errors.address2;
      }

      if (!beneficiaryBPLDetailsTO.address3) {
        delete errors.address3;
      }

      if (!beneficiaryBPLDetailsTO.pincode) {
        errors.pincode = messages_en.pincodeRequired;
      } else if (!pincodeRegex.test(beneficiaryBPLDetailsTO.pincode)) {
        errors.pincode = messages_en.pincodeValidationError;
      } else {
        delete errors.pincode;
      }
      if (!beneficiaryBPLDetailsTO.epicNo) {
        delete errors.epicNo;
      }
      if (!beneficiaryBPLDetailsTO.rationcardNo) {
        delete errors.rationcardNo;
      }
      if (!beneficiaryBPLDetailsTO.annualIncome) {
        errors.annualIncome = messages_en.annualIncomeRequired;
      } else if (!numberLimitRegex.test(beneficiaryBPLDetailsTO.annualIncome)) {
        errors.annualIncome = messages_en.annualIncomeValidationError;
      } else {
        delete errors.annualIncome;
      }

      if (!beneficiaryBPLDetailsTO.disabilityStatus) {
        errors.disabilityStatus = messages_en.disabilityStatusRequired;
      } else {
        delete errors.disabilityStatus;
      }

      if (beneficiaryBPLDetailsTO.disabilityStatus === 'Y') {
        if (!beneficiaryBPLDetailsTO.disabilityCode) {
          errors.disabilityCode = messages_en.disabilityCodeRequired;
        } else {
          delete errors.disabilityCode;
        }

        if (!beneficiaryBPLDetailsTO.disabilityPercent) {
          errors.disabilityPercent = messages_en.disabilityPercentRequired;
        } else {
          delete errors.disabilityPercent;
        }
      }

      if (schemeCode === 'IGNWPS') {
        if (!beneficiaryBPLDetailsTO.widows) {
          errors.widows = messages_en.widowStatusRequired;
        } else {
          delete errors.widows;
        }
      }

      if (statusOfBeneficiary === 'LEGACY_SO_SAVED') {
        if (!beneficiaryBPLDetailsTO.sanctionAuth) {
          errors.sanctionAuth = messages_en.sanctionAuthRequired;
        } else if (!alphabetAndSpacePattern.test(beneficiaryBPLDetailsTO.sanctionAuth)) {
          errors.sanctionAuth = messages_en.sanctionAuthValidationError;
        } else {
          delete errors.sanctionAuth;
        }

        const sanctionDate = new Date(beneficiaryBPLDetailsTO.sanctionDate.$d);
        const pensionFromDate = new Date(beneficiaryBPLDetailsTO.pensionEffectiveFromDate.$d);
        const applicationDate = new Date(beneficiaryBPLDetailsTO.applicationDate.$d);

        const formattedSanctionDate = formatDate(sanctionDate);
        const formattedPensionFromDate = formatDate(pensionFromDate);
        const formattedApplicationDate = formatDate(applicationDate);

        if (!beneficiaryBPLDetailsTO.sanctionDate) {
          errors.sanctionDate = messages_en.sanctionDateRequired;
        } else if (formattedSanctionDate < formattedApplicationDate) {
          errors.sanctionDate = messages_en.comBtwSancAndAppRequired;
        } else {
          delete errors.sanctionDate;
        }

        if (formattedPensionFromDate < formattedApplicationDate) {
          errors.pensionEffectiveFromDate = messages_en.comBtwPenAndAppRequired;
        } else {
          delete errors.pensionEffectiveFromDate;
        }
      }

      if (schemeCode === 'NFBS') {
        if (!beneficiaryNfbsDetailsTO.addressNfbs1) {
          errors.addressNfbs1 = messages_en.addressRequired;
        } else if (!alphanumericPattern.test(beneficiaryNfbsDetailsTO.addressNfbs1)) {
          errors.addressNfbs1 = messages_en.address1ValidationError;
        } else {
          delete errors.addressNfbs1;
        }

        if (!beneficiaryNfbsDetailsTO.addressNfbs2) {
          errors.addressNfbs2 = messages_en.addressRequired;
        } else if (!alphanumericPattern.test(beneficiaryNfbsDetailsTO.addressNfbs2)) {
          errors.addressNfbs2 = messages_en.address1ValidationError;
        } else {
          delete errors.addressNfbs2;
        }

        if (!beneficiaryNfbsDetailsTO.addressNfbs3) {
          delete errors.addressNfbs3;
        }

        if (!beneficiaryNfbsDetailsTO.pincodeNfbs) {
          errors.pincodeNfbs = messages_en.pincodeRequired;
        } else if (!pincodeRegex.test(beneficiaryNfbsDetailsTO.pincodeNfbs)) {
          errors.pincodeNfbs = messages_en.pincodeValidationError;
        } else {
          delete errors.pincodeNfbs;
        }

        if (!beneficiaryNfbsDetailsTO.bplYearNfbs) {
          errors.bplYearNfbs = messages_en.bplYearRequired;
        } else {
          delete errors.bplYearNfbs;
        }

        if (!beneficiaryNfbsDetailsTO.bplLocationNfbs) {
          errors.bplLocationNfbs = messages_en.bpllocationRequired;
        } else if (!alphabetAndSpacePattern.test(beneficiaryNfbsDetailsTO.bplLocationNfbs)) {
          errors.bplLocationNfbs = messages_en.bplLocationNoValidationError;
        } else {
          delete errors.bplLocationNfbs;
        }
        if (!beneficiaryNfbsDetailsTO.bplFamilyIdNfbs) {
          errors.bplFamilyIdNfbs = messages_en.bplFamilyIdRequired;
        } else if (!alphabetNumberSpaceDashPattern.test(beneficiaryNfbsDetailsTO.bplFamilyIdNfbs)) {
          errors.bplFamilyIdNfbs = messages_en.bplFamilyIdValidationError;
        } else {
          delete errors.bplFamilyIdNfbs;
        }
        if (!beneficiaryNfbsDetailsTO.bplMemberIdNfbs) {
          errors.bplMemberIdNfbs = messages_en.bplMemberIdRequired;
        } else if (!numberLimitRegex.test(beneficiaryNfbsDetailsTO.bplMemberIdNfbs)) {
          errors.bplMemberIdNfbs = messages_en.bplMemberIdValidationError;
        } else {
          delete errors.bplMemberIdNfbs;
        }

        if (!beneficiaryNfbsDetailsTO.isAuthorizeCert) {
          errors.isAuthorizeCert = messages_en.authCertStatusRequired;
        } else {
          delete errors.isAuthorizeCert;
        }

        if (beneficiaryNfbsDetailsTO.isAuthorizeCert === 'Y') {
          if (!beneficiaryNfbsDetailsTO.authorizeCertIssueAuth) {
            errors.authorizeCertIssueAuth = messages_en.authorizeCertIssueAuthRequired;
          } else if (!alphabetAndSpacePattern.test(beneficiaryNfbsDetailsTO.authorizeCertIssueAuth)) {
            errors.authorizeCertIssueAuth = messages_en.authorizeCertIssueAuthValidationError;
          } else {
            delete errors.authorizeCertIssueAuth;
          }

          if (!beneficiaryNfbsDetailsTO.authorizeCertIssueDate) {
            errors.authorizeCertIssueDate = messages_en.authorizeCertIssueDateRequired;
          } else {
            delete errors.authorizeCertIssueDate;
          }

          if (!beneficiaryNfbsDetailsTO.authCertFile) {
            errors.authCertFile = messages_en.authCertFileRequired;
          } else {
            delete errors.authCertFile;
          }
        }
      }

      if (beneficiaryBPLDetailsTO.ageCertIssueDate) {
        if (!beneficiaryBPLDetailsTO.ageCertIssueAuth) {
          errors.ageCertIssueAuth = messages_en.ageCertIssueAuthRequired;
        } else if (!alphabetAndSpacePattern.test(beneficiaryBPLDetailsTO.ageCertIssueAuth)) {
          errors.ageCertIssueAuth = messages_en.ageCertIssueAuthValidationError;
        } else {
          delete errors.ageCertIssueAuth;
        }

        if (!beneficiaryBPLDetailsTO.ageFile) {
          errors.ageFile = messages_en.ageFileRequired;
        } else {
          delete errors.ageFile;
        }
      } else if (beneficiaryBPLDetailsTO.ageCertIssueAuth) {
        if (!beneficiaryBPLDetailsTO.ageCertIssueDate) {
          errors.ageCertIssueDate = messages_en.ageCertIssueDateRequired;
        } else {
          delete errors.ageCertIssueDate;
        }

        if (!beneficiaryBPLDetailsTO.ageFile) {
          errors.ageFile = messages_en.ageFileRequired;
        } else {
          delete errors.ageFile;
        }
      } else if (beneficiaryBPLDetailsTO.ageFile) {
        if (!beneficiaryBPLDetailsTO.ageCertIssueDate) {
          errors.ageCertIssueDate = messages_en.ageCertIssueDateRequired;
        } else {
          delete errors.ageCertIssueDate;
        }
        if (!beneficiaryBPLDetailsTO.ageCertIssueAuth) {
          errors.ageCertIssueAuth = messages_en.ageCertIssueAuthRequired;
        } else if (!alphabetAndSpacePattern.test(beneficiaryBPLDetailsTO.ageCertIssueAuth)) {
          errors.ageCertIssueAuth = messages_en.ageCertIssueAuthValidationError;
        } else {
          delete errors.ageCertIssueAuth;
        }
      } else {
        delete errors.ageCertIssueDate;
        delete errors.ageCertIssueAuth;
        delete errors.ageFile;
      }

      if (beneficiaryBPLDetailsTO.incCertIssueDate) {
        if (!beneficiaryBPLDetailsTO.incCertIssueAuth) {
          errors.incCertIssueAuth = messages_en.incCertIssueAuthRequired;
        } else if (!alphabetAndSpacePattern.test(beneficiaryBPLDetailsTO.incCertIssueAuth)) {
          errors.incCertIssueAuth = messages_en.incCertIssueAuthValidationError;
        } else {
          delete errors.incCertIssueAuth;
        }

        if (!beneficiaryBPLDetailsTO.incomeFile) {
          errors.incomeFile = messages_en.incomeFileRequired;
        } else {
          delete errors.incomeFile;
        }
      } else if (beneficiaryBPLDetailsTO.incCertIssueAuth) {
        if (!beneficiaryBPLDetailsTO.incCertIssueDate) {
          errors.incCertIssueDate = messages_en.incCertIssueDateRequired;
        } else {
          delete errors.incCertIssueDate;
        }

        if (!beneficiaryBPLDetailsTO.incomeFile) {
          errors.incomeFile = messages_en.incomeFileRequired;
        } else {
          delete errors.incomeFile;
        }
      } else if (beneficiaryBPLDetailsTO.incomeFile) {
        if (!beneficiaryBPLDetailsTO.incCertIssueDate) {
          errors.incCertIssueDate = messages_en.incCertIssueDateRequired;
        } else {
          delete errors.incCertIssueDate;
        }
        if (!beneficiaryBPLDetailsTO.incCertIssueAuth) {
          errors.incCertIssueAuth = messages_en.incCertIssueAuthRequired;
        } else if (!alphabetAndSpacePattern.test(beneficiaryBPLDetailsTO.incCertIssueAuth)) {
          errors.incCertIssueAuth = messages_en.incCertIssueAuthValidationError;
        } else {
          delete errors.incCertIssueAuth;
        }
      } else {
        delete errors.incCertIssueDate;
        delete errors.incCertIssueAuth;
        delete errors.incomeFile;
      }

      if (beneficiaryBPLDetailsTO.resCertIssueDate) {
        if (!beneficiaryBPLDetailsTO.resCertIssueAuth) {
          errors.resCertIssueAuth = messages_en.resCertIssueAuthRequired;
        } else if (!alphabetAndSpacePattern.test(beneficiaryBPLDetailsTO.resCertIssueAuth)) {
          errors.resCertIssueAuth = messages_en.resCertIssueAuthValidationError;
        } else {
          delete errors.resCertIssueAuth;
        }

        if (!beneficiaryBPLDetailsTO.residenceFile) {
          errors.residenceFile = messages_en.resFileRequired;
        } else {
          delete errors.residenceFile;
        }
      } else if (beneficiaryBPLDetailsTO.resCertIssueAuth) {
        if (!beneficiaryBPLDetailsTO.resCertIssueDate) {
          errors.resCertIssueDate = messages_en.resCertIssueDateRequired;
        } else {
          delete errors.resCertIssueDate;
        }

        if (!beneficiaryBPLDetailsTO.residenceFile) {
          errors.residenceFile = messages_en.resFileRequired;
        } else {
          delete errors.residenceFile;
        }
      } else if (beneficiaryBPLDetailsTO.residenceFile) {
        if (!beneficiaryBPLDetailsTO.resCertIssueDate) {
          errors.resCertIssueDate = messages_en.resCertIssueDateRequired;
        } else {
          delete errors.resCertIssueDate;
        }
        if (!beneficiaryBPLDetailsTO.resCertIssueAuth) {
          errors.resCertIssueAuth = messages_en.resCertIssueAuthRequired;
        } else if (!alphabetAndSpacePattern.test(beneficiaryBPLDetailsTO.resCertIssueAuth)) {
          errors.resCertIssueAuth = messages_en.resCertIssueAuthValidationError;
        } else {
          delete errors.resCertIssueAuth;
        }
      } else {
        delete errors.resCertIssueDate;
        delete errors.resCertIssueAuth;
        delete errors.residenceFile;
      }

      if (beneficiaryBPLDetailsTO.disCertIssueDate) {
        if (!beneficiaryBPLDetailsTO.disCertIssueAuth) {
          errors.disCertIssueAuth = messages_en.disCertIssueAuthRequired;
        } else if (!alphabetAndSpacePattern.test(beneficiaryBPLDetailsTO.disCertIssueAuth)) {
          errors.disCertIssueAuth = messages_en.disCertIssueAuthValidationError;
        } else {
          delete errors.disCertIssueAuth;
        }

        if (!beneficiaryBPLDetailsTO.disabilityFile) {
          errors.disabilityFile = messages_en.disabilityFileRequired;
        } else {
          delete errors.disabilityFile;
        }
      } else if (beneficiaryBPLDetailsTO.disCertIssueAuth) {
        if (!beneficiaryBPLDetailsTO.disCertIssueDate) {
          errors.disCertIssueDate = messages_en.disCertIssueDateRequired;
        } else {
          delete errors.disCertIssueDate;
        }

        if (!beneficiaryBPLDetailsTO.disabilityFile) {
          errors.disabilityFile = messages_en.disabilityFileRequired;
        } else {
          delete errors.disabilityFile;
        }
      } else if (beneficiaryBPLDetailsTO.disabilityFile) {
        if (!beneficiaryBPLDetailsTO.disCertIssueDate) {
          errors.disCertIssueDate = messages_en.disCertIssueDateRequired;
        } else {
          delete errors.disCertIssueDate;
        }
        if (!beneficiaryBPLDetailsTO.disCertIssueAuth) {
          errors.disCertIssueAuth = messages_en.disCertIssueAuthRequired;
        } else if (!alphabetAndSpacePattern.test(beneficiaryBPLDetailsTO.disCertIssueAuth)) {
          errors.disCertIssueAuth = messages_en.disCertIssueAuthValidationError;
        } else {
          delete errors.disCertIssueAuth;
        }
      } else {
        delete errors.disCertIssueDate;
        delete errors.disCertIssueAuth;
        delete errors.disabilityFile;
      }

      if (beneficiaryBPLDetailsTO.deathCertIssueDate) {
        if (!beneficiaryBPLDetailsTO.deathCertIssueAuth) {
          errors.deathCertIssueAuth = messages_en.deathCertIssueAuthRequired;
        } else if (!alphabetAndSpacePattern.test(beneficiaryBPLDetailsTO.deathCertIssueAuth)) {
          errors.deathCertIssueAuth = messages_en.deathCertIssueAuthValidationError;
        } else {
          delete errors.deathCertIssueAuth;
        }

        if (!beneficiaryBPLDetailsTO.deathFile) {
          errors.deathFile = messages_en.deathFileRequired;
        } else {
          delete errors.deathFile;
        }
      } else if (beneficiaryBPLDetailsTO.deathCertIssueAuth) {
        if (!beneficiaryBPLDetailsTO.deathCertIssueDate) {
          errors.deathCertIssueDate = messages_en.deathCertIssueDateRequired;
        } else {
          delete errors.deathCertIssueDate;
        }

        if (!beneficiaryBPLDetailsTO.deathFile) {
          errors.deathFile = messages_en.deathFileRequired;
        } else {
          delete errors.deathFile;
        }
      } else if (beneficiaryBPLDetailsTO.deathFile) {
        if (!beneficiaryBPLDetailsTO.deathCertIssueDate) {
          errors.deathCertIssueDate = messages_en.deathCertIssueDateRequired;
        } else {
          delete errors.deathCertIssueDate;
        }
        if (!beneficiaryBPLDetailsTO.deathCertIssueAuth) {
          errors.deathCertIssueAuth = messages_en.deathCertIssueAuthRequired;
        } else if (!alphabetAndSpacePattern.test(beneficiaryBPLDetailsTO.deathCertIssueAuth)) {
          errors.deathCertIssueAuth = messages_en.deathCertIssueAuthValidationError;
        } else {
          delete errors.deathCertIssueAuth;
        }
      } else {
        delete errors.deathCertIssueDate;
        delete errors.deathCertIssueAuth;
        delete errors.deathFile;
      }

      if (beneficiaryBPLDetailsTO.bankCertIssueDate) {
        if (!beneficiaryBPLDetailsTO.bankCertIssueAuth) {
          errors.bankCertIssueAuth = messages_en.bankCertIssueAuthRequired;
        } else if (!alphabetAndSpacePattern.test(beneficiaryBPLDetailsTO.bankCertIssueAuth)) {
          errors.bankCertIssueAuth = messages_en.bankCertIssueAuthValidationError;
        } else {
          delete errors.bankCertIssueAuth;
        }

        if (!beneficiaryBPLDetailsTO.bankFile) {
          errors.bankFile = messages_en.bankFileRequired;
        } else {
          delete errors.bankFile;
        }
      } else if (beneficiaryBPLDetailsTO.bankCertIssueAuth) {
        if (!beneficiaryBPLDetailsTO.bankCertIssueDate) {
          errors.bankCertIssueDate = messages_en.bankCertIssueDateRequired;
        } else {
          delete errors.banklCertIssueDate;
        }

        if (!beneficiaryBPLDetailsTO.bankFile) {
          errors.bankFile = messages_en.bankFileRequired;
        } else {
          delete errors.bankFile;
        }
      } else if (beneficiaryBPLDetailsTO.bankFile) {
        if (!beneficiaryBPLDetailsTO.bankCertIssueDate) {
          errors.bankCertIssueDate = messages_en.bankCertIssueDateRequired;
        } else {
          delete errors.bankCertIssueDate;
        }
        if (!beneficiaryBPLDetailsTO.bankCertIssueAuth) {
          errors.bankCertIssueAuth = messages_en.bankCertIssueAuthRequired;
        } else if (!alphabetAndSpacePattern.test(beneficiaryBPLDetailsTO.bankCertIssueAuth)) {
          errors.bankCertIssueAuth = messages_en.bankCertIssueAuthValidationError;
        } else {
          delete errors.bankCertIssueAuth;
        }
      } else {
        delete errors.bankCertIssueDate;
        delete errors.bankCertIssueAuth;
        delete errors.bankFile;
      }
    } else if (type === 1 && activeStep === 0) {
      if (field === 'firstName') {
        if (!value) {
          errors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
        } else if (!alphabetAndSpacePattern.test(value)) {
          errors.firstName = `${field.charAt(0).toUpperCase() + field.slice(1)} should contain only alphabet and spaces`;
        } else {
          delete errors[field];
        }
      }

      if (field === 'middleName') {
        if (!alphabetAndSpacePattern.test(value)) {
          errors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} should contain only alphabet and spaces`;
        } else {
          delete errors[field];
        }
      }

      if (field === 'lastName') {
        if (!alphabetAndSpacePattern.test(value)) {
          errors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} should contain only alphabet and spaces`;
        } else {
          delete errors[field];
        }
      }

      if (field === 'fatherHusbandName') {
        if (!value) {
          errors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
        } else if (!alphabetAndSpacePattern.test(value)) {
          errors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} should contain only alphabet and spaces`;
        } else {
          delete errors[field];
        }
      }
      if (field === 'contactPersonMobile') {
        if (!validNumberRegex.test(value)) {
          errors[field] = 'Please enter a valid 10-digit mobile number starting with a digit between 6 and 9.';
        } else {
          delete errors[field];
        }
      }
      if (field === 'gender') {
        delete errors[field];
      }

      if (field === 'beneficiaryNo') {
        if (!value) {
          errors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
        } else if (!alphabetNumberSpaceDashPattern.test(value)) {
          errors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} should contain only alphabet and numbers`;
        } else {
          delete errors[field];
        }
      }

      if (field === 'categoryId') {
        delete errors[field];
      }

      if (field === 'dateOfBirth' || field === 'age') {
        delete errors['dateOfBirth']; // Clear the error if the field is either 'dateOfBirth' or 'age'
      }

      if (field === 'dateOfDeath') {
        delete errors[field];
      }

      if (schemeCode === 'IGNOAPS') {
        if (field === 'age') {
          if (!value) {
            errors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
          } else if (!ageIgnoapsRegex.test(value)) {
            errors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} is not according to IGNOAPS scheme`;
          } else {
            delete errors[field];
          }
        }
        if (field === 'dateOfBirth') {
          delete errors['age'];
        }
      } else if (schemeCode === 'IGNWPS') {
        if (field === 'age') {
          if (!value) {
            errors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
          } else if (!ageIgnwpsRegex.test(value)) {
            errors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} is not according to IGNWPS scheme`;
          } else {
            delete errors[field];
          }
        }
        if (field === 'dateOfBirth') {
          delete errors['age'];
        }
      } else if (schemeCode === 'NFBS') {
        if (field === 'age') {
          if (!value) {
            errors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
          } else if (!ageNfbsRegex.test(value)) {
            errors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} is not according to NFBS scheme`;
          } else {
            delete errors[field];
          }
        }
        if (field === 'dateOfBirth') {
          delete errors['age'];
        }
      } else if (schemeCode === 'IGNDPS') {
        if (field === 'age') {
          if (!value) {
            errors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
          } else if (!ageIgndpsRegex.test(value)) {
            errors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} is not according to IGNDPS scheme`;
          } else {
            delete errors[field];
          }
        }
        if (field === 'dateOfBirth') {
          delete errors['age'];
        }
      }

      if (schemeCode === 'NFBS') {
        if (field === 'firstName1') {
          if (!value) {
            errors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
          } else if (!alphabetAndSpacePattern.test(value)) {
            errors.firstName = `${field.charAt(0).toUpperCase() + field.slice(1)} should contain only alphabet and spaces`;
          } else {
            delete errors[field];
          }
        }

        if (field === 'middleName1') {
          if (!value) {
            errors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
          } else if (!alphabetAndSpacePattern.test(value)) {
            errors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} should contain only alphabet and spaces`;
          } else {
            delete errors[field];
          }
        }

        if (field === 'lastName1') {
          if (!value) {
            errors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
          } else if (!alphabetAndSpacePattern.test(value)) {
            errors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} should contain only alphabet and spaces`;
          } else {
            delete errors[field];
          }
        }

        if (field === 'fatherHusbandName1') {
          if (!value) {
            errors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
          } else if (!alphabetAndSpacePattern.test(value)) {
            errors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} should contain only alphabet and spaces`;
          } else {
            delete errors[field];
          }
        }

        if (field === 'gender1') {
          delete errors[field];
        }

        if (field === 'relationWithDeceased') {
          if (!value) {
            errors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
          } else if (!alphabetAndSpacePattern.test(value)) {
            errors.relationWithDeceased = `${field.charAt(0).toUpperCase() + field.slice(1)} should contain only alphabet and spaces`;
          } else {
            delete errors[field];
          }
        }
      }
    } else if (type === 1 && activeStep === 1) {
      if (field === 'disbursementCode') {
        delete errors[field];
      }
      if (field === 'bankPoAccountNo') {
        if (!value) {
          errors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
        } else if (!accountNumberPattern.test(value)) {
          errors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} should be between 9 to 20 digit number`;
        } else if (accountNumberAvailability !== '') {
          errors[field] = '';
        } else {
          delete errors[field];
        }
      }

      if (field === 'ifscCode') {
        delete errors[field];
      }
    } else if (type === 1 && activeStep === 2) {
      if (field === 'consentDate') {
        delete errors[field];
      }
      if (field === 'nameAsPerUid') {
        if (!alphabetAndSpacePattern.test(value)) {
          errors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} should contain only alphabet and spaces`;
        } else {
          delete errors[field];
        }
      }
   
    } else if (type === 1 && activeStep === 3) {
      if (field === 'bplYear') {
        delete errors[field];
      }
      if (field === 'bplLocation') {
        if (!value) {
          errors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
        } else if (!alphabetAndSpacePattern.test(value)) {
          errors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} should contain only alphabet and spaces`;
        } else {
          delete errors[field];
        }
      }
      if (field === 'bplFamilyId') {
        if (!value) {
          errors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
        } else if (!alphabetNumberSpaceDashPattern.test(value)) {
          errors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} should contain only alphabet and numbers`;
        } else {
          delete errors[field];
        }
      }
      if (field === 'bplMemberId') {
        if (!value) {
          errors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
        } else if (!numberLimitRegex.test(value)) {
          errors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} should contain only numbers`;
        } else {
          delete errors[field];
        }
      }
      if (field === 'address1') {
        if (!value) {
          errors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
        } else if (!alphanumericPattern.test(value)) {
          errors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} should contain AlphaNumeric Characters`;
        } else {
          delete errors[field];
        }
      }
      if (field === 'address2') {
        if (!value) {
          errors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
        } else if (!alphanumericPattern.test(value)) {
          errors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} should contain AlphaNumeric Characters`;
        } else {
          delete errors[field];
        }
      }
      if (field === 'address3') {
        if (!value) {
          errors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
        } else if (!alphanumericPattern.test(value)) {
          errors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} should contain AlphaNumeric Characters`;
        } else {
          delete errors[field];
        }
      }

      if (field === 'pincode') {
        if (!value) {
          errors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
        } else if (!pincodeRegex.test(value)) {
          errors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} should be of 6 digit number `;
        } else {
          delete errors[field];
        }
      }

      if (field === 'epicNo') {
        if (!value) {
          errors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
        } else if (!alphanumericPattern.test(value)) {
          errors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} should be alphanumeric `;
        } else {
          delete errors[field];
        }
      }
      if (field === 'rationcardNo') {
        if (!value) {
          errors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
        } else if (!alphanumericPattern.test(value)) {
          errors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} should be alphanumeric `;
        } else {
          delete errors[field];
        }
      }
      if (field === 'annualIncome') {
        if (!value) {
          errors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
        } else if (!numberLimitRegex.test(value)) {
          errors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} should contain numbers and not exceed the limit`;
        } else {
          delete errors[field];
        }
      }

      if (field === 'disabilityStatus') {
        delete errors[field];
      }

      if (beneficiaryBPLDetailsTO.disabilityStatus === 'Y') {
        if (field === 'disabilityCode') {
          delete errors[field];
        }

        if (field === 'disabilityPercent') {
          delete errors[field];
        }
      }

      if (schemeCode === 'IGNWPS') {
        if (field === 'widows') {
          delete errors[field];
        }
      }

      if (statusOfBeneficiary === 'LEGACY_SO_SAVED') {
        if (field === 'sanctionAuth') {
          if (!value) {
            errors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
          } else if (!alphabetAndSpacePattern.test(value)) {
            errors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} should contain only alphabet and spaces`;
          } else {
            delete errors[field];
          }
        }

        /*  if (field === 'sanctionDate') {
          delete errors[field];
        } */
      }

      if (schemeCode === 'NFBS') {
        if (field === 'addressNfbs1') {
          if (!value) {
            errors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
          } else if (!alphanumericPattern.test(value)) {
            errors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} should contain AlphaNumeric Characters`;
          } else {
            delete errors[field];
          }
        }
        if (field === 'addressNfbs2') {
          if (!value) {
            errors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
          } else if (!alphanumericPattern.test(value)) {
            errors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} should contain AlphaNumeric Characters`;
          } else {
            delete errors[field];
          }
        }
        if (field === 'addressNfbs3') {
          if (!value) {
            errors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
          } else if (!alphanumericPattern.test(value)) {
            errors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} should contain AlphaNumeric Characters`;
          } else {
            delete errors[field];
          }
        }

        if (field === 'pincodeNfbs') {
          if (!value) {
            errors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
          } else if (!pincodeRegex.test(value)) {
            errors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} should be of 6 digit number `;
          } else {
            delete errors[field];
          }
        }
        if (field === 'bplYearNfbs') {
          delete errors[field];
        }
        if (field === 'bplLocationNfbs') {
          if (!value) {
            errors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
          } else if (!alphabetAndSpacePattern.test(value)) {
            errors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} should contain only alphabet and spaces`;
          } else {
            delete errors[field];
          }
        }
        if (field === 'bplFamilyIdNfbs') {
          if (!value) {
            errors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
          } else if (!alphabetNumberSpaceDashPattern.test(value)) {
            errors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} should contain only alphabet and numbers`;
          } else {
            delete errors[field];
          }
        }
        if (field === 'bplMemberIdNfbs') {
          if (!value) {
            errors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
          } else if (!numberLimitRegex.test(value)) {
            errors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} should contain only numbers`;
          } else {
            delete errors[field];
          }
        }

        if (field === 'isAuthorizeCert') {
          delete errors[field];
        }

        if (beneficiaryNfbsDetailsTO.isAuthorizeCert === 'Y') {
          if (field === 'authorizeCertIssueDate') {
            if (!value) {
              errors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
            } else {
              delete errors[field];
            }
          }

          if (field === 'authorizeCertIssueAuth') {
            if (!value) {
              errors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
            } else if (!alphabetAndSpacePattern.test(value)) {
              errors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} should contain only alphabet and spaces`;
            } else {
              delete errors[field];
            }
          }

          if (field === 'authCertFile') {
            if (!value) {
              errors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
            } else {
              delete errors[field];
            }
          }
        }
      }

      if (field === 'ageCertIssueDate') {
        if (!value) {
          errors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
        } else {
          delete errors[field];
        }
      }

      if (field === 'ageCertIssueAuth') {
        if (!value) {
          errors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
        } else if (!alphabetAndSpacePattern.test(value)) {
          errors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} should contain only alphabet and spaces`;
        } else {
          delete errors[field];
        }
      }

      if (field === 'incCertIssueDate') {
        if (!value) {
          errors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
        } else {
          delete errors[field];
        }
      }

      if (field === 'incCertIssueAuth') {
        if (!value) {
          errors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
        } else if (!alphabetAndSpacePattern.test(value)) {
          errors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} should contain only alphabet and spaces`;
        } else {
          delete errors[field];
        }
      }

      if (field === 'resCertIssueDate') {
        if (!value) {
          errors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
        } else {
          delete errors[field];
        }
      }

      if (field === 'resCertIssueAuth') {
        if (!value) {
          errors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
        } else if (!alphabetAndSpacePattern.test(value)) {
          errors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} should contain only alphabet and spaces`;
        } else {
          delete errors[field];
        }
      }

      if (field === 'disCertIssueDate') {
        if (!value) {
          errors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
        } else {
          delete errors[field];
        }
      }

      if (field === 'disCertIssueAuth') {
        if (!value) {
          errors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
        } else if (!alphabetAndSpacePattern.test(value)) {
          errors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} should contain only alphabet and spaces`;
        } else {
          delete errors[field];
        }
      }

      if (field === 'deathCertIssueDate') {
        if (!value) {
          errors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
        } else {
          delete errors[field];
        }
      }

      if (field === 'deathCertIssueAuth') {
        if (!value) {
          errors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
        } else if (!alphabetAndSpacePattern.test(value)) {
          errors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} should contain only alphabet and spaces`;
        } else {
          delete errors[field];
        }
      }

      if (field === 'bankCertIssueDate') {
        if (!value) {
          errors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
        } else {
          delete errors[field];
        }
      }

      if (field === 'bankCertIssueAuth') {
        if (!value) {
          errors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
        } else if (!alphabetAndSpacePattern.test(value)) {
          errors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} should contain only alphabet and spaces`;
        } else {
          delete errors[field];
        }
      }
    }
    setFormErrors(errors);

    // Check if there are any errors
    return Object.keys(errors).length === 0;
  };

  return (
    <div>
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
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ open: false, message: '', severity: 'info' })}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <MuiAlert
          onClose={() => setSnackbar({ open: false, message: '', severity: 'info' })}
          severity={snackbar.severity}
          style={{ backgroundColor: snackbar.severity === 'warning' ? '#fffde7' : null }}
        >
          {snackbar.message}
        </MuiAlert>
      </Snackbar>
      <MainCard title="Application Form">
        <Stepper alternativeLabel activeStep={activeStep}>
          {steps.map((step, index) => {
            const labelProps = {};
            const stepProps = {};
            if (isStepOptional(index)) {
              labelProps.optional = (
                <Typography variant="caption" align="center" style={{ display: 'block' }}>
                  <br></br>
                </Typography>
              );
            }
            if (isStepSkipped(index)) {
              stepProps.completed = false;
            }
            return (
              <Step {...stepProps} key={index}>
                <StepLabel {...labelProps}>{step}</StepLabel>
              </Step>
            );
          })}
        </Stepper>

        {activeStep === steps.length ? (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              This Beneficiary has been registered with NSAP with Application No {beneficiaryBankDetailsTO.applicationNo}
            </Grid>
          </Grid>
        ) : (
          <>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                {activeStep === 1 && (
                  <BeneficiaryPersonalDetails
                    formData={beneficiaryPersonalDetailsTO}
                    setFormData={setBeneficiaryPersonalDetailsTO}
                    formErrors={formErrors}
                    validateForm={validateForm}
                    setFormErrors={setFormErrors}
                    nfbsFormData={beneficiaryNfbsDetailsTO}
                    setNfbsFormData={setBeneficiaryNfbsDetailsTO}
                    beneficiaryAadharData={beneficiaryAadharDetailsTO}
                  />
                )}
                {activeStep === 2 && (
                  <BeneficiaryBankDetails
                    formData={beneficiaryBankDetailsTO}
                    setFormData={setBeneficiaryBankDetailsTO}
                    formErrors={formErrors}
                    validateForm={validateForm}
                    setFormErrors={setFormErrors}
                    isValid={isValid}
                    setIsValid={setIsValid}
                    accountNumberAvailability={accountNumberAvailability}
                    setAccountNumberAvailability={setAccountNumberAvailability}
                    setBankFormCompleted={setBankFormCompleted}
                  />
                )}
                {activeStep === 0 && (
                  <BeneficiaryAadharDetails
                    formData={beneficiaryAadharDetailsTO}
                    setFormData={setBeneficiaryAadharDetailsTO}
                    formErrors={formErrors}
                    setFormErrors={setFormErrors}
                    validateForm={validateForm}
                    aadharVerifyStatus={aadharVerifyStatus}
                    setAadharVerifyStatus={setAadharVerifyStatus}
                    updateApplicantName={updateApplicantName}
                    setUpdateApplicantName={setUpdateApplicantName}
                    setAadharFormCompleted={setAadharFormCompleted}
                  />
                )}
                {activeStep === 3 && (
                  <BeneficiaryBPLDetails
                    formData={beneficiaryBPLDetailsTO}
                    setFormData={setBeneficiaryBPLDetailsTO}
                    formErrors={formErrors}
                    validateForm={validateForm}
                    setFormErrors={setFormErrors}
                    setBplFormCompleted={setBplFormCompleted}
                    nfbsFormData={beneficiaryNfbsDetailsTO}
                    setNfbsFormData={setBeneficiaryNfbsDetailsTO}
                  />
                )}
                {activeStep === 4 && !showSuccessMessage && <Preview />}
                {showSuccessMessage && (
                  <Typography variant="h3" style={{ color: 'green', textAlign: 'center' }}>
                    <br />
                    <br />
                    Success! This is your updated data with Application No {displayedApplicationNo}
                  </Typography>
                )}
              </Grid>

              <Grid item xs={12}>
                <div>
                  {activeStep > 0 && activeStep <= 4 && (
                    <Button className={classes.button} variant="contained" onClick={handlePrevious}>
                      <ArrowBackIcon />
                    </Button>
                  )}

                  {activeStep < 4 && (
                    <Button className={classes.button} variant="contained" onClick={handleNext} disabled={loading}>
                      SAVE & NEXT
                    </Button>
                  )}
                  {activeStep < 4 && (
                    <Button className={classes.button} variant="contained" onClick={handleSkip}>
                      <ArrowForwardIcon />
                    </Button>
                  )}
                  {activeStep === 4 && !showSuccessMessage && (
                    <Button className={classes.button} variant="contained" onClick={handleNext} disabled={loading}>
                      SUBMIT
                    </Button>
                  )}
                </div>
              </Grid>
            </Grid>
          </>
        )}
      </MainCard>
      <Dialog open={openDialog} onClose={handleDialogClose}>
        <DialogTitle>Confirmation</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to submit and move to the next step?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary" disabled={confirming}>
            Cancel
          </Button>
          <Button onClick={handleConfirm} color="primary" disabled={confirming}>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default LinearStepper;
