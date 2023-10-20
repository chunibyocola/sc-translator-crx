import React, { useLayoutEffect, useRef, useState } from 'react';
import scIndexedDB, { DB_STORE_COLLECTION, StoreCollectionValue } from '../../../../public/sc-indexed-db';
import AddTag from '../AddTag';
import IconFont from '../../../../components/IconFont';
import Button from '../../../../components/Button';
import { getMessage } from '../../../../public/i18n';
import NoteTextArea from '../NoteTextArea';
import SourceFavicon from '../../../../components/SourceFavicon';
import ListenButton from '../../../../components/ListenButton';
import TranslateResult from '../../../../components/TranslateResult';
import './style.css';

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

export default TranslationsContainer;