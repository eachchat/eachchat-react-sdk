import React from 'react';
import cs from 'classnames';

import Thumbnail from './thumbnail';
import { FILE_LIST_ICON, THUMBNAIL_SIZE } from '../constants';
import { QXPUploadFileTask } from '../../qxp/interface';
import Icon from '../../icon';

type Props = {
  files: QXPUploadFileTask[];
  className?: string;
  canDownload?: boolean;
  fileBucket: string;
  style?: React.CSSProperties;
  originalThumbnail?: boolean;
  handleDownload?: (file: QXPUploadFileTask) => void;
  deleteFileItem?: (file: QXPUploadFileTask) => void;
  uploadProgressRender?: (file: QXPUploadFileTask) => React.ReactNode;
};

export function ImgList({
    files,
    style,
    className,
    fileBucket,
    canDownload,
    handleDownload,
    deleteFileItem,
    originalThumbnail,
    uploadProgressRender,
}: Props): JSX.Element {
    return (
        <>
            { files.map((file) => {
                const { uid, name, state } = file;
                return (
                    <div
                        key={uid}
                        style={style}
                        className={cs(
                            'w-64 h-64 relative flex justify-center items-center rounded-4 overflow-hidden',
                            'border-1 transition-all duration-300 hover:border-blue-600 qxp-img-item flex-shrink-0',
                            {
                                'border-blue-600 border-dashed': state === 'uploading',
                                'border-red-600 border-solid text-red-600 ': state === 'failed',
                            }, className,
                        )}
                    >
                        <div title={name}>
                            {
                                state && state !== 'success' && (
                                    <div
                                        className="flex flex-col justify-center items-center">
                                        { state && (<Icon {...FILE_LIST_ICON[state]} />) }
                                        <span className="text-12">
                                            { uploadProgressRender?.(file) }
                                        </span>
                                    </div>)
                            }
                            {
                                (state === 'success' || !state) && (
                                    <>
                                        <Thumbnail
                                            fileBucket={fileBucket}
                                            original={originalThumbnail}
                                            imgPath={uid}
                                            imgName={name}
                                            size={THUMBNAIL_SIZE}
                                        />
                                        <div
                                            className={cs(
                                                'w-full h-full absolute top-0 left-0 transition-opacity duration-300',
                                                'opacity-0 hover:opacity-100 text-white text-12',
                                                'flex justify-center items-center bg-gray-900 qxp-file-img-opt',
                                            )}
                                        >
                                            {
                                                canDownload && (
                                                    <Icon
                                                        {...FILE_LIST_ICON['download']}
                                                        clickable
                                                        onClick={() => handleDownload?.(file)}
                                                    />)
                                            }
                                            {
                                                deleteFileItem && (
                                                    <span className="ml-4">
                                                        <Icon
                                                            {...FILE_LIST_ICON['delete']}
                                                            clickable
                                                            onClick={() => deleteFileItem?.(file)}
                                                        />
                                                    </span>)
                                            }
                                        </div>
                                    </>
                                )
                            }
                        </div>
                    </div>
                );
            }) }
        </>
    );
}
