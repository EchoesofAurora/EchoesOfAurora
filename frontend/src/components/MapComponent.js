import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import geoJsonData from './filtered_territories_usa_canada.json';
import '../App.css';

const MapComponent = () => {
  const [geoJson, setGeoJson] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(4);
  const [selectedFeature, setSelectedFeature] = useState(null);

  useEffect(() => {
    setGeoJson(geoJsonData);
  }, []);

  const onEachFeature = (feature, layer) => {
    layer.on('click', () => {
      setSelectedFeature(feature);
    });
  };

  const style = (feature) => ({
    color: feature.properties?.color || '#000',
    weight: 1,
    fillColor: feature.properties?.color || '#000',
    fillOpacity: 0.7,
  });

  const handleZoomEnd = (e) => {
    setZoomLevel(e.target.getZoom());
  };

  return (
    <div style={{ position: 'relative', height: '100vh', width: '100%' }}>
      {/* Conditional Popup Sidebar */}
      {selectedFeature && (
        <div
          style={{
            position: 'absolute',
            top: '10%',
            left: '5%',
            width: '300px',
            backgroundColor: '#fff',
            padding: '1rem',
            borderRadius: '8px',
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
            zIndex: 1000,
            fontFamily: 'Arial, sans-serif',
            lineHeight: '1.5',
          }}
        >
          <button
            style={{
              position: 'absolute',
              top: '10px',
              right: '10px',
              background: 'none',
              border: 'none',
              fontSize: '16px',
              cursor: 'pointer',
              color: '#333',
            }}
            onClick={() => setSelectedFeature(null)}
          >
            ✖
          </button>
          <h4 style={{ margin: '0 0 10px', fontSize: '18px', color: '#333' }}>Selected Region</h4>
          <p style={{ margin: '0', fontSize: '14px', color: '#555' }}>
            <strong>Name:</strong>{' '}
            <span style={{ fontWeight: 'normal', color: '#000' }}>
              {selectedFeature.properties?.Name || 'Unnamed territory'}
            </span>
          </p>
          <p style={{ margin: '5px 0 0', fontSize: '14px', color: '#555' }}>
            <strong>Description:</strong>{' '}
            {selectedFeature.properties?.description ? (
              <a
                href={selectedFeature.properties.description}
                target="_blank"
                rel="noreferrer"
                style={{ color: '#007bff', textDecoration: 'none' }}
              >
                More info
              </a>
            ) : (
              'No description available'
            )}
          </p>
        </div>
      )}

      {/* Map Section */}
      <MapContainer
        center={[50, -95]}
        zoom={zoomLevel}
        scrollWheelZoom={true}
        style={{ height: '100%', width: '100%' }}
        onzoomend={handleZoomEnd}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png"
        />
        {geoJson && (
          <GeoJSON
            data={geoJson}
            onEachFeature={onEachFeature}
            style={style}
          />
        )}
      </MapContainer>
    </div>
  );
};

export default MapComponent;
