import React from 'react';
import Switch from '../../../../components/Switch';
import { getMessage } from '../../../../public/i18n';
import { useOptions } from '../../../../public/react-use';
import { GetStorageKeys } from '../../../../types';
import HostList from '../../components/HostList';
import scOptions from '../../../../public/sc-options';

const useOptionsDependency: GetStorageKeys<
    'historyBlackListMode' |
    'historyHostList' |
    'rememberHistoryPanelStatus'
> = [
    'historyBlackListMode',
    'historyHostList',
    'rememberHistoryPanelStatus'
];

const History: React.FC = () => {
    const {
        historyBlackListMode,
        historyHostList,
        rememberHistoryPanelStatus
    } = useOptions(useOptionsDependency);

    return (
        <div className='opt-section'>
            <div className='opt-section-row'>
                <Switch
                    label={getMessage('optionsRememberHistoryPanelStatus')}
                    checked={rememberHistoryPanelStatus}
                    onChange={v => scOptions.set({ rememberHistoryPanelStatus: v })}
                />
            </div>
            <div className='opt-section-row'>
                <div className='options-mode'>
                    {getMessage('optionsDomainfilter')}
                    <Switch
                        label={getMessage('optionsHistoryBlackListMode')}
                        checked={historyBlackListMode}
                        onChange={v => scOptions.set({ historyBlackListMode: v })}
                    />
                </div>
                <div className='mt10-ml30'>
                    <HostList
                        list={historyHostList}
                        updateList={list => scOptions.set({ historyHostList: list })}
                    />
                </div>
            </div>
        </div>
    );
};

export default History;