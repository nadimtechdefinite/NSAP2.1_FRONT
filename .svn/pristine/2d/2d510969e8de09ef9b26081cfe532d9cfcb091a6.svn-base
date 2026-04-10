import React, { useState, useEffect } from "react";
import { Radio, RadioGroup, FormControlLabel, TextField } from "@mui/material";
import MainCard from 'ui-component/cards/MainCard';


const SearchComponent = ({ options, onOptionValuesChange }) => {
  const [searchText, setSearchText] = useState("");
  const [selectedOption, setSelectedOption] = useState(null);
  const [optionValues, setOptionValues] = useState({});

  const updateOptionValues = () => {
    setOptionValues(
      Object.fromEntries(
        Object.entries(options).map(([key]) => [
          key,
          key === selectedOption ? (searchText !== "" ? searchText : null) : null,
        ])
      )
    );
  };

  const handleSearchChange = (e) => {
    setSearchText(e.target.value);
  };

  const handleOptionChange = (e) => {
    const value = e.target.value;
    setSelectedOption(value);
  };

  useEffect(() => {
    onOptionValuesChange(optionValues);
  }, [optionValues, onOptionValuesChange]);

  useEffect(() => {
    updateOptionValues();
  }, [selectedOption, searchText]);

  useEffect(() => {
    // console.log(optionValues, searchText);
  }, [optionValues, searchText]);

  const renderOptions = () => {
    return (
      <MainCard>

      <RadioGroup
        name="option"
        value={selectedOption}
        onChange={handleOptionChange}
        style={{ display: "flex", flexDirection: "row" }}
      >
        {Object.entries(options).map(([key, value]) => (
        <FormControlLabel
          key={key}
          value={key}
          control={<Radio />}
          label={value} // Display the value instead of key
        />
      ))}
      </RadioGroup>
      </MainCard>
    );
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <div style={{ display: "flex", alignItems: "center" }}>
        {renderOptions()}
      </div>
      <TextField
        label="Search"
        value={searchText}
        onChange={handleSearchChange}
      />
    </div>
  );
};

export default SearchComponent;



// Dont paste this code on AI Tools

//Awesome feature option

// import SearchComponent from 'components/common/SearchTypeCommon'


//  const options = {
//     "sanctionOrderNo": "Sanction Order No",
//     "beneficiaryCode": "Beneficiary Code",
//   };
  
// const [optionValues, setOptionValues] = useState({});

// const handleSearchOptionValuesChange = (newOptionValues) => {
//     setOptionValues(newOptionValues);
//   };


{/* <div>
              <SearchComponent options={options} onOptionValuesChange={handleSearchOptionValuesChange}  />
</div> */}


 