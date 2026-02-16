import React, { useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import Cropper from 'react-easy-crop';
import getCroppedImg from '../../utils/cropImage';

interface ImageCropperModalProps {
    imageSrc: string;
    aspectRatio: number; // 1 for profile, 16/9 for cover etc.
    cropShape?: 'rect' | 'round';
    onCropComplete: (croppedImage: string) => void;
    onClose: () => void;
}

export const ImageCropperModal: React.FC<ImageCropperModalProps> = ({ 
    imageSrc, 
    aspectRatio, 
    cropShape = 'rect',
    onCropComplete, 
    onClose 
}) => {
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
    const [isProcessing, setIsProcessing] = useState(false);

    const onCropChange = (crop: { x: number; y: number }) => {
        setCrop(crop);
    };

    const onZoomChange = (zoom: number) => {
        setZoom(zoom);
    };

    const onCropCompleteHandler = useCallback((croppedArea: any, croppedAreaPixels: any) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    const handleSave = async () => {
        if (!croppedAreaPixels) return;
        setIsProcessing(true);
        try {
            const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels);
            onCropComplete(croppedImage);
        } catch (e) {
            console.error(e);
        } finally {
            setIsProcessing(false);
        }
    };

    const modalContent = (
        <div className="fixed inset-0 z-[9999] bg-black/95 flex flex-col animate-fade-in touch-none">
            <div className="relative flex-grow w-full h-full overflow-hidden">
                <Cropper
                    image={imageSrc}
                    crop={crop}
                    zoom={zoom}
                    aspect={aspectRatio}
                    cropShape={cropShape}
                    onCropChange={onCropChange}
                    onCropComplete={onCropCompleteHandler}
                    onZoomChange={onZoomChange}
                    showGrid={true}
                    objectFit="contain"
                    style={{
                        containerStyle: { backgroundColor: '#000' },
                        mediaStyle: {},
                        cropAreaStyle: { 
                            border: '2px solid rgba(255, 255, 255, 0.5)',
                            boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.7)'
                        }
                    }}
                />
            </div>

            <div className="bg-slate-900 px-6 py-6 pb-12 flex flex-col gap-6 rounded-t-3xl border-t border-white/10 relative z-20 shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
                <div className="flex items-center gap-4">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest min-w-[30px]">Zoom</span>
                    <input
                        type="range"
                        value={zoom}
                        min={1}
                        max={3}
                        step={0.1}
                        aria-labelledby="Zoom"
                        onChange={(e) => setZoom(Number(e.target.value))}
                        className="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-violet-600"
                    />
                </div>

                <div className="flex gap-4">
                    <button
                        onClick={onClose}
                        className="flex-1 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest text-white bg-white/10 hover:bg-white/20 transition-all"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={isProcessing}
                        className="flex-1 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest text-white bg-violet-600 shadow-lg shadow-violet-600/30 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
                    >
                        {isProcessing ? (
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        ) : (
                            <>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                                Done
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );

    return createPortal(modalContent, document.body);
};