import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { DayItinerary, Tab } from '../types';

interface RouteMapProps {
  allData: Record<string, DayItinerary>;
  currentDayId: string;
}

// Fix for default markers in Leaflet with webpack/esm (though we mainly use custom icons now)
const fixLeafletIcon = () => {
  delete (L.Icon.Default.prototype as any)._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  });
};

export const RouteMap: React.FC<RouteMapProps> = ({ allData, currentDayId }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const layerGroupRef = useRef<L.LayerGroup | null>(null);
  const [activeDayId, setActiveDayId] = useState(currentDayId);

  // Sync internal state if the parent prop changes
  useEffect(() => {
    setActiveDayId(currentDayId);
  }, [currentDayId]);

  useEffect(() => {
    fixLeafletIcon();

    if (mapContainerRef.current && !mapInstanceRef.current) {
      // Initialize map
      mapInstanceRef.current = L.map(mapContainerRef.current).setView([23.973875, 120.982024], 8);
      
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(mapInstanceRef.current);

      layerGroupRef.current = L.layerGroup().addTo(mapInstanceRef.current);
    }

    // Update markers and route based on activeDayId
    if (mapInstanceRef.current && layerGroupRef.current && allData[activeDayId]) {
      layerGroupRef.current.clearLayers();
      const items = allData[activeDayId].items;

      const validPoints = items
        .filter(item => item.lat !== undefined && item.lng !== undefined)
        .map(item => ({
          lat: item.lat!,
          lng: item.lng!,
          title: item.activity,
          time: item.time,
          note: item.note || ''
        }));

      if (validPoints.length > 0) {
        const latLngs: L.LatLngExpression[] = [];

        validPoints.forEach((point, index) => {
          const latLng: L.LatLngExpression = [point.lat, point.lng];
          latLngs.push(latLng);

          // Create custom numbered icon
          const numberIcon = L.divIcon({
            className: 'custom-marker-pin',
            html: `<span>${index + 1}</span>`,
            iconSize: [28, 28],
            iconAnchor: [14, 14],
            popupAnchor: [0, -10]
          });

          // Create styled popup content
          const popupContent = `
            <div class="p-3 bg-white font-sans">
              <div class="text-xs font-bold text-sky-600 mb-1">${point.time}</div>
              <div class="text-base font-bold text-slate-800 mb-1">${point.title}</div>
              <div class="text-xs text-slate-500 line-clamp-2">${point.note}</div>
            </div>
          `;

          const marker = L.marker(latLng, { icon: numberIcon })
            .bindPopup(popupContent)
            .addTo(layerGroupRef.current!);
            
          // Open the first marker by default
          if (index === 0) {
             marker.openPopup();
          }
        });

        // Draw Polyline
        if (latLngs.length > 1) {
          L.polyline(latLngs, { color: '#0ea5e9', weight: 4, opacity: 0.8, dashArray: '5, 10' }).addTo(layerGroupRef.current);
        }

        // Fit bounds
        const bounds = L.latLngBounds(latLngs);
        mapInstanceRef.current.fitBounds(bounds, { padding: [50, 50] });
      }
    }
  }, [activeDayId, allData]);

  // Filter keys to only show Day 1-4
  const mapTabs = [Tab.DAY1, Tab.DAY2, Tab.DAY3, Tab.DAY4];

  return (
    <div className="w-full overflow-hidden rounded-xl border border-slate-200 shadow-md bg-white">
      <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-3">
         <div className="font-bold text-slate-700 text-sm flex items-center gap-1">
            <span className="material-symbols-rounded text-xl text-sky-600">map</span> 
            <span>路線地圖</span>
         </div>
         
         {/* Internal Tabs */}
         <div className="flex bg-slate-200/50 p-1 rounded-lg">
            {mapTabs.map((tab) => {
              const isActive = activeDayId === tab;
              return (
                <button
                  key={tab}
                  onClick={() => setActiveDayId(tab)}
                  className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all
                    ${isActive 
                      ? 'bg-white text-sky-600 shadow-sm' 
                      : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200'}`}
                >
                  {tab}
                </button>
              )
            })}
         </div>
      </div>
      
      <div className="relative">
        <div ref={mapContainerRef} className="h-64 w-full md:h-80 lg:h-96 z-0" />
        
        {/* Legend Overlay */}
        <div className="absolute bottom-4 left-4 z-[500] bg-white/90 backdrop-blur-sm px-3 py-2 rounded-lg shadow-md border border-slate-200 text-xs text-slate-600 flex flex-col gap-1">
           <div className="font-bold text-slate-800 mb-1">{allData[activeDayId]?.title.split('：')[0]}</div>
           <div className="flex items-center gap-2">
             <span className="w-6 h-1 bg-sky-500 border-t border-dashed border-white"></span>
             <span>行駛路線</span>
           </div>
           <div className="flex items-center gap-2">
             <div className="w-4 h-4 rounded-full bg-sky-500 border border-white flex items-center justify-center text-[10px] text-white font-bold">1</div>
             <span>停靠站點</span>
           </div>
        </div>
      </div>
    </div>
  );
};