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
  const drawControlAdded = useRef(false);
  const initialRenderRef = useRef(true);
  const lastShapeRef = useRef([]);
  
  // Generate a unique ID that's stable for this component instance
  // This is crucial to avoid source ID conflicts
  const uniqueIdRef = useRef(`draw-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`);
  
  // Initialize map only once when component mounts
  useEffect(() => {
    if (!mapboxgl.accessToken) {
      mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_TOKEN;
    }
    
    // Create the map instance only once
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/kodalis2/cm7kvvsfl00x601qo0597eedp',
      center: [-74.172, 40.736],
      zoom: 5,
      preserveDrawingBuffer: true, // Helps with rendering stability
      fadeDuration: 0, // Reduce animations to prevent flickering
      renderWorldCopies: false // Disable world copies to reduce rendering load
    });
    
    mapRef.current = map;
    
    // Handle map load completion
    map.on('load', () => {
      console.log('Map loaded');
      setMapLoaded(true);
    });
    
    // Cleanup on unmount
    return () => {
      console.log('Cleaning up map...');
      
      // Clean up draw control if it exists
      if (drawRef.current && mapRef.current) {
        try {
          // First remove all event listeners
          mapRef.current.off('draw.create');
          mapRef.current.off('draw.update');
          mapRef.current.off('draw.delete');
          mapRef.current.off('draw.selectionchange');
          
          // Then remove the control itself
          try {
            mapRef.current.removeControl(drawRef.current);
          } catch (e) {
            console.log('Error removing draw control:', e);
          }
          
          // Clean up ALL sources that might be causing conflicts
          try {
            if (mapRef.current.getStyle) {
              const style = mapRef.current.getStyle();
              
              if (style && style.sources) {
                // Try to clean up any source IDs with our prefix to be safe
                Object.keys(style.sources).forEach(sourceId => {
                  if (sourceId.includes('mapbox-gl-draw')) {
                    try {
                      // First try to remove any layers using this source
                      if (style.layers) {
                        style.layers.forEach(layer => {
                          if (layer.source === sourceId) {
                            try {
                              mapRef.current.removeLayer(layer.id);
                            } catch (err) {
                              // Silent fail - layer might already be removed
                            }
                          }
                        });
                      }
                      
                      // Then try to remove the source itself
                      mapRef.current.removeSource(sourceId);
                    } catch (err) {
                      // Silent fail - source might already be removed
                    }
                  }
                });
              }
            }
          } catch (sourceError) {
            console.error('Error cleaning up sources:', sourceError);
          }
          
          drawRef.current = null;
          drawControlAdded.current = false;
        } catch (e) {
          console.error('Error cleaning up draw control:', e);
        }
      }
      
      // Finally remove the map
      if (mapRef.current) {
        try {
          mapRef.current.remove();
          mapRef.current = null;
        } catch (e) {
          console.error('Error removing map:', e);
        }
      }
    };
  }, []); // Empty deps array means this runs once on mount

  // Create and manage the draw control
  useEffect(() => {
    if (!mapLoaded || !mapRef.current) return;
    
    // Only add draw control once
    if (drawControlAdded.current) return;
    
    try {
      // Use our stable unique ID
      const uniqueId = uniqueIdRef.current;

      // Create draw styles with unique IDs
      const drawStyles = [
        {
          id: `gl-draw-polygon-fill-active-${uniqueId}`,
          type: 'fill',
          filter: ['all', ['==', '$type', 'Polygon'], ['==', 'active', 'true']],
          paint: {
            'fill-color': tribeColor,
            'fill-opacity': 0.4
          }
        },
        {
          id: `gl-draw-polygon-stroke-active-${uniqueId}`,
          type: 'line',
          filter: ['all', ['==', '$type', 'Polygon'], ['==', 'active', 'true']],
          paint: {
            'line-color': '#3388ff',
            'line-width': 3
          }
        },
        {
          id: `gl-draw-polygon-vertex-active-${uniqueId}`,
          type: 'circle',
          filter: ['all', ['==', 'meta', 'vertex'], ['==', '$type', 'Point']],
          paint: {
            'circle-radius': 8,
            'circle-color': '#fff',
            'circle-stroke-color': '#3388ff',
            'circle-stroke-width': 2
          }
        },
        // Add midpoint style for creating new vertices
        {
          id: `gl-draw-polygon-midpoint-${uniqueId}`,
          type: 'circle',
          filter: ['all', ['==', 'meta', 'midpoint'], ['==', '$type', 'Point']],
          paint: {
            'circle-radius': 6,
            'circle-color': '#3388ff',
            'circle-stroke-color': '#fff',
            'circle-stroke-width': 2
          }
        },
        {
          id: `gl-draw-polygon-fill-inactive-${uniqueId}`,
          type: 'fill',
          filter: ['all', ['==', '$type', 'Polygon'], ['!=', 'active', 'true']],
          paint: {
            'fill-color': tribeColor,
            'fill-opacity': 0.2
          }
        },
        {
          id: `gl-draw-polygon-stroke-inactive-${uniqueId}`,
          type: 'line',
          filter: ['all', ['==', '$type', 'Polygon'], ['!=', 'active', 'true']],
          paint: {
            'line-color': tribeColor,
            'line-width': 2
          }
        }
      ];

      // Create the draw control
      const draw = new MapboxDraw({
        displayControlsDefault: false,
        controls: {
          polygon: true,
          trash: true
        },
        // Choose mode based on initial data
        defaultMode: initialCoordinates && initialCoordinates.length > 0 ? 'simple_select' : 'draw_polygon',
        userProperties: true, // Allow custom properties
        styles: drawStyles
      });
      
      // Store the draw instance
      drawRef.current = draw;
      
      // Add the draw control to the map
      mapRef.current.addControl(draw, 'top-right');
      drawControlAdded.current = true;
      
      // Define event handler function
      const handleDrawEvent = (e) => {
        try {
          if (!drawRef.current) return;
                    
          const data = drawRef.current.getAll();
          
          if (!data || !data.features) {
            // Only update if the shape has changed
            if (lastShapeRef.current.length > 0) {
              lastShapeRef.current = [];
              onShapeUpdate([]);
            }
            return;
          }
          
          if (data.features.length > 0) {
            // Process the first polygon feature
            const feature = data.features[0];
            
            if (feature && 
                feature.geometry && 
                feature.geometry.type === 'Polygon' && 
                Array.isArray(feature.geometry.coordinates) && 
                feature.geometry.coordinates.length > 0 &&
                Array.isArray(feature.geometry.coordinates[0])) {
              
              // Convert from [lng, lat] to [lat, lng] format
              const latLngCoords = feature.geometry.coordinates[0].map(coord => {
                if (Array.isArray(coord) && coord.length >= 2) {
                  return [coord[1], coord[0]]; // Switch from [lng,lat] to [lat,lng]
                }
                return null;
              }).filter(Boolean);
              
              if (latLngCoords.length >= 3) {
                // Compare with last shape to avoid unnecessary updates
                const lastShape = lastShapeRef.current;
                const lastShapeJson = JSON.stringify(lastShape);
                const currentShapeJson = JSON.stringify(latLngCoords);
                
                if (lastShapeJson !== currentShapeJson) {
                  lastShapeRef.current = latLngCoords;
                  onShapeUpdate(latLngCoords);
                }
              } else {
                if (lastShapeRef.current.length > 0) {
                  lastShapeRef.current = [];
                  onShapeUpdate([]);
                }
              }
            } else {
              if (lastShapeRef.current.length > 0) {
                lastShapeRef.current = [];
                onShapeUpdate([]);
              }
            }
          } else {
            // No features, clear shape
            if (lastShapeRef.current.length > 0) {
              lastShapeRef.current = [];
              onShapeUpdate([]);
            }
          }
        } catch (error) {
          console.error('Error handling draw event:', error);
          onShapeUpdate([]);
        }
      };
      
      // Add event listeners for draw events
      mapRef.current.on('draw.create', handleDrawEvent);
      mapRef.current.on('draw.update', handleDrawEvent);
      mapRef.current.on('draw.delete', handleDrawEvent);
      mapRef.current.on('draw.selectionchange', handleDrawEvent);
      
      // If we have initial coordinates, add them to the map
      if (initialCoordinates && Array.isArray(initialCoordinates) && initialCoordinates.length >= 3) {
        try {
          // Store the initial shape
          lastShapeRef.current = [...initialCoordinates];
          
          // Convert coordinates to Mapbox format
          const lngLatCoords = initialCoordinates
            .filter(coord => Array.isArray(coord) && coord.length >= 2)
            .map(coord => [coord[1], coord[0]]); // Convert from [lat,lng] to [lng,lat]
          
          if (lngLatCoords.length >= 3) {
            // Check if we need to close the polygon
            let closedCoords = [...lngLatCoords];
            const firstPoint = lngLatCoords[0];
            const lastPoint = lngLatCoords[lngLatCoords.length - 1];
            
            if (firstPoint[0] !== lastPoint[0] || firstPoint[1] !== lastPoint[1]) {
              // Add first point to the end to close the polygon
              closedCoords.push(lngLatCoords[0]);
            }
            
            // Create the polygon GeoJSON with our unique ID
            const polygon = {
              type: 'Feature',
              id: `initial-polygon-${uniqueId}`,
              properties: {},
              geometry: {
                type: 'Polygon',
                coordinates: [closedCoords]
              }
            };
            
            // Ensure map is fully loaded and ready before adding features
            const waitForMapAndAdd = () => {
              // First clear any existing features to avoid duplicates
              try {
                if (drawRef.current && drawRef.current.getAll && drawRef.current.getAll().features.length > 0) {
                  drawRef.current.deleteAll();
                }
              
                // Add the polygon to the draw control with a try/catch to handle potential errors
                const features = drawRef.current.add(polygon);
                
                // Only zoom and fit the first time
                if (initialRenderRef.current) {
                  initialRenderRef.current = false;
                  
                  // Set the map view to the polygon with reduced animation
                  const bounds = new mapboxgl.LngLatBounds();
                  lngLatCoords.forEach(coord => bounds.extend(coord));
                  
                  // Use a timeout to allow map to settle
                  setTimeout(() => {
                    if (mapRef.current) {
                      mapRef.current.fitBounds(bounds, {
                        padding: 50,
                        animate: false // Disable animation completely
                      });
                    }
                  }, 100);
                }
                
                // Select the feature to enable editing
                if (features && features.length > 0) {
                  drawRef.current.changeMode('simple_select', { featureIds: features });
                }
              } catch (error) {
                console.error('Error adding polygon to draw control:', error);
                // If we hit a source ID conflict, regenerate the unique ID and try again after a delay
                if (error.message && error.message.includes('source')) {
                  uniqueIdRef.current = `draw-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
                  // Try again after a short delay
                  setTimeout(waitForMapAndAdd, 100);
                }
              }
            };
            
            // Wait a moment for the map to be fully ready
            setTimeout(waitForMapAndAdd, 200);
          }
        } catch (error) {
          console.error('Error adding initial coordinates:', error);
        }
      }
    } catch (error) {
      console.error('Error initializing draw control:', error);
    }
  }, [mapLoaded, initialCoordinates, onShapeUpdate, tribeColor]);

  // Update polygon fill color when tribeColor changes - but avoid recreating draw control
  useEffect(() => {
    if (!mapLoaded || !mapRef.current || !drawRef.current || !drawControlAdded.current) return;
    
    try {
      // Get current features
      const features = drawRef.current.getAll();
      
      // Just update the color property rather than recreating the whole draw control
      if (features && features.features && features.features.length > 0) {
        // Update each polygon feature with the new color
        features.features.forEach(feature => {
          if (feature.properties) {
            feature.properties.color = tribeColor;
          }
        });
        
        // Force a redraw by firing a custom event rather than draw.update
        // This avoids triggering our update handlers
        mapRef.current.fire('draw.colorupdate', { features: features.features });
      }
    } catch (error) {
      console.error('Error updating tribe color:', error);
    }
  }, [mapLoaded, tribeColor]);

  return (
    <div ref={mapContainerRef} style={{ width: '100%', height: '300px', position: 'relative' }}>
      <div style={{ 
        position: 'absolute', 
        top: '10px', 
        left: '10px', 
        backgroundColor: 'rgba(255,255,255,0.8)', 
        padding: '5px 10px',
        borderRadius: '4px',
        fontSize: '12px',
        zIndex: 10
      }}>
        <p style={{ margin: '0 0 3px 0' }}>
          Click to draw, double-click to finish
        </p>
        <p style={{ margin: '0' }}>
          Click on polygon to select and edit
        </p>
      </div>
    </div>
  );
};

export default MapboxAdmin;