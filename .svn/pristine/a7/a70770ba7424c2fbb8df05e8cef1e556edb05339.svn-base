import React, { useState} from "react";


import BeneficiaryPersonalDetails from "./BeneficiaryPersonalDetails";
import BeneficiaryBankDetails from "./BeneficiaryBankDetails";
import BeneficiaryAadharDetails from "./BeneficiaryAadharDetails";
import BeneficiaryBPLDetails from "./BeneficiaryBPLDetails";
import Preview from "./Preview";
import {
  Typography,
  Button,
  Stepper,
  Step,
  StepLabel
  
} from '@mui/material' //"@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import MainCard from "ui-component/cards/MainCard";
/* import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'; */
const useStyles = makeStyles((theme) => ({
  button: {
    marginRight: theme.spacing(1),
  },
}));

function getSteps() {
  return [
    "Beneficiary Personal Details",
    "Beneficiary Bank Details",
    "Beneficiary Aadhar Details",
    "Beneficiary BPL Details",
    "Preview"
  ];
}

function getStepContent(step) {
  switch (step) {
    case 0:
      return <BeneficiaryPersonalDetails/>;

    case 1:
      return <BeneficiaryBankDetails/>;
    case 2:
      return <BeneficiaryAadharDetails/>;
    case 3:
      return <BeneficiaryBPLDetails/>;
    case 4:
      return <Preview/>;
    default:
      return "unknown step";
  }
}

const LinaerStepper = () => {
  const storedData = localStorage.getItem('applicationNo')
  console.log('Linear: ',storedData)
  const classes = useStyles();
  const [activeStep, setActiveStep] = useState(0);
  const [skippedSteps, setSkippedSteps] = useState([]);
  const steps = getSteps();
  
  const isStepOptional = (step) => {
    return step === 1 || step === 2;
  };

  const isStepSkipped = (step) => {
    return skippedSteps.includes(step);
  };

  const handleNext = () => {
    setActiveStep(activeStep + 1);
    setSkippedSteps(skippedSteps.filter((skipItem) => skipItem !== activeStep));
    if(activeStep===4)
      console.log('hiiiiiii')
      
  };

  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  const handleSkip = () => {
    if (!isStepSkipped(activeStep)) {
      setSkippedSteps([...skippedSteps, activeStep]);
    }
    setActiveStep(activeStep + 1);
  };

  return (
    
    <div>
    <MainCard title="Application Form">
      <Stepper alternativeLabel activeStep={activeStep}>
        {steps.map((step, index) => {
          const labelProps = {};
          const stepProps = {};
          if (isStepOptional(index)) {
            labelProps.optional = (
              <Typography
                variant="caption"
                align="center"
                style={{ display: "block" }}
              >
                optional
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
        <Typography variant="h3" align="center">
        This Beneficiary has been registered with NSAP with Application No {storedData}
        </Typography>
      ) : (
        <>
          
           {getStepContent(activeStep)}
          
         
          <Button
            className={classes.button}
            disabled={activeStep === 0}
            onClick={handleBack}
          >
            back
          </Button>
          {isStepOptional(activeStep) && (
            <Button
              className={classes.button}
              variant="contained"
              color="secondary"
              onClick={handleSkip}
            >
              skip
            </Button>
          )}
          
          <Button
            className={classes.button}
            variant="contained"
            color="secondary"
            onClick={handleNext}
          >
          
           {activeStep === steps.length - 1 ? "Finish" : "Next"}
          </Button>
          
        </>
      )}
      </MainCard>
    </div>
  );
};

export default LinaerStepper;
