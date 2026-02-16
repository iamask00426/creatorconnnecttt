import React, { useState, useEffect } from 'react';
import { Creator } from '../../types';
import { updateUserProfile } from '../../services/firebase';

interface UserEditModalProps {
    user: Creator;
    onClose: () => void;
    onSave: (updatedUser: Creator) => void;
}

export const UserEditModal: React.FC<UserEditModalProps> = ({ user, onClose, onSave }) => {
    const [formData, setFormData] = useState<Partial<Creator>>({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setFormData({
            displayName: user.displayName,
            email: user.email,
            phoneNumber: user.phoneNumber,
            instagram: user.instagram,
            niche: user.niche,
            bio: user.bio,
            location: user.location,
            profileStatus: user.profileStatus,
        });
    }, [user]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await updateUserProfile(user.uid, formData);
            onSave({ ...user, ...formData } as Creator);
            onClose();
        } catch (error) {
            console.error("Error updating user:", error);
            alert("Failed to update user profile.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
            <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col">
                <div className="p-6 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
                    <h2 className="text-xl font-black text-slate-900">Edit Profile</h2>
                    <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 transition-colors">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div className="flex items-center gap-6">
                        <img
                            src={user.photoURL || 'https://via.placeholder.com/100'}
                            alt={user.displayName}
                            className="w-24 h-24 rounded-full object-cover border-4 border-slate-100"
                        />
                        <div>
                            <h3 className="text-lg font-bold text-slate-900">{user.displayName}</h3>
                            <p className="text-slate-500 text-sm">{user.uid}</p>
                            <span className={`inline-block mt-2 px-2.5 py-0.5 rounded-full text-xs font-bold capitalize
                                ${formData.profileStatus === 'active' ? 'bg-green-100 text-green-700' :
                                    formData.profileStatus === 'pending' ? 'bg-amber-100 text-amber-700' :
                                        formData.profileStatus === 'rejected' ? 'bg-red-100 text-red-700' :
                                            'bg-slate-100 text-slate-700'
                                }`}>
                                {formData.profileStatus || 'unknown'}
                            </span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase">Display Name</label>
                            <input
                                type="text"
                                name="displayName"
                                value={formData.displayName || ''}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-xl bg-slate-50 border-none focus:ring-2 focus:ring-violet-500 font-bold text-slate-900"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase">Email</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email || ''}
                                onChange={handleChange}
                                disabled
                                className="w-full px-4 py-3 rounded-xl bg-slate-100 border-none text-slate-500 cursor-not-allowed font-medium"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase">Phone Number</label>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    name="phoneNumber"
                                    value={formData.phoneNumber || ''}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border-none focus:ring-2 focus:ring-violet-500 font-bold text-slate-900"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase">Instagram Status</label>
                            <div className="relative">
                                <input
                                    type="text"
                                    name="instagram"
                                    value={formData.instagram || ''}
                                    onChange={handleChange}
                                    className="w-full pl-10 px-4 py-3 rounded-xl bg-slate-50 border-none focus:ring-2 focus:ring-violet-500 font-bold text-slate-900"
                                />
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">@</div>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase">Niche</label>
                            <select
                                name="niche"
                                value={formData.niche || ''}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-xl bg-slate-50 border-none focus:ring-2 focus:ring-violet-500 font-bold text-slate-900"
                            >
                                <option value="">Select Niche...</option>
                                <option value="Tech">Tech</option>
                                <option value="Lifestyle">Lifestyle</option>
                                <option value="Fashion">Fashion</option>
                                <option value="Beauty">Beauty</option>
                                <option value="Travel">Travel</option>
                                <option value="Food">Food</option>
                                <option value="Fitness">Fitness</option>
                                <option value="Gaming">Gaming</option>
                                <option value="Education">Education</option>
                                <option value="Entertainment">Entertainment</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase">Profile Status</label>
                            <select
                                name="profileStatus"
                                value={formData.profileStatus || ''}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-xl bg-slate-50 border-none focus:ring-2 focus:ring-violet-500 font-bold text-slate-900"
                            >
                                <option value="onboarding">Onboarding</option>
                                <option value="pending">Pending</option>
                                <option value="active">Active</option>
                                <option value="suspended">Suspended</option>
                                <option value="rejected">Rejected</option>
                            </select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase">Bio</label>
                        <textarea
                            name="bio"
                            value={formData.bio || ''}
                            onChange={handleChange}
                            rows={4}
                            className="w-full px-4 py-3 rounded-xl bg-slate-50 border-none focus:ring-2 focus:ring-violet-500 font-medium text-slate-900 resize-none"
                        />
                    </div>

                    <div className="pt-4 border-t border-slate-100 flex justify-end gap-3 sticky bottom-0 bg-white">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-3 rounded-xl text-slate-600 font-bold hover:bg-slate-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-6 py-3 rounded-xl bg-violet-600 text-white font-bold hover:bg-violet-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            {loading && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
