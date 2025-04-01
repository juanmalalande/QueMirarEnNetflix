import React from 'react';
import '../NetflixContent.css';

const ContentActions = ({ onShare, onNetflix, onRandomize }) => (
  <div className="content-actions">
    <button className="randomize-btn" onClick={onRandomize}>
      Otra recomendación
    </button>
    <button className="netflix-btn" onClick={onNetflix}>
      Buscar en Netflix
    </button>
    <button className="share-btn" onClick={onShare}>
      Compartir
    </button>
  </div>
);

export default ContentActions;