import React, { startTransition, useRef, useState } from 'react';
import useTagSearchFiltered from '../../useTagSearchFiltered';
import { useMouseEventOutside } from '../../../../public/react-use';
import Button from '../../../../components/Button';
import IconFont from '../../../../components/IconFont';
import { getMessage } from '../../../../public/i18n';
import SelectOptions from '../../../../components/SelectOptions';
import './style.css';

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

export default SearchField;