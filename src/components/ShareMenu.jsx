import React, { useState } from 'react';
import { FaWhatsapp, FaTelegram, FaTwitter, FaFacebook, FaLink, FaTimes } from 'react-icons/fa';
import '../ShareMenu.css';

function ShareMenu({ content, onClose }) {
  const [copied, setCopied] = useState(false);
  
  const shareData = {
    title: content.title ? `Película: ${content.title}` : `Serie: ${content.name}`,
    text: `Te recomiendo ver "${content.title || content.name}" en Netflix. ${content.overview?.substring(0, 100)}...`,
    url: window.location.href
  };

  const shareOn = (platform) => {
    let url = '';
    const encodedText = encodeURIComponent(shareData.text);
    const encodedUrl = encodeURIComponent(shareData.url);
    
    switch(platform) {
      case 'whatsapp':
        url = `https://wa.me/?text=${encodedText}%20${encodedUrl}`;
        break;
      case 'telegram':
        url = `https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`;
        break;
      case 'twitter':
        url = `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`;
        break;
      case 'facebook':
        url = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
        break;
      default:
        break;
    }
    
    window.open(url, '_blank', 'width=600,height=400');
  };

  const copyLink = () => {
    navigator.clipboard.writeText(shareData.url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="share-menu-overlay">
      <div className="share-menu-container">
        <button className="close-btn" onClick={onClose}>
          <FaTimes />
        </button>
        <h3>Compartir recomendación</h3>
        <div className="share-options">
          <button onClick={() => shareOn('whatsapp')} className="share-option">
            <FaWhatsapp className="whatsapp-icon" />
            <span>WhatsApp</span>
          </button>
          <button onClick={() => shareOn('telegram')} className="share-option">
            <FaTelegram className="telegram-icon" />
            <span>Telegram</span>
          </button>
          <button onClick={() => shareOn('twitter')} className="share-option">
            <FaTwitter className="twitter-icon" />
            <span>Twitter</span>
          </button>
          <button onClick={() => shareOn('facebook')} className="share-option">
            <FaFacebook className="facebook-icon" />
            <span>Facebook</span>
          </button>
          <button onClick={copyLink} className="share-option">
            <FaLink className="link-icon" />
            <span>{copied ? '¡Copiado!' : 'Copiar enlace'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default ShareMenu;