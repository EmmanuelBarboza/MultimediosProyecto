import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import IngredientePage from './components/ingrediente/IngredientePage';
import { Categoria } from './components/categoria';
import { Platillo } from './components/platillo';

function App() {
  return (
    <div>
      <IngredientePage />
      <Categoria />
      <Platillo />
    </div>
  );
}

export default App
