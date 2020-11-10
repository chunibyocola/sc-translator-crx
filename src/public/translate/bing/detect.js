import { fetchData, getError } from '../utils';
import { RESULT_ERROR } from '../error-codes';

 export const detect = async ({ text, com }) => {
    const url = `https://${com ? 'www' : 'cn'}.bing.com/ttranslatev3`;

    let searchParams = new URLSearchParams();
    searchParams.append('fromLang', 'auto-detect');
    searchParams.append('text', text);
    searchParams.append('to', 'en');

    const res = await fetchData(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: searchParams.toString()
    });

    try {
        const data = await res.json();

        const langCode = data[0].detectedLanguage.language;

        return langCode;
    } catch (err) {
        throw getError(RESULT_ERROR);
    }
};