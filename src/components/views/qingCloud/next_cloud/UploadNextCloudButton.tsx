/*
Copyright 2021 The Matrix.org Foundation C.I.C.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

import { MatrixEvent } from "matrix-js-sdk/src/matrix";
import React from "react";
import classNames from "classnames";
import { CloudUploadOutlined } from '@ant-design/icons';

import { Icon as DownloadIcon } from "../../../../res/img/download.svg";
import { MediaEventHelper } from "../../../../utils/MediaEventHelper";
import { RovingAccessibleTooltipButton } from "../../../../accessibility/RovingTabIndex";
import Spinner from "../../elements/Spinner";
import { _t, _td } from "../../../../languageHandler";
import { FileDownloader } from "../../../../utils/FileDownloader";
import { uploadNextCloudRootFile } from "./request";
import NextCloudShareModel from "./nextCloudShareModel";

interface IProps {
    mxEvent: MatrixEvent;

    // XXX: It can take a cycle or two for the MessageActionBar to have all the props/setup
    // required to get us a MediaEventHelper, so we use a getter function instead to prod for
    // one.
    mediaEventHelperGet: () => MediaEventHelper;
}

interface IState {
    loading: boolean;
    blob?: Blob;
    tooltip: string;
    open: boolean;
    file?: any;
    fileName?: any;
}

export default class DownloadActionButton extends React.PureComponent<IProps, IState> {
    private downloader = new FileDownloader();

    public constructor(props: IProps) {
        super(props);

        this.state = {
            loading: false,
            tooltip: "上传中...",
            open: false,
        };
    }

    private handleOk = () => {
        this.setState({ open: false });
    };

    private handleCancel = () => {
        this.setState({ open: false });
    };

    private onSaveToNextCloudClick = () => {
        this.onUploadNextCloudClick(false);
        this.setState({
            open: true,
            loading: false,
        });
    };
    private onUploadNextCloudClick = async (upload=true) => {
        if (this.state.loading) return;

        this.setState({ loading: true });

        if (this.state.blob) {
            return this.doDownload();
        }

        const blob = await this.props.mediaEventHelperGet().sourceBlob.value;
        this.setState({ blob });
        await this.doDownload(upload);
    };

    private async doDownload(upload?: boolean) {
        const fileName = this.props.mediaEventHelperGet().fileName;
        const file = new File([this.state.blob], fileName, { type: this.state.blob.type });
        this.setState({
            file,
            fileName,
        });
        upload && uploadNextCloudRootFile(fileName, file)
            .finally(() => this.setState({ loading: false }));
    }

    public render() {
        let spinner: JSX.Element;
        if (this.state.loading) {
            spinner = <Spinner w={18} h={18} />;
        }

        const classes = classNames({
            'mx_MessageActionBar_iconButton': true,
            'mx_MessageActionBar_downloadButton': true,
            'mx_MessageActionBar_saveToNextCloudButton': true,
            'mx_MessageActionBar_downloadSpinnerButton': !!spinner,
        });
        return <>
            <RovingAccessibleTooltipButton
                className={classes}
                title={spinner ? _t(this.state.tooltip) : '保存到网盘'}
                onClick={this.onSaveToNextCloudClick}
                // onClick={this.onUploadNextCloudClick}
                disabled={!!spinner}
            >
                <CloudUploadOutlined />
                { spinner }
            </RovingAccessibleTooltipButton>
            <NextCloudShareModel
                className='mx_MessageComposer_nextCloud_share_model'
                showSave={true}
                open={this.state.open}
                maskClosable={false}
                hasRowSelection={false}
                onOk={this.handleOk}
                onCancel={this.handleCancel}
                title="保存到网盘"
                fileObj={{
                    fileName: this.state.fileName,
                    file: this.state.file,
                }}
            />
        </>;
    }
}
