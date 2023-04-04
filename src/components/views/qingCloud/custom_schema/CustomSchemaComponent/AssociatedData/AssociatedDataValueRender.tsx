import React, { useState } from 'react';
// import FormDataDetailsCard from '@c/form-data-details-card';
import { Modal } from 'antd';
import { ISchema } from '@formily/antd';

import { LabelValue } from '../qxp/interface';
import QxpSchemaDetail from '../QxpSchemaDetail';
import FormDataDetailsCard from '../QxpSchemaDetail';

type Props = {
  schema: ISchema;
  value: LabelValue;
};

export default function AssociatedDataValueRender(props: Props): JSX.Element {
    const { schema, value } = props || {};
    const [visible, setVisible] = useState(false);

    return (
        <>
            <div onClick={() => setVisible(true)} className='text-color-primary cursor-pointer'>{ value?.label || value }</div>
            <Modal
                title={`${schema.title}详情`}
                onCancel={() => setVisible(false)}
                open={visible}
                footer={null}
                width="50%"

            >
                <FormDataDetailsCard
                    className='p-10'
                    appID={schema['x-component-props']?.appID as string}
                    tableID={schema['x-component-props']?.associationTableID as string}
                    rowID={value?.value}
                />
            </Modal>
        </>
    );
}
