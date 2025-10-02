import React, { useState, useEffect } from 'react';
import { InspectionData, InspectionPhoto } from '../../types';
import InspectionChecklistItem from './InspectionChecklistItem';
import { v4 as uuidv4 } from 'uuid';

interface ElectronicScanFormProps {
    initialData: InspectionData['electronicScan'];
    onDataChange: (data: InspectionData['electronicScan']) => void;
}

const ElectronicScanForm: React.FC<ElectronicScanFormProps> = ({ initialData, onDataChange }) => {
    const [scanData, setScanData] = useState(initialData);

    useEffect(() => {
        setScanData(initialData);
    }, [initialData]);

    const updateParentData = (updatedData: InspectionData['electronicScan']) => {
        setScanData(updatedData);
        onDataChange(updatedData);
    };

    const handleChange = (field: 'dtcCodes' | 'realTimeParams', value: string) => {
        updateParentData({ ...scanData, [field]: value });
    };

    const handleAddPhoto = (url: string) => {
        const newPhotos = [...scanData.photos, { id: uuidv4(), url }];
        updateParentData({ ...scanData, photos: newPhotos });
    };
    
    const handleRemovePhoto = (photoId: string) => {
        const filteredPhotos = scanData.photos.filter(p => p.id !== photoId);
        updateParentData({ ...scanData, photos: filteredPhotos });
    };

    return (
        <form onSubmit={e => e.preventDefault()} className="space-y-8">
            <fieldset>
                <h3 className="text-lg font-medium leading-6 text-kia-primary border-b border-kia-dark-2 pb-2 mb-4">Diagnóstico por Computadora</h3>
                <div className="space-y-4">
                    <div>
                        <label htmlFor="dtc-codes" className="block text-sm font-medium text-kia-light">Códigos de Falla (DTCs)</label>
                        <textarea
                            id="dtc-codes"
                            value={scanData.dtcCodes}
                            onChange={(e) => handleChange('dtcCodes', e.target.value)}
                            rows={4}
                            placeholder="Ej: P0300, U0121, etc."
                            className="mt-1 block w-full bg-kia-dark-2 border border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-kia-primary focus:border-kia-primary sm:text-sm text-white"
                        />
                    </div>
                    <div>
                        <label htmlFor="real-time-params" className="block text-sm font-medium text-kia-light">Parámetros en Tiempo Real</label>
                        <textarea
                            id="real-time-params"
                            value={scanData.realTimeParams}
                            onChange={(e) => handleChange('realTimeParams', e.target.value)}
                            rows={4}
                            placeholder="Anotaciones sobre sensores de oxígeno, temperatura, etc."
                            className="mt-1 block w-full bg-kia-dark-2 border border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-kia-primary focus:border-kia-primary sm:text-sm text-white"
                        />
                    </div>
                     <InspectionChecklistItem 
                        label="Fotos del Escáner" 
                        notes="" 
                        photos={scanData.photos} 
                        onNotesChange={() => {}} 
                        onAddPhoto={handleAddPhoto} 
                        onRemovePhoto={handleRemovePhoto} 
                    />
                </div>
            </fieldset>
        </form>
    );
};

export default ElectronicScanForm;
