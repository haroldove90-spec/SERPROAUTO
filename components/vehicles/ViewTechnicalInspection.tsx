import React from 'react';
import { InspectionData } from '../../types';
import BatteryGauge from '../ui/BatteryGauge';
import BrakeLifeIndicator from '../ui/BrakeLifeIndicator';
import { initialInspectionState } from './VehicleInspectionForm';

interface ViewTechnicalInspectionProps {
  inspection?: Partial<InspectionData>;
}

const DataField: React.FC<{ label: string; value?: string | number | null; children?: React.ReactNode }> = ({ label, value, children }) => (
    <div className="bg-kia-dark-2 p-3 rounded-lg">
        <p className="text-xs font-medium text-kia-gray">{label}</p>
        {value ? <p className="text-kia-light font-semibold mt-1">{value}</p> : children}
    </div>
);

const PhotoGrid: React.FC<{ photos?: {id: string, url: string}[], title: string }> = ({ photos, title }) => (
    photos && photos.length > 0 ? (
        <div className="mt-2">
            <p className="text-xs text-kia-gray mb-2">{title}</p>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {photos.map(photo => (
                    <a key={photo.id} href={photo.url} target="_blank" rel="noopener noreferrer">
                        <img src={photo.url} alt="Evidencia de inspección" className="w-full h-20 object-cover rounded-md hover:opacity-80 transition-opacity" />
                    </a>
                ))}
            </div>
        </div>
    ) : null
);

const ViewTechnicalInspection: React.FC<ViewTechnicalInspectionProps> = ({ inspection }) => {

  const technicalData = inspection?.technical ? {...initialInspectionState.technical, ...inspection.technical} : initialInspectionState.technical;
  const scanData = inspection?.electronicScan ? {...initialInspectionState.electronicScan, ...inspection.electronicScan} : initialInspectionState.electronicScan;

  if (!inspection || (!inspection.technical && !inspection.electronicScan)) {
    return (
      <div className="flex items-center justify-center h-40 bg-kia-dark-2 rounded-lg">
        <p className="text-kia-gray">No hay datos de inspección técnica disponibles.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      
      <section>
        <h3 className="text-lg font-medium leading-6 text-kia-primary border-b border-kia-dark-2 pb-2 mb-4">Verificación Técnica</h3>
         <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-kia-dark-2 p-4 rounded-lg flex flex-col items-center justify-center space-y-4">
                    <label className="text-sm font-medium text-kia-light">Salud de Batería</label>
                    <BatteryGauge health={technicalData.batteryHealth} />
                    <p className="text-sm text-kia-gray">Estado General: <span className="font-bold text-kia-light">{technicalData.batteryTest || 'N/A'}</span></p>
                </div>
                <div className="bg-kia-dark-2 p-4 rounded-lg flex flex-col items-center justify-center space-y-4">
                    <label className="text-sm font-medium text-kia-light">Vida de Frenos Restante</label>
                    <BrakeLifeIndicator percentage={technicalData.brakeLifePercentage} />
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
               <DataField label="Aceite del Motor"><p className="text-kia-light">{technicalData.engineOil.notes || 'Sin notas'}</p><PhotoGrid photos={technicalData.engineOil.photos} title="Fotos:"/></DataField>
               <DataField label="Líquido de Frenos"><p className="text-kia-light">{technicalData.brakeFluid.notes || 'Sin notas'}</p><PhotoGrid photos={technicalData.brakeFluid.photos} title="Fotos:"/></DataField>
               <DataField label="Líquido Refrigerante"><p className="text-kia-light">{technicalData.coolant.notes || 'Sin notas'}</p><PhotoGrid photos={technicalData.coolant.photos} title="Fotos:"/></DataField>
               <DataField label="Dirección Hidráulica"><p className="text-kia-light">{technicalData.powerSteering.notes || 'Sin notas'}</p><PhotoGrid photos={technicalData.powerSteering.photos} title="Fotos:"/></DataField>
               <DataField label="Líquido Limpiaparabrisas"><p className="text-kia-light">{technicalData.washerFluid.notes || 'Sin notas'}</p><PhotoGrid photos={technicalData.washerFluid.photos} title="Fotos:"/></DataField>
               <DataField label="Suspensión"><p className="text-kia-light">{technicalData.suspension.notes || 'Sin notas'}</p><PhotoGrid photos={technicalData.suspension.photos} title="Fotos:"/></DataField>
               <DataField label="Sistema de Escape"><p className="text-kia-light">{technicalData.exhaust.notes || 'Sin notas'}</p><PhotoGrid photos={technicalData.exhaust.photos} title="Fotos:"/></DataField>
               <DataField label="Correa de Accesorios"><p className="text-kia-light">{technicalData.accessoryBelt.notes || 'Sin notas'}</p><PhotoGrid photos={technicalData.accessoryBelt.photos} title="Fotos:"/></DataField>
            </div>
         </div>
      </section>

      {inspection.electronicScan && (
        <section>
            <h3 className="text-lg font-medium leading-6 text-kia-primary border-b border-kia-dark-2 pb-2 mb-4">Escaneo Electrónico</h3>
            <div className="space-y-4">
                 <DataField label="Códigos de Falla (DTCs)">
                    <pre className="text-sm text-kia-light whitespace-pre-wrap font-mono bg-kia-dark p-2 rounded mt-1">{scanData.dtcCodes || 'Sin códigos reportados.'}</pre>
                 </DataField>
                 <DataField label="Parámetros en Tiempo Real">
                    <p className="text-sm text-kia-light whitespace-pre-wrap mt-1">{scanData.realTimeParams || 'Sin notas.'}</p>
                 </DataField>
                 <div className="bg-kia-dark-2 p-3 rounded-lg">
                    <PhotoGrid photos={scanData.photos} title="Fotos del Escáner:"/>
                    {(!scanData.photos || scanData.photos.length === 0) && <p className="text-xs text-kia-gray">No hay fotos.</p>}
                 </div>
            </div>
        </section>
      )}
    </div>
  );
};

export default ViewTechnicalInspection;
