import { getMessage } from '../i18n';
import { CONNECTION_TIMED_OUT, BAD_REQUEST } from './error-codes';
import { TranslateParams } from './translate-types';

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
    const res = await fetch(url, { signal: AbortSignal.timeout(8000), ...init }).catch((err) => {
        if (err.name === 'TimeoutError') {
            throw getError(`${getMessage('errorCode_' + CONNECTION_TIMED_OUT)}(${new URL(url).host})`);
        }

        throw getError(`${err.name}: ${err.message}`);
    });

    if (!res.ok) { throw getError(`${BAD_REQUEST} (http ${res.status})`); }

    return res;
};

export const fetchTPS = async (url: string, init?: RequestInit) => {
    const res = await fetch(url, { signal: AbortSignal.timeout(8000), ...init }).catch((err) => {
        if (err.name === 'TimeoutError') {
            throw getError(`${getMessage('errorCode_' + CONNECTION_TIMED_OUT)}(${new URL(url).host})`);
        }

        throw getError(`${err.name}: ${err.message}`);
    });

    return res;
};

export const fetchStream = async (url: string, init?: RequestInit) => {
    const res = await fetchData(url, init);

    const reader = res.body?.getReader();

    if (!reader) { throw getError('ERROR: NOT_STREAM'); }

    const rs =  new ReadableStream({
        start: (controller) => {
            const push = async () => {
                const { done, value } = await reader.read();

                if (done) {
                    controller.close();
                    return;
                }

                controller.enqueue(value);

                push();
            }

            push();
        }
    });

    const result = await new Response(rs, { headers: { 'Content-Type': 'text/html' } }).text();

    const re = result.split('\n\n').filter(v => v.indexOf('event: message\ndata: ') === 0).map(v => JSON.parse(v.replace('event: message\ndata: ', '')));

    return re;
};

export const determineFromAndTo: (params: TranslateParams) => Promise<{ from: string; to: string; }> = async ({ text, from, to, preferredLanguage, secondPreferredLanguage }) => {
    if (from === '') {
        const detection = await chrome.i18n.detectLanguage(text);
        from = detection.languages[0]?.language ?? '';
    }

    if (to === '' && from !== '') {
        to = preferredLanguage.startsWith(from) ? secondPreferredLanguage : preferredLanguage;
    }

    return { from, to };
};