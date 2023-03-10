import React, { useState } from "react";
import { Button, MenuProps, Dropdown, Space } from "antd";
import { LinkOutlined  } from "@ant-design/icons";
import NextCloudShareUserList from "./NextCloudShareUserList";

interface IProps {
    disabled: boolean;
    loading: boolean;
    onShareLink: (data?: any) => void;
    onAddShareUser: (data?: any) => void;
}

const NextCloudShareUser = ({disabled, onClick}) => {
    const [shareUserList, setShareUserList] = useState([]);

    const handleClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
    };

    return (
        <div className="share-user-wrapper" onClick={handleClick}>
            <div className="share-user-select" >
                <span className="share-user-label">添加共享人: </span>
                <NextCloudShareUserList disabled = {disabled} onChange={setShareUserList} />
            </div>
            <Button
                className="share-user-btn"
                size="middle"
                type="primary"
                onClick={() => onClick(shareUserList)}
            >
                确定
            </Button>
        </div>
    );
};

const NextCloudShareButtonGroups = (props: IProps) => {
    const { disabled, loading, onShareLink, onAddShareUser } = props;

    const items: MenuProps["items"] = [
        {
            key: "1",
            label: <NextCloudShareUser  disabled={loading} onClick={onAddShareUser}/>,
        },
    ];

    return (
        <Space direction="vertical">
            <Dropdown.Button
                type="primary"
                trigger={["click"]}
                placement="topLeft"
                menu={{ items }}
                disabled={disabled || loading}
                loading={loading}
                onClick={onShareLink}
            >
                <LinkOutlined />共享
            </Dropdown.Button>
        </Space>
    );
};

export default NextCloudShareButtonGroups;
