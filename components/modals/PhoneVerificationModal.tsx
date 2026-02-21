
import React, { useState, useEffect } from 'react';
import { PhoneIcon } from '../icons';

interface PhoneVerificationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onVerifySuccess: (phoneNumber: string) => void;
    initialPhoneNumber?: string;
}

export const PhoneVerificationModal: React.FC<PhoneVerificationModalProps> = ({ isOpen, onClose, onVerifySuccess, initialPhoneNumber = '' }) => {
    const [step, setStep] = useState<'input' | 'otp' | 'success'>('input');
    const [phoneNumber, setPhoneNumber] = useState(initialPhoneNumber);
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [isSending, setIsSending] = useState(false);
    const [isVerifying, setIsVerifying] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (isOpen) {
            setStep('input');
            setPhoneNumber(initialPhoneNumber);
            setOtp(['', '', '', '', '', '']);
            setError('');
        }
    }, [isOpen, initialPhoneNumber]);

    const handleSendCode = () => {
        if (phoneNumber.length < 10) {
            setError('Please enter a valid phone number');
            return;
        }
        setError('');
        setIsSending(true);
        // Simulate API call to send OTP
        setIsSending(false);
        setStep('otp');
    };

    const handleOtpChange = (index: number, value: string) => {
        if (value.length > 1) return; // Prevent pasting multiple chars (simplified)
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // Auto focus next input
        if (value && index < 5) {
            const nextInput = document.getElementById(`otp-${index + 1}`);
            nextInput?.focus();
        }
    };

    const handleVerify = () => {
        const code = otp.join('');
        if (code.length < 6) {
            setError('Please enter the 6-digit code');
            return;
        }
        setIsVerifying(true);
        setError('');

        // Simulate OTP verification logic
        if (code === '123456') {
            setStep('success');
            onVerifySuccess(phoneNumber);
            onClose();
        } else {
            setError('Invalid code. Try 123456 (Demo)');
            setIsVerifying(false);
        }
    };

    const handleBack = () => {
        setStep('input');
        setError('');
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
            <div className="relative w-full max-w-sm bg-white rounded-[2.5rem] shadow-2xl overflow-hidden animate-slide-up border border-slate-100 p-8">
                <button onClick={onClose} className="absolute top-5 right-5 p-2 bg-slate-50 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors z-10">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>

                <div className="text-center">
                    <div className="w-20 h-20 mx-auto bg-violet-100 rounded-3xl flex items-center justify-center mb-6 shadow-inner">
                        <PhoneIcon className="w-10 h-10 text-violet-600" />
                    </div>

                    {step === 'input' && (
                        <>
                            <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-2">Add Phone Number</h2>
                            <p className="text-xs text-slate-500 mb-8 font-medium leading-relaxed">We'll send a verification code to this number.</p>

                            <input
                                type="tel"
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                                placeholder="+1 555 000 0000"
                                className="w-full text-center py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 font-bold text-lg focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all mb-4 placeholder:text-slate-300"
                            />

                            {error && <p className="text-[10px] text-red-500 font-bold mb-4">{error}</p>}

                            <button
                                onClick={handleSendCode}
                                disabled={isSending}
                                className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-lg shadow-slate-900/20 hover:bg-slate-800 active:scale-95 transition-all disabled:opacity-70 flex items-center justify-center gap-2"
                            >
                                {isSending ? 'Sending...' : 'Send Code'}
                            </button>
                        </>
                    )}

                    {step === 'otp' && (
                        <>
                            <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-2">Verify Code</h2>
                            <p className="text-xs text-slate-500 mb-8 font-medium leading-relaxed">Enter the 6-digit code sent to {phoneNumber}</p>

                            <div className="flex gap-2 justify-center mb-6">
                                {otp.map((digit, i) => (
                                    <input
                                        key={i}
                                        id={`otp-${i}`}
                                        type="text"
                                        maxLength={1}
                                        value={digit}
                                        onChange={(e) => handleOtpChange(i, e.target.value)}
                                        className="w-10 h-12 text-center text-xl font-bold bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20"
                                    />
                                ))}
                            </div>

                            {error && <p className="text-[10px] text-red-500 font-bold mb-4">{error}</p>}

                            <button
                                onClick={handleVerify}
                                disabled={isVerifying}
                                className="w-full py-4 bg-violet-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-lg shadow-violet-500/20 hover:bg-violet-700 active:scale-95 transition-all disabled:opacity-70 flex items-center justify-center gap-2"
                            >
                                {isVerifying ? 'Verifying...' : 'Verify'}
                            </button>

                            <button onClick={handleBack} className="mt-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider hover:text-slate-600">
                                Change Number
                            </button>
                        </>
                    )}

                    {step === 'success' && (
                        <div className="py-8 animate-fade-in-up">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                            </div>
                            <h3 className="text-xl font-black text-slate-900 mb-2">Verified!</h3>
                            <p className="text-xs text-slate-500">Your phone number has been updated.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
