import { WebpageTranslateFn } from '..';
import { SOURCE_ERROR } from '../../../constants/errorCodes';
import { DefaultOptions } from '../../../types';
import { RESULT_ERROR } from '../../translate/error-codes';
import { fetchData, getError } from '../../translate/utils';
import { getLocalStorageAsync } from '../../utils';
import { checkResultFromCustomWebpageTranslatSource } from './check-result';

type PickedOptions = Pick<DefaultOptions, 'customWebpageTranslateSourceList'>;
const keys: (keyof PickedOptions)[] = ['customWebpageTranslateSourceList'];

type FetchCustomSourceJSON = {
    paragraphs: string[][];
    targetLanguage: string;
};

// type ResultFromCustomSource = {
//     result: WebpageTranslateResult[];
// } | {
//     code: string;
// };

export const translate: WebpageTranslateFn = async ({ paragraphs, targetLanguage }, source) => {
    const { customWebpageTranslateSourceList } = await getLocalStorageAsync<PickedOptions>(keys);
    const customTranslateSource = customWebpageTranslateSourceList.find(value => value.source === source);

    if (!customTranslateSource) { throw getError(SOURCE_ERROR); }

    const fetchJSON: FetchCustomSourceJSON = {
        paragraphs,
        targetLanguage
    };

    const res = await fetchData(customTranslateSource.url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(fetchJSON)
    });

    try {
        const data = await res.json();

        if (data.code) { throw getError(data.code); }

        checkResultFromCustomWebpageTranslatSource(data);

        return data.result;
    }
    catch (err) {
        if ((err as ReturnType<typeof getError>).code) {
            throw err;
        }
        else {
            throw getError(RESULT_ERROR);
        }
    }
};