import React from 'react';
import { GenericOptionsProps } from '..';
import { DefaultOptions } from '../../../../types';
import ContextMenusDraggable from '../../ContextMenusDraggable';

type ContextMenusProps = GenericOptionsProps<Pick<
    DefaultOptions,
    'contextMenus'
>>;

const ContextMenus: React.FC<ContextMenusProps> = ({ contextMenus, updateStorage }) => {
    return (
        <div className='opt-section'>
            <div className='opt-section-row'>
                <ContextMenusDraggable
                    contextMenus={contextMenus}
                    update={(newContextMenus) => updateStorage('contextMenus', newContextMenus)}
                />
            </div>
        </div>
    );
};

export default ContextMenus;