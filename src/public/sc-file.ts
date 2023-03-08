export type SerializableObject = {
    [Key: string]: string | number | boolean | null | SerializableObject | SerializableArray;
};
export type SerializableArray = (string | number | boolean | null | SerializableObject | SerializableArray)[];

const SC_FILE_EXTENSION = 'sctranslator';
const SC_FILE_NAME_SUFFIX = `.${SC_FILE_EXTENSION}`;

const scFile = (() => {
    return {
        saveAs: (serializableObject: SerializableObject | SerializableArray, fileName: string) => {
            const date = new Date();
            fileName = `${fileName}-d${date.getFullYear()}${date.getMonth() + 1 < 10 ? '0' : ''}${date.getMonth() + 1}${date.getDate() < 10 ? '0' : ''}${date.getDate()}`;

            const file = new Blob([JSON.stringify(serializableObject)], { type: 'text/plain;charset=utf-8' });

            const downloadElement = document.createElement('a');
            downloadElement.setAttribute('href', URL.createObjectURL(file));
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

            const data = JSON.parse(text);

            return data;
        }
    };
})();

export default scFile;