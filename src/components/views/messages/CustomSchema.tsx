/* eslint-disable camelcase */
import React, { useContext } from 'react';
import {
    SchemaForm,
    FormEffectHooks,
    createAsyncFormActions,
} from '@formily/antd';
import {
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
import axios from 'axios';

import { MatrixClientPeg } from "../../../MatrixClientPeg";
import { doMaybeLocalRoomAction } from '../../../utils/local-room';
import DatePicker from "./CustomSchemaComponent/DatePicker";
import CheckboxGroup from './CustomSchemaComponent/CheckboxGroup';
import MultipleSelect from './CustomSchemaComponent/MultipleSelect';
import NumberPicker from "./CustomSchemaComponent/NumberPicker";
import Serial from './CustomSchemaComponent/Serial';
import LayoutTabs from './CustomSchemaComponent/LayoutTabs';
import LayoutCard from './CustomSchemaComponent/LayoutCard';
import LayoutGrid from './CustomSchemaComponent/LayoutGrid';
import mockSchema from './CustomSchemaComponent/mockSchema';
import MatrixClientContext from '../../../contexts/MatrixClientContext';

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
    MultipleSelect,
    NumberPicker,
    Serial,
    LayoutTabs,
    LayoutCard,
    LayoutGrid,
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
    const cli = useContext(MatrixClientContext);
    const newMxEv = props?.mxEvent?.replacingEvent() || props.mxEvent; // show the replacing event, not the original, if it is an edit
    const { type, content, event_id } = newMxEv?.event || {};
    let activeBtn; let schema; let buttons;
    try {
        if (process.env.NODE_ENV==='development') {
            // schema=mockSchema?.schema || null;
            schema = content[type]?.schema;
            buttons = content[type]?.buttons;
        } else {
            schema = content[type]?.schema;
            buttons = content[type]?.buttons;
        }
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
                "data": {
                    ...submitValues,
                    ...activeBtn?.data,
                },
                // "m.relates_to": {
                //     event_id,
                // },
            },
        };

        const elementBaseURL = 'element';
        const requestElement =() => {
            const MatrixID = localStorage.getItem("mx_user_id");
            const Authorization = `Bearer ${localStorage.getItem('mx_authorization')}`;
            return axios.create({
                baseURL: elementBaseURL,
                headers: {
                    "Matrix-Id": MatrixID,
                    "Authorization": Authorization,
                },
            });
        };

        // 提交表单
        const sendCustomSchema = () => {
            return requestElement()({
                method: 'POST',
                url: "api/v1/scatter",
                data: data.content,
            })
                .then((res: any) => res?.data)
                .catch(err => err);
        };
        sendCustomSchema();

        // cli.sendCustomSchema(data.content)
        //     .then(
        //         (res) => { console.log(res); },
        //     ).catch(e => {
        //         console.error(e);
        //     });

        // doMaybeLocalRoomAction(
        //     props.mxEvent.getRoomId(),
        //     (actualRoomId: string) => MatrixClientPeg.get().sendEvent(
        //         actualRoomId,
        //         props.mxEvent.getThread()?.id ?? null,
        //         data.type,
        //         data.content,
        //     ),
        //     MatrixClientPeg.get(),
        // ).then(
        //     (res) => { console.log(res); },
        // ).catch(e => {
        //     console.error(e);
        // });
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

