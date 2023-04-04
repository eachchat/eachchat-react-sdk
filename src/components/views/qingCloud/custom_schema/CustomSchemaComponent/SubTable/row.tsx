import React from 'react';
import cs from 'classnames';
import { isArray } from 'lodash';
import { FormItem, IForm, IMutators } from '@formily/antd';
import { MegaLayout } from '@formily/antd-components';
import { set, lensPath } from 'ramda';
import { DeleteOutlined } from '@ant-design/icons';

import { Column, Layout } from '../qxp/interface';
import { omitParentFromSchema } from '../qxp/utils';
import ColumnLayout from './column-layout';

// import type { Column } from './index';
// import type { Layout } from '../convertor';
// import ColumnLayout from './column-layout';
// import { omitParentFromSchema } from './utils';

interface Props {
  index: number;
  componentColumns: Column[];
  item: Record<string, any>;
  form: IForm;
  mutators: IMutators;
  layout: Layout;
  name?: string;
  removeAble?: boolean;
}

export default function SubTableRow({
    index, item, componentColumns, name, form, mutators, layout, removeAble = true,
}: Props): JSX.Element {
    function onRemoveRow(mutators: IMutators, index: number): void {
        mutators.remove(index);
    }

    function onChange(path: string, form: IForm) {
        return (value: unknown): void => {
            form.setFieldValue(path, value);
        };
    }

    const blackList = ['userpicker', 'organizationpicker', 'datepicker'];

    if (layout && layout !== 'default') {
        return (
            <ColumnLayout
                layout={layout}
                componentColumns={componentColumns}
                name={name}
                item={item}
                onChange={onChange}
                form={form}
                blackList={blackList}
            />
        );
    }

    return (
        componentColumns.length ?
            <div>
                { index === 0 && (
                    <div className="flex items-center justify-between border-bottom">
                        <div
                            className="flex-1 grid border-gray-300 border-t-1 w-full"
                            style={{
                                gridTemplateColumns: `repeat(${componentColumns.length}, minmax(120px, 1fr))`,
                            }}
                        >
                            { componentColumns.map(({ title, required }, idx) => (
                                <div key={idx}
                                    className={cs(
                                        {
                                            'border-r-1 border-gray-300 p5': idx < componentColumns.length,
                                        }, 'flex items-center justify-center subtable-column-default-item overflow-auto',
                                    )}
                                >
                                    { required ? (
                                        <span className="mr-5" style={{ color: '#a87366' }}>*</span>
                                    ) : '' }
                                    { title }
                                </div>
                            )) }
                        </div>
                        <div
                            className={cs('border-r-1 border-gray-300 flex items-center justify-center subtable-column-default-item overflow-auto w-72 p5')}>
                               操作
                        </div>
                    </div>
                ) }
                <div className="flex items-center justify-between border-bottom">
                    <div
                        className="flex-1 grid border-gray-300 border-t-1 w-full"
                        style={{
                            gridTemplateColumns: `repeat(${componentColumns.length}, minmax(120px, 1fr))`,
                        }}
                    >
                        { componentColumns.map(({
                            dataIndex, component, props: prs, dataSource, required, rules, schema, readOnly, render, componentName,
                        }, idx) => {
                            const path = `${name}.${index}.${dataIndex}`;
                            let value = item?.[dataIndex];
                            if (schema.type === 'array') {
                                value = isArray(value) ? value : [value].filter(Boolean) as any;
                            }
                            prs['x-internal'] = { ...prs['x-internal'], fieldPath: path };
                            Object.assign(schema, { fieldPath: path });
                            const sc = set(
                                lensPath(['x-internal', 'fieldPath']),
                                path,
                                omitParentFromSchema(schema),
                            );

                            return (
                                <div
                                    key={dataIndex}
                                    style={{ minHeight: 32 }}
                                    className={cs(
                                        {
                                            'border-r-1 border-gray-300 p5': idx < componentColumns.length,
                                        }, 'flex  items-center justify-center subtable-column-default-item overflow-auto',
                                    )}
                                >
                                    <MegaLayout wrapperCol={24}>
                                        <FormItem
                                            {...prs}
                                            props={{ ...prs, props: prs }}
                                            schema={sc}
                                            className="mx-8 my-8 w-full"
                                            name={path}
                                            path={path}
                                            readOnly={readOnly}
                                            form={form}
                                            mutators={{ change: onChange(path, form) }}
                                            rules={rules}
                                            dataSource={dataSource}
                                            required={required}
                                            value={value}
                                            component={
                                                readOnly && !blackList.includes(componentName) ?
                                                    ({ value }) => render?.(value) || null : component
                                            }
                                        />
                                    </MegaLayout>
                                </div>
                            );
                        }) }
                    </div>
                   
                    <div
                        className="px-22 p6 w-72 border-gray-300 border-t-1 self-stretch flex items-center subtable-action-wrap"
                    >
                        { removeAble ? (
                            <DeleteOutlined
                                className=""
                                style={{
                                    fontSize: "14px",
                                }}
                                onClick={() => onRemoveRow(mutators, index)}
                            />
                        ) : <span className="w-28">-</span> }
                    </div>
                </div>
            </div> :
            <div className='no-data' />
    );
}
