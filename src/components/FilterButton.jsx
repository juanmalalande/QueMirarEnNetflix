import React from 'react';
import { FaFilter } from 'react-icons/fa';
import '../NetflixContent.css';

const FilterButton = ({ 
  activeFilters, 
  contentGenres,
  onRemoveFilter, 
  onToggleFilters, 
  showFilters 
}) => (
  <div className="filter-header">
    <div className="filter-chips-container">
      {activeFilters.map((filter, index) => (
        <div key={index} className={`filter-chip ${filter.type}-chip`}>
          {filter.type === 'contentType' ? (
            <span>{filter.value === 'movie' ? 'Películas' : 'Series'}</span>
          ) : (
            <span>{contentGenres.find(g => g.id == filter.value)?.name}</span>
          )}
          
          <button 
            className="remove-filter-btn"
            onClick={() => onRemoveFilter(index)}
          >
            ×
          </button>

          
        </div>
      ))}
    </div>

    <button 
      className={`filter-toggle-btn ${showFilters ? 'active' : ''}`}
      onClick={onToggleFilters}
    >
      <FaFilter />
    </button>
  </div>
);

export default FilterButton;