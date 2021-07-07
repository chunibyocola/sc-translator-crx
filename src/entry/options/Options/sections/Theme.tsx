import React from 'react';
import { GenericOptionsProps } from '..';
import { DefaultOptions } from '../../../../types';
import CustomizeTheme from '../../CustomizeTheme';

type ThemeProps = GenericOptionsProps<Pick<
    DefaultOptions,
    'styleVarsList' |
    'styleVarsIndex'
>>;

const Theme: React.FC<ThemeProps> = ({ updateStorage, styleVarsList, styleVarsIndex }) => {
    return (
        <div className='opt-section'>
            <div className='opt-section-row'>
                <CustomizeTheme
                    styleVarsList={styleVarsList}
                    styleVarsIndex={styleVarsIndex}
                    updateStyleVarsList={list => updateStorage('styleVarsList', list)}
                    updateStyleVarsIndex={index => updateStorage('styleVarsIndex', index)}
                />
            </div>
        </div>
    );
};

export default Theme;