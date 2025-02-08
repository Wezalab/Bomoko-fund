import React, { useState } from "react";
import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import { LatLngExpression } from "leaflet"; // Import the type for LatLng
import "leaflet/dist/leaflet.css";
import { FeatureCollection, GeoJsonProperties, Geometry } from "geojson";

// Dummy GeoJSON for DRC cities (replace with actual GeoJSON data)
const drcGeoJson: FeatureCollection<Geometry, GeoJsonProperties> = {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        properties: { name: "Kinshasa" },
        geometry: {
          type: "Polygon",
          coordinates: [
            [
              [15.2486, -4.4419],
              [15.3096, -4.4184],
              [15.3201, -4.4903],
              [15.2486, -4.4419],
            ],
          ],
        },
      },
      {
        type: "Feature",
        properties: { name: "Lubumbashi" },
        geometry: {
          type: "Polygon",
          coordinates: [
            [
              [27.4665, -11.6616],
              [27.5003, -11.6783],
              [27.5200, -11.6333],
              [27.4665, -11.6616],
            ],
          ],
        },
      },
    ],
  };

const DRCMap = () => {
  const [selectedCity, setSelectedCity] = useState<string | null>(null);

  // Correct type for center (LatLngExpression)
  const mapCenter: LatLngExpression = [-4.0383, 21.7587]; // Centered on DRC

  const onEachFeature = (feature: any, layer: any) => {
    layer.on({
      click: () => setSelectedCity(feature.properties.name),
    });
  };

  const styleFeature = (feature: any) => {
    return {
      fillColor: feature.properties.name === selectedCity ? "blue" : "gray",
      color: "black",
      weight: 1,
      fillOpacity: 0.6,
    };
  };

  return (
    <div>
      <h1 className="text-center text-2xl mb-4">Map of DRC</h1>
      <MapContainer
        center={mapCenter} // Correctly typed
        zoom={6}
        style={{ height: "500px", width: "100%" }}
      >
        {/* <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        /> */}
        <GeoJSON
          data={drcGeoJson}
          style={styleFeature}
          onEachFeature={onEachFeature}
        />
      </MapContainer>
      {selectedCity && (
        <div className="text-center mt-4">
          <p>
            Selected City: <strong>{selectedCity}</strong>
          </p>
        </div>
      )}
    </div>
  );
};

export default DRCMap;
