import React, { startTransition, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import Button from '../../../components/Button';
import Checkbox from '../../../components/Checkbox';
import IconFont from '../../../components/IconFont';
import ListenButton from '../../../components/ListenButton';
import Logo from '../../../components/Logo';
import SourceFavicon from '../../../components/SourceFavicon';
import TranslateResult from '../../../components/TranslateResult';
import { getMessage } from '../../../public/i18n';
import scFile from '../../../public/sc-file';
import scIndexedDB, { DB_STORE_COLLECTION, StoreCollectionValue } from '../../../public/sc-indexed-db';
import { checkResultFromCustomSource } from '../../../public/translate/custom/check-result';
import { resultToString } from '../../../public/utils';
import './style.css';

type CollectionValueCardProps = {
    collectionValue: StoreCollectionValue;
};
const CollectionValueCard: React.FC<CollectionValueCardProps> = React.memo(({ collectionValue }) => {
    const dateString = useMemo(() => {
        const date = new Date(collectionValue.date);

        return `${date.getFullYear() === new Date().getFullYear() ? '' : date.getFullYear() + '/'}${date.getMonth() + 1}/${date.getDate()}`;
    }, [collectionValue.date]);

    return (
        <div className='card button'>
            <div className='card__content'>
                <div
                    className='card__title'
                    title={collectionValue.text}
                >
                    {collectionValue.text}
                </div>
                {collectionValue.translations[0]?.translateRequest.status === 'finished' && <div className='card__translation'>
                    {resultToString(collectionValue.translations[0].translateRequest.result.result)}
                </div>}
            </div>
            <div className='card__date-sources'>
                <span className='card__date-sources__date'>{dateString}</span>
                <span className='card__date-sources__sources'>
                    {collectionValue.translations.map(translation => <SourceFavicon
                        source={translation.source}
                        key={collectionValue.text + translation.source}
                        faviconOnly
                    />)}
                </span>
            </div>
        </div>
    );
});

type NoteTextAreaProps = {
    editable: boolean;
    defaultNote: StoreCollectionValue['note'];
    onSave: (note: string) => void;
    onCancel: () => void;
    onDelete: () => void;
};

const NoteTextArea: React.FC<NoteTextAreaProps> = React.memo(({ editable, defaultNote, onSave, onCancel, onDelete }) => {
    const pDefaultNote = defaultNote ?? '';

    const [note, setNote] = useState(pDefaultNote);

    const noteTextAreaEleRef = useRef<HTMLTextAreaElement>(null);

    useLayoutEffect(() => {
        setNote(pDefaultNote);
    }, [pDefaultNote]);

    useEffect(() => {
        const element = noteTextAreaEleRef.current;

        if (editable && element) {
            element.focus();
            element.selectionStart = element.selectionEnd = element.value.length;
        }
    }, [editable]);

    return (
        <div className='translations-container__note'>
            <textarea
                className='note__text-area'
                ref={noteTextAreaEleRef}
                value={note ?? ''}
                onChange={(e) => { setNote(e.target.value); }}
                disabled={!editable}
            />
            {editable && <div className='note__update'>
                <div className='note__update__left'>
                    {defaultNote !== undefined && <Button
                        variant='outlined'
                        onClick={() => { onDelete(); }}
                    >
                        <IconFont iconName='#icon-MdDelete' style={{marginRight: '5px'}} />
                        {getMessage('collectionDeleteNote')}
                    </Button>}
                </div>
                <div className='note__update__right'>
                    <Button
                        variant='text'
                        onClick={() => {
                            onCancel();
                            setNote(pDefaultNote);
                        }}
                    >
                        {getMessage('wordCancel')}
                    </Button>
                    <Button
                        variant='contained'
                        onClick={() => { onSave(note); }}
                        disabled={note === pDefaultNote}
                    >
                        {getMessage('wordSave')}
                    </Button>
                </div>
            </div>}
        </div>
    );
});

type TranslationsContainerProps = {
    collectionValue: StoreCollectionValue;
    refreshCollectionValues: () => void;
};

const TranslationsContainer: React.FC<TranslationsContainerProps> = React.memo(({ collectionValue, refreshCollectionValues }) => {
    const [editingNote, setEditingNote] = useState(false);
    const [note, setNote] = useState(collectionValue.note);
    const [deletedNote, setDeletedNote] = useState('');

    useLayoutEffect(() => {
        setEditingNote(false);
        setNote(collectionValue.note);
        setDeletedNote('');
    }, [collectionValue]);

    return (
        <div className='translations-container'>
            <div className='translations-container__title'>
                {collectionValue.text}
            </div>
            <div className='translations-container__toolbox'>
                <Button
                    variant='text'
                    onClick={() => navigator.clipboard.writeText(collectionValue.text)}
                >
                    <IconFont iconName='#icon-copy' style={{marginRight: '5px'}} />
                    {getMessage('optionsButtonCopy')}
                </Button>
                {note === undefined ? <Button
                    variant='text'
                    onClick={() => {
                        setEditingNote(true);
                    }}
                    disabled={editingNote}
                >
                    <IconFont iconName='#icon-addNote' style={{marginRight: '5px'}} />
                    {getMessage('collectionAddNote')}
                </Button> : <Button
                    variant='text'
                    onClick={() => { setEditingNote(true); }}
                    disabled={editingNote}
                >
                    <IconFont iconName='#icon-edit' style={{marginRight: '5px'}} />
                    {getMessage('collectionEditNote')}
                </Button>}
            </div>
            {(editingNote || note !== undefined) ? <NoteTextArea
                editable={editingNote}
                defaultNote={note}
                onSave={(nextNote) => {
                    scIndexedDB.add<StoreCollectionValue>(DB_STORE_COLLECTION, { ...collectionValue, note: nextNote }).then(refreshCollectionValues);

                    setNote(nextNote);
                    setEditingNote(false);
                    setDeletedNote('');
                }}
                onCancel={() => { setEditingNote(false); }}
                onDelete={() => {
                    const { note: beDeletedNote, ...nextCollectionValue } = collectionValue;

                    scIndexedDB.add<StoreCollectionValue>(DB_STORE_COLLECTION, nextCollectionValue).then(refreshCollectionValues);

                    setDeletedNote(note ?? '');

                    setEditingNote(false);
                    setNote(undefined);
                }}
            /> : (deletedNote && <div className='translations-container__undo-delete-note'>
                {getMessage('collectionNoteHaveBeenDeleted')}
                <Button
                    variant='text'
                    onClick={() => {
                        scIndexedDB.add<StoreCollectionValue>(DB_STORE_COLLECTION, { ...collectionValue, note: deletedNote }).then(refreshCollectionValues);

                        setNote(deletedNote);
                        setDeletedNote('');
                    }}
                >
                    {getMessage('collectionUndo')}
                </Button>
                <Button
                    variant='icon'
                    onClick={() =>{
                        setDeletedNote('');
                    }}
                >
                    <IconFont iconName='#icon-GoX' />
                </Button>
            </div>)}
            {collectionValue.translations.map(({ source, translateRequest }) => (translateRequest.status === 'finished' && <div
                key={source + collectionValue.text}
                className='translations-container__item'
            >
                <div>
                    <SourceFavicon source={source} className='translations-container__source-favicon' />
                    <ListenButton source={source} text={collectionValue.text} from={translateRequest.result.from} />
                </div>
                <TranslateResult source={source} translateRequest={translateRequest} />
            </div>))}
        </div>
    );
});

type SearchFieldProps = {
    onChange: (search: string) => void;
};

const SearchField: React.FC<SearchFieldProps> = React.memo(({ onChange }) => {
    const searchElementRef = useRef<HTMLInputElement>(null);

    return (
        <div className='search-field'>
            <Button
                variant='icon'
                onClick={() => {
                    if (!searchElementRef.current) { return; }

                    searchElementRef.current.select();
                }}
            >
                <IconFont
                    iconName='#icon-search'
                    style={{fontSize: '20px'}}
                />
            </Button>
            <input
                type='text'
                ref={searchElementRef}
                defaultValue={''}
                placeholder={getMessage('collectionSearchText')}
                onChange={e => startTransition(() => onChange((e.target as HTMLInputElement).value))}
            />
            <Button
                variant='icon'
                className='search-field__close-btn'
                onClick={() => {
                    if (!searchElementRef.current) { return; }

                    searchElementRef.current.value = '';
                    searchElementRef.current.blur();
                    onChange('');
                }}
            >
                <IconFont
                    iconName='#icon-GoX'
                    style={{fontSize: '20px'}}
                />
            </Button>
        </div>
    );
});

type BackdropProps = Pick<React.HtmlHTMLAttributes<HTMLButtonElement>, 'children'>;;

const Backdrop: React.FC<BackdropProps> = ({ children }) => {
    return (
        <div className='backdrop'>
            {children}
        </div>
    );
};

type ConfirmDeleteProps = {
    onConfirm: () => void;
    onCancel: () => void;
    onClose: () => void;
    deleteList: string[];
};

const ConfirmDelete: React.FC<ConfirmDeleteProps> = ({ onConfirm, onCancel, onClose, deleteList }) => {
    const [fold, setFold] = useState(true);

    return (
        <Backdrop>
            <div className='confirm-delete'>
                <div className='confirm-delete__close'>
                    <Button
                        variant='icon'
                        onClick={() => {
                            onClose();
                        }}
                    >
                        <IconFont iconName='#icon-GoX' style={{fontSize: '20px'}} />
                    </Button>
                </div>
                <div className='confirm-delete__content'>
                    <Button
                        variant='text'
                        onClick={() => {
                            setFold(!fold);
                        }}
                    >
                        <span>{getMessage('collectionConfirmingDelete')}</span>
                        <IconFont iconName='#icon-GoChevronDown' style={fold ? {} : {rotate: '180deg'}} />
                    </Button>
                    <div className='confirm-delete__content__list scrollbar' style={{display: fold ? 'none' : 'block'}}>
                        {deleteList.map((item) => (<div
                            className='confirm-delete__content__list_item'
                            title={item}
                            key={item}
                        >
                            {item}
                        </div>))}
                    </div>
                </div>
                <div className='confirm-delete__buttons'>
                    <Button
                        variant='outlined'
                        onClick={() => {
                            onConfirm();
                        }}
                    >
                        {getMessage('wordConfirm')}
                    </Button>
                    <Button
                        variant='contained'
                        onClick={() => {
                            onCancel();
                        }}
                    >
                        {getMessage('wordCancel')}
                    </Button>
                </div>
            </div>
        </Backdrop>
    );
};

const Collection: React.FC = () => {
    const [collectionValues, setCollectionValues] = useState<StoreCollectionValue[]>([]);
    const [currentValue, setCurrentValue] = useState<StoreCollectionValue>();
    const [checked, setChecked] = useState<boolean[]>([]);
    const [search, setSearch] = useState('');
    const [filteredValues, setFilteredValues] = useState<StoreCollectionValue[]>([]);
    const [orderIndicate, setOrderIndicate] = useState(0); // 0: order by date reverse, 1: order by date, 2: order by text reverse, 3: order by text
    const [deleteList, setDeleteList] = useState<null | string[]>(null);

    const checkedLength = useMemo(() => checked.reduce((total, current) => (total + Number(current)), 0), [checked]);

    const refreshCollectionValues = useCallback(() => {
        scIndexedDB.getAll(DB_STORE_COLLECTION).then(data => setCollectionValues(data));
    }, []);

    useEffect(() => {
        refreshCollectionValues();
    }, [refreshCollectionValues]);

    useLayoutEffect(() => {
        const lowerCaseSearch = search.toLowerCase();
        let nextFilteredValues = lowerCaseSearch ? collectionValues.filter(v => v.text.toLowerCase().includes(lowerCaseSearch)) : [...collectionValues];

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
    }, [collectionValues, search, orderIndicate]);

    return (
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
                    <SearchField onChange={setSearch} />
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
                        <Button
                            variant='text'
                            onClick={async () => {
                                const data = await scIndexedDB.getAll<StoreCollectionValue>(DB_STORE_COLLECTION);

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
                                            const found = (item.translations as any[]).find((value) => {
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
                                            });
                                            if (found) { return false; }
                                            return true;
                                        });

                                        await scIndexedDB.addAll<StoreCollectionValue>(DB_STORE_COLLECTION, values);
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
                    {currentValue && <TranslationsContainer collectionValue={currentValue} refreshCollectionValues={refreshCollectionValues} />}
                </div>
            </div>
        </div>
    );
};

export default Collection;