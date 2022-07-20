import React from 'react';
import Button from '../../../components/Button';
import defaultOptions from '../../../constants/defaultOptions';
import { setLocalStorage } from '../../../public/chrome-call';
import { getMessage } from '../../../public/i18n';
import scFile from '../../../public/sc-file';
import { getLocalStorageAsync } from '../../../public/utils';
import { DefaultOptions, SyncOptions } from '../../../types';

const FileSync: React.FC = () => {
    return (
        <div>
            <Button
                variant='outlined'
                onClick={async () => {
                    const { sourceParamsCache, ...options } = await getLocalStorageAsync<DefaultOptions>(Object.keys(defaultOptions) as (keyof DefaultOptions)[]);

                    const syncOptions: SyncOptions = options;

                    scFile.saveAs(syncOptions, `settings-v${chrome.runtime.getManifest().version}`);
                }}
            >
                {getMessage('optionsExportSettings')}
            </Button>
            <Button
                variant='outlined'
                onClick={async () => {
                    scFile.open(async (file) => {
                        const data = await scFile.read(file);
                        setLocalStorage(data);
                    })
                }}
            >
                {getMessage('optionsImportSettings')}
            </Button>
        </div>
    )
};

export default FileSync;