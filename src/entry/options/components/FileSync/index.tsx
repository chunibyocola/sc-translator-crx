import React, { useState } from 'react';
import Button from '../../../../components/Button';
import IconFont from '../../../../components/IconFont';
import defaultOptions from '../../../../constants/defaultOptions';
import { setLocalStorage } from '../../../../public/chrome-call';
import { combineStorage } from '../../../../public/combine-storage';
import { getMessage } from '../../../../public/i18n';
import scFile from '../../../../public/sc-file';
import { getLocalStorageAsync } from '../../../../public/utils';
import { DefaultOptions, SyncOptions } from '../../../../types';

const FileSync: React.FC = () => {
    const [errorMessage, setErrorMessage] = useState('');

    return (
        <div>
            <Button
                variant='outlined'
                onClick={async () => {
                    const { sourceParamsCache, ...options } = await getLocalStorageAsync<DefaultOptions>(Object.keys(defaultOptions) as (keyof DefaultOptions)[]);

                    const syncOptions: SyncOptions = options;

                    scFile.saveAs(syncOptions, 'settings');
                }}
            >
                <IconFont
                    iconName='#icon-export'
                    style={{fontSize: '24px', marginRight: '5px'}}
                />
                {getMessage('optionsExportSettings')}
            </Button>
            <Button
                variant='outlined'
                onClick={async () => {
                    scFile.open(async (file) => {
                        try {
                            const data = await scFile.read(file);
                            
                            const newStorage = await combineStorage(data);

                            setLocalStorage(newStorage);

                            setErrorMessage('');
                        }
                        catch (err) {
                            const message = (err as Error).message ?? '';
                            setErrorMessage(message);
                        }
                    });
                }}
            >
                <IconFont
                    iconName='#icon-import'
                    style={{fontSize: '24px', marginRight: '5px'}}
                />
                {getMessage('optionsImportSettings')}
            </Button>
            {errorMessage && <div>{errorMessage}</div>}
        </div>
    )
};

export default FileSync;