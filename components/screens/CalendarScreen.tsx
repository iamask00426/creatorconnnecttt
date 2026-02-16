
import React, { useState, useMemo } from 'react';
import { createPortal } from 'react-dom';
import type { UserData, CalendarEvent } from '../../types';
import { ChevronLeftIcon, ChevronRightIcon, PlusIcon, CalendarIcon, LocationPinIcon, TrashIcon, XMarkIcon } from '../icons';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, startOfWeek, endOfWeek } from 'date-fns';

interface CalendarScreenProps {
    userData: UserData;
    onUpdateUserData: (data: Partial<UserData>) => void;
    onBack: () => void;
}

export const CalendarScreen: React.FC<CalendarScreenProps> = ({ userData, onUpdateUserData, onBack }) => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [isAddEventOpen, setIsAddEventOpen] = useState(false);
    
    // Form state for new event
    const [editingEventId, setEditingEventId] = useState<string | null>(null);
    const [newEventTitle, setNewEventTitle] = useState('');
    const [newEventType, setNewEventType] = useState<'content' | 'collab' | 'meeting'>('content');
    const [newEventLocation, setNewEventLocation] = useState('');
    const [newEventTime, setNewEventTime] = useState('');
    // New state for editing the date specifically in the form
    const [formDate, setFormDate] = useState(new Date());

    const events = useMemo(() => userData.schedule || [], [userData.schedule]);

    const days = useMemo(() => {
        const monthStart = startOfMonth(currentDate);
        const monthEnd = endOfMonth(monthStart);
        const startDate = startOfWeek(monthStart);
        const endDate = endOfWeek(monthEnd);
        return eachDayOfInterval({ start: startDate, end: endDate });
    }, [currentDate]);

    const selectedDayEvents = events.filter(event => 
        isSameDay(new Date(event.date), selectedDate)
    );

    const openAddModal = () => {
        setEditingEventId(null);
        setNewEventTitle('');
        setNewEventType('content');
        setNewEventLocation('');
        setNewEventTime('');
        setFormDate(selectedDate); // Default to currently viewed date
        setIsAddEventOpen(true);
    };

    const openEditModal = (event: CalendarEvent) => {
        setEditingEventId(event.id);
        setNewEventTitle(event.title);
        setNewEventType(event.type as any);
        setNewEventLocation(event.location || '');
        // Map description to the notes field
        setNewEventTime(event.description || '');
        setFormDate(new Date(event.date)); // Initialize form with event's actual date
        setIsAddEventOpen(true);
    };

    const handleSaveEvent = () => {
        if (!newEventTitle) return;

        // Use formDate specifically so rescheduling works
        const eventDateToSave = new Date(formDate);
        
        const newEvent: CalendarEvent = {
            id: editingEventId || Date.now().toString(),
            title: newEventTitle,
            date: eventDateToSave,
            type: newEventType,
            location: newEventLocation,
            description: newEventTime // This now contains the full script/notes
        };

        let updatedSchedule = [...events];
        
        if (editingEventId) {
            // Remove the old version of the event
            updatedSchedule = updatedSchedule.filter(e => e.id !== editingEventId);
        }
        
        updatedSchedule.push(newEvent);
        
        onUpdateUserData({ schedule: updatedSchedule });
        
        // Close modal
        setIsAddEventOpen(false);
    };

    const handleDeleteEvent = () => {
        if (!editingEventId) return;
        const updatedSchedule = events.filter(e => e.id !== editingEventId);
        onUpdateUserData({ schedule: updatedSchedule });
        setIsAddEventOpen(false);
    };

    const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
    const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

    const getEventColor = (type: string) => {
        switch(type) {
            case 'content': return 'bg-violet-600';
            case 'collab': return 'bg-green-500';
            case 'meeting': return 'bg-blue-500';
            default: return 'bg-slate-400';
        }
    };

    const weekDays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

    return (
        <div className="flex flex-col h-full bg-slate-50 animate-slide-up">
            {/* Header - Using Grid for perfect alignment/visibility */}
            <header className="sticky top-0 z-30 bg-slate-50/90 backdrop-blur-xl border-b border-slate-200 px-4 py-4 shadow-sm grid grid-cols-[48px_1fr_48px] items-center">
                <button onClick={onBack} className="p-2 rounded-full hover:bg-slate-200 transition-colors w-10 h-10 flex items-center justify-center">
                    <ChevronLeftIcon className="h-6 w-6 text-slate-600" />
                </button>
                <h1 className="text-lg font-black text-slate-900 uppercase tracking-widest text-center truncate">SCHEDULE</h1>
                <button onClick={openAddModal} className="p-2 rounded-full hover:bg-slate-200 transition-colors w-10 h-10 flex items-center justify-center justify-self-end">
                    <PlusIcon className="h-6 w-6 text-slate-900" />
                </button>
            </header>

            <div className="flex-grow overflow-y-auto pb-20">
                {/* Calendar Navigation */}
                <div className="flex items-center justify-between px-6 py-6">
                    <button onClick={prevMonth} className="p-2 bg-white rounded-xl shadow-sm border border-slate-100 hover:bg-slate-50 active:scale-95 transition-transform">
                        <ChevronLeftIcon className="w-5 h-5 text-slate-600" />
                    </button>
                    <h2 className="text-xl font-black text-slate-900">
                        {format(currentDate, 'MMMM yyyy')}
                    </h2>
                    <button onClick={nextMonth} className="p-2 bg-white rounded-xl shadow-sm border border-slate-100 hover:bg-slate-50 active:scale-95 transition-transform">
                        <ChevronRightIcon className="w-5 h-5 text-slate-600" />
                    </button>
                </div>

                {/* Calendar Grid Container - Optimized for Mobile Alignment */}
                <div className="px-4 mb-6">
                    <div className="bg-white rounded-[2rem] p-4 shadow-lg border border-slate-100 mx-auto w-full max-w-[340px] sm:max-w-[380px]">
                        {/* Unified Grid */}
                        <div className="grid grid-cols-7 gap-y-4 justify-items-center">
                            {/* Weekday Headers */}
                            {weekDays.map((day, i) => (
                                <div key={`head-${i}`} className="w-8 h-4 flex items-center justify-center">
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-wide">{day}</span>
                                </div>
                            ))}
                            
                            {/* Days */}
                            {days.map((day, dayIdx) => {
                                const isSelected = isSameDay(day, selectedDate);
                                const isCurrentMonth = isSameMonth(day, currentDate);
                                const dayEvents = events.filter(e => isSameDay(new Date(e.date), day));
                                const hasEvents = dayEvents.length > 0;

                                return (
                                    <div key={dayIdx} className="w-full flex justify-center">
                                        <button
                                            onClick={() => setSelectedDate(day)}
                                            className={`
                                                relative w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold transition-all
                                                ${isSelected 
                                                    ? 'bg-violet-600 text-white shadow-lg shadow-violet-500/30 scale-105 z-10' 
                                                    : isCurrentMonth ? 'text-slate-700 hover:bg-slate-50' : 'text-slate-300'
                                                }
                                            `}
                                        >
                                            {format(day, 'd')}
                                            {hasEvents && !isSelected && (
                                                <div className="absolute -bottom-1 flex gap-0.5">
                                                    {dayEvents.slice(0, 3).map((ev, i) => (
                                                        <div key={i} className={`w-1 h-1 rounded-full ${getEventColor(ev.type)}`}></div>
                                                    ))}
                                                </div>
                                            )}
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Selected Day Agenda */}
                <div className="px-6 animate-fade-in-up">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h3 className="text-lg font-black text-slate-900">
                                {isSameDay(selectedDate, new Date()) ? 'Today' : format(selectedDate, 'EEEE, MMM do')}
                            </h3>
                            <p className="text-xs text-slate-500 font-medium">{selectedDayEvents.length} events scheduled</p>
                        </div>
                        <button 
                            onClick={openAddModal}
                            className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl shadow-lg shadow-slate-900/20 active:scale-95 transition-all"
                        >
                            <PlusIcon className="w-4 h-4" />
                            <span className="text-[10px] font-black uppercase tracking-widest">Add</span>
                        </button>
                    </div>

                    <div className="space-y-4">
                        {selectedDayEvents.length > 0 ? (
                            selectedDayEvents.map(event => (
                                <div 
                                    key={event.id} 
                                    onClick={() => openEditModal(event)}
                                    className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all cursor-pointer active:scale-[0.98] overflow-hidden"
                                >
                                    <div className="flex items-stretch">
                                        <div className={`w-2 ${getEventColor(event.type)}`}></div>
                                        <div className="p-4 flex-grow">
                                            <div className="flex justify-between items-start mb-2">
                                                <h4 className="font-bold text-slate-900 text-base">{event.title}</h4>
                                                <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-md bg-opacity-10 text-opacity-80 ${getEventColor(event.type).replace('bg-', 'text-')} ${getEventColor(event.type).replace('bg-', 'bg-')}`}>
                                                    {event.type === 'content' ? 'CONTENT SHOOT' : event.type}
                                                </span>
                                            </div>
                                            
                                            {/* Location Display */}
                                            {event.location && (
                                                <div className="flex items-center gap-1.5 mb-2 text-[10px] font-bold text-slate-500">
                                                    <LocationPinIcon className="w-3.5 h-3.5 text-violet-600" />
                                                    <span>{event.location}</span>
                                                </div>
                                            )}

                                            {event.description && (
                                                <div className="text-xs text-slate-600 leading-relaxed font-medium bg-slate-50 p-3 rounded-xl border border-slate-100 whitespace-pre-wrap">
                                                    {event.description}
                                                </div>
                                            )}
                                            {!event.description && (
                                                <p className="text-xs text-slate-400 italic">No notes added.</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-10 border-2 border-dashed border-slate-200 rounded-3xl">
                                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">No events for this day</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Add/Edit Event Modal / Bottom Sheet - Portal for Z-Index Fix */}
            {isAddEventOpen && createPortal(
                <div className="fixed inset-0 z-[9999] flex items-end justify-center sm:items-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in safe-area-padding">
                    <style>{`
                        .safe-area-padding { padding-bottom: env(safe-area-inset-bottom); }
                    `}</style>
                    <div className="bg-white w-full max-w-lg rounded-t-[2.5rem] sm:rounded-[2.5rem] p-8 pb-10 sm:pb-8 animate-slide-in-up flex flex-col max-h-[85vh] shadow-2xl relative">
                        {/* Drag Handle Indicator for mobile feel */}
                        <div className="absolute top-3 left-1/2 -translate-x-1/2 w-12 h-1.5 bg-slate-200 rounded-full sm:hidden"></div>

                        <div className="flex justify-between items-center mb-6 flex-shrink-0 mt-2 sm:mt-0">
                            <h2 className="text-2xl font-black text-slate-900">{editingEventId ? 'Edit Event' : 'New Event'}</h2>
                            <div className="flex items-center gap-2">
                                {editingEventId && (
                                    <button 
                                        onClick={handleDeleteEvent}
                                        className="p-2.5 bg-red-50 text-red-500 rounded-xl hover:bg-red-100 transition-colors active:scale-95"
                                        aria-label="Delete Event"
                                    >
                                        <TrashIcon className="h-5 w-5" />
                                    </button>
                                )}
                                <button 
                                    onClick={() => setIsAddEventOpen(false)}
                                    className="p-2.5 bg-slate-50 text-slate-400 rounded-xl hover:bg-slate-100 transition-colors active:scale-95"
                                    aria-label="Close"
                                >
                                    <XMarkIcon className="h-5 w-5" />
                                </button>
                            </div>
                        </div>
                        
                        <div className="space-y-6 overflow-y-auto hide-scrollbar flex-grow pb-4">
                            {/* Title Field */}
                            <div>
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Title</label>
                                <input 
                                    type="text" 
                                    value={newEventTitle} 
                                    onChange={e => setNewEventTitle(e.target.value)} 
                                    placeholder="e.g. Brand Meeting" 
                                    className="w-full text-lg font-bold text-slate-900 border-b-2 border-slate-100 pb-2 outline-none focus:border-violet-600 transition-colors bg-transparent placeholder-slate-300"
                                    autoFocus
                                />
                            </div>

                            {/* Date Field */}
                            <div>
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Date</label>
                                <div className="relative group">
                                    <input 
                                        type="date" 
                                        value={format(formDate, 'yyyy-MM-dd')} 
                                        onChange={(e) => {
                                            if (e.target.value) {
                                                const [y, m, d] = e.target.value.split('-').map(Number);
                                                setFormDate(new Date(y, m - 1, d, 12, 0, 0));
                                            }
                                        }}
                                        className="w-full text-sm font-bold text-slate-900 border-b-2 border-slate-100 pb-2 outline-none focus:border-violet-600 transition-colors bg-transparent relative z-10"
                                    />
                                    <div className="absolute right-0 bottom-3 pointer-events-none text-slate-400">
                                        <CalendarIcon className="w-5 h-5" />
                                    </div>
                                </div>
                            </div>

                            {/* Type Field */}
                            <div>
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Type</label>
                                <div className="flex gap-3">
                                    {['content', 'collab', 'meeting'].map(type => (
                                        <button
                                            key={type}
                                            onClick={() => setNewEventType(type as any)}
                                            className={`flex-1 py-3 rounded-xl text-xs font-bold uppercase tracking-wide border-2 transition-all ${
                                                newEventType === type 
                                                ? `border-${type === 'content' ? 'violet' : type === 'collab' ? 'green' : 'blue'}-500 bg-${type === 'content' ? 'violet' : type === 'collab' ? 'green' : 'blue'}-50 text-${type === 'content' ? 'violet' : type === 'collab' ? 'green' : 'blue'}-700`
                                                : 'border-slate-100 text-slate-400 hover:border-slate-200'
                                            }`}
                                        >
                                            {type === 'content' ? 'Content' : type.charAt(0).toUpperCase() + type.slice(1)}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Location Field */}
                            <div>
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Location</label>
                                <div className="relative group">
                                    <input 
                                        type="text" 
                                        value={newEventLocation} 
                                        onChange={e => setNewEventLocation(e.target.value)} 
                                        placeholder="e.g. Central Park, Studio B" 
                                        className="w-full text-sm font-bold text-slate-900 border-b-2 border-slate-100 pb-2 outline-none focus:border-violet-600 transition-colors bg-transparent placeholder-slate-300"
                                    />
                                    <div className="absolute right-0 bottom-3 pointer-events-none text-slate-400">
                                        <LocationPinIcon className="w-5 h-5" />
                                    </div>
                                </div>
                            </div>

                            {/* Notes / Script Field */}
                            <div>
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Notes / Script</label>
                                <textarea 
                                    value={newEventTime} 
                                    onChange={e => setNewEventTime(e.target.value)} 
                                    placeholder="Enter script, meeting notes, or details..." 
                                    className="w-full min-h-[120px] text-sm font-medium text-slate-800 border-2 border-slate-100 rounded-2xl p-4 outline-none focus:border-violet-600 transition-colors bg-slate-50 placeholder-slate-400 resize-none leading-relaxed"
                                />
                            </div>
                        </div>

                        <div className="pt-4 flex gap-4 mt-auto flex-shrink-0 border-t border-slate-50">
                            <button 
                                onClick={() => setIsAddEventOpen(false)}
                                className="flex-1 py-4 text-xs font-black text-slate-400 uppercase tracking-widest hover:text-slate-600 hover:bg-slate-50 rounded-2xl transition-all"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={handleSaveEvent}
                                disabled={!newEventTitle}
                                className="flex-[2] py-4 bg-slate-900 text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl shadow-slate-900/20 active:scale-95 transition-all disabled:opacity-50 hover:bg-slate-800"
                            >
                                {editingEventId ? 'Save Changes' : 'Create Event'}
                            </button>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
};
