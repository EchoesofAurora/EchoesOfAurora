import React, { useState } from "react";
import { FaSearch } from "react-icons/fa"; // ✅ Correct import
import "../styles/SearchBar.css"; // Import the custom CSS file

const AdminSearchBar = ({ onSearch, onSort, onFilter }) => {
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
    const newRange = [...timeRange];
    newRange[index] = e.target.value;
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
          <button className="search-button">
            <FaSearch /> 
          </button>
        </div>

        <select className="sort-dropdown" value={sortOption} onChange={handleSort}>
          <option value="">Sort by</option>
          <option value="name-asc">Name (A-Z)</option>
          <option value="name-desc">Name (Z-A)</option>
          <option value="time-asc">Time (Oldest First)</option>
          <option value="time-desc">Time (Newest First)</option>
          <option value="tribe-asc">Tribe (A-Z)</option>
          <option value="tribe-desc">Tribe (Z-A)</option>
        </select>
      </div>

      <div className="search-and-sort-container">
        <input
          className="filter-input"
          type="text"
          placeholder="Filter by tribe"
          value={filterTribe}
          onChange={handleFilterTribe}
        />

        <div className="time-range">
          <label className="year-range-label">From:</label>
          <input
            type="number"
            min="0"
            max={new Date().getFullYear()}
            value={timeRange[0]}
            onChange={(e) => handleTimeRangeChange(e, 0)}
          />
          <label className="year-range-label">To:</label>
          <input
            type="number"
            min="0"
            max={new Date().getFullYear()}
            value={timeRange[1]}
            onChange={(e) => handleTimeRangeChange(e, 1)}
          />
        </div>
      </div>
    </div>
  );
};

export default AdminSearchBar;
