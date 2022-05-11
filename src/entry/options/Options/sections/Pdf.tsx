import React from 'react';
import Switch from '../../../../components/Switch';
import { setLocalStorage } from '../../../../public/chrome-call';
import { getMessage } from '../../../../public/i18n';
import { useOptions } from '../../../../public/react-use';
import { DefaultOptions } from '../../../../types';

type PickedOptions = Pick<
    DefaultOptions,
    'enablePdfViewer'
>;
const useOptionsDependency: (keyof PickedOptions)[] = [
    'enablePdfViewer'
];

const Pdf: React.FC = () => {
    const {
        enablePdfViewer
    } = useOptions<PickedOptions>(useOptionsDependency);

    return (
        <div className='opt-section'>
            <div className='opt-section-row'>
                <Switch
                    label={getMessage('optionsEnablePdfViewer')}
                    checked={enablePdfViewer}
                    onChange={v => setLocalStorage({ enablePdfViewer: v })}
                />
                <div className='item-description'>{getMessage('optionsEnablePdfViewerDescription')}</div>
            </div>
        </div>
    );
};

export default Pdf;