import React, { useState } from 'react';
import { Checkbox } from 'antd';

const CheckboxGroup = Checkbox.Group;

const CustomCheckboxGroup = (props) => {
    const { dataSource, defaultValue, onChange, value } = props;
    const [checkedValue, setCheckedValue] = useState(defaultValue || value);
    const handleChange = (checkedValue) => {
        setCheckedValue(checkedValue);
        onChange && onChange(checkedValue);
    };
    return <div className='custom-schema-component'>
        <CheckboxGroup
            {...props}
            options={dataSource}
            value={checkedValue}
            onChange={handleChange}
        />
    </div>;
};

export default CustomCheckboxGroup;
