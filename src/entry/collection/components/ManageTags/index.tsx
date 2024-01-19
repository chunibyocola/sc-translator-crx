import React, { startTransition, useRef, useState } from 'react';
import scIndexedDB, { DB_STORE_COLLECTION, StoreCollectionValue } from '../../../../public/sc-indexed-db';
import { useMouseEventOutside } from '../../../../public/react-use';
import ConfirmDelete from '../ConfirmDelete';
import { getMessage } from '../../../../public/i18n';
import Button from '../../../../components/Button';
import IconFont from '../../../../components/IconFont';
import SelectOptions from '../../../../components/SelectOptions';
import useTagSearchFiltered from '../../useTagSearchFiltered';
import './style.css';

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

                    scIndexedDB.addAll(DB_STORE_COLLECTION, nextCollectionValues).then(() => {
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

export default ManageTags;