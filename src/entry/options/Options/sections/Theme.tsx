import React from 'react';
import { GenericOptionsProps } from '..';
import { getMessage } from '../../../../public/i18n';
import { DefaultOptions } from '../../../../types';
import CustomizeStyleTextarea from '../../CustomizeStyleTextarea';
import CustomizeTheme from '../../CustomizeTheme';

type ThemeProps = GenericOptionsProps<Pick<
    DefaultOptions,
    'styleVarsList' |
    'styleVarsIndex' |
    'customizeStyleText'
>>;

const Theme: React.FC<ThemeProps> = ({ updateStorage, styleVarsList, styleVarsIndex, customizeStyleText }) => {
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
            <div className='opt-section-row'>
                {getMessage('optionsCustomizeStyle')}
                <div className='mt10-ml30'>
                    <CustomizeStyleTextarea
                        customizeStyleText={customizeStyleText}
                        onSave={text => updateStorage('customizeStyleText', text)}
                    />
                    <div className='item-description'>{getMessage('optionsCustomizeStyleDescription')}</div>
                    <div className='item-description'>{getMessage('optionsCustomizeStyleNotice')}</div>
                </div>
            </div>
        </div>
    );
};

export default Theme;