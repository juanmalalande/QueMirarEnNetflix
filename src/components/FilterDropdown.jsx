import React from 'react';
import '../NetflixContent.css';
import { seriesGenres } from './seriesGenres';

const FilterDropdown = ({ 
  contentType,
  selectedGenre,
  genres, // Géneros de películas
  onContentTypeChange,
  onGenreChange,
  showFilters
}) => {
  return (
    <div className={`filter-dropdown ${showFilters ? 'visible' : ''}`}>
      <div className="filter-group">
        <label>Tipo:</label>
        <select
          value={contentType}
          onChange={(e) => onContentTypeChange(e.target.value)}
          className="filter-select"
        >
          <option value="all">Todo</option>
          <option value="movie">Películas</option>
          <option value="tv">Series</option>
        </select>
      </div>

      {/* Géneros para Películas */}
      {contentType === 'movie' && (
        <div className="filter-group">
          <label>Género de Películas:</label>
          <select
            value={selectedGenre}
            onChange={(e) => onGenreChange(e.target.value)}
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
      )}

      {/* Géneros para Series */}
      {contentType === 'tv' && (
        <div className="filter-group">
          <label>Género de Series:</label>
          <select
            value={selectedGenre}
            onChange={(e) => onGenreChange(e.target.value)}
            className="filter-select"
          >
            <option value="all">Todos</option>
            {seriesGenres.map(genre => (
              <option key={genre.id} value={genre.id}>
                {genre.name}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
};

export default FilterDropdown;