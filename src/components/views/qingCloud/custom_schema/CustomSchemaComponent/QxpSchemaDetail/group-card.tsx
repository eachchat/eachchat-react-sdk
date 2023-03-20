import React, { useState } from 'react';
import cs from 'classnames';
import { UpOutlined, DownOutlined } from '@ant-design/icons';

import { FormInfoCardDataProp } from '../qxp/interface';

type Props = {
  fullScreen: boolean;
  title: string;
  list: FormInfoCardDataProp[];
};

const FULL_COMP = ['AssociatedRecords', 'SubTable', 'ImageUpload', 'FileUpload'];

export function InfoCard({ list }: {list: FormInfoCardDataProp}): JSX.Element {
    const { label, value, key, fieldSchema } = list;
    return (
        <div
            key={key}
            className={cs(
                'flex text-12 p-8 ',
                {
                    'col-span-full': FULL_COMP.includes(fieldSchema['x-component'] as string),
                    'is-mobile-info-card': window?.isMobile,
                },
            )}
        >
            <div className='text-gray-600 flex-shrink-0'>{ label }：</div>
            <div className={cs(
                'text-gray-900 flex-1 card-value word-break',
                {
                    'overflow-x-auto': FULL_COMP.includes(fieldSchema['x-component'] as string),
                },
            )}>{ value }</div>
        </div>
    );
}

function GroupCard({ title, list, fullScreen }: Props): JSX.Element {
    const [isOpen, setIsOpen] = useState(true);

    return (
        <div className='system-card border rounded-8 mt-16 overflow-hidden duration-300 col-span-full'>
            <div className="form-group-title flex justify-between items-center py-8 px-16 bg-gray-50">
                <div className='flex items-center'>
                    <hr className='title-line h-20 w-4' />
                    <div className='font-semibold text-12 text-gray-600 ml-4 inline-block'>{ title }</div>
                </div>
                {
                    isOpen ?
                        <UpOutlined size={20} onClick={() => setIsOpen(!isOpen)} /> :
                        <DownOutlined size={20} onClick={() => setIsOpen(!isOpen)} />
                }
            </div>
            { isOpen && (
                <div
                    className={cs('form-group-body grid gap-x-16 grid-flow-row-dense p-16 pr-0',
                        fullScreen ? 'grid-cols-4' : 'grid-cols-2',
                        window?.isMobile ? 'is-mobile-info-card-wrap' : '',
                    )}
                >
                    { list.map((group) =>
                        <InfoCard key={group.key} list={group as FormInfoCardDataProp} />,
                    ) }
                </div>
            ) }
        </div>
    );
}

export default GroupCard;
