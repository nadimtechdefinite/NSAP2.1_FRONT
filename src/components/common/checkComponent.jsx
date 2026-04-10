import React, { useState, useEffect } from "react";
import { Checkbox, FormControlLabel } from "@mui/material";
import MainCard from 'ui-component/cards/MainCard';

const CheckComponent = ({ options, onOptionValuesChange }) => {
    const [optionValues, setOptionValues] = useState({});

    const handleCheckboxChange = (optionKey) => (event) => {
        setOptionValues((prevValues) => ({
            ...prevValues,
            [optionKey]: event.target.checked ? true : false,
        }));
    };

    useEffect(() => {
        onOptionValuesChange(optionValues);
    }, [optionValues, onOptionValuesChange]);


    return (
        <div>
            <div style={{ display: "flex", alignItems: "center" }}>
                <MainCard>
                    {Object.entries(options).map(([key, value]) => (
                        <FormControlLabel
                            key={key}
                            control={
                                <Checkbox
                                    checked={!!optionValues[key]}
                                    onChange={handleCheckboxChange(key)}
                                />
                            }
                            label={value}
                        />
                    ))}
                </MainCard>
            </div>
        </div>
    );
};

export default CheckComponent;


//      const [selectedOptions, setSelectedOptions] = useState({});

//     const options = { IGNOAPS: "IGNOAPS",   IGNWPS: "IGNWPS", IGNDPS: "IGNDPS", NFBS: "NFBS" };

//     const handleSearchOptionValuesChange = (newOptionValues) => {
//         const ss = Object.keys(newOptionValues).filter((key) => newOptionValues[key]);
//         if (JSON.stringify(ss) !== JSON.stringify(selectedOptions)) {
//             setSelectedOptions(ss);
//         }
//     };
//            <SearchComponent options={options} onOptionValuesChange={handleSearchOptionValuesChange} />
