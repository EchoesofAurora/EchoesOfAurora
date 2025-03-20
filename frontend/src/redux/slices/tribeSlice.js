// src/redux/slices/tribeSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchTribes, fetchTribeById } from '../api/tribeApi';

// Create async thunk for fetching all tribes
export const fetchTribesAsync = createAsyncThunk(
  'tribes/fetchTribes',
  async (_, { rejectWithValue }) => {
    try {
      return await fetchTribes();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Create async thunk for fetching a single tribe by ID
export const fetchTribeByIdAsync = createAsyncThunk(
  'tribes/fetchTribeById',
  async (tribeId, { rejectWithValue }) => {
    try {
      return await fetchTribeById(tribeId);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  data: [],
  searchResults: [],
  selectedTribe: null,
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
};

const tribeSlice = createSlice({
  name: 'tribes',
  initialState,
  reducers: {
    setSearchResults: (state, action) => {
      state.searchResults = action.payload;
    },
    sortTribes: (state, action) => {
      const sortOption = action.payload;
      let sortedTribes = [...state.searchResults];
      
      switch (sortOption) {
        case "name-asc":
          sortedTribes.sort((a, b) => a.tribe_name.localeCompare(b.tribe_name));
          break;
        case "name-desc":
          sortedTribes.sort((a, b) => b.tribe_name.localeCompare(a.tribe_name));
          break;
        case "time-asc":
          sortedTribes.sort((a, b) => a.start_year - b.start_year);
          break;
        case "time-desc":
          sortedTribes.sort((a, b) => b.start_year - a.start_year);
          break;
        default:
          break;
      }
      
      state.searchResults = sortedTribes;
    },
    filterTribes: (state, action) => {
      const timeRange = action.payload;
      let filteredTribes = state.data;
      
      if (timeRange && timeRange.length === 2) {
        filteredTribes = filteredTribes.filter(tribe => 
          tribe.start_year >= timeRange[0] && tribe.start_year <= timeRange[1]
        );
      }
      
      state.searchResults = filteredTribes;
    },
    searchTribes: (state, action) => {
      const searchTerm = action.payload;
      
      if (!searchTerm) {
        state.searchResults = state.data;
        return;
      }
      
      const filteredTribes = state.data.filter((tribe) =>
        tribe.tribe_name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      
      state.searchResults = filteredTribes;
    },
    setSelectedTribe: (state, action) => {
      state.selectedTribe = action.payload;
    },
    clearSelectedTribe: (state) => {
      state.selectedTribe = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle fetchTribesAsync
      .addCase(fetchTribesAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchTribesAsync.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload;
        state.searchResults = action.payload; // Initialize search results with all tribes
        state.error = null;
      })
      .addCase(fetchTribesAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      // Handle fetchTribeByIdAsync
      .addCase(fetchTribeByIdAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchTribeByIdAsync.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.selectedTribe = action.payload;
        state.error = null;
      })
      .addCase(fetchTribeByIdAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export const { 
  setSearchResults, 
  sortTribes, 
  filterTribes, 
  searchTribes,
  setSelectedTribe, 
  clearSelectedTribe 
} = tribeSlice.actions;

export default tribeSlice.reducer;