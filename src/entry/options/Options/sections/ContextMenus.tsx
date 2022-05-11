import React from 'react';
import { setLocalStorage } from '../../../../public/chrome-call';
import { useOptions } from '../../../../public/react-use';
import { DefaultOptions } from '../../../../types';
import ContextMenusDraggable from '../../ContextMenusDraggable';

type PickedOptions = Pick<
    DefaultOptions,
    'contextMenus'
>;
const useOptionsDependency: (keyof PickedOptions)[] = [
    'contextMenus'
];

const ContextMenus: React.FC = () => {
    const {
        contextMenus
    } = useOptions<PickedOptions>(useOptionsDependency);

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