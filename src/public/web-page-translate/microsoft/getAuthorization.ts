import { fetchData, getError } from '../../translate/utils';

let authorization = '';
let expiry = 0;

let fetchAuthorizationPromise: Promise<string> | null = null;

const fetchAuthorization = async () => {
    const timestamp = Number(new Date());

    const url = 'https://edge.microsoft.com/translate/auth';

    try {
        const res = await fetchData(url);

        authorization = await res.text();
        expiry = timestamp + 500000;

        fetchAuthorizationPromise = null;

        return authorization;
    }
    catch {
        fetchAuthorizationPromise = null;

        throw getError('Error: get authorization failed.');
    }
};

export const getAuthorization = async (force = false) => {
    const timestamp = Number(new Date());

    if (fetchAuthorizationPromise) { return fetchAuthorizationPromise; }

    if (!force && expiry > timestamp && authorization) { return authorization; }

    fetchAuthorizationPromise = fetchAuthorization();

    return await fetchAuthorizationPromise;
};