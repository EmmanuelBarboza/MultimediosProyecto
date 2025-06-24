import React from 'react';
import ReactDOM from 'react-dom/client'; // Importa la creación del root desde react-dom/client
import { BrowserRouter } from 'react-router-dom'; // Para la navegación
import 'bootstrap/dist/css/bootstrap.min.css'; // Importa los estilos de Bootstrap
import App from './App.jsx'; // Importa el componente principal de la app

// Crea el root de la aplicación usando React 18+
const root = ReactDOM.createRoot(document.getElementById('root'));

// Renderiza el componente dentro del root
root.render(
  <React.StrictMode>
    {/* El BrowserRouter debe envolver toda la aplicación para la navegación */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
