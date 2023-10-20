import React, { useMemo } from 'react';
import { StoreCollectionValue } from '../../../../public/sc-indexed-db';
import { resultToString } from '../../../../public/utils';
import SourceFavicon from '../../../../components/SourceFavicon';
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

export default CollectionValueCard;