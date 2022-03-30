import { useMemo } from 'react';
import { DefaultOptions } from '../../types';
import { getIsEnabled } from '../utils';
import useOptions from './useOptions';

type PickedOptions = Pick<DefaultOptions, 'historyBlackListMode' | 'historyHostList'>;
const useOptionsDependency: (keyof PickedOptions)[] = ['historyBlackListMode', 'historyHostList'];

const useIsHistoryEnabled = (host: string) => {
    const { historyBlackListMode, historyHostList } = useOptions<PickedOptions>(useOptionsDependency);

    const historyEnabled = useMemo(() => {
        return !!host && getIsEnabled(host, historyHostList, historyBlackListMode);
    }, [host, historyBlackListMode, historyHostList]);

    return historyEnabled;
};

export default useIsHistoryEnabled;