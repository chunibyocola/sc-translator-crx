import { setLocalStorage } from '../../chrome-call';
import { BAD_REQUEST, CONNECTION_TIMED_OUT } from '../error-codes';
import { getError } from '../utils';

export const fetchBing = async (url: string, init?: RequestInit) => {
    let res = await fetch(url, init).catch(() => { throw getError(CONNECTION_TIMED_OUT) });

    if (res.redirected) {
        if (res.url.includes('www.bing.com')) {
            setLocalStorage({ useDotCn: false });
        }
        else if (res.url.includes('cn.bing.com')) {
            setLocalStorage({ useDotCn: true });
        }

       res = await fetch(res.url, init).catch(() => { throw getError(CONNECTION_TIMED_OUT) });
    }

    if (!res.ok) { throw getError(`${BAD_REQUEST} (http ${res.status})`); }

    return res;
};