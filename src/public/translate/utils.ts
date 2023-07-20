import { CONNECTION_TIMED_OUT, BAD_REQUEST } from './error-codes';

export const getQueryString = (params: { [key: string]: string | number | (string | number)[]; }) => {
    let search = '';

    Object.keys(params).map((v, i) => {
        i ? search += '&': search += '?';

        const value = params[v];

        Array.isArray(value) ?
            search += value.reduce((t: string, c: number | string, i: number) => (`${i ? t + '&' : ''}${v}=${c}`), '') :
            search += `${v}=${value}`;

        return v;
    });

    return search;
};

export const blobToDataURL = (blob: Blob): Promise<string> => {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = () => {
            resolve(reader.result as string);
        };
        reader.readAsDataURL(blob);
    });
};

export const getError = (code: string): Error & { code: string } => {
    let error: Error = new Error();

    return { ...error, code };
};

export const fetchData = async (url: string, init?: RequestInit) => {
    const res = await fetch(url, init).catch(() => { throw getError(CONNECTION_TIMED_OUT) });

    if (!res.ok) { throw getError(`${BAD_REQUEST} (http ${res.status})`); }

    return res;
};