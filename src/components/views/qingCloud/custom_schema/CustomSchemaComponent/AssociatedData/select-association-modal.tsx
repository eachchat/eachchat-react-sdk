import { ISchema } from '@formily/antd';
import { Modal, Radio } from 'antd';
import React, { useRef } from 'react';

import { Ref } from '../../../../../accessibility/roving/types';
import FormDataTable from '../FormDataTable';
import { FilterConfig } from '../qxp/interface';

type Props = {
  onClose: () => void;
  onSubmit: (dataRow: Record<string, any>, schema: ISchema) => void;
  appID: string;
  fieldName: string;
  tableID: string;
  filterConfig?: FilterConfig;
  selectedValue?: string;
};

export default function SelectAssociationModal({
    onClose, appID, tableID, onSubmit, fieldName, filterConfig, selectedValue,
}: Props): JSX.Element {
    const tableRef: React.MutableRefObject<any> = useRef<Ref>();
    const handleSelect = (rowData: Record<string, any>): void => {
    // todo Layout
        const schema = tableRef?.current?.getSchema()?.properties?.[fieldName] as ISchema;
        onSubmit(rowData, schema);
    };
    const customColumnsBefore = [
        {
            id: 'action',
            fixed: true,
            // Headers: '操作',
            Headers: ' ',
            accessor: (rowData: any) => {
                return (
                    <Radio
                        onClick={() => handleSelect(rowData)}
                        value={rowData?._id}
                        defaultChecked={rowData?._id === selectedValue} />
                );
            },
        },
    ];

    return (
        <Modal 
        title="选择关联数据" 
        open={isModalOpen} 
        onCancel={onClose}>
        <div className="p-20" style={{ minHeight: '200px' }}>
                TODO Table
                {/* <FormDataTable
                    allowRequestData
                    showCheckbox={false}
                    filterConfig={filterConfig}
                    customColumns={[]}
                    customColumnsBefore={customColumnsBefore}
                    ref={tableRef as React.Ref<Ref>}
                    pageID={tableID}
                    appID={appID}
                /> */}
            </div>
      </Modal>
    );
}
