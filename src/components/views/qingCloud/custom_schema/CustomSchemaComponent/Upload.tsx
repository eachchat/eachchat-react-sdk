import React from 'react';
import { Button, Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

interface IProps{
    onChange?: (data) => void;
}

const CustomUpload = (props: IProps) => {
    const { onChange }=props;

    /**
 * 上传附件转base64
 * @param {File} file 文件流
 */
    const fileByBase64 = (file, callback?) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function(e) {
            callback && callback(e.target.result);
        };
    };

    const handleCustomRequest = (options) => {
        const { file, onSuccess }=options;
        fileByBase64(file, (data) => {
            onSuccess(data, file);
        });
    };

    const handleChange = (data) => {
        delete data?.file;
        onChange && onChange(data);
    };

    return <div className='custom-schema-component'>
        <Upload
            className='custom-schema-component'
            customRequest={handleCustomRequest}
            onChange={handleChange}
        >
            <Button icon={<UploadOutlined />}>上传</Button>
        </Upload>
    </div>;
};

export default CustomUpload;

