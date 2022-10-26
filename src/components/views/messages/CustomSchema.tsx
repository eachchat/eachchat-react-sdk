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
const { onFormValuesChange$, onFormSubmitValidateSuccess$	 } = FormEffectHooks;
const components = {
    Input,
    TextArea,
    Select,
    CustomDatePicker,
    MegaLayout,
    DatePicker,
};

const getSubmitObj = (schemaData) => {
    const { properties }=schemaData;
    const submitObj = {};
    for (const key in properties) {
        if (properties[key]?.isSubmit) {
            submitObj[key]='';
        }
    }
    return submitObj;
};

const CustomSchema = (props) => {
    const mxEv = props?.mxEvent?.event || {};
    const { type, content, event_id } = mxEv;
    let schemaData; let schemaButtons; let taskID; let kind='';
    try {
        const schema = JSON.parse(content[type]?.schema) || {};
        schemaData = schema?.schemaData;
        schemaButtons = schema?.schemaButtons;
        taskID = schema?.taskID;
    } catch (error) {
        console.log(error);
    }

    const submitData = getSubmitObj(schemaData);

    const submitForm = () => {
        const data = {
            type: `${type}.submit`,
            content: {
                "kind": kind,
                "data": {
                    taskID,
                    ...submitData,
                },
                "m.relates_to": {
                    event_id,
                },
            },
        };

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
                for (const key in submitData) {
                    submitData[key]=values[key];
                }
            } catch (error) {
                console.log(error);
            }
        });

        onFormSubmitValidateSuccess$().subscribe((data) => {
            submitForm();
        });
    };

    const handleClick = (data: any) => {
        const { value, link }=data;
        if (link) {
            window.open(link);
        } else {
            kind = value;
        }
    };

    return <div className="mx_Custom_schema">
        {
            schemaData &&
            <SchemaForm
                components={components}
                schema={schemaData}
                effects={handleEffects}
                actions={schemaFormActions}
            >
                <div className='button-group'>
                    {
                        schemaButtons &&
                    schemaButtons.map(item =>
                        <Button
                            key={item.value}
                            value={item.value}
                            type={item.type as any}
                            htmlType={item?.link ? 'button' : 'submit'}
                            onClick={() => handleClick(item)}
                        >
                            { item.text }
                        </Button>)
                    }
                </div>
            </SchemaForm>
        }
    </div>;
};

export default React.memo(CustomSchema);

