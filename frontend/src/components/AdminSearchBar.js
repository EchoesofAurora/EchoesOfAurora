import React, { useState } from "react";
import { FaSearch } from "react-icons/fa"; 
import "../styles/AdminSearchBar.css"; 

const AdminSearchBar = ({ onSearch, onSort, onFilter }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("");
  const [filterTribe, setFilterTribe] = useState("");
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

  const handleStatusToggle = () => {
    const newStatus = statusFilter === 'all' ? 'published' : 
                      statusFilter === 'published' ? 'editing' : 
                      'all';
    setStatusFilter(newStatus);
    onFilter(filterTribe, timeRange, newStatus);
  };

  const getStatusLabel = () => {
    switch(statusFilter) {
      case 'published': return 'Published Stories';
      case 'editing': return 'Editing Stories';
      default: return 'All Stories';
    }
  };

  return (
    <div className="admin-filter-sort-bar">
      <div className="admin-search-and-sort-container">
        <div className="admin-search-bar-container">
          <input
            className="admin-search-bar"
            type="text"
            placeholder="Search..."
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

      <div className="admin-search-and-sort-container">
        <input
          className="admin-filter-input"
          type="text"
          placeholder="Filter by tribe"
          value={filterTribe}
          onChange={handleFilterTribe}
        />

        <div className="admin-time-range">
          <label className="admin-year-range-label">From:</label>
          <input
            type="number"
            min="0"
            max={new Date().getFullYear()}
            value={timeRange[0]}
            onChange={(e) => handleTimeRangeChange(e, 0)}
          />
          <label className="admin-year-range-label">To:</label>
          <input
            type="number"
            min="0"
            max={new Date().getFullYear()}
            value={timeRange[1]}
            onChange={(e) => handleTimeRangeChange(e, 1)}
          />
        </div>
      </div>

      <div className="admin-status-filter-container">
        <div className="admin-status-toggle-wrapper">
          <span className="admin-status-label">{getStatusLabel()}</span>
          <div 
            className={`admin-status-toggle ${statusFilter}`} 
            onClick={handleStatusToggle}
          >
            <div className="admin-status-toggle-slider"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSearchBar;