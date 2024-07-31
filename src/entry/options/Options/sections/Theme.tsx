import React from 'react';
import { getMessage } from '../../../../public/i18n';
import { useOptions } from '../../../../public/react-use';
import { GetStorageKeys } from '../../../../types';
import CustomizeStyleTextarea from '../../components/CustomizeStyleTextarea';
import CustomizeTheme from '../../components/CustomizeTheme';
import scOptions from '../../../../public/sc-options';

const useOptionsDependency: GetStorageKeys<
    'styleVarsList' |
    'styleVarsIndex' |
    'customizeStyleText'
> = [
    'styleVarsList',
    'styleVarsIndex',
    'customizeStyleText'
];

const Theme: React.FC = () => {
    const {
        styleVarsList,
        styleVarsIndex,
        customizeStyleText
    } = useOptions(useOptionsDependency);

    return (
        <div className='opt-section'>
            <div className='opt-section-row'>
                <CustomizeTheme
                    styleVarsList={styleVarsList}
                    styleVarsIndex={styleVarsIndex}
                    updateStyleVarsList={list => scOptions.set({ styleVarsList: list })}
                    updateStyleVarsIndex={index => scOptions.set({ styleVarsIndex: index })}
                />
            </div>
            <div className='opt-section-row'>
                {getMessage('optionsCustomizeStyle')}
                <div className='mt10-ml30'>
                    <CustomizeStyleTextarea
                        customizeStyleText={customizeStyleText}
                        onSave={text => scOptions.set({ customizeStyleText: text })}
                    />
                    <div className='item-description'>{getMessage('optionsCustomizeStyleDescription')}</div>
                    <div className='item-description'>{getMessage('optionsCustomizeStyleNotice')}</div>
                </div>
            </div>
        </div>
    );
};

export default Theme;