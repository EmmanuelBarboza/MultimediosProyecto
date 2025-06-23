import React from 'react';
import './App.css';
import { Routes, Route, Link, NavLink, useLocation } from 'react-router-dom';

// Importar los componentes de página
import UsuarioPage from './components/usuario/UsuarioPage';
import CategoriaPage from './components/categoria/CategoriaPage';
import IngredientePage from './components/ingrediente/IngredientePage';
import PlatilloPage from './components/platillo/PlatilloPage';
import RolPage from './components/rol/RolPage';

function App() {
  const location = useLocation();
  const isActiveRoute = (path) => location.pathname === path;

  return (
    <div className="app-container">
      {/* Sidebar Navigation */}
      <div className="sidebar">
        <div className="sidebar-header">
          <Link to="/" className="brand-logo">
            <span className="logo-icon">🍽️</span>
            <span className="brand-name">Sabores del Chef</span>
          </Link>
        </div>
        
        <nav className="sidebar-nav">
          <NavLink 
            to="/platillos" 
            className={`nav-item ${isActiveRoute('/platillos') ? 'active' : ''}`}
          >
            <span className="nav-icon">🍲</span>
            <span className="nav-text">Menú</span>
          </NavLink>
          
          <NavLink 
            to="/categorias" 
            className={`nav-item ${isActiveRoute('/categorias') ? 'active' : ''}`}
          >
            <span className="nav-icon">📋</span>
            <span className="nav-text">Categorías</span>
          </NavLink>
          
          <NavLink 
            to="/ingredientes" 
            className={`nav-item ${isActiveRoute('/ingredientes') ? 'active' : ''}`}
          >
            <span className="nav-icon">🥕</span>
            <span className="nav-text">Ingredientes</span>
          </NavLink>
          
          <NavLink 
            to="/usuarios" 
            className={`nav-item ${isActiveRoute('/usuarios') ? 'active' : ''}`}
          >
            <span className="nav-icon">👨‍🍳</span>
            <span className="nav-text">Personal</span>
          </NavLink>
          
          <NavLink 
            to="/roles" 
            className={`nav-item ${isActiveRoute('/roles') ? 'active' : ''}`}
          >
            <span className="nav-icon">🔑</span>
            <span className="nav-text">Roles</span>
          </NavLink>
        </nav>
        
        <div className="sidebar-footer">
          <button className="orders-btn">
            <span className="orders-icon">🛒</span>
            <span className="orders-text">Órdenes</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="main-content">
        <header className="content-header">
          <h1 className="page-title">
            {isActiveRoute('/platillos') && 'Menú de Platillos'}
            {isActiveRoute('/categorias') && 'Categorías'}
            {isActiveRoute('/ingredientes') && 'Ingredientes'}
            {isActiveRoute('/usuarios') && 'Personal'}
            {isActiveRoute('/roles') && 'Roles'}
          </h1>
          <div className="user-profile">
            <span className="user-avatar">👨‍💼</span>
            <span className="user-name">Administrador</span>
          </div>
        </header>
        
        <div className="content-container">
          <Routes>
            <Route path="/" element={<PlatilloPage />} /> 
            <Route path="/usuarios" element={<UsuarioPage />} />
            <Route path="/categorias" element={<CategoriaPage />} />
            <Route path="/ingredientes" element={<IngredientePage />} />
            <Route path="/platillos" element={<PlatilloPage />} />
            <Route path="/roles" element={<RolPage />} />
            <Route path="*" element={
              <div className="not-found-container">
                <div className="not-found-content">
                  <h1 className="error-code">404</h1>
                  <h2 className="error-title">Página no encontrada</h2>
                  <p className="error-message">El platillo que buscas no está en nuestro menú</p>
                  <Link to="/" className="home-btn">
                    Volver al Menú Principal
                  </Link>
                </div>
              </div>
            } />
          </Routes>
        </div>
        
        <footer className="content-footer">
          <div className="footer-content">
            <p className="copyright">
              © {new Date().getFullYear()} Sabores del Chef. Todos los derechos reservados.
            </p>
            <div className="footer-links">
              <a href="#!" className="footer-link">Términos</a>
              <a href="#!" className="footer-link">Privacidad</a>
              <a href="#!" className="footer-link">Contacto</a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App;