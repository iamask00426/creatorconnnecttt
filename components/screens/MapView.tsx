
import React, { useEffect, useRef, useState } from 'react';
import type { Creator } from '../../types';
import { MyLocationIcon } from '../icons';

declare const L: any;

interface MapViewProps {
    creators: Creator[];
    onViewProfile: (creator: Creator) => void;
}

export const MapView: React.FC<MapViewProps> = ({ creators, onViewProfile }) => {
    const mapRef = useRef<any>(null);
    const markersLayerRef = useRef<any>(null);
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const [userLocation, setUserLocation] = useState<any>(null);
    const [isLeafletReady, setIsLeafletReady] = useState(false);

    // Ensure Leaflet is available before attempting to render
    useEffect(() => {
        let attempts = 0;
        const checkLeaflet = setInterval(() => {
            if (typeof L !== 'undefined') {
                clearInterval(checkLeaflet);
                setIsLeafletReady(true);
            }
            attempts++;
            if (attempts > 50) { // Timeout after 5s
                clearInterval(checkLeaflet);
                console.error("Leaflet failed to load.");
            }
        }, 100);
        return () => clearInterval(checkLeaflet);
    }, []);

    // Initialize Map
    useEffect(() => {
        if (!isLeafletReady || !mapContainerRef.current || mapRef.current) return;

        try {
            const map = L.map(mapContainerRef.current, { 
                zoomControl: false,
                tap: false,
                maxZoom: 18,
                minZoom: 2
            }).setView([20.5937, 78.9629], 4);
            
            mapRef.current = map;
            markersLayerRef.current = L.featureGroup().addTo(map);

            L.tileLayer('https://{s}.tile.osm.org/{z}/{x}/{y}.png', {
                attribution: '&copy; OpenStreetMap'
            }).addTo(map);

            const invalidate = () => {
                if (mapRef.current) mapRef.current.invalidateSize();
            };
            setTimeout(invalidate, 100);
            setTimeout(invalidate, 500);

            if (navigator.geolocation) {
                map.on('locationfound', (e: any) => {
                    map.setView(e.latlng, 13);
                    setUserLocation(e.latlng);
                    L.circleMarker(e.latlng, { 
                        radius: 8, 
                        color: '#7c3aed', 
                        fillColor: '#8b5cf6', 
                        fillOpacity: 0.8,
                        weight: 3,
                    }).addTo(map).bindPopup("You").openPopup();
                });
                map.locate({ setView: true, maxZoom: 12 });
            }
        } catch (e) {
            console.error("Error initializing map:", e);
        }

        return () => {
            if (mapRef.current) {
                mapRef.current.remove();
                mapRef.current = null;
            }
        };
    }, [isLeafletReady]);

    // Update Creator Markers
    useEffect(() => {
        if (!mapRef.current || !markersLayerRef.current || !isLeafletReady) return;

        try {
            const markersLayer = markersLayerRef.current;
            markersLayer.clearLayers();

            const locationGroups = new Map<string, Creator[]>();
            creators.forEach(c => {
                const lat = Number(c.lat);
                const lng = Number(c.lng);
                if (isNaN(lat) || isNaN(lng)) return;
                const key = `${lat.toFixed(4)}_${lng.toFixed(4)}`;
                if (!locationGroups.has(key)) locationGroups.set(key, []);
                locationGroups.get(key)!.push(c);
            });
            
            locationGroups.forEach((group, key) => {
                const [lat, lng] = key.split('_').map(Number);
                
                if (group.length === 1) {
                    const c = group[0];
                    const icon = L.divIcon({
                        className: 'map-icon-container',
                        html: `<div class="marker-pin" style="background-image: url(${c.photoURL})"></div>`,
                        iconSize: [44, 44], iconAnchor: [22, 44], popupAnchor: [0, -46]
                    });
                    const marker = L.marker([lat, lng], { icon }).addTo(markersLayer);
                    
                    const content = `
                        <div class="p-3 min-w-[200px] flex items-center gap-3">
                            <img src="${c.photoURL}" class="w-12 h-12 rounded-lg object-cover" />
                            <div class="flex-1 overflow-hidden">
                                <h4 class="m-0 font-bold text-sm text-slate-900 truncate">${c.displayName}</h4>
                                <p class="m-0 text-[10px] text-violet-600 font-bold uppercase">${c.niche}</p>
                                <button id="v-${c.uid}" class="mt-2 w-full py-1.5 bg-slate-900 text-white text-[9px] font-black rounded-md uppercase tracking-widest">View</button>
                            </div>
                        </div>`;
                    marker.bindPopup(content, { closeButton: false });
                    marker.on('popupopen', () => {
                        const btn = document.getElementById(`v-${c.uid}`);
                        if (btn) btn.onclick = () => onViewProfile(c);
                    });
                } else {
                    const count = group.length;
                    const icon = L.divIcon({
                        className: 'map-icon-container',
                        html: `<div class="marker-cluster"><span>${count}</span></div>`,
                        iconSize: [40, 40], iconAnchor: [20, 20], popupAnchor: [0, -26]
                    });
                    const marker = L.marker([lat, lng], { icon }).addTo(markersLayer);
                    
                    const content = `
                        <div class="max-h-[300px] flex flex-col min-w-[240px]">
                            <div class="p-3 border-b border-slate-100 bg-slate-50 rounded-t-xl">
                                <h4 class="m-0 font-bold text-sm text-slate-900">${count} Creators Here</h4>
                            </div>
                            <div class="overflow-y-auto p-2 space-y-2">
                                ${group.map(c => `
                                    <div id="v-${c.uid}" class="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-50 cursor-pointer border border-transparent hover:border-slate-100 transition-all">
                                        <img src="${c.photoURL}" class="w-8 h-8 rounded-md object-cover" />
                                        <div class="flex-1 overflow-hidden">
                                            <p class="m-0 font-bold text-xs text-slate-900 truncate">${c.displayName}</p>
                                            <p class="m-0 text-[9px] text-violet-600 font-bold">${c.niche}</p>
                                        </div>
                                    </div>
                                `).join('')}
                            </div>
                        </div>`;
                    marker.bindPopup(content, { closeButton: false, className: 'cluster-popup' });
                    marker.on('popupopen', () => {
                        group.forEach(c => {
                            const el = document.getElementById(`v-${c.uid}`);
                            if (el) el.onclick = () => onViewProfile(c);
                        });
                    });
                }
            });

            if (creators.length > 0 && !userLocation) {
                const bounds = markersLayer.getBounds();
                if(bounds.isValid()) {
                    mapRef.current.fitBounds(bounds.pad(0.3));
                }
            }
        } catch (e) {
            console.error("Error updating markers", e);
        }
    }, [creators, userLocation, isLeafletReady]);

    const handleRecenter = () => {
        if (userLocation && mapRef.current) {
            mapRef.current.flyTo(userLocation, 14);
        } else if (mapRef.current) {
            mapRef.current.locate({ setView: true, maxZoom: 14 });
        }
    };

    if (!isLeafletReady) {
        return (
             <div className="w-full h-full flex items-center justify-center bg-slate-100">
                <div className="text-center">
                    <div className="w-8 h-8 border-4 border-violet-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Loading Maps...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full h-full relative bg-slate-200">
            <style>{`
                .leaflet-container { font-family: inherit; z-index: 1; }
                .leaflet-popup-content-wrapper { border-radius: 16px; padding: 0; overflow: hidden; box-shadow: 0 20px 40px -10px rgba(0,0,0,0.3); border: none; }
                .leaflet-popup-content { margin: 0 !important; width: 100% !important; }
                .leaflet-popup-tip { background: white; }
                .marker-pin { 
                    width: 44px; height: 44px; border-radius: 50% 50% 50% 0; 
                    background-size: cover; background-position: center; 
                    transform: rotate(-45deg); border: 3px solid white; 
                    box-shadow: 0 4px 10px rgba(0,0,0,0.2);
                    animation: marker-drop 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                }
                .marker-cluster {
                    width: 40px; height: 40px; border-radius: 50%; 
                    background: #7c3aed; color: white; border: 3px solid white;
                    display: flex; align-items: center; justify-content: center;
                    font-weight: 800; font-size: 14px; box-shadow: 0 4px 10px rgba(0,0,0,0.2);
                }
                .cluster-popup .leaflet-popup-content-wrapper { width: auto !important; }
                @keyframes marker-drop {
                    0% { transform: translateY(-20px) rotate(-45deg); opacity: 0; }
                    100% { transform: translateY(0) rotate(-45deg); opacity: 1; }
                }
            `}</style>
            
            <div ref={mapContainerRef} className="w-full h-full z-0"></div>
            
            <button
                onClick={handleRecenter}
                className="absolute bottom-6 right-6 z-[400] p-4 bg-white rounded-2xl shadow-xl border border-slate-100 text-slate-700 active:scale-90 transition-transform"
            >
                <MyLocationIcon className="h-6 w-6" />
            </button>
        </div>
    );
};
