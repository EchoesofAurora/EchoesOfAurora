// src/redux/slices/mapSlice.js
import { createSlice } from '@reduxjs/toolkit';
import { FlyToInterpolator } from 'react-map-gl';

const initialState = {
  viewport: {
    latitude: 60,
    longitude: -100,
    zoom: 1.5,
    width: '100%',
    height: '800px',
    transitionDuration: 500,
    transitionInterpolator: new FlyToInterpolator(),
  },
  hoveredFeatureId: null,
  is3dOn: false,
  isStoriesOn: true,
  mapStyle: 'mapbox://styles/kodalis2/cm7kvvsfl00x601qo0597eedp',
};

const mapSlice = createSlice({
  name: 'map',
  initialState,
  reducers: {
    setViewport: (state, action) => {
      state.viewport = {
        ...state.viewport,
        ...action.payload,
        transitionDuration: 500,
        transitionInterpolator: new FlyToInterpolator(),
      };
    },
    setHoveredFeatureId: (state, action) => {
      state.hoveredFeatureId = action.payload;
    },
    toggle3d: (state) => {
      state.is3dOn = !state.is3dOn;
      state.mapStyle = state.is3dOn
        ? 'mapbox://styles/kodalis2/cm7kuhknr00wv01qo7212f42o'
        : 'mapbox://styles/kodalis2/cm7kvvsfl00x601qo0597eedp';
    },
    toggleStories: (state) => {
      state.isStoriesOn = !state.isStoriesOn;
    },
  },
});

export const { setViewport, setHoveredFeatureId, toggle3d, toggleStories } = mapSlice.actions;
export default mapSlice.reducer;



