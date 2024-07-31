import React from 'react';
import Switch from '../../../../components/Switch';
import { getMessage } from '../../../../public/i18n';
import { useOptions } from '../../../../public/react-use';
import { GetStorageKeys } from '../../../../types';
import scOptions from '../../../../public/sc-options';

const useOptionsDependency: GetStorageKeys<
    'enablePdfViewer'
> = [
    'enablePdfViewer'
];

const Pdf: React.FC = () => {
    const {
        enablePdfViewer
    } = useOptions(useOptionsDependency);

    return (
        <div className='opt-section'>
            <div className='opt-section-row'>
                <Switch
                    label={getMessage('optionsEnablePdfViewer')}
                    checked={enablePdfViewer}
                    onChange={v => scOptions.set({ enablePdfViewer: v })}
                />
                <div className='item-description'>{getMessage('optionsEnablePdfViewerDescription')}</div>
            </div>
        </div>
    );
};

export default Pdf;