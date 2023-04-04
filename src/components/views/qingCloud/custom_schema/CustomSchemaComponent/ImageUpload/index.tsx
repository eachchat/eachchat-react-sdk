/* eslint-disable react-hooks/exhaustive-deps */
import { PlusOutlined } from '@ant-design/icons';
import { message, Modal, Upload } from 'antd';
import React, { Props, useContext, useEffect, useState } from 'react';

// import Md5Worker from 'web-worker:../qxp/md5-worker';
import type { RcFile, UploadProps } from 'antd/es/upload';
import type { UploadFile } from 'antd/es/upload/interface';

export const TableContext = React.createContext<Props>(
    { appID: 'noAppID', tableID: 'noTableID', name: 'noName' },
);

export const DEFAULT_IMG_TYPES: string[] = [
    'image/gif',
    'image/tiff',
    'image/png',
    'image/bmp',
    'image/jpeg',
];

export const isMacosX = /macintosh|mac os x/i.test(navigator.userAgent);

export const CHUNK_SIZE = 1024 * 1024 * 5;

export const MAX_SMALL_FILE_SIZE = 1024 * 1024 * 20; // 20 MB

const getBase64 = (file: RcFile): Promise<string> =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = error => reject(error);
    });

const ImageUpload = (props: any) => {
    console.log('ImageUpload', props);
    const { appID, tableID } = useContext(TableContext);
    const { value, form, path } = props;
    const { readOnly } = props.props;
    const configProps = props?.props['x-component-props'];

    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');
    const [fileList, setFileList] = useState<UploadFile[]>([
        // {
        //     uid: '-1',
        //     name: 'image.png',
        //     status: 'done',
        //     url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
        // },
        // {
        //     uid: '-2',
        //     name: 'image.png',
        //     status: 'done',
        //     url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
        // },
        // {
        //     uid: '-3',
        //     name: 'image.png',
        //     status: 'done',
        //     url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
        // },
        // {
        //     uid: '-4',
        //     name: 'image.png',
        //     status: 'done',
        //     url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
        // },
        // {
        //     uid: '-xxx',
        //     percent: 50,
        //     name: 'image.png',
        //     status: 'uploading',
        //     url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
        // },
        // {
        //     uid: '-5',
        //     name: 'image.png',
        //     status: 'error',
        // },
    ]);
    const [showUploadButton, setShowUploadButton] = useState(true);

    const [currFileSize, setCurrentFileSize]=useState(0);

    const { maxFileSize, multiple } = configProps;

    useEffect(() => {
        setUploadBtn();
    }, [fileList]);

    const setUploadBtn = () => {
        if (multiple) {
            setShowUploadButton(true);
        }
        if (!multiple && fileList?.length>0) {
            setShowUploadButton(false);
        }
    };

    // const calcFileMD5 = (file) => {
    //     return new Promise((resolve, reject) => {
    //         const { blob } = file;
    //         const worker = new Md5Worker();
    //         file.md5Worker = worker;
    //         worker.postMessage({ blob, chunkSize: CHUNK_SIZE, maxSmallFileSize: MAX_SMALL_FILE_SIZE });
    //         worker.onmessage = (e: MessageEvent<{ percentage: number, md5: string, fileChunks: Blob[] }>) => {
    //             const { percentage, md5, fileChunks } = e.data;
    //             if (fileChunks) {
    //                 file.fileChunks = fileChunks.map((chunk: Blob, index: number) => {
    //                     return {
    //                         partNumber: index + 1,
    //                         chunkBlob: chunk,
    //                     };
    //                 });
    //             }
    //             if (percentage) {
    //                 file.progress = percentage;
    //             }
    //             if (md5) {
    //                 file.md5 = md5;
    //                 resolve(file);
    //                 worker.terminate();
    //             }
    //             file.state = 'processing';
    //             // this.updateUploadFile(file.name, file);
    //             return;
    //         };
    //         worker.onerror = (error: ErrorEvent) => {
    //             reject(error);
    //         };
    //     });
    // };
    const handleCancel = () => setPreviewOpen(false);

    const handlePreview = async (file: UploadFile) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj as RcFile);
        }

        setPreviewImage(file.url || (file.preview as string));
        setPreviewOpen(true);
        setPreviewTitle(file.name || file.url!.substring(file.url!.lastIndexOf('/') + 1));
    };

    const handleChange = ({ file, fileList, event }) => {
        const { status }=file;
        status && setFileList(fileList);
        // calcFileMD5(file);
    };

    const beforeUpload = (file: RcFile) => {
        const byteSize = isMacosX ? 1000 : 1024;
        const maxSize = (byteSize ** 2) * (maxFileSize || 0);
        const uploadedTotalSize = currFileSize+file?.size;

        if (fileList.find((fileItem) => fileItem.name === file.name)) {
            message.error(`已存在名为'${file.name}' 的图片。`);
            return false;
        }

        if (multiple) {
            if (maxSize && uploadedTotalSize > maxSize) {
                message.error(`图片总大小不能超过${maxFileSize}MB`);
                return false;
            } else {
                setCurrentFileSize(uploadedTotalSize);
                return true;
            }
        } else {
            if (maxSize && file?.size > maxSize) {
                message.error(`单个图片大小不能超过${maxFileSize}MB`);
                return false;
            }
        }
        return true;
    };

    const uploadButton = (
        <div>
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>{ configProps?.uploaderDescription || '上传图片' }</div>
        </div>
    );

    return (
        <>
            <Upload
                accept={DEFAULT_IMG_TYPES.toString()}
                disabled={!configProps.multiple && value?.length >= 1}
                multiple={configProps.multiple}
                action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                listType="picture-card"
                fileList={fileList}
                beforeUpload={beforeUpload}
                onPreview={handlePreview}
                onChange={handleChange}
            >
                { showUploadButton ? uploadButton : null }
            </Upload>
            <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={handleCancel}>
                <img alt="example" style={{ width: '100%' }} src={previewImage} />
            </Modal>
        </>
    );
};

ImageUpload.isFieldComponent = true;

export default ImageUpload;
