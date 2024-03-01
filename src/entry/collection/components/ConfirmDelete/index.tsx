import React, { useState } from 'react';
import Backdrop from '../Backdrop';
import Button from '../../../../components/Button';
import IconFont from '../../../../components/IconFont';
import { getMessage } from '../../../../public/i18n';
import './style.css';

type ConfirmDeleteProps = {
    onConfirm: () => void;
    onCancel: () => void;
    onClose: () => void;
    textPair?: [string, string];
    drawerTitle: string;
    deleteList?: string[];
};

const ConfirmDelete: React.FC<ConfirmDeleteProps> = ({ onConfirm, onCancel, onClose, textPair, drawerTitle, deleteList }) => {
    const [fold, setFold] = useState(true);

    return (
        <Backdrop>
            <div className='confirm-delete'>
                <div className='confirm-delete__close'>
                    <Button
                        variant='icon'
                        onClick={() => {
                            onClose();
                        }}
                    >
                        <IconFont iconName='#icon-GoX' style={{fontSize: '20px'}} />
                    </Button>
                </div>
                <div className='confirm-delete__content'>
                    {textPair && <div className='confirm-delete__content__text-pair'>
                        <div className='text-pair__first'>{textPair[0]}</div>
                        <div className='text-pair__second' title={textPair[1]}>{textPair[1]}</div>
                    </div>}
                    {deleteList ? <Button
                        variant='text'
                        onClick={() => {
                            setFold(!fold);
                        }}
                    >
                        <span>{drawerTitle}</span>
                        <IconFont iconName='#icon-GoChevronDown' style={{minWidth: '1em', rotate: fold ? 'unset' : '180deg'}} />
                    </Button> : <div className='confirm-delete__drawer-title'>
                        {drawerTitle}
                    </div>}
                    {deleteList && <div className='confirm-delete__content__list scrollbar' style={{display: fold ? 'none' : 'block'}}>
                        {deleteList.map((item) => (<div
                            className='confirm-delete__content__list_item'
                            title={item}
                            key={item}
                        >
                            {item}
                        </div>))}
                    </div>}
                </div>
                <div className='confirm-delete__buttons'>
                    <Button
                        variant='outlined'
                        onClick={() => {
                            onConfirm();
                        }}
                    >
                        {getMessage('wordConfirm')}
                    </Button>
                    <Button
                        variant='contained'
                        onClick={() => {
                            onCancel();
                        }}
                    >
                        {getMessage('wordCancel')}
                    </Button>
                </div>
            </div>
        </Backdrop>
    );
};

export default ConfirmDelete;