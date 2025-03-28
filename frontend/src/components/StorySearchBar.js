import React, { useState } from "react";
import "../styles/SearchBar.css"; // Import the custom CSS file

const SearchBar = ({ onSearch, onSort, onFilter, tribes }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("");
  const [filterTribe, setFilterTribe] = useState("");
  const [timeRange, setTimeRange] = useState([0, new Date().getFullYear()]);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    onSearch(e.target.value);
  };

  const handleSort = (e) => {
    setSortOption(e.target.value);
    onSort(e.target.value);
  };

  const handleFilterTribe = (e) => {
    setFilterTribe(e.target.value);
    onFilter(e.target.value, timeRange);
  };

  const handleTimeRangeChange = (e, index) => {
    let value = e.target.value;
  
    // Allow empty input temporarily
    if (value === "") {
      const newRange = [...timeRange];
      newRange[index] = value;
      setTimeRange(newRange);
      return;
    }
  
    let newYear = parseInt(value, 10);
    if (isNaN(newYear)) return;
  
    // Constrain the values within the valid range
    newYear = Math.max(0, Math.min(newYear, 2025));
  
    const newRange = [...timeRange];
    newRange[index] = newYear;
    setTimeRange(newRange);
  };
  
  // Validate when input loses focus
  const handleTimeRangeBlur = (index) => {
    const newRange = [...timeRange];
  
    // If empty, reset to a valid default
    if (newRange[index] === "") {
      newRange[index] = index === 0 ? 0 : 2025;
    }
  
    // Ensure start year is <= end year
    if (newRange[0] > newRange[1]) {
      if (index === 0) newRange[1] = newRange[0];
      else newRange[0] = newRange[1];
    }
  
    setTimeRange(newRange);
    onFilter(filterTribe, newRange);
  };  

  return (
    <div className="filter-sort-bar">
      <div className="search-and-sort-container">
        <div className="search-bar-container">
          <input
            className="search-bar"
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={handleSearch}
          />

        </div>

        <select className="sort-dropdown" value={sortOption} onChange={handleSort}>
          <option value="name-asc">Name (A-Z)</option>
          <option value="name-desc">Name (Z-A)</option>
          <option value="time-asc">Time (Oldest First)</option>
          <option value="time-desc">Time (Newest First)</option>
          <option value="tribe-asc">Tribe (A-Z)</option>
          <option value="tribe-desc">Tribe (Z-A)</option>
        </select>
      </div>

      <div className="search-and-sort-container">
      <select value={filterTribe} onChange={handleFilterTribe} className="tribe-dropdown">
        <option value="">No Tribe</option>
        {tribes.map((tribe) => (
          <option key={tribe.tribe_id} value={tribe.tribe_name}>
            {tribe.tribe_name}
          </option>
        ))}
      </select>


        <div className="time-range">
          <label className="year-range-label">From:</label>
          <input
            type="number"
            min="0"
            max={new Date().getFullYear()}
            value={timeRange[0]}
            onChange={(e) => handleTimeRangeChange(e, 0)}
            onBlur={() => handleTimeRangeBlur(0)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.target.blur(); // Unselects the input field
              }
            }}
          />
          <label className="year-range-label">To:</label>
          <input
            type="number"
            min="0"
            max={new Date().getFullYear()}
            value={timeRange[1]}
            onChange={(e) => handleTimeRangeChange(e, 1)}
            onBlur={() => handleTimeRangeBlur(1)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.target.blur(); // Unselects the input field
              }
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
