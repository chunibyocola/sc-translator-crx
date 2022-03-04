import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Button from '../../../components/Button';
import Checkbox from '../../../components/Checkbox';
import IconFont from '../../../components/IconFont';
import ListenButton from '../../../components/ListenButton';
import SourceFavicon from '../../../components/SourceFavicon';
import TranslateResult from '../../../components/TranslateResult';
import { getMessage } from '../../../public/i18n';
import scIndexedDB, { StoreCollectionValue } from '../../../public/sc-indexed-db';
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

const Collection: React.FC = () => {
    const [collectionValues, setCollectionValues] = useState<StoreCollectionValue[]>([]);
    const [currentValue, setCurrentValue] = useState<StoreCollectionValue>();
    const [checked, setChecked] = useState<boolean[]>([]);
    const checkedLength = useMemo(() => checked.reduce((total, current) => (total + (current ? 1 : 0)), 0), [checked]);

    const refreshCollectionValues = useCallback(() => {
        scIndexedDB.getAll('collection').then(data => setCollectionValues(data));
    }, []);

    useEffect(() => {
        refreshCollectionValues();
    }, [refreshCollectionValues]);

    useEffect(() => {
        setChecked(new Array(collectionValues.length).fill(false));
    }, [collectionValues]);

    return (
        <div className='collection'>
            <div className='nav-bar'>
                <div className='main-title'>
                    <span style={{fontWeight: 'bold', marginRight: '10px'}}>Sc</span>{getMessage('collectionTitle')}
                </div>
            </div>
            <div style={{height: '1px'}}></div>
            <div className='toolbar'>
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
                                value && collectionValues[index] && deleteQueries.push(collectionValues[index].text);
                            });

                            deleteQueries.length > 0 && scIndexedDB.delete('collection', deleteQueries).then(() => refreshCollectionValues());
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
                </>}
            </div>
            <div style={{height: '2px'}}></div>
            <div className='container'>
                <div className='left'>
                    <div className='cards'>
                        {collectionValues.map((collectionValue, index) => (<div
                            key={collectionValue.text}
                            className={'cards__item'}
                        >
                            <Checkbox
                                checked={checked[index] ?? false}
                                onChange={checked => setChecked((value) => {
                                    value[index] = checked;
                                    return [...value];
                                })}
                            />
                            <div onClick={() => setCurrentValue(collectionValue)}>
                                <CollectionValueCard collectionValue={collectionValue} />
                            </div>
                        </div>))}
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