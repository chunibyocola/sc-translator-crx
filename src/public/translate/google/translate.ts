import { getQueryString, getError } from '../utils';
import { langCode } from './lang-code';
import { RESULT_ERROR, LANGUAGE_NOT_SOPPORTED, CONNECTION_TIMED_OUT, BAD_REQUEST } from '../error-codes';
import { TranslateParams } from '../translate-types';
import { TranslateResult } from '../../../types';
import { getTk } from '../../web-page-translate/google/getTk';

export const translate = async ({ text, from, to, preferredLanguage, secondPreferredLanguage }: TranslateParams) => {
    const originTo = to;
    const originFrom = from;
    from = from || 'auto';
    to = to || (from === preferredLanguage ? secondPreferredLanguage : preferredLanguage);

    let params: FetchParams = {
        client: 'webapp',
        sl: from,
        tl: to,
        hl: preferredLanguage || to,
        dt: ['at', 'bd', 'ex', 'ld', 'md', 'qca', 'rw', 'rm', 'ss', 't'],
        ie: 'UTF-8',
        oe: 'UTF-8',
        dj: 1,
        q: encodeURIComponent(text),
        tk: getTk(text)
    };

    const res = await fetchGoogle(params);

    try {
        let data = await res.json();

        // Re-request with second preferred language.
        // Triggered only in the situation of "'from' and 'to' are both empty('')" and
        // "source language is same as 'to'" (set as preferred language above).
        if (!originFrom && !originTo && data.src === to && preferredLanguage !== secondPreferredLanguage) {
            params.sl = data.src;
            params.tl = secondPreferredLanguage;

            to = secondPreferredLanguage;

            const newRes = await fetchGoogle(params);

            data = await newRes.json();
        }

        const result: TranslateResult = {
            text,
            from: data.src,
            to,
            result: (data.sentences as { trans: string; }[])?.reduce((t, c) => (`${t}${c.trans ?? ''}`), '').split('\n').filter(v => v.trim()),
            dict: data.dict?.reduce((t: string[], c: { pos: string; entry: { word: string ; }[] }) => (t.concat(c.pos + ': ' + c.entry.map(v => v.word).join(', '))), []),
            phonetic: data.sentences?.[1]?.src_translit && `[${data.sentences[1].src_translit}]`,
            related: data.related_words?.word,
            example: (data.examples?.example as { text: string }[] | undefined)?.slice(0, 3).map(v => v.text)
        };

        return result;
    } catch (err) {
        throw getError(RESULT_ERROR);
    }
};

let expiry = 0;

type FetchParams = {
    client: string;
    sl: string;
    tl: string;
    hl: string;
    dt: string[];
    ie: 'UTF-8';
    oe: 'UTF-8';
    dj: number;
    q: string;
    tk: string;
};

const fetchGoogle = async (params: FetchParams): Promise<Response> => {
    if (!(params.sl in langCode) || !(params.tl in langCode)) { throw getError(LANGUAGE_NOT_SOPPORTED); }

    const url = 'https://translate.googleapis.com/translate_a/single';
    const timpstamp = Number(new Date());

    if (expiry > timpstamp) {
        params.client = 'gtx';
    }

    let res = await fetch(url + getQueryString(params)).catch(() => { throw getError(CONNECTION_TIMED_OUT) });

    if (!res.ok) {
        if (res.status === 429 && expiry < timpstamp) {
            expiry = timpstamp + 600000;
            params.client = 'gtx';

            res = await fetch(url + getQueryString(params)).catch(() => { throw getError(CONNECTION_TIMED_OUT) });

            if (res.ok) {
                return res;
            }
        }

        throw getError(`${BAD_REQUEST} (http ${res.status})`);
    }

    return res;
};