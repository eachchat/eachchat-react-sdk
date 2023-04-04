/* eslint-disable react-hooks/exhaustive-deps */
import { Table } from 'antd';
import qs from 'qs';
import React, { useEffect, useState } from 'react';
import { isArray, isObject, isString } from 'lodash';

import type { TablePaginationConfig } from 'antd/es/table';
import type { FilterValue, SorterResult } from 'antd/es/table/interface';
import AssociatedDataValueRender from '../AssociatedData/AssociatedDataValueRender';
import { TableColumnConfig, TableParams } from './interface';
import { schemaToMap } from '../qxp/schema-convert';
import FormDataValueRenderer from '../qxp/form-data-value-renderer';

const getRandomuserParams = (params: TableParams) => ({
    results: params.pagination?.pageSize,
    page: params.pagination?.current,
    ...params,
});

const getValue = (data: any) => {
    if (isString(data)) {
        return data;
    }
    if (isObject(data)) {
        return data?.label;
    }
    if (isArray(data)) {
        return data[0]?.label;
    }
    return data;
};

function addFixedParameters(
    fixedList: number[],
    tableColumns: any,
): void {
    fixedList.forEach((index) => {
        if (tableColumns[index]) {
            tableColumns[index] = { ...tableColumns[index], fixed: true };
        }
    });
}

function setFixedParameters(fixedRule, tableColumns) {
    switch (fixedRule) {
        case 'one':
            addFixedParameters([0], tableColumns);
            break;
        case 'previous_two':
            addFixedParameters([0, 1], tableColumns);
            break;
    }
    return tableColumns;
}

const columnStringToObject = (pageTableColumns: string[] | TableColumnConfig[]): TableColumnConfig[] => {
    if (pageTableColumns.length && typeof pageTableColumns[0] === 'string') {
        return (pageTableColumns as string[]).map((id) => ({ id }));
    }

    return pageTableColumns as TableColumnConfig[];
};

const getPageDataSchema = (config, schema) => {
    const { pageTableShowRule = {}, pageTableColumns = [] } = config || {};
    const fieldsMap = schemaToMap(schema);
    const _pageTableColumns = columnStringToObject(pageTableColumns);
    const tableColumns = _pageTableColumns.filter(({ id }) => {
        return id in fieldsMap;
    }).map(({ id, width }) => {
        return {
            id,
            Header: fieldsMap[id].title || '',
            accessor: (data: any) => {
                if (data[id] === undefined || data[id] === null || data[id] === '') {
                    return <span className='text-gray-300'>——</span>;
                }

                return <FormDataValueRenderer value={data[id]} schema={fieldsMap[id]} />;
            },
        };
    });

    return {
        tableColumns: setFixedParameters(pageTableShowRule.fixedRule, tableColumns),
        pageTableShowRule,
    };
};
const getColumns = (data) => {
    const { config, schema }=data;
    const { tableColumns } = getPageDataSchema(config || {}, schema);
    const _columns = tableColumns.map(item => {
        return {
            ...schema?.properties[item?.id],
            key: item?.id,
            title: item?.Header,
            render: (text, record, index) => {
                const xComponent = schema?.properties[item?.id]?.['x-component'];
                const value = getValue(text[item?.id]);
                if (xComponent==='AssociatedData') {
                    return <AssociatedDataValueRender value={value} schema={schema} />;
                }
                return value;
            },
        };
    });
    return _columns;
};

const SchemaTable= (props) => {
    console.log('SchemaTable', props);
    const { params, className, ...res } = props;
    const [columns, setColumns] = useState([]);
    const [data, setData] = useState();
    const [loading, setLoading] = useState(false);
    const [tableParams, setTableParams] = useState<TableParams>(params || {
        pagination: {
            current: 1,
            pageSize: 10,
        },
    });

    const fetchColumns = () => {
        setLoading(true);
        fetch(`https://randomuser.me/api?${qs.stringify(getRandomuserParams(tableParams))}`)
            .then(res => res.json())
            .then(({ results }) => {
                const res =
                {"code":0,"data":{"id":"3412fc95-6830-4c02-a4e8-e6cf5f2f09bf","schema":{"properties":{"_id":{"display":false,"readOnly":false,"title":"id","type":"string","x-component":"Input","x-component-props":{},"x-index":7,"x-internal":{"isSystem":true,"permission":4}},"created_at":{"display":false,"readOnly":false,"title":"创建时间","type":"datetime","x-component":"DatePicker","x-component-props":{"isNow":false,"showTime":false,"style":{"width":"100%"}},"x-index":8,"x-internal":{"isSystem":true,"permission":4}},"creator_id":{"display":false,"readOnly":false,"title":"创建者 ID","type":"string","x-component":"Input","x-component-props":{},"x-index":11,"x-internal":{"isSystem":true,"permission":4}},"creator_name":{"display":false,"readOnly":false,"title":"创建者","type":"string","x-component":"Input","x-component-props":{},"x-index":10,"x-internal":{"isSystem":true,"permission":4}},"field_3graExvh":{"description":"","display":true,"items":{"type":"string"},"readOnly":false,"required":false,"title":"关联记录","type":"array","x-component":"AssociatedRecords","x-component-props":{"appID":"rk24c","associatedTable":{"properties":{"_id":{"display":false,"readOnly":false,"title":"id","type":"string","x-component":"Input","x-component-props":{},"x-index":3,"x-internal":{"isSystem":true,"permission":4}},"created_at":{"display":false,"readOnly":false,"title":"创建时间","type":"datetime","x-component":"DatePicker","x-component-props":{"isNow":false,"showTime":false,"style":{"width":"100%"}},"x-index":4,"x-internal":{"isSystem":true,"permission":4}},"creator_id":{"display":false,"readOnly":false,"title":"创建者 ID","type":"string","x-component":"Input","x-component-props":{},"x-index":7,"x-internal":{"isSystem":true,"permission":4}},"creator_name":{"display":false,"readOnly":false,"title":"创建者","type":"string","x-component":"Input","x-component-props":{},"x-index":6,"x-internal":{"isSystem":true,"permission":4}},"field_hptc4iHR":{"default":"asdf","description":"","display":true,"format":"","readOnly":false,"required":false,"title":"单行文本test","type":"string","x-component":"Input","x-component-props":{"defaultValue":"asdf","placeholder":"请输入"},"x-index":0,"x-internal":{"defaultValueFrom":"customized","fieldId":"field_hptc4iHR","isSystem":false,"permission":11,"sortable":false},"x-mega-props":{}},"field_jAzU4dOG":{"default":"","description":"","display":true,"format":"","readOnly":true,"required":false,"title":"多行文本test","type":"string","x-component":"Textarea","x-component-props":{"autoSize":{"minRows":4},"defaultValue":"","placeholder":"请输入","rows":4},"x-index":1,"x-internal":{"defaultValueFrom":"customized","fieldId":"field_jAzU4dOG","isSystem":false,"permission":3,"sortable":false},"x-mega-props":{}},"field_jHHF9ppB":{"description":"","display":true,"readOnly":false,"required":false,"title":"时间日期","type":"datetime","x-component":"DatePicker","x-component-props":{"format":"YYYY-MM-DD","isNow":false,"placeholder":"","showTime":false,"style":{"width":"100%"}},"x-index":2,"x-internal":{"defaultValueFrom":"customized","fieldId":"field_jHHF9ppB","isSystem":false,"permission":11,"sortable":false},"x-mega-props":{}},"modifier_id":{"display":false,"readOnly":false,"title":"修改者 ID","type":"string","x-component":"Input","x-component-props":{},"x-index":9,"x-internal":{"isSystem":true,"permission":4}},"modifier_name":{"display":false,"readOnly":false,"title":"修改者","type":"string","x-component":"Input","x-component-props":{},"x-index":8,"x-internal":{"isSystem":true,"permission":4}},"updated_at":{"display":false,"readOnly":false,"title":"修改时间","type":"datetime","x-component":"DatePicker","x-component-props":{"isNow":false,"showTime":false,"style":{"width":"100%"}},"x-index":5,"x-internal":{"isSystem":true,"permission":4}}},"title":"审批流测试","type":"object","x-internal":{"columns":1,"defaultValueFrom":"customized","labelAlign":"top","validations":[],"version":"1.3.13","visibleHiddenLinkages":[]}},"columns":["_id","field_hptc4iHR","field_jAzU4dOG","created_at","updated_at","creator_name"],"filterConfig":null,"multiple":true,"tableID":"28z47","tableName":"审批流测试"},"x-index":1,"x-internal":{"defaultValueFrom":"linkage","fieldId":"field_3graExvh","isSystem":false,"permission":11},"x-mega-props":{}},"field_JLbA9Dv6":{"description":"","display":true,"readOnly":false,"required":false,"title":"级联选择","type":"label-value","x-component":"CascadeSelector","x-component-props":{"dropdownStyle":"cascade","expandTrigger":"hover","options":[],"placeholder":"请输入","predefinedDataset":"8f44e55a-a930-445b-adb5-7276a3185b11","required":false,"showFullPath":true},"x-index":2,"x-internal":{"defaultValueFrom":"predefined-dataset","fieldId":"field_JLbA9Dv6","isSystem":false,"permission":11,"sortable":false},"x-mega-props":{}},"field_Zj15oNj2":{"description":"","display":true,"readOnly":true,"title":"统计","type":"number","x-component":"AggregationRecords","x-component-props":{"aggType":"count","appID":"rk24c","dataRange":"all","decimalPlaces":0,"displayFieldNull":"-","fieldName":"","roundDecimal":"round","sourceFieldId":"field_3graExvh","tableID":"28z47"},"x-index":5,"x-internal":{"fieldId":"field_Zj15oNj2","isSystem":false,"permission":3},"x-mega-props":{}},"field_aELVnlwh":{"description":"","display":true,"readOnly":false,"required":false,"title":"附件","type":"array","x-component":"FileUpload","x-component-props":{"maxFileSize":500,"multiple":true,"uploaderDescription":""},"x-index":3,"x-internal":{"fieldId":"field_aELVnlwh","isSystem":false,"permission":11},"x-mega-props":{}},"field_c0JswMYn":{"description":"","display":true,"readOnly":false,"required":false,"title":"关联数据","type":"label-value","x-component":"AssociatedData","x-component-props":{"appID":"rk24c","associationTableID":"28z47","fieldName":"creator_name","filterConfig":null,"placeholder":"选择关联数据"},"x-index":4,"x-internal":{"fieldId":"field_c0JswMYn","isSystem":false,"permission":11},"x-mega-props":{}},"field_rm3KK9fS":{"default":"","description":"","display":true,"format":"","readOnly":false,"required":false,"title":"TITLE","type":"string","x-component":"Input","x-component-props":{"defaultValue":"","placeholder":"请输入"},"x-index":0,"x-internal":{"defaultValueFrom":"customized","fieldId":"field_rm3KK9fS","isSystem":false,"permission":11,"sortable":false},"x-mega-props":{}},"field_xXddZIt4":{"description":"","display":true,"readOnly":true,"required":false,"title":"流水号","type":"string","x-component":"Serial","x-component-props":{"appID":"rk24c","initialPosition":5,"numberPreview":"","prefix":{"backward":"yyyyMMdd","frontward":"ER"},"startingValue":1,"suffix":"","template":"ER.date{yyyyMMdd}.incr[name]{5,1}.step[name]{1}."},"x-index":6,"x-internal":{"fieldId":"field_xXddZIt4","isSystem":false,"permission":3},"x-mega-props":{}},"modifier_id":{"display":false,"readOnly":false,"title":"修改者 ID","type":"string","x-component":"Input","x-component-props":{},"x-index":13,"x-internal":{"isSystem":true,"permission":4}},"modifier_name":{"display":false,"readOnly":false,"title":"修改者","type":"string","x-component":"Input","x-component-props":{},"x-index":12,"x-internal":{"isSystem":true,"permission":4}},"updated_at":{"display":false,"readOnly":false,"title":"修改时间","type":"datetime","x-component":"DatePicker","x-component-props":{"isNow":false,"showTime":false,"style":{"width":"100%"}},"x-index":9,"x-internal":{"isSystem":true,"permission":4}}},"title":"IT高级字段","type":"object","x-internal":{"columns":1,"defaultValueFrom":"customized","labelAlign":"top","requiredLinkages":[],"validations":[],"version":"1.3.13","visibleHiddenLinkages":[]}},"config":{"filters":[],"pageTableColumns":[{"id":"field_JLbA9Dv6"},{"id":"field_xXddZIt4"},{"id":"field_c0JswMYn"},{"id":"field_rm3KK9fS"}],"pageTableShowRule":{"order":"-created_at","pageSize":10}},"tableID":"46qzg"}}
                const columns = getColumns(res?.data);
                setColumns(columns);
            }).catch(err=>{
                console.log(err)

                const res =
                {"code":0,"data":{"id":"3412fc95-6830-4c02-a4e8-e6cf5f2f09bf","schema":{"properties":{"_id":{"display":false,"readOnly":false,"title":"id","type":"string","x-component":"Input","x-component-props":{},"x-index":7,"x-internal":{"isSystem":true,"permission":4}},"created_at":{"display":false,"readOnly":false,"title":"创建时间","type":"datetime","x-component":"DatePicker","x-component-props":{"isNow":false,"showTime":false,"style":{"width":"100%"}},"x-index":8,"x-internal":{"isSystem":true,"permission":4}},"creator_id":{"display":false,"readOnly":false,"title":"创建者 ID","type":"string","x-component":"Input","x-component-props":{},"x-index":11,"x-internal":{"isSystem":true,"permission":4}},"creator_name":{"display":false,"readOnly":false,"title":"创建者","type":"string","x-component":"Input","x-component-props":{},"x-index":10,"x-internal":{"isSystem":true,"permission":4}},"field_3graExvh":{"description":"","display":true,"items":{"type":"string"},"readOnly":false,"required":false,"title":"关联记录","type":"array","x-component":"AssociatedRecords","x-component-props":{"appID":"rk24c","associatedTable":{"properties":{"_id":{"display":false,"readOnly":false,"title":"id","type":"string","x-component":"Input","x-component-props":{},"x-index":3,"x-internal":{"isSystem":true,"permission":4}},"created_at":{"display":false,"readOnly":false,"title":"创建时间","type":"datetime","x-component":"DatePicker","x-component-props":{"isNow":false,"showTime":false,"style":{"width":"100%"}},"x-index":4,"x-internal":{"isSystem":true,"permission":4}},"creator_id":{"display":false,"readOnly":false,"title":"创建者 ID","type":"string","x-component":"Input","x-component-props":{},"x-index":7,"x-internal":{"isSystem":true,"permission":4}},"creator_name":{"display":false,"readOnly":false,"title":"创建者","type":"string","x-component":"Input","x-component-props":{},"x-index":6,"x-internal":{"isSystem":true,"permission":4}},"field_hptc4iHR":{"default":"asdf","description":"","display":true,"format":"","readOnly":false,"required":false,"title":"单行文本test","type":"string","x-component":"Input","x-component-props":{"defaultValue":"asdf","placeholder":"请输入"},"x-index":0,"x-internal":{"defaultValueFrom":"customized","fieldId":"field_hptc4iHR","isSystem":false,"permission":11,"sortable":false},"x-mega-props":{}},"field_jAzU4dOG":{"default":"","description":"","display":true,"format":"","readOnly":true,"required":false,"title":"多行文本test","type":"string","x-component":"Textarea","x-component-props":{"autoSize":{"minRows":4},"defaultValue":"","placeholder":"请输入","rows":4},"x-index":1,"x-internal":{"defaultValueFrom":"customized","fieldId":"field_jAzU4dOG","isSystem":false,"permission":3,"sortable":false},"x-mega-props":{}},"field_jHHF9ppB":{"description":"","display":true,"readOnly":false,"required":false,"title":"时间日期","type":"datetime","x-component":"DatePicker","x-component-props":{"format":"YYYY-MM-DD","isNow":false,"placeholder":"","showTime":false,"style":{"width":"100%"}},"x-index":2,"x-internal":{"defaultValueFrom":"customized","fieldId":"field_jHHF9ppB","isSystem":false,"permission":11,"sortable":false},"x-mega-props":{}},"modifier_id":{"display":false,"readOnly":false,"title":"修改者 ID","type":"string","x-component":"Input","x-component-props":{},"x-index":9,"x-internal":{"isSystem":true,"permission":4}},"modifier_name":{"display":false,"readOnly":false,"title":"修改者","type":"string","x-component":"Input","x-component-props":{},"x-index":8,"x-internal":{"isSystem":true,"permission":4}},"updated_at":{"display":false,"readOnly":false,"title":"修改时间","type":"datetime","x-component":"DatePicker","x-component-props":{"isNow":false,"showTime":false,"style":{"width":"100%"}},"x-index":5,"x-internal":{"isSystem":true,"permission":4}}},"title":"审批流测试","type":"object","x-internal":{"columns":1,"defaultValueFrom":"customized","labelAlign":"top","validations":[],"version":"1.3.13","visibleHiddenLinkages":[]}},"columns":["_id","field_hptc4iHR","field_jAzU4dOG","created_at","updated_at","creator_name"],"filterConfig":null,"multiple":true,"tableID":"28z47","tableName":"审批流测试"},"x-index":1,"x-internal":{"defaultValueFrom":"linkage","fieldId":"field_3graExvh","isSystem":false,"permission":11},"x-mega-props":{}},"field_JLbA9Dv6":{"description":"","display":true,"readOnly":false,"required":false,"title":"级联选择","type":"label-value","x-component":"CascadeSelector","x-component-props":{"dropdownStyle":"cascade","expandTrigger":"hover","options":[],"placeholder":"请输入","predefinedDataset":"8f44e55a-a930-445b-adb5-7276a3185b11","required":false,"showFullPath":true},"x-index":2,"x-internal":{"defaultValueFrom":"predefined-dataset","fieldId":"field_JLbA9Dv6","isSystem":false,"permission":11,"sortable":false},"x-mega-props":{}},"field_Zj15oNj2":{"description":"","display":true,"readOnly":true,"title":"统计","type":"number","x-component":"AggregationRecords","x-component-props":{"aggType":"count","appID":"rk24c","dataRange":"all","decimalPlaces":0,"displayFieldNull":"-","fieldName":"","roundDecimal":"round","sourceFieldId":"field_3graExvh","tableID":"28z47"},"x-index":5,"x-internal":{"fieldId":"field_Zj15oNj2","isSystem":false,"permission":3},"x-mega-props":{}},"field_aELVnlwh":{"description":"","display":true,"readOnly":false,"required":false,"title":"附件","type":"array","x-component":"FileUpload","x-component-props":{"maxFileSize":500,"multiple":true,"uploaderDescription":""},"x-index":3,"x-internal":{"fieldId":"field_aELVnlwh","isSystem":false,"permission":11},"x-mega-props":{}},"field_c0JswMYn":{"description":"","display":true,"readOnly":false,"required":false,"title":"关联数据","type":"label-value","x-component":"AssociatedData","x-component-props":{"appID":"rk24c","associationTableID":"28z47","fieldName":"creator_name","filterConfig":null,"placeholder":"选择关联数据"},"x-index":4,"x-internal":{"fieldId":"field_c0JswMYn","isSystem":false,"permission":11},"x-mega-props":{}},"field_rm3KK9fS":{"default":"","description":"","display":true,"format":"","readOnly":false,"required":false,"title":"TITLE","type":"string","x-component":"Input","x-component-props":{"defaultValue":"","placeholder":"请输入"},"x-index":0,"x-internal":{"defaultValueFrom":"customized","fieldId":"field_rm3KK9fS","isSystem":false,"permission":11,"sortable":false},"x-mega-props":{}},"field_xXddZIt4":{"description":"","display":true,"readOnly":true,"required":false,"title":"流水号","type":"string","x-component":"Serial","x-component-props":{"appID":"rk24c","initialPosition":5,"numberPreview":"","prefix":{"backward":"yyyyMMdd","frontward":"ER"},"startingValue":1,"suffix":"","template":"ER.date{yyyyMMdd}.incr[name]{5,1}.step[name]{1}."},"x-index":6,"x-internal":{"fieldId":"field_xXddZIt4","isSystem":false,"permission":3},"x-mega-props":{}},"modifier_id":{"display":false,"readOnly":false,"title":"修改者 ID","type":"string","x-component":"Input","x-component-props":{},"x-index":13,"x-internal":{"isSystem":true,"permission":4}},"modifier_name":{"display":false,"readOnly":false,"title":"修改者","type":"string","x-component":"Input","x-component-props":{},"x-index":12,"x-internal":{"isSystem":true,"permission":4}},"updated_at":{"display":false,"readOnly":false,"title":"修改时间","type":"datetime","x-component":"DatePicker","x-component-props":{"isNow":false,"showTime":false,"style":{"width":"100%"}},"x-index":9,"x-internal":{"isSystem":true,"permission":4}}},"title":"IT高级字段","type":"object","x-internal":{"columns":1,"defaultValueFrom":"customized","labelAlign":"top","requiredLinkages":[],"validations":[],"version":"1.3.13","visibleHiddenLinkages":[]}},"config":{"filters":[],"pageTableColumns":[{"id":"field_JLbA9Dv6"},{"id":"field_xXddZIt4"},{"id":"field_c0JswMYn"},{"id":"field_rm3KK9fS"}],"pageTableShowRule":{"order":"-created_at","pageSize":10}},"tableID":"46qzg"}}
                const columns = getColumns(res?.data);
                setColumns(columns);
            });
    };

    const fetchData = () => {
        setLoading(true);
        fetch(`https://randomuser.me/api?${qs.stringify(getRandomuserParams(tableParams))}`)
            .then(res => res.json())
            .then(({ results }) => {
                // const _results = results.map(item => {
                //     return {
                //         ...item,
                //         label: item.email,
                //         value: item.email,
                //         _id: item.email,
                //     };
                // });
                // setData(results);
                const res =
                {"code":0,"data":{"total":15,"entities":[{"_id":"E2A87C8BE23C401490B70EAB1D2A913E","created_at":"2022-12-29T03:47:59.285Z","creator_id":"893ca81d-f571-4a6f-8088-673e8775ff64","creator_name":"魏涛","field_JLbA9Dv6":{"label":"网络/VPC网络","value":"field_Ez6HY4Av/field_RZewMQIb"},"field_aELVnlwh":[{"label":"1669361712542.jpg","size":158215,"type":"image/jpeg","value":"app/rk24c/form-attachment/46qzg/YzJjNGRkZGI4NWIwNGVkMDE5ZjAwNzY0MjcyYjY4ZTkxNjcyMjg1Njc1MjI1/1669361712542.jpg"}],"field_c0JswMYn":{"label":"魏涛v1","value":"CEB3AD5EDD17454BAF5028FFD3976096"},"field_rm3KK9fS":"5555555","field_xXddZIt4":"ER2022122900017"},{"_id":"582C667F3DFF410FB960E1085AD2EA43","created_at":"2022-12-29T03:12:14.011Z","creator_id":"039A91BFC1DA407CAEBB24D9C5FB8EE4","creator_name":"赵冰玉","field_JLbA9Dv6":{"label":"计算/云服务器（Instance）","value":"field_liscJaDk/field_lv417kv9"},"field_aELVnlwh":[{"label":"企业微信20221104-104745 (1).png","size":39474,"type":"image/png","value":"app/rk24c/form-attachment/46qzg/YWQ4ZGRhZjBlNTBlYTlhMTkxOWZmZWJlMDRmN2VmNmUxNjcyMjgzNTMxODc3/企业微信20221104-104745 (1).png"},{"label":"企业微信20221104-104745 (5).png","size":39474,"type":"image/png","value":"app/rk24c/form-attachment/46qzg/YWQ4ZGRhZjBlNTBlYTlhMTkxOWZmZWJlMDRmN2VmNmUxNjcyMjgzODgzNDA5/企业微信20221104-104745 (5).png"}],"field_rm3KK9fS":"1","field_xXddZIt4":"ER2022122900016","modifier_id":"039A91BFC1DA407CAEBB24D9C5FB8EE4","modifier_name":"赵冰玉","updated_at":"2022-12-29T03:18:05.315Z"},{"_id":"DB64796169A142EDA4919EE0BC384E53","created_at":"2022-12-29T03:11:06.525Z","creator_id":"893ca81d-f571-4a6f-8088-673e8775ff64","creator_name":"魏涛","field_A559Annh":[{"label":"1669361712542.jpg","size":158215,"type":"image/jpeg","value":"app/rk24c/form-attachment/46qzg/YzJjNGRkZGI4NWIwNGVkMDE5ZjAwNzY0MjcyYjY4ZTkxNjcyMjgzNDYwMjkw/1669361712542.jpg"}],"field_JLbA9Dv6":{"label":"计算/云服务器（Instance）","value":"field_liscJaDk/field_lv417kv9"},"field_c0JswMYn":{"label":"魏涛v1","value":"CEB3AD5EDD17454BAF5028FFD3976096"},"field_xXddZIt4":"ER2022122900015"},{"_id":"D03BF516ED0042D193C7E6849D29DAD1","created_at":"2022-12-29T02:41:47.8Z","creator_id":"9a2b0289-6a45-4627-9bbe-0607e005b5a6","creator_name":"李家允","field_JLbA9Dv6":{"label":"计算/云服务器（Instance）","value":"field_liscJaDk/field_lv417kv9"},"field_c0JswMYn":{"label":"魏涛v1","value":"50CA413CE6C145F0AFC2F9F08F68C275"},"field_xXddZIt4":"ER2022122900014"},{"_id":"AEB0A74FBA7E4DABB72637F6789E60EE","created_at":"2022-12-29T02:25:17.119Z","creator_id":"039A91BFC1DA407CAEBB24D9C5FB8EE4","creator_name":"赵冰玉","field_A559Annh":[{"label":"企业微信20221104-104745 (5).png","size":39474,"type":"image/png","value":"app/rk24c/form-attachment/46qzg/YWQ4ZGRhZjBlNTBlYTlhMTkxOWZmZWJlMDRmN2VmNmUxNjcyMjgwNzE0ODAw/企业微信20221104-104745 (5).png"}],"field_JLbA9Dv6":{"label":"计算/云服务器（Instance）","value":"field_liscJaDk/field_lv417kv9"},"field_aELVnlwh":[{"label":"企业微信20221104-104745.png","size":39474,"type":"image/png","value":"app/rk24c/form-attachment/46qzg/YWQ4ZGRhZjBlNTBlYTlhMTkxOWZmZWJlMDRmN2VmNmUxNjcyMjgzODY0MzYw/企业微信20221104-104745.png"},{"label":"人员列表 (1) (1).xlsx","size":43491,"type":"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet","value":"app/rk24c/form-attachment/46qzg/MjY1MGJjOTkxNWM2MjJhNGY2Y2Y5Njk3OTQ5ZmY0MGMxNjcyMjgzOTcyMjI5/人员列表 (1) (1).xlsx"}],"field_c0JswMYn":{"label":"魏涛v1","value":"50CA413CE6C145F0AFC2F9F08F68C275"},"field_rm3KK9fS":"","field_xXddZIt4":"ER2022122900013","modifier_id":"039A91BFC1DA407CAEBB24D9C5FB8EE4","modifier_name":"赵冰玉","updated_at":"2022-12-29T03:19:34.436Z"},{"_id":"DB4EC0E976AE47A98CC4077CE0A5F2D6","created_at":"2022-12-29T02:21:59.154Z","creator_id":"039A91BFC1DA407CAEBB24D9C5FB8EE4","creator_name":"赵冰玉","field_A559Annh":[{"label":"企业微信20221104-104745 (5).png","size":39474,"type":"image/png","value":"app/rk24c/form-attachment/46qzg/YWQ4ZGRhZjBlNTBlYTlhMTkxOWZmZWJlMDRmN2VmNmUxNjcyMjgwNTE2NjIw/企业微信20221104-104745 (5).png"}],"field_JLbA9Dv6":{"label":"计算/云服务器（Instance）","value":"field_liscJaDk/field_lv417kv9"},"field_aELVnlwh":[{"label":"企业微信20221104-104745.png","size":39474,"type":"image/png","value":"app/rk24c/form-attachment/46qzg/YWQ4ZGRhZjBlNTBlYTlhMTkxOWZmZWJlMDRmN2VmNmUxNjcyMjgzODEyMjI5/企业微信20221104-104745.png"}],"field_c0JswMYn":{"label":"魏涛v1","value":"50CA413CE6C145F0AFC2F9F08F68C275"},"field_rm3KK9fS":"","field_xXddZIt4":"ER2022122900012","modifier_id":"039A91BFC1DA407CAEBB24D9C5FB8EE4","modifier_name":"赵冰玉","updated_at":"2022-12-29T03:16:54.214Z"},{"_id":"A614D4817D7D4BB8BE93E9DAD1DAF766","created_at":"2022-12-29T02:05:38.447Z","creator_id":"039A91BFC1DA407CAEBB24D9C5FB8EE4","creator_name":"赵冰玉","field_A559Annh":[{"label":"企业微信20221104-104745.png","size":39474,"type":"image/png","value":"app/rk24c/form-attachment/46qzg/YWQ4ZGRhZjBlNTBlYTlhMTkxOWZmZWJlMDRmN2VmNmUxNjcyMjgwNDg5NDY4/企业微信20221104-104745.png"}],"field_GdRl1Ete":[{"label":"企业微信20221104-104745 (1).png","size":39474,"type":"image/png","value":"app/rk24c/form-attachment/46qzg/YWQ4ZGRhZjBlNTBlYTlhMTkxOWZmZWJlMDRmN2VmNmUxNjcyMjc5NjY3NDY3/企业微信20221104-104745 (1).png"}],"field_JLbA9Dv6":{"label":"网络/VPC网络","value":"field_Ez6HY4Av/field_RZewMQIb"},"field_c0JswMYn":{"label":"魏涛v1","value":"50CA413CE6C145F0AFC2F9F08F68C275"},"field_xXddZIt4":"ER2022122900011","field_zOUbq6fu":[{"label":"企业微信20221104-104745 (4).png","size":39474,"type":"image/png","value":"app/rk24c/form-attachment/46qzg/YWQ4ZGRhZjBlNTBlYTlhMTkxOWZmZWJlMDRmN2VmNmUxNjcyMjc5NjAzNzc2/企业微信20221104-104745 (4).png"}],"modifier_id":"039A91BFC1DA407CAEBB24D9C5FB8EE4","modifier_name":"赵冰玉","updated_at":"2022-12-29T02:24:26.718Z"},{"_id":"A03F6ABB073546B0B45C3A60A9881AB9","created_at":"2022-12-28T08:28:12.166Z","creator_id":"039A91BFC1DA407CAEBB24D9C5FB8EE4","creator_name":"赵冰玉","field_JLbA9Dv6":{"label":"网络/负载均衡器（Load Balancer）","value":"field_Ez6HY4Av/field_sEJSlTw8"},"field_c0JswMYn":{"label":"魏涛v1","value":"B8A4D19C60CA494284AF5F751EE1D5F6"},"field_xXddZIt4":"ER2022122800010","field_zOUbq6fu":[{"label":"企业微信20221104-104745 (4).png","size":39474,"type":"image/png","value":"app/noAppID/form-attachment/noTableID/YWQ4ZGRhZjBlNTBlYTlhMTkxOWZmZWJlMDRmN2VmNmUxNjcyMjIxMDMyMTc3/企业微信20221104-104745 (4).png"}],"modifier_id":"039A91BFC1DA407CAEBB24D9C5FB8EE4","modifier_name":"赵冰玉","updated_at":"2022-12-29T02:24:30.895Z"},{"_id":"CA1014ABF1684C4DA39E74B7F8C4715C","created_at":"2022-12-28T08:09:56.268Z","creator_id":"039A91BFC1DA407CAEBB24D9C5FB8EE4","creator_name":"赵冰玉","field_JLbA9Dv6":{"label":"计算/云服务器（Instance）","value":"field_liscJaDk/field_lv417kv9"},"field_c0JswMYn":{"label":"魏涛v1","value":"50CA413CE6C145F0AFC2F9F08F68C275"},"field_xXddZIt4":"ER2022122800009","field_zOUbq6fu":[{"label":"企业微信20221104-104745 (5).png","size":39474,"type":"image/png","value":"app/rk24c/form-attachment/46qzg/YWQ4ZGRhZjBlNTBlYTlhMTkxOWZmZWJlMDRmN2VmNmUxNjcyMjE0OTg1NjIy/企业微信20221104-104745 (5).png"}],"modifier_id":"039A91BFC1DA407CAEBB24D9C5FB8EE4","modifier_name":"赵冰玉","updated_at":"2022-12-29T02:24:37.907Z"},{"_id":"D1FD4109B3544A80BE905FFE7B0A3889","created_at":"2022-12-28T07:36:08.65Z","creator_id":"039A91BFC1DA407CAEBB24D9C5FB8EE4","creator_name":"赵冰玉","field_JLbA9Dv6":{"label":"计算/云服务器（Instance）","value":"field_liscJaDk/field_lv417kv9"},"field_c0JswMYn":{"label":"魏涛v1","value":"50CA413CE6C145F0AFC2F9F08F68C275"},"field_xXddZIt4":"ER2022122800008","field_zOUbq6fu":[{"label":"企业微信20221104-104745 (5).png","size":39474,"type":"image/png","value":"app/rk24c/form-attachment/46qzg/YWQ4ZGRhZjBlNTBlYTlhMTkxOWZmZWJlMDRmN2VmNmUxNjcyMjEyOTYzMzM4/企业微信20221104-104745 (5).png"}],"modifier_id":"039A91BFC1DA407CAEBB24D9C5FB8EE4","modifier_name":"赵冰玉","updated_at":"2022-12-29T02:24:46.221Z"}]}}
                setData(res.data.entities);
                setLoading(false);
                setTableParams({
                    ...tableParams,
                    pagination: {
                        ...tableParams.pagination,
                        total: 200,
                    },
                });
            }).catch(err=>{
                console.log(err)

                const res =
                {"code":0,"data":{"total":15,"entities":[{"_id":"E2A87C8BE23C401490B70EAB1D2A913E","created_at":"2022-12-29T03:47:59.285Z","creator_id":"893ca81d-f571-4a6f-8088-673e8775ff64","creator_name":"魏涛","field_JLbA9Dv6":{"label":"网络/VPC网络","value":"field_Ez6HY4Av/field_RZewMQIb"},"field_aELVnlwh":[{"label":"1669361712542.jpg","size":158215,"type":"image/jpeg","value":"app/rk24c/form-attachment/46qzg/YzJjNGRkZGI4NWIwNGVkMDE5ZjAwNzY0MjcyYjY4ZTkxNjcyMjg1Njc1MjI1/1669361712542.jpg"}],"field_c0JswMYn":{"label":"魏涛v1","value":"CEB3AD5EDD17454BAF5028FFD3976096"},"field_rm3KK9fS":"5555555","field_xXddZIt4":"ER2022122900017"},{"_id":"582C667F3DFF410FB960E1085AD2EA43","created_at":"2022-12-29T03:12:14.011Z","creator_id":"039A91BFC1DA407CAEBB24D9C5FB8EE4","creator_name":"赵冰玉","field_JLbA9Dv6":{"label":"计算/云服务器（Instance）","value":"field_liscJaDk/field_lv417kv9"},"field_aELVnlwh":[{"label":"企业微信20221104-104745 (1).png","size":39474,"type":"image/png","value":"app/rk24c/form-attachment/46qzg/YWQ4ZGRhZjBlNTBlYTlhMTkxOWZmZWJlMDRmN2VmNmUxNjcyMjgzNTMxODc3/企业微信20221104-104745 (1).png"},{"label":"企业微信20221104-104745 (5).png","size":39474,"type":"image/png","value":"app/rk24c/form-attachment/46qzg/YWQ4ZGRhZjBlNTBlYTlhMTkxOWZmZWJlMDRmN2VmNmUxNjcyMjgzODgzNDA5/企业微信20221104-104745 (5).png"}],"field_rm3KK9fS":"1","field_xXddZIt4":"ER2022122900016","modifier_id":"039A91BFC1DA407CAEBB24D9C5FB8EE4","modifier_name":"赵冰玉","updated_at":"2022-12-29T03:18:05.315Z"},{"_id":"DB64796169A142EDA4919EE0BC384E53","created_at":"2022-12-29T03:11:06.525Z","creator_id":"893ca81d-f571-4a6f-8088-673e8775ff64","creator_name":"魏涛","field_A559Annh":[{"label":"1669361712542.jpg","size":158215,"type":"image/jpeg","value":"app/rk24c/form-attachment/46qzg/YzJjNGRkZGI4NWIwNGVkMDE5ZjAwNzY0MjcyYjY4ZTkxNjcyMjgzNDYwMjkw/1669361712542.jpg"}],"field_JLbA9Dv6":{"label":"计算/云服务器（Instance）","value":"field_liscJaDk/field_lv417kv9"},"field_c0JswMYn":{"label":"魏涛v1","value":"CEB3AD5EDD17454BAF5028FFD3976096"},"field_xXddZIt4":"ER2022122900015"},{"_id":"D03BF516ED0042D193C7E6849D29DAD1","created_at":"2022-12-29T02:41:47.8Z","creator_id":"9a2b0289-6a45-4627-9bbe-0607e005b5a6","creator_name":"李家允","field_JLbA9Dv6":{"label":"计算/云服务器（Instance）","value":"field_liscJaDk/field_lv417kv9"},"field_c0JswMYn":{"label":"魏涛v1","value":"50CA413CE6C145F0AFC2F9F08F68C275"},"field_xXddZIt4":"ER2022122900014"},{"_id":"AEB0A74FBA7E4DABB72637F6789E60EE","created_at":"2022-12-29T02:25:17.119Z","creator_id":"039A91BFC1DA407CAEBB24D9C5FB8EE4","creator_name":"赵冰玉","field_A559Annh":[{"label":"企业微信20221104-104745 (5).png","size":39474,"type":"image/png","value":"app/rk24c/form-attachment/46qzg/YWQ4ZGRhZjBlNTBlYTlhMTkxOWZmZWJlMDRmN2VmNmUxNjcyMjgwNzE0ODAw/企业微信20221104-104745 (5).png"}],"field_JLbA9Dv6":{"label":"计算/云服务器（Instance）","value":"field_liscJaDk/field_lv417kv9"},"field_aELVnlwh":[{"label":"企业微信20221104-104745.png","size":39474,"type":"image/png","value":"app/rk24c/form-attachment/46qzg/YWQ4ZGRhZjBlNTBlYTlhMTkxOWZmZWJlMDRmN2VmNmUxNjcyMjgzODY0MzYw/企业微信20221104-104745.png"},{"label":"人员列表 (1) (1).xlsx","size":43491,"type":"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet","value":"app/rk24c/form-attachment/46qzg/MjY1MGJjOTkxNWM2MjJhNGY2Y2Y5Njk3OTQ5ZmY0MGMxNjcyMjgzOTcyMjI5/人员列表 (1) (1).xlsx"}],"field_c0JswMYn":{"label":"魏涛v1","value":"50CA413CE6C145F0AFC2F9F08F68C275"},"field_rm3KK9fS":"","field_xXddZIt4":"ER2022122900013","modifier_id":"039A91BFC1DA407CAEBB24D9C5FB8EE4","modifier_name":"赵冰玉","updated_at":"2022-12-29T03:19:34.436Z"},{"_id":"DB4EC0E976AE47A98CC4077CE0A5F2D6","created_at":"2022-12-29T02:21:59.154Z","creator_id":"039A91BFC1DA407CAEBB24D9C5FB8EE4","creator_name":"赵冰玉","field_A559Annh":[{"label":"企业微信20221104-104745 (5).png","size":39474,"type":"image/png","value":"app/rk24c/form-attachment/46qzg/YWQ4ZGRhZjBlNTBlYTlhMTkxOWZmZWJlMDRmN2VmNmUxNjcyMjgwNTE2NjIw/企业微信20221104-104745 (5).png"}],"field_JLbA9Dv6":{"label":"计算/云服务器（Instance）","value":"field_liscJaDk/field_lv417kv9"},"field_aELVnlwh":[{"label":"企业微信20221104-104745.png","size":39474,"type":"image/png","value":"app/rk24c/form-attachment/46qzg/YWQ4ZGRhZjBlNTBlYTlhMTkxOWZmZWJlMDRmN2VmNmUxNjcyMjgzODEyMjI5/企业微信20221104-104745.png"}],"field_c0JswMYn":{"label":"魏涛v1","value":"50CA413CE6C145F0AFC2F9F08F68C275"},"field_rm3KK9fS":"","field_xXddZIt4":"ER2022122900012","modifier_id":"039A91BFC1DA407CAEBB24D9C5FB8EE4","modifier_name":"赵冰玉","updated_at":"2022-12-29T03:16:54.214Z"},{"_id":"A614D4817D7D4BB8BE93E9DAD1DAF766","created_at":"2022-12-29T02:05:38.447Z","creator_id":"039A91BFC1DA407CAEBB24D9C5FB8EE4","creator_name":"赵冰玉","field_A559Annh":[{"label":"企业微信20221104-104745.png","size":39474,"type":"image/png","value":"app/rk24c/form-attachment/46qzg/YWQ4ZGRhZjBlNTBlYTlhMTkxOWZmZWJlMDRmN2VmNmUxNjcyMjgwNDg5NDY4/企业微信20221104-104745.png"}],"field_GdRl1Ete":[{"label":"企业微信20221104-104745 (1).png","size":39474,"type":"image/png","value":"app/rk24c/form-attachment/46qzg/YWQ4ZGRhZjBlNTBlYTlhMTkxOWZmZWJlMDRmN2VmNmUxNjcyMjc5NjY3NDY3/企业微信20221104-104745 (1).png"}],"field_JLbA9Dv6":{"label":"网络/VPC网络","value":"field_Ez6HY4Av/field_RZewMQIb"},"field_c0JswMYn":{"label":"魏涛v1","value":"50CA413CE6C145F0AFC2F9F08F68C275"},"field_xXddZIt4":"ER2022122900011","field_zOUbq6fu":[{"label":"企业微信20221104-104745 (4).png","size":39474,"type":"image/png","value":"app/rk24c/form-attachment/46qzg/YWQ4ZGRhZjBlNTBlYTlhMTkxOWZmZWJlMDRmN2VmNmUxNjcyMjc5NjAzNzc2/企业微信20221104-104745 (4).png"}],"modifier_id":"039A91BFC1DA407CAEBB24D9C5FB8EE4","modifier_name":"赵冰玉","updated_at":"2022-12-29T02:24:26.718Z"},{"_id":"A03F6ABB073546B0B45C3A60A9881AB9","created_at":"2022-12-28T08:28:12.166Z","creator_id":"039A91BFC1DA407CAEBB24D9C5FB8EE4","creator_name":"赵冰玉","field_JLbA9Dv6":{"label":"网络/负载均衡器（Load Balancer）","value":"field_Ez6HY4Av/field_sEJSlTw8"},"field_c0JswMYn":{"label":"魏涛v1","value":"B8A4D19C60CA494284AF5F751EE1D5F6"},"field_xXddZIt4":"ER2022122800010","field_zOUbq6fu":[{"label":"企业微信20221104-104745 (4).png","size":39474,"type":"image/png","value":"app/noAppID/form-attachment/noTableID/YWQ4ZGRhZjBlNTBlYTlhMTkxOWZmZWJlMDRmN2VmNmUxNjcyMjIxMDMyMTc3/企业微信20221104-104745 (4).png"}],"modifier_id":"039A91BFC1DA407CAEBB24D9C5FB8EE4","modifier_name":"赵冰玉","updated_at":"2022-12-29T02:24:30.895Z"},{"_id":"CA1014ABF1684C4DA39E74B7F8C4715C","created_at":"2022-12-28T08:09:56.268Z","creator_id":"039A91BFC1DA407CAEBB24D9C5FB8EE4","creator_name":"赵冰玉","field_JLbA9Dv6":{"label":"计算/云服务器（Instance）","value":"field_liscJaDk/field_lv417kv9"},"field_c0JswMYn":{"label":"魏涛v1","value":"50CA413CE6C145F0AFC2F9F08F68C275"},"field_xXddZIt4":"ER2022122800009","field_zOUbq6fu":[{"label":"企业微信20221104-104745 (5).png","size":39474,"type":"image/png","value":"app/rk24c/form-attachment/46qzg/YWQ4ZGRhZjBlNTBlYTlhMTkxOWZmZWJlMDRmN2VmNmUxNjcyMjE0OTg1NjIy/企业微信20221104-104745 (5).png"}],"modifier_id":"039A91BFC1DA407CAEBB24D9C5FB8EE4","modifier_name":"赵冰玉","updated_at":"2022-12-29T02:24:37.907Z"},{"_id":"D1FD4109B3544A80BE905FFE7B0A3889","created_at":"2022-12-28T07:36:08.65Z","creator_id":"039A91BFC1DA407CAEBB24D9C5FB8EE4","creator_name":"赵冰玉","field_JLbA9Dv6":{"label":"计算/云服务器（Instance）","value":"field_liscJaDk/field_lv417kv9"},"field_c0JswMYn":{"label":"魏涛v1","value":"50CA413CE6C145F0AFC2F9F08F68C275"},"field_xXddZIt4":"ER2022122800008","field_zOUbq6fu":[{"label":"企业微信20221104-104745 (5).png","size":39474,"type":"image/png","value":"app/rk24c/form-attachment/46qzg/YWQ4ZGRhZjBlNTBlYTlhMTkxOWZmZWJlMDRmN2VmNmUxNjcyMjEyOTYzMzM4/企业微信20221104-104745 (5).png"}],"modifier_id":"039A91BFC1DA407CAEBB24D9C5FB8EE4","modifier_name":"赵冰玉","updated_at":"2022-12-29T02:24:46.221Z"}]}}
                setData(res.data.entities);
                setLoading(false);
                setTableParams({
                    ...tableParams,
                    pagination: {
                        ...tableParams.pagination,
                        total: 200,
                    },
                });
            });
    };

    useEffect(() => {
        fetchColumns();
    }, []);

    useEffect(() => {
        fetchData();
    }, [columns, JSON.stringify(tableParams)]);

    const handleTableChange = (
        pagination: TablePaginationConfig,
        filters: Record<string, FilterValue>,
        sorter: SorterResult<DataType>,
    ) => {
        setTableParams({
            pagination,
            filters,
            ...sorter,
        });
    };

    return (
        <div className="schema-table-wrap">
            <Table
                columns={columns}
                rowKey={record => record._id}
                dataSource={data}
                pagination={tableParams.pagination}
                loading={loading}
                onChange={handleTableChange}
                className={`schema-table ${className}`}
                {...res}
            />
        </div>

    );
};

export default SchemaTable;
