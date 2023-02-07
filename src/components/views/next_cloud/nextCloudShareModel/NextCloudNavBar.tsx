import React from 'react';
import { HomeOutlined } from '@ant-design/icons';
import { Breadcrumb } from 'antd';

const NextCloudNavBar = (props: any) => {
    const { currentPath='', onClick } = props;
    const parthArr = currentPath?.split('/');
    const curentPathArr = parthArr?.map((item, index) => {
        return {
            name: item,
            path: `${parthArr?.slice(0, index+1)?.join('/')}/`,
        };
    });
    const handleClick = (data?: any) => {
        onClick && onClick(data);
    };
    return <div className='NextCloudNavBar-wrap'>
        <div className="Breadcrumb-wrap">
            <Breadcrumb>
                <Breadcrumb.Item onClick={() => handleClick('')}>
                    <HomeOutlined />
                </Breadcrumb.Item>
                {
                    curentPathArr.map((item: any, index) => {
                        return (
                            <Breadcrumb.Item onClick={() => handleClick(item?.path)} key={index}>
                                <span>{ item?.name }</span>
                            </Breadcrumb.Item>
                        );
                    })
                }
            </Breadcrumb>
        </div>
    </div>;
};

export default NextCloudNavBar;
