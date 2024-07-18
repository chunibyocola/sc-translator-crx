import { useMemo } from 'react';
import { GetStorageKeys } from '../../types';
import { getIsEnabled } from '../utils';
import useOptions from './useOptions';

const useOptionsDependency: GetStorageKeys<'translateBlackListMode' | 'translateHostList'> = ['translateBlackListMode', 'translateHostList'];

const useIsTranslateEnabled = (host: string) => {
    const { translateBlackListMode, translateHostList } = useOptions(useOptionsDependency);

    const translateEnabled = useMemo(() => {
        return !!host && getIsEnabled(host, translateHostList, translateBlackListMode);
    }, [translateBlackListMode, translateHostList, host]);

    return translateEnabled;
};

export default useIsTranslateEnabled;