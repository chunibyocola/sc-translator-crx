import React, {useCallback, useState, useEffect} from 'react';
import {getLocalStorage} from '../../public/chrome-call';
import {LANG_EN} from '../../constants/langCode';

const LSelect = ({ isFrom, onChange, disableSelect, from, to, options }) => {
    const [userLang, setUserLang] = useState(LANG_EN);

    const handleSelectChange = useCallback((e) => {
        const ele = e.target;
        const curValue = ele.options[ele.selectedIndex].value;
        if (isFrom) {
            onChange(curValue, to);
        }
        else {
            onChange(from, curValue);
        }
    }, [isFrom, onChange, from, to]);

    useEffect(() => {
        getLocalStorage('userLanguage', (data) => {
            setUserLang(data.userLanguage);
        });
    }, []);

    return (
        <div className='ts-select-box'>
            <label className='ts-fromAndTo'>{isFrom? 'from': 'to'}</label>
            <select
                value={isFrom ? from : to}
                className='ts-lselect'
                onChange={handleSelectChange}
                disabled={disableSelect}
            >
                {
                    options[userLang].map((v) => (
                        <option
                            key={v.code}
                            value={v.code}
                        >
                            {v.name}
                        </option>
                    ))
                }
            </select>
        </div>
        
    );
};

export default LSelect;