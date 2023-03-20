/* eslint-disable react-hooks/exhaustive-deps */
import { Table } from 'antd';
import qs from 'qs';
import React, { useEffect, useState } from 'react';

import type { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import type { FilterValue, SorterResult } from 'antd/es/table/interface';

interface DataType {
  name: {
    first: string;
    last: string;
  };
  gender: string;
  email: string;
  login: {
    uuid: string;
  };
}

interface TableParams {
  pagination?: TablePaginationConfig;
  sortField?: string;
  sortOrder?: string;
  filters?: Record<string, FilterValue>;
}

const getRandomuserParams = (params: TableParams) => ({
    results: params.pagination?.pageSize,
    page: params.pagination?.current,
    ...params,
});

const _columns = [
    {
        title: '级联选择',
        dataIndex: 'field_JLbA9Dv6',
        key: 'field_JLbA9Dv6',
        render: (data: any) => {
            console.log('级联选择', data);
            return <div>
                { data?.label }
            </div>;
        },
    },
];

const _data = [
    {
        "_id": "E2A87C8BE23C401490B70EAB1D2A913E",
        "created_at": "2022-12-29T03:47:59.285Z",
        "creator_id": "893ca81d-f571-4a6f-8088-673e8775ff64",
        "creator_name": "魏涛",
        "field_JLbA9Dv6": {
            "label": "网络/VPC网络",
            "value": "field_Ez6HY4Av/field_RZewMQIb",
        },
        "field_aELVnlwh": [
            {
                "label": "1669361712542.jpg",
                "size": 158215,
                "type": "image/jpeg",
                "value": "app/rk24c/form-attachment/46qzg/YzJjNGRkZGI4NWIwNGVkMDE5ZjAwNzY0MjcyYjY4ZTkxNjcyMjg1Njc1MjI1/1669361712542.jpg",
            },
        ],
        "field_c0JswMYn": {
            "label": "魏涛v1",
            "value": "CEB3AD5EDD17454BAF5028FFD3976096",
        },
        "field_rm3KK9fS": "5555555",
        "field_xXddZIt4": "ER2022122900017",
    },
    {
        "_id": "582C667F3DFF410FB960E1085AD2EA43",
        "created_at": "2022-12-29T03:12:14.011Z",
        "creator_id": "039A91BFC1DA407CAEBB24D9C5FB8EE4",
        "creator_name": "赵冰玉",
        "field_JLbA9Dv6": {
            "label": "计算/云服务器（Instance）",
            "value": "field_liscJaDk/field_lv417kv9",
        },
        "field_aELVnlwh": [
            {
                "label": "企业微信20221104-104745 (1).png",
                "size": 39474,
                "type": "image/png",
                "value": "app/rk24c/form-attachment/46qzg/YWQ4ZGRhZjBlNTBlYTlhMTkxOWZmZWJlMDRmN2VmNmUxNjcyMjgzNTMxODc3/企业微信20221104-104745 (1).png",
            },
            {
                "label": "企业微信20221104-104745 (5).png",
                "size": 39474,
                "type": "image/png",
                "value": "app/rk24c/form-attachment/46qzg/YWQ4ZGRhZjBlNTBlYTlhMTkxOWZmZWJlMDRmN2VmNmUxNjcyMjgzODgzNDA5/企业微信20221104-104745 (5).png",
            },
        ],
        "field_rm3KK9fS": "1",
        "field_xXddZIt4": "ER2022122900016",
        "modifier_id": "039A91BFC1DA407CAEBB24D9C5FB8EE4",
        "modifier_name": "赵冰玉",
        "updated_at": "2022-12-29T03:18:05.315Z",
    },
];

const rowSelection = {
    onChange: (selectedRowKeys: React.Key[], selectedRows: DataType[]) => {
        console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
    },
    getCheckboxProps: (record: DataType) => ({
        // disabled: record.name === 'Disabled User', // Column configuration not to be checked
        name: record.name,
    }),
};

const FormDataTable = (props) => {
    const [selectionType, setSelectionType] = useState<'checkbox' | 'radio'>('checkbox');
    const [data, setData] = useState();
    const [loading, setLoading] = useState(false);
    const [tableParams, setTableParams] = useState<TableParams>({
        pagination: {
            current: 1,
            pageSize: 10,
        },
    });

    const fetchData = () => {
        setLoading(true);
        fetch(`https://randomuser.me/api?${qs.stringify(getRandomuserParams(tableParams))}`)
            .then(res => res.json())
            .then(({ results }) => {
                setData(results);
                setLoading(false);
                setTableParams({
                    ...tableParams,
                    pagination: {
                        ...tableParams.pagination,
                        total: 200,
                        // 200 is mock data, you should read it from server
                        // total: data.totalCount,
                    },
                });
            });
    };

    useEffect(() => {
        fetchData();
    }, [JSON.stringify(tableParams)]);

    const handleTableChange = (
        pagination: TablePaginationConfig,
        filters: Record<string, FilterValue>,
        sorter: SorterResult<DataType>,
    ) => {
        setTableParams({
            pagination,
            filters,
            ...sorter,
        });
    };

    return (
        <div className="form-data table">
            <div className="selected-numer">已选{ 0 }条</div>
            <Table
                {...props}
                rowKey={record => record?._id}
                pagination={tableParams.pagination}
                loading={loading}
                onChange={handleTableChange}
                columns={_columns}
                dataSource={_data as any}
                rowSelection={{
                    type: selectionType,
                    ...rowSelection,
                }}
            />
        </div>

    );
};

export default FormDataTable;
