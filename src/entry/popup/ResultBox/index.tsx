import React from 'react';
import './style.css';
import PopupHeader from '../../../components/PopupHeader';
import MultipleTranslateResult from '../MultipleTranslateResult';
import SingleTranslateResult from '../SingleTranslateResult';
import { useOptions } from '../../../public/react-use';
import { DefaultOptions } from '../../../types';

type PickedOptions = Pick<DefaultOptions, 'autoTranslateAfterInput'>;
const useOptionsDependency: (keyof PickedOptions)[] = ['autoTranslateAfterInput'];

type ResultBoxProps = {
    multipleTranslateMode: boolean;
};

const ResultBox: React.FC<ResultBoxProps> = ({ multipleTranslateMode }) => {
    const { autoTranslateAfterInput } = useOptions<PickedOptions>(useOptionsDependency);

    return (
        <div id="sc-translator-root" className='container'>
            <PopupHeader />
            <div className="content">
                {multipleTranslateMode ? <MultipleTranslateResult
                    autoTranslateAfterInput={autoTranslateAfterInput}
                /> : <SingleTranslateResult
                    autoTranslateAfterInput={autoTranslateAfterInput}
                />}
            </div>
        </div>
    )
};

export default ResultBox;