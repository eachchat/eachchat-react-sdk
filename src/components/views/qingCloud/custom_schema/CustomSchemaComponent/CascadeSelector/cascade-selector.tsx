/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/naming-convention */
import React, { useContext, useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { Cascader, CascaderProps } from 'antd';
import { DefaultOptionType } from 'antd/lib/cascader';
import { omit, last } from 'lodash';
import { flatten } from 'ramda';

import { ApiDataType } from '../qxp/interface';
import { getOptionSetById, getSelectApiData } from './request';
import MatrixClientContext from '../../../../../../contexts/MatrixClientContext';


export type DefaultValueFrom = 'customized' | 'predefined-dataset' | 'api';

type CascaderOptionType = DefaultOptionType;
type SingleValueType = (string | number)[];
type CascaderValueType = SingleValueType | SingleValueType[];

type baseProps = {
  sendUserData: boolean;
  formApi: ApiDataType;
  predefinedDataset?: string;
  defaultValueFrom: DefaultValueFrom;
};

type FetchOptions = CascaderProps<any> & baseProps & {
  options: CascaderOptionType[];
};

export type CascadeSelectorProps = CascaderProps<any> & baseProps & {
  showFullPath?: boolean;
  onChange: (value: CascaderOptionType) => void;
  value: CascaderOptionType;
};

function useFetchOptions({
    options,
    defaultValueFrom,
    predefinedDataset,
    sendUserData,
    formApi,
}: FetchOptions): CascaderOptionType[] {
    const [preparedOptions, setOptions] = useState(options || []);
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);

    const cli = useContext(MatrixClientContext);

    useEffect(() => setOptions(options), [options, defaultValueFrom]);

    useEffect(() => {
        handleQuery();
    }, []);

    const handleQuery = () => {
        setIsLoading(true);
        setIsLoading(false);
        if (defaultValueFrom === 'api') {
            return getSelectApiData(formApi, sendUserData).then((val) => {
                setData(val);
            }).catch(err => {
                setIsError(true);
            }).finally(() => {
                setIsLoading(false);
            });
        }
        if (defaultValueFrom === 'customized' || !predefinedDataset) {
            setData(options);
            setIsLoading(false);
        }

        return getOptionSetById(predefinedDataset).then(({ content }) => {
            let parsedCont;
            try {
                parsedCont = JSON.parse(content || '[]');
            } catch (err) {
                parsedCont = [];
            }
            setData(parsedCont);
        }).catch(err => {
            setIsError(true);
        }).finally(() => {
            setIsLoading(false);
        });
    };

    // const { data, isLoading, isError } = useQuery([defaultValueFrom, predefinedDataset], () => {
    //     if (defaultValueFrom === 'api') {
    //         return getSelectApiData(formApi, sendUserData).then((val) => val);
    //     }
    //     if (defaultValueFrom === 'customized' || !predefinedDataset) {
    //         return options;
    //     }

    //     return getOptionSetById(predefinedDataset).then(({ content }) => {
    //         let parsedCont;
    //         try {
    //             parsedCont = JSON.parse(content || '[]');
    //         } catch (err) {
    //             parsedCont = [];
    //         }
    //         return parsedCont;
    //     });
    // }, { cacheTime: -1 });

    useEffect(() => {
        if (isLoading || isError || !data) {
            return;
        }
        // cli.getCascadeList({ page: 1, size: 10 }).then(res => {
        //     // setOptions(res?.data);
        //     const _data = {
        //         "code": 0,
        //         "data": {
        //             "id": "8f44e55a-a930-445b-adb5-7276a3185b11",
        //             "name": "工单相关产品",
        //             "type": 2,
        //             "content": "[]",
        //             "created_at": 1649991924
        //         }
        //     }
        //     setOptions(JSON.parse(_data.data.content));
        // }).catch(err => {
        //     console.log(err);
        // });
    }, [data, isLoading, isError]);

    return preparedOptions;
}

function CascadeSelector({
    predefinedDataset,
    defaultValueFrom,
    showFullPath,
    value,
    ...cascadeProps
}: CascadeSelectorProps): JSX.Element {
    const options = useFetchOptions({
        predefinedDataset,
        defaultValueFrom,
        options: cascadeProps.options || [],
        formApi: cascadeProps.formApi,
        sendUserData: cascadeProps.sendUserData,
    });

    function handleChange(
        _value: CascaderValueType, selected?: CascaderOptionType[] | CascaderOptionType[][],
    ): void {
        const selectedArray = flatten(selected ?? []);
        const labelToSave = selectedArray.map(({ label }) => label)?.join('/');
        const valueToSave = _value?.join('/');
        cascadeProps && cascadeProps.onChange({ label: labelToSave, value: valueToSave });
    }

    const _value = value ? (value.value as string || '').split('/') : undefined;

    return (
        <Cascader
            {...omit(cascadeProps, ['options', 'onChange'])}
            displayRender={(labels) => {
                return showFullPath ? labels?.join(' / ') : last(labels);
            }}
            getPopupContainer={(triggerNode) => triggerNode.parentNode as HTMLElement}
            value={_value}
            onChange={handleChange}
            options={options}
        />
    );
}

export default CascadeSelector;
