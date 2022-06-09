import React, { useState, useCallback, useMemo } from 'react';
import { translateSource } from '../../constants/translateSource';
import { getOptions } from '../../public/options';
import { Translation } from '../../types';
import IconFont from '../IconFont';
import PanelIconButtonWrapper from '../PanelIconButtons/PanelIconButtonWrapper';
import SelectOptions from '../SelectOptions';
import SourceFavicon from '../SourceFavicon';
import './style.css';

type MtAddSourceProps = {
    translations: Translation[];
    addSource: (source: string, addType: number) => void;
};

const MtAddSource: React.FC<MtAddSourceProps> = ({ translations, addSource }) => {
    const [showSelectOptions, setShowSelectOptions] = useState(false);

    const sourceList = useMemo(() => {
        return translateSource.concat(getOptions().customTranslateSourceList).filter(v => translations.findIndex(v1 => v1.source === v.source) < 0);
    }, [translations]);

    const hideSelectOptions = useCallback(() => {
        setShowSelectOptions(false);
    }, []);

    const onAddSourceUnshift = useCallback((source: string) => {
        addSource(source, 1);
        hideSelectOptions();
    }, [addSource, hideSelectOptions]);

    const onAddSource = useCallback((source: string) => {
        addSource(source, 0);
        hideSelectOptions();
    }, [addSource, hideSelectOptions]);

    return (
        <div className='add-source'>
            <div
                className='add-source__wrapper'
                onMouseLeave={hideSelectOptions}
            >
                <PanelIconButtonWrapper
                    onClick={() => setShowSelectOptions(showSelectOptions => !showSelectOptions)}
                >
                    <IconFont
                        iconName='#icon-plus'
                        className='add-source__badge'
                    />
                </PanelIconButtonWrapper>
                <SelectOptions
                    className='scrollbar'
                    show={showSelectOptions}
                    maxHeight={150}
                    cover
                >
                    {sourceList.map((v, i) => (<div
                        key={v.source + i}
                        className='source-selector__item button'
                        onClick={() => onAddSource(v.source)}
                    >
                        <span className='source-selector__item-source'>
                            <SourceFavicon source={v.source} />
                        </span>
                        <span className='source-selector__item-icons'>
                            <PanelIconButtonWrapper
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onAddSourceUnshift(v.source);
                                }}
                            >
                                <IconFont iconName='#icon-top' />
                            </PanelIconButtonWrapper>
                        </span>
                    </div>))}
                    {sourceList.length === 0 && <div style={{padding: '6px', textAlign: 'center'}}>......</div>}
                </SelectOptions>
            </div>
        </div>
    );
};

export default MtAddSource;