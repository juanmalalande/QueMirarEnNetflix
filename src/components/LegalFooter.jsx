import React from 'react';
import LegalModal from './LegalModal.jsx';
import '../LegalFooter.css';

function LegalFooter() {
  return (
    <footer className="legal-footer">
      <div className="footer-content">
        <div className="tmdb-attribution">
          <p>Powered by</p>
          <a href="https://www.themoviedb.org/" target="_blank" rel="noopener noreferrer">
            <img 
              src="https://www.themoviedb.org/assets/2/v4/logos/v2/blue_square_2-d537fb228cf3ded904ef09b136fe3fec72548ebc1fea3fbbd1ad9e36364db38b.svg" 
              alt="The Movie Database" 
              width="60"
            />
          </a>
        </div>
       {/*} <p>
          © {new Date().getFullYear()} Recomendaciones de contenido en streaming. 
        </p>*/}
        <p>
        Este sitio no está afiliado a Netflix ni a ninguna otra plataforma mencionada.
        </p>
        <div className="legal-links">
          <LegalModal type="privacy" />
          <LegalModal type="terms" />
        </div>
      </div>
    </footer>
  );
}

export default LegalFooter;