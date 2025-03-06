import React, { useState, useCallback, useEffect, useRef } from "react";
import MapGL, { Source, Layer, Popup, NavigationControl } from "react-map-gl";
import { FlyToInterpolator } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import geojsonData from "./final-tribes.json";
import "../styles/mapBox.css";
import storiesData from "./stories.json";

const MapBoxComponent = () => {
  const [viewport, setViewport] = useState({
    latitude: 60,
    longitude: -100,
    zoom: 1.5,
    width: "100%",
    height: "800px",
    transitionDuration: 500,
    transitionInterpolator: new FlyToInterpolator(),
  });

  const [popupInfo, setPopupInfo] = useState(null);
  const [hoveredFeatureId, setHoveredFeatureId] = useState(null);
  const [is3dOn, setIs3dOn] = useState(false);
  const [isStoriesOn, setIsStoriesOn] = useState(false);
  const [mapStyle, setMapStyle] = useState(
    "mapbox://styles/kodalis2/cm7kvvsfl00x601qo0597eedp"
  );
  const [selectedYear, setSelectedYear] = useState(1900); // Timeline state, no filtering
  const timelineRef = useRef(null); // Ref for the timeline container to manage scrolling
  const [filteredStories, setFilteredStories] = useState(storiesData);

  // Define year sequence from 1000 to 2025
  const startYear = 1000;
  const currentYear = new Date().getFullYear(); // 2025 as of Feb 26, 2025
  const years = [];

  for (let year = startYear; year <= currentYear; year += 100) {
    years.push(year);
  }

  // Ensure currentYear is included if not already
  if (years[years.length - 1] !== currentYear) {
    years.push(currentYear);
  }

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

  const handleClick = (event) => {
    const features = event.features;
    if (features && features.length > 0) {
      const feature = features[0];
      const [lng, lat] = event.lngLat;
      if (feature.properties && lng !== undefined && lat !== undefined) {
        setPopupInfo({
          properties: feature.properties,
          coordinates: { lng, lat },
        });
      }
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

  useEffect(() => {
    if (selectedYear !== null) {
      const nextInterval = years.find((year) => year > selectedYear);
      const filtered = {
        ...storiesData,
        features: storiesData.features.filter((story) => {
          const storyYear = story.properties.year; // Assuming 'year' is in properties
          return (
            storyYear >= selectedYear &&
            (nextInterval ? storyYear < nextInterval : true)
          );
        }),
      };
      setFilteredStories(filtered);
    }
  }, [selectedYear]);

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
        <Source id="tribes" type="geojson" data={geojsonData}>
          <Layer key="tribe-fill" {...fillLayer} />
          {hoveredFeatureId && (
            <Layer key="tribe-hover-fill" {...hoverFillLayer} />
          )}
          {hoveredFeatureId && (
            <Layer key="tribe-hover-border" {...hoverBorderLayer} />
          )}
          <Layer key="tribe-label" {...labelLayer} />
        </Source>
        {/* Stories Source and Layer - Only shown if isStoriesOn is true */}
        {isStoriesOn && (
          <Source id="stories" type="geojson" data={filteredStories}>
            <Layer {...storiesLayer} />
          </Source>
        )}

        <div style={{ position: "absolute", top: 10, left: 10 }}>
          <NavigationControl showZoom showCompass />
        </div>

        <div style={{ position: "absolute", top: 10, right: 10 }}>
          <div className="toggle-container">
            <span className="status-text">{"3d"}</span>
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

        {popupInfo && (
          <Popup
            longitude={popupInfo.coordinates.lng}
            latitude={popupInfo.coordinates.lat}
            onClose={() => setPopupInfo(null)}
            anchor="top"
          >
            <div>
              <h4>{popupInfo.properties.Name}</h4>
              <p>ID: {popupInfo.properties.id}</p>
              {popupInfo.properties.description && (
                <a
                  href={popupInfo.properties.description}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  More Info
                </a>
              )}
            </div>
          </Popup>
        )}
      </MapGL>
    </div>
  );
};

export default MapBoxComponent;
