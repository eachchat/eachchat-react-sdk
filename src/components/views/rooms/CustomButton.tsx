import { IEventRelation } from "matrix-js-sdk/src/models/event";
import React from 'react';
import { Room } from 'matrix-js-sdk/src/models/room';

import { CollapsibleButton } from './CollapsibleButton';

interface ICustomButtonProps {
    room: Room;
    relation?: IEventRelation;
    title: string;
    data?: object;
    onClick?: () => void;
}

const CustomButton = (props: ICustomButtonProps) => {
    const { title, onClick } = props;

    const handleClick = () => {
        onClick && onClick();
    };

    return (
        <CollapsibleButton
            className="mx_MessageComposer_button"
            iconClassName="mx_MessageComposer_poll"
            onClick={handleClick}
            title={title}
        />
    );
};

export default CustomButton;
