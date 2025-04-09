import React, { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa"; 
import "../styles/AdminStorySearchBar.css"; 

const AdminStorySearchBar = ({ onSearch, onSort, onFilter, defaultStatusFilter = "all" }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("");
  const [filterTribe, setFilterTribe] = useState("");
  const [timeRange, setTimeRange] = useState([0, new Date().getFullYear()]);
  const [statusFilter, setStatusFilter] = useState(defaultStatusFilter);

  // Update status filter when defaultStatusFilter changes (e.g., when navigating from key metrics)
  useEffect(() => {
    setStatusFilter(defaultStatusFilter);
  }, [defaultStatusFilter]);

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
    onFilter(e.target.value, timeRange, statusFilter);
  };

  const handleTimeRangeChange = (e, index) => {
    const newRange = [...timeRange];
    newRange[index] = e.target.value;
    setTimeRange(newRange);
    onFilter(filterTribe, newRange, statusFilter);
  };

  const handleStatusChange = (e) => {
    const newStatus = e.target.value;
    setStatusFilter(newStatus);
    onFilter(filterTribe, timeRange, newStatus);
  };

  return (
    <div className="admin-filter-sort-bar">
      {/* First row: Search and Sort */}
      <div className="admin-search-and-sort-container">
        <div className="admin-search-bar-container">
          <input
            className="admin-search-bar"
            type="text"
            placeholder="Search stories..."
            value={searchQuery}
            onChange={handleSearch}
          />
          <button className="admin-search-button">
            <FaSearch /> 
          </button>
        </div>

        <select className="admin-sort-dropdown" value={sortOption} onChange={handleSort}>
          <option value="">Sort by</option>
          <option value="name-asc">Name (A-Z)</option>
          <option value="name-desc">Name (Z-A)</option>
          <option value="time-asc">Time (Oldest First)</option>
          <option value="time-desc">Time (Newest First)</option>
          <option value="tribe-asc">Tribe (A-Z)</option>
          <option value="tribe-desc">Tribe (Z-A)</option>
        </select>
      </div>

      {/* Second row: Filter by Tribe, Year Range, and Status */}
      <div className="admin-filters-container">
        <div className="admin-tribe-filter">
          <input
            className="admin-filter-input"
            type="text"
            placeholder="Filter by tribe"
            value={filterTribe}
            onChange={handleFilterTribe}
          />
        </div>

        <div className="admin-time-range">
          <div className="admin-date-field">
            <span className="admin-date-label">From:</span>
            <input
              type="number"
              min="0"
              max={new Date().getFullYear()}
              value={timeRange[0]}
              onChange={(e) => handleTimeRangeChange(e, 0)}
              className="admin-date-input"
            />
          </div>
          <div className="admin-date-field">
            <span className="admin-date-label">To:</span>
            <input
              type="number"
              min="0"
              max={new Date().getFullYear()}
              value={timeRange[1]}
              onChange={(e) => handleTimeRangeChange(e, 1)}
              className="admin-date-input"
            />
          </div>
        </div>

        <div className="admin-status-filter">
          <select 
            className="admin-status-dropdown" 
            value={statusFilter} 
            onChange={handleStatusChange}
          >
            <option value="all">All Stories</option>
            <option value="published">Published Stories</option>
            <option value="editing">Editing Stories</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default AdminStorySearchBar;