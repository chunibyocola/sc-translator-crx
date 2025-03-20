import React from 'react';
import './style.css';
import PopupHeader from '../../../components/PopupHeader';
import MultipleTranslateResult from '../MultipleTranslateResult';

const ResultBox: React.FC = () => {
    return (
        <div id="sc-translator-root" className='popup-container'>
            <PopupHeader />
            <div className="popup-container__content">
                <MultipleTranslateResult />
            </div>
        </div>
    )
};

export default ResultBox;