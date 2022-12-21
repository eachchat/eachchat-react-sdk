/* eslint-disable max-len */
import React from 'react';
import { MessageOutlined } from '@ant-design/icons';

import BaseAvatar from '../avatars/BaseAvatar';
import AuthHeaderLogo from '../auth/AuthHeaderLogo';
import { MatrixClientPeg } from '../../../MatrixClientPeg';
import { DirectoryMember, startDmOnFirstMessage } from '../../../utils/direct-messages';

interface IProps {
    data?: any;
}

const avatarSize = 160;
const YiQiaContactView = (props: IProps) => {
    const { data }=props;

    const handleSendMsg = async () => {
        const cli = MatrixClientPeg.get();
        const newMember = new DirectoryMember({ user_id: data.matrixID, display_name: null, avatar_url: null });
        startDmOnFirstMessage(cli, [newMember] as any);
    };

    return (
        <div className='YiQiaContactView'>
            {
                !!data ?
                    <div className='yiqia-contact-item-info'>
                        <div className="header">
                            <div className='yiqia_UserInfo_avatar'>
                                <BaseAvatar
                                    idName={data.matrixID}
                                    name={data?.first_name + data?.last_name}
                                    url=""
                                    width={avatarSize}
                                    height={avatarSize}
                                    resizeMethod="crop"
                                    className="mx_UserMenu_userAvatar_BaseAvatar"
                                />
                            </div>
                            <div className='yiqia_UserInfo_container'>
                                <div className="yiqia_UserInfo_profile">
                                    <div className="yiqia_UserInfo_displayname" title="weitao" aria-label="weitao">{ data.first_name+data.last_name }</div>
                                    <div className="yiqia_UserInfo_matrixId" title="@weitao:yunify.com" aria-label="weitao">{ data.email }</div>
                                </div>
                            </div>
                        </div>
                        <div className="yiqia_UserInfo_operate_container">
                            <div className="send-msg" onClick={handleSendMsg}>
                                <span className='send-msg-wrap'>
                                    <MessageOutlined />
                                    <span>发消息</span>
                                </span>
                            </div>
                        </div>
                        <div className="yiqia_User_Details">
                            <div className="yiqia_user_details_item">
                                <div className="yiqia_user_details_item_label">名称</div>
                                <div className="yiqia_user_details_item_info">{ data.username }</div>
                            </div>
                            <div className="yiqia_user_details_item">
                                <div className="yiqia_user_details_item_label">姓名</div>
                                <div className="yiqia_user_details_item_info">{ data.first_name+data.last_name }</div>
                            </div>
                            <div className="yiqia_user_details_item">
                                <div className="yiqia_user_details_item_label">电子邮箱</div>
                                <div className="yiqia_user_details_item_info">{ data.email }</div>
                            </div>
                            <div className="yiqia_user_details_item">
                                <div className="yiqia_user_details_item_label">用户ID</div>
                                <div className="yiqia_user_details_item_info">{ data.matrixID }</div>
                            </div>
                        </div>

                    </div> :
                    <div className='logo'>
                        <AuthHeaderLogo />
                    </div>
            }

        </div>

    );
};

export default YiQiaContactView;
