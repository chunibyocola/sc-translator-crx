import React, {useCallback} from 'react';
import translateSource from '../../constants/translateSource';

const Via = ({sourceChange, source, disableSourceChange}) => {
    const handleSelectChange = useCallback(
        (e) => {
            const ele =  e.target;
            const curValue = ele.options[ele.selectedIndex].value;
            sourceChange(curValue);
        },
        [sourceChange]
    );

    return (
        <div
            className='ts-via'
        >
            <span>
                via
                <select
                    className='ts-via-select'
                    value={source}
                    disabled={disableSourceChange}
                    onChange={handleSelectChange}
                >
                    {translateSource.map(v => (
                        <option key={v.source} value={v.source}>
                            {v.url}
                        </option>
                    ))}
                </select>
            </span>
            
        </div>
    )
};

export default Via;