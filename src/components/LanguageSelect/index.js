import React, { useCallback, useEffect, useRef, useState } from 'react';
import { getMessage } from '../../public/i18n';
import { useDebounce } from '../../public/react-use';
import IconFont from '../IconFont';
import SelectOptions from '../SelectOptions';
import './style.css';

const LanguageSelect = ({ value, onChange, className, langCodes, langLocal, recentLangs }) => {
    const [showOptions, setShowOptions] = useState(false);
    const [searchLangCodes, setSearchLangCodes] = useState([]);
    const [searchText, setSearchText] = useState('');

    useDebounce(() => setSearchLangCodes(langCodes.filter(v => v['name'].indexOf(searchText) >= 0)), 300, [langCodes, searchText]);

    const searchInputElementRef = useRef(null);
    const languageSelectElementRef = useRef(null);
    const onMouseDownRef = useRef((e) => {
        const path = e.path || e.composedPath?.();

        if (path.indexOf(languageSelectElementRef.current) >= 0) { return; }

        setShowOptions(false);
    });

    const handleOptionClick = useCallback((value) => {
        onChange(value);
        setShowOptions(false);
    }, [onChange]);

    const handleInputChange = useCallback(() => {
        setSearchText(searchInputElementRef.current.value);
    }, []);

    const handleOptionsShow = useCallback(() => {
        searchInputElementRef.current.parentElement.parentElement.parentElement.scrollTop = 0;
        searchInputElementRef.current.focus();
        searchInputElementRef.current.select();
    }, []);

    useEffect(() => {
        showOptions ? window.addEventListener('mousedown', onMouseDownRef.current, true) : window.removeEventListener('mousedown', onMouseDownRef.current, true);
    }, [showOptions]);

    return (
        <div
            className={`ts-language-select${className ? ' ' + className : ''}`}
            ref={languageSelectElementRef}
            tabIndex={-1}
            onClick={() => setShowOptions(v => !v)}
        >
            <span className='badge'>
                <span className='badge-text'>{langLocal[value] ?? langLocal['']}</span>
                <IconFont iconName='#icon-GoChevronDown' />
            </span>
            <SelectOptions
                show={showOptions}
                onShow={handleOptionsShow}
                onClick={e => e.stopPropagation()}
            >
                {recentLangs?.map((v) => (v in langLocal && <div
                    className='ts-language-select-option'
                    key={'recent-' + v}
                    onClick={() => handleOptionClick(v)}
                >
                    {langLocal[v]}
                </div>))}
                <div className='ts-language-select-search'>
                    <IconFont iconName='#icon-search' />
                    <div className='ts-language-select-search-input'>
                        <input type='text' placeholder={getMessage('sentenceSearchLanguages')} onChange={handleInputChange} ref={searchInputElementRef} />
                    </div>
                </div>
                {searchLangCodes.length > 0 ? searchLangCodes.map((v) => (<div
                    className='ts-language-select-option'
                    key={v['code']}
                    onClick={() => handleOptionClick(v['code'])}
                >
                    {v['name']}
                </div>)) : <div className='ts-language-select-no-result'>
                    {getMessage('sentenceNoResult')}
                </div>}
            </SelectOptions>
        </div>
    );
};

export default LanguageSelect;