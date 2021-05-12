import React from 'react';
import './style.css';
import PopupHeader from '../../../components/PopupHeader';
import MultipleTranslateResult from '../MultipleTranslateResult';
import SingleTranslateResult from '../SingleTranslateResult';
import { useOptions } from '../../../public/react-use';

const useOptionsDependency = ['autoTranslateAfterInput'];

const ResultBox = ({ multipleTranslateMode }) => {
    const { autoTranslateAfterInput } = useOptions(useOptionsDependency);

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