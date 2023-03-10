import React, { useRef, useState } from 'react';
import { Table } from 'antd';
import {
    FolderOutlined,
    FileOutlined,
} from '@ant-design/icons';

const NextCloudFilesTable = (props) => {
    const { loading, data=[], onFileNameClick, onChange, hasRowSelection }=props;
    const nextCloudTableRef = useRef<any>();
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

    const rowSelection = {
        selectedRowKeys,
        type: "radio",
        onChange: (selectedRowKeys: React.Key[], selectedRows) => {
            setSelectedRowKeys(selectedRowKeys);
            onChange(selectedRows?.[0]);
        },
    };

    const handleFlieNameClick = (row) => {
        onFileNameClick && onFileNameClick(row);
    };
  
    const columns: any = [
        {
            title: '名称',
            dataIndex: 'name',
            key: 'name',
            render: (val, row) => {
                const { isFolder }=row;
                return <div
                    className={`file-name-wrap ${(isFolder?'isFolder':'isFile')}`}
                    onClick={() => handleFlieNameClick(row)}
                >
                    { isFolder ? <FolderOutlined /> : <FileOutlined /> }
                    <span className='name'>{ val }</span>
                </div>;
            },
        },
        {
            title: '大小',
            dataIndex: 'size',
            key: 'size',
            width: 120,
        },
        {
            title: '修改时间',
            dataIndex: 'modified',
            key: 'modified',
            width: 200,
        },
        
    ];

    return <div className='NextCloudFilesTable-wrap' ref={nextCloudTableRef}>
        <Table
            size='small'
            scroll={{ y: "40vh" }}
            pagination={false}
            loading={loading}
            columns={columns}
            dataSource={data}
            rowKey={row => row?.name}
            rowSelection={hasRowSelection ? rowSelection : null as any}
        />
    </div>;
};

export default NextCloudFilesTable;
