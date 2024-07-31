import React from 'react';
import { useOptions } from '../../../../public/react-use';
import { GetStorageKeys } from '../../../../types';
import ContextMenusDraggable from '../../components/ContextMenusDraggable';
import scOptions from '../../../../public/sc-options';

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
                    update={newContextMenus => scOptions.set({ contextMenus: newContextMenus })}
                />
            </div>
        </div>
    );
};

export default ContextMenus;