import React from 'react';
import { noop } from 'lodash';
import { ISchemaFieldComponentProps } from '@formily/react-schema-renderer';

import UserPicker from './user-picker';

const UserPickerWrap = (formField: ISchemaFieldComponentProps): JSX.Element => {
    const { optionalRange, defaultValues, defaultRange } = formField.props;
    console.log('UserPicker', formField);
    return (
        <UserPicker
            {...formField.props['x-component-props']}
            onChange={formField?.mutators?.change ? formField?.mutators?.change : noop}
            options={formField.props.enum}
            value={formField.value}
            editable={formField.editable ?? !formField.readOnly}
            optionalRange={optionalRange}
            defaultRange={defaultRange}
            defaultValues={defaultValues}
        />
    );
};

UserPickerWrap.isFieldComponent = true;

export default UserPickerWrap;
