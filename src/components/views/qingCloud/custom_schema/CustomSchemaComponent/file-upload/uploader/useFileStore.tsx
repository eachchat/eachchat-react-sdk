/* eslint-disable @typescript-eslint/no-unused-vars */
import { uniqueId } from 'lodash';
import { message } from 'antd';
import { useState } from 'react';

// import Md5Worker from '../../qxp/md5-worker';
import smallFileUploadRequest from './small-file-upload-stream';
import bigFileMultipartUpload, { FileUploadStreamProps } from './large-file-part-upload-stream';
import {
    CHUNK_SIZE,
    MAX_SMALL_FILE_SIZE,
    SMALL_FILE_SIGN_API,
    BIG_FILE_SIGN_API,
    FILE_DELETE_API,
    ABORT_MULTIPART_API,
    DEFAULT_IMG_TYPES,
    THUMBNAIL_SIZE,
    IMG_THUMBNAIL_API,
} from '../constants';
import { FileStoreProps, QXPUploadFileBaseProps, QXPUploadFileTask } from '../../qxp/interface';
import httpClient from '../../qxp/http';
import { isAcceptedFileType } from '../../qxp/utils';

const useFileStore = (props: FileStoreProps) => {
    const [files, setFiles]= useState(props.files);
    const [fileBucket, setFileBucket]=useState(props.fileBucket);
    const [additionalPathPrefix, setAdditionalPathPrefix]=useState(props.additionalPathPrefix);
    const [requestThumbnail, setRequestThumbnail]=useState(props.requestThumbnail);
    const [fileRequests, setFileRequests]=useState({});
    const { onSuccess, onError } = props;

    const setUploadedFiles = (files: QXPUploadFileBaseProps[]): void => {
        setFiles(files);
    };

    const addUploadFile = (fileItem: QXPUploadFileTask): void => {
        setFiles([...files, fileItem]);
    };

    const removeUploadFile = (deleteFile: QXPUploadFileTask): void => {
        abortFile(deleteFile);
        if (deleteFile.uploadID && deleteFile.state !== 'success') {
            httpClient(ABORT_MULTIPART_API, {
                path: `${fileBucket}/${deleteFile.uid}`,
                uploadID: deleteFile.uploadID,
            });
        }
        httpClient(FILE_DELETE_API, {
            path: `${fileBucket}/${deleteFile.uid}`,
        });
        setFiles(files.filter((file) => file.name !== deleteFile.name));
    };

    const getUploadFile = (fileName: string): QXPUploadFileTask | undefined => {
        return files.find((file) => file.name === fileName);
    };

    const updateUploadFile = (fileName: string, data: Partial<QXPUploadFileTask>): QXPUploadFileTask => {
        const fileIndex = files.findIndex((file) => file.name === fileName);
        files[fileIndex] = { ...files[fileIndex], ...data };
        return files[fileIndex];
    };

    const clearUploadFiles = (): void => {
        setFiles([]);
    };

    const prepareFilesUpload = (files: File[]): void => {
        const extendedFiles: QXPUploadFileTask[] = files.map((file: File) => ({
            name: file.name,
            uid: uniqueId('qxp-file/'), // Use uuid as a temp uid for key props in file list render, and it will be replaced after file signed
            size: file.size,
            type: file.type || 'application/octet-stream',
            blob: file,
        }));

        extendedFiles.forEach((file) => {
            addUploadFile(file);
            // calcFileMD5(file).then(startUploadFile);
        });
    };

    const startUploadFile = (fileWithMd5: QXPUploadFileTask): void => {
        signFile(fileWithMd5).then((signedFile) => {
            putFileStream(signedFile);
        }).catch((err) => {
            onFileUploadError(err, fileWithMd5);
        });
    };

    const calcFileMD5 = (
        file: QXPUploadFileTask,
    ): Promise<QXPUploadFileTask> => {
        return new Promise((resolve, reject) => {
            const { blob } = file;
            const worker = new Md5Worker();
            file.md5Worker = worker;
            worker.postMessage({ blob, chunkSize: CHUNK_SIZE, maxSmallFileSize: MAX_SMALL_FILE_SIZE });
            worker.onmessage = (e: MessageEvent<{ percentage: number, md5: string, fileChunks: Blob[] }>) => {
                const { percentage, md5, fileChunks } = e.data;
                if (fileChunks) {
                    file.fileChunks = fileChunks.map((chunk: Blob, index: number) => {
                        return {
                            partNumber: index + 1,
                            chunkBlob: chunk,
                        };
                    });
                }
                if (percentage) {
                    file.progress = percentage;
                }
                if (md5) {
                    file.md5 = md5;
                    resolve(file);
                    worker.terminate();
                }
                file.state = 'processing';
                updateUploadFile(file.name, file);
                return;
            };
            worker.onerror = (error: ErrorEvent) => {
                reject(error);
            };
        });
    };

    const signFile = (file: QXPUploadFileTask): Promise<QXPUploadFileTask> => {
        const { md5 } = file;
        if (!md5) throw Error('no file md5 provided.');
        const fileSignPath = [];
        const fileUid = [md5, file.name];
        const signUrl = file.size >= MAX_SMALL_FILE_SIZE ? BIG_FILE_SIGN_API : SMALL_FILE_SIGN_API;

        updateUploadFile(file.name, file);

        fileSignPath.push(fileBucket);

        additionalPathPrefix && fileUid.unshift(additionalPathPrefix);

        fileSignPath.push(...fileUid);

        return httpClient(signUrl, {
            contentType: file.type,
            path: fileSignPath.join('/'),
        }).then((response) => {
            const { url, uploadID } = response as { url?: string, uploadID?: string };
            const signedFile = updateUploadFile(file.name, {
                uid: fileUid.join('/'),
                uploadID,
                uploadUrl: url,
            });
            return signedFile;
        });
    };

    const putFileStream = (file: QXPUploadFileTask): void => {
        const fileUploadStreamRequest = file.size > MAX_SMALL_FILE_SIZE ?
            bigFileMultipartUpload : smallFileUploadRequest;
        const putFileData: FileUploadStreamProps = {
            file,
            fileBucket: fileBucket,
            onSuccess: onFileUploadSuccess,
            onProgress: onFileUploading,
            onError: onFileUploadError,
        };
        fileRequests[file.uid] = fileUploadStreamRequest(putFileData);
    };

    const retryUploadFile = (file: QXPUploadFileTask): void => {
        const { name } = file;
        const retryFile = getUploadFile(name);
        if (!retryFile) {
            return;
        }
        putFileStream(retryFile);
    };

    const abortFile = (abortFile?: QXPUploadFileTask): void => {
        if (!abortFile) return;
        abortFile?.md5Worker?.terminate();
        fileRequests[abortFile.uid]?.();
    };

    const abortAllFiles = (): void => {
        files.forEach((file: QXPUploadFileTask) => {
            if (file.state === 'uploading' || file.state === 'processing') {
                file.md5Worker?.terminate();
                fileRequests[file.uid]?.();
            }
        });
    };

    const onFileUploadError = (err: Error, file: QXPUploadFileTask): void => {
        file.state = 'failed';
        message.error(err.message);
        updateUploadFile(file.name, file);
        onError?.(err, file);
    };

    const onFileUploadSuccess = (file: QXPUploadFileTask): void => {
        const { uid, name } = file;
        Promise.resolve().then(() => {
            if (isAcceptedFileType(file, DEFAULT_IMG_TYPES) && requestThumbnail) {
                return httpClient(IMG_THUMBNAIL_API, {
                    path: `${fileBucket}/${file.uid}`,
                    width: THUMBNAIL_SIZE / 2,
                });
            }
        }).catch(() => {
            message.error('图片缩略图生成失败');
        }).finally(() => {
            () => {
                file.state = 'success';
                file.md5Worker = null;
                file.fileChunks = null;
                fileRequests[uid] = null;
                updateUploadFile(name, file);
                onSuccess?.(file);
            };
        });
    };

    const onFileUploading = (file: QXPUploadFileTask, progress: number): void => {
        file.state = 'uploading';
        file.progress = progress;
        updateUploadFile(file.name, file);
    };

    return {
        files,
        prepareFilesUpload,
        retryUploadFile,
        abortAllFiles,
        clearUploadFiles,
        removeUploadFile,
        setUploadedFiles,
    };
};

export default useFileStore;
