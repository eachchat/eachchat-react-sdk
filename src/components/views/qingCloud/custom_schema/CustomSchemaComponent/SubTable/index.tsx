/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect, useState } from 'react';
import { IMutators, InternalFieldList as FieldList, ISchema } from '@formily/antd';
// import 'antd/dist/antd.css';
import cs from 'classnames';
import { isObject } from 'lodash';
import { PlusOutlined, DownOutlined, UpOutlined } from '@ant-design/icons';

import SubTableRow from './row';
import schemaToFields from '../qxp/schema-convert';
import { Column } from '../qxp/interface';
import { components } from './components';
import { getDefaultValue, isMeanless, schemaRulesTransform } from '../qxp/utils';
import FormDataValueRenderer from '../qxp/form-data-value-renderer';
import { getTableSchema } from './request';
import MatrixClientContext from '../../../../../../contexts/MatrixClientContext';

const SubTable = (props) => {
    const { name, value, props: prps, schema: definedSchema, mutators }=props;
    const { layout, subordination, columns, rowLimit, tableID, appID } = prps?.['x-component-props'] || {};
    const isFromForeign = subordination === 'foreign_table';
    const isInitialValueEmpty = value?.every((v: Record<string, unknown>) => isMeanless(v));
    const [schema, setSchema] = useState(definedSchema?.items);
    const [{ componentColumns, rowPlaceHolder }, setSubTableState] = useState({
        componentColumns: [], rowPlaceHolder: {},
    });
    const [showAll, setShowAll] = useState(false);
    const [data,setData]=useState<any>();
    const cli = useContext(MatrixClientContext);

    useEffect(()=>{
        console.log('SubTable===', props);
    },[])
    
    useEffect(() => {
        getForeignTableSchema();
    }, []);

    useEffect(()=>{
       isFromForeign ? setSchema(data?.schema)  : setSchema(schema);
    },[data])

    useEffect(() => {
        if (!schema) {
            return;
        }
        const rowPlaceHolder = {};
        const componentColumns: Column[] = schemaToFields(schema).reduce((acc: Column[], field) => {
            const isHidden = !field.display;
            if ((isFromForeign && !columns?.includes(field.id)) || field.id === '_id' || isHidden) {
                return acc;
            }
            const newColumn = buildColumnFromSchema(field.id, field);
            if (newColumn) {
                Object.assign(rowPlaceHolder, { [field.id]: getDefaultValue(field) });
                acc.push(newColumn);
            }
            return acc;
        }, []);
        setSubTableState({ componentColumns, rowPlaceHolder });
        isInitialValueEmpty && mutators?.change([rowPlaceHolder]);
    }, [schema, columns]);

    const getForeignTableSchema = ()=>{
        if(!(isFromForeign && tableID && appID)) return;
        // setData(_data.data);
        // cli.getSubTableSchema({page:1,size:50}).then(res=>{
        //     console.log(res);
        //     setData(_data.data);
        // }).catch(err=>{
        //     console.log(err)
        // })
    }

    const buildColumnFromSchema = (dataIndex: string, sc: ISchema) => {
        const componentName = sc['x-component']?.toLowerCase() as any;
        const componentProps = sc['x-component-props'] || {};
        const componentPropsInternal = sc['x-internal'] || {};
        const dataSource = sc?.enum?.filter((option) => !isObject(option) || option?.label !== '');
        if (!components[componentName]) {
            console.log('component %s is missing in subTable', componentName);
            return null;
        }

        return {
            componentName,
            title: sc.title as string,
            dataIndex,
            component: components[componentName],
            props: {
                ...componentProps,
                ...componentPropsInternal,
                'x-component-props': componentProps,
                'x-internal': componentPropsInternal,
                // "readOnly": props.editable || props.readOnly || !!sc.readOnly,
                "readOnly":  !props.editable,
            },
            schema: { ...sc, 'x-internal': { ...sc?.['x-internal'], parentFieldId: name } } as any,
            dataSource,
            required: !!sc?.required,
            // readOnly: props.readOnly || !!sc.readOnly,
            "readOnly": !props.editable,
            rules: schemaRulesTransform(sc),
            render: (value: any) => {
                if (isMeanless(value)) {
                    return <span className='text-gray-300'>——</span>;
                }

                return <FormDataValueRenderer value={value} schema={sc} />;
            },
        };
    };

    const onAddRow = (mutators: IMutators) => {
        mutators.push(rowPlaceHolder);
        setShowAll(true);
    };

    return (
        <div className='subtable-wrap'>
            <FieldList
                name={name}
                initialValue={value}
            >
                { ({ state, mutators, form }) => {
                    console.log('SubTable state',state)
                    return (
                        <div className={cs('w-full flex flex-col border border-gray-300', props?.className)}>
                            <div className="overflow-auto">
                                {
                                    showAll?
                                        state.value.map((item: any, index: number) => {
                                            return (
                                                <SubTableRow
                                                    name={name}
                                                    componentColumns={componentColumns}
                                                    key={index}
                                                    index={index}
                                                    item={item}
                                                    form={form}
                                                    layout={layout}
                                                    mutators={mutators}
                                                    removeAble={!prps.readOnly}
                                                />
                                            );
                                        }) :
                                        state.value.length>0 && [state.value[0]].map((item: any, index: number) => {
                                            return (
                                                <SubTableRow
                                                    name={name}
                                                    componentColumns={componentColumns}
                                                    key={index}
                                                    index={index}
                                                    item={item}
                                                    form={form}
                                                    layout={layout}
                                                    mutators={mutators}
                                                    removeAble={!prps.readOnly}
                                                />
                                            );
                                        })

                                }
                            </div>
                            <div className='subtable-btn-wrap'>
                                { (rowLimit === 'multiple' && !prps.readOnly) && (
                                    <div className="border-t-1 border-gray-300 flex items-center">
                                        <PlusOutlined
                                            style={{
                                                fontSize: "18px",
                                                padding: "6px"
                                            }}
                                            onClick={() => onAddRow(mutators)}
                                        />
                                    </div>
                                ) }
                                {
                                    state.value.length > 1 &&
                                    <div className="border-t-1 border-gray-300 flex items-center w-full">
                                        {
                                            !showAll ?
                                                <DownOutlined
                                                    style={{
                                                        fontSize: "18px",
                                                        padding: "6px",
                                                        width: "100%",
                                                        display: "flex",
                                                        justifyContent: "flex-end",
                                                    }}
                                                    onClick={() => setShowAll(true)}
                                                />:
                                                <UpOutlined
                                                    style={{
                                                        fontSize: "18px",
                                                        padding: "6px",
                                                        width: "100%",
                                                        display: "flex",
                                                        justifyContent: "flex-end",
                                                    }}
                                                    onClick={() => setShowAll(false)}
                                                />

                                        }

                                    </div>

                                }

                            </div>

                        </div>
                    );
                } }
            </FieldList>

        </div>
    );
};

SubTable.isFieldComponent = true;

export default SubTable;

