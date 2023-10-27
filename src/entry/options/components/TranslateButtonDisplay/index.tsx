import React, { useMemo } from 'react';
import Checkbox from '../../../../components/Checkbox';
import IconFont from '../../../../components/IconFont';
import PanelIconButtonWrapper from '../../../../components/PanelIconButtons/PanelIconButtonWrapper';
import { googleLangCode } from '../../../../constants/langCode';
import {
    translateButtonContext,
    TRANSLATE_BUTTON_COPY,
    TRANSLATE_BUTTON_LISTEN,
    TRANSLATE_BUTTON_TL_FIRST,
    TRANSLATE_BUTTON_TL_SECOND,
    TRANSLATE_BUTTON_TL_THIRD,
    TRANSLATE_BUTTON_TRANSLATE
} from '../../../../constants/translateButtonTypes';
import { getMessage } from '../../../../public/i18n';
import { TranslateButtonsTL } from '../../../../types';
import DefaultSelect from '../DefaultSelect';
import './style.css';

const presetButtons = [TRANSLATE_BUTTON_TRANSLATE, TRANSLATE_BUTTON_LISTEN, TRANSLATE_BUTTON_COPY];

const tlButtons = [TRANSLATE_BUTTON_TL_FIRST, TRANSLATE_BUTTON_TL_SECOND, TRANSLATE_BUTTON_TL_THIRD] as const;
const tlButtonsMap = {
    TRANSLATE_BUTTON_TL_FIRST: 'first',
    TRANSLATE_BUTTON_TL_SECOND: 'second',
    TRANSLATE_BUTTON_TL_THIRD: 'third'
} as const;

const i18n: { [key: string]: string } = {
    TRANSLATE_BUTTON_TRANSLATE: getMessage('optionsButtonTranslate'),
    TRANSLATE_BUTTON_LISTEN: getMessage('optionsButtonListen'),
    TRANSLATE_BUTTON_COPY: getMessage('optionsButtonCopy')
};

type TranslateButtonDisplayProps = {
    translateButtons: string[];
    translateButtonsTL: TranslateButtonsTL;
    userLanguage: string;
    onTranslateButtonsUpdate: (translateButtons: string[]) => void;
    onTranslateButtonsTLUpdate: (translateButtonsTL: TranslateButtonsTL) => void
};

const TranslateButtonDisplay: React.FC<TranslateButtonDisplayProps> = ({
    translateButtons,
    onTranslateButtonsUpdate,
    translateButtonsTL,
    userLanguage,
    onTranslateButtonsTLUpdate
}) => {
    const presetCheckList = useMemo(() => presetButtons.map(v => translateButtons.includes(v)), [translateButtons]);
    const tlCheckList = useMemo(() => tlButtons.map(v => translateButtons.includes(v)), [translateButtons]);

    return (
        <div className='translate-button-display'>
            {presetButtons.map((button, index) => (<div className='translate-button-display__item' key={button}>
                <Checkbox
                    label={<span className='flex-align-items-center'>
                        <IconFont iconName={translateButtonContext[button].iconName} style={{marginRight: '5px'}} />
                        {i18n[button]}
                    </span>}
                    checked={presetCheckList[index]}
                    onChange={() => {
                        presetCheckList[index] ? onTranslateButtonsUpdate(translateButtons.filter(v => v !== button)) : onTranslateButtonsUpdate(translateButtons.concat(button))
                    }}
                />
            </div>))}
            {tlButtons.map((button, index) => (<div className='translate-button-display__item' key={button} style={{display: 'flex'}}>
                <Checkbox
                    label={<span className='flex-align-items-center'>
                        <IconFont iconName={translateButtonContext[button].iconName} style={{marginRight: '5px'}} />
                        {getMessage('optionsTranslateToTargetLanguage')}
                    </span>}
                    checked={tlCheckList[index]}
                    onChange={() => {
                        tlCheckList[index] ? onTranslateButtonsUpdate(translateButtons.filter(v => v !== button)) : onTranslateButtonsUpdate(translateButtons.concat(button))
                    }}
                />
                <DefaultSelect
                    value={translateButtonsTL[tlButtonsMap[button]]}
                    options={googleLangCode[userLanguage]}
                    optionLabel='name'
                    optionValue='code'
                    onChange={value => onTranslateButtonsTLUpdate({ ...translateButtonsTL, [tlButtonsMap[button]]: value })}
                />
            </div>))}
            <div className='translate-button-display__preview'>
                <span>{getMessage('optionsPreview')}</span>
                {translateButtons.length > 0 ? <div className='translate-button' style={{position: 'relative', display: 'flex', zIndex: 1}}>
                    {translateButtons.map((button) => (translateButtonContext[button].type === 'icon' && <PanelIconButtonWrapper
                        key={button}
                    >
                        <IconFont iconName={translateButtonContext[button].iconName} />
                    </PanelIconButtonWrapper>))}
                </div> : '--'}
            </div>
        </div>
    );
};

export default TranslateButtonDisplay;