import { fetchData } from "../utils";

let token = '';
let key = 0;
let duration = 0;
let expiry = 0;

export const getTokenAndKey = async (com: boolean) => {
    const currentTime = Number(new Date());

    if (token && key && expiry && expiry > currentTime) { return { key, token }; }

    const res = await fetchData(`https://${com ? 'www' : 'cn'}.bing.com/translator`);
    const text = await res.text();
    const code = text.match(/params_RichTranslateHelper = \[.*?\]/g)![0].split('[')[1].replace(/"|\]/g, '');
    const [tKey, tToken, tDuration] = code.split(',');
    key = Number(tKey);
    duration = Number(tDuration);
    expiry = currentTime + duration;
    token = tToken;

    return { key, token };
};