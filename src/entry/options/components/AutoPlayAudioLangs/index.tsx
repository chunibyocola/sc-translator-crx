import React, { startTransition, useMemo, useRef, useState } from 'react';
import Button from '../../../../components/Button';
import IconFont from '../../../../components/IconFont';
import { langCodeI18n, preferredLangCode } from '../../../../constants/langCode';
import SelectOptions from '../../../../components/SelectOptions';
import { cn } from '../../../../public/utils';
import TextField from '../../../../components/TextField';
import { getMessage } from '../../../../public/i18n';
import { useMouseEventOutside } from '../../../../public/react-use';
import './style.css';
import ConfirmDelete from '../../../collection/components/ConfirmDelete';
import scOptions from '../../../../public/sc-options';

type AutoPlayAudioLangsProps = {
    langs: string[];
    onChange: (langs: string[]) => void;
};

const AutoPlayAudioLangs: React.FC<AutoPlayAudioLangsProps> = ({ langs, onChange }) => {
    const [editing, setEditing] = useState(false);
    const [search, setSearch] = useState('');
    const [confirmClear, setConfirmClear] = useState(false);

    const checkedLangSet = useMemo(() => new Set(langs), [langs]);
    const langI18n = useMemo(() => langCodeI18n[scOptions.getInit().userLanguage], []);
    const filtered = useMemo(() => preferredLangCode[scOptions.getInit().userLanguage].filter(({ name }) => (name.includes(search))), [search]);

    const editBoxElt = useRef<HTMLDivElement>(null);

    useMouseEventOutside(() => setEditing(false), 'mousedown', editBoxElt.current, editing);

    return (
        <div>
            <div>
                <div className='auto-langs__edit' ref={editBoxElt}>
                    <Button
                        variant='contained'
                        onClick={() => setEditing(editing => !editing)}
                    >
                        {getMessage('wordSelect')}
                    </Button>
                    <SelectOptions
                        show={editing}
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
                            className={cn('auto-langs__list__item', checkedLangSet.has(code) && 'checked')}
                            onClick={() => checkedLangSet.has(code) ? onChange(langs.filter(lang => lang !== code)) : onChange(langs.concat(code))}
                        >
                            {name}
                        </div>))}
                    </SelectOptions>
                </div>
                <Button
                    variant='text'
                    onClick={() => setConfirmClear(true)}
                >
                    {getMessage('wordClear')}
                </Button>
                {confirmClear && <ConfirmDelete
                    drawerTitle={getMessage('optionsSelectAutoPlayLanguageClear')}
                    onConfirm={() => {
                        onChange([]);
                        setConfirmClear(false);
                    }}
                    onCancel={() => setConfirmClear(false)}
                    onClose={() => setConfirmClear(false)}
                />}
            </div>
            <div className='auto-langs__preview'>
                <div>{getMessage('optionsPreview')}</div>
                <div className='auto-langs__preview__list'>
                    {langs.length === 0 && '--'}
                    {langs.map((lang) => (<div key={lang} className='auto-langs__preview__list__item'>
                        {langI18n[lang] ?? lang}
                        <IconFont iconName='#icon-GoX' onClick={() => onChange(langs.filter(v => v !== lang))} />
                    </div>))}
                </div>
            </div>
        </div>
    );
};

export default AutoPlayAudioLangs;