import React from 'react';
import { GenericOptionsProps } from '..';
import { getMessage } from '../../../../public/i18n';
import { DefaultOptions } from '../../../../types';
import OptionToggle from '../../OptionToggle';
import RegExpList from '../../RegExpList';
import TestTextProcessing from '../../TestTextPreprocessing';

type TextPreprocessingProps = GenericOptionsProps<Pick<
    DefaultOptions,
    'textPreprocessingRegExpList' |
    'textPreprocessingPreset' |
    'afterSelectingTextRegExpList'
>>;

const TextPreprocessing: React.FC<TextPreprocessingProps> = ({
    updateStorage,
    textPreprocessingPreset,
    textPreprocessingRegExpList,
    afterSelectingTextRegExpList
}) => {
    return (
        <div className='opt-section'>
            <div className='opt-section-row'>
                <div className='item-description'>
                    {getMessage('optionsTextPreprocessingDescription')}
                    <a
                        target='_blank'
                        href='https://github.com/chunibyocola/sc-translator-crx/discussions/17'
                        rel='noreferrer'
                    >
                        {getMessage('optionsLearnMoreAboutTextPreprocessing')}
                    </a>
                </div>
            </div>
            <div className='opt-section-row'>
                {getMessage('optionsBeforeSendingTranslateRequest')}
                <div className='item-description'>{getMessage('optionsBeforeSendingTranslateRequestDescription')}</div>
                <div className='mt10-ml30'>
                    {getMessage('optionsReplaceWithRegExp')}
                    <div className='mt10-ml30'>
                        <RegExpList
                            textPreprocessingRegExpList={textPreprocessingRegExpList}
                            onSave={value => updateStorage('textPreprocessingRegExpList', value)}
                        />
                    </div>
                </div>
                <div className='mt10-ml30'>
                    {getMessage('themePreset')}
                    <div className='mt10-ml30'>
                        <OptionToggle
                            id='convert-camel-case'
                            message='optionsConvertCamelCase'
                            checked={textPreprocessingPreset.convertCamelCase}
                            onClick={() => updateStorage('textPreprocessingPreset', { ...textPreprocessingPreset, 'convertCamelCase': !textPreprocessingPreset.convertCamelCase })}
                        />
                        <div className='item-description'>{'"aCamelCaseText" => "a camel case text"'}</div>
                    </div>
                </div>
                <div className='mt10-ml30'>
                    {getMessage('optionsTestSomeText')}
                    <div className='item-description'>{getMessage('optionsTestSomeTextDescription')}</div>
                    <div className='mt10-ml30'>
                        <TestTextProcessing
                            preprocessType='before-sending-request'
                        />
                    </div>
                </div>
            </div>
            <div className='opt-section-row'>
                {getMessage('optionsAfterSelectingText')}
                <div className='item-description'>{getMessage('optionsAfterSelectingTextDescription')}</div>
                <div className='mt10-ml30'>
                    {getMessage('optionsReplaceWithRegExp')}
                    <div className='mt10-ml30'>
                        <RegExpList
                            textPreprocessingRegExpList={afterSelectingTextRegExpList}
                            onSave={value => updateStorage('afterSelectingTextRegExpList', value)}
                        />
                    </div>
                </div>
                <div className='mt10-ml30'>
                    {getMessage('optionsTestSomeText')}
                    <div className='item-description'>{getMessage('optionsTestSomeTextDescription')}</div>
                    <div className='mt10-ml30'>
                        <TestTextProcessing
                            preprocessType='after-selecting-text'
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TextPreprocessing;