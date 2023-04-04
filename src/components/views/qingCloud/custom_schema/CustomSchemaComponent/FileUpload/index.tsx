import { InboxOutlined } from '@ant-design/icons';
import { message, Upload } from 'antd';
import React, { useContext } from 'react';

import type { UploadProps } from 'antd';
import './index.pcss';

const { Dragger } = Upload;

const props = {
    "name": "field_FyE3ibFr",
    "path": "FIELDs.field_FyE3ibFr",
    "dataType": "array",
    "initialized": true,
    "pristine": false,
    "valid": true,
    "modified": true,
    "inputed": false,
    "touched": false,
    "active": false,
    "visited": false,
    "invalid": false,
    "visible": true,
    "display": true,
    "loading": false,
    "validating": false,
    "errors": [],
    "values": [
        [
            {
                "label": "企业微信20221104-104745 (1).png",
                "value": "app/noAppID/form-attachment/noTableID/YWQ4ZGRhZjBlNTBlYTlhMTkxOWZmZWJlMDRmN2VmNmUxNjc1MjQ1MjAwNjg5/企业微信20221104-104745 (1).png",
                "type": "image/png",
                "size": 39474
            }
        ]
    ],
    "ruleErrors": [],
    "ruleWarnings": [],
    "effectErrors": [],
    "warnings": [],
    "effectWarnings": [],
    "editable": true,
    "selfEditable": true,
    "formEditable": true,
    "value": [
        {
            "label": "企业微信20221104-104745 (1).png",
            "value": "app/noAppID/form-attachment/noTableID/YWQ4ZGRhZjBlNTBlYTlhMTkxOWZmZWJlMDRmN2VmNmUxNjc1MjQ1MjAwNjg5/企业微信20221104-104745 (1).png",
            "type": "image/png",
            "size": 39474
        }
    ],
    "initialValue": [],
    "rules": [],
    "required": false,
    "mounted": true,
    "unmounted": false,
    "props": {
        "version": "1.0",
        "key": "field_FyE3ibFr",
        "type": "array",
        "title": "附件",
        "description": "",
        "required": false,
        "readOnly": false,
        "display": true,
        "x-component": "fileupload",
        "x-component-props": {
            "multiple": true,
            "maxFileSize": 500,
            "uploaderDescription": ""
        },
        "x-internal": {
            "permission": 11,
            "isSystem": false,
            "fieldId": "field_FyE3ibFr"
        },
        "x-index": 1,
        "x-mega-props": {}
    },
    "displayName": "FieldState",
    "schema": {
        "version": "1.0",
        "key": "field_FyE3ibFr",
        "type": "array",
        "title": "附件",
        "description": "",
        "required": false,
        "readOnly": false,
        "display": true,
        "x-component": "fileupload",
        "x-component-props": {
            "multiple": true,
            "maxFileSize": 500,
            "uploaderDescription": ""
        },
        "x-internal": {
            "permission": 11,
            "isSystem": false,
            "fieldId": "field_FyE3ibFr"
        },
        "x-index": 1,
        "x-mega-props": {}
    },
    "form": {},
    "mutators": {}
}

const FileUpload = (_props: any) => {
    console.log('FileUpload', props);
    // const TableContext = React.createContext(
    //     { appID: 'noAppID', tableID: 'noTableID', name: 'noName' },
    // );
    // const { appID, tableID } = useContext(TableContext);
    // const { value, form, path } = props;
    // const { readOnly } = props.props;
    // const configProps = props?.props['x-component-props'];

    const { value, form, path } = props;
    const { readOnly } = props?.props;
    const configProps = props?.props['x-component-props'];

    const uploadProps: UploadProps = {
        name: 'file',
        multiple: configProps?.multiple,
        disabled: readOnly,
        action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
        onChange(info) {
            const { status } = info.file;
            if (status !== 'uploading') {
                console.log(info.file, info.fileList);
            }
            if (status === 'done') {
                message.success(`${info.file.name} file uploaded successfully.`);
            } else if (status === 'error') {
                message.error(`${info.file.name} file upload failed.`);
            }
        },
        onDrop(e) {
            console.log('Dropped files', e.dataTransfer.files);
        },
        defaultFileList: [],
        // defaultFileList: value as any,
    };

    return <div className={`fileUpload `}>
        <Dragger {...uploadProps}>
            <p className="ant-upload-drag-icon">
                <InboxOutlined />
            </p>
            <p className="ant-upload-text">点击或拖拽上传文件</p>
        </Dragger>
    </div>;
};

export default FileUpload;
