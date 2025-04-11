import React from 'react';
import '../LegalFooter.css'; // Archivo de estilos (te paso el CSS después)

function LegalFooter() {
  return (
    <footer className="legal-footer">
      <div className="footer-content">
        <p>
          © {new Date().getFullYear()} Recomendaciones de contenido en streaming. 
          Este sitio no está afiliado a Netflix ni a ninguna otra plataforma mencionada.
        </p>
        <div className="tmdb-attribution">
          <p>Datos proporcionados por:</p>
          <a href="https://www.themoviedb.org/" target="_blank" rel="noopener noreferrer">
            <img 
              src="https://www.themoviedb.org/assets/2/v4/logos/v2/blue_square_2-d537fb228cf3ded904ef09b136fe3fec72548ebc1fea3fbbd1ad9e36364db38b.svg" 
              alt="The Movie Database" 
              width="120"
            />
          </a>
        </div>
        <div className="legal-links">
          <a href="/politica-de-privacidad">Política de Privacidad</a>
          <a href="/terminos-de-uso">Términos de Servicio</a>
        </div>
      </div>
    </footer>
  );
}

export default LegalFooter;