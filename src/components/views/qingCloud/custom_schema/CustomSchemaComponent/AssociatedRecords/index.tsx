import React, { useEffect, useRef, useState } from 'react';
import { Column } from 'react-table';
import { get } from 'lodash';
import cs from 'classnames';
import { ISchemaFieldComponentProps } from '@formily/react-schema-renderer';
import { DeleteOutlined } from '@ant-design/icons';
import { ISchema } from '@formily/antd';
import { Table } from 'antd';
import { DownOutlined } from '@ant-design/icons';

import SelectRecordsModal from './select-records-modal';
import { FilterConfig } from '../qxp/interface';
import { isMeanless } from '../qxp/utils';
import { schemaToMap } from '../qxp/schema-convert';
import FormDataValueRenderer from '../qxp/form-data-value-renderer';

type Props = {
  defaultValues: Record<string, any>[];
  appID: string;
  tableID: string;
  columns: string[];
  value: Record<string, any>[];
  multiple: boolean;
  associatedTable: ISchema;
  onChange: (value: Record<string, any>[]) => void;
  filterConfig?: FilterConfig;
  readOnly?: boolean;
  className?: string;
};

function computeTableColumns(schema: ISchema, columns: string[]): Column<Record<string, any>>[] {
    return columns.map((fieldKey) => {
        const fieldSchema = get(schemaToMap(schema), fieldKey, { title: '' });
        return {
            key: fieldKey,
            title: fieldSchema.title || fieldKey,
            className: 'nowrap',
            render: (rowData: Record<string, any>) => {
                if (isMeanless(rowData[fieldKey])) {
                    return '无数据';
                }

                return (
                    <FormDataValueRenderer schema={fieldSchema} value={rowData[fieldKey]} />
                );
            },
        };
    }).filter(({ key }) => key !== '_id');
}

const getSelecteValue = (data) => {
    return data.map(item => item?._id);
};
function AssociatedRecords({
    defaultValues,
    associatedTable,
    columns,
    value,
    appID,
    tableID,
    multiple,
    onChange,
    filterConfig,
    readOnly,
    className,
}: Props): JSX.Element {
    const [selectedValue, setSelectValue] = useState(getSelecteValue(defaultValues));
    const [codeHide, setCodeHide] = useState(defaultValues.length>3);

    const tableColumns = computeTableColumns(associatedTable, columns);
    !readOnly && tableColumns.push({
        key: 'action',
        title: '操作',
        className: 'nowrap',
        fixed: 'right',
        render: (_, row, index) => {
            return (
                <DeleteOutlined
                    size={24}
                    onClick={() => {
                        onChange(value.filter(({ _id }) => _id !== row._id));
                        setSelectValue(getSelecteValue(value.filter(({ _id }) => _id !== row._id)));
                    }}
                />
            );
        },
    });

    const handleCodeHide = () => {
        setCodeHide(false);
    };

    return (
        <div className='w-full'>
            <div className={cs('w-full overflow-x-auto', className)}>
                <div className={codeHide ? 'set-code-hide' : ''}>
                    <Table
                        columns={tableColumns}
                        dataSource={value}
                        pagination={false}
                        scroll={{ x: '100%' }}
                        tableLayout="auto"
                    />
                    {
                        codeHide &&
                        <div className="hide-preCode-box">
                            <span className="hide-preCode-bt" onClick={handleCodeHide}>
                                <DownOutlined
                                    style={{
                                        fontSize: "20px",
                                        fontWeight: "bolder",
                                    }}
                                />
                            </span>
                        </div>
                    }

                </div>

            </div>
            {
                !readOnly &&
                <SelectRecordsModal
                    defaultValues={defaultValues}
                    appID={appID}
                    tableID={tableID}
                    filterConfig={filterConfig}
                    multiple={multiple}
                    associatedTable={associatedTable}
                    columns={columns}
                    selectedValue={selectedValue}
                    onSubmit={(newSelectedRecords) => {
                        onChange(newSelectedRecords);
                        setSelectValue(getSelecteValue(newSelectedRecords));
                    }}
                />
            }
        </div>

    );
}

function AssociatedRecordsFields(props: Partial<ISchemaFieldComponentProps>): JSX.Element {
    const componentProps = props.props['x-component-props'];
    // todo handle error case

    console.log('AssociatedRecordsFields', props);

    return (
        <AssociatedRecords
            className={props.props.className}
            defaultValues={props.value || []}
            readOnly={props.props.readOnly}
            appID={componentProps.appID}
            tableID={componentProps.tableID}
            columns={componentProps.columns || []}
            multiple={componentProps.multiple || false}
            filterConfig={componentProps.filterConfig}
            value={props.value}
            associatedTable={componentProps.associatedTable}
            onChange={(selectedKeys) => props?.mutators?.change(selectedKeys)}
        />
    );
}

AssociatedRecordsFields.isFieldComponent = true;

export default AssociatedRecordsFields;
