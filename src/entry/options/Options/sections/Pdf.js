import React from 'react';
import { getMessage } from '../../../../public/i18n';
import OptionToggle from '../../OptionToggle';

const Pdf = ({ updateStorage, enablePdfViewer }) => {
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