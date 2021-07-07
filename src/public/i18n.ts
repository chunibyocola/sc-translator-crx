import { getI18nMessage } from '../public/chrome-call';

let messages: { [key: string]: string } = {};

export const getMessage = (messageName: string) => (messages[messageName] ?? (messages[messageName] = getI18nMessage(messageName)));