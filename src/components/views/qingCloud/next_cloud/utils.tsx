import ThemeWatcher from "../../../../settings/watchers/ThemeWatcher";

export const xmlStr2XmlObj = (xmlStr) => {
    let xmlObj = {};
    xmlObj = new DOMParser().parseFromString(xmlStr, "text/xml");
    return xmlObj;
};

export const xmlToJson = (xmlStr) => {
    // Create the return object
    const xml = xmlStr2XmlObj(xmlStr) as any;
    let obj = {};
    if (xml.nodeType == 1) { // element
        // do attributes
        if (xml.attributes.length > 0) {
            obj["@attributes"] = {};
            for (let j = 0; j < xml.attributes.length; j++) {
                const attribute = xml.attributes.item(j);
                obj["@attributes"][attribute.nodeName] = attribute.nodeValue;
            }
        }
    } else if (xml.nodeType == 3) { // text
        obj = xml.nodeValue;
    }
    // do children
    if (xml.hasChildNodes()) {
        for (let i = 0; i < xml.childNodes.length; i++) {
            const item = xml.childNodes.item(i);
            const nodeName = item.nodeName;
            if (typeof(obj[nodeName]) == "undefined") {
                obj[nodeName] = xmlToJson(item);
            } else {
                if (typeof(obj[nodeName].length) == "undefined") {
                    const old = obj[nodeName];
                    obj[nodeName] = [];
                    obj[nodeName].push(old);
                }
                obj[nodeName].push(xmlToJson(item));
            }
        }
    }
    return obj;
};

export const copyAction = (str) => {
    const createInput = document.createElement('textarea');
    createInput.value = str;
    document.body.appendChild(createInput);
    createInput.select();
    document.execCommand('Copy'); // document执行复制操作
    createInput.remove();
};

export const generateRandomPassword = (size?: number =10)=>{
    const seed = new Array('A','B','C','D','E','F','G','H','I','J','K','L','M','N','P','Q','R','S','T','U','V','W','X','Y','Z',
  'a','b','c','d','e','f','g','h','i','j','k','m','n','p','Q','r','s','t','u','v','w','x','y','z',
  '2','3','4','5','6','7','8','9'
  );
  const seedlength = seed.length;//数组长度
  let createPassword = '';
  for (let i=0; i<size; i++) {
    const j = Math.floor(Math.random()*seedlength);
    createPassword += seed[j];
  }
  return createPassword;
}

export const getExpireDate = (expireDay?: number = 7)=>{
    const nowTime = new Date().getTime();
    const expireTime = nowTime + expireDay*24*60*60*1000;
    const expireDate = new Date(expireTime);
    const year = expireDate.getFullYear();
    let month: number | string = expireDate.getMonth()+1 ;
    month = month>9?month:`0${month}`;
    const date  =expireDate.getDate();
    return `${year}-${month}-${date}`;
}


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
            const currentPath = decodeURIComponent(href?.replace(COMMON_PATH, ''));
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

