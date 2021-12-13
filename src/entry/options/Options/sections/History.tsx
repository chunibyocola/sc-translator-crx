import React from 'react';
import { GenericOptionsProps } from '..';
import Switch from '../../../../components/Switch';
import { getMessage } from '../../../../public/i18n';
import { DefaultOptions } from '../../../../types';
import HostList from '../../HostList';

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
                <Switch
                    label={getMessage('optionsRememberHistoryPanelStatus')}
                    checked={rememberHistoryPanelStatus}
                    onChange={v => updateStorage('rememberHistoryPanelStatus', v)}
                />
            </div>
            <div className='opt-section-row'>
                <div className='options-mode'>
                    {getMessage('optionsDomainfilter')}
                    <Switch
                        label={getMessage('optionsHistoryBlackListMode')}
                        checked={historyBlackListMode}
                        onChange={v => updateStorage('historyBlackListMode', v)}
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