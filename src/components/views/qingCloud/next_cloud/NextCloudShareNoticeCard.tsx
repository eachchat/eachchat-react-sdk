import React from 'react';
import { Button, Card, ConfigProvider, Divider, Tag, theme } from 'antd';
import { FileOutlined, FolderOutlined, LinkOutlined, InfoOutlined, ApartmentOutlined, DownOutlined, UpOutlined, EllipsisOutlined } from '@ant-design/icons';
import { ConfitProviderToken, ShareType, Theme } from '../constant';
import BaseAvatar from '../../avatars/BaseAvatar';
import SdkConfig from '../../../../SdkConfig';
import ThemeWatcher from '../../../../settings/watchers/ThemeWatcher';
import SettingsStore from '../../../../settings/SettingsStore';

const avatarSize = 13;
export default class NextCloudShareNoticeCard extends React.Component {
    constructor(props: any) {
        super(props);
        this.state = {
           showAllUser: false,
           maxShowUsersNum: 3,
           elementTheme: new ThemeWatcher().getEffectiveTheme(),
        };
    }

    componentDidUpdate() {
        SettingsStore.watchSetting("theme", null, ()=> this.setState({elementTheme: new ThemeWatcher().getEffectiveTheme()}));
    }
    
    private onBodyLinkClick = (shareLink): void => {
        window.open(shareLink);
    };

    private handleShowAllUser = ()=>{
        this.setState({showAllUser: !this.state.showAllUser})
    }

    render() {
        const {showAllUser, maxShowUsersNum, elementTheme}=this.state as any;
        const mxEvent = this.props?.mxEvent;
        const content = mxEvent.getContent();
        const { isShareLink, userList, fileName, shareLink, isFolder, password, expireDate } = content;

        const Title = (props: any)=>{
            const {type} = props;
            switch(type){
                case "link":
                    return <div className='title-wrap'><LinkOutlined /><span>网盘共享</span> </div>
                case "info":
                    return <div className='title-wrap'><InfoOutlined /><span>网盘共享</span> </div>
                default:
                    return <div className='title-wrap'><span>网盘共享</span> </div>

            }
        }
      
        return (
            <div className="mx_MTextBody mx_EventTile_content  mx_NextCloudShareLink">
                <ConfigProvider
                theme={{
                    algorithm: elementTheme === Theme.Lignt ?  theme.defaultAlgorithm : theme.darkAlgorithm,
                    token: {
                        ...ConfitProviderToken,
                        colorText: "inherit",
                    }
                }}
            >
{
                    isShareLink ?
                        <Card title={<Title/>} size="small">
                            <div className="content pointer hover-active" onClick={() => this.onBodyLinkClick(shareLink)}>
                                {isFolder ? <FolderOutlined /> : <FileOutlined />}
                                <span className="name">  {fileName} </span>
                            </div>
                            {/* <div className='notice'>共享文件可点击查看</div> */}
                            <div className='attr-wrap'>
                                {  password && <span className="password">密码: {password} </span> }
                                { expireDate && <span className="expireDate">过期日期: {expireDate}</span> }
                            </div>
                        </Card> :
                        <Card title={<Title />}  size="small">
                             <div className="content pointer hover-active" onClick={() => this.onBodyLinkClick(SdkConfig.get("setting_defaults").next_cloud_url)}>
                                {isFolder ? <FolderOutlined /> : <FileOutlined />}
                                <span className="name">  {fileName} </span>
                            </div>
                            <div className='notice'>被共享人可前往网盘中查看</div>
                            <div className='user-list-wrap  mt10'>
                                <span>已共享给：</span>
                                {
                                    userList?.map((item:any,index)=>{
                                        if(!showAllUser && index>=maxShowUsersNum) return;
                                        const {name, shareType, shareWith} = item;
                                        switch(shareType){
                                            case ShareType.User:
                                                return (
                                                    <span className='flex align-items line-height16 mt3 ft12' key={index}>
                                                        <BaseAvatar
                                                            idName={shareWith}
                                                            name={shareWith}
                                                            url=""
                                                            width={avatarSize}
                                                            height={avatarSize}
                                                            resizeMethod="crop"
                                                            className="mx_UserMenu_userAvatar_BaseAvatar flex align-items mr5"
                                                        />
                                                        { name }
                                                    </span>
                                                )
                                            case ShareType.Dept:
                                                return (
                                                    <span className='flex align-items line-height16 mt3 ft12' key={index}>
                                                        <ApartmentOutlined className='mr5'/>
                                                        { name }
                                                    </span>
                                                )
                                            default: return;
                                        }
                                        
                                    })
                                }
                                { 
                                    (userList?.length > maxShowUsersNum)  && 
                                    <div className="flex space-between">
                                        {!showAllUser && <EllipsisOutlined />}
                                        <div className='showAllToogle w100 flex justify-content-end' onClick={this.handleShowAllUser}>
                                            {
                                                showAllUser ?
                                                <span className='ft12 pointer hover-active '>收起<UpOutlined /> </span> :
                                                <span className='ft12 pointer hover-active '>显示全部<DownOutlined /> </span>
                                            }
                                        </div>
                                    </div> 
                                }

                            </div>
                        </Card>
                }
            </ConfigProvider>
                
            </div>
        );
    }
}
