import React, { useMemo } from 'react';
import LanguageSelect from '../../../components/LanguageSelect';
import './style.css';

type DefaultSelectProps = {
    onChange: (value: string) => void;
    value: string;
    options: { [key: string]: string }[];
    optionValue: string;
    optionLabel: string;
};

const DefaultSelect: React.FC<DefaultSelectProps> = ({ onChange, value, options, optionValue, optionLabel }) => {
    const langCodes = useMemo(() => options.map((v) => ({ code: v[optionValue], name: v[optionLabel] })), [options, optionValue, optionLabel]);
    const langLocal = useMemo(() => options.reduce((total, current) => ({ ...total, [current[optionValue]]: current[optionLabel] }), {}), [options, optionValue, optionLabel]);

    return (
        <LanguageSelect
            className='default-select__select border-bottom-select'
            value={value}
            onChange={onChange}
            langCodes={langCodes}
            langLocal={langLocal}
            recentLangs={[]}
        />
    )
};

export default DefaultSelect;