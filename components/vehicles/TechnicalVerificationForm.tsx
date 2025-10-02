
import React, { useState, useEffect } from 'react';
import { InspectionData, InspectionPhoto } from '../../types';
import InspectionChecklistItem from './InspectionChecklistItem';
import BatteryGauge from '../ui/BatteryGauge';
import BrakeLifeIndicator from '../ui/BrakeLifeIndicator';
import { v4 as uuidv4 } from 'uuid';

interface TechnicalVerificationFormProps {
    initialData: InspectionData['technical'];
    onDataChange: (data: InspectionData['technical']) => void;
}

const TechnicalVerificationForm: React.FC<TechnicalVerificationFormProps> = ({ initialData, onDataChange }) => {
    const [technicalData, setTechnicalData] = useState(initialData);

    useEffect(() => {
        setTechnicalData(initialData);
    }, [initialData]);

    const updateParentData = (updatedData: InspectionData['technical']) => {
        setTechnicalData(updatedData);
        onDataChange(updatedData);
    };
    
    const handleItemChange = (field: keyof InspectionData['technical'], value: any) => {
        updateParentData({ ...technicalData, [field]: value });
    };

    const handleNestedChange = <I extends keyof InspectionData['technical']>(item: I, field: 'notes', value: string) => {
        updateParentData({
            ...technicalData,
            [item]: {
                ...(technicalData[item] as object),
                [field]: value,
            }
        });
    };

    const handleAddPhoto = <I extends keyof InspectionData['technical']>(item: I, url: string) => {
        const currentItem = technicalData[item] as { notes: string; photos: InspectionPhoto[] };
        const newPhotos = [...currentItem.photos, { id: uuidv4(), url }];
        updateParentData({ ...technicalData, [item]: { ...currentItem, photos: newPhotos } });
    };

    const handleRemovePhoto = <I extends keyof InspectionData['technical']>(item: I, photoId: string) => {
        const currentItem = technicalData[item] as { notes: string; photos: InspectionPhoto[] };
        const filteredPhotos = currentItem.photos.filter(p => p.id !== photoId);
        updateParentData({ ...technicalData, [item]: { ...currentItem, photos: filteredPhotos } });
    };

    return (
        <form onSubmit={e => e.preventDefault()} className="space-y-8">
             <fieldset className="space-y-4">
                <h3 className="text-lg font-medium leading-6 text-kia-primary border-b border-kia-dark-2 pb-2 mb-4">Nivel y Estado de Fluidos</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InspectionChecklistItem label="Aceite del Motor (Nivel/Color)" notes={technicalData.engineOil.notes} photos={technicalData.engineOil.photos} onNotesChange={notes => handleNestedChange('engineOil', 'notes', notes)} onAddPhoto={url => handleAddPhoto('engineOil', url)} onRemovePhoto={id => handleRemovePhoto('engineOil', id)} />
                    <InspectionChecklistItem label="Líquido de Frenos (Nivel/Color)" notes={technicalData.brakeFluid.notes} photos={technicalData.brakeFluid.photos} onNotesChange={notes => handleNestedChange('brakeFluid', 'notes', notes)} onAddPhoto={url => handleAddPhoto('brakeFluid', url)} onRemovePhoto={id => handleRemovePhoto('brakeFluid', id)} />
                    <InspectionChecklistItem label="Líquido Refrigerante (Nivel/Concentración)" notes={technicalData.coolant.notes} photos={technicalData.coolant.photos} onNotesChange={notes => handleNestedChange('coolant', 'notes', notes)} onAddPhoto={url => handleAddPhoto('coolant', url)} onRemovePhoto={id => handleRemovePhoto('coolant', id)} />
                    <InspectionChecklistItem label="Líquido de Dirección Hidráulica" notes={technicalData.powerSteering.notes} photos={technicalData.powerSteering.photos} onNotesChange={notes => handleNestedChange('powerSteering', 'notes', notes)} onAddPhoto={url => handleAddPhoto('powerSteering', url)} onRemovePhoto={id => handleRemovePhoto('powerSteering', id)} />
                    <InspectionChecklistItem label="Líquido Limpiaparabrisas" notes={technicalData.washerFluid.notes} photos={technicalData.washerFluid.photos} onNotesChange={notes => handleNestedChange('washerFluid', 'notes', notes)} onAddPhoto={url => handleAddPhoto('washerFluid', url)} onRemovePhoto={id => handleRemovePhoto('washerFluid', id)} />
                </div>
            </fieldset>

            <fieldset className="space-y-4">
                <h3 className="text-lg font-medium leading-6 text-kia-primary border-b border-kia-dark-2 pb-2 mb-4">Batería y Frenos</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-kia-dark-2 p-4 rounded-lg flex flex-col items-center justify-center space-y-4">
                         <label htmlFor="batteryTest" className="text-sm font-medium text-kia-light">Prueba de Batería</label>
                         <BatteryGauge health={technicalData.batteryHealth} />
                         <input
                            type="range"
                            min="0"
                            max="100"
                            step="10"
                            value={technicalData.batteryHealth}
                            onChange={(e) => handleItemChange('batteryHealth', parseInt(e.target.value, 10))}
                            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-kia-primary"
                        />
                         <select id="batteryTest" value={technicalData.batteryTest} onChange={e => handleItemChange('batteryTest', e.target.value)} className="block w-full bg-kia-dark border border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-kia-primary focus:border-kia-primary sm:text-sm text-white">
                            <option value="">Estado General</option>
                            <option value="Buena">Buena</option>
                            <option value="Regular">Regular</option>
                            <option value="Reemplazar">Reemplazar</option>
                        </select>
                    </div>
                     <div className="bg-kia-dark-2 p-4 rounded-lg flex flex-col items-center justify-center space-y-4">
                        <label className="text-sm font-medium text-kia-light">Vida de Frenos Restante</label>
                        <BrakeLifeIndicator percentage={technicalData.brakeLifePercentage} />
                        <input
                            type="range"
                            min="0"
                            max="100"
                            step="5"
                            value={technicalData.brakeLifePercentage}
                            onChange={(e) => handleItemChange('brakeLifePercentage', parseInt(e.target.value, 10))}
                            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-kia-primary"
                        />
                    </div>
                </div>
            </fieldset>

             <fieldset className="space-y-4">
                <h3 className="text-lg font-medium leading-6 text-kia-primary border-b border-kia-dark-2 pb-2 mb-4">Sub-Chasis</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                     <InspectionChecklistItem label="Suspensión (Fugas/Soportes)" notes={technicalData.suspension.notes} photos={technicalData.suspension.photos} onNotesChange={notes => handleNestedChange('suspension', 'notes', notes)} onAddPhoto={url => handleAddPhoto('suspension', url)} onRemovePhoto={id => handleRemovePhoto('suspension', id)} />
                     <InspectionChecklistItem label="Sistema de Escape (Fugas/Ruido)" notes={technicalData.exhaust.notes} photos={technicalData.exhaust.photos} onNotesChange={notes => handleNestedChange('exhaust', 'notes', notes)} onAddPhoto={url => handleAddPhoto('exhaust', url)} onRemovePhoto={id => handleRemovePhoto('exhaust', id)} />
                     <InspectionChecklistItem label="Correa de Accesorios (Grietas)" notes={technicalData.accessoryBelt.notes} photos={technicalData.accessoryBelt.photos} onNotesChange={notes => handleNestedChange('accessoryBelt', 'notes', notes)} onAddPhoto={url => handleAddPhoto('accessoryBelt', url)} onRemovePhoto={id => handleRemovePhoto('accessoryBelt', id)} />
                </div>
            </fieldset>
        </form>
    );
};

export default TechnicalVerificationForm;
