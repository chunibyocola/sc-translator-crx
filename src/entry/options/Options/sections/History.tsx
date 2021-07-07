import React from 'react';
import { GenericOptionsProps } from '..';
import { getMessage } from '../../../../public/i18n';
import { DefaultOptions } from '../../../../types';
import HostList from '../../HostList';
import OptionToggle from '../../OptionToggle';

type HistoryProps = GenericOptionsProps<Pick<
    DefaultOptions,
    'historyBlackListMode' |
    'historyHostList' |
    'rememberHistoryPanelStatus'
>>;

const History: React.FC<HistoryProps> = ({ updateStorage, historyBlackListMode, historyHostList, rememberHistoryPanelStatus }) => {
    return (
        <div className='opt-section'>
            <div className='opt-section-row'>
                <OptionToggle
                    id='history-status'
                    message='optionsRememberHistoryPanelStatus'
                    checked={rememberHistoryPanelStatus}
                    onClick={() => updateStorage('rememberHistoryPanelStatus', !rememberHistoryPanelStatus)}
                />
            </div>
            <div className='opt-section-row'>
                <div className='options-mode'>
                    {getMessage('optionsDomainfilter')}
                    <OptionToggle
                        id='history-black-list-mode-checkbox'
                        message='optionsHistoryBlackListMode'
                        checked={historyBlackListMode}
                        onClick={() => updateStorage('historyBlackListMode', !historyBlackListMode)}
                    />
                </div>
                <div className='mt10-ml30'>
                    <HostList
                        list={historyHostList}
                        updateList={list => updateStorage('historyHostList', list)}
                    />
                </div>
            </div>
        </div>
    );
};

export default History;