/* eslint-disable camelcase */
import React, { useState } from 'react';
import {
    SchemaForm,
    FormEffectHooks,
    createAsyncFormActions,
    createFormActions,
} from '@formily/antd';
import {
    MegaLayout,
    DatePicker,
} from '@formily/antd-components';
import { Button, Input, Select } from 'antd';

import { MatrixClientPeg } from "../../../MatrixClientPeg";
import { doMaybeLocalRoomAction } from '../../../utils/local-room';
import CustomDatePicker from "./CustomSchemaComponent/DatePicker";
import CustomUpload from './CustomSchemaComponent/Upload';
import CustomDownload from './CustomSchemaComponent/Download';
import { CustomEventType } from '../../../CustomConstant';

const { TextArea } = Input;

const schemaFormActions = createAsyncFormActions();
const { onFieldValueChange$, onFormValuesChange$ } = FormEffectHooks;
const components = {
    Input,
    TextArea,
    Select,
    CustomDatePicker,
    MegaLayout,
    DatePicker,
    // CustomUpload,
    // CustomDownload,
};

const CustomSchema = (props) => {
    const mxEv = props?.mxEvent?.event || {};
    const { type, content, event_id }= mxEv;
    const [submitData, setSubmitData] = useState({});
    let schemaData; let schemaButtons;
    try {
        const schema = JSON.parse(content[type]?.schema) || {};
        schemaData = schema?.schemaData;
        schemaButtons = schema?.schemaButtons;
    } catch (error) {
        console.log(error);
    }

    const submitForm =(submit: any) => {
        const data = {
            type: `${type}.submit`,
            content: {
                "kind": content[type]?.kind,
                "data": {
                    ...submitData,
                    submit,
                },
                "m.relates_to": {
                    event_id,
                },
            },
        };

        // const data = {
        //     type: CustomEventType.QuanXiangSubmit,
        //     content: {
        //         "kind": "leaveOfAbsence",
        //         "data": {
        //             ...submitData,
        //             submit,
        //         },
        //         "m.relates_to": {
        //             event_id,
        //         },

        //     },
        // };

        doMaybeLocalRoomAction(
            props.mxEvent.getRoomId(),
            (actualRoomId: string) => MatrixClientPeg.get().sendEvent(
                actualRoomId,
                props.mxEvent.getThread()?.id ?? null,
                data.type,
                data.content,
            ),
            MatrixClientPeg.get(),
        ).then(
            (res) => {console.log(res); },
        ).catch(e => {
            console.error(e);
        });
    };

    const handleEffects = () => {
        onFormValuesChange$().subscribe(({ values }) => {
            console.log('onFormValuesChange', values);
            setSubmitData({ ...values });
        });
    };

    const handleClick = (data: any) => {
        submitForm(data?.value);
        // schemaFormActions.submit().then(res => {
        //     submitForm(data?.value);
        // }).catch(err => {
        //     console.log('err', err);
        // });
    };

    return <div className="mx_Custom_schema">
        {
            schemaData &&
            <SchemaForm
                components={components}
                schema={schemaData}
                effects={handleEffects}
                actions={schemaFormActions}
            />
        }

        <div className='button-group'>
            {
                schemaButtons &&
                schemaButtons.map(item =>
                    <Button
                        key={item.value}
                        value={item.value}
                        type={item.type as any}
                        onClick={() => handleClick(item)}
                    >
                        { item.text }
                    </Button>)
            }
        </div>

    </div>;
};

export default React.memo(CustomSchema);

