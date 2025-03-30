import React, { useState, useCallback, useEffect, useRef } from "react";
import MapGL, { Source, Layer, NavigationControl } from "react-map-gl";
import { FlyToInterpolator } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import "../styles/mapBox.css";
import SidePanel from "./SidePanel";

const MapBoxComponent = () => {
  const [viewport, setViewport] = useState({
    latitude: 60,
    longitude: -100,
    zoom: 1.6,
    width: "100%",
    height: "800px",
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
  const [selectedYear, setSelectedYear] = useState(1900);
  const timelineRef = useRef(null);
  const [filteredStories, setFilteredStories] = useState(null);
  const [selectedTribe, setSelectedTribe] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

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

  // Fetch tribes and stories data from API
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch tribes data
        const tribesResponse = await fetch('api/mapData');
        const data = await tribesResponse.json();

        const tribesJson = data["tribes"];
        console.log("Tribes data:", tribesJson);

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
        console.log("Transformed tribes data:", transformedTribesData);
        
        // Fetch stories data
        const storiesJson = data["stories"];
        console.log("stories data:", storiesData);


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
        console.log("Transformed stories data:", transformedStoriesData);
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

  // Filter stories when selectedYear changes
  useEffect(() => {
    if (!storiesData) return;
    
    if (selectedYear !== null) {
      const nextInterval = years.find((year) => year > selectedYear);
      const filtered = {
        ...storiesData,
        features: storiesData.features.filter((story) => {
          const storyYear = story.properties.year;
          return (
            storyYear >= selectedYear &&
            (nextInterval ? storyYear < nextInterval : true)
          );
        }),
      };
      setFilteredStories(filtered);
    }
  }, [selectedYear, storiesData]);

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

  const handleHover = useCallback((event) => {
    const features = event.features;
    setHoveredFeatureId(
      features && features.length > 0 ? features[0].id : null
    );
  }, []);

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
      "text-size": 12,
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

  // Handle scrolling left/right without triggering map interactions
  const scrollTimeline = (direction, event) => {
    if (timelineRef.current) {
      event.preventDefault(); // Prevent default browser behavior
      event.stopPropagation(); // Prevent map click events
      const scrollAmount = timelineRef.current.offsetWidth / 2; // Scroll half the container width
      timelineRef.current.scrollLeft += direction * scrollAmount;
    }
  };

  // Define Layer for Stories (will only be shown when isStoriesOn is true)
  const storiesLayer = {
    id: "stories-layer",
    type: "circle",
    paint: {
      "circle-radius": 6,
      "circle-color": "#1E90FF", // Blue color for stories
      "circle-stroke-width": 2,
      "circle-stroke-color": "#ffffff",
    },
  };

  if (isLoading) {
    return <div className="loading">Loading map data...</div>;
  }

  const handleClick = (event) => {
    console.log("Clicked on map:", event);
    const features = event.features;
    console.log("Clicked on features:", features);
    if (features && features.length > 0) {
      const clickedFeature = features[0];
      const tribeId = clickedFeature.id;
      console.log("Clicked on tribe:", tribeId);
      fetchTribeStoriesData(tribeId);

    }

  }

  const fetchTribeStoriesData = async (id) => {
    try {
      // Fetch tribes data
      const tribesResponse = await fetch('api/mapData/tribes/' + id);
      const data = await tribesResponse.json();
      console.log("Tribe data:", data);
      setSelectedTribe(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } 
  };

  return (
    <div style={{ width: "100%", height: "100vh", position: "relative" }}>
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

        {/* Navigation Control */}
        <div style={{ position: "absolute", bottom: 100, right: 50 }}>
          <NavigationControl showZoom showCompass />
        </div>

        {/* 3D and Stories Toggle */}
        <div style={{ position: "absolute", top: 10, right: 10 }}>
          <div className="toggle-container">
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

        {/* Timeline */}
        <div
          className="timeline-container"
          style={{ position: "absolute", bottom: 80 }}
        >
          <button
            className="timeline-arrow left"
            onClick={(e) => {
              scrollTimeline(-1, e);
              e.stopPropagation();
            }}
            onDoubleClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
          >
            &lt;
          </button>

          <div className="timeline-years" ref={timelineRef}>
            {years.map((year) => (
              <span
                key={year}
                className={`timeline-year ${
                  selectedYear === year ? "active" : ""
                }`}
                onClick={() => setSelectedYear(year)}
              >
                {year}
              </span>
            ))}
          </div>

          <button
            className="timeline-arrow right"
            onClick={(e) => {
              scrollTimeline(1, e);
              e.stopPropagation();
            }}
            onDoubleClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
          >
            &gt;
          </button>
        </div>

        {/* Side Panel for tribes and stories */}
        {selectedTribe && (
          <SidePanel
            tribe={selectedTribe}
            onClose={() => setSelectedTribe(null)}
          />
        )}
      </MapGL>
    </div>
  );
};

export default MapBoxComponent;