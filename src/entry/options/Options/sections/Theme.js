import React from 'react';
import { getMessage } from '../../../../public/i18n';
import CustomizeTheme from '../../CustomizeTheme';

const Theme = ({ updateStorage, styleVarsList, styleVarsIndex }) => {
    return (
        <>
            <h3>{getMessage('optionsTheme')}</h3>
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