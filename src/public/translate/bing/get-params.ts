import { DefaultOptions } from '../../../types';
import scOptions from '../../sc-options';
import { getLocalStorageAsync } from '../../utils';
import { RESULT_ERROR } from '../error-codes';
import { getError } from '../utils';
import { fetchBing } from './fetch-bing';

type PickedOptions = Pick<DefaultOptions, 'sourceParamsCache'>;
const keys: (keyof PickedOptions)[] = ['sourceParamsCache'];

export const getTranslateParams = async (com: boolean) => {
    const currentTime = Number(new Date());

    const { sourceParamsCache } = await getLocalStorageAsync<PickedOptions>(keys);
    let { expiry, key, token, IG, updateTime, IID, richIID } = sourceParamsCache['bing.com'].translate

    if (updateTime <= currentTime && token && key && expiry > currentTime) { return { key, token, IG, IID, richIID }; }

    const res = await fetchBing(`https://${com ? 'www' : 'cn'}.bing.com/translator`);
    const text = await res.text();
    const code = text.match(/params_AbusePreventionHelper = \[.*?\]/g)![0].split('[')[1].replace(/"|\]/g, '');
    IG = text.match(/(?<=,IG:")[a-zA-Z0-9]+(?=")/)![0];
    const [tKey, tToken, tDuration] = code.split(',');

    IID = text.match(/(?<=id="tta_outGDCont" data-iid=")translator\.[0-9]+(?=">)/)?.[0] ?? 'translator.5027';
    richIID = (text.match(/(?<=id="rich_tta" data-iid=")translator\.[0-9]+(?=">)/)?.[0] ?? 'translator.5024') + '.1';

    key = Number(tKey);
    const duration = Number(tDuration);
    expiry = currentTime + duration;
    token = tToken;

    getLocalStorageAsync<PickedOptions>(keys).then(({ sourceParamsCache }) => {
        sourceParamsCache['bing.com'].translate = { expiry, key, token, IG, IID, richIID, updateTime: currentTime };
        scOptions.set({ sourceParamsCache });
    });

    return { key, token, IG, IID, richIID };
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
    const res = await fetchBing(url, {
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
            scOptions.set({ sourceParamsCache });
        });

        return { region, token };
    } catch (err) {
        throw getError(RESULT_ERROR);
    }
};