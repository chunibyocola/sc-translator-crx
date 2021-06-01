import { getLocalStorage, setLocalStorage } from "../../public/chrome-call";
import { listenOptionsChange } from "../../public/options";

let optionalPermissions = {};

export const requestSinglePermission = (permissionName) => {
    permissionName in optionalPermissions && chrome.permissions.request({ permissions: [permissionName] }, (granted) => {
        if (granted) {
            setLocalStorage({ optionalPermissions: { ...optionalPermissions, [permissionName]: true } });
        }
    });
};

export const removeSinglePermission = (permissionName) => {
    permissionName in optionalPermissions && chrome.permissions.remove({ permissions: [permissionName] }, (removed) => {
        if (removed) {
            setLocalStorage({ optionalPermissions: { ...optionalPermissions, [permissionName]: false } });
        }
    });
}

getLocalStorage('optionalPermissions', (options) => {
    optionalPermissions = options.optionalPermissions ?? optionalPermissions;
});
listenOptionsChange(['optionalPermissions'], (changes) => {
    optionalPermissions = changes.optionalPermissions ?? optionalPermissions;
});