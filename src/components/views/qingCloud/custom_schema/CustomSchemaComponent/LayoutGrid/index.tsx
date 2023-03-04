import React from 'react';
import { ISchemaFieldComponentProps } from '@formily/react-schema-renderer';

import { blockStyle } from './utils';


function LayoutGrid(p: ISchemaFieldComponentProps): JSX.Element {
    const columns = p.props?.['x-component-props'].columns || 2;
    try {
        p.children.forEach((item: any) => {
            const { schema } = item.props;
            const { type } = schema;
            if (type==='string') {
                const node = schema['x-component-props'];
                schema.default = node.value;
            } else {
                const node = schema?.properties;
                for (const key in node) {
                    const temp = node[key]['x-component-props'];
                    temp.defaultValue = temp?.value;
                    node[key].default = temp?.value;
                }
            }
        });
    } catch (error) {
        console.log(error);
    }
    const columnsWidth = 1/columns*100 + '%';
    return (
        <div
            className="grid grid-layout gap-10"
            style={{ gridTemplateColumns: `repeat(${columns}, ${columnsWidth})` }}
        >
            { React.Children.toArray(p.children).map((itm: any, idx: number) => {
                return (
                    <div
                        key={idx}
                        style={blockStyle(itm?.props?.schema?.['x-component'], columns)}
                    >
                        { itm }
                    </div>
                );
            }) }
        </div>
    );
}

LayoutGrid.isVirtualFieldComponent = true;

export default LayoutGrid;
