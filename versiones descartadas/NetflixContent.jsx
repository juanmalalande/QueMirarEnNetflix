import React, { useState, useEffect, Suspense, lazy } from 'react';
import axios from 'axios';
import '../NetflixContent.css';
import { contentGenres } from './contentGenres';
import ShareMenu from './ShareMenu';

// Carga diferida de componentes
const FilterButton = lazy(() => import('./FilterButton'));
const FilterDropdown = lazy(() => import('./FilterDropdown'));
const ContentCard = lazy(() => import('./ContentCard'));
const ContentActions = lazy(() => import('./ContentActions'));

function NetflixContent() {
  // Estados principales
  const [randomContent, setRandomContent] = useState(null);
  const [allContent, setAllContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [randomTitle, setRandomTitle] = useState('');

  // Estados de UI
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // Estados de filtros
  const [contentType, setContentType] = useState(() => 
    localStorage.getItem('contentType') || 'all'
  );
  const [selectedGenre, setSelectedGenre] = useState(() => 
    localStorage.getItem('selectedGenre') || 'all'
  );
  const [activeFilters, setActiveFilters] = useState([]);

  // Lista de títulos aleatorios
  const titleList = [
    'Hoy te recomiendo:',
    'Prendé Netflix y disfrutá de:',
    'Prepará los pochoclos y dale play:',
    'Mandale play a:',
    'Tu maratón de Netflix empieza con:',
    'No hay nada mejor que:',
    'Tenés que ver esto:',
    'Preparate para esto:',
    'Perfecto para hoy:'
  ];

  // Efecto para título aleatorio
  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * titleList.length);
    setRandomTitle(titleList[randomIndex]);
  }, [randomContent]);

  // Obtener contenido de la API
  useEffect(() => {
    const fetchNetflixContent = async () => {
      try {
        setLoading(true);
        
        const fetchContentByPage = async (type, maxPages = 10) => {
          let allPageContent = [];
          for (let page = 1; page <= maxPages; page++) {
            const response = await axios.get(`https://api.themoviedb.org/3/discover/${type}`, {
              params: {
                api_key: process.env.REACT_APP_TMDB_API_KEY,
                with_watch_providers: 8,
                watch_region: 'AR',
                language: 'es-AR',
                page: page
              }
            });
            allPageContent = [...allPageContent, ...response.data.results];
          }
          return allPageContent;
        };

        const [movieContent, tvContent] = await Promise.all([
          contentType === 'all' || contentType === 'movie' ? fetchContentByPage('movie') : Promise.resolve([]),
          contentType === 'all' || contentType === 'tv' ? fetchContentByPage('tv') : Promise.resolve([])
        ]);

        const combinedContent = [...movieContent, ...tvContent];
        setAllContent(combinedContent);
        setRandomContent(combinedContent[Math.floor(Math.random() * combinedContent.length)]);
        setLoading(false);
      } catch (err) {
        setError('Error al cargar contenido');
        setLoading(false);
        console.error(err);
      }
    };

    fetchNetflixContent();
  }, [contentType, selectedGenre]);

  // Manejar filtros
  const handleFilters = (type, value) => {
    if (type === 'contentType') {
      setContentType(value);
      setSelectedGenre('all');
      localStorage.setItem('contentType', value);
    } else if (type === 'genre') {
      setSelectedGenre(value);
      localStorage.setItem('selectedGenre', value);
    }

    setActiveFilters(prev => [
      ...prev.filter(f => f.type !== type),
      { type, value }
    ]);
  };

  // Eliminar filtro
  const removeFilter = (index) => {
    const filter = activeFilters[index];
    if (filter.type === 'contentType') setContentType('all');
    if (filter.type === 'genre') setSelectedGenre('all');
    setActiveFilters(prev => prev.filter((_, i) => i !== index));
  };

  // Acciones
  const handleRandomize = () => {
    setRandomContent(allContent[Math.floor(Math.random() * allContent.length)]);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `Mirá: ${randomContent.title || randomContent.name}`,
        text: randomContent.overview?.substring(0, 100),
        url: window.location.href
      });
    } else {
      setShowShareMenu(true);
    }
  };

  const handleOpenNetflix = () => {
    const title = encodeURIComponent(randomContent.title || randomContent.name);
    window.open(`https://www.netflix.com/search?q=${title}`, '_blank');
  };

  if (loading) return <div className="loading">Cargando recomendaciones...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!randomContent) return <div className="error">No hay contenido disponible</div>;

  return (
    <div className="netflix-content-container">
      <h2>{randomTitle}</h2>

      <div className="content-card">
        {/* Filtros */}
        <Suspense fallback={<div>Cargando filtros...</div>}>
          <FilterButton
            activeFilters={activeFilters}
            contentGenres={contentGenres}
            onRemoveFilter={removeFilter}
            onToggleFilters={() => setShowFilters(!showFilters)}
            showFilters={showFilters}
          />

          <FilterDropdown
            contentType={contentType}
            selectedGenre={selectedGenre}
            genres={
              contentType === 'movie' 
                ? contentGenres.filter(g => g.type === 'movie' || g.type === 'both')
                : contentType === 'tv' 
                  ? contentGenres.filter(g => g.type === 'tv' || g.type === 'both')
                  : contentGenres
            }
            onContentTypeChange={(value) => handleFilters('contentType', value)}
            onGenreChange={(value) => handleFilters('genre', value)}
            showFilters={showFilters}
          />
        </Suspense>

        {/* Overlay para cerrar filtros */}
        {showFilters && (
          <div 
            className="filter-overlay" 
            onClick={() => setShowFilters(false)}
          />
        )}

        {/* Contenido principal */}
        <Suspense fallback={<div>Cargando contenido...</div>}>
          <div className="content-wrapper">
            <div className="content-image">
              <img 
                src={`https://image.tmdb.org/t/p/w500${randomContent.poster_path}`} 
                alt={randomContent.title || randomContent.name} 
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/300x450?text=Imagen+no+disponible';
                  e.target.alt = 'Imagen no disponible';
                }}
              />
            </div>

            <div className="content-details">
              <h2 className="content-title">{randomContent.title || randomContent.name}</h2>
              
              <div className="description-container">
                <p className={`content-description ${showFullDescription ? 'expanded' : ''}`}>
                  {randomContent.overview || 'Descripción no disponible.'}
                </p>
                {randomContent.overview?.length > 200 && (
                  <button
                    className="see-description-btn"
                    onClick={() => setShowFullDescription(!showFullDescription)}
                  >
                    {showFullDescription ? 'Mostrar menos ▲' : 'Mostrar más ▼'}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Botones de acción */}
          <div className="content-actions-container">
            <ContentActions
              onShare={handleShare}
              onNetflix={handleOpenNetflix}
              onRandomize={handleRandomize}
            />
          </div>
        </Suspense>
      </div>

      {/* Menú de compartir */}
      {showShareMenu && (
        <ShareMenu 
          content={randomContent} 
          onClose={() => setShowShareMenu(false)} 
        />
      )}
    </div>
  );
}

export default NetflixContent;