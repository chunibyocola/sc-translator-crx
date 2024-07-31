import scOptions from '../../sc-options';
import { BAD_REQUEST, CONNECTION_TIMED_OUT } from '../error-codes';
import { getError } from '../utils';

export const fetchBing = async (url: string, init?: RequestInit) => {
    let res = await fetch(url, init).catch(() => { throw getError(CONNECTION_TIMED_OUT) });

    if (res.redirected) {
        if (res.url.includes('www.bing.com')) {
            scOptions.set({ useDotCn: false });
        }
        else if (res.url.includes('cn.bing.com')) {
            scOptions.set({ useDotCn: true });
        }

       res = await fetch(res.url, init).catch(() => { throw getError(CONNECTION_TIMED_OUT) });
    }

    if (!res.ok) { throw getError(`${BAD_REQUEST} (http ${res.status})`); }

    return res;
};