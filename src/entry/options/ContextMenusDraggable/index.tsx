import React, { useCallback, useEffect, useState } from 'react';
import Checkbox from '../../../components/Checkbox';
import Draggable from '../../../components/Draggable';
import IconFont from '../../../components/IconFont';
import { getMessage } from '../../../public/i18n';
import { OptionsContextMenu } from '../../../types';
import './style.css';

type ContextMenusDraggableProps = {
    contextMenus: OptionsContextMenu[];
    update: (contextMenus: OptionsContextMenu[]) => void;
};

const ContextMenusDraggable: React.FC<ContextMenusDraggableProps> = ({ contextMenus, update }) => {
    const [tempContextMenus, setTempContextMenus] = useState<OptionsContextMenu[]>([]);

    useEffect(() => {
        setTempContextMenus([...contextMenus]);
    }, [contextMenus]);

    const onChange = useCallback((values: OptionsContextMenu[]) => {
        setTempContextMenus(values);
        update(values);
    }, [update]);

    return (
        <div className='context-menus'>
            <Draggable onChange={onChange} values={contextMenus}>
                {tempContextMenus.map((value, index) => (<div key={value.id} data-draggableid={value.id}>
                    <div className='flex-justify-content-space-between draggable-item'>
                        <Checkbox
                            label={getMessage(`contextMenus_${value.id}`)}
                            checked={value.enabled}
                            onChange={(v) => {
                                update([...contextMenus.slice(0, index), { ...value, enabled: v }, ...contextMenus.slice(index + 1, contextMenus.length)]);
                            }}
                        />
                        <IconFont iconName='#icon-move' className='draggable-move' />
                    </div>
                </div>))}
            </Draggable>
        </div>
    );
};

export default ContextMenusDraggable;