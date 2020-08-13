import React, {useCallback, useState, useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {
    translationSetFrom,
    translationSetTo
} from '../../redux/actions/translationActions';
import {getLocalStorage} from '../../public/chrome-call';
import { langCode } from '../../constants/langCode';
import {LANG_EN} from '../../constants/langCode';

const LSelect = ({ from, onChange, disableSelect, source }) => {
    const [userLang, setUserLang] = useState(LANG_EN);

    const translationState = useSelector(state => state.translationState);

    const dispatch = useDispatch();

    const handleSelectChange = useCallback(
        (e) => {
            const ele = e.target;
            const curValue = ele.options[ele.selectedIndex].value;
            if (from) {
                dispatch(translationSetFrom(curValue));
                onChange(curValue, translationState.to);
            }
            else {
                dispatch(translationSetTo(curValue));
                onChange(translationState.from, curValue);
            }
        },
        [dispatch, from, onChange, translationState]
    );

    useEffect(
        () => {
            getLocalStorage('userLanguage', (data) => {
                setUserLang(data.userLanguage);
            });
        },
        []
    );

    return (
        <div className='ts-select-box'>
            <label className='ts-fromAndTo'>{from? 'from': 'to'}</label>
            <select
                value={from? translationState.from: translationState.to}
                className='ts-lselect'
                onChange={handleSelectChange}
                disabled={disableSelect}
            >
                {
                    langCode[source][userLang].map((v) => (
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