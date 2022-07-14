type SerializableObject = {
    [Key: string]: string | number | boolean | null | SerializableObject | SerializableArray;
};
type SerializableArray = (string | number | boolean | null | SerializableObject | SerializableArray)[];

const SC_FILE_EXTENSION = 'sctranslator';
const SC_FILE_NAME_SUFFIX = `.${SC_FILE_EXTENSION}`;

const scFile = (() => {
    return {
        saveAs: (serializableObject: SerializableObject, fileName: string) => {
            const downloadElement = document.createElement('a');
            downloadElement.setAttribute('href', `data:text/plain;charset=utf-8,${window.btoa(JSON.stringify(serializableObject))}`);
            downloadElement.setAttribute('download', `${fileName}${SC_FILE_NAME_SUFFIX}`);
            downloadElement.click();
        },
        open: (callback: (file: File) => void) => {
            const uploadElement = document.createElement('input');
            uploadElement.type = 'file';
            uploadElement.accept = SC_FILE_NAME_SUFFIX;
            uploadElement.onchange = () => {
                const file = uploadElement.files?.[0];

                file && callback(file);
            };
            uploadElement.click();
        },
        read: async (file: File) => {
            const text = await file.text();

            const data = JSON.parse(window.atob(text));

            if (Array.isArray(data) || typeof data !== 'object') { throw new Error('Error: Data is not an "object"'); }

            return data as SerializableObject;
        }
    };
})();

export default scFile;