import React, { useState } from 'react';
import { Button, Modal } from 'antd';

import SchemaTable from '../QxpSchemaTable';

const SelectRecordsModal = (props: any) => {
    const {
        appID,
        tableID,
        multiple,
        onSubmit,
        filterConfig,
        selectedValue,
        defaultValues,
    } = props;

    const [isModalOpen, setIsModalOpen] = useState(false);
    // const [selectedRows, setselectedRows]= useState(defaultValues);
    const rowSelection = {
        onChange: (selectedRowKeys: React.Key[], selectedRows: any) => {
            // setselectedRows(selectedRows);
            onSubmit?.(selectedRows);
        },
    };

    const handleOk = () => {
        // onSubmit?.(selectedRows);
        setIsModalOpen(false);
    };

    return <div className='select-record-modal mt10 inline-block'>
        <Button type="default" onClick={() => setIsModalOpen(true)}>选择关联记录</Button>
        <Modal
            title="选择关联记录"
            open={isModalOpen}
            onCancel={() => setIsModalOpen(false)}
            onOk={handleOk}
            width="50%"
        >
            <SchemaTable
                params={null}
                scroll={{ y: 400, x: 700 }}
                size="small"
                rowSelection={{
                    type: multiple ? 'checkbox': 'radio',
                    selectedRowKeys: [...selectedValue],
                    ...rowSelection,
                }}
            />
        </Modal>
    </div>;
};
export default SelectRecordsModal;
