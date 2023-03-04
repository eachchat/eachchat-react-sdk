/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { Button, Modal, notification, ConfigProvider, theme } from 'antd';

import { createShareLink, getNextCloudFilesList, getNextCloudUserName, getShareLink, uploadNextCloudFile, uploadNextCloudRootFile } from '../request';
import NextCloudFilesTable from './NextCloudFilesTable';
import NextCloudNavBar from './NextCloudNavBar';
import { MatrixClientPeg } from '../../../../../MatrixClientPeg';
import { doMaybeLocalRoomAction } from '../../../../../utils/local-room';
import NextCloudSearchSelect from './NextCloudSearchSelect';
import ThemeWatcher from '../../../../../settings/watchers/ThemeWatcher';


const NextCloudShareModel= (props: any) => {

    let elementTheme = new ThemeWatcher().getEffectiveTheme();

    const { title= "网盘", open, showSave, showShare, fileObj, hasRowSelection, onOk, onCancel }=props;
    const [userName, setUserName]=useState();
    const [currentPath, setCurrentPath]=useState('');
    const [fileList, setFileList]=useState([]);
    const [loading, setLoading]=useState(false);
    const [refresh, setRefresh]=useState(new Date().getTime());
    const [selectFileName, setSelectFileName]=useState('');

    useEffect(() => getUserName(), []);

    useEffect(() => open && getFilesList(userName, currentPath), [open, userName, currentPath, refresh]);

    useEffect(() => !open && setCurrentPath(''), [open]);

    useEffect(() => {
        userName && setLoading(true);
        userName && localStorage.setItem('mx_next_cloud_username', userName);
    }, [userName]);

    const getUserName = () => {
        getNextCloudUserName()
            .then((res: any) => {
                setUserName(res?.username);
            }).catch(err => {
                console.log('getUserName error', err);
            });
    };

    const getFilesList = (username, currentPath) => {
        if (!userName) return;
        setLoading(true);
        getNextCloudFilesList(username, currentPath)
            .then((res: any) => {
                setFileList(res);
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

    const handleChangePath = (path) => setCurrentPath(path);

    const handleRefresh = () => setRefresh(new Date().getTime());

    const handleSelectChange = (data) => setSelectFileName(data?.[0]);

    const handleSaveOk = () => {
        const { fileName, file } = fileObj;
        uploadNextCloudFile(fileName, currentPath, file);
        onOk && onOk();
    };

    const handleShareOk = () => {
        handleGetShareLink();
        setSelectFileName('');
        onOk && onOk();
    };

    const showNotification = (type, message) => notification[type]({
        message,
        description: <div style={{ marginTop: "-8px" }} />,
        onClick: () => {
            console.log('Notification Clicked!');
        },
    });

    const copyShareLink = (data) => {
        const shareLinkData = {
            type: 'm.room.message',
            content: {
                "body": "",
                "msgtype": "m.next.cloud.share.link",
                "fileName": selectFileName,
                "shareLink": data.shareLink,
                "isFolder": data.isFolder,
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
    const handleGetShareLink = () => {
        getShareLink(currentPath, selectFileName)
            .then(res => {
                copyShareLink(res);
            })
            .catch(err => {
                handleCreateShareLink();
            });
    };
    const handleCreateShareLink = () => {
        createShareLink(currentPath, selectFileName)
            .then(res => {
                copyShareLink(res);
            })
            .catch(err => {
                showNotification("error", err.message);
            });
    };

    const handleCancel = () => {
        setSelectFileName('');
        onCancel && onCancel();
    };

    const getFooter = () => {
        return <div>
            <Button onClick={handleCancel}>
            取消
            </Button>
            {
                showSave &&
                <Button type="primary" onClick={handleSaveOk}>
                保存至此
                </Button>
            }
            {
                showShare &&
                <Button
                    type="primary"
                    disabled={!selectFileName.length}
                    onClick={handleShareOk}>
                分享
                </Button>
            }
        </div>;
    };
    return <ConfigProvider
    theme={{
        algorithm: elementTheme === "light" ? theme.defaultAlgorithm :theme.darkAlgorithm,
        token: {
            colorPrimary: '#0dbd8b',
        },
      }}
  >
        <Modal
            className='mx_MessageComposer_nextCloud_share_model'
            destroyOnClose
            title={title}
            open={open}
            onCancel={handleCancel}
            maskClosable={false}
            footer={getFooter()}
        >
            <div className='nextCloudContentView'>
                <NextCloudNavBar currentPath={currentPath} onClick={handleChangePath} />
                {
                    showShare && <NextCloudSearchSelect onSearchSelect={setCurrentPath} />
                }
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

