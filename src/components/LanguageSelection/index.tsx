import React, { useMemo } from 'react';
import { LocaleLangCodes } from '../../constants/langCode';
import { useOptions } from '../../public/react-use';
import { GetStorageKeys } from '../../types';
import IconFont from '../IconFont';
import LanguageSelect from '../LanguageSelect';
import './style.css';
import scOptions from '../../public/sc-options';

const useOptionsDependency: GetStorageKeys<'recentTranslateFromList' | 'recentTranslateToList'> = ['recentTranslateFromList', 'recentTranslateToList'];

const updateRecentList = (recentList: string[], code: string, from: boolean) => {
    scOptions.set({ [`recentTranslate${from ? 'From' : 'To'}List`]: [code].concat(recentList.filter(v => v !== code)).slice(0, 4) });
};

type LanguageSelectionProps = {
    onChange: (from: string, to: string) => void;
    from: string;
    to: string;
    languageCodes: LocaleLangCodes;
};

const LanguageSelection: React.FC<LanguageSelectionProps> = ({ onChange, from, to, languageCodes }) => {
    const langCodes = useMemo(() => languageCodes[scOptions.getInit().userLanguage], [languageCodes]);

    const { recentTranslateFromList, recentTranslateToList } = useOptions(useOptionsDependency);

    return (
        <div className='language-selection'>
            <LanguageSelect
                className='language-selection__select'
                value={from}
                langCodes={langCodes}
                recentLangs={recentTranslateFromList}
                onChange={(code) => {
                    if (code === from) { return; }
                    onChange(code, to);
                    code && updateRecentList(recentTranslateFromList, code, true);
                }}
            />
            <IconFont iconName='#icon-MdSwap' onClick={() => onChange(to, from)} />
            <LanguageSelect
                className='language-selection__select'
                value={to}
                langCodes={langCodes}
                recentLangs={recentTranslateToList}
                onChange={(code) => {
                    if (code === to) { return; }
                    onChange(from, code);
                    code && updateRecentList(recentTranslateToList, code, false);
                }}
            />
        </div>
    );
};

export default LanguageSelection;