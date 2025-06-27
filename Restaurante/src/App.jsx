import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Routes, Route, NavLink, useLocation } from 'react-router-dom';

// Importar los componentes de página
import UsuarioPage from './components/usuario/UsuarioPage';
import CategoriaPage from './components/categoria/CategoriaPage';
import IngredientePage from './components/ingrediente/IngredientePage';
import PlatilloPage from './components/platillo/PlatilloPage';
import RolPage from './components/rol/RolPage';
import HistoriaPedidoPage from './components/historial_pedido/HistorialPedidoPage';
import HistorialInventarioPage from './components/historial_inventario/HistorialInventarioPage';
import ReservacionPage from './components/reservacion/ReservacionPage';
import ClientePage from './components/cliente/ClientePage';
import MesaPage from './components/mesa/MesaPage';

function App() {
  const location = useLocation();
  const isActiveRoute = (path) => location.pathname === path;

  return (
    <div className="container-fluid">
      <div className="row">
        {/* Sidebar de navegación */}
        <div className="col-12 col-md-3 col-lg-2 bg-primary text-white p-3 shadow-lg border-right" style={{ minHeight: '100vh' }}>
          <div className="mb-4 text-center">
            <h3 className="font-weight-bold text-uppercase text-shadow">Sabores del Chef</h3>
          </div>
          <nav className="nav flex-column">
            <NavLink
              to="/reservacion"
              className={`nav-link p-3 mb-2 rounded ${isActiveRoute('/reservacion') ? 'bg-secondary' : 'bg-primary text-white'}`}
            >
              Reservaciones
            </NavLink>
            <NavLink
              to="/usuario"
              className={`nav-link p-3 mb-2 rounded ${isActiveRoute('/usuario') ? 'bg-secondary' : 'bg-primary text-white'}`}
            >
              Usuarios
            </NavLink>

            <NavLink
              to="/cliente"
              className={`nav-link p-3 mb-2 rounded ${isActiveRoute('/cliente') ? 'bg-secondary' : 'bg-primary text-white'}`}
            >
              Clientes
            </NavLink>

            <NavLink
              to="/mesa"
              className={`nav-link p-3 mb-2 rounded ${isActiveRoute('/mesa') ? 'bg-secondary' : 'bg-primary text-white'}`}
            >
              Mesas
            </NavLink>

            <NavLink
              to="/categoria"
              className={`nav-link p-3 mb-2 rounded ${isActiveRoute('/categoria') ? 'bg-secondary' : 'bg-primary text-white'}`}
            >
              Categorías
            </NavLink>
            <NavLink
              to="/ingrediente"
              className={`nav-link p-3 mb-2 rounded ${isActiveRoute('/ingrediente') ? 'bg-secondary' : 'bg-primary text-white'}`}
            >
              Ingredientes
            </NavLink>
            <NavLink
              to="/platillo"
              className={`nav-link p-3 mb-2 rounded ${isActiveRoute('/platillo') ? 'bg-secondary' : 'bg-primary text-white'}`}
            >
              Platillos
            </NavLink>
            <NavLink
              to="/rol"
              className={`nav-link p-3 mb-2 rounded ${isActiveRoute('/rol') ? 'bg-secondary' : 'bg-primary text-white'}`}
            >
              Roles
            </NavLink>

            <NavLink
              to="/historial_pedido"
              className={`nav-link p-3 mb-2 rounded ${isActiveRoute('/historial_pedido') ? 'bg-secondary' : 'bg-primary text-white'}`}
            >
              Historial de Pedidos
            </NavLink>

             <NavLink
              to="/historial_inventario"
              className={`nav-link p-3 mb-2 rounded ${isActiveRoute('/historial_inventario') ? 'bg-secondary' : 'bg-primary text-white'}`}
            >
              Historial del Inventario
            </NavLink>
          </nav>
        </div>

        {/* Área de contenido */}
        <div className="col-12 col-md-9 col-lg-10 p-4">
          <div className="rounded shadow-lg p-4" style={{ backgroundColor: '#f8f9fa' }}>
            <Routes>
              <Route path="/reservacion" element={<ReservacionPage />} />
              <Route path="/usuario" element={<UsuarioPage />} />
              <Route path="/categoria" element={<CategoriaPage />} />
              <Route path="/ingrediente" element={<IngredientePage />} />
              <Route path="/platillo" element={<PlatilloPage />} />
              <Route path="/rol" element={<RolPage />} />
              <Route path="/historial_pedido" element={<HistoriaPedidoPage />} />
              <Route path="/historial_inventario" element={<HistorialInventarioPage />} />
              <Route path="/cliente" element={<ClientePage />} />
              <Route path="/mesa" element={<MesaPage />} />
            </Routes>
          </div>
        </div>
      </div>

      {/* Botón para abrir/ocultar el menú en dispositivos móviles */}
      <button
        className="btn btn-dark d-md-none position-fixed bottom-0 end-0 m-3 rounded-circle shadow-lg"
        style={{ zIndex: 9999, width: '60px', height: '60px', fontSize: '24px' }}
        data-bs-toggle="offcanvas"
        data-bs-target="#offcanvasMenu"
        aria-controls="offcanvasMenu"
      >
        ☰
      </button>

      {/* Offcanvas (menú lateral en móviles) */}
      <div className="offcanvas offcanvas-start bg-primary text-white" tabIndex="-1" id="offcanvasMenu" aria-labelledby="offcanvasMenuLabel">
        <div className="offcanvas-header">
          <h5 id="offcanvasMenuLabel" className="font-weight-bold text-uppercase">Sabores del Chef</h5>
          <button type="button" className="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
        </div>
        <div className="offcanvas-body">
          <nav className="nav flex-column">
            <NavLink
              to="/reservacion"
              className={`nav-link p-3 mb-2 rounded ${isActiveRoute('/reservacion') ? 'bg-secondary' : 'bg-primary text-white'}`}
            >
              Reservaciones
            </NavLink>
            <NavLink
              to="/usuario"
              className={`nav-link p-3 mb-2 rounded ${isActiveRoute('/usuario') ? 'bg-secondary' : 'bg-primary text-white'}`}
            >
              Usuarios
            </NavLink>

            <NavLink
              to="/cliente"
              className={`nav-link p-3 mb-2 rounded ${isActiveRoute('/cliente') ? 'bg-secondary' : 'bg-primary text-white'}`}
            >
              Clientes
            </NavLink>

            <NavLink
              to="/mesa"
              className={`nav-link p-3 mb-2 rounded ${isActiveRoute('/mesa') ? 'bg-secondary' : 'bg-primary text-white'}`}
            >
              Mesas
            </NavLink>

            <NavLink
              to="/categoria"
              className={`nav-link p-3 mb-2 rounded ${isActiveRoute('/categoria') ? 'bg-secondary' : 'bg-primary text-white'}`}
            >
              Categorías
            </NavLink>
            <NavLink
              to="/ingrediente"
              className={`nav-link p-3 mb-2 rounded ${isActiveRoute('/ingrediente') ? 'bg-secondary' : 'bg-primary text-white'}`}
            >
              Ingredientes
            </NavLink>
            <NavLink
              to="/platillo"
              className={`nav-link p-3 mb-2 rounded ${isActiveRoute('/platillo') ? 'bg-secondary' : 'bg-primary text-white'}`}
            >
              Platillos
            </NavLink>
            <NavLink
              to="/rol"
              className={`nav-link p-3 mb-2 rounded ${isActiveRoute('/rol') ? 'bg-secondary' : 'bg-primary text-white'}`}
            >
              Roles
            </NavLink>

            <NavLink
              to="/historial_pedido"
              className={`nav-link p-3 mb-2 rounded ${isActiveRoute('/historial_pedido') ? 'bg-secondary' : 'bg-primary text-white'}`}
            >
              Historial de Pedidos
            </NavLink>

             <NavLink
              to="/historial_inventario"
              className={`nav-link p-3 mb-2 rounded ${isActiveRoute('/historial_inventario') ? 'bg-secondary' : 'bg-primary text-white'}`}
            >
              Historial del Inventario
            </NavLink>
          </nav>
        </div>
      </div>
    </div>
  );
}

export default App;
