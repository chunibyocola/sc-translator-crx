import { getQueryString, getError, fetchData, blobToDataURL } from '../utils';
import { langCode } from './lang-code';
import { LANGUAGE_NOT_SOPPORTED, RESULT_ERROR } from '../error-codes';
import { detect } from './detect';
import { AudioParams } from '../translate-types';

const MAX_TEXT_LENGTH = 200;

export const audio = async ({ text, from = '' }: AudioParams) => {
    if (text.length > MAX_TEXT_LENGTH) { throw getError('MAX_LENGTH_EXCEED'); }

    from = from || await detect({ text });

    if (!(from in langCode)) { throw getError(LANGUAGE_NOT_SOPPORTED); }

    let url = `https://translate.googleapis.com/translate_tts`;

    const params = {
        client: 'gtx',
        ie: 'UTF-8',
        tl: from,
        q: encodeURIComponent(text)
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