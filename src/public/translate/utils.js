import { CONNECTION_TIMED_OUT, BAD_REQUEST } from './error-codes';

export const getQueryString = (params) => {
    let search = '';

    Object.keys(params).map((v, i) => {
        i ? search += '&': search += '?';

        Array.isArray(params[v]) ?
            search += params[v].reduce((t, c, i) => (`${i ? t + '&' : ''}${v}=${c}`), '') :
            search += `${v}=${params[v]}`;

        return v;
    });

    return search;
};


export const getError = (code) => {
    let error = new Error();

    error.code = code;

    return error;
};

export const fetchData = async (url, init = {}) => {
    const res = await fetch(url, init).catch(() => { throw getError(CONNECTION_TIMED_OUT) });

    if (!res.ok) { throw getError(`${BAD_REQUEST} (http ${res.status})`); }

    return res;
};