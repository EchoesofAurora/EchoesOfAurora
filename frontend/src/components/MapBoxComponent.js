import React, { useState, useCallback, useEffect, useRef } from "react";
import MapGL, { Source, Layer, NavigationControl } from "react-map-gl";
import { FlyToInterpolator } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import "../styles/mapBox.css";
import SidePanel from "./SidePanel";
import TimelineSlider from "./TimelineSlider";

const MapBoxComponent = () => {
  const mapContainerRef = useRef(null);
  
  // State to track screen size
  const [screenSize, setScreenSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
    isMobile: typeof window !== 'undefined' ? window.innerWidth < 768 : false
  });

  const [viewport, setViewport] = useState({
    latitude: 60,
    longitude: -100,
    zoom: 1.6,
    width: "100%",
    height: "100vh", // Changed to viewport height
    transitionDuration: 500,
    transitionInterpolator: new FlyToInterpolator(),
  });

  // Data states
  const [tribesData, setTribesData] = useState(null);
  const [storiesData, setStoriesData] = useState(null);

  // UI states
  const [hoveredFeatureId, setHoveredFeatureId] = useState(null);
  const [is3dOn, setIs3dOn] = useState(false);
  const [isStoriesOn, setIsStoriesOn] = useState(true);
  const [mapStyle, setMapStyle] = useState(
    "mapbox://styles/kodalis2/cm7kvvsfl00x601qo0597eedp"
  );
  const [yearRange, setYearRange] = useState({
    startYear: 1900,
    endYear: new Date().getFullYear()
  });
  const [filteredStories, setFilteredStories] = useState(null);
  const [selectedTribe, setSelectedTribe] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showControls, setShowControls] = useState(true);

  // Define year sequence from 1000 to 2025
  const startYear = 1000;
  const currentYear = new Date().getFullYear();
  const years = [];

  for (let year = startYear; year <= currentYear; year += 100) {
    years.push(year);
  }

  // Ensure currentYear is included if not already
  if (years[years.length - 1] !== currentYear) {
    years.push(currentYear);
  }

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
    setHoveredFeatureId(
      features && features.length > 0 ? features[0].id : null
    );
  }, []);

  const handleYearRangeChange = (startYear, endYear) => {
    setYearRange({
      startYear: startYear,
      endYear: endYear
    });
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
      "circle-radius": screenSize.isMobile ? 4 : 6, // Smaller circles on mobile
      "circle-color": "#1E90FF", // Blue color for stories
      "circle-stroke-width": screenSize.isMobile ? 1 : 2, // Thinner stroke on mobile
      "circle-stroke-color": "#ffffff",
    },
  };

  if (isLoading) {
    return <div className="loading">Loading map data...</div>;
  }

  const handleClick = (event) => {
    const features = event.features;
    if (features && features.length > 0) {
      const clickedFeature = features[0];
      const tribeId = clickedFeature.id;
      fetchTribeStoriesData(tribeId);
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

  // Calculate timeline position based on whether side panel is open
  const getTimelinePosition = () => {
    if (selectedTribe) {
      // When side panel is open
      if (screenSize.isMobile) {
        // For mobile: move timeline to bottom-right
        return {
          bottom: 60,
          right: 10,
          left: 'auto',
          width: "60%"
        };
      } else {
        // For desktop: move timeline to right side
        return {
          bottom: 100,
          right: 350, // Adjust based on your side panel width
          left: 'auto',
          width: "40%"
        };
      }
    } else {
      // Default position when side panel is closed
      return {
        bottom: screenSize.isMobile ? 60 : 100,
        left: 0,
        right: 0,
        margin: "0 auto",
        width: screenSize.isMobile ? "95%" : "50%"
      };
    }
  };

  // Get timeline position
  const timelinePosition = getTimelinePosition();

  return (
    <div 
      ref={mapContainerRef} 
      className="map-container" 
      style={{ width: "100%", height: "100vh", position: "relative" }}
    >
      <MapGL
        {...viewport}
        mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
        mapStyle={mapStyle}
        doubleClickZoom={true}
        onViewportChange={(newViewport) =>
          setViewport({
            ...newViewport,
            transitionDuration: 500,
            transitionInterpolator: new FlyToInterpolator(),
          })
        }
        onClick={handleClick}
        onHover={handleHover}
        interactiveLayerIds={["tribe-fill"]}
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
          </Source>
        )}

        {/* Custom Horizontal Navigation Controls */}
        <div 
          style={{ 
            position: "absolute", 
            top: screenSize.isMobile ? 60 : 90, 
            right: screenSize.isMobile ? 10 : 50,
            zIndex: 5,
            display: "flex",
            flexDirection: "row",
            backgroundColor: "white",
            borderRadius: "4px",
            padding: "0",
            boxShadow: "0 0 0 2px rgba(0,0,0,0.1)",
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

        {/* Mobile Controls Toggle Button */}
        {screenSize.isMobile && (
          <button
            className="controls-toggle-btn"
            onClick={toggleControls}
            style={{
              position: "absolute",
              top: 10,
              right: 10,
              zIndex: 10,
              background: "rgba(255, 255, 255, 0.8)",
              border: "none",
              borderRadius: "4px",
              padding: "8px",
              boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)"
            }}
          >
            {showControls ? "Hide Controls" : "Show Controls"}
          </button>
        )}

        {/* 3D and Stories Toggle - Responsive */}
        {(screenSize.isMobile ? showControls : true) && (
          <div 
            style={{ 
              position: "absolute", 
              top: screenSize.isMobile ? 50 : 10, 
              right: screenSize.isMobile ? 10 : 10,
              zIndex: 5
            }}
          >
            <div className={`toggle-container ${screenSize.isMobile ? 'toggle-container-mobile' : ''}`}>
              <span className="status-text">{"3D"}</span>
              <label className="switch">
                <input type="checkbox" checked={is3dOn} onChange={handleToggle} />
                <span className="slider"></span>
              </label>
              <span className="status-text">{"Stories"}</span>
              <label className="switch">
                <input
                  type="checkbox"
                  checked={isStoriesOn}
                  onChange={handleStoriesToggle}
                />
                <span className="slider"></span>
              </label>
            </div>
          </div>
        )}

        {/* Timeline Slider - Repositioned when side panel is open */}
        {isStoriesOn && filteredStories && (screenSize.isMobile ? showControls : true) && (
          <div
            className="timeline-slider-wrapper"
            style={{ 
              position: "absolute",
              zIndex: 5,
              paddingBottom: "10px",
              transition: "all 0.3s ease-in-out",
              ...timelinePosition
            }}
          >
            <TimelineSlider 
              years={years}
              onRangeChange={handleYearRangeChange}
              initialStartYear={yearRange.startYear}
              initialEndYear={yearRange.endYear}
              isMobile={screenSize.isMobile}
            />
          </div>
        )}
       
        {/* Side Panel for tribes and stories - Responsive */}
        {selectedTribe && (
          <SidePanel
            tribe={selectedTribe}
            onClose={() => setSelectedTribe(null)}
            isMobile={screenSize.isMobile}
          />
        )}
      </MapGL>
    </div>
  );
};

export default MapBoxComponent;