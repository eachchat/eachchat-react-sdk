import { IEventRelation } from "matrix-js-sdk/src/models/event";
import React from 'react';
import { Room } from 'matrix-js-sdk/src/models/room';

import { CollapsibleButton } from './CollapsibleButton';

interface ICustomButtonProps {
    room: Room;
    relation?: IEventRelation;
    title: string;
    data?: object;
    className?: string;
    iconClassName?: string;
    onClick?: () => void;
}

const CustomButton = (props: ICustomButtonProps) => {
    const { title, className, iconClassName, onClick } = props;

    const handleClick = () => {
        onClick && onClick();
    };

    return (
        <CollapsibleButton
            className={`mx_MessageComposer_button ${className}`}
            iconClassName={iconClassName}
            onClick={handleClick}
            title={title}
        />
    );
};

export default CustomButton;
