import React from 'react';
import { setLocalStorage } from '../../../../public/chrome-call';
import { useOptions } from '../../../../public/react-use';
import { GetStorageKeys } from '../../../../types';
import ContextMenusDraggable from '../../components/ContextMenusDraggable';

const useOptionsDependency: GetStorageKeys<
    'contextMenus'
> = [
    'contextMenus'
];

const ContextMenus: React.FC = () => {
    const {
        contextMenus
    } = useOptions(useOptionsDependency);

    return (
        <div className='opt-section'>
            <div className='opt-section-row'>
                <ContextMenusDraggable
                    contextMenus={contextMenus}
                    update={newContextMenus => setLocalStorage({ contextMenus: newContextMenus })}
                />
            </div>
        </div>
    );
};

export default ContextMenus;