import React, { useState } from 'react';
import '../LegalModal.css';

const LegalModal = ({ type }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const content = {
    privacy: {
      title: "Política de Privacidad",
      url: `${process.env.PUBLIC_URL}/Legal/PrivacyPolicy.html`
    },
    terms: {
      title: "Términos y Condiciones",
      url: `${process.env.PUBLIC_URL}/Legal/TermsConditions.html`
    }
  };

  return (
    <>
      <button 
        className="legal-link" 
        onClick={() => setIsOpen(true)}
      >
        {content[type].title}
      </button>

      {isOpen && (
        <div className="modal-overlay" onClick={() => setIsOpen(false)}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{content[type].title}</h3>
              <button 
                className="close-button"
                onClick={() => setIsOpen(false)}
                aria-label="Cerrar"
              >
                ×
              </button>
            </div>
            <iframe 
              src={content[type].url} 
              title={content[type].title}
              className="legal-iframe"
              loading="lazy"
            />
          </div>
        </div>
      )}
    </>
  );
};

export default LegalModal;
      