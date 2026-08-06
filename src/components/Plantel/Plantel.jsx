import React from "react";
import { efulPlantel } from "../../data/jugadores";
import "./Plantel.css";

export default function Plantel() {
  return (
    <div className="plantel-container">
      <h2 className="section-title">Plantel EFUL 2015 - Mundialito</h2>
      <div className="grid-cards">
        {efulPlantel.map((jugador) => (
          <div key={jugador.id} className="card">
            <div className="card-header">
              <span className="card-nombre">{jugador.nombre}</span>
              <span className="card-dorsal">#{jugador.dorsal}</span>
            </div>
            <div className="card-body">
              <div className="card-avatar">
                {jugador.foto ? (
                  <img
                    src={jugador.foto}
                    alt={jugador.nombre}
                    className="card-img"
                  />
                ) : (
                  "FOTO"
                )}
              </div>
              <p className="card-posicion">{jugador.posicion}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}