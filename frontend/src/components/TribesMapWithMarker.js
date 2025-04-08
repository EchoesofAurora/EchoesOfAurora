import React, { useState, useCallback, useEffect, useRef } from "react";
import MapGL, { Source, Layer, Marker, NavigationControl } from "react-map-gl";
import { FlyToInterpolator } from "react-map-gl";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import "../styles/mapBox.css";
import "rc-slider/assets/index.css"; // Required for rc-slider

const TribesMapWithMarker = ({ tribeId, onTribesDataLoaded, onCoordinatesChange }) => {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const onTribesDataLoadedRef = useRef(onTribesDataLoaded);
  
  // State to track screen size 
  const [screenSize, setScreenSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
    isMobile: typeof window !== 'undefined' ? window.innerWidth < 768 : false
  });

  // State for interaction controls with enhanced scroll zoom options
  const [interactionState, setInteractionState] = useState({
    scrollZoom: {
      speed: 0.01, // Using your preferred high value for faster zooming
      smooth: false, // Disable smooth zooming to eliminate delay between scroll actions
      eventFire: 'wheel' // Respond immediately to wheel events
    },
    dragPan: true,
    keyboard: true,
    doubleClickZoom: true
  });

  // Update viewport with additional settings to improve zoom responsiveness
  const [viewport, setViewport] = useState({
    latitude: 60,
    longitude: -100,
    zoom: 1.6,
    width: "100%",
    height: "70vh", // Reduced from 100vh to 70vh
    transitionDuration: 0, // Disable transition animation for immediate response
    transitionInterpolator: new FlyToInterpolator(),
  });

  // Data states
  const [tribesData, setTribesData] = useState(null);
  
  // UI states
  const [selectedTribeId, setSelectedTribeId] = useState(tribeId || null);
  const [mapStyle] = useState(
    "mapbox://styles/kodalis2/cm7kvvsfl00x601qo0597eedp"
  );
  
  const [isLoading, setIsLoading] = useState(true);
  const [showControls, setShowControls] = useState(true);
  
  // New state for marker
  const [marker, setMarker] = useState(null);
  
  // Effect to update selectedTribeId when tribeId prop changes
  useEffect(() => {
    if (tribeId && tribeId !== selectedTribeId) {
      setSelectedTribeId(tribeId);
    }
  }, [tribeId, selectedTribeId]);
  
  // Update the ref when the callback changes
  useEffect(() => {
    onTribesDataLoadedRef.current = onTribesDataLoaded;
  }, [onTribesDataLoaded]);
  
  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const isMobile = width < 768;
      
      // Only update if there's an actual change
      if (
        screenSize.width !== width ||
        screenSize.height !== height ||
        screenSize.isMobile !== isMobile
      ) {
        setScreenSize({
          width,
          height,
          isMobile
        });
        
        // Only update viewport if size category changes (mobile/desktop)
        if (screenSize.isMobile !== isMobile) {
          setViewport(prev => ({
            ...prev,
            width: "100%",
            height: "70vh",
            zoom: isMobile ? 0.8 : 1.6,
          }));
        }
      }
    };

    window.addEventListener('resize', handleResize);
    
    // Initial call wrapped in a timeout to avoid immediate update
    const timer = setTimeout(handleResize, 0);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timer);
    };
  }, [screenSize]); // Add screenSize as dependency

  // Store reference to the map instance when loaded
  const onLoad = useCallback(event => {
    if (event && event.target) {
      mapRef.current = event.target;
    }
  }, []);

  // Fetch tribes data from API
  useEffect(() => {
    let isMounted = true;
    
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch tribes data
        const tribesResponse = await fetch('/api/mapData');
        const data = await tribesResponse.json();

        // Guard against component unmounting during async operation
        if (!isMounted) return;
        
        const tribesJson = data["tribes"];
        
        // Transform tribes data to match expected format
        const transformedTribesData = {
          type: "FeatureCollection",
          features: tribesJson.map(tribe => ({
            type: "Feature",
            id: tribe.tribe_id,
            properties: {
              id: tribe.tribe_id,
              Name: tribe.tribe_name,
              color: tribe.map_color,
              description: tribe.description || `Information about ${tribe.tribe_name}`,
              isSelected: tribe.tribe_id.toString() === (tribeId || '').toString() // Mark selected tribe
            },
            geometry: tribe.geojson_data
          }))
        };
        
        setTribesData(transformedTribesData);
        
        // Pass the tribes data to parent component using the ref
        if (onTribesDataLoadedRef.current) {
          onTribesDataLoadedRef.current(tribesJson);
        }
      } catch (error) {
        // Error handling maintained without console.error
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchData();
    
    // Cleanup function
    return () => {
      isMounted = false;
    };
  }, [tribeId]); // Remove onTribesDataLoaded from dependencies
  
  // Function to zoom to a tribe's geometry bounds with enhanced padding and smoother transition
  const zoomToTribe = useCallback((tribeId) => {
    if (!tribesData || !mapRef.current) return;
    
    // Find the selected tribe
    const selectedTribe = tribesData.features.find(feature => 
      feature.id.toString() === tribeId.toString()
    );
    
    if (!selectedTribe || !selectedTribe.geometry) return;
    
    try {
      // Calculate the bounds of the tribe's geometry
      const bounds = new mapboxgl.LngLatBounds();
      
      // Handle different geometry types
      if (selectedTribe.geometry.type === 'Polygon') {
        selectedTribe.geometry.coordinates[0].forEach(coord => {
          bounds.extend(coord);
        });
      } else if (selectedTribe.geometry.type === 'MultiPolygon') {
        selectedTribe.geometry.coordinates.forEach(polygon => {
          polygon[0].forEach(coord => {
            bounds.extend(coord);
          });
        });
      } else if (selectedTribe.geometry.type === 'Point') {
        // Handle point geometry
        bounds.extend(selectedTribe.geometry.coordinates);
      } else if (selectedTribe.geometry.type === 'LineString') {
        // Handle line geometry
        selectedTribe.geometry.coordinates.forEach(coord => {
          bounds.extend(coord);
        });
      }
      
      // If we have valid bounds, update the viewport
      if (!bounds.isEmpty()) {
        // Calculate optimal zoom level based on the size of the bounds
        const boundsWidth = bounds.getEast() - bounds.getWest();
        const boundsHeight = bounds.getNorth() - bounds.getSouth();
        const maxDimension = Math.max(boundsWidth, boundsHeight);
        
        // Default to zoom level 4 for very small or point geometries
        let zoomLevel = 5;
        
        // Only calculate custom zoom for larger areas
        if (maxDimension > 0.1) {
          // Convert the dimension to a zoom level (logarithmic scale)
          zoomLevel = Math.max(3, Math.min(6, 8 - Math.log2(maxDimension)));
        }
        
        // Add visual highlight animation on tribe selection
        if (mapRef.current) {
          // Slight delay to ensure layers are ready
          setTimeout(() => {
            // Check if the layer exists before trying to modify it
            try {
              if (mapRef.current.getLayer('selected-tribe-fill')) {
                // Pulse animation for the selected tribe
                mapRef.current.setPaintProperty('selected-tribe-fill', 'fill-opacity', 0.9);
              }
            } catch (e) {
              // Layer not yet ready for animation
            }
          }, 500); // Increased timeout for layer readiness
        }
        
        // Check if the new viewport values are actually different
        if (
          Math.abs(viewport.longitude - bounds.getCenter().lng) > 0.0001 ||
          Math.abs(viewport.latitude - bounds.getCenter().lat) > 0.0001 ||
          Math.abs(viewport.zoom - zoomLevel) > 0.01
        ) {
          const newViewport = {
            ...viewport,
            longitude: bounds.getCenter().lng,
            latitude: bounds.getCenter().lat,
            zoom: zoomLevel,
            transitionDuration: 1000, // Smooth transition but not too slow
            transitionInterpolator: new FlyToInterpolator({ speed: 1.2 })
          };
          
          setViewport(newViewport);
        }
      }
    } catch (error) {
      // Error handling maintained without console.error
    }
  }, [tribesData, viewport]); // Remove screenSize.isMobile dependency

  // Zoom to selected tribe when it's available or changes
  useEffect(() => {
    if (selectedTribeId && tribesData && mapRef.current) {
      // Add a small delay to ensure the map is ready
      const timer = setTimeout(() => {
        zoomToTribe(selectedTribeId);
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [selectedTribeId, tribesData, zoomToTribe]);

  // Handle click solely for marker placement
  const handleClick = useCallback((event) => {
    // Get click coordinates
    const coordinates = [event.lngLat[0], event.lngLat[1]];
    
    // Set the marker at the clicked location
    const markerData = {
      longitude: coordinates[0],
      latitude: coordinates[1],
      title: `Selected Location (${coordinates[0].toFixed(4)}, ${coordinates[1].toFixed(4)})`
    };
    setMarker(markerData);
    
    // Pass coordinates to parent component
    if (onCoordinatesChange) {
      onCoordinatesChange(markerData);
    }
  }, [onCoordinatesChange]);

  // Handler to clear the marker
  const clearMarker = useCallback(() => {
    setMarker(null);
    // Clear coordinates in parent component
    if (onCoordinatesChange) {
      onCoordinatesChange(null);
    }
  }, [onCoordinatesChange]);

  // Enhanced styling for non-selected tribes - slightly dimmed
  const fillLayer = {
    id: "tribe-fill",
    type: "fill",
    source: "tribes",
    paint: {
      "fill-color": ["get", "color"],
      "fill-opacity": 0.3, // Reduced from 0.4 to create more contrast with selected tribe
    },
    filter: ["!=", ["to-string", ["get", "id"]], selectedTribeId ? selectedTribeId.toString() : ""]
  };

  // Enhanced highlighting for selected tribe with increased opacity and emphasis
  const selectedTribeLayer = {
    id: "selected-tribe-fill",
    type: "fill",
    source: "tribes",
    paint: {
      "fill-color": ["get", "color"],
      "fill-opacity": 0.9, // Very opaque to stand out
    },
    filter: ["==", ["to-string", ["get", "id"]], selectedTribeId ? selectedTribeId.toString() : ""],
  };

  // Add a bold border for the selected tribe with animation
  const selectedTribeBorderLayer = {
    id: "selected-tribe-border",
    type: "line",
    source: "tribes",
    paint: {
      "line-color": "#000",
      "line-width": 3,
      "line-dasharray": [3, 3],
      // Simplified animation to avoid potential compatibility issues
      "line-opacity": 0.8
    },
    filter: ["==", ["to-string", ["get", "id"]], selectedTribeId ? selectedTribeId.toString() : ""],
  };

  // Add a glow effect layer for the selected tribe
  const selectedTribeGlowLayer = {
    id: "selected-tribe-glow",
    type: "line",
    source: "tribes",
    paint: {
      "line-color": "#ffffff",
      "line-width": 5,
      "line-blur": 3,
      "line-opacity": 0.8,
    },
    filter: ["==", ["to-string", ["get", "id"]], selectedTribeId ? selectedTribeId.toString() : ""],
  };

  // Enhance labels with emphasis for selected tribe
  const labelLayer = {
    id: "tribe-label",
    type: "symbol",
    source: "tribes",
    layout: {
      "text-field": ["coalesce", ["get", "Name"], "Unnamed"],
      "text-font": ["Open Sans Bold", "Arial Unicode MS Bold"],
      "text-size": [
        "case",
        ["==", ["to-string", ["get", "id"]], selectedTribeId ? selectedTribeId.toString() : ""],
        screenSize.isMobile ? 14 : 16, // Larger text for selected tribe
        screenSize.isMobile ? 10 : 12  // Regular size for other tribes
      ],
      "text-offset": [0, 0.8],
      "text-anchor": "top",
      "symbol-placement": "point",
      "text-allow-overlap": true, // Allow all labels to overlap (simpler approach)
      "text-ignore-placement": false, // Don't ignore placement rules
    },
    paint: {
      "text-color": [
        "case",
        ["==", ["to-string", ["get", "id"]], selectedTribeId ? selectedTribeId.toString() : ""],
        "#000000", // Black text for selected tribe
        "#555555"  // Grey text for other tribes
      ],
      "text-halo-color": "#ffffff",
      "text-halo-width": [
        "case",
        ["==", ["to-string", ["get", "id"]], selectedTribeId ? selectedTribeId.toString() : ""],
        2, // Thicker halo for selected tribe
        1
      ],
    },
  };

  if (isLoading) {
    return <div className="loading">Loading map data...</div>;
  }

  return (
    <div>
      <div 
        ref={mapContainerRef} 
        className="map-container" 
        style={{ 
          width: "100%", 
          height: "70vh", 
          position: "relative",
          border: "1px solid #ccc",
          borderRadius: "8px",
          overflow: "hidden",
          margin: "20px 0"
        }}
      >
        <MapGL
          {...viewport}
          mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
          mapStyle={mapStyle}
          onLoad={onLoad}
          onViewportChange={(newViewport) =>
            setViewport({
              ...newViewport,
              transitionDuration: 0, // Keep transition duration at 0 for immediate response
            })
          }
          onClick={handleClick}
          interactiveLayerIds={tribesData ? ["tribe-fill"] : []}
          // Set interaction controls based on state with enhanced scroll zoom
          scrollZoom={interactionState.scrollZoom}
          dragPan={interactionState.dragPan}
          keyboard={interactionState.keyboard}
          doubleClickZoom={interactionState.doubleClickZoom}
          // Add these options to maintain smooth interaction flow
          clickZoom={false} // Disable automatic zoom on click
          touchAction="pan-y" // Allow vertical touch scrolling while maintaining map interactions
        >
          {/* Tribes Source and Layers */}
          {tribesData && (
            <Source id="tribes" type="geojson" data={tribesData}>
              <Layer key="tribe-fill" {...fillLayer} />
              {selectedTribeId && (
                <>
                  <Layer key="selected-tribe-glow" {...selectedTribeGlowLayer} />
                  <Layer key="selected-tribe-fill" {...selectedTribeLayer} />
                  <Layer key="selected-tribe-border" {...selectedTribeBorderLayer} />
                </>
              )}
              <Layer key="tribe-label" {...labelLayer} />
            </Source>
          )}
          
          {/* Add a separate highlighted label for the selected tribe */}
          {selectedTribeId && tribesData && (
            <Source 
              id="selected-tribe-label-source" 
              type="geojson" 
              data={{
                type: "FeatureCollection",
                features: tribesData.features.filter(
                  feature => feature.id.toString() === selectedTribeId.toString()
                )
              }}
            >
              <Layer
                id="selected-tribe-label"
                type="symbol"
                layout={{
                  "text-field": ["coalesce", ["get", "Name"], "Unnamed"],
                  "text-font": ["Open Sans Bold", "Arial Unicode MS Bold"],
                  "text-size": screenSize.isMobile ? 14 : 16,
                  "text-offset": [0, 0.8],
                  "text-anchor": "top",
                  "symbol-placement": "point",
                  "text-allow-overlap": true,
                  "text-max-width": 12,
                  "text-letter-spacing": 0.05,
                }}
                paint={{
                  "text-color": "#000000",
                  "text-halo-color": "#ffffff",
                  "text-halo-width": 2,
                }}
              />
            </Source>
          )}

          {/* Selected Tribe Indicator */}
          {selectedTribeId && tribesData && (
            <div
              style={{
                position: "absolute",
                top: 10,
                left: 10,
                backgroundColor: "rgba(255, 255, 255, 0.9)",
                padding: "10px",
                borderRadius: "4px",
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
                zIndex: 5,
                maxWidth: "300px"
              }}
            >
              <strong>Selected Tribe:</strong> {
                tribesData.features.find(f => f.id.toString() === selectedTribeId.toString())?.properties.Name || 'Unknown'
              }
            </div>
          )}

          {/* Single Map Marker */}
          {marker && (
            <Marker 
              longitude={marker.longitude} 
              latitude={marker.latitude} 
              offsetTop={-10} 
              offsetLeft={-10}
              anchor="bottom" 
            >
              <div className="map-marker">
                <svg 
                  height="20" 
                  width="20" 
                  viewBox="0 0 24 24" 
                  style={{
                    cursor: 'pointer',
                    fill: '#d00',
                    stroke: 'none',
                    transform: 'translate(0, 0)'
                  }}
                >
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
                </svg>
              </div>
            </Marker>
          )}

          {/* Built-in Navigation Controls - This is the key change */}
          {showControls && (
            <div style={{ position: 'absolute', top: 10, right: 40 }}>
              <NavigationControl showCompass={true} />
            </div>
          )}
        </MapGL>
      </div>

      {/* Location Information Below Map Instead of Popup */}
      <div 
        style={{
          marginTop: "20px",
          padding: "15px",
          backgroundColor: "#f8f9fa",
          borderRadius: "8px",
          border: "1px solid #dee2e6"
        }}
      >
        <h4 style={{ marginBottom: "15px" }}>Selected Location</h4>
        
        {marker ? (
          <div>
            <p style={{ fontSize: "16px", marginBottom: "15px" }}>
              <strong>Coordinates:</strong> {marker.longitude.toFixed(6)}, {marker.latitude.toFixed(6)}
            </p>
            <button
              onClick={clearMarker}
              style={{
                background: "#f44336",
                color: "white",
                border: "none",
                padding: "8px 15px",
                borderRadius: "4px",
                cursor: "pointer",
                fontWeight: "500"
              }}
            >
              Clear Marker
            </button>
          </div>
        ) : (
          <p style={{ color: "#6c757d", fontStyle: "italic" }}>
            Click on the map to select a location
          </p>
        )}
        
        
      </div>
    </div>
  );
};

export default TribesMapWithMarker;