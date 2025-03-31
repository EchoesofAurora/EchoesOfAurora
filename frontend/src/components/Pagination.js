// src/components/Pagination.js
import React from 'react';

const Pagination = ({ storiesPerPage, totalStories, paginate, currentPage }) => {
  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(totalStories / storiesPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <nav className="pagination-container">
      <ul className="pagination">
        <li className={`pagination-item ${currentPage === 1 ? 'disabled' : ''}`}>
          <button 
            onClick={() => currentPage > 1 && paginate(currentPage - 1)}
            className="pagination-link pagination-arrow"
            disabled={currentPage === 1}
          >
            &laquo;
          </button>
        </li>
        
        {pageNumbers.map(number => (
          <li key={number} className="pagination-item">
            <button
              onClick={() => paginate(number)}
              className={`pagination-link ${currentPage === number ? 'active' : ''}`}
            >
              {number}
            </button>
          </li>
        ))}
        
        <li className={`pagination-item ${currentPage === pageNumbers.length ? 'disabled' : ''}`}>
          <button 
            onClick={() => currentPage < pageNumbers.length && paginate(currentPage + 1)}
            className="pagination-link pagination-arrow"
            disabled={currentPage === pageNumbers.length}
          >
            &raquo;
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Pagination;