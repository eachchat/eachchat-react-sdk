import React, { useEffect, useState } from 'react';
import { Button, notification, Tree, TreeSelect } from 'antd';
import { ApartmentOutlined } from '@ant-design/icons';
import type { DataNode } from 'antd/es/tree';
import BaseAvatar from '../../../avatars/BaseAvatar';
import { getShareUserList } from '../request';
import { isArray } from 'lodash';
import { ShareType } from '../../constant';

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

const NextCloudShareUserList = ({disabled, onChange}) => {
    const [treeData, setTreeData] = useState([]);
    const [selectList, setSelectList] = useState([]);


    useEffect(() => {
        getInitTreeData();
    }, []);

    useEffect(()=>{
        onChange && onChange(selectList);
    },[selectList])

    const getInitTreeData = () => {
        getShareUserList('')
            .then((res: any) => {
                const { groups }=res;
                const treeData = formatTreeData(groups);
                setTreeData(treeData);
            })
            .catch(err => {
                notification['error']({
                    message: 'Error',
                    description: err?.message,
                });
            });
    };

    const onLoadData = (data: any) => {
        const { pk, children=[] } = data;
        return new Promise<void>((resolve, reject) => {
            getShareUserList(pk)
                .then((res: any) => {
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

    const getTitle = (item) => {
        const { group_name, name }=item;
        return <div
            className={`yiqia-list-item `}
            data-item={item}
        >
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
                value: item?.pk || item?.email,
                groupName,
                employeeNumber: item?.employee_number,
                matrixID: item?.matrix_id,
                children: item?.users ? formatTreeData(item?.users, item?.group_name) : item?.users,
                isLeaf: item?.username,
                shareType: item?.username ? ShareType.User : ShareType.Dept,
                shareWith: item?.username ? item?.email : item?.group_name,
                name: item?.name || item?.group_name,
            };

            return {
                ..._item,
                title: getTitle(_item),
            };
        });
        return treeData;
    };

    const handleTreeSelectChange = (_, label)=>{
        setSelectList(label.map((item: any)=>{
            const data = item?.props?.["data-item"] || {};
            return {
                shareType: data?.shareType,
                shareWith: data?.shareWith,
                name: data?.name,
            }
        }))
    }

    return (
        <TreeSelect
            disabled={disabled}
            multiple={true}
            showArrow={true}
            showSearch={false}
            style={{ width: '100%', }}
            loadData={onLoadData}
            treeData={isArray(treeData)? treeData : []}
            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
            placeholder="请选择共享人"
            onChange={handleTreeSelectChange}
        />
    );
};

export default NextCloudShareUserList;

