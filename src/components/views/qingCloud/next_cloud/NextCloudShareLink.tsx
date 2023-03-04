import React from 'react';
import { Card } from 'antd';
import { FileOutlined, FolderOutlined } from '@ant-design/icons';
export default class NextCloudShareLink extends React.Component {
    constructor(props: any) {
        super(props);
    }

    componentDidMount() {
    }
    private onBodyLinkClick = (shareLink): void => {
        window.open(shareLink);
    };

    render() {
        const mxEvent = this.props?.mxEvent;
        const content = mxEvent.getContent();
        const { fileName, shareLink, isFolder }=content;
        return (
            <div className="mx_MTextBody mx_EventTile_content  mx_NextCloudShareLink">
                <Card title="网盘分享" size="small">
                    <div className="content" onClick={() => this.onBodyLinkClick(shareLink)}>
                        {
                            isFolder ?
                                <FolderOutlined /> :
                                <FileOutlined />
                        }
                        <div className="name">
                            { fileName }
                        </div>
                    </div>
                </Card>
            </div>
        );
    }
}
