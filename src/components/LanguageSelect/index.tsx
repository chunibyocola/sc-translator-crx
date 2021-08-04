import React, { useCallback, useEffect, useRef, useState } from 'react';
import { LangCodes } from '../../constants/langCode';
import { getMessage } from '../../public/i18n';
import { useDebounce } from '../../public/react-use';
import IconFont from '../IconFont';
import SelectOptions from '../SelectOptions';
import './style.css';

type LanguageSelectProps = {
    value: string;
    onChange: (value: string) => void;
    className?: string;
    langCodes: LangCodes;
    langLocal: { [key: string]: string };
    recentLangs: string[];
};

const LanguageSelect: React.FC<LanguageSelectProps> = ({ value, onChange, className, langCodes, langLocal, recentLangs }) => {
    const [showOptions, setShowOptions] = useState(false);
    const [searchLangCodes, setSearchLangCodes] = useState<LangCodes>([]);
    const [searchText, setSearchText] = useState('');

    useDebounce(() => setSearchLangCodes(langCodes.filter(v => v['name'].indexOf(searchText) >= 0)), 300, [langCodes, searchText]);

    const searchInputElementRef = useRef<HTMLInputElement>(null);
    const languageSelectElementRef = useRef<HTMLDivElement>(null);
    const onMouseDownRef = useRef((e: MouseEvent) => {
        const path = e.composedPath?.();

        if (languageSelectElementRef.current && path.indexOf(languageSelectElementRef.current) >= 0) { return; }

        setShowOptions(false);
    });

    const handleOptionClick = useCallback((value: string) => {
        onChange(value);
        setShowOptions(false);
    }, [onChange]);

    const handleInputChange = useCallback(() => {
        if (!searchInputElementRef.current) { return; }

        setSearchText(searchInputElementRef.current.value);
    }, []);

    const handleOptionsShow = useCallback(() => {
        if (!searchInputElementRef.current) { return; }

        const tempElement = searchInputElementRef.current.parentElement?.parentElement?.parentElement;
        tempElement && (tempElement.scrollTop = 0);
        searchInputElementRef.current.focus();
        searchInputElementRef.current.select();
    }, []);

    useEffect(() => {
        showOptions ? window.addEventListener('mousedown', onMouseDownRef.current, true) : window.removeEventListener('mousedown', onMouseDownRef.current, true);
    }, [showOptions]);

    return (
        <div
            className={`language-select${className ? ' ' + className : ''}`}
            ref={languageSelectElementRef}
            tabIndex={-1}
            onClick={() => setShowOptions(v => !v)}
        >
            <span className='language-select__badge'>
                <span className='language-select__badge-text'>{langLocal[value] ?? langLocal['']}</span>
                <IconFont iconName='#icon-GoChevronDown' />
            </span>
            <SelectOptions
                show={showOptions}
                onShow={handleOptionsShow}
                onClick={e => e.stopPropagation()}
            >
                {recentLangs?.map((v) => (v in langLocal && <div
                    className='language-select__option'
                    key={'recent-' + v}
                    onClick={() => handleOptionClick(v)}
                >
                    {langLocal[v]}
                </div>))}
                <div className='language-select__search'>
                    <IconFont iconName='#icon-search' />
                    <div className='language-select__search-input'>
                        <input type='text' placeholder={getMessage('sentenceSearchLanguages')} onChange={handleInputChange} ref={searchInputElementRef} />
                    </div>
                </div>
                {searchLangCodes.length > 0 ? searchLangCodes.map((v) => (<div
                    className='language-select__option'
                    key={v['code']}
                    onClick={() => handleOptionClick(v['code'])}
                >
                    {v['name']}
                </div>)) : <div className='language-select__no-result'>
                    {getMessage('sentenceNoResult')}
                </div>}
            </SelectOptions>
        </div>
    );
};

export default LanguageSelect;