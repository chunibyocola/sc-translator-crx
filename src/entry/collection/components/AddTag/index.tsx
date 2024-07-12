import React, { startTransition, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { StoreCollectionValue } from '../../../../public/sc-indexed-db';
import useTagSearchFiltered from '../../useTagSearchFiltered';
import Backdrop from '../Backdrop';
import Button from '../../../../components/Button';
import IconFont from '../../../../components/IconFont';
import { getMessage } from '../../../../public/i18n';
import { cn } from '../../../../public/utils';
import './style.css';

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
                            className={cn('add-tag__existed__tags__item', addedTagSet.has(tagName) && 'added')}
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

export default AddTag;