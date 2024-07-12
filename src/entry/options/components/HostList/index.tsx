import React, { useRef, useCallback, useState } from 'react';
import Button from '../../../../components/Button';
import Checkbox from '../../../../components/Checkbox';
import IconFont from '../../../../components/IconFont';
import { getMessage } from '../../../../public/i18n';
import './style.css';

type HostListProps = {
    list: string[];
    updateList: (list: string[]) => void;
};

const HostList: React.FC<HostListProps> = ({ list, updateList }) => {
    const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());

    const textEle = useRef<HTMLInputElement>(null);

    const handleItemClick = useCallback((host: string) => {
        const nextCheckedItems = new Set(checkedItems);
        nextCheckedItems.has(host) ? nextCheckedItems.delete(host) : nextCheckedItems.add(host);
        setCheckedItems(nextCheckedItems);
    }, [checkedItems]);

    const handleCheckAllClick = useCallback(() => {
        checkedItems.size === 0 ? setCheckedItems(new Set(list)) : setCheckedItems(new Set());
    }, [checkedItems, list]);

    const handleRemoveBtnClick = useCallback(() => {
        if (checkedItems.size === 0) { return; }

        updateList(list.filter(item => !checkedItems.has(item)));

        setCheckedItems(new Set());
    }, [checkedItems, list, updateList]);

    const handleAddHostBtnClick = useCallback(() => {
        if (!textEle.current) { return; }

        const host = textEle.current?.value.trimStart().trimEnd();

        if (!host) { return; }

        textEle.current.value = '';
        setCheckedItems(new Set());

        if (list.includes(host)) { return; }

        updateList([...list, host]);
    }, [list, updateList]);

    return (
        <div className='host-list'>
            <div className='host-list__bar'>
                <Checkbox
                    checked={checkedItems.size > 0 && checkedItems.size === list.length}
                    indeterminate={checkedItems.size > 0}
                    onChange={handleCheckAllClick}
                />
                {checkedItems.size > 0 ? <Button
                    variant='icon'
                    onClick={handleRemoveBtnClick}
                >
                    <IconFont iconName='#icon-MdDelete' style={{fontSize: '24px'}} />
                </Button> : <div className='host-list__add'>
                    <input ref={textEle} type='text' placeholder={getMessage('optionsEnterDomainNameHere')} />
                    <Button variant='icon' onClick={handleAddHostBtnClick}>
                        <IconFont iconName='#icon-MdAdd' />
                    </Button>
                </div>}
            </div>
            <div className='host-list__box'>
                {list.map((v, i) => (
                    <div
                        className='host-list__item'
                        key={i}
                        onClick={() => handleItemClick(v)}
                    >
                        <Checkbox checked={checkedItems.has(v)} />
                        <span>{v}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default HostList;