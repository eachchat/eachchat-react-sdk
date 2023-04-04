/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { ISchemaFieldComponentProps } from '@formily/react-schema-renderer';
import { CloseOutlined } from '@ant-design/icons';
import { Modal } from 'antd';

import SchemaTable from '../QxpSchemaTable';
import { FilterConfig, LabelValue } from '../qxp/interface';
import AssociatedDataValueRender from './AssociatedDataValueRender';
import { labelValueRenderer } from '../qxp/utils';

import './index.pcss';
import mockData from './mockData';

type Props = {
  appID: string;
  associationTableID: string;
  fieldName: string;
  value?: LabelValue;
  placeholder?: string;
  filterConfig?: FilterConfig;
  onChange?: (dataRow: Record<string, any> | null) => void;
  selectedValue?: string;
};

export function AssociatedData(props: Props): JSX.Element {
    const {
        appID,
        associationTableID,
        placeholder,
        filterConfig,
        fieldName,
        value,
        selectedValue,
        onChange,
    } = props;
    const [modalVisible, setVisible] = useState(false);

    useEffect(() => {
        onChange?.(null);
    }, [fieldName, associationTableID]);

    if (!associationTableID) {
        return (
            <div className='ant-input flex justify-between items-center h-32'>未设置关联记录表</div>
        );
    }

    const rowSelection = {
        onChange: (selectedRowKeys: React.Key[], selectedRows: any) => {
            setVisible(false);
            onChange?.(selectedRows[0]);
        },
    };

    return (
        <div className='w-full h-32 AssociatedData fs12 border br5 flex items-center pl5 pr5'>
            <div className={`ant-input h-full flex justify-between py-2 items-center  w-full`}>
                <div className='flex-1'>
                    { value ? (
                        <span className='associated-span nowrap'>
                            { value.label }
                            <CloseOutlined onClick={() => onChange?.(null)} size={16} />
                        </span>
                    ) : <span className='text-placeholder nowrap'>{ placeholder }</span> }
                </div>
                <span className='cursor-pointer text-color-primary nowrap ml10' onClick={() => setVisible(true)}>
                    选择关联数据
                </span>
            </div>

            <Modal
                title="选择关联数据"
                open={modalVisible}
                onCancel={() => setVisible(false)}
                footer={null}
                width="50%"
            >
                <SchemaTable
                    scroll={{ y: 500, x: 700 }}
                    size="small"
                    rowSelection={{
                        type: 'radio',
                        defaultSelectedRowKeys: [selectedValue],
                        ...rowSelection,
                    }}
                    tableLayout="fixed"
                />
            </Modal>
        </div>
    );
}

export default function AssociatedDataWrap(p: ISchemaFieldComponentProps): JSX.Element {
    const [selectedValue, setSelectedValue] = useState(p?.initialValue?.value);
    if (p.props.readOnly) {
        return <AssociatedDataValueRender value={p.value} schema={p.schema} />;
    }

    function executeAssignMent(dataRow: Record<string, any>): void {
        const { setFieldState } = p?.form ?? {};
        const associativeConfig = p['x-component-props']?.associativeConfig ||
        p.props['x-component-props'].associativeConfig;

        associativeConfig && associativeConfig.rules.forEach((
            { dataSource, dataTarget }: any,
        ) => {
            const fullPath = p?.path.split('.');
            const relativePath = fullPath.slice(0, fullPath.length - 1).join('.');

            setFieldState(`${relativePath}.${dataTarget}`, (state) => {
                state.value = dataRow[dataSource];
            });
        });
    }

    return (
        <AssociatedData
            {...p.props['x-component-props']}
            value={p.value}
            readOnly={!!p.props.readOnly}
            selectedValue={selectedValue}
            onChange={(dataRow) => {
                if (!dataRow) {
                    p.mutators.change(undefined);
                    setSelectedValue('');
                    return;
                }
                setSelectedValue(dataRow?._id);
                const value = dataRow[p.props['x-component-props'].fieldName];
                const label = value ? labelValueRenderer(value) : '--';
                executeAssignMent(dataRow);
                p.mutators.change({ label, value: dataRow._id });
            }}
            filterConfig={p['x-component-props']?.filterConfig || p.props['x-component-props'].filterConfig}
        />
    );
}

AssociatedDataWrap.isFieldComponent = true;
