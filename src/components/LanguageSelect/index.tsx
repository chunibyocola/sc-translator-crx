import React, { startTransition, useCallback, useEffect, useRef, useState } from 'react';
import { LangCodes } from '../../constants/langCode';
import { getMessage } from '../../public/i18n';
import { useMouseEventOutside } from '../../public/react-use';
import { classNames } from '../../public/utils';
import IconFont from '../IconFont';
import SelectOptions, { SelectOptionsForwardRef } from '../SelectOptions';
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

    const searchInputElementRef = useRef<HTMLInputElement>(null);
    const languageSelectElementRef = useRef<HTMLDivElement>(null);
    const selectOptionsRef = useRef<SelectOptionsForwardRef>(null);

    useMouseEventOutside(() => setShowOptions(false), 'mousedown', languageSelectElementRef.current, showOptions);

    const onOptionClick = useCallback((value: string) => {
        onChange(value);
        setShowOptions(false);
    }, [onChange]);

    const onSearchInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchText(e.target.value);
    }, []);

    const onSelectOptionsShow = useCallback(() => {
        selectOptionsRef.current?.scrollToTop();
        searchInputElementRef.current?.select();
    }, []);

    useEffect(() => {
        startTransition(() => {
            setSearchLangCodes(langCodes.filter(v => v.name.includes(searchText)));
        });
    }, [langCodes, searchText]);

    return (
        <div
            className={classNames('language-select', className)}
            ref={languageSelectElementRef}
            tabIndex={-1}
            onClick={() => setShowOptions(v => !v)}
        >
            <span className='language-select__badge'>
                <span className='language-select__badge-text'>{langLocal[value] ?? langLocal['']}</span>
                <IconFont iconName='#icon-GoChevronDown' />
            </span>
            <SelectOptions
                ref={selectOptionsRef}
                show={showOptions}
                onShow={onSelectOptionsShow}
                onClick={e => e.stopPropagation()}
            >
                {recentLangs?.map((v) => (v in langLocal && <div
                    className='language-select__option'
                    key={'recent-' + v}
                    onClick={() => onOptionClick(v)}
                >
                    {langLocal[v]}
                </div>))}
                <div className='language-select__search'>
                    <IconFont iconName='#icon-search' />
                    <div className='language-select__search-input'>
                        <input type='text' placeholder={getMessage('sentenceSearchLanguages')} onChange={onSearchInputChange} ref={searchInputElementRef} />
                    </div>
                </div>
                {searchLangCodes.length > 0 ? searchLangCodes.map((v) => (<div
                    className='language-select__option'
                    key={v.code}
                    onClick={() => onOptionClick(v.code)}
                >
                    {v.name}
                </div>)) : <div className='language-select__no-result'>
                    {getMessage('sentenceNoResult')}
                </div>}
            </SelectOptions>
        </div>
    );
};

export default LanguageSelect;