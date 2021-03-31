import React, { useEffect, useState } from 'react';
import { setLocalStorage } from '../../public/chrome-call';
import { getOptions } from '../../public/options';
import { useOptions } from '../../public/react-use';
import IconFont from '../IconFont';
import LanguageSelect from '../LanguageSelect';
import './style.css';

const useOptionsDependency = ['recentTranslateFromList', 'recentTranslateToList'];

const updateRecentList = (recentList, code, from) => {
    setLocalStorage({ [`recentTranslate${from ? 'From' : 'To'}List`]: [code].concat(recentList.filter(v => v !== code)).slice(0, 4) });
};

const LanguageSelection = ({ onChange, from, to, languageCodes }) => {
    const [langCodes, setLangCodes] = useState([]);
    const [langLocal, setLangLocal] = useState({});

    const { recentTranslateFromList, recentTranslateToList } = useOptions(useOptionsDependency);

    useEffect(() => {
        setLangCodes(languageCodes[getOptions().userLanguage]);

        setLangLocal(languageCodes[getOptions().userLanguage].reduce((total, current) => {
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