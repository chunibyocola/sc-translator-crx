import React, { useRef, useState } from 'react';
import IconFont from '../../../components/IconFont';
import { useDebounce } from '../../../public/react-use';
import { textPreprocessing } from '../../../public/text-preprocessing';
import './style.css';

const TestTextProcessing = () => {
    const [testText, setTestText] = useState('');

    const resultEleRef = useRef();

    useDebounce(() => {
        resultEleRef.current.value = textPreprocessing(testText);
    }, 100, [testText])

    return (
        <div className='test-text-processing'>
            <textarea onChange={e => setTestText(e.target.value)} />
            <div className='test-text-processing-icon'>
                <IconFont
                    iconName='#icon-GoChevronRight'
                />
            </div>
            <textarea ref={resultEleRef} disabled />
        </div>
    );
};

export default TestTextProcessing;