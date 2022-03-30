import { useMemo } from 'react';
import { DefaultOptions } from '../../types';
import { getIsEnabled } from '../utils';
import useOptions from './useOptions';

type PickedOptions = Pick<DefaultOptions, 'translateBlackListMode' | 'translateHostList'>;
const useOptionsDependency: (keyof PickedOptions)[] = ['translateBlackListMode', 'translateHostList'];

const useIsTranslateEnabled = (host: string) => {
    const { translateBlackListMode, translateHostList } = useOptions<PickedOptions>(useOptionsDependency);

    const translateEnabled = useMemo(() => {
        return !!host && getIsEnabled(host, translateHostList, translateBlackListMode);
    }, [translateBlackListMode, translateHostList, host]);

    return translateEnabled;
};

export default useIsTranslateEnabled;