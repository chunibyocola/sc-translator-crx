import React, { useCallback, useState } from 'react';
import { TranslateSource } from '../../constants/translateSource';
import { classNames } from '../../public/utils';
import IconFont from '../IconFont';
import SelectOptions from '../SelectOptions';
import SourceFavicon from '../SourceFavicon';
import './style.css';

type SourceSelectProps = {
    onChange: (value: string) => void;
    sourceList: TranslateSource[];
    source: string;
    disabled?: boolean;
} & Pick<React.HTMLAttributes<HTMLDivElement>, 'className'>;

const SourceSelect: React.FC<SourceSelectProps> = ({ onChange, sourceList, source, className, disabled }) => {
    const [showOptions, setShowOptions] = useState(false);

    const optionClick = useCallback((value) => {
        if (value === source) { return; }

        onChange(value);

        setShowOptions(false);
    }, [source, onChange]);

    return (
        <div
            tabIndex={-1}
            className={classNames('source-select', className, disabled && 'source-select--disabled')}
            onClick={() => !disabled && setShowOptions(!showOptions)}
            onMouseLeave={() => !disabled && setShowOptions(false)}
            onMouseDown={e => disabled && e.preventDefault()}
        >
            <span className='source-select__value'>
                <SourceFavicon source={source} />
            </span>
            <IconFont iconName='#icon-GoChevronDown' style={{position: 'absolute', right: '2px'}} />
            <SelectOptions
                className='source-select__options scrollbar'
                maxHeight={150}
                maxWidth={150}
                show={showOptions}
            >
                {sourceList.map((v) => (<div
                    className='source-select__options__option'
                    key={v.source}
                    onClick={() => optionClick(v.source)}
                >
                    <SourceFavicon source={v.source} />
                </div>))}
            </SelectOptions>
        </div>
    );
};

export default SourceSelect;