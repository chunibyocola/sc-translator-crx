import React from 'react';
import { setLocalStorage } from '../../../../public/chrome-call';
import { getMessage } from '../../../../public/i18n';
import { useOptions } from '../../../../public/react-use';
import { DefaultOptions } from '../../../../types';
import CustomizeStyleTextarea from '../../CustomizeStyleTextarea';
import CustomizeTheme from '../../CustomizeTheme';

type PickedOptions = Pick<
    DefaultOptions,
    'styleVarsList' |
    'styleVarsIndex' |
    'customizeStyleText'
>;
const useOptionsDependency: (keyof PickedOptions)[] = [
    'styleVarsList',
    'styleVarsIndex',
    'customizeStyleText'
];

const Theme: React.FC = () => {
    const {
        styleVarsList,
        styleVarsIndex,
        customizeStyleText
    } = useOptions<PickedOptions>(useOptionsDependency);

    return (
        <div className='opt-section'>
            <div className='opt-section-row'>
                <CustomizeTheme
                    styleVarsList={styleVarsList}
                    styleVarsIndex={styleVarsIndex}
                    updateStyleVarsList={list => setLocalStorage({ styleVarsList: list })}
                    updateStyleVarsIndex={index => setLocalStorage({ styleVarsIndex: index })}
                />
            </div>
            <div className='opt-section-row'>
                {getMessage('optionsCustomizeStyle')}
                <div className='mt10-ml30'>
                    <CustomizeStyleTextarea
                        customizeStyleText={customizeStyleText}
                        onSave={text => setLocalStorage({ customizeStyleText: text })}
                    />
                    <div className='item-description'>{getMessage('optionsCustomizeStyleDescription')}</div>
                    <div className='item-description'>{getMessage('optionsCustomizeStyleNotice')}</div>
                </div>
            </div>
        </div>
    );
};

export default Theme;