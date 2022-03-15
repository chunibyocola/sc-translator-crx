import { fetchData, getError } from '../utils';
import { RESULT_ERROR } from '../error-codes';
import { DetectParams } from '../translate-types';

export const detect = async ({ text }: DetectParams): Promise<string> => {
    let searchParams = new URLSearchParams();
    searchParams.append('query', text);

    const res = await fetchData('https://fanyi.baidu.com/langdetect', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
        },
        body: searchParams.toString()
    });

    try {
        const result = await res.json();

        if (result.msg !== 'success') { throw getError(RESULT_ERROR); };

        return result.lan;
    } catch (e) {
        throw getError(RESULT_ERROR);
    }
};