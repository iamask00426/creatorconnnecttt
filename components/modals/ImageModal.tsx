import { createPortal } from 'react-dom';

export const ImageModal: React.FC<ImageModalProps> = ({ imageUrl, onClose }) => {
    if (!imageUrl) return null;

    return createPortal(
        <div
            className="fixed inset-0 z-[9999] bg-black/95 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
            onClick={onClose}
        >
            <button
                onClick={onClose}
                className="absolute top-6 right-6 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors z-50"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>

            <div className="relative w-full h-full flex items-center justify-center pointer-events-none p-4">
                <img
                    src={imageUrl}
                    alt="Full View"
                    className="max-w-full max-h-full object-contain pointer-events-auto animate-bounce-in rounded-2xl shadow-2xl"
                    onClick={(e) => e.stopPropagation()}
                />
            </div>
        </div>,
        document.body
    );
};
