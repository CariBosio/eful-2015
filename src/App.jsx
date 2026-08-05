import React, { useState } from 'react';
import Fixture from './components/Fixture';
import Plantel from './components/Plantel';
import './index.css';

export default function App() {
  const [tab, setTab] = useState('fixture');

  return (
    <div className="app-container">
      <header className="header">
        <h1>EFUL Categoría 2015</h1>
        <p>Mundialito de Invierno 2026 - El Norte</p>
      </header>

      <nav className="nav">
        <button 
          onClick={() => setTab('fixture')}
          className={`nav-btn ${tab === 'fixture' ? 'active' : ''}`}
        >
          📅 Fixture & Resultados
        </button>
        <button 
          onClick={() => setTab('plantel')}
          className={`nav-btn ${tab === 'plantel' ? 'active' : ''}`}
        >
          ⭐ Plantel Oficial
        </button>
      </nav>

      <main className="main-content">
        {tab === 'fixture' ? <Fixture /> : <Plantel />}
      </main>
    </div>
  );
}