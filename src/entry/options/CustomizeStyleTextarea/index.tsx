import React, { useRef, useState } from 'react';
import { getMessage } from '../../../public/i18n';
import './style.css';

type CustomizeStyleTextareaProps = {
    customizeStyleText: string;
    onSave: (customizeStyleText: string) => void;
};

const CustomizeStyleTextarea: React.FC<CustomizeStyleTextareaProps> = ({ customizeStyleText, onSave }) => {
    const [changed, setChanged] = useState(false);

    const textareaEleRef = useRef<HTMLTextAreaElement>(null);

    return (
        <div className='customize-style-textarea'>
            <textarea
                ref={textareaEleRef}
                placeholder={'#sc-translator-root {\n    /* some styles */\n}'}
                defaultValue={customizeStyleText}
                onKeyUp={() => {
                    !changed && customizeStyleText !== textareaEleRef.current?.value && setChanged(true);
                }}
            ></textarea>
            <button
                disabled={!changed}
                onClick={() => {
                    textareaEleRef.current && onSave(textareaEleRef.current.value);
                    setChanged(false);
                }}
            >
                {getMessage('wordSave')}
            </button>
            <button
                disabled={!changed}
                onClick={() => {
                    textareaEleRef.current && (textareaEleRef.current.value = customizeStyleText);
                    setChanged(false);
                }}
            >
                {getMessage('wordCancel')}
            </button>
        </div>
    )
};

export default CustomizeStyleTextarea;