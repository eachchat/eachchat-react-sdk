import React from 'react';

import Icon from '../../icon';
import { QXPUploadFileBaseProps } from '../../qxp/interface';
import { isAcceptedFileType } from '../../qxp/utils';
import { FILE_LIST_ICON, DEFAULT_IMG_TYPES } from '../constants';

import '../index.pcss';

type Props = {
  file: QXPUploadFileBaseProps;
  size?: number;
};

export default function FileIcon({ file, size = 20 }: Props): JSX.Element {
    const iconType = isAcceptedFileType(file, DEFAULT_IMG_TYPES) ? 'img' : 'file';

    return (
        <span
            style={{
                width: size,
                height: size,
            }}
            className='flex justify-center items-center flex-shrink-0 text-center text-white mx-5 my-0'>
            <Icon {...FILE_LIST_ICON[iconType]} />
        </span>
    );
}
