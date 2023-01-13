/* eslint-disable camelcase */
import React from 'react';
import {
    SchemaForm,
    FormEffectHooks,
    createAsyncFormActions,
} from '@formily/antd';
import {
    MegaLayout,
    Radio,
    Checkbox,
    Select,
} from '@formily/antd-components';
import {
    Button,
    Input,
    Switch,
} from 'antd';
import { isArray } from 'lodash';

import { MatrixClientPeg } from "../../../MatrixClientPeg";
import { doMaybeLocalRoomAction } from '../../../utils/local-room';
import DatePicker from "./CustomSchemaComponent/DatePicker";
import CheckboxGroup from './CustomSchemaComponent/CheckboxGroup';
import MultipleSelect from './CustomSchemaComponent/MultipleSelect';
import NumberPicker from "./CustomSchemaComponent/NumberPicker";

const { TextArea } = Input;

const schemaFormActions = createAsyncFormActions();
const { onFormValuesChange$, onFormSubmitValidateSuccess$ } = FormEffectHooks;
const components = {
    Input,
    TextArea,
    Select,
    Radio,
    RadioGroup: Radio.Group,
    Checkbox,
    CheckboxGroup,
    Switch,
    DatePicker,
    MegaLayout,
    MultipleSelect,
    NumberPicker,
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
    // const mxEv = props?.mxEvent?.event || {};
    const newMxEv = props?.mxEvent?.replacingEvent() || props.mxEvent; // show the replacing event, not the original, if it is an edit
    // console.log('CustomSchema newMxEv====', newMxEv);
    const { type, content, event_id } = newMxEv?.event || {};
    let activeBtn; let schema; let buttons;
    try {
        schema = content[type]?.schema;
        buttons = content[type]?.buttons;
    } catch (error) {

    }
    const submitData = getSubmitObj(schema);

    const submitForm = () => {
        const submitValues = {};
        for (const key in submitData) {
            if (submitData[key]) {
                submitValues[key]=submitData[key];
            }
        }

        const data = {
            type: `${type}.submit`,
            content: {
                "kind": activeBtn?.kind,
                "params": {
                    ...submitValues,
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

    // const handleView = ()=>{
    //     Modal.createDialog(ViewSource, {
    //         mxEvent: props.mxEvent,
    //     }, 'mx_Dialog_viewsource');
    // }
    const fromatSchema = (schema) => {
        for (const key in schema?.properties) {
            const _default = schema?.properties[key]?.default;
            const _value = schema?.properties[key]?.['x-component-props']?.value;
            delete schema.properties[key]?.default;
            if (_value) {
                schema.properties[key]['x-component-props'].defaultValue = _value;
            } else {
                schema.properties[key]['x-component-props'].defaultValue = _default;
            }
        }
        return schema;
    };

    return <div className="mx_Custom_schema">
        { /* <button onClick={handleView}>查看源代码</button> */ }
        {
            schema &&
            <SchemaForm
                components={components}
                schema={fromatSchema(schema)}
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

