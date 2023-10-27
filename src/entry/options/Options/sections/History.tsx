import React from 'react';
import Switch from '../../../../components/Switch';
import { setLocalStorage } from '../../../../public/chrome-call';
import { getMessage } from '../../../../public/i18n';
import { useOptions } from '../../../../public/react-use';
import { DefaultOptions } from '../../../../types';
import HostList from '../../components/HostList';

type PickedOptions = Pick<
    DefaultOptions,
    'historyBlackListMode' |
    'historyHostList' |
    'rememberHistoryPanelStatus'
>;
const useOptionsDependency: (keyof PickedOptions)[] = [
    'historyBlackListMode',
    'historyHostList',
    'rememberHistoryPanelStatus'
];

const History: React.FC = () => {
    const {
        historyBlackListMode,
        historyHostList,
        rememberHistoryPanelStatus
    } = useOptions<PickedOptions>(useOptionsDependency);

    return (
        <div className='opt-section'>
            <div className='opt-section-row'>
                <Switch
                    label={getMessage('optionsRememberHistoryPanelStatus')}
                    checked={rememberHistoryPanelStatus}
                    onChange={v => setLocalStorage({ rememberHistoryPanelStatus: v })}
                />
            </div>
            <div className='opt-section-row'>
                <div className='options-mode'>
                    {getMessage('optionsDomainfilter')}
                    <Switch
                        label={getMessage('optionsHistoryBlackListMode')}
                        checked={historyBlackListMode}
                        onChange={v => setLocalStorage({ historyBlackListMode: v })}
                    />
                </div>
                <div className='mt10-ml30'>
                    <HostList
                        list={historyHostList}
                        updateList={list => setLocalStorage({ historyHostList: list })}
                    />
                </div>
            </div>
        </div>
    );
};

export default History;