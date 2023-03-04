import React, { useEffect, useRef, useState } from 'react';
import { Select, Spin } from 'antd';
import { FileOutlined, FolderOutlined, InboxOutlined } from '@ant-design/icons';

import type { SelectProps } from 'antd';
import { getSearchList } from '../request';

const { Option } = Select;

let timeout: ReturnType<typeof setTimeout> | null;

const fetch = (value: string, callback: Function) => {
    if (timeout) {
        clearTimeout(timeout);
        timeout = null;
    }

    const fake = () => {
        getSearchList(value)
            .then((res: any) => {
                const data = res?.data?.ocs?.data?.entries?.map((item: any) => ({
                    ...item,
                    isFolder: item.icon==='icon-folder',
                    value: item.resourceUrl,
                    label: item.title,
                    subline: item.subline,
                    path: item.subline?.replace('in ', ''),
                }));
                callback(data);
            });
    };

    timeout = setTimeout(fake, 300);
};

const NextCloudSearchSelect = (props: any) => {
    const { onSearchSelect } = props;
    const [data, setData] = useState<SelectProps['options']>([]);
    const [value, setValue] = useState<string>();
    const [loading, setLoading] = useState<boolean>(true);

    const handleSearch = (newValue: string) => {
        setLoading(true);
        setValue(newValue);
        if (newValue) {
            fetch(newValue, (val) => {
                setData(val);
                setLoading(false);
            });
        } else {
            setLoading(false);
            setData([]);
        }
    };

    const handleSelect = (data) => {
        onSearchSelect && onSearchSelect(data?.path);
    };

    const NoData = () => (
        <div className='no-data'>
            <InboxOutlined />
        No Data
        </div>
    );

    const getNotFoundContent = () => {
        if (!value) return null;
        if (loading) return <Spin className='loading' size='small' />;
        if (!loading) return <NoData />;
    };
    return (
        <Select
            popupClassName="NextCloudSearchSelect"
            showSearch
            value={[]}
            placeholder="搜索"
            defaultActiveFirstOption={false}
            filterOption={false}
            notFoundContent={getNotFoundContent()}
            onSearch={handleSearch}
            onSelect={() => {
                setData([]);
                setValue('');
            }}
            open={true}
        >
            {
                data.map((item: any, index) => {
                    return (
                        <Option
                            key={index}
                            value={item.value}
                            label={item.label}
                        >
                            <div className='file-option-wrap' onClick={() => handleSelect(item)}>
                                <div className="fileName">
                                    { item.isFolder ? <FolderOutlined /> : <FileOutlined /> }
                                    { item.label }
                                </div>
                                <div className="filePath">
                                    <div className="value"> { item.subline }</div>
                                </div>
                            </div>
                        </Option>
                    );
                })
            }
        </Select>
    );
};

export default NextCloudSearchSelect;
