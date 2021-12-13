import React from 'react';
import { GenericOptionsProps } from '..';
import Switch from '../../../../components/Switch';
import { getMessage } from '../../../../public/i18n';
import { DefaultOptions } from '../../../../types';

type PdfProps = GenericOptionsProps<Pick<
    DefaultOptions,
    'enablePdfViewer'
>>;

const Pdf: React.FC<PdfProps> = ({ updateStorage, enablePdfViewer }) => {
    return (
        <div className='opt-section'>
            <div className='opt-section-row'>
                <Switch
                    label={getMessage('optionsEnablePdfViewer')}
                    checked={enablePdfViewer}
                    onChange={v => updateStorage('enablePdfViewer', v)}
                />
                <div className='item-description'>{getMessage('optionsEnablePdfViewerDescription')}</div>
            </div>
        </div>
    );
};

export default Pdf;