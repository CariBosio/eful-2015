import React from 'react';
import { efulPlantel } from '../data/jugadores';

const players = [
  { id: 10, name: "Matías Gómez", pos: "Delantero", number: "10" },
  { id: 1, name: "Lucas Benítez", pos: "Arquero", number: "1" },
];

export default function Plantel() {
  return (
    <div>
      <h2 className="section-title">Plantel EFUL 2015 - Mundialito</h2>
      <div className="grid-cards">
        {efulPlantel.map((jugador) => (
          <div key={jugador.id} className="card">
            <div style={{ backgroundColor: 'var(--primary)', height: '40px', color: 'white', padding: '0.75rem 1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: 'bold' }}>{jugador.nombre}</span>
              <span style={{ backgroundColor: 'white', color: 'var(--primary)', fontWeight: 'extrabold', padding: '0.2rem 0.5rem', borderRadius: '9999px', fontSize: '0.8rem' }}>
                #{jugador.dorsal}
              </span>
            </div>
            <div style={{ padding: '1.25rem', textAlign: 'center' }}>
              <div style={{ width: '80px', height: '80px', margin: '0 auto 0.75rem auto', backgroundColor: '#e2e8f0', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', fontWeight: 'bold', fontSize: '0.8rem' }}>
                FOTO
              </div>
              <p style={{ margin: 0, color: 'var(--text-muted)', fontWeight: 600 }}>{jugador.posicion}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}