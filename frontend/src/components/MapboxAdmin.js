import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import 'mapbox-gl/dist/mapbox-gl.css';
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';

const MapboxAdmin = ({ onShapeUpdate, initialCoordinates, tribeColor }) => {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const drawRef = useRef(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  // Initialize map when component mounts
  useEffect(() => {
    mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_TOKEN;
    
    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/kodalis2/cm7kvvsfl00x601qo0597eedp', // Using satellite view like in Image 2
      center: [-74.172, 40.736], // Note this is [lng, lat] in Mapbox
      zoom: 5
    });

    // Set up event to know when map is fully loaded
    mapRef.current.on('load', () => {
      setMapLoaded(true);
    });

    // Clean up on unmount
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
      }
    };
  }, []);

  // Initialize draw controls after map is loaded
  useEffect(() => {
    if (mapLoaded && mapRef.current) {
      console.log("Initializing draw control with color:", tribeColor);
      
      // Create the drawing control with custom styles for the polygon
      drawRef.current = new MapboxDraw({
        displayControlsDefault: false,
        controls: {
          polygon: true,
          trash: true,
          point: false, // Disable point drawing
          line: false, // Disable line drawing
        },
        // Set the default mode to simple_select to allow editing
        defaultMode: initialCoordinates && initialCoordinates.length > 0 ? 'simple_select' : 'draw_polygon',
        styles: [
          // Style for the polygon fill
          {
            'id': 'gl-draw-polygon-fill',
            'type': 'fill',
            'filter': ['all', ['==', '$type', 'Polygon'], ['!=', 'mode', 'static']],
            'paint': {
              'fill-color': tribeColor,
              'fill-outline-color': tribeColor,
              'fill-opacity': 0.5
            }
          },
          // Style for the polygon outline when active
          {
            'id': 'gl-draw-polygon-stroke-active',
            'type': 'line',
            'filter': ['all', ['==', '$type', 'Polygon'], ['==', 'active', 'true']],
            'paint': {
              'line-color': '#3388ff',
              'line-width': 2
            }
          },
          // Style for vertices
          {
            'id': 'gl-draw-point-point-stroke-active',
            'type': 'circle',
            'filter': ['all', ['==', '$type', 'Point'], ['==', 'meta', 'vertex'], ['==', 'active', 'true']],
            'paint': {
              'circle-radius': 8,
              'circle-color': '#fff',
              'circle-stroke-color': '#3388ff',
              'circle-stroke-width': 2
            }
          },
          // Style for midpoints
          {
            'id': 'gl-draw-point-mid-point',
            'type': 'circle',
            'filter': ['all', ['==', '$type', 'Point'], ['==', 'meta', 'midpoint']],
            'paint': {
              'circle-radius': 6,
              'circle-color': '#3388ff'
            }
          }
        ]
      });

      // Add the draw control to the map
      mapRef.current.addControl(drawRef.current);

      // Set up event handlers for drawing interactions
      mapRef.current.on('draw.create', updateShape);
      mapRef.current.on('draw.update', updateShape);
      mapRef.current.on('draw.delete', updateShape);
      mapRef.current.on('draw.selectionchange', updateShape);

      // If we have initial coordinates, add them to the map
      if (initialCoordinates && initialCoordinates.length >= 3) {
        // Convert from [lat, lng] to [lng, lat] format for Mapbox
        const lngLatCoords = initialCoordinates.map(coord => [coord[1], coord[0]]);
        
        // Close the polygon by adding the first point again
        const closedLngLatCoords = [...lngLatCoords, lngLatCoords[0]];
        
        // Create a polygon feature
        const polygon = {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'Polygon',
            coordinates: [closedLngLatCoords]
          }
        };
        
        // Add the polygon to the draw control
        drawRef.current.add(polygon);
        
        // Select the feature to enable editing
        const featureIds = drawRef.current.getAll().features.map(f => f.id);
        if (featureIds.length > 0) {
          drawRef.current.changeMode('simple_select', { featureIds: [featureIds[0]] });
        }
      }

      // Clean up event handlers on effect cleanup
      return () => {
        if (mapRef.current) {
          mapRef.current.off('draw.create', updateShape);
          mapRef.current.off('draw.update', updateShape);
          mapRef.current.off('draw.delete', updateShape);
          mapRef.current.off('draw.selectionchange', updateShape);
          if (drawRef.current) {
            mapRef.current.removeControl(drawRef.current);
          }
        }
      };
    }
  }, [mapLoaded, initialCoordinates]);

  // Update styles when tribeColor changes
  useEffect(() => {
    if (mapLoaded && mapRef.current && drawRef.current) {
      console.log("Updating map polygon color to:", tribeColor);
      
      // Save the current features and selection state
      const features = drawRef.current.getAll().features;
      const selectedIds = drawRef.current.getSelectedIds();
      const currentMode = drawRef.current.getMode();
      
      // Remove the old control
      mapRef.current.removeControl(drawRef.current);
      
      // Create a new control with updated color
      drawRef.current = new MapboxDraw({
        displayControlsDefault: false,
        controls: {
          polygon: true,
          trash: true,
          point: false,
          line: false,
        },
        defaultMode: currentMode,
        styles: [
          // Style for the polygon fill with updated color
          {
            'id': 'gl-draw-polygon-fill',
            'type': 'fill',
            'filter': ['all', ['==', '$type', 'Polygon'], ['!=', 'mode', 'static']],
            'paint': {
              'fill-color': tribeColor,
              'fill-outline-color': tribeColor,
              'fill-opacity': 0.5
            }
          },
          // Style for the polygon outline when active
          {
            'id': 'gl-draw-polygon-stroke-active',
            'type': 'line',
            'filter': ['all', ['==', '$type', 'Polygon'], ['==', 'active', 'true']],
            'paint': {
              'line-color': '#3388ff',
              'line-width': 2
            }
          },
          // Style for vertices
          {
            'id': 'gl-draw-point-point-stroke-active',
            'type': 'circle',
            'filter': ['all', ['==', '$type', 'Point'], ['==', 'meta', 'vertex'], ['==', 'active', 'true']],
            'paint': {
              'circle-radius': 8,
              'circle-color': '#fff',
              'circle-stroke-color': '#3388ff',
              'circle-stroke-width': 2
            }
          },
          // Style for midpoints
          {
            'id': 'gl-draw-point-mid-point',
            'type': 'circle',
            'filter': ['all', ['==', '$type', 'Point'], ['==', 'meta', 'midpoint']],
            'paint': {
              'circle-radius': 6,
              'circle-color': '#3388ff'
            }
          }
        ]
      });
      
      // Add the control back to the map
      mapRef.current.addControl(drawRef.current);
      
      // Re-add the features
      if (features.length > 0) {
        features.forEach(feature => {
          drawRef.current.add(feature);
        });
        
        // Restore selection if needed
        if (selectedIds && selectedIds.length > 0) {
          drawRef.current.changeMode('simple_select', { featureIds: selectedIds });
        }
      }
      
      // Re-add event listeners
      mapRef.current.on('draw.create', updateShape);
      mapRef.current.on('draw.update', updateShape);
      mapRef.current.on('draw.delete', updateShape);
      mapRef.current.on('draw.selectionchange', updateShape);
    }
  }, [mapLoaded, tribeColor]);

  // Update shape handler that passes coordinates back to parent component
  const updateShape = () => {
    if (!drawRef.current) return;
    
    const data = drawRef.current.getAll();
    if (data.features.length > 0) {
      const feature = data.features[0];
      if (feature.geometry.type === 'Polygon') {
        // Convert from [lng, lat] to [lat, lng] format
        const latLngCoords = feature.geometry.coordinates[0].map(
          coord => [coord[1], coord[0]]
        );
        
        // Remove the last coordinate (Mapbox closes the polygon automatically)
        const openCoords = latLngCoords.slice(0, -1);
        
        // Pass coordinates back to parent component
        onShapeUpdate(openCoords);
      }
    } else {
      // Clear the shape
      onShapeUpdate([]);
    }
  };

  return <div ref={mapContainerRef} style={{ width: '100%', height: '300px' }} />;
};

export default MapboxAdmin;