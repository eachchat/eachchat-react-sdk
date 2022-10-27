/* eslint-disable camelcase */
import React from 'react';
import {
    SchemaForm,
    FormEffectHooks,
    createAsyncFormActions,
} from '@formily/antd';
import {
    MegaLayout,
} from '@formily/antd-components';
import { Button, Input, Select, Radio, Checkbox, Switch } from 'antd';
import { isArray } from 'lodash';

import { MatrixClientPeg } from "../../../MatrixClientPeg";
import { doMaybeLocalRoomAction } from '../../../utils/local-room';
import DatePicker from "./CustomSchemaComponent/DatePicker";

const { TextArea } = Input;

const schemaFormActions = createAsyncFormActions();
const { onFormValuesChange$, onFormSubmitValidateSuccess$ } = FormEffectHooks;
const components = {
    Input,
    TextArea,
    Select,
    Radio,
    Checkbox,
    Switch,
    DatePicker,
    MegaLayout,
};

const getSubmitObj = (schema) => {
    if (!schema) {
        return {};
    }
    const { properties }=schema;
    const submitObj = {};
    for (const key in properties) {
        if (properties[key]?.editable || !properties[key]?.readOnly) {
            submitObj[key]='';
        }
    }
    return submitObj;
};

const CustomSchema = (props) => {
    const mxEv = props?.mxEvent?.event || {};

    console.log('mxEv====', mxEv);
    const { type, content, event_id } = mxEv;
    let activeBtn; let schema; let buttons;
    try {
        schema = content[type]?.schema;
        buttons = content[type]?.buttons;
    } catch (error) {

    }
    const submitData = getSubmitObj(schema);

    const submitForm = () => {
        const data = {
            type: `${type}.submit`,
            content: {
                "kind": activeBtn?.kind,
                "params": {
                    ...submitData,
                    ...activeBtn?.data,
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
        activeBtn = data;
    };
    return <div className="mx_Custom_schema">
        {
            schema &&
            <SchemaForm
                components={components}
                schema={schema}
                effects={handleEffects}
                actions={schemaFormActions}
            >
                {
                    isArray(buttons) &&
                        <div className='button-group'>
                            { buttons?.map(item =>
                                <Button
                                    key={item.value}
                                    value={item.value}
                                    type={item.type as any}
                                    htmlType="submit"
                                    onClick={() => handleClick(item)}
                                >
                                    { item.text }
                                </Button>) }
                        </div>
                }
            </SchemaForm>
        }
    </div>;
};

export default React.memo(CustomSchema);

