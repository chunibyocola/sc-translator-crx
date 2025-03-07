import React, { startTransition, useMemo, useRef, useState } from 'react';
import { langCodeI18n, preferredLangCode } from '../../constants/langCode';
import scOptions from '../../public/sc-options';
import TextField from '../TextField';
import { useMouseEventOutside, useTranslationActions } from '../../public/react-use';
import SelectOptions from '../SelectOptions';
import { getMessage } from '../../public/i18n';
import PanelIconButtonWrapper from '../PanelIconButtons/PanelIconButtonWrapper';
import './style.css';

type SourceLanguageProps = {
    lang: string;
};

const SourceLanguage: React.FC<SourceLanguageProps> = ({ lang }) => {
    const [picking, setPicking] = useState(false);
    const [search, setSearch] = useState('');

    const { state: { to }, actions: { setLanguage } } = useTranslationActions();

    const filtered = useMemo(() => preferredLangCode[scOptions.getInit().userLanguage].filter(({ name }) => (name.includes(search))), [search]);

    const langEltRef = useRef<HTMLDivElement>(null);

    useMouseEventOutside(() => setPicking(false), 'mousedown', langEltRef.current, picking);

    return (
        <div
            className='source-language'
            ref={langEltRef}
            onClick={e => e.stopPropagation()}
        >
            <PanelIconButtonWrapper
                onClick={() => setPicking(!picking)}
            >
                {langCodeI18n[scOptions.getInit().userLanguage][lang]}
            </PanelIconButtonWrapper>
            <SelectOptions
                show={picking}
                fixed
            >
                <TextField
                    placeholder={getMessage('sentenceSearchLanguages')}
                    defaultValue={search}
                    type='search'
                    onChange={(value) => {
                        startTransition(() => {
                            setSearch(value);
                        });
                    }}
                />
                {filtered.map(({ code, name }) => (<div
                    key={code}
                    className='source-language__list__item'
                    onClick={() => setLanguage(code, to)}
                >
                    {name}
                </div>))}
            </SelectOptions>
        </div>
    );
};

export default SourceLanguage;