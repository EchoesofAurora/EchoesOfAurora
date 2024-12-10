import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, GeoJSON, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import geoJsonData from './filtered_territories_usa_canada.json';
import '../App.css';

// Fix for missing default marker images
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const MapComponent = () => {
  const [geoJson, setGeoJson] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(4);
  const [selectedFeature, setSelectedFeature] = useState(null);
  const [addMarkerEnabled, setAddMarkerEnabled] = useState(false);
  const [addShapeEnabled, setAddShapeEnabled] = useState(false);
  const [coordinates, setCoordinates] = useState([]);
  const [tempMarkers, setTempMarkers] = useState([]);

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

  const MapEventHandler = () => {
    const map = useMapEvents({
      click: (e) => {
        const { lat, lng } = e.latlng;

        if (addMarkerEnabled) {
          // Add a custom marker
          const marker = L.marker([lat, lng]).addTo(map);
          marker.bindPopup(`Latitude: ${lat.toFixed(4)}, Longitude: ${lng.toFixed(4)}`).openPopup();
        }

        if (addShapeEnabled) {
          // Add points to the shape
          const newCoordinates = [...coordinates, [lat, lng]];
          setCoordinates(newCoordinates);

          // Add a temporary marker
          const tempMarkerSize = 0.001;
          const tempMarker = L.rectangle(
            [[lat - tempMarkerSize, lng - tempMarkerSize], [lat + tempMarkerSize, lng + tempMarkerSize]],
            { color: 'blue', fillColor: 'blue', fillOpacity: 1 }
          ).addTo(map);
          setTempMarkers((prev) => [...prev, tempMarker]);
        }
      },
    });

    useEffect(() => {
      if (!addShapeEnabled && coordinates.length > 0) {
        const shapeCoordinates = [...coordinates, coordinates[0]];

        // Draw the shape
        L.polygon(shapeCoordinates, {
          color: 'blue',
          fillColor: 'lightblue',
          fillOpacity: 0.5,
        }).addTo(map);

        // Clear temporary markers
        tempMarkers.forEach((marker) => marker.remove());
        setTempMarkers([]);
        setCoordinates([]);
      }
    }, [addShapeEnabled]);

    return null;
  };

  return (
    <div style={{ position: 'relative', height: '100vh', width: '100%' }}>
      {/* Buttons for Marker and Shape */}
      <div style={{ position: 'absolute', top: 10, right: 10, zIndex: 1000 }}>
        <button
          onClick={() => {
            setAddMarkerEnabled((prev) => !prev);
            if (addShapeEnabled) setAddShapeEnabled(false);
          }}
          style={{
            padding: '10px',
            margin: '5px',
            backgroundColor: addMarkerEnabled ? 'rgba(156, 101, 142)' : 'rgba(76, 41, 82)',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          {addMarkerEnabled ? 'Stop Adding Markers' : 'Add Marker'}
        </button>
        <button
          onClick={() => {
            setAddShapeEnabled((prev) => !prev);
            if (addMarkerEnabled) setAddMarkerEnabled(false);
          }}
          style={{
            padding: '10px',
            margin: '5px',
            backgroundColor: addShapeEnabled ? 'rgba(156, 101, 142)' : 'rgba(76, 41, 82)',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          {addShapeEnabled ? 'Stop Adding Shape' : 'Add Shape'}
        </button>
      </div>

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
        <TileLayer url="https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png" />
        {geoJson && <GeoJSON data={geoJson} onEachFeature={onEachFeature} style={style} />}
        <MapEventHandler />
      </MapContainer>
    </div>
  );
};

export default MapComponent;

