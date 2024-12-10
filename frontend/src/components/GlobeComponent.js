import React, { useState, useRef, useEffect } from 'react';
import Globe from 'react-globe.gl';
import * as d3 from 'd3-geo';
 
// Indigenous territories GeoJSON with API key
const geoJsonIndigenous = "https://native-land.ca/api/polygons/geojson/territories?key=KOlssv-5JcJ6_KlWi8zya";
 
const GlobeComponent = () => {
  const globeEl = useRef();
  const [polygons, setPolygons] = useState([]);
  const [highlightedPolygon, setHighlightedPolygon] = useState(null);
  const [labels, setLabels] = useState([]);
 
  useEffect(() => {
    const fetchGeoJSON = async () => {
      try {
        const indigenousResponse = await fetch(geoJsonIndigenous);
        const indigenousData = await indigenousResponse.json();
 
        // Use only Indigenous territories data
        const combinedPolygons = indigenousData.features.map(feature => ({
          ...feature,
          properties: {
            ...feature.properties,
            territory: 'Indigenous',
          }
        }));
 
        setPolygons(combinedPolygons);
 
        // Calculate centroids for labels
        const calculatedLabels = combinedPolygons.map(polygon => {
          const centroid = d3.geoCentroid(polygon);
          return {
            lat: centroid[1],
            lng: centroid[0],
            label: polygon.properties.name || polygon.properties.NAME || polygon.properties.territory,
          };
        });
 
        setLabels(calculatedLabels);
      } catch (error) {
        console.error("Error fetching GeoJSON data:", error);
      }
    };
 
    fetchGeoJSON();
 
    // Set the camera to focus on Indigenous territories
    globeEl.current.pointOfView({ lat: 50.0, lng: -95.0, altitude: 1.25 }, 3000);
  }, []);
 
  const handlePolygonClick = (polygon) => {
    setHighlightedPolygon(polygon || null);
  };
 
  return (
<div style={{ height: '500px', width: '100%' }}>
<Globe
        ref={globeEl}
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
        backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"
        animateIn={true}
        rotationSpeed={0.1}
        polygonsData={polygons}
        polygonAltitude={0.01}
        polygonCapColor={d => (d === highlightedPolygon ? 'orange' : 'transparent')}
        polygonSideColor={() => 'rgba(0, 0, 0, 0.1)'}
        polygonStrokeColor={() => '#111'}
        onPolygonClick={handlePolygonClick}
        polygonsTransitionDuration={300}
        labelsData={labels}
        labelLat={d => d.lat}
        labelLng={d => d.lng}
        labelText={d => d.label}
        labelSize={0.8}
        labelColor={() => 'black'}
        labelResolution={2}
      />
</div>
  );
};
 
export default GlobeComponent;

