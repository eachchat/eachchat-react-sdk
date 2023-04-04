/* eslint-disable @typescript-eslint/no-unused-vars */
import { isEmpty } from "lodash";
import React, { Props, Suspense } from "react";
import AssociatedDataValueRender from "../AssociatedData/AssociatedDataValueRender";

import FileUpload from "../FileUpload";
import ImageUpload from "../ImageUpload";
import ReadOnlySubTable from "../SubTable/read-only-sub-table";
import { getBasicValue, isMeanless } from "./utils";

export function FormDataSubTableValueRenderer({ value, schema, className }: Props): JSX.Element {
    const componentName = schema['x-component']?.toLowerCase();
    if (componentName === 'fileupload') {
        const fileIconStyle: React.CSSProperties = {
            display: 'block',
            padding: '0',
            width: 'auto',
        };
        return (
            <div className="flex items-center">
                fileupload
                {/* <Icon
                    name="attachment"
                    size={22}
                    className="mr-2 transform -rotate-90"
                /> */}
                {/* { !isEmpty(value) ? (
                    <FileList
                        canDownload
                        style={fileIconStyle}
                        showFileName={false}
                        files={(value as QxpFileFormData[]).map((file) => ({
                            name: file.label,
                            uid: file.value,
                            type: file.type,
                            size: file.size || 0,
                        }))}
                    />
                ) : (
                    <span className="text-gray-500">无附件</span>
                ) } */}
            </div>
        );
    }

    if (componentName === 'imageupload') {
        return (
            <div className="flex items-center">
                imageupload
                {/* <Icon name="image" size={22} className="mr-2" /> */}
                {/* { !isEmpty(value) ? (
                    <div className="flex flex-nowrap gap-4">
                        <FileList
                            canDownload
                            files={(value as QxpFileFormData[]).map((file) => ({
                                name: file.label,
                                uid: file.value,
                                type: file.type,
                                size: file.size || 0,
                            }))}
                        />
                    </div>
                ) : (
                    <span className="text-gray-500">无图片</span>
                ) } */}
            </div>
        );
    }
    return isMeanless(value) ? (
        <span className="text-gray-300">——</span>
    ) : (
        <FormDataValueRenderer
            value={value}
            schema={schema}
            className={className}
        />
    );
}

function SubTableValueRenderer({ value, schema, className }: any): JSX.Element {
    return (
        <Suspense fallback={<div>loading...</div>}>
            <ReadOnlySubTable
                className={className}
                value={value as Record<string, unknown>[]}
                schema={schema as any}
            />
        </Suspense>
    );
}

export default function FormDataValueRenderer({ value, schema, className }: Props): JSX.Element {
    if (!value) {
        return <></>;
    }
    switch (schema['x-component']?.toLowerCase()) {
        case 'subtable':
            return (<SubTableValueRenderer schema={schema} value={value} />);
            return;
        case 'associatedrecords':
            // return (<AssociatedRecordsValueRender schema={schema} value={value} />);
            return;
        case 'associateddata':
            return (<AssociatedDataValueRender schema={schema} value={value as any} />);
        case 'imageupload': {
            return (
                <div className="flex flex-wrap gap-4 w-full max-h-144 overflow-auto">
                    <ImageUpload
                        canDownload
                        imgOnly={true}
                        files={(value as any).map((file) =>
                            ({
                                name: file.label,
                                uid: file.value,
                                type: file.type,
                                size: file.size || 0,
                            }),
                        )}
                    />
                </div>

            );
        }
        case 'fileupload': {
            return (
                <div className="max-w-290">
                    <FileUpload
                        canDownload
                        files={(value as any).map((file) =>
                            ({
                                name: file.label,
                                uid: file.value,
                                type: file.type,
                                size: file.size || 0,
                            }),
                        )}
                    />
                </div>
            );
        }
        default: {
            const content = getBasicValue(schema, value);
            return (
                <span title={typeof content === 'string' ? content : ''} className={className}>{ content }</span>
            );
        }
    }
}

