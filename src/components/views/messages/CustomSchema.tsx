/* eslint-disable camelcase */
import React, { useEffect, useState } from 'react';
import {
    SchemaForm,
    FormEffectHooks,
    createAsyncFormActions,
} from '@formily/antd';
import {
    MegaLayout,
    DatePicker,
} from '@formily/antd-components';
import { Button, Input, Select } from 'antd';

import { MatrixClientPeg } from "../../../MatrixClientPeg";
import { doMaybeLocalRoomAction } from '../../../utils/local-room';
import CustomDatePicker from "./CustomSchemaComponent/DatePicker";

const { TextArea } = Input;

const schemaFormActions = createAsyncFormActions();
const { onFormValuesChange$ } = FormEffectHooks;
const components = {
    Input,
    TextArea,
    Select,
    CustomDatePicker,
    MegaLayout,
    DatePicker,
};


const CustomSchema = (props) => {
    const mxEv = props?.mxEvent?.event || {};
    const { type, content, event_id } = mxEv;
    const [submitData, setSubmitData] = useState({});
    let schemaData; let schemaButtons;

    try {
        const schema = JSON.parse(content[type]?.schema) || {};
        schemaData = schema?.schemaData;
        schemaButtons = schema?.schemaButtons;
    } catch (error) {
        console.log(error);
    }

    const getSubmitObj = () => {
        const { properties }=schemaData;
        const submitObj = {};
        for (const key in properties) {
            if (properties[key]?.isSubmit) {
                submitObj[key]=null;
            }
        }
        return submitObj;
    };

    const submitForm = (submit: any) => {
        const data = {
            type: `${type}.submit`,
            content: {
                "kind": submit,
                "data": {
                    ...submitData,
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
            (res) => { console.log(res); },
        ).catch(e => {
            console.error(e);
        });
    };

    const handleEffects = () => {
        onFormValuesChange$().subscribe((data) => {
            try {
                const { values }=data;
                const submitObj = getSubmitObj();
                for (const key in submitObj) {
                    submitObj[key]=values[key];
                }
                setSubmitData({ ...submitObj });
            } catch (error) {
                console.log(error)
            }
           
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

