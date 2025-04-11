import React, { useState, useEffect, Suspense, lazy } from 'react';
import axios from 'axios';
import '../NetflixContent.css';
import { contentGenres } from './contentGenres';
import { seriesGenres } from './seriesGenres';
import ShareMenu from './ShareMenu';


// Carga diferida de componentes
const FilterButton = lazy(() => import('./FilterButton'));
const FilterDropdown = lazy(() => import('./FilterDropdown'));
//const ContentCard = lazy(() => import('./ContentCard'));
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
  const [shouldResetFilters, setShouldResetFilters] = useState(false);

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

  useEffect(() => {
    if (shouldResetFilters) {
      const timer = setTimeout(() => {
        setContentType('all');
        setSelectedGenre('all');
        setActiveFilters([]);
        setRandomContent(allContent[Math.floor(Math.random() * allContent.length)]);
        setShouldResetFilters(false);
      }, 1000);
  
      return () => clearTimeout(timer);
    }
  }, [shouldResetFilters, allContent]);

   useEffect(() => {
    const fetchNetflixContent = async () => {
      try {
        setLoading(true);
        
        const params = {
          api_key: process.env.REACT_APP_TMDB_API_KEY,
          with_watch_providers: 8,
          watch_region: 'AR',
          language: 'es-AR',
          ...(selectedGenre !== 'all' && { with_genres: selectedGenre })
        };
  
        const [movieResponse, tvResponse] = await Promise.all([
          contentType !== 'tv' ? axios.get('https://api.themoviedb.org/3/discover/movie', { params }) : Promise.resolve({ data: { results: [] } }),
          contentType !== 'movie' ? axios.get('https://api.themoviedb.org/3/discover/tv', { params }) : Promise.resolve({ data: { results: [] } })
        ]);
  
        const combined = [...movieResponse.data.results, ...tvResponse.data.results];
        setAllContent(combined);
        setRandomContent(combined[Math.floor(Math.random() * combined.length)]);
  
      } catch (err) {
        setError('Error al cargar contenido');
        console.error("Error en API:", err);
      } finally {
        setLoading(false);
      }
    };
  
    fetchNetflixContent();
  }, [contentType, selectedGenre]);

// Carga los filtros activos desde localStorage al montar el componente
useEffect(() => {
  const savedContentType = localStorage.getItem('contentType');
  const savedGenre = localStorage.getItem('selectedGenre');

  if (savedContentType && savedContentType !== 'null') {
    setActiveFilters(prev => [
      ...prev.filter(f => f.type !== 'contentType'),
      { type: 'contentType', value: savedContentType }
    ]);
  }

  if (savedGenre && savedGenre !== 'null' && savedGenre !== 'all') {
    setActiveFilters(prev => [
      ...prev.filter(f => f.type !== 'genre'),
      { type: 'genre', value: savedGenre }
    ]);
  }
}, []); // <- Array vacío para que solo se ejecute al montar

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
   if (!randomContent || shouldResetFilters) {
    if (!shouldResetFilters) {
      setShouldResetFilters(true); // Activa el reset
    }
    return (
      <div className="error">
        <p>No hay contenido con esos filtros. Reiniciando...</p>
      </div>
    );
  }
  

  return (
    <div className="netflix-content-container">
      <h2>{randomTitle}</h2>

      <div className="content-card">
        <Suspense fallback={<div>Cargando filtros...</div>}>
        <FilterButton
          activeFilters={activeFilters}
          contentGenres={[...contentGenres, ...seriesGenres]} // Pasa todos los géneros
          onRemoveFilter={removeFilter}
          onToggleFilters={() => setShowFilters(!showFilters)}
          showFilters={showFilters}
        />


          <FilterDropdown            
            contentType={contentType}
            selectedGenre={selectedGenre}
            genres={contentGenres} // Envía todos los géneros directamente
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