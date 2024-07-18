import React from 'react';
import Checkbox from '../../../../components/Checkbox';
import { setLocalStorage } from '../../../../public/chrome-call';
import { getMessage } from '../../../../public/i18n';
import { useOptions } from '../../../../public/react-use';
import { GetStorageKeys } from '../../../../types';
import RegExpList from '../../components/RegExpList';
import TestTextProcessing from '../../components/TestTextPreprocessing';

const useOptionsDependency: GetStorageKeys<
    'textPreprocessingRegExpList' |
    'textPreprocessingPreset' |
    'afterSelectingTextRegExpList'
> = [
    'textPreprocessingRegExpList',
    'textPreprocessingPreset',
    'afterSelectingTextRegExpList'
];

const TextPreprocessing: React.FC = () => {
    const {
        textPreprocessingPreset,
        textPreprocessingRegExpList,
        afterSelectingTextRegExpList
    } = useOptions(useOptionsDependency);

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
                            onSave={value => setLocalStorage({ textPreprocessingRegExpList: value })}
                        />
                    </div>
                </div>
                <div className='mt10-ml30'>
                    {getMessage('themePreset')}
                    <div className='mt10-ml30'>
                        <Checkbox
                            label={getMessage('optionsConvertCamelCase')}
                            checked={textPreprocessingPreset.convertCamelCase}
                            onChange={v => setLocalStorage({ textPreprocessingPreset: { ...textPreprocessingPreset, convertCamelCase: v } })}
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
                            onSave={value => setLocalStorage({ afterSelectingTextRegExpList: value })}
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