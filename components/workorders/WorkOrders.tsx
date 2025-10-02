
import React, { useMemo, useState } from 'react';
import { Vehicle, VehicleStatus, InspectionData } from '../../types';
import VehicleTable from '../vehicles/VehicleTable';
import Modal from '../ui/Modal';
import VehicleForm from '../vehicles/VehicleForm';
import Button from '../ui/Button';
import TechnicalVerificationForm from '../vehicles/TechnicalVerificationForm';
import { initialInspectionState } from '../vehicles/VehicleInspectionForm';
import ElectronicScanForm from '../vehicles/ElectronicScanForm';


interface WorkOrdersProps {
  vehicles: Vehicle[];
  onUpdateVehicle: (vehicle: Vehicle) => void;
}

const WorkOrders: React.FC<WorkOrdersProps> = ({ vehicles, onUpdateVehicle }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('general');
  const [formData, setFormData] = useState<Vehicle | null>(null);

  const workOrderVehicles = useMemo(() => {
    return vehicles.filter(v => v.status === VehicleStatus.InRepair);
  }, [vehicles]);

  const handleOpenModal = (vehicle: Vehicle) => {
    setFormData(JSON.parse(JSON.stringify(vehicle))); // Deep copy
    setActiveTab('general');
    setIsModalOpen(true);
  };
  
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setFormData(null);
  };

  const handleSaveVehicle = () => {
    if(formData) {
        onUpdateVehicle(formData);
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

  const handleTechnicalDataChange = (technicalData: InspectionData['technical']) => {
    updateInspectionData({ technical: technicalData });
  };
  
  const handleElectronicScanDataChange = (scanData: InspectionData['electronicScan']) => {
    updateInspectionData({ electronicScan: scanData });
  }

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-kia-light">Órdenes de Trabajo</h2>
      <p className="text-kia-gray">Vehículos actualmente en proceso de reparación.</p>
      
      <VehicleTable vehicles={workOrderVehicles} onEdit={handleOpenModal} showAllColumns={false}/>

      {isModalOpen && formData && (
        <Modal onClose={handleCloseModal} title="Detalles de Orden de Trabajo">
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
                onDataChange={handleTechnicalDataChange}
              />
            </div>
             <div className={activeTab === 'scan' ? 'block' : 'hidden'}>
                <ElectronicScanForm
                    initialData={formData.inspection?.electronicScan || initialInspectionState.electronicScan}
                    onDataChange={handleElectronicScanDataChange}
                />
             </div>
             <div className="flex justify-end space-x-4 pt-4 sticky bottom-0 bg-kia-dark py-4 -mx-6 px-6 border-t border-kia-dark-2">
                <button type="button" onClick={handleCloseModal} className="px-4 py-2 text-sm font-medium text-gray-300 bg-kia-dark-2 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-kia-dark focus:ring-gray-500">
                    Cancelar
                </button>
                <Button onClick={handleSaveVehicle}>
                    Guardar Cambios
                </Button>
            </div>
        </Modal>
      )}
    </div>
  );
};

export default WorkOrders;