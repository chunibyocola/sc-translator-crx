import React, { useState, useCallback, useMemo, useRef } from 'react';
import { translateSource } from '../../constants/translateSource';
import { Translation } from '../../types';
import IconFont from '../IconFont';
import PanelIconButtonWrapper from '../PanelIconButtons/PanelIconButtonWrapper';
import SelectOptions from '../SelectOptions';
import SourceFavicon from '../SourceFavicon';
import './style.css';
import scOptions from '../../public/sc-options';
import { useMouseEventOutside } from '../../public/react-use';

type MtAddSourceProps = {
    translations: Translation[];
    addSource: (source: string, addType: number) => void;
};

const MtAddSource: React.FC<MtAddSourceProps> = ({ translations, addSource }) => {
    const [showSelectOptions, setShowSelectOptions] = useState(false);

    const sourceList = useMemo(() => {
        return translateSource.concat(scOptions.getInit().customTranslateSourceList).filter(v => translations.findIndex(v1 => v1.source === v.source) < 0);
    }, [translations]);

    const onAddSource = useCallback((source: string) => {
        addSource(source, 0);
    }, [addSource]);

    const addSourceEltRef = useRef<HTMLDivElement>(null);

    useMouseEventOutside(() => setShowSelectOptions(false), 'mousedown', addSourceEltRef.current, showSelectOptions);

    return (
        <div className='add-source'>
            <div
                ref={addSourceEltRef}
                className='add-source__wrapper'
                onClick={() => setShowSelectOptions(!showSelectOptions)}
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
                    maxWidth={150}
                    fixed
                >
                    {sourceList.map((v, i) => (<div
                        key={v.source + i}
                        className='source-selector__item button'
                        onClick={() => onAddSource(v.source)}
                    >
                        <span className='source-selector__item-source'>
                            <SourceFavicon source={v.source} />
                        </span>
                    </div>))}
                    {sourceList.length === 0 && <div style={{padding: '6px', textAlign: 'center'}}>......</div>}
                </SelectOptions>
            </div>
        </div>
    );
};

export default MtAddSource;