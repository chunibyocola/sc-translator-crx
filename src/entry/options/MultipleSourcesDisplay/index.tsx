import React, { useCallback, useMemo } from 'react';
import Checkbox from '../../../components/Checkbox';
import IconFont from '../../../components/IconFont';
import SourceFavicon from '../../../components/SourceFavicon';
import { TranslateSource } from '../../../constants/translateSource';
import { getMessage } from '../../../public/i18n';
import './style.css';

type MultipleSourcesDisplayProps = {
    enabledSources: string[];
    sources: TranslateSource[];
    onChange: (sources: string[]) => void;
};

const MultipleSourcesDisplay: React.FC<MultipleSourcesDisplayProps> = ({ enabledSources, sources, onChange }) => {
    const enabledSourcesMap = useMemo(() => {
        return enabledSources.reduce((total, current) => ({ ...total, [current]: true }), {});
    }, [enabledSources]);

    const onSourceItemClick = useCallback((source: string) => {
        if (enabledSources.includes(source)) {
            onChange(enabledSources.filter(value => value !== source));
        }
        else {
            onChange(enabledSources.concat(source));
        }
    }, [enabledSources, onChange]);

    return (
        <div className='multiple-sources-display'>
            <div className='multiple-sources-display__list'>
                {sources.map(({ source }) => (<div className='multiple-sources-display__item' key={'msd_' + source}>
                    <Checkbox
                        label={<SourceFavicon source={source} />}
                        checked={source in enabledSourcesMap}
                        onChange={() => onSourceItemClick(source)}
                    />
                </div>))}
            </div>
            <div className='multiple-sources-display__preview'>
                <div style={{marginTop: '5px', marginRight: '5px'}}>{getMessage('optionsPreview')}</div>
                <div>
                    {enabledSources.length > 0 ? enabledSources.map((source, index) => (<div className='multiple-sources-display__item' key={'msd_p_' + source}>
                        {index !== 0 &&  <IconFont iconName='#icon-GoChevronDown' style={{transform: 'rotate(-90deg)', marginRight: '5px'}} />}
                        <SourceFavicon source={source} />
                    </div>)) : <div style={{marginTop: '5px'}}>--</div>}
                </div>
            </div>
        </div>
    );
};

export default MultipleSourcesDisplay;