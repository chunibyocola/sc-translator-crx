import React from 'react';
import { getI18nMessage } from '../../../../public/chrome-call';
import CustomizeTheme from '../../CustomizeTheme';

const Theme = ({ updateStorage, styleVarsList, styleVarsIndex }) => {
    return (
        <>
            <h3>{getI18nMessage('optionsTheme')}</h3>
            <div className='opt-item'>
                <CustomizeTheme
                    styleVarsList={styleVarsList}
                    styleVarsIndex={styleVarsIndex}
                    updateStyleVarsList={list => updateStorage('styleVarsList', list)}
                    updateStyleVarsIndex={index => updateStorage('styleVarsIndex', index)}
                />
            </div>
        </>
    );
};

export default Theme;