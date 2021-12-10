import React, { useRef, useState } from 'react';
import Button from '../../../components/Button';
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
            <Button
                variant='contained'
                disabled={!changed}
                onClick={() => {
                    textareaEleRef.current && onSave(textareaEleRef.current.value);
                    setChanged(false);
                }}
            >
                {getMessage('wordSave')}
            </Button>
            <Button
                variant='text'
                disabled={!changed}
                onClick={() => {
                    textareaEleRef.current && (textareaEleRef.current.value = customizeStyleText);
                    setChanged(false);
                }}
            >
                {getMessage('wordCancel')}
            </Button>
        </div>
    )
};

export default CustomizeStyleTextarea;