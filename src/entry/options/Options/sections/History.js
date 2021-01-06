import React from 'react';
import { getI18nMessage } from '../../../../public/chrome-call';
import HostList from '../../HostList';
import OptionToggle from '../../OptionToggle';

const History = ({ updateStorage, historyBlackListMode, historyHostList }) => {
    return (
        <>
            <h3>{getI18nMessage('optionsHistory')}</h3>
            <div className='opt-item'>
                {getI18nMessage('optionsDomainfilter')}
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
        </>
    );
};

export default History;