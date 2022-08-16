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
                <div className='card__title'>{collectionValue.text}</div>
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

type TranslationsContainerProps = {
    collectionValue: StoreCollectionValue;
};

const TranslationsContainer: React.FC<TranslationsContainerProps> = React.memo(({ collectionValue }) => {
    return (
        <div className='translations-container'>
            <div className='translations-container__title'>
                {collectionValue.text}
                <IconFont
                    className='iconbutton button'
                    iconName='#icon-copy'
                    style={{marginLeft: '5px'}}
                    onClick={() => navigator.clipboard.writeText(collectionValue.text)}
                />
            </div>
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

const Collection: React.FC = () => {
    const [collectionValues, setCollectionValues] = useState<StoreCollectionValue[]>([]);
    const [currentValue, setCurrentValue] = useState<StoreCollectionValue>();
    const [checked, setChecked] = useState<boolean[]>([]);
    const [search, setSearch] = useState('');
    const [filteredValues, setFilteredValues] = useState<StoreCollectionValue[]>([]);
    const [orderIndicate, setOrderIndicate] = useState(0); // 0: order by date reverse, 1: order by date, 2: order by text reverse, 3: order by text

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
                                    const deleteQueries: string[] = [];

                                    checked.forEach((value, index) => {
                                        value && filteredValues[index] && deleteQueries.push(filteredValues[index].text);
                                    });

                                    deleteQueries.length > 0 && scIndexedDB.delete(DB_STORE_COLLECTION, deleteQueries).then(() => refreshCollectionValues());
                                }}
                            >
                                <IconFont
                                    iconName='#icon-MdDelete'
                                    style={{fontSize: '24px'}}
                                />
                            </Button>
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
                    {currentValue && <TranslationsContainer collectionValue={currentValue} />}
                </div>
            </div>
        </div>
    );
};

export default Collection;