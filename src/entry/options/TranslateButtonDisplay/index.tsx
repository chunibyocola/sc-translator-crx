import React, { useMemo } from 'react';
import IconFont from '../../../components/IconFont';
import { translateButtonContext, TRANSLATE_BUTTON_COPY, TRANSLATE_BUTTON_LISTEN, TRANSLATE_BUTTON_TRANSLATE } from '../../../constants/translateButtonTypes';
import { getMessage } from '../../../public/i18n';
import './style.css';

const buttons = [TRANSLATE_BUTTON_TRANSLATE, TRANSLATE_BUTTON_LISTEN, TRANSLATE_BUTTON_COPY];
const i18n: { [key: string]: string } = {
    TRANSLATE_BUTTON_TRANSLATE: getMessage('optionsButtonTranslate'),
    TRANSLATE_BUTTON_LISTEN: getMessage('optionsButtonListen'),
    TRANSLATE_BUTTON_COPY: getMessage('optionsButtonCopy')
};

type TranslateButtonDisplayProps = {
    translateButtons: string[];
    onUpdate: (translateButtons: string[]) => void;
};

const TranslateButtonDisplay: React.FC<TranslateButtonDisplayProps> = ({ translateButtons, onUpdate }) => {
    const checkList = useMemo(() => buttons.map(v => translateButtons.includes(v)), [translateButtons]);

    return (
        <div className='translate-button-display'>
            {buttons.map((button, index) => (<div className='translate-button-display__item' key={button}>
                <input
                    id={button}
                    type='checkbox'
                    checked={checkList[index]}
                    onClick={() => checkList[index] ? onUpdate(translateButtons.filter(v => v !== button)) : onUpdate(translateButtons.concat(button))}
                />
                <label htmlFor={button} className='flex-align-items-center button'>
                    {translateButtonContext[button].type === 'icon' && <>
                        <IconFont iconName={translateButtonContext[button].iconName} style={{marginRight: '5px'}} />
                        {i18n[button]}
                    </>}
                </label>
            </div>))}
            <div className='translate-button-display__preview'>
                <span>{getMessage('optionsPreview')}</span>
                {translateButtons.length > 0 ? <div className='translate-button' style={{position: 'relative', display: 'flex'}}>
                    {translateButtons.map((button) => (translateButtonContext[button].type === 'icon' && <div
                        className='translate-button__item iconfont--enable'
                    >
                        <IconFont iconName={translateButtonContext[button].iconName} />
                    </div>))}
                </div> : '--'}
            </div>
        </div>
    );
};

export default TranslateButtonDisplay;