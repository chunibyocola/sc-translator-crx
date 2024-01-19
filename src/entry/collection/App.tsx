import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import scIndexedDB, { DB_STORE_COLLECTION, StoreCollectionValue } from '../../public/sc-indexed-db';
import { useEffectOnce } from '../../public/react-use';
import TagSetContext from './TagSetContext';
import Logo from '../../components/Logo';
import { getMessage } from '../../public/i18n';
import SearchField from './components/SearchField';
import Checkbox from '../../components/Checkbox';
import Button from '../../components/Button';
import IconFont from '../../components/IconFont';
import ConfirmDelete from './components/ConfirmDelete';
import ManageTags from './components/ManageTags';
import scFile from '../../public/sc-file';
import { checkResultFromCustomSource } from '../../public/translate/custom/check-result';
import CollectionValueCard from './components/CollectionValueCard';
import TranslationsContainer from './components/TranslationsContainer';

const Collection: React.FC = () => {
    const [collectionValues, setCollectionValues] = useState<StoreCollectionValue[]>([]);
    const [currentValue, setCurrentValue] = useState<StoreCollectionValue>();
    const [checked, setChecked] = useState<boolean[]>([]);
    const [search, setSearch] = useState('');
    const [filteredValues, setFilteredValues] = useState<StoreCollectionValue[]>([]);
    const [orderIndicate, setOrderIndicate] = useState(0); // 0: order by date reverse, 1: order by date, 2: order by text reverse, 3: order by text
    const [deleteList, setDeleteList] = useState<null | string[]>(null);
    const [checkedTagSet, setCheckedTagSet] = useState<Set<string>>(new Set());

    const lastTagSetRef = useRef<Set<string>>(new Set());

    const tagSet = useMemo(() => {
        const lastTags = new Set([...lastTagSetRef.current]);

        collectionValues.forEach(value => value.tags?.forEach(tag => lastTags.add(tag)));

        const nextTags = new Set([...lastTags].sort());

        lastTagSetRef.current = nextTags;

        return nextTags;
    }, [collectionValues]);

    const checkedLength = useMemo(() => checked.reduce((total, current) => (total + Number(current)), 0), [checked]);

    const refreshCollectionValues = useCallback(() => {
        scIndexedDB.getAll(DB_STORE_COLLECTION).then(data => setCollectionValues(data));
    }, []);

    const updateCurrentValue = useCallback(() => {
        const currentValueText = currentValue?.text;

        if (!currentValueText) { return; }

        scIndexedDB.getAll(DB_STORE_COLLECTION).then((data) => {
            const nextCurrentValue = data.find(v => v.text === currentValueText);

            nextCurrentValue && setCurrentValue(nextCurrentValue);

            setCollectionValues(data);
        });
    }, [currentValue]);

    useEffect(() => {
        refreshCollectionValues();
    }, [refreshCollectionValues]);

    useLayoutEffect(() => {
        const lowerCaseSearch = search.toLowerCase();
        let nextFilteredValues = lowerCaseSearch ? collectionValues.filter(v => v.text.toLowerCase().includes(lowerCaseSearch)) : [...collectionValues];

        if (checkedTagSet.size > 0) {
            const checkedTags = [...checkedTagSet];
            nextFilteredValues = nextFilteredValues.filter(value => value.tags?.length && checkedTags.every(tagName => value.tags?.includes(tagName)));
        }

        if (orderIndicate === 0) {
            nextFilteredValues.sort((a, b) => (b.date - a.date));
        }
        else if (orderIndicate === 1) {
            nextFilteredValues.sort((a, b) => (a.date - b.date));
        }
        else if (orderIndicate === 2) {
            nextFilteredValues.reverse();
        }

        setChecked(new Array(nextFilteredValues.length).fill(false));
        setFilteredValues(nextFilteredValues);
    }, [collectionValues, search, orderIndicate, checkedTagSet]);

    useEffectOnce(() => {
        chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
            if (request === 'Are you collection page?') {
                chrome.tabs.getCurrent().then((tab) => {
                    if (tab) {
                        sendResponse({ tabId: tab.id, windowId: tab.windowId });

                        refreshCollectionValues();
                    }
                    else {
                        sendResponse(null);
                    }
                });

                return true;
            }
        });
    });

    return (
        <TagSetContext.Provider value={tagSet}>
            <div className='collection'>
                <div className='navbar'>
                    <div className='navbar-left'>
                        <div className='main-title'>
                            <div className='flex-align-items-center'>
                                <Logo style={{fontSize: '30px', marginRight: '10px'}} />
                                {getMessage('collectionTitle')}
                            </div>
                        </div>
                    </div>
                    <div className='navbar-center'>
                        <SearchField
                            search={search}
                            setSearch={setSearch}
                            checkedTagSet={checkedTagSet}
                            setCheckedTagSet={setCheckedTagSet}
                        />
                    </div>
                    <div className='navbar-right'></div>
                </div>
                <div style={{height: '1px'}}></div>
                <div className='toolbar'>
                    <div className='toolbar-wrapper'>
                        <div className='toolbar-wrapper__left'>
                            <Checkbox
                                checked={checkedLength > 0 && checkedLength === checked.length}
                                indeterminate={checkedLength > 0}
                                onChange={() => setChecked(checkedLength > 0 ? checked.map(() => false) : checked.map(() => true))}
                            />
                            {checkedLength > 0 ? <>
                                <Button
                                    variant='icon'
                                    onClick={() => {
                                        const nextDeleteList: string[] = [];

                                        checked.forEach((value, index) => {
                                            value && filteredValues[index] && nextDeleteList.push(filteredValues[index].text);
                                        });

                                        setDeleteList(nextDeleteList);
                                    }}
                                >
                                    <IconFont
                                        iconName='#icon-MdDelete'
                                        style={{fontSize: '24px'}}
                                    />
                                </Button>
                                {deleteList && <ConfirmDelete
                                    deleteList={deleteList}
                                    drawerTitle={getMessage('collectionConfirmingDelete')}
                                    onCancel={() => {
                                        setDeleteList(null);
                                    }}
                                    onClose={() => {
                                        setDeleteList(null);
                                    }}
                                    onConfirm={() => {
                                        setDeleteList(null);
                                        deleteList?.length > 0 && scIndexedDB.delete(DB_STORE_COLLECTION, deleteList).then(() => refreshCollectionValues());
                                    }}
                                />}
                            </> : <>
                                <Button
                                    variant='icon'
                                    onClick={() => refreshCollectionValues()}
                                >
                                    <IconFont
                                        iconName='#icon-refresh'
                                        style={{fontSize: '24px'}}
                                    />
                                </Button>
                                <Button
                                    variant='text'
                                    onClick={() => setOrderIndicate(v => v === 3 ? 2 : 3)}
                                >
                                    <span className='order-btn__content'>
                                        {getMessage('wordText')}
                                        <span className='order-btn__content__icons'>
                                            <IconFont
                                                iconName='#icon-GoChevronDown'
                                                style={{transform: 'rotate(180deg)', ...(orderIndicate !== 3 ? { opacity: 0.3 } : undefined)}}
                                            />
                                            <IconFont
                                                iconName='#icon-GoChevronDown'
                                                style={orderIndicate !== 2 ? { opacity: 0.3 } : undefined}
                                            />
                                        </span>
                                    </span>
                                </Button>
                                <Button
                                    variant='text'
                                    onClick={() => setOrderIndicate(v => v === 1 ? 0 : 1)}
                                >
                                    <span className='order-btn__content'>
                                        {getMessage('wordDate')}
                                        <span className='order-btn__content__icons'>
                                            <IconFont
                                                iconName='#icon-GoChevronDown'
                                                style={{transform: 'rotate(180deg)', ...(orderIndicate !== 1 ? { opacity: 0.3 } : undefined)}}
                                            />
                                            <IconFont
                                                iconName='#icon-GoChevronDown'
                                                style={orderIndicate !== 0 ? { opacity: 0.3 } : undefined}
                                            />
                                        </span>
                                    </span>
                                </Button>
                            </>}
                        </div>
                        <div className='toolbar-wrapper__right'>
                            <ManageTags
                                onTagDeleted={(tagName) => {
                                    lastTagSetRef.current.delete(tagName);
                                    currentValue?.text ? updateCurrentValue() : refreshCollectionValues();
                                }}
                                collectionValues={collectionValues}
                            />
                            <Button
                                variant='text'
                                onClick={async () => {
                                    const data = await scIndexedDB.getAll(DB_STORE_COLLECTION);

                                    scFile.saveAs(data, 'collection');
                                }}
                            >
                                <IconFont
                                    iconName='#icon-export'
                                    style={{fontSize: '24px', marginRight: '5px'}}
                                />
                                {getMessage('collectionExportCollection')}
                            </Button>
                            <Button
                                variant='text'
                                onClick={async () => {
                                    scFile.open(async (file) => {
                                        try {
                                            let values = await scFile.read(file);

                                            if (!Array.isArray(values)) { return; }

                                            const isObject = (value: any) => {
                                                return !!value && typeof value === 'object' && !Array.isArray(value);
                                            };

                                            values = values.filter((item) => {
                                                if (!isObject(item)) { return false; }
                                                if (typeof item.date !== 'number' || typeof item.text !== 'string' || !item.text) { return false; }
                                                if (!Array.isArray(item.translations)) { return false; }
                                                if (Object.hasOwn(item, 'note') && typeof item.note !== 'string') { return false; }
                                                if (Object.hasOwn(item, 'tags')) {
                                                    if (!Array.isArray(item.tags) || (item.tags as any[]).findIndex(v => typeof v !== 'string') !== -1) { return false; }
                                                }
                                                const found = (item.translations as any[]).findIndex((value) => {
                                                    if (!isObject(value)) { return true; }
                                                    if (typeof value.source !== 'string' || !value.source) { return true; }
                                                    if (!value.translateRequest && typeof value.translateRequest !== 'object') { return true; }
                                                    if (value.translateRequest.status !== 'finished') { return true; }
                                                    try {
                                                        checkResultFromCustomSource(value.translateRequest.result);
                                                        if (typeof value.translateRequest.result.text !== 'string') { return true; }
                                                    }
                                                    catch {
                                                        return true;
                                                    }
                                                    return false;
                                                }) !== -1;
                                                if (found) { return false; }
                                                return true;
                                            });

                                            await scIndexedDB.addAll(DB_STORE_COLLECTION, values);
                                        }
                                        finally {
                                            refreshCollectionValues();
                                        }
                                    });
                                }}
                            >
                                <IconFont
                                    iconName='#icon-import'
                                    style={{fontSize: '24px', marginRight: '5px'}}
                                />
                                {getMessage('collectionImportCollection')}
                            </Button>
                        </div>
                    </div>
                </div>
                <div style={{height: '2px'}}></div>
                <div className='container'>
                    <div className='left'>
                        <div className='cards'>
                            {filteredValues.map((collectionValue, index) => (<div
                                key={collectionValue.text}
                                className='cards__item'
                            >
                                <Checkbox
                                    checked={checked[index] ?? false}
                                    onChange={checked => setChecked((value) => {
                                        value[index] = checked;
                                        return [...value];
                                    })}
                                />
                                <div className='card-wrapper' onClick={() => setCurrentValue(collectionValue)}>
                                    <CollectionValueCard collectionValue={collectionValue} />
                                </div>
                            </div>))}
                            {filteredValues.length === 0 && <div className='no-record'>{getMessage('contentNoRecord')}</div>}
                        </div>
                    </div>
                    <div className='main'>
                        {currentValue && <TranslationsContainer collectionValue={currentValue} updateCurrentValue={updateCurrentValue} />}
                    </div>
                </div>
            </div>
        </TagSetContext.Provider>
    );
};

export default Collection;