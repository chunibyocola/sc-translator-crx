import { getQueryString, fetchData, getError } from '../utils';
import { RESULT_ERROR } from '../error-codes';
import { DetectParams } from '../translate-types';
import { getTk } from '../../web-page-translate/google/getTk';

export const detect = async ({ text }: DetectParams): Promise<string> => {
    let url = `https://translate.googleapis.com/translate_a/single`;

    let params = {
        client: 'webapp',
        sl: 'auto',
        tl: 'en',
        hl: 'en',
        dt: ['at', 'bd', 'ex', 'ld', 'md', 'qca', 'rw', 'rm', 'ss', 't'],
        ie: 'UTF-8',
        oe: 'UTF-8',
        dj: 1,
        q: encodeURIComponent(text),
        tk: getTk(text)
    };

    url += getQueryString(params);

    const res = await fetchData(url);

    try {
        const data = await res.json();

        const langCode = data.src;

        return langCode;
    } catch (err) {
        throw getError(RESULT_ERROR);
    }
};