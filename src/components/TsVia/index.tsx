import React from 'react';
import SourceSelect from '../SourceSelect';
import { translateSource } from '../../constants/translateSource';
import './style.css';

type TsViaProps = {
    sourceChange: (source: string) => void;
    source: string;
    disableSourceChange?: boolean;
};

const TsVia: React.FC<TsViaProps> = ({ sourceChange, source, disableSourceChange }) => {
    return (
        <div className='ts-via'>
            <div className='ts-dividing-line'></div>
            <div className='ts-via-content'>
                <span className='ts-via-pre'>via</span>
                <SourceSelect
                    source={source}
                    sourceList={translateSource}
                    onChange={sourceChange}
                    className='ts-via-select'
                    disabled={disableSourceChange}
                />
            </div>
        </div>
    );
};

export default TsVia;