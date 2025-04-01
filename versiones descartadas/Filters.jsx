import React from 'react';
import '../NetflixContent.css';

function Filters({ 
  contentType, 
  selectedGenre, 
  genres, 
  onContentTypeChange, 
  onGenreChange 
}) {
  return (
    <div className="filter-options">
      <div className="filter-group">
        <label>Tipo:</label>
        <select
          value={contentType}
          onChange={onContentTypeChange}
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
          onChange={onGenreChange}
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
}

export default Filters;