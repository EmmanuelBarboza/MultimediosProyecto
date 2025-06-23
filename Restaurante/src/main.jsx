import React from 'react'
import { createRoot } from 'react-dom/client'
import ReactDOM from 'react-dom/client' //RENDER CLIENTE
import { BrowserRouter } from 'react-router-dom'; //ALGO DE LA NAVEGACIÓN NO SÉ
import './index.css'
import App from './App.jsx'


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* Este es el ÚNICO BrowserRouter que debe haber en tu aplicación */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
);