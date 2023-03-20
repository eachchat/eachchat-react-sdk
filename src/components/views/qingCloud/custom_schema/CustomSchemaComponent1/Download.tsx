import React from 'react';
import { Button } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import { SizeType } from 'antd/lib/config-provider/SizeContext';
import { ButtonType } from 'antd/lib/button';

interface IProps{
    text?: string;
    size?: SizeType;
    type?: ButtonType;
    files?: Array<any>;
    onChange?: (data) => void;
}

const CustomDownload = (props: IProps) => {
    const { text, files, size, type }=props;

    const handleClick = () => {
        files.forEach(item => {
            const { response, name }=item;
            const aElem = document.createElement('a');
            document.body.appendChild(aElem);
            aElem.setAttribute('href', response);
            aElem.download = name;
            aElem.click();
            document.body.removeChild(aElem);
        });
    };

    return <div className='custom-schema-component'>
        <Button
            type={type}
            icon={<DownloadOutlined />}
            size={size}
            onClick={handleClick}
        >
            { text || '点击下载' }
        </Button>
    </div>;
};

export default CustomDownload;
