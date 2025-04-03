import React, { useState } from "react";
import { FaSearch } from "react-icons/fa"; 
import "../styles/AdminTribeSearchBar.css"; 

const AdminTribeSearchBar = ({ onSearch, onSort, onFilter }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("");
  const [timeRange, setTimeRange] = useState([0, new Date().getFullYear()]);
  const [statusFilter, setStatusFilter] = useState("all");

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    onSearch(e.target.value);
  };

  const handleSort = (e) => {
    setSortOption(e.target.value);
    onSort(e.target.value);
  };

  const handleTimeRangeChange = (e, index) => {
    const newRange = [...timeRange];
    newRange[index] = e.target.value;
    setTimeRange(newRange);
    onFilter(null, newRange, statusFilter);
  };

  const handleStatusChange = (e) => {
    const newStatus = e.target.value;
    setStatusFilter(newStatus);
    onFilter(null, timeRange, newStatus);
  };

  return (
    <div className="admin-filter-sort-bar">
      {/* First row: Search and Sort */}
      <div className="admin-search-and-sort-container">
        <div className="admin-search-bar-container">
          <input
            className="admin-search-bar"
            type="text"
            placeholder="Search tribes..."
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
          <option value="time-asc">Timeline (Oldest First)</option>
          <option value="time-desc">Timeline (Newest First)</option>
        </select>
      </div>

      {/* Second row: Filter by Year Range and Status only */}
      <div className="admin-filters-container">
        <div className="admin-time-range tribe-time-range">
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
            <option value="all">All Tribes</option>
            <option value="published">Published Tribes</option>
            <option value="editing">Editing Tribes</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default AdminTribeSearchBar;