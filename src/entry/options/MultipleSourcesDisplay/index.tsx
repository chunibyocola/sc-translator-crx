import React, { useCallback, useMemo } from 'react';
import IconFont from '../../../components/IconFont';
import SourceFavicon from '../../../components/SourceFavicon';
import { translateSource } from '../../../constants/translateSource';
import { getMessage } from '../../../public/i18n';
import './style.css';

type MultipleSourcesDisplayProps = {
    sources: string[];
    onChange: (sources: string[]) => void;
};

const MultipleSourcesDisplay: React.FC<MultipleSourcesDisplayProps> = ({ sources, onChange }) => {
    const sourcesEnabled = useMemo(() => {
        return sources.reduce((total, current) => ({ ...total, [current]: true }), {});
    }, [sources]);

    const onSourceItemClick = useCallback((source) => {
        if (sources.includes(source)) {
            onChange(sources.filter(value => value !== source));
        }
        else {
            onChange(sources.concat(source));
        }
    }, [sources, onChange]);

    return (
        <div className='multiple-sources-display'>
            <div className='multiple-sources-display__list'>
                {translateSource.map(({ source }) => (<div className='multiple-sources-display__item' key={'msd_' + source}>
                    <input id={'msd_' + source} type='checkbox' readOnly checked={source in sourcesEnabled} onClick={() => onSourceItemClick(source)} />
                    <label htmlFor={'msd_' + source} className='button'>
                        <SourceFavicon source={source} />
                    </label>
                </div>))}
            </div>
            <div className='multiple-sources-display__preview'>
                <div style={{marginTop: '5px', marginRight: '5px'}}>{getMessage('optionsPreview')}</div>
                <div>
                    {sources.length > 0 ? sources.map((source, index) => (<div className='multiple-sources-display__item' key={'msd_p_' + source}>
                        {index !== 0 &&  <IconFont iconName='#icon-GoChevronDown' style={{transform: 'rotate(-90deg)', marginRight: '5px'}} />}
                        <SourceFavicon source={source} />
                    </div>)) : <div style={{marginTop: '5px'}}>--</div>}
                </div>
            </div>
        </div>
    );
};

export default MultipleSourcesDisplay;