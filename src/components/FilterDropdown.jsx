import React from 'react';
import '../NetflixContent.css';

const FilterDropdown = ({ 
  contentType,
  selectedGenre,
  genres,
  onContentTypeChange,
  onGenreChange,
  showFilters
}) => {
  // Handlers seguros
  const handleContentChange = (e) => {
    onContentTypeChange(e.target.value);
  };

  const handleGenreChange = (e) => {
    onGenreChange(e.target.value);
  };

  return (
    <div className={`filter-dropdown ${showFilters ? 'visible' : ''}`}>
      <div className="filter-group">
        <label>Tipo:</label>
        <select
          value={contentType}
          onChange={handleContentChange}
          className="filter-select"
        >
          <option value="all">Todo</option>
          <option value="movie">Películas</option>
          <option value="tv">Series</option>
        </select>
      </div>

      <div className="filter-group">
        <label>Género:</label>
        <select
          value={selectedGenre}
          onChange={handleGenreChange}
          className="filter-select"
        >
          <option value="all">Todos</option>
          {genres.map(genre => (
            <option key={genre.id} value={genre.id}>
              {genre.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default FilterDropdown;