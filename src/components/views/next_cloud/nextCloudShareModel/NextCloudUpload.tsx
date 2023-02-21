/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { UploadOutlined } from '@ant-design/icons';
import { Button, Upload, notification, Modal } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined, LoadingOutlined } from "@ant-design/icons";
import axios from 'axios';

import type { UploadProps } from 'antd';
import { uploadBigFileStart, uploadBitFileChunk, uploadNextCloudFile } from '../request';

type UploadStatus = 'loading' | 'success' | 'error';

const CHUNK_SIZE = 5*1024*1024;

const NextCloudUpload = (props: any) => {
    const { userName, currentPath, onRefresh }=props;
    const [uploadFileList, setUploadFileList]=useState([]);
    const [isUploading, setIsUploading] = useState(false);
    const [showNotification, setShowNotification]=useState(false);
    const [duration, setDuration]=useState(null);
    const [isAllUploadResponse, setIsAllUploadResponse]=useState(false);
    const [cancelTokenList, setCancelTokenList]=useState([]);
    const key = 'upload';
    const modal = Modal.confirm;

    useEffect(() => {
        uploadFileList.length && handleUploadFileList();
    }, [uploadFileList]);

    const uploadProps: UploadProps = {
        fileList: [],
        // multiple: true,
        beforeUpload: (_, fileList) => {
            setUploadFileList([...fileList.map(file => {
                const isBigFile = file?.size>CHUNK_SIZE?true:false;
                return {
                    ...file,
                    id: file.name + new Date().getTime(),
                    file: file,
                    status: 'loading',
                    upload: handleUploadFile,
                    // isBigFile,
                    // upload: isBigFile ? handleUploadFile : handleUploadBigFile,
                };
            })]);
        },
        customRequest: (options: any) => {
            // console.log('beforeUpload ====2',options);
            // const { onSuccess, onError, file, onProgress } = options;
            // setUploadFileList([...uploadFileList, {
            //     id: file.name + new Date().getTime(),
            //     file: file,
            //     status: 'loading',
            //     isBigFile: isBigFile(file),
            //     onSuccess: onSuccess,
            //     onError: onError,
            //     onProgress: onProgress,

            // }]);
            // setShowNotification(true);
            // setDuration(null);
            // const CancelToken = axios.CancelToken;
            // const source = CancelToken.source();
            // setCancelTokenList([...cancelTokenList, source]);
            // uploadBigFileStart(userName);
            // console.log('file========', file);
            // uploadNextCloudFile(file?.name, currentPath, file, source)
            //     .then((res: any) => {
            //         file.status = 'success';
            //         setUploadFileList(uploadFileList.map((item: any) => {
            //             if (item.id===file.id) {
            //                 return {
            //                     ...item,
            //                     status: 'success',
            //                 };
            //             }
            //             return item;
            //         }));
            //         // setDuration(2);
            //         onRefresh && onRefresh();
            //     })
            //     .catch(err => {
            //         file.status = 'error';
            //         setUploadFileList(uploadFileList.map((item: any) => {
            //             if (item.id===file.id) {
            //                 return {
            //                     ...item,
            //                     status: 'error',
            //                 };
            //             }
            //             return item;
            //         }));
            //         // setDuration(2);
            //         console.log('NextCloudUpload err', err);
            //     });
        },
    };

    const handleUploadFileList = () => {
        return Promise.all([...uploadFileList.map(item => item.upload(item))])
            .then(res => {
                console.log('handleUploadFileList res', res);
            })
            .catch(err => {
                console.log('handleUploadFileList err', err);
            }).finally(() => {
                onRefresh && onRefresh();
                setUploadFileList([]);
            });
    };

    const handleUploadFile = (data) => {
        const CancelToken = axios.CancelToken;
        const source = CancelToken.source();
        const { file }=data;
        return new Promise((resolve, reject) => {
            resolve(
                uploadNextCloudFile(file?.name, currentPath, file, source)
                    .then((res: any) => {
                        console.log('handleUploadFile res', res);
                    })
                    .catch(err => {
                        console.log('handleUploadFile err', err);
                    }),
            );
        });
    };

    const handleUploadBigFile = (data) => {
        const source = CancelToken.source();
        const { file }=data;
        const fileChunkList = getFileChunkList(file);
        uploadBigFileStart(userName)
            .then(res => {
                const folderName = res;
                const _fileChunkList = fileChunkList.map((item: any) => {
                    const { name, chunk } = item;
                    return {
                        ...item,
                        upload: () => {
                            return handleUploadBitFileChunk(userName, folderName, name, chunk);
                        },
                    };
                });
                Promise.all([..._fileChunkList.map(item => item.upload())]).then(res => {
                    console.log('handleUploadBitFileChunk All res', res);
                }).catch(err => {
                    console.log('handleUploadBitFileChunk All err', err);
                });
            })
            .catch(err => {
                console.log('uploadBigFileStart err');
            });
    };

    const getFileChunkList = (file, size = CHUNK_SIZE) => {
        const fileChunkList = [];
        let curChunkIndex = 0;
        while (curChunkIndex <= file.size) {
            const chunk = file.slice(curChunkIndex, curChunkIndex + size);
            fileChunkList.push({ name: curChunkIndex, chunk: chunk });
            curChunkIndex += size;
        }
        return fileChunkList;
    };

    const handleUploadBitFileChunk = (userName, folderName, name, chunk) => {
        return new Promise((resolve, reject) => {
            resolve(
                uploadBitFileChunk(userName, folderName, name, chunk)
                    .then((res: any) => {
                        console.log('uploadChunk res', res);
                    }).catch(err => {
                        console.log('uploadChunk err', err);
                    }),
            );
        });
    };

    const UploadNotificationMessage = () => {
        return <div className="uploadNotificationMessage">
            <span>文件上传</span>
        </div>;
    };

    const getUploadStatus = (status: UploadStatus) => {
        switch (status) {
            case 'success':
                return <CheckCircleOutlined />;
            case 'error':
                return <CloseCircleOutlined />;
            default:
                return <LoadingOutlined />;
        }
    };

    const UploadNotificationDescription = () => {
        return <div className="uploadNotificationDescription">
            {
                uploadFileList.map((item: any, index) => {
                    return (
                        <div key={index} className='upload-file-item'>
                            { /* <div className="file-name">{ item?.name }</div> */ }
                            { /* { getUploadStatus(item?.status) } */ }
                        </div>
                    );
                })
            }
        </div>;
    };

    const uploadNotification = () => {
        notification.open({
            key,
            className: 'NextCloudUploadNotification',
            duration: null,
            top: 10,
            maxCount: 1,
            message: <UploadNotificationMessage />,
            description: <UploadNotificationDescription />,
            onClick: () => {
                console.log('Notification Clicked!');
            },
            onClose: () => {
                console.log('Notification Closed!');
                modal({
                    title: '删除文件',
                    content: ' 确定取消未上传的文件？',
                    onOk: handleDeleteUnUploadedFiles,
                });
            },
        });
    };

    const handleDeleteUnUploadedFiles = () => {
        // cancelTokenList.forEach((item: any) => item?.cancel());
        // setShowNotification(false);
        // setCancelTokenList([]);
        // setIsDeleteModalOpen(false);
    };

    return <div className='NextCloudUpload-wrap'>
        {
            uploadFileList.length ?
                <Button type="primary" icon={<LoadingOutlined />} loading>文件上传中</Button> :
                <Upload {...uploadProps} className='NextCloudUpload'>
                    <Button type="primary" icon={<UploadOutlined />}>上传</Button>
                </Upload>
        }
    </div>;
};

export default NextCloudUpload;
