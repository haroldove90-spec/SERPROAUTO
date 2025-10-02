
import React, { useState, useEffect } from 'react';
import { Vehicle, VehicleStatus, PriorityLevel, Customer, Role } from '../../types';
import Input from '../ui/Input';
import { useAuth } from '../../context/AuthContext';

interface VehicleFormProps {
    initialData: Vehicle;
    onDataChange: (data: Vehicle) => void;
}

const VehicleForm: React.FC<VehicleFormProps> = ({ initialData, onDataChange }) => {
    const { user } = useAuth();
    const [formData, setFormData] = useState<Vehicle>(initialData);

    useEffect(() => {
        setFormData(initialData);
    }, [initialData]);
    
    const isMecanico = user?.role === Role.Mecanico;
    const isAsesor = user?.role === Role.Asesor;
    
    // A mechanic can edit general info only when creating a new vehicle.
    const isReadOnlyForMechanic = isMecanico && !!initialData.id;


    const updateFormData = (updatedData: Vehicle) => {
        setFormData(updatedData);
        onDataChange(updatedData);
    };

    const handleChange = (section: 'customer', field: keyof Customer, value: string | number) => {
        const updated = {
            ...formData,
            [section]: {
                ...formData[section],
                [field]: value
            }
        };
        updateFormData(updated);
    };

    const handleRootChange = (field: keyof Omit<Vehicle, 'customer'>, value: string | number | undefined) => {
        const updated = {
            ...formData,
            [field]: value
        };
        updateFormData(updated);
    };
    
    return (
        <form onSubmit={e => e.preventDefault()} className="space-y-6">
            <fieldset disabled={isReadOnlyForMechanic}>
                <h3 className="text-lg font-medium leading-6 text-kia-primary border-b border-kia-dark-2 pb-2 mb-4">Información del Cliente</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input label="Nombre Completo" id="customer-name" value={formData.customer.name} onChange={e => handleChange('customer', 'name', e.target.value)} required />
                    <Input label="Teléfono" id="customer-phone" value={formData.customer.phone} onChange={e => handleChange('customer', 'phone', e.target.value)} required />
                    <Input label="Email" id="customer-email" type="email" value={formData.customer.email} onChange={e => handleChange('customer', 'email', e.target.value)} />
                </div>
            </fieldset>
            
            <fieldset disabled={isReadOnlyForMechanic}>
                <h3 className="text-lg font-medium leading-6 text-kia-primary border-b border-kia-dark-2 pb-2 mb-4">Información del Vehículo</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input label="Marca" id="make" value={formData.make} onChange={e => handleRootChange('make', e.target.value)} required />
                    <Input label="Modelo" id="model" value={formData.model} onChange={e => handleRootChange('model', e.target.value)} required />
                    <Input label="Año" id="year" type="number" value={formData.year} onChange={e => handleRootChange('year', parseInt(e.target.value, 10))} required />
                    <Input label="Placa" id="licensePlate" value={formData.licensePlate} onChange={e => handleRootChange('licensePlate', e.target.value.toUpperCase())} required />
                    <Input label="VIN" id="vin" value={formData.vin} onChange={e => handleRootChange('vin', e.target.value.toUpperCase())} containerClassName="sm:col-span-2" />
                </div>
            </fieldset>
            
            {initialData.id && (
                <fieldset disabled={isAsesor}>
                    <h3 className="text-lg font-medium leading-6 text-kia-primary border-b border-kia-dark-2 pb-2 mb-4">Estado del Servicio</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="status" className="block text-sm font-medium text-kia-gray">Estado</label>
                            <select id="status" value={formData.status} onChange={e => handleRootChange('status', e.target.value)} className="mt-1 block w-full bg-kia-dark-2 border border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-kia-primary focus:border-kia-primary sm:text-sm text-white disabled:opacity-50">
                                {Object.values(VehicleStatus).map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="priority" className="block text-sm font-medium text-kia-gray">Prioridad</label>
                            <select id="priority" value={formData.priority} onChange={e => handleRootChange('priority', e.target.value)} className="mt-1 block w-full bg-kia-dark-2 border border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-kia-primary focus:border-kia-primary sm:text-sm text-white disabled:opacity-50">
                                {Object.values(PriorityLevel).map(p => <option key={p} value={p}>{p}</option>)}
                            </select>
                        </div>
                        <Input label="Técnico Asignado" id="technician" value={formData.technician || ''} onChange={e => handleRootChange('technician', e.target.value)} />
                        <Input label="Fecha Estimada de Entrega" id="estimatedCompletionDate" type="date" value={formData.estimatedCompletionDate || ''} onChange={e => handleRootChange('estimatedCompletionDate', e.target.value)} />
                        <div className="sm:col-span-2">
                             <label htmlFor="workOrderNotes" className="block text-sm font-medium text-kia-gray">Notas de la Orden</label>
                             <textarea id="workOrderNotes" value={formData.workOrderNotes || ''} onChange={e => handleRootChange('workOrderNotes', e.target.value)} rows={3} className="mt-1 block w-full bg-kia-dark-2 border border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-kia-primary focus:border-kia-primary sm:text-sm text-white disabled:opacity-50"></textarea>
                        </div>
                    </div>
                </fieldset>
            )}
        </form>
    );
};

export default VehicleForm;