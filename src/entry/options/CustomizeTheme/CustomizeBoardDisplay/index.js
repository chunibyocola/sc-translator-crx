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
import SourceFavicon from '../../../../components/SourceFavicon';
import IconFont from '../../../../components/IconFont';

const CustomizeBoardDisplay = ({ styleVars }) => {
    return (
        <div className='customize-board-display'>
            {/* TsResult */}
            <div
                class="ts-rb"
                style={{
                    background: styleVars['--bg-total'],
                    position: 'unset',
                    height: 'fit-content'
                }}
                ref={node => node && node.style.setProperty('color', styleVars['--text-normal'], 'important')}
            >
                <div
                    class="ts-rb-header flex-justify-content-space-between"
                    style={{
                        color: styleVars['--text-icon']
                    }}
                >
                    <div class="ts-rb-header-title flex-align-items-center">Sc</div>
                    <span class="ts-rb-header-icons flex-align-items-center">
                        <IconFont iconName='#icon-GoChevronDown' style={{transform: 'rotate(180deg)', opacity: '1', color: styleVars['--text-icon']}} />
                        <IconFont iconName='#icon-GoPin' style={{color: styleVars['--text-icon']}} />
                    </span>
                </div>
                <div class="ts-rb-content">
                    <div style={{color: styleVars['--text-normal']}}>
                        <div class="ts-raw-text">
                            <textarea placeholder="Input here" class="ts-rt-text">welcome</textarea>
                        </div>
                        <div class="ts-language-selection">
                            <div class="ts-select-box">
                                <select class="ts-lselect" disabled style={{color: styleVars['--text-normal'], opacity: '1'}}>
                                    <option value="">自动选择</option>
                                </select>
                            </div>
                            <span class="ts-lselect-swrap">
                                <IconFont iconName='#icon-MdSwap' />
                            </span>
                            <div class="ts-select-box">
                                <select class="ts-lselect" disabled style={{color: styleVars['--text-normal'], opacity: '1', background: styleVars['--bg-select-focus']}}>
                                    <option value="">自动选择</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div class="ts-result ts-scrollbar" style={{background: styleVars['--bg-content']}}>
                        <div class="tss-result">
                            <span>欢迎</span>
                            <IconFont iconName='#icon-GoUnmute' className='ts-iconbutton ts-button' />
                        </div>
                        <div>名词: 欢迎, 欢迎光临</div>
                        <div>动词: 欢迎, 迎, 迎接, 赞同, 赞成, 赞许, 揖, 迓, 赞, 接</div>
                        <div>形容词: 受欢迎, 爽快, 顗</div>
                        <div class="tss-origin-text">
                            <span class="tss-origin-raw">welcome</span>
                            <IconFont iconName='#icon-GoUnmute' className='ts-iconbutton ts-button' />
                        </div>
                        <div class="tss-phonetic">[ˈwelkəm]</div>
                    </div>
                    <div class="ts-via" style={{background: styleVars['--bg-content']}}>
                        <div className='ts-dividing-line ts-st-dividing-line' style={{background: styleVars['--text-normal']}}></div>
                        <div class="ts-via-content">
                            via
                            <div class="ts-source-select ts-via-select" style={{color: styleVars['--text-normal']}}>
                                <span class="ts-source-select-value">
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
                class="container"
                style={{margin: '0 25px', transition: 'unset', background: styleVars['--bg-total']}}
                ref={node => node && node.style.setProperty('color', styleVars['--text-normal'], 'important')}
            >
                <div
                    class="title flex-justify-content-space-between"
                    style={{
                        color: styleVars['--text-icon']
                    }}
                >
                    <div class="title-logo flex-align-items-center">Sc</div>
                    <div class="title-icons flex-align-items-center">
                        <IconFont iconName='#icon-theme' className='title-icons-enable' style={{color: styleVars['--text-icon']}} />
                        <IconFont iconName='#icon-MdTranslate' className='title-icons-enable' style={{color: styleVars['--text-icon']}} />
                        <IconFont iconName='#icon-MdHistory' className='title-icons-disable' style={{color: styleVars['--text-icon']}} />
                        <IconFont iconName='#icon-MdSettings' className='title-icons-enable' style={{color: styleVars['--text-icon']}} />
                    </div>
                </div>
                <div class="content" style={{color: styleVars['--text-normal']}}>
                    <div class="ts-raw-text">
                        <textarea placeholder="Input here" class="ts-rt-text">welcome</textarea>
                    </div>
                    <div class="ts-language-selection">
                        <div class="ts-select-box">
                            <select class="ts-lselect" disabled style={{color: styleVars['--text-normal'], opacity: '1', background: styleVars['--bg-select-focus']}}>
                                <option value="">自动选择</option>
                            </select>
                        </div>
                        <span class="ts-lselect-swrap">
                            <IconFont iconName='#icon-MdSwap' />
                        </span>
                        <div class="ts-select-box">
                            <select class="ts-lselect" disabled style={{color: styleVars['--text-normal'], opacity: '1'}}>
                                <option value="ja">日语</option>
                            </select>
                        </div>
                    </div>
                    <div class="ts-mt-results ts-scrollbar">
                        <div class="ts-mt-result" style={{background: styleVars['--bg-content']}}>
                            <div class="ts-mt-result-head ts-button flex-justify-content-space-between" style={{color: styleVars['--text-normal']}}>
                                <span class="flex-align-items-center">
                                    <SourceFavicon source='google.com' />
                                    <IconFont iconName='#icon-GoUnmute' style={{marginLeft: '5px'}} className='ts-iconbutton' />
                                </span>
                                <span class="ts-mt-result-head-icons flex-align-items-center">
                                    <IconFont iconName='#icon-GoChevronDown' style={{transform: 'rotate(180deg)'}} />
                                    <IconFont iconName='#icon-GoX' className='ts-iconbutton' />
                                </span>
                            </div>
                            <div className='ts-dividing-line' style={{background: styleVars['--text-normal']}}></div>
                            <div class="ts-mt-result-result">
                                <div style={{marginBottom: '10px'}}>[ˈwelkəm]</div>
                                <div>
                                    <span style={{marginRight: '5px'}}>ようこそ</span>
                                    <IconFont iconName='#icon-GoUnmute' className='ts-iconbutton ts-button' />
                                </div>
                                <div style={{marginTop: '10px'}}>名词: 歓迎, ウエルカム, 優待, 奉迎, 遠見, 接待</div>
                                <div>动词: 歓迎する</div>
                            </div>
                        </div>
                        <div class="ts-mt-result" style={{background: styleVars['--bg-content']}}>
                            <div class="ts-mt-result-head ts-button flex-justify-content-space-between" style={{color: styleVars['--text-normal']}}>
                                <span class="flex-align-items-center">
                                    <SourceFavicon source='bing.com' />
                                    <IconFont iconName='#icon-GoUnmute' style={{marginLeft: '5px'}} className='ts-iconbutton' />
                                </span>
                                <span class="ts-mt-result-head-icons flex-align-items-center">
                                    <IconFont iconName='#icon-GoChevronDown' style={{transform: 'rotate(180deg)'}} />
                                    <IconFont iconName='#icon-GoX' className='ts-iconbutton' />
                                </span>
                            </div>
                            <div className='ts-dividing-line' style={{background: styleVars['--text-normal']}}></div>
                            <div class="ts-mt-result-result">
                                <div>
                                    <span style={{marginRight: '5px'}}>ようこそ</span>
                                    <IconFont iconName='#icon-GoUnmute' className='ts-iconbutton ts-button' />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="ts-mt-add-source">
                        <IconFont iconName='#icon-plus' style={{color: styleVars['--text-icon']}} />
                    </div>
                </div>
            </div>
            {/* SourceSelector */}
            <div class="ts-mt-source-selector"
                style={{
                    background: styleVars['--bg-content'],
                    color: styleVars['--text-normal'],
                    maxHeight: '100%',
                    height: 'fit-content',
                    position: 'unset'
                }}
            >
                <div class="ts-mt-source-selector-item ts-button">
                    <span class="ts-mt-source-selector-item-source"><SourceFavicon source='google.com' /></span>
                    <span class="ts-mt-source-selector-item-icons"><IconFont iconName='#icon-top' /></span>
                </div>
                <div class="ts-mt-source-selector-item ts-button" style={{background: styleVars['--bg-item-hover']}}>
                    <span class="ts-mt-source-selector-item-source"><SourceFavicon source='bing.com' /></span>
                    <span class="ts-mt-source-selector-item-icons"><IconFont iconName='#icon-top' /></span>
                </div>
                <div class="ts-mt-source-selector-item ts-button">
                    <span class="ts-mt-source-selector-item-source"><SourceFavicon source='baidu.com' /></span>
                    <span class="ts-mt-source-selector-item-icons"><IconFont iconName='#icon-top' /></span>
                </div>
                <div class="ts-mt-source-selector-item ts-button">
                    <span class="ts-mt-source-selector-item-source"><SourceFavicon source='mojidict.com' /></span>
                    <span class="ts-mt-source-selector-item-icons"><IconFont iconName='#icon-top' /></span>
                </div>
            </div>
        </div>
    );
};

export default CustomizeBoardDisplay;