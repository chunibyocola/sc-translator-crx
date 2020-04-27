import React, {useState} from 'react';
import translateSource from '../../constants/translateSource';
import IconFont from '../IconFont';

const Via = ({sourceChange, source, disableSourceChange}) => {
    const [showSelection, setShowSelection] = useState(false);
    return (
        <div
            className='ts-via'
            onMouseLeave={() => {
                if (showSelection) setShowSelection(false);
            }}
        >
            <span>
                via
                <span className='ts-via-website'>
                    {translateSource.find(v => v.source === source)?.url}
                </span>
                <IconFont
                    iconName='#icon-MdArrowDropUp'
                    className={`ts-via-triangle-up ${showSelection? 'ts-via-triangle-up-check': ''}`}
                    style={{display: disableSourceChange? 'none': 'block'}}
                    onClick={() => setShowSelection(!showSelection)}
                />
            </span>
            <div
                className='ts-via-selection'
                style={{display: showSelection? 'block': 'none'}}
            >
                {translateSource.map((v) => v.source !== source? (
                    <div
                        key={v.source}
                        className='ts-via-selection-item'
                        onClick={() => {
                            if (disableSourceChange) return;
                            sourceChange(v.source);
                            setShowSelection(false);
                        }}
                    >
                        {v.url}
                    </div>
                ): '')}
            </div>
        </div>
    )
};

export default Via;