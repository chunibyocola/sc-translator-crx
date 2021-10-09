import { getQueryString, getError, blobToDataURL, fetchData } from '../utils';
import { detect } from './detect';
import { langCode } from './lang-code';
import { LANGUAGE_NOT_SOPPORTED, RESULT_ERROR } from '../error-codes';
import { AudioParams } from '../translate-types';

export const audio = async ({ text, from = '' }: AudioParams) => {
    from = from || await detect({ text });

    if (!(from in langCode)) { throw getError(LANGUAGE_NOT_SOPPORTED); }

    let url = 'https://fanyi.baidu.com/gettts';

    const params = {
        lan: from,
        text: encodeURIComponent(text),
        spd: 3,
        source: 'web'
    };

    const res = await fetchData(url + getQueryString(params));

    try {
        const blob = await res.blob();

        const dataURL: string = await blobToDataURL(blob);
        
        return dataURL;
    } catch (err) {
        throw getError(RESULT_ERROR);
    }
};