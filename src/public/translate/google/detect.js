import getTk from './getTk';
import { getQueryString, fetchData, getError } from '../utils';
import { RESULT_ERROR } from '../error-codes';

export const detect = async ({ text, com = true }) => {
    let url = `https://translate.google.${com ? 'com' : 'cn'}/translate_a/single`;

    let params = {
        client: 'webapp',
        sl: 'auto',
        tk: await getTk(text, com),
        q: encodeURIComponent(text)
    };

    url += getQueryString(params);

    const res = await fetchData(url);

    try {
        const data = await res.json();

        const langCode = data[2];

        return langCode;
    } catch (err) {
        throw getError(RESULT_ERROR);
    }
};