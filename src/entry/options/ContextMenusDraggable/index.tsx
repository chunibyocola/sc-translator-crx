import React, { useCallback, useEffect, useState } from 'react';
import Draggable from '../../../components/Draggable';
import IconFont from '../../../components/IconFont';
import { OptionsContextMenu } from '../../../types';
import OptionToggle from '../OptionToggle';
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

    const onChange = useCallback((values) => {
        setTempContextMenus(values);
        update(values);
    }, [update]);

    return (
        <div className='context-menus'>
            <Draggable onChange={onChange} values={contextMenus}>
                {tempContextMenus.map((value, index) => (<div key={value.id} draggable-id={value.id}>
                    <div className='flex-justify-content-space-between draggable-item'>
                        <OptionToggle
                            id={value.id}
                            message={`contextMenus_${value.id}`}
                            checked={value.enabled}
                            onClick={() => {
                                update([...contextMenus.slice(0, index), { ...value, enabled: !value.enabled }, ...contextMenus.slice(index + 1, contextMenus.length)]);
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