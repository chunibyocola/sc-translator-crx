import React, { useCallback, useMemo, useRef, useState } from 'react';
import { translateSource } from '../../constants/translateSource';
import { cn } from '../../public/utils';
import IconFont from '../IconFont';
import SelectOptions from '../SelectOptions';
import SourceFavicon from '../SourceFavicon';
import PanelIconButtonWrapper from '../PanelIconButtons/PanelIconButtonWrapper';
import { useMouseEventOutside, useTranslationActions } from '../../public/react-use';
import scOptions from '../../public/sc-options';
import './style.css';

type SourceSelectProps = {
    source: string;
};

const MtSourceSelect: React.FC<SourceSelectProps> = ({ source }) => {
    const [showOptions, setShowOptions] = useState(false);

    const { state: { translations }, actions: { replaceSource, addSource } } = useTranslationActions();

    const sources = useMemo(() => {
        const addedSourceSet = new Set(translations.map(translation => translation.source));
        return translateSource.concat(scOptions.getInit().customTranslateSourceList).filter(v => !addedSourceSet.has(v.source));
    }, [translations]);

    const sourceSelectEltRef = useRef<HTMLDivElement>(null);

    useMouseEventOutside(() => setShowOptions(false), 'mousedown', sourceSelectEltRef.current, showOptions);

    return (
        <div
            ref={sourceSelectEltRef}
            className='mtss border-bottom-select'
            onClick={(e) => {
                e.stopPropagation();
                setShowOptions(!showOptions);
            }}
        >
            <PanelIconButtonWrapper>
                <SourceFavicon source={source} className='mtss__favicon' />
            </PanelIconButtonWrapper>
            <SelectOptions
                className='mtss__options scrollbar'
                maxHeight={150}
                maxWidth={150}
                show={showOptions}
                fixed
            >
                {sources.map((v) => (<div
                    className='mtss__options__option'
                    key={v.source}
                    onClick={() => {
                        replaceSource(source, v.source);
                    }}
                >
                    <div className='mtss__source'>
                        <SourceFavicon source={v.source} />
                    </div>
                    <PanelIconButtonWrapper
                        onClick={(e) => {
                            e.stopPropagation();
                            setShowOptions(false);
                            addSource(v.source, 0);
                        }}
                    >
                        <IconFont iconName='#icon-MdAdd' style={{ fontSize: '16px' }} />
                    </PanelIconButtonWrapper>
                </div>))}
                {sources.length === 0 && <div style={{padding: '6px', textAlign: 'center'}}>......</div>}
            </SelectOptions>
        </div>
    );
};

export default MtSourceSelect;