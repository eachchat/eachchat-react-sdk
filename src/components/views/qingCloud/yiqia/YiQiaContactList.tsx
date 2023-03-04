/* eslint-disable max-len */
/* eslint-disable camelcase */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { Button, Input, notification, Tree } from 'antd';
import { ApartmentOutlined } from '@ant-design/icons';
import { Action } from "../../../../dispatcher/actions";
import dis from '../../../../dispatcher/dispatcher';
import BaseAvatar from '../../avatars/BaseAvatar';
import type { DataNode } from 'antd/es/tree';
import { getContactList } from './request';

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

    const [treeData, setTreeData] = useState(initTreeData);
    const [error, setError] = useState(false);

    useEffect(() => {
        getInitTreeData();
    }, []);

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
        return <div
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

    const flatData = (data, list=[]) => {
        data.forEach(item => {
            list.push(item);
            item?.children && item?.children?.length>0 ? flatData(item.children, list) : "";  // 子级递归
        });
    };
  
    
    return (
        <div
            id="yiQiaContactList"
            className='yiQiaContactList'
        >
            {
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
