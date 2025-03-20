import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchStories, fetchStoryById } from '../api/storyApi';

export const fetchStoriesAsync = createAsyncThunk(
  'stories/fetchStories',
  async (_, { rejectWithValue }) => {
    try {
      const data = await fetchStories();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchStoryByIdAsync = createAsyncThunk(
  'stories/fetchStoryById',
  async (storyId, { rejectWithValue }) => {
    try {
      return await fetchStoryById(storyId);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  data: [],
  searchResults: [],
  selectedStory: null,
  status: 'idle',
  error: null,
};

const storySlice = createSlice({
  name: 'stories',
  initialState,
  reducers: {
    setSearchResults: (state, action) => {
      state.searchResults = action.payload;
    },
    sortStories: (state, action) => {
      const sortOption = action.payload;
      let sortedStories = [...state.searchResults];
      
      switch (sortOption) {
        case "name-asc":
          sortedStories.sort((a, b) => a.story_name.localeCompare(b.story_name));
          break;
        case "name-desc":
          sortedStories.sort((a, b) => b.story_name.localeCompare(a.story_name));
          break;
        case "time-asc":
          sortedStories.sort((a, b) => a.story_year - b.story_year);
          break;
        case "time-desc":
          sortedStories.sort((a, b) => b.story_year - a.story_year);
          break;
        case "tribe-asc":
          sortedStories.sort((a, b) => a.tribe_id - b.tribe_id);
          break;
        case "tribe-desc":
          sortedStories.sort((a, b) => b.tribe_id - a.tribe_id);
          break;
        default:
          break;
      }
      
      state.searchResults = sortedStories;
    },
    filterStories: (state, action) => {
      const { tribeName, timeRange, tribeDictionary } = action.payload;
      let filteredStories = state.data;
      
      if (tribeName && tribeDictionary[tribeName] !== undefined) {
        const tribeId = tribeDictionary[tribeName];
        filteredStories = filteredStories.filter(story => story.tribe_id === tribeId);
      }
      
      if (timeRange && timeRange.length === 2) {
        filteredStories = filteredStories.filter(story => 
          story.story_year >= timeRange[0] && story.story_year <= timeRange[1]
        );
      }
      
      state.searchResults = filteredStories;
    },
    searchStories: (state, action) => {
      const searchTerm = action.payload;
      
      if (!searchTerm) {
        state.searchResults = state.data;
        return;
      }
      
      const filteredStories = state.data.filter((story) =>
        story.story_name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      
      state.searchResults = filteredStories;
    },
    setSelectedStory: (state, action) => {
      state.selectedStory = action.payload;
    },
    clearSelectedStory: (state) => {
      state.selectedStory = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchStoriesAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchStoriesAsync.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload;
        // Initialize search results with all stories sorted by name
        state.searchResults = [...action.payload].sort((a, b) => 
          a.story_name.localeCompare(b.story_name)
        );
        state.error = null;
      })
      .addCase(fetchStoriesAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(fetchStoryByIdAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchStoryByIdAsync.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.selectedStory = action.payload;
        state.error = null;
      })
      .addCase(fetchStoryByIdAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export const { 
  setSearchResults, 
  sortStories, 
  filterStories, 
  searchStories,
  setSelectedStory, 
  clearSelectedStory 
} = storySlice.actions;

export default storySlice.reducer;