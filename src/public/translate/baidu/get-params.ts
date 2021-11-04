import { DefaultOptions } from '../../../types';
import { setLocalStorage } from '../../chrome-call';
import { getLocalStorageAsync } from '../../utils';
import { fetchData } from '../utils';
import { getSign } from './get-sign';

type PickedOptions = Pick<DefaultOptions, 'sourceParamsCache'>;
const keys: (keyof PickedOptions)[] = ['sourceParamsCache'];

export const getTranslateParams = async (query: string) => {
    const currentTime = Number(new Date());

    const { sourceParamsCache } = await getLocalStorageAsync<PickedOptions>(keys);
    let { expiry, token, updateTime } = sourceParamsCache['baidu.com'].translate;

    const sign = getSign(query);

    if (updateTime <= currentTime && expiry > currentTime && token) { return { token, sign }; }

    const res = await fetchData('https://fanyi.baidu.com/');
    const text = await res.text();
    const code = text.match(/token:.*?',/g);

    if (code) { token = code[0].split('\'')[1]; }

    getLocalStorageAsync<PickedOptions>(keys).then(({ sourceParamsCache }) => {
        sourceParamsCache['baidu.com'].translate = { expiry: currentTime + 21600000, token, updateTime: currentTime };
        setLocalStorage({ sourceParamsCache });
    });

    return { token, sign };
};