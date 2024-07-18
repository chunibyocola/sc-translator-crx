import { useMemo } from 'react';
import { GetStorageKeys } from '../../types';
import { getIsEnabled } from '../utils';
import useOptions from './useOptions';

const useOptionsDependency: GetStorageKeys<'historyBlackListMode' | 'historyHostList'> = ['historyBlackListMode', 'historyHostList'];

const useIsHistoryEnabled = (host: string) => {
    const { historyBlackListMode, historyHostList } = useOptions(useOptionsDependency);

    const historyEnabled = useMemo(() => {
        return !!host && getIsEnabled(host, historyHostList, historyBlackListMode);
    }, [host, historyBlackListMode, historyHostList]);

    return historyEnabled;
};

export default useIsHistoryEnabled;