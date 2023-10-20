import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { StoreCollectionValue } from '../../../../public/sc-indexed-db';
import Button from '../../../../components/Button';
import IconFont from '../../../../components/IconFont';
import { getMessage } from '../../../../public/i18n';
import './style.css';

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

export default NoteTextArea;