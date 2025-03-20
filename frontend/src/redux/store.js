// src/redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import tribeReducer from './slices/tribeSlice';
import storyReducer from './slices/storySlice';
import mapReducer from './slices/mapSlice';

export const store = configureStore({
  reducer: {
    tribes: tribeReducer,
    stories: storyReducer,
    map: mapReducer,
  },
  // Add this line here to control when DevTools are enabled
  devTools: process.env.NODE_ENV !== 'production',
  middleware: (getDefaultMiddleware) => 
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ['map/setViewport'],
        // Ignore these field paths in all actions
        ignoredActionPaths: ['payload.transitionInterpolator'],
        // Ignore these paths in the state
        ignoredPaths: ['map.viewport.transitionInterpolator'],
      },
    }),
});