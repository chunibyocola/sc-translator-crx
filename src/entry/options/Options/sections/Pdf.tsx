import React from 'react';
import { GenericOptionsProps } from '..';
import { getMessage } from '../../../../public/i18n';
import { DefaultOptions } from '../../../../types';
import OptionToggle from '../../OptionToggle';

type PdfProps = GenericOptionsProps<Pick<
    DefaultOptions,
    'enablePdfViewer'
>>;

const Pdf: React.FC<PdfProps> = ({ updateStorage, enablePdfViewer }) => {
    return (
        <div className='opt-section'>
            <div className='opt-section-row'>
                <OptionToggle
                    id='enalbe-pdf-viewer'
                    message='optionsEnablePdfViewer'
                    checked={enablePdfViewer}
                    onClick={() => updateStorage('enablePdfViewer', !enablePdfViewer)}
                />
                <div className='item-description'>{getMessage('optionsEnablePdfViewerDescription')}</div>
            </div>
        </div>
    );
};

export default Pdf;