import { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polygon } from "react-leaflet";
import { LatLngTuple } from "leaflet";
import "leaflet/dist/leaflet.css";

// Define provinces with their coordinates
const provinces = [
  {
    name: "Kinshasa",
    center: [-4.4419, 15.2663] as LatLngTuple, // Ensure it's a tuple
    borders: [
      [-4.45, 15.24],
      [-4.41, 15.25],
      [-4.42, 15.28],
      [-4.46, 15.29],
      [-4.45, 15.24],
    ] as LatLngTuple[], // Explicitly type the array
  },
  {
    name: "Haut-Katanga",
    center: [-11.6612, 27.4794] as LatLngTuple,
    borders: [
      [-11.68, 27.45],
      [-11.64, 27.44],
      [-11.63, 27.49],
      [-11.67, 27.50],
      [-11.68, 27.45],
    ] as LatLngTuple[],
  },
];

const defaultCenter: LatLngTuple = [-2.88, 23.65]; // DR Congo center

const MapComponent = () => {
  const [selectedProvince, setSelectedProvince] = useState<string | null>(null);
  const [markerPosition, setMarkerPosition] = useState<LatLngTuple | null>(null);

  // Handle province click
  const handleProvinceClick = (province: any) => {
    setSelectedProvince(province.name);
    setMarkerPosition(province.center);
  };

  return (
    <MapContainer center={defaultCenter} zoom={5} style={{ height: "700px", width: "100%" }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      {/* Draw Provinces */}
      {provinces.map((province, index) => (
        <Polygon
          key={index}
          pathOptions={{
            color: selectedProvince === province.name ? "red" : "blue",
            weight: selectedProvince === province.name ? 4 : 2,
          }}
          positions={province.borders}
          eventHandlers={{
            click: () => handleProvinceClick(province),
          }}
        />
      ))}

      {/* Marker for Selected Province */}
      {markerPosition && (
        <Marker position={markerPosition}>
          <Popup>{selectedProvince}</Popup>
        </Marker>
      )}
    </MapContainer>
  );
};

export default MapComponent;
