import { fetchData } from '../../translate/utils';

export const getAuthorization = async () => {
    const url = 'https://edge.microsoft.com/translate/auth';
    const res = await fetchData(url);
    const authorization = await res.text();
    return authorization;
};