import React, { startTransition, useCallback, useLayoutEffect, useState } from 'react';
import scIndexedDB, { StorePageTranslationRuleValue } from '../../../../public/sc-indexed-db';
import Button from '../../../../components/Button';
import { useEffectOnce } from '../../../../public/react-use';
import TextField from '../../../../components/TextField';
import './style.css';
import IconFont from '../../../../components/IconFont';
import Checkbox from '../../../../components/Checkbox';
import ConfirmDelete from '../../../collection/components/ConfirmDelete';
import { matchPattern } from '../../../../public/utils';
import { getMessage } from '../../../../public/i18n';

const SpecifyRule: React.FC = () => {
    const [rules, setRules] = useState<StorePageTranslationRuleValue[]>([]);
    const [addingPattern, setAddingPattern] = useState(false);
    const [editingValue, setEditingValue] = useState<StorePageTranslationRuleValue | undefined>(undefined);
    const [checkedItems, setCheckedItems] = useState<Set<StorePageTranslationRuleValue>>(new Set());
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [search, setSearch] = useState('');
    const [filteredRules, setFilteredRules] = useState<StorePageTranslationRuleValue[]>([]);

    const refreshValue = useCallback(() => {
        scIndexedDB.getAll('page-translation-rule').then((value) => {
            setRules(value)
        });
    }, []);

    useEffectOnce(() => {
        refreshValue();
    });

    useLayoutEffect(() => {
        startTransition(() => {
            const processedSearch = search.trimStart().trimEnd().replace(/^http(s)?:\/\//g, '');
            if (processedSearch) {
                setFilteredRules(rules.filter(rule => !!rule.patterns.split(',').map(v => v.trimStart().trimEnd()).find(v => matchPattern(v, processedSearch))));
            }
            else {
                setFilteredRules(rules);
            }
        });
    }, [search, rules]);

    return (
        <div className='rule'>
            <div className='rule__bar'>
                <Checkbox
                    checked={rules.length > 0 && checkedItems.size === rules.length}
                    indeterminate={checkedItems.size > 0}
                    onChange={() => checkedItems.size === 0 ? setCheckedItems(new Set(filteredRules)) : setCheckedItems(new Set())}
                />
                {checkedItems.size > 0 ? <div>
                    <Button variant='icon' onClick={() => setConfirmDelete(true)}>
                        <IconFont iconName='#icon-MdDelete' style={{fontSize: '24px'}} />
                    </Button>
                </div> : <TextField
                    placeholder={getMessage('optionsEnterURLFilterMatchedRules')}
                    value={search}
                    onChange={setSearch}
                    type='search'
                />}
            </div>
            <div className='rule__list'>
                {filteredRules.map((value) => (<div className='rule__list__item' key={value.id}>
                    <Checkbox
                        checked={checkedItems.has(value)}
                        onChange={(checked) => {
                            const nextCheckedItems = new Set(checkedItems);
                            checked ? nextCheckedItems.add(value) : nextCheckedItems.delete(value);
                            setCheckedItems(nextCheckedItems);
                        }}
                    />
                    <div
                        className='rule__list__item__pattern'
                        onClick={() => {
                            setEditingValue(value);
                            setAddingPattern(true);
                            setCheckedItems(new Set());
                        }}
                        title={`${value.patterns}${value.include ? `, include: ${value.include}` : ''}${value.exclude ? `, exclude: ${value.exclude}` : ''}`}
                    >
                        <div>{value.patterns}</div>
                        <Button variant='icon'>
                            <IconFont iconName='#icon-edit' style={{fontSize: '24px'}} />
                        </Button>
                    </div>
                </div>))}
            </div>
            {addingPattern && <AddPattern
                onAdd={(value) => {
                    scIndexedDB.add('page-translation-rule', value).then(() => {
                        setAddingPattern(false);
                        setEditingValue(undefined);
                        refreshValue();
                    });
                }}
                value={editingValue}
                onClose={() => {
                    setAddingPattern(false);
                    setEditingValue(undefined);
                }}
            />}
            {confirmDelete && <ConfirmDelete
                onConfirm={() => {
                    scIndexedDB.delete('page-translation-rule', [...checkedItems.values()].map(v => v.id)).then(refreshValue);

                    setCheckedItems(new Set());
                    setConfirmDelete(false);
                }}
                onCancel={() => setConfirmDelete(false)}
                onClose={() => setConfirmDelete(false)}
                drawerTitle={getMessage('collectionConfirmingDelete')}
                deleteList={[...checkedItems.values()].map(v => v.patterns)}
            />}
            <div className='rule__footer'>
                <Button
                    variant='text'
                    onClick={() => {
                        setAddingPattern(true);
                        setCheckedItems(new Set());
                    }}
                >
                    {getMessage('optionsAddRule')}
                </Button>
            </div>
        </div>
    )
};

const isSelectorsVaild = (selectors: string) => {
    try {
        document.querySelectorAll(selectors);
    }
    catch {
        return false;
    }

    return true;
}

type AddPatternProps = {
    onAdd: (value: Omit<StorePageTranslationRuleValue, 'id'> & { id?: number; }) => void;
    value?: StorePageTranslationRuleValue;
    onClose: () => void;
};

const AddPattern: React.FC<AddPatternProps> = ({ onAdd, value, onClose }) => {
    const [patternsText, setPatternsText] = useState(value?.patterns ?? '');
    const [includeText, setIncludeText] = useState(value?.include ?? '');
    const [excludeText, setExcludeText] = useState(value?.exclude ?? '');
    const [patternsErr, setPatternsErr] = useState('');
    const [includeErr, setIncludeErr] = useState('');
    const [excludeErr, setExcludeErr] = useState('');

    return (
        <div className='add-pattern'>
            <div style={{textAlign: 'right', margin: '4px'}}>
                <Button variant='icon' onClick={onClose}>
                    <IconFont iconName='#icon-GoX' style={{fontSize: '20px'}} />
                </Button>
            </div>
            <TextField
                label={getMessage('optionsMatchURLs')}
                placeholder='www.example.com/path/name, *.example.com/path$'
                defaultValue={patternsText}
                onChange={(value) => {
                    setPatternsText(value);
                    patternsErr && setPatternsErr('');
                }}
                error={!!patternsErr}
                helperText={patternsErr || getMessage('optionsMatchURLsDescription')}
            />
            <TextField
                label={getMessage('optionsIncludeSelectors')}
                placeholder='p, h1, h2, h3, .example *'
                defaultValue={includeText}
                onChange={(value) => {
                    setIncludeText(value);
                    (!value || (includeErr && isSelectorsVaild(value))) && setIncludeErr('');
                }}
                error={!!includeErr}
                helperText={includeErr}
            />
            <TextField
                label={getMessage('optionsExcludeSelectors')}
                placeholder='pre, nav, .notranslate, .username'
                defaultValue={excludeText}
                onChange={(value) => {
                    setExcludeText(value);
                    (!value || (excludeErr && isSelectorsVaild(value))) && setExcludeErr('');
                }}
                error={!!excludeErr}
                helperText={excludeErr}
            />
            <Button
                variant='text'
                disabled={!patternsText || (!includeText && !excludeText) || !!includeErr || !!excludeErr}
                onClick={() => {
                    if (!patternsText) { return; }
                    if (!includeText && !excludeText) { return; }

                    const patterns = patternsText.replace(/http(s)?:\/\//g, '').trimStart().trimEnd();
                    if (!patterns) {
                        setPatternsErr(getMessage('optionsMatchPatternError'));
                        return;
                    }

                    const nextValue: Parameters<typeof onAdd>[0] = { patterns };
                    if (includeText) {
                        if (!isSelectorsVaild(includeText)) {
                            setIncludeErr(getMessage('optionsNotValidSelectorError'));
                            return;
                        }
                        nextValue.include = includeText;
                    }
                    if (excludeText) {
                        if (!isSelectorsVaild(excludeText)) {
                            setExcludeErr(getMessage('optionsNotValidSelectorError'));
                            return;
                        }
                        nextValue.exclude = excludeText;
                    }

                    if (value?.id !== undefined) {
                        nextValue.id = value.id;
                    }

                    onAdd(nextValue);
                }}
            >
                {value?.id !== undefined ? getMessage('optionsUpdateRule') : getMessage('optionsAddRule')}
            </Button>
        </div>
    );
};

export default SpecifyRule;