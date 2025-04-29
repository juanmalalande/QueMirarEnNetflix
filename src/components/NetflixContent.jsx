import React, { useState, useEffect, Suspense, lazy } from 'react';
import axios from 'axios';
import '../NetflixContent.css';
import { contentGenres } from './contentGenres';
import { seriesGenres } from './seriesGenres';
import ShareMenu from './ShareMenu';


const FilterButton = lazy(() => import('./FilterButton'));
const FilterDropdown = lazy(() => import('./FilterDropdown'));
const ContentCard = lazy(() => import('./ContentCard'));
const ContentActions = lazy(() => import('./ContentActions'));

function NetflixContent() {
 
  const [randomContent, setRandomContent] = useState(null);
  const [allContent, setAllContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [randomTitle, setRandomTitle] = useState('');

  const [showFullDescription, setShowFullDescription] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [shouldResetFilters, setShouldResetFilters] = useState(false);

  const [contentType, setContentType] = useState(() => 
    localStorage.getItem('contentType') || 'all'
  );
  const [selectedGenre, setSelectedGenre] = useState(() => 
    localStorage.getItem('selectedGenre') || 'all'
  );
  const [activeFilters, setActiveFilters] = useState([]);

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
}, []);

useEffect(() => {
  const fetchContentDetails = async () => {
    if (!randomContent) return;
    
    try {
      const type = randomContent.media_type || (randomContent.title ? 'movie' : 'tv');
      const response = await axios.get(
        `https://api.themoviedb.org/3/${type}/${randomContent.id}`,
        {
          params: {
            api_key: process.env.REACT_APP_TMDB_API_KEY,
            language: 'es-AR'
          }
        }
      );
      setRandomContent(prev => ({ ...prev, ...response.data }));
    } catch (error) {
      console.error("Error fetching details:", error);
    }
  };

  fetchContentDetails();
}, [randomContent?.id]); 

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

 
  const removeFilter = (index) => {
    const filter = activeFilters[index];
    if (filter.type === 'contentType') setContentType('all');
    if (filter.type === 'genre') setSelectedGenre('all');
    setActiveFilters(prev => prev.filter((_, i) => i !== index));
  };


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
      setShouldResetFilters(true); 
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
          contentGenres={[...contentGenres, ...seriesGenres]}
          onRemoveFilter={removeFilter}
          onToggleFilters={() => setShowFilters(!showFilters)}
          showFilters={showFilters}
        />


          <FilterDropdown            
            contentType={contentType}
            selectedGenre={selectedGenre}
            genres={contentGenres} 
            onContentTypeChange={(value) => handleFilters('contentType', value)}
            onGenreChange={(value) => handleFilters('genre', value)}
            showFilters={showFilters}
          />
        </Suspense>

        {showFilters && (
          <div 
            className="filter-overlay" 
            onClick={() => setShowFilters(false)}
          />
        )}


<Suspense fallback={<div>Cargando contenido...</div>}>
  <ContentCard 
    content={randomContent}
    showFullDescription={showFullDescription}
    onToggleDescription={() => setShowFullDescription(!showFullDescription)}
    genres={contentType === 'movie' ? contentGenres : seriesGenres}
  />

  <div className="content-actions-container">
    <ContentActions
      onShare={handleShare}
      onNetflix={handleOpenNetflix}
      onRandomize={handleRandomize}
    />
  </div>
</Suspense>

      </div>

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