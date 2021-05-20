import React from 'react';
import ContextMenusDraggable from '../../ContextMenusDraggable';

const ContextMenus = ({ contextMenus, updateStorage }) => {
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