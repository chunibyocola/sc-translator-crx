import { useEffect, useState } from 'react';
import { getCurrentTabHost } from '../utils';
import useOptions from './useOptions';

const useIsEnable = (enableType, host = '') => {
    const [enable, setEnable] = useState(false);

    const {
        [`${enableType}HostList`]: list,
        [`${enableType}BlackListMode`]: bMode
    } = useOptions([`${enableType}HostList`, `${enableType}BlackListMode`]);

    useEffect(
        () => {
            if (host) {
                const find = list.some(v => host.endsWith(v));
                setEnable(bMode? !find: find);
            }
            else {
                getCurrentTabHost((tabHost) => {
                    const find = list.some(v => tabHost.endsWith(v));
                    setEnable(bMode ? !find : find);
                });
            }
        },
        [list, bMode, host]
    );

    return enable;
};

export default useIsEnable;