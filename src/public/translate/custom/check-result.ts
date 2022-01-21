export const checkResultFromCustomSource = (result: any) => {
    // required key "result", "from", "to"
    if (!('from' in result) || !('to' in result) || !('result' in result)) {
        const errorMessage = `Error: `
            + `${!('result' in result) ? '"result"' : ''} `
            + `${!('from' in result) ? '"from"' : ''} `
            + `${!('to' in result) ? '"to"' : ''} is/are required in response data.`;

        throw new Error(errorMessage);
    }

    // check "result"
    if (!Array.isArray(result.result)) {
        throw new Error('Error: "result" is not array.');
    }
    else if (!isAllStringInArray(result.result)) {
        throw new Error('Error: "result" must be an array of strings.');
    }

    // check "from"
    if (typeof result.from !== 'string') {
        throw new Error('Error: "from" is not string.');
    }

    // check "to"
    if (typeof result.to !== 'string') {
        throw new Error('Error: "to" is not string.');
    }

    // check "dict"
    if ('dict' in result) {
        if (!Array.isArray(result.dict)) {
            throw new Error('Error: "dict" is not array.');
        }
        else if (!isAllStringInArray(result.dict)) {
            throw new Error('Error: "dict" must be an array of strings.');
        }
    }

    // check "related"
    if ('related' in result) {
        if (!Array.isArray(result.related)) {
            throw new Error('Error: "related" is not an array.');
        }
        else if (!isAllStringInArray(result.related)) {
            throw new Error('Error: "related" must be an array of strings.');
        }
    }

    // check "phonetic"
    if ('phonetic' in result && typeof result.phonetic !== 'string') {
        throw new Error('Error: "phonetic" is not string.');
    }

    // check "example"
    if ('example' in result) {
        if (!Array.isArray(result.example)) {
            throw new Error('Error: "example" is not an array.');
        }
        else if (!isAllStringInArray(result.example)) {
            throw new Error('Error: "example" must be an array of strings.');
        }
    }
};

const isAllStringInArray = (array: any[]) => {
    for (let i = 0; i < array.length; i++) {
        if (typeof array[i] !== 'string') { return false; }
    }
    return true;
};