
import React, { useState, useEffect } from 'react';
import { Vehicle, InspectionData, InspectionPhoto } from '../../types';
import Button from '../ui/Button';
import Input from '../ui/Input';
import InspectionChecklistItem from './InspectionChecklistItem';
import FuelGauge from '../ui/FuelGauge';
import { v4 as uuidv4 } from 'uuid';

interface VehicleInspectionFormProps {
    initialData: Vehicle;
    onDataChange: (data: Vehicle) => void;
}

export const initialInspectionState: InspectionData = {
  mileage: '',
  fuelLevel: '',
  exterior: {
    bodywork: { notes: '', photos: [] },
    windshield: { notes: '', photos: [] },
    tires: { notes: '', photos: [] },
    rims: { notes: '', photos: [] },
    lights: { notes: '', photos: [] },
  },
  interior: {
    upholstery: { notes: '', photos: [] },
    dashboard: { notes: '', photos: [] },
    equipment: { notes: '', photos: [] },
  },
  keys: { count: 1, notes: '' },
  equipmentCheck: {
    ac: 'na',
    audio: 'na',
    windows: 'na',
    locking: 'na',
  },
  technical: {
    engineOil: { notes: '', photos: [] },
    brakeFluid: { notes: '', photos: [] },
    coolant: { notes: '', photos: [] },
    powerSteering: { notes: '', photos: [] },
    washerFluid: { notes: '', photos: [] },
    batteryTest: '',
    batteryHealth: 0,
    brakeLifePercentage: 0,
    suspension: { notes: '', photos: [] },
    exhaust: { notes: '', photos: [] },
    accessoryBelt: { notes: '', photos: [] },
  },
  electronicScan: {
    dtcCodes: '',
    realTimeParams: '',
    photos: [],
  },
};

type EquipmentCheckData = InspectionData['equipmentCheck'];
type EquipmentItemKey = keyof EquipmentCheckData;

const equipmentItems: { key: EquipmentItemKey; label: string }[] = [
    { key: 'ac', label: 'Aire Acondicionado' },
    { key: 'audio', label: 'Sistema de Audio' },
    { key: 'windows', label: 'Elevalunas Eléctricos' },
    { key: 'locking', label: 'Cierre Centralizado' },
];


const EquipmentCheckItem: React.FC<{
    itemKey: EquipmentItemKey;
    label: string;
    value: 'ok' | 'nok' | 'na';
    onChange: (item: EquipmentItemKey, value: 'ok' | 'nok' | 'na') => void;
}> = ({ itemKey, label, value, onChange }) => (
    <div className="flex items-center justify-between bg-kia-dark-2 p-3 rounded-lg">
        <span className="text-sm font-medium text-kia-light">{label}</span>
        <div className="flex items-center space-x-2">
            {['ok', 'nok', 'na'].map(status => (
                <label key={status} className={`px-3 py-1 text-xs font-bold rounded-full cursor-pointer transition-colors ${value === status ? 'bg-kia-primary text-black' : 'bg-kia-dark hover:bg-gray-700 text-gray-300'}`}>
                    <input
                        type="radio"
                        name={itemKey}
                        value={status}
                        checked={value === status}
                        onChange={(e) => onChange(itemKey, e.target.value as 'ok' | 'nok' | 'na')}
                        className="sr-only"
                    />
                    {status.toUpperCase()}
                </label>
            ))}
        </div>
    </div>
);


const VehicleInspectionForm: React.FC<VehicleInspectionFormProps> = ({ initialData, onDataChange }) => {
    const [inspectionData, setInspectionData] = useState<InspectionData>(
        initialData.inspection ? { ...initialInspectionState, ...initialData.inspection } : initialInspectionState
    );

    useEffect(() => {
        setInspectionData(initialData.inspection ? { ...initialInspectionState, ...initialData.inspection } : initialInspectionState);
    }, [initialData.inspection]);

    const updateParentData = (updatedInspectionData: InspectionData) => {
        setInspectionData(updatedInspectionData);
        onDataChange({ ...initialData, inspection: updatedInspectionData });
    };
    
    const handleItemChange = <T extends keyof InspectionData>(section: T, value: InspectionData[T]) => {
        updateParentData({ ...inspectionData, [section]: value });
    };

    const handleNestedChange = <S extends 'exterior' | 'interior', I extends keyof InspectionData[S]>(section: S, item: I, field: 'notes', value: string) => {
        const updatedSection = {
            ...inspectionData[section],
            [item]: {
                ...inspectionData[section][item],
                [field]: value,
            }
        };
        updateParentData({ ...inspectionData, [section]: updatedSection });
    };
    
    const handleAddPhoto = <S extends 'exterior' | 'interior', I extends keyof InspectionData[S]>(section: S, item: I, url: string) => {
        const currentItem = inspectionData[section][item];
        const newPhotos = [...currentItem.photos, { id: uuidv4(), url }];
        const updatedSection = {
            ...inspectionData[section],
            [item]: {
                ...currentItem,
                photos: newPhotos,
            }
        };
        updateParentData({ ...inspectionData, [section]: updatedSection });
    };
    
    const handleRemovePhoto = <S extends 'exterior' | 'interior', I extends keyof InspectionData[S]>(section: S, item: I, photoId: string) => {
        const currentItem = inspectionData[section][item];
        const filteredPhotos = currentItem.photos.filter(p => p.id !== photoId);
        const updatedSection = {
            ...inspectionData[section],
            [item]: {
                ...currentItem,
                photos: filteredPhotos,
            }
        };
        updateParentData({ ...inspectionData, [section]: updatedSection });
    };

    const handleEquipmentCheckChange = (item: EquipmentItemKey, value: 'ok' | 'nok' | 'na') => {
        updateParentData({
            ...inspectionData,
            equipmentCheck: { ...inspectionData.equipmentCheck, [item]: value }
        });
    };

    return (
        <form onSubmit={e => e.preventDefault()} className="space-y-8">
            
            <fieldset>
                <h3 className="text-lg font-medium leading-6 text-kia-primary border-b border-kia-dark-2 pb-2 mb-4">Datos del Vehículo</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-center">
                    <Input label="Kilometraje Actual" id="mileage" type="number" value={inspectionData.mileage} onChange={e => handleItemChange('mileage', e.target.value)} required />
                    <div className="sm:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4 items-center bg-kia-dark-2 p-4 rounded-lg">
                         <div className="flex flex-col items-center">
                            <label className="block text-sm font-medium text-kia-gray mb-2">Nivel de Combustible</label>
                            <div className="flex items-center space-x-2 sm:space-x-4">
                                {['1/4', '1/2', '3/4', 'Lleno'].map(level => (
                                    <label key={level} className={`px-3 py-1.5 text-sm rounded-md cursor-pointer transition-colors ${inspectionData.fuelLevel === level ? 'bg-kia-primary text-black font-bold' : 'bg-kia-dark text-kia-light hover:bg-gray-700'}`}>
                                        <input type="radio" name="fuelLevel" value={level} checked={inspectionData.fuelLevel === level} onChange={e => handleItemChange('fuelLevel', e.target.value as InspectionData['fuelLevel'])} className="sr-only"/>
                                        <span>{level}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                        <div className="flex justify-center items-center">
                           <FuelGauge level={inspectionData.fuelLevel} />
                        </div>
                    </div>
                </div>
            </fieldset>

            <fieldset className="space-y-4">
                <h3 className="text-lg font-medium leading-6 text-kia-primary border-b border-kia-dark-2 pb-2 mb-4">Inspección Visual Externa</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InspectionChecklistItem label="Carrocería (Rayones, Abolladuras)" notes={inspectionData.exterior.bodywork.notes} photos={inspectionData.exterior.bodywork.photos} onNotesChange={notes => handleNestedChange('exterior', 'bodywork', 'notes', notes)} onAddPhoto={url => handleAddPhoto('exterior', 'bodywork', url)} onRemovePhoto={id => handleRemovePhoto('exterior', 'bodywork', id)} />
                    <InspectionChecklistItem label="Parabrisas y Cristales" notes={inspectionData.exterior.windshield.notes} photos={inspectionData.exterior.windshield.photos} onNotesChange={notes => handleNestedChange('exterior', 'windshield', 'notes', notes)} onAddPhoto={url => handleAddPhoto('exterior', 'windshield', url)} onRemovePhoto={id => handleRemovePhoto('exterior', 'windshield', id)} />
                    <InspectionChecklistItem label="Llantas y Neumáticos" notes={inspectionData.exterior.tires.notes} photos={inspectionData.exterior.tires.photos} onNotesChange={notes => handleNestedChange('exterior', 'tires', 'notes', notes)} onAddPhoto={url => handleAddPhoto('exterior', 'tires', url)} onRemovePhoto={id => handleRemovePhoto('exterior', 'tires', id)} />
                    <InspectionChecklistItem label="Rines" notes={inspectionData.exterior.rims.notes} photos={inspectionData.exterior.rims.photos} onNotesChange={notes => handleNestedChange('exterior', 'rims', 'notes', notes)} onAddPhoto={url => handleAddPhoto('exterior', 'rims', url)} onRemovePhoto={id => handleRemovePhoto('exterior', 'rims', id)} />
                    <InspectionChecklistItem label="Luces Exteriores" notes={inspectionData.exterior.lights.notes} photos={inspectionData.exterior.lights.photos} onNotesChange={notes => handleNestedChange('exterior', 'lights', 'notes', notes)} onAddPhoto={url => handleAddPhoto('exterior', 'lights', url)} onRemovePhoto={id => handleRemovePhoto('exterior', 'lights', id)} />
                </div>
            </fieldset>

            <fieldset className="space-y-4">
                <h3 className="text-lg font-medium leading-6 text-kia-primary border-b border-kia-dark-2 pb-2 mb-4">Inspección Visual Interna</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InspectionChecklistItem label="Tapicería y Alfombras" notes={inspectionData.interior.upholstery.notes} photos={inspectionData.interior.upholstery.photos} onNotesChange={notes => handleNestedChange('interior', 'upholstery', 'notes', notes)} onAddPhoto={url => handleAddPhoto('interior', 'upholstery', url)} onRemovePhoto={id => handleRemovePhoto('interior', 'upholstery', id)} />
                    <InspectionChecklistItem label="Tablero y Controles" notes={inspectionData.interior.dashboard.notes} photos={inspectionData.interior.dashboard.photos} onNotesChange={notes => handleNestedChange('interior', 'dashboard', 'notes', notes)} onAddPhoto={url => handleAddPhoto('interior', 'dashboard', url)} onRemovePhoto={id => handleRemovePhoto('interior', 'dashboard', id)} />
                    <InspectionChecklistItem label="Accesorios y Equipamiento Interior" notes={inspectionData.interior.equipment.notes} photos={inspectionData.interior.equipment.photos} onNotesChange={notes => handleNestedChange('interior', 'equipment', 'notes', notes)} onAddPhoto={url => handleAddPhoto('interior', 'equipment', url)} onRemovePhoto={id => handleRemovePhoto('interior', 'equipment', id)} />
                    <div className="bg-kia-dark-2 p-4 rounded-lg">
                         <label className="block text-sm font-medium text-kia-light">Llaves</label>
                         <div className="flex items-center space-x-4 mt-1">
                            <Input containerClassName="flex-1" label="" id="keys-count" type="number" value={inspectionData.keys.count} onChange={e => handleItemChange('keys', {...inspectionData.keys, count: parseInt(e.target.value,10) || 0})} />
                            <Input containerClassName="flex-grow-[3]" label="" id="keys-notes" placeholder="Notas sobre las llaves" value={inspectionData.keys.notes} onChange={e => handleItemChange('keys', {...inspectionData.keys, notes: e.target.value})} />
                         </div>
                    </div>
                </div>
            </fieldset>

             <fieldset>
                <h3 className="text-lg font-medium leading-6 text-kia-primary border-b border-kia-dark-2 pb-2 mb-4">Verificación de Equipamiento</h3>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {equipmentItems.map(item => (
                        <EquipmentCheckItem
                            key={item.key}
                            itemKey={item.key}
                            label={item.label}
                            value={inspectionData.equipmentCheck[item.key]}
                            onChange={handleEquipmentCheckChange}
                        />
                    ))}
                </div>
            </fieldset>
        </form>
    );
};

export default VehicleInspectionForm;