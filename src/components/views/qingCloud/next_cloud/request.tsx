/* eslint-disable max-len */
import axios from "axios";
import { parseString } from 'xml2js';
import { notification } from 'antd';
import { downFlowFiles, formatFilesXmlObj } from "./utils";


const elementBaseURL = 'element';
const nextCloudBaseURL = 'nextCloud';

export const requestElement =() => {
    const MatrixID = localStorage.getItem("mx_user_id");
    const Authorization = `Bearer ${window?.mxMatrixClientPeg?.matrixClient.getAccessToken()}`;
    return axios.create({
        baseURL: elementBaseURL,
        headers: {
            "Matrix-Id": MatrixID,
            "Authorization": Authorization,
        },
    });
};

export const requestNextCloud = () => {
    const MatrixID = localStorage.getItem("mx_user_id");
    const Authorization = `Bearer ${window?.mxMatrixClientPeg?.matrixClient.getAccessToken()}`;
    const NextCloudUserName = localStorage.getItem('mx_next_cloud_username');
    const NextCloudAuthorization ='Basic ' + btoa(`${NextCloudUserName}:${MatrixID}|${Authorization}`);
    return axios.create({
        baseURL: nextCloudBaseURL,
        headers: {
            "Matrix-Id": MatrixID,
            "Authorization": NextCloudAuthorization,
            "withCredentials": false,
            "OCS-APIRequest": true,
        },
    });
};


export const errorNotification = (errMessage) => {
    const type="error"; const message="Error";
    notification.config({
        maxCount: 3,
        duration: 2,
    });

    notification[type]({
        message,
        description: 'An unknown error has occurred',
    });
};

// 获取nextCloud用户名
export const getNextCloudUserName = () => {
    return requestElement()({
        method: 'GET',
        url: "api/v1/nextcloud/whoami",
    })
        .then((res: any) => res?.data)
        .catch(err => {
        });
};

// 获取文件列表
export const getNextCloudFilesList = (username, currentPath) => {
    return requestNextCloud()({
        method: 'PROPFIND',
        url: `remote.php/dav/files/${username}/${currentPath}`,
    }).then((res: any) => {
        let formatXmlObj;
        parseString(res?.data, function(err, result) {
            formatXmlObj = formatFilesXmlObj(username, result);
        });
        return formatXmlObj;
    }).catch(err => {
        console.log('formatFilesXmlObj error', err);
        errorNotification(err?.message);
    });
};

// 下载文件
export const downLoadNextCloudFile=(fileName, isFolder, params={}) => {
    const folderUrl = `index.php/apps/files/ajax/download.php`;
    const fileUrl = `remote.php/webdav/${fileName}`;
    return requestNextCloud()({
        responseType: 'blob',
        method: 'GET',
        url: isFolder ? folderUrl : fileUrl,
        params,
    }).then((res: any) => {
        downFlowFiles(res);
    }).catch(err => {
        console.log('downLoadNextCloudFile error', err);
        errorNotification(err?.message);
    });
};

// 上传文件
export const uploadNextCloudFile = (fileName, currentPath, file, source?) => {
    const path = currentPath ? `${currentPath}${fileName}` : `${fileName}`;
    return requestNextCloud()({
        "method": 'PUT',
        "url": `remote.php/webdav/${path}`,
        "data": file,
        "cancelToken": source?.token,
    }).then((res: any) => {
        notification.success({
            message: "成功",
            description: `${fileName}保存到网盘成功`,
        });
    }).catch(err => {
        notification.error({
            message: "失败",
            description: `${fileName}保存到网盘失败`,
        });
    });
};

// 删除文件
export const deleteNextCloudFile = (username, currentPath) => {
    const path = currentPath ? `/${currentPath}`: '';
    return requestNextCloud()({
        "method": 'DELETE',
        "url": `remote.php/dav/files/${username}${path}`,
    }).then((res: any) => {
        console.log('deleteNextCloudFile res', res);
        return res;
    }).catch(err => {
        console.log('deleteNextCloudFile error', err);
        errorNotification(err?.message);
    });
};

// 新建文件夹
export const createNewFolder = (username, currentPath, folderName) => {
    return requestNextCloud()({
        "method": 'MKCOL',
        "url": `remote.php/dav/files/${username}/${currentPath}${folderName}`,
    }).then((res: any) => {
        console.log('createNewFolder res', res);
        return res;
    }).catch(err => {
        console.log('createNewFolder error', err);
        errorNotification(err?.message);
    });
};

// 获取请求的UUID，指定长度和进制,如
export function getUUID(len, radix?) {
    const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    const uuid = [];
    let i;
    radix = radix || chars.length;
    if (len) {
        for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random() * radix];
    } else {
        let r;
        uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
        uuid[14] = '4';
        for (i = 0; i < 36; i++) {
            if (!uuid[i]) {
                r = 0 | Math.random() * 16;
                uuid[i] = chars[(i === 19) ? (r & 0x3) | 0x8 : r];
            }
        }
    }
    return uuid.join('');
}

// 大文件上传 Starting a chunked upload
export const uploadBigFileStart = (username) => {
    const uuid = getUUID(32, 16);
    const name = `web-file-upload-${uuid}-${new Date().getTime()}`;
    return requestNextCloud()({
        "method": 'MKCOL',
        "url": `remote.php/dav/uploads/${encodeURIComponent(username)}/${name}`,
    }).then((res: any) => {
        return name;
    }).catch(err => {
        console.log('uploadBigFileStart error', err);
        errorNotification(err?.message);
    });
};

// 大文件上传 Uploading chunks
export const uploadBitFileChunk = (username, folderName, name, chunk) => {
    return requestNextCloud()({
        "method": 'PUT',
        "url": `remote.php/dav/uploads/${username}/${folderName}/${name}`,
        "data": chunk,
    }).then((res: any) => {
        console.log('uploadBigFileStart res', res);
        return res;
    }).catch(err => {
        console.log('uploadBigFileStart error', err);
        errorNotification(err?.message);
    });
};

// 大文件上传 Assembling the chunks
export const uploadBitFileAssembling = (username, folderName, fileIndex, file) => {
    requestNextCloud()({
        "method": 'MOVE',
        "url": `remote.php/dav/uploads/${username}/${folderName}/.file`,
        "data": file,
    }).then((res: any) => {
        console.log('uploadBigFileStart res', res);
        return res;
    }).catch(err => {
        console.log('uploadBigFileStart error', err);
        errorNotification(err?.message);
    });
};

// 大文件上传 Aborting the upload delete  folder
export const uploadBitFileDelete = (username, folderName) => {
    requestNextCloud()({
        "method": 'DELETE',
        "url": `remote.php/dav/uploads/${username}/${folderName}`,
    }).then((res: any) => {
        console.log('uploadBigFileStart res', res);
        return res;
    }).catch(err => {
        console.log('uploadBigFileStart error', err);
        errorNotification(err?.message);
    });
};

// 上传文件到根目录
export const uploadNextCloudRootFile = async (fileName, file) => {
    return requestNextCloud()({
        "method": 'PUT',
        "url": `remote.php/webdav/${fileName}`,
        "data": file,
    }).then((res: any) => {
        notification.success({
            message: "成功",
            description: `${fileName}保存到网盘成功`,
        });
    }).catch(err => {
        notification.error({
            message: "失败",
            description: `${fileName}保存到网盘失败`,
        });
    });
};

// 获取共享链接
export const getShareLink = async (currentPath, fileName) => {
    const path = `/${currentPath}${fileName}`;
    return requestNextCloud()({
        "method": 'GET',
        "url": `ocs/v2.php/apps/files_sharing/api/v1/shares?format=json&path=${path}&reshares=true`,
    }).then((res: any) => {
        const shareLink = res?.data?.ocs?.data?.[0]?.url;
        const isFolder = res?.data?.ocs?.data?.[0]?.item_type==='folder';
        if (shareLink) {
            return Promise.resolve({ shareLink, isFolder });
        } else {
            return Promise.reject(path);
        }
    });
};

// 创建共享链接
export const createShareLink = async ({
    currentPath,
    fileName,
    permissions,
    shareType,
    shareWith,
    password,
    expireDate,
}) => {
    const path = `/${currentPath}${fileName}`;
    return requestNextCloud()({
        "method": 'POST',
        "url": `ocs/v2.php/apps/files_sharing/api/v1/shares?format=json`,
        "data": {
            "attributes": "[]",
            "path": path,
            "permissions": permissions,
            "shareType": shareType,
            "shareWith": shareWith,
            "password":password,
            "expireDate":expireDate
        },
    }).then((res: any) => {
        const shareLink = res?.data?.ocs?.data?.url;
        const isFolder = res?.data?.ocs?.data?.item_type==='folder';

        if (shareLink) {
            return Promise.resolve({ shareLink, isFolder });
        }
    });
};

// 搜索
export const getSearchList = (val) => {
    return requestNextCloud()({
        "method": 'GET',
        "url": `ocs/v2.php/search/providers/files/search`,
        "params": {
            term: val,
            from: '/apps/files/?dir=/',
        },
    });
};

// Search for share recipients 搜索共享收件人
export const getSearchSharees = (params: any) => {
    return requestNextCloud()({
        "method": 'GET',
        "url": `ocs/v2.php/apps/files_sharing/api/v1/sharees?format=json&itemType=${params?.folder}&search=${params?.search}&lookup=false&perPage=25`,
    });
};

// 获取共享链接
export const getShareesRecommended =(params:any)=>{
    return requestNextCloud()({
        "method": 'GET',
        "url": `ocs/v2.php/apps/files_sharing/api/v1/shares?format=json&path=${params.path}&reshares=true`,
    });
}

// 生成password
export const generatePassword = () =>{
    return requestNextCloud()({
        "method": 'GET',
        "url": `ocs/v2.php/apps/password_policy/api/v1/generate`,
    });
}

// 获取共享人列表
export const getShareUserList = (parentId?: any) => {
    return requestElement()({
        method: 'GET',
        url: `api/v1/groups?parent=${parentId}`,
    })
        .then((res: any) => res?.data);
};

