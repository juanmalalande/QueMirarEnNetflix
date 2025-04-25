import './App.css';
import NetflixContent from './components/NetflixContent';
import LegalFooter from './components/LegalFooter';

function App() {  
  return (
    <div className="app-container">
      <h1>¿Qué mirar en Netflix hoy?</h1>
      <NetflixContent />
      <LegalFooter />
    </div>
  );

}

export default App;