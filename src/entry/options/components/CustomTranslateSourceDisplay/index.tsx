import React, { useCallback, useEffect, useRef, useState } from 'react';
import Button from '../../../../components/Button';
import IconFont from '../../../../components/IconFont';
import { getMessage } from '../../../../public/i18n';
import { getOptions, initOptions } from '../../../../public/options';
import { checkResultFromCustomSource } from '../../../../public/translate/custom/check-result';
import { checkResultFromCustomWebpageTranslatSource } from '../../../../public/web-page-translate/custom/check-result';
import { CustomTranslateSource } from '../../../../types';
import './style.css';

type CustomTranslateSourceDisplayProps = {
    customTranslateSources: CustomTranslateSource[];
    onChange: (customTranslateSources: CustomTranslateSource[]) => void;
    webpage?: boolean;
};

const CustomTranslateSourceDisplay: React.FC<CustomTranslateSourceDisplayProps> = ({ customTranslateSources, onChange, webpage }) => {
    const [modifying, setModifying] = useState(false);
    const [updated, setUpdated] = useState(false);
    const [customSources, setCustomSources] = useState<CustomTranslateSource[]>([]);
    const [message, setMessage] = useState('');

    const urlInputRef = useRef<HTMLInputElement>(null);
    const nameInputRef = useRef<HTMLInputElement>(null);

    const testDataRef = useRef({ id: 0, url: '' });

    useEffect(() => {
        setCustomSources([...customTranslateSources]);
    }, [customTranslateSources]);

    const onAddBtnClick = useCallback(() => {
        if (!urlInputRef.current || !nameInputRef.current) { return; }
        const url = urlInputRef.current.value ?? '';
        const name = nameInputRef.current.value.substring(0, 20) || 'Custom source';

        if (testDataRef.current.url === url) { return; }

        try {
            new URL(url);

            ++testDataRef.current.id;

            urlInputRef.current.disabled = true;
            nameInputRef.current.disabled = true;

            setMessage(`URL: ${url} ${getMessage('wordRequesting')}`);

            const id = testDataRef.current.id;

            testCustomSource(url, webpage).then(() => {
                if (!urlInputRef.current || !nameInputRef.current || testDataRef.current.id !== id) { return; }

                setCustomSources(customSources.concat({
                    url,
                    name,
                    source: window.btoa(Number(new Date()).toString() + Math.floor(Math.random() * 10000).toString())
                }));

                setUpdated(true);
                setMessage('');

                urlInputRef.current.value = '';
                nameInputRef.current.value = '';
            }).catch((err) => {
                if (testDataRef.current.id !== id) { return; }

                setMessage((err as Error).message);
            }).finally(() => {
                if (!urlInputRef.current || !nameInputRef.current || testDataRef.current.id !== id) { return; }

                urlInputRef.current.disabled = false;
                nameInputRef.current.disabled = false;

                testDataRef.current.url = '';
            });
        }
        catch (err) {
            setMessage(`Error: ${(err as Error).message}`);
        }
    }, [customSources, webpage]);

    const onSaveBtnClick = useCallback(() => {
        onChange(customSources);
        initOptions({ ...getOptions(), [webpage ? 'customWebpageTranslateSourceList' : 'customTranslateSourceList']: customSources });

        setModifying(false);
        setUpdated(false);
        setMessage('');
        testDataRef.current = { id: testDataRef.current.id + 1, url: '' };
    }, [onChange, customSources, webpage]);

    const onCancelBtnClick = useCallback(() => {
        setUpdated(false);
        setModifying(false);
        setMessage('');
        setCustomSources(customTranslateSources);
        testDataRef.current = { id: testDataRef.current.id + 1, url: '' };
    }, [customTranslateSources]);

    return (
        <div className='custom-translate-source'>
            <div className='custom-translate-source__content'>
                <div className='custom-translate-source__item'>
                    <div>URL</div>
                    <div>{getMessage('wordName')}</div>
                    <Button variant='contained' disabled={modifying} onClick={() => setModifying(true)}>{getMessage('optionsModify')}</Button>
                </div>
                {customSources.length > 0 ? customSources.map(({ url, name, source }, i) => (<div className='custom-translate-source__item' key={source}>
                    <input value={url} disabled type='text' />
                    <input value={name} disabled type='text' />
                    {modifying && <div>
                        <Button
                            variant='icon'
                            onClick={() => {
                                setCustomSources(customSources.filter((value, j) => (i !== j)));
                                setUpdated(true);
                            }}
                        >
                            <IconFont iconName='#icon-MdDelete' />
                        </Button>
                    </div>}
                </div>)) : <div className='item-description'>{getMessage('contentNoRecord')}</div>}
                {modifying && <div className='custom-translate-source__item'>
                    <input ref={urlInputRef} type='text' placeholder={getMessage('optionsURLCanNotBeEmpty')} />
                    <input ref={nameInputRef} type='text' placeholder='Custom source' />
                    <div>
                        <Button variant='icon' onClick={onAddBtnClick}>
                            <IconFont iconName='#icon-MdAdd' />
                        </Button>
                    </div>
                </div>}
                {message && <div>{message}</div>}
                {modifying && <div>
                    <Button variant='contained' disabled={!updated} onClick={onSaveBtnClick}>{getMessage('wordSave')}</Button>
                    <Button variant='text' onClick={onCancelBtnClick}>{getMessage('wordCancel')}</Button>
                </div>}
            </div>
        </div>
    );
};

const testCustomSource = async (url: string, webpage?: boolean) => {
    const fetchJSON = webpage ? {
        paragraphs: [
            ["This ", "is", " a sentence."],
            ["This ", "is another sentence."]
        ],
        targetLanguage: 'en'
    } : {
        text: 'test',
        from: 'auto',
        to: 'en',
        userLang: navigator.language,
        preferred: [getOptions().preferredLanguage, getOptions().secondPreferredLanguage]
    };

    const res = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(fetchJSON)
    }).catch(() => { throw new Error('Error: Connection timed out.'); });

    if (!res.ok) { throw new Error(`Error: Bad request(http code: ${res.status}).`); }

    const data = await res.json();

    webpage ? checkResultFromCustomWebpageTranslatSource(data) : checkResultFromCustomSource(data);
};

export default CustomTranslateSourceDisplay;