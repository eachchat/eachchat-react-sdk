/* eslint-disable camelcase */
/*
Copyright 2022 The Matrix.org Foundation C.I.C.

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

import React, { useContext, useState } from 'react';
import { CollapsibleButton } from '../../rooms/CollapsibleButton';
import { OverflowMenuContext } from '../../rooms/MessageComposerButtons';
import NextCloudShareModel from './nextCloudShareModel';
import SdkConfig from '../../../../SdkConfig';
import { MatrixClientPeg } from '../../../../MatrixClientPeg';

const ShareNextCloudButton = (props) => {
    const next_cloud_url = SdkConfig.get("setting_defaults")?.QingCloud?.next_cloud_url;
    const next_cloud_email_suffix = SdkConfig.get("setting_defaults")?.QingCloud?.next_cloud_email_suffix;
    const matrixID ='@' + MatrixClientPeg.get().getSafeUserId()?.split(':')?.[1];
    let showButton = false;
    if(next_cloud_url && next_cloud_email_suffix===matrixID){
        showButton = true;
    }else{
        showButton = false;
    }
    const [open, setOpen]=useState(false);
    const overflowMenuCloser = useContext(OverflowMenuContext);
    const title="网盘共享";
    const handleOk = () => {
        setOpen(false);
    };
    const handleCancel = () => {
        setOpen(false);
    };
    const handleClick = () => {
        setOpen(true);
        overflowMenuCloser?.();
    };
    return showButton ? <>
        <CollapsibleButton
            className="mx_MessageComposer_button"
            iconClassName="mx_MessageComposer_nextCloud_share"
            onClick={handleClick}
            title={title}
        />
        <NextCloudShareModel
            className='mx_MessageComposer_nextCloud_share_model'
            showShare={true}
            title={title}
            open={open}
            maskClosable={false}
            hasRowSelection={true}
            onOk={handleOk}
            onCancel={handleCancel}
            {...props}
        />

    </> : null
    ;
};


export default ShareNextCloudButton;
