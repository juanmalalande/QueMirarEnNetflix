import React from 'react';
import '../NetflixContent.css';

const ContentCard = ({ content, showFullDescription, onToggleDescription }) => (
  <>
    <div className="content-image">
      <img 
        src={`https://image.tmdb.org/t/p/w500${content.poster_path}`} 
        alt={content.title || content.name}
        onError={(e) => {
          e.target.src = 'https://via.placeholder.com/300x450?text=Imagen+no+disponible';
          e.target.alt = 'Imagen no disponible';
        }}
      />
    </div>
    <div className="content-details">
      <h2 className="content-title">{content.title || content.name}</h2>
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
  </>
);

export default ContentCard;