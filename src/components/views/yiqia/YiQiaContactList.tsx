/* eslint-disable camelcase */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from 'react';
import { List, Skeleton, Input } from 'antd';

import BaseAvatar from '../avatars/BaseAvatar';
import { Action } from "../../../dispatcher/actions";
import dis from '../../../dispatcher/dispatcher';
import Spinner from '../elements/Spinner';

const { Search } = Input;

const avatarSize = 32;

const removeDuplicateObj = (arr) => {
    const obj = {};
    arr = arr.reduce((newArr, next) => {
        obj[next.matrixID] ? "" : (obj[next.matrixID] = true && newArr.push(next));
        return newArr;
    }, []);
    return arr;
};

const YiQiaContactList = (props) => {
    const { userList, loading, error, onReload } = props;
    const [searchList, setSearchList] = useState<any[]>([]);
    const [searchFlag, setSearchFlag] = useState<boolean>(false);

    const handleClick = (data: any) => {
        dis.dispatch({
            action: Action.ActiveContactData,
            context: data,
        });
    };

    const handleChange = (e) => {
        handleSearch(e.target.value);
    };

    const handleSearch = (value, event?) => {
        if (!value) {
            setSearchList([]);
            setSearchFlag(false);
            return;
        }
        const searchList = userList.filter(item => {
            try {
                const fullName = item?.name;
                return fullName?.includes(value);
            } catch (error) {
            }
        });
        setSearchList(removeDuplicateObj(searchList));
        setSearchFlag(true);
    };

    const loadMore =
    error ?
        <div className='yiqia-contact-reload' onClick={onReload}>加载失败，重新加载</div>
        : null;

    return (
        <>
            <div
                id="yiQiaContactList"
                className='yiQiaContactList'
            >
                <Search className='yiqia-user-search ' placeholder="搜索" onChange={handleChange} onSearch={handleSearch} />
                {
                    loading ?
                        <Spinner />:
                        <List
                            className="demo-loadmore-list"
                            loading={false}
                            itemLayout="horizontal"
                            dataSource={searchFlag ? searchList: userList}
                            loadMore={loadMore}
                            renderItem={(item: any) => (
                                <List.Item
                                    onClick={() => handleClick(item)}
                                >
                                    <Skeleton avatar title={false} loading={item.loading} active>
                                        <List.Item.Meta
                                            title={item?.name}
                                            avatar={<BaseAvatar
                                                idName={item?.matrixID}
                                                name={item?.name}
                                                url=""
                                                width={avatarSize}
                                                height={avatarSize}
                                                resizeMethod="crop"
                                                className="mx_UserMenu_userAvatar_BaseAvatar"
                                            />}
                                        />
                                    </Skeleton>
                                </List.Item>
                            )}
                        />

                }

            </div>
        </>

    );
};

export default YiQiaContactList;
