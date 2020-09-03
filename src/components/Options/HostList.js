import React, { useRef, useCallback, useState } from 'react';
import IconFont from '../IconFont';

const HostList = ({ list, updateList }) => {
    const [checked, setChecked] = useState({});
    const [checkAll, setCheckAll] = useState(false);

    const textEle = useRef(null);

    const handleCheckBoxChange = useCallback((index) => {
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
        if (!Object.keys(checked).length) return;

        updateList(list.filter((v, i) => (!(i in checked))));

        setChecked({});
        setCheckAll(false);
    }, [list, checked, updateList]);

    const handleAddHostBtnClick = useCallback(() => {
        if (!textEle.current.value) return;

        updateList([...list, textEle.current.value]);

        textEle.current.value = '';

        setCheckAll(false);
    }, [list, updateList]);

    return (
        <div className='host-list'>
            <div className='host-list-add'>
                <input ref={textEle} type='text' />
                <button onClick={handleAddHostBtnClick}>
                    <IconFont iconName='#icon-MdAdd' />
                </button>
            </div>
            <div className='host-list-box'>
                {list.map((v, i) => (
                    <div className='host-list-item' key={i} onClick={() => handleCheckBoxChange(i)}>
                        <input
                            type='checkbox'
                            checked={i in checked}
                        />
                        <span>{v}</span>
                    </div>
                ))}
            </div>
            <div className='host-list-menu'>
                <input
                    type='checkbox'
                    checked={checkAll}
                    onClick={handleCheckAllToggle}
                />
                <button
                    onClick={handleRemoveBtnClick}
                >
                    <IconFont iconName='#icon-MdDelete' />
                </button>
            </div>
        </div>
    );
};

export default HostList;