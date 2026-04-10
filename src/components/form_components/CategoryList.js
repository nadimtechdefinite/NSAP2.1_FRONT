import React, { useState, useEffect } from 'react';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import axiosInstance from 'hooks/useAuthTokenUrl';

	const CategoryList = ({onSelectCategory}) => {
    const [getCategory, setCategory] = useState([]);
    const [getSelectedCategory, setSelectedCategory] = useState('');

    useEffect(() => {
        // Fetch User Type from your API
        const fetchCategory = async () => {
            try {
                const getUrl='/common/findAllCategory';
                const response = await axiosInstance.get(getUrl);
                const data = response.data;
                setCategory(data);
            } catch (error) {
                console.error('Error fetching Gender List :', error);
            }
        };

        fetchCategory();
    }, []);

    const handleCategoryChange = (event) => {
        const categoryId = event.target.value;
        setSelectedCategory(categoryId);
        onSelectGender(categoryId);
    };

    return (
        <FormControl>
            <InputLabel id="Category-label">Category</InputLabel>
            <Select
                 labelId="Category-label"
                 id="categoryId"
                 label="Category-label"
                 name="categoryId"
                value={getSelectedCategory}
                onChange={handleCategoryChange}
            >
                {getCategory.map((item) => (
                    <MenuItem key={item.categoryId} value={item.categoryId} onClick={() => onSelectCategory(item.categoryId)}>
                        {item.categoryName}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
};

export default CategoryList;
