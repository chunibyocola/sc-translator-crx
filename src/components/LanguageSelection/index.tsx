import React, { useEffect, useState } from 'react';
import { LangCodes, LocaleLangCodes } from '../../constants/langCode';
import { setLocalStorage } from '../../public/chrome-call';
import { getOptions } from '../../public/options';
import { useOptions } from '../../public/react-use';
import { DefaultOptions } from '../../types';
import IconFont from '../IconFont';
import LanguageSelect from '../LanguageSelect';
import './style.css';

type PickedOptions = Pick<DefaultOptions, 'recentTranslateFromList' | 'recentTranslateToList'>;
const useOptionsDependency: (keyof PickedOptions)[] = ['recentTranslateFromList', 'recentTranslateToList'];

const updateRecentList = (recentList: string[], code: string, from: boolean) => {
    setLocalStorage({ [`recentTranslate${from ? 'From' : 'To'}List`]: [code].concat(recentList.filter(v => v !== code)).slice(0, 4) });
};

type LanguageSelectionProps = {
    onChange: (from: string, to: string) => void;
    from: string;
    to: string;
    languageCodes: LocaleLangCodes;
};

const LanguageSelection: React.FC<LanguageSelectionProps> = ({ onChange, from, to, languageCodes }) => {
    const [langCodes, setLangCodes] = useState<LangCodes>([]);
    const [langLocal, setLangLocal] = useState<{ [key: string]: string; }>({});

    const { recentTranslateFromList, recentTranslateToList } = useOptions<PickedOptions>(useOptionsDependency);

    useEffect(() => {
        setLangCodes(languageCodes[getOptions().userLanguage] as LangCodes);

        setLangLocal(languageCodes[getOptions().userLanguage].reduce((total: { [key: string]: string; }, current) => {
            total[current['code']] = current['name'];
            return total;
        }, {}));
    }, [languageCodes]);

    return (
        <div className='ts-language-selection'>
            <LanguageSelect
                className='ts-language-selection-select'
                value={from}
                langCodes={langCodes}
                langLocal={langLocal}
                recentLangs={recentTranslateFromList}
                onChange={(code) => {
                    if (code === from) { return; }
                    onChange(code, to);
                    code && code in langLocal && updateRecentList(recentTranslateFromList, code, true);
                }}
            />
            <IconFont iconName='#icon-MdSwap' onClick={() => onChange(to, from)} />
            <LanguageSelect
                className='ts-language-selection-select'
                value={to}
                langCodes={langCodes}
                langLocal={langLocal}
                recentLangs={recentTranslateToList}
                onChange={(code) => {
                    if (code === to) { return; }
                    onChange(from, code);
                    code && code in langLocal && updateRecentList(recentTranslateToList, code, false);
                }}
            />
        </div>
    );
};

export default LanguageSelection;