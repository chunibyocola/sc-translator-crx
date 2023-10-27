import React, { useRef, useState } from 'react';
import IconFont from '../../../../components/IconFont';
import { useDebounce } from '../../../../public/react-use';
import { textPreprocessing, selectedTextPreprocessing } from '../../../../public/text-preprocessing';
import './style.css';

type TestTextProcessingProps = {
    preprocessType: 'before-sending-request' | 'after-selecting-text'
};

const TestTextProcessing: React.FC<TestTextProcessingProps> = ({ preprocessType }) => {
    const [testText, setTestText] = useState('');

    const resultEleRef = useRef<HTMLTextAreaElement>(null);

    useDebounce(() => {
        if (!resultEleRef.current) { return; }
    
        if (preprocessType === 'before-sending-request') {
            resultEleRef.current.value = textPreprocessing(testText);
        }
        else if (preprocessType === 'after-selecting-text') {
            resultEleRef.current.value = selectedTextPreprocessing(testText);
        }
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