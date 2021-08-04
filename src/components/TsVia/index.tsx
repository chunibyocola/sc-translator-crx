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
        <div className='via'>
            <div className='dividing-line'></div>
            <div className='via__content'>
                <span className='via__content-pre'>via</span>
                <SourceSelect
                    source={source}
                    sourceList={translateSource}
                    onChange={sourceChange}
                    className='via__content-select'
                    disabled={disableSourceChange}
                />
            </div>
        </div>
    );
};

export default TsVia;