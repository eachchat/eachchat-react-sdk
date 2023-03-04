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
    ConfigProvider,
    Input,
    Switch,
    theme,
} from 'antd';
import { isArray } from 'lodash';
import axios from 'axios';

import DatePicker from "./CustomSchemaComponent/DatePicker";
import CheckboxGroup from './CustomSchemaComponent/CheckboxGroup';
import MultipleSelect from './CustomSchemaComponent/MultipleSelect';
import NumberPicker from "./CustomSchemaComponent/NumberPicker";
import Serial from './CustomSchemaComponent/Serial';
import LayoutTabs from './CustomSchemaComponent/LayoutTabs';
import LayoutCard from './CustomSchemaComponent/LayoutCard';
import LayoutGrid from './CustomSchemaComponent/LayoutGrid';
import MatrixClientContext from '../../../../contexts/MatrixClientContext';
import ThemeWatcher from '../../../../settings/watchers/ThemeWatcher';

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
        schema = content[type]?.schema;
        buttons = content[type]?.buttons;
    } catch (error) {
    }
    let submitData = getSubmitObj(schema);

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
            },
        };

        const elementBaseURL = 'element';
        const requestElement =() => {
            const MatrixID = localStorage.getItem("mx_user_id");
            const Authorization = `Bearer ${window?.mxMatrixClientPeg?.matrixClient?.getAccessToken()}`;
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

    };

    const handleEffects = () => {
        onFormValuesChange$().subscribe((data) => {
            try {
                const { values }=data;
                for (const key in submitData) {
                    submitData={
                        ...submitData,
                        ...values,
                    };
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
        submitForm();
    };

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

    let elementTheme = new ThemeWatcher().getEffectiveTheme();

    return (
        <ConfigProvider
            theme={{
                algorithm: elementTheme === "light" ? theme.defaultAlgorithm : theme.darkAlgorithm,
                token: {
                    colorPrimary: '#0dbd8b',
                    colorBgContainer: 'transparent',
                   
                },
            }}
        >
        <div className="mx_Custom_schema">
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
        </div>
   

</ConfigProvider>

    )
       
};

export default React.memo(CustomSchema);

