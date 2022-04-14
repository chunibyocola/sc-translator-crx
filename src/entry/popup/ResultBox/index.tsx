import React from 'react';
import './style.css';
import PopupHeader from '../../../components/PopupHeader';
import MultipleTranslateResult from '../MultipleTranslateResult';
import SingleTranslateResult from '../SingleTranslateResult';

type ResultBoxProps = {
    multipleTranslateMode: boolean;
};

const ResultBox: React.FC<ResultBoxProps> = ({ multipleTranslateMode }) => {
    return (
        <div id="sc-translator-root" className='popup-container'>
            <PopupHeader />
            <div className="popup-container__content">
                {multipleTranslateMode ? <MultipleTranslateResult /> : <SingleTranslateResult />}
            </div>
        </div>
    )
};

export default ResultBox;