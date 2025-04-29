import React from 'react';
import '../NetflixContent.css';

const ContentCard = ({ content, showFullDescription, onToggleDescription, genres }) => {

  const formatDuration = (minutes) => {
    if (!minutes) return null;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours > 0 ? `${hours}h ` : ''}${mins > 0 ? `${mins}m` : ''}`.trim();
  };


  const formatSeasons = (seasons) => {
    if (!seasons) return null;
    return `${seasons} temporada${seasons > 1 ? 's' : ''}`;
  };

  return (
    <div className="content-wrapper">
      <div className="content-image">
        <img 
          src={content.poster_path ? `https://image.tmdb.org/t/p/w500${content.poster_path}` : 'https://via.placeholder.com/300x450?text=Imagen+no+disponible'} 
          alt={content.title || content.name} 
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/300x450?text=Imagen+no+disponible';
            e.target.alt = 'Imagen no disponible';
          }}
        />
      </div>

      <div className="content-details">
        <h2 className="content-title">{content.title || content.name}</h2>
        
        <div className="content-metadata">
          
          {content.runtime && content.runtime > 0 && (
            <span>{formatDuration(content.runtime)}</span>
          )}
          
        
          {content.number_of_seasons && content.number_of_seasons > 0 && (
            <span>{formatSeasons(content.number_of_seasons)}</span>
          )}
          
          
          {content.genre_ids && content.genre_ids.length > 0 && (
            <span>
              {content.genre_ids
                .map(id => genres.find(g => g.id === id)?.name)
                .filter(Boolean)
                .slice(0, 2)
                .join(', ')}
            </span>
          )}
        </div>

        <div className="description-container">
          <p className={`content-description ${showFullDescription ? 'expanded' : ''}`}>
            {content.overview || 'Descripción no disponible.'}
          </p>
          {content.overview?.length > 200 && (
            <button
              className="see-description-btn"
              onClick={onToggleDescription}
            >
              {showFullDescription ? 'Mostrar menos ▲' : 'Mostrar más ▼'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContentCard;