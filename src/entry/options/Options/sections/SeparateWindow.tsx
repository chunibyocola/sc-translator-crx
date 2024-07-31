import React from 'react';
import Button from '../../../../components/Button';
import Switch from '../../../../components/Switch';
import { getMessage } from '../../../../public/i18n';
import { useOptions } from '../../../../public/react-use';
import { GetStorageKeys } from '../../../../types';
import scOptions from '../../../../public/sc-options';

const initSizeAndPosition = { width: 286, height: 439, left: 550, top: 250 };

const useOptionsDependency: GetStorageKeys<
    'rememberStwSizeAndPosition'
> = [
    'rememberStwSizeAndPosition'
];

const SeparateWindow: React.FC = () => {
    const {
        rememberStwSizeAndPosition
    } = useOptions(useOptionsDependency);

    return (
        <div className='opt-section'>
            <div className='opt-section-row'>
                <div className='item-description'>{getMessage('optionsStwDescription')}</div>
                <div className='item-description'>{getMessage('optionsStwAutoRespondDescription')}</div>
            </div>
            <div className='opt-section-row'>
                <Switch
                    label={getMessage('optionsRememberStwSizeAndPosition')}
                    checked={rememberStwSizeAndPosition}
                    onChange={v => scOptions.set({ rememberStwSizeAndPosition: v })}
                />
            </div>
            <div className='opt-section-row'>
                <Button variant='outlined' onClick={() => scOptions.set({ stwSizeAndPosition: initSizeAndPosition })}>
                    {getMessage('optionsResetSizeAndPosition')}
                </Button>
            </div>
        </div>
    );
};

export default SeparateWindow;