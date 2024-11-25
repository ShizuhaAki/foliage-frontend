import React from 'react';
import { MapContainer, TileLayer, useMapEvents } from 'react-leaflet';
import "leaflet/dist/leaflet.css";

interface MapProps {
  onMapClick: (coords: { lat: number; lng: number }) => void;
  onMapLoad: () => void; // Add this prop
}

const Map: React.FC<MapProps> = ({ onMapClick, onMapLoad }) => {
  const MapClickHandler = () => {
    useMapEvents({
      click(e) {
        onMapClick({ lat: e.latlng.lat, lng: e.latlng.lng });
      },
    });
    return null;
  };

  return (
    <MapContainer
      center={[51.505, -0.09]} // Initial center position
      zoom={13}                // Initial zoom level
      style={{ height: "100vh", width: "100%" }}
      whenReady={() => {
        onMapLoad(); // Notify that the map has loaded
      }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {/* Place the MapClickHandler inside MapContainer */}
      <MapClickHandler />
    </MapContainer>
  );
};

export default Map;
