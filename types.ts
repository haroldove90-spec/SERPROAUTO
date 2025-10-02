export enum VehicleStatus {
  InService = 'En Servicio',
  InDiagnosis = 'En Diagnóstico',
  InRepair = 'En Reparación',
  ReadyForDelivery = 'Listo para Entrega',
}

export enum PriorityLevel {
  Low = 'Bajo',
  Medium = 'Medio',
  High = 'Alto',
}

export enum Role {
  JefeDeTaller = 'Jefe de Taller',
  Asesor = 'Asesor',
  Mecanico = 'Mecanico',
}

export interface User {
  username: string;
  role: Role;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
}

export interface InspectionPhoto {
  id: string;
  url: string; // base64 data URL
}

export interface InspectionData {
  mileage: string;
  fuelLevel: '1/4' | '1/2' | '3/4' | 'Lleno' | '';
  exterior: {
    bodywork: { notes: string; photos: InspectionPhoto[] };
    windshield: { notes: string; photos: InspectionPhoto[] };
    tires: { notes: string; photos: InspectionPhoto[] };
    rims: { notes: string; photos: InspectionPhoto[] };
    lights: { notes: string; photos: InspectionPhoto[] };
  };
  interior: {
    upholstery: { notes: string; photos: InspectionPhoto[] };
    dashboard: { notes: string; photos: InspectionPhoto[] };
    equipment: { notes: string; photos: InspectionPhoto[] };
  };
  keys: {
    count: number;
    notes: string;
  };
  equipmentCheck: {
    ac: 'ok' | 'nok' | 'na';
    audio: 'ok' | 'nok' | 'na';
    windows: 'ok' | 'nok' | 'na';
    locking: 'ok' | 'nok' | 'na';
  };
  technical: {
    engineOil: { notes: string; photos: InspectionPhoto[] };
    brakeFluid: { notes: string; photos: InspectionPhoto[] };
    coolant: { notes: string; photos: InspectionPhoto[] };
    powerSteering: { notes: string; photos: InspectionPhoto[] };
    washerFluid: { notes: string; photos: InspectionPhoto[] };
    batteryTest: 'Buena' | 'Regular' | 'Reemplazar' | '';
    batteryHealth: number; // Percentage
    brakeLifePercentage: number; // Percentage
    suspension: { notes: string; photos: InspectionPhoto[] };
    exhaust: { notes: string; photos: InspectionPhoto[] };
    accessoryBelt: { notes: string; photos: InspectionPhoto[] };
  };
  electronicScan: {
    dtcCodes: string;
    realTimeParams: string;
    photos: InspectionPhoto[];
  };
}


export interface Vehicle {
  id:string;
  make: string;
  model: string;
  year: number;
  vin: string;
  licensePlate: string;
  status: VehicleStatus;
  customer: Customer;
  entryDate: string;
  estimatedCompletionDate?: string;
  technician?: string;
  priority?: PriorityLevel;
  workOrderNotes?: string;
  inspection?: Partial<InspectionData>;
}