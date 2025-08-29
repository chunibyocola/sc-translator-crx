import React, { useCallback, useMemo, useState } from 'react';
import { serviceDefaultValueMap, thirdPartyServiceNames } from '../../../../constants/thirdPartyServiceValues';
import { EnabledThirdPartyServices } from '../../../../types/thirdPartyValue';
import TextField from '../../../../components/TextField';
import Button from '../../../../components/Button';
import './style.css';
import SourceFavicon from '../../../../components/SourceFavicon';
import { getMessage } from '../../../../public/i18n';
import IconFont from '../../../../components/IconFont';
import ConfirmDelete from '../../../collection/components/ConfirmDelete';

const serviceNameSet = new Set(thirdPartyServiceNames);

type ThirdPartyServicesProps = {
    enabledThirdPartyServices: EnabledThirdPartyServices;
    onUpdateServices: (services: EnabledThirdPartyServices) => void;
    onDeleteService: (serviceName: string) => void;
};

const ThirdPartyServices: React.FC<ThirdPartyServicesProps> = ({ enabledThirdPartyServices, onUpdateServices, onDeleteService }) => {
    const [adding, setAdding] = useState(false);
    const [addingService, setAddingService] = useState<typeof thirdPartyServiceNames[number] | null>(null);
    const [updatingService, setUpdatingService] = useState<EnabledThirdPartyServices[number] | null>(null);

    const notAddedServiceNames = useMemo(() => {
        const enabledServiceNameSet = new Set(enabledThirdPartyServices.map(v => v.name));
        return [...serviceNameSet.difference(enabledServiceNameSet)];
    }, [enabledThirdPartyServices]);

    const deleteService = useCallback((serviceName: string) => {
        onDeleteService(serviceName);
    }, [enabledThirdPartyServices, onDeleteService]);

    const addService = useCallback((serviceValue: ServiceValue) => {
        onUpdateServices(enabledThirdPartyServices.concat(serviceValue));
    }, [enabledThirdPartyServices, onUpdateServices]);

    const updateService = useCallback((serviceValue: ServiceValue) => {
        const nextServices = enabledThirdPartyServices.map((value) => {
            if (value.name !== serviceValue.name) {
                return value;
            }
            
            return serviceValue;
        });

        onUpdateServices(nextServices);
    }, [enabledThirdPartyServices, onUpdateServices]);

    return (
        <div>
            {!addingService && !updatingService && <>
                {!adding && <div className='third-party-service__list'>
                    {enabledThirdPartyServices.map((item) => (<Button key={item.name} variant='text' onClick={() => setUpdatingService(item)}>
                        <SourceFavicon source={item.name} />
                    </Button>))}
                    <Button onClick={() => setAdding(true)} variant='contained'>{getMessage('wordAdd')}</Button>
                </div>}
                {adding && <div className='third-party-service__list'>
                    {notAddedServiceNames.map((name) => (<Button key={name} variant='text' onClick={() => setAddingService(name)}>
                        <SourceFavicon source={name} />
                    </Button>))}
                    <Button variant='contained' onClick={() => setAdding(false)}>{getMessage('wordCancel')}</Button>
                </div>}
            </>}
            {addingService && <ServicePanel
                variant='add'
                serviceName={addingService}
                onAdd={(serviceValue) => {
                    addService(serviceValue);
                    setAddingService(null);
                    setAdding(false);
                }}
                onCancel={() => {
                    setAddingService(null);
                }}
            />}
            {updatingService && <ServicePanel
                variant='update'
                serviceName={updatingService.name}
                serviceValue={updatingService}
                onCancel={() => {
                    setUpdatingService(null);
                }}
                onDelete={(serviceName) => {
                    deleteService(serviceName);
                    setUpdatingService(null);
                }}
                onUpdate={(serviceValue) => {
                    updateService(serviceValue);
                    setUpdatingService(null);
                }}
            />}
        </div>
    );
};

type ServiceValue = {
    name: typeof thirdPartyServiceNames[number];
    url?: string;
    model?: string;
    prompt?: string;
    key?: string;
};

type ServicePanelProps = {
    serviceName: typeof thirdPartyServiceNames[number];
    variant: 'add';
    serviceValue?: EnabledThirdPartyServices[number];
    onAdd: (serviceValue: ServiceValue) => void;
    onCancel: () => void;
    onDelete?: (serviceName: string) => void;
    onUpdate?: (serviceValue: ServiceValue) => void;
} | {
    serviceName: typeof thirdPartyServiceNames[number];
    variant: 'update';
    serviceValue: EnabledThirdPartyServices[number];
    onAdd?: (serviceValue: ServiceValue) => void;
    onCancel: () => void;
    onDelete: (serviceName: string) => void;
    onUpdate: (serviceValue: ServiceValue) => void;
};

const ServicePanel: React.FC<ServicePanelProps> = ({ serviceName, variant, serviceValue, onAdd, onCancel, onDelete, onUpdate }) => {
    const [urlText, setUrlText] = useState(serviceValue?.url ?? '');
    const [modelText, setModelText] = useState(serviceValue?.model ?? '');
    const [promptText, setPromptText] = useState(serviceValue?.prompt ?? '');
    const [keyText, setKeyText] = useState(serviceValue?.key ?? '');

    const [confirmDelete, setConfirmDelete] = useState(false);

    const [keyErr, setKeyErr] = useState('');

    const defaultValue = useMemo(() => serviceDefaultValueMap.get(serviceName), [serviceName]);

    const collectServiceValue = (withValue: (serviceValue: ServiceValue) => void) => {
        const nextValue: ServiceValue = {
            name: serviceName
        };

        if (urlText) {
            nextValue.url = urlText;
        }
        if (modelText) {
            nextValue.model = modelText;
        }
        if (promptText) {
            nextValue.prompt = promptText;
        }
        if (keyText) {
            nextValue.key = keyText;
        }
        else {
            setKeyErr(getMessage('apiKeyHelperText'));
            return;
        }

        withValue(nextValue);
    };

    if (!defaultValue) {
        return (
            <div>
                Error: source "{serviceName}" is not available.
                <Button variant='contained' onClick={onCancel}>Cancel</Button>
            </div>
        );
    }

    return (
        <div className='service-panel'>
            <div className='service-panel__head'>
                <SourceFavicon source={serviceName} />
                <Button variant='icon' onClick={onCancel}>
                    <IconFont iconName='#icon-GoX' style={{fontSize: '20px'}} />
                </Button>
            </div>
            {serviceName === 'OpenAI' && <div className='item-description'>{getMessage('openaiDescription')}</div>}
            {Object.hasOwn(defaultValue, 'url') && <TextField
                label='URL'
                placeholder={defaultValue.url}
                defaultValue={urlText}
                onChange={setUrlText}
            />}
            {Object.hasOwn(defaultValue, 'model') && <TextField
                label='Model'
                placeholder={defaultValue.model}
                defaultValue={modelText}
                onChange={setModelText}
            />}
            {Object.hasOwn(defaultValue, 'prompt') && <TextField
                label='Prompt'
                placeholder={defaultValue.prompt || getMessage('commonPrompt')}
                defaultValue={promptText}
                multiline
                rows={4}
                onChange={setPromptText}
                helperText={getMessage('promptHelperText')}
            />}
            {Object.hasOwn(defaultValue, 'key') && <TextField
                label='API Key'
                placeholder={defaultValue.key}
                defaultValue={keyText}
                onChange={(key) => {
                    setKeyText(key);
                    
                    if (keyErr && key) {
                        setKeyErr('');
                    }
                }}
                error={!!keyErr}
                helperText={keyErr}
                required
            />}
            {variant === 'add' && <div className='service-panel__buttons'>
                <div></div>
                <div>
                    <Button
                        variant='contained'
                        onClick={() => {
                            collectServiceValue(onAdd)
                        }}
                    >{getMessage('wordAdd')}</Button>
                </div>
            </div>}
            {variant === 'update' && <div className='service-panel__buttons'>
                <div>
                    <Button variant='outlined' onClick={() => setConfirmDelete(true)}>{getMessage('delete')}</Button>
                    {confirmDelete && <ConfirmDelete
                        onConfirm={() => onDelete(serviceName)}
                        onCancel={() => setConfirmDelete(false)}
                        onClose={() => setConfirmDelete(false)}
                        drawerTitle={getMessage('confirmDeleteService')}
                    />}
                </div>
                <div>
                    <Button
                        variant='contained'
                        onClick={() => {
                            collectServiceValue(onUpdate)
                        }}
                    >{getMessage('wordSave')}</Button>
                </div>
            </div>}
        </div>
    );
};

export default ThirdPartyServices;