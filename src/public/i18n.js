import { getI18nMessage } from '../public/chrome-call';

let messages = {};

export const getMessage = messageName => messages[messageName] ?? (messages[messageName] = getI18nMessage(messageName));