/* eslint-disable max-len */
/* eslint-disable camelcase */
/* eslint-disable react-hooks/exhaustive-deps */

import React, { useEffect, useState } from 'react';
import { Button, Input, notification, Tree } from 'antd';
import { ApartmentOutlined } from '@ant-design/icons';
import { reject } from 'lodash';

import Spinner from '../elements/Spinner';
import { Action } from "../../../dispatcher/actions";
import dis from '../../../dispatcher/dispatcher';
import BaseAvatar from '../avatars/BaseAvatar';
import type { DataNode } from 'antd/es/tree';
import { getContactList } from './request';

const { Search } = Input;
const avatarSize = 20;

const getParentKey = (key: React.Key, tree: DataNode[]): React.Key => {
    let parentKey: React.Key;
    for (let i = 0; i < tree.length; i++) {
        const node = tree[i];
        if (node.children) {
            if (node.children.some((item) => item.key === key)) {
                parentKey = node.key;
            } else if (getParentKey(key, node.children)) {
                parentKey = getParentKey(key, node.children);
            }
        }
    }
    return parentKey!;
};

window.yiqiaContact = {
    defaultData: [],
    defaultDataList: [],
    expandedKeys: [],
};

const initTreeData: DataNode[] = [];

const updateTreeData = (list: DataNode[], key: React.Key, children: DataNode[]): DataNode[] =>
    list.map(node => {
        if (node.key === key) {
            return {
                ...node,
                children,
            };
        }
        if (node.children) {
            return {
                ...node,
                children: updateTreeData(node.children, key, children),
            };
        }
        return node;
    });

const YiQiaContactList = () => {
    // const { yiqiaContact } = window;
    // const [expandedKeys, setExpandedKeys] = useState<React.Key[]>(yiqiaContact.expandedKeys);
    // const [searchValue, setSearchValue] = useState('');
    // const [autoExpandParent, setAutoExpandParent] = useState(true);
    // const [defaultData, setDefaultData]=useState(yiqiaContact.defaultData);
    // const [defaultDataList, setDefaultDataList]=useState(yiqiaContact.defaultDataList);
    // const [loading, setLoading]=useState(false);
    // const [parentId, setParentId]=useState('');

    const [treeData, setTreeData] = useState(initTreeData);
    const [error, setError] = useState(false);


    useEffect(() => {
        getInitTreeData();
    }, []);
    useEffect(() => {
        console.log('treeData', treeData);
    }, [treeData]);
    // useEffect(() => {
    //     !defaultData.length && handleGetDefaultData();
    // }, []);

    // useEffect(() => {
    //     parentId && insertTreeData();
    // }, [parentId]);

    // const handleGetDefaultData = () => {
    //     setLoading(true);
    //     getContactList(parentId)
    //         .then((res: any) => {
    //             const { groups }=res;
    //             const treeData = formatTreeData(groups);
    //             const expandedKeys= getDefaultExpandedKeys(groups);
    //             const list = [];
    //             flatData(treeData, list);
    //             setDefaultDataList(list);
    //             setDefaultData(treeData);
    //             setExpandedKeys(expandedKeys);
    //             window.yiqiaContact = {
    //                 defaultData: treeData,
    //                 defaultDataList: list,
    //                 expandedKeys: expandedKeys,
    //             };
    //         })
    //         .catch(err => {
    //             notification['error']({
    //                 message: 'Error',
    //                 description: err?.message,
    //             });
    //         }).finally(() => setLoading(false));
    // };

    const getInitTreeData = () => {
        setError(false);
        getContactList('')
            .then((res: any) => {
                const { groups }=res;
                const treeData = formatTreeData(groups);
                setTreeData(treeData);
            })
            .catch(err => {
                setError(true);
            });
    };

    const onLoadData = (data: any) => {
        const { pk, children=[] } = data;
        return new Promise<void>((resolve, reject) => {
            getContactList(pk)
                .then((res: any) => {
                    console.log('res',res)
                    const { groups }=res;
                    if (groups) {
                        const treeData = formatTreeData(groups);
                        setTreeData(origin =>
                            updateTreeData(origin, pk, [...children, ...treeData]),
                        );
                    }
                    resolve();
                })
                .catch(err => {
                    notification['error']({
                        message: 'Error',
                        description: err?.message,
                    });
                    reject();
                });
        });
    };

    const handleClick = (data: any) => {
        dis.dispatch({
            action: Action.ActiveContactData,
            context: data,
        });
    };

    const getTitle = (item) => {
        const { group_name, name }=item;
        // const active = item.name === searchValue;
        return <div
        // className={`yiqia-list-item ${(active?'active':'')}`}
            className={`yiqia-list-item `}
            onClick={() => !group_name && handleClick(item)}>
            {
                group_name ?
                    <>
                        <ApartmentOutlined />
                        { group_name }
                    </> :
                    <>
                        <BaseAvatar
                            idName={item?.matrixID}
                            name={name}
                            url=""
                            width={avatarSize}
                            height={avatarSize}
                            resizeMethod="crop"
                            className="mx_UserMenu_userAvatar_BaseAvatar"
                        />
                        { name }
                    </>
            }

        </div>;
    };

    const formatTreeData = (data, groupName?) => {
        const treeData = data.map(item => {
            const _item = {
                ...item,
                key: item?.pk || item?.email,
                value: item?.group_name || item?.name,
                groupName,
                employeeNumber: item?.employee_number,
                matrixID: item?.matrix_id,
                children: item?.users ? formatTreeData(item?.users, item?.group_name) : item?.users,
                isLeaf: item?.username,
            };

            return {
                ..._item,
                title: getTitle(_item),
            };
        });
        return treeData;
    };

    const getDefaultExpandedKeys = (data) => {
        const defaultExpandedKeys=[];
        data.forEach(item => {
            item?.pk && defaultExpandedKeys.push(item?.pk);
        });
        return defaultExpandedKeys;
    };

    const flatData = (data, list=[]) => {
        data.forEach(item => {
            list.push(item);
            item?.children && item?.children?.length>0 ? flatData(item.children, list) : "";  // 子级递归
        });
    };
    const onExpand = (newExpandedKeys: React.Key[]) => {
        setExpandedKeys(newExpandedKeys);
        setAutoExpandParent(false);
        setParentId(newExpandedKeys?.[0] as any);
        console.log('newExpandedKeys', defaultData, newExpandedKeys);
    };

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
        const newExpandedKeys = defaultDataList
            .map((item) => {
                if (item?.value?.indexOf(value) > -1 || item?.username?.indexOf(value) > -1) {
                    return getParentKey(item?.key, defaultData);
                }
            })
            .filter((item, i, self) => item && self?.indexOf(item) === i);
        setExpandedKeys(newExpandedKeys as React.Key[]);
        setSearchValue(value);
        setAutoExpandParent(true);
    };

    return (
        <div
            id="yiQiaContactList"
            className='yiQiaContactList'
        >
            { /* <Search className='yiqia-user-search ' placeholder="搜索" onChange={onChange} /> */ }
            { /* <Input className='yiqia-user-search ' style={{ width: "90%" }} placeholder="搜索" onChange={onChange} /> */ }
            {
                // loading ?
                //     <Spinner />:
                // <Tree
                //     onExpand={onExpand}
                //     treeData={defaultData}
                //     // expandedKeys={expandedKeys}
                //     // autoExpandParent={autoExpandParent}
                // />


                !error && <Tree
                    loadData={onLoadData}
                    treeData={treeData}
                />

            }
            {
                error &&
                <Button className='contact-error' type="link" onClick={getInitTreeData}>
                    点击重新加载
                </Button>
            }

        </div>
    );
};

export default YiQiaContactList;
