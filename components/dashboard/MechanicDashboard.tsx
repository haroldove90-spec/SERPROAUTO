
import React, { useState, useMemo } from 'react';
import { Vehicle, VehicleStatus, PriorityLevel, InspectionData } from '../../types';
import { useAuth } from '../../context/AuthContext';
import VehicleTable from '../vehicles/VehicleTable';
import Button from '../ui/Button';
import Modal from '../ui/Modal';
import VehicleForm from '../vehicles/VehicleForm';
import TechnicalVerificationForm from '../vehicles/TechnicalVerificationForm';
import ElectronicScanForm from '../vehicles/ElectronicScanForm';
import { initialInspectionState } from '../vehicles/VehicleInspectionForm';

interface MechanicDashboardProps {
  vehicles: Vehicle[];
  onAddVehicle: (vehicle: Omit<Vehicle, 'id'>) => void;
  onUpdateVehicle: (vehicle: Vehicle) => void;
}

const MechanicDashboard: React.FC<MechanicDashboardProps> = ({ vehicles, onAddVehicle, onUpdateVehicle }) => {
    const { user } = useAuth();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [activeTab, setActiveTab] = useState('general');
    const [formData, setFormData] = useState<Vehicle | null>(null);

    const mechanicVehicles = useMemo(() => {
        if (!user) return [];
        return vehicles.filter(v => v.technician?.toLowerCase() === user.username.toLowerCase());
    }, [vehicles, user]);

    const handleOpenModal = (vehicle?: Vehicle) => {
        if (vehicle) {
            setFormData(JSON.parse(JSON.stringify(vehicle))); // Deep copy
            setIsEditing(true);
        } else {
            const newVehicleTemplate: Vehicle = {
                id: '',
                make: '', model: '', year: new Date().getFullYear(), vin: '', licensePlate: '',
                status: VehicleStatus.InDiagnosis,
                customer: { id: '', name: '', phone: '', email: '' },
                entryDate: new Date().toISOString().split('T')[0],
                priority: PriorityLevel.Medium,
                technician: user?.username || '',
                workOrderNotes: '',
                inspection: initialInspectionState,
            };
            setFormData(newVehicleTemplate);
            setIsEditing(false);
        }
        setActiveTab('general');
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setFormData(null);
        setIsEditing(false);
    };

    const handleSaveVehicle = () => {
        if (!formData) return;
        
        if (isEditing) {
            onUpdateVehicle(formData);
        } else {
            const { id, ...vehicleData } = formData;
            onAddVehicle(vehicleData);
        }
        handleCloseModal();
    };

    const updateInspectionData = (inspectionUpdate: Partial<InspectionData>) => {
        setFormData(prevData => {
           if (!prevData) return null;
           const currentInspection = prevData.inspection ? { ...initialInspectionState, ...prevData.inspection } : initialInspectionState;
           const updatedInspection = { ...currentInspection, ...inspectionUpdate };
           return { ...prevData, inspection: updatedInspection };
       });
    }

    const modalTitle = isEditing ? "Detalles del Vehículo" : "Registrar Nuevo Vehículo";

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold text-kia-light">Mis Vehículos Asignados</h2>
                <Button onClick={() => handleOpenModal()}>Registrar Ingreso</Button>
            </div>
            
            <VehicleTable vehicles={mechanicVehicles} onEdit={handleOpenModal} />

            {isModalOpen && formData && (
                <Modal onClose={handleCloseModal} title={modalTitle}>
                    <div className="border-b border-kia-dark-2 mb-6">
                        <nav className="-mb-px flex space-x-6" aria-label="Tabs">
                            <button onClick={() => setActiveTab('general')} className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm ${activeTab === 'general' ? 'border-kia-primary text-kia-primary' : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-500'}`}>
                                Datos Generales
                            </button>
                            <button onClick={() => setActiveTab('technical')} className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm ${activeTab === 'technical' ? 'border-kia-primary text-kia-primary' : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-500'}`}>
                                Verificación Técnica
                            </button>
                            <button onClick={() => setActiveTab('scan')} className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm ${activeTab === 'scan' ? 'border-kia-primary text-kia-primary' : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-500'}`}>
                                Escaneo Electrónico
                            </button>
                        </nav>
                    </div>
                    
                    <div className={activeTab === 'general' ? 'block' : 'hidden'}>
                        <VehicleForm 
                            initialData={formData}
                            onDataChange={setFormData}
                        />
                    </div>
                    <div className={activeTab === 'technical' ? 'block' : 'hidden'}>
                        <TechnicalVerificationForm
                            initialData={formData.inspection?.technical || initialInspectionState.technical}
                            onDataChange={(data) => updateInspectionData({ technical: data })}
                        />
                    </div>
                    <div className={activeTab === 'scan' ? 'block' : 'hidden'}>
                        <ElectronicScanForm
                            initialData={formData.inspection?.electronicScan || initialInspectionState.electronicScan}
                            onDataChange={(data) => updateInspectionData({ electronicScan: data })}
                        />
                    </div>
                    
                    <div className="flex justify-end space-x-4 pt-4 sticky bottom-0 bg-kia-dark py-4 -mx-6 px-6 border-t border-kia-dark-2">
                        <button type="button" onClick={handleCloseModal} className="px-4 py-2 text-sm font-medium text-gray-300 bg-kia-dark-2 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-kia-dark focus:ring-gray-500">
                            Cancelar
                        </button>
                        <Button onClick={handleSaveVehicle}>
                            {isEditing ? 'Guardar Cambios' : 'Registrar Vehículo'}
                        </Button>
                    </div>
                </Modal>
            )}
        </div>
    );
};

export default MechanicDashboard;
