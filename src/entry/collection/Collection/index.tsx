import React, { createContext, startTransition, useCallback, useContext, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
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
import { classNames, resultToString } from '../../../public/utils';
import './style.css';
import SelectOptions from '../../../components/SelectOptions';
import { useMouseEventOutside } from '../../../public/react-use';
import useEffectOnce from '../../../public/react-use/useEffectOnce';

const TagSetContext = createContext<Set<string>>(new Set());

const useTagSearchFiltered = (defaultSearch: string) => {
    const [tagSearch, setTagSearch] = useState(defaultSearch);

    const tagSet = useContext(TagSetContext);

    const filteredTags = useMemo(() => {
        const lowerCaseSearch = tagSearch.toLowerCase();

        return [...tagSet].filter(tagName => tagName.toLowerCase().includes(lowerCaseSearch));
    }, [tagSet, tagSearch]);

    return {
        tagSearch,
        setTagSearch,
        filteredTags,
        tagSet
    };
};

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
                {collectionValue.translations[0]?.translateRequest.status === 'finished' && <div
                    className='card__translation'
                    title={resultToString(collectionValue.translations[0].translateRequest.result.result)}
                >
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

type AddTagProps = {
    onClose: () => void;
    onAdd: (tagName: string) => void;
    addedTags: StoreCollectionValue['tags'];
};

const AddTag: React.FC<AddTagProps> = ({ onClose, onAdd, addedTags }) => {
    const [tagName, setTagName] = useState('');

    const { setTagSearch, filteredTags, tagSet } = useTagSearchFiltered('');

    const addedTagSet = useMemo(() => (new Set(addedTags)), [addedTags]);

    const inputBoxRef = useRef<HTMLInputElement>(null);

    const addTag = useCallback((nextTagName: string) => {
        nextTagName = nextTagName.trimStart().trimEnd();

        nextTagName && onAdd(nextTagName);
    }, [onAdd]);

    useEffect(() => {
        inputBoxRef.current?.focus();
    }, []);

    return (
        <Backdrop>
            <div className='add-tag'>
                <div className='add-tag__close'>
                    <Button
                        variant='icon'
                        onClick={() => { onClose(); }}
                    >
                        <IconFont iconName='#icon-GoX' style={{fontSize: '20px'}} />
                    </Button>
                </div>
                <div className='add-tag__content add-tag__input-box'>
                    <label htmlFor='add-tag-input-box' style={{padding: '5px', opacity: '0.6'}}>
                        <IconFont iconName='#icon-tag' />
                    </label>
                    <input
                        ref={inputBoxRef}
                        id='add-tag-input-box'
                        type='text'
                        placeholder={getMessage('collectionEnterTagName')}
                        onChange={(e) => { startTransition(() => setTagName(e.target.value)); }}
                        maxLength={40}
                    />
                    <Button
                        variant='text'
                        onClick={() => { addTag(tagName); }}
                        disabled={!tagName.trimStart().trimEnd()}
                    >
                        {getMessage('wordAdd')}
                    </Button>
                </div>
                {tagSet.size > 0 && <div className='add-tag__existed'>
                    <div className='add-tag__existed__search'>
                        <div className='add-tag__existed__search__title'>{getMessage('collectionOtherTags')}</div>
                        <div className='add-tag__input-box'>
                            <label htmlFor='search-tag-input-box' style={{padding: '5px', opacity: '0.6'}}>
                                <IconFont iconName='#icon-search' />
                            </label>
                            <input
                                id='search-tag-input-box'
                                type='text'
                                placeholder={getMessage('wordSearch')}
                                onChange={(e) => { startTransition(() => setTagSearch(e.target.value)); }}
                                maxLength={40}
                            />
                        </div>
                    </div>
                    <div className='add-tag__existed__tags'>
                        {filteredTags.map((tagName) => (<div
                            key={tagName}
                            className={classNames('add-tag__existed__tags__item', addedTagSet.has(tagName) && 'added')}
                            title={tagName}
                            onClick={() => { addTag(tagName); }}
                        >
                            {tagName}
                        </div>))}
                    </div>
                </div>}
            </div>
        </Backdrop>
    );
};

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
    updateCurrentValue: () => void;
};

const TranslationsContainer: React.FC<TranslationsContainerProps> = React.memo(({ collectionValue, updateCurrentValue }) => {
    const [editingNote, setEditingNote] = useState(false);
    const [note, setNote] = useState(collectionValue.note);
    const [deletedNote, setDeletedNote] = useState('');
    const [addingTag, setAddingTag] = useState(false);

    const lastTextRef = useRef<string>();

    useLayoutEffect(() => {
        if (lastTextRef.current === collectionValue.text) { return; }

        setEditingNote(false);
        setNote(collectionValue.note);
        setDeletedNote('');
        setAddingTag(false);

        lastTextRef.current = collectionValue.text;
    }, [collectionValue]);

    return (
        <div className='translations-container'>
            {addingTag && <AddTag
                onClose={() => { setAddingTag(false); }}
                onAdd={(tagName) => {
                    const nextTagSet = new Set([...collectionValue.tags ?? [], tagName]);

                    scIndexedDB.add<StoreCollectionValue>(DB_STORE_COLLECTION, { ...collectionValue, tags: [...nextTagSet] }).then(updateCurrentValue);

                    setAddingTag(false);
                }}
                addedTags={collectionValue.tags}
            />}
            <div className='translations-container__title'>
                {collectionValue.text}
            </div>
            <div className='translations-container__tags'>
                {collectionValue.tags?.map((tagName, i) => (<div
                    key={i}
                    className='tags__item'
                >
                    {tagName}
                    <IconFont
                        iconName='#icon-GoX'
                        onClick={() => {
                            const nextTagSet = new Set([...collectionValue.tags ?? []]);

                            nextTagSet.delete(tagName);

                            scIndexedDB.add<StoreCollectionValue>(DB_STORE_COLLECTION, { ...collectionValue, tags: [...nextTagSet] }).then(updateCurrentValue);
                        }}
                    />
                </div>))}
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
                <Button
                    variant='text'
                    onClick={() => { setAddingTag(true); }}
                    disabled={addingTag}
                >
                    <IconFont iconName='#icon-tag' style={{marginRight: '5px'}} />
                    {getMessage('collectionAddTag')}
                </Button>
            </div>
            {(editingNote || note !== undefined) ? <NoteTextArea
                editable={editingNote}
                defaultNote={note}
                onSave={(nextNote) => {
                    scIndexedDB.add<StoreCollectionValue>(DB_STORE_COLLECTION, { ...collectionValue, note: nextNote }).then(updateCurrentValue);

                    setNote(nextNote);
                    setEditingNote(false);
                    setDeletedNote('');
                }}
                onCancel={() => { setEditingNote(false); }}
                onDelete={() => {
                    const { note: beDeletedNote, ...nextCollectionValue } = collectionValue;

                    scIndexedDB.add<StoreCollectionValue>(DB_STORE_COLLECTION, nextCollectionValue).then(updateCurrentValue);

                    setDeletedNote(note ?? '');

                    setEditingNote(false);
                    setNote(undefined);
                }}
            /> : (deletedNote && <div className='translations-container__undo-delete-note'>
                {getMessage('collectionNoteHaveBeenDeleted')}
                <Button
                    variant='text'
                    onClick={() => {
                        scIndexedDB.add<StoreCollectionValue>(DB_STORE_COLLECTION, { ...collectionValue, note: deletedNote }).then(updateCurrentValue);

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
    search: string;
    setSearch: (search: string) => void;
    checkedTagSet: Set<string>;
    setCheckedTagSet: (checkedTagSet: Set<string>) => void;
};

const SearchField: React.FC<SearchFieldProps> = React.memo(({ search, setSearch, checkedTagSet, setCheckedTagSet }) => {
    const [tagFiltering, setTagFiltering] = useState(false);

    const searchElementRef = useRef<HTMLInputElement>(null);

    const { setTagSearch, filteredTags } = useTagSearchFiltered('');

    const tagFilterEleRef = useRef<HTMLDivElement>(null);

    useMouseEventOutside(() => { setTagFiltering(false); }, 'mousedown', tagFilterEleRef.current, tagFiltering);

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
                placeholder={getMessage('collectionSearchText')}
                onChange={e => startTransition(() => setSearch(e.target.value))}
            />
            <div className='search-field__tags-filter' ref={tagFilterEleRef}>
                <Button
                    variant='icon'
                    onClick={() => setTagFiltering(!tagFiltering)}
                >
                    <IconFont
                        iconName='#icon-filter'
                        style={{fontSize: '20px'}}
                    />
                </Button>
                <SelectOptions
                    show={tagFiltering}
                    maxWidth={300}
                    maxHeight={353}
                >
                    <div className='search-field__tags-filter__title'>{getMessage('collectionTags')}</div>
                    <div className='add-tag__input-box'>
                        <label htmlFor='filter-search-tag-input-box' style={{padding: '5px', opacity: '0.6'}}>
                            <IconFont iconName='#icon-search' />
                        </label>
                        <input
                            id='filter-search-tag-input-box'
                            type='text'
                            placeholder={getMessage('wordSearch')}
                            onChange={(e) => { startTransition(() => setTagSearch(e.target.value)); }}
                            maxLength={40}
                        />
                    </div>
                    {filteredTags.map((tagName) => (<div
                        key={tagName}
                        className='search-field__tags-filter__item'
                        style={{color: checkedTagSet.has(tagName) ? 'rgb(25, 118, 210)' : 'rgb(51, 51, 51)'}}
                        title={tagName}
                        onClick={() => {
                            const nextCheckedTagSet = new Set([...checkedTagSet]);

                            nextCheckedTagSet.has(tagName) ? nextCheckedTagSet.delete(tagName) : nextCheckedTagSet.add(tagName);

                            setCheckedTagSet(nextCheckedTagSet);
                        }}
                    >
                        {tagName}
                    </div>))}
                </SelectOptions>
            </div>
            <span className='search-field__division'></span>
            <Button
                variant='icon'
                className='search-field__close-btn'
                disabled={!search && checkedTagSet.size === 0}
                onClick={() => {
                    if (!searchElementRef.current) { return; }

                    searchElementRef.current.value = '';
                    searchElementRef.current.blur();

                    setSearch('');
                    setCheckedTagSet(new Set());
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
    textPair?: [string, string];
    drawerTitle: string;
    deleteList: string[];
};

const ConfirmDelete: React.FC<ConfirmDeleteProps> = ({ onConfirm, onCancel, onClose, textPair, drawerTitle, deleteList }) => {
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
                    {textPair && <div className='confirm-delete__content__text-pair'>
                        <div className='text-pair__first'>{textPair[0]}</div>
                        <div className='text-pair__second' title={textPair[1]}>{textPair[1]}</div>
                    </div>}
                    <Button
                        variant='text'
                        onClick={() => {
                            setFold(!fold);
                        }}
                    >
                        <span>{drawerTitle}</span>
                        <IconFont iconName='#icon-GoChevronDown' style={{minWidth: '1em', rotate: fold ? 'unset' : '180deg'}} />
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

type ManageTagsProps = {
    onTagDeleted: (tagName: string) => void;
    collectionValues: StoreCollectionValue[];
};

const ManageTags = React.memo<ManageTagsProps>(({ onTagDeleted, collectionValues }) => {
    const [managingTags, setManagingTags] = useState(false);
    const [nextDelete, setNextDelete] = useState<{ tagName: string; affectedItems: StoreCollectionValue[]; } | null>(null);

    const { setTagSearch, filteredTags } = useTagSearchFiltered('');

    const manageTagsEleRef = useRef<HTMLDivElement>(null);

    useMouseEventOutside(() => { setManagingTags(false); }, 'mousedown', manageTagsEleRef.current, managingTags);

    return (
        <div className='manage-tags' ref={manageTagsEleRef}>
            {nextDelete && <ConfirmDelete
                onConfirm={() => {
                    const { tagName, affectedItems } = nextDelete;

                    const nextCollectionValues = affectedItems.map((value) => {
                        if (!value.tags?.includes(tagName)) {
                            return value;
                        }

                        const nextTags = value.tags.filter(v => v !== tagName);

                        return { ...value, tags: nextTags };
                    });

                    setNextDelete(null);

                    scIndexedDB.addAll<StoreCollectionValue>(DB_STORE_COLLECTION, nextCollectionValues).then(() => {
                        onTagDeleted(tagName);
                    });
                }}
                onCancel={() => { setNextDelete(null); }}
                onClose={() => { setNextDelete(null); }}
                textPair={[getMessage('collectionTargetTag'), nextDelete.tagName]}
                drawerTitle={getMessage('collectionConfirmRemoveTag')}
                deleteList={nextDelete.affectedItems.map(v => v.text)}
            />}
            <Button
                variant='text'
                onClick={() => { setManagingTags(!managingTags); }}
            >
                <IconFont
                    iconName='#icon-tag'
                    style={{fontSize: '24px', marginRight: '5px'}}
                />
                {getMessage('collectionManageTags')}
            </Button>
            <SelectOptions
                show={managingTags}
                maxWidth={300}
                maxHeight={353}
            >
                <div className='search-field__tags-filter__title'>删除标签</div>
                <div className='add-tag__input-box'>
                    <label htmlFor='manage-search-tag-input-box' style={{padding: '5px', opacity: '0.6'}}>
                        <IconFont iconName='#icon-search' />
                    </label>
                    <input
                        id='manage-search-tag-input-box'
                        type='text'
                        placeholder={getMessage('wordSearch')}
                        onChange={(e) => { startTransition(() => setTagSearch(e.target.value)); }}
                        maxLength={40}
                    />
                </div>
                {filteredTags.map((tagName) => (<div
                    key={tagName}
                    className='manage-tags__item'
                >
                    <span className='manage-tags__item__name' title={tagName}>{tagName}</span>
                    <IconFont
                        iconName='#icon-MdDelete'
                        className='manage-tags__item__delete'
                        onClick={() => {
                            const affectedItems: StoreCollectionValue[] = [];
                            
                            collectionValues.forEach((value) => {
                                value.tags?.includes(tagName) && affectedItems.push(value)
                            });

                            setManagingTags(false);
                            setNextDelete({ tagName, affectedItems });

                            console.log(affectedItems);
                        }}
                    />
                </div>))}
            </SelectOptions>
        </div>
    );
});

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
        scIndexedDB.getAll<StoreCollectionValue>(DB_STORE_COLLECTION).then(data => setCollectionValues(data));
    }, []);

    const updateCurrentValue = useCallback(() => {
        const currentValueText = currentValue?.text;

        if (!currentValueText) { return; }

        scIndexedDB.getAll<StoreCollectionValue>(DB_STORE_COLLECTION).then((data) => {
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
                        {currentValue && <TranslationsContainer collectionValue={currentValue} updateCurrentValue={updateCurrentValue} />}
                    </div>
                </div>
            </div>
        </TagSetContext.Provider>
    );
};

export default Collection;