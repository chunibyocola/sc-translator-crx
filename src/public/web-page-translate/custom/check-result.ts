import { isAllStringInArray } from '../../translate/custom/check-result';

export const checkResultFromCustomWebpageTranslatSource = (result: any) => {
    if (!('result' in result)) {
        throw new Error(`Error: "result" is required in response data.`);
    }

    if (!Array.isArray(result.result)) {
        throw new Error(`Error: "result" is not type of array.`);
    }

    result.result.forEach((item: any) => {
        if (!('translations' in item)) {
            throw new Error(`Error: "translations" is required in array of "result".`);
        }
        if (!Array.isArray(item.translations)) {
            throw new Error(`Error: "translations" is not type of array.`);
        }
        if (!isAllStringInArray(item.translations)) {
            throw new Error(`Error: "translations" must be an array of string.`);
        }

        if ('comparisons' in item) {
            if (!Array.isArray(item.comparisons)) {
                throw new Error(`Error: "comparisons" is not type of array.`);
            }
            if (!isAllStringInArray(item.comparisons)) {
                throw new Error(`Error: "comparisons" must be an array of string.`);
            }
        }
    });
};