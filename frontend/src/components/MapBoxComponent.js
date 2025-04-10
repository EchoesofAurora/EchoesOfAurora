import React, { useState, useCallback, useEffect, useRef } from "react";
import MapGL, { Source, Layer } from "react-map-gl";
import { FlyToInterpolator } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import "../styles/mapBox.css";
import "rc-slider/assets/index.css"; // Required for rc-slider
import SidePanel from "./SidePanel";
import TimelineSlider from "./TimelineSlider"; // Import the TimelineSlider with story availability

const MapBoxComponent = () => {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  
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
    height: "calc(100vh - 12vh)", // Adjusted to match container height
    transitionDuration: 0, // Disable transition animation for immediate response
    transitionInterpolator: new FlyToInterpolator(),
  });

  // Data states
  const [tribesData, setTribesData] = useState(null);
  const [storiesData, setStoriesData] = useState(null);

  // UI states
  const [hoveredFeatureId, setHoveredFeatureId] = useState(null);
  const [hoveredStory, setHoveredStory] = useState(null);
  const [is3dOn, setIs3dOn] = useState(false);
  const [isStoriesOn, setIsStoriesOn] = useState(true);
  const [mapStyle, setMapStyle] = useState(
    "mapbox://styles/kodalis2/cm7kvvsfl00x601qo0597eedp"
  );

  // Control map clicks
  const [ignoreMapClicks, setIgnoreMapClicks] = useState(false);
  
  // Define year constants
  const startYear = 1000;
  const currentYear = new Date().getFullYear();
  
  // Initialize with predefined values
  const [yearRange, setYearRange] = useState({
    startYear: 1400,
    endYear: currentYear
  });
  
  const [filteredStories, setFilteredStories] = useState(null);
  const [selectedTribe, setSelectedTribe] = useState(null);
  const [selectedStoryId, setSelectedStoryId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showControls, setShowControls] = useState(true);
  
  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      setScreenSize({
        width,
        height,
        isMobile: width < 768
      });
      
      // Adjust viewport based on screen size
      setViewport(prev => ({
        ...prev,
        width: "100%",
        height: "100vh",
        zoom: width < 768 ? 0.8 : 1.6, // Adjust zoom level for mobile
      }));
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Initial call
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Store reference to the map instance when loaded
  const onLoad = useCallback(event => {
    if (event && event.target) {
      mapRef.current = event.target;
    }
  }, []);

  // Toggle interaction controls
  const toggleScrollZoom = () => setInteractionState(prev => ({ ...prev, scrollZoom: !prev.scrollZoom }));
  const toggleDragPan = () => setInteractionState(prev => ({ ...prev, dragPan: !prev.dragPan }));
  const toggleKeyboard = () => setInteractionState(prev => ({ ...prev, keyboard: !prev.keyboard }));
  const toggleDoubleClickZoom = () => setInteractionState(prev => ({ ...prev, doubleClickZoom: !prev.doubleClickZoom }));

  // Handle sidepanel close
  const handlePanelClose = () => {
    setSelectedTribe(null);
    setIgnoreMapClicks(true);
    
    // Reset the flag after a short delay
    setTimeout(() => {
      setIgnoreMapClicks(false);
    }, 300);
  };

  // Fetch tribes and stories data from API
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch tribes data
        const tribesResponse = await fetch('api/mapData');
        const data = await tribesResponse.json();

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
            },
            geometry: tribe.geojson_data
          }))
        };
        setTribesData(transformedTribesData);
        
        // Fetch stories data
        const storiesJson = data["stories"];

        // Transform stories data to match expected format
        const transformedStoriesData = {
          type: "FeatureCollection",
          features: storiesJson.map(story => ({
            type: "Feature",
            properties: {
              title: story.story_name,
              year: story.story_year,
              description: story.description || "",
              tribeid: story.tribe_id,
              references: story.references || [],
              location: story.location || "",
            },
            geometry: story.geometry
          }))
        };
        setStoriesData(transformedStoriesData);
        setFilteredStories(transformedStoriesData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter stories when year range changes
  useEffect(() => {
    if (!storiesData) return;
    
    const filtered = {
      ...storiesData,
      features: storiesData.features.filter((story) => {
        const storyYear = story.properties.year;
        return storyYear >= yearRange.startYear && storyYear <= yearRange.endYear;
      }),
    };
    setFilteredStories(filtered);
  }, [yearRange, storiesData]);

  // Update map style based on 3D toggle
  useEffect(() => {
    setMapStyle(
      is3dOn
        ? "mapbox://styles/kodalis2/cm7kuhknr00wv01qo7212f42o"
        : "mapbox://styles/kodalis2/cm7kvvsfl00x601qo0597eedp"
    );
  }, [is3dOn]);

  const handleToggle = () => setIs3dOn(!is3dOn);
  const handleStoriesToggle = () => setIsStoriesOn(!isStoriesOn);
  const toggleControls = () => setShowControls(!showControls);

  const handleHover = useCallback((event) => {
    const features = event.features;
    if (!features || features.length === 0) {
      setHoveredFeatureId(null);
      setHoveredStory(null);
      return;
    }

    const feature = features[0];
    if (feature.layer.id === "tribe-fill") {
      setHoveredFeatureId(feature.id);
      setHoveredStory(null);
    } else if (feature.layer.id === "stories-layer") {
      setHoveredStory(feature.properties);
      setHoveredFeatureId(null);
    }
  }, []);

  const handleClick = (event) => {
    if (ignoreMapClicks) return;

    const features = event.features;
    if (!features || features.length === 0) return;

    const clickedFeature = features[0];
    
    if (clickedFeature.layer.id === "tribe-fill") {
      // Handle tribe click
      const tribeId = clickedFeature.id;
      setSelectedStoryId(null); // Reset selected story
      fetchTribeStoriesData(tribeId);
    } else if (clickedFeature.layer.id === "stories-layer") {
      // Handle story click
      const storyTribeId = clickedFeature.properties.tribeid;
      setSelectedStoryId(clickedFeature.properties.title); // Store the clicked story's title
      fetchTribeStoriesData(storyTribeId);
    }
  };

  const fetchTribeStoriesData = async (id) => {
    try {
      // Fetch tribes data
      const tribesResponse = await fetch('api/mapData/tribes/' + id);
      const data = await tribesResponse.json();
      setSelectedTribe(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } 
  };

  // Handle year range change from timeline slider
  const handleYearRangeChange = (newRange) => {
    setYearRange(newRange);
  };

  // Calculate timeline position based on whether side panel is open
  const getTimelineStyles = () => {
    if (selectedTribe) {
      // When side panel is open
      if (screenSize.isMobile) {
        // For mobile: move timeline to bottom-right with more space from bottom
        return {
          position: "fixed", 
          bottom: 20,      
          right: 10,
          left: 'auto',
          width: "60%",
          zIndex: -2000    // Ensure it's above map but below other controls
        };
      } else {
        // For desktop: move timeline to right side with more space from bottom
        return {
          position: "fixed", 
          bottom: 20,      
          right: 50,       // Adjusted based on side panel width
          left: 'auto',
          width: "50%",
          zIndex: 1000     // Ensure it's above map but below other controls
        };
      }
    } else {
      // Default position when side panel is closed
      return {
        position: "fixed",  
        bottom: 20,         
        left: "50%",
        transform: "translateX(-50%)",
        width: screenSize.isMobile ? "95%" : "60%",
        maxWidth: "800px",
        zIndex: 1000       // Ensure it's above map but below other controls
      };
    }
  };

  const fillLayer = {
    id: "tribe-fill",
    type: "fill",
    source: "tribes",
    paint: {
      "fill-color": ["get", "color"],
      "fill-opacity": 0.5,
    },
  };

  const hoverFillLayer = {
    id: "tribe-hover-fill",
    type: "fill",
    source: "tribes",
    paint: {
      "fill-color": ["get", "color"],
      "fill-opacity": 0.6,
    },
    filter: ["==", "id", hoveredFeatureId || ""],
  };

  const hoverBorderLayer = {
    id: "tribe-hover-border",
    type: "line",
    source: "tribes",
    paint: {
      "line-color": "#000",
      "line-width": 1,
    },
    filter: ["==", "id", hoveredFeatureId || ""],
  };

  const labelLayer = {
    id: "tribe-label",
    type: "symbol",
    source: "tribes",
    layout: {
      "text-field": ["coalesce", ["get", "Name"], "Unnamed"],
      "text-font": ["Open Sans Bold", "Arial Unicode MS Bold"],
      "text-size": screenSize.isMobile ? 10 : 12, // Smaller text on mobile
      "text-offset": [0, 0.8],
      "text-anchor": "top",
      "symbol-placement": "point",
    },
    paint: {
      "text-color": "#000000",
      "text-halo-color": "#ffffff",
      "text-halo-width": 1,
    },
  };

  // Define Layer for Stories (will only be shown when isStoriesOn is true)
  const storiesLayer = {
    id: "stories-layer",
    type: "circle",
    paint: {
      "circle-radius": screenSize.isMobile ? 4 : 6,
      "circle-color": "#B366FF",
      "circle-stroke-width": screenSize.isMobile ? 1 : 2,
      "circle-stroke-color": "#ffffff",
    },
  };

  const storyLabelLayer = {
    id: "story-label",
    type: "symbol",
    layout: {
      "text-field": ["get", "title"],
      "text-font": ["Open Sans Bold", "Arial Unicode MS Bold"],
      "text-size": screenSize.isMobile ? 10 : 12,
      "text-offset": [0, -1.5],
      "text-anchor": "bottom",
    },
    paint: {
      "text-color": "#000000",
      "text-halo-color": "#ffffff",
      "text-halo-width": 2,
      "text-halo-blur": 1,
      "text-opacity": 1,
    },
    filter: ["==", ["get", "title"], hoveredStory ? hoveredStory.title : ""],
  };

  if (isLoading) {
    return <div className="loading">Loading map data...</div>;
  }

  return (
    <div 
      ref={mapContainerRef} 
      className="map-container" 
      style={{ width: "100%", height: "calc(100vh - 12vh)", position: "relative" }}
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
        onClick={selectedTribe && screenSize.isMobile ? null : handleClick}
        onHover={selectedTribe && screenSize.isMobile ? null : handleHover}
        interactiveLayerIds={selectedTribe && screenSize.isMobile ? [] : ["tribe-fill", "stories-layer"]}
        scrollZoom={selectedTribe && screenSize.isMobile ? false : interactionState.scrollZoom}
        dragPan={selectedTribe && screenSize.isMobile ? false : interactionState.dragPan}
        keyboard={selectedTribe && screenSize.isMobile ? false : interactionState.keyboard}
        doubleClickZoom={selectedTribe && screenSize.isMobile ? false : interactionState.doubleClickZoom}
        // Add these options to maintain smooth interaction flow
        clickZoom={false} // Disable automatic zoom on click
        touchAction="pan-y" // Allow vertical touch scrolling while maintaining map interactions
        dragRotate={false} // Disable rotation for better touch handling
        touchZoom={true} // Enable touch zoom gestures
        touchPitch={false} // Disable pitch changes on touch
        cooperativeGestures={true} // Enable cooperative gestures
      >
        {/* Tribes Source and Layers */}
        {tribesData && (
          <Source id="tribes" type="geojson" data={tribesData}>
            <Layer key="tribe-fill" {...fillLayer} />
            {hoveredFeatureId && (
              <Layer key="tribe-hover-fill" {...hoverFillLayer} />
            )}
            {hoveredFeatureId && (
              <Layer key="tribe-hover-border" {...hoverBorderLayer} />
            )}
            <Layer key="tribe-label" {...labelLayer} />
          </Source>
        )}

        {/* Stories Source and Layer - Only shown if isStoriesOn is true */}
        {isStoriesOn && filteredStories && (
          <Source id="stories" type="geojson" data={filteredStories}>
            <Layer {...storiesLayer} />
            <Layer {...storyLabelLayer} />
          </Source>
        )}

        {/* Mobile Controls Toggle Button */}
        {screenSize.isMobile && (
          <button
            className="controls-toggle-btn"
            onClick={toggleControls}
            style={{
              position: "fixed",
              top: "calc(12vh + 10px)", // Position below header
              zIndex: 1001,
              background: "rgba(255, 255, 255, 0.95)",
              border: "none",
              borderRadius: "4px",
              padding: "8px",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.3)"
            }}
          >
            {showControls ? "Hide Controls" : "Show Controls"}
          </button>
        )}

        {/* 3D and Stories Toggle - Responsive */}
        {(screenSize.isMobile ? showControls : true) && (
          <div 
            className="map-toggle-controls"
            style={{ 
              position: "fixed",
              top: "calc(12vh + 10px)", // Position below header
              right: 10,
              zIndex: 1001
            }}
          >
            <div className="toggle-container">
              <span>3D</span>
              <label className="switch">
                <input type="checkbox" checked={is3dOn} onChange={handleToggle} />
                <span className="slider round"></span>
              </label>
              <span>Stories</span>
              <label className="switch">
                <input
                  type="checkbox"
                  checked={isStoriesOn}
                  onChange={handleStoriesToggle}
                />
                <span className="slider round"></span>
              </label>
            </div>
          </div>
        )}

        {/* Navigation Controls */}
        <div 
          className="map-navigation-controls"
          style={{ 
            position: "fixed",
            top: screenSize.isMobile ? "calc(12vh + 60px)" : "calc(12vh + 10px)", // Position below header
            right: screenSize.isMobile ? 10 : 220, // Position to the left of the toggle
            zIndex: 1001,
            display: "flex",
            flexDirection: "row",
            backgroundColor: "white",
            borderRadius: "4px",
            padding: "0",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.3)",
          }}
        >
          {/* Custom Zoom In Button */}
          <button 
            className="mapboxgl-ctrl-zoom-in" 
            aria-label="Zoom In"
            style={{
              width: screenSize.isMobile ? "28px" : "30px",
              height: screenSize.isMobile ? "28px" : "30px",
              border: "none",
              borderRight: "1px solid rgba(0,0,0,0.1)",
              background: "white",
              cursor: "pointer",
              padding: "5px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
            onClick={() => {
              setViewport(prev => ({
                ...prev,
                zoom: prev.zoom + 1,
                transitionDuration: 200
              }));
            }}
          >
            <span style={{ fontSize: "18px", fontWeight: "bold" }}>+</span>
          </button>
          
          {/* Custom Zoom Out Button */}
          <button 
            className="mapboxgl-ctrl-zoom-out" 
            aria-label="Zoom Out"
            style={{
              width: screenSize.isMobile ? "28px" : "30px",
              height: screenSize.isMobile ? "28px" : "30px",
              border: "none",
              borderRight: "1px solid rgba(0,0,0,0.1)",
              background: "white",
              cursor: "pointer",
              padding: "5px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
            onClick={() => {
              setViewport(prev => ({
                ...prev,
                zoom: prev.zoom - 1,
                transitionDuration: 200
              }));
            }}
          >
            <span style={{ fontSize: "18px", fontWeight: "bold" }}>−</span>
          </button>
          
          {/* Custom Compass Button */}
          <button 
            className="mapboxgl-ctrl-compass" 
            aria-label="Reset Bearing to North"
            style={{
              width: screenSize.isMobile ? "28px" : "30px",
              height: screenSize.isMobile ? "28px" : "30px",
              border: "none",
              background: "white",
              cursor: "pointer",
              padding: "5px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
            onClick={() => {
              setViewport(prev => ({
                ...prev,
                bearing: 0,
                pitch: 0,
                transitionDuration: 500
              }));
            }}
          >
            <svg 
              viewBox="0 0 20 20" 
              style={{ width: "20px", height: "20px" }}
            >
              <polygon points="6,9 10,1 14,9" style={{ fill: "black" }}></polygon>
              <polygon points="6,11 10,19 14,11" style={{ fill: "gray" }}></polygon>
            </svg>
          </button>
        </div>
       
        {/* Side Panel for tribes and stories - Responsive */}
        {selectedTribe && (
          <SidePanel
            tribe={selectedTribe}
            onClose={handlePanelClose}
            isMobile={screenSize.isMobile}
            initialTab={selectedStoryId ? "stories" : "tribes"}
            selectedStoryTitle={selectedStoryId}
          />
        )}
      </MapGL>

      {/* Timeline Slider Component */}
      {isStoriesOn && filteredStories && (screenSize.isMobile ? showControls : true) && (
        <div style={getTimelineStyles()} className="mapbox-timeline-container">
          <TimelineSlider
            startYear={startYear}
            endYear={currentYear}
            yearRange={yearRange}
            onRangeChange={handleYearRangeChange}
            isMobile={screenSize.isMobile}
            storiesData={storiesData}
          />
        </div>
      )}
    </div>
  );
};

export default MapBoxComponent;