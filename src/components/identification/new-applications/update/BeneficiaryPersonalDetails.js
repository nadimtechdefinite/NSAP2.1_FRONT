import React, { useState, useEffect } from 'react';
import axiosInstance from 'hooks/useAuthTokenUrl';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';
import { TextField, Grid, FormControl, InputLabel, MenuItem, Select, FormHelperText, Typography } from '@mui/material';

import StateList from 'components/form_components/StateList';
import DistrictList from 'components/form_components/DistrictList';
import AreaList from 'components/form_components/AreaList';
import SubDistrictList from 'components/form_components/SubDistrictList';
import GramPanchayatList from 'components/form_components/GramPanchayatList';
import VillageList from 'components/form_components/VillageList';
import HabitationList from 'components/form_components/HabitationList';
import { getUserInfo } from 'utils/storageUtils';

const BeneficiaryPersonalDetails = ({
  formData,
  setFormData,
  nfbsFormData,
  setNfbsFormData,
  formErrors,
  validateForm,
  setFormErrors,
  beneficiaryAadharData
}) => {
  const userInfo = getUserInfo();
  const userLevel = userInfo.userLevel;
  const [loading, setLoading] = useState(true);
  const [originalFormData] = useState(formData);
  const [originalFormDataNfbs] = useState(nfbsFormData);
  const handleChange = async (field, value) => {
    const changesMade = formData[field] !== value;

    if (field === 'dateOfBirth') {
      const currentDate = dayjs();
      const selectedDate = dayjs(value, 'DD-MM-YYYY');
      const ageDiff = currentDate.diff(selectedDate, 'year');
      const isBirthdayPassed =
        currentDate.month() > selectedDate.month() ||
        (currentDate.month() === selectedDate.month() && currentDate.date() >= selectedDate.date());

      const age = isBirthdayPassed ? ageDiff : ageDiff - 1;

      setFormData((prevFormData) => ({ ...prevFormData, age, dateOfBirth: value, changesMade }));
    } else if (field === 'age') {
      const currentDate = dayjs();
      const birthYear = parseInt(value);
      const birthDate = dayjs()
        .year(currentDate.year() - birthYear)
        .month(6)
        .date(1);

      setFormData((prevFormData) => ({ ...prevFormData, age: value, dateOfBirth: birthDate, changesMade }));
    } else {
      setFormData((prevFormData) => ({ ...prevFormData, [field]: value, changesMade }));
    }

    validateForm(field, value, 1, 0);
  };
  const handleChangeNfbs = (field, value) => {
    const changesMade = formData[field] !== value;

    if (field === 'dateOfDeath') {
      const dateOnly = dayjs(value);
      const formattedDate = dateOnly.format('YYYY-MM-DD');
      setNfbsFormData((prevData) => ({
        ...prevData,
        [field]: formattedDate,
        changesMade
      }));
    } else {
      setNfbsFormData((prevData) => ({
        ...prevData,
        [field]: value,
        changesMade
      }));
    }
    validateForm(field, value, 1, 0);
  };

  const [getAllCategory, setAllCategory] = useState([]);
  const [getAllPlan, setAllPlan] = useState([]);
  const [getSchemeCode, setSchemeCode] = useState([]);
  const [getAllGender, setAllGender] = useState([]);

  const getGithubData = () => {
    let endpoints = [
      '/master-management/findAllCategory',
      '/master-management/findAllPlanDetail',
      '/beneficiaryRegistration/selectedSchemeCode',
      '/beneficiaryRegistration/findAllGenderList'
    ];

    const promises = endpoints.map((endpoint) => axiosInstance.get(endpoint).then((response) => response.data));

    return Promise.all(promises);
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch all data in parallel
        const [allCategory, allPlan, schemeCode, allGender] = await getGithubData();

        setAllCategory(allCategory);
        setAllPlan(allPlan);
        setSchemeCode(schemeCode);
        setAllGender(allGender);

        const storedData = localStorage.getItem('applicationNo');
        if (storedData) {
          const parsedData = JSON.parse(storedData);

          const beneficiaryResponse = await axiosInstance.get(
            `/beneficiaryRegistration/findPensionerMasterDetailsByApplicationNo/${parsedData}`
          );

          const beneficiaryData = beneficiaryResponse.data;
          try {
            if (beneficiaryData.schemeCode === 'NFBS') {
              const nfbsResponse = await axiosInstance.get(`/beneficiaryRegistration/findNfbsMasterDetailsByApplicationNo/${parsedData}`);

              const nfbsData = nfbsResponse.data;

              console.log('nfbsData.dateOfDeath', nfbsData.dateOfDeath);

              if (nfbsData.dateOfDeath) {
                const dateAdapter = new AdapterDayjs();
                nfbsData.dateOfDeath = dateAdapter.date(nfbsData.dateOfDeath);
              }
              console.log('nfbsData.dateOfDeath1', nfbsData.dateOfDeath);

              setNfbsFormData(nfbsData);
            }
          } catch (error) {
            console.error('Error fetching data:', error);
          }
          if (beneficiaryData.dateOfBirth) {
            const dateAdapter = new AdapterDayjs();
            const dateComponents = beneficiaryData.dateOfBirth.split('-');
            const rearrangedDate = `${dateComponents[1]}-${dateComponents[0]}-${dateComponents[2]}`;
            beneficiaryData.dateOfBirth = dateAdapter.date(rearrangedDate);
          }

          beneficiaryData.planCode = beneficiaryData.planCode || '';

          setFormData((prevData) => ({
            ...prevData,
            ...beneficiaryData
          }));
          if (beneficiaryData.schemeCode === 'NFBS') {
            setNfbsFormData(nfbsData);
          }
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    let isMounted = true;

    if (isMounted) {
      fetchData();
    }

    return () => {
      isMounted = false;
    };
  }, []);
  const applicantName = formData.applicantName;

  localStorage.removeItem('applicantName');
  localStorage.setItem('applicantName', applicantName);

  localStorage.setItem('schemeCode', getSchemeCode);

  const [disabledYears, setDisabledYears] = useState([]);

  useEffect(() => {
    const calculateDisabledYears = () => {
      try {
        const currentYear = dayjs().year();
        let minAge = 0;
        let maxAge = 0;

        if (getSchemeCode === 'IGNOAPS') {
          minAge = 60;
          maxAge = 120;
        } else if (getSchemeCode === 'IGNWPS') {
          minAge = 40;
          maxAge = 100;
        } else if (getSchemeCode === 'NFBS') {
          minAge = 18;
          maxAge = 59;
        } else if (getSchemeCode === 'IGNDPS') {
          minAge = 18;
          maxAge = 100;
        }

        const startYear = currentYear - maxAge;
        const endYear = currentYear - minAge;

        const disabledYears = Array.from({ length: endYear - startYear + 1 }, (_, index) => startYear + index);

        setDisabledYears(disabledYears);
      } catch (error) {
        console.error('Error calculating disabled years:', error);
      }
    };

    calculateDisabledYears();
  }, [getSchemeCode]);

  if (loading) {
    return <p>Loading...</p>;
  }

  const handleSelectDistrict = (selectedDistrictId) => {
    const changesMade = originalFormData.districtId !== selectedDistrictId;
    if (userLevel === 2) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        districtId: selectedDistrictId,
        ruralUrbanArea: '',
        changesMade: changesMade
      }));
    } else {
      setFormData((prevFormData) => ({
        ...prevFormData,
        districtId: selectedDistrictId,
        changesMade: changesMade
      }));
    }

    setFormErrors((prevErrors) => {
      const updatedErrors = { ...prevErrors };
      delete updatedErrors.districtId;
      return updatedErrors;
    });
  };

  const handleSelectDistrictNfbs = (selectedDistrictId) => {
    const changesMade = originalFormDataNfbs.districtId1 !== selectedDistrictId;
    if (userLevel === 2) {
      setNfbsFormData({
        ...nfbsFormData,
        districtId1: selectedDistrictId,
        ruralUrbanArea1: '',
        changesMade: changesMade
      });
    } else {
      setNfbsFormData({
        ...nfbsFormData,
        districtId1: selectedDistrictId,
        changesMade: changesMade
      });
    }
    setFormErrors((prevErrors) => {
      const updatedErrors = { ...prevErrors };
      delete updatedErrors.districtId1;
      return updatedErrors;
    });
  };

  const handleSelectArea = (selectedAreaId) => {
    const changesMade = originalFormData.ruralUrbanArea !== selectedAreaId;
    setFormData({
      ...formData,
      ruralUrbanArea: selectedAreaId,
      subDistrictMunicipalAreaId: '',
      changesMade: changesMade
    });
    setFormErrors((prevErrors) => {
      const updatedErrors = { ...prevErrors };
      delete updatedErrors.ruralUrbanArea;
      if (selectedAreaId === 'U') {
        delete updatedErrors.villageId;
        delete updatedErrors.habitationId;
      }
      return updatedErrors;
    });
  };

  const handleSelectAreaNfbs = (selectedAreaId) => {
    const changesMade = originalFormDataNfbs.ruralUrbanArea1 !== selectedAreaId;
    setNfbsFormData({
      ...nfbsFormData,
      ruralUrbanArea1: selectedAreaId,
      subDistrictMunicipalAreaId1: '',
      changesMade: changesMade
    });

    setFormErrors((prevErrors) => {
      const updatedErrors = { ...prevErrors };
      delete updatedErrors.ruralUrbanArea1;
      return updatedErrors;
    });
  };

  const handleSelectSubDistrict = (selectedSubDistrictId) => {
    const changesMade = originalFormData.subDistrictMunicipalAreaId !== selectedSubDistrictId;
    setFormData({
      ...formData,
      subDistrictMunicipalAreaId: selectedSubDistrictId,
      gramPanchayatWardId: '',
      changesMade: changesMade
    });

    setFormErrors((prevErrors) => {
      const updatedErrors = { ...prevErrors };
      delete updatedErrors.subDistrictMunicipalAreaId;
      return updatedErrors;
    });
  };

  const handleSelectSubDistrictNfbs = (selectedSubDistrictId) => {
    const changesMade = originalFormDataNfbs.subDistrictMunicipalAreaId1 !== selectedSubDistrictId;
    setNfbsFormData({
      ...nfbsFormData,
      subDistrictMunicipalAreaId1: selectedSubDistrictId,
      gramPanchayatWardId1: '',
      changesMade: changesMade
    });

    setFormErrors((prevErrors) => {
      const updatedErrors = { ...prevErrors };
      delete updatedErrors.subDistrictMunicipalAreaId1;
      return updatedErrors;
    });
  };

  const handleGramPanchayatChange = (selectedGramPanchayatWardId) => {
    const changesMade = originalFormData.gramPanchayatWardId !== selectedGramPanchayatWardId;
    setFormData({
      ...formData,
      gramPanchayatWardId: selectedGramPanchayatWardId,
      villageId: '',
      habitationId: '',
      changesMade: changesMade
    });

    setFormErrors((prevErrors) => {
      const updatedErrors = { ...prevErrors };
      delete updatedErrors.gramPanchayatWardId;
      return updatedErrors;
    });
  };

  const handleGramPanchayatChangeNfbs = (selectedGramPanchayatWardId) => {
    const changesMade = originalFormDataNfbs.gramPanchayatWardId1 !== selectedGramPanchayatWardId;
    setNfbsFormData({
      ...nfbsFormData,
      gramPanchayatWardId1: selectedGramPanchayatWardId,
      villageId1: '',
      habitationId1: '',
      changesMade: changesMade
    });

    setFormErrors((prevErrors) => {
      const updatedErrors = { ...prevErrors };
      delete updatedErrors.gramPanchayatWardId1;
      return updatedErrors;
    });
  };
  const handleSelectedVillage = (selectedVillageId) => {
    const changesMade = originalFormData.villageId !== selectedVillageId;
    setFormData({ ...formData, villageId: selectedVillageId, habitationId: '', changesMade: changesMade });
    setFormErrors((prevErrors) => {
      const updatedErrors = { ...prevErrors };
      delete updatedErrors.villageId;
      return updatedErrors;
    });
  };

  const handleSelectedVillageNfbs = (selectedVillageId) => {
    const changesMade = originalFormDataNfbs.villageId1 !== selectedVillageId;
    setNfbsFormData({ ...nfbsFormData, villageId1: selectedVillageId, habitationId1: '', changesMade: changesMade });
  };

  const handleSelectedHabitation = (selectedHabitationId) => {
    const changesMade = originalFormData.habitationId !== selectedHabitationId;
    setFormData({ ...formData, habitationId: selectedHabitationId, changesMade: changesMade });

    setFormErrors((prevErrors) => {
      const updatedErrors = { ...prevErrors };
      delete updatedErrors.habitationId;
      return updatedErrors;
    });
  };

  const handleSelectedHabitationNfbs = (selectedHabitationId) => {
    const changesMade = originalFormDataNfbs.habitationId1 !== selectedHabitationId;
    setNfbsFormData({ ...nfbsFormData, habitationId1: selectedHabitationId, changesMade: changesMade });
  };

  localStorage.setItem('statusOfBeneficiary', JSON.stringify(formData.statusOfBeneficiary));

  return (
    <>
      <div>
        {getSchemeCode === 'NFBS' && <h2>Details Of The Family Member To Be Provided Assistance (Claimant)</h2>}
        <Grid container spacing={2}>
          <input type="hidden" name="applicationNo" value={formData.applicationNo} />
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <TextField
                label={
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <span style={{ marginRight: '4px' }}>Applicant Name</span>
                    <Typography style={{ color: 'red' }}>*</Typography>
                  </div>
                }
                name="applicantName"
                variant="outlined"
                fullWidth
                value={beneficiaryAadharData.nameAsPerUid || ''}
                InputProps={{ readOnly: true }} // ✅ Keeps it read-only
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth className={formErrors.fatherHusbandName ? 'error' : ''}>
              <TextField
                label={
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <span style={{ marginRight: '4px' }}>Husband/Father Name</span>
                    <Typography style={{ color: 'red' }}>*</Typography>
                  </div>
                }
                name="fatherHusbandName"
                placeholder="Enter Husband/Father Name"
                variant="outlined"
                fullWidth
                value={formData.fatherHusbandName}
                inputProps={{ maxLength: 100 }}
                onChange={(e) => handleChange('fatherHusbandName', e.target.value.toUpperCase())}
                error={formErrors.fatherHusbandName && true}
              />
              {formErrors.fatherHusbandName && (
                <FormHelperText>
                  <Typography style={{ color: 'red', fontSize: '0.8rem' }}>{formErrors.fatherHusbandName}</Typography>
                </FormHelperText>
              )}
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={4}>
            <FormControl fullWidth className={formErrors.gender ? 'error' : ''}>
              <InputLabel id="demo-simple-select-label">
                Gender&nbsp;<span style={{ color: 'red' }}>*</span>
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                label="Gender"
                name="gender"
                value={formData.gender}
                onChange={(e) => handleChange('gender', e.target.value)}
              >
                {getAllGender.map((item) => (
                  <MenuItem key={item.genderId} value={item.genderName.substring(0, 1)}>
                    {item.genderName}
                  </MenuItem>
                ))}
              </Select>
              {formErrors.gender && (
                <FormHelperText>
                  <Typography style={{ color: 'red', fontSize: '0.8rem' }}>{formErrors.gender}</Typography>
                </FormHelperText>
              )}
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth className={formErrors.dateOfBirth ? 'error' : ''}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label={
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <span style={{ marginRight: '4px' }}>Date of Birth</span>
                      <Typography style={{ color: 'red' }}>*</Typography>
                    </div>
                  }
                  format="DD-MM-YYYY"
                  name="dateOfBirth"
                  slotProps={{ textField: { fullWidth: true } }}
                  variant="outlined"
                  value={formData.dateOfBirth}
                  onChange={(selectedDate) => handleChange('dateOfBirth', selectedDate)}
                  renderInput={(params) => <TextField {...params} />}
                  disableFuture
                  shouldDisableDate={(date) => {
                    const year = dayjs(date).year();
                    return !disabledYears.includes(year);
                  }}
                  error={formErrors.dateOfBirth ? true : false}
                ></DatePicker>
              </LocalizationProvider>

              {formErrors.dateOfBirth && (
                <FormHelperText>
                  <Typography style={{ color: 'red', fontSize: '0.8rem' }}>{formErrors.dateOfBirth}</Typography>
                </FormHelperText>
              )}
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth className={formErrors.age ? 'error' : ''}>
              <InputLabel htmlFor="age" shrink={!!formData.age} error={!!formErrors.age}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <span style={{ marginRight: '4px' }}>Age</span>
                  <Typography style={{ color: 'red' }}>*</Typography>
                </div>
              </InputLabel>
              <TextField
                id="age"
                name="age"
                variant="outlined"
                fullWidth
                value={formData.age}
                inputProps={{ maxLength: 3 }}
                onChange={(e) => handleChange('age', e.target.value)}
                error={!!formErrors.age}
              />
              {formErrors.age && (
                <FormHelperText>
                  <Typography style={{ color: 'red', fontSize: '0.8rem' }}>{formErrors.age}</Typography>
                </FormHelperText>
              )}
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={4}>
            <FormControl fullWidth className={formErrors.contactPersonMobile ? 'error' : ''}>
              <TextField
                label={
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <span style={{ marginRight: '4px' }}>Mobile No</span>
                    <Typography style={{ color: 'red' }}>*</Typography>
                  </div>
                }
                name="contactPersonMobile"
                placeholder="Enter Mobile No"
                variant="outlined"
                fullWidth
                value={formData.contactPersonMobile}
                inputProps={{ maxLength: 10 }}
                onChange={(e) => handleChange('contactPersonMobile', e.target.value)}
                error={formErrors.contactPersonMobile && true}
              />
              {formErrors.contactPersonMobile && (
                <FormHelperText>
                  <Typography style={{ color: 'red', fontSize: '0.8rem' }}>{formErrors.contactPersonMobile}</Typography>
                </FormHelperText>
              )}
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <StateList defaultSelectedState={formData.stateId} isMendatory={true} />
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth className={formErrors.districtId ? 'error' : ''}>
              <DistrictList
                selectedStateId={formData.stateId}
                onSelectDistrict={handleSelectDistrict}
                defaultSelectedDistrict={formData.districtId}
                isMendatory={true}
              />
              {formErrors.districtId && (
                <FormHelperText>
                  <Typography style={{ color: 'red', fontSize: '0.8rem' }}>{formErrors.districtId}</Typography>
                </FormHelperText>
              )}
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth className={formErrors.ruralUrbanArea ? 'error' : ''}>
              <AreaList selectedArea={formData.ruralUrbanArea} onSelectArea={handleSelectArea} isMendatory={true} />
              {formErrors.ruralUrbanArea && (
                <FormHelperText>
                  <Typography style={{ color: 'red', fontSize: '0.8rem' }}>{formErrors.ruralUrbanArea}</Typography>
                </FormHelperText>
              )}
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth className={formErrors.subDistrictMunicipalAreaId ? 'error' : ''}>
              <SubDistrictList
                defaultSelectedSubDistrict={formData.subDistrictMunicipalAreaId}
                selectedAreaId={formData.ruralUrbanArea}
                selectedDistrictId={formData.districtId}
                onSelectSubDistrict={handleSelectSubDistrict}
                isMendatory={true}
              />
              {formErrors.subDistrictMunicipalAreaId && (
                <FormHelperText>
                  <Typography style={{ color: 'red', fontSize: '0.8rem' }}>{formErrors.subDistrictMunicipalAreaId}</Typography>
                </FormHelperText>
              )}
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth className={formErrors.gramPanchayatWardId ? 'error' : ''}>
              <GramPanchayatList
                defaultSelectGramPanchayatWardId={formData.gramPanchayatWardId}
                selectedSubDistrictMunicipalAreaId={formData.subDistrictMunicipalAreaId}
                onSelectGramPanchayat={handleGramPanchayatChange}
                isMendatory={true}
              />
              {formErrors.gramPanchayatWardId && (
                <FormHelperText>
                  <Typography style={{ color: 'red', fontSize: '0.8rem' }}>{formErrors.gramPanchayatWardId}</Typography>
                </FormHelperText>
              )}
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth className={formErrors.villageId ? 'error' : ''}>
              <VillageList
                defaultSelectVillageId={formData.villageId}
                selectedGramPanchayatId={formData.gramPanchayatWardId}
                onSelectVillage={handleSelectedVillage}
                isDisabled={formData.ruralUrbanArea === 'U' ? true : false}
                isMendatory={formData.ruralUrbanArea === 'R' ? true : false}
              />
              {formErrors.villageId && (
                <FormHelperText>
                  <Typography style={{ color: 'red', fontSize: '0.8rem' }}>{formErrors.villageId}</Typography>
                </FormHelperText>
              )}
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth className={formErrors.habitationId ? 'error' : ''}>
              <HabitationList
                selectedVillageId={formData.villageId}
                defaultSelectedHabitation={formData.habitationId}
                onSelectHabitation={handleSelectedHabitation}
                isDisabled={formData.ruralUrbanArea === 'U' ? true : false}
                isMendatory={formData.ruralUrbanArea === 'R' ? true : false}
              />
              {formErrors.habitationId && (
                <FormHelperText>
                  <Typography style={{ color: 'red', fontSize: '0.8rem' }}>{formErrors.habitationId}</Typography>
                </FormHelperText>
              )}
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth className={formErrors.beneficiaryNo ? 'error' : ''}>
              <TextField
                label={
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <span style={{ marginRight: '4px' }}>Beneficiary Number</span>
                    <Typography style={{ color: 'red' }}>*</Typography>
                  </div>
                }
                name="beneficiaryNo"
                placeholder="Enter Beneficiary Number"
                variant="outlined"
                fullWidth
                value={formData.beneficiaryNo}
                inputProps={{ maxLength: 20 }}
                onChange={(e) => handleChange('beneficiaryNo', e.target.value)}
                error={formErrors.beneficiaryNo && true}
              />
              {formErrors.beneficiaryNo && (
                <FormHelperText>
                  <Typography style={{ color: 'red', fontSize: '0.8rem' }}>{formErrors.beneficiaryNo}</Typography>
                </FormHelperText>
              )}
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth className={formErrors.categoryId ? 'error' : ''}>
              <InputLabel id="demo-simple-select-label">
                Category&nbsp;<span style={{ color: 'red' }}>*</span>
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                label="Category"
                name="categoryId"
                value={formData.categoryId}
                onChange={(e) => handleChange('categoryId', e.target.value)}
              >
                {getAllCategory.map((item) => (
                  <MenuItem key={item.categoryId} value={item.categoryId}>
                    {item.categoryName}{' '}
                  </MenuItem>
                ))}
              </Select>

              {formErrors.categoryId && (
                <FormHelperText>
                  <Typography style={{ color: 'red', fontSize: '0.8rem' }}>{formErrors.categoryId}</Typography>
                </FormHelperText>
              )}
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Plan Name</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                label="Plan Name"
                name="planCode"
                value={formData.planCode}
                onChange={(e) => handleChange('planCode', e.target.value)}
              >
                {Array.isArray(getAllPlan) ? (
                  getAllPlan.map((item) => (
                    <MenuItem key={item.planCode} value={item.planCode}>
                      {item.planName}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem value="">No plans available</MenuItem>
                )}
              </Select>
            </FormControl>
          </Grid>

          {getSchemeCode === 'NFBS' && (
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth className={formErrors.relationWithDeceased ? 'error' : ''}>
                <TextField
                  label={
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <span style={{ marginRight: '4px' }}>Relation With Deceased</span>
                      <Typography style={{ color: 'red' }}>*</Typography>
                    </div>
                  }
                  name="relationWithDeceased"
                  placeholder="Enter Relation With Deceased"
                  variant="outlined"
                  fullWidth
                  value={nfbsFormData.relationWithDeceased}
                  inputProps={{ maxLength: 100 }}
                  onChange={(e) => handleChangeNfbs('relationWithDeceased', e.target.value.toUpperCase())}
                  error={formErrors.relationWithDeceased && true}
                />
                {formErrors.relationWithDeceased && (
                  <FormHelperText>
                    <Typography style={{ color: 'red', fontSize: '0.8rem' }}>{formErrors.relationWithDeceased}</Typography>
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>
          )}
        </Grid>
      </div>

      {formData.schemeCode === 'NFBS' && (
        <>
          <h2>Details Of Deceased</h2>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <StateList defaultSelectedState={nfbsFormData.stateId1} />
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth className={formErrors.districtId1 ? 'error' : ''}>
                <DistrictList
                  selectedStateId={nfbsFormData.stateId1}
                  onSelectDistrict={handleSelectDistrictNfbs}
                  defaultSelectedDistrict={nfbsFormData.districtId1}
                  isMendatory={true}
                />
                {formErrors.districtId1 && (
                  <FormHelperText>
                    <Typography style={{ color: 'red', fontSize: '0.8rem' }}>{formErrors.districtId1}</Typography>
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth className={formErrors.ruralUrbanArea1 ? 'error' : ''}>
                <AreaList selectedArea={nfbsFormData.ruralUrbanArea1} onSelectArea={handleSelectAreaNfbs} isMendatory={true} />
                {formErrors.ruralUrbanArea1 && (
                  <FormHelperText>
                    <Typography style={{ color: 'red', fontSize: '0.8rem' }}>{formErrors.ruralUrbanArea1}</Typography>
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth className={formErrors.subDistrictMunicipalAreaId1 ? 'error' : ''}>
                <SubDistrictList
                  defaultSelectedSubDistrict={nfbsFormData.subDistrictMunicipalAreaId1}
                  selectedAreaId={nfbsFormData.ruralUrbanArea1}
                  selectedDistrictId={nfbsFormData.districtId1}
                  onSelectSubDistrict={handleSelectSubDistrictNfbs}
                  isMendatory={true}
                />
                {formErrors.subDistrictMunicipalAreaId1 && (
                  <FormHelperText>
                    <Typography style={{ color: 'red', fontSize: '0.8rem' }}>{formErrors.subDistrictMunicipalAreaId1}</Typography>
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth className={formErrors.gramPanchayatWardId1 ? 'error' : ''}>
                <GramPanchayatList
                  defaultSelectGramPanchayatWardId={nfbsFormData.gramPanchayatWardId1}
                  selectedSubDistrictMunicipalAreaId={nfbsFormData.subDistrictMunicipalAreaId1}
                  onSelectGramPanchayat={handleGramPanchayatChangeNfbs}
                  isMendatory={true}
                />
                {formErrors.gramPanchayatWardId1 && (
                  <FormHelperText>
                    <Typography style={{ color: 'red', fontSize: '0.8rem' }}>{formErrors.gramPanchayatWardId1}</Typography>
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <VillageList
                  defaultSelectVillageId={nfbsFormData.villageId1}
                  selectedGramPanchayatId={nfbsFormData.gramPanchayatWardId1}
                  onSelectVillage={handleSelectedVillageNfbs}
                  isDisabled={nfbsFormData.ruralUrbanArea1 === 'U' ? true : false}
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <HabitationList
                  selectedVillageId={nfbsFormData.villageId1}
                  defaultSelectedHabitation={nfbsFormData.habitationId1}
                  onSelectHabitation={handleSelectedHabitationNfbs}
                  isDisabled={nfbsFormData.ruralUrbanArea1 === 'U' ? true : false}
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth className={formErrors.firstName1 ? 'error' : ''}>
                <TextField
                  label={
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <span style={{ marginRight: '4px' }}>First Name</span>
                      <Typography style={{ color: 'red' }}>*</Typography>
                    </div>
                  }
                  name="firstName1"
                  placeholder="Enter First Name"
                  variant="outlined"
                  fullWidth
                  value={nfbsFormData.firstName1}
                  inputProps={{ maxLength: 100 }}
                  onChange={(e) => handleChangeNfbs('firstName1', e.target.value.toUpperCase())}
                  error={formErrors.firstName1 && true}
                />
                {formErrors.firstName1 && (
                  <FormHelperText>
                    <Typography style={{ color: 'red', fontSize: '0.8rem' }}>{formErrors.firstName1}</Typography>
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth className={formErrors.middleName1 ? 'error' : ''}>
                <TextField
                  label="Middle Name"
                  name="middleName1"
                  placeholder="Enter Middle Name"
                  variant="outlined"
                  fullWidth
                  value={nfbsFormData.middleName1}
                  inputProps={{ maxLength: 100 }}
                  onChange={(e) => handleChangeNfbs('middleName1', e.target.value.toUpperCase())}
                  error={formErrors.middleName1 && true}
                />
                {formErrors.middleName1 && (
                  <FormHelperText>
                    <Typography style={{ color: 'red', fontSize: '0.8rem' }}>{formErrors.middleName1}</Typography>
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth className={formErrors.lastName1 ? 'error' : ''}>
                <TextField
                  label="Last Name"
                  name="lastName1"
                  placeholder="Enter Last Name"
                  variant="outlined"
                  fullWidth
                  value={nfbsFormData.lastName1}
                  inputProps={{ maxLength: 100 }}
                  onChange={(e) => handleChangeNfbs('lastName1', e.target.value.toUpperCase())}
                  error={formErrors.lastName1 && true}
                />
                {formErrors.lastName1 && (
                  <FormHelperText>
                    <Typography style={{ color: 'red', fontSize: '0.8rem' }}>{formErrors.lastName1}</Typography>
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth className={formErrors.fatherHusbandName1 ? 'error' : ''}>
                <TextField
                  label={
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <span style={{ marginRight: '4px' }}>Husband/Father Name</span>
                      <Typography style={{ color: 'red' }}>*</Typography>
                    </div>
                  }
                  name="fatherHusbandName1"
                  placeholder="Enter Husband/Father Name"
                  variant="outlined"
                  fullWidth
                  value={nfbsFormData.fatherHusbandName1}
                  inputProps={{ maxLength: 100 }}
                  onChange={(e) => handleChangeNfbs('fatherHusbandName1', e.target.value.toUpperCase())}
                  error={formErrors.fatherHusbandName1 && true}
                />
                {formErrors.fatherHusbandName1 && (
                  <FormHelperText>
                    <Typography style={{ color: 'red', fontSize: '0.8rem' }}>{formErrors.fatherHusbandName1}</Typography>
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={4}>
              <FormControl fullWidth className={formErrors.gender1 ? 'error' : ''}>
                <InputLabel id="demo-simple-select-label">
                  Gender&nbsp;<span style={{ color: 'red' }}>*</span>
                </InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  label="Gender"
                  name="gender1"
                  value={nfbsFormData.gender1}
                  onChange={(e) => handleChangeNfbs('gender1', e.target.value)}
                >
                  {getAllGender.map((item) => (
                    <MenuItem key={item.genderId} value={item.genderName.substring(0, 1)}>
                      {item.genderName}
                    </MenuItem>
                  ))}
                </Select>
                {formErrors.gender1 && (
                  <FormHelperText>
                    <Typography style={{ color: 'red', fontSize: '0.8rem' }}>{formErrors.gender1}</Typography>
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth className={formErrors.dateOfDeath ? 'error' : ''}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    label={
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <span style={{ marginRight: '4px' }}>Date of Death</span>
                        <Typography style={{ color: 'red' }}>*</Typography>
                      </div>
                    }
                    format="DD-MM-YYYY"
                    name="dateOfDeath"
                    slotProps={{ textField: { fullWidth: true } }}
                    variant="outlined"
                    value={nfbsFormData.dateOfDeath}
                    onChange={(selectedDate) => handleChangeNfbs('dateOfDeath', selectedDate)}
                    disableFuture
                    error={formErrors.dateOfDeath ? true : false}
                  ></DatePicker>
                </LocalizationProvider>

                {formErrors.dateOfDeath && (
                  <FormHelperText>
                    <Typography style={{ color: 'red', fontSize: '0.8rem' }}>{formErrors.dateOfDeath}</Typography>
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>
          </Grid>
        </>
      )}
    </>
  );
};
export default BeneficiaryPersonalDetails;
