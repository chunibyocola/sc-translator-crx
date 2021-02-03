import React from 'react';
import CustomizeTheme from '../../CustomizeTheme';

const Theme = ({ updateStorage, styleVarsList, styleVarsIndex }) => {
    return (
        <div className='opt-item'>
            <CustomizeTheme
                styleVarsList={styleVarsList}
                styleVarsIndex={styleVarsIndex}
                updateStyleVarsList={list => updateStorage('styleVarsList', list)}
                updateStyleVarsIndex={index => updateStorage('styleVarsIndex', index)}
            />
        </div>
    );
};

export default Theme;