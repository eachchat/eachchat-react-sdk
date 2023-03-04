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
