import { fetchData } from "../utils";

let token = '';
let key = '';
let duration = '';
let expiry = 0;

export const getTokenAndKey = async (com) => {
    const currentTime = Number(new Date());

    if (token && key && expiry && expiry > currentTime) { return { key, token }; }

    const res = await fetchData(`https://${com ? 'www' : 'cn'}.bing.com/translator`);
    const text = await res.text();
    const code = text.match(/params_RichTranslateHelper = \[.*?\]/g)[0].split('[')[1].replace(/"|\]/g, '');
    [key, token, duration] = code.split(',');
    key = Number(key);
    duration = Number(duration);
    expiry = currentTime + duration;

    return { key, token };
};