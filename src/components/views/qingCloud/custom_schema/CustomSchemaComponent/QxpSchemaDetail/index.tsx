/* eslint-disable react-hooks/exhaustive-deps */
import React, { useMemo, useEffect, useState } from 'react';
import cs from 'classnames';
import { ISchema } from '@formily/antd';

import GroupCard, { InfoCard } from './group-card';
import { FormDetailData, FormInfoCardDataProp, GroupInfo } from '../qxp/interface';
import { isMeanless } from '../qxp/utils';
import FormDataValueRenderer from '../qxp/form-data-value-renderer';
import schemaToFields from '../qxp/schema-convert';
import { Props } from './interface';
import { fetchOneFormDataWithSchema } from './request';

function FormDataDetailsCard({
    appID,
    tableID,
    rowID,
    className = '',
    fullScreen = false,
}: Props): JSX.Element {
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState<{ schema: ISchema, record: Record<string, any> } | null>(null);

    const GROUP_TITLE_MAP: Record<string, string> = {
        LayoutGrid: '栅格',
        LayoutTabs: '选项卡',
    };

    useEffect(() => {
        // setLoading(false);
        // fetchOneFormDataWithSchema(appID, tableID, rowID).then(({ schemaRes, record = {} }) => {
        //     setLoading(false);
        //     if (!schemaRes) {
        //         return Promise.reject(new Error('没有找到表单 schema，请联系管理员。'));
        //     }

        //     setFormData({ schema: schemaRes.schema, record });
        // });

        setLoading(false);
        const schemaRes = { "code": 0, "data": { "id": "9f9163af-1355-4696-bd99-476cfe38f9e8", "schema": { "properties": { "_id": { "display": false, "readOnly": false, "title": "id", "type": "string", "x-component": "Input", "x-component-props": {}, "x-index": 2, "x-internal": { "isSystem": true, "permission": 4 } }, "created_at": { "display": false, "readOnly": false, "title": "创建时间", "type": "datetime", "x-component": "DatePicker", "x-component-props": { "isNow": false, "showTime": false, "style": { "width": "100%" } }, "x-index": 3, "x-internal": { "isSystem": true, "permission": 4 } }, "creator_id": { "display": false, "readOnly": false, "title": "创建者 ID", "type": "string", "x-component": "Input", "x-component-props": {}, "x-index": 6, "x-internal": { "isSystem": true, "permission": 4 } }, "creator_name": { "display": false, "readOnly": false, "title": "创建者", "type": "string", "x-component": "Input", "x-component-props": {}, "x-index": 5, "x-internal": { "isSystem": true, "permission": 4 } }, "field_0y4a4gBT": { "default": "", "description": "", "display": true, "format": "", "readOnly": false, "required": false, "title": "test", "type": "string", "x-component": "Input", "x-component-props": { "defaultValue": "", "placeholder": "请输入" }, "x-index": 0, "x-internal": { "defaultValueFrom": "customized", "fieldId": "field_0y4a4gBT", "isSystem": false, "permission": 11, "sortable": false }, "x-mega-props": {} }, "field_UJOapiTD": { "description": "", "display": true, "readOnly": false, "required": false, "title": "关联数据", "type": "label-value", "x-component": "AssociatedData", "x-component-props": { "appID": "rk24c", "associationTableID": "46qzg", "fieldName": "created_at", "filterConfig": null, "placeholder": "选择关联数据" }, "x-index": 1, "x-internal": { "fieldId": "field_UJOapiTD", "isSystem": false, "permission": 11 }, "x-mega-props": {} }, "modifier_id": { "display": false, "readOnly": false, "title": "修改者 ID", "type": "string", "x-component": "Input", "x-component-props": {}, "x-index": 8, "x-internal": { "isSystem": true, "permission": 4 } }, "modifier_name": { "display": false, "readOnly": false, "title": "修改者", "type": "string", "x-component": "Input", "x-component-props": {}, "x-index": 7, "x-internal": { "isSystem": true, "permission": 4 } }, "updated_at": { "display": false, "readOnly": false, "title": "修改时间", "type": "datetime", "x-component": "DatePicker", "x-component-props": { "isNow": false, "showTime": false, "style": { "width": "100%" } }, "x-index": 4, "x-internal": { "isSystem": true, "permission": 4 } } }, "title": "test", "type": "object", "x-internal": { "columns": 1, "defaultValueFrom": "customized", "labelAlign": "top", "requiredLinkages": [], "validations": [], "version": "1.3.13", "visibleHiddenLinkages": [] } }, "config": { "filters": [], "pageTableColumns": [{ "id": "field_0y4a4gBT" }, { "id": "field_UJOapiTD" }], "pageTableShowRule": { "order": "-created_at", "pageSize": 10 } }, "tableID": "kg9nk" } };
        const recordRes = { "code": 0, "data": { "entity": { "_id": "B6AAFA003826477B954C3E3A2ACD90C1", "created_at": "2023-02-02T07:43:36.86Z", "creator_id": "039A91BFC1DA407CAEBB24D9C5FB8EE4", "creator_name": "赵冰玉", "field_0y4a4gBT": "1", "field_UJOapiTD": { "label": "2022-12-29 11:47:59", "value": "E2A87C8BE23C401490B70EAB1D2A913E" } }, "total": 0 } };
        if (!schemaRes) {
            return Promise.reject(new Error('没有找到表单 schema，请联系管理员。'));
        }
        setFormData({ schema: schemaRes.data.schema, record: recordRes.data.entity });
    }, [appID, tableID]);

    const [systems, formDatas] = useMemo(() => {
        if (!formData) {
            return [[], []];
        }

        const { record, schema } = formData;

        if (!schema && appID && tableID) {
            return [[], []];
        }

        const _systems: FormInfoCardDataProp[] = [];
        const _formDatas: FormDetailData[] = [];
        const tempSchema = Object.entries(schema.properties || {}).sort((schemaA, schemaB) => {
            return (schemaA[1]?.['x-index'] || 0) - (schemaB[1]?.['x-index'] || 0);
        });

        tempSchema.forEach(([fieldId, fieldSchema]) => {
            const fieldKey = fieldId;
            const hasValue = record && !isMeanless(record[fieldKey]);
            if ((fieldSchema as ISchema)['x-internal']?.isSystem) {
                _systems.push({
                    label: fieldSchema.title as string,
                    key: fieldKey,
                    value: hasValue ? (
                        <FormDataValueRenderer schema={fieldSchema as ISchema} value={record?.[fieldKey]} />
                    ) : <span className='text-gray-900'>—</span>,
                    fieldSchema,
                });
                return;
            }
            if ((fieldSchema as ISchema)['x-internal']?.isLayoutComponent) {
                const component = (fieldSchema as ISchema)['x-component'] || '';
                const title = (fieldSchema as ISchema).title ? (fieldSchema as ISchema).title as string :
                    GROUP_TITLE_MAP[component];
                const _group: FormInfoCardDataProp[] = [];
                const fieldSchemaTemp = schemaToFields(fieldSchema).sort((fieldSchemaA, fieldSchemaB) => {
                    return (fieldSchemaA?.['x-index'] || 0) - (fieldSchemaB?.['x-index'] || 0);
                });
                fieldSchemaTemp.forEach((field) => {
                    const fieldKey = field.id;
                    const fieldSchema = field;
                    const hasValue = record && !isMeanless(record[fieldKey]);
                    _group.push({
                        label: fieldSchema.title as string,
                        key: fieldKey,
                        value: hasValue ? (
                            <FormDataValueRenderer schema={fieldSchema as ISchema} value={record?.[fieldKey]} />
                        ) : <span className='text-gray-900'>—</span>,
                        fieldSchema,
                    });
                });
                _formDatas.push({
                    type: 'group',
                    itemInfo: {
                        title,
                        key: fieldKey,
                        groups: _group,
                    },
                });
                return;
            }

            _formDatas.push({
                type: 'details',
                itemInfo: {
                    label: fieldSchema.title as string,
                    key: fieldKey,
                    value: hasValue ? (
                        <FormDataValueRenderer schema={fieldSchema as ISchema} value={record?.[fieldKey]} />
                    ) : <span className='text-gray-900'>—</span>,
                    fieldSchema,
                },
            });
        });
        return [_systems, _formDatas];
    }, [formData]);

    if (loading) {
        // return (<Loading />);
        return <div>loading...</div>;
    }

    return (

        <div className={cs('flex-1 overflow-auto', className)}>
            <div className={cs('grid gap-x-16 grid-flow-row-dense p-16 pr-0 ',
                fullScreen ? 'grid-cols-4' : 'grid-cols-2',
                window?.isMobile ? 'details-drawer-is-mobile' : '')}
            >
                <div className="info-card grid grid-column-2">
                    { formDatas.map(({ type, itemInfo }) => {
                        if (type === 'details') {
                            const { key } = itemInfo;
                            return (
                                <InfoCard
                                    key={key}
                                    list={itemInfo as FormInfoCardDataProp}
                                />
                            );
                        }
                        const { key, groups, title } = itemInfo as GroupInfo;
                        return (
                            <GroupCard
                                key={key}
                                list={groups}
                                title={title || ''}
                                fullScreen={fullScreen}
                            />
                        );
                    }) }
                </div>

                <GroupCard
                    key='system'
                    list={systems}
                    title='系统字段'
                    fullScreen={fullScreen}
                />
            </div>
        </div>
    );
}

export default FormDataDetailsCard;
