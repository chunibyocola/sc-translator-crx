import React from 'react';
import './style.css';
import PopupHeader from '../../../components/PopupHeader';
import MultipleTranslateResult from '../MultipleTranslateResult';
import SingleTranslateResult from '../SingleTranslateResult';

const ResultBox = ({ multipleTranslateMode }) => {
    return (
        <div id="sc-translator-root" className='container'>
            <PopupHeader />
            <div className="content">
                {multipleTranslateMode ? <MultipleTranslateResult /> : <SingleTranslateResult />}
            </div>
        </div>
    )
};

export default ResultBox;