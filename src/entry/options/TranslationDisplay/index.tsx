import React, { useState } from 'react';
import Button from '../../../components/Button';
import Checkbox from '../../../components/Checkbox';
import IconFont from '../../../components/IconFont';
import SourceFavicon from '../../../components/SourceFavicon';
import { GOOGLE_COM } from '../../../constants/translateSource';
import { getMessage } from '../../../public/i18n';
import { DisplayOfTranslation } from '../../../types';
import './style.css';

type TranslationDisplayProps = {
    displayOfTranslation: DisplayOfTranslation;
    onChange: (displayOfTranslation: DisplayOfTranslation) => void; 
};

const TranslationDisplay: React.FC<TranslationDisplayProps> = ({ displayOfTranslation, onChange }) => {
    const [displayPreview, setDisplayPreview] = useState(false);

    return (
        <div className='translation-display'>
            <div className='translation-display__list'>
                <Checkbox
                    label={getMessage('wordResult')}
                    checked={displayOfTranslation.result}
                    disabled
                />
                <Checkbox
                    label={getMessage('wordDictionary')}
                    checked={displayOfTranslation.dict}
                    onChange={v => onChange({ ...displayOfTranslation, 'dict': v })}
                />
                <Checkbox
                    label={getMessage('wordPhonetic')}
                    checked={displayOfTranslation.phonetic}
                    onChange={v => onChange({ ...displayOfTranslation, 'phonetic': v })}
                />
                <Checkbox
                    label={getMessage('wordRelated')}
                    checked={displayOfTranslation.related}
                    onChange={v => onChange({ ...displayOfTranslation, 'related': v })}
                />
                <Checkbox
                    label={getMessage('wordExample')}
                    checked={displayOfTranslation.example}
                    onChange={v => onChange({ ...displayOfTranslation, 'example': v })}
                />
            </div>
            <div className='translation-display__preview'>
                <div className='flex-align-items-center'>
                    <Button
                        variant='text'
                        onClick={() => setDisplayPreview(v => !v)}
                    >
                        {getMessage('optionsPreview')}
                        <IconFont
                            iconName='#icon-GoChevronDown'
                            style={displayPreview ? {transform: 'rotate(180deg)'} : {}}
                        />
                    </Button>
                </div>
                <div style={{display: displayPreview ? 'block' : 'none'}} className='translation-display__preview__content'>
                    <div className='translation-display__preview__item'>
                        <div style={{margin: '5px 0'}}>
                            <SourceFavicon source={GOOGLE_COM} />, better, en &gt; zh-CN
                        </div>
                        <div className='dividing-line'></div>
                    </div>
                    {displayOfTranslation.phonetic && <div className='translation-display__preview__item'>
                        [ˈbedər]
                    </div>}
                    {displayOfTranslation.result && <div className='translation-display__preview__item'>
                        更好的
                        <IconFont style={{marginLeft: '5px'}} className='iconbutton button' iconName='#icon-copy' />
                        <IconFont iconName='#icon-GoUnmute' className='iconbutton button' />
                    </div>}
                    {displayOfTranslation.dict && <div className='translation-display__preview__item'>
                        <div>形容词: 更好, 较好, 强, 优胜, 优越, 愈, 上</div>
                        <div>副词: 更好, 宁愿, 爽性</div>
                        <div>动词: 改进, 改善, 赢, 轶</div>
                    </div>}
                    {displayOfTranslation.related && <div className='translation-display__preview__item'>
                        {getMessage('wordRelated')}: <span className='span-link'>good</span>
                    </div>}
                    {displayOfTranslation.example && <div className='translation-display__preview__item'>
                        <div>
                            <IconFont
                                iconName='#icon-quote'
                                style={{marginRight: '5px'}}
                            />
                            it might be <b>better</b> to borrow the money
                        </div>
                        <div>
                            <IconFont
                                iconName='#icon-quote'
                                style={{marginRight: '5px'}}
                            />
                            there couldn't be a <b>better</b> time to start this job
                        </div>
                        <div>
                            <IconFont
                                iconName='#icon-quote'
                                style={{marginRight: '5px'}}
                            />
                            hoping for <b>better</b> weather
                        </div>
                    </div>}
                </div>
            </div>
        </div>
    );
};

export default TranslationDisplay;