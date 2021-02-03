import React from 'react';
import { getMessage } from '../../../../public/i18n';
import HostList from '../../HostList';
import OptionToggle from '../../OptionToggle';

const History = ({ updateStorage, historyBlackListMode, historyHostList }) => {
    return (
        <div className='opt-item'>
            {getMessage('optionsDomainfilter')}
            <div className='child-mt10-ml30'>
                <OptionToggle
                    id='history-black-list-mode-checkbox'
                    message='optionsHistoryBlackListMode'
                    checked={historyBlackListMode}
                    onClick={() => updateStorage('historyBlackListMode', !historyBlackListMode)}
                />
                <HostList
                    list={historyHostList}
                    updateList={list => updateStorage('historyHostList', list)}
                />
            </div>
        </div>
    );
};

export default History;