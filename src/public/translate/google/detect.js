import { getQueryString, fetchData, getError } from '../utils';
import { RESULT_ERROR } from '../error-codes';

export const detect = async ({ text }) => {
    let url = `https://translate.googleapis.com/translate_a/single`;

    let params = {
        client: 'gtx',
        sl: 'auto',
        dj: 1,
        q: encodeURIComponent(text)
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