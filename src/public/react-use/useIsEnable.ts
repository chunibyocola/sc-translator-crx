import { useEffect, useState } from 'react';
import { DefaultOptions } from '../../types';
import { getCurrentTabHost } from '../utils';
import useOptions from './useOptions';

type PickedOptions = Pick<DefaultOptions, 'translateHostList' | 'historyHostList' | 'translateBlackListMode' | 'historyBlackListMode'>;
const useOptionsDependency: (keyof PickedOptions)[] = ['translateHostList', 'historyHostList', 'translateBlackListMode', 'historyBlackListMode'];

const useIsEnable = (enableType: 'translate' | 'history', host?: string) => {
    const [enable, setEnable] = useState(false);

    const { translateHostList, historyHostList, translateBlackListMode, historyBlackListMode } = useOptions<PickedOptions>(useOptionsDependency);

    useEffect(
        () => {
            let list = enableType === 'translate' ? translateHostList : historyHostList;
            let bMode = enableType === 'translate' ? translateBlackListMode: historyBlackListMode;

            if (host) {
                const find = list.some(v => host.endsWith(v));
                setEnable(bMode ? !find : find);
            }
            else {
                getCurrentTabHost().then((tabHost) => {
                    if (!tabHost) {
                        setEnable(false);
                        return;
                    };

                    const find = list.some(v => tabHost.endsWith(v));
                    setEnable(bMode ? !find : find);
                });
            }
        },
        [translateHostList, historyHostList, translateBlackListMode, historyBlackListMode, host, enableType]
    );

    return enable;
};

export default useIsEnable;