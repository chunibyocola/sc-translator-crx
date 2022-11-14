let messages: { [key: string]: string } = {};

export const getMessage = (messageName: string) => (messages[messageName] ?? (messages[messageName] = chrome.i18n.getMessage(messageName)));