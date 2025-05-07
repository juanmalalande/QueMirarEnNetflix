/*import './App.css';
import NetflixContent from './components/NetflixContent';
import LegalFooter from './components/LegalFooter';

function App() {  
  return (
    <div className="app-container">
      <h1>¿Qué mirar en Netflix hoy?</h1>
      <NetflixContent />    
      <LegalFooter />          
    <h5>
      creado por <a href='mailto:juanmalalande@gmail.com'>Juanma</a>
    </h5>
    </div>
    
    
  );

}

export default App;*/

import './App.css';
import NetflixContent from './components/NetflixContent';
import LegalFooter from './components/LegalFooter';
import { useEffect } from 'react';

function App() {
  // Cargar Adsense (opcional)
  useEffect(() => {
    if (window.adsbygoogle) {
      window.adsbygoogle.push({});
    }
  }, []);

  return (
    <div className="app-container">
      <h1>¿Qué mirar en Netflix hoy?</h1>
      
      <div className="content-wrapper">
        <main className="main-content">
          <NetflixContent />
        </main>
        
        <aside className="desktop-ads">
          <div className="ad-unit">
            {/* Ad unit para desktop */}
            <ins className="adsbygoogle"
              style={{display: 'block'}}
              data-ad-client="ca-pub-4917886951586506"
              data-ad-slot="2795455190"
              data-ad-format="auto"></ins>
          </div>
        </aside>
      </div>
      
      <div className="mobile-ads">
        <div className="ad-unit">
          {/* Ad unit para móvil */}
          <ins className="adsbygoogle"
            style={{display: 'block'}}
            data-ad-client="ca-pub-4917886951586506"
            data-ad-slot="4065973131"
            data-ad-format="auto"></ins>
        </div>
      </div>
      
      <LegalFooter />
      <h5>
      creado por <a href='mailto:juanmalalande@gmail.com'>Juanma</a>
    </h5>
    </div>
  );
}

export default App;