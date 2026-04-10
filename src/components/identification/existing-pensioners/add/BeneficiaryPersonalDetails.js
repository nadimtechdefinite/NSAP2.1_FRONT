// import React , {useState,useEffect} from 'react';
// import { useReducer } from "react";
// import axios from 'axios';
// import { DatePicker } from '@mui/x-date-pickers/DatePicker';
// import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
// import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
// import DistrictList from 'components/form_components/DistrictList';
// import SubDistrictList from 'components/form_components/SubDistrictList';
// import GramPanchayatList from 'components/form_components/GramPanchayatList';
// //import VillageList from 'components/form_components/VillageList';
// //import HabitationList from 'components/form_components/HabitationList';
// import StateList from 'components/form_components/StateList';
// import AreaList from 'components/form_components/AreaList';

// import {
//     TextField,
//     Button,
//     Grid,
//     FormControl,
//     InputLabel ,
//     MenuItem ,
//     Select
//   } from '@mui/material'

// function BeneficiaryPersonalDetails(){

// const [formInput, setFormInput] = useReducer(
//     (state, newState) => ({ ...state, ...newState }),
//     {
//       stateId:"",
//       firstName: "",
//       middleName: "",
//       lastName: "",
//       genderId:"",
//       dateOfBirth:"",
//       ruralUrbanAreaId:""

//     }
//   );

//   //const RESET_FORM = 'RESET_FORM';
//   const handleSubmit = async (e) => {
//     e.preventDefault()
//     event.target.reset();
//     //const postFormDate = JSON.stringify(formInput)
//     /* const headers = {
//       'Content-Type': 'application/json'
//   }; */
//   try {
//     const response = await fetch('http://localhost:9000/api/v1/beneficiaryRegistration/saveBeneficiaryPersonalDetails', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify(dataToSend),
//     });

//     if (response.ok) {
//       console.log('Form submitted successfully');
//       const jsonData = await response.json();
//       console.log(jsonData);

//       if(jsonData.length==0){
//         setShowNoRecordsMessage(true);
//       }
//     } else {
//       console.error('Form submission failed');
//     }
//   }  catch (e) {
//       console.log(e)
//     }
//   }

//   const handleInput = evt => {
//     const name = evt.target.name;
//     const newValue = evt.target.value;
//     setFormInput({ [name]: newValue });
//   };

//   //const [state, setState] = React.useState('');
//   const [gender, setGender] = React.useState('');
//   const [category, setCategory] = React.useState('');
//   const [minority, setminority] = React.useState('');
//   const [widow, setWidow] = React.useState('');
//   const [area, setArea] = React.useState('');

//   /* const handleChange = (event) => {
//     handleInput(event);
//     setState(event.target.value);
//   }; */

//   const handleChange1 = (event) => {
//     handleInput(event);
//     setGender(event.target.value);
//   };

//   const handleChange2 = (event) => {
//     handleInput(event);
//     setCategory(event.target.value);
//   };
//   const handleChange3= (event) => {
//     handleInput(event);
//     setminority(event.target.value);
//   };
//   const handleChange4= (event) => {
//     handleInput(event);
//     setWidow(event.target.value);
//   };
//   const handleChange5= (event) => {
//     handleInput(event);
//     setArea(event.target.value);
//   };
//  // const [selectedStateId, setSelectedState] = useState('');
//   /* const handleSelectState = (state) => {
//     setSelectedState(state);
//   }; */
//   const [selectedDistrict, setSelectedDistrict] = useState('');
//   const [selectedArea, setSelectedArea] = useState('');
//   const [selectedSubDistrict, setSelectedSubDistrict] = useState('');
//   const [selectedGramPanchayatWard, setSelectedGramPanchayatWard] = useState('');
//   //const [open, setOpen] = React.useState(false);

//   const handleSelectDistrict = (selectedDistrictId) => {
//     setSelectedDistrict(selectedDistrictId);
//     console.log(selectedSubDistrict);
//     console.log(selectedDistrict);
//   };
//   const handleSelectArea = (selectedAreaId) => {
//     setSelectedArea(selectedAreaId);
//     console.log(selectedArea);
//   };
//   const handleSelectSubDistrict = (selectedSubDistrictId) => {
//     console.log(selectedSubDistrictId);
//     setSelectedSubDistrict(selectedSubDistrictId);
//     console.log(selectedSubDistrict);
//   };

//   const handleGramPanchayatChange = (selectedGramPanchayatWardId) => {
//     console.log(selectedGramPanchayatWardId);
//     setSelectedGramPanchayatWard(selectedGramPanchayatWardId);
//     console.log(selectedGramPanchayatWard);
//     setFormInput({ gramPanchayatWardId: selectedGramPanchayatWardId });
//   };

//   //const [gramPanchayatId, setSelectedGramPanchayatId] = useState('');
//   /* const handleSelectGramPanchayat = (selectedGramPanchayatId) => {
//     setSelectedGramPanchayatId(selectedGramPanchayatId);
//   }; */
//   /* const [villageId, setSelectedVillageId] = useState('');
//   const handleSelectVillage = (selectedVillageId) => {
//     setSelectedVillageId(selectedVillageId);
//   };
//   const [habitationId, setSelectedHabitationId] = useState('');
//   const handleSelectHabitation = (selectedHabitationId) => {
//     setSelectedHabitationId(selectedHabitationId);
//   }; */

//  // const [getAllState, setAllState] = useState([])
//   const [getAllGender, setAllGender] = useState([])
//   const [getAllCategory, setAllCategory] = useState([])
//   const [getAllArea, setAllArea] = useState([])
//   const getGithubData = () => {
//     let endpoints = [
//       'http://localhost:9000/api/v1/master-management/findAllStates',
//       'http://localhost:9000/api/v1/master-management/findAllGender',
//       'http://localhost:9000/api/v1/master-management/findAllCategory',
//       'http://localhost:9000/api/v1/master-management/findAllArea'
//     ];
//     Promise.all(endpoints.map((endpoint) => axios.get(endpoint))).then(([{data: allGender},{data: allCategory},{data: allArea}] )=> {
//      // setAllState(allState)
//       setAllGender(allGender)
//       setAllCategory(allCategory)
//       setAllArea(allArea)
//     });
//   }

//   useEffect(() => {
//     getGithubData();
//   }, [])

//   /* const [selectedDistrict, setSelectedDistrict] = useState('')
//     const handleSelectDistrict = (districtId) => {
//         setSelectedDistrict(districtId)
//         console.log(districtId)  */
//    //}

//    const dataToSend = {
//     ...formInput,
//     //subDistrictMunicipalAreaId: subDistrictMunicipalAreaId,
//     //districtId: districtId,
//     //gramPanchayatId:gramPanchayatId,
//     //villageId:villageId,
//     //habitationId:habitationId
//   };
//   return(
//     <>

//     <div>
//        <form onSubmit={handleSubmit}>
//          <Grid container spacing={2}>

//         <Grid item xs={12} sm={4}>
//   <TextField
//   label="First Name"
//   name='firstName'
//   placeholder="Enter First Name"
//   variant='outlined'
//   fullWidth
//   onChange={handleInput}
//   />
//   </Grid>
//   <Grid item xs={12} sm={4}>
//   <TextField
//   label="Middle Name"
//   name='middleName'
//   placeholder="Enter Middle Name"
//   variant='outlined'
//   fullWidth
//   onChange={handleInput}
//   />
//   </Grid>
//   <Grid item xs={12} sm={4}>
//   <TextField
//   label="Last Name"
//   name='lastName'
//   placeholder="Enter Last Name"
//   variant='outlined'
//   fullWidth
//   onChange={handleInput}
//   />
//   </Grid>
//   <Grid item xs={12} sm={4}>
//   <TextField
//   label="Husband/Father Name"
//   name='fatherHusbandName'
//   placeholder="Enter Husband/Father Name"
//   variant='outlined'
//   fullWidth
//   onChange={handleInput}
//   />
//   </Grid>
//   <Grid item xs={12} sm={4}>
//   <FormControl fullWidth>
//   <InputLabel id="demo-simple-select-label">Gender</InputLabel>
//         <Select
//           labelId="demo-simple-select-label"
//           id="demo-simple-select"
//           label="Gender"
//           name="genderId"
//           value={gender}
//           onChange={handleChange1}
//         >
//            {getAllGender.map(item => (
//         <MenuItem key={item.genderId} value={item.genderId}>{item.genderName} </MenuItem>
//       ))}

//         </Select>
//         </FormControl>
//   </Grid>
//    <Grid item xs={12} sm={4}>

//  <LocalizationProvider dateAdapter={AdapterDayjs}>

//       <DatePicker label="Date of Birth"  format="DD-MM-YYYY" disableFuture name="dateOfBirth" slotProps={{ textField: { fullWidth: true } }} variant='outlined' ></DatePicker>

//     </LocalizationProvider>
//  </Grid>
//  <Grid item xs={12} sm={4}>
//   <TextField
//   label="Mobile No"
//   name='mobileNo'
//   placeholder="Enter Mobile No"
//   variant='outlined'
//   fullWidth
//   onChange={handleInput}
//   />
//   </Grid>
//  {/*  <Grid item xs={12} sm={4}>
//         <FormControl fullWidth>
//   <InputLabel id="demo-simple-select-label">State</InputLabel>
//         <Select
//           labelId="demo-simple-select-label"
//           id="demo-simple-select"
//           label="State"
//           name="stateId"
//           value={state}
//           onChange={handleChange}
//         >

//            {getAllState.map(item => (
//         <MenuItem key={item.stateId} value={item.stateId}>{item.stateName} </MenuItem>
//       ))}
//         </Select>
//         </FormControl>
//   </Grid>
//            <Grid item xs={12} sm={4}>
//               <FormControl fullWidth>
//                 <DistrictList onSelectDistrict={handleSelectDistrict} />
//               </FormControl>
//             </Grid>
//             <Grid item xs={12} sm={4}>
//               <FormControl fullWidth>
//                 <SubDistrictList selectedDistrictId={districtId} onSelectSubDistrict={handleSelectSubDistrict} />
//               </FormControl>
//             </Grid>
//             <Grid item xs={12} sm={4}>
//               <FormControl fullWidth>
//                 <GramPanchayatList selectedSubDistrictMunicipalAreaId={subDistrictMunicipalAreaId} onSelectSubDistrictMunicipalArea={handleSelectGramPanchayat} />
//               </FormControl>
//             </Grid> */}
//             <Grid item xs={12} sm={4}>
//               <FormControl fullWidth>
//                 <StateList />
//               </FormControl>
//             </Grid>
//             <Grid item xs={12} sm={4}>
//               <FormControl fullWidth>
//                 <DistrictList
//                   setSelectedDistrict={setSelectedDistrict}
//                   onSelectDistrict={handleSelectDistrict}
//                 />
//               </FormControl>
//             </Grid>
//             <Grid item xs={12} sm={4}>
//               <FormControl fullWidth>
//                 <AreaList selectedDistrict={selectedDistrict}
//                 selectedArea={selectedArea}
//                 onSelectArea={handleSelectArea} />
//               </FormControl>
//             </Grid>
//             <Grid item xs={12} sm={4}>
//               <FormControl fullWidth>
//                 <SubDistrictList
//                   selectedAreaId={selectedArea}
//                   selectedDistrictId={selectedDistrict}
//                   setSelectedSubDistrict={setSelectedSubDistrict}
//                   onSelectSubDistrict={handleSelectSubDistrict}
//                 />
//               </FormControl>
//             </Grid>
//             <Grid item xs={12} sm={4}>
//               <FormControl fullWidth>
//                 <GramPanchayatList
//                   selectedSubDistrictMunicipalAreaId={selectedSubDistrict}
//                   setSelectedGramPanchayat={setSelectedGramPanchayatWard}
//                   onSelectGramPanchayat={handleGramPanchayatChange}
//                 />
//               </FormControl>
//             </Grid>

//             {/* <Grid item xs={12} sm={4}>
//               <FormControl fullWidth>
//                 <VillageList selectedGramPanchayatId={gramPanchayatId} onSelectGramPanchayat={handleSelectVillage} />
//               </FormControl>
//             </Grid>
//             <Grid item xs={12} sm={4}>
//               <FormControl fullWidth>
//                 <HabitationList selectedVillageId={villageId} onSelectVillage={handleSelectHabitation} />
//               </FormControl>
//             </Grid> */}
//  <Grid item xs={12} sm={4}>
//   <TextField
//   label="Address1"
//   name='address1'
//   placeholder="Enter Address1"
//   variant='outlined'
//   fullWidth
//   onChange={handleInput}
//   />
//   </Grid>
//   <Grid item xs={12} sm={4}>
//   <TextField
//   label="Address2"
//   name='address2'
//   placeholder="Enter Address2"
//   variant='outlined'
//   fullWidth
//   onChange={handleInput}
//   />
//   </Grid>
//   <Grid item xs={12} sm={4}>
//   <TextField
//   label="Address3"
//   name='address3'
//   placeholder="Enter Address3"
//   variant='outlined'
//   fullWidth
//   onChange={handleInput}
//   />
//   </Grid>
//   <Grid item xs={12} sm={4}>
//   <TextField
//   label="Pincode"
//   name='pincode'
//   placeholder="Enter Pincode"
//   variant='outlined'
//   fullWidth
//   onChange={handleInput}
//   />
//   </Grid>
// <Grid item xs={12} sm={4}>
//   <FormControl fullWidth>
//   <InputLabel id="demo-simple-select-label">Category</InputLabel>
//         <Select
//           labelId="demo-simple-select-label"
//           id="demo-simple-select"
//           label="Category"
//           name="categoryId"
//           value={category}
//           onChange={handleChange2}
//         >
//            {getAllCategory.map(item => (
//         <MenuItem key={item.categoryId} value={item.categoryId}>{item.categoryName} </MenuItem>
//       ))}

//         </Select>
//         </FormControl>
//   </Grid>
//    <Grid item xs={12} sm={4}>
//   <TextField
//   label="Annual Income"
//   name='annualIncome'
//   placeholder="Enter Annual Income "
//   variant='outlined'
//   fullWidth
//   onChange={handleInput}
//   />
//   </Grid>
//   <Grid item xs={12} sm={4}>
//   <TextField
//   label="EPIC No"
//   name='epicNo'
//   placeholder="Enter EPIC No "
//   variant='outlined'
//   fullWidth
//   onChange={handleInput}
//   />
//   </Grid>
//   <Grid item xs={12} sm={4}>
//   <TextField
//   label="Ration Card No"
//   name='rationcardNo'
//   placeholder="Enter Ration Card No"
//   variant='outlined'
//   fullWidth
//   onChange={handleInput}
//   />
//   </Grid>
//  <Grid item xs={12} sm={4}>
//   <FormControl fullWidth>
//   <InputLabel id="demo-simple-select-label">Minority Status</InputLabel>
//         <Select
//           labelId="demo-simple-select-label"
//           id="demo-simple-select"
//           label="Minority Status"
//           name="minorityStatus"
//           value={minority}
//           onChange={handleChange3}
//         >
//            <MenuItem value={true}>Yes</MenuItem>
//            <MenuItem value={false}>No</MenuItem>

//         </Select>
//         </FormControl>
//   </Grid>
//    <Grid item xs={12} sm={4}>
//   <FormControl fullWidth>
//   <InputLabel id="demo-simple-select-label">Widow</InputLabel>
//         <Select
//           labelId="demo-simple-select-label"
//           id="demo-simple-select"
//           label="Widow"
//           name="widowsStatus"
//           value={widow}
//           onChange={handleChange4}
//         >
//            <MenuItem value={true}>Yes</MenuItem>
//            <MenuItem value={false}>No</MenuItem>

//         </Select>
//         </FormControl>
//   </Grid>
//   <Grid item xs={12} sm={4}>
//   <FormControl fullWidth>
//   <InputLabel id="demo-simple-select-label">Area</InputLabel>
//         <Select
//           labelId="demo-simple-select-label"
//           id="demo-simple-select"
//           label="Area"
//           name="ruralUrbanAreaId"
//           value={area}
//           onChange={handleChange5}
//         >
//            {getAllArea.map(item => (
//         <MenuItem key={item.ruralUrbanAreaId} value={item.ruralUrbanAreaId}>{item.ruralUrbanAreaName} </MenuItem>
//       ))}

//         </Select>
//         </FormControl>
//   </Grid>

//   {/*<Grid item xs={12} sm={4}>
//   <FormControl fullWidth>
//   <InputLabel id="demo-simple-select-label">District</InputLabel>
//         <Select
//           labelId="demo-simple-select-label"
//           id="demo-simple-select"
//           label="District"
//           name="districtId"
//           // value={levelOfApp}
//           // onChange={handleChange1}
//         >
//            <MenuItem value="1">1</MenuItem>
//            <MenuItem value="2">2</MenuItem>
//            <MenuItem value="3">3</MenuItem>

//         </Select>
//         </FormControl>
//   </Grid>

//   <Grid item xs={12} sm={4}>
//   <FormControl fullWidth>
//   <InputLabel id="demo-simple-select-label">Sub District/Municipal Area</InputLabel>
//         <Select
//           labelId="demo-simple-select-label"
//           id="demo-simple-select"
//           label="Sub District/Municipal Area"
//           name="subDistrictId"
//           // value={levelOfApp}
//           // onChange={handleChange1}
//         >
//            <MenuItem value="1">1</MenuItem>
//            <MenuItem value="2">2</MenuItem>
//            <MenuItem value="3">3</MenuItem>

//         </Select>
//         </FormControl>
//   </Grid>
//   <Grid item xs={12} sm={4}>
//   <FormControl fullWidth>
//   <InputLabel id="demo-simple-select-label">Gram Panchayat/Ward</InputLabel>
//         <Select
//           labelId="demo-simple-select-label"
//           id="demo-simple-select"
//           label="Gram Panchayat/Ward"
//           name="gramPanchayatId"
//           defaultValue="1"
//           // value={levelOfApp}
//           // onChange={handleChange1}
//         >
//            <MenuItem value="1">1</MenuItem>
//            <MenuItem value="2">2</MenuItem>
//            <MenuItem value="3">3</MenuItem>

//         </Select>
//         </FormControl>
//   </Grid>
//   <Grid item xs={12} sm={4}>
//   <FormControl fullWidth>
//   <InputLabel id="demo-simple-select-label">Village</InputLabel>
//         <Select
//           labelId="demo-simple-select-label"
//           id="demo-simple-select"
//           label="Village"
//           name="village"
//           // value={levelOfApp}
//           // onChange={handleChange1}
//         >
//            <MenuItem value="Rural">Rural</MenuItem>
//            <MenuItem value="Urban">Urban</MenuItem>

//         </Select>
//         </FormControl>
//   </Grid>
//   <Grid item xs={12} sm={4}>
//   <FormControl fullWidth>
//   <InputLabel id="demo-simple-select-label">Habitation</InputLabel>
//         <Select
//           labelId="demo-simple-select-label"
//           id="demo-simple-select"
//           label="Habitation"
//           name="habitation"
//           // value={levelOfApp}
//           // onChange={handleChange1}
//         >
//            <MenuItem value="Rural">Rural</MenuItem>
//            <MenuItem value="Urban">Urban</MenuItem>

//         </Select>
//         </FormControl>
//   </Grid>
//   */}
//           <Grid item xs={12} alignItems="center">
//  <Button type="submit" variant="contained" color="secondary">ADD</Button>
//   </Grid>
//           </Grid>
//           </form>
//           </div>

//         </>
//   )
// }
// export default BeneficiaryPersonalDetails;
