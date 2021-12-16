import React, { useRef, useCallback, useState } from 'react';
import Button from '../../../components/Button';
import Checkbox from '../../../components/Checkbox';
import IconFont from '../../../components/IconFont';
import './style.css';

type HostListProps = {
    list: string[];
    updateList: (list: string[]) => void;
};

const HostList: React.FC<HostListProps> = ({ list, updateList }) => {
    const [checked, setChecked] = useState<{ [key: number]: number; }>({});
    const [checkAll, setCheckAll] = useState(false);

    const textEle = useRef<HTMLInputElement>(null);

    const handleCheckBoxChange = useCallback((index: number) => {
        if (index in checked) {
            let tempObj = { ...checked };
            delete tempObj[index];
            setChecked(tempObj);
        }
        else setChecked({ ...checked, [index]: index });

        setCheckAll(false);
    }, [checked]);

    const handleCheckAllToggle = useCallback(() => {
        checkAll ? setChecked({}) : setChecked(list.reduce((t, v, i) => ({ ...t, [i]: i }), {}));
        
        setCheckAll(!checkAll);
    }, [checkAll, list]);

    const handleRemoveBtnClick = useCallback(() => {
        if (!Object.keys(checked).length) { return; }

        updateList(list.filter((v, i) => (!(i in checked))));

        setChecked({});
        setCheckAll(false);
    }, [list, checked, updateList]);

    const handleAddHostBtnClick = useCallback(() => {
        if (!textEle.current || !textEle.current.value) { return; }

        updateList([...list, textEle.current.value]);

        textEle.current.value = '';

        setCheckAll(false);
    }, [list, updateList]);

    return (
        <div className='host-list'>
            <div className='host-list__add'>
                <input ref={textEle} type='text' />
                <Button variant='icon' onClick={handleAddHostBtnClick}>
                    <IconFont iconName='#icon-MdAdd' />
                </Button>
            </div>
            <div className='host-list__box'>
                {list.map((v, i) => (
                    <div className='host-list__item' key={i} onClick={() => handleCheckBoxChange(i)}>
                        <Checkbox
                            checked={i in checked}
                        />
                        <span>{v}</span>
                    </div>
                ))}
            </div>
            <div className='host-list__menu'>
                <Checkbox
                    checked={checkAll}
                    onChange={handleCheckAllToggle}
                />
                <Button
                    variant='outlined'
                    onClick={handleRemoveBtnClick}
                >
                    <IconFont iconName='#icon-MdDelete' />
                </Button>
            </div>
        </div>
    );
};

export default HostList;