import React, { useMemo } from 'react';
import { ISchemaFieldComponentProps } from '@formily/react-schema-renderer';

import Card from './card/index';
import Icon from './icon';

function LayoutCard(p: ISchemaFieldComponentProps): JSX.Element {
    const [closed, setClosed] = React.useState(false);

    const collapsible = p.props?.['x-component-props']?.collapsible;

    const handleClick = (): void => {
        if (collapsible) setClosed(!closed);
    };

    const closedStyle = useMemo(() => ({
        height: closed ? '0px' : 'auto',
        overflow: closed ? 'hidden' : 'auto',
        padding: closed ? '0px' : '24px',
    }), [closed]);
    try {
        p.children.forEach((item: any) => {
            const { schema } = item.props;
            const { type } = schema;
            if (type==='string') {
                const node = schema['x-component-props'];
                schema.default = node.value;
            } else {
                const node = schema?.properties;
                for (const key in node) {
                    const temp = node[key]['x-component-props'];
                    temp.defaultValue = temp?.value;
                    node[key].default = temp?.value;
                }
            }
        });
    } catch (error) {
        console.log('error', error);
    }

    return (
        <div className="layout-card">
            <Card title={p.props.title && (
                <div
                    onClick={handleClick}
                    style={{ cursor: 'pointer' }}
                    className="layout-card-title"
                >
                    <span>{ p.props.title }</span>
                    { collapsible &&
            (<Icon
                style={{
                    transform: `rotate(${closed ? '180deg' : '0'})`,
                    transition: '0.3s',
                }}
                name="arrow_drop_down"
            />) }
                </div>
            )}>
                <div
                    style={closedStyle}
                    className='layout-card-content'
                >
                    { p.children }
                </div>
            </Card>
        </div>
    );
}

LayoutCard.isVirtualFieldComponent = true;

export default LayoutCard;
