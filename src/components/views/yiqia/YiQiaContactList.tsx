/* eslint-disable camelcase */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect, useState } from 'react';
import { Button, List, Skeleton, Input } from 'antd';
import { ClientEvent, MatrixClient } from 'matrix-js-sdk/src/client';

import createRoom from '../../../createRoom';
import BaseAvatar from '../avatars/BaseAvatar';
import { findDMForUser } from '../../../utils/dm/findDMForUser';
import { Action } from "../../../dispatcher/actions";
import { privateShouldBeEncrypted } from '../../../utils/rooms';
import MatrixClientContext from "../../../contexts/MatrixClientContext";
import { MatrixClientPeg } from '../../../MatrixClientPeg';
import dis from '../../../dispatcher/dispatcher';
import Spinner from '../elements/Spinner';
import { _t } from '../../../languageHandler';
import { IConfigOptions } from '../../../IConfigOptions';
import SdkConfig from '../../../SdkConfig';
import { SnakedObject } from '../../../utils/SnakedObject';
import RoomListStore from '../../../stores/room-list/RoomListStore';
import { RoomUpdateCause } from '../../../stores/room-list/models';
import Resend from '../../../Resend';

const { Search } = Input;

const avatarSize = 32;
const size = 20;

const removeDuplicateObj = (arr) => {
    const obj = {};
    arr = arr.reduce((newArr, next) => {
        obj[next.matrixID] ? "" : (obj[next.matrixID] = true && newArr.push(next));
        return newArr;
    }, []);
    return arr;
};

const YiQiaContactList = (props) => {
    const [loading, setLoading] = useState(false);
    const [userList, setUserList] = useState<any>(window.YiQiaUserList || []);
    const [searchList, setSearchList] = useState<DataType[]>([]);
    const [searchFlag, setSearchFlag] = useState<boolean>(false);

    const [roomId, setRoomId]=useState(localStorage.getItem('mx_contact_robot_id'));
    const cli = useContext(MatrixClientContext);
    const [page, setPage]=useState(1);
    const [stop, setStop]=useState(false);
    const config = new SnakedObject<IConfigOptions>(SdkConfig.get());
    const contact_robot_name = config.get("setting_defaults")?.['contact_robot_name'];
    const exitRoom = findDMForUser(cli, contact_robot_name);
    let _page = 1;

    useEffect(() => {
        console.log('YiQiaContactList====');
        MatrixClientPeg.get().on(ClientEvent.Event, (ev) => {
            if (ev?.event?.type==='org.matrix.qingcloud.quanxiang.regular.reply') {
                console.log('YiQiaContactList==== reply');
                getData(ev);
            }
        });
        exitRoom && setRoomId(exitRoom.roomId);

        try {
            Resend.cancelUnsentEvents(exitRoom);
            dis.fire(Action.FocusSendMessageComposer);
        } catch (error) {
            console.log(error);
        }
    }, []);

    useEffect(() => {
        console.log('YiQiaContactList====', page, roomId);
        if (!stop) {
            roomId && getContactList();
        } else {
            const list = removeDuplicateObj(window.YiQiaUserList);
            window.YiQiaUserUniqueList = list;

            setUserList(list);
            setLoading(false);
            sessionStorage.setItem('initUserListFlag', true);
        }
    }, [page, roomId]);

    // 发送消息 获取通讯录用户列表
    const getContactList = (): void => {
        const cli = MatrixClientPeg.get();
        cli.sendEvent(roomId, null, 'org.matrix.qingcloud.quanxiang.regular', {
            kind: 'USERS',
            data: {
                page,
                size,
            },
        });
    };

    const getData = (ev) => {
        if (window.YiQiaUserUniqueList) return;
        window.YiQiaUserList = window.YiQiaUserList || [];
        try {
            _page = _page+1;
            setPage(_page);
            const { event: { content: data } } = ev;
            const type = "org.matrix.qingcloud.quanxiang.regular.reply";
            const total = data[type].data?.total;
            const users = data[type].data?.users;
            if (users) {
                window.YiQiaUserList = [...window.YiQiaUserList, ...users];
                setUserList(removeDuplicateObj(window.YiQiaUserList));
                setLoading(false);
            }
            setStop(!total);
            console.log('YiQiaContactList==== total', data);
        } catch (error) {
            console.log('YiQiaContactList==== error', error);
            // setStop(true);
        }
    };

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
                const fullName = item?.first_name+item?.last_name;
                return fullName?.includes(value);
            } catch (error) {
            }
        });
        setSearchList(removeDuplicateObj(searchList));
        setSearchFlag(true);
    };

    return (
        <>
            <div
                id="yiQiaContactList"
                className='yiQiaContactList'
            >
                <Search className='yiqia-user-search ' placeholder="Search" onChange={handleChange} onSearch={handleSearch} />
                {
                    loading ?
                        <Spinner />:
                        <List
                            className="demo-loadmore-list"
                            loading={false}
                            itemLayout="horizontal"
                            dataSource={searchFlag ? searchList: userList}
                            renderItem={(item) => (
                                <List.Item
                                    onClick={() => handleClick(item)}
                                >
                                    <Skeleton avatar title={false} loading={item.loading} active>
                                        <List.Item.Meta
                                            title={item?.first_name + item?.last_name}
                                            avatar={<BaseAvatar
                                                idName={item.matrixID}
                                                name={item?.first_name + item?.last_name}
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
