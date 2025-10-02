import React from 'react';
import { InspectionPhoto } from '../../types';
import ImageUpload from '../ui/ImageUpload';

interface InspectionChecklistItemProps {
    label: string;
    notes: string;
    photos: InspectionPhoto[];
    onNotesChange: (notes: string) => void;
    onAddPhoto: (url: string) => void;
    onRemovePhoto: (photoId: string) => void;
}

const XCircleIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);


const InspectionChecklistItem: React.FC<InspectionChecklistItemProps> = ({ label, notes, photos, onNotesChange, onAddPhoto, onRemovePhoto }) => {
    return (
        <div className="bg-kia-dark-2 p-4 rounded-lg">
            <label className="block text-sm font-medium text-kia-light">{label}</label>
            <textarea
                value={notes}
                onChange={(e) => onNotesChange(e.target.value)}
                rows={2}
                placeholder="Anotaciones..."
                className="mt-1 block w-full bg-kia-dark border border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-kia-primary focus:border-kia-primary sm:text-sm text-white"
            />
            <div className="mt-2">
                <ImageUpload onUpload={onAddPhoto} />
            </div>
            {photos.length > 0 && (
                <div className="mt-3 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                    {photos.map(photo => (
                        <div key={photo.id} className="relative group">
                            <img src={photo.url} alt="Evidencia de inspección" className="w-full h-20 object-cover rounded-md" />
                            <button
                                type="button"
                                onClick={() => onRemovePhoto(photo.id)}
                                className="absolute top-0 right-0 -mt-2 -mr-2 bg-gray-800 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
                                aria-label="Eliminar foto"
                            >
                                <XCircleIcon className="w-6 h-6 text-red-500" />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default InspectionChecklistItem;
