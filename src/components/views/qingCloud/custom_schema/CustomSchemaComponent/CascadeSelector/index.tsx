/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import { noop } from 'lodash';
import { ISchemaFieldComponentProps } from '@formily/react-schema-renderer';

import CascadeSelector from './cascade-selector';
import { labelValueRenderer } from '../qxp/utils';

const DataValueRenderer = ({ value, schema, className }) => {
    const content = labelValueRenderer(value);
    return (
        <span title={typeof content === 'string' ? content : ''} className={className}>{ content }</span>
    );
};

function CascadeSelectorWarp(props: ISchemaFieldComponentProps): JSX.Element {
    const { defaultValueFrom } = props.props['x-internal'];

    useEffect(() => {
    // clear cascade when change value source
    // when initialValue not undefined, is edit mode
        if (!props.initialValue) {
            if (props?.mutators?.change) props.mutators.change(undefined);
        }
    }, [defaultValueFrom]);

    if (props.props.readOnly) {
        return <DataValueRenderer value={props.value} schema={props.schema} className={undefined} />;
    }

    return (
        <CascadeSelector
            {...props.props['x-component-props']}
            defaultValueFrom={defaultValueFrom}
            onChange={props?.mutators?.change ? props?.mutators?.change : noop}
            value={props.value}
        />
    );
}

CascadeSelectorWarp.isFieldComponent = true;

export default CascadeSelectorWarp;
