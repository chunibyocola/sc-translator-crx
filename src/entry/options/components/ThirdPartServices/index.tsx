import React, { useCallback, useMemo, useState } from 'react';
import { serviceDefaultValueMap, thirdPartyServiceNames } from '../../../../constants/thirdPartyServiceValues';
import { EnabledThirdPartyServices } from '../../../../types/thirdPartyValue';
import TextField from '../../../../components/TextField';
import Button from '../../../../components/Button';
import './style.css';
import SourceFavicon from '../../../../components/SourceFavicon';
import scOptions from '../../../../public/sc-options';
import { getMessage } from '../../../../public/i18n';

const serviceNameSet = new Set(thirdPartyServiceNames);

type ThirdPartyServicesProps = {
    enabledThirdPartyServices: EnabledThirdPartyServices;
    enabledSources: string[];
};

const ThirdPartyServices: React.FC<ThirdPartyServicesProps> = ({ enabledThirdPartyServices, enabledSources }) => {
    const [adding, setAdding] = useState(false);
    const [addingService, setAddingService] = useState<typeof thirdPartyServiceNames[number] | null>(null);
    const [updatingService, setUpdatingService] = useState<EnabledThirdPartyServices[number] | null>(null);

    const notAddedServiceNames = useMemo(() => {
        const enabledServiceNameSet = new Set(enabledThirdPartyServices.map(v => v.name));
        return [...serviceNameSet.difference(enabledServiceNameSet)];
    }, [enabledThirdPartyServices]);

    const deleteService = useCallback((serviceName: string) => {
        scOptions.set({
            enabledThirdPartyServices: enabledThirdPartyServices.filter(v => v.name !== serviceName),
            multipleTranslateSourceList: enabledSources.filter(v => v !== serviceName)
        });
    }, [enabledThirdPartyServices]);

    const addService = useCallback((serviceValue: ServiceValue) => {
        scOptions.set({ enabledThirdPartyServices: enabledThirdPartyServices.concat(serviceValue) });
    }, [enabledThirdPartyServices]);

    const updateService = useCallback((serviceValue: ServiceValue) => {
        const nextServices = enabledThirdPartyServices.map((value) => {
            if (value.name !== serviceValue.name) {
                return value;
            }
            
            return serviceValue;
        });

        scOptions.set({ enabledThirdPartyServices: nextServices });
    }, [enabledThirdPartyServices]);

    return (
        <div>
            {!addingService && !updatingService && <>
                {!adding && <div className='third-party-service__list'>
                    {enabledThirdPartyServices.map((item) => (<Button key={item.name} variant='text' onClick={() => setUpdatingService(item)}>
                        <SourceFavicon source={item.name} />
                    </Button>))}
                    <Button onClick={() => setAdding(true)} variant='contained'>Add</Button>
                </div>}
                {adding && <div className='third-party-service__list'>
                    {notAddedServiceNames.map((name) => (<Button key={name} variant='text' onClick={() => setAddingService(name)}>
                        <SourceFavicon source={name} />
                    </Button>))}
                    <Button variant='contained' onClick={() => setAdding(false)}>Cancel</Button>
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
            setKeyErr('Key can not be empty');
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
            <div><SourceFavicon source={serviceName} /></div>
            {Object.hasOwn(defaultValue, 'url') && <TextField
                label='url'
                placeholder={defaultValue.url}
                defaultValue={urlText}
                onChange={setUrlText}
            />}
            {Object.hasOwn(defaultValue, 'model') && <TextField
                label='model'
                placeholder={defaultValue.model}
                defaultValue={modelText}
                onChange={setModelText}
            />}
            {Object.hasOwn(defaultValue, 'prompt') && <TextField
                label='prompt'
                placeholder={defaultValue.prompt || getMessage('commonPrompt')}
                defaultValue={promptText}
                multiline
                rows={4}
                onChange={setPromptText}
            />}
            {Object.hasOwn(defaultValue, 'key') && <TextField
                label='key'
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
                    <Button variant='text' onClick={onCancel}>Cancel</Button>
                    <Button
                        variant='contained'
                        onClick={() => {
                            collectServiceValue(onAdd)
                        }}
                    >Add</Button>
                </div>
            </div>}
            {variant === 'update' && <div className='service-panel__buttons'>
                <div>
                    <Button variant='contained' onClick={() => onDelete(serviceName)}>Delete</Button>
                </div>
                <div>
                    <Button variant='text' onClick={onCancel}>Cancel</Button>
                    <Button
                        variant='contained'
                        onClick={() => {
                            collectServiceValue(onUpdate)
                        }}
                    >Update</Button>
                </div>
            </div>}
        </div>
    );
};

export default ThirdPartyServices;