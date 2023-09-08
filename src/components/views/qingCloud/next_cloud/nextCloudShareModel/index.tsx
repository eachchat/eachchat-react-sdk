/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { Button, Modal, notification, ConfigProvider, theme, Popover } from 'antd';

import { createShareLink, getForceNextCloudUserName, getNextCloudFilesList, getNextCloudUserName, getShareInfo, uploadNextCloudFile } from '../request';
import NextCloudFilesTable from './NextCloudFilesTable';
import NextCloudNavBar from './NextCloudNavBar';
import { MatrixClientPeg } from '../../../../../MatrixClientPeg';
import { doMaybeLocalRoomAction } from '../../../../../utils/local-room';
import NextCloudSearchSelect from './NextCloudSearchSelect';
import { generateRandomPassword, getExpireDate } from '../utils';
import NextCloudShareButtonGroups from './NextCloudShareButtonGroups';
import { ConfitProviderToken, Theme } from '../../constant';
import { useElementTheme } from '../../hooks';


const NextCloudShareModel= (props: any) => {
    const { title= "网盘", open, showSave, showShare, fileObj, hasRowSelection, onOk, onCancel, showFooter=true }=props;
    const [userName, setUserName]=useState();
    const [appPassword, setAppPassword]=useState();

    const [currentPath, setCurrentPath]=useState('');
    const [fileList, setFileList]=useState([]);
    const [loading, setLoading]=useState(false);
    const [refresh, setRefresh]=useState(new Date().getTime());
    const [selectFileName, setSelectFileName]=useState('');
    const [shareLoading, setShareLoading]=useState(false);
    const [isSelectFolder, setIsSelectFolder]=useState(false);

    const elementTheme = useElementTheme();

    useEffect(() => open && getUserName(), [open]);

    useEffect(() => open && appPassword && getFilesList(userName, currentPath, appPassword), [open, userName, currentPath, refresh, appPassword]);

    useEffect(() => !open && setCurrentPath(''), [open]);

    useEffect(() => {
        userName && setLoading(true);
        userName && localStorage.setItem('mx_next_cloud_username', userName);
    }, [userName]);

    const getUserName = () => {
        getNextCloudUserName()
        .then((res: any) => {
            setUserName(res?.username);
            setAppPassword(res?.appPassword);
        }).catch(err => {
            console.log('getUserName error', err);
        });
    };

    const getFilesList = (username, currentPath, appPassword) => {
        if (!userName) return;
        setLoading(true);
        getNextCloudFilesList(username, currentPath, appPassword)
            .then((res: any) => {
                if(res?.response?.status === 401){
                    getForceNextCloudUserName()
                    .then((res: any) => {
                        setUserName(res?.username);
                        setAppPassword(res?.appPassword);
                    }).catch(err => {
                        console.log('getUserName error', err);
                    });;
                }else{
                    setFileList(res);
                }
            }).catch(err => {
                console.log('getFilesList error', err);
            }).finally(() => {
                setLoading(false);
            });
    };

    const handleFileNameClick = (data: any) => {
        const { isFolder, currentPath } = data;
        isFolder && setCurrentPath(currentPath);
    };

    // 当前文件路径change
    const handleChangePath = (path) => setCurrentPath(path);

    // 刷新
    const handleRefresh = () => setRefresh(new Date().getTime());

    // 文件选择
    const handleSelectChange = (data) => {
        const {name, isFolder} = data || {};
        setSelectFileName(name);
        setIsSelectFolder(isFolder);
    };

    // 保存
    const handleSaveOk = () => {
        const { fileName, file } = fileObj;
        uploadNextCloudFile(fileName, currentPath, file);
        onOk && onOk();
    };

    const showNotification = (type, message) => notification[type]({
        message,
        description: <div style={{ marginTop: "-8px" }} />,
        onClick: () => {
            console.log('Notification Clicked!');
        },
    });

    // 聊天框发送共享通知
    const sendShareNotice = ({
        isShareLink,
        fileName,
        shareLink,
        isFolder,
        password,
        expireDate,
        userList,
    }: any) => {
        const shareLinkData = {
            type: 'm.room.message',
            content: {
                "body": "",
                "msgtype": "m.next.cloud.share.link",
                isShareLink,
                fileName,
                shareLink,
                isFolder,
                password,
                expireDate,
                userList,
            },
        };
        doMaybeLocalRoomAction(
            props.room.roomId,
            (actualRoomId: string) => MatrixClientPeg.get().sendEvent(
                actualRoomId,
                null,
                shareLinkData.type,
                shareLinkData.content,
            ),
            MatrixClientPeg.get(),
        ).then(
            (res) => { console.log(res); },
        ).catch(e => {
            console.error(e);
        });
    };
     
    // 创建共享链接
    const handleCreateShareLink = () => {
        setShareLoading(true);
        setSelectFileName('');
        onOk && onOk();
        const password = generateRandomPassword();
        const expireDate = getExpireDate();
        createShareLink({currentPath, fileName: selectFileName, password, expireDate, shareType:3} as any)
            .then(res => {
                const {shareLink} = res;
                sendShareNotice({
                    isShareLink: true,
                    fileName:selectFileName,
                    isFolder:isSelectFolder,
                    shareLink,
                    password,
                    expireDate,
                });
            })
            .catch(err => {
                showNotification("error", err?.response?.data?.ocs?.meta?.message || err.message);
            })
            .finally(()=>setShareLoading(false));
    };

    // 添加共享人
    const handleCreateShareUser = (data)=>{
        setShareLoading(true);
        setSelectFileName('');
        onOk && onOk();
        const successAddShareUser = [];
        const failAddShareUser = [];
        Promise.all(data.map((item:any)=>{
            return createShareLink({currentPath, fileName: selectFileName, permissions:1, ...item} as any)
            .then(res=>{
                if(item?.shareWith){
                    const {file_target} = res?.data?.ocs?.data;
                    // getShareInfo(file_target).then(res=>{
                    //     console.log(res)
                    // }).catch(err=>{
                    //     console.log(err)
                    // })
                }else{
                    successAddShareUser.push({...item,res})
                }
            })
            .catch(err=>failAddShareUser.push({...item,err}))
        })).then(res=>{
            console.log('handleCreateShareUser', res)
        }).catch(err=>{
            console.log('handleCreateShareUser', err)
        }).finally(()=>{
            setShareLoading(false);
            if(successAddShareUser.length){
                sendShareNotice({
                    isShareLink: false,
                    isFolder:isSelectFolder,
                    fileName: selectFileName,
                    userList: [...successAddShareUser],
                })
            }

           if(failAddShareUser.length){
                const errMsg = failAddShareUser?.[0]?.err?.response?.data?.ocs?.meta?.message;
                console.log('failAddShareUser',failAddShareUser[0]);
                failAddShareUser.length === data?.length ? 
                showNotification("error", errMsg ? `共享人添加失败, ${errMsg}` : '共享人添加失败') : 
                showNotification("error", `以下共享人添加失败:${failAddShareUser.map(item=>item.name)?.join(",")}`);
            }
        })
    }

    const handleCancel = () => {
        setSelectFileName('');
        onCancel && onCancel();
    };
   
    const getFooter = () => {
        return <div>
            <Button onClick={handleCancel} style={{marginRight:"20px"}}>取消</Button>
            { showSave && <Button type="primary" onClick={handleSaveOk} value={"保存至此"}>保存至此</Button> }
            {
                showShare &&  
                <NextCloudShareButtonGroups 
                    loading={shareLoading}
                    disabled={!selectFileName.length}
                    onShareLink = {handleCreateShareLink}
                    onAddShareUser = {handleCreateShareUser}
                />
            }
        </div>;
    };

    return <ConfigProvider
                theme={{
                    algorithm: elementTheme === Theme.Lignt ?  theme.defaultAlgorithm : theme.darkAlgorithm,
                    token: ConfitProviderToken
                }}
            >
                <Modal
                    className='mx_MessageComposer_nextCloud_share_model'
                    destroyOnClose
                    title={title}
                    open={open}
                    width={720}
                    onCancel={handleCancel}
                    maskClosable={false}
                    footer={showFooter ?  getFooter() : null}
                >
                    <div className='nextCloudContentView'>
                        <NextCloudNavBar currentPath={currentPath} onClick={handleChangePath} />
                        { showShare && <NextCloudSearchSelect onSearchSelect={setCurrentPath} /> }
                        <NextCloudFilesTable
                            data={fileList}
                            loading={loading}
                            userName={userName}
                            currentPath={currentPath}
                            hasRowSelection={hasRowSelection}
                            onRefresh={handleRefresh}
                            onFileNameClick={handleFileNameClick}
                            onChange={handleSelectChange}
                        />
                    </div>
                </Modal>
            </ConfigProvider>
};

export default NextCloudShareModel;

