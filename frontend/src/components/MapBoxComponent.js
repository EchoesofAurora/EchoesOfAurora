// MapComponent.jsx
import React, { useState, useCallback,useEffect } from "react";
import MapGL, { Source, Layer, Popup, NavigationControl } from "react-map-gl";
import { FlyToInterpolator } from "react-map-gl"; // Correct import for smooth zooming
import "mapbox-gl/dist/mapbox-gl.css";
import geojsonData from "./final-tribes.json"; // Ensure the path is correct
import "../styles/mapBox.css";
import { use } from "react";

const MapBoxComponent = () => {
  const [viewport, setViewport] = useState({
    latitude: 60,
    longitude: -100,
    zoom: 1.5,
    width: "100%",
    height: "800px",
    transitionDuration: 500, // Smooth transition duration (in milliseconds)
    transitionInterpolator: new FlyToInterpolator(), // Correct usage of FlyToInterpolator
  });

  const [popupInfo, setPopupInfo] = useState(null);
  const [hoveredFeatureId, setHoveredFeatureId] = useState(null);
  const [is3dOn, setIsOn] = useState(false);
  const [isStoriesOn, setIsStoriesOn] = useState(false);
  const [mapStyle, setMapStyle] = useState("mapbox://styles/kodalis2/cm7kvvsfl00x601qo0597eedp");

  useEffect(() => {
    setMapStyle(is3dOn ? "mapbox://styles/kodalis2/cm7kuhknr00wv01qo7212f42o" : "mapbox://styles/kodalis2/cm7kvvsfl00x601qo0597eedp");
  }, [is3dOn]);

  const handleToggle = () => {
    setIsOn(!is3dOn);
  };
  const handleStoriesToggle = () => {
    setIsStoriesOn(!isStoriesOn);
  };

  const handleHover = useCallback((event) => {
    const features = event.features;
    if (features && features.length > 0) {
      setHoveredFeatureId(features[0].id);
    } else {
      setHoveredFeatureId(null);
    }
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
      "fill-color": ["get", "color"], // Gets color from GeoJSON properties
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
    filter: ["==", "id", hoveredFeatureId],
  };

  const hoverBorderLayer = {
    id: "tribe-hover-border",
    type: "line",
    source: "tribes",
    paint: {
      "line-color": "#000",
      "line-width": 1,
    },
    filter: ["==", "id", hoveredFeatureId],
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

  return (
    <div style={{ width: "100%", height: "100vh" }}>
      <MapGL
        {...viewport}
        mapboxApiAccessToken="pk.eyJ1Ijoia29kYWxpczIiLCJhIjoiY203ZHhtbGwwMDd2bDJrb2R2emNiaGgwMiJ9.4QoqSStqAAGvBCVkU48v7w" // Replace with your actual token
        mapStyle={mapStyle}
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

        {/* Navigation controls for zoom and rotation */}
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
              <input type="checkbox" checked={isStoriesOn} onChange={handleStoriesToggle} />
              <span className="slider"></span>
            </label>
          </div>
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
