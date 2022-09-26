import React, { useState } from 'react';
import {
    SchemaForm,
    SchemaMarkupField as Field,
    FormButtonGroup,
    Submit,
    Reset,
} from '@formily/antd'; // 或者 @formily/next
import {
    Input,
    Radio,
    Checkbox,
    Select,
    DatePicker,
    NumberPicker,
    TimePicker,
    Upload,
    Switch,
    Range,
    Transfer,
    Rating,
} from '@formily/antd-components'; // 或者@formily/next-components
import 'antd/dist/antd.css';
// import axios from "axios";

// import { schemaQxp, schemaCreateForm, schemaEditForm, schemaViewForm, initialValues } from './schemaObj';

interface IProps{
    schema: Array<any>;
    initialValues: object;
    edit?:boolean;
}
const components = {
    Input,
    // Radio: Radio.Group,
    // Checkbox: Checkbox.Group,
    TextArea: Input.TextArea,
    // NumberPicker,
    // Select,
    // Switch,
    // DatePicker,
    // DateRangePicker: DatePicker.RangePicker,
    // YearPicker: DatePicker.YearPicker,
    // MonthPicker: DatePicker.MonthPicker,
    // WeekPicker: DatePicker.WeekPicker,
    // TimePicker,
    // TimeRangePicker: TimePicker.RangePicker,
    // Upload,
    // Range,
    // Rating,
    // Transfer,
};
function Form(props: IProps) {
    const { schema, initialValues, edit } = props;
    return (
        <>
            <SchemaForm
                initialValues={initialValues}
                schema={schema}
                components={components}
                // onSubmit={handleSubmit}
                editable={edit}
            />
        </>
    );
}

export default Form;

