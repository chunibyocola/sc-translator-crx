import React, { useRef, useState } from 'react';
import IconFont from '../../../components/IconFont';
import { useDebounce } from '../../../public/react-use';
import { textPreprocessing } from '../../../public/text-preprocessing';
import './style.css';

const TestTextProcessing: React.FC = () => {
    const [testText, setTestText] = useState('');

    const resultEleRef = useRef<HTMLTextAreaElement>(null);

    useDebounce(() => {
        if (!resultEleRef.current) { return; }
    
        resultEleRef.current.value = textPreprocessing(testText);
    }, 100, [testText])

    return (
        <div className='test-text-processing'>
            <textarea onChange={e => setTestText(e.target.value)} />
            <div className='test-text-processing__icon'>
                <IconFont
                    iconName='#icon-GoChevronRight'
                />
            </div>
            <textarea ref={resultEleRef} disabled />
        </div>
    );
};

export default TestTextProcessing;