import { fetchData } from '../../translate/utils';

let authorization = '';
let expiry = 0;

export const getAuthorization = async (force = false) => {
    const timestamp = Number(new Date());

    if (!force && expiry > timestamp && authorization) { return authorization; }

    const url = 'https://edge.microsoft.com/translate/auth';

    const res = await fetchData(url);

    authorization = await res.text();
    expiry = timestamp + 500000;

    return authorization;
};