import React, { useState, useLayoutEffect, useRef, useEffect, useId, useCallback } from 'react';
import { createPortal } from 'react-dom';

export interface GuideStep {
    elementSelector: string;
    title: string;
    text: string;
    position?: 'top' | 'bottom' | 'left' | 'right';
    action?: () => void;
}

interface InteractiveGuideProps {
    steps: GuideStep[];
    isOpen: boolean;
    onClose: () => void;
}

interface Rect {
    top: number;
    left: number;
    width: number;
    height: number;
}

const PADDING = 8;
const BORDER_RADIUS = 12;

export const InteractiveGuide: React.FC<InteractiveGuideProps> = ({ steps, isOpen, onClose }) => {
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [targetRect, setTargetRect] = useState<Rect | null>(null);
    const tooltipRef = useRef<HTMLDivElement>(null);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const maskId = useId();

    const currentStep = steps[currentStepIndex];

    const handleNext = useCallback(() => {
        if (isTransitioning) return;

        const step = steps[currentStepIndex];
        if (step && step.action) {
            step.action();
        }

        if (currentStepIndex < steps.length - 1) {
            setIsTransitioning(true);
            setTargetRect(null); 
            setCurrentStepIndex(prev => prev + 1);
            setTimeout(() => setIsTransitioning(false), 400); 
        } else {
            onClose();
        }
    }, [currentStepIndex, steps, isTransitioning, onClose]);

    useEffect(() => {
        if (!isOpen || !currentStep) {
            setTargetRect(null);
            return;
        }

        let intervalId: number | null = null;
        let timeoutId: number | null = null;
        
        const findElementAndSetRect = () => {
            const element = document.querySelector(currentStep.elementSelector);
            if (element) {
                if(intervalId) clearInterval(intervalId);
                if(timeoutId) clearTimeout(timeoutId);

                // Ensure the element is visible on screen before highlighting
                element.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center',
                    inline: 'center'
                });
                
                // Allow time for the smooth scroll to finish before setting the rect
                setTimeout(() => {
                     setTargetRect(element.getBoundingClientRect());
                }, 300); // Corresponds to typical smooth scroll duration

                return true;
            }
            return false;
        };
        
        intervalId = window.setInterval(findElementAndSetRect, 100);

        timeoutId = window.setTimeout(() => {
            if(intervalId) clearInterval(intervalId);
            console.warn(`Guide: Element not found: ${currentStep.elementSelector}`);
            handleNext();
        }, 2000);

        const updatePosition = () => {
             const element = document.querySelector(currentStep.elementSelector);
             if (element) setTargetRect(element.getBoundingClientRect());
        };

        window.addEventListener('resize', updatePosition);
        window.addEventListener('scroll', updatePosition, true);

        return () => {
            if(intervalId) clearInterval(intervalId);
            if(timeoutId) clearTimeout(timeoutId);
            window.removeEventListener('resize', updatePosition);
            window.removeEventListener('scroll', updatePosition, true);
        };
    }, [isOpen, currentStep, handleNext]);


    const tooltipPosition = (): React.CSSProperties => {
        if (!tooltipRef.current || !targetRect) return { opacity: 0 };

        const tooltipRect = tooltipRef.current.getBoundingClientRect();
        const position = currentStep.position || 'bottom';
        let top = 0, left = 0;

        const paddedRect = {
            top: targetRect.top - PADDING,
            left: targetRect.left - PADDING,
            width: targetRect.width + PADDING * 2,
            height: targetRect.height + PADDING * 2,
        };

        switch (position) {
            case 'top':
                top = paddedRect.top - tooltipRect.height - PADDING;
                left = paddedRect.left + paddedRect.width / 2 - tooltipRect.width / 2;
                break;
            case 'bottom':
                top = paddedRect.top + paddedRect.height + PADDING;
                left = paddedRect.left + paddedRect.width / 2 - tooltipRect.width / 2;
                break;
            case 'left':
                 top = paddedRect.top + paddedRect.height / 2 - tooltipRect.height / 2;
                 left = paddedRect.left - tooltipRect.width - PADDING;
                 break;
            case 'right':
                top = paddedRect.top + paddedRect.height / 2 - tooltipRect.height / 2;
                left = paddedRect.left + paddedRect.width + PADDING;
                break;
        }

        if (left < PADDING) left = PADDING;
        if (left + tooltipRect.width > window.innerWidth - PADDING) left = window.innerWidth - tooltipRect.width - PADDING;
        if (top < PADDING) top = PADDING;
        if (top + tooltipRect.height > window.innerHeight - PADDING) top = window.innerHeight - tooltipRect.height - PADDING;

        return { top: `${top}px`, left: `${left}px` };
    };

    if (!isOpen) return null;

    const rectForRender = targetRect || {
        top: window.innerHeight / 2,
        left: window.innerWidth / 2,
        width: 0,
        height: 0,
    };

    const paddedRect = {
        top: rectForRender.top - PADDING,
        left: rectForRender.left - PADDING,
        width: rectForRender.width + PADDING * 2,
        height: rectForRender.height + PADDING * 2,
    };

    const overlayStyle: React.CSSProperties = {
        position: 'fixed',
        inset: 0,
        backgroundColor: targetRect ? 'rgba(0, 0, 0, 0.5)' : 'rgba(0, 0, 0, 0)',
        backdropFilter: 'blur(4px)',
        WebkitBackdropFilter: 'blur(4px)',
        mask: `url(#${maskId})`,
        WebkitMask: `url(#${maskId})`,
        zIndex: 10000,
        transition: 'background-color 0.35s ease-in-out',
    };

    const highlightBoxStyle: React.CSSProperties = {
        position: 'fixed',
        top: `${paddedRect.top}px`,
        left: `${paddedRect.left}px`,
        width: `${paddedRect.width}px`,
        height: `${paddedRect.height}px`,
        border: '2px solid rgba(255, 255, 255, 0.9)',
        borderRadius: `${BORDER_RADIUS}px`,
        boxShadow: `0 0 15px rgba(255, 255, 255, 0.5)`,
        zIndex: 10001,
        pointerEvents: 'none',
        transition: 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
        opacity: targetRect ? 1 : 0,
    };

    const tooltipStyle: React.CSSProperties = {
        position: 'fixed',
        ...tooltipPosition(),
        opacity: targetRect ? 1 : 0,
        transition: 'top 0.35s cubic-bezier(0.4, 0, 0.2, 1), left 0.35s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.35s ease-in-out',
        zIndex: 10002,
        maxWidth: '300px',
        minWidth: '250px',
    };

    return createPortal(
        <>
            <svg width="0" height="0" style={{ position: 'absolute' }}>
                <defs>
                    <mask id={maskId}>
                        <rect width="100vw" height="100vh" fill="white" />
                        <rect
                            x={paddedRect.left}
                            y={paddedRect.top}
                            width={paddedRect.width}
                            height={paddedRect.height}
                            rx={BORDER_RADIUS}
                            fill="black"
                            style={{
                                transition: 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
                            }}
                        />
                    </mask>
                </defs>
            </svg>

            <div style={overlayStyle} />
            
            <div style={highlightBoxStyle} />

            <div ref={tooltipRef} style={tooltipStyle} className="bg-white p-4 rounded-lg shadow-2xl">
                <h3 className="font-bold text-lg text-gray-800 mb-2">{currentStep.title}</h3>
                <p className="text-sm text-gray-600 mb-4">{currentStep.text}</p>
                <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-400 font-medium">{`${currentStepIndex + 1} / ${steps.length}`}</span>
                    <div className="flex justify-end">
                        <button 
                            onClick={handleNext} 
                            disabled={isTransitioning || !targetRect}
                            className="px-4 py-2 text-sm font-semibold text-white bg-purple-600 rounded-lg hover:bg-purple-700 disabled:opacity-50"
                        >
                            {currentStepIndex === steps.length - 1 ? 'Finish' : 'Next'}
                        </button>
                    </div>
                </div>
            </div>
        </>,
        document.body
    );
};