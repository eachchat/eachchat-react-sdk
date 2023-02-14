/* eslint-disable max-len */
import axios from "axios";
import { parseString } from 'xml2js';
import { notification } from 'antd';

import { MatrixClientPeg } from "../../../MatrixClientPeg";

// window.nextCloud = {};
// window.nextCloud.accessToken = MatrixClientPeg.get().getAccessToken();

// 获取日期
export const getDate = (str) => {
    try {
        const year = new Date(str).getFullYear();
        const month = new Date(str).getMonth() + 1;
        const date = new Date(str).getDate();
        const hours = new Date(str).getHours();
        const minutes = new Date(str).getMinutes();
        return `${year}年${month}月${date}日 ${hours}:${minutes}`;
    } catch (error) {
        console.log('getDate err', error);
    }
};

// 格式化Size
export const formatSize = (val) => {
    const size = Number(val) as number;
    const KB = 1024;
    const MB = 1024*KB;
    const G = 1024*MB;
    if (isNaN(size)) {
        return ``;
    } else if (size===0) {
        return `0KB`;
    } else if (size<KB) {
        return `<1KB`;
    } else if (size<MB) {
        return `${parseInt(size/KB)}KB`;
    } else if (size<G) {
        return `${parseFloat(size/MB).toFixed(1)}MB`;
    } else {
        return `${parseFloat(size/G).toFixed(1)}GB`;
    }
};

// 格式化xmlObj
export const formatFilesXmlObj = (username, xmlObj) => {
    try {
        const COMMON_PATH = `/remote.php/dav/files/${username}/`;
        const response = xmlObj?.['d:multistatus']?.['d:response'];
        const root = response.shift();
        const rootHref = root?.['d:href']?.[0];
        return response.map((item: any, index) => {
            const href = item?.['d:href'][0];
            const props = item?.['d:propstat'][0]?.['d:prop'][0];
            const isFolder = props?.['d:resourcetype']?.[0]?.['d:collection'] ? true : false;
            const quotaUsedBytes = props?.['d:quota-used-bytes']?.[0] || 0;
            const getcontentlength = props?.['d:getcontentlength']?.[0] || 0;
            const size = isFolder ? quotaUsedBytes : getcontentlength;
            const modified = props?.['d:getlastmodified']?.[0];
            const currentPath = href?.replace(COMMON_PATH, '');
            return {
                "id": currentPath,
                "href": href,
                "getetag": props?.['d:getetag']?.[0],
                "getlastmodified": modified,
                "quota-available-bytes": quotaUsedBytes,
                "quota-used-bytes": props?.['d:quota-used-bytes']?.[0],
                "resourcetype": props?.['d:resourcetype']?.[0],
                "getcontentlength": getcontentlength,
                "getcontenttype": props?.['d:getcontenttype'],
                "isFolder": isFolder,
                "name": decodeURI(href?.replace(rootHref, '')).replace('/', ''),
                "size": formatSize(size),
                "modified": getDate(modified),
                "currentPath": currentPath,
                "downloadPath": currentPath,
                "dir": `/${rootHref?.replace(COMMON_PATH, '')?.slice(0, -1)}`,
            };
        });
    } catch (error) {
        console.log('formatFilesXmlObj error', error);
    }
};

// 流文件下载
export const downFlowFiles = (res: any) => {
    const blob = new Blob([res.data]);
    // 提取文件名
    let contentDisposition: any = "";
    if (res.headers["content-disposition"]) {contentDisposition = res.headers["content-disposition"];}
    if (res.headers["Content-disposition"]) {contentDisposition = res.headers["Content-disposition"];}
    const err = contentDisposition.match(/err=(.*)/);
    if (err && err[1]) {
        console.log(decodeURI(err[1]));
        return;
    }
    const fileName = contentDisposition.match(/filename=(.*)/)[1];
    const downloadElement = document.createElement('a');
    const href = window.URL.createObjectURL(blob); //创建下载的链接
    downloadElement.href = href;
    downloadElement.download = decodeURI(fileName).replace(new RegExp('"', 'g'), ''); //下载后文件名
    document.body.appendChild(downloadElement);
    downloadElement.click(); //点击下载
    document.body.removeChild(downloadElement); //下载完成移除元素
    window.URL.revokeObjectURL(href); //释放掉blob对象
};
// const baseURL = 'https://some-domain.com/api/';
const elementBaseURL = 'element';
const nextCloudBaseURL = 'nextCloud';

export const requestElement =() => {
    const MatrixID = localStorage.getItem("mx_user_id");
    const Authorization = `Bearer ${localStorage.getItem('mx_authorization')}`;
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
    const Authorization = `Bearer ${localStorage.getItem('mx_authorization')}`;
    const NextCloudUserName = localStorage.getItem('mx_next_cloud_username');
    const NextCloudAuthorization ='Basic ' + btoa(`${NextCloudUserName}:${MatrixID}|${Authorization}`);
    return axios.create({
        baseURL: nextCloudBaseURL,
        headers: {
            "Matrix-Id": MatrixID,
            "Authorization": NextCloudAuthorization,
            "withCredentials": false,
        },
    });
};

// export const requestNextCloudXml = axios.create({
//     baseURL: nextCloudBaseURL,
//     headers: {
//         // "Accept": 'application/xml',
//         "Matrix-Id": MatrixID,
//         "Authorization": NextCloudAuthorization,
//         // "withCredentials": false,
//     },
// });

// type NotificationType = 'success' | 'info' | 'warning' | 'error';
export const errorNotification = (errMessage) => {
    const type="error"; const message="Error";
    notification.config({
        maxCount: 3,
        duration: 2,
    });

    notification[type]({
        message,
        description: 'An unknown error has occurred',
        // description: errMessage,
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
            // errorNotification(err?.message);
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
export const uploadNextCloudFile = (fileName, currentPath, file, source) => {
    const path = currentPath ? `${currentPath}${fileName}` : `${fileName}`;
    return requestNextCloud()({
        "method": 'PUT',
        "url": `remote.php/webdav/${path}`,
        "data": file,
        "cancelToken": source?.token,
    }).then((res: any) => {
        console.log('uploadNextCloudFile res', res);
        return res;
    }).catch(err => {
        console.log('uploadNextCloudFile error', err);
        errorNotification(err?.message);
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
