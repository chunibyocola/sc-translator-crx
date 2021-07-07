import React from 'react';
import './style.css';
import '../../../content/ResultBox/style.css';
import '../../../../components/TsResult/style.css';
import '../../../../components/TsVia/style.css';
import '../../../../components/LanguageSelection/style.css';
import '../../../../components/RawText/style.css';
import '../../../../components/PopupHeader/style.css';
import '../../../popup/ResultBox/style.css';
import '../../../popup/MultipleTranslateResult/style.css';
import '../../../../components/MtAddSource/style.css';
import '../../../../components/MtAddSource/SourceSelector/style.css';
import '../../../../components/MtResult/style.css';
import '../../../../components/LanguageSelect/style.css';
import SourceFavicon from '../../../../components/SourceFavicon';
import IconFont from '../../../../components/IconFont';
import { StyleVars } from '../../../../constants/defaultStyleVars';

type CustomizeBoardDisplayProps = {
    styleVars: StyleVars;
};

const CustomizeBoardDisplay: React.FC<CustomizeBoardDisplayProps> = ({ styleVars }) => {
    return (
        <div className='customize-board-display'>
            {/* TsResult */}
            <div
                className="ts-rb"
                style={{
                    background: styleVars['--bg-total'],
                    position: 'unset',
                    height: 'fit-content'
                }}
                ref={node => node && node.style.setProperty('color', styleVars['--text-normal'], 'important')}
            >
                <div
                    className="ts-rb-header flex-justify-content-space-between"
                    style={{
                        color: styleVars['--text-icon']
                    }}
                >
                    <div className="ts-rb-header-title flex-align-items-center">Sc</div>
                    <span className="ts-rb-header-icons flex-align-items-center">
                        <IconFont iconName='#icon-GoChevronDown' style={{transform: 'rotate(180deg)', opacity: '1', color: styleVars['--text-icon']}} />
                        <IconFont iconName='#icon-GoPin' style={{color: styleVars['--text-icon']}} />
                    </span>
                </div>
                <div className="ts-rb-content">
                    <div style={{color: styleVars['--text-normal']}}>
                        <div className="ts-raw-text">
                            <textarea placeholder="Input here" className="ts-rt-text">welcome</textarea>
                        </div>
                        <div className="ts-language-selection">
                            <div className="ts-language-select ts-language-selection-select" style={{color: styleVars['--text-normal']}}>
                                <span className="badge">
                                    <span className="badge-text">自动选择</span>
                                    <IconFont iconName='#icon-GoChevronDown' />
                                </span>
                            </div>
                            <IconFont iconName='#icon-MdSwap' />
                            <div className="ts-language-select ts-language-selection-select" style={{color: styleVars['--text-normal'], background: styleVars['--bg-select-focus']}}>
                                <span className="badge">
                                    <span className="badge-text">自动选择</span>
                                    <IconFont iconName='#icon-GoChevronDown' />
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="ts-result ts-scrollbar" style={{background: styleVars['--bg-content']}}>
                        <div className="tss-result">
                            <span>欢迎</span>
                            <IconFont iconName='#icon-GoUnmute' className='ts-iconbutton ts-button' />
                        </div>
                        <div>名词: 欢迎, 欢迎光临</div>
                        <div>动词: 欢迎, 迎, 迎接, 赞同, 赞成, 赞许, 揖, 迓, 赞, 接</div>
                        <div>形容词: 受欢迎, 爽快, 顗</div>
                        <div className="tss-origin-text">
                            <span className="tss-origin-raw">welcome</span>
                            <IconFont iconName='#icon-GoUnmute' className='ts-iconbutton ts-button' />
                        </div>
                        <div className="tss-phonetic">[ˈwelkəm]</div>
                    </div>
                    <div className="ts-via" style={{background: styleVars['--bg-content']}}>
                        <div className='ts-dividing-line ts-st-dividing-line' style={{background: styleVars['--text-normal']}}></div>
                        <div className="ts-via-content">
                            via
                            <div className="ts-source-select ts-via-select" style={{color: styleVars['--text-normal']}}>
                                <span className="ts-source-select-value">
                                    <SourceFavicon source='google.com' />
                                </span>
                                <IconFont iconName='#icon-GoChevronDown' style={{position: 'absolute', right: '2px'}} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* MultiplePopup */}
            <div 
                className="container"
                style={{margin: '0 25px', transition: 'unset', background: styleVars['--bg-total']}}
                ref={node => node && node.style.setProperty('color', styleVars['--text-normal'], 'important')}
            >
                <div
                    className="title flex-justify-content-space-between"
                    style={{
                        color: styleVars['--text-icon']
                    }}
                >
                    <div className="title-logo flex-align-items-center">Sc</div>
                    <div className="title-icons flex-align-items-center">
                        <IconFont iconName='#icon-theme' className='title-icons-enable' style={{color: styleVars['--text-icon']}} />
                        <IconFont iconName='#icon-MdTranslate' className='title-icons-enable' style={{color: styleVars['--text-icon']}} />
                        <IconFont iconName='#icon-MdHistory' className='title-icons-disable' style={{color: styleVars['--text-icon']}} />
                        <IconFont iconName='#icon-MdSettings' className='title-icons-enable' style={{color: styleVars['--text-icon']}} />
                    </div>
                </div>
                <div className="content" style={{color: styleVars['--text-normal']}}>
                    <div className="ts-raw-text">
                        <textarea placeholder="Input here" className="ts-rt-text">welcome</textarea>
                    </div>
                    <div className="ts-language-selection">
                        <div className="ts-language-select ts-language-selection-select" style={{color: styleVars['--text-normal'], background: styleVars['--bg-select-focus']}}>
                            <span className="badge">
                                <span className="badge-text">自动选择</span>
                                <IconFont iconName='#icon-GoChevronDown' />
                            </span>
                        </div>
                        <IconFont iconName='#icon-MdSwap' />
                        <div className="ts-language-select ts-language-selection-select" style={{color: styleVars['--text-normal']}}>
                            <span className="badge">
                                <span className="badge-text">日语</span>
                                <IconFont iconName='#icon-GoChevronDown' />
                            </span>
                        </div>
                    </div>
                    <div className="ts-mt-results ts-scrollbar">
                        <div className="ts-mt-result" style={{background: styleVars['--bg-content']}}>
                            <div className="ts-mt-result-head ts-button flex-justify-content-space-between" style={{color: styleVars['--text-normal']}}>
                                <span className="flex-align-items-center">
                                    <SourceFavicon source='google.com' />
                                    <IconFont iconName='#icon-GoUnmute' style={{marginLeft: '5px'}} className='ts-iconbutton' />
                                </span>
                                <span className="ts-mt-result-head-icons flex-align-items-center">
                                    <IconFont iconName='#icon-GoChevronDown' style={{transform: 'rotate(180deg)'}} />
                                    <IconFont iconName='#icon-GoX' className='ts-iconbutton' />
                                </span>
                            </div>
                            <div className='ts-dividing-line' style={{background: styleVars['--text-normal']}}></div>
                            <div className="ts-mt-result-result">
                                <div style={{marginBottom: '10px'}}>[ˈwelkəm]</div>
                                <div>
                                    <span style={{marginRight: '5px'}}>ようこそ</span>
                                    <IconFont iconName='#icon-GoUnmute' className='ts-iconbutton ts-button' />
                                </div>
                                <div style={{marginTop: '10px'}}>名词: 歓迎, ウエルカム, 優待, 奉迎, 遠見, 接待</div>
                                <div>动词: 歓迎する</div>
                            </div>
                        </div>
                        <div className="ts-mt-result" style={{background: styleVars['--bg-content']}}>
                            <div className="ts-mt-result-head ts-button flex-justify-content-space-between" style={{color: styleVars['--text-normal']}}>
                                <span className="flex-align-items-center">
                                    <SourceFavicon source='bing.com' />
                                    <IconFont iconName='#icon-GoUnmute' style={{marginLeft: '5px'}} className='ts-iconbutton' />
                                </span>
                                <span className="ts-mt-result-head-icons flex-align-items-center">
                                    <IconFont iconName='#icon-GoChevronDown' style={{transform: 'rotate(180deg)'}} />
                                    <IconFont iconName='#icon-GoX' className='ts-iconbutton' />
                                </span>
                            </div>
                            <div className='ts-dividing-line' style={{background: styleVars['--text-normal']}}></div>
                            <div className="ts-mt-result-result">
                                <div>
                                    <span style={{marginRight: '5px'}}>ようこそ</span>
                                    <IconFont iconName='#icon-GoUnmute' className='ts-iconbutton ts-button' />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="ts-mt-add-source">
                        <IconFont iconName='#icon-plus' style={{color: styleVars['--text-icon']}} />
                    </div>
                </div>
            </div>
            {/* SourceSelector */}
            <div className="ts-mt-source-selector"
                style={{
                    background: styleVars['--bg-content'],
                    color: styleVars['--text-normal'],
                    maxHeight: '100%',
                    height: 'fit-content',
                    position: 'unset'
                }}
            >
                <div className="ts-mt-source-selector-item ts-button">
                    <span className="ts-mt-source-selector-item-source"><SourceFavicon source='google.com' /></span>
                    <span className="ts-mt-source-selector-item-icons"><IconFont iconName='#icon-top' /></span>
                </div>
                <div className="ts-mt-source-selector-item ts-button" style={{background: styleVars['--bg-item-hover']}}>
                    <span className="ts-mt-source-selector-item-source"><SourceFavicon source='bing.com' /></span>
                    <span className="ts-mt-source-selector-item-icons"><IconFont iconName='#icon-top' /></span>
                </div>
                <div className="ts-mt-source-selector-item ts-button">
                    <span className="ts-mt-source-selector-item-source"><SourceFavicon source='baidu.com' /></span>
                    <span className="ts-mt-source-selector-item-icons"><IconFont iconName='#icon-top' /></span>
                </div>
                <div className="ts-mt-source-selector-item ts-button">
                    <span className="ts-mt-source-selector-item-source"><SourceFavicon source='mojidict.com' /></span>
                    <span className="ts-mt-source-selector-item-icons"><IconFont iconName='#icon-top' /></span>
                </div>
            </div>
        </div>
    );
};

export default CustomizeBoardDisplay;