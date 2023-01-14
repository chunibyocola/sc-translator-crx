import { DefaultOptions } from '../../../types';
import { setLocalStorage } from '../../chrome-call';
import { getLocalStorageAsync } from '../../utils';
import { RESULT_ERROR } from '../error-codes';
import { fetchData, getError } from '../utils';

type PickedOptions = Pick<DefaultOptions, 'sourceParamsCache'>;
const keys: (keyof PickedOptions)[] = ['sourceParamsCache'];

const IID = 'translator.5024.1';

export const getTranslateParams = async (com: boolean) => {
    const currentTime = Number(new Date());

    const { sourceParamsCache } = await getLocalStorageAsync<PickedOptions>(keys);
    let { expiry, key, token, IG, updateTime } = sourceParamsCache['bing.com'].translate

    if (updateTime <= currentTime && token && key && expiry > currentTime) { return { key, token, IG, IID }; }

    const res = await fetchData(`https://${com ? 'www' : 'cn'}.bing.com/translator`);
    const text = await res.text();
    const code = text.match(/params_AbusePreventionHelper = \[.*?\]/g)![0].split('[')[1].replace(/"|\]/g, '');
    IG = text.match(/(?<=,IG:")[a-zA-Z0-9]+(?=")/)![0];
    const [tKey, tToken, tDuration] = code.split(',');

    key = Number(tKey);
    const duration = Number(tDuration);
    expiry = currentTime + duration;
    token = tToken;

    getLocalStorageAsync<PickedOptions>(keys).then(({ sourceParamsCache }) => {
        sourceParamsCache['bing.com'].translate = { expiry, key, token, IG, updateTime: currentTime };
        setLocalStorage({ sourceParamsCache });
    });

    return { key, token, IG, IID };
};

export const getAudioParams = async (com: boolean) => {
    const currentTime = Number(new Date());

    const { sourceParamsCache } = await getLocalStorageAsync<PickedOptions>(keys);
    let { expiry, region, token, updateTime } = sourceParamsCache['bing.com'].audio;

    if (updateTime <= currentTime && expiry > currentTime) { return { region, token }; }

    const { token: translateToken, key, IG, IID } = await getTranslateParams(com);

    const url = `https://${com ? 'www' : 'cn'}.bing.com/tfetspktok?isVertical=1&IG=${IG}&IID=${IID}`;

    const searchParams = new URLSearchParams();
    searchParams.append('token', translateToken);
    searchParams.append('key', key.toString());
    const res = await fetchData(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: searchParams.toString()
    });

    try {
        const data = await res.json();

        expiry = currentTime + Number(data.expiryDurationInMS);
        region = data.region;
        token = data.token;

        getLocalStorageAsync<PickedOptions>(keys).then(({ sourceParamsCache }) => {
            sourceParamsCache['bing.com'].audio = { expiry, region, token, updateTime: currentTime };
            setLocalStorage({ sourceParamsCache });
        });

        return { region, token };
    } catch (err) {
        throw getError(RESULT_ERROR);
    }
};