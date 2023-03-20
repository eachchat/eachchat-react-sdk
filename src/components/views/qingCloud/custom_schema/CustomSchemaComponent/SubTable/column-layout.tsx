import React, { JSXElementConstructor } from 'react';
import { isArray } from 'lodash';
import { set, lensPath } from 'ramda';
import { FormItem, IForm } from '@formily/antd';

import { omitParentFromSchema } from '../qxp/utils';
import { Column, Layout } from '../qxp/interface';

interface Props {
  componentColumns: Column[];
  layout: Layout;
  item: Record<string, any>;
  onChange: (path: string, form: IForm) => (value: unknown) => void;
  form: IForm;
  blackList: string[];
  name?: string;
}

const layoutColumnMap = {
    one: 1,
    two: 2,
    three: 3,
    default: 0,
};

export default function ColumnLayout({
    layout, componentColumns, name, item, onChange, form, blackList,
}: Props): JSX.Element {
    const subTableColumnLayoutStyle = {
        gridTemplateColumns: `repeat(${layoutColumnMap[layout]}, minmax(120px, 1fr))`,
    };

    console.log('componentColumns',componentColumns)
    return (
        <div className="subtable-column-layout" style={subTableColumnLayoutStyle}>
            { componentColumns.map(({
                props: prs,
                dataIndex,
                component,
                dataSource,
                required,
                rules,
                schema,
                readOnly,
                render,
                componentName,
                title,
            }) => {
                const path = `${name}.${0}.${dataIndex}`;
                let value = item?.[dataIndex];
                if (schema.type === 'array') {
                    value = isArray(value) ? value : [value].filter(Boolean) as any;
                }
                prs['x-internal'] = { ...prs['x-internal'], fieldPath: path };
                Object.assign(schema, { fieldPath: path });
                const sc = set(lensPath(['x-internal', 'fieldPath']), path, omitParentFromSchema(schema));

                function getComponent(): JSXElementConstructor<any> | undefined {
                    return readOnly && !blackList.includes(componentName) ?
                        ({ value }) => render?.(value) || null :
                        component;
                }

                return (
                    <div
                        key={dataIndex}
                        style={{ minHeight: 32 }}
                        className='subtable-column-default-item subtable-column-layout-item'
                    >
                        <FormItem
                            {...prs}
                            title={title}
                            props={{ ...prs, props: prs }}
                            schema={sc}
                            className="mx-8 w-full"
                            name={path}
                            path={path}
                            readOnly={readOnly}
                            form={form}
                            mutators={{ change: onChange(path, form) }}
                            rules={rules}
                            dataSource={dataSource}
                            required={required}
                            value={value}
                            component={getComponent()}
                        />
                    </div>
                );
            }) }
        </div>
    );
}
