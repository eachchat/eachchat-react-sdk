import React, { useState } from 'react';
import { Select } from 'antd';

const CustomMultipleSelect = (props) => {
    const { dataSource, datasetId, defaultValue, onChange } = props;
    const [selectedValue, setSelectedValue] = useState(defaultValue);
    const handleChange = (selectedValue) => {
        setSelectedValue(selectedValue);
        onChange && onChange(selectedValue);
    };
    return <div className='custom-schema-component'>
        <Select
            {...props}
            mode="multiple"
            style={{ width: '100%' }}
            options={dataSource}
            value={selectedValue}
            onChange={handleChange}
        />
    </div>;
};

export default CustomMultipleSelect;
