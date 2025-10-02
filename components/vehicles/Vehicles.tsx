
import React, { useState } from 'react';
import { Vehicle, Role, VehicleStatus, PriorityLevel, InspectionData } from '../../types';
import VehicleTable from './VehicleTable';
import Button from '../ui/Button';
import Modal from '../ui/Modal';
import VehicleForm from './VehicleForm';
import VehicleInspectionForm, { initialInspectionState } from './VehicleInspectionForm';
import { useAuth } from '../../context/AuthContext';
import ViewTechnicalInspection from './ViewTechnicalInspection';

interface VehiclesProps {
  vehicles: Vehicle[];
  onAddVehicle: (vehicle: Omit<Vehicle, 'id'>) => void;
  onUpdateVehicle: (vehicle: Vehicle) => void;
}

const Vehicles: React.FC<VehiclesProps> = ({ vehicles, onAddVehicle, onUpdateVehicle }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('general');
  const [formData, setFormData] = useState<Vehicle | null>(null);
  const { user } = useAuth();

  const handleOpenModal = (vehicle?: Vehicle) => {
    if (vehicle) {
      setFormData(vehicle);
      setIsEditing(true);
    } else {
      const newVehicleTemplate: Vehicle = {
        id: '',
        make: '',
        model: '',
        year: new Date().getFullYear(),
        vin: '',
        licensePlate: '',
        status: VehicleStatus.InService,
        customer: { id: '', name: '', phone: '', email: '' },
        entryDate: new Date().toISOString().split('T')[0],
        priority: PriorityLevel.Low,
        technician: '',
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

  const canAddVehicle = user?.role === Role.Asesor || user?.role === Role.JefeDeTaller;
  const canSeeTechnical = user?.role === Role.Asesor || user?.role === Role.JefeDeTaller;

  const modalTitle = isEditing ? "Editar Vehículo" : "Registrar Nuevo Vehículo";

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-kia-light">Gestión de Vehículos</h2>
        {canAddVehicle && (
          <Button onClick={() => handleOpenModal()}>Registrar Vehículo</Button>
        )}
      </div>
      
      <VehicleTable vehicles={vehicles} onEdit={handleOpenModal} />

      {isModalOpen && formData && (
        <Modal onClose={handleCloseModal} title={modalTitle}>
            <div className="border-b border-kia-dark-2 mb-6">
              <nav className="-mb-px flex space-x-6">
                <button
                  onClick={() => setActiveTab('general')}
                  className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'general'
                      ? 'border-kia-primary text-kia-primary'
                      : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-500'
                  }`}
                >
                  Datos Generales
                </button>
                <button
                  onClick={() => setActiveTab('reception')}
                  className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'reception'
                      ? 'border-kia-primary text-kia-primary'
                      : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-500'
                  }`}
                >
                  Inspección (Asesor)
                </button>
                {canSeeTechnical && isEditing && (
                    <button
                        onClick={() => setActiveTab('technical')}
                        className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm ${
                        activeTab === 'technical'
                            ? 'border-kia-primary text-kia-primary'
                            : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-500'
                        }`}
                    >
                        Inspección Técnica
                    </button>
                )}
              </nav>
            </div>
            
            <div className={activeTab === 'general' ? 'block' : 'hidden'}>
                <VehicleForm 
                    initialData={formData}
                    onDataChange={setFormData}
                />
            </div>
             <div className={activeTab === 'reception' ? 'block' : 'hidden'}>
                <VehicleInspectionForm
                    initialData={formData}
                    onDataChange={setFormData}
                />
            </div>
            {canSeeTechnical && isEditing && (
                <div className={activeTab === 'technical' ? 'block' : 'hidden'}>
                    <ViewTechnicalInspection inspection={formData.inspection} />
                </div>
            )}
            
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

export default Vehicles;